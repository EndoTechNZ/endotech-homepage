document.querySelectorAll('.email-options').forEach(panel => {
  const summary = panel.querySelector('summary');
  const status = panel.querySelector('[role="status"]');
  panel.querySelector('[data-copy-email]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('steveshepherdnz@gmail.com');
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Copy was blocked. Select and copy the email address shown above.';
    }
  });
  document.addEventListener('click', event => {
    if (panel.open && !panel.contains(event.target)) panel.open = false;
  });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      panel.open = false;
      summary.focus();
    }
  });
});
