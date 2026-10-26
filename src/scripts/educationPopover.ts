interface EducationPopoverOptions {
  root: HTMLElement;
  preview: HTMLElement;
  triggers: HTMLButtonElement[];
  closeButton: HTMLButtonElement;
  update: (trigger: HTMLButtonElement) => void;
  position: (trigger: HTMLButtonElement, preview: HTMLElement) => { left: number; top: number };
}

export function initializeEducationPopover(options: EducationPopoverOptions) {
  const { root, preview, triggers, closeButton, update, position } = options;
  if (root.dataset.previewInitialized) return;
  root.dataset.previewInitialized = 'true';
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const nativePopover = typeof preview.showPopover === 'function';
  let active: HTMLButtonElement | null = null;
  let open = false;
  let pinned = false;
  let suppressFocus = false;
  let closeTimer = 0;
  let frame = 0;
  if (!nativePopover) preview.style.display = 'none';

  const cancelClose = () => window.clearTimeout(closeTimer);
  const positionPreview = () => {
    if (!open || !active) return;
    const { left, top } = position(active, preview);
    preview.style.left = `${Math.max(12, Math.min(left, window.innerWidth - preview.offsetWidth - 12))}px`;
    preview.style.top = `${Math.max(12, Math.min(top, window.innerHeight - preview.offsetHeight - 12))}px`;
  };
  const close = (restoreFocus = false) => {
    cancelClose();
    const previous = active;
    if (open && nativePopover) preview.hidePopover();
    if (!nativePopover) preview.style.display = 'none';
    open = false;
    pinned = false;
    active = null;
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    if (restoreFocus && previous) {
      suppressFocus = true;
      previous.focus({ preventScroll: true });
      queueMicrotask(() => { suppressFocus = false; });
    }
  };
  const show = (trigger: HTMLButtonElement, pin = false) => {
    cancelClose();
    document.dispatchEvent(new CustomEvent('education-preview-open', { detail: root }));
    active = trigger;
    pinned = pin;
    update(trigger);
    triggers.forEach(button => button.setAttribute('aria-expanded', String(button === trigger)));
    if (!open && nativePopover) preview.showPopover();
    if (!nativePopover) preview.style.display = 'block';
    open = true;
    positionPreview();
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer = window.setTimeout(() => {
      if (pinned || preview.matches(':hover') || preview.contains(document.activeElement) || active === document.activeElement) return;
      close();
    }, 180);
  };
  triggers.forEach(trigger => {
    trigger.addEventListener('pointerenter', event => {
      if (hover.matches && event.pointerType !== 'touch') show(trigger);
    });
    trigger.addEventListener('pointerleave', scheduleClose);
    trigger.addEventListener('focus', () => {
      if (!suppressFocus && trigger.matches(':focus-visible')) show(trigger);
    });
    trigger.addEventListener('blur', scheduleClose);
    trigger.addEventListener('click', () => {
      if (open && active === trigger && pinned) close();
      else show(trigger, true);
    });
  });
  preview.addEventListener('pointerenter', cancelClose);
  preview.addEventListener('pointerleave', scheduleClose);
  preview.addEventListener('focusout', scheduleClose);
  closeButton.addEventListener('click', () => close(true));
  preview.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      close(preview.contains(document.activeElement) || active === document.activeElement);
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!open || !(event.target instanceof Node)) return;
    if (!preview.contains(event.target) && !triggers.some(trigger => trigger.contains(event.target as Node))) close();
  });
  document.addEventListener('education-preview-open', event => {
    if ((event as CustomEvent<HTMLElement>).detail !== root && open) close();
  });
  window.addEventListener('resize', () => close());
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(positionPreview);
  }, { passive: true });
}
