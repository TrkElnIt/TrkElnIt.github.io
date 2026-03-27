import { API_BASE_URL } from './apiConfig.js';

const selected = {
  day: null,
  dayLabel: null,
  time: null,
  duration: null,
  price: null,
};

let availabilityDays = [];

const DURATION_PRICES = {
  15: 0,
  30: 25,
  45: 50,
  60: 75,
};

const dayGrid = document.getElementById('meeting-day-grid');
const durationButtons = Array.from(document.querySelectorAll('[data-duration]'));
const timeGrid = document.getElementById('meeting-time-grid');
const summaryDay = document.getElementById('meeting-summary-day');
const summaryTime = document.getElementById('meeting-summary-time');
const summaryDuration = document.getElementById('meeting-summary-duration');
const summaryPrice = document.getElementById('meeting-summary-price');
const confirmLink = document.getElementById('meeting-confirm');
const bookingStatus = document.getElementById('meeting-booking-status');
const nameInput = document.getElementById('meeting-name');
const emailInput = document.getElementById('meeting-email');
const companyInput = document.getElementById('meeting-company');
const subjectInput = document.getElementById('meeting-subject');
let availabilityLoadFailed = false;

function getSelectedDayData() {
  return availabilityDays.find((day) => day.date === selected.day) || null;
}

function getSelectedSlot() {
  const day = getSelectedDayData();
  if (!day) return null;
  return day.slots.find((slot) => slot.time === selected.time) || null;
}

function setActive(buttons, activeValue, getValue) {
  buttons.forEach((button) => {
    button.classList.toggle('is-active', getValue(button) === activeValue);
  });
}

function syncDurationButtons() {
  const selectedSlot = getSelectedSlot();
  durationButtons.forEach((button) => {
    const duration = Number(button.dataset.duration);
    const allowed =
      !availabilityLoadFailed &&
      !!selected.day &&
      (!!selectedSlot && selectedSlot.supported_durations.includes(duration));
    button.disabled = !allowed;
    button.style.opacity = allowed ? '1' : '0.45';
    button.style.cursor = allowed ? 'pointer' : 'not-allowed';
  });

  if (selectedSlot && selected.duration && !selectedSlot.supported_durations.includes(selected.duration)) {
    selected.duration = null;
    selected.price = null;
  }
}

function updateSummary() {
  summaryDay.textContent = selected.dayLabel || 'Choose a day';
  summaryTime.textContent = selected.time || 'Choose an hour';
  summaryDuration.textContent = selected.duration ? `${selected.duration} minutes` : 'Choose a duration';
  summaryPrice.textContent = selected.price === null ? '-' : selected.price === 0 ? 'Free' : `$${selected.price}`;

  confirmLink.disabled = availabilityLoadFailed || !(selected.day && selected.time && selected.duration);
}

function renderDays() {
  dayGrid.innerHTML = '';

  if (!availabilityDays.length) {
    dayGrid.innerHTML = '<p class="section-copy">No available days are configured right now. Check back later or contact TrkElnIt directly.</p>';
    return;
  }

  availabilityDays.forEach((day) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'meeting-chip';
    button.textContent = day.label;
    button.dataset.date = day.date;
    button.addEventListener('click', () => {
      selected.day = day.date;
      selected.dayLabel = day.label;
      selected.time = null;
      renderDays();
      renderTimes();
      syncDurationButtons();
      updateSummary();
    });
    if (selected.day === day.date) {
      button.classList.add('is-active');
    }
    dayGrid.appendChild(button);
  });
}

function renderTimes() {
  timeGrid.innerHTML = '';
  const day = getSelectedDayData();
  if (!day) {
    timeGrid.innerHTML = '<p class="section-copy">Choose a day first.</p>';
    return;
  }

  const slots = selected.duration
    ? day.slots.filter((slot) => slot.supported_durations.includes(selected.duration))
    : day.slots;

  if (!slots.length) {
    timeGrid.innerHTML = '<p class="section-copy">No hours are available for this selection.</p>';
    return;
  }

  slots.forEach((slot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'meeting-chip';
    button.textContent = slot.time;
    button.dataset.time = slot.time;
    button.addEventListener('click', () => {
      selected.time = slot.time;
      renderTimes();
      syncDurationButtons();
      updateSummary();
    });
    if (selected.time === slot.time) {
      button.classList.add('is-active');
    }
    timeGrid.appendChild(button);
  });
}

durationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const duration = Number(button.dataset.duration);
    if (button.disabled) return;
    selected.duration = duration;
    selected.price = DURATION_PRICES[duration] ?? Number(button.dataset.price);
    renderTimes();
    syncDurationButtons();
    setActive(durationButtons, selected.duration, (node) => Number(node.dataset.duration));
    updateSummary();
  });
});

async function loadPrefill() {
  try {
    const resp = await fetch(`${API_BASE_URL}/chat/meeting-bookings/prefill`, {
      credentials: 'include',
    });
    if (!resp.ok) return;
    const data = await resp.json();
    if (data.name) nameInput.value = data.name;
    if (data.email) emailInput.value = data.email;
    if (data.company) companyInput.value = data.company;
    if (data.subject) subjectInput.value = data.subject;
  } catch {
    // Manual booking should still work without prefill.
  }
}

async function loadAvailability() {
  try {
    const resp = await fetch(`${API_BASE_URL}/calendar/availability`, {
      credentials: 'include',
    });
    if (!resp.ok) {
      throw new Error(`Availability error ${resp.status}`);
    }
    const data = await resp.json();
    availabilityLoadFailed = false;
    availabilityDays = data.days || [];
    renderDays();
    renderTimes();
    syncDurationButtons();
    updateSummary();
  } catch (err) {
    availabilityLoadFailed = true;
    availabilityDays = [];
    selected.day = null;
    selected.dayLabel = null;
    selected.time = null;
    selected.duration = null;
    selected.price = null;
    dayGrid.innerHTML = '<p class="section-copy">Availability could not be loaded right now.</p>';
    timeGrid.innerHTML = '<p class="section-copy">Hours will appear after availability is loaded and a day is selected.</p>';
    syncDurationButtons();
    updateSummary();
    bookingStatus.textContent = err.message || 'Availability could not be loaded.';
    bookingStatus.classList.remove('hidden');
  }
}

async function submitBooking() {
  if (!(selected.day && selected.time && selected.duration)) {
    bookingStatus.textContent = 'Select day, time, and duration first.';
    bookingStatus.classList.remove('hidden');
    return;
  }

  if (!nameInput.value.trim() || !emailInput.value.trim() || !companyInput.value.trim()) {
    bookingStatus.textContent = 'Enter your name, email, and company before confirming.';
    bookingStatus.classList.remove('hidden');
    return;
  }

  confirmLink.disabled = true;
  bookingStatus.textContent = 'Saving booking...';
  bookingStatus.classList.remove('hidden');

  try {
    const resp = await fetch(`${API_BASE_URL}/chat/meeting-bookings`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        company: companyInput.value.trim(),
        subject: subjectInput.value.trim() || null,
        day: selected.dayLabel,
        time: selected.time,
        duration_minutes: selected.duration,
        price: selected.price,
      }),
    });
    const payload = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(payload.detail || `Booking error ${resp.status}`);
    }
    const booking = payload;
    if (booking.price > 0) {
      bookingStatus.textContent = 'Booking saved. Redirecting to Stripe checkout...';
      const checkoutResp = await fetch(`${API_BASE_URL}/chat/meeting-bookings/${booking.id}/checkout`, {
        method: 'POST',
        credentials: 'include',
      });
      const checkoutData = await checkoutResp.json().catch(() => ({}));
      if (!checkoutResp.ok) {
        throw new Error(checkoutData.detail || `Stripe checkout error ${checkoutResp.status}`);
      }
      if (!checkoutData.checkout_url) {
        throw new Error('Stripe checkout URL was not returned.');
      }
      window.location.href = checkoutData.checkout_url;
      return;
    }

    bookingStatus.textContent = 'Booking saved. Your free 15-minute meeting is confirmed pending review.';
  } catch (err) {
    bookingStatus.textContent = err.message || 'Failed to save booking.';
  } finally {
    confirmLink.disabled = false;
  }
}

confirmLink.addEventListener('click', submitBooking);

syncDurationButtons();
loadPrefill();
loadAvailability();
updateSummary();
