import { nzShaperPromo, normalisePromoCode, validatePromoSelection } from '../../shared/nz-promo-offers.mjs';

export interface PromoPriceSummary {
  code: string;
  packPrice: number;
  netTotal: number;
  gstTotal: number;
  totalInclGst: number;
  hasAdditionalItems: boolean;
}

export const formatPromoPrice = (amount: number): string => `NZ$${amount.toFixed(2)}`;

export const getPromoPriceSummary = (
  value: unknown,
  lines: Array<{ sku: string; quantity: number }>,
): PromoPriceSummary | null => {
  const code = normalisePromoCode(value);
  if (!code || validatePromoSelection(code, lines)) return null;
  const netCents = Math.round(nzShaperPromo.netPrice * 100);
  const gstCents = Math.round(netCents * 0.15);
  return {
    code,
    packPrice: nzShaperPromo.packPrice,
    netTotal: netCents / 100,
    gstTotal: gstCents / 100,
    totalInclGst: (netCents + gstCents) / 100,
    hasAdditionalItems: lines.some(line => !nzShaperPromo.skus.includes(line.sku.toUpperCase())),
  };
};

export const promoPriceNote = (price: PromoPriceSummary): string => price.hasAdditionalItems
  ? 'This price covers the two TRYBOTH packs. Additional products and postage will be priced in your pro forma invoice.'
  : 'Postage will be confirmed in your pro forma invoice. One introductory bundle per practice.';
