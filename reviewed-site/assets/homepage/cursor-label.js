document.addEventListener('DOMContentLoaded', () => {
    const motionAllowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!window.ResizeObserver || !motionAllowed.addEventListener) return;

    document.querySelectorAll('.slide-viewport').forEach(view => {
        const label = view.querySelector('.compatibility-product-name');
        const panel = view.querySelector('.slide-compatibility');
        const slide = view.closest('.slide');
        if (!label || !panel || !slide) return;

        view.insertBefore(label, panel);
        label.classList.add('cursor-follow-label');

        let x = 0, y = 0, targetX = 0, targetY = 0;
        let frame = 0, previousTime = 0, following = false;
        let pointerX = 0, pointerY = 0;

        function dockPosition() {
            return { x: panel.offsetLeft, y: panel.offsetTop - label.offsetHeight - 8 };
        }

        function paint() {
            label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }

        function snapToDock() {
            cancelAnimationFrame(frame);
            frame = 0;
            following = false;
            view.classList.remove('is-cursor-following');
            const dock = dockPosition();
            x = targetX = dock.x;
            y = targetY = dock.y;
            paint();
        }

        function tick(time) {
            const elapsed = Math.min(time - previousTime, 64);
            previousTime = time;
            const catchUp = 1 - Math.exp(-elapsed / 90);
            x += (targetX - x) * catchUp;
            y += (targetY - y) * catchUp;
            if (Math.hypot(targetX - x, targetY - y) < 0.15) {
                x = targetX;
                y = targetY;
                paint();
                frame = 0;
                return;
            }
            paint();
            frame = requestAnimationFrame(tick);
        }

        function animate() {
            if (frame) return;
            previousTime = performance.now();
            frame = requestAnimationFrame(tick);
        }

        function updatePointerTarget() {
            const bounds = view.getBoundingClientRect();
            const maxX = Math.max(16, view.clientWidth - label.offsetWidth - 16);
            const maxY = Math.max(16, dockPosition().y);
            targetX = Math.max(16, Math.min(pointerX - bounds.left + 18, maxX));
            targetY = Math.max(16, Math.min(pointerY - bounds.top + 18, maxY));
            animate();
        }

        function followPointer(event) {
            if (!motionAllowed.matches || event.pointerType !== 'mouse' || !slide.classList.contains('is-active')) return;
            following = true;
            pointerX = event.clientX;
            pointerY = event.clientY;
            view.classList.add('is-cursor-following');
            updatePointerTarget();
        }

        view.addEventListener('pointerenter', followPointer);
        view.addEventListener('pointermove', followPointer);
        view.addEventListener('pointerleave', () => {
            if (!following) return;
            following = false;
            view.classList.remove('is-cursor-following');
            const dock = dockPosition();
            targetX = dock.x;
            targetY = dock.y;
            animate();
        });
        view.addEventListener('pointercancel', snapToDock);

        const refresh = () => following ? updatePointerTarget() : snapToDock();
        const resizeObserver = new ResizeObserver(refresh);
        resizeObserver.observe(view);
        resizeObserver.observe(panel);
        resizeObserver.observe(label);
        new MutationObserver(snapToDock).observe(slide, { attributes: true, attributeFilter: ['class'] });
        motionAllowed.addEventListener('change', snapToDock);
        window.addEventListener('scroll', () => { if (following) updatePointerTarget(); }, { passive: true });
        document.addEventListener('visibilitychange', () => { if (document.hidden) snapToDock(); });
        snapToDock();
    });
});
