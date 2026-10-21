import {createMobilePlayback} from './shared/mobile-playback.js?v=mobile-playback-20261022-1';
import {decodeDisplayMesh} from './shared/display-mesh.js?v=fast-start-2';
import {decodeBuffer} from './shared/buffers.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const $=s=>document.querySelector(s),stage=$('#stage'),sizes=['17','20','25','30','35'];
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;stage.append(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(31,1,.01,500),overview=new THREE.PerspectiveCamera(25,1,.01,500);camera.up.set(0,0,1);overview.up.copy(camera.up);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xe8eff5,0x39434b,1.7));for(const [i,pos] of [[2,[20,-30,25]],[1.3,[-25,20,10]],[.8,[10,15,-12]]]){const l=new THREE.DirectionalLight(0xffffff,i);l.position.set(...pos);scene.add(l)}
let tooth,files,canals=[],selected=0,playing=false,playRequested=false,mode='both',whole=true,phase=0,order=0,actors=[],activeActor=-1,nativeWall,shell,baseUniforms={},errorLog=[],ready=false,lastUI=0;
// Stephen's standing viewer rule: keep the instrument and tooth outline shown.
const wallsShown=()=>mode==='both'||mode==='walls',removedShown=()=>mode==='both'||mode==='stock';
const layerMode=(walls,removed)=>walls?(removed?'both':'walls'):(removed?'stock':'anatomy');
function keepRequiredVisibility(){for(const id of ['show-file','shell']){const el=$('#'+id);el.checked=true;el.defaultChecked=true;el.disabled=true;el.title='Always shown';}}
keepRequiredVisibility();
window.addEventListener('pageshow',()=>{keepRequiredVisibility();refresh(false);});
const mobilePlayback=createMobilePlayback({stage,onPlay:()=>togglePlayback(),onSeek:time=>setPreparation({time}),onFile:j=>setPreparation({time:j*16})});
const cache={};const volumeFormat=v=>v===0?'0':v<.001?'<0.001':v.toFixed(3);
const libraryRoot=new URL(".",import.meta.url);
const publicURL=url=>url.startsWith("/")?new URL(url.slice(1),libraryRoot).href:url;
// Network work is shared across duplicate geometry references and limited so a
// large file cannot flood the connection with dozens of competing requests.
const requestCache=new Map(),requestQueue=[];
let requestCount=0;
const assetURL=url=>new URL(publicURL(url),location.href).href;
function queuedFetch(url,convert){
 if(requestCache.has(url))return requestCache.get(url);
 const task=new Promise((resolve,reject)=>{
  requestQueue.push(async()=>{
   try{const r=await fetch(url);if(!r.ok)throw Error('Unable to load model data ('+r.status+').');resolve(await convert(r));}
   catch(e){requestCache.delete(url);reject(e);}
  });pumpRequests();
 });
 requestCache.set(url,task);return task;
}
function pumpRequests(){while(requestCount<8&&requestQueue.length){requestCount++;requestQueue.shift()().finally(()=>{requestCount--;pumpRequests();});}}
async function getJSON(url){const target=new URL(assetURL(url));target.searchParams.set('v','fast-start-2');return queuedFetch(target.href,r=>r.json());}
async function getBuffer(url){return queuedFetch(assetURL(url)+'.gz',async r=>decodeBuffer(await r.arrayBuffer()));}
async function geometry(base,name){
 const key=base+name;if(cache[key])return cache[key];
 const promise=(async()=>{
  const d=await getJSON(base+name+'.json'),g=new THREE.BufferGeometry();
  if(d.compact){
   try{
    const data=decodeDisplayMesh(await getBuffer(base+d.compact));
    g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));g.setAttribute('normal',new THREE.BufferAttribute(data.normals,3));g.setIndex(new THREE.BufferAttribute(data.indices,1));g.computeBoundingSphere();return g;
   }catch(e){console.info('Using the original model mesh.',e.message);}
  }
  await Promise.all(['positions','normals','indices',...(d.firstTouch?['firstTouch']:[]),...(d.colors?['colors']:[])].map(async k=>{
   const buf=await getBuffer(base+d[k]),a=k==='indices'?new Uint32Array(buf):k==='colors'?new Float32Array(buf).slice():new Float32Array(buf);
   if(k==='colors')for(let i=0;i<a.length;i++)a[i]=a[i]<=.04045?a[i]/12.92:Math.pow((a[i]+.055)/1.055,2.4);
   if(k==='indices')g.setIndex(new THREE.BufferAttribute(a,1));
   else g.setAttribute(({positions:'position',normals:'normal',firstTouch:'firstTouch',colors:'color'})[k],new THREE.BufferAttribute(a,k==='firstTouch'?1:3));
  }));g.computeBoundingSphere();return g;
 })();cache[key]=promise;try{return await promise;}catch(e){delete cache[key];throw e;}
}
function sample(a,shape,origin,h,p,channel=0,channels=4,linear=true){let q=p.map((v,k)=>(v-origin[k])/h);if(q.some((v,k)=>v<0||v>shape[k]-1))return 1e5;let lo=q.map(Math.floor),f=q.map((v,k)=>v-lo[k]),value=0;if(!linear){let i=q.map(Math.round);return a[((i[0]*shape[1]+i[1])*shape[2]+i[2])*channels+channel]}for(let dx=0;dx<2;dx++)for(let dy=0;dy<2;dy++)for(let dz=0;dz<2;dz++){let i=[Math.min(lo[0]+dx,shape[0]-1),Math.min(lo[1]+dy,shape[1]-1),Math.min(lo[2]+dz,shape[2]-1)];let w=(dx?f[0]:1-f[0])*(dy?f[1]:1-f[1])*(dz?f[2]:1-f[2]);value+=a[((i[0]*shape[1]+i[1])*shape[2]+i[2])*channels+channel]*w}return value}
function lookup(c,p,j){return sample(j<4?c.ft0:c.ft1,c.texture_shape,c.texture_origin_mm,c.texture_step_mm,p,j<4?j:0)}
function nativeVoxel(p){let q=[p[0],p[2]*(tooth.upperOrientation?-1:1),p[1]*(tooth.upperOrientation?-1:1)].map((v,k)=>Math.round(v/.072+(tooth.native_shape[k]-1)/2));if(q.some((v,k)=>v<0||v>=tooth.native_shape[k]))return 0;return tooth.voxels[(q[0]*tooth.native_shape[1]+q[1])*tooth.native_shape[2]+q[2]]}
function profile(j,offset){let f=files[sizes[j]],a=f.offsets,r=f.radius;if(offset<.05||offset>f.active_length_mm)return 0;let lo=0,hi=a.length-1;while(hi-lo>1){let mid=(hi+lo)>>1;if(a[mid]<=offset)lo=mid;else hi=mid}let t=Math.max(0,Math.min(1,(offset-a[lo])/(a[hi]-a[lo])));return r[lo]*(1-t)+r[hi]*t}
function pose(local,L){let keys=[[0,-5],[.5,-5],[1,0],[3,.4*L],[3.75,.4*L-1.5],[5.75,.65*L],[6.5,.65*L-1.5],[8.5,.86*L],[9.25,.86*L-1],[11.5,L],[12.5,L],[14,-5],[16,-5]],feed=-5,visited=0;for(let i=0;i<keys.length-1;i++){if(local>=keys[i][0])visited=Math.max(visited,keys[i][1]);if(local>=keys[i][0]&&local<keys[i+1][0]){let u=(local-keys[i][0])/(keys[i+1][0]-keys[i][0]);u=u*u*(3-2*u);feed=keys[i][1]+(keys[i+1][1]-keys[i][1])*u}}return {feed,visited:Math.max(visited,feed,0)}}
function state(c){let j=Math.min(c.sequence.length-1,Math.floor(Math.min(c.time,c.duration_seconds-.001)/16)),local=c.time-j*16,p=pose(local,c.length_mm);let visits=sizes.map((_,i)=>i>=c.sequence.length?-1e4:i<j?c.length_mm:i===j?p.visited:-1e4);return {j,local,...p,visits}}
function point(c,s,row=0){let ix=Math.max(0,Math.min(c.route_samples-1,(s-c.route_origin_mm)/c.route_step_mm)),i=Math.floor(ix),j=Math.min(i+1,c.route_samples-1),u=ix-i;return [0,1,2].map(k=>c.raw[i*12+row*3+k]*(1-u)+c.raw[j*12+row*3+k]*u)}
function uniformsGLSL(){let code='varying vec3 prepWorld;uniform float prepMode;\n';canals.forEach((c,i)=>{code+=`uniform highp sampler3D texA${i};uniform highp sampler3D texB${i};uniform vec3 origin${i};uniform vec3 dims${i};uniform float spacing${i};uniform vec4 visits${i};uniform float lastVisit${i};uniform float prepOrder${i};\nbool inside${i}(vec3 p){vec3 q=(p-origin${i})/spacing${i};return all(greaterThanEqual(q,vec3(0.)))&&all(lessThanEqual(q,dims${i}-vec3(1.)));}\nvec3 uv${i}(vec3 p){return (((p-origin${i})/spacing${i}).zyx+vec3(.5))/dims${i}.zyx;}\nvec4 dataA${i}(vec3 p){return texture(texA${i},uv${i}(p));}\nvec4 dataB${i}(vec3 p){return texture(texB${i},uv${i}(p));}\nbool cut${i}(vec3 p,float bias){if(!inside${i}(p))return false;vec4 f=dataA${i}(p);return any(lessThanEqual(f,visits${i}-vec4(bias)))||dataB${i}(p).r<=lastVisit${i}-bias;}\n`});return code}
function clippedMaterial(base,fragment,extraUniforms={},extraVertex='',extraHeader=''){base.onBeforeCompile=shader=>{Object.assign(shader.uniforms,baseUniforms,extraUniforms);shader.vertexShader='varying vec3 prepWorld;\n'+extraHeader+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nprepWorld=(modelMatrix*vec4(transformed,1.)).xyz;\n'+extraVertex);shader.fragmentShader=uniformsGLSL()+extraHeader.replace(/attribute[^;]+;/g,'')+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>',fragment+'\n#include <alphatest_fragment>')};base.customProgramCacheKey=()=>fragment;return base}
function tubeMesh(c,ci){const count=c.positive.length,around=64,positions=new Float32Array(count*around*3),colors=new Float32Array(positions.length),indices=[];for(let k=0;k<count-1;k++)for(let j=0;j<around;j++){let a=k*around+j,b=k*around+(j+1)%around,d=(k+1)*around+j,e=(k+1)*around+(j+1)%around;indices.push(a,b,d,b,e,d)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setAttribute('color',new THREE.BufferAttribute(colors,3));g.setIndex(indices);const other=canals.map((_,i)=>i!==ci?`if(cut${i}(prepWorld,.018))discard;`:'').join('');let mat=clippedMaterial(new THREE.MeshPhongMaterial({vertexColors:true,side:THREE.BackSide,shininess:32,specular:0x303030}),`if(dataB${ci}(prepWorld).g<.001)discard;${other}`);const mesh=new THREE.Mesh(g,mat);mesh.frustumCulled=false;scene.add(mesh);return mesh}
function rebuildTube(c){if(c.time<=1){c.tube.visible=false;return;}let st=state(c),p=c.tube.geometry.attributes.position.array,col=c.tube.geometry.attributes.color.array,around=64;for(let k=0;k<c.positive.length;k++){let s=c.positive[k],C=point(c,s,0),N=point(c,s,1),B=point(c,s,2),r=0,winner=0;for(let j=0;j<5;j++){let rr=profile(j,st.visits[j]-s);if(rr>=r&&rr>0){r=rr;winner=j}}let color=new THREE.Color(files[sizes[winner]].color);for(let j=0;j<around;j++){let a=2*Math.PI*j/around,ix=(k*around+j)*3;for(let q=0;q<3;q++)p[ix+q]=C[q]+r*(N[q]*Math.cos(a)+B[q]*Math.sin(a));col[ix]=color.r;col[ix+1]=color.g;col[ix+2]=color.b}}c.tube.geometry.attributes.position.needsUpdate=true;c.tube.geometry.attributes.color.needsUpdate=true;c.tube.geometry.computeVertexNormals();c.tube.visible=wallsShown()&&c.time>1&&(!c.sidecut_motion||st.j>0)}
function fit(cam,bounds,dir,aspect){cam.aspect=aspect;let lo=new THREE.Vector3(...bounds[0]),hi=new THREE.Vector3(...bounds[1]),c=lo.clone().add(hi).multiplyScalar(.5),d=new THREE.Vector3(...dir).normalize();cam.up.set(...(tooth?.presentation_up||[0,0,1]));if(Math.abs(d.z)>.96)cam.up.set(0,-1,0);cam.position.copy(c).add(d);cam.lookAt(c);cam.updateMatrixWorld();let right=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,1),tv=Math.tan(THREE.MathUtils.degToRad(cam.fov/2)),th=tv*aspect,dist=0;for(let x of[lo.x,hi.x])for(let y of[lo.y,hi.y])for(let z of[lo.z,hi.z]){let q=new THREE.Vector3(x,y,z).sub(c),depth=q.dot(d);dist=Math.max(dist,Math.abs(q.dot(right))/th+depth,Math.abs(q.dot(up))/tv+depth)}cam.position.copy(c).addScaledVector(d,dist*1.1);cam.lookAt(c);cam.updateProjectionMatrix();if(cam===camera){controls.target.copy(c);controls.update()}}
function refit(){if(!ready)return;if(reviewActive){applyReview();return;}let c=canals[selected],box=new THREE.Box3();if(whole)box.set(new THREE.Vector3(...tooth.bounds[0]),new THREE.Vector3(...tooth.bounds[1]));else{c.positive.forEach(s=>box.expandByPoint(new THREE.Vector3(...point(c,s))));box.expandByScalar(.9)}fit(camera,[box.min.toArray(),box.max.toArray()],tooth.preferred_view_direction||[.7,-.7,.12],stage.clientWidth/stage.clientHeight);let all=new THREE.Box3(new THREE.Vector3(...tooth.bounds[0]),new THREE.Vector3(...tooth.bounds[1]));all.expandByPoint(new THREE.Vector3(...point(c,-40)));all.expandByScalar(1);fit(overview,[all.min.toArray(),all.max.toArray()],[.7,-.7,.08],.52);mobileOverviewKey='';fitMobileOverview();}
const instrumentGLSL=`uniform sampler2D routeTex;uniform sampler2D pilotRouteTex;uniform float sidecutPilot;uniform float routeCount;uniform float routeOrigin;uniform float routeStep;uniform float feed;uniform float spin;uniform float tipZ;uniform float baseZ;uniform float stopperShift;uniform vec3 stopperAxis;
vec3 rawRouteAt(sampler2D tex,float station,float row){float ix=clamp((station-routeOrigin)/routeStep,0.,routeCount-1.);float a=floor(ix);return mix(texture2D(tex,vec2((a+.5)/routeCount,(row+.5)/4.)).xyz,texture2D(tex,vec2((min(a+1.,routeCount-1.)+.5)/routeCount,(row+.5)/4.)).xyz,fract(ix));}
vec3 routeAt(float station,float row){vec3 a=rawRouteAt(routeTex,station,row);float u=clamp((feed-station-.10)/1.90,0.,1.);float w=sidecutPilot*(1.-u*u*u*(10.-15.*u+6.*u*u));return mix(a,rawRouteAt(pilotRouteTex,station,row),w);}
vec3 mapping(vec3 p){float s=feed+max(p.z,baseZ)-tipZ;float zoff=min(p.z-baseZ,0.);float x=p.x*cos(spin)-p.y*sin(spin);float y=p.x*sin(spin)+p.y*cos(spin);return routeAt(s,0.)+normalize(routeAt(s,1.))*x+normalize(routeAt(s,2.))*y+normalize(routeAt(s,3.))*zoff+normalize(stopperAxis)*stopperShift;}
vec3 normalMapping(vec3 p,vec3 n){float s=feed+max(p.z,baseZ)-tipZ;float x=n.x*cos(spin)-n.y*sin(spin);float y=n.x*sin(spin)+n.y*cos(spin);return normalize(routeAt(s,1.))*x+normalize(routeAt(s,2.))*y+normalize(routeAt(s,3.))*n.z;}`;
function instrumentMaterial(color,m){let mat=new THREE.MeshPhongMaterial({color,shininess:70,specular:0x797979,side:THREE.DoubleSide});mat.userData.uniforms={routeTex:{value:null},pilotRouteTex:{value:null},sidecutPilot:{value:0},routeCount:{value:1},routeOrigin:{value:-44},routeStep:{value:.025},feed:{value:-5},spin:{value:0},tipZ:{value:m.tip_z},baseZ:{value:m.active_base_z},stopperShift:{value:0},stopperAxis:{value:new THREE.Vector3(0,0,1)}};mat.onBeforeCompile=s=>{Object.assign(s.uniforms,mat.userData.uniforms);s.vertexShader=instrumentGLSL+'\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=normalMapping(position,objectNormal);').replace('#include <begin_vertex>','vec3 transformed=mapping(position);')};return mat}
function partColor(part,size){if(part.color!==undefined)return part.color;let name=part.name.toLowerCase();if(size==='17'){if(name.includes('stopper'))return 0x15191c;if(name.includes('markers'))return 0x393939;if(name.includes('黄色'))return 0xf2ca31;if(name.includes('sleeve')||name.includes('handle'))return 0xe8e7df;return 0xaeb8bf}if(name.includes('white length'))return 0xe8e8e2;if(name.includes('black shank'))return 0x21272a;if(/silicone|connector|identification/.test(name))return files[size].color;return 0xb7c3cc}
let mobileOverviewKey='';
function fitMobileOverview(){
 if(!matchMedia('(max-width:950px)').matches)return;
 const c=canals[selected],j=state(c).j,key=c.id+':'+j+':'+stage.clientWidth+':'+stage.clientHeight;
 if(key===mobileOverviewKey||!actors[j])return;mobileOverviewKey=key;
 const m=files[sizes[j]],box=new THREE.Box3(new THREE.Vector3(...tooth.bounds[0]),new THREE.Vector3(...tooth.bounds[1]));
 let low=Infinity,high=-Infinity,radius=0;
 for(const ob of actors[j].children){if(!ob.geometry.boundingBox)ob.geometry.computeBoundingBox();const b=ob.geometry.boundingBox;low=Math.min(low,b.min.z);high=Math.max(high,b.max.z);radius=Math.max(radius,Math.hypot(Math.max(Math.abs(b.min.x),Math.abs(b.max.x)),Math.max(Math.abs(b.min.y),Math.abs(b.max.y))));}
 // Cover the actual master assembly at both feed extremes, including the rigid
 // handle extension and source stopper translation; tooth/route stay unchanged.
 for(const feed of [-5,c.length_mm])for(const z of [low,high,...Array.from({length:Math.ceil(high-low)+1},(_,i)=>low+i)]){
  const s=feed+Math.max(z,m.active_base_z)-m.tip_z,p=new THREE.Vector3(...point(c,s)),t=new THREE.Vector3(...point(c,s,3)).normalize();p.addScaledVector(t,Math.min(z-m.active_base_z,0));box.expandByPoint(p);
 }
 box.expandByScalar(radius+Math.abs(c.stopper_reference?.file_settings[sizes[j]]?.axial_translation_mm||0)+1);
 fit(overview,[box.min.toArray(),box.max.toArray()],[.7,-.7,.08],.52);
}
const instrumentTasks=new Map();
async function ensureInstrument(j){
 if(actors[j])return actors[j];
 if(instrumentTasks.has(j))return instrumentTasks.get(j);
 const task=(async()=>{
  const m=files[sizes[j]],group=new THREE.Group();
  const parts=await Promise.all(m.parts.map(async part=>{
   const g=await geometry('/et-instruments/',part.asset.replace('.npz',''));
   const mat=instrumentMaterial(partColor(part,sizes[j]),m),isStopper=/stopper/i.test(part.name);
   if(isStopper){mat.shininess=6;mat.specular.setHex(0x171717);}else if(part.material==='handle')mat.shininess=8;
   const ob=new THREE.Mesh(g,mat);ob.userData.isStopper=isStopper;ob.frustumCulled=false;return ob;
  }));
  group.add(...parts);group.visible=false;scene.add(group);actors[j]=group;return group;
 })();instrumentTasks.set(j,task);
 try{return await task;}catch(e){instrumentTasks.delete(j);throw e;}
}
function texture3D(data,c){
 const t=new THREE.Data3DTexture(data,c.texture_shape[2],c.texture_shape[1],c.texture_shape[0]);
 t.format=THREE.RGBAFormat;t.type=THREE.FloatType;t.minFilter=t.magFilter=THREE.LinearFilter;t.unpackAlignment=1;t.needsUpdate=true;return t;
}
function routeTexture(raw,c){
 const tx=new Float32Array(c.route_samples*16);
 for(let k=0;k<c.route_samples;k++)for(let row=0;row<4;row++)for(let q=0;q<3;q++)tx[(row*c.route_samples+k)*4+q]=raw[k*12+row*3+q];
 const t=new THREE.DataTexture(tx,c.route_samples,4,THREE.RGBAFormat,THREE.FloatType);t.needsUpdate=true;t.minFilter=t.magFilter=THREE.NearestFilter;return t;
}
async function loadCanalDisplay(c,i){
 const base='/canal-assets-'+c.id+'/';
 const [route,holes,pilot]=await Promise.all([getBuffer(base+'route.bin'),getBuffer(base+'anatomy-holes.bin'),c.sidecut_motion?getBuffer(base+'pilot-route.bin'):null]);
 c.raw=new Float32Array(route);c.routeTex=routeTexture(c.raw,c);
 if(pilot)c.pilotRouteTex=routeTexture(new Float32Array(pilot),c);
 c.positive=[];
 for(let k=0;k<c.route_samples;k++){const s=c.route_origin_mm+k*c.route_step_mm;if(s>=-1e-6)c.positive.push(Math.max(0,s));}
 c.positive[c.positive.length-1]=c.length_mm;
 // The original exit clipping field is retained exactly, without downloading
 // the unrelated first-touch fields before anything can be displayed.
 const alpha=new Float32Array(holes),anatomy=new Float32Array(alpha.length*4);anatomy.fill(1e5);
 for(let k=0;k<alpha.length;k++)anatomy[k*4+3]=alpha[k];
 const neutral=new THREE.Data3DTexture(new Float32Array([1e5,1e5,1e5,1e5]),1,1,1);neutral.format=THREE.RGBAFormat;neutral.type=THREE.FloatType;neutral.needsUpdate=true;
 Object.assign(baseUniforms,{['texA'+i]:{value:neutral},['texB'+i]:{value:texture3D(anatomy,c)},['origin'+i]:{value:new THREE.Vector3(...c.texture_origin_mm)},['dims'+i]:{value:new THREE.Vector3(...c.texture_shape)},['spacing'+i]:{value:c.texture_step_mm},['visits'+i]:{value:new THREE.Vector4(-1e4,-1e4,-1e4,-1e4)},['lastVisit'+i]:{value:-1e4},['prepOrder'+i]:{value:0}});
 c.stock=[];c.stocks=[];c.stockTasks=[];c.meshTasks=[];
}
async function ensureCanalData(c){
 if(c.dataReady)return;
 if(c.dataTask)return c.dataTask;
 c.dataTask=(async()=>{
  const base='/canal-assets-'+c.id+'/',[a,b]=await Promise.all([getBuffer(base+c.texture0),getBuffer(base+c.texture1)]);
  c.ft0=new Float32Array(a);c.ft1=new Float32Array(b);
  const i=canals.indexOf(c);
  for(const [key,data] of [['texA',c.ft0],['texB',c.ft1]]){const u=baseUniforms[key+i],previous=u.value;u.value=texture3D(data,c);previous.dispose();}
  c.dataReady=true;sectionCache.clear();
 })();
 try{await c.dataTask;}catch(e){c.dataTask=null;throw e;}
}
async function ensureStockData(c,j){
 if(c.stock[j])return;
 if(c.stockTasks[j])return c.stockTasks[j];
 c.stockTasks[j]=(async()=>{
  const base='/canal-assets-'+c.id+'/',[ids,feeds]=await Promise.all([getBuffer(base+`stock-${j}-ids.bin`),getBuffer(base+`stock-${j}-feed.bin`)]);
  c.stock[j]={ids:new Uint32Array(ids),feeds:new Float32Array(feeds)};
 })();try{await c.stockTasks[j];}catch(e){c.stockTasks[j]=null;throw e;}
}
async function ensureStockMesh(c,j){
 if(c.stocks[j])return;
 if(c.meshTasks[j])return c.meshTasks[j];
 c.meshTasks[j]=(async()=>{
  const i=canals.indexOf(c),visited={value:-1e4};
  const clipOthers=canals.map((d,k)=>k!==i?`if(prepOrder${k}<prepOrder${i}&&cut${k}(prepWorld,.02))discard;`:'').join('');
  const mat=clippedMaterial(new THREE.MeshPhongMaterial({color:files[sizes[j]].color,side:THREE.DoubleSide,transparent:true,opacity:.8,depthWrite:false,shininess:15}),`if(stockTouch>stockVisited+.015)discard;${clipOthers}`,{stockVisited:visited},'stockTouch=firstTouch;','attribute float firstTouch;varying float stockTouch;uniform float stockVisited;\n');
  mat.userData.visited=visited;
  const ob=new THREE.Mesh(await geometry('/canal-assets-'+c.id+'/',`extra-${j}`),mat);ob.visible=false;scene.add(ob);c.stocks[j]=ob;
  if(j===0&&c.sidecut_motion){
   const v={value:-1e4},other=canals.map((_,k)=>k!==i?`if(cut${k}(prepWorld,.018))discard;`:'').join('');
   const wallMat=clippedMaterial(new THREE.MeshPhongMaterial({color:files['17'].color,side:THREE.BackSide,shininess:32,specular:0x303030}),`if(stockTouch>stockVisited+.015||dataB${i}(prepWorld).g<.001)discard;vec4 f=dataA${i}(prepWorld);if(f.g<=visits${i}.g-.025||f.b<=visits${i}.b-.025||f.a<=visits${i}.a-.025||dataB${i}(prepWorld).r<=lastVisit${i}-.025)discard;${other}`,{stockVisited:v},'stockTouch=firstTouch;','attribute float firstTouch;varying float stockTouch;uniform float stockVisited;\n');
   wallMat.userData.visited=v;c.sidecutWall=new THREE.Mesh(ob.geometry,wallMat);c.sidecutWall.visible=false;scene.add(c.sidecutWall);
  }
 })();try{await c.meshTasks[j];}catch(e){c.meshTasks[j]=null;throw e;}
}
async function prepareState(index,time,nextMode,resetAll=false){
 const target=canals[index],jobs=[ensureInstrument(state({...target,time}).j)];
 for(const c of canals){
  const t=resetAll?0:c===target?time:c.time;if(t<=1)continue;
  jobs.push(ensureCanalData(c));const st=state({...c,time:t});
  for(let j=0;j<c.sequence.length;j++)if(st.visits[j]>=0){jobs.push(ensureStockData(c,j));if(['both','stock'].includes(nextMode)||(c.sidecut_motion&&j===0))jobs.push(ensureStockMesh(c,j));}
 }
 await Promise.all(jobs);
}
let changeToken=0,retryChange;
const assetStatus=message=>{mobilePlayback.loading(message,playRequested);$('#play').textContent=playRequested?'Pause':'Play';const el=$('#asset-status');el.hidden=!message;el.textContent=message;if(message)$('#sequence-finish').textContent='Loading…';else if(ready)$('#sequence-finish').textContent='Selected finish: ET '+canals[selected].sequence.at(-1)+'/.04';};
function showAssetError(e,retry){
 mobilePlayback.error(retry);
 const el=$('#error');el.textContent='That part of the model could not load. Your current view is preserved. ';
 const button=document.createElement('button');button.textContent='Try again';button.onclick=retry;el.append(button);console.warn(e);
 const header=$('#sequence-finish'),quickRetry=document.createElement('button');header.textContent='Load failed ';quickRetry.textContent='Retry';quickRetry.style.cssText='display:inline-block;width:auto;margin:0;padding:2px 6px;font:inherit';quickRetry.onclick=retry;header.append(quickRetry);
}
async function setPreparation({index=selected,time=canals[index].time,nextMode=mode,play=false,resetAll=false,resetCurrent=false}={}){
 if(!ready)return;
 time=Math.max(0,Math.min(canals[index].duration_seconds,time));
 const token=++changeToken;playing=false;playRequested=play;retryChange=()=>setPreparation({index,time,nextMode,play,resetAll,resetCurrent});
 assetStatus('Loading the selected preparation…');$('#error').textContent='';
 try{
  await prepareState(index,time,nextMode,resetAll);
  if(token!==changeToken)return;
  if(resetAll){canals.forEach(c=>{c.time=0;c.order=0;});order=0;}
  selected=index;const c=canals[index];if(resetCurrent)c.order=0;c.time=time;mode=nextMode;
  if(!c.order&&time>1)c.order=++order;
  activeActor=-1;playing=play;
  if(play){playStarted=performance.now();playFrom=time;}
  assetStatus('');refresh();if(!whole)refit();
 }catch(e){if(token===changeToken){playRequested=false;assetStatus('');refresh(false);showAssetError(e,retryChange);}}
}
function stateAvailable(c,time){
 const st=state({...c,time});if(!actors[st.j])return false;
 if(time<=1)return true;if(!c.dataReady)return false;
 for(let j=0;j<c.sequence.length;j++)if(st.visits[j]>=0&&(!c.stock[j]||((removedShown()||(c.sidecut_motion&&j===0))&&!c.stocks[j])))return false;
 return true;
}
let sectionTask;
async function ensureSection(){
 if(!$('#cross-section-panel')?.open)return;
 $('#error').textContent='';
 if(canals.every(c=>c.dataReady)){drawSection();return;}
 $('#section-position').textContent='Loading cross-section…';
 if(!sectionTask)sectionTask=Promise.all(canals.map(ensureCanalData)).finally(()=>{sectionTask=null;});
 try{await sectionTask;refresh(false);}catch(e){showAssetError(e,ensureSection);}
}
function togglePlayback(){
 if(!ready)return;
 if(playing||playRequested){++changeToken;playing=false;playRequested=false;assetStatus('');refresh();}
 else setPreparation({time:canals[selected].time>=canals[selected].duration_seconds?0:canals[selected].time,play:true});
}
function wirePreparationControls(){
 $('#play').onclick=togglePlayback;
 $('#reset').onclick=()=>setPreparation({time:0,resetCurrent:true});
 $('#reset-tooth').onclick=()=>setPreparation({time:0,resetAll:true});
 $('#timeline').oninput=()=>setPreparation({time:Number($('#timeline').value)});
 $('#file').onchange=()=>setPreparation({time:Number($('#file').value)*16});
 $('#finish').onclick=()=>setPreparation({time:state(canals[selected]).j*16+12});
 $('#complete-canal').onclick=()=>setPreparation({time:canals[selected].duration_seconds});
 $('#walls').onclick=()=>setPreparation({nextMode:layerMode(!wallsShown(),removedShown())});
 $('#stock').onclick=()=>setPreparation({nextMode:layerMode(wallsShown(),!removedShown())});
 $('#cross-section-panel').ontoggle=()=>ensureSection();
 $('#level').onchange=()=>ensureSection();
}
function animateActor(){if(!ready)return;fitMobileOverview();const c=canals[selected],st=state(c);if(activeActor!==st.j){actors.forEach((g,i)=>g.visible=i===st.j&&$('#show-file').checked);activeActor=st.j}actors[st.j].visible=$('#show-file').checked;actors[st.j].children.forEach(ob=>{const u=ob.material.userData.uniforms;u.routeTex.value=c.routeTex;u.pilotRouteTex.value=c.pilotRouteTex||c.routeTex;u.sidecutPilot.value=c.sidecut_motion&&st.j===0?1:0;u.routeCount.value=c.route_samples;u.routeOrigin.value=c.route_origin_mm;u.routeStep.value=c.route_step_mm;u.feed.value=st.feed;u.spin.value=phase;u.stopperShift.value=ob.userData.isStopper?(c.stopper_reference?.file_settings[sizes[st.j]]?.axial_translation_mm||0):0;u.stopperAxis.value.set(...(c.stopper_reference?.entry_axis||[0,0,1]))})}
function upperBound(a,x){let lo=0,hi=a.length;while(lo<hi){let m=(lo+hi)>>1;if(a[m]<=x)lo=m+1;else hi=m}return lo}
function volumes(){const union=new Set();let added=0,selectedTotal=0,c=canals[selected],current=state(c).j;for(let d of [...canals].sort((a,b)=>a.order-b.order)){let st=state(d);for(let j=0;j<5;j++){let cnt=st.visits[j]<0||!d.stock[j]?0:upperBound(d.stock[j].feeds,Math.fround(st.visits[j]));for(let k=0;k<cnt;k++){let id=d.stock[j].ids[k];if(!union.has(id)){union.add(id);if(parentKey(d)===parentKey(c))selectedTotal++;if(d===c&&j===current)added++;}}}}const v=tooth.stock_voxel_spacing_mm**3;$('#extra').textContent=volumeFormat(added*v);$('#total').textContent=volumeFormat(union.size*v);$('#canal-total').textContent=volumeFormat(selectedTotal*v);return union.size*v}
const sectionCache=new Map();
function drawSection(){if(!ready||!$('#cross-section-panel')?.open||!canals.every(c=>c.dataReady))return;let c=canals[selected],choice=$('#level').value,key=c.id+'-'+choice,plane=sectionCache.get(key),canvas=$('#section'),ctx=canvas.getContext('2d'),pix=240;if(!plane){let s=choice==='apical'?Math.max(0,c.length_mm-.12):c.length_mm*Number(choice),C=point(c,s),N=point(c,s,1),B=point(c,s,2),range=choice==='apical'?.75:1.8,rgb=new Uint8Array(pix*pix*3),hard=new Uint8Array(pix*pix),touch=canals.map(()=>sizes.map(()=>new Float32Array(pix*pix)));for(let y=0;y<pix;y++)for(let x=0;x<pix;x++){let xx=(x/(pix-1)-.5)*2*range,yy=(y/(pix-1)-.5)*2*range,p=C.map((v,k)=>v+xx*N[k]+yy*B[k]),v=nativeVoxel(p),i=y*pix+x;{rgb.set((v&1)?[218,210,187]:(v&2)?[199,127,124]:[31,49,60],i*3);hard[i]=v&1;for(let d=0;d<canals.length;d++){let q=canals[d];if(sample(q.ft1,q.texture_shape,q.texture_origin_mm,q.texture_step_mm,p,1)<0&&(v&2)){hard[i]=0;rgb.set([199,127,124],i*3)}for(let j=0;j<5;j++)touch[d][j][i]=lookup(q,p,j)}}}plane={s,C,range,rgb,hard,touch};sectionCache.set(key,plane)}let im=ctx.createImageData(pix,pix),states=canals.map(state),ordered=canals.map((c,i)=>[c.order,i]).sort((a,b)=>a[0]-b[0]);for(let i=0;i<pix*pix;i++){let r=plane.rgb[i*3],g=plane.rgb[i*3+1],b=plane.rgb[i*3+2];if(plane.hard[i])for(let [,d] of ordered)for(let j=0;j<5;j++)if(states[d].visits[j]>=0&&plane.touch[d][j][i]<=states[d].visits[j]){let hex=files[sizes[j]].color;r=hex>>16;g=(hex>>8)&255;b=hex&255}im.data[i*4]=r;im.data[i*4+1]=g;im.data[i*4+2]=b;im.data[i*4+3]=255}ctx.putImageData(im,0,0);canvas.dataset.plane=JSON.stringify({canal:c.id,station_mm:plane.s,origin_mm:plane.C,normal:point(c,plane.s,3),window_mm:plane.range*2});$('#section-position').textContent=choice==='apical'?'0.12 mm coronal to the selected apical target':`${(c.length_mm-plane.s).toFixed(2)} mm from the apical target`}

function parentKey(c){return c.anatomical_canal_id||c.id;}
function preparationGroups(){const groups=new Map();for(const c of canals){let k=parentKey(c);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(c);}return [...groups.values()];}
function refreshPasses(){let c=canals[selected],members=canals.filter(d=>parentKey(d)===parentKey(c));let panel=$('#pass-controls');if(!panel){panel=document.createElement('div');panel.id='pass-controls';panel.style.cssText='margin:12px 0 18px;padding:12px;border:1px solid #5d737c;border-radius:12px;background:#1c2d38';$('#canals').after(panel);}panel.hidden=members.length<2;if(members.length<2)return;let key=parentKey(c)+':'+members.map(d=>d.id).join(',');if(panel.dataset.group!==key){panel.dataset.group=key;panel.innerHTML='<b>Two passes · same canal</b><p style="font-size:13px;margin:4px 0 10px;color:#c7d6dc">Prepare each path to ET 30/.04. Red and green identify paths.</p><div id="passes" style="display:flex;gap:8px"></div>';members.forEach(d=>{let button=document.createElement('button');button.style.cssText='flex:1;text-align:left;padding:10px;border-left:5px solid '+d.pass_marker_color;button.innerHTML='Pass '+d.pass_index+' · '+d.pass_name+'<small style="display:block"></small>';button.onclick=()=>setPreparation({index:canals.indexOf(d)});$('#passes').append(button);});}members.forEach((d,i)=>{let b=$('#passes').children[i];b.classList.toggle('active',d===c);b.setAttribute('aria-pressed',String(d===c));b.querySelector('small').textContent=d.time>=d.duration_seconds-.01?'Prepared':d.time>1?'In progress':'Ready';});}
function refreshGroupButtons(){for(const members of preparationGroups()){let first=members[0],b=first.button,done=members.filter(d=>d.time>=d.duration_seconds-.01).length;b.classList.toggle('active',members.includes(canals[selected]));b.querySelector('small').textContent=members.length>1?done+' of '+members.length+' passes prepared':done?'Prepared':first.time>1?'In progress':'Ready';}refreshPasses();}

function save(){if(new URLSearchParams(location.search).has('proof'))return;try{localStorage.setItem((tooth.number===9?'endotech-local-straightening-v1-':tooth.number===7?'endotech-marked-two-track-v1-':tooth.number===13?'endotech-native-continuity-v4-':tooth.number===10?'endotech-biological-v3-':'endotech-canal-specific-v2-')+tooth.specimen,JSON.stringify(canals.map(c=>({id:c.id,time:c.time,order:c.order}))))}catch{}}
function refreshSequence(c,st){const bar=$('#file-sequence'),key=c.id+':'+c.sequence.join(',');if(bar.dataset.sequence!==key){bar.dataset.sequence=key;bar.innerHTML=c.sequence.map((size,i)=>`<button class="sequence-file" style="--file-colour:#${files[size].color.toString(16).padStart(6,'0')};--file-ink:${({'25':'#ff8177','30':'#91b4ff','35':'#a1d38c'})[size]||'#'+files[size].color.toString(16).padStart(6,'0')}" data-file="${i}" aria-label="${i===0?'MicroPath':'ET'} ${size} / ${i===0?'.03':'.04'}"><i class="file-colour"></i><b>${size}</b><span class="file-family">${i===0?'MicroPath · .03':'ET · .04'}</span><span class="file-state">Next</span></button>`).join('');bar.querySelectorAll('button').forEach((button,i)=>button.onclick=()=>setPreparation({time:i*16}))}bar.querySelectorAll('button').forEach((button,i)=>{let active=i===st.j,done=i<st.j||c.time>=c.duration_seconds-.01;button.classList.toggle('active',active);button.classList.toggle('done',done);button.setAttribute('aria-current',active?'step':'false');button.querySelector('.file-state').textContent=active?(done?'Complete':'Using now'):done?'Completed':'Next'});$('#sequence-canal').textContent=c.pass_index?c.label+' · '+c.pass_name:c.clinical_alias?c.clinical_alias+' · '+c.label:c.label;$('#sequence-finish').textContent='Selected finish: ET '+c.sequence.at(-1)+'/.04';$('#sizing-note').textContent=c.sizing_selection?.display_reason||'Canal-specific teaching sequence';$('#legend').innerHTML=c.sequence.map(z=>`<i style="background:#${files[z].color.toString(16).padStart(6,'0')}"></i>${z}`).join(' &nbsp; ')}
function refresh(rebuild=true){if(!ready)return;keepRequiredVisibility();if($('#path-guide-control'))$('#path-guide-control').hidden=parentKey(canals[selected])!==17;pathGuides.forEach(g=>g.visible=parentKey(canals[selected])===17&&Boolean($('#path-guides')?.checked));canals.forEach((c,i)=>{let st=state(c);baseUniforms['visits'+i].value.set(...st.visits.slice(0,4));baseUniforms['lastVisit'+i].value=st.visits[4];baseUniforms['prepOrder'+i].value=c.order;if(rebuild)rebuildTube(c);if(c.sidecutWall){c.sidecutWall.visible=wallsShown()&&c.time>1;c.sidecutWall.material.userData.visited.value=st.visits[0];}c.stocks.forEach((ob,j)=>{ob.visible=removedShown()&&c.time>1&&st.visits[j]>=0;ob.material.userData.visited.value=st.visits[j];ob.material.opacity=wallsShown()?.32:.8;ob.material.polygonOffset=wallsShown();ob.material.polygonOffsetFactor=-1;ob.material.polygonOffsetUnits=-1});});refreshGroupButtons();baseUniforms.prepMode.value=wallsShown()?0:1;const stockOnly=removedShown()&&!wallsShown();if(nativeWall.material.transparent!==stockOnly){nativeWall.material.transparent=stockOnly;nativeWall.material.needsUpdate=true;}nativeWall.material.opacity=stockOnly?.18:1;nativeWall.material.depthWrite=!stockOnly;let c=canals[selected],st=state(c);refreshSequence(c,st);if($('#file').options.length!==c.sequence.length)$('#file').innerHTML=c.sequence.map((s,i)=>`<option value="${i}">${i===0?'MicroPath 17/.03':'ET '+s+'/.04'}</option>`).join('');$('#file').value=String(st.j);$('#timeline').max=c.duration_seconds;$('#timeline').value=String(c.time);$('#clock').textContent=`${c.time.toFixed(1)} / ${c.duration_seconds} s · visited ${st.visited.toFixed(2)} / ${c.length_mm.toFixed(2)} mm`;$('#status').textContent=`ACTA ${tooth.specimen} · ${c.label} · ${st.j===0?'MicroPath 17/.03':'ET '+sizes[st.j]+'/.04'}`;$('#title').textContent=c.label;const groups=preparationGroups();$('#prepared-count').textContent=`${groups.filter(g=>g.every(d=>d.time>=d.duration_seconds-.01)).length} of ${groups.length} canals prepared`;$('#complete-canal').textContent=c.pass_index?'Complete this pass':'Complete this canal';$('#reset').textContent=c.pass_index?'Reset pass':'Reset canal';$('#endpoint-note').textContent='Selected apical target · just inside the root exit';$('#play').textContent=playRequested?'Pause':'Play';mobilePlayback.update(c,st,files,playRequested);$('#walls').classList.toggle('active',wallsShown());$('#stock').classList.toggle('active',removedShown());$('#walls').setAttribute('aria-pressed',String(wallsShown()));$('#stock').setAttribute('aria-pressed',String(removedShown()));shell.visible=$('#shell').checked;animateActor();let total=volumes();drawSection();save();stage.dataset.preparation=JSON.stringify({loaded:true,loadingRevision:'mobile-playback-20261022',presentationUp:tooth.presentation_up||[0,0,1],displayCleanup:tooth.number===6?'two-user-marked-cast-fragments-20261020':null,visibilityPolicy:'always-on-20261020',fileShown:actors[st.j].visible,toothOutlineShown:shell.visible,renderRevision:tooth.number===9?'local-straightening-0056-20261020':tooth.number===7?'marked-two-track-20261020':'native-continuity-20261020',model:tooth.number,selectedCanal:c.id,canalCount:preparationGroups().length,preparationCourseCount:canals.length,anatomicalCanalId:parentKey(c),selectedPassIndex:c.pass_index||1,time:c.time,duration:c.duration_seconds,file:sizes[st.j],tipFeed:st.feed,endpointStation:c.length_mm,tipTargetDistance:Math.abs(st.feed-c.length_mm),stopperGapMm:c.length_mm-st.feed,stopperReference:c.stopper_reference?.cusp_mm,stopperShiftMm:c.stopper_reference?.file_settings[sizes[st.j]]?.axial_translation_mm,target:c.endpoint_mm,majorExit:c.major_exit_mm,mode,preparedWallsEnabled:wallsShown(),removedDentineEnabled:removedShown(),visiblePreparedCourses:canals.filter(d=>d.tube.visible||d.sidecutWall?.visible).map(d=>d.id),visibleRemovalMeshes:canals.reduce((sum,d)=>sum+d.stocks.filter(ob=>ob.visible).length,0),total,canals:canals.map(d=>({id:d.id,time:d.time,visits:state(d).visits})),errors:errorLog});needsRender=true;if(reviewActive)applyReview();}
function edited(){const c=canals[selected];if(!c.order&&c.time>1)c.order=++order;refresh()}
$('#whole').onclick=()=>{whole=true;refit()};$('#refit').onclick=()=>{whole=false;refit()};$('#shell').onchange=()=>refresh(false);$('#show-file').onchange=()=>refresh(false);
let playStarted=0,playFrom=0,last=performance.now(),firstModelFrame=false,needsRender=true;
controls.addEventListener('change',()=>{needsRender=true;});
renderer.domElement.addEventListener('webglcontextrestored',()=>{needsRender=true;});
function render(now){
 requestAnimationFrame(render);last=now;
 if(!ready)return;
 if(playing){
  // A queued frame can predate the latest touch/resume handler. Keep valid feed.
  const c=canals[selected],next=Math.min(c.duration_seconds,playFrom+Math.max(0,now-playStarted)/1000);
  if(stateAvailable(c,next)){
   c.time=next;phase=c.time*Math.PI*2*2.2;
   const st=state(c);
   if(st.local>4&&st.j+1<c.sequence.length&&!actors[st.j+1])ensureInstrument(st.j+1).catch(()=>{});
   if(c.time>=c.duration_seconds){playing=false;playRequested=false;lastUI=now;refresh();}
   else if(now-lastUI>160){lastUI=now;refresh();}
  }else{playing=false;setPreparation({time:next,play:true});}
 }
 const moving=controls.update();if(!needsRender&&!playing&&!moving)return;
 needsRender=false;animateActor();
 const w=stage.clientWidth,h=stage.clientHeight;
 renderer.setScissorTest(false);renderer.setViewport(0,0,w,h);renderer.render(scene,camera);
 stage.dataset.drawnPreparation=JSON.stringify({canal:canals[selected].id,file:sizes[state(canals[selected]).j],time:canals[selected].time,preparedWallsEnabled:wallsShown(),removedDentineEnabled:removedShown()});
 if(!firstModelFrame){firstModelFrame=true;$('#loading').hidden=true;performance.mark('molar-first-frame');}
 if(reviewActive)return;
 const ow=Math.min(150,w*.22,Math.max(40,(h-100)*.52)),oh=ow/.52,x=w-ow-10,y=h-oh-76;
 renderer.clearDepth();renderer.setScissorTest(true);renderer.setScissor(x,y,ow,oh);renderer.setViewport(x,y,ow,oh);renderer.setClearColor(0x1b303c,1);renderer.clear(true,true,false);
 const old=shell.material.opacity;shell.material.opacity=.13;renderer.render(scene,overview);shell.material.opacity=old;renderer.setClearColor(0,0);renderer.setScissorTest(false);
}
requestAnimationFrame(render);
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);if(ready)refit()}).observe(stage);
async function init(){
 [tooth,files]=await Promise.all([getJSON('tooth.json'),getJSON('/viewer-files.json')]);
 canals=tooth.canals;let saved=[];
 const storageKey=(tooth.number===9?'endotech-local-straightening-v1-':tooth.number===7?'endotech-marked-two-track-v1-':tooth.number===13?'endotech-native-continuity-v4-':tooth.number===10?'endotech-biological-v3-':'endotech-canal-specific-v2-')+tooth.specimen;
 try{saved=JSON.parse(localStorage.getItem(storageKey)||'[]');}catch{}
 if([7,9].includes(tooth.number)&&!localStorage.getItem(storageKey))try{saved=JSON.parse(localStorage.getItem('endotech-canal-specific-v2-'+tooth.specimen)||'[]').filter(c=>tooth.number===7?![17,47].includes(c.id):c.id!==48);}catch{}
 const initial=Number(new URLSearchParams(location.search).get('canal'));
 baseUniforms.prepMode={value:0};
 for(let i=0;i<canals.length;i++){
  const c=canals[i],old=saved.find(x=>x.id===c.id);c.time=Math.max(0,Math.min(c.duration_seconds,old?.time||0));c.order=old?.order||0;order=Math.max(order,c.order);if(c.id===initial)selected=i;
  const first=canals.slice(0,i).find(d=>parentKey(d)===parentKey(c));
  if(first)c.button=first.button;
  else{const button=document.createElement('button');button.innerHTML=(c.anatomical_label||c.label)+'<small>Ready</small>';button.onclick=()=>setPreparation({index:i});$('#canals').append(button);c.button=button;}
 }
 const visibleMeshes=Promise.all([geometry('assets/','teaching-canals'),geometry('assets/','tooth-exterior')]);
 const volume=getBuffer('assets/source-volume.bin').then(b=>{tooth.voxels=new Uint8Array(b);});
 await Promise.all([visibleMeshes,volume,...canals.map(loadCanalDisplay),ensureInstrument(state(canals[selected]).j)]);
 const [wallGeometry,shellGeometry]=await visibleMeshes;
 const cuts=canals.map((_,i)=>`if(cut${i}(prepWorld,.004))discard;`).join('');
 nativeWall=new THREE.Mesh(wallGeometry,clippedMaterial(new THREE.MeshPhongMaterial({color:0xc77f7c,side:THREE.BackSide,shininess:28,specular:0x303030}),`if(prepMode<.5){${cuts}}`));scene.add(nativeWall);
 const holes=canals.map((_,i)=>`if(inside${i}(prepWorld)&&dataB${i}(prepWorld).a<-.003)discard;`).join('');
 shell=new THREE.Mesh(shellGeometry,clippedMaterial(new THREE.MeshPhongMaterial({color:0xded8c7,transparent:true,opacity:.09,depthWrite:false,side:THREE.FrontSide,shininess:10}),holes));shell.renderOrder=4;scene.add(shell);
 canals.forEach((c,i)=>{c.tube=tubeMesh(c,i);c.tube.visible=false;});
 // Restored preparations retain their real cumulative cutting state. A new
 // visit downloads only the exact anatomy, exit fields, routes and visible file.
 await prepareState(selected,canals[selected].time,mode);
 $('#specimen').textContent=`MODEL ${String(tooth.number).padStart(2,'0')} · ACTA ${tooth.specimen}`;
 document.title=`ACTA ${tooth.specimen} · All canals`;
 wirePreparationControls();ready=true;refresh();createPathGuides();refit();
}
let pathGuides=[];
function createPathGuides(){if(tooth.number!==7)return;let card=document.createElement('div');card.id='path-guide-control';card.style.cssText='margin-top:12px;padding-top:10px;border-top:1px solid #5d737c;color:#c4d4d9';card.innerHTML='<label style="margin:0;font-size:14px"><input id=path-guides type=checkbox checked aria-describedby=path-guide-note> Show red and green path guides</label><p id=path-guide-note style="font-size:13px;line-height:1.5;margin:8px 0 0"><strong>Why show both paths?</strong> '+"Red shows the sharper bend at the canal entrance. Green approaches from more mesial, giving a gentler transition into the same distal canal and illustrating the preferred straight-line access axis. Compare the approaches with the first 3–4 mm of the coronal canal. The colours identify paths, not file sizes."+'</p>';$('#pass-controls').append(card);for(let cid of [17,47]){let c=canals.find(c=>c.id===cid),points=[];for(let i=0;i<c.route_samples;i++){let s=c.route_origin_mm+i*c.route_step_mm;if(s>=-9)points.push(new THREE.Vector3(...point(c,s)))}let line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:cid===17?0xe43e1b:0x99ef39,transparent:true,opacity:.9,depthTest:false}));line.renderOrder=35;scene.add(line);pathGuides.push(line)}$('#path-guides').onchange=()=>pathGuides.forEach(g=>g.visible=parentKey(canals[selected])===17&&$('#path-guides').checked);}
let reviewActive=false,reviewGroups=[],startingSolid,sourceWall;
async function setupReview(){reviewActive=true;stage.style.minHeight='400px';stage.style.height='calc(100vh - 170px)';controls.enabled=false;renderer.localClippingEnabled=true;let panel=document.createElement('div');panel.id='review-controls';panel.innerHTML='<h2>Private geometry review</h2><label for="review-root">Root</label><select id="review-root">'+tooth.roots.map((r,i)=>`<option value="${i}">${r.label}</option>`).join('')+'</select><label for="review-mode">Review view</label><select id="review-mode"><option value="opaque">Opaque exterior</option><option value="relation">Canal relationship</option><option value="course">Full unprepared canal</option><option value="source">Native source only</option><option value="tip">Unprepared terminal close-up</option><option value="starting">Starting terminal lumen</option><option value="junction">Starting join close-up</option><option value="junction-cutaway">Starting join cutaway</option><option value="exit">Exit-facing</option><option value="cutaway">Longitudinal cutaway</option></select><label for="review-angle">Exact azimuth</label><select id="review-angle">'+Array.from({length:36},(_,i)=>`<option value="${i*10}">${i*10}°</option>`).join('')+'</select><label for="review-canal">Apical target for exit / section</label><select id="review-canal">'+canals.map((c,i)=>`<option value="${i}">${c.label}</option>`).join('')+'</select>';document.querySelector('aside').prepend(panel);for(let k of ['root','mode','angle','canal'])$('#review-'+k).onchange=applyReview;for(let i=0;i<tooth.roots.length;i++){let solid=new THREE.Mesh(await geometry('assets/',`review-root-${i}-solid`),new THREE.MeshPhongMaterial({color:0xded8c7,side:THREE.DoubleSide,shininess:9}));let wall=new THREE.Mesh(await geometry('assets/',`review-root-${i}-canals`),new THREE.MeshPhongMaterial({vertexColors:true,side:THREE.BackSide,shininess:32,specular:0x303030}));let ext=new THREE.Mesh(await geometry('assets/',`review-root-${i}-exterior`),clippedMaterial(new THREE.MeshPhongMaterial({color:0xded8c7,transparent:true,opacity:.13,depthWrite:false,side:THREE.FrontSide}),canals.map((_,j)=>`if(inside${j}(prepWorld)&&dataB${j}(prepWorld).a<-.003)discard;`).join('')));ext.renderOrder=4;scene.add(solid,wall,ext);reviewGroups.push({solid,wall,ext})}if([9,10,12,13].includes(tooth.number)){startingSolid=new THREE.Mesh(await geometry('assets/','starting-tooth-solid'),new THREE.MeshPhongMaterial({color:0xded8c7,side:THREE.DoubleSide,shininess:9}));startingSolid.visible=false;scene.add(startingSolid)}if(tooth.number===13){sourceWall=new THREE.Mesh(await geometry('assets/','source-only-canals'),new THREE.MeshPhongMaterial({color:0xc77f7c,side:THREE.BackSide,shininess:28,specular:0x303030}));sourceWall.visible=false;scene.add(sourceWall)}document.querySelector('.overview').hidden=true}
function applyReview(){if(!ready||!reviewActive)return;pathGuides.forEach(g=>g.visible=false);let root=Number($('#review-root').value),angle=Number($('#review-angle').value),mode=$('#review-mode').value,chosen=Number($('#review-canal').value);if(canals[chosen].root!==root){chosen=canals.findIndex(c=>c.root===root);$('#review-canal').value=String(chosen)}let c=canals[chosen],bounds=tooth.roots[root].apicalBounds,dir=[Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180),.14];nativeWall.visible=false;if(sourceWall)sourceWall.visible=false;nativeWall.material.clippingPlanes=[];if(startingSolid){startingSolid.visible=false;startingSolid.material.clippingPlanes=[]}shell.visible=true;canals.forEach(c=>{c.tube.visible=false;if(c.sidecutWall)c.sidecutWall.visible=false;c.stocks.forEach(ob=>ob.visible=false)});reviewGroups.forEach((g,i)=>{g.solid.visible=i===root&&mode!=='relation';g.wall.visible=i===root&&(mode==='relation'||mode==='cutaway');g.ext.visible=i===root&&mode==='relation';g.solid.material.clippingPlanes=[];g.wall.material.clippingPlanes=[]});if(mode==='exit'){let out=new THREE.Vector3(...c.major_exit_mm).sub(new THREE.Vector3(...c.endpoint_mm)).normalize();dir=out.toArray();let p=new THREE.Vector3(...c.endpoint_mm);bounds=[p.clone().addScalar(-.65).toArray(),p.clone().addScalar(.65).toArray()]}if(mode==='cutaway'){let p=new THREE.Vector3(...point(c,c.length_mm-1.2)),normal=new THREE.Vector3(...dir).normalize();reviewGroups[root].solid.material.clippingPlanes=[new THREE.Plane(normal.clone().negate(),normal.dot(p))];reviewGroups[root].wall.material.clippingPlanes=[new THREE.Plane(normal.clone().negate(),normal.dot(p))]}if(['starting','junction','junction-cutaway','course','source','tip'].includes(mode)){reviewGroups.forEach(g=>{g.solid.visible=false;g.wall.visible=false;g.ext.visible=false});nativeWall.visible=mode!=='source';if(sourceWall)sourceWall.visible=mode==='source';bounds=(mode==='starting'?c.biological_review_bounds?.terminal:c.biological_review_bounds?.entry)||c.biological_review_bounds?.terminal||bounds;if(mode==='junction-cutaway'&&startingSolid){startingSolid.visible=true;let mid=new THREE.Vector3(...bounds[0]).add(new THREE.Vector3(...bounds[1])).multiplyScalar(.5),normal=new THREE.Vector3(...dir).normalize(),plane=new THREE.Plane(normal.clone().negate(),normal.dot(mid));startingSolid.material.clippingPlanes=[plane];nativeWall.material.clippingPlanes=[plane];startingSolid.material.needsUpdate=true}if(mode==='tip'){let end=new THREE.Vector3(...c.endpoint_mm);bounds=[end.clone().addScalar(-.65).toArray(),end.clone().addScalar(.65).toArray()]}if(mode==='course'||mode==='source'){let box=new THREE.Box3();c.positive.forEach(s=>box.expandByPoint(new THREE.Vector3(...point(c,s))));box.expandByScalar(.75);bounds=[box.min.toArray(),box.max.toArray()]}nativeWall.material.needsUpdate=true;}reviewGroups[root].solid.material.needsUpdate=true;reviewGroups[root].wall.material.needsUpdate=true;fit(camera,bounds,dir,stage.clientWidth/stage.clientHeight);$('#status').textContent=`ACTA ${tooth.specimen} · ${tooth.roots[root].label} · ${mode} · ${angle}°`;stage.dataset.review=JSON.stringify({model:tooth.number,root,angle,mode,canal:c.id,bounds,endpoint:c.endpoint_mm,majorExit:c.major_exit_mm,geometry:['starting','junction','junction-cutaway','course','source','tip'].includes(mode)?'starting-biological-lumen':'all-canals-prepared',privateReview:true});renderer.setScissorTest(false);renderer.setViewport(0,0,stage.clientWidth,stage.clientHeight);animateActor();renderer.render(scene,camera);renderer.getContext().finish();let token=root+'-'+mode+'-'+angle+'-'+c.id;delete stage.dataset.reviewDrawn;requestAnimationFrame(()=>requestAnimationFrame(()=>stage.dataset.reviewDrawn=token));}
init().catch(e=>{errorLog.push(e.message);$('#loading').textContent='The model could not load. Please try again.';const retry=document.createElement('button');retry.textContent='Reload model';retry.onclick=()=>location.reload();$('#loading').append(retry);console.error(e)});
