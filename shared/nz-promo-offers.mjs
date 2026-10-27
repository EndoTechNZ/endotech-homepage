export const nzShaperPromo = Object.freeze({
  code: 'TRYBOTH',
  skus: Object.freeze(['TSMP-150517RF', 'TSET-170817OO']),
  packQty: 6,
  packPrice: 15,
  netPrice: 30,
  pricingBasis: 'exclusive',
  description: 'Two six-packs of files. $30 plus GST plus postage.',
});

export const normalisePromoCode = value => String(value ?? '').trim().toUpperCase();

export const nzIrootPromo = Object.freeze({
  code: 'IROOT', displayCode: 'iRoot',
  skus: Object.freeze(['IRSP-08-K1-1', 'TSMP-150325RF']),
  productSku: 'IRSP-08-K1-1', freeSku: 'TSMP-150325RF',
  netPrice: 240, totalInclGst: 276, pricingBasis: 'exclusive', maxBoxesPerClinic: 2,
  description: 'iRoot SP 2 g syringe with 15 tips, plus one free six-pack of Micro-Path 15/.03, 25 mm files per box. NZ$240 + GST per box (NZ$276 including GST), plus postage. Limited to two iRoot boxes per clinic.',
});

export const getPromoOffer = value => {
  const code = normalisePromoCode(value);
  return code === nzShaperPromo.code ? nzShaperPromo : code === nzIrootPromo.code ? nzIrootPromo : null;
};

export const validatePromoSelection = (value, lines) => {
  const code = normalisePromoCode(value);
  if (!code) return null;
  const offer = getPromoOffer(code);
  if (!offer) return 'That promo code is not recognised. Check the code in your offer.';
  if (code === nzIrootPromo.code) {
    const product = lines.filter(line => String(line.sku).toUpperCase() === nzIrootPromo.productSku);
    const gift = lines.filter(line => String(line.sku).toUpperCase() === nzIrootPromo.freeSku);
    const quantity = Number(product[0]?.quantity);
    return product.length === 1 && gift.length === 1 && Number.isInteger(quantity)
      && quantity >= 1 && quantity <= nzIrootPromo.maxBoxesPerClinic && Number(gift[0].quantity) === quantity
      ? null : 'iRoot requires one or two iRoot SP boxes and one free Micro-Path 15/.03, 25 mm six-pack per box. Limited to two iRoot boxes per clinic.';
  }
  for (const sku of offer.skus) {
    const matching = lines.filter(line => String(line.sku).toUpperCase() === sku);
    if (matching.length !== 1 || Number(matching[0].quantity) !== 1) {
      return 'TRYBOTH requires one six-pack of Mini Magic and one six-pack of the 17/.08 Orifice Shaper. Apply the code to add both.';
    }
  }
  return null;
};
