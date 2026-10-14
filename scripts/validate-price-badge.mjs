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
const skin = badge.querySelector('svg.shared-price-skin');
assert.ok(skin, 'Liquid motion must use an independent SVG background.');
assert.equal(skin.getAttribute('aria-hidden'), 'true');
assert.ok(skin.querySelector('.shared-price-outline'));
assert.ok(skin.querySelector('clipPath .shared-price-clip'));
assert.ok(skin.querySelector('g[clip-path] .shared-price-shine'));
assert.equal(skin.querySelector('strong, .shared-price-detail'), null, 'Offer text must stay outside the liquid skin.');
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

function closePoint(actual, expected) {
  assert.ok(Math.hypot(actual[0] - expected[0], actual[1] - expected[1]) < 1e-6,
    `Expected position ${expected}, received ${actual}.`);
}

function smoothTravel(animation, start, end, { straight = false } = {}) {
  assert.ok(animation, 'A changed dock must have a position animation.');
  const points = animation.keyframes.map(frame => translated(frame.transform));
  closePoint(points[0], start);
  closePoint(points.at(-1), end);
  const dx = end[0] - start[0], dy = end[1] - start[1], distance = Math.hypot(dx, dy);
  let previousProgress = -1, previousOffset = -1;
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i], offset = animation.keyframes[i].offset;
    const progress = ((x - start[0]) * dx + (y - start[1]) * dy) / (distance * distance);
    const deviation = Math.abs((x - start[0]) * dy - (y - start[1]) * dx) / distance;
    assert.ok(Number.isFinite(offset) && offset >= 0 && offset <= 1 && offset > previousOffset,
      'Position samples must advance continuously in time.');
    assert.ok(progress >= -1e-7 && progress <= 1 + 1e-7 && progress >= previousProgress - 1e-7,
      'Travel must progress toward its endpoint without reversing or overshooting.');
    assert.ok(deviation <= (straight ? 1e-6 : 4.1), 'The path must remain shallow, and straight on mobile.');
    if (i) {
      assert.ok(Math.hypot(x - points[i - 1][0], y - points[i - 1][1]) <= distance * .1 + .1,
        'Adjacent position samples must not produce a large jump.');
    }
    previousProgress = progress;
    previousOffset = offset;
  }
}

function fixture({ mobile = false, reduced = false } = {}) {
  const root = { left: 50, top: 90, width: 1000, height: 900 };
  const records = [], mutations = [], resizes = [], frames = new Map(), attributeWrites = [];
  let frameId = 0, now = 0;
  function node(name, position = [0, 0]) {
    return {
      name, id: name, position, style: {}, dataset: {}, attributes: {}, visiblePosition: null,
      classList: { add() {} },
      setAttribute(attribute, value) { this.attributes[attribute] = value; attributeWrites.push({ name, attribute, value }); },
      getAttribute(attribute) { return this.attributes[attribute] ?? null; },
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
          }
        };
        records.push(record);
        return record;
      }
    };
  }
  const sharedBadge = node('badge'), card = node('card'), shine = node('shine');
  const outline = node('outline'), clip = node('clip');
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
  const badgeChildren = { '.shared-price-card': card, '.shared-price-shine': shine,
    '.shared-price-outline': outline, '.shared-price-clip': clip };
  sharedBadge.querySelector = selector => badgeChildren[selector] ?? null;
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
    performance: { now: () => now },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    MutationObserver: function (callback) { return observer(callback, mutations); },
    ResizeObserver: function (callback) { return observer(callback, resizes); }
  }, { filename: 'price-badge.js' });
  listeners.get('DOMContentLoaded')();
  assert.equal(mutations[0].observed.length, 5, 'Every slide must be observed.');
  assert.equal(resizes[0].observed.length, 7, 'The hero and all docks must be observed.');
  function flush() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(now));
  }
  return {
    badge: sharedBadge, records, slides, mobileDock, root, outline, clip, attributeWrites,
    select(id) {
      assert.ok(slides.some(slide => slide.id === id));
      slides.forEach(slide => { slide.active = slide.id === id; });
      mutations[0].callback([]);
      flush();
    },
    resize() { resizes[0].callback([]); flush(); },
    mobile(value) { mobileQuery.change(value); flush(); },
    reduce(value) { motionQuery.change(value); flush(); },
    advance(ms) { now += ms; flush(); },
    hide(value) { mockDocument.hidden = value; listeners.get('visibilitychange')(); flush(); },
    pendingFrames() { return frames.size; },
    assertStationaryCard() { assert.ok(records.every(record => record.element !== 'card'), 'The text card must not animate.'); },
    badgeAnimations() { return records.filter(record => record.element === 'badge'); }
  };
}

let f = fixture();
assert.equal(f.records.length, 0, 'Initial placement should be immediate.');
assert.equal(f.badge.dataset.forSlide, slideIds[0]);
assert.deepEqual(translated(f.badge.style.transform), f.slides[0].dock.position);
for (const id of [...slideIds.slice(1), slideIds[0]]) {
  const before = f.badgeAnimations().length;
  const start = translated(f.badge.style.transform);
  const destination = f.slides.find(slide => slide.id === id).dock.position;
  const moved = Math.hypot(destination[0] - start[0], destination[1] - start[1]) > 1;
  const beforeEffects = f.records.length;
  f.select(id);
  assert.equal(f.badge.dataset.forSlide, id);
  assert.equal(f.badgeAnimations().length, before + (moved ? 1 : 0), `${id} should travel only when its dock changes.`);
  if (moved) smoothTravel(f.badgeAnimations().at(-1), start, destination);
  assert.ok(f.records.slice(beforeEffects).some(record => record.element === 'shine'), 'Each slide change may have a quiet shine.');
  closePoint(translated(f.badge.style.transform), destination);
  f.assertStationaryCard();
}

f = fixture();
f.select(slideIds[1]);
const interrupted = [...f.records];
const visiblePosition = [115, 222];
f.badge.visiblePosition = visiblePosition;
f.advance(600);
const visibleSkin = f.outline.getAttribute('d');
f.select(slideIds[2]);
assert.ok(interrupted.every(animation => animation.cancelled), 'Interrupted animations should be replaced.');
const replacement = f.records.slice(interrupted.length);
smoothTravel(replacement.find(animation => animation.element === 'badge'), visiblePosition, f.slides[2].dock.position);
f.advance(0);
assert.equal(f.outline.getAttribute('d'), visibleSkin, 'Interrupted liquid motion must start from its visible shape.');
f.assertStationaryCard();
const beforeResize = f.records.length;
f.resize();
assert.equal(f.records.length, beforeResize, 'Stable geometry should not restart movement.');
assert.ok(replacement.every(animation => !animation.cancelled), 'Stable resize must not cancel movement.');
assert.ok(f.pendingFrames() > 0, 'Stable resize must preserve the independent liquid clock.');

const restSkin = fixture().outline.getAttribute('d');
for (let step = 0; step < 15; step++) {
  f.advance(100);
  assert.equal(f.outline.getAttribute('d'), f.clip.getAttribute('d'), 'The shine clip must track the liquid boundary.');
  const path = f.outline.getAttribute('d');
  const values = path.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
  const rest = restSkin.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
  assert.equal(values.length, rest.length, 'Liquid morphing must keep the same path topology.');
  values.forEach((value, index) => assert.ok(Math.abs(value - rest[index]) <= 2.61, 'The liquid edge must stay subtle.'));
}
assert.equal(f.outline.getAttribute('d'), restSkin, 'The liquid skin must settle back to its rest shape.');
assert.equal(f.pendingFrames(), 0, 'Completed skin motion must stop requesting frames.');

f = fixture();
f.select(slideIds[1]);
f.advance(600);
f.slides[1].dock.position = [90, 420];
f.resize();
assert.ok(f.records.every(animation => animation.cancelled), 'Changed layout should cancel stale animations.');
assert.equal(f.pendingFrames(), 0);
assert.equal(f.outline.getAttribute('d'), restSkin);
closePoint(translated(f.badge.style.transform), f.slides[1].dock.position);

f = fixture({ mobile: true });
assert.deepEqual(translated(f.badge.style.transform), f.mobileDock.position, 'Mobile must use the reserved shared dock.');
for (const id of slideIds.slice(1)) {
  f.select(id);
  assert.deepEqual(translated(f.badge.style.transform), f.mobileDock.position);
  assert.equal(f.badgeAnimations().length, 0, 'Mobile must stay physically still when its shared dock is unchanged.');
  f.assertStationaryCard();
}
const mobileStart = [...f.mobileDock.position];
f.mobileDock.position = [64, 40];
f.select(slideIds[0]);
smoothTravel(f.badgeAnimations().at(-1), mobileStart, f.mobileDock.position, { straight: true });
const beforeDesktop = f.records.length;
f.mobile(false);
assert.equal(f.records.length, beforeDesktop, 'Breakpoint changes should snap rather than add slide motion.');
assert.deepEqual(translated(f.badge.style.transform), f.slides[0].dock.position);
assert.equal(f.pendingFrames(), 0, 'Breakpoint changes must cancel stale skin frames.');

f = fixture({ reduced: true });
for (const id of slideIds.slice(1)) {
  f.select(id);
  assert.equal(f.records.length, 0, 'Reduced motion must avoid animations.');
  assert.equal(f.pendingFrames(), 0, 'Reduced motion must avoid liquid animation frames.');
  assert.deepEqual(translated(f.badge.style.transform), f.slides.find(slide => slide.id === id).dock.position);
}
f = fixture();
f.select(slideIds[1]);
const beforeReduction = f.records.length;
f.reduce(true);
assert.ok(f.records.every(animation => animation.cancelled), 'Enabling reduced motion must stop in-flight animations.');
assert.equal(f.pendingFrames(), 0);
assert.equal(f.outline.getAttribute('d'), restSkin);
f.select(slideIds[2]);
assert.equal(f.records.length, beforeReduction);
assert.deepEqual(translated(f.badge.style.transform), f.slides[2].dock.position);

f = fixture();
f.select(slideIds[1]);
f.advance(600);
f.hide(true);
const hiddenWrites = f.attributeWrites.length;
f.advance(2000);
assert.equal(f.attributeWrites.length, hiddenWrites, 'Hidden pages must not continue skin work.');
assert.equal(f.pendingFrames(), 0);
assert.ok(f.records.every(animation => animation.cancelled));

console.log('Price badge checks passed: shared markup, all five slides, shallow continuous travel, still equal docks, stationary text, interrupted position/skin, resize, mobile, reduced motion and bounded liquid edges.');
