import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest=JSON.parse(await fs.readFile(new URL('../shared/eighteeth-training-assets.json',import.meta.url),'utf8'));
const directory=new URL('../public/videos/eighteeth/',import.meta.url);
await fs.mkdir(directory,{recursive:true});
for(const asset of manifest.assets){
  const target=new URL(asset.filename,directory);
  const matches=bytes=>bytes.length===asset.bytes&&createHash('sha256').update(bytes).digest('hex')===asset.sha256;
  const existing=await fs.readFile(target).catch(()=>null);
  if(existing&&matches(existing)){console.log(`Verified training media: ${asset.filename}`);continue;}
  const url=`https://github.com/${manifest.repository}/releases/download/${manifest.release}/${asset.filename}`;
  const response=await fetch(url,{signal:AbortSignal.timeout(300000)});
  if(!response.ok)throw Error(`Training media download failed: ${asset.filename} (${response.status})`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(!matches(bytes))throw Error(`Training media checksum/size mismatch: ${asset.filename}`);
  await fs.writeFile(target,bytes);
  console.log(`Downloaded and verified original training media: ${asset.filename}`);
}
