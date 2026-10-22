import * as THREE from 'three';

// Earlier removal meshes contain internal interfaces as well as exposed faces.
// Once a later file reaches an interface it is inside the prepared space, not
// an exposed earlier-coloured surface. Keep untouched earlier regions intact.
export function laterPreparationGLSL(i){
 return `bool laterCut${i}(vec3 p,float fileIndex){
  bool y=fileIndex<.5&&visits${i}.y>0.;
  bool z=fileIndex<1.5&&visits${i}.z>0.;
  bool w=fileIndex<2.5&&visits${i}.w>0.;
  bool last=fileIndex<3.5&&lastVisit${i}>0.;
  if(!(y||z||w||last)||!inside${i}(p))return false;
  vec4 f=dataA${i}(p);
  return (y&&f.y<=visits${i}.y-.004)||(z&&f.z<=visits${i}.z-.004)||
   (w&&f.w<=visits${i}.w-.004)||(last&&dataB${i}(p).r<=lastVisit${i}-.004);
 }\n`;
}

export function addRemovalDepthSurface(stock,surfaceId){
 if(stock.userData.depthProxy)return stock.userData.depthProxy;
 const material=stock.material.clone();
 // Keep the same clipping code and shared live first-touch uniform reference.
 material.onBeforeCompile=stock.material.onBeforeCompile;
 material.customProgramCacheKey=stock.material.customProgramCacheKey;
 material.colorWrite=false;material.depthWrite=true;
 material.depthFunc=THREE.LessEqualDepth;material.forceSinglePass=true;
 // Equal depth alone lets coincident fragments from older files blend in.
 // Each covered sample records one owner; only that stock may supply pigment.
 material.stencilWrite=true;material.stencilWriteMask=0xff;
 material.stencilRef=surfaceId;material.stencilFunc=THREE.AlwaysStencilFunc;
 material.stencilFail=THREE.KeepStencilOp;material.stencilZFail=THREE.KeepStencilOp;
 material.stencilZPass=THREE.ReplaceStencilOp;
 const depth=new THREE.Mesh(stock.geometry,material);
 depth.renderOrder=1;depth.visible=false;stock.parent.add(depth);
 stock.userData.depthProxy=depth;
 stock.material.depthFunc=THREE.EqualDepth;
 stock.material.depthWrite=false;stock.material.forceSinglePass=true;
 stock.material.stencilWrite=true;stock.material.stencilWriteMask=0;
 stock.material.stencilRef=surfaceId;stock.material.stencilFunc=THREE.EqualStencilFunc;
 stock.material.stencilFail=THREE.KeepStencilOp;stock.material.stencilZFail=THREE.KeepStencilOp;
 stock.material.stencilZPass=THREE.KeepStencilOp;
 stock.renderOrder=2;
 return depth;
}

export function syncRemovalDepthSurface(stock,order){
 const depth=stock.userData.depthProxy;
 if(!depth)return;
 depth.visible=stock.visible;
 for(const key of ['polygonOffset','polygonOffsetFactor','polygonOffsetUnits'])depth.material[key]=stock.material[key];
 // All depth-only surfaces precede every pigment. Later preparation owns exact
 // depth ties; camera distance must not choose either ownership or colour.
 depth.renderOrder=1+order*.00001;
 stock.renderOrder=2+order*.00001;
}
