document.querySelectorAll('[data-nav-current]').forEach((node) => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  if (node.getAttribute('href') === current) {
    node.style.color = 'var(--accent)';
  }
});
