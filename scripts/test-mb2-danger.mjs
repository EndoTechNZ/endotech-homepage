import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit } from 'playwright';
import sharp from 'sharp';

const base = process.env.MB2_TEST_URL || 'http://127.0.0.1:4333';
const output = 'output/playwright';
await fs.mkdir(output, { recursive: true });
const results = [];
for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch({ headless: true });
  try {
    for (const width of [320, 390, 430, 844, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: width === 844 ? 390 : 844 }, hasTouch: width < 1000, isMobile: width < 1000 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/viewers/upper-molar-mb2/`);
      await page.waitForFunction(() => window.viewerCheck?.().loaded, null, { timeout: 60000 });
      for (const point of [1, 2]) {
        const button = page.getByRole('button', { name: `Danger point ${point}`, exact: true });
        if (width < 1000) await button.tap(); else await button.click();
        await page.locator('#stage').scrollIntoViewIfNeeded();
        await page.waitForFunction(n => document.querySelector('.mb2-danger-panel:not([hidden]) .mb2-danger-eyebrow')?.textContent === `Danger point ${n}`, point);
        const geometry = await page.evaluate(() => {
          const panel = document.querySelector('.mb2-danger-panel');
          const stage = document.querySelector('#stage');
          const rect = panel.getBoundingClientRect(), area = stage.getBoundingClientRect(), canvas = stage.querySelector('canvas').getBoundingClientRect();
          return { centerError: Math.abs(rect.x + rect.width / 2 - area.x - area.width / 2), panelBottom: rect.bottom, canvasTop: canvas.top, overflow: document.documentElement.scrollWidth > innerWidth, text: panel.textContent, buttonHeight: document.querySelector('.mb2-danger-navigation button').getBoundingClientRect().height, state: window.viewerCheck() };
        });
        assert(geometry.centerError < 1, 'Warning must stay centred');
        assert(!geometry.overflow, 'No horizontal overflow');
        assert(geometry.buttonHeight >= 44, 'Touch controls must be at least 44px high');
        if (width <= 720) assert(geometry.panelBottom <= geometry.canvasTop, 'Warning must not obscure the mobile canvas');
        assert(geometry.text.includes(point === 1 ? '3 millimeters from the pulp chamber floor.' : 'the curve at the canal junction.'));
        const screenshot = await page.locator('#stage').screenshot({ path: `${output}/mb2-${engine}-${width}-point-${point}.png` });
        const stats = await sharp(await page.locator('canvas').screenshot()).stats();
        assert(stats.channels[0].stdev > 5, 'Model screenshot must not be blank');
      }
      // Direct marker taps use the same seek action without requiring hover.
      await page.locator('.mb2-danger-marker').first().click();
      await page.waitForFunction(() => document.querySelector('.mb2-danger-eyebrow').textContent === 'Danger point 1');
      const before = await page.locator('.mb2-danger-marker').first().getAttribute('style');
      await page.locator('canvas').press('ArrowRight');
      await page.waitForFunction(previous => document.querySelector('.mb2-danger-marker').getAttribute('style') !== previous, before);
      await page.locator('#file').uncheck();
      await page.locator('#stage').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.mb2-danger-panel').hidden && [...document.querySelectorAll('.mb2-danger-marker')].every(el => el.hidden));
      assert.deepEqual(errors, []);
      results.push({ engine, width, passed: true });
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${base}/products/micro-path/`);
    const embed = page.locator('iframe[src*="upper-molar-mb2"]');
    await embed.scrollIntoViewIfNeeded();
    const frame = await (await embed.elementHandle()).contentFrame();
    await frame.waitForFunction(() => window.viewerCheck?.().loaded, null, { timeout: 60000 });
    assert.equal(await frame.evaluate(() => window.viewerCheck().playing), false, 'No autoplay under reduced motion');
    for (const point of [1, 2]) {
      await frame.getByRole('button', { name: `Danger point ${point}`, exact: true }).tap();
      await frame.waitForFunction(n => document.querySelector('.mb2-danger-panel:not([hidden]) .mb2-danger-eyebrow')?.textContent === `Danger point ${n}`, point);
      assert(await frame.evaluate(() => document.querySelector('.mb2-danger-panel').getBoundingClientRect().bottom <= document.querySelector('canvas').getBoundingClientRect().top));
      const warning = await frame.locator('.mb2-danger-panel').boundingBox();
      assert(warning.y >= 90 && warning.y + warning.height < 844, 'Embedded warning must be visible below the sticky navigation after a tap');
    }
    await page.screenshot({ path: `${output}/mb2-${engine}-embedded.png` });
    // Explicit playback must raise the same warnings as tapping the shortcuts.
    await frame.getByRole('button', { name: 'Danger point 1', exact: true }).tap();
    await frame.getByRole('button', { name: 'Play file motion', exact: true }).tap();
    await frame.waitForFunction(() => document.querySelector('.mb2-danger-panel:not([hidden]) .mb2-danger-eyebrow')?.textContent === 'Danger point 2', null, { timeout: 90000 });
    await frame.getByRole('button', { name: 'Pause file motion', exact: true }).tap();
    results.push({ engine, embedded: true, automaticWarnings: true, reducedMotion: true, passed: true });
    await context.close();
  } finally { await browser.close(); }
}
console.log(JSON.stringify(results, null, 2));
