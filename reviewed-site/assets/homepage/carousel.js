document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    const slides = [...carousel.querySelectorAll('.slide')];
    const imageBoxes = slides.map(slide => slide.querySelector('.slide-viewport'));
    const dots = [...carousel.querySelectorAll('.dot')];
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const iconPlay = btnPlayPause.querySelector('.icon-play');
    const iconPause = btnPlayPause.querySelector('.icon-pause');
    const footerProgress = document.getElementById('progress-indicator');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverCapability = window.matchMedia('(hover: hover)');
    const duration = 5000;

    let currentIndex = 0;
    let elapsed = 0;
    let lastTick = null;
    let frame = null;
    let isPlaying = !motionPreference.matches;
    let hoverPaused = hoverCapability.matches && imageBoxes[0].matches(':hover');
    let focusPaused = carousel.contains(document.activeElement) && document.activeElement.matches(':focus-visible');

    function renderProgress() {
        const transform = `scaleX(${Math.min(elapsed / duration, 1)})`;
        slides[currentIndex].querySelector('.action-progress-fill').style.transform = transform;
        if (footerProgress) footerProgress.style.transform = transform;
    }

    function canRun() {
        return isPlaying && !hoverPaused && !focusPaused && !document.hidden;
    }

    function stopClock() {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        if (lastTick !== null) elapsed = Math.min(duration, elapsed + performance.now() - lastTick);
        lastTick = null;
        renderProgress();
    }

    function showSlide(index) {
        slides[currentIndex].querySelector('.action-progress-fill').style.transform = 'scaleX(0)';
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
            slide.setAttribute('aria-hidden', String(i !== index));
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-selected', String(i === index));
            dot.tabIndex = i === index ? 0 : -1;
        });
        currentIndex = index;
        elapsed = 0;
        renderProgress();
    }

    function tick(time) {
        frame = null;
        if (!canRun()) { lastTick = null; return; }
        elapsed += time - lastTick;
        lastTick = time;
        if (elapsed >= duration) showSlide((currentIndex + 1) % slides.length);
        renderProgress();
        frame = requestAnimationFrame(tick);
    }

    function syncClock() {
        const running = canRun();
        carousel.classList.toggle('is-playing', running);
        if (!running) { stopClock(); return; }
        if (frame === null) {
            lastTick = performance.now();
            frame = requestAnimationFrame(tick);
        }
    }

    function selectSlide(index) {
        stopClock();
        showSlide(index);
        syncClock();
    }

    function updatePlayPauseIcon() {
        btnPlayPause.setAttribute('aria-label', isPlaying ? 'Pause Carousel' : 'Play Carousel');
        iconPlay.style.display = isPlaying ? 'none' : 'block';
        iconPause.style.display = isPlaying ? 'block' : 'none';
    }

    btnPrev.addEventListener('click', () => selectSlide((currentIndex - 1 + slides.length) % slides.length));
    btnNext.addEventListener('click', () => selectSlide((currentIndex + 1) % slides.length));
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => selectSlide(index));
        dot.addEventListener('keydown', event => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const target = event.key === 'ArrowLeft' ? (index - 1 + slides.length) % slides.length
                : event.key === 'ArrowRight' ? (index + 1) % slides.length
                : event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : index;
            selectSlide(target);
            dots[target].focus();
        });
    });

    btnPlayPause.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) { hoverPaused = false; focusPaused = false; }
        updatePlayPauseIcon();
        syncClock();
    });
    imageBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            if (!hoverCapability.matches) return;
            hoverPaused = true;
            focusPaused = false;
            syncClock();
        });
        box.addEventListener('mouseleave', () => { hoverPaused = false; syncClock(); });
    });
    carousel.addEventListener('focusin', event => {
        focusPaused = event.target.matches(':focus-visible');
        syncClock();
    });
    carousel.addEventListener('focusout', event => {
        focusPaused = !!event.relatedTarget && carousel.contains(event.relatedTarget) && event.relatedTarget.matches(':focus-visible');
        syncClock();
    });
    document.addEventListener('visibilitychange', syncClock);
    motionPreference.addEventListener?.('change', () => {
        if (motionPreference.matches) { isPlaying = false; updatePlayPauseIcon(); }
        syncClock();
    });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', event => {
        const delta = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) < 50) return;
        selectSlide((currentIndex + (delta < 0 ? 1 : slides.length - 1)) % slides.length);
    }, { passive: true });

    updatePlayPauseIcon();
    renderProgress();
    syncClock();
});
