// Publish the approved review after Astro builds the supporting site and assets.
// Frozen _astro assets retain the unchanged production quote/PDF implementation.
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root=path.resolve('reviewed-site'),dist=path.resolve('dist');
let pages=0;
function publish(dir,rel=''){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const next=path.join(rel,entry.name),from=path.join(dir,entry.name),to=path.join(dist,next);
  if(entry.isDirectory()){publish(from,next);continue;}
  fs.mkdirSync(path.dirname(to),{recursive:true});
  if(!entry.name.endsWith('.html')){fs.copyFileSync(from,to);continue;}
  let html=fs.readFileSync(from,'utf8');
  html=html.replace(/<aside class="quote-local-notice">[\s\S]*?<\/aside>/g,'')
   .replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'')
   .replaceAll('http://127.0.0.1:8772','https://endotechnz.com');
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
console.log(`Published ${pages} reviewed HTML pages; production destinations/assets verified.`);
