import { nzShaperPromo, nzIrootPromo, getPromoOffer, normalisePromoCode, validatePromoSelection } from '../../shared/nz-promo-offers.mjs';

export interface PromoPriceSummary {
  code: string;
  packPrice: number;
  netTotal: number;
  gstTotal: number;
  totalInclGst: number;
  hasAdditionalItems: boolean;
}

export const formatPromoPrice = (amount: number): string => `NZ$${amount.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const getPromoPriceSummary = (
  value: unknown,
  lines: Array<{ sku: string; quantity: number }>,
): PromoPriceSummary | null => {
  const code = normalisePromoCode(value);
  if (!code || validatePromoSelection(code, lines)) return null;
  const offer = getPromoOffer(code)!;
  const isIroot = code === nzIrootPromo.code;
  const totalCents = isIroot ? Math.round(nzIrootPromo.totalInclGst * 100) : Math.round(nzShaperPromo.netPrice * 115);
  const netCents = isIroot ? Math.round(totalCents / 1.15) : Math.round(nzShaperPromo.netPrice * 100);
  const gstCents = totalCents - netCents;
  return {
    code,
    packPrice: isIroot ? nzIrootPromo.totalInclGst : nzShaperPromo.packPrice,
    netTotal: netCents / 100,
    gstTotal: gstCents / 100,
    totalInclGst: (netCents + gstCents) / 100,
    hasAdditionalItems: lines.some(line => !offer.skus.includes(line.sku.toUpperCase())),
  };
};

export const promoPriceNote = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code
  ? `Includes one iRoot SP 2 g syringe with 15 tips and one free six-pack of Micro-Path 15/.03, 25 mm.${price.hasAdditionalItems ? ' Additional products and postage are priced separately.' : ' Postage will be confirmed in your pro forma invoice.'}`
  : price.hasAdditionalItems
    ? 'This price covers the two TRYBOTH packs. Additional products and postage will be priced in your pro forma invoice.'
    : 'Postage will be confirmed in your pro forma invoice. One introductory bundle per practice.';

export const promoTitle = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code ? 'iRoot SP + free Micro-Path pack' : 'Two six-packs of files';
export const promoProductCopy = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code ? 'One 2 g syringe + 15 tips. One free six-pack, 15/.03, 25 mm.' : 'One Mini Magic. One 17/.08 Orifice Shaper.';
export const promoPriceCopy = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code
  ? `iRoot SP 2 g syringe ${formatPromoPrice(price.totalInclGst)} incl. GST. Micro-Path 15/.03, 25 mm six-pack FREE. Bundle excl. GST ${formatPromoPrice(price.netTotal)} + GST ${formatPromoPrice(price.gstTotal)} = ${formatPromoPrice(price.totalInclGst)} incl. GST, plus postage.`
  : `Two six-packs at ${formatPromoPrice(price.packPrice)} each + GST. ${formatPromoPrice(price.netTotal)} + ${formatPromoPrice(price.gstTotal)} GST = ${formatPromoPrice(price.totalInclGst)} incl. GST, plus postage.`;
export const promoLinePrice = (price: PromoPriceSummary, sku: string): string | null => {
  if (!getPromoOffer(price.code)?.skus.includes(sku)) return null;
  return price.code === nzIrootPromo.code
    ? sku === nzIrootPromo.freeSku ? 'FREE · six-pack' : `${formatPromoPrice(price.totalInclGst)} incl. GST`
    : `${formatPromoPrice(price.packPrice)} + GST`;
};
