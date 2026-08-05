export interface QuoteRequestEmailDraftOptions {
  to: string;
  subject: string;
  body: string;
  pdfFilename: string;
  pdfBytes: Uint8Array;
  draftReference: string;
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  const chunkSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return window.btoa(binary);
};

const wrapBase64 = (value: string): string => value.match(/.{1,76}/g)?.join('\r\n') || '';

const sanitiseHeader = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();

export const buildQuoteRequestEmailDraft = ({
  to,
  subject,
  body,
  pdfFilename,
  pdfBytes,
  draftReference,
}: QuoteRequestEmailDraftOptions): Blob => {
  const boundary = `=_EndoTechNZ_${draftReference.replace(/[^A-Za-z0-9]/g, '_')}`;
  const bodyBase64 = wrapBase64(bytesToBase64(new TextEncoder().encode(body)));
  const pdfBase64 = wrapBase64(bytesToBase64(pdfBytes));
  const safeFilename = sanitiseHeader(pdfFilename).replaceAll('"', '');

  const message = [
    'X-Unsent: 1',
    `To: ${sanitiseHeader(to)}`,
    `Subject: ${sanitiseHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    bodyBase64,
    `--${boundary}`,
    `Content-Type: application/pdf; name="${safeFilename}"`,
    `Content-Disposition: attachment; filename="${safeFilename}"`,
    'Content-Transfer-Encoding: base64',
    '',
    pdfBase64,
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return new Blob([message], { type: 'message/rfc822;charset=utf-8' });
};

export const quoteRequestPdfFile = (pdfBytes: Uint8Array, filename: string): File => {
  const pdfCopy = new Uint8Array(pdfBytes.byteLength);
  pdfCopy.set(pdfBytes);
  return new File([pdfCopy.buffer], filename, { type: 'application/pdf', lastModified: Date.now() });
};

export const canNativeSharePdf = (file: File): boolean => {
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
};
