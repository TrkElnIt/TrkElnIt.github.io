import { API_BASE_URL } from './apiConfig.js';

const params = new URLSearchParams(window.location.search);
const orderId = params.get('order_id');
const sessionId = params.get('session_id');

const copyNode = document.getElementById('payment-success-copy');
const statusNode = document.getElementById('payment-success-status');
const detailsNode = document.getElementById('payment-success-details');

function shortValue(value) {
  if (!value) return 'Not available';
  return value.length <= 28 ? value : `${value.slice(0, 24)}...`;
}

function formatTimestamp(value) {
  if (!value) return 'Not available';
  return value.replace('T', ' ').split('.')[0];
}

function renderDetail(label, value) {
  return `
    <div style="padding:16px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(255,255,255,.04);">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#9d9d9d;margin-bottom:6px;">${label}</div>
      <div style="font-size:18px;font-weight:700;color:#f1f1f1;">${value}</div>
    </div>
  `;
}

async function loadPaymentState() {
  if (!orderId) {
    statusNode.textContent = 'No order reference was provided in the Stripe return URL.';
    copyNode.textContent = 'The payment page returned successfully, but the CRM cannot resolve the order without an order reference.';
    return;
  }

  copyNode.textContent = 'Stripe confirmed the payment. Your meeting is confirmed. A receipt has been emailed to you, including a PDF attachment.';
  statusNode.textContent = 'Payment received. Loading booking details...';

  try {
    if (!sessionId) {
      throw new Error('Missing Stripe session reference.');
    }

    const successResp = await fetch(
      `${API_BASE_URL}/payments/public/success-details?order_id=${encodeURIComponent(orderId)}&session_id=${encodeURIComponent(sessionId)}`,
      { credentials: 'include' }
    );

    if (!successResp.ok) {
      throw new Error('Unable to load the Stripe order details from the CRM.');
    }

    const details = await successResp.json();
    const booking = details.booking || null;

    copyNode.textContent = booking
      ? 'Your payment has been recorded and the meeting booking is confirmed.'
      : 'The order has been recorded by TrkElnIt. Use the references below if you need support or want to confirm delivery timing.';
    statusNode.textContent = `Order status: ${details.order_status} • Payment status: ${details.payment_status}`;

    const detailCards = [
      renderDetail('Order ID', details.order_id),
      renderDetail('Package', details.package_name),
      renderDetail('Amount', `${details.amount} ${details.currency}`),
      renderDetail('Customer', details.customer_name),
      renderDetail('Stripe Session', shortValue(sessionId || details.stripe_session_id)),
      renderDetail('Payment Intent', shortValue(details.stripe_payment_intent_id)),
      renderDetail('Created', formatTimestamp(details.created_at)),
      renderDetail('Paid At', formatTimestamp(details.paid_at))
    ];

    if (booking) {
      detailCards.splice(
        3,
        0,
        renderDetail('Meeting Day', booking.meeting_day),
        renderDetail('Meeting Time', booking.meeting_time),
        renderDetail('Duration', `${booking.duration_minutes} minutes`),
        renderDetail('Booking Status', booking.status)
      );
    }

    detailsNode.innerHTML = detailCards.join('');
  } catch (error) {
    statusNode.textContent = 'Payment received. Detailed CRM fields are not available on this page yet.';
    copyNode.textContent = 'Your meeting payment is confirmed. Check your email for the receipt and attached PDF. Contact TrkElnIt with the order reference if you need support.';
    detailsNode.innerHTML = [
      renderDetail('Order ID', orderId),
      renderDetail('Stripe Session', shortValue(sessionId))
    ].join('');
  }
}

loadPaymentState();
