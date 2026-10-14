import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../reviewed-site/index.html', import.meta.url), 'utf8');
const code = await readFile(new URL('../reviewed-site/assets/homepage/carousel.js', import.meta.url), 'utf8');

async function fixture(reduced = false) {
    const dom = new JSDOM(html, { url: 'https://endotechnz.com/', pretendToBeVisual: true, runScripts: 'outside-only' });
    const { window } = dom;
    const document = window.document;
    let now = 0, hidden = false, id = 0;
    const frames = new Map();
    const motion = Object.assign(new window.EventTarget(), { matches: reduced });
    const hover = Object.assign(new window.EventTarget(), { matches: true });
    window.matchMedia = query => query.includes('prefers-reduced-motion') ? motion : hover;
    Object.defineProperty(window.performance, 'now', { value: () => now });
    Object.defineProperty(document, 'hidden', { get: () => hidden });
    window.requestAnimationFrame = callback => { frames.set(++id, callback); return id; };
    window.cancelAnimationFrame = frame => frames.delete(frame);
    window.eval(code);
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    const carousel = document.getElementById('hero-carousel');
    return {
        window, document, carousel,
        advance(ms) { now += ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now)); },
        active() { return carousel.querySelector('.slide.is-active').id; },
        fill() { return Number(carousel.querySelector('.slide.is-active .action-progress-fill').style.transform.match(/scaleX\(([^)]+)\)/)[1]); },
        click(id) { document.getElementById(id).click(); },
        hover(inside) { carousel.querySelector('.slide.is-active .slide-viewport').dispatchEvent(new window.MouseEvent(inside ? 'mouseenter' : 'mouseleave')); },
        hide(value) { hidden = value; document.dispatchEvent(new window.Event('visibilitychange')); },
        reduce(value) { motion.matches = value; motion.dispatchEvent(new window.Event('change')); },
        close() { window.close(); }
    };
}

let f = await fixture();
assert.equal(f.document.querySelectorAll('.progress-action').length, 5);
assert.equal(f.document.querySelectorAll('.slide.is-active .progress-action').length, 1);
assert.equal(f.active(), 'hero-slide-rg');
f.advance(2500);
assert.equal(f.fill(), 0.5);
assert.equal(f.document.getElementById('progress-indicator').style.transform, 'scaleX(0.5)');
f.advance(2499);
assert.equal(f.active(), 'hero-slide-rg');
f.advance(1);
assert.equal(f.active(), 'hero-slide-et');
assert.equal(f.fill(), 0);
for (const next of ['hero-slide-pt', 'hero-slide-micro-path', 'hero-slide-c-plus', 'hero-slide-rg']) {
    f.advance(5000);
    assert.equal(f.active(), next);
    assert.equal(f.fill(), 0);
}
f.close();

f = await fixture();
f.advance(2000);
f.hover(true);
f.advance(9000);
assert.equal(f.fill(), 0.4);
assert.equal(f.active(), 'hero-slide-rg');
f.hover(false);
f.advance(2999);
assert.equal(f.active(), 'hero-slide-rg');
f.advance(1);
assert.equal(f.active(), 'hero-slide-et');
f.close();

f = await fixture();
f.advance(1750);
f.click('btn-play-pause');
f.advance(10000);
assert.equal(f.fill(), 0.35);
f.click('btn-play-pause');
assert.equal(f.active(), 'hero-slide-rg');
assert.equal(f.fill(), 0.35);
f.advance(3250);
assert.equal(f.active(), 'hero-slide-et');
f.click('btn-play-pause');
f.click('hero-tab-c-plus');
assert.equal(f.active(), 'hero-slide-c-plus');
assert.equal(f.fill(), 0);
assert.equal(f.carousel.querySelector('.slide.is-active .progress-action').getAttribute('href'), '/products/c-plus/');
f.click('btn-play-pause');
f.advance(5000);
assert.equal(f.active(), 'hero-slide-rg');
f.close();

f = await fixture();
f.advance(1000);
f.hide(true);
f.advance(20000);
assert.equal(f.fill(), 0.2);
f.hide(false);
f.advance(4000);
assert.equal(f.active(), 'hero-slide-et');
f.close();

f = await fixture();
f.advance(1000);
const image = f.carousel.querySelector('.slide.is-active .slide-viewport');
image.focus();
f.advance(10000);
assert.equal(f.fill(), 0.2);
assert.equal(f.active(), 'hero-slide-rg');
f.hover(true);
f.advance(5000);
assert.equal(f.fill(), 0.2);
f.hover(false);
f.advance(4000);
assert.equal(f.active(), 'hero-slide-et');
f.close();

f = await fixture(true);
f.advance(10000);
assert.equal(f.active(), 'hero-slide-rg');
assert.equal(f.fill(), 0);
assert.equal(f.document.getElementById('btn-play-pause').getAttribute('aria-label'), 'Play Carousel');
f.close();

f = await fixture();
f.advance(1000);
f.reduce(true);
f.advance(10000);
assert.equal(f.fill(), 0.2);
assert.equal(f.active(), 'hero-slide-rg');
f.close();

f = await fixture();
f.click('btn-play-pause');
f.document.getElementById('hero-tab-rg').dispatchEvent(new f.window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
assert.equal(f.active(), 'hero-slide-c-plus');
assert.equal(f.document.activeElement.id, 'hero-tab-c-plus');
assert.equal(f.document.getElementById('hero-tab-c-plus').getAttribute('aria-selected'), 'true');
assert.equal(f.document.getElementById('hero-tab-c-plus').tabIndex, 0);
assert.equal(f.document.getElementById('hero-tab-rg').tabIndex, -1);
f.document.getElementById('hero-tab-c-plus').dispatchEvent(new f.window.KeyboardEvent('keydown', { key: 'Home', ctrlKey: true, bubbles: true }));
assert.equal(f.active(), 'hero-slide-c-plus');
f.close();

console.log('Homepage carousel checks passed: timing, all five slides, pause/resume, hover, visibility, reduced motion and keyboard controls.');
