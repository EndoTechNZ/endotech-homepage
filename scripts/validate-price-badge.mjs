import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../reviewed-site/index.html', import.meta.url), 'utf8');
const code = await readFile(new URL('../reviewed-site/assets/homepage/price-badge.js', import.meta.url), 'utf8');

// Parse markup only. No HTML scripts, resources, layout, or browser are executed.
const dom = new JSDOM(html);
const document = dom.window.document;
const hero = document.getElementById('hero-carousel');
const badges = document.querySelectorAll('#persistent-price-badge');
assert.equal(badges.length, 1, 'The offer must have one persistent badge.');
const badge = badges[0];
assert.equal(badge.closest('.slide'), null, 'The badge must survive slide fades.');
assert.equal(badge.getAttribute('role'), 'note');
assert.equal(badge.querySelector('strong').textContent, 'Half the price');
assert.equal(badge.querySelector('.shared-price-detail').textContent, 'of major competitors');
const slideIds = [...hero.querySelectorAll('.slide')].map(slide => {
  assert.equal(slide.querySelectorAll('.price-badge-slot').length, 1, `${slide.id} needs one desktop dock.`);
  assert.equal(slide.querySelector('.price-badge-slot').getAttribute('aria-hidden'), 'true');
  assert.ok(slide.getAttribute('aria-describedby').split(/\s+/).includes(badge.id));
  return slide.id;
});
assert.equal(slideIds.length, 5);
assert.ok(slideIds.includes('hero-slide-c-plus'), 'C+ must participate.');
assert.equal(hero.querySelectorAll('.price-badge-mobile-dock .price-badge-slot').length, 1);
assert.equal(hero.querySelectorAll('.price-badge-slot').length, 6);
dom.window.close();

function translated(transform) {
  const match = /^translate3d\(\s*([-\d.]+)px,\s*([-\d.]+)px,\s*0\s*\)$/.exec(transform);
  assert.ok(match, `Expected a positioned badge, received ${transform}`);
  return [Number(match[1]), Number(match[2])];
}

function fixture({ mobile = false, reduced = false } = {}) {
  const root = { left: 50, top: 90, width: 1000, height: 900 };
  const records = [], mutations = [], resizes = [], frames = new Map();
  let frameId = 0;
  function node(name, position = [0, 0]) {
    return {
      name, id: name, position, style: {}, dataset: {}, visiblePosition: null, visibleTransform: 'none',
      classList: { add() {} },
      getBoundingClientRect() {
        const [x, y] = this.visiblePosition ?? (this.style.transform ? translated(this.style.transform) : this.position);
        return { left: root.left + x, top: root.top + y, width: 224, height: 78 };
      },
      animate(keyframes, options) {
        const element = this;
        const record = {
          element: name, keyframes, options, cancelled: false,
          cancel() {
            this.cancelled = true;
            // Cancellation exposes underlying styles, as in Web Animations.
            element.visiblePosition = null;
            element.visibleTransform = 'none';
          }
        };
        records.push(record);
        return record;
      }
    };
  }
  const sharedBadge = node('badge'), card = node('card'), shine = node('shine');
  const mobileDock = node('mobile-dock', [24, 20]);
  // PT and MicroPath deliberately share a dock, exercising the unchanged-coordinate case.
  const coordinates = [[72, 380], [72, 402], [72, 430], [72, 430], [72, 390]];
  const slides = slideIds.map((id, index) => {
    const slide = node(id);
    slide.dock = node(`${id}-dock`, coordinates[index]);
    slide.active = index === 0;
    slide.querySelector = selector => selector === '.price-badge-slot' ? slide.dock : null;
    return slide;
  });
  sharedBadge.querySelector = selector => selector === '.shared-price-card' ? card : shine;
  const heroNode = node('hero-carousel');
  heroNode.getBoundingClientRect = () => root;
  heroNode.querySelector = selector => selector === '.slide.is-active' ? slides.find(slide => slide.active) : mobileDock;
  heroNode.querySelectorAll = selector => selector === '.slide' ? slides : [mobileDock, ...slides.map(slide => slide.dock)];
  const listeners = new Map();
  const mockDocument = {
    hidden: false,
    getElementById: id => id === 'hero-carousel' ? heroNode : id === 'persistent-price-badge' ? sharedBadge : null,
    addEventListener: (type, callback) => listeners.set(type, callback)
  };
  function media(matches) {
    const callbacks = [];
    return { matches, addEventListener: (_type, callback) => callbacks.push(callback),
      change(value) { this.matches = value; callbacks.forEach(callback => callback()); } };
  }
  const mobileQuery = media(mobile), motionQuery = media(reduced);
  function observer(callback, collection) {
    const instance = { callback, observed: [], observe(element, options) { this.observed.push({ element, options }); } };
    collection.push(instance);
    return instance;
  }
  // Execute only the local controller against deterministic mocks, not the parsed HTML.
  vm.runInNewContext(code, {
    document: mockDocument,
    matchMedia: query => query.includes('prefers-reduced-motion') ? motionQuery : mobileQuery,
    getComputedStyle: element => ({ transform: element.visibleTransform }),
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    MutationObserver: function (callback) { return observer(callback, mutations); },
    ResizeObserver: function (callback) { return observer(callback, resizes); }
  }, { filename: 'price-badge.js' });
  listeners.get('DOMContentLoaded')();
  assert.equal(mutations[0].observed.length, 5, 'Every slide must be observed.');
  assert.equal(resizes[0].observed.length, 7, 'The hero and all docks must be observed.');
  function flush() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(0));
  }
  return {
    badge: sharedBadge, card, records, slides, mobileDock, root,
    select(id) {
      assert.ok(slides.some(slide => slide.id === id));
      slides.forEach(slide => { slide.active = slide.id === id; });
      mutations[0].callback([]);
      flush();
    },
    resize() { resizes[0].callback([]); flush(); },
    mobile(value) { mobileQuery.change(value); flush(); },
    reduce(value) { motionQuery.change(value); flush(); },
    badgeAnimations() { return records.filter(record => record.element === 'badge'); }
  };
}

let f = fixture();
assert.equal(f.records.length, 0, 'Initial placement should be immediate.');
assert.equal(f.badge.dataset.forSlide, slideIds[0]);
assert.deepEqual(translated(f.badge.style.transform), f.slides[0].dock.position);
for (const id of [...slideIds.slice(1), slideIds[0]]) {
  const before = f.badgeAnimations().length;
  f.select(id);
  assert.equal(f.badge.dataset.forSlide, id);
  assert.equal(f.badgeAnimations().length, before + 1, `${id} should animate even when docks coincide.`);
  assert.deepEqual(translated(f.badge.style.transform), f.slides.find(slide => slide.id === id).dock.position);
}

f = fixture();
f.select(slideIds[1]);
const interrupted = [...f.records];
const visiblePosition = [115, 222];
const visibleTilt = 'matrix3d(1, 0, 0.1, 0, 0, 1, 0, 0, -0.1, 0, 1, 0, 0, 0, 0, 1)';
f.badge.visiblePosition = visiblePosition;
f.card.visibleTransform = visibleTilt;
f.select(slideIds[2]);
assert.ok(interrupted.every(animation => animation.cancelled), 'Interrupted animations should be replaced.');
const replacement = f.records.slice(interrupted.length);
assert.deepEqual(translated(replacement.find(animation => animation.element === 'badge').keyframes[0].transform), visiblePosition,
  'An interrupted move must start at the current visible position.');
assert.equal(replacement.find(animation => animation.element === 'card').keyframes[0].transform, visibleTilt,
  'An interrupted move must retain the current tilt.');
const beforeResize = f.records.length;
f.resize();
assert.equal(f.records.length, beforeResize, 'Stable geometry should not restart movement.');
assert.ok(replacement.every(animation => !animation.cancelled), 'Stable resize must not cancel movement.');

f = fixture({ mobile: true });
assert.deepEqual(translated(f.badge.style.transform), f.mobileDock.position, 'Mobile must use the reserved shared dock.');
for (const id of slideIds.slice(1)) {
  const before = f.badgeAnimations().length;
  f.select(id);
  assert.deepEqual(translated(f.badge.style.transform), f.mobileDock.position);
  assert.equal(f.badgeAnimations().length, before + 1, 'Mobile changes should still animate at the shared dock.');
}
const beforeDesktop = f.records.length;
f.mobile(false);
assert.equal(f.records.length, beforeDesktop, 'Breakpoint changes should snap rather than add slide motion.');
assert.deepEqual(translated(f.badge.style.transform), f.slides.at(-1).dock.position);

f = fixture({ reduced: true });
for (const id of slideIds.slice(1)) {
  f.select(id);
  assert.equal(f.records.length, 0, 'Reduced motion must avoid animations.');
  assert.deepEqual(translated(f.badge.style.transform), f.slides.find(slide => slide.id === id).dock.position);
}
f = fixture();
f.select(slideIds[1]);
const beforeReduction = f.records.length;
f.reduce(true);
assert.ok(f.records.every(animation => animation.cancelled), 'Enabling reduced motion must stop in-flight animations.');
f.select(slideIds[2]);
assert.equal(f.records.length, beforeReduction);
assert.deepEqual(translated(f.badge.style.transform), f.slides[2].dock.position);

console.log('Price badge checks passed: shared markup, all five slides, equal docks, interrupted motion, stable resize, mobile dock and reduced motion.');
