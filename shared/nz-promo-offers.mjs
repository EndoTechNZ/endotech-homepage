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

export const validatePromoSelection = (value, lines) => {
  const code = normalisePromoCode(value);
  if (!code) return null;
  if (code !== nzShaperPromo.code) return 'That promo code is not recognised. Check the code in your offer.';
  for (const sku of nzShaperPromo.skus) {
    const matching = lines.filter(line => String(line.sku).toUpperCase() === sku);
    if (matching.length !== 1 || Number(matching[0].quantity) !== 1) {
      return 'TRYBOTH requires one six-pack of Mini Magic and one six-pack of the 17/.08 Orifice Shaper. Apply the code to add both.';
    }
  }
  return null;
};
