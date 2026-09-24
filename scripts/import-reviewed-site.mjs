// One-time import of the user-approved local review. Does not change ordering code.
import fs from 'node:fs';
import path from 'node:path';
const source=process.argv[2];
if(!source||!fs.existsSync(path.join(source,'quote-request/index.html')))throw Error('Reviewed site directory required');
const destination=path.resolve('reviewed-site');
function copy(dir,rel=''){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(/^(source-snapshots|audit-|node_modules)/.test(entry.name))continue;
  const next=path.join(rel,entry.name),from=path.join(dir,entry.name);
  if(entry.isDirectory()){copy(from,next);continue;}
  if(!rel&&!['index.html'].includes(entry.name)&&! /\.(css|js)$/.test(entry.name))continue;
  if(/\.(md|json)$/.test(entry.name)&&!rel)continue;
  const to=path.join(destination,next);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);
 }
}
copy(source);
console.log('Imported reviewed pages and assets into reviewed-site.');
