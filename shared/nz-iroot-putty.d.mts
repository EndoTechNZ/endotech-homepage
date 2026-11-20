export const nzIrootPutty: {
  readonly sku: 'NZ-IROOT-BP-PLUS';
  readonly name: 'iRoot BP Plus Putty';
  readonly decemberUnitNetCents: 19995;
  readonly regularUnitNetCents: 23995;
  readonly offerStart: '2026-12-01';
  readonly offerEndExclusive: '2027-01-01';
  readonly confirmedReleaseDate: string | null;
};

export type PuttyOfferState = 'upcoming' | 'awaiting-stock' | 'available';
export function getPuttyOfferState(now?: Date, confirmedReleaseDate?: string | null): PuttyOfferState;
export function getPuttyPricePeriod(now?: Date): 'december' | 'regular';
export function getPuttyLinePrice(quantity: number, now?: Date): {
  unitNetCents: number; netCents: number; gstCents: number; totalCents: number;
};
export function validatePuttySelection(lines: ReadonlyArray<{ sku: string; quantity: number }>, now?: Date, confirmedReleaseDate?: string | null): string | null;
