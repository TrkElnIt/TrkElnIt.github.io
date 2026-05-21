import { API_BASE_URL } from './apiConfig.js';

const fallbackProjects = [
  {
    title: 'Rafik AI Agent Orchestrator',
    category: 'AI Automation',
    industry: 'AI Automation',
    summary: 'Multi-agent AI system that automates research, data extraction, analysis, and reporting workflows with human-in-the-loop controls.',
    tags: ['AI automation', 'Agents', 'Research', 'Reports'],
    stack: ['Python', 'FastAPI', 'PostgreSQL']
  },
  {
    title: 'FinSight Trading Dashboard',
    category: 'Trading',
    industry: 'Finance / Trading',
    summary: 'Real-time market data aggregation, analytics, strategy backtesting, and automated alerts for risk-controlled trading workflows.',
    tags: ['finance / trading', 'Analytics', 'Alerts', 'Backtesting'],
    stack: ['Python', 'FastAPI', 'WebSocket']
  },
  {
    title: 'Production Business CRM Platform',
    category: 'CRM',
    industry: 'CRM / Internal Tools',
    summary: 'FastAPI and PostgreSQL backend with public intake, clients, invoices, payments, meetings, notifications, admin authentication, Android CRM, and production deployment.',
    tags: ['CRM', 'FastAPI', 'PostgreSQL', 'Android'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Kotlin']
  },
  {
    title: 'Meeting Booking and Availability Engine',
    category: 'CRM',
    industry: 'Scheduling / Services',
    summary: 'Calendar-style booking flow connected to CRM-managed weekly availability, selectable times, durations, Stripe checkout, and booking records.',
    tags: ['Calendar', 'Meetings', 'CRM', 'Notifications'],
    stack: ['FastAPI', 'PostgreSQL', 'JavaScript', 'Kotlin']
  },
  {
    title: 'Document Intelligence Pipeline',
    category: 'Document AI',
    industry: 'Finance and Document Operations',
    summary: 'Document parsing pattern for invoices, statements, PDFs, attachments, and forms into structured records with validation and workflow routing.',
    tags: ['Document parsing', 'PDF', 'RAG', 'Validation'],
    stack: ['Python', 'PostgreSQL', 'pgvector']
  },
  {
    title: 'E-Com Price Monitor',
    category: 'Scraping',
    industry: 'E-Commerce',
    summary: 'Scrapes product price monitoring across competitors with smart anti-bot patterns, change detection, and notification routing.',
    tags: ['e-commerce', 'Scraping', 'Browser automation', 'Notifications'],
    stack: ['Python', 'Playwright', 'PostgreSQL']
  }
];

const topicOrder = ['All', 'AI Automation', 'Backend/API', 'CRM', 'Trading', 'Scraping', 'Document AI', 'Mobile'];
const state = { projects: [], filtered: [], topic: 'All', query: '' };

const els = {
  count: document.getElementById('projectCount'),
  grid: document.getElementById('projectGrid'),
  status: document.getElementById('libraryStatus'),
  filter: document.getElementById('topicFilter'),
  search: document.getElementById('projectSearch'),
  semanticSearch: document.getElementById('semanticSearchButton'),
  fab: document.getElementById('assistantFab'),
  assistant: document.getElementById('portfolioAssistant'),
  assistantClose: document.getElementById('assistantClose'),
  assistantBody: document.getElementById('assistantBody'),
  assistantForm: document.getElementById('assistantForm'),
  assistantQuestion: document.getElementById('assistantQuestion')
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

function normalizeProject(project, index) {
  const tags = toArray(pick(project, ['tags', 'topics', 'keywords'], []));
  const stack = toArray(pick(project, ['stack', 'technologies', 'tech_stack'], []));
  const category = String(pick(project, ['category', 'topic', 'domain'], tags[0] || 'Backend/API'));
  const title = String(pick(project, ['title', 'name', 'repo', 'repository'], `Project ${index + 1}`));
  const summary = String(pick(project, ['summary', 'description', 'problem', 'readme_summary'], 'Portfolio record imported from project README.'));

  return {
    id: pick(project, ['id', 'slug', 'repo'], title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    title,
    category,
    industry: String(pick(project, ['industry', 'sector', 'category'], category)),
    summary,
    tags: [...new Set([...tags, ...stack].filter(Boolean))].slice(0, 7),
    stack,
    featured: Boolean(project.featured || index === 0)
  };
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/portfolio/projects?limit=100`, { credentials: 'omit' });
  if (!response.ok) throw new Error(`Portfolio API ${response.status}`);
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.items || data.projects || data.records || []);
  return list.map(normalizeProject);
}

function renderFilters() {
  els.filter.innerHTML = '';
  topicOrder.forEach((topic) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = topic;
    button.className = topic === state.topic ? 'active' : '';
    button.addEventListener('click', () => {
      state.topic = topic;
      applyFilters();
    });
    els.filter.appendChild(button);
  });
}

function matchesTopic(project) {
  if (state.topic === 'All') return true;
  const haystack = `${project.category} ${project.industry} ${project.tags.join(' ')} ${project.stack.join(' ')}`.toLowerCase();
  const topic = state.topic.toLowerCase();
  if (topic === 'backend/api') return haystack.includes('backend') || haystack.includes('api') || haystack.includes('fastapi');
  if (topic === 'document ai') return haystack.includes('document') || haystack.includes('pdf') || haystack.includes('rag');
  return haystack.includes(topic);
}

function matchesSearch(project) {
  if (!state.query) return true;
  const haystack = `${project.title} ${project.category} ${project.industry} ${project.summary} ${project.tags.join(' ')} ${project.stack.join(' ')}`.toLowerCase();
  return haystack.includes(state.query.toLowerCase());
}

function applyFilters() {
  state.filtered = state.projects.filter((project) => matchesTopic(project) && matchesSearch(project));
  renderFilters();
  renderProjects();
}

function renderProjects() {
  els.count.textContent = String(state.projects.length);
  els.status.textContent = state.filtered.length
    ? `${state.filtered.length} portfolio record${state.filtered.length === 1 ? '' : 's'}`
    : 'No matching portfolio records.';

  els.grid.innerHTML = state.filtered.map((project, index) => {
    const initials = project.title.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
    const tags = project.tags.length ? project.tags : project.stack;
    return `
      <article class="project-card ${project.featured || index === 0 ? 'featured' : ''}">
        <div class="project-head">
          <div class="project-icon">${escapeHtml(initials || 'TE')}</div>
          <div>
            <p class="project-industry">${escapeHtml(project.industry)}</p>
            <h2>${escapeHtml(project.title)}</h2>
          </div>
        </div>
        <p>${escapeHtml(project.summary)}</p>
        <div class="project-tags">${tags.slice(0, 6).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <div class="project-meta">Stack: ${escapeHtml((project.stack.length ? project.stack : tags).slice(0, 4).join(' · ') || 'Project README')}</div>
        <button class="project-link" type="button" data-project="${escapeHtml(project.title)}">Ask about this project -></button>
      </article>
    `;
  }).join('');

  els.grid.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      openAssistant();
      askAssistant(`Tell me about ${button.dataset.project}.`);
    });
  });
}

async function runSemanticSearch() {
  const query = els.search.value.trim();
  state.query = query;
  if (!query) {
    applyFilters();
    return;
  }

  els.status.textContent = 'Searching portfolio records...';
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/search?q=${encodeURIComponent(query)}&limit=24`, { credentials: 'omit' });
    if (!response.ok) throw new Error(`Search API ${response.status}`);
    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.items || data.projects || data.results || []);
    state.filtered = list.map(normalizeProject).filter(matchesTopic);
    renderProjects();
  } catch (error) {
    applyFilters();
  }
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
  const q = question.toLowerCase();
  const pool = state.projects.filter((project) => {
    const text = `${project.title} ${project.industry} ${project.summary} ${project.tags.join(' ')} ${project.stack.join(' ')}`.toLowerCase();
    return q.split(/\s+/).filter((word) => word.length > 3).some((word) => text.includes(word));
  }).slice(0, 3);

  const selected = pool.length ? pool : state.projects.slice(0, 3);
  if (!selected.length) return 'I can answer from the approved portfolio records after they load.';
  return selected.map((project) => `${project.title}: ${project.summary}`).join('\n\n');
}

async function askAssistant(question) {
  const clean = question.trim();
  if (!clean) return;

  appendMessage('user', clean);
  const pending = appendMessage('bot', 'Searching approved portfolio records...');

  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ question: clean })
    });
    if (!response.ok) throw new Error(`Ask API ${response.status}`);
    const data = await response.json();
    pending.textContent = data.answer || data.message || localAnswer(clean);
  } catch (error) {
    pending.textContent = localAnswer(clean);
  }
}

function bindEvents() {
  els.search.addEventListener('input', () => {
    state.query = els.search.value.trim();
    applyFilters();
  });
  els.search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSemanticSearch();
    }
  });
  els.semanticSearch.addEventListener('click', runSemanticSearch);
  els.fab.addEventListener('click', openAssistant);
  els.assistantClose.addEventListener('click', closeAssistant);
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
}

async function init() {
  bindEvents();
  renderFilters();
  try {
    const projects = await fetchProjects();
    state.projects = projects.length ? projects : fallbackProjects.map(normalizeProject);
    els.status.textContent = 'Portfolio records loaded.';
  } catch (error) {
    state.projects = fallbackProjects.map(normalizeProject);
    els.status.textContent = 'Using local portfolio records while the API is unavailable.';
  }
  applyFilters();
}

init();
