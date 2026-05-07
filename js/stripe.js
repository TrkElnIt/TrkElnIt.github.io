function setStripeNotice(message, isError = false) {
  const notice = document.getElementById('stripe-status');
  if (!notice) return;
  notice.textContent = message;
  notice.style.color = isError ? '#ff6b6b' : '';
}

window.startStripeCheckout = async function startStripeCheckout() {
  setStripeNotice(
    'Online payment is disabled for now. Please request a quote and TrkElnIt will follow up by email.',
    true,
  );
};
