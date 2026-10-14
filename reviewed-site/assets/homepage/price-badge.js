document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero-carousel');
  const badge = document.getElementById('persistent-price-badge');
  if (!hero || !badge) return;
  const card = badge.querySelector('.shared-price-card');
  const shine = badge.querySelector('.shared-price-shine');
  const slides = [...hero.querySelectorAll('.slide')];
  const mobile = matchMedia('(max-width: 1024px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = null;
  let target = null;
  let scheduled = 0;
  let animateNext = false;
  let animations = [];

  const translate = (x, y) => `translate3d(${x}px, ${y}px, 0)`;
  function stopMotion() { animations.forEach(animation => animation.cancel()); animations = []; }

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
    const restingCard = 'perspective(650px) rotateY(0deg) rotateZ(0deg) scale(1)';
    const visibleCard = getComputedStyle(card).transform;
    stopMotion();
    currentSlide = slide.id;
    badge.dataset.forSlide = currentSlide;
    target = next;
    badge.style.transform = translate(next.x, next.y);
    if (!allowMotion || !changed || reduced.matches || document.hidden || typeof badge.animate !== 'function') return;

    const index = slides.indexOf(slide);
    const direction = Math.abs(next.x - from.x) > 2 ? Math.sign(next.x - from.x) : (index % 2 ? 1 : -1);
    const middleX = (from.x + next.x) / 2 + direction * 14;
    const lift = mobile.matches ? 8 : 18;
    const middleY = Math.min(from.y, next.y) - lift;
    animations.push(badge.animate([
      { transform: translate(from.x, from.y), offset: 0 },
      { transform: translate(middleX, middleY), offset: .42 },
      { transform: translate(next.x, next.y + 2), offset: .85 },
      { transform: translate(next.x, next.y), offset: 1 }
    ], { duration: 1050, easing: 'cubic-bezier(.22,.8,.3,1)' }));
    animations.push(card.animate([
      { transform: visibleCard === 'none' ? restingCard : visibleCard, offset: 0 },
      { transform: `perspective(650px) rotateY(${direction * -7}deg) rotateZ(${direction * 2}deg) scale(1.025)`, offset: .38 },
      { transform: `perspective(650px) rotateY(${direction * 1.5}deg) rotateZ(${direction * -.4}deg) scale(1.005)`, offset: .8 },
      { transform: restingCard, offset: 1 }
    ], { duration: 1050, easing: 'cubic-bezier(.22,.8,.3,1)' }));
    animations.push(shine.animate([
      { transform: 'translateX(-180%) skewX(-22deg)', opacity: 0, offset: 0 },
      { transform: 'translateX(50%) skewX(-22deg)', opacity: .7, offset: .55 },
      { transform: 'translateX(320%) skewX(-22deg)', opacity: 0, offset: 1 }
    ], { duration: 1100, easing: 'cubic-bezier(.25,.1,.25,1)' }));
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
