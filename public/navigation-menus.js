// Shared interaction rules for the NZ site's existing navigation designs.
function fitPanel(panel, trigger, mobile = false, gutter = 12) {
  const scrollTop = panel.scrollTop;
  for (const property of ['position', 'left', 'right', 'top', 'width', 'min-width', 'max-width', 'max-height', 'box-sizing', 'z-index']) panel.style.removeProperty(property);
  if (mobile) Object.assign(panel.style, {
    position: 'fixed', left: `${gutter}px`, right: `${gutter}px`,
    top: `${Math.round(trigger.getBoundingClientRect().bottom + 10)}px`,
    width: 'auto', minWidth: '0', maxWidth: 'none', boxSizing: 'border-box', zIndex: '10020',
  });
  const viewportBottom = window.visualViewport
    ? window.visualViewport.offsetTop + window.visualViewport.height : window.innerHeight;
  const rect = panel.getBoundingClientRect();
  const useViewport = viewportBottom - rect.top - gutter < 80;
  if (useViewport) {
    const width = Math.min(rect.width, window.innerWidth - gutter * 2);
    Object.assign(panel.style, {
      position: 'fixed', top: `${(window.visualViewport?.offsetTop || 0) + gutter}px`,
      left: `${Math.max(gutter, Math.min(rect.left, window.innerWidth - width - gutter))}px`,
      right: 'auto', width: `${width}px`, minWidth: '0', maxWidth: 'none', boxSizing: 'border-box', zIndex: '10020',
    });
  }
  const style = getComputedStyle(panel);
  const extra = style.boxSizing === 'border-box' ? 0
    : ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, name) => sum + (parseFloat(style[name]) || 0), 0);
  const available = Math.max(0, viewportBottom - panel.getBoundingClientRect().top - gutter - extra);
  const cssLimit = parseFloat(style.maxHeight);
  panel.style.maxHeight = `${Math.min(!useViewport && Number.isFinite(cssLimit) && cssLimit > 0 ? cssLimit : Infinity, available)}px`;
  panel.style.overflowY = 'auto';
  panel.style.overscrollBehavior = 'contain';
  panel.scrollTop = scrollTop;
  if (panel.contains(document.activeElement)) {
    const bounds = panel.getBoundingClientRect();
    const focused = document.activeElement.getBoundingClientRect();
    if (focused.bottom > bounds.bottom) panel.scrollTop += focused.bottom - bounds.bottom + 2;
    else if (focused.top < bounds.top) panel.scrollTop -= bounds.top - focused.top + 2;
  }
}

function focusMenuLink(target, panel) {
  target.focus({ preventScroll: true });
  if (!panel.contains(target)) return;
  const bounds = panel.getBoundingClientRect();
  const link = target.getBoundingClientRect();
  if (link.bottom > bounds.bottom - 2) panel.scrollTop += link.bottom - bounds.bottom + 2;
  else if (link.top < bounds.top + 2) panel.scrollTop -= bounds.top - link.top + 2;
}

function navigateLinks(event, trigger, panel, open, close) {
  if (event.key === 'Escape') {
    event.preventDefault();
    trigger.focus();
    close();
    return;
  }
  const links = [...panel.querySelectorAll('a[href]')];
  if (!links.length) return;
  if (event.target === trigger && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    open();
    focusMenuLink(event.key === 'ArrowDown' ? links[0] : links.at(-1), panel);
    return;
  }
  const index = links.indexOf(document.activeElement);
  if (index < 0) return;
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1
    : event.key === 'ArrowDown' ? Math.min(index + 1, links.length - 1)
      : event.key === 'ArrowUp' ? index - 1 : null;
  if (next !== null) {
    event.preventDefault();
    focusMenuLink(next < 0 ? trigger : links[next], panel);
  }
}

function connectNzNavigation() {
  const controllers = [];
  let pointerTarget = null;
  document.querySelectorAll('.header-explore,.clean-explore,.compact-explore,.preview-explore').forEach((details, index) => {
    if (details.dataset.navigationReady) return;
    const trigger = details.querySelector('summary');
    const panel = details.querySelector('.header-menu,.clean-dropdown,.compact-dropdown,.preview-menu');
    if (!trigger || !panel) return;
    details.dataset.navigationReady = 'true';
    panel.id ||= `nz-explore-menu-${index + 1}`;
    trigger.setAttribute('aria-controls', panel.id);
    const fit = () => {
      if (!details.open) return;
      const breakpoint = details.classList.contains('compact-explore') ? 600 : 750;
      const mobile = !details.classList.contains('header-explore') && window.innerWidth <= breakpoint;
      fitPanel(panel, trigger, mobile, details.classList.contains('compact-explore') ? 10 : 12);
    };
    const setOpen = open => {
      details.open = open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) fit();
    };
    const controller = { root: details, fit, close: () => setOpen(false) };
    controllers.push(controller);
    details.addEventListener('toggle', () => {
      trigger.setAttribute('aria-expanded', String(details.open));
      if (details.open) {
        controllers.forEach(other => { if (other !== controller) other.close(); });
        fit();
      }
    });
    details.addEventListener('keydown', event => navigateLinks(event, trigger, panel, () => setOpen(true), controller.close));
    details.addEventListener('focusout', event => {
      // During a pointer focus transfer activeElement can briefly be BODY.
      // Keep the menu open until its link receives the pending click.
      if (details.contains(event.relatedTarget) || details.contains(pointerTarget)) return;
      queueMicrotask(() => {
        if (!details.contains(document.activeElement)) controller.close();
      });
    });
    trigger.setAttribute('aria-expanded', String(details.open));
  });

  const docsHeader = document.querySelector('.endotech-docs-header');
  if (docsHeader && document.querySelector('.clean-header,.compact-product-header')) {
    // Reviewed reference pages already have the approved NZ header above this one.
    docsHeader.inert = true;
    docsHeader.setAttribute('aria-hidden', 'true');
    docsHeader.dataset.navigationReady = 'replaced';
  } else if (docsHeader && !docsHeader.dataset.navigationReady) {
    docsHeader.dataset.navigationReady = 'true';
    docsHeader.classList.add('is-managed');
    const docsMenus = [...docsHeader.querySelectorAll('.products-menu')].map(root => ({
      root, trigger: root.querySelector('button'), panel: root.querySelector('.products-menu-panel'),
    }));
    const mobileTrigger = docsHeader.querySelector('#docs-mobile-menu-button');
    const mobilePanel = docsHeader.querySelector('#docs-mobile-menu');
    if (mobileTrigger && mobilePanel) docsMenus.push({ root: docsHeader, trigger: mobileTrigger, panel: mobilePanel, mobile: true });
    docsMenus.forEach(({ root, trigger, panel, mobile }) => {
      if (!trigger || !panel) return;
      let timer;
      const fit = () => {
        if (trigger.getAttribute('aria-expanded') !== 'true') return;
        if (!trigger.getBoundingClientRect().width) { setOpen(false); return; }
        if (mobile) {
          const top = Math.max(0, Math.ceil(docsHeader.getBoundingClientRect().bottom));
          const bottom = window.visualViewport ? window.visualViewport.offsetTop + window.visualViewport.height : window.innerHeight;
          document.documentElement.style.setProperty('--docs-mobile-menu-top', `${top}px`);
          document.documentElement.style.setProperty('--docs-mobile-menu-height', `${Math.max(0, bottom - top - 1)}px`);
        } else fitPanel(panel, trigger);
      };
      const setOpen = open => {
        clearTimeout(timer);
        if (open) controllers.forEach(other => { if (other !== controller) other.close(); });
        (mobile ? panel : root).classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
        panel.inert = !open;
        if (!mobile) panel.style.visibility = open ? 'visible' : 'hidden';
        if (mobile) {
          document.documentElement.classList.toggle('docs-mobile-menu-open', open);
          document.body.classList.toggle('docs-mobile-menu-open', open);
        }
        if (open) fit();
      };
      const controller = { root, fit, close: () => setOpen(false) };
      controllers.push(controller);
      trigger.addEventListener('click', event => {
        event.preventDefault();
        setOpen(trigger.getAttribute('aria-expanded') !== 'true');
      });
      if (!mobile) {
        root.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') setOpen(true); });
        root.addEventListener('pointerleave', () => {
          timer = setTimeout(() => { if (!root.contains(document.activeElement)) setOpen(false); }, 220);
        });
        root.addEventListener('focusin', () => setOpen(true));
      }
      root.addEventListener('focusout', event => {
        if (root.contains(event.relatedTarget) || root.contains(pointerTarget)) return;
        queueMicrotask(() => {
          if (!root.contains(document.activeElement)) setOpen(false);
        });
      });
      const onKey = event => {
        if (event.target === trigger || panel.contains(event.target)) navigateLinks(event, trigger, panel, () => setOpen(true), controller.close);
      };
      root.addEventListener('keydown', onKey);
      panel.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', controller.close));
      setOpen(false);
    });
  }

  document.addEventListener('pointerdown', event => {
    // WebKit reports no relatedTarget when a link is pressed. Remember the
    // current press so focusout cannot hide its target before pointerup.
    pointerTarget = event.target;
    controllers.forEach(controller => {
      if (!controller.root.contains(event.target)) controller.close();
    });
  });
  const clearPointer = () => { pointerTarget = null; };
  // Touch taps emit compatibility mouse events after pointerup in WebKit.
  document.addEventListener('mousedown', event => { pointerTarget = event.target; });
  document.addEventListener('mouseup', clearPointer);
  document.addEventListener('pointerup', clearPointer);
  document.addEventListener('pointercancel', clearPointer);
  window.addEventListener('blur', clearPointer);
  const reposition = () => controllers.forEach(controller => controller.fit());
  const resize = new ResizeObserver(reposition);
  document.querySelectorAll('header').forEach(header => {
    resize.observe(header);
    if (header.parentElement) resize.observe(header.parentElement);
  });
  window.addEventListener('resize', reposition, { passive: true });
  window.addEventListener('scroll', reposition, { passive: true });
  window.visualViewport?.addEventListener('resize', reposition, { passive: true });
  window.visualViewport?.addEventListener('scroll', reposition, { passive: true });
  document.fonts?.ready.then(reposition);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectNzNavigation, { once: true });
else connectNzNavigation();
