import { API_BASE_URL } from './apiConfig.js';

const fallbackProjects = [
  {
    title: 'Rafik AI Agent Orchestrator',
    category: 'AI Automation',
    industry: 'AI Automation',
    summary: 'Multi-agent AI system that automates research, data extraction, analysis, and reporting workflows with human-in-the-loop controls.',
    description: 'A project pattern for AI-assisted research and workflow orchestration. It combines backend APIs, structured storage, model calls, and review steps so automation remains controlled.',
    tags: ['AI automation', 'Agents', 'Research', 'Reports'],
    stack: ['Python', 'FastAPI', 'PostgreSQL'],
    slug: 'rafik-ai-agent-orchestrator'
  },
  {
    title: 'Production Business CRM Platform',
    category: 'CRM',
    industry: 'CRM / Internal Tools',
    summary: 'FastAPI and PostgreSQL backend with public intake, clients, invoices, payments, meetings, notifications, admin authentication, Android CRM, and production deployment.',
    description: 'Internal operations platform connecting quote requests, client records, payments, meetings, invoices, notifications, staff access, Android access, and deployed backend services.',
    tags: ['CRM', 'FastAPI', 'PostgreSQL', 'Android'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Kotlin'],
    slug: 'production-business-crm-platform'
  }
];

const state = { projects: [], project: null };

const els = {
  title: document.getElementById('projectTitle'),
  summary: document.getElementById('projectSummary'),
  industry: document.getElementById('projectIndustry'),
  description: document.getElementById('projectDescription'),
  stack: document.getElementById('projectStack'),
  topics: document.getElementById('projectTopics'),
  meta: document.getElementById('projectMeta'),
  repoLink: document.getElementById('projectRepoLink'),
  related: document.getElementById('relatedProjects'),
  askButton: document.getElementById('projectAskButton'),
  fab: document.getElementById('assistantFab'),
  assistant: document.getElementById('portfolioAssistant'),
  assistantClose: document.getElementById('assistantClose'),
  assistantBody: document.getElementById('assistantBody'),
  assistantForm: document.getElementById('assistantForm'),
  assistantQuestion: document.getElementById('assistantQuestion'),
  assistantProjectLabel: document.getElementById('assistantProjectLabel')
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

function pick(project, keys, fallback = '') {
  for (const key of keys) {
    if (project && project[key] !== undefined && project[key] !== null && String(project[key]).trim() !== '') return project[key];
  }
  return fallback;
}

function cleanDisplayTitle(value) {
  return String(value ?? '')
    .replace(/[\u200d\ufe0f]/g, '')
    .replace(/[\u2600-\u27bf]/g, '')
    .replace(/[\u{1f000}-\u{1faff}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeProject(project, index) {
  const topics = toArray(pick(project, ['topics', 'tags', 'keywords'], []));
  const stack = toArray(pick(project, ['stack', 'technologies', 'tech_stack'], []));
  const category = String(pick(project, ['category', 'topic', 'domain'], topics[0] || 'Backend/API'));
  const sourceTitle = String(pick(project, ['title', 'name', 'repo', 'repository'], `Project ${index + 1}`));
  const title = cleanDisplayTitle(sourceTitle) || sourceTitle;
  const slug = String(pick(project, ['slug', 'repo', 'id'], slugify(sourceTitle)));
  const summary = String(pick(project, ['summary', 'problem', 'readme_summary'], 'Portfolio record imported from project README.'));
  const description = String(pick(project, ['description', 'details', 'readme', 'notes'], summary));

  return {
    id: String(pick(project, ['id'], slug)),
    slug,
    title,
    sourceTitle,
    category,
    industry: String(pick(project, ['industry', 'sector', 'category'], category)),
    summary,
    description,
    topics: [...new Set(topics.filter(Boolean))],
    tags: [...new Set([...topics, ...stack].filter(Boolean))].slice(0, 8),
    stack,
    repoName: String(pick(project, ['repo_name', 'repoName', 'repo'], '')),
    repoUrl: String(pick(project, ['repo_url', 'repoUrl', 'url'], '')),
    status: String(pick(project, ['status'], 'production')),
    visibility: String(pick(project, ['visibility'], 'public')),
    featured: Boolean(project.featured || index === 0)
  };
}

function projectDetailUrl(project) {
  return `project.html?project=${encodeURIComponent(project.slug || project.id)}`;
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/portfolio/projects?limit=200`, { credentials: 'omit' });
  if (!response.ok) throw new Error(`Portfolio API ${response.status}`);
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.items || data.projects || data.records || []);
  return list.map(normalizeProject);
}

function selectedProjectSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('project') || params.get('slug') || window.location.hash.replace(/^#/, '');
}

function findProject(projects, slug) {
  const clean = slugify(slug);
  if (!clean) return null;
  return projects.find((project) => (
    slugify(project.slug) === clean ||
    slugify(project.id) === clean ||
    slugify(project.title) === clean ||
    slugify(project.sourceTitle) === clean ||
    slugify(project.repoName) === clean
  ));
}

function renderTags(container, items, emptyText) {
  const values = items.filter(Boolean);
  container.innerHTML = values.length
    ? values.map((item) => `<span>${escapeHtml(item)}</span>`).join('')
    : `<p class="empty-state">${escapeHtml(emptyText)}</p>`;
}

function splitSentences(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24) || [];
}

function pickSentences(sentences, keywords, limit = 5) {
  const selected = [];
  const seen = new Set();
  for (const sentence of sentences) {
    const lowered = sentence.toLowerCase();
    if (!keywords.some((keyword) => lowered.includes(keyword))) continue;
    const key = lowered.slice(0, 90);
    if (seen.has(key)) continue;
    selected.push(sentence);
    seen.add(key);
    if (selected.length >= limit) break;
  }
  return selected;
}

function renderList(items) {
  if (!items.length) return '';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderDescription(project) {
  const details = String(project.description || project.summary || '').trim();
  const sentences = splitSentences(details);
  const overview = sentences.slice(0, 3).join(' ') || project.summary;
  const workflow = pickSentences(sentences, [
    'extract',
    'collect',
    'navigate',
    'open',
    'load',
    'scroll',
    'normalize',
    'detect',
    'match',
    'update',
    'generate',
    'automate',
    'workflow',
    'supports',
  ], 6);
  const technical = pickSentences(sentences, [
    'technically',
    'python',
    'playwright',
    'fastapi',
    'beautifulsoup',
    'pandas',
    'requests',
    'ollama',
    'openai',
    'postgresql',
    'api',
    'browser',
    'llm',
  ], 5);
  const outputs = pickSentences(sentences, [
    'csv',
    'json',
    'export',
    'records',
    'dataset',
    'dashboard',
    'report',
    'notification',
    'crm',
    'spreadsheet',
  ], 5);
  const stack = project.stack.length
    ? `<div class="project-tags detail-tags">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
    : '<p class="empty-state">Stack data is not listed for this project.</p>';

  els.description.innerHTML = `
    <section class="project-copy-section">
      <h2>What it solves</h2>
      <p>${escapeHtml(overview)}</p>
    </section>
    <section class="project-copy-section">
      <h2>Workflow and features</h2>
      ${renderList(workflow.length ? workflow : [project.summary])}
    </section>
    <section class="project-copy-section">
      <h2>Stack and libraries</h2>
      ${stack}
      ${technical.length ? renderList(technical) : ''}
    </section>
    ${outputs.length ? `
      <section class="project-copy-section">
        <h2>Outputs and delivery</h2>
        ${renderList(outputs)}
      </section>
    ` : ''}
  `;
}

function renderRelated(project) {
  const projectText = `${project.industry} ${project.category} ${project.topics.join(' ')} ${project.stack.join(' ')}`.toLowerCase();
  const related = state.projects
    .filter((item) => item.slug !== project.slug)
    .map((item) => {
      const itemText = `${item.industry} ${item.category} ${item.topics.join(' ')} ${item.stack.join(' ')}`.toLowerCase();
      const score = projectText.split(/\s+/).filter((word) => word.length > 3 && itemText.includes(word)).length;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);

  els.related.innerHTML = related.length
    ? related.map((item) => {
      const detailUrl = projectDetailUrl(item);
      return `
      <article class="project-card" data-project-url="${escapeHtml(detailUrl)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(item.title)} project page">
        <div class="project-head">
          <div class="project-icon">${escapeHtml(item.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'TE')}</div>
          <div>
            <p class="project-industry">${escapeHtml(item.industry)}</p>
            <h2>${escapeHtml(item.title)}</h2>
          </div>
        </div>
        <p>${escapeHtml(item.summary)}</p>
        <div class="project-tags">${(item.tags.length ? item.tags : item.stack).slice(0, 5).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <a class="project-link" href="${escapeHtml(detailUrl)}">Open project -></a>
      </article>
    `;
    }).join('')
    : '<p class="empty-state">No related project records found.</p>';
}

function renderProject(project) {
  state.project = project;
  document.title = `TrkElnIt Portfolio | ${project.title}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', project.summary.slice(0, 155));

  els.title.textContent = project.title;
  els.summary.textContent = project.summary;
  els.industry.textContent = project.industry;
  els.assistantProjectLabel.textContent = project.title;
  renderDescription(project);
  renderTags(els.stack, project.stack, 'Stack data is not listed for this project.');
  renderTags(els.topics, project.topics.length ? project.topics : project.tags, 'Topics are not listed for this project.');
  els.meta.innerHTML = [
    ['Industry', project.industry],
    ['Status', project.status],
    ['Visibility', project.visibility],
    ['Repository', project.repoName || 'Private or not listed']
  ].map(([label, value]) => `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join('');

  if (project.repoUrl && project.visibility !== 'private') {
    els.repoLink.href = project.repoUrl;
    els.repoLink.hidden = false;
  }

  renderRelated(project);
}

function renderNotFound() {
  els.title.textContent = 'Project not found';
  els.summary.textContent = 'This project record was not found in the approved portfolio data.';
  els.description.innerHTML = '<p>Return to the project library and choose another project.</p>';
  els.askButton.hidden = true;
}

function openAssistant() {
  els.assistant.classList.add('open');
  els.assistant.setAttribute('aria-hidden', 'false');
  els.fab.style.display = 'none';
}

function closeAssistant() {
  els.assistant.classList.remove('open');
  els.assistant.setAttribute('aria-hidden', 'true');
  els.fab.style.display = '';
}

function appendMessage(role, text) {
  const node = document.createElement('div');
  node.className = `assistant-message ${role}`;
  node.textContent = text;
  els.assistantBody.appendChild(node);
  els.assistantBody.scrollTop = els.assistantBody.scrollHeight;
  return node;
}

function localAnswer(question) {
  const project = state.project;
  if (!project) return 'Open a project record first, then I can answer about it.';
  const q = question.toLowerCase();
  if (q.includes('stack') || q.includes('librar') || q.includes('technolog')) {
    return `${project.title} uses ${project.stack.join(', ') || 'the stack listed in the project README records'}.`;
  }
  return `${project.title}: ${project.summary}\n\nStack: ${project.stack.join(', ') || 'Not listed'}\nTopics: ${(project.topics.length ? project.topics : project.tags).join(', ') || 'Not listed'}`;
}

async function askAssistant(question) {
  const clean = question.trim();
  if (!clean) return;

  const project = state.project;

  appendMessage('user', clean);
  const pending = appendMessage('bot', 'Searching approved portfolio records...');

  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({
        message: clean,
        project_slug: project?.slug || null,
        project_title: project?.sourceTitle || project?.title || null,
      })
    });
    if (!response.ok) throw new Error(`Ask API ${response.status}`);
    const data = await response.json();
    pending.textContent = data.answer || data.message || localAnswer(clean);
  } catch (error) {
    pending.textContent = localAnswer(clean);
  }
}

function bindEvents() {
  els.fab.addEventListener('click', openAssistant);
  els.assistantClose.addEventListener('click', closeAssistant);
  els.askButton.addEventListener('click', () => {
    openAssistant();
    if (state.project) askAssistant(`Tell me about ${state.project.title}.`);
  });
  els.assistantForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = els.assistantQuestion.value.trim();
    els.assistantQuestion.value = '';
    askAssistant(question);
  });
  els.assistantBody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-question]');
    if (button) askAssistant(button.dataset.question || button.textContent);
  });
  els.related.addEventListener('click', (event) => {
    const card = event.target.closest('.project-card[data-project-url]');
    if (!card || event.target.closest('a, button')) return;
    window.location.href = card.dataset.projectUrl;
  });
  els.related.addEventListener('keydown', (event) => {
    const card = event.target.closest('.project-card[data-project-url]');
    if (!card || !['Enter', ' '].includes(event.key) || event.target.closest('a, button')) return;
    event.preventDefault();
    window.location.href = card.dataset.projectUrl;
  });
}

async function init() {
  bindEvents();
  const slug = selectedProjectSlug();
  try {
    const projects = await fetchProjects();
    state.projects = projects.length ? projects : fallbackProjects.map(normalizeProject);
  } catch (error) {
    state.projects = fallbackProjects.map(normalizeProject);
  }

  const project = findProject(state.projects, slug);
  if (!project) {
    renderNotFound();
    return;
  }
  renderProject(project);
}

init();
