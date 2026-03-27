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

  statusNode.textContent = 'Fetching order and payment details...';

  try {
    const [orderResp, paymentResp, bookingResp] = await Promise.all([
      fetch(`${API_BASE_URL}/payments/orders/${orderId}`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/payments/orders/${orderId}/payment`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/chat/meeting-bookings/by-order/${orderId}`, { credentials: 'include' })
    ]);

    if (!orderResp.ok || !paymentResp.ok) {
      throw new Error('Unable to load the Stripe order details from the CRM.');
    }

    const order = await orderResp.json();
    const payment = await paymentResp.json();
    const booking = bookingResp.ok ? await bookingResp.json() : null;

    copyNode.textContent = booking
      ? 'Your payment has been recorded and the meeting booking is confirmed.'
      : 'The order has been recorded in the TrkElnIt CRM. Use the references below if you need support or want to confirm delivery timing.';
    statusNode.textContent = `Order status: ${order.status} • Payment status: ${payment.status}`;

    const details = [
      renderDetail('Order ID', order.id),
      renderDetail('Package', order.package_name),
      renderDetail('Amount', `${order.amount} ${order.currency}`),
      renderDetail('Customer', order.customer_name),
      renderDetail('Stripe Session', shortValue(sessionId || order.stripe_session_id)),
      renderDetail('Payment Intent', shortValue(payment.provider_payment_id)),
      renderDetail('Created', formatTimestamp(order.created_at)),
      renderDetail('Paid At', formatTimestamp(payment.paid_at))
    ];

    if (booking) {
      details.splice(
        3,
        0,
        renderDetail('Meeting Day', booking.meeting_day),
        renderDetail('Meeting Time', booking.meeting_time),
        renderDetail('Duration', `${booking.duration_minutes} minutes`),
        renderDetail('Booking Status', booking.status)
      );
    }

    detailsNode.innerHTML = details.join('');
  } catch (error) {
    statusNode.textContent = error.message;
    copyNode.textContent = 'Stripe redirected successfully. If the CRM details are not ready yet, use the email receipt as confirmation and contact TrkElnIt with the order reference if needed.';
    detailsNode.innerHTML = [
      renderDetail('Order ID', orderId),
      renderDetail('Stripe Session', shortValue(sessionId))
    ].join('');
  }
}

loadPaymentState();
