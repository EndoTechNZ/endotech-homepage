// Shared by the source page and the reviewed production overlay.
(() => {
  const status = document.querySelector('[data-quote-status]');
  if (!status) return;
  status.tabIndex = -1;
  let previous = '';
  const update = () => {
    const error = !status.hidden && status.dataset.tone === 'error' && status.textContent.trim();
    status.setAttribute('role', error ? 'alert' : 'status');
    status.setAttribute('aria-live', error ? 'assertive' : 'polite');
    if (error && error !== previous) {
      status.scrollIntoView({ block: 'center', behavior: 'instant' });
      status.focus({ preventScroll: true });
    }
    previous = error || '';
  };
  new MutationObserver(update).observe(status, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'data-tone'] });
  update();
})();
