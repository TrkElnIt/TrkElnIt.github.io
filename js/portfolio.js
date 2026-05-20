import { API_BASE_URL } from './apiConfig.js';

const fallbackProjects = [
  {
    title: 'TrkElnIt production platform',
    summary: 'Production business platform with public website, FastAPI backend, PostgreSQL, Cloudflare, Caddy, email, payments-ready flow, and Android CRM operations.',
    industry: 'Professional services',
    topics: ['CRM', 'FastAPI', 'PostgreSQL', 'Android', 'Cloudflare'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Kotlin'],
    featured: true
  },
  {
    title: 'Meeting booking and availability engine',
    summary: 'Website booking flow connected to CRM-managed weekly availability, blockouts, durations, checkout, and notifications.',
    industry: 'Scheduling and operations',
    topics: ['Calendar', 'Meetings', 'CRM', 'Notifications'],
    stack: ['FastAPI', 'PostgreSQL', 'JavaScript', 'Kotlin'],
    featured: true
  },
  {
    title: 'Document intelligence pipeline',
    summary: 'Document parsing pattern for invoices, statements, PDFs, attachments, structured extraction, validation, and workflow routing.',
    industry: 'Finance and document operations',
    topics: ['Document parsing', 'PDF', 'RAG', 'Validation'],
    stack: ['Python', 'PostgreSQL', 'pgvector'],
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

function renderTopics(projects) {
  if (!topicList) return;
  const topics = ['All', ...new Set(projects.flatMap(project => project.topics).filter(Boolean))].slice(0, 18);
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
  const topics = project.topics.slice(0, 5).map(topic => `<span class="portfolio-pill">${escapeHtml(topic)}</span>`).join('');
  const stack = project.stack.slice(0, 6).join(' · ');
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
    const haystack = [project.title, project.summary, project.industry, ...project.topics, ...project.stack].join(' ').toLowerCase();
    return matchesTopic && (!needle || haystack.includes(needle));
  });
  state.filtered = filtered;
  renderProjects(filtered);
  setStatus(`${filtered.length} public portfolio records`);
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
  setStatus('Searching portfolio vectors...');
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/search?q=${encodeURIComponent(trimmed)}&limit=12`);
    if (!response.ok) throw new Error(`Search ${response.status}`);
    const data = await response.json();
    const projects = (data.results || []).map(item => normalizeProject(item.project));
    renderProjects(projects);
    setStatus(`${projects.length} matches · ${data.used_vector_search ? 'vector search' : 'text fallback'}`);
  } catch (error) {
    applyLocalFilter(trimmed);
    setStatus('API search unavailable, using local portfolio filter.');
  }
}

function addMessage(role, content) {
  if (!assistantLog) return;
  const div = document.createElement('div');
  div.className = `portfolio-message ${role}`;
  div.textContent = content;
  assistantLog.appendChild(div);
  assistantLog.scrollTop = assistantLog.scrollHeight;
}

async function askPortfolio(message) {
  const trimmed = message.trim();
  if (!trimmed) return;
  addMessage('user', trimmed);
  state.history.push({ role: 'user', content: trimmed });
  assistantInput.value = '';
  addMessage('assistant', 'Searching the portfolio records...');
  const placeholder = assistantLog?.lastElementChild;
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed, history: state.history.slice(-8) })
    });
    if (!response.ok) throw new Error(`Ask ${response.status}`);
    const data = await response.json();
    if (placeholder) placeholder.textContent = data.answer || 'No answer returned.';
    state.history.push({ role: 'assistant', content: data.answer || '' });
  } catch (error) {
    if (placeholder) {
      placeholder.textContent = 'Portfolio assistant is not available right now. The project cards and search still work from the public portfolio records.';
    }
  }
}

async function init() {
  try {
    const projects = await fetchProjects();
    state.projects = (projects.length ? projects : fallbackProjects).map(normalizeProject);
    setStatus(`${state.projects.length} public portfolio records loaded from API`);
  } catch (error) {
    state.projects = fallbackProjects.map(normalizeProject);
    setStatus('Using local portfolio records until the API is ingested.');
  }
  renderTopics(state.projects);
  applyLocalFilter('');
  addMessage('assistant', 'Ask about industries, project examples, stack choices, document parsing, CRM, scheduling, or data pipelines. I answer from sanitized portfolio records only.');
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
