---
task: create-image-effect-shader
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: image_effect_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: image_shader
    tipo: code
    destino: "css-motion-artist ou threejs-architect"

Checklist:
  - "[ ] Carregar imagem como texture"
  - "[ ] Implementar efeito (RGB shift, ripple, pixelation, blur)"
  - "[ ] Configurar interacao (hover, scroll, click)"
  - "[ ] Adicionar ease in/out suave"
  - "[ ] Garantir aspect ratio correto"
---

# Task: Create Image Effect Shader

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar shaders que aplicam efeitos visuais em imagens — RGB shift, chromatic aberration, pixelation, noise overlay, hover reveal e transicoes entre imagens. Tecnica iconica de creative coding para portfolios e galerias.

## Pre-Conditions
- Imagem source disponivel como texture
- Tipo de efeito definido no brief
- Interaction model (hover, scroll, auto)
- Aspect ratio da imagem e do container

## Passos

### 1. Classificar Efeito de Imagem
| Efeito | Complexidade | Uso Tipico |
|--------|-------------|------------|
| RGB shift | Baixa | Hover feedback, glitch |
| Chromatic aberration | Baixa | Premium feel, camera-like |
| Pixelation | Media | Reveal, transition |
| Noise grain | Baixa | Film-like, texture |
| Ripple/wave | Media | Interactive, scroll |
| Dual-image transition | Alta | Hover image swap |

### 2. Configurar Plane com Aspect Ratio
```javascript
const texture = await new THREE.TextureLoader().loadAsync('image.jpg');
const aspect = texture.image.width / texture.image.height;
const geometry = new THREE.PlaneGeometry(aspect, 1, 32, 32);
```

### 3. Implementar RGB Shift
```glsl
uniform sampler2D uTexture;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float r = texture2D(uTexture, uv + vec2(uIntensity, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(uIntensity, 0.0)).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
```

### 4. Implementar Pixelation Effect
```glsl
uniform float uPixelSize;
void main() {
  vec2 uv = vUv;
  vec2 pixelated = floor(uv / uPixelSize) * uPixelSize + uPixelSize * 0.5;
  gl_FragColor = texture2D(uTexture, pixelated);
}
```

### 5. Implementar Noise Grain Overlay
```glsl
float grain = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
vec4 color = texture2D(uTexture, vUv);
color.rgb += (grain - 0.5) * uGrainIntensity;
gl_FragColor = color;
```

### 6. Implementar Dual-Image Hover Transition
```glsl
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress; // 0.0 = image1, 1.0 = image2

void main() {
  vec4 tex1 = texture2D(uTexture1, vUv);
  vec4 tex2 = texture2D(uTexture2, vUv);
  // Distortion during transition
  float distortion = sin(vUv.y * 10.0) * uProgress * (1.0 - uProgress) * 0.1;
  vec2 uv1 = vUv + vec2(distortion, 0.0);
  vec2 uv2 = vUv - vec2(distortion, 0.0);
  gl_FragColor = mix(texture2D(uTexture1, uv1), texture2D(uTexture2, uv2), uProgress);
}
```

### 7. Smooth Hover Interaction
```javascript
let targetIntensity = 0;
element.addEventListener('mouseenter', () => targetIntensity = 1);
element.addEventListener('mouseleave', () => targetIntensity = 0);

function animate() {
  const current = material.uniforms.uIntensity.value;
  material.uniforms.uIntensity.value += (targetIntensity - current) * 0.05;
}
```

### 8. Manter Aspect Ratio Responsivo
```javascript
function resize() {
  const containerAspect = container.clientWidth / container.clientHeight;
  const imageAspect = texture.image.width / texture.image.height;
  // Cover behavior
  if (containerAspect > imageAspect) {
    mesh.scale.set(containerAspect / imageAspect, 1, 1);
  } else {
    mesh.scale.set(1, imageAspect / containerAspect, 1);
  }
}
```

### 9. Reduced Motion / Fallback
- Intensity = 0 quando prefers-reduced-motion
- Mostrar imagem normal (`<img>`) como fallback
- CSS filter como alternativa leve (blur, grayscale)

### 10. Otimizar Texture Loading
- Usar power-of-two textures quando possivel
- Comprimir com basis/KTX2 para web
- Lazy-load textures fora do viewport
- `texture.minFilter = THREE.LinearFilter` para non-POT

## Output
- Fragment shader com image effect
- Texture loading e aspect ratio setup
- Mouse/scroll interaction com lerp
- Dual-image transition se aplicavel
- Fallback CSS para sem WebGL
- Demo HTML com efeito interativo

## Quality Criteria
- [ ] Aspect ratio preservado em todos tamanhos
- [ ] Hover transition suave (lerp, nao snap)
- [ ] RGB shift sutil (nao nausea-inducing)
- [ ] 60fps com efeito ativo
- [ ] Textures carregadas com loader correto
- [ ] Fallback gracioso (img tag visivel se WebGL off)
- [ ] Mobile: efeito desativado ou simplificado
- [ ] Sem texture sampling artifacts nas bordas
