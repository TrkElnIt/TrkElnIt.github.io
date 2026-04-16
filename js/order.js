const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:8000';
const packageSelect = document.getElementById('package');
const summary = document.getElementById('order-summary');
const form = document.getElementById('order-form');
const submitButton = document.getElementById('order-submit');
const statusEl = document.getElementById('order-status');
const attachmentInput = document.getElementById('order-attachments');
const attachmentStatusEl = document.getElementById('order-attachment-status');

const PACKAGE_DETAILS = {
  'Discovery + Architecture': {
    service_type: 'architecture',
    amount: '250.00',
    currency: 'USD',
  },
  'Automation Build': {
    service_type: 'automation',
    amount: '1200.00',
    currency: 'USD',
  },
  'Private AI Workspace': {
    service_type: 'ai',
    amount: '1500.00',
    currency: 'USD',
  },
  'Custom solution': {
    service_type: 'custom',
    amount: '250.00',
    currency: 'USD',
  },
};

function setOrderStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#ff6b6b' : '';
}

function getAttachmentLabel() {
  if (!attachmentInput?.files?.length) return 'No files attached';
  if (attachmentInput.files.length === 1) {
    return `1 file attached: ${attachmentInput.files[0].name}`;
  }
  return `${attachmentInput.files.length} files attached`;
}

function updateAttachmentState() {
  if (!attachmentStatusEl) return;
  attachmentStatusEl.textContent = getAttachmentLabel();
}

function updateSummary() {
  if (!packageSelect || !summary) return;
  const value = packageSelect.value || 'Custom solution';
  summary.textContent = `Selected engagement: ${value} | ${getAttachmentLabel()}`;
}

function buildPayload() {
  const data = new FormData(form);
  const packageName = data.get('package') || 'Custom solution';
  const details = PACKAGE_DETAILS[packageName] || PACKAGE_DETAILS['Custom solution'];
  const brief = data.get('brief') || '';
  const budget = data.get('budget') || 'Not specified';
  return {
    customer_name: data.get('company') || 'Website customer',
    customer_email: data.get('email') || '',
    customer_company: data.get('company') || '',
    service_type: details.service_type,
    package_name: packageName,
    description: `${brief}${brief ? '\n\n' : ''}Budget range: ${budget}`,
    amount: details.amount,
    currency: details.currency,
    source: 'website',
    budget,
  };
}

if (packageSelect && summary) {
  packageSelect.addEventListener('change', updateSummary);
  attachmentInput?.addEventListener('change', () => {
    updateAttachmentState();
    updateSummary();
  });
  updateSummary();
}

updateAttachmentState();

if (form && submitButton) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload.customer_email) {
      setOrderStatus('Email is required.', true);
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    setOrderStatus('Submitting your request...');
    try {
      const requestBody = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== 'budget') {
          requestBody.append(key, value);
        }
      });
      if (attachmentInput?.files?.length) {
        Array.from(attachmentInput.files).forEach((file) => {
          requestBody.append('attachments', file);
        });
      }
      const resp = await fetch(`${API_BASE_URL}/payments/orders`, {
        method: 'POST',
        body: requestBody,
      });
      const responseText = await resp.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          data = { detail: responseText };
        }
      }
      if (!resp.ok) {
        const detailMessage = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg || item.detail || JSON.stringify(item)).join(', ')
          : data.detail;
        throw new Error(detailMessage || `Request failed (${resp.status})`);
      }
      form.reset();
      updateAttachmentState();
      updateSummary();
      setOrderStatus('Request received. We will review it and reply by email.');
    } catch (err) {
      setOrderStatus(err.message || 'Unable to submit your request right now.', true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit request';
    }
  });
}
