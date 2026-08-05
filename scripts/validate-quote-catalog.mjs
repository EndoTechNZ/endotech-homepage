import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../src/data/nzLaunchCatalog.ts', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const objectRows = [...source.matchAll(/^\s{2}(\{ family: .* \}),?\r?$/gm)].map((match) => match[1]);

if (!objectRows.length) {
  throw new Error('No rows were found in nzLaunchCatalog.ts.');
}

const rows = objectRows.map((row, index) => {
  const json = row.replace(/([{,]\s*)([A-Za-z][A-Za-z0-9]*):/g, '$1"$2":');
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`Catalogue row ${index + 1} could not be parsed: ${error instanceof Error ? error.message : error}`);
  }
});

const expectedAll = 159;
const expectedSelectable = 121;
const expectedSelectableFamilies = new Map([
  ['et', 36],
  ['pt', 20],
  ['micro-path', 4],
  ['c-plus', 8],
  ['k-files', 53],
]);
const expectedPrefixes = new Map([
  ['et', 'TSET-'],
  ['pt', 'TSPT-'],
  ['micro-path', 'TSMP-'],
  ['c-plus', 'TSCP-'],
  ['k-files', 'TSKF-'],
]);

const failures = [];
if (rows.length !== expectedAll) failures.push(`Expected ${expectedAll} total catalogue rows; found ${rows.length}.`);

const selectable = rows.filter((row) => row.requiresConfirmation === false);
if (selectable.length !== expectedSelectable) failures.push(`Expected ${expectedSelectable} confirmed rows; found ${selectable.length}.`);
if (rows.length - selectable.length !== 38) failures.push(`Expected 38 withheld rows; found ${rows.length - selectable.length}.`);

const seen = new Set();
for (const row of rows) {
  if (!row.sku || seen.has(row.sku)) failures.push(`Missing or duplicate SKU: ${row.sku || '(blank)'}.`);
  seen.add(row.sku);
  const prefix = expectedPrefixes.get(row.family);
  if (!prefix || !String(row.sku).startsWith(prefix)) failures.push(`Unexpected family/SKU pairing: ${row.family} / ${row.sku}.`);
}

for (const [family, expected] of expectedSelectableFamilies) {
  const count = selectable.filter((row) => row.family === family).length;
  if (count !== expected) failures.push(`Expected ${expected} selectable ${family} rows; found ${count}.`);
}

if (selectable.some((row) => /TransformX|Acrobat|TXET-|TXPT-|ACGP-/i.test(JSON.stringify(row)))) {
  failures.push('A confirmed quotation row contains a withdrawn Transform X or Acrobat identifier.');
}

if (failures.length) {
  throw new Error(`Quotation catalogue validation failed:\n- ${failures.join('\n- ')}`);
}

console.log(`Quotation catalogue valid: ${rows.length} total rows, ${selectable.length} customer-selectable rows, 38 withheld.`);
