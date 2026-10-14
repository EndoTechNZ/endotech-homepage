document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero-carousel');
  const badge = document.getElementById('persistent-price-badge');
  if (!hero || !badge) return;
  const shine = badge.querySelector('.shared-price-shine');
  const outline = badge.querySelector('.shared-price-outline');
  const clip = badge.querySelector('.shared-price-clip');
  const slides = [...hero.querySelectorAll('.slide')];
  const mobile = matchMedia('(max-width: 1024px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = null;
  let target = null;
  let scheduled = 0;
  let animateNext = false;
  let animations = [];
  let liquidFrame = 0;
  let skinState = Array(8).fill(0);

  const translate = (x, y) => `translate3d(${x}px, ${y}px, 0)`;
  function paintSkin(values) {
    skinState = values;
    if (!outline || !clip) return;
    const [a,b,c,d,e,f,g,h] = values;
    const path = `M12 1 C75 ${1+a} 149 ${1+b} 212 1 Q223 1 223 12 C${223+c} 29 ${223+d} 49 223 66 Q223 77 212 77 C149 ${77+e} 75 ${77+f} 12 77 Q1 77 1 66 C${1+g} 49 ${1+h} 29 1 12 Q1 1 12 1 Z`;
    outline.setAttribute('d', path);
    clip.setAttribute('d', path);
  }
  function stopMotion(resetSkin = true) {
    animations.forEach(animation => animation.cancel());
    animations = [];
    if (liquidFrame) cancelAnimationFrame(liquidFrame);
    liquidFrame = 0;
    if (resetSkin) paintSkin(Array(8).fill(0));
  }
  function flowSkin(start) {
    if (!outline || !clip) return;
    const started = performance.now();
    function draw(now) {
      const p = Math.min(1, Math.max(0, (now - started) / 1500));
      const envelope = Math.sin(Math.PI * p) ** 2;
      const fade = 1 - p * p * (3 - 2 * p);
      const strength = mobile.matches ? 1.4 : 2.6;
      paintSkin(start.map((value, i) => value * fade + Math.sin(p * Math.PI * 1.5 - i * Math.PI / 4) * envelope * strength * (1 - fade)));
      liquidFrame = p < 1 ? requestAnimationFrame(draw) : 0;
      if (p === 1) paintSkin(Array(8).fill(0));
    }
    liquidFrame = requestAnimationFrame(draw);
  }

  function position(allowMotion) {
    const slide = hero.querySelector('.slide.is-active');
    if (!slide) return;
    const dock = mobile.matches ? hero.querySelector('.price-badge-mobile-dock .price-badge-slot') : slide.querySelector('.price-badge-slot');
    if (!dock) return;
    hero.classList.add('price-badge-ready');
    const root = hero.getBoundingClientRect();
    const anchor = dock.getBoundingClientRect();
    if (!anchor.width || !anchor.height) return;
    const next = { x: anchor.left - root.left, y: anchor.top - root.top };
    const changed = currentSlide !== null && currentSlide !== slide.id;
    const resized = !target || Math.abs(next.x - target.x) > .5 || Math.abs(next.y - target.y) > .5;
    if (!changed && !resized) return;

    // Read the current visible position before cancelling an interrupted move.
    const visible = badge.getBoundingClientRect();
    const from = { x: visible.left - root.left, y: visible.top - root.top };
    const previousSkin = [...skinState];
    stopMotion(false);
    currentSlide = slide.id;
    badge.dataset.forSlide = currentSlide;
    target = next;
    badge.style.transform = translate(next.x, next.y);
    if (!allowMotion || !changed || reduced.matches || document.hidden || typeof badge.animate !== 'function') {
      paintSkin(Array(8).fill(0));
      return;
    }

    const dx = next.x - from.x, dy = next.y - from.y;
    const distance = Math.hypot(dx, dy);
    // A single eased curve: no hop, tilt, scale, or overshoot at the destination.
    if (distance > .75) {
      const bow = mobile.matches ? 0 : Math.min(8, distance * .035);
      const sign = dx >= 0 ? -1 : 1;
      const control = { x: (from.x + next.x) / 2 - dy / distance * bow * sign, y: (from.y + next.y) / 2 + dx / distance * bow * sign };
      const frames = Array.from({ length: 32 }, (_, i) => {
        const t = i / 31, u = 1 - t;
        return { offset: t, transform: translate(u*u*from.x + 2*u*t*control.x + t*t*next.x, u*u*from.y + 2*u*t*control.y + t*t*next.y) };
      });
      animations.push(badge.animate(frames, { duration: 1250, easing: 'cubic-bezier(.45,0,.2,1)' }));
    }
    flowSkin(previousSkin);
    animations.push(shine.animate([
      { transform: 'translateX(0px)', opacity: 0, offset: 0 },
      { transform: 'translateX(220px)', opacity: .18, offset: .55 },
      { transform: 'translateX(480px)', opacity: 0, offset: 1 }
    ], { duration: 1600, easing: 'cubic-bezier(.4,0,.2,1)' }));
  }

  function schedule(motion = false) {
    animateNext ||= motion;
    if (scheduled) return;
    scheduled = requestAnimationFrame(() => {
      scheduled = 0;
      const motion = animateNext;
      animateNext = false;
      position(motion);
    });
  }
  const slideObserver = new MutationObserver(() => schedule(true));
  slides.forEach(slide => slideObserver.observe(slide, { attributes: true, attributeFilter: ['class'] }));
  const resizeObserver = new ResizeObserver(() => schedule(false));
  resizeObserver.observe(hero);
  hero.querySelectorAll('.price-badge-slot').forEach(slot => resizeObserver.observe(slot));
  mobile.addEventListener('change', () => { stopMotion(); target = null; schedule(false); });
  reduced.addEventListener('change', () => { stopMotion(); target = null; schedule(false); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMotion(); else schedule(false); });
  if (document.fonts) document.fonts.ready.then(() => schedule(false));
  position(false);
});
