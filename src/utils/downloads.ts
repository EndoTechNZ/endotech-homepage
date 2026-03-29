import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export interface DownloadItem {
  label: string;
  href: string;
  type: 'Brochure' | 'IFU' | 'SDS' | 'Evidence Summary' | 'Images' | 'Document';
  fileName: string;
}

const DOWNLOAD_DIR = path.join(process.cwd(), 'public', 'downloads', 'iroot');

function titleCase(value: string) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferType(fileName: string): DownloadItem['type'] {
  const lower = fileName.toLowerCase();

  if (lower.includes('brochure')) return 'Brochure';
  if (lower.includes('ifu')) return 'IFU';
  if (lower.includes('sds')) return 'SDS';
  if (lower.includes('evidence')) return 'Evidence Summary';
  if (lower.includes('image') || lower.includes('packshot')) return 'Images';
  return 'Document';
}

export function getIrootDownloads(): DownloadItem[] {
  if (!existsSync(DOWNLOAD_DIR)) {
    return [];
  }

  return readdirSync(DOWNLOAD_DIR)
    .filter((entry) => !entry.startsWith('.'))
    .filter((entry) => statSync(path.join(DOWNLOAD_DIR, entry)).isFile())
    .map((fileName) => ({
      label: titleCase(fileName),
      href: `/downloads/iroot/${encodeURIComponent(fileName)}`,
      type: inferType(fileName),
      fileName,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
