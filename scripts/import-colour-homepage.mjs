// One-time import of the approved local concept; reviewed-site/index.html is canonical.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
const input=process.argv[2];
if(!input) throw Error('Pass the approved concept HTML path');
const old=new JSDOM(execFileSync('git',['show','22bdb755b1f28e83ec259a86079cad16e5188dd1:reviewed-site/index.html'],{encoding:'utf8',maxBuffer:10*1024*1024})).window.document;
const dom=new JSDOM(fs.readFileSync(input,'utf8')),d=dom.window.document;
d.querySelector('.preview-toolbar')?.remove();d.querySelector('.u-footer')?.remove();
d.title='EndoTech NZ | Transform S™ Endodontic Files';
for(const meta of d.querySelectorAll('meta[name="robots"],meta[name="description"]'))meta.remove();
d.head.insertAdjacentHTML('beforeend','<meta name="description" content="Explore Transform S endodontic files, New Zealand offers, technical resources and local support from EndoTech NZ."><link rel="canonical" href="https://endotechnz.com/"><link rel="stylesheet" href="/email-options.css"><link rel="stylesheet" href="/homepage-colour.css"><script src="/email-options.js" defer></script>');
const files=['logo','rg','et','pt','micro-path','c-plus'];
fs.mkdirSync('reviewed-site/assets/homepage',{recursive:true});
let n=0;for(const img of d.querySelectorAll('img[src^="data:"]')){const name=files[n++];if(!name)throw Error('Unexpected image');const file=`assets/homepage/${name}.webp`;await sharp(Buffer.from(img.src.split(',')[1],'base64')).resize({width:name==='logo'?180:1800,withoutEnlargement:true}).webp({quality:90}).toFile('reviewed-site/'+file);img.src='/'+file;img.decoding='async';if(name==='rg')img.setAttribute('fetchpriority','high');}
const section=d.querySelector('.v10');
const lower=d.createElement('div');lower.className='homepage-lower';
const features=old.querySelector('#features');
const cards=[...features.querySelectorAll('.system-detail-link')].map(a=>`<a class="architecture-card" href="${a.getAttribute('href')}"><span class="architecture-icon">${a.querySelector('svg').outerHTML}</span><h3>${a.querySelector('h3').textContent}</h3><p>${a.querySelector('p').textContent}</p></a>`).join('');
const download=features.querySelector('a[target]');
const upgrade=old.querySelector('[vid="137"]');
lower.innerHTML=`<section class="architecture" id="features"><div class="architecture-inner">${features.querySelector('.mesh-stage').outerHTML}<div class="architecture-heading"><div><p class="section-eyebrow">Inside the engineering</p><h2>System Architecture</h2><p>${features.querySelector('[vid="98"]').textContent}</p></div><a class="tech-download" href="${download.href}" target="_blank" rel="noopener noreferrer">Download Tech Specs <span aria-hidden="true">↗</span></a></div><div class="architecture-grid">${cards}</div></div></section><section class="upgrade"><div class="upgrade-card"><span class="upgrade-kicker">Let’s talk files.</span><h2>Ready to Upgrade</h2><p>${upgrade.querySelector('[vid="142"]').textContent.trim()}</p>${upgrade.querySelector('.email-contact-actions').outerHTML}</div></section>${old.querySelector('.clean-footer').outerHTML}`;
for(const el of lower.querySelectorAll('[vid]'))el.removeAttribute('vid');
const specialist=lower.querySelector('.email-contact-actions>a');specialist.className='specialist-link';
lower.querySelector('.clean-footer nav').insertAdjacentHTML('beforeend','<a href="/products/c-plus/">C+ hand files</a>');
section.after(lower);
const mesh=[...old.querySelectorAll('script')].find(s=>s.textContent.includes('const parts='));
if(!mesh)throw Error('Missing original rotating mesh');
d.body.append(d.importNode(mesh,true));
// Avoid inherited demo sizing and retain readable type on small screens.
for(const el of d.querySelectorAll('[vid]'))el.removeAttribute('vid');
fs.writeFileSync('reviewed-site/index.html',dom.serialize());
console.log('Imported production homepage with original mesh, email controls and footer.');
