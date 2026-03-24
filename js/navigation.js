const current = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('[data-nav-current]').forEach((node) => {
  const href = node.getAttribute('href') || '';
  const baseHref = href.split('#')[0];
  if (baseHref === current) {
    node.style.color = 'var(--accent)';
  }
});
