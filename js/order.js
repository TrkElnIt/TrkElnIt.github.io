const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:8000';
const packageSelect = document.getElementById('package');
const summary = document.getElementById('order-summary');
const form = document.getElementById('order-form');
const submitButton = document.getElementById('order-submit');
const payButton = document.getElementById('order-pay');
const statusEl = document.getElementById('order-status');

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

function buildPayload() {
  const data = new FormData(form);
  const packageName = data.get('package') || 'Custom solution';
  const details = PACKAGE_DETAILS[packageName] || PACKAGE_DETAILS['Custom solution'];
  return {
    customer_name: data.get('company') || 'Website customer',
    customer_email: data.get('email') || '',
    customer_company: data.get('company') || '',
    service_type: details.service_type,
    package_name: packageName,
    description: data.get('brief') || `Budget range: ${data.get('budget') || 'Not specified'}`,
    amount: details.amount,
    currency: details.currency,
    source: 'website',
  };
}

if (packageSelect && summary) {
  const updateSummary = () => {
    const value = packageSelect.value || 'Custom solution';
    const details = PACKAGE_DETAILS[value] || PACKAGE_DETAILS['Custom solution'];
    summary.textContent = `Selected engagement: ${value} | Deposit: ${details.amount} ${details.currency}`;
  };
  packageSelect.addEventListener('change', updateSummary);
  updateSummary();
}

if (form && submitButton) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload.customer_email) {
      setOrderStatus('Email is required.', true);
      return;
    }
    submitButton.disabled = true;
    setOrderStatus('Submitting order request...');
    try {
      const resp = await fetch(`${API_BASE_URL}/payments/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || `Order request failed (${resp.status})`);
      }
      setOrderStatus(`Order request saved. Reference: ${data.id}`);
    } catch (err) {
      setOrderStatus(err.message || 'Order request failed.', true);
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (form && payButton) {
  payButton.addEventListener('click', async () => {
    const payload = buildPayload();
    if (!payload.customer_email) {
      setOrderStatus('Email is required before Stripe checkout.', true);
      return;
    }
    payButton.disabled = true;
    setOrderStatus('Redirecting to Stripe checkout...');
    try {
      await window.startStripeCheckout('custom-order', payload);
    } catch (err) {
      setOrderStatus(err.message || 'Stripe checkout failed.', true);
    } finally {
      payButton.disabled = false;
    }
  });
}
