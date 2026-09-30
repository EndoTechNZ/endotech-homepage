// Publish the approved review after Astro builds the supporting site and assets.
// Frozen _astro assets retain the unchanged production quote/PDF implementation.
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root=path.resolve('reviewed-site'),dist=path.resolve('dist');
let pages=0;
function refreshQuoteCatalog(reviewedHtml,generatedHtml){
 const reviewedDom=new JSDOM(reviewedHtml),generatedDom=new JSDOM(generatedHtml);
 const reviewedDocument=reviewedDom.window.document,generatedDocument=generatedDom.window.document;
 const reviewedBuilder=reviewedDocument.querySelector('.quote-builder-page');
 const generatedBuilder=generatedDocument.querySelector('.quote-builder-page');
 const catalog=generatedBuilder?.getAttribute('data-catalog');
 if(!reviewedBuilder||!catalog)throw Error('Unable to refresh the reviewed quote catalogue');
 reviewedBuilder.setAttribute('data-catalog',catalog);
 for(const attribute of ['data-submission-endpoint','data-submission-enabled']){
  const value=generatedBuilder.getAttribute(attribute);
  if(value===null)throw Error(`Unable to refresh quote submission setting: ${attribute}`);
  reviewedBuilder.setAttribute(attribute,value);
 }
 for(const selector of ['[data-family-tab="gutta-percha"]','[data-family-panel="gutta-percha"]']){
  const current=reviewedDocument.querySelector(selector),fresh=generatedDocument.querySelector(selector);
  if(!current||!fresh)throw Error(`Unable to refresh quote element: ${selector}`);
  current.replaceWith(reviewedDocument.importNode(fresh,true));
 }
 return '<!DOCTYPE html>\n'+reviewedDom.serialize();
}
function publish(dir,rel=''){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const next=path.join(rel,entry.name),from=path.join(dir,entry.name),to=path.join(dist,next);
  if(entry.isDirectory()){publish(from,next);continue;}
  fs.mkdirSync(path.dirname(to),{recursive:true});
  if(!entry.name.endsWith('.html')){fs.copyFileSync(from,to);continue;}
  const isQuotePage=next.replaceAll('\\', '/') === 'quote-request/index.html';
  const generatedHtml=isQuotePage&&fs.existsSync(to)?fs.readFileSync(to,'utf8'):'';
  let html=fs.readFileSync(from,'utf8');
  html=html.replace(/<aside class="quote-local-notice">[\s\S]*?<\/aside>/g,'')
   .replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'')
   .replace(/\/site-nav\.js(?:\?[^"']*)?/g,'/site-nav.js?v=mobile-menu-20260930')
   .replace(/\/rg-wireframe\.js(?:\?[^"']*)?/g,'/rg-wireframe.js?v=whoosh3-20260930')
   .replaceAll('http://127.0.0.1:8772','https://endotechnz.com');
  if(isQuotePage) {
   html=refreshQuoteCatalog(html,generatedHtml);
   html=html.replace('</head>', '<link rel="stylesheet" href="/quote-feedback.css"></head>');
   html=html.replace('</body>', '<script src="/quote-search.js" defer></script><script src="/quote-feedback.js" defer></script></body>');
  }
  fs.writeFileSync(to,html);pages++;
 }
}
publish(root);
const issues=[];
function check(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,e.name);if(e.isDirectory()){check(file);continue;}if(!e.name.endsWith('.html'))continue;
 const d=new JSDOM(fs.readFileSync(file,'utf8')).window.document;
 for(const el of d.querySelectorAll('[src],link[rel="stylesheet"][href],a[href]')){
  const val=el.getAttribute(el.hasAttribute('src')?'src':'href');if(!val||/^(data:|mailto:|tel:|javascript:|blob:)/.test(val))continue;
  const u=new URL(val,'https://endotechnz.com/'+path.relative(dist,file).replaceAll('\\','/'));
  if(u.origin!=='https://endotechnz.com')continue;
  let target=path.join(dist,decodeURIComponent(u.pathname));if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target))issues.push({page:path.relative(dist,file),target:u.pathname});
 }
}}
check(dist);
if(issues.length){console.error(JSON.stringify(issues,null,2));throw Error('Missing production destinations/assets');}
const quote=fs.readFileSync(path.join(dist,'quote-request/index.html'),'utf8');
if(!quote.includes('/quote-nz.css')||quote.includes('quote-local-notice">'))throw Error('Quote redesign not production-ready');
if(process.env.PUBLIC_QUOTE_REQUEST_SUBMISSION_ENABLED==='true'){
 const d=new JSDOM(quote).window.document;
 const builder=d.querySelector('.quote-builder-page');
 const expectedEndpoint=process.env.PUBLIC_QUOTE_REQUEST_ENDPOINT||'';
 if(builder?.getAttribute('data-submission-enabled')!=='true'||!expectedEndpoint||builder.getAttribute('data-submission-endpoint')!==expectedEndpoint){
  throw Error('Production quote submission settings were not preserved');
 }
}
console.log(`Published ${pages} reviewed HTML pages; production destinations/assets verified.`);
