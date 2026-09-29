(() => {
  const root = document.querySelector('.v10');
  const shapes = root ? [...root.querySelectorAll('.bg-shapes > div')] : [];
  const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const rates = [-0.035, 0.022, -0.014];
  let frame = 0;

  if (!root || shapes.length === 0) return;

  const clearMotion = () => {
    shapes.forEach((shape) => shape.style.removeProperty('--shape-scroll-y'));
  };

  const updateMotion = () => {
    frame = 0;
    if (!motionAllowed.matches) {
      clearMotion();
      return;
    }

    const mobileScale = window.matchMedia('(max-width: 750px)').matches ? 0.6 : 1;
    const rootTop = root.getBoundingClientRect().top + window.scrollY;
    const travel = Math.min(
      Math.max(window.scrollY - rootTop, 0),
      window.innerHeight * 1.5,
    );

    shapes.forEach((shape, index) => {
      const offset = travel * (rates[index] ?? rates.at(-1)) * mobileScale;
      shape.style.setProperty('--shape-scroll-y', `${offset.toFixed(1)}px`);
    });
  };

  const scheduleMotion = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateMotion);
  };

  window.addEventListener('scroll', scheduleMotion, { passive: true });
  window.addEventListener('resize', scheduleMotion);
  motionAllowed.addEventListener('change', scheduleMotion);
  scheduleMotion();
})();
