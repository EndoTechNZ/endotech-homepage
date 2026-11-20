import assert from 'node:assert/strict';
import { nzIrootPutty, getPuttyLinePrice, getPuttyOfferState, getPuttyPricePeriod, validatePuttySelection } from '../shared/nz-iroot-putty.mjs';

const { sku } = nzIrootPutty;
const release = '2026-12-04';
const start = new Date('2026-12-03T11:00:00Z'); // Auckland midnight, 4 December.
const decemberStart = new Date('2026-11-30T11:00:00Z');
const decemberEnd = new Date('2026-12-31T10:59:59.999Z');
const januaryStart = new Date('2026-12-31T11:00:00Z');
const valid = [{ sku, quantity: 1 }];

assert.equal(getPuttyOfferState(new Date(decemberStart.getTime() - 1), release), 'upcoming');
assert.equal(getPuttyOfferState(decemberStart, release), 'awaiting-stock');
assert.equal(getPuttyOfferState(decemberStart, '2026-11-29'), 'available');
assert.equal(getPuttyOfferState(new Date(start.getTime() - 1), release), 'awaiting-stock');
assert.equal(getPuttyOfferState(start, release), 'available');
assert.equal(getPuttyOfferState(decemberEnd, release), 'available');
assert.equal(getPuttyOfferState(januaryStart, release), 'available');
assert.equal(getPuttyOfferState(januaryStart, null), 'awaiting-stock');
assert.equal(getPuttyOfferState(januaryStart, '2027-01-03'), 'awaiting-stock');
assert.equal(getPuttyOfferState(new Date('2027-01-02T11:00:00Z'), '2027-01-03'), 'available');
assert.equal(getPuttyOfferState(new Date('invalid'), release), 'awaiting-stock');

for (const value of [null, '', 'yesterday', '2026-02-31', '2026-12-04T00:00Z', '2026-12-46', '2027-01-03']) {
  assert.equal(getPuttyOfferState(start, value), 'awaiting-stock');
  assert.ok(validatePuttySelection(valid, start, value));
}
assert.equal(validatePuttySelection(valid, start, release), null);
assert.equal(validatePuttySelection(valid, januaryStart, release), null);
assert.ok(validatePuttySelection(valid, januaryStart, null));
assert.ok(validatePuttySelection([...valid, ...valid], start, release));
assert.equal(validatePuttySelection([{ sku: 'IRSP-08-K1-1', quantity: 1 }], januaryStart, null), null);
for (const quantity of [0, -1, 1.5, 1000, true, '1']) {
  assert.throws(() => getPuttyLinePrice(quantity, start), RangeError);
  assert.ok(validatePuttySelection([{sku, quantity}], start, release));
}

assert.equal(getPuttyPricePeriod(decemberEnd), 'december');
assert.equal(getPuttyPricePeriod(januaryStart), 'regular');
assert.deepEqual(getPuttyLinePrice(1, decemberEnd), {unitNetCents:19995, netCents:19995, gstCents:2999, totalCents:22994});
assert.deepEqual(getPuttyLinePrice(2, decemberEnd), {unitNetCents:19995, netCents:39990, gstCents:5999, totalCents:45989});
assert.deepEqual(getPuttyLinePrice(1, januaryStart), {unitNetCents:23995, netCents:23995, gstCents:3599, totalCents:27594});
assert.deepEqual(getPuttyLinePrice(2, januaryStart), {unitNetCents:23995, netCents:47990, gstCents:7199, totalCents:55189});
for (const [day, cents] of [[decemberEnd, 19995n], [januaryStart, 23995n]]) {
  for (let quantity = 1; quantity <= 999; quantity++) {
    const price = getPuttyLinePrice(quantity, day);
    assert.equal(price.totalCents, Number((cents * BigInt(quantity) * 115n + 50n) / 100n));
  }
}
console.log('PASS: Auckland rollover to January regular price, independent confirmed-stock gate, and exact 15% GST for quantities 1–999 at both prices.');
