# iRoot BP Plus Putty | NZ December 2026

## Product and ordering

The full product page is at `/products/iroot-bp-plus/`. The order builder can open this item at `/quote-request/?product=iroot-bp-plus#select-products`. The public-facing code `NZ-IROOT-BP-PLUS` is an EndoTech NZ ordering code. Record the manufacturer’s REF and actual pack details separately when the supplier confirms them.

## Price and release

The December price is NZ$199.95 excluding GST. One unit costs NZ$229.94 including GST. Two units cost NZ$399.90 plus NZ$59.99 GST, or NZ$459.89. The calculator applies 15% GST to the extended net amount and rounds to the nearest cent. Postage follows the existing NZ pro forma process.

Leave `confirmedReleaseDate` unset while the arrival date and stock are unconfirmed. This keeps the putty visible for enquiries without accepting it in a request. The December offer uses Pacific/Auckland calendar dates. The last day of the December special is 31 December 2026. From 1 January 2027, the standard price is NZ$239.95 excluding GST. One unit totals NZ$275.94 including GST. Two units cost NZ$479.90 plus NZ$71.99 GST, or NZ$551.89. The date change alone does not release stock.

1. Confirm receipt or an authorised stock-release date, saleable pack, units per pack, supplier REF and English instructions matching the supplied NZ pack. Retain the pack label, supplier confirmation and relevant sponsor/WAND record with the NZ product file.
2. Enter the verified Auckland date as `YYYY-MM-DD` in `shared/nz-iroot-putty.mjs`. Keep the NZ frontend and the SG-hosted NZ receiver’s copy identical. Apply any verified pack detail to the catalogue before release.
3. Test before the date, on the date, and at midnight on 1 January. Check a mixed request, a stale cart and quantities one and two. Confirm the receiver derives the price from the SKU, quantity and server clock. A missing pack confirmation, uncertain stock date, or unresolved sponsor evidence keeps ordering closed.
4. When authorised to publish, update and verify the receiver first, then build and release the NZ site. Use an intercepted or local receiver for tests. A formal pro forma still follows the normal NZ workflow.

## Documents and product scope

The manufacturer and supplier files reviewed for the standard putty match (IFU 4610 Rev 12.0, 15 May 2023). They cover EU jar and syringe presentations. The NZ product page states that pack instructions are pending. Keep the reference PDF outside the public site until the sponsor confirms the instructions for the supplied NZ presentation.

The comparison reference was Brasseler’s standard EndoSequence BC RRM Putty. The NZ product copy draws its clinical statements from the IBC BP Plus instructions. [Brasseler standard BC RRM](https://www.brasselerusadental.com/Catalog/By-Category/Endodontics/bc-rrm)

The records reviewed include a WAND preparation note and supply documents for iRoot SP. A completed sponsor notification covering the BP Plus device and the supplied NZ pack still needs confirmation from the sponsor. WAND access is restricted to sponsors. [Medsafe WAND access](https://www.medsafe.govt.nz/regulatory/devicesnew/3-4AccessingWANDDatabase.asp) · [Medsafe explanation of WAND](https://www.medsafe.govt.nz/regulatory/devicesnew/3-2Explanation.asp)

## Local checks

Run `npm run build:github` and `npm run check:navigation-layout` in the NZ checkout. The build includes catalogue, GST, date boundary and promotion checks. In the receiver checkout, `node scripts/test-nz-quote-request.mjs` exercises fake email delivery. The desktop review runs with external submission disabled.

The browser test used a temporary release date and intercepted every submission locally. With two units, the basket, downloaded request PDF and attachment each showed NZ$399.90 net, NZ$59.99 GST and NZ$459.89 including GST. The checked-in release date remains empty. The receiver tests used a fake mail provider and covered existing items, ineligible dates, mixed carts and independently priced receipts.

## Changed files

NZ website and quote builder

- `docs/releases/iroot-bp-plus-december-2026.md`
- `netlify.toml`
- `reviewed-site/index.html`
- `reviewed-site/products/bcs/index.html`
- `reviewed-site/site-nav.js`
- `scripts/apply-reviewed-site.mjs`
- `scripts/test-nz-iroot-putty.mjs`
- `scripts/test-quote-promo-pricing.mjs`
- `scripts/validate-navigation-layout.mjs`
- `shared/nz-iroot-putty.d.mts`
- `shared/nz-iroot-putty.mjs`
- `src/components/CompactProductHeader.astro`
- `src/components/PuttyAnnouncement.astro`
- `src/data/irootCatalog.ts`
- `src/data/navigation.ts`
- `src/data/nzLaunchCatalog.ts`
- `src/lib/catalogOrder.ts`
- `src/lib/quotePromoPricing.ts`
- `src/lib/quoteRequest.ts`
- `src/lib/quoteRequestPdf.ts`
- `src/pages/index.astro`
- `src/pages/products/bcs/index.astro`
- `src/pages/products/iroot-bp-plus.astro`
- `src/pages/products/overview.astro`
- `src/pages/quote-request.astro`
- `src/scripts/quote-request-builder.ts`

NZ quote receiver in the SG Netlify project

- `netlify/functions/nz-quote-request.mjs`
- `scripts/test-nz-quote-request.mjs`
- `shared/nz-iroot-putty.mjs`
