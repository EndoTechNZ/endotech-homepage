import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { chromium } from 'playwright';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'downloads');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function importData(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const source = readFileSync(absolutePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: absolutePath,
  });

  const encoded = Buffer.from(`${outputText}\n//# sourceURL=${pathToFileURL(absolutePath).href}`).toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

function renderItem(item) {
  return `
    <article class="point-card">
      <div class="point-head">
        <span class="point-number">${escapeHtml(item.number)}</span>
        <div>
          <p>${escapeHtml(item.stage)}</p>
          <h2>${escapeHtml(item.title)}</h2>
        </div>
      </div>
      <strong>${escapeHtml(item.summary)}</strong>
      <p>${escapeHtml(item.detail)}</p>
      ${
        item.videoUrl
          ? `<a class="video-link" href="${escapeHtml(item.videoUrl)}">YouTube: <span>${escapeHtml(item.videoTitle)}</span></a>`
          : ''
      }
    </article>
  `;
}

function renderSources(sources, referenceNote) {
  return `
    <section class="sources">
      <h2>Source base</h2>
      <p>${escapeHtml(referenceNote)}</p>
      <ul>
        ${sources.map((source) => `<li>${escapeHtml(source)}</li>`).join('')}
      </ul>
    </section>
  `;
}

function checklistHtml({ title, kicker, intro, items, sources, referenceNote, firstPageCount = 9 }) {
  const firstPageItems = items.slice(0, firstPageCount);
  const secondPageItems = items.slice(firstPageCount);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: #10272a;
      background: #f4f7f6;
      font-family: Inter, "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: 8.2pt;
      line-height: 1.34;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .document {
      width: 100%;
    }

    .sheet + .sheet {
      break-before: page;
      page-break-before: always;
    }

    .masthead {
      margin: 0 0 6mm;
      padding: 0 0 4.5mm;
      border-bottom: 1px solid rgba(16, 39, 42, 0.16);
    }

    .brand {
      margin: 0 0 4mm;
      color: #31575e;
      font-size: 7.2pt;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .kicker {
      margin: 0 0 3mm;
      color: #31575e;
      font-size: 7.6pt;
      font-weight: 900;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    h1 {
      max-width: 165mm;
      margin: 0;
      color: #10272a;
      font-size: 20pt;
      line-height: 1.04;
      font-weight: 800;
      letter-spacing: 0;
    }

    .intro {
      max-width: 165mm;
      margin: 3mm 0 0;
      color: #4b6267;
      font-size: 9pt;
      line-height: 1.42;
    }

    .points {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 3.2mm 4mm;
    }

    .point-card {
      display: block;
      width: 100%;
      margin: 0;
      padding: 3mm 3.2mm;
      border: 1px solid rgba(16, 39, 42, 0.14);
      border-radius: 5mm;
      background: rgba(255, 255, 255, 0.92);
      box-shadow: 0 2mm 8mm rgba(18, 39, 41, 0.035);
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .point-head {
      display: grid;
      grid-template-columns: 7.8mm 1fr;
      gap: 2.2mm;
      align-items: start;
      margin-bottom: 2mm;
    }

    .point-number {
      display: inline-grid;
      place-items: center;
      width: 7mm;
      height: 7mm;
      border: 1px solid rgba(16, 39, 42, 0.22);
      border-radius: 999px;
      color: #10272a;
      background: #f8fbfa;
      font-size: 6.4pt;
      font-weight: 900;
    }

    .point-head p {
      margin: 0 0 0.8mm;
      color: #31575e;
      font-size: 5.7pt;
      font-weight: 900;
      letter-spacing: 0.12em;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .point-head h2 {
      margin: 0;
      color: #10272a;
      font-size: 8.7pt;
      line-height: 1.17;
      font-weight: 820;
      letter-spacing: 0;
    }

    .point-card > strong {
      display: block;
      margin: 0 0 1.7mm;
      color: #31575e;
      font-size: 7.2pt;
      line-height: 1.3;
      font-weight: 780;
    }

    .point-card > p {
      margin: 0;
      color: #4b6267;
      font-size: 6.85pt;
      line-height: 1.32;
    }

    .video-link {
      display: block;
      margin-top: 1.8mm;
      padding-top: 1.4mm;
      border-top: 1px solid rgba(16, 39, 42, 0.1);
      color: #1d5fd1;
      font-size: 5.9pt;
      font-weight: 900;
      letter-spacing: 0.03em;
      line-height: 1.24;
      text-decoration: underline;
      text-underline-offset: 1.2px;
    }

    .video-link span {
      color: #1d5fd1;
      font-weight: 760;
      letter-spacing: 0;
    }

    .sources {
      margin-top: 4mm;
      padding: 2.6mm 3mm;
      border: 1px solid rgba(16, 39, 42, 0.14);
      border-radius: 5mm;
      background: rgba(255, 255, 255, 0.82);
      break-inside: auto;
      page-break-inside: auto;
    }

    .sources h2 {
      margin: 0 0 1.4mm;
      color: #31575e;
      font-size: 6.5pt;
      font-weight: 900;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .sources p,
    .sources li {
      color: #4b6267;
      font-size: 5.75pt;
      line-height: 1.2;
    }

    .sources p {
      margin: 0 0 1.4mm;
    }

    .sources ul {
      column-count: 2;
      column-gap: 4mm;
      margin: 0;
      padding-left: 4mm;
    }

    .sources li + li {
      margin-top: 0.7mm;
    }
  </style>
</head>
<body>
  <main class="document">
    <section class="sheet">
      <header class="masthead">
        <p class="brand">EndoTech NZ | Protocol Sheet</p>
        <p class="kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="intro">${escapeHtml(intro)}</p>
      </header>
      <section class="points">
        ${firstPageItems.map(renderItem).join('')}
      </section>
    </section>
    <section class="sheet sheet--continued">
      <section class="points">
        ${secondPageItems.map(renderItem).join('')}
      </section>
      ${renderSources(sources, referenceNote)}
    </section>
  </main>
</body>
</html>`;
}

async function exportPdf(browser, config) {
  mkdirSync(path.dirname(config.outputPath), { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
  await page.setContent(checklistHtml(config), { waitUntil: 'load' });
  await page.pdf({
    path: config.outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
  });
  await page.close();
}

const curved = await importData('src/data/curvedCanalChecklist.ts');
const mb2 = await importData('src/data/mb2Checklist.ts');
const evidence = await importData('src/data/evidenceChecklist.ts');

const browser = await chromium.launch({ headless: true });

try {
  await exportPdf(browser, {
    title: '13-point curved canal checklist',
    kicker: 'Curved-canal protocol checklist',
    intro:
      'Use this chairside checklist when the canal stops behaving like a straight line. The aim is controlled diagnosis, reproducible glide path confirmation, short rotary engagement, and early stop-or-refer decisions.',
    items: curved.curvedCanalChecklistItems,
    sources: curved.curvedCanalChecklistSources.slice(0, 5),
    referenceNote: curved.curvedCanalChecklistReferenceNote,
    firstPageCount: 6,
    outputPath: path.join(outputDir, 'EndoTech-NZ-Curved-Canal-13-Point-Checklist.pdf'),
  });

  await exportPdf(browser, {
    title: '15-point MB2 protocol checklist',
    kicker: 'MB2 protocol checklist',
    intro:
      'Use this chairside checklist when MB2 anatomy stops being obvious. The aim is controlled access, deliberate troughing, passive scouting, glide path confirmation, and referral judgment.',
    items: mb2.mb2ChecklistItems,
    sources: mb2.mb2ChecklistSources,
    referenceNote: mb2.mb2ChecklistReferenceNote,
    outputPath: path.join(outputDir, 'EndoTech-NZ-MB2-15-Point-Protocol-Checklist.pdf'),
  });

  await exportPdf(browser, {
    title: '10-point endodontic outcomes checklist',
    kicker: 'Evidence outcomes checklist',
    intro:
      'Use this chairside checklist when outcome risk needs to be made visible. The aim is controlled diagnosis, infection control, apical management, shaping, obturation, restoration, review, and retreatment judgment.',
    items: evidence.evidenceChecklistItems,
    sources: evidence.evidenceChecklistSources,
    referenceNote: evidence.evidenceChecklistReferenceNote,
    firstPageCount: 6,
    outputPath: path.join(outputDir, 'EndoTech-NZ-Endodontic-Outcomes-10-Point-Checklist.pdf'),
  });
} finally {
  await browser.close();
}

console.log(path.relative(root, outputDir));
