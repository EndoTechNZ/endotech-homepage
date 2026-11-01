(() => {
  // Percentages refer to the original image canvas, including transparent margins.
  // PT is flipped vertically in CSS, preserving its SX-to-F3 left-to-right order.
  const systems = {
    'transform-s-rg': { key: 'rg', hero: '.et-hero', visual: '[data-et-hero-visual]', files: [
      ['Orifice Shaper', 14.9, '#8f3341'], ['Glidepath', 37.2, '#8350a0'],
      ['Small', 56.9, '#d6bd2d'], ['Primary', 68.2, '#c84b4b'],
      ['Medium', 79.5, '#4f9660'], ['Large', 90.8, '#aeb7c2'],
    ], width: 8.8, top: 4.5, height: 91 },
    'transform-s-pt': { key: 'pt', hero: '.pt-hero', visual: '[data-pt-hero-visual]', files: [
      ['SX', 32.3, '#d6bd2d', null, 24.5, 68], ['S1', 38.6, '#a45aa7'],
      ['S2', 45.3, '#aeb7c2'], ['F1', 51.6, '#d6bd2d'],
      ['F2', 57.5, '#c84b4b'], ['F3', 64.2, '#5677b5'],
    ], width: 5.4, top: 11, height: 82 },
    'transform-s-et': { key: 'et', hero: '.et-hero', visual: '[data-et-hero-visual]', files: [
      ['15', 36.6, '#aeb7c2'], ['20', 45.6, '#d6bd2d'],
      ['25', 54.5, '#c84b4b'], ['30', 63.4, '#5677b5'],
    ], width: 6.8, top: 7, height: 81.5,
      availability: 'Sizes 15, 17, 20, 25, 30, 35, 40 and 45 available in .04 and .06 tapers. Orifice shaper also available.',
    },
    'micro-path': { key: 'micro-path', hero: '.microPath-hero', visual: '[data-micropath-hero-visual]', files: [
      ['MB2 15/.05', 35.25, '#5677b5', '.microPath-hero-size--mb2', 8, 64],
      ['13/.03', 45.58, '#aeb7c2', '.microPath-hero-size--13'],
      ['15/.03', 55.82, '#a45aa7', '.microPath-hero-size--15'],
      ['17/.03', 66.21, '#d6bd2d', '.microPath-hero-size--17'],
      ['20/.03', 76.5, '#e4c527', '.microPath-hero-size--20'],
      ['25/.03', 86.8, '#c84b4b', '.microPath-hero-size--25'],
    ], width: 7.4, top: 8, height: 82 },
    'c-plus': { key: 'c-plus', hero: '.cp-hero', visual: '.cp-product', files: [
      ['#10 · 21 mm', 50, '#8055a7', 'figcaption'],
    ], width: 22, top: 3, height: 85 },
  };

  const slug = location.pathname.replace(/\/+$/, '').split('/').pop();
  const config = systems[slug];
  if (!config) return;
  const hero = document.querySelector(config.hero);
  const visual = hero?.querySelector(config.visual);
  const image = visual?.querySelector('img');
  if (!(hero instanceof HTMLElement) || !(visual instanceof HTMLElement) || !(image instanceof HTMLImageElement)) return;
  if (visual.dataset.fileFamily) return;
  visual.dataset.fileFamily = config.key;

  const map = document.createElement('div');
  map.className = 'file-range-map';
  map.setAttribute('role', 'group');
  map.setAttribute('aria-label', 'Pictured files');
  visual.append(map);
  let names;
  if (config.files.some(file => !file[3])) {
    names = document.createElement('div');
    names.className = 'file-range-names';
    names.setAttribute('role', 'group');
    names.setAttribute('aria-label', `${config.key.toUpperCase()} file names`);
    const actions = hero.querySelector('.et-hero-actions, .pt-hero-actions');
    actions ? actions.after(names) : hero.append(names);
  }

  const files = config.files.map(([label, x, colour, selector, top = config.top, height = config.height], index) => {
    const name = selector ? visual.querySelector(selector) || hero.querySelector(selector) : document.createElement('button');
    if (!(name instanceof HTMLElement)) return null;
    if (!selector) { name.type = 'button'; name.textContent = label; names.append(name); }
    if (config.key !== 'micro-path') name.classList.add('file-range-name');
    name.style.setProperty('--file-accent', colour);
    name.tabIndex = 0;
    name.setAttribute('role', 'button');
    name.setAttribute('aria-label', `Highlight the ${label} file`);
    name.setAttribute('aria-pressed', 'false');
    const hotspot = document.createElement('button');
    hotspot.type = 'button';
    hotspot.className = 'file-range-hotspot';
    hotspot.style.cssText = `--file-x:${x}%;--file-top:${top}%;--file-width:${config.width}%;--file-height:${height}%;--file-accent:${colour}`;
    hotspot.setAttribute('aria-label', label);
    hotspot.setAttribute('aria-pressed', 'false');
    const tooltip = document.createElement('span');
    tooltip.className = 'file-range-tooltip';
    tooltip.textContent = label;
    tooltip.setAttribute('aria-hidden', 'true');
    hotspot.append(tooltip);
    map.append(hotspot);
    return { name, hotspot, colour, index };
  }).filter(Boolean);

  if (config.availability && names) {
    const availability = document.createElement('p');
    availability.className = 'file-range-availability';
    availability.textContent = config.availability;
    names.append(availability);
  }

  // Keep the existing wording and animation, positioned beneath the pictured files.
  let comparison = null;
  const comparisonResize = new ResizeObserver(() => fitMap());
  const markCompatibility = () => {
    hero.querySelectorAll('.et-hero-comparison, .pt-hero-comparison, .rg-hero-comparison, .microPath-hero-comparison, .microPath-hero-meta-note').forEach(element => {
      if (/Compatible with/i.test(element.textContent)) element.classList.add('file-range-compatible');
    });
    const label = hero.querySelector('.et-hero-comparison, .pt-hero-comparison, .rg-hero-comparison, .microPath-hero-comparison');
    if (label instanceof HTMLElement && comparison !== label) {
      comparisonResize.disconnect();
      comparison = label;
      comparison.classList.add('file-range-comparison');
      visual.append(comparison);
      comparisonResize.observe(comparison);
      requestAnimationFrame(() => fitMap());
    }
  };
  markCompatibility();
  new MutationObserver(markCompatibility).observe(hero, { childList: true, subtree: true });

  const fitMap = () => {
    if (!image.naturalWidth || !image.naturalHeight) return;
    const scale = Math.min(image.clientWidth / image.naturalWidth, image.clientHeight / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const left = image.offsetLeft + (image.clientWidth - width) / 2;
    const top = image.offsetTop + (image.clientHeight - height) / 2;
    map.style.left = `${left}px`;
    map.style.top = `${top}px`;
    map.style.width = `${width}px`;
    map.style.height = `${height}px`;
    if (comparison) {
      const firstX = Math.min(...config.files.map(file => file[1]));
      const lastX = Math.max(...config.files.map(file => file[1]));
      const bottom = Math.max(...config.files.map(file => (file[4] ?? config.top) + (file[5] ?? config.height)));
      const centre = left + width * (firstX + lastX) / 200;
      const captionTop = top + height * bottom / 100 + 14;
      const captionWidth = Math.max(1, Math.min(400, 2 * (Math.min(centre, visual.clientWidth - centre) - 8)));
      visual.style.setProperty('--file-comparison-x', `${centre}px`);
      visual.style.setProperty('--file-comparison-y', `${captionTop}px`);
      visual.style.setProperty('--file-comparison-width', `${captionWidth}px`);
      visual.style.setProperty('--file-caption-extra', `${Math.max(0, captionTop + comparison.offsetHeight + 8 - visual.clientHeight)}px`);
    }
  };
  new ResizeObserver(fitMap).observe(image);
  image.addEventListener('load', fitMap);
  fitMap();

  let pinned = null;
  const show = index => {
    hero.classList.toggle('file-range-active', index !== null);
    if (index !== null) hero.style.setProperty('--active-file-accent', files[index].colour);
    else hero.style.removeProperty('--active-file-accent');
    files.forEach(file => [file.name, file.hotspot].forEach(element => {
      const active = file.index === index;
      element.classList.toggle('is-file-active', active);
      element.setAttribute('aria-pressed', String(active));
    }));
  };
  const restore = () => show(pinned);
  files.forEach(({ name, hotspot, index }) => [name, hotspot].forEach(element => {
    element.addEventListener('pointerenter', () => show(index));
    element.addEventListener('pointerleave', restore);
    element.addEventListener('focus', () => show(index));
    element.addEventListener('blur', restore);
    element.addEventListener('click', () => { pinned = pinned === index ? null : index; restore(); });
    element.addEventListener('keydown', event => {
      if (element.tagName !== 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); element.click();
      }
    });
  }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    pinned = null; show(null);
    if (files.some(file => file.name === document.activeElement || file.hotspot === document.activeElement)) document.activeElement.blur();
  });
  document.addEventListener('pointerdown', event => {
    if (files.some(file => file.name.contains(event.target) || file.hotspot.contains(event.target))) return;
    pinned = null; restore();
  });
})();
