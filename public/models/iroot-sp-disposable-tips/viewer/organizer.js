import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const stage=document.getElementById('stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0x1b303c,0);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
stage.append(renderer.domElement);
renderer.domElement.tabIndex=0;
renderer.domElement.setAttribute('role','img');
renderer.domElement.setAttribute('aria-label','Rotatable iRoot SP Disposable Tips organizer. Use arrow keys to rotate, plus and minus to zoom, or zero to reset.');
let frameRequest=0;
function requestRender(){if(!frameRequest&&!document.hidden)frameRequest=requestAnimationFrame(render);}

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,1,.001,20);
camera.position.set(.23,.16,.29);
const controls=new OrbitControls(camera,renderer.domElement);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
controls.enableDamping=!reducedMotion.matches;controls.dampingFactor=.09;controls.minDistance=.12;controls.maxDistance=1.1;
reducedMotion.addEventListener('change',()=>{controls.enableDamping=!reducedMotion.matches;requestRender();});
controls.maxPolarAngle=Math.PI;controls.target.set(0,0,0);
scene.add(new THREE.HemisphereLight(0xe6f6ff,0x48606a,2));
for(const [position,color,intensity] of [[[.2,.35,.25],0xeaf6ff,3.5],[[-.28,.14,-.15],0x9ac3dc,2],[[.15,.2,-.35],0xffe6c6,2.8]]){
    const light=new THREE.DirectionalLight(color,intensity);light.position.set(...position);scene.add(light);
}
const pose=new THREE.Group();scene.add(pose);
const product=new THREE.Group();product.position.y=-.0375;pose.add(product);
const singleHolder=new THREE.Group();singleHolder.visible=false;scene.add(singleHolder);
const tips=[],shells=[],labels=[],materials=[],geometryCache=new Map();
const tipMaterials={hub:null,nozzle:null,outlet:null};
const requestedParams=new URLSearchParams(location.search);
const requestedView=requestedParams.get('view');
let singleTip=null,tipDetailSide=-1;
const tipOpacityByView={assembly:.12,single:.35};
let selectedView=['1','2','3','4','5','6'].includes(requestedView)?requestedView:'3',visibleLayer=0,opacity=.12,tipOpacity=tipOpacityByView[requestedView==='5'?'single':'assembly'],loaded=false,errorLog=[];

// Read the Blender-exported static indexed GLB. The original PNG artwork is
// used for the labels here and is also embedded in the downloadable GLB.
async function loadProduct(){
    const response=await fetch('./model.glb?v=two-side-outlets-20261020');
    if(!response.ok)throw new Error('Model download failed ('+response.status+')');
    const data=await response.arrayBuffer();
    const view=new DataView(data);
    if(view.getUint32(0,true)!==0x46546c67)throw new Error('Invalid GLB header');
    let json,binaryOffset=0;
    for(let offset=12;offset<data.byteLength;){
        const size=view.getUint32(offset,true),kind=view.getUint32(offset+4,true);
        if(kind===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(new Uint8Array(data,offset+8,size)));
        if(kind===0x004e4942)binaryOffset=offset+8;
        offset+=8+size;
    }
    function attribute(i){
        const a=json.accessors[i],b=json.bufferViews[a.bufferView],n={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];
        const C={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array}[a.componentType];
        if(b.byteStride&&b.byteStride!==n*C.BYTES_PER_ELEMENT)throw new Error('Unexpected interleaved GLB buffer');
        return new THREE.BufferAttribute(new C(data,binaryOffset+(b.byteOffset||0)+(a.byteOffset||0),a.count*n),n,!!a.normalized);
    }
    function geometry(meshIndex,primitiveIndex){
        const key=meshIndex+':'+primitiveIndex;if(geometryCache.has(key))return geometryCache.get(key);
        const p=json.meshes[meshIndex].primitives[primitiveIndex],g=new THREE.BufferGeometry();
        g.setAttribute('position',attribute(p.attributes.POSITION));
        if(p.attributes.TEXCOORD_0!==undefined)g.setAttribute('uv',attribute(p.attributes.TEXCOORD_0));
        if(p.attributes.NORMAL!==undefined)g.setAttribute('normal',attribute(p.attributes.NORMAL));else g.computeVertexNormals();
        if(p.indices!==undefined)g.setIndex(attribute(p.indices));g.computeBoundingSphere();geometryCache.set(key,g);return g;
    }
    const tipMaterial=new THREE.MeshPhysicalMaterial({color:0xaebfc4,roughness:.14,metalness:0,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide,clearcoat:.65,clearcoatRoughness:.10});
    const nozzleMaterial=new THREE.MeshPhysicalMaterial({color:0xb6ced2,roughness:.07,metalness:0,transparent:true,opacity:.08,depthWrite:false,side:THREE.DoubleSide,clearcoat:.8,clearcoatRoughness:.07});
    const outletMaterial=new THREE.MeshPhysicalMaterial({color:0x526d78,roughness:.28,metalness:0,transparent:true,opacity:.12,depthWrite:false,side:THREE.FrontSide,clearcoat:.35,clearcoatRoughness:.18});
    tipMaterials.hub=tipMaterial;tipMaterials.nozzle=nozzleMaterial;tipMaterials.outlet=outletMaterial;
    const labelMaps=new Map();
    await Promise.all(json.nodes.filter(n=>n.extras?.component==='packaging_label').map(async n=>{
        const file=n.extras.label_art_file;
        const texture=await new THREE.TextureLoader().loadAsync('./artwork/'+file+'?v=round-label-100mm-20261020');
        texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=false;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
        labelMaps.set(file,texture);
    }));
    const labelBacking=new THREE.MeshStandardMaterial({color:0xf1f1ed,roughness:.65,metalness:0,side:THREE.FrontSide});
    const nodes=json.nodes.map((node)=>{
        const group=new THREE.Group();group.name=node.name||'';group.userData=node.extras||{};
        if(node.matrix){group.matrix.fromArray(node.matrix);group.matrix.decompose(group.position,group.quaternion,group.scale);}
        else{if(node.translation)group.position.fromArray(node.translation);if(node.rotation)group.quaternion.fromArray(node.rotation);if(node.scale)group.scale.fromArray(node.scale);}
        if(node.mesh!==undefined){
            const isTip=group.userData.component==='irrigation_tip'||group.name.startsWith('Irrigation tip');
            const isLabel=group.userData.component==='packaging_label';
            const isEdge=/rim|lip|rib|bead|molding/i.test(group.name);
            let material=tipMaterial;
            if(isLabel){material=labelBacking;labels.push(group);}
            else if(!isTip){
                material=new THREE.MeshPhysicalMaterial({color:0xbad6df,roughness:.13,metalness:.12,transparent:true,opacity:isEdge?.32:.10,depthWrite:false,side:THREE.DoubleSide,clearcoat:1,clearcoatRoughness:.08});
                material.userData.isEdge=isEdge;materials.push(material);shells.push(group);
            }else tips.push(group);
            json.meshes[node.mesh].primitives.forEach((p,i)=>{
                const isOutlet=isTip&&/cut-wall/i.test(json.materials?.[p.material]?.name||'');
                const isNozzle=isTip&&/nozzles/i.test(json.materials?.[p.material]?.name||'');
                const isArtwork=isLabel&&/Artwork/i.test(json.materials?.[p.material]?.name||'');
                const artwork=isArtwork?new THREE.MeshBasicMaterial({map:labelMaps.get(group.userData.label_art_file),color:0xffffff,toneMapped:false,side:THREE.FrontSide}):null;
                group.add(new THREE.Mesh(geometry(node.mesh,i),artwork||(isOutlet?outletMaterial:isNozzle?nozzleMaterial:material)));
            });
        }
        return group;
    });
    json.nodes.forEach((n,i)=>(n.children||[]).forEach(c=>nodes[i].add(nodes[c])));
    for(const i of json.scenes[json.scene||0].nodes)product.add(nodes[i]);
    if(tips.length!==100)throw new Error('Expected exactly 100 irrigation tips');
    for(let i=1;i<=5;i++)if(tips.filter(t=>t.userData.layer===i).length!==20)throw new Error('Layer count mismatch');
    const single=tips[0].clone(true);single.position.set(0,0,0);single.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI);single.scale.set(1,1,1);singleHolder.add(single);
    const center=new THREE.Box3().setFromObject(single).getCenter(new THREE.Vector3());single.position.sub(center);
    singleTip=single;
    loaded=true;document.getElementById('loading').hidden=true;setOpacity(opacity);setView(selectedView);updateState();
    if(selectedView==='5'&&requestedParams.get('detail')==='outlets')focusSideOutlets();
}
const rad=THREE.MathUtils.degToRad;
const blenderToThree=v=>new THREE.Vector3(v.x,v.z,-v.y);
function fitDistance(){
    const aspect=stage.clientWidth/stage.clientHeight;
    const limitingHalfAngle=Math.atan(Math.tan(rad(camera.fov/2))*Math.min(1,aspect));
    return (selectedView==='5'?.031:.086)/Math.sin(limitingHalfAngle)*1.10;
}
function trayShell(group,layer){
    const n=group.name;
    return group.userData.tray_layer===layer||n.startsWith(`Tier ${layer} - clear outer wall`)||
        (layer===1?n==='Bottom - clear molded plate 0.7 mm':n===`Clear separator plate ${layer-1} - 0.45 mm`)||
        (layer===5?/Top lid - (outer polished rim|inner concentric rim)/.test(n):n.startsWith(`Tier ${layer} to ${layer+1} -`));
}
function applyInspection(){
    product.visible=selectedView!=='5';singleHolder.visible=selectedView==='5';
    tips.forEach(t=>t.visible=visibleLayer===0||t.userData.layer===visibleLayer);
    shells.forEach(s=>s.visible=selectedView==='4'?trayShell(s,visibleLayer||5):true);
    labels.forEach(label=>label.visible=selectedView!=='4'&&selectedView!=='5');
    product.position.y=selectedView==='4'?-(8+((visibleLayer||5)-1)*14.75)/1000:-.0375;
    document.getElementById('layer').disabled=selectedView==='5';document.getElementById('opacity').disabled=selectedView==='5';
    document.getElementById('status').textContent=selectedView==='5'?'One tip enlarged · full assembly retains all 100 tips':visibleLayer?`Layer ${visibleLayer} · 20 tips · no missing position`:'100 individual tips visible';
}
function setView(id){
    selectedView=id;tipDetailSide=-1;
    const outletButton=document.getElementById('tip-outlet-zoom');
    outletButton.hidden=id!=='5';outletButton.textContent='Zoom to side outlets';
    setTipOpacity(tipOpacityByView[id==='5'?'single':'assembly']);
    const presets={'1':{e:88,a:-90,r:0,label:'Top view · Near overhead'},'2':{e:39,a:-60,r:-14,label:'Side view · Resting on its side'},'3':{e:33,a:-70,r:-2,label:'Full stack · Standing'},'4':{e:89.5,a:-90,r:0,label:'Open tray · all 20 positions filled'},'5':{e:50,a:-70,r:0,label:'Single tip · winged hub, short elbow, straight nozzle'},'6':{e:-78,a:-90,r:0,label:'Back label · smaller underside label'}};
    const p=presets[id];pose.quaternion.identity();
    visibleLayer=id==='4'?5:0;document.getElementById('layer').value=String(visibleLayer);applyInspection();
    controls.minDistance=id==='5'?.0015:.12;
    camera.near=id==='5'?.00005:.001;camera.updateProjectionMatrix();
    if(id==='2')pose.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(-.85,0,-.526).normalize());
    const e=rad(p.e),a=rad(p.a),position=blenderToThree(new THREE.Vector3(Math.cos(e)*Math.cos(a),Math.cos(e)*Math.sin(a),Math.sin(e))).multiplyScalar(fitDistance());
    controls.target.set(0,0,0);camera.up.set(0,1,0);camera.position.copy(position);camera.lookAt(controls.target);camera.rotateZ(rad(p.r));
    camera.up.copy(new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion));controls.update();
    document.getElementById('view-label').textContent=p.label;
    document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===id);b.setAttribute('aria-pressed',String(b.dataset.view===id));});
    updateState();
}
function focusSideOutlets(){
    if(!loaded||selectedView!=='5'||!singleTip)return;
    const data=singleTip.userData;
    if(data.side_outlet_count!==2)return;
    tipDetailSide=(tipDetailSide+1)%2;
    singleTip.updateWorldMatrix(true,false);
    const point=blenderToThree(new THREE.Vector3().fromArray(data.side_outlet_midpoint_local_mm)).multiplyScalar(.001);
    const focus=singleTip.localToWorld(point);
    const rotation=singleTip.getWorldQuaternion(new THREE.Quaternion());
    const axis=blenderToThree(new THREE.Vector3().fromArray(data.nozzle_axis_local)).normalize().applyQuaternion(rotation);
    const direction=blenderToThree(new THREE.Vector3().fromArray(data.side_outlet_camera_direction_local)).applyQuaternion(rotation);
    const radial=direction.addScaledVector(axis,-direction.dot(axis));
    if(tipDetailSide===1)radial.negate();
    direction.copy(radial).addScaledVector(axis,.35).normalize();
    controls.target.copy(focus);camera.position.copy(focus).addScaledVector(direction,.004);
    camera.up.copy(axis).negate();camera.lookAt(focus);controls.update();
    document.getElementById('tip-outlet-zoom').textContent='View opposite outlet';
    document.getElementById('view-label').textContent=`Tip outlets · Side ${tipDetailSide+1} of 2`;
    document.getElementById('status').textContent='Two opposed curved side outlets · Drag to rotate and inspect';
    updateState();
    stage.scrollIntoView({block:'start',behavior:'instant'});
}
function setOpacity(value){
    opacity=value;
    materials.forEach(m=>m.opacity=m.userData.isEdge?Math.min(.75,value*2.5):value*.75);
    document.getElementById('opacity-value').textContent=Math.round(value*100)+'%';updateState();
}
function setTipOpacity(value){
    tipOpacity=value;
    tipOpacityByView[selectedView==='5'?'single':'assembly']=value;
    if(tipMaterials.hub)tipMaterials.hub.opacity=value;
    if(tipMaterials.nozzle)tipMaterials.nozzle.opacity=value*2/3;
    if(tipMaterials.outlet)tipMaterials.outlet.opacity=value;
    document.getElementById('tip-opacity').value=String(Math.round(value*100));
    document.getElementById('tip-opacity-value').textContent=Math.round(value*100)+'%';updateState();
}
function updateState(){
    requestRender();
    stage.dataset.model=JSON.stringify({loaded,revision:'two-side-outlets-single-tip-35-20261020',tipCount:tips.length,tipsByLayer:[1,2,3,4,5].map(i=>tips.filter(t=>t.userData.layer===i).length),caseComponents:shells.length,labelCount:labels.length,labelsVisible:labels.filter(l=>l.visible).map(l=>l.userData.label_side),labelWidthsMm:labels.map(l=>({side:l.userData.label_side,width:l.userData.label_width_mm,height:l.userData.label_height_mm,shape:l.userData.label_shape||'rectangle',diameter:l.userData.label_diameter_mm||null})),view:selectedView,visibleLayer,visibleTips:selectedView==='5'?1:tips.filter(t=>t.visible).length,caseOpacity:opacity,hubSurfaceOpacity:tipOpacity,nozzleSurfaceOpacity:tipOpacity*2/3,sideOutletsPerTip:tips[0]?.userData.side_outlet_count||0,closedRoundedEnd:tips[0]?.userData.closed_rounded_end||false,tipDetailSide,straightNozzleMm:35,gripWingsPerTip:2,missingPositionRestored:true,cameraPosition:camera.position.toArray(),cameraQuaternion:camera.quaternion.toArray(),errors:errorLog});
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
document.getElementById('tip-outlet-zoom').addEventListener('click',focusSideOutlets);
document.getElementById('opacity').addEventListener('input',e=>setOpacity(Number(e.target.value)/100));
document.getElementById('tip-opacity').addEventListener('input',e=>setTipOpacity(Number(e.target.value)/100));
document.getElementById('layer').addEventListener('change',e=>{
    visibleLayer=Number(e.target.value);
    if(selectedView==='4'&&visibleLayer===0){setView('3');return;}
    applyInspection();updateState();
});
controls.addEventListener('end',updateState);
controls.addEventListener('change',requestRender);
renderer.domElement.addEventListener('keydown',e=>{
    const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0'];
    if(!keys.includes(e.key))return;e.preventDefault();
    if(e.key==='0'){setView(selectedView);return;}
    const offset=camera.position.clone().sub(controls.target);
    if(['+','=','-'].includes(e.key))offset.multiplyScalar(e.key==='-'?1.12:1/1.12).clampLength(controls.minDistance,controls.maxDistance);
    else {const spherical=new THREE.Spherical().setFromVector3(offset);spherical.theta+=e.key==='ArrowLeft'?.10:e.key==='ArrowRight'?-.10:0;spherical.phi+=e.key==='ArrowUp'?-.10:e.key==='ArrowDown'?.10:0;spherical.makeSafe();offset.setFromSpherical(spherical);}
    camera.position.copy(controls.target).add(offset);controls.update();updateState();
});
new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))requestRender();}).observe(stage);
document.addEventListener('visibilitychange',requestRender);
window.addEventListener('error',e=>{errorLog.push(e.message);updateState();});
let previousFitDistance;
function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
    const nextFitDistance=fitDistance();
    if(previousFitDistance&&loaded){camera.position.sub(controls.target).multiplyScalar(nextFitDistance/previousFitDistance).add(controls.target);controls.update();}
    previousFitDistance=nextFitDistance;
}
new ResizeObserver(()=>{resize();requestRender();}).observe(stage);resize();
function render(){frameRequest=0;if(document.hidden)return;controls.update();renderer.render(scene,camera);}requestRender();
loadProduct().catch(e=>{errorLog.push(String(e));document.getElementById('loading').hidden=true;renderer.domElement.hidden=true;document.getElementById('fallback').hidden=false;document.getElementById('error').textContent='Unable to load the interactive model. Use the Product page link to return to the previews.';document.querySelectorAll('button,select,input').forEach(c=>c.disabled=true);updateState();});
