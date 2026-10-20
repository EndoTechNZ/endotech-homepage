import {decodeBuffer} from './buffers.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const $=s=>document.querySelector(s),stage=$('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.localClippingEnabled=true;stage.append(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(31,1,.01,500);camera.up.set(0,0,1);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xe7eef4,0x454d4a,1.35));
for(const [c,i,p]of[[0xffefdc,2.1,[20,-30,25]],[0xb9d5eb,1.1,[-25,20,10]],[0xffffff,.45,[10,15,-12]]]){let l=new THREE.DirectionalLight(c,i);l.position.set(...p);scene.add(l)}
const coral=new THREE.MeshPhongMaterial({color:0xc67f7c,shininess:15,specular:0x463337,side:THREE.DoubleSide});
const ivory=new THREE.MeshPhongMaterial({color:0xdcd3bd,shininess:15,specular:0x34352e,side:THREE.DoubleSide});
const shell=new THREE.MeshPhongMaterial({color:0xded8c7,transparent:true,opacity:.18,depthWrite:false,shininess:18,side:THREE.FrontSide});
shell.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <alphatest_fragment>','float rootFacing=abs(dot(normalize(vNormal),normalize(vViewPosition)));\ndiffuseColor.a=.12+.28*pow(1.-rootFacing,2.4);\n#include <alphatest_fragment>')};
let meshes={},meta,mode='whole',requestId=0,loaded=false,angle=45;
async function getmesh(name){
 if(meshes[name])return meshes[name];let r=await fetch(`assets/${name}.json`);if(!r.ok)throw Error('Mesh unavailable: '+name);let d=await r.json();
 let [p,n,f]=await Promise.all(['positions','normals','indices'].map(async k=>{let r=await fetch('assets/'+d[k]+'.gz');if(!r.ok)throw Error('Mesh buffer unavailable');return decodeBuffer(await r.arrayBuffer())}));
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(p),3));g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(n),3));g.setIndex(new THREE.BufferAttribute(new Uint32Array(f),1));g.computeBoundingBox();
 const m=new THREE.Mesh(g,name.includes('canals')?coral:ivory);m.visible=false;scene.add(m);meshes[name]=m;return m;
}
function aim(bounds,direction){
 let box=new THREE.Box3(new THREE.Vector3(...bounds[0]),new THREE.Vector3(...bounds[1])),centre=box.getCenter(new THREE.Vector3());
 let dir=new THREE.Vector3(...direction).normalize(),up=new THREE.Vector3(0,0,1);if(Math.abs(dir.dot(up))>.96)up.set(0,-1,0);
 camera.up.copy(up);camera.position.copy(centre.clone().add(dir));camera.lookAt(centre);camera.updateMatrixWorld();
 let right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),camup=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1),dist=0;
 const tv=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),th=tv*camera.aspect;
 for(let x of[box.min.x,box.max.x])for(let y of[box.min.y,box.max.y])for(let z of[box.min.z,box.max.z]){let q=new THREE.Vector3(x,y,z).sub(centre),depth=q.dot(dir);dist=Math.max(dist,Math.abs(q.dot(right))/th+depth,Math.abs(q.dot(camup))/tv+depth)}
 controls.enableDamping=false;controls.target.copy(centre);camera.position.copy(centre.clone().addScaledVector(dir,dist*1.16));camera.zoom=1;camera.updateProjectionMatrix();controls.update();controls.enableDamping=true;
}
function direction(){let a=angle*Math.PI/180;return[Math.cos(a),Math.sin(a),.12]}
async function show(which){
 const id=++requestId;mode=which;loaded=false;$('#status').textContent='Loading…';Object.values(meshes).forEach(m=>m.visible=false);
 $('#scan-view').hidden=which!=='scan';renderer.domElement.hidden=which==='scan';$('#scan-controls').hidden=which!=='scan';
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===which));
 try{
 if(which==='scan'){updateSlice();$('#status').textContent='Native micro-CT · 72 µm sections';loaded=true;return}
 const root=Number($('#root').value),names=['exterior','canals'];
 for(const n of names){const m=await getmesh(n);if(id!==requestId)return;m.visible=true;m.material=n.includes('canals')?coral:which==='apex'?ivory:shell;m.renderOrder=n.includes('canals')?0:1}
 let bounds=which==='apex'?meta.roots[root].apicalBounds:['crown','occlusal'].includes(which)?meta.crownBounds:meta.bounds;
 let d=which==='occlusal'?[.15,.1,meta.upperOrientation?-1:1]:which==='apex'?[0,0,meta.upperOrientation?1:-1]:direction();aim(bounds,d);
 $('#status').textContent=({whole:'Complete tooth + canals',canals:'Canal walls',crown:'Crown and chamber',occlusal:'Chamber · occlusal view',apex:meta.roots[root].label+' · apical region'})[which];loaded=true;
 }catch(e){$('#error').textContent=e.message;console.error(e)}
}
function updateSlice(){if(!meta)return;let y=Number($('#slice').value);$('#native').src=`slices/${String(y).padStart(4,'0')}.png`;$('#overlay').src=`slices/${String(y).padStart(4,'0')}-overlay.png`;$('#level').textContent=`Native Y ${y} / ${meta.slices-1} · ${(y*meta.voxelSpacingMm).toFixed(3)} mm from source origin`}
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>show(b.dataset.view);
$('#root').onchange=()=>show('apex');$('#slice').oninput=updateSlice;
$('#previous').onclick=()=>{$('#slice').value=Math.max(0,Number($('#slice').value)-Math.round(.25/meta.voxelSpacingMm));updateSlice()};
$('#next').onclick=()=>{$('#slice').value=Math.min(meta.slices-1,Number($('#slice').value)+Math.round(.25/meta.voxelSpacingMm));updateSlice()};
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();if(meta&&mode!=='scan')show(mode)}).observe(stage);
function render(){requestAnimationFrame(render);controls.update();if(mode!=='scan')renderer.render(scene,camera)}render();
fetch('assets/model.json').then(r=>r.json()).then(async m=>{meta=m;document.title=`Molar ${m.number} · ACTA ${m.specimen}`;$('#title').textContent=`Molar ${String(m.number).padStart(2,'0')}`;$('#specimen').textContent=`ACTA ${m.specimen}`;$('#root').replaceChildren(...m.roots.map(r=>{let o=document.createElement('option');o.value=r.id;o.textContent=r.label;return o}));$('#slice').max=m.slices-1;$('#slice').value=Math.floor(m.slices*.5);await show('whole')}).catch(e=>{$('#error').textContent=e.message;console.error(e)});
window.proofState=()=>({loaded,mode,specimen:meta?.specimen,visible:Object.keys(meshes).filter(k=>meshes[k].visible),errors:$('#error').textContent,vertexCounts:Object.fromEntries(Object.entries(meshes).map(([k,m])=>[k,m.geometry.attributes.position.count]))});
