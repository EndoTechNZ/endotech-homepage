// Audit rendered pulp and file-specific preparation pixels, including a GPU
// without optional 32-bit float filtering. Phone viewports alone miss that case.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';

const root=path.resolve(process.env.MOLAR_ROOT||'dist'),out=path.resolve(process.env.MOLAR_RENDER_OUTPUT||'output/playwright/molar-rendering');
await fs.mkdir(out,{recursive:true});
const collection=JSON.parse(await fs.readFile(path.join(root,'resources/molar-models/collection.json'),'utf8'));
const numbers=process.env.MOLAR_RENDER_MODELS?process.env.MOLAR_RENDER_MODELS.split(',').map(Number):collection.active_model_numbers;
const full=process.env.MOLAR_ALL_COURSES==='1',engines=(process.env.MOLAR_ENGINES||'chromium,webkit').split(',');
const profiles=(process.env.MOLAR_RENDER_PROFILES||'native,limited').split(',');
let server,base=process.env.MOLAR_BASE_URL;
if(!base){
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg'};
 server=http.createServer(async(req,res)=>{try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep))throw Error('Outside build');
  if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});res.end(await fs.readFile(f));
 }catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
}
const report={base,full,physicalDevices:false,captureMode:process.env.MOLAR_RENDER_CAPTURES||'all',models:[],courses:0,stages:0,loadRetries:[],passed:false};
async function drawn(p,match){
 for(let attempt=0;attempt<3;attempt++){
  await p.waitForFunction(m=>{
   const d=document.querySelector('#stage').dataset.drawnPreparation,x=d?JSON.parse(d):null;
   return (x&&Object.entries(m).every(([k,v])=>k==='minTime'?x.time>=v:x[k]===v))||document.querySelector('#mobile-load-status button')||document.querySelector('#loading button');
  },match,{timeout:90000});
  const complete=await p.evaluate(m=>{const d=document.querySelector('#stage').dataset.drawnPreparation,x=d?JSON.parse(d):null;return x&&Object.entries(m).every(([k,v])=>k==='minTime'?x.time>=v:x[k]===v);},match);
  if(complete)return;
  if(attempt===2)throw Error('Model data failed after two visible retries');
  const before=await p.evaluate(()=>document.querySelector('#stage').dataset.preparation);
  if(before){const x=JSON.parse(before);assert.ok(x.fileShown&&x.toothOutlineShown);assert.ok((await pixels(p)).pulp>100);}
  report.loadRetries.push({url:p.url(),expected:match,attempt:attempt+1,viewPreserved:Boolean(before)});
  const retry=p.locator('#mobile-load-status button');if(await retry.count())await retry.tap();else await p.locator('#loading button').tap();
 }
}
async function pixels(p){return p.evaluate(()=>{
 const {camera,canals,point,selected,renderer}=window.__readMolarAudit(),c=canals[selected],canvas=renderer.domElement,w=canvas.width,h=canvas.height;
 const image=document.createElement('canvas');image.width=w;image.height=h;const ctx=image.getContext('2d');ctx.drawImage(canvas,0,0);const rgba=ctx.getImageData(0,0,w,h).data;
 const mask=document.createElement('canvas');mask.width=w;mask.height=h;const pen=mask.getContext('2d'),v=camera.position.clone();pen.strokeStyle='#fff';pen.lineWidth=16;pen.beginPath();
 c.positive.forEach((s,i)=>{v.set(...point(c,s)).project(camera);const x=(v.x+1)*w/2,y=(1-v.y)*h/2;if(i===0)pen.moveTo(x,y);else pen.lineTo(x,y);});pen.stroke();const near=pen.getImageData(0,0,w,h).data;
 const counts={pale:0,yellow:0,red:0,blue:0,green:0};let pulp=0;
 // Exclude the overview (which also contains coloured file bands) and all UI.
 const edge=w*(1-Math.min(150,canvas.clientWidth*.22)/canvas.clientWidth)-18;
 for(let y=35;y<h-25;y++)for(let x=0;x<edge;x++){
  const i=(y*w+x)*4,r=rgba[i],g=rgba[i+1],b=rgba[i+2];
  if(r>65&&r>g*1.3&&r>b*1.3&&g/r>.5&&g/r<.78)pulp++;
  if(!near[i+3])continue;
  if(r>130&&g/r>.77&&g/r<1.1&&b/r>.5&&b/r<.87)counts.pale++;
  if(r>120&&g/r>.64&&g/r<1.1&&b/Math.min(r,g)<.55)counts.yellow++;
  if(r>90&&g/r<.5&&b/r>.2&&b/r<.6)counts.red++;
  if(b>80&&b>r*1.25&&b>g*1.1)counts.blue++;
  if(g>70&&g>r*1.2&&g>b*1.05&&b/g>.4)counts.green++;
 }
 const gl=canvas.getContext('webgl2');return {pulp,counts,glError:gl.getError(),contextLost:gl.isContextLost(),state:JSON.parse(document.querySelector('#stage').dataset.preparation)};
});}
try{
 for(const engine of engines){
  const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium'?{args:process.env.MOLAR_RENDER_GPU==='hardware'?['--use-angle=d3d11']:['--enable-unsafe-swiftshader']}: {})});
  try{for(const profile of profiles)for(const number of numbers){
   const tooth=JSON.parse(await fs.readFile(path.join(root,`resources/molar-models/tooth-prep-${number}/tooth.json`),'utf8'));
   const context=await browser.newContext({viewport:engine==='chromium'?{width:360,height:780}:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}),p=await context.newPage(),errors=[],warnings=[],network=[];
   p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(/Unable to use linear filtering|VALIDATE_STATUS|Shader Error|GL_INVALID|out of memory/i.test(m.text()))errors.push(m.text());});
   p.on('console',m=>{if(['warning','error'].includes(m.type())&&!/GPU stall/.test(m.text()))warnings.push(m.text());});p.on('response',r=>{if(r.status()>=400)network.push({url:r.url(),status:r.status()});});p.on('requestfailed',r=>network.push({url:r.url(),error:r.failure()}));
   if(profile==='limited')await p.addInitScript(()=>{
    const proto=WebGL2RenderingContext.prototype,get=proto.getExtension,storage=proto.texStorage3D;
    proto.getExtension=function(n){return n==='OES_texture_float_linear'?null:get.call(this,n);};
    // Failure injection: unsupported float+linear is an incomplete texture.
    // The desktop GPU still supports it, so hiding getExtension alone is weak.
    proto.texStorage3D=function(target,levels,format,...rest){const r=storage.call(this,target,levels,format,...rest);if(format===this.RGBA32F&&this.getTexParameter(target,this.TEXTURE_MAG_FILTER)===this.LINEAR)this.texParameteri(target,this.TEXTURE_BASE_LEVEL,levels);return r;};
   });
   // Read camera and current course for the pixel mask; do not alter rendering.
   await p.route('**/full-preparation.js*',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text())+'\nwindow.__readMolarAudit=()=>({camera,canals,selected,point,renderer});'});});
   try{
    await p.goto(`${base}/resources/molar-models/tooth-prep-${number}/`);await drawn(p,{time:0});
    const opening=await pixels(p);assert.ok(opening.pulp>250,'Pulp/canal pixels absent at opening');assert.equal(opening.state.total,0);
    assert.equal(opening.state.graphicsProfile.fieldSampling,opening.state.graphicsProfile.floatLinearFiltering?'hardware-trilinear':'shader-trilinear');
    if(profile==='limited')assert.equal(opening.state.graphicsProfile.floatLinearFiltering,false);
    const gpu=await p.evaluate(()=>{const gl=document.querySelector('#stage canvas').getContext('webgl2'),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):'unavailable';});
    const model={engine,profile,gpu,model:number,openingPulpPixels:opening.pulp,courses:[]};report.models.push(model);
    await p.locator('#stage canvas').screenshot({path:path.join(out,`${engine}-${profile}-${number}-opening.png`)});
    const groups=[...new Set(tooth.canals.map(c=>c.anatomical_canal_id||c.id))];
    for(const c of full?tooth.canals:[tooth.canals[0]]){
     await p.locator('#canals button').nth(groups.indexOf(c.anatomical_canal_id||c.id)).tap();if(c.pass_index>1)await p.locator('#passes button').nth(c.pass_index-1).tap();await drawn(p,{canal:c.id});
     await p.locator('#mobile-play').tap();await drawn(p,{canal:c.id,minTime:1.5});
     if(await p.locator('#mobile-play').innerText()==='Pause'){await p.locator('#mobile-play').tap();await p.waitForFunction(()=>document.querySelector('#mobile-play').textContent==='Play');}
     const course={id:c.id,stages:[]};model.courses.push(course);report.courses++;
     for(let j=0;j<c.sequence.length;j++){
      const time=j*16+12;await p.locator('#mobile-timeline').evaluate((e,t)=>{e.value=t;e.dispatchEvent(new Event('input',{bubbles:true}));},time);await drawn(p,{canal:c.id,time});
      let frame=await pixels(p);const colour=({'17':'pale','20':'yellow','25':'red','30':'blue','35':'green'})[c.sequence[j]];
      let closeup=false;
      if(!frame.counts[colour]){await p.locator('#refit').tap();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));frame=await pixels(p);closeup=true;}
      const added=await p.locator('#extra').innerText();
      assert.ok(frame.counts[colour]>0||added==='0',`Missing ${colour} preparation pixels: model ${number} course ${c.id} file ${c.sequence[j]}, added ${added}`);
      assert.ok(frame.state.fileShown&&frame.state.toothOutlineShown&&frame.state.preparedWallsEnabled&&frame.state.removedDentineEnabled);
      assert.equal(frame.glError,0);assert.equal(frame.contextLost,false);assert.deepEqual(errors,[]);
      course.stages.push({file:c.sequence[j],colour,pixels:frame.counts[colour],allColours:frame.counts,added,closeup,total:frame.state.total});report.stages++;
      if(report.captureMode!=='summary'||c===tooth.canals[0]||j===c.sequence.length-1||frame.counts[colour]<20)await p.locator('#stage canvas').screenshot({path:path.join(out,`${engine}-${profile}-${number}-${c.id}-${c.sequence[j]}.png`)});
     }
    }
    // Every page entry starts unprepared, even after this lesson was prepared.
    const before=await pixels(p),restoreURL=new URL(p.url());restoreURL.searchParams.set('canal',before.state.selectedCanal);
    await p.goto(restoreURL.href);await drawn(p,{canal:before.state.selectedCanal,time:0});const after=await pixels(p);assert.ok(after.pulp>100);assert.equal(after.state.total,0);assert.ok(after.state.canals.every(c=>c.time===0));assert.equal(after.state.visibleRemovalMeshes,0);assert.deepEqual(after.state.visiblePreparedCourses,[]);assert.deepEqual(errors,[]);model.reopenedUnprepared=true;
    console.log(`RENDER PASS ${engine} ${profile} model ${number}: ${model.courses.length} courses`);
   }catch(e){await p.screenshot({path:path.join(out,`FAILURE-${engine}-${profile}-${number}.png`)});await fs.writeFile(path.join(out,`FAILURE-${engine}-${profile}-${number}.json`),JSON.stringify({error:e.stack,warnings,network,diagnostic:await p.evaluate(()=>({state:document.querySelector('#stage').dataset.preparation,drawn:document.querySelector('#stage').dataset.drawnPreparation,error:document.querySelector('#error').textContent,load:document.querySelector('#mobile-load-status').textContent}))},null,2));throw e;}
   finally{await context.close();}
  }}finally{await browser.close();}
 }
 if(full&&numbers.length===collection.counts.teeth){assert.equal(report.courses,collection.counts.preparation_courses*engines.length*profiles.length);assert.equal(report.stages,collection.counts.active_file_stages*engines.length*profiles.length);}
 report.passed=true;
}catch(e){report.error=e.stack;console.error(e);process.exitCode=1;}
finally{if(server)await new Promise(r=>server.close(r));await fs.writeFile(path.join(out,'AUDIT.json'),JSON.stringify(report,null,2));}
