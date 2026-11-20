// Internal EndoTech NZ ordering reference. Confirm the NZ supply unit before releasing it.
export const nzIrootPutty = Object.freeze({
  sku: 'NZ-IROOT-BP-PLUS',
  name: 'iRoot BP Plus Putty',
  decemberUnitNetCents: 19995,
  regularUnitNetCents: 23995,
  offerStart: '2026-12-01',
  offerEndExclusive: '2027-01-01',
  confirmedReleaseDate: null,
});

const aucklandDay = new Intl.DateTimeFormat('en-NZ', {
  timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit',
});

const isCalendarDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const localDay = now => {
  const parts = Object.fromEntries(aucklandDay.formatToParts(now).map(({ type, value }) => [type, value]));
  return [parts.year, parts.month, parts.day].join('-');
};

export function getPuttyOfferState(now = new Date(), confirmedReleaseDate = nzIrootPutty.confirmedReleaseDate) {
  if (!Number.isFinite(now.getTime())) return 'awaiting-stock';
  const today = localDay(now);
  if (today < nzIrootPutty.offerStart) return 'upcoming';
  return isCalendarDate(confirmedReleaseDate) && today >= confirmedReleaseDate ? 'available' : 'awaiting-stock';
}

// Before December this selects the advertised upcoming offer. Availability is checked separately.
export function getPuttyPricePeriod(now = new Date()) {
  return localDay(now) < nzIrootPutty.offerEndExclusive ? 'december' : 'regular';
}

export function getPuttyLinePrice(quantity, now = new Date()) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    throw new RangeError('Putty quantity must be a whole number from 1 to 999.');
  }
  const unitNetCents = getPuttyPricePeriod(now) === 'december'
    ? nzIrootPutty.decemberUnitNetCents
    : nzIrootPutty.regularUnitNetCents;
  const netCents = unitNetCents * quantity;
  const gstCents = Math.floor((netCents * 15 + 50) / 100);
  return { unitNetCents, netCents, gstCents, totalCents: netCents + gstCents };
}

export function validatePuttySelection(lines, now = new Date(), confirmedReleaseDate = nzIrootPutty.confirmedReleaseDate) {
  const putty = lines.filter(line => String(line?.sku ?? '').trim().toUpperCase() === nzIrootPutty.sku);
  if (!putty.length) return null;
  if (putty.length !== 1) return 'Enter iRoot BP Plus Putty on one line only.';
  const quantity = putty[0].quantity;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return 'Putty quantity must be a whole number from 1 to 999.';
  }
  const state = getPuttyOfferState(now, confirmedReleaseDate);
  if (state === 'available') return null;
  return 'iRoot BP Plus Putty is coming soon. Remove the putty to request other items.';
}
