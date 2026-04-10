---
task: create-custom-shader
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: shader_spec
    tipo: object
    origem: "animation_brief ou animations-orqx"
    obrigatorio: true

Saida:
  - campo: shader_code
    tipo: code
    destino: "threejs-architect ou css-motion-artist"

Checklist:
  - "[ ] Definir vertex shader"
  - "[ ] Definir fragment shader"
  - "[ ] Implementar uniforms necessarios"
  - "[ ] Criar time-based animations"
  - "[ ] Otimizar operacoes (evitar branches, usar step/smoothstep)"
  - "[ ] Testar em GPU integrada"
---

# Task: Create Custom Shader

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar shaders GLSL customizados para Three.js — vertex shaders para deformacao geometrica e fragment shaders para efeitos visuais. Entregar codigo otimizado, animado e integravel com a cena.

## Pre-Conditions
- Tipo de shader definido (visual effect, material, background, transition)
- Three.js scene configurada pelo threejs-architect
- Uniforms necessarios mapeados (time, resolution, mouse, textures)
- Target GPU definido (dedicada vs integrada vs mobile)

## Tipos de Shader
- **Visual effect:** Distortion, glitch, chromatic aberration
- **Material:** Custom PBR, toon, holographic, iridescent
- **Background:** Gradient, noise, flow field, ray marching
- **Transition:** Dissolve, morph, reveal, wipe

## Passos

### 1. Definir ShaderMaterial Base
```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: vertexCode,
  fragmentShader: fragmentCode,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uMouse: { value: new THREE.Vector2() },
  },
  transparent: true,
  side: THREE.DoubleSide,
});
```

### 2. Implementar Vertex Shader
```glsl
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec3 pos = position;
  // Vertex displacement aqui
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### 3. Implementar Fragment Shader
```glsl
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(0.0);
  // Color computation aqui
  gl_FragColor = vec4(color, 1.0);
}
```

### 4. Mapear Uniforms ao Animation Loop
```javascript
function animate() {
  material.uniforms.uTime.value = clock.getElapsedTime();
  material.uniforms.uResolution.value.set(
    renderer.domElement.width,
    renderer.domElement.height
  );
}
```

### 5. Implementar Mouse Interaction
```javascript
window.addEventListener('mousemove', (e) => {
  material.uniforms.uMouse.value.set(
    e.clientX / window.innerWidth,
    1.0 - e.clientY / window.innerHeight
  );
});
```

### 6. Otimizar GLSL
| Ruim | Bom | Razao |
|------|-----|-------|
| `if (x > 0.5)` | `step(0.5, x)` | Evita branch |
| `pow(x, 2.0)` | `x * x` | Mais rapido |
| `length(v) < r` | `dot(v,v) < r*r` | Evita sqrt |
| Multiplos texture() | Cache em variavel | Reduce lookups |

### 7. Adicionar Texture Loading
```javascript
const texture = new THREE.TextureLoader().load('image.jpg');
material.uniforms.uTexture = { value: texture };
```
```glsl
uniform sampler2D uTexture;
vec4 texColor = texture2D(uTexture, vUv);
```

### 8. Testar Precision
```glsl
precision mediump float; // Mobile-safe default
// Use highp apenas quando necessario (shadow maps, depth)
```

### 9. Implementar Fallback
- Detectar WebGL2 vs WebGL1 support
- Shader alternativo simplificado para mobile
- Fallback CSS se WebGL indisponivel

### 10. Debugar Shader
- Usar `gl_FragColor = vec4(vUv, 0.0, 1.0)` para debug UV
- Visualizar normals: `gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0)`
- Three.js onError callback para compilation errors

## Output
- Vertex shader (.vert ou inline string)
- Fragment shader (.frag ou inline string)
- ShaderMaterial configurado com uniforms
- Animation loop integration
- Fallback para dispositivos sem suporte
- Documentacao de uniforms e parametros

## Quality Criteria
- [ ] Shader compila sem warnings
- [ ] 60fps em GPU dedicada desktop
- [ ] 30fps minimo em GPU integrada/mobile
- [ ] Sem branches condicionais (step/smoothstep)
- [ ] Precision mediump como default
- [ ] Uniforms documentados (nome, tipo, range)
- [ ] Fallback para WebGL1 se necessario
- [ ] Time-based animation suave (sem stuttering)
