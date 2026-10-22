// A camera orbit must not change the pigment at a particular prepared surface.
// Check identical-camera draw-order permutations, then independently identify
// exposed stock with CPU triangle raycasts and the actual first-touch fields.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';

const root=path.resolve(process.env.MOLAR_ROOT||'dist');
const out=path.resolve(process.env.MOLAR_ROTATION_OUTPUT||'output/playwright/molar-rotation');
const captures=path.resolve(process.env.MOLAR_ROTATION_CAPTURES||out);
const full=process.env.MOLAR_ROTATION_FULL==='1';
const numbers=(process.env.MOLAR_ROTATION_MODELS||'1,7,9').split(',').map(Number);
const engines=(process.env.MOLAR_ROTATION_ENGINES||'chromium,webkit').split(',');
const profiles=(process.env.MOLAR_ROTATION_PROFILES||'native,limited').split(',');
const layers=(process.env.MOLAR_ROTATION_LAYERS||'both,stock').split(',');
const step=Number(process.env.MOLAR_ROTATION_STEP||30);
const probeCount=Number(process.env.MOLAR_ROTATION_PROBES||40);
const requireStencil=!process.env.MOLAR_ROTATION_RUNTIME_FILE||process.env.MOLAR_ROTATION_REQUIRE_STENCIL==='1';
const report={full,physicalDevices:false,requireStencil,method:'fixed-camera draw-order permutations plus CPU-clipped nearest stock ownership',cases:[],passed:false};
await fs.mkdir(out,{recursive:true});await fs.mkdir(captures,{recursive:true});
let server,base=process.env.MOLAR_BASE_URL;
if(!base){
 const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'};
 server=http.createServer(async(req,res)=>{try{let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep))throw Error();if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});res.end(await fs.readFile(f));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
}
async function drawn(p,match){await p.waitForFunction(m=>{const raw=document.querySelector('#stage').dataset.drawnPreparation;if(!raw)return false;const d=JSON.parse(raw);return Object.entries(m).every(([k,v])=>d[k]===v);},match,{timeout:90000});}
async function select(p,c,tooth){
 const groups=[...new Set(tooth.canals.map(d=>d.anatomical_canal_id||d.id))];
 await p.locator('#canals button').nth(groups.indexOf(c.anatomical_canal_id||c.id)).evaluate(e=>e.click());
 if(c.pass_index>1)await p.locator('#passes button').nth(c.pass_index-1).evaluate(e=>e.click());
 await drawn(p,{canal:c.id});
}
async function seek(p,id,time){await p.locator('#timeline').evaluate((e,t)=>{e.value=t;e.dispatchEvent(new Event('input',{bubbles:true}));},time);await drawn(p,{canal:id,time});}
function chooseCourses(tooth){if(full)return tooth.canals;if(tooth.number===7)return tooth.canals.filter(c=>c.pass_index);if(tooth.number===9)return tooth.canals.filter(c=>c.sidecut_motion);return tooth.canals.slice(0,1);}

// Executed inside the viewer. The hook exposes read-only objects; only the audit
// camera and draw-order perturbation are changed, never preparation or geometry.
function orbitCheck({angle,baseline,probeCount}){
 const {camera,controls,canals,point,state,profile,sample,renderer,files,drawFrame,nativeWall,THREE}=window.__rotationAudit();
 const selected=JSON.parse(document.querySelector('#stage').dataset.preparation).selectedCanal;
 const c=canals.find(d=>d.id===selected),st=state(c),canvas=renderer.domElement,w=canvas.width,h=canvas.height;
 controls.enabled=false;controls.enableDamping=false;
 if(baseline)window.__rotationStart=camera.position.clone().sub(controls.target);
 camera.position.copy(controls.target).add(window.__rotationStart.clone().applyAxisAngle(camera.up.clone().normalize(),angle*Math.PI/180));camera.lookAt(controls.target);camera.updateMatrixWorld();
 const meshes=[];for(const d of canals)for(let j=0;j<d.stocks.length;j++){const ob=d.stocks[j];if(ob?.visible)meshes.push({ob,c:d,j,order:ob.renderOrder});}
 const palette=['17','20','25','30','35'];
 function cut(d,p,bias){const visits=state(d).visits;if(Math.max(...visits)<=0)return false;const q=p.toArray();if(q.some((v,k)=>v<d.texture_origin_mm[k]||v>d.texture_origin_mm[k]+(d.texture_shape[k]-1)*d.texture_step_mm))return false;for(let j=0;j<5;j++)if(sample(j<4?d.ft0:d.ft1,d.texture_shape,d.texture_origin_mm,d.texture_step_mm,q,j<4?j:0)<=visits[j]-bias)return true;return false;}
 const a=new THREE.Vector3(),b=new THREE.Vector3(),d=new THREE.Vector3(),bary=new THREE.Vector3();
 function firstTouch(hit,ob){
  const g=ob.geometry,positions=g.attributes.position,touch=g.attributes.firstTouch,face=hit.face;
  a.fromBufferAttribute(positions,face.a);b.fromBufferAttribute(positions,face.b);d.fromBufferAttribute(positions,face.c);
  const local=ob.worldToLocal(hit.point.clone());THREE.Triangle.getBarycoord(local,a,b,d,bary);
  return touch.getX(face.a)*bary.x+touch.getX(face.b)*bary.y+touch.getX(face.c)*bary.z;
 }
 function valid(hit,m){
  const first=firstTouch(hit,m.ob);
  const visits=state(m.c).visits;if(first>visits[m.j]+.015)return false;
  // Reference current union boundary, not closed historical increment shells:
  // an old face inside a later visited cutter is no longer an exposed surface.
  for(let j=m.j+1;j<m.c.sequence.length;j++)if(visits[j]>=0&&sample(j<4?m.c.ft0:m.c.ft1,m.c.texture_shape,m.c.texture_origin_mm,m.c.texture_step_mm,hit.point.toArray(),j<4?j:0)<=visits[j]-.004)return false;
  return !canals.some(other=>other!==m.c&&cut(other,hit.point,.018));
 }
 const map=new Map(meshes.map(m=>[m.ob,m])),ray=new THREE.Raycaster();
 const opaque=[];
 if(nativeWall.visible&&!nativeWall.material.transparent)opaque.push({ob:nativeWall,kind:'native'});
 for(const q of canals){if(q.tube.visible)opaque.push({ob:q.tube,c:q,kind:'tube'});if(q.sidecutWall?.visible)opaque.push({ob:q.sidecutWall,c:q,kind:'sidecut'});}
 const opaqueMap=new Map(opaque.map(m=>[m.ob,m]));
 function validOpaque(hit,m){
  if(m.kind==='native')return !canals.some(q=>cut(q,hit.point,.004));
  const q=m.c,p=hit.point.toArray();if(sample(q.ft1,q.texture_shape,q.texture_origin_mm,q.texture_step_mm,p,1)<.001)return false;
  if(m.kind==='sidecut'){
   const visits=state(q).visits;if(firstTouch(hit,m.ob)>visits[0]+.015)return false;
   for(let j=1;j<q.sequence.length;j++)if(sample(j<4?q.ft0:q.ft1,q.texture_shape,q.texture_origin_mm,q.texture_step_mm,p,j<4?j:0)<=visits[j]-.025)return false;
  }
  return !canals.some(other=>other!==q&&cut(other,hit.point,.018));
 }
 // Audit-only spatial chunks bound CPU raycasting cost. They share immutable
 // stock attributes and retain original vertex indices, but are never rendered
 // or added to the scene. Shader clipping and ownership still use original data.
 window.__rotationChunks ||= new WeakMap();
 const rayObjects=[],sourceForChunk=new Map();
 for(const {ob} of [...meshes,...opaque]){
  const cached=window.__rotationChunks.get(ob);let chunks=cached?.version===ob.geometry.attributes.position.version?cached.chunks:null;
  if(!chunks){
   const original=ob.geometry,positions=original.attributes.position,index=original.index;
   const bounds=new THREE.Box3();for(let v=0;v<positions.count;v++)bounds.expandByPoint(a.fromBufferAttribute(positions,v));
   const extent=bounds.getSize(new THREE.Vector3()),axis=extent.x>=extent.y&&extent.x>=extent.z?0:extent.y>=extent.z?1:2;
   const faces=Array.from({length:index.count/3},(_,f)=>({face:f,station:(positions.getComponent(index.getX(f*3),axis)+positions.getComponent(index.getX(f*3+1),axis)+positions.getComponent(index.getX(f*3+2),axis))/3}));
   faces.sort((a,b)=>a.station-b.station||a.face-b.face);chunks=[];
   for(let start=0;start<faces.length;start+=256){
    const count=Math.min(256,faces.length-start),subset=new Uint32Array(count*3),box=new THREE.Box3();
    for(let f=0;f<count;f++)for(let k=0;k<3;k++){const vertex=index.getX(faces[start+f].face*3+k);subset[f*3+k]=vertex;box.expandByPoint(a.fromBufferAttribute(positions,vertex));}
    const geometry=new THREE.BufferGeometry();for(const [name,attribute] of Object.entries(original.attributes))geometry.setAttribute(name,attribute);geometry.setIndex(new THREE.BufferAttribute(subset,1));
    const centre=box.getCenter(new THREE.Vector3());let radiusSquared=0;for(const vertex of subset)radiusSquared=Math.max(radiusSquared,a.fromBufferAttribute(positions,vertex).distanceToSquared(centre));
    geometry.boundingBox=box;geometry.boundingSphere=new THREE.Sphere(centre,Math.sqrt(radiusSquared));
    const chunk=new THREE.Mesh(geometry,ob.material);chunk.matrixAutoUpdate=false;chunks.push(chunk);
   }
   window.__rotationChunks.set(ob,{version:positions.version,chunks});
  }
  for(const chunk of chunks){chunk.matrixWorld.copy(ob.matrixWorld);rayObjects.push(chunk);sourceForChunk.set(chunk,ob);}
 }
 // Retain actual triangle landmarks between views. Choose outer envelope faces
 // across the canal; their identity never changes with the camera or sorting.
 if(baseline){
  const ob=c.stocks[st.j],g=ob.geometry,pos=g.attributes.position,index=g.index,choices=[];
  const routes=c.positive.map(s=>({s,C:new THREE.Vector3(...point(c,s))}));
  const stride=Math.max(1,Math.floor(index.count/3/1200));
  for(let f=0;f<index.count/3;f+=stride){
   const ia=index.getX(f*3),ib=index.getX(f*3+1),ic=index.getX(f*3+2);
   a.fromBufferAttribute(pos,ia);b.fromBufferAttribute(pos,ib);d.fromBufferAttribute(pos,ic);
   const centre=a.clone().add(b).add(d).multiplyScalar(1/3),normal=b.clone().sub(a).cross(d.clone().sub(a)).normalize();
   let nearest=routes[0],distance=Infinity;for(const r of routes){const dd=centre.distanceToSquared(r.C);if(dd<distance){nearest=r;distance=dd;}}
   const radial=centre.clone().sub(nearest.C),radius=profile(st.j,st.visits[st.j]-nearest.s);
   if(radius<=0||Math.abs(radial.length()-radius)>.045||normal.dot(radial.clone().normalize())<.4)continue;
   if(nearest.s<c.length_mm*.12||nearest.s>c.length_mm*.9)continue;
   choices.push({point:centre.toArray(),face:f,station:nearest.s});
  }
  choices.sort((a,b)=>a.station-b.station);
  const landmarks=[];for(let i=0;i<probeCount&&choices.length;i++)landmarks.push(choices[Math.min(choices.length-1,Math.floor((i+.5)*choices.length/probeCount))]);
  window.__rotationLandmarks=landmarks;
 }
 const image=document.createElement('canvas');image.width=w;image.height=h;const ctx=image.getContext('2d');
 const frame=()=>{drawFrame();ctx.clearRect(0,0,w,h);ctx.drawImage(canvas,0,0);return ctx.getImageData(0,0,w,h).data;};
 // Perturb only stock-to-stock ordering. Keep every stock pigment after its
 // depth prepass (1) and before the tooth outline (4), as in the real viewer.
 for(const m of meshes)m.ob.renderOrder=2+m.j*.01;const older=frame();
 for(const m of meshes)m.ob.renderOrder=2-m.j*.01;const newer=frame();
 for(const m of meshes)m.ob.renderOrder=m.order;const actual=frame();
 const right=w*(1-Math.min(150,canvas.clientWidth*.22,Math.max(40,(canvas.clientHeight-100)*.52))/canvas.clientWidth)-18;
 const probes=[],ownerCounts={},nearTieEpsilon=.0001,guideSegments=[];let guideOcclusions=0,opaqueOcclusions=0;
 if(document.querySelector('#path-guides')?.checked&&c.pass_index){
  for(const guide of canals.filter(d=>d.id===17||d.id===47)){let previous;
   for(let k=0;k<guide.route_samples;k++){const s=guide.route_origin_mm+k*guide.route_step_mm;if(s< -9)continue;const projected=new THREE.Vector3(...point(guide,s)).project(camera),p=[(projected.x+1)*w/2,(1-projected.y)*h/2];if(previous)guideSegments.push([previous,p]);previous=p;}
  }
 }
 function nearGuide(x,y){return guideSegments.some(([a,b])=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)<3.5;});}
 const exposureCache=new Map();
 function exposedAt(x,y){
  const key=y*w+x;if(exposureCache.has(key))return exposureCache.get(key);
  ray.setFromCamera(new THREE.Vector2((x+.5)*2/w-1,1-(y+.5)*2/h),camera);
  const hits=ray.intersectObjects(rayObjects,false).map(hit=>({...hit,object:sourceForChunk.get(hit.object)})).filter(hit=>map.has(hit.object)?valid(hit,map.get(hit.object)):validOpaque(hit,opaqueMap.get(hit.object)));
  const stockHits=hits.filter(hit=>map.has(hit.object)),hit=stockHits[0];if(!hit){exposureCache.set(key,null);return null;}
  const occluder=hits.find(hit=>opaqueMap.has(hit.object));
  if(occluder&&occluder.distance<hit.distance-nearTieEpsilon){opaqueOcclusions++;exposureCache.set(key,null);return null;}
  if(stockHits.some(other=>other.object!==hit.object&&Math.abs(other.distance-hit.distance)<nearTieEpsilon)){exposureCache.set(key,null);return null;}
  const next=stockHits.find(other=>other.object!==hit.object),depthGap=next?Math.abs(next.point.clone().project(camera).z-hit.point.clone().project(camera).z)*.5:null;
  const value={hit,owner:map.get(hit.object),nextDistanceGap:next?next.distance-hit.distance:null,nextDepthGap:depthGap};exposureCache.set(key,value);return value;
 }
 for(const landmark of window.__rotationLandmarks){
  const world=new THREE.Vector3(...landmark.point),ndc=world.clone().project(camera),x=Math.round((ndc.x+1)*w/2),y=Math.round((1-ndc.y)*h/2);
  if(x<3||x>=right-3||y<38||y>=h-28||ndc.z<-1||ndc.z>1)continue;
  if(nearGuide(x,y)){guideOcclusions++;continue;}
  const exposed=exposedAt(x,y);if(!exposed)continue;const {hit,owner}=exposed;
  // The same landmark is tested only while it is the actual exposed stock face.
  if(owner.c!==c||owner.j!==st.j||hit.point.distanceTo(world)>.035)continue;
  // Require the entire pixel kernel to belong to this file/course. Thin edges,
  // coincident interfaces and adjacent genuine earlier-file regions are excluded.
  let interior=true;for(let oy=-1;oy<=1&&interior;oy++)for(let ox=-1;ox<=1;ox++){const around=exposedAt(x+ox,y+oy);if(!around||around.owner.c!==c||around.owner.j!==st.j){interior=false;break;}}
  if(!interior)continue;
  // The real tooth-outline overlay slightly desaturates preparation. Green must
  // remain clearly channel-dominant, but a 20% G/R cutoff rejected a genuine
  // [121,143,113] green only three RGB levels from the perturbed rendering.
  // A 10% margin still rejects yellow (R>G), blue (B>G) and native coral (R>G).
  // Red permits G/R<.6: the outline can desaturate it to [202,101,94],
  // while the source coral has G/R around .64 or more and remains excluded.
  function pigment(data,at){const r=data[at],g=data[at+1],bl=data[at+2];return bl>80&&bl>r*1.25&&bl>g*1.1?'30':g>70&&g>r*1.1&&g>bl*1.05&&bl/g>.4?'35':r>90&&g/r<.6&&bl/r>.2&&bl/r<.6?'25':r>120&&g/r>.64&&g/r<1.1&&bl/Math.min(r,g)<.55?'20':null;}
  const expected=palette[owner.j];let maxDelta=0,kernelStageSwitches=0;
  for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const at=((y+oy)*w+x+ox)*4;for(let q=0;q<3;q++)maxDelta=Math.max(maxDelta,Math.abs(older[at+q]-newer[at+q]));const old=pigment(older,at),next=pigment(newer,at);if(old&&next&&old!==next)kernelStageSwitches++;}
  const at=(y*w+x)*4,colour=[newer[at],newer[at+1],newer[at+2]],oldColour=[older[at],older[at+1],older[at+2]],actualColour=[actual[at],actual[at+1],actual[at+2]],observed=pigment(newer,at),oldObserved=pigment(older,at),actualObserved=pigment(actual,at);
  // Native anatomy or metallic instrument can genuinely occlude a CPU stock
  // intersection. Exclude those unclassified pixels, but keep wrong old colours.
  if(!observed&&!oldObserved)continue;
  ownerCounts[expected]=(ownerCounts[expected]||0)+1;
  const orderInvariant=kernelStageSwitches===0&&observed===oldObserved,colourMatches=observed===expected&&oldObserved===expected&&actualObserved===expected;
  const subpixels=orderInvariant&&colourMatches?undefined:[[-.375,-.375],[.375,-.375],[-.375,.375],[.375,.375],[-.125,-.375],[.375,-.125],[-.375,.125],[.125,.375]].map(([ox,oy])=>{const p=exposedAt(x+ox,y+oy);return {offset:[ox,oy],course:p?.owner.c.id,file:p?palette[p.owner.j]:null,nextDistanceGap:p?.nextDistanceGap,nextDepthGap:p?.nextDepthGap};});
  probes.push({face:landmark.face,world:landmark.point,expected,observed,oldObserved,actualObserved,pixel:[x,y],rgb:colour,oldRgb:oldColour,actualRgb:actualColour,nextDistanceGap:exposed.nextDistanceGap,nextDepthGap:exposed.nextDepthGap,subpixels,maxOrderDelta:maxDelta,kernelStageSwitches,orderInvariant,colourMatches});
 }
 const prep=JSON.parse(document.querySelector('#stage').dataset.preparation);
 let additionalVoxelCount=0;for(const feed of c.stock[st.j]?.feeds||[])if(feed<=st.visits[st.j])additionalVoxelCount++;
 const gl=canvas.getContext('webgl2');
 return {angle,landmarks:window.__rotationLandmarks.length,guideOcclusions,opaqueOcclusions,additionalVoxelCount,ownerCounts,probes,total:prep.total,time:prep.time,visits:prep.canals,stencilBits:gl.getParameter(gl.STENCIL_BITS),depthBits:gl.getParameter(gl.DEPTH_BITS),sampleCount:gl.getParameter(gl.SAMPLES),glError:gl.getError()};
}

try{
 for(const engine of engines){
  const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium'?{args:process.env.MOLAR_RENDER_GPU==='hardware'?['--use-angle=d3d11']:['--enable-unsafe-swiftshader']}: {})});
  try{for(const profile of profiles)for(const number of numbers){
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}),p=await context.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   if(profile==='limited')await p.addInitScript(()=>{const proto=WebGL2RenderingContext.prototype,get=proto.getExtension,storage=proto.texStorage3D;proto.getExtension=function(n){return n==='OES_texture_float_linear'?null:get.call(this,n);};proto.texStorage3D=function(target,levels,format,...rest){const r=storage.call(this,target,levels,format,...rest);if(format===this.RGBA32F&&this.getTexParameter(target,this.TEXTURE_MAG_FILTER)===this.LINEAR)this.texParameteri(target,this.TEXTURE_BASE_LEVEL,levels);return r;};});
   if(process.env.MOLAR_ROTATION_HELPER_FILE)await p.route('**/shared/preparation-surfaces.js*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await fs.readFile(process.env.MOLAR_ROTATION_HELPER_FILE,'utf8')});});
   await p.route('**/full-preparation.js*',async route=>{const response=await route.fetch(),source=process.env.MOLAR_ROTATION_RUNTIME_FILE?await fs.readFile(process.env.MOLAR_ROTATION_RUNTIME_FILE,'utf8'):await response.text();await route.fulfill({response,body:source+'\nwindow.__rotationAudit=()=>({camera,controls,canals,point,state,profile,lookup,sample,renderer,files,drawFrame,nativeWall,THREE});'});});
   try{
    const tooth=JSON.parse(await fs.readFile(path.join(root,`resources/molar-models/tooth-prep-${number}/tooth.json`),'utf8'));
    await p.goto(`${base}/resources/molar-models/tooth-prep-${number}/`);await drawn(p,{time:0});
    for(const c of chooseCourses(tooth)){
     await select(p,c,tooth);
     const stages=number===1&&!full?['30','35'].filter(f=>c.sequence.includes(f)):[c.sequence.at(-1)];
     for(const file of stages){const time=(c.sequence.indexOf(file)+1)*16-.1;await seek(p,c.id,time);
      for(const layer of layers){
       const current=JSON.parse(await p.locator('#stage').getAttribute('data-preparation')).mode;
       if(current!==layer)await p.locator('#walls').evaluate(e=>e.click());
       await drawn(p,{canal:c.id,time,preparedWallsEnabled:layer==='both',removedDentineEnabled:true});
       const row={engine,profile,model:number,course:c.id,file,layer,angles:[]};report.cases.push(row);
       for(let angle=0;angle<360;angle+=step){
        const result=await p.evaluate(orbitCheck,{angle,baseline:angle===0,probeCount});row.angles.push(result);
        assert.equal(result.glError,0);if(requireStencil)assert.ok(result.stencilBits>=8,'Production renderer lacks the eight-bit stock ownership stencil');assert.equal(result.time,time);assert.deepEqual(errors,[]);
        if(angle){assert.equal(result.total,row.angles[0].total);assert.deepEqual(result.visits,row.angles[0].visits);}
        const bad=result.probes.filter(probe=>!probe.orderInvariant||!probe.colourMatches);
        if(bad.length||process.env.MOLAR_ROTATION_ALL_CAPTURES==='1')await p.locator('#stage').screenshot({path:path.join(captures,`${engine}-${profile}-${number}-${c.id}-${file}-${layer}-${angle}.png`)});
        assert.deepEqual(bad,[],`Rotation changed a visible prepared surface: model ${number}, canal ${c.id}, file ${file}, ${layer}, ${angle} degrees`);
       }
       row.probes=row.angles.reduce((sum,a)=>sum+a.probes.length,0);row.noAdditionalContact=row.angles[0].additionalVoxelCount===0;
       assert.ok(row.probes>=3||row.noAdditionalContact,`Insufficient exposed ownership probes: model ${number} course ${c.id} file ${file} ${layer}`);
       console.log(`ROTATION PASS ${engine} ${profile} model ${number} canal ${c.id} file ${file} ${layer}: ${row.probes} exposed probes`);
      }
     }
    }
   }finally{await context.close();}
  }}finally{await browser.close();}
 }
 report.passed=true;
}catch(e){report.error=e.stack;console.error(e);process.exitCode=1;}
finally{if(server)await new Promise(r=>server.close(r));await fs.writeFile(path.join(out,'AUDIT.json'),JSON.stringify(report,null,2));}
