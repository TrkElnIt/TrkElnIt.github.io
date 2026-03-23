const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:8000';

const PACKAGE_CATALOG = {
  discovery: {
    service_type: 'architecture',
    package_name: 'Discovery + Architecture',
    amount: '250.00',
    currency: 'USD',
    description: 'Workflow mapping, system design, and implementation plan.',
  },
  'automation-build': {
    service_type: 'automation',
    package_name: 'Automation Build',
    amount: '1200.00',
    currency: 'USD',
    description: 'Browser automation, data extraction, APIs, and reporting layers.',
  },
  'private-ai': {
    service_type: 'ai',
    package_name: 'Private AI Workspace',
    amount: '1500.00',
    currency: 'USD',
    description: 'Task-specific AI over client, invoice, finance, or document data.',
  },
};

function setStripeNotice(message, isError = false) {
  const notice = document.getElementById('stripe-status');
  if (!notice) return;
  notice.textContent = message;
  notice.style.color = isError ? '#ff6b6b' : '';
}

window.startStripeCheckout = async function startStripeCheckout(plan, overrides = {}) {
  const selected = PACKAGE_CATALOG[plan] || {};
  const payload = {
    customer_name: overrides.customer_name || 'Website customer',
    customer_email: overrides.customer_email || 'orders@trkelnit.local',
    customer_company: overrides.customer_company || '',
    service_type: overrides.service_type || selected.service_type || 'custom',
    package_name: overrides.package_name || selected.package_name || plan || 'Custom order',
    description: overrides.description || selected.description || 'Stripe checkout from TrkElnIt website',
    amount: overrides.amount || selected.amount || '250.00',
    currency: overrides.currency || selected.currency || 'USD',
    source: overrides.source || 'website',
  };

  setStripeNotice('Preparing Stripe checkout...');

  try {
    const resp = await fetch(`${API_BASE_URL}/payments/stripe/checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.detail || `Stripe checkout failed (${resp.status})`);
    }
    if (!data.checkout_url) {
      throw new Error('Stripe checkout URL was not returned');
    }
    window.location.href = data.checkout_url;
  } catch (err) {
    setStripeNotice(err.message || 'Stripe checkout failed.', true);
    throw err;
  }
};
