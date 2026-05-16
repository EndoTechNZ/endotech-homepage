import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const inputPath = path.resolve('docs/sg-codex-github-netlify-handover.html');
const outputPath = path.resolve('docs/sg-codex-github-netlify-handover.pdf');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'networkidle' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
});

await browser.close();

console.log(outputPath);
