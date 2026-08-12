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
    diagrams: normalizeDiagrams(pick(project, ['diagrams', 'architecture_diagrams', 'architectureDiagrams', 'diagram_url', 'diagramUrl'], [])),
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
  renderDiagrams(project);
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
  renderDiagrams({ diagrams: [] });
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
