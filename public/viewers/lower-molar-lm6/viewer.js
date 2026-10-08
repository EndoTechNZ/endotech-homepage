import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createFile} from './lm6-file.js';
import {createDangerZone} from './lm6-danger-zone.js?v=18-bright-cue';
const $=s=>document.querySelector(s), stage=$('#stage');
async function boot(){
 const teachingView=new URLSearchParams(location.search).get('view')!=='measured',sceneScale=teachingView?1.145639888:1;document.querySelector('#view-status').textContent=teachingView?'21 mm teaching view - tooth and route enlarged 14.56%; original scan evidence remains at 0.075 mm. Illustrative target, not clinical working length.':'Measured scan view - original 0.075 mm scale; bottom-face contact is 18.33 mm on the reviewed model course.';document.querySelector('#view-teaching').setAttribute('aria-current',teachingView?'page':'false');document.querySelector('#view-measured').setAttribute('aria-current',teachingView?'false':'page');

 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xffffff);renderer.localClippingEnabled=true;stage.append(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','LM6 tooth. Drag to rotate; scroll to zoom.');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,300),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;scene.add(new THREE.HemisphereLight(0xffffff,0x697588,2.1));for(const [pos,intensity] of [[[8,12,16],3.6],[[-9,2,6],2.1],[[3,-4,-12],3]]){const light=new THREE.DirectionalLight(0xffffff,intensity);light.position.set(...pos);scene.add(light);}
 const pivot=new THREE.Group();scene.add(pivot);const plane=new THREE.Plane(new THREE.Vector3(0,0,-1),0);
 async function meshData(name){let last;for(let attempt=0;attempt<3;attempt++){try{const r=await fetch(`models/${name}.json?v=12-calibrated`,{cache:'no-store'});if(!r.ok)throw Error(name+' unavailable ('+r.status+')');return await r.json();}catch(e){last=e;if(attempt<2)await new Promise(resolve=>setTimeout(resolve,250));}}throw last;}
 async function mesh(name,mat){const d=await meshData(name),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(d.positions,3));g.setIndex(d.indices);if(d.normals)g.setAttribute('normal',new THREE.Float32BufferAttribute(d.normals,3));else g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.scale.setScalar(sceneScale);pivot.add(m);return m;}
 const tooth=await mesh('tooth-display',new THREE.MeshPhongMaterial({color:0xe3ded2,transparent:true,opacity:.34,depthWrite:false,side:THREE.FrontSide,shininess:3}));const canals=await mesh('canals-display',new THREE.MeshPhongMaterial({color:0xbd202c,transparent:true,opacity:.36,depthWrite:false,side:THREE.DoubleSide,shininess:3}));tooth.renderOrder=2;

 const chamberPortal=await new THREE.TextureLoader().loadAsync('chamber-portal.png');chamberPortal.flipY=false;chamberPortal.minFilter=chamberPortal.magFilter=THREE.LinearFilter;
 function openChamber(material,candidate=false){material.onBeforeCompile=shader=>{shader.uniforms.lm6Portal={value:chamberPortal};shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 lm6Local;').replace('#include <begin_vertex>','#include <begin_vertex>\nlm6Local=position;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 lm6Local; uniform sampler2D lm6Portal;').replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(lm6Local.y>8.30 && ('+(candidate?'true':'texture2D(lm6Portal,vec2((lm6Local.x/0.075+130.0)/260.0,(130.0-lm6Local.z/0.075)/260.0)).r>0.5')+'))discard;');};material.customProgramCacheKey=()=> 'lm6-display-access-v7-'+candidate;material.needsUpdate=true;}

 openChamber(tooth.material);openChamber(canals.material,true);
 const oldCanals={visible:false};
 const uncertain=await mesh('uncertain-display',new THREE.MeshPhongMaterial({color:0xe3a12b,side:THREE.DoubleSide}));uncertain.visible=false;
 const openingGroup=new THREE.Group();pivot.add(openingGroup);
 const openingResponse=await fetch('endpoint-markers.json?v=12-calibrated',{cache:'no-store'});if(!openingResponse.ok)throw Error('Endpoint audit unavailable');const openings=await openingResponse.json();
 for(const opening of openings){const indicator=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),new THREE.MeshBasicMaterial({color:0xd69314,wireframe:true,depthTest:false}));indicator.position.fromArray(opening.position).multiplyScalar(sceneScale);indicator.scale.setScalar(sceneScale);indicator.renderOrder=5;openingGroup.add(indicator);}

 const teachingGroup=new THREE.Group();const pathResponse=await fetch('teaching-path.json?v=9',{cache:'no-store'});if(!pathResponse.ok)throw Error('Teaching overlay unavailable');const teachingData=await pathResponse.json();for(const key of ['glidePathPointsMm','illustrativeEntryPointsMm'])if(teachingData[key])teachingData[key]=teachingData[key].map(p=>p.map(v=>v*sceneScale));teachingData.bendPositionMm=teachingData.bendPositionMm.map(v=>v*sceneScale);for(const key of ['curveDepthRangeMm','highlightDepthRangeMm'])teachingData[key]=teachingData[key].map(v=>v*sceneScale);for(const segment of teachingData.bezierSegments){segment.depthRangeMm=segment.depthRangeMm.map(v=>v*sceneScale);segment.controlPointsMm=segment.controlPointsMm.map(p=>p.map(v=>v*sceneScale));}teachingData.visualRadiusMm*=sceneScale;teachingData.highlightRadiusMm*=sceneScale;
 class GlideCurve extends THREE.Curve {constructor(range=teachingData.curveDepthRangeMm){super();this.range=range;}getPoint(t,target=new THREE.Vector3()){const depth=this.range[0]+t*(this.range[1]-this.range[0]);const seg=teachingData.bezierSegments.find(s=>depth<=s.depthRangeMm[1]+1e-9)||teachingData.bezierSegments.at(-1),[a,b]=seg.depthRangeMm,u=THREE.MathUtils.clamp((depth-a)/(b-a),0,1),v=1-u,weights=[v*v*v,3*v*v*u,3*v*u*u,u*u*u];target.set(0,0,0);for(let i=0;i<4;i++)target.addScaledVector(new THREE.Vector3().fromArray(seg.controlPointsMm[i]),weights[i]);return target;}}
 function routeMesh(radius,color,range){const curve=new GlideCurve(range),mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,800,radius,8,false),new THREE.MeshBasicMaterial({color,depthTest:false,depthWrite:false}));mesh.renderOrder=10;teachingGroup.add(mesh);}
 routeMesh(teachingData.visualRadiusMm,0x168bcd,teachingData.curveDepthRangeMm);routeMesh(teachingData.highlightRadiusMm,0x03c4c9,teachingData.highlightDepthRangeMm);
 const bendRing=new THREE.Mesh(new THREE.SphereGeometry(.22,16,10),new THREE.MeshBasicMaterial({color:0x03c4c9,wireframe:true,depthTest:false,depthWrite:false}));bendRing.position.fromArray(teachingData.bendPositionMm);bendRing.renderOrder=11;teachingGroup.add(bendRing);

 let dangerZone=null;let cuspReferenceMarker=null;let instrument=null,filePlaying=false,fileInsertion=1,filePhase=0,fileTime=23;
 let revision='v2';
 function updateVisibility(){tooth.visible=mode!=='canals';canals.visible=mode!=='tooth'&&revision==='v2';oldCanals.visible=mode!=='tooth'&&revision==='v1';uncertain.visible=false;openingGroup.visible=mode!=='tooth'&&$('#openings').checked;teachingGroup.visible=mode!=='tooth'&&$('#teaching-path').checked;if(cuspReferenceMarker)cuspReferenceMarker.visible=mode!=='tooth'&&$('#file').checked&&fileInsertion>.999;if(dangerZone)dangerZone.update(fileInsertion,mode!=='tooth'&&$('#file').checked);if(instrument){instrument.show(mode!=='tooth'&&$('#file').checked);if(mode==='tooth')pauseFile();}}
 const box=new THREE.Box3().setFromObject(pivot),center=box.getCenter(new THREE.Vector3());pivot.position.sub(center);pivot.add(teachingGroup);let mode='combined',auto=false,wholeMotionView=false,motionBounds=null;
 function reset(){wholeMotionView=false;pivot.rotation.set(0,0,0);camera.position.set(24,12,39);controls.target.set(0,0,0);controls.update();auto=false;$('#rotate').classList.remove('active');$('#section').checked=false;tooth.material.clippingPlanes=[];}
 reset();new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(wholeMotionView)fitMotionView();}).observe(stage);
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;updateVisibility();document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));});
 $('#opacity').oninput=()=>{tooth.material.opacity=+$('#opacity').value;tooth.material.transparent=tooth.material.opacity<.99;tooth.material.depthWrite=tooth.material.opacity>=.99;tooth.material.needsUpdate=true;$('#opacity-value').value=Math.round(tooth.material.opacity*100)+'%';};
 function clip(){plane.constant=+$('#cut').value;tooth.material.clippingPlanes=$('#section').checked?[plane]:[];tooth.material.needsUpdate=true;}$('#section').onchange=clip;$('#cut').oninput=clip;
 $('#rotate').onclick=()=>{auto=!auto;$('#rotate').classList.toggle('active',auto);};$('#reset').onclick=()=>{pauseFile();feedFile(1);reset();if($('#file').checked)focusFile();};
 $('#zoom-in').onclick=()=>{wholeMotionView=false;camera.position.sub(controls.target).multiplyScalar(.85).add(controls.target);controls.update();};$('#zoom-out').onclick=()=>{wholeMotionView=false;camera.position.sub(controls.target).multiplyScalar(1.18).add(controls.target);controls.update();};
 $('#teaching-path').onchange=updateVisibility;$('#show-bend').onclick=()=>{$('#opacity').value=.12;$('#opacity').dispatchEvent(new Event('input'));reset();mode='combined';$('#teaching-path').checked=!$('#file').checked;updateVisibility();document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x.dataset.mode==='combined'));const target=new THREE.Vector3().fromArray(teachingData.bendPositionMm).add(pivot.position);controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(3.5,1,-6.1));controls.update();};
 $('#openings').onchange=updateVisibility;updateVisibility();
 function axial(){const f=$('#axial-frame').value;$('#frame-value').textContent=f;$('#axial-image').src=`axial-v4/${$('#overlay').checked?'overlay':'raw'}-${f}.png`;} $('#axial-frame').oninput=axial;$('#overlay').onchange=axial;
 
 instrument=await createFile(pivot,teachingData,sceneScale);dangerZone=await createDangerZone(canals.material,sceneScale);cuspReferenceMarker=new THREE.Mesh(new THREE.SphereGeometry(.045,12,8),new THREE.MeshBasicMaterial({color:0x147c83,transparent:true,opacity:1,depthTest:false,depthWrite:false}));cuspReferenceMarker.position.fromArray(instrument.config.cuspReference.positionMm);cuspReferenceMarker.renderOrder=25;pivot.add(cuspReferenceMarker);
 // The CAD file is deformed in its vertex shader, so its undeformed mesh
 // bounds cannot frame playback. Bound the existing physical rig over the
 // full feed cycle, then combine it with the complete scan-derived tooth.
 tooth.geometry.computeBoundingBox();
 motionBounds=tooth.geometry.boundingBox.clone();
 motionBounds.min.multiplyScalar(sceneScale);motionBounds.max.multiplyScalar(sceneScale);
 let maxDistance=0,maxRadius=0;
 instrument.group.children.forEach((part,i)=>{
  const a=part.geometry.attributes.position;
  for(let j=0;j<a.count;j++){
   maxDistance=Math.max(maxDistance,i===2?instrument.config.cuspReference.calibratedModelTipToStopperArcMm+(15-a.getZ(j))*instrument.config.stopperAxialScale:36-a.getZ(j));
   maxRadius=Math.max(maxRadius,Math.hypot(a.getX(j),a.getY(j))*(i===2?instrument.config.stopperRadialScale:instrument.config.fluteRadialScale));
  }
 });
 const fileBounds=new THREE.Box3();
 for(let f=0;f<=40;f++){
  instrument.set(f/40,0);
  for(let d=0;d<=Math.ceil(maxDistance/.25);d++)fileBounds.expandByPoint(instrument.pointAtDistance(Math.min(maxDistance,d*.25)));
 }
 // Covers radial rotation and the sample interval without changing geometry.
 fileBounds.expandByScalar(maxRadius+.25);motionBounds.union(fileBounds);
 function corners(bounds){const points=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])points.push(new THREE.Vector3(x,y,z));return points;}
 function fitMotionView(){
  if(!motionBounds)return;
  const damping=controls.enableDamping;controls.enableDamping=false;controls.update();
  pivot.updateWorldMatrix(true,true);
  const bounds=motionBounds.clone().applyMatrix4(pivot.matrixWorld),target=bounds.getCenter(new THREE.Vector3());
  const direction=camera.position.clone().sub(controls.target).normalize();
  if(direction.lengthSq()<.5)direction.set(24,12,39).normalize();
  camera.zoom=1;camera.aspect=stage.clientWidth/Math.max(1,stage.clientHeight);camera.updateProjectionMatrix();
  camera.position.copy(target).add(direction);camera.lookAt(target);camera.updateMatrixWorld(true);
  const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
  const tanY=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanX=tanY*camera.aspect,margin=.86;
  let distance=0;
  for(const point of corners(bounds)){
   const offset=point.sub(target),depth=offset.dot(direction);
   distance=Math.max(distance,depth+Math.abs(offset.dot(right))/(tanX*margin),depth+Math.abs(offset.dot(up))/(tanY*margin));
  }
  controls.target.copy(target);camera.position.copy(target).addScaledVector(direction,distance+.5);
  camera.far=Math.max(300,distance+bounds.getSize(new THREE.Vector3()).length()+10);camera.updateProjectionMatrix();
  controls.update();controls.enableDamping=damping;
 }
 controls.addEventListener('start',()=>{wholeMotionView=false;});
 function motionFramingCheck(){
  pivot.updateWorldMatrix(true,true);camera.updateMatrixWorld(true);
  const project=b=>{const ps=corners(b).map(p=>p.project(camera));return {minX:Math.min(...ps.map(p=>p.x)),maxX:Math.max(...ps.map(p=>p.x)),minY:Math.min(...ps.map(p=>p.y)),maxY:Math.max(...ps.map(p=>p.y)),minZ:Math.min(...ps.map(p=>p.z)),maxZ:Math.max(...ps.map(p=>p.z))};};
  return {wholeMotionView,aspect:camera.aspect,tooth:project(new THREE.Box3().setFromObject(tooth)),motion:project(motionBounds.clone().applyMatrix4(pivot.matrixWorld))};
 }
 function pauseFile(){filePlaying=false;$('#file-motion').textContent='Play file motion';}
 function feedFile(value){fileInsertion=THREE.MathUtils.clamp(value,0,1);$('#file-feed').value=fileInsertion*100;$('#file-feed-value').value=Math.round(fileInsertion*100)+'%';instrument.set(fileInsertion,filePhase);if(dangerZone)dangerZone.update(fileInsertion,mode!=='tooth'&&$('#file').checked);if(cuspReferenceMarker)cuspReferenceMarker.visible=fileInsertion>.999&&mode!=='tooth'&&$('#file').checked;}
 function focusFile(){wholeMotionView=false;if(instrument){instrument.group.children[2].material.opacity=1;instrument.group.children[2].material.depthWrite=true;}$('#opacity').value=.34;$('#opacity').dispatchEvent(new Event('input'));const target=new THREE.Vector3(-3.5,fileInsertion<.05?17:11,1).multiplyScalar(sceneScale).add(pivot.position);controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(16,8,fileInsertion<.05?83:73));controls.update();}
 function focusEntry(){wholeMotionView=false;$('#opacity').value=.12;$('#opacity').dispatchEvent(new Event('input'));const target=new THREE.Vector3().fromArray(teachingData.glidePathPointsMm[0]).add(pivot.position);target.y-=3;controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(8,3,25));controls.update();}$('#file-entry-close').onclick=focusEntry;
 function focusStopper(){wholeMotionView=false;instrument.group.children[2].material.opacity=1;instrument.group.children[2].material.depthWrite=true;const target=new THREE.Vector3().fromArray(instrument.config.cuspReference.stopperFrontPositionMm).add(pivot.position);controls.target.copy(target);const tangent=new THREE.Vector3().fromArray(instrument.config.cuspReference.stopperFrontPositionMm).sub(new THREE.Vector3().fromArray(teachingData.glidePathPointsMm[0])).normalize().negate();const radial=new THREE.Vector3().fromArray(instrument.config.cuspReference.positionMm).sub(new THREE.Vector3().fromArray(instrument.config.cuspReference.stopperFrontPositionMm)).normalize();camera.position.copy(target).addScaledVector(radial,4).addScaledVector(tangent,2.7);$('#opacity').value=1;$('#opacity').dispatchEvent(new Event('input'));controls.update();}$('#file-contact-inspect').onclick=()=>{pauseFile();feedFile(1);focusStopper();instrument.group.children[2].material.opacity=.3;instrument.group.children[2].material.depthWrite=false;const target=controls.target.clone();const front=new THREE.Vector3().fromArray(instrument.config.cuspReference.stopperFrontPositionMm);const tangent=front.clone().sub(new THREE.Vector3().fromArray(teachingData.glidePathPointsMm[0])).normalize().negate();const radial=new THREE.Vector3().fromArray(instrument.config.cuspReference.positionMm).sub(front).normalize();const side=new THREE.Vector3().crossVectors(tangent,radial).normalize();camera.position.copy(target).addScaledVector(side,4.8).addScaledVector(tangent,-3).addScaledVector(radial,.6);controls.update();};

 let reviewBands=false;stage.style.position='relative';const bandLabels=[18,19,20,22,24].map(mm=>{const e=document.createElement('span');e.textContent=mm+' mm'+(!teachingView&&mm===19?' (under stopper)':'');e.style.cssText='position:absolute;pointer-events:none;padding:3px 5px;background:#ffffffeb;border:1px solid #276963;border-radius:4px;font-size:12px;color:#15423e;display:none';stage.append(e);return {mm,e};});
 $('#file-bands').onclick=()=>{pauseFile();feedFile(1);$('#file').checked=true;if(mode==='tooth')mode='combined';updateVisibility();focusStopper();reviewBands=true;instrument.group.children[2].material.opacity=.28;instrument.group.children[2].material.depthWrite=false;const front=new THREE.Vector3().fromArray(instrument.config.cuspReference.stopperFrontPositionMm),entry=new THREE.Vector3().fromArray(teachingData.glidePathPointsMm[0]),t=entry.clone().sub(front).normalize(),radial=new THREE.Vector3().fromArray(instrument.config.cuspReference.positionMm).sub(front).normalize(),side=new THREE.Vector3().crossVectors(t,radial).normalize();const target=entry.clone().addScaledVector(t,instrument.length-21).add(pivot.position);controls.target.copy(target);camera.position.copy(target).addScaledVector(side,16).addScaledVector(radial,1);$('#opacity').value=.12;$('#opacity').dispatchEvent(new Event('input'));controls.update();};
 for(const id of ['file-contact-inspect','file-focus','file-entry-close','file-end','file-motion','show-bend','reset'])$('#'+id).addEventListener('click',()=>{reviewBands=false;});$('#file-feed').addEventListener('input',()=>{reviewBands=false;});$('#file').addEventListener('change',()=>{reviewBands=false;});
 function updateBandLabels(){const front=new THREE.Vector3().fromArray(instrument.config.cuspReference.stopperFrontPositionMm),entry=new THREE.Vector3().fromArray(teachingData.glidePathPointsMm[0]),t=entry.clone().sub(front).normalize();for(const label of bandLabels){label.e.style.display=reviewBands&&instrument.group.visible?'block':'none';if(!reviewBands)continue;const point=pivot.localToWorld(instrument.pointAtDistance(label.mm)).project(camera);label.e.style.left=Math.min(stage.clientWidth-label.e.offsetWidth-4,Math.max(4,(point.x+1)*stage.clientWidth/2+13))+'px';label.e.style.top=Math.max(4,(1-point.y)*stage.clientHeight/2-9)+'px';}}
 function smoothFeed(a,b,t){t=THREE.MathUtils.clamp(t,0,1);return a+(b-a)*t*t*(3-2*t);}
 function cycleFeed(t){if(t<2)return 0;if(t<8)return smoothFeed(0,.2,(t-2)/6);if(t<17)return smoothFeed(.2,.84,(t-8)/9);if(t<22)return smoothFeed(.84,1,(t-17)/5);if(t<25)return 1;return smoothFeed(1,0,(t-25)/7);}
 $('#file').onchange=()=>{pauseFile();updateVisibility();if($('#file').checked)focusFile();};
 $('#file-feed').oninput=()=>{pauseFile();$('#file').checked=true;feedFile(+$('#file-feed').value/100);updateVisibility();};
 $('#file-motion').onclick=()=>{if(filePlaying){pauseFile();return;}fileTime=0;filePhase=0;feedFile(0);$('#file').checked=true;mode='combined';document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x.dataset.mode==='combined'));updateVisibility();$('#opacity').value=.12;$('#opacity').dispatchEvent(new Event('input'));instrument.group.children[2].material.opacity=1;instrument.group.children[2].material.depthWrite=true;wholeMotionView=true;fitMotionView();filePlaying=true;$('#file-motion').textContent='Pause file motion';};
 $('#file-end').onclick=()=>{pauseFile();feedFile(1);focusFile();};$('#file-focus').onclick=focusFile;
 feedFile(1);updateVisibility();focusFile();
 const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)pauseFile();});

 window.lm6Check=()=>({loaded:true,framing:motionFramingCheck(),dangerZone:dangerZone.state(),teachingView,sceneScale,bottomFaceDistanceMm:instrument.config.cuspReference.calibratedModelTipToStopperArcMm,markerStationsMm:instrument.config.physicalMarkerAudit.bands.map(b=>b.centre),mode,revision,uncertain:uncertain.visible,cutaway:$('#section').checked,opacity:tooth.material.opacity,rotation:pivot.rotation.toArray(),camera:camera.position.toArray(),vertices:tooth.geometry.attributes.position.count,canalVertices:canals.geometry.attributes.position.count,teachingPath:teachingGroup.visible,teachingPointCount:teachingData.glidePathPointsMm.length,frame:+$('#axial-frame').value,fileVisible:instrument.group.visible,fileInsertion,filePlaying,filePhase,fileTime,filePartCount:instrument.group.children.length,fileSchematic:true,fileFeedArcMm:instrument.state().feedArcMm,stopperAtCusp:instrument.state().stopperAtCusp});
 let lastFrame=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min(.06,Math.max(0,(now-lastFrame)/1000));lastFrame=now;if(auto){pivot.rotation.y+=.004;if(wholeMotionView)fitMotionView();}if(filePlaying&&!document.hidden){fileTime=Math.min(32,fileTime+dt);filePhase+=dt*4*Math.PI;feedFile(cycleFeed(fileTime));if(fileTime>=32)pauseFile();}controls.update();dangerZone.tick(now);renderer.render(scene,camera);updateBandLabels();}requestAnimationFrame(frame);
}boot().catch(e=>{$('#viewer-error').textContent='Viewer error: '+e.message;$('#viewer-error').hidden=false;console.error(e);document.dispatchEvent(new Event('lm6-viewer-error'))});
