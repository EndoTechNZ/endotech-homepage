function S(i,y,c,w){const e=i.getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!0});if(!e){w();return}const P=`
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = vec2(position.x * .5 + .5, .5 - position.y * .5);
      gl_Position = vec4(position, 0., 1.);
    }
  `,b=`
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D page;
    uniform float progress;
    uniform float backwards;
    const float PI = 3.14159265;
    vec3 ink(float sourceX) {
      float u = mix(sourceX, 1. - sourceX, backwards);
      return texture2D(page, vec2(clamp(u, 0., 1.), uv.y)).rgb;
    }
    void main() {
      float x = mix(uv.x, 1. - uv.x, backwards);
      // Slightly diagonal rolling edge, with a rounded, lit paper surface.
      float radius = .065 * sin(PI * progress) + .018;
      float crease = 1.10 - progress * 1.42 + .09 * (.5 - uv.y);
      float d = (x - crease) / radius;
      vec4 colour = vec4(0.);
      if (x < crease) colour = vec4(ink(x), 1.);
      if (d >= 0. && d <= 1.) {
        float angle = asin(clamp(d, 0., 1.));
        float sourceFront = crease + radius * angle;
        if (sourceFront <= 1.) {
          colour = vec4(ink(sourceFront) * (.76 + .24 * cos(angle)), 1.);
        }
        float sourceBack = crease + radius * (PI - angle);
        if (sourceBack <= 1.) {
          vec3 reverse = mix(ink(sourceBack), vec3(.97, .976, .985), .78);
          float light = .74 + .26 * pow(1. - d, .45);
          colour = vec4(reverse * light, 1.);
        }
      }
      // The turned-over portion travels to the left rather than shrinking away.
      float sourceBack = 2. * crease + PI * radius - x;
      if (x <= crease && sourceBack <= 1. && sourceBack >= crease + PI * radius) {
        vec3 reverse = mix(ink(sourceBack), vec3(.97, .976, .985), .78);
        colour = vec4(reverse, 1.);
      }
      if (colour.a == 0.) {
        float edge = crease + radius;
        float distance = x - edge;
        float shadow = .22 * exp(-max(distance, 0.) / .022);
        if (distance >= 0. && crease < 1.) colour = vec4(.04, .07, .12, shadow);
      }
      gl_FragColor = colour;
    }
  `,A=[],x=(m,h)=>{const f=e.createShader(m);if(A.push(f),e.shaderSource(f,h),e.compileShader(f),!e.getShaderParameter(f,e.COMPILE_STATUS))throw new Error("Page curl shader failed");return f},n=e.createProgram(),r=e.createBuffer(),E=e.createTexture();let u=0,T=!1;const g=()=>{T||(T=!0,cancelAnimationFrame(u),window.clearTimeout(R),e.deleteBuffer(r),e.deleteTexture(E),e.deleteProgram(n),A.forEach(m=>e.deleteShader(m)),w())},R=window.setTimeout(g,1800);try{if(e.attachShader(n,x(e.VERTEX_SHADER,P)),e.attachShader(n,x(e.FRAGMENT_SHADER,b)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error("Page curl program failed");e.useProgram(n),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const m=e.getAttribLocation(n,"position");e.enableVertexAttribArray(m),e.vertexAttribPointer(m,2,e.FLOAT,!1,0,0),e.bindTexture(e.TEXTURE_2D,E),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,y),e.uniform1i(e.getUniformLocation(n,"page"),0),e.uniform1f(e.getUniformLocation(n,"backwards"),c<0?1:0);const h=e.getUniformLocation(n,"progress"),f=i.getBoundingClientRect(),l=Math.min(window.devicePixelRatio||1,2);i.width=Math.round(f.width*l),i.height=Math.round(f.height*l),e.viewport(0,0,i.width,i.height);const t=performance.now(),s=p=>{const d=Math.min(1,(p-t)/1050),v=d*d*(3-2*d);e.uniform1f(h,v),e.drawArrays(e.TRIANGLE_STRIP,0,4),d<1?u=requestAnimationFrame(s):g()};s(t),i.addEventListener("webglcontextlost",g,{once:!0})}catch{g()}}const a=document.querySelector("[data-catalogue-reader]");if(a){let i=function(){m=!0,h.forEach(t=>t.cancel()),h=[],u&&(u.hidden=!0),a?.classList.remove("is-introducing")},y=function(){const t=c[r];!t||!w||(w.src=t.src,w.alt=t.title,P&&(P.textContent=`Page ${t.number} of ${c.length}`),b?.toggleAttribute("disabled",r===0),A?.toggleAttribute("disabled",r===c.length-1),e&&(e.disabled=r===c.length-1,e.setAttribute("aria-label",r===c.length-1?"Last catalogue page":`Turn to catalogue page ${r+2}`)),x.forEach((s,p)=>{p===r?s.setAttribute("aria-current","page"):s.removeAttribute("aria-current")}),window.history.replaceState(null,"",`#page-${t.number}`))};const c=JSON.parse(a.dataset.pages||"[]"),w=a.querySelector("[data-catalogue-image]"),e=a.querySelector("[data-catalogue-sheet]"),P=a.querySelector("[data-catalogue-status]"),b=a.querySelector("[data-catalogue-previous]"),A=a.querySelector("[data-catalogue-next]"),x=Array.from(a.querySelectorAll("[data-catalogue-thumbnail]")),n=window.location.hash.match(/^#page-(\d+)$/);let r=Math.min(c.length-1,Math.max(0,Number(n?.[1]||1)-1)),E=!1;const u=a.querySelector("[data-catalogue-arrival]"),T=window.matchMedia("(prefers-reduced-motion: reduce)"),g=new URL(window.location.href),R=g.searchParams.get("intro")==="flip"&&!n;let m=!1,h=[];g.searchParams.has("intro")&&(g.searchParams.delete("intro"),window.history.replaceState(null,"",g));async function f(){if(!a||!u||!e||!R||(a.classList.add("catalogue-arrival-view"),a.scrollIntoView({behavior:"instant",block:"start"}),T.matches))return;const t=Array.from(u.querySelectorAll("img"));if(!await Promise.race([Promise.all(t.map(o=>o.decode())).then(()=>!0,()=>!1),new Promise(o=>window.setTimeout(()=>o(!1),1800))])||m||T.matches||document.hidden)return;u.hidden=!1,a.classList.add("is-introducing");const p=1250,d=[{transform:"rotateX(10deg) rotateY(8deg) rotateZ(-18deg) scale3d(.52,.52,.52)",offset:0},{transform:"rotateX(10deg) rotateY(8deg) rotateZ(-18deg) scale3d(.52,.52,.52)",offset:.62},{transform:"rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)",offset:1}],v={duration:p,easing:"cubic-bezier(.22,.65,.3,1)",fill:"both"};h.push(u.animate(d,v),e.animate(d,v)),u.querySelectorAll("[data-arrival-leaf]").forEach(o=>{const L=Number(o.dataset.arrivalLeaf)-1;h.push(o.animate([{transform:"rotateY(0deg)",opacity:1,offset:0},{transform:"rotateY(-38deg)",opacity:1,offset:.32},{transform:"rotateY(-100deg)",opacity:1,offset:.65},{transform:"rotateY(-168deg)",opacity:0,offset:1}],{duration:660,delay:70+L*85,easing:"ease-in-out",fill:"both"}))}),await Promise.allSettled(h.map(o=>o.finished)),i()}a.addEventListener("pointerdown",i,{once:!0}),T.addEventListener("change",i),window.addEventListener("pagehide",i,{once:!0}),c.slice(1).forEach(t=>{const s=new Image;s.src=t.src});async function l(t,s=1){i();const p=Math.min(c.length-1,Math.max(0,t));if(p===r||E||!e||!w)return;E=!0;const d=new Image;d.src=w.src;const v=new Image;v.src=c[p].src;try{await Promise.all([d.decode(),v.decode()])}catch{E=!1;return}if(r=p,y(),T.matches){E=!1;return}const o=document.createElement("canvas");o.setAttribute("aria-hidden","true"),Object.assign(o.style,{position:"absolute",inset:"0",width:"100%",height:"100%",zIndex:"6",pointerEvents:"none",borderRadius:"2px 5px 5px 2px"}),e.appendChild(o),S(o,d,s,()=>{o.remove(),E=!1})}b?.addEventListener("click",()=>l(r-1,-1)),A?.addEventListener("click",()=>l(r+1,1)),e?.addEventListener("click",()=>l(r+1,1)),x.forEach((t,s)=>{t.addEventListener("click",()=>l(s,s>=r?1:-1))}),window.addEventListener("keydown",t=>{t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement||(["ArrowRight","ArrowLeft","PageDown","PageUp","Home","End"].includes(t.key)&&t.preventDefault(),(t.key==="ArrowRight"||t.key==="PageDown")&&l(r+1,1),(t.key==="ArrowLeft"||t.key==="PageUp")&&l(r-1,-1),t.key==="Home"&&l(0,-1),t.key==="End"&&l(c.length-1,1))}),y(),f()}
