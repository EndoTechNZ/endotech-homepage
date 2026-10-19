// Publish the approved review after Astro builds the supporting site and assets.
// Keep reviewed pages and assets, with approved Astro pages for the request and resources.
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root=path.resolve('reviewed-site'),dist=path.resolve('dist');
// Preserve the approved homepage while publishing the approved equipment and request pages.
const generatedEquipment=new JSDOM(fs.readFileSync(path.join(dist,'index.html'),'utf8')).window.document.querySelector('[data-equipment-section]')?.outerHTML;
if(!generatedEquipment)throw Error('Equipment teaser was not generated');
const equipmentGeneratedPages=new Set(['quote-request/index.html','resources/downloads/index.html']);
const generatedMb2=new JSDOM(fs.readFileSync(path.join(dist,'technique/mb2-file/index.html'),'utf8')).window.document;
const orificeShaperEducation=generatedMb2.querySelector('[data-mb2-orifice-shaper]')?.outerHTML;
if(!orificeShaperEducation)throw Error('17/.08 MB2 education reference was not generated');
let pages=0;
function publish(dir,rel=''){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const next=path.join(rel,entry.name),from=path.join(dir,entry.name),to=path.join(dist,next);
  if(entry.isDirectory()){publish(from,next);continue;}
  fs.mkdirSync(path.dirname(to),{recursive:true});
  if(!entry.name.endsWith('.html')){fs.copyFileSync(from,to);continue;}
  if(equipmentGeneratedPages.has(next.replaceAll('\\','/'))){
   if(!fs.existsSync(to))throw Error(`Generated equipment page missing: ${next}`);
   continue;
  }
  // The interactive MB2 viewer is maintained in Astro, including its mobile controls.
  if(next.replaceAll('\\', '/') === 'viewers/upper-molar-mb2/index.html'){
   if(!fs.existsSync(to))throw Error('Generated MB2 viewer is missing');
   continue;
  }
  let html=fs.readFileSync(from,'utf8');
  // Keep the reviewed footer menus aligned with the generated resource links.
  html=html.replace(/<footer\b[\s\S]*?<\/footer>/gi, footer=>{
   if(footer.includes('href="/resources/safety-data-sheets/"'))return footer;
   return footer.replace(/<a\b([^>]*href="\/resources\/downloads\/"[^>]*)>[\s\S]*?<\/a>/, (match,attributes)=>`${match}<a${attributes.replace('href="/resources/downloads/"','href="/resources/safety-data-sheets/"')}>Safety Data Sheets</a>`);
  });
  // Keep the reviewed navigation while making the Offers page directly discoverable.
  html=html.replace(/<a\b([^>]*href="\/products\/overview\/"[^>]*)>Systems<\/a>/, (match,attributes)=>`${match}<a${attributes.replace('href="/products/overview/"','href="/offers/"')}>Offers</a>`);
  html=html.replace(/href="\/promotions\/transform-s-catalogue\/"([^>]*>View NZ offers)/g,'href="/offers/"$1');
  if(next.replaceAll('\\','/')==='technique/mb2-file/index.html'){
   html=html.replace(/<section\b([^>]*class="[^\"]*\bmb2-available-file\b[^\"]*"[^>]*)>/, '<section id="mini-magic"$1>')
    .replace(/(<h3 id="mb2-available-file-title"[^>]*>)[\s\S]*?(<\/h3>)/, '$1Mini Magic — size 15, .05 taper, 17 mm.$2')
    .replace(/(<nav\b[^>]*class="[^\"]*\bmb2-protocol-local-nav\b[^\"]*"[^>]*>[\s\S]*?)(<\/nav>)/, '$1<a href="#mini-magic">Mini Magic</a><a href="#orifice-shaper-1708">17/.08 Orifice Shaper</a>$2')
    .replace(/<section\b[^>]*class="[^\"]*\bmb2-protocol-detail\b[^\"]*"[^>]*>/, match=>`${orificeShaperEducation}${match}`);
   if(!html.includes('id="orifice-shaper-1708"')||!html.includes('id="mini-magic"'))throw Error('Reviewed MB2 product anchors missing');
  }
  if(next.replaceAll('\\','/')==='index.html'){
   // String insertion keeps every existing hero/carousel byte intact.
   html=html.replace('</main>',`${generatedEquipment}</main>`)
    .replace('</head>','<link rel="stylesheet" href="/eighteeth.css"></head>');
  }
  if(next.replaceAll('\\','/')==='products/overview/index.html'){
   html=html.replace('</main>',`${generatedEquipment}</main>`)
    .replace('</head>','<link rel="stylesheet" href="/eighteeth.css"></head>');
  }
  html=html.replace(/<aside class="quote-local-notice">[\s\S]*?<\/aside>/g,'')
   .replace(/\/site-style\.css(?:\?[^"']*)?/g,'/site-style.css?v=nav-labels-20261019')
   .replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'')
   .replace(/\/site-nav\.js(?:\?[^"']*)?/g,'/site-nav.js?v=offers-20261019')
   .replace(/\/rg-wireframe\.js(?:\?[^"']*)?/g,'/rg-wireframe.js?v=whoosh4-20260930')
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
if(process.env.PUBLIC_LOCAL_PREVIEW==='true'){
 const builder=new JSDOM(quote).window.document.querySelector('[data-quote-builder]');
 if(builder?.getAttribute('data-submission-enabled')!=='false'||builder.getAttribute('data-submission-endpoint'))throw Error('Local preview must not send email');
}
if(process.env.PUBLIC_QUOTE_REQUEST_SUBMISSION_ENABLED==='true'){
 const d=new JSDOM(quote).window.document;
 const builder=d.querySelector('.quote-builder-page');
 const expectedEndpoint=process.env.PUBLIC_QUOTE_REQUEST_ENDPOINT||'';
 if(builder?.getAttribute('data-submission-enabled')!=='true'||!expectedEndpoint||builder.getAttribute('data-submission-endpoint')!==expectedEndpoint){
  throw Error('Production quote submission settings were not preserved');
 }
}
console.log(`Published ${pages} reviewed HTML pages; production destinations/assets verified.`);
