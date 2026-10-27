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

const representativeRoutes = ['/', '/offers/', '/products/overview/', '/products/transform-s-et/', '/products/orifice-shapers/', '/products/iroot-sp/', '/quote-request/', '/technique/mb2-file/', '/products/e-connect-s/'].filter(route => routes.includes(route));
const widths = [320, 360, 375, 390, 414, 600, 601, 768, 850, 851, 1000, 1001, 1024, 1280, 1440, 1600, 1920, 2560];
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
          const textRects = [...range.getClientRects()].filter(textRect => textRect.width > 0);
          if (textRects.length > 1) issues.push(`${name}: label breaks onto multiple lines`);
          for (const textRect of textRects) if (!within(textRect, rect)) issues.push(`${name}: text escapes button`);
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

async function checkUnderlines(page, route, engine) {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  const buttons = [
    { label: 'Systems', selector: 'header nav > a[href="/products/overview/"]' },
    { label: 'Offers', selector: 'header nav > a[href="/offers/"]' },
    { label: 'Explore', selector: 'header nav > details > summary' },
  ];
  for (const { label, selector } of buttons) {
    const button = page.locator(selector).first();
    await page.mouse.move(1, 500);
    await button.evaluate(element => element.blur());
    const element = await button.elementHandle();
    await page.waitForFunction(element => new DOMMatrixReadOnly(getComputedStyle(element, '::after').transform).a < .01, element);
    const before = await button.boundingBox();
    await button.hover();
    await page.waitForFunction(element => new DOMMatrixReadOnly(getComputedStyle(element, '::after').transform).a > .99, element);
    const line = await button.evaluate(element => {
      const style = getComputedStyle(element, '::after');
      return { content: style.content, height: style.height, duration: style.transitionDuration, width: parseFloat(style.width) };
    });
    assert.equal(line.content, '""', `${engine} ${route} ${label}: underline exists`);
    assert.equal(line.height, '1px', `${label}: drawing rule stays fine`);
    assert.equal(line.duration, '0.3s', `${label}: underline draws smoothly`);
    assert.ok(line.width > 20, `${label}: underline has visible length`);
    const after = await button.boundingBox();
    assert.ok(Math.abs(after.width - before.width) < 1 && Math.abs(after.height - before.height) < 1, 'Hover must not resize the button');
    if (route === '/') await page.locator('.site-header').screenshot({ path: path.join(output, `${engine}-desktop-${label.toLowerCase()}-hover.png`) });
    cases++;
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator(buttons[2].selector).first().evaluate(element => getComputedStyle(element, '::after').transitionDuration), '0s', 'Reduced motion disables underline travel');
  await page.mouse.move(1, 500);
}

let browser;
try {
  for (const engine of (process.env.NAV_BROWSERS || 'chromium,webkit').split(',')) {
    assert.ok(['chromium', 'webkit'].includes(engine), `Unknown browser: ${engine}`);
    browser = await ({ chromium, webkit })[engine].launch();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    // Do not download training videos, 3D models, or contact external tracking services.
    await context.route('**/*', async route => {
      const request = route.request();
      if (request.resourceType() === 'media' || /\.(?:glb|gltf|mp4)(?:\?|$)/.test(request.url()) || /google-analytics|googletagmanager|clarity\.ms/.test(request.url())) return route.abort();
      const url = new URL(request.url());
      if (server && url.hostname === 'endotechnz.com') return route.fulfill({ response: await route.fetch({ url: new URL(url.pathname + url.search, base).href, maxRetries: 2 }) });
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
      await checkUnderlines(page, route, engine);
      // Explore opens below the complete navigation and stays on a short screen.
      await page.setViewportSize({ width: 390, height: 390 });
      await load(route);
      const summary = page.locator('header details > summary').first();
      await summary.click();
      assert.equal(await page.locator('header details a[href="/products/orifice-shapers/"]').count(), 1, `${engine} ${route}: Explore includes Orifice Shapers`);
      assert.equal(await page.locator('header details a[href="/products/iroot-sp/"]').count(), 1, `${engine} ${route}: Explore includes iRoot Bioceramic Sealer`);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const menu = page.locator(variants.map(variant => `${variant.header} ${variant.menu}`).join(', '));
      const menuBounds = await menu.boundingBox();
      assert.ok(menuBounds && menuBounds.x >= 0 && menuBounds.x + menuBounds.width <= 392 && menuBounds.y + menuBounds.height <= 392, `${engine} ${route}: Explore menu must fit the viewport`);
      await page.keyboard.press('Escape');
      assert.equal(await summary.evaluate(element => element.parentElement.open), false, 'Escape closes Explore');
      // Returning keyboard focus may scroll the document underneath a sticky header.
      await checkLayout(page, `${engine} ${route} after closing Explore`, true);
      for (const width of [320, 390, 851, 1280, 1440, 1920]) {
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
    const promoBanner = page.locator('.iroot-promo-banner');
    assert.equal(await promoBanner.getAttribute('href'), '/products/iroot-sp/');
    assert.match(await promoBanner.innerText(), /iRoot promo[\s\S]*NZ\$240 \+ GST[\s\S]*Free Micro-Path six-pack per box[\s\S]*Limit 2 boxes per clinic[\s\S]*View iRoot offer/);
    const bannerBounds = await promoBanner.boundingBox();
    const headerBounds = await page.locator('.site-wrapper > .site-header').boundingBox();
    assert.ok(bannerBounds && headerBounds && bannerBounds.y + bannerBounds.height <= headerBounds.y + 2, 'Homepage promo stays above the navigation');
    await page.screenshot({ path: path.join(output, `${engine}-mobile-after.png`) });
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.screenshot({ path: path.join(output, `${engine}-desktop-after.png`) });
    // Validate the new offer in the built site, with no order submission.
    await page.setViewportSize({width:1440,height:1000});
    await load('/products/iroot-sp/');
    assert.equal(await page.locator('.ingredient').count(),5);
    assert.equal(await page.locator('#manufacturer td').count(),2);
    assert.equal(await page.locator('.stage img').evaluate(img=>img.complete&&img.naturalWidth>=1700),true,'Rebuilt product image must load at full resolution');
    await page.locator('#iroot-quantity').fill('10');
    await page.locator('#iroot-quantity').press('Tab');
    assert.equal(await page.locator('[data-saving-total]').innerText(),'NZ$200');
    assert.equal(await page.locator('#iroot-quantity').inputValue(),'2','The calculator respects the two-box offer limit');
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(output,`${engine}-iroot-desktop.png`)});
    await page.setViewportSize({width:390,height:844});
    await load('/products/iroot-sp/');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'iRoot comparison must fit a phone');
    await page.screenshot({path:path.join(output,`${engine}-iroot-mobile.png`)});
    await load('/quote-request/#promotion-code');
    await page.locator('[name="fullName"]').fill('LOCAL PREVIEW TEST');
    await page.locator('#quote-promo-code').fill(' iRoOt ');
    await page.locator('#quote-promo-code').press('Enter');
    await page.locator('[data-iroot-offer]').waitFor({state:'visible'});
    assert.equal(new URL(page.url()).searchParams.get('promo'),'iRoot');
    assert.equal(await page.locator('[name="fullName"]').inputValue(),'LOCAL PREVIEW TEST','Applying iRoot must preserve entered details');
    assert.equal(await page.locator('[data-review-lines] tr').count(),2);
    assert.match(await page.locator('[data-review-lines]').innerText(),/TSMP-150325RF[\s\S]*15\/\.03[\s\S]*25 mm[\s\S]*FREE/);
    assert.equal(await page.locator('[data-promo-price-total]').innerText(),'NZ$276.00');
    assert.equal(await page.locator('[data-promo-price-net]').innerText(),'NZ$240.00');
    assert.equal(await page.locator('[data-promo-price-gst]').innerText(),'NZ$36.00');
    await page.locator('[data-iroot-boxes]').selectOption('2');
    assert.equal(await page.locator('[data-promo-price-total]').innerText(),'NZ$552.00');
    assert.equal(await page.locator('[data-promo-price-net]').innerText(),'NZ$480.00');
    assert.equal(await page.locator('[data-promo-price-gst]').innerText(),'NZ$72.00');
    assert.equal(await page.locator('[data-review-lines] tr').filter({hasText:'IRSP-08-K1-1'}).locator('td').nth(1).innerText(),'2');
    assert.equal(await page.locator('[data-review-lines] tr').filter({hasText:'TSMP-150325RF'}).locator('td').nth(1).innerText(),'2');
    assert.equal(await page.locator('[data-iroot-offer]').isVisible(),true);
    await page.locator('[data-iroot-boxes]').selectOption('1');
    await page.locator('[name="fullName"]').fill('');
    await page.evaluate(()=>document.querySelector('[data-iroot-offer]').scrollIntoView());
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'iRoot offer must fit a phone');
    await page.screenshot({path:path.join(output,`${engine}-iroot-offer-mobile.png`)});
    await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(output,`${engine}-iroot-offer-desktop.png`)});
    await context.close();
    await browser.close();
    browser = null;
    console.log(`${engine}: all published navigation pages, single-line labels, hover underlines, responsive widths, sticky headers, extra links and enlarged text passed.`);
  }
  console.log(`Navigation layout passed: ${cases} browser checks across ${routes.length} published pages. Screenshots: ${output}`);
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
