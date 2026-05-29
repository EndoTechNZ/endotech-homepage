import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { chromium } from 'playwright';

const root = process.cwd();
const outputPath = path.resolve(
  process.argv[2] ?? 'public/downloads/EndoTech-NZ-Laschal-Endodontic-Instruments-Catalogue.pdf',
);
const versionedOutputPath = path.join(
  path.dirname(outputPath),
  'EndoTech-NZ-Laschal-Endodontic-Instruments-Catalogue-clinical-steel-20260529.pdf',
);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function importTs(relativePath, transform = (source) => source) {
  const absolutePath = path.join(root, relativePath);
  const source = transform(readFileSync(absolutePath, 'utf8'));
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

function publicAssetDataUri(publicPath) {
  const absolutePath = path.join(root, 'public', publicPath.replace(/^\//, ''));
  const extension = path.extname(absolutePath).toLowerCase();
  const mimeType =
    extension === '.png'
      ? 'image/png'
      : extension === '.webp'
        ? 'image/webp'
        : extension === '.jpg' || extension === '.jpeg'
          ? 'image/jpeg'
          : 'application/octet-stream';
  return `data:${mimeType};base64,${readFileSync(absolutePath).toString('base64')}`;
}

function groupByCategory(items, categoryOrder) {
  return categoryOrder
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

function groupVideos(videos) {
  const groups = new Map();
  videos.forEach((video) => {
    if (!groups.has(video.category)) groups.set(video.category, []);
    groups.get(video.category).push(video);
  });
  return Array.from(groups, ([category, items]) => ({ category, items }));
}

const videoImageSkuByHref = {
  'https://www.youtube.com/watch?v=O14DwrteW9M': 'EF-1-7',
  'https://www.youtube.com/watch?v=D0TvF82CMR4': '90AHF/L',
  'https://www.youtube.com/watch?v=afvlQpxp7Ls': 'FXP/S',
  'https://www.youtube.com/watch?v=jEdlVL3Mzsk': 'FXP/S',
  'https://www.youtube.com/watch?v=249Xa1SXEd8': 'FXP/S',
  'https://www.youtube.com/watch?v=iJ9l7UQPtVs': 'D-45SL/M',
  'https://www.youtube.com/watch?v=tLkcUML19kM': 'N-4XF',
  'https://www.youtube.com/watch?v=jcQq5E0I4wI': '7-TCLR/TL',
  'https://www.youtube.com/watch?v=7VOFwNafd3Y': '7-TCLCR/TL',
  'https://www.youtube.com/watch?v=GOS4E0fQ0ZM': '6-10RL',
  'https://www.youtube.com/watch?v=4rawUzvBKjk': 'CORN/45B',
  'https://www.youtube.com/watch?v=_kZobKokHGQ': 'MA-1S',
};

function enrichVideoGroups(groups, catalogItems, fallbackImage) {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((video) => {
      const relatedSku = videoImageSkuByHref[video.href];
      const relatedItem =
        (relatedSku && catalogItems.find((item) => item.sku === relatedSku)) ??
        catalogItems.find((item) => item.category === group.category);

      return {
        ...video,
        relatedSku: relatedItem?.sku ?? '',
        image: relatedItem?.image ?? fallbackImage,
      };
    }),
  }));
}

function renderHeader(logoUrl) {
  return `
    <header class="pdf-brand-header">
      <img src="${logoUrl}" alt="Laschal Surgical" />
      <div>
        <strong>EndoTech NZ</strong>
        <span>Laschal endodontic instruments catalogue</span>
      </div>
    </header>
    <footer class="pdf-brand-footer">
      <span>Laschal Surgical instruments available through EndoTech NZ</span>
      <span>endotechnz.com</span>
    </footer>
  `;
}

function renderWorkflow(tasks) {
  return `
    <section class="workflow-grid">
      ${tasks
        .map(
          (task, index) => `
            <article>
              <span>${String(index + 1).padStart(2, '0')}</span>
              <h3>${escapeHtml(task.title)}</h3>
              <p>${escapeHtml(task.body)}</p>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function renderFeature(instrument) {
  return `
    <article class="feature-card">
      <div class="feature-image">
        <img src="${publicAssetDataUri(instrument.image)}" alt="${escapeHtml(instrument.title)}" />
      </div>
      <div>
        <p class="kicker">Part number: ${escapeHtml(instrument.model)}</p>
        <h2>${escapeHtml(instrument.title)}</h2>
        <div class="clinical-two-up">
          <section>
            <h3>Clinical problem</h3>
            <p>${escapeHtml(instrument.clinicalProblem)}</p>
          </section>
          <section>
            <h3>Laschal solution</h3>
            <p>${escapeHtml(instrument.solution)}</p>
          </section>
        </div>
        <div class="feature-lists">
          <section>
            <h3>Key features</h3>
            <ul>${instrument.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
          </section>
          <section>
            <h3>Clinical benefits</h3>
            <ul>${instrument.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('')}</ul>
          </section>
        </div>
        ${
          instrument.videos.length
            ? `<div class="video-list compact">
                <h3>Technique videos</h3>
                ${instrument.videos
                  .map(
                    (video) =>
                      `<a href="${escapeHtml(video.href)}">${escapeHtml(video.label)}<span>${escapeHtml(video.href)}</span></a>`,
                  )
                  .join('')}
              </div>`
            : ''
        }
      </div>
    </article>
  `;
}

function renderProductCard(item) {
  return `
    <a class="product-card" href="${escapeHtml(item.sourceUrl)}">
      <figure>
        <img src="${publicAssetDataUri(item.image)}" alt="${escapeHtml(item.title)}" />
      </figure>
      <div>
        <p>${escapeHtml(item.category)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <strong>SKU: ${escapeHtml(item.sku)}</strong>
        <span>Enquire through EndoTech NZ</span>
      </div>
    </a>
  `;
}

function chunkArray(items, chunkSize) {
  const chunks = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

function renderFeatureSections(featuredInstruments) {
  return chunkArray(featuredInstruments, 2)
    .map(
      (instruments, pageIndex) => `
    <section class="page-break">
      <div class="section-head">
        <p class="eyebrow">Featured instruments</p>
        <h1>${pageIndex === 0 ? 'Core Laschal pathways for endodontic access and retrieval.' : 'Core Laschal pathways continued.'}</h1>
      </div>
      ${instruments.map(renderFeature).join('')}
    </section>
  `,
    )
    .join('');
}

function renderCategorySections(group) {
  return chunkArray(group.items, 9)
    .map((items, pageIndex) => {
      const rangeStart = pageIndex * 9 + 1;
      const rangeEnd = rangeStart + items.length - 1;
      const heading = pageIndex === 0 ? group.category : `${group.category} continued`;
      const countLabel =
        group.items.length > 9
          ? `${rangeStart}-${rangeEnd} of ${group.items.length} products`
          : `${group.items.length} products`;

      return `
        <section class="category-section">
          <div class="category-heading">
            <div>
              <p class="eyebrow">Full endodontic range</p>
              <h1>${escapeHtml(heading)}</h1>
            </div>
            <span>${escapeHtml(countLabel)}</span>
          </div>
          <div class="product-grid">
            ${items.map(renderProductCard).join('')}
          </div>
        </section>
      `;
    })
    .join('');
}

function renderVideoGroups(groups) {
  return groups
        .map(
          (group) => `
            <section class="video-group">
              <h2>${escapeHtml(group.category)}</h2>
              <div class="video-list">
                ${group.items
                  .map(
                    (video) => `
                      <a class="video-card" href="${escapeHtml(video.href)}">
                        <figure>
                          <img src="${publicAssetDataUri(video.image)}" alt="${escapeHtml(video.title)}" />
                        </figure>
                        <div>
                          <strong>${escapeHtml(video.title)}</strong>
                          ${video.relatedSku ? `<small>Related SKU: ${escapeHtml(video.relatedSku)}</small>` : ''}
                          <small>${escapeHtml(video.channel)}</small>
                          <span>${escapeHtml(video.href)}</span>
                        </div>
                      </a>
                    `,
                  )
                  .join('')}
              </div>
            </section>
          `,
        )
        .join('');
}

function paginateVideoGroups(groups, maxVideosPerPage = 10) {
  const pages = [];
  let currentGroups = [];
  let currentCount = 0;

  groups.forEach((group) => {
    if (currentGroups.length > 0 && currentCount + group.items.length > maxVideosPerPage) {
      pages.push(currentGroups);
      currentGroups = [];
      currentCount = 0;
    }

    currentGroups.push(group);
    currentCount += group.items.length;
  });

  if (currentGroups.length > 0) pages.push(currentGroups);
  return pages;
}

function renderVideoSection(groups) {
  return paginateVideoGroups(groups)
    .map(
      (pageGroups, pageIndex) => `
    <section class="page-break video-section">
      <p class="eyebrow">Technique videos</p>
      <h1>${pageIndex === 0 ? 'Clickable video links for product familiarisation.' : 'Additional product video links.'}</h1>
      <p class="intro">
        These links are included for clinician reference and product orientation. Each link opens the relevant YouTube video.
      </p>
      ${renderVideoGroups(pageGroups)}
    </section>
  `,
    )
    .join('');
}

function renderCatalogueFooter(logoUrl, sourceCategoryHref) {
  return `
    <section class="page-break catalogue-footer-page">
      <div class="footer-inner">
        <img src="${logoUrl}" alt="Laschal Surgical" />
        <p class="eyebrow">EndoTech NZ support</p>
        <h1>Talk to EndoTech NZ about Laschal instruments.</h1>
        <p class="intro">
          Tell us the procedure you are preparing for and the access challenge you want to solve.
          We can help identify suitable Laschal instruments and confirm availability.
        </p>
        <div class="footer-actions">
          <a class="primary" href="https://endotechnz.com/about/contact/">Contact EndoTech NZ</a>
          <a href="https://endotechnz.com/downloads/EndoTech-NZ-Laschal-Endodontic-Instruments-Catalogue-clinical-steel-20260529.pdf">Download catalogue</a>
          <a href="${escapeHtml(sourceCategoryHref)}">View Laschal catalogue</a>
        </div>
      </div>
    </section>
  `;
}

function catalogueHtml({
  assets,
  categoryGroups,
  featuredInstruments,
  clinicalTasks,
  videoGroups,
  productCount,
  sourceCategoryHref,
}) {
  const logoUrl = publicAssetDataUri(assets.logo);
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>EndoTech NZ Laschal Endodontic Instruments Catalogue</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: #111827;
      background: #f7fafc;
      font-family: Inter, "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: 8.4pt;
      line-height: 1.36;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .pdf-brand-header,
    .pdf-brand-footer {
      position: fixed;
      left: 11mm;
      right: 11mm;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #3d4856;
      font-size: 6.7pt;
    }

    .pdf-brand-header {
      top: 8mm;
      overflow: hidden;
      min-height: 15mm;
      border: 1px solid rgba(191, 210, 222, 0.78);
      border-radius: 5mm;
      padding: 2.6mm 4mm;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.99) 0%, rgba(246, 250, 252, 0.98) 56%, rgba(235, 243, 247, 0.96) 100%);
      box-shadow: 0 3mm 12mm rgba(0, 55, 112, 0.05);
    }

    .pdf-brand-header::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(0, 107, 182, 0.11) 0 18%, transparent 44%),
        repeating-linear-gradient(90deg, rgba(27, 65, 92, 0.045) 0 1px, transparent 1px 18px);
      opacity: 0.5;
      pointer-events: none;
    }

    .pdf-brand-header img {
      position: relative;
      z-index: 1;
      width: 32mm;
      height: auto;
      max-height: 11mm;
      object-fit: contain;
      border-radius: 3mm;
      padding: 1.5mm 2mm;
      background: #ffffff;
    }

    .pdf-brand-header div {
      display: grid;
      gap: 0.8mm;
      position: relative;
      z-index: 1;
      text-align: right;
    }

    .pdf-brand-header strong {
      color: #111827;
      font-size: 7.1pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .pdf-brand-header span,
    .pdf-brand-footer span {
      color: #667085;
    }

    .pdf-brand-footer {
      bottom: 7mm;
      border: 1px solid rgba(210, 224, 235, 0.68);
      border-radius: 999px;
      padding: 1.8mm 4mm;
      background: rgba(255, 255, 255, 0.86);
    }

    .document {
      padding: 27mm 11mm 18mm;
    }

    .cover {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 68mm;
      gap: 10mm;
      align-items: center;
      position: relative;
      overflow: hidden;
      min-height: 244mm;
      border: 1px solid rgba(191, 210, 222, 0.82);
      border-radius: 8mm;
      padding: 14mm;
      background:
        linear-gradient(180deg, #ffffff 0%, #f8fbfd 58%, #eef5f8 100%);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .cover::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(0, 107, 182, 0.12) 0 4mm, transparent 4mm),
        radial-gradient(circle at 82% 22%, rgba(0, 107, 182, 0.11), transparent 36%),
        linear-gradient(180deg, transparent 0%, rgba(231, 240, 246, 0.5) 100%);
      pointer-events: none;
    }

    .cover::after {
      content: "";
      position: absolute;
      inset: 10mm;
      border-radius: 6mm;
      background:
        repeating-linear-gradient(0deg, rgba(27, 65, 92, 0.03) 0 1px, transparent 1px 12mm),
        repeating-linear-gradient(90deg, rgba(27, 65, 92, 0.03) 0 1px, transparent 1px 12mm);
      mask-image: linear-gradient(90deg, transparent 0%, #000 18%, #000 68%, transparent 100%);
      pointer-events: none;
    }

    .cover > * {
      position: relative;
      z-index: 1;
    }

    .cover-logo {
      width: 48mm;
      margin-bottom: 13mm;
    }

    .eyebrow,
    .kicker {
      margin: 0 0 3mm;
      color: #0b75b7;
      font-size: 6.4pt;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1 {
      color: #111827;
      font-size: 27pt;
      line-height: 1.02;
      font-weight: 820;
      letter-spacing: 0;
    }

    h2 {
      color: #111827;
      font-size: 13.6pt;
      line-height: 1.12;
      font-weight: 780;
      letter-spacing: 0;
    }

    h3 {
      color: #111827;
      font-size: 8.4pt;
      line-height: 1.18;
      font-weight: 760;
      letter-spacing: 0;
    }

    .intro {
      margin-top: 4mm;
      color: #4b5563;
      font-size: 9.5pt;
      line-height: 1.45;
    }

    .cover-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 3mm;
      margin-top: 9mm;
    }

    .cover-stats div,
    .workflow-grid article,
    .clinical-two-up section,
    .feature-lists section,
    .video-list a {
      border: 1px solid rgba(210, 224, 235, 0.88);
      border-radius: 4mm;
      background:
        radial-gradient(circle at 18% 18%, rgba(0, 119, 200, 0.09), rgba(0, 119, 200, 0) 30%),
        linear-gradient(135deg, #ffffff 0%, #f6fbff 48%, #ffffff 100%);
      box-shadow: 0 2mm 8mm rgba(0, 55, 112, 0.035);
    }

    .cover-stats div {
      padding: 4mm;
    }

    .cover-stats strong {
      display: block;
      color: #0b75b7;
      font-size: 17pt;
      line-height: 1;
    }

    .cover-stats span {
      display: block;
      margin-top: 1.6mm;
      color: #4b5563;
      font-size: 6.8pt;
      font-weight: 760;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .cover-visual {
      border: 1px solid rgba(210, 224, 235, 0.9);
      border-radius: 6mm;
      padding: 7mm;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(247, 249, 252, 0.96) 100%);
      box-shadow: 0 8mm 22mm rgba(0, 55, 112, 0.08);
    }

    .cover-visual img {
      width: 100%;
      max-height: 110mm;
      object-fit: contain;
    }

    .page-break {
      break-before: page;
      page-break-before: always;
    }

    .page-break:not(.catalogue-footer-page),
    .category-section {
      padding-top: 32mm;
    }

    .section-head {
      margin-bottom: 7mm;
    }

    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4mm;
      margin-top: 7mm;
    }

    .workflow-grid article {
      min-height: 32mm;
      padding: 4mm;
    }

    .workflow-grid span {
      display: block;
      margin-bottom: 3mm;
      color: #0b75b7;
      font-family: "SF Mono", Consolas, monospace;
      font-size: 6.8pt;
      font-weight: 900;
    }

    .workflow-grid p,
    .clinical-two-up p,
    .feature-lists li,
    .product-card span,
    .video-list small,
    .video-list span {
      color: #4b5563;
    }

    .workflow-grid p {
      margin-top: 2mm;
      font-size: 7.7pt;
      line-height: 1.38;
    }

    .feature-card {
      display: grid;
      grid-template-columns: 50mm minmax(0, 1fr);
      gap: 6mm;
      padding: 5mm 0;
      border-top: 1px solid rgba(17, 24, 39, 0.11);
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .feature-card:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .feature-image {
      display: grid;
      place-items: center;
      min-height: 44mm;
      border: 1px solid rgba(210, 224, 235, 0.88);
      border-radius: 5mm;
      padding: 4mm;
      background: #f7f9fc;
    }

    .feature-image img {
      width: 100%;
      max-height: 40mm;
      object-fit: contain;
    }

    .clinical-two-up,
    .feature-lists {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3mm;
      margin-top: 4mm;
    }

    .clinical-two-up section,
    .feature-lists section {
      padding: 3mm;
    }

    .clinical-two-up h3,
    .feature-lists h3,
    .video-list h3 {
      margin-bottom: 1.5mm;
      color: #24364a;
      font-size: 6.5pt;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .clinical-two-up p {
      font-size: 7pt;
      line-height: 1.32;
    }

    .feature-lists ul {
      display: grid;
      gap: 1.2mm;
      margin: 0;
      padding-left: 3.8mm;
    }

    .feature-lists li {
      font-size: 6.8pt;
      line-height: 1.26;
    }

    .category-section {
      break-before: page;
      page-break-before: always;
    }

    .category-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 8mm;
      margin-bottom: 5mm;
      border-bottom: 1px solid rgba(17, 24, 39, 0.11);
      padding-bottom: 3mm;
    }

    .category-heading span {
      color: #667085;
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 3.2mm;
    }

    .product-card {
      display: grid;
      grid-template-rows: 32mm minmax(0, 1fr);
      min-height: 60mm;
      border: 1px solid rgba(210, 224, 235, 0.88);
      border-radius: 4mm;
      overflow: hidden;
      background: #ffffff;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .product-card figure {
      display: grid;
      place-items: center;
      margin: 0;
      padding: 3mm;
      background: #f7f9fc;
    }

    .product-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .product-card div {
      display: grid;
      gap: 1.7mm;
      align-content: start;
      padding: 3mm;
    }

    .product-card p {
      color: #0b75b7;
      font-size: 5.4pt;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .product-card h3 {
      font-size: 6.8pt;
      line-height: 1.22;
      font-weight: 760;
    }

    .product-card strong {
      color: #24364a;
      font-size: 6pt;
      font-weight: 850;
      letter-spacing: 0.03em;
    }

    .product-card span {
      font-size: 5.7pt;
      font-weight: 720;
    }

    .video-section .intro {
      max-width: 155mm;
      margin-bottom: 7mm;
    }

    .video-group {
      margin-top: 5mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .video-group h2 {
      margin-bottom: 3mm;
      font-size: 10.5pt;
    }

    .video-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3mm;
    }

    .video-list.compact {
      grid-template-columns: 1fr;
      margin-top: 3mm;
    }

    .video-list a {
      display: grid;
      gap: 1mm;
      padding: 3mm;
      color: #0b4f7a;
      font-size: 7pt;
      font-weight: 820;
      text-decoration: underline;
      text-underline-offset: 1.3px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .video-section .video-card {
      grid-template-columns: 24mm minmax(0, 1fr);
      align-items: center;
      gap: 2.5mm;
      padding: 2.5mm;
      text-decoration: none;
    }

    .video-card figure {
      display: grid;
      place-items: center;
      width: 24mm;
      height: 18mm;
      margin: 0;
      border: 1px solid rgba(210, 224, 235, 0.9);
      border-radius: 3mm;
      padding: 1.5mm;
      background: #ffffff;
      overflow: hidden;
    }

    .video-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .video-card div {
      display: grid;
      gap: 0.8mm;
      min-width: 0;
    }

    .video-card strong {
      color: #0b4f7a;
      font-size: 7pt;
      line-height: 1.16;
      text-decoration: underline;
      text-underline-offset: 1.3px;
    }

    .video-list small,
    .video-list span {
      display: block;
      font-size: 5.8pt;
      font-weight: 650;
      line-height: 1.2;
      text-decoration: none;
    }

    .catalogue-footer-page {
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      min-height: 278mm;
      margin: -24mm -11mm -18mm;
      padding: 56mm 24mm 34mm;
      text-align: center;
      background:
        linear-gradient(180deg, #0c1730 0%, #101b36 100%);
      color: #ffffff;
    }

    .catalogue-footer-page::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(128deg, transparent 0 48%, rgba(11, 117, 183, 0.16) 48% 58%, transparent 58%),
        repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 18px);
      opacity: 0.72;
    }

    .footer-inner {
      position: relative;
      z-index: 1;
      display: grid;
      justify-items: center;
      max-width: 145mm;
    }

    .footer-inner img {
      width: 42mm;
      margin-bottom: 9mm;
      border-radius: 3mm;
      padding: 2.4mm 3mm;
      background: #ffffff;
      box-shadow: 0 9mm 26mm rgba(0, 0, 0, 0.24);
    }

    .catalogue-footer-page .eyebrow {
      color: rgba(255, 255, 255, 0.68);
    }

    .catalogue-footer-page h1 {
      max-width: 130mm;
      color: #ffffff;
      font-size: 24pt;
      line-height: 1.1;
    }

    .catalogue-footer-page .intro {
      max-width: 124mm;
      color: rgba(255, 255, 255, 0.86);
      font-size: 9pt;
    }

    .footer-actions {
      display: flex;
      justify-content: center;
      gap: 4mm;
      margin-top: 9mm;
    }

    .footer-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 10mm;
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 999px;
      padding: 0 7mm;
      color: #ffffff;
      font-size: 7.2pt;
      font-weight: 800;
      text-decoration: none;
    }

    .footer-actions a.primary {
      border-color: #3f79c6;
      background: #3f79c6;
    }
  </style>
</head>
<body>
  ${renderHeader(logoUrl)}
  <main class="document">
    <section class="cover">
      <div>
        <img class="cover-logo" src="${logoUrl}" alt="Laschal Surgical" />
        <p class="eyebrow">EndoTech NZ catalogue</p>
        <h1>Laschal endodontic instruments for control, access, and retrieval.</h1>
        <p class="intro">
          A clinician-facing catalogue for tactile file control, separated instrument retrieval,
          gutta percha removal, and microsurgical endodontic support.
        </p>
        <div class="cover-stats">
          <div><strong>${productCount}</strong><span>Products listed</span></div>
          <div><strong>${featuredInstruments.length}</strong><span>Featured pathways</span></div>
          <div><strong>${videoGroups.reduce((total, group) => total + group.items.length, 0)}</strong><span>Video links</span></div>
        </div>
      </div>
      <figure class="cover-visual">
        <img src="${publicAssetDataUri(assets.hero)}" alt="Laschal endodontic instrumentation set" />
      </figure>
    </section>

    <section class="page-break">
      <div class="section-head">
        <p class="eyebrow">Clinical workflow fit</p>
        <h1>Choose by the clinical problem in front of you.</h1>
        <p class="intro">
          Laschal instruments are most useful where direct finger access, visibility, or force control limits the procedure.
        </p>
      </div>
      ${renderWorkflow(clinicalTasks)}
    </section>

    ${renderFeatureSections(featuredInstruments)}

    ${categoryGroups.map(renderCategorySections).join('')}

    ${renderVideoSection(videoGroups)}
    ${renderCatalogueFooter(logoUrl, sourceCategoryHref)}
  </main>
</body>
</html>`;
}

const laschalData = await importTs('src/data/laschal.ts');
globalThis.__laschalPdfRuntime = { laschalCatalogItems: laschalData.laschalCatalogItems };
const catalogueData = await importTs('src/data/laschalCatalogue.ts', (source) =>
  source.replace(
    "import { laschalCatalogItems } from './laschal';",
    'const { laschalCatalogItems } = globalThis.__laschalPdfRuntime;',
  ),
);

const categoryGroups = groupByCategory(laschalData.laschalCatalogItems, catalogueData.laschalCategoryOrder);
const videoGroups = enrichVideoGroups(
  groupVideos(catalogueData.laschalCatalogueVideos),
  laschalData.laschalCatalogItems,
  catalogueData.laschalAssets.group,
);
const html = catalogueHtml({
  assets: catalogueData.laschalAssets,
  categoryGroups,
  featuredInstruments: catalogueData.laschalFeaturedInstruments,
  clinicalTasks: catalogueData.laschalClinicalTasks,
  videoGroups,
  productCount: laschalData.laschalCatalogItems.length,
  sourceCategoryHref: catalogueData.laschalSourceCategoryHref,
});

mkdirSync(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }),
    );
  });
  await page.pdf({
    path: outputPath,
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
} finally {
  await browser.close();
}

copyFileSync(outputPath, versionedOutputPath);
console.log(outputPath);
