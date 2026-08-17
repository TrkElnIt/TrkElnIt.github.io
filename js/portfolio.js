import { API_BASE_URL } from './apiConfig.js';

const EXCLUDED_SLUGS = new Set(['trkelnit-mini-yacht', 'trkelnit', 'trkelnit-github-io']);
const FEATURED_SLUGS = [
  'trkelnit-production-platform',
  'crm-mobile-admin',
  'public-chat-intake-assistant',
  'autodesk-bim-file-uploader',
  'records-ocr-workflow',
  'euribor-data-dashboard',
  'power-bi-equipment-data-pipeline',
  'real-time-browser-telemetry-pipeline'
];

const CATEGORY_ICONS = {
  platform: '<svg viewBox="0 0 48 48"><rect x="7" y="8" width="34" height="32" rx="7"/><path d="M7 18h34M18 18v22M24 25h10M24 31h7"/></svg>',
  ai: '<svg viewBox="0 0 48 48"><path d="M24 7l3.2 8.8L36 19l-8.8 3.2L24 31l-3.2-8.8L12 19l8.8-3.2L24 7Z"/><path d="M36 29l1.8 4.8L43 36l-5.2 1.8L36 43l-1.8-5.2L29 36l5.2-2.2L36 29Z"/></svg>',
  document: '<svg viewBox="0 0 48 48"><path d="M13 6h15l9 9v27H13V6Z"/><path d="M28 6v10h9M19 24h12M19 30h12M19 36h8"/></svg>',
  construction: '<svg viewBox="0 0 48 48"><path d="M24 5 41 14 24 23 7 14 24 5Z"/><path d="M7 14v19l17 10 17-10V14M24 23v20"/></svg>',
  data: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="10" rx="15" ry="6"/><path d="M9 10v10c0 3.3 6.7 6 15 6s15-2.7 15-6V10M9 20v10c0 3.3 6.7 6 15 6s15-2.7 15-6V20M9 30v8c0 3.3 6.7 6 15 6s15-2.7 15-6v-8"/></svg>',
  finance: '<svg viewBox="0 0 48 48"><path d="M7 39h34M10 34l8-9 7 5 12-16"/><path d="M29 14h8v8"/></svg>',
  bi: '<svg viewBox="0 0 48 48"><rect x="6" y="7" width="36" height="34" rx="7"/><path d="M13 33V23M21 33V16M29 33V26M37 33V12"/></svg>',
  browser: '<svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="34" rx="7"/><path d="M5 16h38M12 11.5h.1M18 11.5h.1M17 31l6-6 5 4 7-8"/></svg>',
  ecommerce: '<svg viewBox="0 0 48 48"><path d="M11 17h26l-2 25H13l-2-25Z"/><path d="M18 18v-5a6 6 0 0 1 12 0v5"/></svg>',
  mobile: '<svg viewBox="0 0 48 48"><rect x="14" y="4" width="20" height="40" rx="6"/><path d="M20 9h8M22 38h4"/></svg>',
  healthcare: '<svg viewBox="0 0 48 48"><path d="M19 7h10v12h12v10H29v12H19V29H7V19h12V7Z"/></svg>',
  public: '<svg viewBox="0 0 48 48"><path d="m7 17 17-10 17 10-17 10L7 17Z"/><path d="M11 22v13M19 27v8M29 27v8M37 22v13M7 40h34"/></svg>',
  default: '<svg viewBox="0 0 48 48"><path d="m18 13-10 11 10 11M30 13l10 11-10 11M27 7l-6 34"/></svg>'
};

const CATEGORY_LABELS = {
  platform: 'Business system', ai: 'AI system', document: 'Document workflow',
  construction: 'Construction tech', data: 'Data pipeline', finance: 'Finance data',
  bi: 'Business intelligence', browser: 'Browser automation', ecommerce: 'Ecommerce',
  mobile: 'Mobile application', healthcare: 'Healthcare data', public: 'Public data',
  default: 'Software delivery'
};

const PROJECT_PROFILES = {
  'trkelnit-production-platform': {
    category: 'Business platforms',
    industry: 'Professional services',
    role: 'Architecture, backend, web, mobile, and cloud operations'
  },
  'crm-mobile-admin': {
    category: 'Mobile',
    industry: 'Mobile operations',
    role: 'Mobile architecture, API integration, and release workflow'
  },
  'public-chat-intake-assistant': {
    category: 'Private AI',
    industry: 'AI-assisted operations',
    role: 'Workflow design, guardrails, persistence, and frontend'
  },
  'meeting-booking-availability-engine': {
    category: 'Business platforms',
    industry: 'Scheduling and operations',
    role: 'Data model, APIs, booking UI, and admin integration'
  },
  'autodesk-bim-file-uploader': {
    category: 'Construction',
    industry: 'Construction / BIM',
    role: 'API integration, storage workflow, upload validation'
  },
  'construction-estimate-automation': {
    category: 'Construction',
    industry: 'Construction estimating',
    role: 'Automation, formulas, validation, and reusable templates'
  },
  'records-ocr-workflow': {
    category: 'Document AI',
    industry: 'Document operations',
    role: 'Browser retrieval, OCR, field parsing, review, and delivery'
  },
  'tender-response-ai': {
    category: 'Document AI',
    industry: 'Tender and proposal operations',
    role: 'Document extraction, context assembly, drafting, and review'
  },
  'sports-data-delivery-pipeline': {
    category: 'Data pipelines',
    industry: 'Sports analytics',
    role: 'Extraction, normalization, reporting, persistence, and delivery'
  },
  'shopify-inventory-sync': {
    category: 'Ecommerce',
    industry: 'Ecommerce operations',
    role: 'Supplier monitoring, Shopify updates, rules, and scheduling'
  },
  'browser-automation-desktop-console': {
    category: 'Browser automation',
    industry: 'Browser automation',
    role: 'Operator controls, authenticated sessions, and run status'
  }
};

const fallbackProjects = [
  {
    slug: 'trkelnit-production-platform',
    title: 'TrkElnIt production platform',
    summary: 'Deployed operating system connecting the public website, customer portal, staff CRM, Android administration, booking, billing, notifications, and production operations.',
    topics: ['CRM', 'Operations', 'Authentication', 'Payments'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'Kotlin'],
    status: 'production'
  },
  {
    slug: 'crm-mobile-admin',
    title: 'Mobile CRM admin application',
    summary: 'Private Android CRM for clients, meetings, invoices, orders, payments, proposals, notifications, assistant chat, and controlled app updates.',
    topics: ['Android', 'CRM', 'Notifications'],
    stack: ['Kotlin', 'Jetpack Compose', 'Retrofit', 'Firebase'],
    status: 'production'
  },
  {
    slug: 'public-chat-intake-assistant',
    title: 'Public chat intake assistant',
    summary: 'Consent-aware assistant that routes questions, quote intake, meeting intake, attachments, and structured lead data without exposing private CRM records.',
    topics: ['Private AI', 'Lead intake', 'Human handoff'],
    stack: ['FastAPI', 'OpenAI/Ollama', 'PostgreSQL', 'Klaro'],
    status: 'production'
  },
  {
    slug: 'meeting-booking-availability-engine',
    title: 'Meeting booking and availability engine',
    summary: 'Public booking flow driven by CRM-managed availability, blockouts, duration pricing, persisted records, and staff notifications.',
    topics: ['Calendar', 'Availability', 'CRM'],
    stack: ['FastAPI', 'PostgreSQL', 'JavaScript', 'Stripe'],
    status: 'production'
  },
  {
    slug: 'autodesk-bim-file-uploader',
    title: 'Autodesk BIM File Integration',
    summary: 'Autodesk Platform Services integration for OAuth token management, storage discovery and provisioning, large BIM/Revit uploads, and API validation.',
    topics: ['Construction', 'BIM', 'API integration'],
    stack: ['Python', 'Autodesk APS', 'OAuth'],
    status: 'sanitized-summary'
  },
  {
    slug: 'construction-estimate-automation',
    title: 'Construction Estimate Automation',
    summary: 'Structured estimate and proposal generation with formulas, validation rules, reusable formatting, templates, and operational retry handling.',
    topics: ['Construction', 'Estimating', 'Automation'],
    stack: ['Python', 'Google Sheets'],
    status: 'sanitized-summary'
  },
  {
    slug: 'records-ocr-workflow',
    title: 'Records OCR and Data Entry Workflow',
    summary: 'Authenticated record retrieval, document capture, OCR, local-model field parsing, human review, structured delivery, and completion alerts.',
    topics: ['Document intelligence', 'OCR', 'Browser automation'],
    stack: ['Python', 'Playwright', 'OCR', 'Ollama'],
    status: 'sanitized-summary'
  },
  {
    slug: 'tender-response-ai',
    title: 'Tender Response AI Assistant',
    summary: 'Extracts tender questions, assembles supporting context, drafts structured responses, and preserves a human review step before delivery.',
    topics: ['Document AI', 'Tender response', 'Human review'],
    stack: ['Python', 'OpenAI'],
    status: 'sanitized-summary'
  },
  {
    slug: 'sports-data-delivery-pipeline',
    title: 'Sports Data Extraction and Delivery Pipeline',
    summary: 'Multi-source player-prop collection, normalization, branded report generation, database persistence, and delivery through Drive and messaging channels.',
    topics: ['Data pipelines', 'Reporting', 'Notifications'],
    stack: ['Python', 'PostgreSQL', 'Playwright', 'Google Cloud'],
    status: 'sanitized-summary'
  },
  {
    slug: 'shopify-inventory-sync',
    title: 'Shopify Inventory Synchronization',
    summary: 'Scheduled supplier monitoring and variant-level Shopify updates with backorder, discontinued-state, archive, and operational tracking rules.',
    topics: ['Ecommerce', 'Inventory', 'Automation'],
    stack: ['Python', 'Shopify', 'Playwright'],
    status: 'sanitized-summary'
  },
  {
    slug: 'browser-automation-desktop-console',
    title: 'Browser Automation Desktop Console',
    summary: 'Operator interface for launching authenticated browser tasks, controlling session-oriented execution, and reviewing operational status.',
    topics: ['Browser automation', 'Authenticated sessions', 'Operator controls'],
    stack: ['Python'],
    status: 'sanitized-summary'
  }
];

const topicOrder = ['All', 'AI & agents', 'Backend/API', 'Business platforms', 'Documents & OCR', 'Finance & BI', 'Construction', 'Data pipelines', 'Healthcare', 'Ecommerce', 'Browser automation', 'Mobile'];
const state = { projects: [], filtered: [], topic: 'All', query: '', view: 'all' };

const els = {
  count: document.getElementById('projectCount'),
  systemCount: document.getElementById('systemCount'),
  domainCount: document.getElementById('domainCount'),
  productionCount: document.getElementById('productionCount'),
  grid: document.getElementById('projectGrid'),
  status: document.getElementById('libraryStatus'),
  filter: document.getElementById('topicFilter'),
  search: document.getElementById('projectSearch'),
  semanticSearch: document.getElementById('semanticSearchButton'),
  featuredView: document.getElementById('featuredViewButton'),
  allView: document.getElementById('allViewButton'),
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

function cleanDisplayTitle(value) {
  return String(value ?? '')
    .replace(/[\u200d\ufe0f]/g, '')
    .replace(/[\u2600-\u27bf]/g, '')
    .replace(/[\u{1f000}-\u{1faff}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function projectTheme(project) {
  const text = `${project.slug || ''} ${project.title || ''} ${project.category || ''} ${project.industry || ''} ${(project.tags || []).join(' ')} ${(project.stack || []).join(' ')}`.toLowerCase();
  if (/power bi|business intelligence|dashboard/.test(text)) return 'bi';
  if (/health|medical|clinic|residency/.test(text)) return 'healthcare';
  if (/finance|financial|trading|market|euribor|invoice|payment|bank/.test(text)) return 'finance';
  if (/construction|bim|autodesk|revit|cad|dxf|estimate/.test(text)) return 'construction';
  if (/document|ocr|pdf|tender|powerpoint|excel|publishing/.test(text)) return 'document';
  if (/shopify|ecommerce|e-commerce|inventory|catalog|seller/.test(text)) return 'ecommerce';
  if (/android|mobile|kotlin|compose/.test(text)) return 'mobile';
  if (/browser|scrap|playwright|camoufox|selenium|directory|zillow|booking/.test(text)) return 'browser';
  if (/public data|public record|arcgis|fmcsa|government/.test(text)) return 'public';
  if (/\bai\b|llm|rag|agent|openai|ollama|langgraph/.test(text)) return 'ai';
  if (/crm|platform|booking|operations|workspace|business system/.test(text)) return 'platform';
  if (/data|pipeline|postgres|api|csv|json/.test(text)) return 'data';
  return 'default';
}

function categoryIcon(project) {
  return CATEGORY_ICONS[project.theme] || CATEGORY_ICONS.default;
}

function publicAssetUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  try {
    return new URL(raw, `${API_BASE_URL.replace(/\/$/, '')}/`).href;
  } catch (_error) {
    return raw;
  }
}

function normalizeProject(project, index) {
  const tags = toArray(pick(project, ['tags', 'topics', 'keywords'], []));
  const stack = toArray(pick(project, ['stack', 'technologies', 'tech_stack'], []));
  const sourceTitle = String(pick(project, ['title', 'name', 'repo', 'repository'], `Project ${index + 1}`));
  const title = cleanDisplayTitle(sourceTitle) || sourceTitle;
  const summary = String(pick(project, ['summary', 'description', 'problem', 'readme_summary'], 'Portfolio record imported from project README.'));
  const id = String(pick(project, ['id', 'slug', 'repo'], sourceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
  const slug = String(pick(project, ['slug', 'repo', 'id'], id));
  const profile = PROJECT_PROFILES[slug] || {};
  const category = profile.category || String(pick(project, ['category', 'topic', 'domain'], tags[0] || 'Backend/API'));
  const media = Array.isArray(project.media) ? project.media : [];
  const thumbnailItem = media.find((item) => item?.role === 'thumbnail') || media.find((item) => item?.kind === 'image');

  const normalized = {
    id,
    slug,
    title,
    sourceTitle,
    category,
    industry: profile.industry || String(pick(project, ['industry', 'sector', 'category'], category)),
    summary,
    description: String(pick(project, ['description', 'details', 'readme', 'notes'], '')),
    tags: [...new Set([...tags, ...stack].filter(Boolean))].slice(0, 7),
    stack,
    repoName: String(pick(project, ['repo_name', 'repoName', 'repo'], '')),
    repoUrl: String(pick(project, ['repo_url', 'repoUrl', 'url'], '')),
    status: String(pick(project, ['status'], 'production')),
    visibility: String(pick(project, ['visibility'], 'public')),
    role: profile.role || 'Design, implementation, validation, and delivery',
    featured: FEATURED_SLUGS.includes(slug)
  };
  normalized.thumbnail = publicAssetUrl(thumbnailItem?.url);
  normalized.theme = projectTheme(normalized);
  normalized.themeLabel = CATEGORY_LABELS[normalized.theme] || CATEGORY_LABELS.default;
  return normalized;
}

function projectDetailUrl(project) {
  return `project.html?project=${encodeURIComponent(project.slug || project.id)}`;
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/portfolio/projects?limit=100`, { credentials: 'omit' });
  if (!response.ok) throw new Error(`Portfolio API ${response.status}`);
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.items || data.projects || data.records || []);
  return list.map(normalizeProject).filter((project) => !EXCLUDED_SLUGS.has(project.slug));
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
  if (topic === 'documents & ocr') return haystack.includes('document') || haystack.includes('pdf') || haystack.includes('ocr') || haystack.includes('tender');
  if (topic === 'business platforms') return haystack.includes('platform') || haystack.includes('crm') || haystack.includes('scheduling');
  if (topic === 'ai & agents') return haystack.includes('ai') || haystack.includes('llm') || haystack.includes('rag') || haystack.includes('agent') || haystack.includes('ollama') || haystack.includes('openai');
  if (topic === 'finance & bi') return haystack.includes('finance') || haystack.includes('financial') || haystack.includes('trading') || haystack.includes('market') || haystack.includes('power bi') || haystack.includes('business intelligence');
  if (topic === 'healthcare') return haystack.includes('health') || haystack.includes('medical') || haystack.includes('clinic') || haystack.includes('residency');
  if (topic === 'data pipelines') return haystack.includes('data') || haystack.includes('pipeline') || haystack.includes('extract') || haystack.includes('csv') || haystack.includes('json');
  if (topic === 'browser automation') return haystack.includes('browser') || haystack.includes('playwright') || haystack.includes('camoufox') || haystack.includes('selenium') || haystack.includes('directory');
  if (topic === 'construction') return haystack.includes('construction') || haystack.includes('bim') || haystack.includes('autodesk') || haystack.includes('revit') || haystack.includes('dxf');
  if (topic === 'mobile') return haystack.includes('mobile') || haystack.includes('android') || haystack.includes('kotlin') || haystack.includes('compose');
  return haystack.includes(topic);
}

function matchesSearch(project) {
  if (!state.query) return true;
  const haystack = `${project.title} ${project.sourceTitle} ${project.category} ${project.industry} ${project.summary} ${project.tags.join(' ')} ${project.stack.join(' ')}`.toLowerCase();
  return haystack.includes(state.query.toLowerCase());
}

function applyFilters() {
  const useFullLibrary = state.view === 'all' || Boolean(state.query) || state.topic !== 'All';
  const source = useFullLibrary
    ? state.projects
    : FEATURED_SLUGS.map((slug) => state.projects.find((project) => project.slug === slug)).filter(Boolean);
  state.filtered = source.filter((project) => matchesTopic(project) && matchesSearch(project));
  renderFilters();
  renderViewSwitch();
  renderProjects();
}

function renderViewSwitch() {
  const featured = state.view === 'featured';
  els.featuredView.classList.toggle('active', featured);
  els.featuredView.setAttribute('aria-pressed', String(featured));
  els.allView.classList.toggle('active', !featured);
  els.allView.setAttribute('aria-pressed', String(!featured));
}

function updatePortfolioStats() {
  const domains = new Set(state.projects.map((project) => project.theme).filter(Boolean));
  const production = state.projects.filter((project) => project.status.toLowerCase() === 'production').length;
  els.count.textContent = String(state.projects.length);
  if (els.systemCount) els.systemCount.textContent = String(state.projects.length);
  if (els.domainCount) els.domainCount.textContent = String(domains.size);
  if (els.productionCount) els.productionCount.textContent = String(production);
}

function renderProjects() {
  updatePortfolioStats();
  els.status.textContent = state.filtered.length
    ? (state.view === 'featured' && !state.query && state.topic === 'All'
      ? `${state.filtered.length} selected case studies shown. Switch to All projects for the complete archive.`
      : `${state.filtered.length} of ${state.projects.length} documented system${state.projects.length === 1 ? '' : 's'} shown.`)
    : 'No matching portfolio records.';

  els.grid.innerHTML = state.filtered.map((project, index) => {
    const tags = project.tags.length ? project.tags : project.stack;
    const detailUrl = projectDetailUrl(project);
    const recordType = project.status.toLowerCase() === 'production' ? 'Production' : 'Delivered';
    return `
      <article class="project-card ${project.featured ? 'featured' : ''}" data-theme="${escapeHtml(project.theme)}" data-project-url="${escapeHtml(detailUrl)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(project.title)} project page">
        <div class="project-card-visual ${project.thumbnail ? 'has-thumbnail' : ''}" aria-hidden="true">
          ${project.thumbnail ? `<img class="project-card-thumbnail" src="${escapeHtml(project.thumbnail)}" alt="" loading="lazy" />` : ''}
          <span class="project-visual-type">${escapeHtml(project.themeLabel)}</span>
          <span class="project-visual-index">${String(index + 1).padStart(2, '0')}</span>
          <div class="project-visual-icon">${categoryIcon(project)}</div>
          <div class="project-visual-flow"><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="project-card-body">
          <div class="project-head">
          <div>
            <p class="project-industry">${escapeHtml(project.industry)}</p>
            <h2>${escapeHtml(project.title)}</h2>
          </div>
          </div>
          <p class="project-summary">${escapeHtml(project.summary)}</p>
          <div class="project-tags">${tags.slice(0, 5).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
          <div class="project-card-footer">
            <span class="project-record-type"><i></i>${escapeHtml(recordType)}</span>
            <div class="project-actions">
              <a class="project-link" href="${escapeHtml(detailUrl)}">Open case study →</a>
              <button class="project-link project-ask" type="button" data-project="${escapeHtml(project.title)}">Ask</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  els.grid.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      openAssistant();
      askAssistant(`Tell me about ${button.dataset.project}.`);
    });
  });

  els.grid.querySelectorAll('.project-card[data-project-url]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      window.location.href = card.dataset.projectUrl;
    });
    card.addEventListener('keydown', (event) => {
      if (!['Enter', ' '].includes(event.key) || event.target.closest('a, button')) return;
      event.preventDefault();
      window.location.href = card.dataset.projectUrl;
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
    state.filtered = list
      .map(normalizeProject)
      .filter((project) => !EXCLUDED_SLUGS.has(project.slug))
      .filter(matchesTopic);
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
      body: JSON.stringify({ message: clean })
    });
    if (!response.ok) throw new Error(`Ask API ${response.status}`);
    const data = await response.json();
    pending.textContent = data.answer || data.message || localAnswer(clean);
  } catch (error) {
    pending.textContent = localAnswer(clean);
  }
}

function bindEvents() {
  els.featuredView.addEventListener('click', () => {
    state.view = 'featured';
    state.topic = 'All';
    state.query = '';
    els.search.value = '';
    applyFilters();
  });
  els.allView.addEventListener('click', () => {
    state.view = 'all';
    applyFilters();
  });
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
  state.projects.sort((a, b) => {
    const aRank = FEATURED_SLUGS.indexOf(a.slug);
    const bRank = FEATURED_SLUGS.indexOf(b.slug);
    if (aRank !== -1 || bRank !== -1) {
      if (aRank === -1) return 1;
      if (bRank === -1) return -1;
      return aRank - bRank;
    }
    return a.title.localeCompare(b.title);
  });
  applyFilters();
}

init();
