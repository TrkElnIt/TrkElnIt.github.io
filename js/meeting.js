import { API_BASE_URL } from './apiConfig.js';

const DAY_SLOTS = {
  'Mon, Mar 30': ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
  'Tue, Mar 31': ['9:00 AM', '11:00 AM', '1:30 PM', '4:00 PM'],
  'Wed, Apr 1': ['9:30 AM', '12:00 PM', '2:30 PM', '5:00 PM'],
  'Thu, Apr 2': ['10:30 AM', '1:00 PM', '3:30 PM', '6:00 PM'],
  'Fri, Apr 3': ['9:00 AM', '11:30 AM', '1:00 PM', '3:00 PM'],
};

const selected = {
  day: null,
  time: null,
  duration: null,
  price: null,
};

const dayButtons = Array.from(document.querySelectorAll('[data-day]'));
const durationButtons = Array.from(document.querySelectorAll('[data-duration]'));
const timeGrid = document.getElementById('meeting-time-grid');
const summaryDay = document.getElementById('meeting-summary-day');
const summaryTime = document.getElementById('meeting-summary-time');
const summaryDuration = document.getElementById('meeting-summary-duration');
const summaryPrice = document.getElementById('meeting-summary-price');
const confirmLink = document.getElementById('meeting-confirm');
const bookingStatus = document.getElementById('meeting-booking-status');

function setActive(buttons, activeButton) {
  buttons.forEach((button) => {
    button.classList.toggle('is-active', button === activeButton);
  });
}

function updateSummary() {
  summaryDay.textContent = selected.day || 'Choose a day';
  summaryTime.textContent = selected.time || 'Choose an hour';
  summaryDuration.textContent = selected.duration ? `${selected.duration} minutes` : 'Choose a duration';
  summaryPrice.textContent = selected.price === null ? '-' : selected.price === 0 ? 'Free' : `$${selected.price}`;

  confirmLink.disabled = !(selected.day && selected.time && selected.duration);
}

function renderTimes(day) {
  timeGrid.innerHTML = '';
  const slots = DAY_SLOTS[day] || [];
  slots.forEach((slot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'meeting-chip';
    button.textContent = slot;
    button.dataset.time = slot;
    button.addEventListener('click', () => {
      selected.time = slot;
      setActive(Array.from(timeGrid.querySelectorAll('.meeting-chip')), button);
      updateSummary();
    });
    timeGrid.appendChild(button);
  });
}

dayButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selected.day = button.dataset.day;
    selected.time = null;
    setActive(dayButtons, button);
    renderTimes(selected.day);
    updateSummary();
  });
});

durationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selected.duration = Number(button.dataset.duration);
    selected.price = Number(button.dataset.price);
    setActive(durationButtons, button);
    updateSummary();
  });
});

async function submitBooking() {
  if (!(selected.day && selected.time && selected.duration)) {
    bookingStatus.textContent = 'Select day, time, and duration first.';
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
        day: selected.day,
        time: selected.time,
        duration_minutes: selected.duration,
        price: selected.price,
      }),
    });
    if (!resp.ok) {
      throw new Error(`Booking error ${resp.status}`);
    }
    const booking = await resp.json();
    bookingStatus.textContent = booking.price > 0
      ? 'Booking saved. Next step is payment for the selected duration.'
      : 'Booking saved. Your free 15-minute meeting is confirmed pending review.';
  } catch (err) {
    bookingStatus.textContent = err.message || 'Failed to save booking.';
  } finally {
    confirmLink.disabled = false;
  }
}

confirmLink.addEventListener('click', submitBooking);

updateSummary();
