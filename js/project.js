import { API_BASE_URL } from './apiConfig.js';

const EXCLUDED_SLUGS = new Set(['trkelnit-mini-yacht', 'trkelnit', 'trkelnit-github-io']);

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

const PROJECT_DETAILS = {
  'trkelnit-production-platform': {
    category: 'Business platforms',
    industry: 'Professional services',
    problem: 'Public intake, customer access, staff operations, mobile administration, billing, scheduling, and production infrastructure needed to work as one controlled system instead of separate tools.',
    solution: 'A deployed platform connecting the public website, Cognito customer portal, protected staff CRM, FastAPI services, PostgreSQL records, Android administration, notifications, and cloud operations.',
    responsibilities: ['Requirements and system architecture', 'Python APIs and PostgreSQL data model', 'Responsive public, customer, and staff interfaces', 'Android CRM integration', 'Deployment, authentication, monitoring, and operational runbooks'],
    evidence: ['Public website and customer portal are deployed', 'Staff and mobile clients use protected production APIs', 'Current architecture diagram is published below', 'Private source, credentials, and customer data remain excluded']
  },
  'crm-mobile-admin': {
    category: 'Mobile',
    industry: 'Mobile operations',
    problem: 'Staff needed secure mobile access to operational records and notifications without reproducing business logic inside a disconnected app.',
    solution: 'A Kotlin and Jetpack Compose client connected to authenticated FastAPI administration endpoints, Firebase notifications, and a controlled internal release workflow.',
    responsibilities: ['Mobile information architecture and Compose UI', 'Retrofit API integration and authenticated requests', 'CRM record, meeting, invoice, payment, and proposal workflows', 'Notification and application-update delivery'],
    evidence: ['Connected to the production CRM backend', 'Firebase Cloud Messaging supports phone notifications', 'Release metadata and Firebase App Distribution support controlled internal updates']
  },
  'public-chat-intake-assistant': {
    category: 'Private AI',
    industry: 'AI-assisted operations',
    problem: 'A public assistant must answer general questions and collect useful project intake while preventing public access to private CRM context.',
    solution: 'A consent-aware, session-based assistant that routes questions, quotes, meetings, and attachments into structured workflows with persistence and human handoff.',
    responsibilities: ['Conversation and intake-state design', 'Public/private data boundary and guardrails', 'FastAPI routing and PostgreSQL persistence', 'Consent-aware browser memory and responsive chat UI'],
    evidence: ['Deployed on the TrkElnIt website', 'Quote and meeting routes connect to operational workflows', 'Public sessions cannot retrieve private CRM records']
  },
  'meeting-booking-availability-engine': {
    category: 'Business platforms',
    industry: 'Scheduling and operations',
    problem: 'Public availability, internal blockouts, duration pricing, bookings, and staff notifications require one reliable source of truth.',
    solution: 'A calendar booking flow backed by FastAPI and PostgreSQL, with availability administered through the CRM and shared with web and Android clients.',
    responsibilities: ['Availability and booking data model', 'Public and protected administration APIs', 'Responsive booking experience', 'Payment-ready duration pricing and notification integration'],
    evidence: ['Public booking flow is deployed', 'Availability and blockouts are CRM-managed', 'Bookings persist as operational records']
  },
  'autodesk-bim-file-uploader': {
    category: 'Construction',
    industry: 'Construction / BIM',
    problem: 'Large BIM and Revit files require authenticated cloud storage workflows, bucket management, upload handling, and API-response validation.',
    solution: 'A Python integration with Autodesk Platform Services covering OAuth tokens, bucket discovery and provisioning, large-file upload, and validated responses.',
    responsibilities: ['OAuth and Autodesk API integration', 'Storage discovery and provisioning', 'Large design-file upload workflow', 'Response validation and operational error handling'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'Credentials, customer files, and confidential source are not published']
  },
  'construction-estimate-automation': {
    category: 'Construction',
    industry: 'Construction estimating',
    problem: 'Construction estimates and proposals become error-prone when formulas, dropdowns, validation, and formatting are rebuilt manually.',
    solution: 'A Python-driven Google Sheets workflow that generates structured estimates and proposals from reusable formulas, validation rules, and templates.',
    responsibilities: ['Estimate and proposal structure', 'Formula and validation generation', 'Reusable formatting and templates', 'API retry handling and repeatable execution'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'Confidential estimate data and customer source are excluded']
  },
  'records-ocr-workflow': {
    category: 'Document AI',
    industry: 'Document operations',
    problem: 'Scanned records required authenticated retrieval, field extraction, validation, and delivery without turning uncertain OCR output into unchecked data.',
    solution: 'A browser and OCR workflow that captures source documents, parses fields with local-model assistance, supports review, and delivers structured results with completion alerts.',
    responsibilities: ['Authenticated browser retrieval', 'Document capture and OCR', 'Local-model field parsing', 'Review, structured delivery, and completion notifications'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'Private records, credentials, and raw source are excluded']
  },
  'tender-response-ai': {
    category: 'Document AI',
    industry: 'Tender and proposal operations',
    problem: 'Tender packages distribute questions and supporting context across office documents, making consistent response preparation slow and difficult to review.',
    solution: 'An AI-assisted document workflow that extracts questions, assembles context, drafts structured responses, and keeps a human review step before delivery.',
    responsibilities: ['Tender document ingestion', 'Question extraction and context assembly', 'Structured AI drafting', 'Human-review workflow and document handling'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'No confidential tender files or unreviewed customer content are published']
  },
  'sports-data-delivery-pipeline': {
    category: 'Data pipelines',
    industry: 'Sports analytics',
    problem: 'Multi-league player-prop data needed repeatable collection, normalization, visual reporting, persistence, and multi-channel delivery.',
    solution: 'A production-oriented Python pipeline that collects data, normalizes JSON and CSV records, generates branded reports, stores results, and routes delivery notifications.',
    responsibilities: ['Multi-source extraction', 'Normalization and validation', 'Automated visual-report generation', 'Database, Drive, Telegram, and Discord delivery'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'Private endpoints, credentials, and customer data are excluded']
  },
  'shopify-inventory-sync': {
    category: 'Ecommerce',
    industry: 'Ecommerce operations',
    problem: 'Supplier availability and Shopify variant states can drift when backorders, discontinued products, and archive rules are handled manually.',
    solution: 'A scheduled Python service that monitors supplier stock and updates Shopify product and variant state through authenticated workflows and explicit business rules.',
    responsibilities: ['Supplier monitoring', 'Variant-level inventory updates', 'Backorder, discontinued, and archive rules', 'Scheduling and operational tracking'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'Store credentials and private catalog data are excluded']
  },
  'browser-automation-desktop-console': {
    category: 'Browser automation',
    industry: 'Browser automation',
    problem: 'Authenticated browser workflows need visible operator controls, persistent execution context, status feedback, and repeatable task launching.',
    solution: 'A desktop operator console for starting and supervising session-oriented browser automation while keeping credentials and browser profiles private.',
    responsibilities: ['Operator workflow and interface', 'Authenticated session-oriented execution', 'Task launching and status feedback', 'Reusable automation and operational error handling'],
    evidence: ['Completed implementation documented as a sanitized private case study', 'Credentials, browser profiles, customer data, and private infrastructure are excluded']
  },
  'euribor-data-dashboard': {
    category: 'Finance & BI',
    industry: 'Finance and market data',
    problem: 'Official monthly rate observations needed repeatable selection, conversion, validation, and historical storage instead of manual spreadsheet updates.',
    solution: 'A FastAPI dashboard and scheduled pipeline using the official Deutsche Bundesbank API, explicit EUR360-to-EUR365 conversion, idempotent CSV history, tests, and GitHub Actions.',
    responsibilities: ['Official API integration and observation selection', 'Decimal conversion and validation rules', 'Duplicate-safe historical storage', 'Dashboard, CLI, automated tests, and scheduled execution'],
    evidence: ['Official source and calculation path are documented', 'Manual and scheduled execution are supported', 'Pytest coverage validates critical behavior']
  },
  'power-bi-equipment-data-pipeline': {
    category: 'Finance & BI',
    industry: 'Business intelligence and maintenance',
    problem: 'Equipment and maintenance records needed a consistent cloud data path before they could support dependable Power BI reporting.',
    solution: 'Python utilities prepare report-ready records, publish controlled datasets to Azure Blob Storage, validate SQL connectivity, and supply consistent inputs to Power BI models.',
    responsibilities: ['Equipment-data preparation', 'Azure Blob Storage workflow', 'SQL connectivity validation', 'Power BI-ready dataset delivery'],
    evidence: ['Cloud storage and database paths are represented without credentials', 'Structured files support repeatable downstream reporting']
  },
  'financial-document-normalization': {
    category: 'Document AI',
    industry: 'Finance and document operations',
    problem: 'Extracted financial statements were still difficult to review and load because OCR output remained in inconsistent XML structures.',
    solution: 'A deterministic post-OCR pipeline parses XML, separates financial categories, normalizes fields, and produces structured CSV deliverables for reconciliation and analysis.',
    responsibilities: ['XML parsing', 'Financial-category separation', 'Field normalization and validation', 'Review-ready CSV generation'],
    evidence: ['The public record describes the transformation path', 'Private source documents and financial records remain excluded']
  },
  'fmcsa-carrier-lead-pipeline': {
    category: 'Data pipelines',
    industry: 'Transportation and lead intelligence',
    problem: 'Recent carrier registrations needed to be selected from a large official dataset with traceable source records and repeatable filters.',
    solution: 'A public-data workflow profiles FMCSA coverage, retrieves recent records using controlled parameters, preserves raw JSON, and produces normalized CSV plus a run summary.',
    responsibilities: ['Official dataset profiling', 'Controlled API extraction', 'Raw-response preservation', 'Normalized lead export and run verification'],
    evidence: ['Raw and normalized output formats are defined', 'Dataset count and date coverage are validated before delivery']
  },
  'public-property-records-pipeline': {
    category: 'Data pipelines',
    industry: 'Real estate and public records',
    problem: 'Public parcel data needed a stable, reproducible extraction path rather than manual browsing through a county map interface.',
    solution: 'A direct ArcGIS REST workflow selects controlled parcel fields, applies stable ordering, validates response structure, and exports records for enrichment.',
    responsibilities: ['ArcGIS service discovery', 'Field and ordering design', 'Response validation', 'Structured JSON and CSV export'],
    evidence: ['Uses public records and direct service queries', 'Reproducible ordering supports comparable samples']
  },
  'healthcare-provider-directory-pipeline': {
    category: 'Healthcare data',
    industry: 'Healthcare data',
    problem: 'Healthcare practice information was split between a dynamic map and individual pages, with inconsistent field coverage.',
    solution: 'A browser and HTML-parsing workflow discovers practices, opens detail records, normalizes contact, location, service, and membership fields, and reports coverage.',
    responsibilities: ['Map-interface discovery', 'Detail-page parsing', 'Healthcare field normalization', 'Coverage reporting and reusable exports'],
    evidence: ['JSON and CSV deliverables are supported', 'Field-coverage checks expose incomplete source data']
  },
  'professional-services-directory-pipeline': {
    category: 'Browser automation',
    industry: 'Professional services data',
    problem: 'A regional professional directory required dynamic expansion, detail-page traversal, category inference, and the ability to resume long runs.',
    solution: 'A resilient Playwright pipeline discovers regions, handles dynamic UI states, extracts listing and detail fields, infers practice areas, and saves progress incrementally.',
    responsibilities: ['Regional discovery and dynamic loading', 'Listing and detail extraction', 'Service-category inference', 'Incremental state and export delivery'],
    evidence: ['Partial-run recovery is built into the workflow', 'Normalized JSON and CSV outputs support handoff']
  },
  'localized-business-directory-intelligence': {
    category: 'Browser automation',
    industry: 'Local business intelligence',
    problem: 'Dynamic multilingual listings hid contact fields and mixed structured and unstructured sources across pagination.',
    solution: 'A multistage workflow captures business links, reveals protected fields, prioritizes JSON-LD and DOM extraction, and uses a local model only to fill incomplete structured data.',
    responsibilities: ['Pagination-safe link capture', 'Contact-field reveal and detail parsing', 'JSON-LD and DOM fallback strategy', 'Local-model cleanup and incremental delivery'],
    evidence: ['Records are persisted incrementally to CSV and JSONL', 'Structured sources remain authoritative over model output']
  },
  'web-to-pdf-publishing-automation': {
    category: 'Document AI',
    industry: 'Publishing and document automation',
    problem: 'Browser-rendered pages could not be converted consistently with simple HTTP download or manual printing.',
    solution: 'A Playwright publishing utility waits for network and visual completion, applies print-ready page settings, and creates repeatable full-page PDFs.',
    responsibilities: ['Browser rendering and completion checks', 'Print layout configuration', 'Full-page PDF generation', 'Repeatable publishing workflow'],
    evidence: ['The workflow preserves rendered layout and images', 'Output no longer depends on manual browser printing']
  },
  'real-time-browser-telemetry-pipeline': {
    category: 'Browser automation',
    industry: 'Real-time data operations',
    problem: 'A fast-changing embedded interface required ordered event capture, evidence screenshots, and continuous recovery without corrupting state.',
    solution: 'A long-running Camoufox and Playwright system maintains authenticated rendering, validates event order, buffers records, posts to backend APIs, captures evidence, and isolates workloads across Linux services.',
    responsibilities: ['Persistent authenticated rendering', 'Short-interval state interpretation and ordering', 'Snapshot validation and evidence upload', 'Popup, stale-session, and service recovery'],
    evidence: ['Operated as isolated systemd services', 'Incomplete snapshots are rejected before API delivery', 'Scheduled screenshots preserve review evidence']
  }
};

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
  diagramsSection: document.getElementById('projectDiagramsSection'),
  diagrams: document.getElementById('projectDiagrams'),
  repoLink: document.getElementById('projectRepoLink'),
  related: document.getElementById('relatedProjects'),
  askButton: document.getElementById('projectAskButton'),
  fab: document.getElementById('assistantFab'),
  assistant: document.getElementById('portfolioAssistant'),
  assistantClose: document.getElementById('assistantClose'),
  assistantBody: document.getElementById('assistantBody'),
  assistantForm: document.getElementById('assistantForm'),
  assistantQuestion: document.getElementById('assistantQuestion'),
  assistantProjectLabel: document.getElementById('assistantProjectLabel'),
  visual: document.getElementById('projectVisual'),
  facts: document.getElementById('projectFacts')
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

function normalizeDiagrams(value) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .map((item) => {
      if (typeof item === 'string') {
        return {
          title: 'Architecture diagram',
          image: item,
          full: item,
          description: 'System diagram for this project.'
        };
      }
      if (!item || typeof item !== 'object') return null;
      const image = item.image || item.image_url || item.imageUrl || item.png || item.url;
      const full = item.full || item.full_url || item.fullUrl || item.svg || item.url || image;
      if (!image) return null;
      return {
        title: String(item.title || item.name || 'Architecture diagram'),
        image: String(image),
        full: String(full || image),
        description: String(item.description || item.summary || 'System diagram for this project.')
      };
    })
    .filter(Boolean);
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

function normalizeProject(project, index) {
  const topics = toArray(pick(project, ['topics', 'tags', 'keywords'], []));
  const stack = toArray(pick(project, ['stack', 'technologies', 'tech_stack'], []));
  const sourceTitle = String(pick(project, ['title', 'name', 'repo', 'repository'], `Project ${index + 1}`));
  const title = cleanDisplayTitle(sourceTitle) || sourceTitle;
  const slug = String(pick(project, ['slug', 'repo', 'id'], slugify(sourceTitle)));
  const profile = PROJECT_DETAILS[slug] || null;
  const category = profile?.category || String(pick(project, ['category', 'topic', 'domain'], topics[0] || 'Backend/API'));
  const summary = String(pick(project, ['summary', 'problem', 'readme_summary'], 'Portfolio record imported from project README.'));
  const description = String(pick(project, ['description', 'details', 'readme', 'notes'], summary));

  const normalized = {
    id: String(pick(project, ['id'], slug)),
    slug,
    title,
    sourceTitle,
    category,
    industry: profile?.industry || String(pick(project, ['industry', 'sector', 'category'], category)),
    summary,
    description,
    topics: [...new Set(topics.filter(Boolean))],
    tags: [...new Set([...topics, ...stack].filter(Boolean))].slice(0, 8),
    stack,
    repoName: String(pick(project, ['repo_name', 'repoName', 'repo'], '')),
    repoUrl: String(pick(project, ['repo_url', 'repoUrl', 'url'], '')),
    diagrams: normalizeDiagrams(pick(project, ['diagrams', 'architecture_diagrams', 'architectureDiagrams', 'diagram_url', 'diagramUrl'], [])),
    status: String(pick(project, ['status'], 'production')),
    visibility: String(pick(project, ['visibility'], 'public')),
    profile,
    featured: Boolean(profile || project.featured || index === 0)
  };
  normalized.theme = projectTheme(normalized);
  normalized.themeLabel = CATEGORY_LABELS[normalized.theme] || CATEGORY_LABELS.default;
  return normalized;
}

function projectDetailUrl(project) {
  return `project.html?project=${encodeURIComponent(project.slug || project.id)}`;
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/portfolio/projects?limit=200`, { credentials: 'omit' });
  if (!response.ok) throw new Error(`Portfolio API ${response.status}`);
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.items || data.projects || data.records || []);
  return list.map(normalizeProject).filter((project) => !EXCLUDED_SLUGS.has(project.slug));
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

function builtInDiagrams(project) {
  const projectKey = slugify(project.slug || project.id || project.title || '');
  if (projectKey !== 'trkelnit-production-platform') return [];

  return [
    {
      title: 'Production platform architecture',
      description: 'Current TrkElnIt web, portfolio, CRM, backend, browser automation, and operations architecture.',
      image: 'assets/diagrams/current-stack-map.png?v=20260722-project-specific',
      full: 'assets/diagrams/current-stack-map.png?v=20260722-project-specific'
    }
  ];
}

function compactDiagramText(value, maxLength = 24) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

function diagramItems(values, fallback = []) {
  const items = [...values, ...fallback]
    .map((value) => compactDiagramText(value))
    .filter(Boolean);
  return [...new Set(items)].slice(0, 3);
}

function stackFor(project, matcher, fallback = []) {
  return diagramItems(
    project.stack.filter((item) => matcher.test(String(item))),
    fallback
  );
}

function architectureGroup(title, items, fallback = []) {
  return {
    title: compactDiagramText(title, 20),
    items: diagramItems(items, fallback)
  };
}

function projectArchitecture(project) {
  const titleAndIndustry = [
    project.slug,
    project.title,
    project.industry,
    project.category
  ].join(' ').toLowerCase();
  const identity = [
    titleAndIndustry,
    project.tags.join(' ')
  ].join(' ').toLowerCase();
  const text = [
    identity,
    project.summary,
    project.description,
    project.stack.join(' ')
  ].join(' ').toLowerCase();
  const title = `${compactDiagramText(project.title, 62)} architecture`;
  const create = (kind, description, groups) => ({ kind, title, description, groups });

  if (builtInDiagrams(project).length) {
    return create('platform', 'Production channels, application services, data, automation, and operations.', [
      architectureGroup('Channels', ['Website', 'Portfolio', 'CRM web']),
      architectureGroup('Edge', ['Cloudflare', 'Lightsail', 'Caddy']),
      architectureGroup('Applications', ['FastAPI', 'Android CRM', 'Browser Manager']),
      architectureGroup('Data & AI', ['PostgreSQL', 'OpenAI', 'Resume Studio']),
      architectureGroup('Operations', ['GitHub Actions', 'systemd', 'Runbooks'])
    ]);
  }

  if (/autodesk|\bbim\b|\brevit\b|\bcad\b|\bdxf\b|construction|estimate/.test(titleAndIndustry)) {
    return create('construction', 'Project-specific flow for design files, construction data, processing, and reviewed outputs.', [
      architectureGroup('Design input', ['BIM / Revit files', 'Plans / PDFs', 'Estimate records']),
      architectureGroup('Ingestion', stackFor(project, /Playwright|OCR|Google/i, ['Upload / API', 'File validation'])),
      architectureGroup('Processing', stackFor(project, /Python|FastAPI|pgvector/i, ['Geometry / formulas', 'Data mapping'])),
      architectureGroup('Project data', ['Elements / quantities', 'Structured JSON', 'Sheets / DXF']),
      architectureGroup('Review output', ['Viewer / estimate', 'Exports', 'Human review'])
    ]);
  }

  if (/e-commerce|ecommerce|shopify|catalog|inventory|product|discogs|seller/.test(titleAndIndustry)) {
    return create('commerce', 'Project-specific commerce flow from supplier or catalog sources to controlled updates and reports.', [
      architectureGroup('Commerce source', ['Supplier / catalog', 'Product pages', 'Media / inventory']),
      architectureGroup('Collection', stackFor(project, /Playwright|Requests|httpx/i, ['API / browser', 'Files / feeds'])),
      architectureGroup('Processing', stackFor(project, /Python|Pandas|OpenAI|Ollama/i, ['Normalize / match', 'Business rules'])),
      architectureGroup('Commerce API', stackFor(project, /Shopify|FastAPI|Stripe/i, ['Products / variants', 'Inventory state'])),
      architectureGroup('Delivery', ['Catalog updates', 'CSV / reports', 'Operations log'])
    ]);
  }

  if (/document|ocr|pdf|questionnaire|tender|invoice|medical/.test(titleAndIndustry)) {
    return create('document-intelligence', 'Project-specific document ingestion, extraction, validation, and delivery pipeline.', [
      architectureGroup('Documents', ['PDF / images', 'Forms / records', 'Supporting files']),
      architectureGroup('Ingestion', stackFor(project, /Playwright|pypdf|OCR/i, ['Upload / retrieval', 'OCR / parsing'])),
      architectureGroup('Intelligence', stackFor(project, /OpenAI|Ollama|LLM|pgvector/i, ['Classification', 'Field extraction'])),
      architectureGroup('Validation', ['Typed fields', 'Quality warnings', 'Human review']),
      architectureGroup('Delivery', stackFor(project, /PostgreSQL|Pandas|Excel/i, ['CSV / Excel', 'Structured records']))
    ]);
  }

  if (/finance|trading|market|polymarket|alpaca|ema|price checker/.test(titleAndIndustry)) {
    return create('finance', 'Project-specific market-data, analysis, control, storage, and reporting flow.', [
      architectureGroup('Market input', ['Prices / listings', 'Ticker universe', 'Historical data']),
      architectureGroup('Acquisition', stackFor(project, /Playwright|API|Python/i, ['API / browser', 'Scheduled jobs'])),
      architectureGroup('Analysis', stackFor(project, /Pandas|Python/i, ['Signals / rules', 'Backtests'])),
      architectureGroup('Controls', ['Validation', 'Risk / limits', 'Paper execution']),
      architectureGroup('Results', ['Rankings', 'Reports / alerts', 'Stored metrics'])
    ]);
  }

  if (/scrap|browser|auto-?bot|connect bot|coverage research/.test(titleAndIndustry)) {
    return create('browser-automation', 'Project-specific browser session, extraction, processing, and delivery workflow.', [
      architectureGroup('Target', ['Authenticated pages', 'Search / listings', 'Detail records']),
      architectureGroup('Browser session', stackFor(project, /Playwright|Selenium|Camoufox/i, ['Persistent profile', 'Retries / scrolling'])),
      architectureGroup('Extraction', stackFor(project, /BeautifulSoup|OCR|Requests/i, ['DOM / API fields', 'Screenshots'])),
      architectureGroup('Processing', stackFor(project, /Pandas|OpenAI|Ollama/i, ['Normalize / dedupe', 'Validation'])),
      architectureGroup('Delivery', ['CSV / JSON', 'Sheets / CRM', 'Run logs'])
    ]);
  }

  if (/data pipeline|analytics|factors|facebook ads|sports data|lead intelligence/.test(titleAndIndustry)) {
    return create('data-pipeline', 'Project-specific collection, normalization, analysis, storage, and delivery pipeline.', [
      architectureGroup('Data sources', ['APIs / dashboards', 'Pages / feeds', 'Batch inputs']),
      architectureGroup('Collection', stackFor(project, /Playwright|Requests|httpx|Python/i, ['Scheduled extraction', 'Retries'])),
      architectureGroup('Transform', stackFor(project, /Pandas|Ollama|OpenAI/i, ['Normalize / dedupe', 'Metrics / rules'])),
      architectureGroup('Storage', stackFor(project, /PostgreSQL|Google Cloud|Docker/i, ['CSV / database', 'Run state'])),
      architectureGroup('Delivery', stackFor(project, /Telegram|Google/i, ['Reports / visuals', 'Sheets / messages']))
    ]);
  }

  if (/android|mobile|kotlin|jetpack|retrofit/.test(titleAndIndustry)) {
    return create('mobile', 'Project-specific mobile-client, API, business-data, notification, and release flow.', [
      architectureGroup('Mobile client', stackFor(project, /Kotlin|Compose|Android/i, ['Staff interface', 'Local state'])),
      architectureGroup('API client', stackFor(project, /Retrofit|Firebase/i, ['Auth headers', 'JSON requests'])),
      architectureGroup('Backend', stackFor(project, /FastAPI|Python/i, ['Protected APIs', 'Validation'])),
      architectureGroup('Business data', stackFor(project, /PostgreSQL/i, ['Clients / meetings', 'Invoices / status'])),
      architectureGroup('Operations', ['Notifications', 'Release metadata', 'APK updates'])
    ]);
  }

  if (/\bai\b|llm|agent|chat intake/.test(titleAndIndustry) || /openai|ollama|rag|n8n/.test(text)) {
    return create('applied-ai', 'Project-specific context, orchestration, model, storage, and reviewed-action flow.', [
      architectureGroup('Context', ['User / lead input', 'Documents / web', 'Business rules']),
      architectureGroup('Orchestration', stackFor(project, /FastAPI|LangGraph|n8n|Python/i, ['Workflow state', 'Guardrails'])),
      architectureGroup('Model layer', stackFor(project, /OpenAI|Ollama|LLM|LangChain/i, ['Prompt / retrieval', 'Typed response'])),
      architectureGroup('Memory & data', stackFor(project, /PostgreSQL|pgvector/i, ['Context records', 'Audit state'])),
      architectureGroup('Reviewed action', ['Answer / route', 'CRM / notification', 'Human escalation'])
    ]);
  }

  if (/crm|meeting|booking|scheduling|operations|messaging/.test(titleAndIndustry)) {
    return create('business-operations', 'Project-specific intake, API, business-data, staff-tool, and integration flow.', [
      architectureGroup('Intake', ['Forms / requests', 'Bookings / messages', 'Staff actions']),
      architectureGroup('API layer', stackFor(project, /FastAPI|Python/i, ['Authentication', 'Validation'])),
      architectureGroup('Business data', stackFor(project, /PostgreSQL/i, ['Records / status', 'Scheduling state'])),
      architectureGroup('Staff tools', stackFor(project, /JavaScript|Kotlin|Android/i, ['Web / mobile UI', 'Admin review'])),
      architectureGroup('Integrations', stackFor(project, /Stripe|Resend|Firebase|Webhook/i, ['Email / alerts', 'External APIs']))
    ]);
  }

  return create('software-workflow', 'Project-specific inputs, implementation stack, data handling, delivery, and operations.', [
    architectureGroup('Inputs', ['User request', 'Source files', 'External records']),
    architectureGroup('Application', project.stack.slice(0, 3), ['Python service', 'Workflow logic']),
    architectureGroup('Processing', ['Validation', 'Transformation', 'Business rules']),
    architectureGroup('Outputs', ['Structured records', 'Exports / UI', 'Client deliverable']),
    architectureGroup('Operations', ['Configuration', 'Testing / logs', 'Deployment / handoff'])
  ]);
}

function renderArchitectureSvg(project) {
  const diagram = projectArchitecture(project);
  const groups = diagram.groups.slice(0, 5);
  const nodeWidth = 172;
  const nodeHeight = 122;
  const nodeGap = 54;
  const startX = 48;
  const startY = 112;
  const nodes = groups.map((group, index) => ({
    ...group,
    x: startX + index * (nodeWidth + nodeGap),
    y: startY,
    index
  }));

  const arrows = nodes.slice(0, -1).map((node, index) => {
    const next = nodes[index + 1];
    const y = node.y + nodeHeight / 2;
    return `<path d="M ${node.x + nodeWidth + 12} ${y} L ${next.x - 12} ${y}" class="architecture-arrow" marker-end="url(#arrowhead)" />`;
  }).join('');

  return `
    <article class="project-architecture-diagram" data-architecture-kind="${escapeHtml(diagram.kind)}" aria-label="${escapeHtml(diagram.title)}">
      <div class="project-architecture-diagram-head">
        <strong>${escapeHtml(diagram.title)}</strong>
        <span>${escapeHtml(diagram.description)}</span>
      </div>
      <div class="project-architecture-canvas" role="img" aria-label="${escapeHtml(diagram.title)} diagram">
        <svg viewBox="0 0 1120 310" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827"></path>
            </marker>
          </defs>
          <rect x="1" y="1" width="1118" height="308" rx="20" class="architecture-frame"></rect>
          <text x="38" y="46" class="architecture-title">${escapeHtml(diagram.title)}</text>
          <text x="38" y="72" class="architecture-subtitle">${escapeHtml(diagram.description)}</text>
          ${arrows}
          ${nodes.map((node) => `
            <g>
              <rect x="${node.x}" y="${node.y}" width="${nodeWidth}" height="${nodeHeight}" rx="16" class="architecture-node"></rect>
              <circle cx="${node.x + 22}" cy="${node.y + 24}" r="12" class="architecture-number-bg"></circle>
              <text x="${node.x + 22}" y="${node.y + 28}" class="architecture-number">${String(node.index + 1).padStart(2, '0')}</text>
              <text x="${node.x + 42}" y="${node.y + 29}" class="architecture-node-title">${escapeHtml(node.title)}</text>
              ${node.items.slice(0, 3).map((item, itemIndex) => `
                <text x="${node.x + 18}" y="${node.y + 62 + itemIndex * 21}" class="architecture-node-line">${escapeHtml(item)}</text>
              `).join('')}
            </g>
          `).join('')}
        </svg>
      </div>
    </article>
  `;
}

function renderDiagrams(project) {
  if (!els.diagramsSection || !els.diagrams) return;

  const projectDiagrams = Array.isArray(project.diagrams) ? project.diagrams : [];
  const diagrams = projectDiagrams.length ? projectDiagrams : builtInDiagrams(project);
  const architectureHtml = renderArchitectureSvg(project);

  els.diagramsSection.hidden = false;
  const imageDiagrams = diagrams.map((diagram) => `
    <figure class="project-diagram-card">
      <a class="project-diagram-link" href="${escapeHtml(diagram.full || diagram.image)}" target="_blank" rel="noreferrer">
        <img src="${escapeHtml(diagram.image)}" alt="${escapeHtml(diagram.title)}" loading="lazy" />
      </a>
      <figcaption>
        <strong>${escapeHtml(diagram.title)}</strong>
        <span>${escapeHtml(diagram.description)}</span>
        <a href="${escapeHtml(diagram.full || diagram.image)}" target="_blank" rel="noreferrer">Open full diagram</a>
      </figcaption>
    </figure>
  `).join('');
  els.diagrams.innerHTML = architectureHtml + imageDiagrams;
}

function renderDescription(project) {
  if (project.profile) {
    els.description.innerHTML = `
      <section class="project-copy-section">
        <h2>Problem</h2>
        <p>${escapeHtml(project.profile.problem)}</p>
      </section>
      <section class="project-copy-section">
        <h2>Solution</h2>
        <p>${escapeHtml(project.profile.solution)}</p>
      </section>
      <section class="project-copy-section">
        <h2>Responsibilities</h2>
        ${renderList(project.profile.responsibilities)}
      </section>
      <section class="project-copy-section project-evidence-section">
        <h2>Delivery evidence</h2>
        ${renderList(project.profile.evidence)}
      </section>
    `;
    return;
  }

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

function renderProjectOverview(project) {
  const delivery = project.status.toLowerCase() === 'production' ? 'Production operated' : 'Delivered case study';
  const implementation = project.repoUrl && project.visibility !== 'private' ? 'Public implementation' : 'Private implementation';
  const stackPreview = project.stack.slice(0, 3);

  if (els.visual) {
    els.visual.dataset.theme = project.theme;
    els.visual.innerHTML = `
      <div class="project-detail-visual-head">
        <span>${escapeHtml(project.themeLabel)}</span>
        <strong>${escapeHtml(delivery)}</strong>
      </div>
      <div class="project-detail-visual-core" aria-hidden="true">
        <div class="project-detail-visual-icon">${categoryIcon(project)}</div>
        <div class="project-detail-visual-rings"><i></i><i></i><i></i></div>
      </div>
      <div class="project-detail-system-flow" aria-label="System delivery flow">
        <span>Input</span><i></i><span>Processing</span><i></i><span>Delivery</span>
      </div>
      <div class="project-detail-visual-stack">
        ${(stackPreview.length ? stackPreview : [project.category]).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
      </div>
    `;
  }

  if (els.facts) {
    const facts = [
      ['Delivery', delivery],
      ['Domain', project.industry],
      ['Technology', `${project.stack.length || project.tags.length} documented tools`],
      ['Access', implementation]
    ];
    els.facts.innerHTML = facts.map(([label, value]) => `
      <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
    `).join('');
  }
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
    ? related.map((item, index) => {
      const detailUrl = projectDetailUrl(item);
      const recordType = item.status.toLowerCase() === 'production' ? 'Production' : 'Delivered';
      return `
      <article class="project-card" data-theme="${escapeHtml(item.theme)}" data-project-url="${escapeHtml(detailUrl)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(item.title)} project page">
        <div class="project-card-visual" aria-hidden="true">
          <span class="project-visual-type">${escapeHtml(item.themeLabel)}</span>
          <span class="project-visual-index">${String(index + 1).padStart(2, '0')}</span>
          <div class="project-visual-icon">${categoryIcon(item)}</div>
          <div class="project-visual-flow"><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="project-card-body">
          <div class="project-head">
            <p class="project-industry">${escapeHtml(item.industry)}</p>
            <h2>${escapeHtml(item.title)}</h2>
          </div>
          <p class="project-summary">${escapeHtml(item.summary)}</p>
          <div class="project-tags">${(item.tags.length ? item.tags : item.stack).slice(0, 5).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
          <div class="project-card-footer">
            <span class="project-record-type"><i></i>${escapeHtml(recordType)}</span>
            <a class="project-link" href="${escapeHtml(detailUrl)}">Open case study →</a>
          </div>
        </div>
      </article>
    `;
    }).join('')
    : '<p class="empty-state">No related project records found.</p>';

  els.related.querySelectorAll('.project-card[data-project-url]').forEach((card) => {
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

function renderProject(project) {
  state.project = project;
  document.title = `TrkElnIt Portfolio | ${project.title}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', project.summary.slice(0, 155));
  const projectUrl = `https://trkelnit.github.io/project.html?project=${encodeURIComponent(project.slug)}`;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', projectUrl);
  const socialValues = {
    'meta[property="og:title"]': project.title,
    'meta[property="og:description"]': project.summary.slice(0, 200),
    'meta[property="og:url"]': projectUrl
  };
  Object.entries(socialValues).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  });
  const schema = document.getElementById('projectSchema');
  if (schema) {
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.summary,
      url: projectUrl,
      creator: { '@type': 'Organization', name: 'TrkElnIt', url: 'https://trkelnit.com/' },
      keywords: [...new Set([...project.topics, ...project.stack])].join(', '),
      genre: project.category
    });
  }

  els.title.textContent = project.title;
  els.summary.textContent = project.summary;
  els.industry.textContent = project.industry;
  els.assistantProjectLabel.textContent = project.title;
  renderProjectOverview(project);
  renderDescription(project);
  renderTags(els.stack, project.stack, 'Stack data is not listed for this project.');
  renderTags(els.topics, project.topics.length ? project.topics : project.tags, 'Topics are not listed for this project.');
  renderDiagrams(project);
  els.meta.innerHTML = [
    ['Industry', project.industry],
    ['Delivery record', project.status === 'production' ? 'Production' : 'Sanitized case study'],
    ['Source access', project.repoUrl && project.visibility !== 'private' ? 'Public repository' : 'Private implementation'],
    ['Confidentiality', 'Credentials and customer data excluded']
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
  if (els.visual) els.visual.hidden = true;
  if (els.facts) els.facts.hidden = true;
  if (els.diagramsSection) els.diagramsSection.hidden = true;
  if (els.diagrams) els.diagrams.innerHTML = '';
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
