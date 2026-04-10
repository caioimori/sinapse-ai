---
task: create-distortion-effect
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: distortion_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: distortion_shader
    tipo: code
    destino: "threejs-architect ou css-motion-artist"

Checklist:
  - "[ ] Selecionar tipo (image distortion, mesh distortion, UV distortion)"
  - "[ ] Implementar displacement map ou vertex displacement"
  - "[ ] Configurar mouse/scroll interaction se necessario"
  - "[ ] Adicionar smooth interpolation"
  - "[ ] Testar com imagens reais"
---

# Task: Create Distortion Effect

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar efeitos de distorcao — image warping, mesh deformation, UV displacement, hover ripple e scroll-driven distortion. Tecnica essencial para efeitos "wow" em portfolios e landing pages criativas.

## Pre-Conditions
- Tipo de distorcao definido (image, mesh, UV, hybrid)
- Source content (imagem, textura, geometria)
- Interaction trigger (hover, scroll, continuous)
- Intensidade desejada (sutil vs dramatico)

## Passos

### 1. Classificar Tipo de Distortion
| Tipo | Tecnica | Exemplo |
|------|---------|---------|
| Image hover | Fragment UV offset | Portfolio hover effect |
| Mesh deformation | Vertex displacement | Wave surface, terrain |
| Ripple | Radial UV distortion | Click ripple, cursor trail |
| Scroll warp | UV + progress uniform | Page scroll distortion |
| Glitch | Random UV displacement | Glitch art, error aesthetic |

### 2. Implementar Image Distortion (UV Offset)
```glsl
uniform sampler2D uTexture;
uniform float uIntensity;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  // Distance from mouse
  float dist = distance(uv, uMouse);
  float strength = smoothstep(0.3, 0.0, dist) * uIntensity;
  // Offset UVs
  uv += normalize(uv - uMouse) * strength * 0.1;
  gl_FragColor = texture2D(uTexture, uv);
}
```

### 3. Implementar Vertex Displacement
```glsl
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  // Sine wave displacement
  pos.z += sin(pos.x * 4.0 + uTime) * uIntensity;
  pos.z += cos(pos.y * 4.0 + uTime * 0.8) * uIntensity * 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### 4. Implementar Ripple Effect
```glsl
uniform float uTime;
uniform vec2 uOrigin;
uniform float uAmplitude;

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, uOrigin);
  float ripple = sin(dist * 30.0 - uTime * 5.0) * uAmplitude;
  ripple *= smoothstep(0.5, 0.0, dist); // Fade at edges
  uv += normalize(uv - uOrigin) * ripple;
  gl_FragColor = texture2D(uTexture, uv);
}
```

### 5. Smooth Mouse Interaction
```javascript
// Lerp mouse position for smooth distortion
const targetMouse = new THREE.Vector2();
const currentMouse = new THREE.Vector2();

function animate() {
  currentMouse.lerp(targetMouse, 0.05); // Smooth follow
  material.uniforms.uMouse.value.copy(currentMouse);
}
```

### 6. Implementar Displacement Map
```glsl
uniform sampler2D uDisplacementMap;
uniform float uDisplacementScale;

void main() {
  vec2 uv = vUv;
  vec4 displacement = texture2D(uDisplacementMap, uv);
  uv += (displacement.rg - 0.5) * uDisplacementScale;
  gl_FragColor = texture2D(uTexture, uv);
}
```

### 7. Scroll-Driven Distortion
```javascript
// Map scroll to distortion intensity
const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
material.uniforms.uIntensity.value = scrollProgress * 0.5;
```

### 8. Glitch Effect
```glsl
float glitch = step(0.99, fract(sin(floor(uTime * 20.0) * 431.1)));
if (glitch > 0.0) {
  uv.x += (random(floor(uv.y * 10.0)) - 0.5) * 0.1;
}
```

### 9. Configurar Edge Handling
- Clamp UVs para evitar sampling fora da textura
- Adicionar padding na textura para distorcao de borda
- `texture2D(uTexture, clamp(uv, 0.0, 1.0))`

### 10. Performance e Fallback
- Lerp intensity para transicoes suaves (nao snap)
- Mobile: reduzir intensidade em 50%
- Fallback: CSS filter blur/contrast se WebGL indisponivel
- Adaptive quality baseado em device capability

## Output
- Fragment shader com distortion effect
- Vertex shader se mesh deformation
- Mouse/scroll interaction integration
- Smooth interpolation (lerp) setup
- Edge handling (clamp, padding)
- Fallback para dispositivos sem WebGL

## Quality Criteria
- [ ] Distorcao suave sem artifacts de sampling
- [ ] Mouse interaction com lerp (sem snap)
- [ ] UVs clampados (sem sampling fora da textura)
- [ ] 60fps em desktop com efeito ativo
- [ ] Intensidade configuravel via uniform
- [ ] Edge cases tratados (borda da imagem)
- [ ] Mobile-friendly (intensidade reduzida)
- [ ] Fallback gracioso se WebGL indisponivel
