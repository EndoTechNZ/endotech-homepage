import type { OrderCatalogEntryDefinition } from '../utils/productOrdering';

const acrobatStandardRange = [
  {
    size: '13/.03',
    items: [
      { length: '21 mm', sku: 'ACGP-130321RF', handle: 'acrobat-glide-path-files-13-03-21mm-6-pack' },
      { length: '25 mm', sku: 'ACGP-130325RF', handle: 'acrobat-glide-path-files-13-03-25mm-6-pack' },
      { length: '29 mm', sku: 'ACGP-130329RF', handle: 'acrobat-glide-path-files-13-03-29mm-6-pack' },
    ],
  },
  {
    size: '15/.03',
    items: [
      { length: '21 mm', sku: 'ACGP-150321RF', handle: 'acrobat-glide-path-files-15-03-21mm-6-pack' },
      { length: '25 mm', sku: 'ACGP-150325RF', handle: 'acrobat-glide-path-files-15-03-25mm-6-pack' },
      { length: '29 mm', sku: 'ACGP-150329RF', handle: 'acrobat-glide-path-files-15-03-29mm-6-pack' },
    ],
  },
  {
    size: '17/.03',
    items: [
      { length: '21 mm', sku: 'ACGP-170321RF', handle: 'acrobat-glide-path-files-17-03-21mm-6-pack' },
      { length: '25 mm', sku: 'ACGP-170325RF', handle: 'acrobat-glide-path-files-17-03-25mm-6-pack' },
      { length: '29 mm', sku: 'ACGP-170329RF', handle: 'acrobat-glide-path-files-17-03-29mm-6-pack' },
    ],
  },
];

export const acrobatOrderEntries: OrderCatalogEntryDefinition[] = [
  ...acrobatStandardRange.flatMap((row) =>
    row.items.map((item) => ({
      ...item,
      size: row.size,
      isMb2: false,
    })),
  ),
  {
    size: '15/.05',
    length: '17 mm',
    sku: 'ACGP-150517RF',
    handle: 'acrobat-glide-path-files-15-05-17mm-6-pack-mb2',
    isMb2: true,
  },
];

export const etOrderEntries: OrderCatalogEntryDefinition[] = [
  ...['17', '20', '25', '30', '35', '40', '45'].flatMap((tip) => [
    { size: `${tip}/.04`, length: '21 mm', sku: `TXET-${tip}0421`, handle: null },
    { size: `${tip}/.04`, length: '25 mm', sku: `TXET-${tip}0425`, handle: null },
    { size: `${tip}/.04`, length: '29 mm', sku: `TXET-${tip}0429`, handle: null },
    { size: `${tip}/.06`, length: '21 mm', sku: `TXET-${tip}0621`, handle: null },
    { size: `${tip}/.06`, length: '25 mm', sku: `TXET-${tip}0625`, handle: null },
    { size: `${tip}/.06`, length: '29 mm', sku: `TXET-${tip}0629`, handle: null },
  ]),
  { size: '.04 assortment', length: '21 mm', sku: 'TXET-0421MM', handle: null },
  { size: '.04 assortment', length: '25 mm', sku: 'TXET-0425MM', handle: null },
  { size: '.06 assortment', length: '21 mm', sku: 'TXET-0621MM', handle: null },
  { size: '.06 assortment', length: '25 mm', sku: 'TXET-0625MM', handle: null },
];

export const ptOrderEntries: OrderCatalogEntryDefinition[] = [
  { size: 'SX', length: '19 mm', sku: 'TXPT-SX-19', handle: null },
  { size: 'S1', length: '21 mm', sku: 'TXPT-S1-21', handle: null },
  { size: 'S2', length: '21 mm', sku: 'TXPT-S2-21', handle: null },
  { size: 'F1', length: '21 mm', sku: 'TXPT-F1-21', handle: null },
  { size: 'F2', length: '21 mm', sku: 'TXPT-F2-21', handle: null },
  { size: 'F3', length: '21 mm', sku: 'TXPT-F3-21', handle: null },
  { size: 'S1', length: '25 mm', sku: 'TXPT-S1-25', handle: null },
  { size: 'S2', length: '25 mm', sku: 'TXPT-S2-25', handle: null },
  { size: 'F1', length: '25 mm', sku: 'TXPT-F1-25', handle: null },
  { size: 'F2', length: '25 mm', sku: 'TXPT-F2-25', handle: null },
  { size: 'F3', length: '25 mm', sku: 'TXPT-F3-25', handle: null },
  { size: 'F4', length: '25 mm', sku: 'TXPT-F4-25', handle: null },
  { size: 'F5', length: '25 mm', sku: 'TXPT-F5-25', handle: null },
  { size: 'S1', length: '31 mm', sku: 'TXPT-S1-31', handle: null },
  { size: 'S2', length: '31 mm', sku: 'TXPT-S2-31', handle: null },
  { size: 'F1', length: '31 mm', sku: 'TXPT-F1-31', handle: null },
  { size: 'F2', length: '31 mm', sku: 'TXPT-F2-31', handle: null },
  { size: 'F3', length: '31 mm', sku: 'TXPT-F3-31', handle: null },
];
