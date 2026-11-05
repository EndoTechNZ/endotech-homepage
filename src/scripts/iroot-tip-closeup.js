import * as THREE from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';

const section = document.querySelector('[data-tip-scroll]');
const card = section?.querySelector('[data-tip-card]');
const stage = section?.querySelector('[data-tip-closeup]');
const progressBar = section?.querySelector('[data-tip-progress]');
const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;

if (section && card && stage) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer, model, spin, axis;
  let frame = 0, previousTime = 0, visible = false, hovering = false;
  let scrollProgress = 0, hoverAngle = 0, displayedAngle = 0;
  let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
  let rotationStart = 0, rotationTravel = 1;
  const camera = new THREE.PerspectiveCamera(40, 1, .00001, .1);
  camera.position.set(0, 0, .00242);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#c6c7c7');
  const presentation = new THREE.Group();
  scene.add(presentation);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x252c30, 1.3));
  for (const [position, intensity] of [[[.003,.004,.006], 3.2], [[-.004,.001,.002], 1.4], [[.001,-.004,-.002], 1.8]]) {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(...position);
    scene.add(light);
  }

  const requestFrame = () => {
    if (!frame && visible && renderer && model && !document.hidden) frame = requestAnimationFrame(render);
  };

  function updateScroll() {
    scrollProgress = clamp((window.scrollY - rotationStart) / rotationTravel, 0, 1);
    section.dataset.scrollDegrees = (scrollProgress * 360).toFixed(2);
    progressBar.style.transform = `scaleX(${scrollProgress})`;
    requestFrame();
  }

  function measure() {
    section.style.setProperty('--tip-card-height', `${card.offsetHeight}px`);
    const inset = parseFloat(getComputedStyle(card).top) || 24;
    rotationStart = section.getBoundingClientRect().top + scrollY - inset;
    rotationTravel = Math.max(1, section.offsetHeight - card.offsetHeight);
    const width = stage.clientWidth, height = stage.clientHeight;
    if (renderer && width && height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    updateScroll();
  }

  function render(time) {
    frame = 0;
    if (!visible || document.hidden || !model) { previousTime = 0; return; }
    const elapsed = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    if (hovering && !motion.matches) hoverAngle += elapsed * THREE.MathUtils.degToRad(30);
    const targetAngle = (motion.matches ? 0 : scrollProgress * TAU) + hoverAngle;
    const ease = motion.matches ? 1 : 1 - Math.exp(-14 * Math.max(elapsed, 1/60));
    displayedAngle += (targetAngle - displayedAngle) * ease;
    const targetTiltX=motion.matches ? 0 : pointerY * .055;
    const targetTiltY=motion.matches ? 0 : pointerX * .055;
    tiltX += (targetTiltX - tiltX) * ease;
    tiltY += (targetTiltY - tiltY) * ease;
    spin.quaternion.setFromAxisAngle(axis, displayedAngle);
    presentation.rotation.x = tiltX;
    presentation.rotation.y = tiltY;
    renderer.render(scene, camera);
    stage.dataset.ready = 'true';
    stage.dataset.displayDegrees = THREE.MathUtils.radToDeg(displayedAngle).toFixed(2);
    stage.dataset.hovering = String(hovering);
    if ((hovering && !motion.matches) || Math.abs(targetAngle-displayedAngle) > .0003 || Math.abs(targetTiltY-tiltY) > .0003 || Math.abs(targetTiltX-tiltX) > .0003) requestFrame();
    else previousTime = 0;
  }

  // Keep the original Blender vertices and two opposed outlets. Only the
  // material, camera and presentation transform differ from the full viewer.
  async function loadOriginalTip() {
    const response = await fetch('/models/iroot-sp-disposable-tips/viewer/model.glb');
    if (!response.ok) throw new Error(`Model response ${response.status}`);
    const data = await response.arrayBuffer();
    const view = new DataView(data);
    if (view.getUint32(0, true) !== 0x46546c67) throw new Error('Invalid model header');
    let document, binaryOffset;
    for (let offset=12; offset<data.byteLength;) {
      const size=view.getUint32(offset,true), kind=view.getUint32(offset+4,true);
      if (kind===0x4e4f534a) document=JSON.parse(new TextDecoder().decode(new Uint8Array(data,offset+8,size)));
      if (kind===0x004e4942) binaryOffset=offset+8;
      offset+=size+8;
    }
    const node=document.nodes.find(node=>node.extras?.component==='irrigation_tip');
    if (!node || node.extras.side_outlet_count!==2) throw new Error('Original two-outlet tip missing');
    const sourceToWeb = values => new THREE.Vector3(values[0], values[2], -values[1]);
    axis=sourceToWeb(node.extras.nozzle_axis_local).normalize();
    const focus=sourceToWeb(node.extras.side_outlet_midpoint_local_mm).multiplyScalar(.001);
    const radial=sourceToWeb(node.extras.side_outlet_camera_direction_local);
    radial.addScaledVector(axis,-radial.dot(axis)).normalize();
    const tangent=new THREE.Vector3().crossVectors(axis,radial).normalize();
    const desiredAxis=new THREE.Vector3(.75,.60,.38).normalize();
    const desiredRadial=new THREE.Vector3(0,0,1).addScaledVector(desiredAxis,-desiredAxis.z).normalize();
    const desiredTangent=new THREE.Vector3().crossVectors(desiredAxis,desiredRadial).normalize();
    const sourceBasis=new THREE.Matrix4().makeBasis(axis,radial,tangent);
    const targetBasis=new THREE.Matrix4().makeBasis(desiredAxis,desiredRadial,desiredTangent);
    const orientation=new THREE.Group();
    orientation.quaternion.setFromRotationMatrix(targetBasis.multiply(sourceBasis.invert()));
    presentation.add(orientation);
    spin=new THREE.Group();
    orientation.add(spin);
    model=new THREE.Group();
    model.position.copy(focus).negate();
    spin.add(model);
    function attribute(index) {
      const a=document.accessors[index], b=document.bufferViews[a.bufferView];
      const count={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];
      const Type={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array}[a.componentType];
      if (b.byteStride && b.byteStride!==count*Type.BYTES_PER_ELEMENT) throw new Error('Unexpected vertex format');
      return new THREE.BufferAttribute(new Type(data,binaryOffset+(b.byteOffset||0)+(a.byteOffset||0),a.count*count),count,!!a.normalized);
    }
    const black=new THREE.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,roughness:.44,metalness:.04,clearcoat:.08,clearcoatRoughness:.4,side:THREE.FrontSide});
    const illuminatedWall=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.65,metalness:0,side:THREE.FrontSide});
    const endpoint=sourceToWeb(node.extras.nozzle_endpoint_local_mm).multiplyScalar(.001);
    illuminatedWall.onBeforeCompile=shader=>{
      shader.uniforms.tipEndpoint={value:endpoint};
      shader.uniforms.tipAxis={value:axis};
      shader.vertexShader=shader.vertexShader
        .replace('#include <common>','#include <common>\nvarying vec3 vTipPosition;')
        .replace('#include <begin_vertex>','#include <begin_vertex>\nvTipPosition = position;');
      shader.fragmentShader=shader.fragmentShader
        .replace('#include <common>','#include <common>\nvarying vec3 vTipPosition;\nuniform vec3 tipEndpoint;\nuniform vec3 tipAxis;')
        .replace('#include <color_fragment>',`#include <color_fragment>
          vec3 fromEnd = vTipPosition - tipEndpoint;
          float along = dot(fromEnd, tipAxis);
          float radius = length(fromEnd - along * tipAxis);
          float depthMm = -along * 1000.0;
          float innerRadius = (0.055 + (0.615 / 35.0) * depthMm) * 0.001;
          float outerRadius = (0.14 + (0.86 / 35.0) * depthMm) * 0.001;
          float wallDepth = clamp((radius - innerRadius) / (outerRadius - innerRadius), 0.0, 1.0);
          // Lit wall thickness recedes to a dark inner lip. The turquoise
          // accent occupies only the outermost 7% of the real cut surface.
          vec3 wallTone = mix(vec3(0.006, 0.012, 0.016), vec3(0.065, 0.091, 0.10), smoothstep(0.1, 0.85, wallDepth));
          float rim = smoothstep(0.93, 0.995, wallDepth);
          diffuseColor.rgb *= mix(wallTone, vec3(0.16, 0.48, 0.38), rim);
        `);
    };
    const exteriorColor=new THREE.Color(0x171c20);
    const interiorColor=new THREE.Color(0x40535c);
    const point=new THREE.Vector3(), normal=new THREE.Vector3(), radialOffset=new THREE.Vector3();
    for (const primitive of document.meshes[node.mesh].primitives) {
      let geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',attribute(primitive.attributes.POSITION));
      if (primitive.attributes.NORMAL!==undefined) geometry.setAttribute('normal',attribute(primitive.attributes.NORMAL));
      if (primitive.indices!==undefined) geometry.setIndex(attribute(primitive.indices));
      if (!geometry.attributes.normal) geometry.computeVertexNormals();
      const isOutletWall=/cut-wall/i.test(document.materials?.[primitive.material]?.name||'');
      if(isOutletWall){
        // The export splits the flat-shaded cutter into individual faces.
        // Join coincident vertices for continuous lighting, at 0.00001 mm
        // tolerance; all original positions and the opening shape are kept.
        geometry.deleteAttribute('normal');
        geometry=mergeVertices(geometry,1e-8);
        geometry.computeVertexNormals();
      }
      const positions=geometry.attributes.position;
      const normals=geometry.attributes.normal;
      const colors=new Float32Array(positions.count*3);
      for(let i=0;i<positions.count;i++){
        point.fromBufferAttribute(positions,i);
        normal.fromBufferAttribute(normals,i);
        radialOffset.copy(point).sub(endpoint);
        const axial=radialOffset.dot(axis);
        radialOffset.addScaledVector(axis,-axial);
        const color=normal.dot(radialOffset)<0 ? interiorColor : exteriorColor;
        color.toArray(colors,i*3);
      }
      geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
      const surface=new THREE.Mesh(geometry,isOutletWall?illuminatedWall:black);
      model.add(surface);
    }
    // The GLB is in metres. A very low-power source reveals the lumen.
    // Depth shading above avoids shadow-map banding at this microscopic scale.
    const internalLight=new THREE.PointLight(0xb7e3dc,2e-9,.0014,2);
    spin.add(internalLight);
    stage.dataset.geometrySource='original-blender-glb';
    stage.dataset.outletCount=String(node.extras.side_outlet_count);
    stage.dataset.closedEnd=String(node.extras.closed_rounded_end);
    stage.dataset.slotHighlight='shaded-teal-wall-depth';
    stage.dataset.internalLight='true';
    stage.classList.add('is-loaded');
    stage.querySelector('.vf-tip-loading').hidden=true;
    measure();
    requestFrame();
  }

  try {
    renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;
    const canvas=renderer.domElement;
    canvas.tabIndex=0;
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label','Black 3D needle tip with two opposed lateral outlets. Hover or scroll to rotate. Use left and right arrow keys to turn the tip.');
    stage.prepend(canvas);
    loadOriginalTip().catch(showFallback);
  } catch (error) { showFallback(error); }

  function showFallback(error) {
    stage.dataset.error=String(error);
    renderer?.domElement.remove();
    stage.querySelector('.vf-tip-loading').hidden=true;
    section.querySelector('[data-tip-caption]').textContent='Needle tip close-up';
    section.querySelector('[data-tip-instructions]').textContent='The rounded end and lateral outlet.';
  }

  stage.addEventListener('pointerenter',event=>{
    if (event.pointerType==='touch') return;
    hovering=true; previousTime=0; requestFrame();
  });
  stage.addEventListener('pointerleave',()=>{
    hovering=false; pointerX=pointerY=0; requestFrame();
  });
  stage.addEventListener('pointermove',event=>{
    if (event.pointerType==='touch') return;
    const rect=stage.getBoundingClientRect();
    pointerX=(event.clientX-rect.left)/rect.width*2-1;
    pointerY=(event.clientY-rect.top)/rect.height*2-1;
    requestFrame();
  });
  stage.addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight','Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key==='Home') hoverAngle=0;
    else hoverAngle+=(event.key==='ArrowLeft'?-1:1)*Math.PI/8;
    requestFrame();
  });
  function applyMotionPreference() {
    stage.dataset.reducedMotion=String(motion.matches);
    section.querySelector('[data-tip-instructions]').textContent=motion.matches?'Use the left and right arrow keys to turn the tip.':'Hover to turn the tip. Scroll past for a full 360° view.';
    section.querySelector('[data-tip-caption]').textContent=motion.matches?'Arrow keys rotate':'Hover or scroll to rotate';
    previousTime=0; requestFrame();
  }
  motion.addEventListener('change',applyMotionPreference);
  applyMotionPreference();
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if (!visible) {hovering=false;previousTime=0;}
    else requestFrame();
  },{rootMargin:'100px'}).observe(stage);
  new ResizeObserver(measure).observe(card);
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('scroll',updateScroll,{passive:true});
  document.addEventListener('visibilitychange',()=>{previousTime=0;requestFrame();});
  measure();
}
