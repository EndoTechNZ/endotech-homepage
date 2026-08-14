import type { NzLaunchCatalogItem, NzLaunchFamily } from '../data/nzLaunchCatalog';

const familyOrder: NzLaunchFamily[] = ['et', 'pt', 'rg', 'micro-path', 'c-plus', 'k-files'];

const firstNumber = (value: string, fallback = Number.MAX_SAFE_INTEGER): number => {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : fallback;
};

const rotarySize = (item: NzLaunchCatalogItem): { taper: number; tip: number; typeRank: number } => {
  const individual = item.size.match(/^(\d+)\/\.(\d+)$/);
  if (individual) {
    return {
      taper: Number(individual[2]),
      tip: Number(individual[1]),
      typeRank: item.fileType.toLowerCase().includes('orifice') ? 2 : 0,
    };
  }

  const assorted = item.size.match(/^\.(\d+)/);
  if (assorted) {
    return { taper: Number(assorted[1]), tip: Number.MAX_SAFE_INTEGER, typeRank: 1 };
  }

  return {
    taper: item.fileType.toLowerCase().includes('orifice') ? 7 : Number.MAX_SAFE_INTEGER,
    tip: firstNumber(item.size),
    typeRank: item.fileType.toLowerCase().includes('assorted') ? 1 : 0,
  };
};

const ptSequenceRank = (item: NzLaunchCatalogItem): number => {
  if (item.fileType.toLowerCase().includes('assorted')) return 100;
  if (item.size === 'SX') return 0;
  const shaping = item.size.match(/^S(\d+)$/);
  if (shaping) return Number(shaping[1]);
  const finishing = item.size.match(/^F(\d+)$/);
  if (finishing) return 10 + Number(finishing[1]);
  return 90;
};

const rgSequenceRank = (item: NzLaunchCatalogItem): number => {
  if (item.sku.includes('-OS-')) return 0;
  if (item.sku.includes('-GL-')) return 1;
  if (item.sku.includes('-SML-')) return 2;
  if (item.sku.includes('-PRI-')) return 3;
  if (item.sku.includes('-MED-')) return 4;
  if (item.sku.includes('-LRG-')) return 5;
  if (item.sku.includes('-ASS-') && item.packQty === 4) return 6;
  if (item.sku.includes('-ASS-')) return 7;
  return 90;
};

// Customer-facing order: taper first, then tip/sequence, then length.
// Assorted packs follow the individual files for their taper; orifice shapers are last.
export const compareNzLaunchCatalogItems = (a: NzLaunchCatalogItem, b: NzLaunchCatalogItem): number => {
  const familyDifference = familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family);
  if (familyDifference) return familyDifference;

  if (a.family === 'et' || a.family === 'micro-path') {
    const aSize = rotarySize(a);
    const bSize = rotarySize(b);
    return aSize.taper - bSize.taper ||
      aSize.typeRank - bSize.typeRank ||
      aSize.tip - bSize.tip ||
      (a.lengthMm ?? Number.MAX_SAFE_INTEGER) - (b.lengthMm ?? Number.MAX_SAFE_INTEGER) ||
      a.sku.localeCompare(b.sku, 'en-NZ', { numeric: true });
  }

  if (a.family === 'pt') {
    return ptSequenceRank(a) - ptSequenceRank(b) ||
      (a.lengthMm ?? Number.MAX_SAFE_INTEGER) - (b.lengthMm ?? Number.MAX_SAFE_INTEGER) ||
      a.size.localeCompare(b.size, 'en-NZ', { numeric: true }) ||
      a.sku.localeCompare(b.sku, 'en-NZ', { numeric: true });
  }

  if (a.family === 'rg') {
    return rgSequenceRank(a) - rgSequenceRank(b) ||
      a.packQty - b.packQty ||
      (a.lengthMm ?? Number.MAX_SAFE_INTEGER) - (b.lengthMm ?? Number.MAX_SAFE_INTEGER) ||
      a.sku.localeCompare(b.sku, 'en-NZ', { numeric: true });
  }

  const aAssorted = a.fileType.toLowerCase().includes('assorted') ? 1 : 0;
  const bAssorted = b.fileType.toLowerCase().includes('assorted') ? 1 : 0;
  return aAssorted - bAssorted ||
    firstNumber(a.size) - firstNumber(b.size) ||
    (a.lengthMm ?? Number.MAX_SAFE_INTEGER) - (b.lengthMm ?? Number.MAX_SAFE_INTEGER) ||
    a.size.localeCompare(b.size, 'en-NZ', { numeric: true }) ||
    a.sku.localeCompare(b.sku, 'en-NZ', { numeric: true });
};
