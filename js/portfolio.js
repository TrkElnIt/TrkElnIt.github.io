import { API_BASE_URL } from './apiConfig.js';

const fallbackProjects = [
  {
    title: 'Rafik AI Agent Orchestrator',
    summary: 'Multi-agent AI system that automates research, data extraction, analysis, and reporting workflows with human-in-the-loop controls.',
    industry: 'AI automation',
    visibility: 'Public',
    topics: ['AI automation', 'Agents', 'Research', 'Reports'],
    stack: ['Python', 'LangChain', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'OpenAI API'],
    features: ['Multi-agent orchestration with role-based tools', 'Structured outputs and report generation', 'Human review gates for high-risk actions'],
    problem: 'Reduces manual research and report generation from hours to minutes with consistent quality.',
    stats: { score: '124', repos: '22', views: '5.1k' },
    featured: true
  },
  {
    title: 'FinSight Trading Dashboard',
    summary: 'Real-time market data aggregation, analytics, strategy backtesting, and automated alerts for risk-controlled trading workflows.',
    industry: 'finance / trading',
    visibility: 'Public',
    topics: ['finance / trading', 'Analytics', 'Alerts', 'Backtesting'],
    stack: ['Python', 'FastAPI', 'WebSocket', 'Redis', 'Plotly', 'PostgreSQL'],
    features: ['Live market stream ingestion', 'Strategy backtesting reports', 'Alert routing and signal history'],
    problem: 'Provides traders with real-time insights and automated alerts to act on market opportunities.',
    stats: { score: '98', repos: '15', views: '3.2k' },
    featured: true
  },
  {
    title: 'E-Com Price Monitor',
    summary: 'Scrapes product price monitoring across competitors with smart anti-bot patterns, change detection, and notification routing.',
    industry: 'e-commerce',
    visibility: 'Private-safe summary',
    topics: ['e-commerce', 'Scraping', 'Browser automation', 'Notifications'],
    stack: ['Python', 'Playwright', 'PostgreSQL', 'Airflow'],
    features: ['SKU monitoring and normalized price history', 'Change detection thresholds', 'Notification routing for price moves'],
    problem: 'Monitors thousands of SKUs and notifies on price or stock changes to protect margins.',
    stats: { score: '76', repos: '11', views: '2.7k' },
    featured: false
  },
  {
    title: 'Production Business CRM Platform',
    summary: 'FastAPI and PostgreSQL backend with public intake, clients, invoices, payments, meetings, notifications, admin authentication, Cloudflare, Caddy, Resend email, and Android CRM operations.',
    industry: 'CRM / internal tools',
    visibility: 'Private-safe summary',
    topics: ['CRM', 'FastAPI', 'PostgreSQL', 'Android', 'Cloudflare', 'Notifications'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Kotlin', 'Cloudflare', 'Caddy'],
    features: ['Production API secured behind Cloudflare', 'Android CRM admin app', 'Invoices, payments, meetings, notifications'],
    problem: 'Turns website intake and CRM management into one controlled operations flow.',
    stats: { score: '88', repos: '18', views: '4.4k' },
    featured: true
  },
  {
    title: 'Meeting Booking and Availability Engine',
    summary: 'Calendar-style booking flow connected to CRM-managed weekly availability, selectable times, durations, checkout, booking records, update/cancel controls, and email notifications.',
    industry: 'scheduling / services',
    visibility: 'Private-safe summary',
    topics: ['Calendar', 'Meetings', 'Availability', 'CRM', 'Stripe', 'Notifications'],
    stack: ['FastAPI', 'PostgreSQL', 'JavaScript', 'Kotlin'],
    features: ['Weekly availability rules', 'Booking conflict checks', 'Paid and free meeting durations'],
    problem: 'Lets a service business expose only available booking slots and manage bookings from CRM.',
    stats: { score: '69', repos: '9', views: '2.1k' },
    featured: false
  },
  {
    title: 'Document Intelligence Pipeline',
    summary: 'Document parsing pattern for invoices, statements, PDFs, attachments, and forms into structured records with validation, chunking, embeddings, and retrieval-ready storage.',
    industry: 'document intelligence',
    visibility: 'Private-safe summary',
    topics: ['Document parsing', 'PDF', 'RAG', 'Embeddings', 'Validation', 'pgvector'],
    stack: ['Python', 'PostgreSQL', 'pgvector', 'OpenAI embeddings'],
    features: ['Chunking and embedding pipeline', 'Validation and missing-field detection', 'RAG-ready document records'],
    problem: 'Converts unstructured business documents into searchable, validated operational data.',
    stats: { score: '81', repos: '14', views: '3.8k' },
    featured: false
  },
  {
    title: 'Seller Bot and Channel Automation',
    summary: 'Chat automation pattern where a seller switches the bot into modes for orders, meetings, FAQs, and human escalation across messaging channels.',
    industry: 'chatbots / messaging',
    visibility: 'Private-safe summary',
    topics: ['Chatbot', 'Seller bot', 'Slack', 'Meta', 'Telegram', 'Webhook'],
    stack: ['Python', 'FastAPI', 'Webhooks', 'LLM', 'PostgreSQL'],
    features: ['Mode switching by seller action', 'Webhook-based channel routing', 'Human escalation controls'],
    problem: 'Allows one seller to launch the right assistant behavior depending on the customer conversation.',
    stats: { score: '64', repos: '10', views: '1.9k' },
    featured: false
  },
  {
    title: 'Sports Data Grading and Delivery System',
    summary: 'Data workflow for sports player props, result grading, missing-stat detection, source fallback, win/loss evaluation, and report-ready records.',
    industry: 'sports data / trading',
    visibility: 'Private-safe summary',
    topics: ['Sports data', 'Trading', 'Validation', 'MLB', 'ETL', 'Reporting'],
    stack: ['Python', 'Data pipelines', 'APIs', 'CSV', 'Validation'],
    features: ['Automated win/loss grading', 'Missing-stat detection', 'Fallback source handling'],
    problem: 'Creates clean graded records from messy sports-stat sources and incomplete box scores.',
    stats: { score: '72', repos: '13', views: '2.9k' },
    featured: false
  },
  {
    title: 'Construction Workflow Intake System',
    summary: 'Reusable automation concept for intake, documents, quotes, field notes, scheduling, supplier records, and workflow routing in construction operations.',
    industry: 'construction',
    visibility: 'Private-safe summary',
    topics: ['Construction', 'Industrial', 'Workflow', 'Documents', 'Scheduling', 'CRM'],
    stack: ['FastAPI', 'PostgreSQL', 'RAG', 'Mobile admin'],
    features: ['Quote and job intake', 'Document classification', 'Field-note routing'],
    problem: 'Organizes fragmented project requests, documents, and scheduling into trackable workflow records.',
    stats: { score: '57', repos: '7', views: '1.4k' },
    featured: false
  },
  {
    title: 'Healthcare-Style Intake Workflow',
    summary: 'Privacy-conscious pattern for structured intake, document classification, human review gates, and retrieval-limited assistant responses for sensitive operations.',
    industry: 'healthcare',
    visibility: 'Private-safe summary',
    topics: ['Healthcare', 'Intake', 'Documents', 'Human review', 'RAG', 'Compliance'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector'],
    features: ['Sensitive-data handling pattern', 'Human review checkpoints', 'Restricted assistant answers'],
    problem: 'Keeps sensitive intake workflows structured while limiting what an assistant can expose.',
    stats: { score: '42', repos: '6', views: '1.1k' },
    featured: false
  }
];

const state = {
  projects: [],
  filtered: [],
  activeTopic: 'All',
  activeIndex: 0,
  view: 'cards',
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
const viewButtons = document.querySelectorAll('[data-view-button]');
const featuredPanel = document.querySelector('[data-featured-panel]');
const projectCount = document.querySelector('[data-project-count]');
const assistantPanel = document.querySelector('.portfolio-assistant');
const assistantOpen = document.querySelector('[data-assistant-open]');
const assistantMinimize = document.querySelector('[data-assistant-minimize]');

function normalizeProject(project, index = 0) {
  return {
    ...project,
    id: project.id || `project-${index}`,
    industry: project.industry || 'project',
    visibility: project.visibility || 'Private-safe summary',
    topics: Array.isArray(project.topics) ? project.topics : [],
    stack: Array.isArray(project.stack) ? project.stack : [],
    features: Array.isArray(project.features) ? project.features : [],
    stats: project.stats || { score: '0', repos: '0', views: '0' }
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setStatus(message) {
  if (statusText) statusText.textContent = message;
}

function searchableText(project) {
  return [
    project.title,
    project.summary,
    project.industry,
    project.problem,
    project.visibility,
    ...project.topics,
    ...project.stack,
    ...project.features
  ].join(' ').toLowerCase();
}

function renderFeatured(project = state.projects[0]) {
  if (!featuredPanel || !project) return;
  const stack = project.stack.slice(0, 7).map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('');
  const features = project.features.slice(0, 5).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  featuredPanel.innerHTML = `
    <div class="featured-kicker">Featured project</div>
    <div class="featured-title-row">
      <div class="featured-icon">AI</div>
      <div>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.summary)}</p>
      </div>
    </div>
    <div class="stack-cloud">
      <strong>Stack</strong>
      <div class="tag-row">${stack}</div>
    </div>
    <div class="feature-list">
      <strong>Key features</strong>
      <ul>${features}</ul>
    </div>
  `;
}

function renderTopics(projects) {
  if (!topicList) return;
  const topics = [
    { label: 'All', query: 'All' },
    { label: 'AI Automation', query: 'ai automation' },
    { label: 'Backend/API', query: 'fastapi' },
    { label: 'Scraping', query: 'scraping' },
    { label: 'Trading', query: 'trading' },
    { label: 'CRM', query: 'crm' },
    { label: 'Document AI', query: 'document' }
  ];
  topicList.innerHTML = topics.map(topic => `
    <button class="${topic.query === state.activeTopic ? 'active' : ''}" type="button" data-topic="${escapeHtml(topic.query)}">${escapeHtml(topic.label)}</button>
  `).join('');
  topicList.querySelectorAll('[data-topic]').forEach(button => {
    button.addEventListener('click', () => {
      state.activeTopic = button.dataset.topic || 'All';
      applyLocalFilter(searchInput?.value || '');
      renderTopics(state.projects);
    });
  });
}

function projectCard(project, index) {
  const tags = project.topics.slice(0, 4).map(topic => `<span class="tag">${escapeHtml(topic)}</span>`).join('');
  const stats = project.stats || {};
  return `
    <article class="project-card ${index === state.activeIndex ? 'active' : ''}" data-project-index="${index}">
      <div class="project-title-row">
        <div class="card-icon">${escapeHtml(project.title.slice(0, 2).toUpperCase())}</div>
        <div>
          <div class="card-kicker">${escapeHtml(project.industry)}</div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
        </div>
      </div>
      <div class="project-meta">${tags}</div>
      <div class="project-footer">
        <div class="project-stats">
          <span>${escapeHtml(stats.score)} score</span>
          <span>${escapeHtml(stats.repos)} refs</span>
          <span>${escapeHtml(stats.views)} views</span>
        </div>
        <button class="detail-button" type="button" data-project-index="${index}">View Project</button>
      </div>
    </article>
  `;
}

function renderProjects(projects) {
  if (!projectGrid) return;
  projectGrid.classList.toggle('list-view', state.view === 'list');
  if (!projects.length) {
    projectGrid.innerHTML = '<div class="empty-state">No portfolio records match this search yet.</div>';
    return;
  }
  projectGrid.innerHTML = projects.map(projectCard).join('');
  projectGrid.querySelectorAll('.project-card, .detail-button').forEach(element => {
    element.addEventListener('click', event => {
      event.stopPropagation();
      const index = Number(event.currentTarget.dataset.projectIndex);
      if (Number.isNaN(index)) return;
      state.activeIndex = index;
      renderFeatured(state.filtered[index] || state.projects[index]);
      renderProjects(state.filtered);
    });
  });
}

function applyLocalFilter(query = '') {
  const needle = query.trim().toLowerCase();
  const filtered = state.projects.filter(project => {
    const haystack = searchableText(project);
    const matchesTopic = state.activeTopic === 'All' || haystack.includes(state.activeTopic.toLowerCase());
    return matchesTopic && (!needle || haystack.includes(needle));
  });
  state.filtered = filtered;
  state.activeIndex = 0;
  renderProjects(filtered);
  renderFeatured(filtered[0] || state.projects[0]);
  setStatus(`${filtered.length} portfolio records`);
  if (projectCount) projectCount.textContent = String(state.projects.length);
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
    const projects = (data.results || []).map((item, index) => normalizeProject(item.project || item, index));
    if (projects.length) {
      state.filtered = projects;
      state.activeIndex = 0;
      renderProjects(projects);
      renderFeatured(projects[0]);
      setStatus(`${projects.length} matches · ${data.used_vector_search ? 'vector search' : 'text search'}`);
    } else {
      applyLocalFilter(trimmed);
      setStatus(`${state.filtered.length} local matches`);
    }
  } catch (error) {
    const projects = applyLocalFilter(trimmed);
    setStatus(`${projects.length} local matches · API search fallback`);
  }
}

function addMessage(role, content) {
  if (!assistantLog) return null;
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = content;
  assistantLog.appendChild(div);
  assistantLog.scrollTop = assistantLog.scrollHeight;
  return div;
}

function localPortfolioAnswer(message) {
  const terms = message.toLowerCase().split(/[^a-z0-9]+/).filter(term => term.length > 2);
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
  const bullets = matches.map(project => `- ${project.title}: ${project.problem || project.summary}`).join('\n');
  return `Relevant portfolio examples:\n${bullets}\n\nThese answers use sanitized portfolio records only.`;
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
  addMessage('assistant', 'Here are some things you can ask.');
}

searchForm?.addEventListener('submit', event => {
  event.preventDefault();
  runSearch(searchInput?.value || '');
});

searchInput?.addEventListener('input', event => {
  applyLocalFilter(event.target.value || '');
});

assistantForm?.addEventListener('submit', event => {
  event.preventDefault();
  askPortfolio(assistantInput?.value || '');
});

quickButtons.forEach(button => {
  button.addEventListener('click', () => askPortfolio(button.dataset.portfolioQuick || button.textContent || ''));
});

viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    state.view = button.dataset.viewButton || 'cards';
    viewButtons.forEach(item => item.classList.toggle('active', item === button));
    renderProjects(state.filtered);
  });
});

assistantMinimize?.addEventListener('click', () => {
  assistantPanel?.classList.add('minimized');
  assistantOpen?.classList.add('visible');
});

assistantOpen?.addEventListener('click', () => {
  assistantPanel?.classList.remove('minimized');
  assistantOpen?.classList.remove('visible');
});

init();
