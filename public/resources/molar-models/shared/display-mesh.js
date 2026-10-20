// Compact display derivative. Original buffers remain available unchanged.
// Positions have a measured sub-micrometre bound; triangle indices are exact.
export function decodeDisplayMesh(buffer){
 const view=new DataView(buffer),bytes=new Uint8Array(buffer);
 if(bytes[0]!==69||bytes[1]!==84||bytes[2]!==77||bytes[3]!==49)throw Error('Invalid display mesh');
 const headerLength=view.getUint32(4,true),vertices=view.getUint32(8,true),count=view.getUint32(12,true);
 const meta=JSON.parse(new TextDecoder().decode(bytes.subarray(16,16+headerLength)));
 let offset=16+headerLength;
 const unshuffle=(length,width)=>{const out=new Uint8Array(length),words=length/width;for(let j=0;j<width;j++)for(let i=0;i<words;i++)out[i*width+j]=bytes[offset+j*words+i];offset+=length;return out.buffer;};
 if(buffer.byteLength!==offset+vertices*10+count*4)throw Error('Incomplete display mesh');
 const q=new Uint16Array(unshuffle(vertices*6,2)),oct=new Int16Array(unshuffle(vertices*4,2)),indices=new Uint32Array(unshuffle(count*4,4));
 const positions=new Float32Array(vertices*3),normals=new Float32Array(vertices*3);
 for(let i=0;i<vertices;i++){
  for(let k=0;k<3;k++)positions[i*3+k]=meta.origin[k]+q[i*3+k]*meta.scale[k];
  let x=oct[i*2]/32767,y=oct[i*2+1]/32767,z=1-Math.abs(x)-Math.abs(y);
  if(z<0){const oldX=x;x=(1-Math.abs(y))*(oldX>=0?1:-1);y=(1-Math.abs(oldX))*(y>=0?1:-1);}
  const n=Math.hypot(x,y,z);normals[i*3]=x/n;normals[i*3+1]=y/n;normals[i*3+2]=z/n;
 }
 for(let i=1;i<indices.length;i++)indices[i]=(indices[i]+indices[i-1])>>>0;
 // Preserve even sub-micrometre sliver faces that need exact source vertices.
 for(const [index,x,y,z] of meta.exact_vertices||[])positions.set([x,y,z],index*3);
 for(const index of meta.zero_normals||[])normals.fill(0,index*3,index*3+3);
 return {positions,normals,indices,meta};
}
