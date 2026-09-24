import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const context = { module: { exports: {} } };
vm.runInNewContext(fs.readFileSync('reviewed-site/quote-search.js', 'utf8'), context);
const matches = context.module.exports;
const document = new JSDOM(fs.readFileSync('reviewed-site/quote-request/index.html', 'utf8')).window.document;
const rows = [...document.querySelectorAll('#quote-family-et [data-catalog-row]')].map(row => ({
  size: row.querySelector('[data-label="Size"]').textContent,
  length: row.querySelector('[data-label="Length"]').textContent,
  search: row.dataset.search,
}));
for (const [query, count] of [['15 21', 1], ['17 25', 2], ['O4', 26], ['04', 26], ['.04', 26], ['TSET-150421RF', 1], ['zzzz', 0], ['', 50]]) {
  assert.equal(rows.filter(row => matches(row, query)).length, count, query);
  console.log(`${query || '(empty)'}: ${count} matches`);
}
