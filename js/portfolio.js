import { API_BASE_URL } from './apiConfig.js';

const fallbackProjects = [
  {
    title: 'Production business CRM platform',
    summary: 'FastAPI and PostgreSQL backend with public intake, clients, invoices, payments, meetings, notifications, admin authentication, Cloudflare, Caddy, Resend email, and Android CRM operations.',
    industry: 'Business operations',
    topics: ['CRM', 'FastAPI', 'PostgreSQL', 'Android', 'Cloudflare', 'Notifications'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Kotlin', 'Cloudflare', 'Caddy'],
    featured: true
  },
  {
    title: 'Android CRM admin app',
    summary: 'Mobile admin app for clients, invoices, orders, payments, proposals, meetings, availability control, AI assistant, update notifications, and production API access.',
    industry: 'Mobile operations',
    topics: ['Android', 'Kotlin', 'CRM', 'Firebase', 'Admin', 'Updates'],
    stack: ['Kotlin', 'Jetpack Compose', 'Retrofit', 'Firebase', 'FastAPI'],
    featured: true
  },
  {
    title: 'Meeting booking and availability engine',
    summary: 'Calendar-style booking flow connected to CRM-managed weekly availability, selectable times, durations, checkout, booking records, update/cancel controls, and email notifications.',
    industry: 'Scheduling and services',
    topics: ['Calendar', 'Meetings', 'Availability', 'CRM', 'Stripe', 'Notifications'],
    stack: ['FastAPI', 'PostgreSQL', 'JavaScript', 'Kotlin'],
    featured: true
  },
  {
    title: 'Document intelligence pipeline',
    summary: 'Pattern for parsing invoices, statements, PDFs, attachments, and forms into structured records with validation, chunking, embeddings, and retrieval-ready storage.',
    industry: 'Finance and document operations',
    topics: ['Document parsing', 'PDF', 'RAG', 'Embeddings', 'Validation', 'pgvector'],
    stack: ['Python', 'PostgreSQL', 'pgvector', 'OpenAI embeddings'],
    featured: false
  },
  {
    title: 'Portfolio RAG knowledge base',
    summary: 'Portfolio system designed to convert GitHub project READMEs and sanitized repo notes into searchable records, vector chunks, and a project-specific assistant.',
    industry: 'Developer portfolio',
    topics: ['GitHub', 'README', 'RAG', 'pgvector', 'Search', 'Chatbot'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'JavaScript'],
    featured: true
  },
  {
    title: 'Seller-bot and channel automation',
    summary: 'Chat automation pattern where a seller can switch the bot into different modes such as taking orders, booking meetings, answering FAQs, and routing human escalation.',
    industry: 'Sales and messaging',
    topics: ['Chatbot', 'Seller bot', 'Slack', 'Meta', 'Telegram', 'Webhook'],
    stack: ['Python', 'FastAPI', 'Webhooks', 'LLM', 'PostgreSQL'],
    featured: false
  },
  {
    title: 'Sports data grading and delivery system',
    summary: 'Data workflow for sports player props, result grading, missing-stat detection, source fallback, win/loss evaluation, and report-ready records.',
    industry: 'Sports data and trading',
    topics: ['Sports data', 'Trading', 'Validation', 'MLB', 'ETL', 'Reporting'],
    stack: ['Python', 'Data pipelines', 'APIs', 'CSV', 'Validation'],
    featured: false
  },
  {
    title: 'Construction and industrial workflow patterns',
    summary: 'Reusable automation concepts for intake, documents, quotes, field notes, scheduling, supplier records, and internal workflow routing in construction or industrial operations.',
    industry: 'Construction and industrial',
    topics: ['Construction', 'Industrial', 'Workflow', 'Documents', 'Scheduling', 'CRM'],
    stack: ['FastAPI', 'PostgreSQL', 'RAG', 'Mobile admin'],
    featured: false
  },
  {
    title: 'Ecommerce and service-order automation',
    summary: 'Order/request intake flow with structured project briefs, attachments, CRM records, quote workflow, notifications, and optional payment handoff.',
    industry: 'Ecommerce and service businesses',
    topics: ['Ecommerce', 'Order intake', 'Quote request', 'Attachments', 'Payments', 'CRM'],
    stack: ['JavaScript', 'FastAPI', 'PostgreSQL', 'Stripe', 'Resend'],
    featured: false
  },
  {
    title: 'Healthcare-style document and intake workflow',
    summary: 'Privacy-conscious pattern for structured intake, document classification, human review gates, and retrieval-limited assistant responses for sensitive operations.',
    industry: 'Healthcare and regulated workflows',
    topics: ['Healthcare', 'Intake', 'Documents', 'Human review', 'RAG', 'Compliance'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector'],
    featured: false
  }
];

const state = {
  projects: [],
  filtered: [],
  activeTopic: 'All',
  history: []
};

const projectGrid = document.querySelector('[data-portfolio-grid]');
const topicList = document.querySelector('[data-portfolio-topics]');
const searchForm = document.querySelector('[data-portfolio-search-form]');
const searchInput = document.querySelector('[data-portfolio-search-input]');
const statusText = document.querySelector('[data-portfolio-status]');
const assistantLog = document.querySelector('[data-portfolio-assistant-log]');
const assistantForm = document.querySelector('[data-portfolio-assistant-form]');
const assistantInput = document.querySelector('[data-portfolio-assistant-input]');
const quickButtons = document.querySelectorAll('[data-portfolio-quick]');

function normalizeProject(project) {
  return {
    ...project,
    topics: Array.isArray(project.topics) ? project.topics : [],
    stack: Array.isArray(project.stack) ? project.stack : []
  };
}

function setStatus(message) {
  if (statusText) statusText.textContent = message;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function searchableText(project) {
  return [project.title, project.summary, project.industry, ...project.topics, ...project.stack].join(' ').toLowerCase();
}

function renderTopics(projects) {
  if (!topicList) return;
  const topics = ['All', ...new Set(projects.flatMap(project => project.topics).filter(Boolean))].slice(0, 22);
  topicList.innerHTML = topics.map(topic => `
    <button class="portfolio-topic ${topic === state.activeTopic ? 'is-active' : ''}" type="button" data-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>
  `).join('');
  topicList.querySelectorAll('[data-topic]').forEach(button => {
    button.addEventListener('click', () => {
      state.activeTopic = button.dataset.topic || 'All';
      applyLocalFilter(searchInput?.value || '');
      renderTopics(state.projects);
    });
  });
}

function projectCard(project) {
  const topics = project.topics.slice(0, 6).map(topic => `<span class="portfolio-pill">${escapeHtml(topic)}</span>`).join('');
  const stack = project.stack.slice(0, 7).join(' · ');
  return `
    <article class="portfolio-card ${project.featured ? 'portfolio-card-featured' : ''}">
      <div>
        <div class="portfolio-industry">${escapeHtml(project.industry)}</div>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
      </div>
      <div>
        <div class="portfolio-pill-row">${topics}</div>
        ${stack ? `<div class="portfolio-stack">Stack: ${escapeHtml(stack)}</div>` : ''}
      </div>
    </article>
  `;
}

function renderProjects(projects) {
  if (!projectGrid) return;
  if (!projects.length) {
    projectGrid.innerHTML = '<div class="portfolio-empty">No portfolio records match this search yet.</div>';
    return;
  }
  projectGrid.innerHTML = projects.map(projectCard).join('');
}

function applyLocalFilter(query = '') {
  const needle = query.trim().toLowerCase();
  const filtered = state.projects.filter(project => {
    const matchesTopic = state.activeTopic === 'All' || project.topics.some(topic => topic.toLowerCase() === state.activeTopic.toLowerCase());
    return matchesTopic && (!needle || searchableText(project).includes(needle));
  });
  state.filtered = filtered;
  renderProjects(filtered);
  setStatus(`${filtered.length} portfolio records`);
  return filtered;
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/portfolio/projects?limit=100`);
  if (!response.ok) throw new Error(`Portfolio API ${response.status}`);
  return response.json();
}

async function runSearch(query) {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    applyLocalFilter(trimmed);
    return;
  }
  setStatus('Searching portfolio knowledge base...');
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/search?q=${encodeURIComponent(trimmed)}&limit=12`);
    if (!response.ok) throw new Error(`Search ${response.status}`);
    const data = await response.json();
    const projects = (data.results || []).map(item => normalizeProject(item.project));
    renderProjects(projects.length ? projects : applyLocalFilter(trimmed));
    setStatus(`${projects.length || state.filtered.length} matches · ${data.used_vector_search ? 'vector search' : 'text search'}`);
  } catch (error) {
    const projects = applyLocalFilter(trimmed);
    setStatus(`${projects.length} local matches · API search fallback`);
  }
}

function addMessage(role, content) {
  if (!assistantLog) return null;
  const div = document.createElement('div');
  div.className = `portfolio-message ${role}`;
  div.textContent = content;
  assistantLog.appendChild(div);
  assistantLog.scrollTop = assistantLog.scrollHeight;
  return div;
}

function localPortfolioAnswer(message) {
  const query = message.toLowerCase();
  const terms = query.split(/[^a-z0-9]+/).filter(term => term.length > 2);
  const ranked = state.projects
    .map(project => {
      const text = searchableText(project);
      const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
      return { project, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.project);

  const matches = ranked.length ? ranked : state.projects.filter(project => project.featured).slice(0, 3);
  const bullets = matches.map(project => `- ${project.title}: ${project.summary}`).join('\n');
  return `Relevant portfolio examples:\n${bullets}\n\nThis answer is from the public portfolio records. The production RAG layer can give deeper answers once the private README ingestion is connected.`;
}

async function askPortfolio(message) {
  const trimmed = message.trim();
  if (!trimmed) return;
  addMessage('user', trimmed);
  state.history.push({ role: 'user', content: trimmed });
  assistantInput.value = '';
  const placeholder = addMessage('assistant', 'Searching portfolio records...');
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed, history: state.history.slice(-8) })
    });
    if (!response.ok) throw new Error(`Ask ${response.status}`);
    const data = await response.json();
    const answer = data.answer || localPortfolioAnswer(trimmed);
    if (placeholder) placeholder.textContent = answer;
    state.history.push({ role: 'assistant', content: answer });
  } catch (error) {
    const answer = localPortfolioAnswer(trimmed);
    if (placeholder) placeholder.textContent = answer;
    state.history.push({ role: 'assistant', content: answer });
  }
}

async function init() {
  try {
    const projects = await fetchProjects();
    state.projects = (Array.isArray(projects) && projects.length ? projects : fallbackProjects).map(normalizeProject);
    setStatus(`${state.projects.length} portfolio records loaded`);
  } catch (error) {
    state.projects = fallbackProjects.map(normalizeProject);
    setStatus(`${state.projects.length} local portfolio records loaded`);
  }
  renderTopics(state.projects);
  applyLocalFilter('');
  addMessage('assistant', 'Ask about project examples, industries, stacks, RAG, CRM, Android, finance, trading, construction, ecommerce, healthcare, or backend architecture.');
}

searchForm?.addEventListener('submit', event => {
  event.preventDefault();
  runSearch(searchInput?.value || '');
});

searchInput?.addEventListener('input', event => {
  const value = event.target.value || '';
  if (value.trim().length < 2) applyLocalFilter(value);
});

assistantForm?.addEventListener('submit', event => {
  event.preventDefault();
  askPortfolio(assistantInput?.value || '');
});

quickButtons.forEach(button => {
  button.addEventListener('click', () => askPortfolio(button.dataset.portfolioQuick || button.textContent || ''));
});

init();
