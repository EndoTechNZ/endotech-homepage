import './test-nz-iroot-putty.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const bundled = await build({
  stdin: {contents: `export * from './src/lib/quotePromoPricing'; export {quoteProductLabel,createQuoteRequestPayload} from './src/lib/quoteRequest'; export * from './src/lib/quoteRequestPdf'; export {nzCustomerSelectableCatalog} from './src/data/nzLaunchCatalog'; export {irootCatalog} from './src/data/irootCatalog';`,resolveDir:process.cwd(),loader:'ts'},
  bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent',
});
const {getPromoPriceSummary,buildQuoteRequestPdf,nzCustomerSelectableCatalog,irootCatalog,quoteProductLabel,puttyPriceCopy,puttyQuantity,createQuoteRequestPayload} = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const irootLines = [{sku:'IRSP-08-K1-1',quantity:1},{sku:'TSMP-150325RF',quantity:1}];
assert.deepEqual(getPromoPriceSummary(' iRoOt ',irootLines),{code:'IROOT',packPrice:240,netTotal:240,gstTotal:36,totalInclGst:276,hasAdditionalItems:false});
assert.deepEqual(getPromoPriceSummary('iRoot',irootLines.map(line=>({...line,quantity:2}))),{code:'IROOT',packPrice:240,netTotal:480,gstTotal:72,totalInclGst:552,hasAdditionalItems:false});
for (const invalid of [irootLines.slice(0,1), irootLines.map(line=>({...line,quantity:3})), [{...irootLines[0],quantity:2},irootLines[1]], [...irootLines,irootLines[1]], [irootLines[0],{sku:'TSMP-150321RF',quantity:1}]]) {
  assert.equal(getPromoPriceSummary('iRoot',invalid),null,'iRoot requires the exact syringe and 25 mm free six-pack');
}
const putty = irootCatalog.find(item => item.sku === 'NZ-IROOT-BP-PLUS');
assert.ok(putty);
assert.equal(putty.packQty, null, 'No NZ pack quantity has been supplied');
assert.equal(quoteProductLabel(putty), 'iRoot BP Plus Putty');
assert.equal(quoteProductLabel(irootCatalog.find(item => item.sku === irootLines[0].sku)), 'iRoot SP');
assert.equal(puttyQuantity([{item: putty, quantity: 2}]), 2);
const beforeJanuary = new Date('2026-12-31T10:59:59.999Z');
const january = new Date('2026-12-31T11:00:00Z');
assert.match(puttyPriceCopy(2, beforeJanuary), /NZ\$199\.95 each.*NZ\$399\.90 excl\. GST.*NZ\$59\.99.*NZ\$459\.89 incl\. GST/);
assert.match(puttyPriceCopy(2, january), /Standard price.*NZ\$239\.95 each.*NZ\$479\.90 excl\. GST.*NZ\$71\.99.*NZ\$551\.89 incl\. GST/);
assert.equal(getPromoPriceSummary('iRoot', [{sku: putty.sku, quantity: 2}, irootLines[1]]), null);
const withPutty = getPromoPriceSummary('iRoot', [...irootLines, {sku: putty.sku, quantity: 2}]);
assert.equal(withPutty.totalInclGst, 276, 'Putty is priced separately from the sealer bundle');
assert.equal(withPutty.hasAdditionalItems, true);
const irootExtra=getPromoPriceSummary('IROOT',[...irootLines,{sku:'TSET-150421RF',quantity:1}]);
assert.equal(irootExtra.totalInclGst,276);assert.equal(irootExtra.hasAdditionalItems,true);
const lines = [{sku:'TSMP-150517RF',quantity:1},{sku:'TSET-170817OO',quantity:1}];
assert.deepEqual(getPromoPriceSummary(' tryboth ',lines),{code:'TRYBOTH',packPrice:15,netTotal:30,gstTotal:4.5,totalInclGst:34.5,hasAdditionalItems:false});
for (const [code,selection] of [
  ['',lines],['UNKNOWN',lines],['TRYBOTH',lines.slice(0,1)],
  ['TRYBOTH',lines.map(line=>({...line,quantity:2}))],
  ['TRYBOTH',[...lines,lines[0]]],
]) assert.equal(getPromoPriceSummary(code,selection),null,'Invalid or absent offers must not display a price');
const extra = [...lines,{sku:'TSET-150421RF',quantity:1}];
const extraPrice = getPromoPriceSummary('TRYBOTH',extra);
assert.equal(extraPrice.hasAdditionalItems,true);
assert.equal(extraPrice.totalInclGst,34.5,'Other products must not be represented as included in the bundle price');

globalThis.fetch = async url => new Response(await fs.readFile(path.resolve(url.endsWith('transform.png')?'src/assets/transform-s-wordmark.png':'src/assets/endotech-nz-logo-2026.jpg')));
const base = {
  draftReference:'NZQ-DRAFT-20261014-180000-CAFE',createdAt:new Date('2026-10-14T05:00:00Z'),
  customer:{fullName:'TEST ONLY',practice:'TEST ONLY - DO NOT FULFIL',email:'test@example.test',phone:'000000000',deliveryAddress:'DO NOT FULFIL',promoCode:'TRYBOTH'},
  transformLogoUrl:'https://test.invalid/transform.png',endotechLogoUrl:'https://test.invalid/logo.jpg',contactEmail:'test@example.test',
};
for (const unitCents of [19995, 23995]) {
  const submitted = createQuoteRequestPayload({
    ...base, formStartedAt: base.createdAt.toISOString(), attachment: {filename: 'test.pdf', contentBase64: 'TEST'},
    lines: [{sku: putty.sku, quantity: 2, expectedUnitNetCents: unitCents}, {...irootLines[0], expectedUnitNetCents: unitCents}],
  });
  assert.deepEqual(submitted.lines, [{sku: putty.sku, quantity: 2, expectedUnitNetCents: unitCents}, irootLines[0]]);
}
const output = path.resolve('output/promo-pricing-tests');
await fs.mkdir(output,{recursive:true});
for (const [name,code,selection] of [['promo','TRYBOTH',lines],['extra','TRYBOTH',extra],['normal','',lines],['iroot','iRoot',irootLines],['iroot-two','iRoot',irootLines.map(line=>({...line,quantity:2}))]]) {
  const input = {...base,customer:{...base.customer,promoCode:code},lines:selection.map(line=>({item:[...nzCustomerSelectableCatalog,...irootCatalog].find(item=>item.sku===line.sku),quantity:line.quantity}))};
  assert.ok(input.lines.every(line=>line.item),'Test products must exist in the real catalogue');
  await fs.writeFile(path.join(output,`${name}.pdf`),await buildQuoteRequestPdf(input));
}
console.log('PASS: exact $30 + $4.50 GST = $34.50; invalid offers hidden; additional items priced separately; promo, extra-item and normal PDFs generated with no emails or external fetches.');
