import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const source = process.argv[2];
if (!source) throw Error('Local review directory required');
const target = 'reviewed-site/quote-request/index.html';
const before = fs.readFileSync(target, 'utf8');
const after = fs.readFileSync(path.join(source, 'quote-request/index.html'), 'utf8')
  .replace('<script src="/quote-search-local.js" defer></script>', '');
function controls(html) {
  const d = new JSDOM(html).window.document;
  return [...d.querySelectorAll('main input, main textarea, main select, main button')].map(el => ({
    tag: el.tagName, attributes: [...el.attributes].map(a => [a.name, a.value]),
    content: el.tagName === 'BUTTON' ? undefined : el.innerHTML,
  }));
}
assert.deepEqual(controls(after), controls(before), 'Form controls must remain unchanged');
assert(after.includes('Send Order</button>'));
assert(after.includes('Download a copy of Order</button>'));
assert(after.includes('>Select Products</h2>'));
fs.writeFileSync(target, after);
for (const file of ['index.html', 'hero-wordmark.css', 'quote-offer.css', 'quote-offer.js']) {
  fs.copyFileSync(path.join(source, file), path.join('reviewed-site', file));
}
console.log('Imported approved homepage and quote presentation; form controls unchanged.');
