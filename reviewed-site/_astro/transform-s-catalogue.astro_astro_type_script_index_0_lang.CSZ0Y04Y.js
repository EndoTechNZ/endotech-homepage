function k(s,y,c,f){const e=s.getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!0});if(!e){f();return}const P=`
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
  `,v=[],A=(p,T)=>{const i=e.createShader(p);if(v.push(i),e.shaderSource(i,T),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))throw new Error("Page curl shader failed");return i},o=e.createProgram(),r=e.createBuffer(),m=e.createTexture();let g=0,E=!1;const h=()=>{E||(E=!0,cancelAnimationFrame(g),window.clearTimeout(L),e.deleteBuffer(r),e.deleteTexture(m),e.deleteProgram(o),v.forEach(p=>e.deleteShader(p)),f())},L=window.setTimeout(h,1800);try{if(e.attachShader(o,A(e.VERTEX_SHADER,P)),e.attachShader(o,A(e.FRAGMENT_SHADER,b)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS))throw new Error("Page curl program failed");e.useProgram(o),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const p=e.getAttribLocation(o,"position");e.enableVertexAttribArray(p),e.vertexAttribPointer(p,2,e.FLOAT,!1,0,0),e.bindTexture(e.TEXTURE_2D,m),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,y),e.uniform1i(e.getUniformLocation(o,"page"),0),e.uniform1f(e.getUniformLocation(o,"backwards"),c<0?1:0);const T=e.getUniformLocation(o,"progress"),i=s.getBoundingClientRect(),R=Math.min(window.devicePixelRatio||1,2);s.width=Math.round(i.width*R),s.height=Math.round(i.height*R),e.viewport(0,0,s.width,s.height);const u=performance.now(),t=l=>{const d=Math.min(1,(l-u)/1050),w=d*d*(3-2*d);e.uniform1f(T,w),e.drawArrays(e.TRIANGLE_STRIP,0,4),d<1?g=requestAnimationFrame(t):h()};t(u),s.addEventListener("webglcontextlost",h,{once:!0})}catch{h()}}const a=document.querySelector("[data-catalogue-reader]");if(a){let s=function(){T=!0,i.forEach(t=>t.cancel()),i=[],g&&(g.hidden=!0),a?.classList.remove("is-introducing")},y=function(){const t=c[r];!t||!f||(f.src=t.src,f.alt=t.title,P&&(P.textContent=`Page ${t.number} of ${c.length}`),b?.toggleAttribute("disabled",r===0),v?.toggleAttribute("disabled",r===c.length-1),e&&(e.disabled=r===c.length-1,e.setAttribute("aria-label",r===c.length-1?"Last catalogue page":`Turn to catalogue page ${r+2}`)),A.forEach((l,d)=>{d===r?l.setAttribute("aria-current","page"):l.removeAttribute("aria-current")}),window.history.replaceState(null,"",`#page-${t.number}`))};const c=JSON.parse(a.dataset.pages||"[]"),f=a.querySelector("[data-catalogue-image]"),e=a.querySelector("[data-catalogue-sheet]"),P=a.querySelector("[data-catalogue-status]"),b=a.querySelector("[data-catalogue-previous]"),v=a.querySelector("[data-catalogue-next]"),A=Array.from(a.querySelectorAll("[data-catalogue-thumbnail]")),o=window.location.hash.match(/^#page-(\d+)$/);let r=Math.min(c.length-1,Math.max(0,Number(o?.[1]||1)-1)),m=!1;const g=a.querySelector("[data-catalogue-arrival]"),E=window.matchMedia("(prefers-reduced-motion: reduce)"),h=new URL(window.location.href),p=!o||Number(o[1])===1;let T=!1,i=[];h.searchParams.has("intro")&&(h.searchParams.delete("intro"),window.history.replaceState(null,"",h));async function R(){if(!a||!g||!e||!p||(a.classList.add("catalogue-arrival-view"),a.scrollIntoView({behavior:"instant",block:"start"}),E.matches))return;const t=Array.from(g.querySelectorAll("img"));if(!await Promise.race([Promise.all(t.map(n=>n.decode())).then(()=>!0,()=>!1),new Promise(n=>window.setTimeout(()=>n(!1),1800))])||T||E.matches||document.hidden)return;g.hidden=!1,a.classList.add("is-introducing");const d=1250,w=[{transform:"rotateX(10deg) rotateY(8deg) rotateZ(-18deg) scale3d(.52,.52,.52)",offset:0},{transform:"rotateX(10deg) rotateY(8deg) rotateZ(-18deg) scale3d(.52,.52,.52)",offset:.62},{transform:"rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)",offset:1}],x={duration:d,easing:"cubic-bezier(.22,.65,.3,1)",fill:"both"};i.push(g.animate(w,x),e.animate(w,x)),g.querySelectorAll("[data-arrival-leaf]").forEach(n=>{const S=Number(n.dataset.arrivalLeaf)-1;i.push(n.animate([{transform:"rotateY(0deg)",opacity:1,offset:0},{transform:"rotateY(-38deg)",opacity:1,offset:.32},{transform:"rotateY(-100deg)",opacity:1,offset:.65},{transform:"rotateY(-168deg)",opacity:0,offset:1}],{duration:660,delay:70+S*85,easing:"ease-in-out",fill:"both"}))}),await Promise.allSettled(i.map(n=>n.finished)),s()}a.addEventListener("pointerdown",s,{once:!0}),E.addEventListener("change",s),window.addEventListener("pagehide",s,{once:!0}),c.slice(1).forEach(t=>{const l=new Image;l.src=t.src});async function u(t,l=1){s();const d=Math.min(c.length-1,Math.max(0,t));if(d===r||m||!e||!f)return;m=!0;const w=new Image;w.src=f.src;const x=new Image;x.src=c[d].src;try{await Promise.all([w.decode(),x.decode()])}catch{m=!1;return}if(r=d,y(),E.matches){m=!1;return}const n=document.createElement("canvas");n.setAttribute("aria-hidden","true"),Object.assign(n.style,{position:"absolute",inset:"0",width:"100%",height:"100%",zIndex:"6",pointerEvents:"none",borderRadius:"2px 5px 5px 2px"}),e.appendChild(n),k(n,w,l,()=>{n.remove(),m=!1})}b?.addEventListener("click",()=>u(r-1,-1)),v?.addEventListener("click",()=>u(r+1,1)),e?.addEventListener("click",()=>u(r+1,1)),A.forEach((t,l)=>{t.addEventListener("click",()=>u(l,l>=r?1:-1))}),window.addEventListener("keydown",t=>{t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement||(["ArrowRight","ArrowLeft","PageDown","PageUp","Home","End"].includes(t.key)&&t.preventDefault(),(t.key==="ArrowRight"||t.key==="PageDown")&&u(r+1,1),(t.key==="ArrowLeft"||t.key==="PageUp")&&u(r-1,-1),t.key==="Home"&&u(0,-1),t.key==="End"&&u(c.length-1,1))}),y(),R()}
