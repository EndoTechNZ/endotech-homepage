// Every page entry starts a new preparation lesson. Previous visits, reload and
// history restoration must not paint stored preparation before the first frame.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {chromium,webkit} from 'playwright';

const root=path.resolve(process.env.MOLAR_ROOT||'dist');
const output=path.resolve(process.env.MOLAR_ENTRY_OUTPUT||process.env.OUTPUT||'output/playwright/molar-entry');
const collection=JSON.parse(await fs.readFile(path.join(root,'resources/molar-models/collection.json'),'utf8'));
const numbers=(process.env.MOLAR_ENTRY_MODELS||collection.active_model_numbers.join(',')).split(',').map(Number);
const engines=(process.env.MOLAR_ENTRY_ENGINES||process.env.MOLAR_ENGINES||'chromium,webkit').split(',');
const views=(process.env.MOLAR_ENTRY_VIEWS||'desktop,mobile').split(',');
const replacement=process.env.MOLAR_ENTRY_RUNTIME?await fs.readFile(process.env.MOLAR_ENTRY_RUNTIME,'utf8'):null;
await fs.mkdir(output,{recursive:true});
let server,base=process.env.MOLAR_BASE_URL||process.env.BASE_URL;
if(!base){
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png'};
 server=http.createServer(async(req,res)=>{try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep))throw Error('Outside build');
  if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;
}
const report={base,physicalDevices:false,models:[],passed:false};
const prefixes=['endotech-local-straightening-v1-','endotech-marked-two-track-v1-','endotech-native-continuity-v4-','endotech-biological-v3-','endotech-canal-specific-v2-'];
// Observe the actual scene before every render, including its first frame. The
// instrumentation reads state; it neither resets it nor substitutes geometry.
const hook=`
window.__readMolarEntry=()=>({ready,playing,playRequested,changeToken,selected,
 state:stage.dataset.preparation?JSON.parse(stage.dataset.preparation):null,
 drawn:stage.dataset.drawnPreparation?JSON.parse(stage.dataset.drawnPreparation):null,
 courses:canals.map(c=>({id:c.id,time:c.time,order:c.order,tube:Boolean(c.tube?.visible),sidecut:Boolean(c.sidecutWall?.visible),stocks:c.stocks?.filter(o=>o?.visible).length||0})),
 violations:window.__molarEntryViolations,frames:window.__molarEntryFrames,events:window.__molarEntryEvents});
const entryRender=renderer.render.bind(renderer);
renderer.render=(...args)=>{
 if(ready&&window.__watchMolarEntry!==false){
  window.__molarEntryFrames++;
  const bad=canals.filter(c=>c.time!==0||c.order!==0||c.tube?.visible||c.sidecutWall?.visible||c.stocks.some(o=>o?.visible));
  if((bad.length||playing||playRequested)&&window.__molarEntryViolations.length<10)window.__molarEntryViolations.push({playing,playRequested,courses:bad.map(c=>({id:c.id,time:c.time,order:c.order,tube:Boolean(c.tube?.visible),sidecut:Boolean(c.sidecutWall?.visible),stocks:c.stocks.filter(o=>o?.visible).length}))});
 }
 return entryRender(...args);
};`;

async function read(p){return p.evaluate(()=>window.__readMolarEntry());}
async function frame(p,match={time:0}){
 await p.waitForFunction(m=>{
  const raw=document.querySelector('#stage')?.dataset.drawnPreparation;if(!raw)return false;
  const x=JSON.parse(raw);return Object.entries(m).every(([k,v])=>x[k]===v);
 },match,{timeout:90000});
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function unprepared(p,label){
 // Fail on an actually drawn prepared opening, instead of timing out while
 // waiting for the desired zero state that a rejected runtime never produces.
 await frame(p,{});const x=await read(p);
 assert.deepEqual(x.violations,[],label+': preparation painted during entry');
 assert.ok(x.frames>0,label+': no audited render');assert.equal(x.playing,false,label+': playback resumed');assert.equal(x.playRequested,false,label+': pending playback survived entry');
 assert.equal(x.state.file,'17',label+': first file is not selected');assert.equal(x.drawn.file,'17',label+': first file is not rendered');
 assert.equal(x.state.time,0,label+': selected course not at zero');assert.equal(x.state.total,0,label+': removed volume exists');
 assert.deepEqual(x.state.visiblePreparedCourses,[],label+': prepared surface exists');assert.equal(x.state.visibleRemovalMeshes,0,label+': removed dentine exists');
 assert.ok(x.state.preparedWallsEnabled&&x.state.removedDentineEnabled&&x.state.fileShown&&x.state.toothOutlineShown,label+': required layers/file/outline disabled');
 for(const c of x.courses){assert.equal(c.time,0,label+': stored course time '+c.id);assert.equal(c.order,0,label+': stored cutting order '+c.id);assert.ok(!c.tube&&!c.sidecut&&!c.stocks,label+': visible prep mesh '+c.id);}
 for(const c of x.state.canals)assert.ok(c.visits.every(v=>v<=0),label+': positive cutting visit '+c.id);
 const gl=await p.evaluate(()=>{const g=document.querySelector('#stage canvas').getContext('webgl2');return {error:g.getError(),lost:g.isContextLost()};});
 assert.deepEqual(gl,{error:0,lost:false});return x;
}
async function canvas(p){return Buffer.from(await p.evaluate(()=>document.querySelector('#stage canvas').toDataURL('image/png').split(',')[1]),'base64');}
const hash=b=>createHash('sha256').update(b).digest('hex');
async function samePixels(a,b,label,mobile){
 const x=await sharp(a).ensureAlpha().raw().toBuffer({resolveWithObject:true}),y=await sharp(b).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.deepEqual(x.info,y.info,label+': canvas changed dimensions');let changed=0,maxDelta=0;
 for(let i=0;i<x.data.length;i+=4){let different=false;for(let j=0;j<4;j++){const delta=Math.abs(x.data[i+j]-y.data[i+j]);maxDelta=Math.max(maxDelta,delta);if(delta>2)different=true;}if(different)changed++;}
 // Clean WebKit reloads themselves vary at translucent shell/AA pixels. Compare
 // actual opaque native pulp, excluding the inset, metal and silhouette edges.
 // Every confident interior pixel must remain native pink: preparation colours
 // cannot consume even one such pixel. The small RGB bound allows raster shade
 // rounding only; the before-every-render state guard independently forbids any
 // preparation mesh, visit or time from ever entering the opening scene.
 const w=x.info.width,h=x.info.height,scale=mobile?1.6:1,cw=w/scale,ch=h/scale;
 const ow=Math.min(150,cw*.22,Math.max(40,(ch-100)*.52)),oh=ow/.52;
 const inset={left:(cw-ow-10)*scale-3,right:(cw-10)*scale+3,top:76*scale-3,bottom:(76+oh)*scale+3};
 const strong=new Uint8Array(w*h),pink=(r,g,b,a)=>a>=245&&r>60&&g/r>.45&&g/r<.85&&b/r>.4&&b/r<.85;
 for(let py=1;py<h-1;py++)for(let px=1;px<w-1;px++){
  if(px>=inset.left&&px<=inset.right&&py>=inset.top&&py<=inset.bottom)continue;
  const k=py*w+px,i=k*4,r=x.data[i],g=x.data[i+1],b=x.data[i+2];
  strong[k]=x.data[i+3]>=250&&r>65&&g/r>.54&&g/r<.76&&b/r>.45&&b/r<.76?1:0;
 }
 let nativePixels=0,nativeClassMismatches=0,maxNativeDelta=0;
 for(let py=1;py<h-1;py++)for(let px=1;px<w-1;px++){
  let interior=true;for(let dy=-1;dy<=1&&interior;dy++)for(let dx=-1;dx<=1;dx++)if(!strong[(py+dy)*w+px+dx]){interior=false;break;}
  if(!interior)continue;nativePixels++;const i=(py*w+px)*4;
  if(!pink(...y.data.subarray(i,i+4)))nativeClassMismatches++;
  for(let j=0;j<3;j++)maxNativeDelta=Math.max(maxNativeDelta,Math.abs(x.data[i+j]-y.data[i+j]));
 }
 assert.ok(nativePixels>250,label+': native pulp pixel evidence absent');
 assert.equal(nativeClassMismatches,0,label+': native pulp replaced or missing on stored opening');
 assert.ok(maxNativeDelta<=12,label+': native pulp colour changed beyond raster rounding');
 return {identicalRGBA:hash(a)===hash(b),changedPixels:changed,maxDelta,nativePixels,nativeClassMismatches,maxNativeDelta};
}
async function seek(p,time){
 await p.evaluate(()=>window.__watchMolarEntry=false);
 await p.locator('#timeline').evaluate((el,t)=>{el.value=t;el.dispatchEvent(new Event('input',{bubbles:true}));},time);await frame(p,{time});
}
async function select(p,tooth,c){
 const groups=[...new Set(tooth.canals.map(d=>d.anatomical_canal_id||d.id))];
 await p.locator('#canals button').nth(groups.indexOf(c.anatomical_canal_id||c.id)).click();
 if(c.pass_index>1)await p.locator('#passes button').nth(c.pass_index-1).click();
 await frame(p,{canal:c.id});
}
async function lifecycle(p,url,model){
 const play=p.locator(model.view==='mobile'?'#mobile-play':'#play');
 await seek(p,12);await play.click();await p.waitForFunction(()=>window.__readMolarEntry().playRequested);
 await p.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
 await unprepared(p,'Synthetic persisted page return');model.syntheticPersistedReturn=true;
 // Hold a not-yet-loaded mesh while entering a later stage. Releasing it after
 // returning must not reapply a stale seek or resume a pending Play request.
 let held,release;const gate=new Promise(resolve=>release=resolve),seen=new Promise(resolve=>held=resolve);
 await p.route('**/extra-1.json*',async route=>{held();await gate;await route.continue();});
 await p.evaluate(()=>window.__watchMolarEntry=false);
 await p.locator('#timeline').evaluate(el=>{el.value=28;el.dispatchEvent(new Event('input',{bubbles:true}));});
 await Promise.race([seen,new Promise((_,reject)=>setTimeout(()=>reject(Error('Deferred preparation request not reached')),20000))]);
 await play.click();
 await p.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
 release();await p.unroute('**/extra-1.json*');
 await p.waitForLoadState('networkidle');await unprepared(p,'Late mesh completion after return');model.deferredReturn=true;
 await seek(p,12);await p.goto(new URL('/resources/molar-models/?entry-history-check=1',base).href);
 await p.goBack({waitUntil:'domcontentloaded'});const restored=await unprepared(p,'Actual browser Back return');
 model.historyReturn={passed:true,persisted:restored.events.some(e=>e.type==='pageshow'&&e.persisted)};
 // Explicit selected-canal URL still selects its intended anatomy, at zero.
 assert.ok(p.url().startsWith(url));
}

try{
 for(const engine of engines){
  const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium'?{args:['--enable-unsafe-swiftshader']}: {})});
  try{await Promise.all(views.map(async view=>{
   const mobile=view==='mobile';assert.ok(mobile||view==='desktop','Unknown view '+view);
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:mobile?2:1,isMobile:mobile,hasTouch:mobile});
   const p=await context.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(()=>{
    window.__watchMolarEntry=true;window.__molarEntryViolations=[];window.__molarEntryFrames=0;window.__molarEntryEvents=[];
    for(const type of ['pageshow','pagehide'])window.addEventListener(type,event=>{window.__molarEntryEvents.push({type,persisted:event.persisted});if(type==='pageshow')window.__watchMolarEntry=true;});
   });
   await p.route('**/full-preparation.js*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(replacement??await response.text())+hook});});
   try{for(const n of numbers){
    const tooth=JSON.parse(await fs.readFile(path.join(root,`resources/molar-models/tooth-prep-${n}/tooth.json`),'utf8'));
    const url=new URL(`/resources/molar-models/tooth-prep-${n}/`,base).href;
    const model={engine,view,model:n,passed:false};report.models.push(model);
    try{
     // Each model first receives an actually fresh visit without proof=1.
     if(p.url().startsWith(base))await p.evaluate(()=>{for(const k of Object.keys(localStorage))if(k.startsWith('endotech-'))localStorage.removeItem(k);});
     await p.goto(url);await unprepared(p,'Fresh model '+n);const first=await canvas(p);model.fresh=true;
     await fs.writeFile(path.join(output,`${engine}-${view}-${n}-fresh.png`),first);
     const keys=prefixes.map(prefix=>prefix+tooth.specimen);
     await p.evaluate(({keys,courses})=>{for(const key of keys)localStorage.setItem(key,JSON.stringify(courses));},{keys,courses:tooth.canals.map((c,i)=>({id:c.id,time:c.duration_seconds,order:i+1}))});
     await p.reload();await unprepared(p,'Legacy-prepared reload model '+n);const seeded=await canvas(p);
     await fs.writeFile(path.join(output,`${engine}-${view}-${n}-stored.png`),seeded);
     model.seededKeys=keys;model.storedOpeningPixels=await samePixels(first,seeded,'Model '+n+' '+engine+' '+view,mobile);model.storedOpening=true;
     const a=tooth.canals[0],b=tooth.canals.find(c=>c.pass_index===2)||tooth.canals[1];
     await seek(p,12);const prep=await read(p);assert.ok(prep.state.visiblePreparedCourses.includes(a.id));assert.ok(prep.state.visibleRemovalMeshes>0);
     if(b){await select(p,tooth,b);let x=await read(p);assert.equal(x.courses.find(c=>c.id===a.id).time,12);assert.equal(x.state.time,0);await seek(p,12);await select(p,tooth,a);x=await read(p);assert.equal(x.state.time,12);assert.equal(x.courses.find(c=>c.id===b.id).time,12);model.switching={first:a.id,second:b.id,independentPasses:Boolean(b.pass_index===2)};}
     await p.reload();await unprepared(p,'After own preparation reload model '+n);model.preparedReload=true;
     const selectedURL=url+'?canal='+tooth.canals.at(-1).id;
     await p.goto('about:blank');await p.goto(selectedURL);const entry=await unprepared(p,'Model navigation return '+n);assert.equal(entry.state.selectedCanal,tooth.canals.at(-1).id);model.navigationReentry=true;
     if(n===(numbers.includes(7)?7:numbers[0])){await p.goto(url);await unprepared(p,'Lifecycle representative');await lifecycle(p,url,model);}
     assert.deepEqual(errors,[]);model.passed=true;console.log(`ENTRY PASS ${engine} ${view} model ${n}`);
    }catch(e){model.error=e.stack;model.diagnostic=await read(p).catch(()=>null);await p.screenshot({path:path.join(output,`FAILURE-${engine}-${view}-${n}.png`)});throw e;}
   }}finally{await context.close();}
  }));}finally{await browser.close();}
 }
 report.passed=true;
}catch(e){report.error=e.stack;console.error(e);process.exitCode=1;}
finally{if(server)await new Promise(resolve=>server.close(resolve));await fs.writeFile(path.join(output,'AUDIT.json'),JSON.stringify(report,null,2));}
