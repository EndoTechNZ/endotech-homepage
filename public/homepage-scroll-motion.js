(() => {
  const root = document.querySelector('.v10');
  const shapes = root ? [...root.querySelectorAll('.bg-shapes > div')] : [];
  const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const profiles = [
    { x: -0.12, y: 0.16, arc: 0.045, scale: 0.085 },
    { x: 0.1, y: -0.13, arc: -0.055, scale: -0.06 },
    { x: 0.14, y: -0.1, arc: 0.05, scale: 0.07 },
  ];
  let targetProgress = 0;
  let currentProgress = 0;
  let frame = 0;

  if (!root || shapes.length === 0) return;

  const clearMotion = () => {
    shapes.forEach((shape) => {
      shape.style.removeProperty('--shape-scroll-x');
      shape.style.removeProperty('--shape-scroll-y');
      shape.style.removeProperty('--shape-scroll-scale');
    });
  };

  const readScroll = () => {
    if (!motionAllowed.matches) {
      clearMotion();
      return;
    }

    const rootTop = root.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(window.innerHeight * 1.8, 1);
    targetProgress = Math.min(Math.max((window.scrollY - rootTop) / range, 0), 1);

    if (!frame) frame = window.requestAnimationFrame(renderMotion);
  };

  const renderMotion = () => {
    const delta = targetProgress - currentProgress;
    currentProgress += delta * 0.18;

    const easedProgress = currentProgress * (2 - currentProgress);
    const arcProgress = Math.sin(currentProgress * Math.PI);
    const mobileScale = window.matchMedia('(max-width: 750px)').matches ? 0.82 : 1;

    shapes.forEach((shape, index) => {
      const profile = profiles[index] ?? profiles.at(-1);
      const x = window.innerWidth
        * (profile.x * easedProgress + profile.arc * arcProgress)
        * mobileScale;
      const y = window.innerHeight * profile.y * easedProgress * mobileScale;
      const scale = 1 + profile.scale * easedProgress * mobileScale;

      shape.style.setProperty('--shape-scroll-x', `${x.toFixed(1)}px`);
      shape.style.setProperty('--shape-scroll-y', `${y.toFixed(1)}px`);
      shape.style.setProperty('--shape-scroll-scale', scale.toFixed(4));
    });

    if (Math.abs(delta) > 0.001) {
      frame = window.requestAnimationFrame(renderMotion);
    } else {
      currentProgress = targetProgress;
      frame = 0;
    }
  };

  const handlePreferenceChange = () => {
    if (!motionAllowed.matches) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      currentProgress = 0;
      targetProgress = 0;
      clearMotion();
      return;
    }

    readScroll();
  };

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', readScroll);
  motionAllowed.addEventListener('change', handlePreferenceChange);
  readScroll();
})();
