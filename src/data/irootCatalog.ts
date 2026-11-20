import type { NzLaunchCatalogItem } from './nzLaunchCatalog';
import { nzIrootPutty } from '../../shared/nz-iroot-putty.mjs';
import { nzIrootPromo } from '../../shared/nz-promo-offers.mjs';

// The SP entry uses its manufacturer SKU; the putty entry uses an internal EndoTech NZ code.
export const irootCatalog: NzLaunchCatalogItem[] = [{
  family: 'bioceramics', system: 'iRoot SP', publicMeaning: 'Bioceramic root canal sealer',
  sku: nzIrootPromo.productSku, fileType: '2 g syringe + 15 disposable tips',
  size: '2 g', lengthMm: null, packQty: 1, requiresConfirmation: false, confirmationNote: '',
}, {
  family: 'bioceramics', system: nzIrootPutty.name, publicMeaning: 'Root repair material',
  sku: nzIrootPutty.sku, fileType: 'Premixed root repair putty', size: '', lengthMm: null,
  packQty: null, requiresConfirmation: true, confirmationNote: 'NZ pack and supplier reference await confirmation.',
}];
