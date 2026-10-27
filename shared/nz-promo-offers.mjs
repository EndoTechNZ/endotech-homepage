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
  totalInclGst: 240,
  description: 'iRoot SP 2 g syringe with 15 tips, plus one free six-pack of Micro-Path 15/.03, 25 mm files. NZ$240 including GST, plus postage.',
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
  for (const sku of offer.skus) {
    const matching = lines.filter(line => String(line.sku).toUpperCase() === sku);
    if (matching.length !== 1 || Number(matching[0].quantity) !== 1) {
      return code === nzIrootPromo.code
        ? 'iRoot requires one iRoot SP 2 g syringe and one free six-pack of Micro-Path 15/.03, 25 mm. Apply the code to add both.'
        : 'TRYBOTH requires one six-pack of Mini Magic and one six-pack of the 17/.08 Orifice Shaper. Apply the code to add both.';
    }
  }
  return null;
};
