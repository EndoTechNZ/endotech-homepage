// Float textures are required by WebGL2; linear filtering of 32-bit floats is
// optional. Preserve the same trilinear field on phones without that extension.
export function fieldSamplingGLSL(floatLinear){
 if(floatLinear)return 'vec4 samplePrepField(highp sampler3D field,vec3 uv){return texture(field,uv);}\n';
 return `vec4 samplePrepField(highp sampler3D field,vec3 uv){
  ivec3 size=textureSize(field,0),last=size-ivec3(1);
  vec3 p=clamp(uv*vec3(size)-vec3(.5),vec3(0.),vec3(last));
  ivec3 a=ivec3(floor(p)),b=min(a+ivec3(1),last);vec3 f=fract(p);
  vec4 z0=mix(mix(texelFetch(field,ivec3(a.x,a.y,a.z),0),texelFetch(field,ivec3(b.x,a.y,a.z),0),f.x),mix(texelFetch(field,ivec3(a.x,b.y,a.z),0),texelFetch(field,ivec3(b.x,b.y,a.z),0),f.x),f.y);
  vec4 z1=mix(mix(texelFetch(field,ivec3(a.x,a.y,b.z),0),texelFetch(field,ivec3(b.x,a.y,b.z),0),f.x),mix(texelFetch(field,ivec3(a.x,b.y,b.z),0),texelFetch(field,ivec3(b.x,b.y,b.z),0),f.x),f.y);
  return mix(z0,z1,f.z);
 }\n`;
}
