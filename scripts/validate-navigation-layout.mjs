// Exercise the final published HTML: apply-reviewed-site adds links after Astro builds.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium, webkit } from 'playwright';

const dist = path.resolve('dist');
const output = path.resolve('output/playwright/navigation');
await fs.mkdir(output, { recursive: true });
const variants = [
  { header: '.site-wrapper > .site-header', control: '.header-control', menu: '.header-menu' },
  { header: '.clean-header', control: 'nav > a, nav > details > summary', menu: '.clean-dropdown' },
  { header: '.compact-product-header', control: 'nav > a, nav > details > summary', menu: '.compact-dropdown' },
];
const routes = [];
async function discover(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await discover(file);
    else if (entry.name === 'index.html') {
      const html = await fs.readFile(file, 'utf8');
      if (/class="(?:site-header|clean-header|compact-product-header)(?:\s|")/.test(html) && !/<meta\b[^>]*http-equiv=["']refresh/i.test(html)) {
        routes.push('/' + path.relative(dist, directory).replaceAll('\\', '/') + (directory === dist ? '' : '/'));
      }
    }
  }
}
await discover(dist);
routes.sort((a, b) => a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b));
assert.ok(routes.includes('/') && routes.includes('/offers/'), 'Build the production site before checking navigation.');

// A temporary local server avoids assuming an existing dev server or testing Astro's
// unmodified source instead of the HTML that will actually be deployed.
let server;
let base = process.env.NAV_BASE_URL;
if (!base) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
  server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = path.resolve(dist, '.' + pathname);
      if (!file.startsWith(dist + path.sep) && file !== dist) throw Error('Outside build');
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const bytes = await fs.readFile(file);
      res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'access-control-allow-origin': '*' });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
}

const representativeRoutes = ['/', '/offers/', '/products/overview/', '/products/transform-s-et/', '/quote-request/', '/technique/mb2-file/', '/products/e-connect-s/'].filter(route => routes.includes(route));
const widths = [320, 360, 375, 390, 414, 600, 601, 768, 850, 851, 1024, 1440];
let cases = 0;

async function checkLayout(page, label, scrolled = false) {
  const issues = await page.evaluate(({ variants, scrolled }) => {
    const issues = [];
    const tolerance = 2;
    const within = (a, b) => a.left >= b.left - tolerance && a.right <= b.right + tolerance && a.top >= b.top - tolerance && a.bottom <= b.bottom + tolerance;
    for (const variant of variants) {
      const header = document.querySelector(variant.header);
      if (!header) continue;
      const bounds = header.getBoundingClientRect();
      const nav = header.querySelector('nav');
      const controls = [...header.querySelectorAll(variant.control)];
      if (controls.length < 4) issues.push('Systems, Offers, Explore and Order must all be present');
      if (bounds.left < -tolerance || bounds.right > innerWidth + tolerance) issues.push('Header exceeds viewport');
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        const rect = control.getBoundingClientRect();
        const name = control.textContent.trim();
        if (rect.width <= 0 || rect.height < 42 - tolerance) issues.push(`${name}: hidden or too small to tap`);
        if (!within(rect, bounds) || !within(rect, nav.getBoundingClientRect())) issues.push(`${name}: outside header/navigation`);
        if (rect.left < 0 || rect.right > innerWidth + tolerance) issues.push(`${name}: outside viewport`);
        for (const other of controls.slice(i + 1)) {
          const b = other.getBoundingClientRect();
          if (Math.min(rect.right, b.right) - Math.max(rect.left, b.left) > tolerance && Math.min(rect.bottom, b.bottom) - Math.max(rect.top, b.top) > tolerance) issues.push(`${name}: overlaps ${other.textContent.trim()}`);
        }
        const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        if (!hit || !control.contains(hit)) issues.push(`${name}: tap target is covered`);
        const walker = document.createTreeWalker(control, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          if (!walker.currentNode.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNode(walker.currentNode);
          for (const textRect of range.getClientRects()) if (!within(textRect, rect)) issues.push(`${name}: text escapes button`);
        }
      }
      const order = header.querySelector('a[href="/quote-request/"]');
      if (!order) issues.push('Order destination missing');
      const main = document.querySelector('main');
      if (!scrolled && main && main.getBoundingClientRect().top < bounds.bottom - tolerance) issues.push('Header overlaps page content');
      const badge = document.querySelector('#persistent-price-badge');
      if (!scrolled && badge && badge.getBoundingClientRect().top < bounds.bottom - tolerance) issues.push('Header overlaps offer badge');
    }
    if (!variants.some(variant => document.querySelector(variant.header))) issues.push('Expected site navigation missing');
    return issues;
  }, { variants, scrolled });
  if (issues.length) await page.screenshot({ path: path.join(output, 'failure.png') });
  assert.deepEqual(issues, [], label);
  cases++;
}

let browser;
try {
  for (const engine of (process.env.NAV_BROWSERS || 'chromium,webkit').split(',')) {
    assert.ok(['chromium', 'webkit'].includes(engine), `Unknown browser: ${engine}`);
    browser = await ({ chromium, webkit })[engine].launch();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const fontResponses = new Map();
    // Do not download training videos, 3D models, or contact external tracking services.
    await context.route('**/*', async route => {
      const request = route.request();
      if (request.resourceType() === 'media' || /\.(?:glb|gltf|mp4)(?:\?|$)/.test(request.url()) || /google-analytics|googletagmanager|clarity\.ms/.test(request.url())) return route.abort();
      const url = new URL(request.url());
      if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) {
        if (!fontResponses.has(url.href)) fontResponses.set(url.href, route.fetch());
        return route.fulfill({ response: await fontResponses.get(url.href) });
      }
      if (server && url.hostname === 'endotechnz.com') return route.fulfill({ response: await route.fetch({ url: new URL(url.pathname + url.search, base).href }) });
      return route.continue();
    });
    const page = await context.newPage();
    const load = async route => {
      try {
        await page.goto(new URL(route, base).href, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      } catch (error) {
        throw new Error(`Loading ${route} (${page.url()}): ${error.message}`, { cause: error });
      }
    };
    // Check every published page using these headers on a common phone width.
    for (const route of routes) {
      await load(route);
      await checkLayout(page, `${engine} ${route} at 390px`);
    }
    console.log(`${engine}: ${routes.length} published pages passed at 390px; checking responsive and future-menu cases.`);
    for (const route of representativeRoutes) {
      await load(route);
      for (const width of widths) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await checkLayout(page, `${engine} ${route} at ${width}px`);
        // Sticky navigation must remain contained and clickable after scrolling.
        await page.evaluate(() => scrollTo(0, 500));
        await checkLayout(page, `${engine} ${route} scrolled at ${width}px`, true);
      }
      // Explore opens below the complete navigation and stays on a short screen.
      await page.setViewportSize({ width: 390, height: 390 });
      await load(route);
      const summary = page.locator('header details > summary').first();
      await summary.click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const menu = page.locator(variants.map(variant => `${variant.header} ${variant.menu}`).join(', '));
      const menuBounds = await menu.boundingBox();
      assert.ok(menuBounds && menuBounds.x >= 0 && menuBounds.x + menuBounds.width <= 392 && menuBounds.y + menuBounds.height <= 392, `${engine} ${route}: Explore menu must fit the viewport`);
      await page.keyboard.press('Escape');
      assert.equal(await summary.evaluate(element => element.parentElement.open), false, 'Escape closes Explore');
      // Returning keyboard focus may scroll the document underneath a sticky header.
      await checkLayout(page, `${engine} ${route} after closing Explore`, true);
      for (const width of [320, 390, 851]) {
        await page.setViewportSize({ width, height: 844 });
        await load(route);
        // Simulate another menu addition and a longer label, without changing source.
        await page.evaluate(() => {
          const nav = document.querySelector('header nav');
          const extra = nav.querySelector('a').cloneNode(true);
          extra.textContent = 'New information';
          nav.append(extra);
          document.documentElement.style.fontSize = '125%';
        });
        await checkLayout(page, `${engine} ${route}: extra link and enlarged text at ${width}px`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await load('/');
    await page.screenshot({ path: path.join(output, `${engine}-mobile-after.png`) });
    await context.close();
    await browser.close();
    browser = null;
    console.log(`${engine}: all published navigation pages, responsive widths, sticky headers, extra links and enlarged text passed.`);
  }
  console.log(`Navigation layout passed: ${cases} browser checks across ${routes.length} published pages. Screenshots: ${output}`);
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
