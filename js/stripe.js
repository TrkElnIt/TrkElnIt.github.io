window.startStripeCheckout = async function startStripeCheckout(plan) {
  const notice = document.getElementById('stripe-status');
  if (notice) {
    notice.textContent = `Stripe checkout backend is not wired yet. Requested plan: ${plan}.`;
  }
};
