export const nzShaperPromo: {
  readonly code: string;
  readonly skus: readonly string[];
  readonly packQty: number;
  readonly packPrice: number;
  readonly netPrice: number;
  readonly pricingBasis: string;
  readonly description: string;
};
export const normalisePromoCode: (value: unknown) => string;
export const validatePromoSelection: (value: unknown, lines: Array<{ sku: string; quantity: number }>) => string | null;
