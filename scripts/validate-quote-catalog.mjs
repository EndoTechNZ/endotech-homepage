import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../src/data/nzLaunchCatalog.ts', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const builderSource = await readFile(new URL('../src/scripts/quote-request-builder.ts', import.meta.url), 'utf8');
const validationSource = await readFile(new URL('../src/lib/quoteRequest.ts', import.meta.url), 'utf8');
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
const expectedSelectable = 159;
const expectedSelectableFamilies = new Map([
  ['et', 50],
  ['pt', 25],
  ['micro-path', 16],
  ['c-plus', 15],
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
if (!source.includes('export const nzCustomerSelectableCatalog = [...nzLaunchCatalog].sort(compareNzLaunchCatalogItems);')) {
  failures.push('The customer-selectable catalogue is not using the shared clinical ordering rule.');
}
if (/decodeCatalog\(\)\.filter\([^\n]*requiresConfirmation/.test(builderSource)) {
  failures.push('The browser quote builder still filters rows by internal confirmation notes.');
}
if (/approvedCatalog[\s\S]{0,120}\.filter\([^\n]*requiresConfirmation/.test(validationSource)) {
  failures.push('Quote-line validation still filters rows by internal confirmation notes.');
}

const selectable = rows;
if (selectable.length !== expectedSelectable) failures.push(`Expected ${expectedSelectable} customer-selectable rows; found ${selectable.length}.`);
const internallyFlagged = rows.filter((row) => row.requiresConfirmation === true);
if (internallyFlagged.length !== 38) failures.push(`Expected 38 internally flagged rows; found ${internallyFlagged.length}.`);

const requiredEtSizes = new Map([
  ['15/.04', [21, 25, 29]],
  ['17/.04', [21, 25, 29]],
  ['17/.06', [21, 25, 29]],
]);
for (const [size, lengths] of requiredEtSizes) {
  for (const lengthMm of lengths) {
    const match = selectable.find((row) => row.family === 'et' && row.size === size && row.lengthMm === lengthMm);
    if (!match) failures.push(`Missing customer-selectable ET ${size}, ${lengthMm} mm row.`);
  }
}

const requiredMicroPathSizes = new Map([
  ['13/.03', [21, 25, 29]],
  ['15/.03', [21, 25, 29]],
  ['17/.03', [21, 25, 29]],
  ['20/.03', [21, 25, 29]],
  ['25/.03', [21, 25, 29]],
  ['15/.05', [17]],
]);
for (const [size, lengths] of requiredMicroPathSizes) {
  for (const lengthMm of lengths) {
    const match = selectable.find((row) => row.family === 'micro-path' && row.size === size && row.lengthMm === lengthMm);
    if (!match) failures.push(`Missing customer-selectable Micro-Path™ ${size}, ${lengthMm} mm row.`);
  }
}

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

console.log(`Quotation catalogue valid: ${rows.length} workbook rows and ${selectable.length} customer-selectable rows; ${internallyFlagged.length} retain internal source notes.`);
