const packageSelect = document.getElementById('package');
const summary = document.getElementById('order-summary');

if (packageSelect && summary) {
  const updateSummary = () => {
    const value = packageSelect.value || 'Custom solution';
    summary.textContent = `Selected engagement: ${value}`;
  };
  packageSelect.addEventListener('change', updateSummary);
  updateSummary();
}
