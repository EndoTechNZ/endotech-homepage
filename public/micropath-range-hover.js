(() => {
  const hero = document.querySelector('.microPath-hero');
  const visual = document.querySelector('[data-micropath-hero-visual], [data-microPath-hero-visual]');
  if (!(hero instanceof HTMLElement) || !(visual instanceof HTMLElement)) return;

  const files = [
    ['.microPath-hero-size--13', '13', '13/.03'],
    ['.microPath-hero-size--15', '15', '15/.03'],
    ['.microPath-hero-size--17', '17', '17/.03'],
    ['.microPath-hero-size--mb2', 'mb2', 'MB2 15/.05'],
    ['.microPath-hero-size--20', '20', '20/.03'],
    ['.microPath-hero-size--25', '25', '25/.03'],
  ].map(([selector, key, label]) => ({
    element: hero.querySelector(selector),
    key,
    label,
  })).filter(({ element }) => element instanceof HTMLElement);

  let pinnedKey = '';

  const show = (key) => {
    visual.dataset.activeFile = key;
    files.forEach(({ element, key: itemKey }) => {
      const active = itemKey === key;
      element.classList.toggle('is-file-active', active);
      element.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const restore = () => {
    if (pinnedKey) {
      show(pinnedKey);
      return;
    }
    delete visual.dataset.activeFile;
    files.forEach(({ element }) => {
      element.classList.remove('is-file-active');
      element.setAttribute('aria-pressed', 'false');
    });
  };

  files.forEach(({ element, key, label }) => {
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', `Highlight the ${label} file above`);
    element.setAttribute('aria-pressed', 'false');

    element.addEventListener('pointerenter', () => show(key));
    element.addEventListener('pointerleave', restore);
    element.addEventListener('focus', () => show(key));
    element.addEventListener('blur', restore);
    element.addEventListener('click', () => {
      pinnedKey = pinnedKey === key ? '' : key;
      pinnedKey ? show(pinnedKey) : restore();
    });
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
      if (event.key === 'Escape') {
        pinnedKey = '';
        restore();
        element.blur();
      }
    });
  });

  document.addEventListener('pointerdown', (event) => {
    if (!pinnedKey || files.some(({ element }) => element.contains(event.target))) return;
    pinnedKey = '';
    restore();
  });
})();
