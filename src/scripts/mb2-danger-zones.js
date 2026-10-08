import * as THREE from 'three';
import './mb2-danger-zones.css';

export function createDangerZones({stage, pivot, camera, canal, config, points, seek}) {
  stage.classList.add('mb2-danger-stage');
  // Illustrative route stations for anatomical review, not calibrated millimetres.
  const zones = [
    {station: 3, title: 'Hidden MB2 curve', text: '3 millimeters from the pulp chamber floor.'},
    {station: 4.957469, title: 'MB1 to MB2 confluence', text: 'Second danger point: the curve at the canal junction.'},
  ];
  const panel = document.createElement('div');
  panel.className = 'mb2-danger-panel';
  panel.hidden = false;
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'mb2-danger-eyebrow';
  const title = document.createElement('h2');
  const description = document.createElement('p');
  panel.append(eyebrow, title, description);
  title.textContent = 'Danger Zone';
  description.textContent = 'Two designated illustrative route points.';
  eyebrow.hidden = true;
  document.querySelector('header').append(panel);
  const navigation = document.createElement('div');
  navigation.className = 'mb2-danger-navigation';
  navigation.setAttribute('aria-label', 'Canal danger points');
  document.querySelector('.instrument').append(navigation);
  const reveal = () => {
    if (matchMedia('(max-width:720px)').matches) stage.scrollIntoView({block: 'start', behavior: 'instant'});
  };
  const markers = zones.map((zone, index) => {
    const sample = Math.max(0, Math.min(points.length / 3 - 1, Math.round((zone.station - config.start) / config.step)));
    const position = new THREE.Vector3().fromArray(points, sample * 3);
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'mb2-danger-marker';
    marker.textContent = String(index + 1);
    marker.title = zone.title;
    marker.setAttribute('aria-label', `Inspect danger point ${index + 1}: ${zone.title}`);
    marker.onclick = () => {
      seek(zone.station);
      reveal();
    };
    // Keep the separate inspection controls; omit numbered overlays from the 3D canvas.
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `Danger point ${index + 1}`;
    button.onclick = marker.onclick;
    navigation.append(button);
    return {position, marker, button};
  });
  const sample = station => {const f=Math.max(0,Math.min(points.length/3-1,(station-config.start)/config.step)),i=Math.floor(f),j=Math.min(i+1,points.length/3-1);return new THREE.Vector3().fromArray(points,i*3).lerp(new THREE.Vector3().fromArray(points,j*3),f-i);};
  const paths=zones.map(z=>Array.from({length:33},(_,i)=>sample(z.station-.45+i*.9/32)));
  const uniforms={upperDangerActive:{value:0},upperEntryBrightening:{value:0},upperDangerPoints:{value:paths[0].map(p=>p.clone())},upperDangerStart:{value:new THREE.Vector3()},upperDangerEnd:{value:new THREE.Vector3()}};
  canal.traverse(mesh=>{if(!mesh.isMesh)return;for(const material of(Array.isArray(mesh.material)?mesh.material:[mesh.material])){
    const previous=material.onBeforeCompile;
    material.onBeforeCompile=shader=>{previous(shader);Object.assign(shader.uniforms,uniforms);
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 upperWorld;').replace('#include <project_vertex>','#include <project_vertex>\nupperWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 upperWorld;uniform float upperDangerActive,upperEntryBrightening;uniform vec3 upperDangerPoints[33],upperDangerStart,upperDangerEnd;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float zoneDistance=1e6;
        for(int zi=0;zi<32;zi++){vec3 za=upperDangerPoints[zi],zd=upperDangerPoints[zi+1]-za;float zu=clamp(dot(upperWorld-za,zd)/max(dot(zd,zd),1e-12),0.0,1.0);zoneDistance=min(zoneDistance,length(upperWorld-za-zd*zu));}
        float zoneStart=dot(upperWorld-upperDangerPoints[0],upperDangerStart),zoneEnd=dot(upperWorld-upperDangerPoints[32],upperDangerEnd);
        float upperZoneMask=upperDangerActive*step(0.0,zoneStart)*step(zoneEnd,0.0)*(1.0-smoothstep(0.256,0.32,zoneDistance));
        diffuseColor.a=mix(diffuseColor.a,max(diffuseColor.a,0.82+0.04*upperEntryBrightening),upperZoneMask);
      `).replace('#include <opaque_fragment>','outgoingLight=mix(outgoingLight,vec3(1.05,0.003,0.009)*(1.0+0.20*upperEntryBrightening),upperZoneMask);\n#include <opaque_fragment>');
    };material.customProgramCacheKey=()=> 'upper-designated-route-zone-v1';material.needsUpdate=true;
  }});
  const motion=matchMedia('(prefers-reduced-motion:reduce)');
  let active = null, currentFeed=0, entryStart=null, entryCount=0, changed=true;
  motion.addEventListener('change',()=>{if(motion.matches){entryStart=null;uniforms.upperEntryBrightening.value=0;changed=true;}});
  return {
    reveal,
    near: feed => zones.some(zone => Math.abs(feed - zone.station) < .45),
    update(feed, shown) {
      currentFeed=feed;
      const next = shown ? zones.findIndex(zone => Math.abs(feed - zone.station) < .45) : -1;
      if (active !== next) {
        if(next>=0&&active!==null&&!motion.matches){entryStart=performance.now();entryCount++;}else{entryStart=null;uniforms.upperEntryBrightening.value=0;}
        active = next;changed=true;uniforms.upperDangerActive.value=active>=0?1:0;
        panel.classList.toggle('is-active',active>=0);
        if (active >= 0) {
          eyebrow.textContent = `Danger point ${active + 1}`;
          description.textContent = active === 0 ? 'Danger point 1, hidden MB2 curve. It’s very easy to ledge here. Please use Mini Magic MicroPath file.' : 'Danger point 2, MB1 to MB2 confluence. Because of unpredictability of anatomy in this area, it’s very easy to ledge here.';
        } else {
          description.textContent = 'Two designated illustrative route points.';
        }
      }
      pivot.updateWorldMatrix(true, false);
      if(active>=0){const path=paths[active];for(let i=0;i<33;i++)uniforms.upperDangerPoints.value[i].copy(path[i]).applyMatrix4(pivot.matrixWorld);uniforms.upperDangerStart.value.subVectors(path[1],path[0]).normalize().transformDirection(pivot.matrixWorld);uniforms.upperDangerEnd.value.subVectors(path[32],path[31]).normalize().transformDirection(pivot.matrixWorld);}
      camera.updateMatrixWorld();
      const canvas = stage.querySelector('canvas');
      markers.forEach(({position, marker, button}, index) => {
        const projected = pivot.localToWorld(position.clone()).project(camera);
        const x = (projected.x + 1) * canvas.clientWidth / 2 + canvas.offsetLeft;
        const y = (1 - projected.y) * canvas.clientHeight / 2 + canvas.offsetTop;
        marker.hidden = !shown || active>=0 || projected.z < -1 || projected.z > 1 || x < 16 || x > stage.clientWidth - 16 || y < 16 || y > stage.clientHeight - 16;
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        marker.classList.toggle('is-active', index === active);
        button.setAttribute('aria-pressed', String(index === active));
      });
    },
    tick(now){const old=uniforms.upperEntryBrightening.value;if(active<0||motion.matches||entryStart===null)uniforms.upperEntryBrightening.value=0;else{const t=Math.max(0,(now-entryStart)/900);uniforms.upperEntryBrightening.value=t<1?Math.sin(Math.PI*t):0;if(t>=1)entryStart=null;}const render=changed||old!==uniforms.upperEntryBrightening.value;changed=false;return render;},
    state:()=>({active:active>=0,activePoint:active>=0?active+1:null,feed:currentFeed,intervals:zones.map(z=>({station:z.station,start:z.station-.45,end:z.station+.45,inclusive:false})),trigger:'tip position only',anatomicalRiskValidated:false,calibratedMillimetres:false,entryBrightening:uniforms.upperEntryBrightening.value,entryBrighteningCount:entryCount,reducedMotion:motion.matches,brighteningDurationMs:900,outlineOrHalo:false}),
  };
}
