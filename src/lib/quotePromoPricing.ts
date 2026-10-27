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
  const quantity = isIroot ? Number(lines.find(line => line.sku.toUpperCase() === nzIrootPromo.productSku)!.quantity) : 1;
  const netCents = Math.round((isIroot ? nzIrootPromo.netPrice * quantity : nzShaperPromo.netPrice) * 100);
  const totalCents = Math.round(netCents * 1.15);
  const gstCents = totalCents - netCents;
  return {
    code,
    packPrice: isIroot ? nzIrootPromo.netPrice : nzShaperPromo.packPrice,
    netTotal: netCents / 100,
    gstTotal: gstCents / 100,
    totalInclGst: (netCents + gstCents) / 100,
    hasAdditionalItems: lines.some(line => !offer.skus.includes(line.sku.toUpperCase())),
  };
};

export const promoPriceNote = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code
  ? `One free Micro-Path 15/.03, 25 mm six-pack per iRoot box. Limited to two iRoot boxes per clinic; eligibility checked before invoicing.${price.hasAdditionalItems ? ' Additional products and postage are priced separately.' : ' Postage will be confirmed in your pro forma invoice.'}`
  : price.hasAdditionalItems
    ? 'This price covers the two TRYBOTH packs. Additional products and postage will be priced in your pro forma invoice.'
    : 'Postage will be confirmed in your pro forma invoice. One introductory bundle per practice.';

export const promoTitle = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code ? 'iRoot SP + free Micro-Path pack' : 'Two six-packs of files';
export const promoProductCopy = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code
  ? price.netTotal === nzIrootPromo.netPrice ? 'One 2 g syringe + 15 tips. One free six-pack, 15/.03, 25 mm.' : 'Two 2 g syringes, each with 15 tips. Two free six-packs, 15/.03, 25 mm.'
  : 'One Mini Magic. One 17/.08 Orifice Shaper.';
export const promoPriceCopy = (price: PromoPriceSummary): string => price.code === nzIrootPromo.code
  ? `iRoot SP 2 g syringe ${formatPromoPrice(price.packPrice)} + GST per box. One Micro-Path 15/.03, 25 mm six-pack FREE per box. Bundle excl. GST ${formatPromoPrice(price.netTotal)} + GST ${formatPromoPrice(price.gstTotal)} = ${formatPromoPrice(price.totalInclGst)} incl. GST, plus postage. Limited to two iRoot boxes per clinic.`
  : `Two six-packs at ${formatPromoPrice(price.packPrice)} each + GST. ${formatPromoPrice(price.netTotal)} + ${formatPromoPrice(price.gstTotal)} GST = ${formatPromoPrice(price.totalInclGst)} incl. GST, plus postage.`;
export const promoLinePrice = (price: PromoPriceSummary, sku: string): string | null => {
  if (!getPromoOffer(price.code)?.skus.includes(sku)) return null;
  return price.code === nzIrootPromo.code
    ? sku === nzIrootPromo.freeSku ? 'FREE · six-pack' : `${formatPromoPrice(price.packPrice)} + GST each`
    : `${formatPromoPrice(price.packPrice)} + GST`;
};
