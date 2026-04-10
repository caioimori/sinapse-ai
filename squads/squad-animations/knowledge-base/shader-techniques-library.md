# Shader Techniques Library

> Biblioteca de tecnicas GLSL para efeitos visuais na web.

---

## Noise Functions

### Simplex Noise 2D (Use Case: Texturas organicas, terrenos, deformacoes)
```glsl
// Inclusao: copiar funcao simplex2D ou usar #include
float n = snoise(vUv * 5.0 + uTime * 0.3);
```

### Fractal Brownian Motion (FBM) — Multiplas oitavas de noise
```glsl
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```

### Domain Warping — Noise distorcendo noise
```glsl
vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + uTime * 0.15),
              fbm(p + 4.0 * q + vec2(8.3, 2.8) + uTime * 0.126));
float f = fbm(p + 4.0 * r);
```

### Curl Noise — Para fluxo de particulas
```glsl
vec2 curlNoise(vec2 p) {
  float eps = 0.001;
  float n1 = snoise(vec2(p.x, p.y + eps));
  float n2 = snoise(vec2(p.x, p.y - eps));
  float n3 = snoise(vec2(p.x + eps, p.y));
  float n4 = snoise(vec2(p.x - eps, p.y));
  float x = (n1 - n2) / (2.0 * eps);
  float y = -(n3 - n4) / (2.0 * eps);
  return vec2(x, y);
}
```

---

## Image Effects

### Distorcao por Mouse (Akella-style)
```glsl
uniform vec2 uMouse;
uniform float uStrength;

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, uMouse);
  float effect = smoothstep(0.3, 0.0, dist);
  uv += (uv - uMouse) * effect * uStrength;
  gl_FragColor = texture2D(uTexture, uv);
}
```

### RGB Shift / Chromatic Aberration
```glsl
float shift = 0.005;
float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
float g = texture2D(uTexture, uv).g;
float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
gl_FragColor = vec4(r, g, b, 1.0);
```

### Hover Displacement
```glsl
uniform sampler2D uDisplacement; // Textura de displacement map
uniform float uHover; // 0.0 a 1.0

vec2 displaced = uv + texture2D(uDisplacement, uv).rg * uHover * 0.1;
gl_FragColor = texture2D(uTexture, displaced);
```

### Transition Entre Imagens
```glsl
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress; // 0.0 a 1.0

// Pattern: displacement transition
float displacement = texture2D(uDisplacement, uv).r;
float threshold = step(displacement, uProgress);
vec4 color = mix(texture2D(uTexture1, uv), texture2D(uTexture2, uv), threshold);
```

---

## Post-Processing Shaders

### Film Grain
```glsl
float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
color.rgb += (grain - 0.5) * 0.1;
```

### Vignette
```glsl
float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5) * 2.0);
color.rgb *= vignette;
```

### Scanlines
```glsl
float scanline = sin(uv.y * 400.0 + uTime * 2.0) * 0.04;
color.rgb -= scanline;
```

### Glitch
```glsl
float glitchStrength = step(0.99, fract(sin(floor(uTime * 10.0)) * 43758.5453));
if (glitchStrength > 0.0) {
  float shift = (fract(sin(uv.y * 100.0) * 43758.5453) - 0.5) * 0.1;
  uv.x += shift;
}
```

---

## SDF (Signed Distance Functions)

### Circulo
```glsl
float sdCircle(vec2 p, float r) { return length(p) - r; }
```

### Caixa
```glsl
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
```

### Operacoes
```glsl
float opUnion(float d1, float d2) { return min(d1, d2); }
float opSubtraction(float d1, float d2) { return max(-d1, d2); }
float opIntersection(float d1, float d2) { return max(d1, d2); }
float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}
```

---

## Performance Tips

1. **Evitar branching** — usar `step()`, `smoothstep()`, `mix()` em vez de `if/else`
2. **Precision qualifiers** — `mediump` no fragment shader para mobile
3. **Minimizar texture lookups** — cada `texture2D()` e caro
4. **Pre-computar no vertex shader** — passar via varying para o fragment
5. **Evitar loops dinamicos** — loops com count fixo sao otimizaveis pelo compilador
6. **Pack dados** — usar canais RGBA para 4 valores em 1 texture lookup
