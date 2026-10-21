// Exercise real mobile controls and drawn states; enabled flags alone missed the
// original bug because Play scrolled the entire canvas out of the viewport.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {chromium,webkit} from 'playwright';

const root=path.resolve(process.env.MOLAR_ROOT||'dist');
const output=path.resolve(process.env.MOLAR_OUTPUT||'output/playwright/molar-mobile');
await fs.mkdir(output,{recursive:true});
const collection=JSON.parse(await fs.readFile(path.join(root,'resources/molar-models/collection.json'),'utf8'));
const numbers=process.env.MOLAR_MODELS?process.env.MOLAR_MODELS.split(',').map(Number):collection.active_model_numbers;
const full=process.env.MOLAR_ALL_COURSES==='1';
const startOnly=process.env.MOLAR_START_ONLY==='1';
const engines=(process.env.MOLAR_ENGINES||'chromium,webkit').split(',');
const width=Number(process.env.MOLAR_WIDTH||390),height=Number(process.env.MOLAR_HEIGHT||844);
let server,base=process.env.MOLAR_BASE_URL;
if(!base){
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png'};
 server=http.createServer(async(req,res)=>{
  try{
   let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
   if(!file.startsWith(root+path.sep))throw Error('Outside build');
   if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(await fs.readFile(file));
  }catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;
}
const result={base,viewport:{width,height},full,models:[],courses:0,stages:0,passed:false};
async function read(page){
 return page.evaluate(()=>{
  const stage=document.querySelector('#stage'),canvas=stage.querySelector('canvas'),gl=canvas.getContext('webgl2');
  const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
  const play=document.querySelector('#mobile-play'),r=play.getBoundingClientRect();
  return {state:JSON.parse(stage.dataset.preparation),drawn:JSON.parse(stage.dataset.drawnPreparation),stage:rect(stage),play:rect(play),playLabel:play.textContent,
   hitPlay:play.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)),viewport:{width:innerWidth,height:innerHeight},
   overflow:document.documentElement.scrollWidth>innerWidth,contextLost:gl.isContextLost(),glError:gl.getError()};
 });
}
function visible(x,label){
 const v=x.viewport;
 assert.ok(x.stage.top>=-2&&x.stage.bottom<=v.height+2,label+': canvas is off screen '+JSON.stringify(x.stage));
 assert.ok(x.play.top>=-2&&x.play.bottom<=v.height+2&&x.hitPlay,label+': Play is off screen or covered');
 assert.ok(!x.overflow&&!x.contextLost,label+': overflow/context lost');assert.equal(x.glError,0,label+': WebGL error');
 assert.ok(x.state.fileShown&&x.state.toothOutlineShown,label+': file/outline missing');
 assert.ok(x.state.preparedWallsEnabled&&x.state.removedDentineEnabled,label+': layer disabled');
 assert.deepEqual(x.state.errors,[]);
}
async function drawn(p,match){
 try{await p.waitForFunction(match=>{const raw=document.querySelector('#stage').dataset.drawnPreparation;if(!raw)return false;const x=JSON.parse(raw);return Object.entries(match).every(([k,v])=>x[k]===v);},match,{timeout:90000});}
 catch(e){
  const diagnostic=await p.evaluate(()=>({state:document.querySelector('#stage').dataset.preparation,drawn:document.querySelector('#stage').dataset.drawnPreparation,error:document.querySelector('#error').textContent,loading:document.querySelector('#asset-status').textContent,timeline:document.querySelector('#mobile-timeline').value}));
  await fs.writeFile(path.join(output,'FAILURE.json'),JSON.stringify({wanted:match,...diagnostic},null,2));
  await p.screenshot({path:path.join(output,'FAILURE.png')});throw e;
 }
}
try{
 for(const engineName of engines){
  const browser=await ({chromium,webkit}[engineName]).launch({headless:true,...(engineName==='chromium'?{args:['--enable-unsafe-swiftshader']}: {})});
  try{
   for(const n of numbers){
    const tooth=JSON.parse(await fs.readFile(path.join(root,`resources/molar-models/tooth-prep-${n}/tooth.json`),'utf8'));
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];
    const lag=Number(process.env.MOLAR_RAF_LAG_MS||0);
    if(lag)await page.addInitScript(lag=>{const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=callback=>raf(time=>callback(time-lag));},lag);
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/resources/molar-models/tooth-prep-${n}/?proof=1`);await drawn(page,{time:0});
    const initial=await read(page);visible(initial,`Model${n} opening`);assert.equal(initial.state.total,0);
    const groups=[...new Set(tooth.canals.map(c=>c.anatomical_canal_id||c.id))],courses=full?tooth.canals:[tooth.canals[0]];
    const model={engine:engineName,model:n,courses:[],openingVisible:true};result.models.push(model);let previous=0;
    for(const c of courses){
     await page.locator('#canals button').nth(groups.indexOf(c.anatomical_canal_id||c.id)).tap();
     if(c.pass_index>1)await page.locator('#passes button').nth(c.pass_index-1).tap();
     await drawn(page,{canal:c.id});visible(await read(page),`Model${n} course${c.id} selection`);
     const start=await read(page);assert.equal(start.state.time,0);
     await page.locator('#mobile-play').tap();
     await page.waitForFunction(()=>document.querySelector('#mobile-play').textContent==='Pause');
     await page.waitForFunction(()=>JSON.parse(document.querySelector('#stage').dataset.drawnPreparation).time>=1.5,undefined,{timeout:90000});
     await page.locator('#mobile-play').tap();await page.waitForFunction(()=>document.querySelector('#mobile-play').textContent==='Play');
     const begun=await read(page);visible(begun,`Model${n} course${c.id} first Play from zero`);assert.equal(begun.state.selectedCanal,c.id);
     assert.ok(begun.state.visiblePreparedCourses.includes(c.id));assert.ok(begun.state.visibleRemovalMeshes>0);
     const stages=startOnly?[]:full?c.sequence.map((_,j)=>j):[0,1].filter(j=>j<c.sequence.length),checked=[];
     for(const j of stages){
      const time=j*16+4;
      let playedTo=null,playedFile=null;
      if(!full||process.env.MOLAR_PLAY_EVERY_STAGE==='1'){
       await page.locator('#mobile-timeline').evaluate((el,time)=>{el.value=time;el.dispatchEvent(new Event('input',{bubbles:true}));},time);
       await drawn(page,{canal:c.id,time});
       await page.locator('#mobile-play').tap();
       await page.waitForFunction(()=>document.querySelector('#mobile-play').textContent==='Pause');
       await page.waitForFunction(time=>JSON.parse(document.querySelector('#stage').dataset.drawnPreparation).time>=time,time+2,{timeout:90000});
       if(await page.locator('#mobile-play').innerText()==='Pause'){
        await page.locator('#mobile-play').tap();
        // Chromium may deliver the compatibility click after touchend returns.
        await page.waitForFunction(()=>document.querySelector('#mobile-play').textContent==='Play');
       }
       const x=await read(page);visible(x,`Model${n} course${c.id} file${c.sequence[j]} playback`);
       assert.equal(x.state.selectedCanal,c.id);assert.ok(c.sequence.indexOf(x.state.file)>=j);playedTo=x.state.time;playedFile=x.state.file;
       assert.match(await page.locator('#mobile-file-name').innerText(),new RegExp(x.state.file+'/'));
       assert.ok(x.state.visiblePreparedCourses.includes(c.id));assert.ok(x.state.visibleRemovalMeshes>0);
      }
      const end=j*16+12;
      await page.locator('#mobile-timeline').evaluate((el,time)=>{el.value=time;el.dispatchEvent(new Event('input',{bubbles:true}));},end);
      await drawn(page,{canal:c.id,time:end});
      const endpoint=await read(page);visible(endpoint,`Model${n} course${c.id} file${c.sequence[j]} endpoint`);
      assert.ok(endpoint.state.total>=previous-1e-8,'Cumulative removal regressed');previous=endpoint.state.total;
      assert.equal(await page.locator('#mobile-file-sequence button').nth(j).getAttribute('aria-current'),'step');
      assert.match(await page.locator('#mobile-file-name').innerText(),new RegExp(c.sequence[j]+'/'));
      checked.push({file:c.sequence[j],playedTo,playedFile,time:endpoint.state.time,volume:endpoint.state.total,preparedCourses:endpoint.state.visiblePreparedCourses,removedMeshes:endpoint.state.visibleRemovalMeshes});
      result.stages++;
     }
     if(full&&!startOnly){
      await page.locator('#complete-canal').tap();await drawn(page,{time:c.duration_seconds});
      const x=await read(page);visible(x,`Model${n} course${c.id} withdrawal`);assert.ok(x.state.visiblePreparedCourses.includes(c.id));assert.equal(x.state.total,previous);
     }
     await page.screenshot({path:path.join(output,`${engineName}-model-${n}-course-${c.id}.png`)});
     model.courses.push({id:c.id,startedUnprepared:true,playedFromZeroTo:begun.state.time,stages:checked});result.courses++;
    }
    assert.deepEqual(errors,[]);model.passed=true;console.log(`MOBILE PASS ${engineName} model ${n}: ${courses.length} courses`);
    await context.close();
   }
  }finally{await browser.close();}
 }
 if(full&&numbers.length===collection.counts.teeth){
  assert.equal(result.courses,collection.counts.preparation_courses*engines.length);
  assert.equal(result.stages,startOnly?0:collection.counts.active_file_stages*engines.length);
 }
 result.passed=true;
}catch(e){result.error=e.stack;console.error(e);process.exitCode=1;}
finally{if(server)await new Promise(resolve=>server.close(resolve));await fs.writeFile(path.join(output,'AUDIT.json'),JSON.stringify(result,null,2));}
