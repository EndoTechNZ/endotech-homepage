if(parent!==self)document.documentElement.dataset.embedded='true';
let previousHeight=0;
const announceSize=()=>{const height=document.body.offsetHeight;if(height===previousHeight)return;previousHeight=height;parent.postMessage({type:'iroot-viewer-size',height},location.origin);};
new ResizeObserver(announceSize).observe(document.body);
import('./organizer.js').then(announceSize).catch(error=>{
  document.getElementById('loading').hidden=true;
  document.getElementById('fallback').hidden=false;
  document.getElementById('error').textContent='The 3D viewer is unavailable on this device. You can still explore the product pictures using the links above.';
  document.querySelectorAll('button,select,input').forEach(control=>control.disabled=true);
  console.error('iRoot SP viewer:',error);
  announceSize();
});
