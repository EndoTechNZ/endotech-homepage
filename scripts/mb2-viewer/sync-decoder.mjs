import {mkdir,copyFile} from 'node:fs/promises';
const output=new URL('../../public/models/upper-molar-mb2/draco/',import.meta.url);
await mkdir(output,{recursive:true});
for(const file of ['draco_wasm_wrapper.js','draco_decoder.wasm','draco_decoder.js'])await copyFile(new URL('../../node_modules/three/examples/jsm/libs/draco/gltf/'+file,import.meta.url),new URL(file,output));
await copyFile(new URL('../../node_modules/three/LICENSE',import.meta.url),new URL('THREE-LICENSE.txt',output));
console.log('Self-hosted Draco decoder copied from the pinned Three.js dependency.');
