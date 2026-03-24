const current = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('[data-nav-current]').forEach((node) => {
  const href = node.getAttribute('href') || '';
  const baseHref = href.split('#')[0];
  if (baseHref === current) {
    node.style.color = 'var(--accent)';
  }
});

document.querySelectorAll('[data-nav-dropdown]').forEach((dropdown) => {
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');
  const menu = dropdown.querySelector('.nav-dropdown-menu');

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    dropdown.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    setOpen(!dropdown.classList.contains('open'));
  });

  dropdown.addEventListener('mouseenter', () => setOpen(true));
  dropdown.addEventListener('mouseleave', () => setOpen(false));

  dropdown.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.split('#')[0] === current) {
      toggle.style.color = 'var(--accent)';
    }

    link.addEventListener('click', () => setOpen(false));
  });
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('[data-nav-dropdown].open').forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });
});
