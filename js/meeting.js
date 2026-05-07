import { API_BASE_URL } from './apiConfig.js';

const selected = {
  day: null,
  dayLabel: null,
  time: null,
  duration: null,
  price: null,
};

let availabilityDays = [];
const params = new URLSearchParams(window.location.search);
const chatSessionId = params.get('session_id');

const DURATION_PRICES = {
  15: 0,
  30: 0,
  45: 0,
  60: 0,
};

const API_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
};

const dayGrid = document.getElementById('meeting-day-grid');
const durationButtons = Array.from(document.querySelectorAll('[data-duration]'));
const timeGrid = document.getElementById('meeting-time-grid');
const calendarTitle = document.getElementById('meeting-calendar-title');
const timeTitle = document.getElementById('meeting-time-title');
const summaryDay = document.getElementById('meeting-summary-day');
const summaryTime = document.getElementById('meeting-summary-time');
const summaryDuration = document.getElementById('meeting-summary-duration');
const summaryPrice = document.getElementById('meeting-summary-price');
const confirmButton = document.getElementById('meeting-confirm');
const backDayButton = document.getElementById('meeting-back-day');
const backTimeButton = document.getElementById('meeting-back-time');
const bookingStatus = document.getElementById('meeting-booking-status');
const nameInput = document.getElementById('meeting-name');
const emailInput = document.getElementById('meeting-email');
const companyInput = document.getElementById('meeting-company');
const subjectInput = document.getElementById('meeting-subject');
const selectedDayLabel = document.getElementById('meeting-selected-day-label');
const wizardShell = document.querySelector('.meeting-wizard-shell');
const panels = Array.from(document.querySelectorAll('[data-meeting-panel]'));
const progressDots = Array.from(document.querySelectorAll('[data-step-dot]'));
let availabilityLoadFailed = false;
let activeStep = 'day';

function parseDate(dateText) {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatMonth(date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

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

function setStatus(message, isError = false) {
  bookingStatus.textContent = message;
  bookingStatus.classList.toggle('is-error', isError);
  bookingStatus.classList.remove('hidden');
}

function clearStatus() {
  bookingStatus.textContent = '';
  bookingStatus.classList.add('hidden');
  bookingStatus.classList.remove('is-error');
}

function setWizardStep(step, options = {}) {
  activeStep = step;
  panels.forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.meetingPanel !== step);
  });
  progressDots.forEach((dot) => {
    dot.classList.toggle('is-active', dot.dataset.stepDot === step);
  });
  if (options.scroll !== false && wizardShell) {
    wizardShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function syncDurationButtons() {
  const selectedSlot = getSelectedSlot();
  durationButtons.forEach((button) => {
    const duration = Number(button.dataset.duration);
    const allowed =
      !availabilityLoadFailed &&
      !!selected.day &&
      !!selectedSlot &&
      selectedSlot.supported_durations.includes(duration);
    button.disabled = !allowed;
    button.classList.toggle('is-disabled', !allowed);
  });

  if (selectedSlot && selected.duration && !selectedSlot.supported_durations.includes(selected.duration)) {
    selected.duration = null;
    selected.price = null;
  }
  setActive(durationButtons, selected.duration, (node) => Number(node.dataset.duration));
}

function updateSummary() {
  if (selectedDayLabel) {
    selectedDayLabel.textContent = selected.dayLabel || 'Choose a day';
  }
  summaryDay.textContent = selected.dayLabel || 'Choose a day';
  summaryTime.textContent = selected.time || 'Choose an hour';
  summaryDuration.textContent = selected.duration ? `${selected.duration} minutes` : 'Choose a duration';
  summaryPrice.textContent = selected.price === null ? '-' : selected.price === 0 ? 'Free' : `$${selected.price}`;

  confirmButton.disabled = availabilityLoadFailed || !(selected.day && selected.time && selected.duration);
}

function buildCalendarRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today);
  end.setDate(today.getDate() + 30);

  const dates = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function renderDays() {
  dayGrid.innerHTML = '';

  if (!availabilityDays.length) {
    dayGrid.innerHTML = '<p class="section-copy meeting-calendar-empty">No available days are configured right now.</p>';
    calendarTitle.textContent = 'No available days';
    return;
  }

  const availableByDate = new Map(availabilityDays.map((day) => [day.date, day]));
  const dates = buildCalendarRange();
  calendarTitle.textContent = formatMonth(dates[0]);

  const firstDayOffset = dates[0].getDay();
  for (let i = 0; i < firstDayOffset; i += 1) {
    const spacer = document.createElement('span');
    spacer.className = 'meeting-calendar-spacer';
    dayGrid.appendChild(spacer);
  }

  dates.forEach((date) => {
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const available = availableByDate.get(isoDate);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = available ? 'meeting-calendar-day is-available' : 'meeting-calendar-day is-unavailable';
    button.disabled = !available;
    button.dataset.date = isoDate;
    button.innerHTML = `
      <strong>${date.getDate()}</strong>
      <span>${available ? `${available.slots.length} slots` : 'No slots'}</span>
    `;

    if (selected.day === isoDate) {
      button.classList.add('is-active');
    }

    if (available) {
      button.addEventListener('click', () => {
        selected.day = available.date;
        selected.dayLabel = available.label || formatDayLabel(date);
        selected.time = null;
        selected.duration = null;
        selected.price = null;
        clearStatus();
        renderDays();
        renderTimes();
        syncDurationButtons();
        updateSummary();
        setWizardStep('time');
      });
    }

    dayGrid.appendChild(button);
  });
}

function parseHour(timeLabel) {
  const match = String(timeLabel).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour + minute / 60;
}

function getTimeGroup(timeLabel) {
  const hour = parseHour(timeLabel);
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function renderTimes() {
  timeGrid.innerHTML = '';
  const day = getSelectedDayData();
  if (!day) {
    timeTitle.textContent = 'Choose an available day';
    timeGrid.innerHTML = '<p class="section-copy">Available hours appear after you select a green day.</p>';
    return;
  }

  timeTitle.textContent = `${selected.dayLabel} availability`;
  const slots = selected.duration
    ? day.slots.filter((slot) => slot.supported_durations.includes(selected.duration))
    : day.slots;

  if (!slots.length) {
    timeGrid.innerHTML = '<p class="section-copy">No hours are available for this duration.</p>';
    return;
  }

  const groups = new Map();
  slots.forEach((slot) => {
    const group = getTimeGroup(slot.time);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(slot);
  });

  groups.forEach((groupSlots, groupName) => {
    const section = document.createElement('section');
    section.className = 'meeting-time-group';
    const heading = document.createElement('h5');
    heading.textContent = groupName;
    section.appendChild(heading);

    const slotGrid = document.createElement('div');
    slotGrid.className = 'meeting-time-grid';
    groupSlots.forEach((slot) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'meeting-chip';
      button.textContent = slot.time;
      button.dataset.time = slot.time;
      button.addEventListener('click', () => {
        selected.time = slot.time;
        clearStatus();
        renderTimes();
        syncDurationButtons();
        updateSummary();
      });
      if (selected.time === slot.time) {
        button.classList.add('is-active');
      }
      slotGrid.appendChild(button);
    });

    section.appendChild(slotGrid);
    timeGrid.appendChild(section);
  });
}

durationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const duration = Number(button.dataset.duration);
    if (button.disabled) return;
    selected.duration = duration;
    selected.price = DURATION_PRICES[duration] ?? Number(button.dataset.price);
    clearStatus();
    renderTimes();
    syncDurationButtons();
    updateSummary();
    setWizardStep('confirm');
  });
});

if (backDayButton) {
  backDayButton.addEventListener('click', () => setWizardStep('day'));
}

if (backTimeButton) {
  backTimeButton.addEventListener('click', () => setWizardStep('time'));
}

function withSession(url) {
  if (!chatSessionId) return url;
  const next = new URL(url);
  next.searchParams.set('session_id', chatSessionId);
  return next.toString();
}

async function loadPrefill() {
  try {
    const resp = await fetch(withSession(`${API_BASE_URL}/chat/meeting-bookings/prefill`), {
      credentials: 'include',
      headers: API_HEADERS,
      cache: 'no-store',
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
    const resp = await fetch(`${API_BASE_URL}/calendar/availability?days=31`, {
      headers: API_HEADERS,
      cache: 'no-store',
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
    dayGrid.innerHTML = '<p class="section-copy meeting-calendar-empty">Availability could not be loaded right now.</p>';
    timeGrid.innerHTML = '<p class="section-copy">Hours will appear after availability is loaded.</p>';
    syncDurationButtons();
    updateSummary();
    setStatus(err.message || 'Availability could not be loaded.', true);
  }
}

async function submitBooking() {
  if (!(selected.day && selected.time && selected.duration)) {
    setStatus('Select day, time, and duration first.', true);
    return;
  }

  if (!nameInput.value.trim() || !emailInput.value.trim() || !companyInput.value.trim()) {
    setStatus('Enter your name, email, and company before confirming.', true);
    return;
  }

  confirmButton.disabled = true;
  setStatus('Saving booking...');

  try {
    const resp = await fetch(withSession(`${API_BASE_URL}/chat/meeting-bookings`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...API_HEADERS },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        company: companyInput.value.trim(),
        subject: subjectInput.value.trim() || null,
        day: selected.day,
        time: selected.time,
        duration_minutes: selected.duration,
        price: selected.price,
      }),
    });
    const payload = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(payload.detail || `Booking error ${resp.status}`);
    }
    setStatus('Booking saved. TrkElnIt will review and confirm by email.');
  } catch (err) {
    setStatus(err.message || 'Failed to save booking.', true);
  } finally {
    confirmButton.disabled = false;
  }
}

confirmButton.addEventListener('click', submitBooking);

setWizardStep('day', { scroll: false });
syncDurationButtons();
loadPrefill();
loadAvailability();
updateSummary();
