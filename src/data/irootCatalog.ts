import type { NzLaunchCatalogItem } from './nzLaunchCatalog';
import { nzIrootPromo } from '../../shared/nz-promo-offers.mjs';

// Separate from the workbook-backed file catalogue; verified iRoot manufacturer SKU.
export const irootCatalog: NzLaunchCatalogItem[] = [{
  family: 'bioceramics', system: 'iRoot SP', publicMeaning: 'Bioceramic root canal sealer',
  sku: nzIrootPromo.productSku, fileType: '2 g syringe + 15 disposable tips',
  size: '2 g', lengthMm: null, packQty: 1, requiresConfirmation: false, confirmationNote: '',
}];
