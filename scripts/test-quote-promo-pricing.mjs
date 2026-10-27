import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const bundled = await build({
  stdin: {contents: `export * from './src/lib/quotePromoPricing'; export * from './src/lib/quoteRequestPdf'; export {nzCustomerSelectableCatalog} from './src/data/nzLaunchCatalog'; export {irootCatalog} from './src/data/irootCatalog';`,resolveDir:process.cwd(),loader:'ts'},
  bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent',
});
const {getPromoPriceSummary,buildQuoteRequestPdf,nzCustomerSelectableCatalog,irootCatalog} = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const irootLines = [{sku:'IRSP-08-K1-1',quantity:1},{sku:'TSMP-150325RF',quantity:1}];
assert.deepEqual(getPromoPriceSummary(' iRoOt ',irootLines),{code:'IROOT',packPrice:240,netTotal:208.70,gstTotal:31.30,totalInclGst:240,hasAdditionalItems:false});
for (const invalid of [irootLines.slice(0,1), irootLines.map(line=>({...line,quantity:2})), [...irootLines,irootLines[1]], [irootLines[0],{sku:'TSMP-150321RF',quantity:1}]]) {
  assert.equal(getPromoPriceSummary('iRoot',invalid),null,'iRoot requires the exact syringe and 25 mm free six-pack');
}
const irootExtra=getPromoPriceSummary('IROOT',[...irootLines,{sku:'TSET-150421RF',quantity:1}]);
assert.equal(irootExtra.totalInclGst,240);assert.equal(irootExtra.hasAdditionalItems,true);
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
const output = path.resolve('output/promo-pricing-tests');
await fs.mkdir(output,{recursive:true});
for (const [name,code,selection] of [['promo','TRYBOTH',lines],['extra','TRYBOTH',extra],['normal','',lines],['iroot','iRoot',irootLines]]) {
  const input = {...base,customer:{...base.customer,promoCode:code},lines:selection.map(line=>({item:[...nzCustomerSelectableCatalog,...irootCatalog].find(item=>item.sku===line.sku),quantity:line.quantity}))};
  assert.ok(input.lines.every(line=>line.item),'Test products must exist in the real catalogue');
  await fs.writeFile(path.join(output,`${name}.pdf`),await buildQuoteRequestPdf(input));
}
console.log('PASS: exact $30 + $4.50 GST = $34.50; invalid offers hidden; additional items priced separately; promo, extra-item and normal PDFs generated with no emails or external fetches.');
