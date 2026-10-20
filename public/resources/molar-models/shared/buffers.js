export async function decodeBuffer(b){
 let a=new Uint8Array(b);
 if(a[0]===31&&a[1]===139){b=await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();a=new Uint8Array(b)}
 if(a[0]===69&&a[1]===84&&a[2]===83&&a[3]===49){const n=new DataView(b).getUint32(4,true),m=n/4,out=new Uint8Array(n);if(a.length!==n+8)throw Error('Incomplete model buffer');for(let j=0;j<4;j++)for(let i=0;i<m;i++)out[i*4+j]=a[8+j*m+i];return out.buffer}
 return b;
}
