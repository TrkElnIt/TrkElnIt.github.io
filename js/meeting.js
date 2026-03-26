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

  if (selected.day && selected.time && selected.duration) {
    const params = new URLSearchParams({
      day: selected.day,
      time: selected.time,
      duration: String(selected.duration),
      price: String(selected.price),
    });
    confirmLink.href = `contact.html?${params.toString()}`;
  } else {
    confirmLink.href = 'contact.html';
  }
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

updateSummary();
