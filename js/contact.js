const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    contactStatus.textContent = 'Submission wiring comes next. For now, email trkelnit@gmail.com directly.';
  });
}
