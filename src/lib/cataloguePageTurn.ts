/** A cylindrical paper curl over the next page; no external animation runtime. */
export function animateCatalogueTurn(
  canvas: HTMLCanvasElement,
  outgoing: HTMLImageElement,
  direction: number,
  complete: () => void,
) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
  if (!gl) { complete(); return; }
  const vertex = `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = vec2(position.x * .5 + .5, .5 - position.y * .5);
      gl_Position = vec4(position, 0., 1.);
    }
  `;
  const fragment = `
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
  `;
  const shaders: WebGLShader[] = [];
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Page curl shader failed');
    return shader;
  };
  const program = gl.createProgram()!;
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  let frame = 0;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(watchdog);
    gl.deleteBuffer(buffer);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
    complete();
  };
  const watchdog = window.setTimeout(finish, 1800);
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Page curl program failed');
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, outgoing);
    gl.uniform1i(gl.getUniformLocation(program, 'page'), 0);
    gl.uniform1f(gl.getUniformLocation(program, 'backwards'), direction < 0 ? 1 : 0);
    const progress = gl.getUniformLocation(program, 'progress');
    const bounds = canvas.getBoundingClientRect();
    const resolution = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * resolution);
    canvas.height = Math.round(bounds.height * resolution);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const start = performance.now();
    const draw = (now: number) => {
      const time = Math.min(1, (now - start) / 1050);
      // Smooth acceleration, with enough time to see the reverse of the paper.
      const eased = time * time * (3 - 2 * time);
      gl.uniform1f(progress, eased);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (time < 1) frame = requestAnimationFrame(draw);
      else finish();
    };
    draw(start);
    canvas.addEventListener('webglcontextlost', finish, { once: true });
  } catch {
    // The destination remains usable if WebGL is unavailable or disabled.
    finish();
  }
}
