import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const replacements = [
  ['products/transform-s-rg/index.html', 'et-downloads-section'],
  ['products/transform-s-et/index.html', 'et-downloads-section'],
  ['products/transform-s-pt/index.html', 'pt-downloads-section'],
  ['products/micro-path/index.html', 'microPath-downloads-section'],
  ['products/k-files/index.html', 'range'],
  ['resources/downloads/index.html', 'bg-slate-50/70'],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionPattern(className) {
  return new RegExp(
    `<section class="[^"]*${escapeRegExp(className)}[^"]*"[^>]*>[\\s\\S]*?<\\/section>`,
  );
}

for (const [relativePath, className] of replacements) {
  const generatedPath = path.join('dist', relativePath);
  const reviewedPath = path.join('reviewed-site', relativePath);

  if (!existsSync(reviewedPath)) continue;

  const generated = readFileSync(generatedPath, 'utf8');
  const reviewed = readFileSync(reviewedPath, 'utf8');
  const pattern = sectionPattern(className);
  const generatedSection = generated.match(pattern)?.[0];

  if (!generatedSection || !pattern.test(reviewed)) {
    throw new Error(`Could not sync ${className} in ${relativePath}`);
  }

  writeFileSync(reviewedPath, reviewed.replace(pattern, generatedSection));
  console.log(`Synced ${relativePath}`);
}

const cPlusPath = path.join('reviewed-site', 'products/c-plus/index.html');
let cPlus = readFileSync(cPlusPath, 'utf8');
if (!cPlus.includes('EndoTech-NZ-Transform-S-C-Plus-IFU.pdf')) {
  const brochureLink = /(<a class="cp-brochure"[\s\S]*?<\/a>)/;
  const ifuLink = `
<a class="cp-brochure" href="/downloads/EndoTech-NZ-Transform-S-C-Plus-IFU.pdf" target="_blank" rel="noreferrer">
<span class="cp-brochure-copy"><span>Download C+ IFU</span><small>PDF · 2 pages</small></span>
<span class="cp-link-arrow cp-arrow-diagonal" aria-hidden="true">→</span>
</a>`;
  if (!brochureLink.test(cPlus)) throw new Error('Could not add the C+ IFU link');
  cPlus = cPlus.replace(brochureLink, `$1${ifuLink}`);
  writeFileSync(cPlusPath, cPlus);
  console.log('Synced products/c-plus/index.html');
}
