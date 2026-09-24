document.querySelectorAll('.email-contact-actions').forEach(container => {
  const summary = container.querySelector('.email-options-trigger');
  const panel = container.querySelector('.email-options-panel');
  const status = panel.querySelector('[role="status"]');
  const close = () => { panel.hidden = true; summary.setAttribute('aria-expanded', 'false'); };
  summary.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    summary.setAttribute('aria-expanded', String(!panel.hidden));
    status.textContent = '';
  });
  panel.querySelector('[data-copy-email]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('steveshepherdnz@gmail.com');
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Copy was blocked. Select and copy the email address shown above.';
    }
  });
  document.addEventListener('click', event => {
    if (!panel.hidden && !container.contains(event.target)) close();
  });
  container.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      close();
      summary.focus();
    }
  });
});
