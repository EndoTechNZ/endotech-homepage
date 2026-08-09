import { PDFDocument, StandardFonts, rgb, type PDFImage, type PDFPage, type PDFFont } from 'pdf-lib';
import type { NzLaunchCatalogItem } from '../data/nzLaunchCatalog';
import { compareNzLaunchCatalogItems } from './catalogOrder';
import { quoteFamilyLabels, type QuoteCustomerDetails } from './quoteRequest';

export interface QuoteRequestPdfLine {
  item: NzLaunchCatalogItem;
  quantity: number;
}

export interface QuoteRequestPdfInput {
  draftReference: string;
  createdAt: Date;
  customer: QuoteCustomerDetails;
  lines: QuoteRequestPdfLine[];
  transformLogoUrl: string;
  endotechLogoUrl: string;
  contactEmail: string;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 44;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const NAVY = rgb(0.055, 0.12, 0.23);
const TEAL = rgb(0.09, 0.39, 0.38);
const GOLD = rgb(0.69, 0.5, 0.16);
const MID = rgb(0.26, 0.34, 0.42);
const LIGHT = rgb(0.89, 0.92, 0.94);
const PALE = rgb(0.965, 0.975, 0.98);

const pdfSafe = (value: unknown): string => String(value ?? '')
  // The approved Transform S artwork above carries the trademark. Base-14 PDF fonts
  // cannot render U+2122 reliably, so body labels stay clean rather than showing "TM" inline.
  .replace(/\u2122/g, '')
  .replace(/[\u2013\u2014]/g, '-')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/\u2026/g, '...')
  .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, ' ')
  .replace(/[ \t]+/g, ' ')
  .trim();

const fetchBytes = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Unable to load PDF artwork (${response.status}).`);
  return new Uint8Array(await response.arrayBuffer());
};

const wrapText = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
  const safe = pdfSafe(text);
  if (!safe) return ['-'];

  const output: string[] = [];
  for (const paragraph of safe.split(/\n+/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) output.push(line);
      line = word;
    }
    if (line) output.push(line);
  }
  return output.length ? output : ['-'];
};

const drawImageContained = (
  page: PDFPage,
  image: PDFImage,
  box: { x: number; y: number; width: number; height: number },
) => {
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  page.drawImage(image, {
    x: box.x,
    y: box.y + ((box.height - height) / 2),
    width,
    height,
  });
};

export const buildQuoteRequestPdf = async (input: QuoteRequestPdfInput): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`EndoTech NZ pro forma invoice request ${input.draftReference}`);
  pdf.setAuthor('EndoTech NZ');
  pdf.setSubject('Unpriced customer request for an EndoTech NZ pro forma invoice');
  pdf.setCreator('EndoTech NZ pro forma request builder');
  pdf.setProducer('EndoTech NZ pro forma request builder');
  pdf.setCreationDate(input.createdAt);

  const [regular, bold, transformBytes, endotechBytes] = await Promise.all([
    pdf.embedFont(StandardFonts.Helvetica),
    pdf.embedFont(StandardFonts.HelveticaBold),
    fetchBytes(input.transformLogoUrl),
    fetchBytes(input.endotechLogoUrl),
  ]);
  const transformLogo = await pdf.embedPng(transformBytes);
  const endotechLogo = await pdf.embedPng(endotechBytes);

  let page!: PDFPage;
  let y = 0;

  const drawHeader = (currentPage: PDFPage) => {
    currentPage.drawRectangle({ x: 0, y: PAGE_HEIGHT - 8, width: PAGE_WIDTH, height: 8, color: TEAL });
    drawImageContained(currentPage, transformLogo, { x: MARGIN, y: PAGE_HEIGHT - 91, width: 236, height: 56 });
    drawImageContained(currentPage, endotechLogo, { x: PAGE_WIDTH - MARGIN - 40, y: PAGE_HEIGHT - 83, width: 40, height: 40 });
    currentPage.drawText('ENDOTECH NZ', {
      x: PAGE_WIDTH - MARGIN - 133,
      y: PAGE_HEIGHT - 57,
      size: 8.5,
      font: bold,
      color: NAVY,
    });
    currentPage.drawText('ENGINEERED ENDODONTICS', {
      x: PAGE_WIDTH - MARGIN - 133,
      y: PAGE_HEIGHT - 69,
      size: 5.8,
      font: regular,
      color: MID,
    });
    currentPage.drawLine({
      start: { x: MARGIN, y: PAGE_HEIGHT - 105 },
      end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 105 },
      thickness: 1,
      color: LIGHT,
    });
  };

  const addPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawHeader(page);
    y = PAGE_HEIGHT - 132;
  };

  const ensureSpace = (required: number) => {
    if (y - required < 74) addPage();
  };

  const drawWrapped = (
    text: string,
    options: { x?: number; size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; width?: number; lineHeight?: number } = {},
  ) => {
    const x = options.x ?? MARGIN;
    const size = options.size ?? 9.5;
    const font = options.font ?? regular;
    const color = options.color ?? MID;
    const width = options.width ?? CONTENT_WIDTH;
    const lineHeight = options.lineHeight ?? (size + 3.5);
    const lines = wrapText(text, font, size, width);
    ensureSpace(lines.length * lineHeight);
    for (const line of lines) {
      page.drawText(line, { x, y, size, font, color });
      y -= lineHeight;
    }
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(32);
    y -= 5;
    page.drawRectangle({ x: MARGIN, y: y - 3, width: 4, height: 15, color: TEAL });
    page.drawText(pdfSafe(title).toUpperCase(), { x: MARGIN + 12, y, size: 10.5, font: bold, color: NAVY });
    y -= 23;
  };

  addPage();

  page.drawText('PRO FORMA INVOICE REQUEST', { x: MARGIN, y, size: 19, font: bold, color: NAVY });
  page.drawText('UNPRICED', {
    x: PAGE_WIDTH - MARGIN - 62,
    y: y + 1,
    size: 8.5,
    font: bold,
    color: GOLD,
  });
  y -= 25;
  drawWrapped('Prepared by the customer for EndoTech NZ review. This is not the priced pro forma invoice, a tax invoice, a purchase order or a product reservation.', {
    size: 9.5,
    color: MID,
    width: 460,
  });
  y -= 7;

  const created = new Intl.DateTimeFormat('en-NZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Pacific/Auckland',
  }).format(input.createdAt);

  page.drawRectangle({ x: MARGIN, y: y - 48, width: CONTENT_WIDTH, height: 54, color: PALE, borderColor: LIGHT, borderWidth: 1 });
  page.drawText('DRAFT REFERENCE', { x: MARGIN + 14, y: y - 10, size: 7, font: bold, color: TEAL });
  page.drawText(pdfSafe(input.draftReference), { x: MARGIN + 14, y: y - 28, size: 12, font: bold, color: NAVY });
  page.drawText('CREATED', { x: MARGIN + 270, y: y - 10, size: 7, font: bold, color: TEAL });
  page.drawText(pdfSafe(created), { x: MARGIN + 270, y: y - 28, size: 10, font: regular, color: NAVY });
  y -= 67;

  drawSectionTitle('Practice details');
  const details: Array<[string, string]> = [
    ['Contact', input.customer.fullName],
    ['Practice / account', input.customer.practice],
    ['Email', input.customer.email],
    ['Phone', input.customer.phone],
    ['Account number', input.customer.accountNumber || '-'],
    ['PO reference', input.customer.purchaseOrderReference || '-'],
    ['Delivery address', input.customer.deliveryAddress],
  ];

  for (const [label, value] of details) {
    const valueLines = wrapText(value, regular, 9.2, 365);
    ensureSpace(Math.max(18, valueLines.length * 12) + 4);
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 6.8, font: bold, color: TEAL });
    valueLines.forEach((line, index) => {
      page.drawText(line, { x: MARGIN + 142, y: y - (index * 12), size: 9.2, font: regular, color: NAVY });
    });
    y -= Math.max(18, valueLines.length * 12) + 3;
  }

  drawSectionTitle('Requested products');

  const columns = [
    { label: 'SKU', x: MARGIN, width: 160 },
    { label: 'Qty', x: MARGIN + 166, width: 42 },
    { label: 'Product', x: MARGIN + 214, width: 135 },
    { label: 'Size', x: MARGIN + 355, width: 62 },
    { label: 'Length', x: MARGIN + 423, width: 84 },
  ];

  const drawTableHeader = () => {
    page.drawRectangle({ x: MARGIN, y: y - 17, width: CONTENT_WIDTH, height: 22, color: NAVY });
    for (const column of columns) {
      page.drawText(column.label.toUpperCase(), { x: column.x + 5, y: y - 10, size: 6.8, font: bold, color: rgb(1, 1, 1) });
    }
    y -= 25;
  };

  drawTableHeader();
  const sortedLines = [...input.lines].sort((a, b) => compareNzLaunchCatalogItems(a.item, b.item));

  for (const [index, line] of sortedLines.entries()) {
    const productLines = wrapText(quoteFamilyLabels[line.item.family], bold, 7.8, columns[2].width - 10).slice(0, 2);
    const sizeLines = wrapText(line.item.size, regular, 7.8, columns[3].width - 10).slice(0, 2);
    const skuLines = wrapText(line.item.sku, regular, 7.3, columns[0].width - 10).slice(0, 2);
    const rowLines = Math.max(productLines.length, sizeLines.length, skuLines.length);
    const rowHeight = Math.max(25, rowLines * 10 + 9);

    if (y - rowHeight < 74) {
      addPage();
      drawTableHeader();
    }

    if (index % 2 === 1) {
      page.drawRectangle({ x: MARGIN, y: y - rowHeight + 4, width: CONTENT_WIDTH, height: rowHeight, color: PALE });
    }

    const values = [
      skuLines,
      [String(line.quantity)],
      productLines,
      sizeLines,
      [line.item.lengthMm ? `${line.item.lengthMm} mm` : '-'],
    ];
    values.forEach((cellLines, columnIndex) => {
      cellLines.forEach((text, lineIndex) => {
        page.drawText(text, {
          x: columns[columnIndex].x + 5,
          y: y - 10 - (lineIndex * 10),
          size: columnIndex === 0 ? 7.3 : 7.8,
          font: columnIndex === 2 ? bold : regular,
          color: NAVY,
        });
      });
    });
    page.drawLine({ start: { x: MARGIN, y: y - rowHeight + 4 }, end: { x: PAGE_WIDTH - MARGIN, y: y - rowHeight + 4 }, thickness: 0.5, color: LIGHT });
    y -= rowHeight;
  }

  ensureSpace(55);
  y -= 9;
  page.drawText(`${input.lines.length} product line${input.lines.length === 1 ? '' : 's'} | ${input.lines.reduce((sum, line) => sum + line.quantity, 0)} packs requested`, {
    x: MARGIN,
    y,
    size: 9,
    font: bold,
    color: TEAL,
  });
  y -= 26;

  drawSectionTitle('Notes');
  drawWrapped(input.customer.notes || 'No additional notes supplied.', { size: 9.2, color: NAVY, lineHeight: 13 });
  y -= 3;

  if (y - 56 < 60) addPage();
  page.drawRectangle({ x: MARGIN, y: y - 52, width: CONTENT_WIDTH, height: 58, color: PALE, borderColor: LIGHT, borderWidth: 1 });
  page.drawText('NEXT STEP', { x: MARGIN + 14, y: y - 10, size: 7, font: bold, color: TEAL });
  const nextStep = wrapText(
    `Email this request to ${input.contactEmail}. EndoTech NZ will enter the listed SKUs and quantities into its desktop invoicing app, then issue the priced pro forma invoice.`,
    regular,
    8.8,
    CONTENT_WIDTH - 28,
  );
  nextStep.slice(0, 4).forEach((line, index) => {
    page.drawText(line, { x: MARGIN + 14, y: y - 27 - (index * 11), size: 8.8, font: regular, color: NAVY });
  });

  const pages = pdf.getPages();
  pages.forEach((currentPage, index) => {
    currentPage.drawLine({ start: { x: MARGIN, y: 56 }, end: { x: PAGE_WIDTH - MARGIN, y: 56 }, thickness: 0.6, color: LIGHT });
    currentPage.drawText('EndoTech NZ | Unpriced pro forma invoice request | No patient-identifiable information', {
      x: MARGIN,
      y: 38,
      size: 6.8,
      font: regular,
      color: MID,
    });
    const pageLabel = `Page ${index + 1} of ${pages.length}`;
    currentPage.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN - regular.widthOfTextAtSize(pageLabel, 6.8),
      y: 38,
      size: 6.8,
      font: regular,
      color: MID,
    });
  });

  return pdf.save();
};

export const downloadQuoteRequestPdf = (bytes: Uint8Array, filename: string) => {
  const payload = new Uint8Array(bytes).buffer as ArrayBuffer;
  const blob = new Blob([payload], { type: 'application/pdf' });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 2_000);
};
