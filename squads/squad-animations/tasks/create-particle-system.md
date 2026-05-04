---
task: create-particle-system
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: particle_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: particle_system
    tipo: code
    destino: "shader-artist ou animation-performance-engineer"

Checklist:
  - "[ ] Selecionar approach (Points, InstancedMesh, GPGPU)"
  - "[ ] Definir quantidade e limites"
  - "[ ] Implementar emitter e lifecycle"
  - "[ ] Configurar forces (gravity, wind, attraction)"
  - "[ ] Adicionar variacao (size, color, speed)"
  - "[ ] Implementar pooling/recycling"
---

# Task: Create Particle System

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar sistema de particulas completo — emitter, lifecycle, forces e rendering — usando a abordagem correta para a quantidade de particulas. O sistema deve ser performatico, configuravel e reutilizavel.

## Pre-Conditions
- Animation brief com tipo de efeito desejado (snow, fire, confetti, dust, magic)
- Quantidade estimada de particulas definida
- Target devices conhecidos (mobile vs desktop)
- Three.js scene configurada (se 3D)

## Passos

### 1. Selecionar Approach por Quantidade
| Quantidade | Approach | Rendering | GPU Load |
|------------|----------|-----------|----------|
| < 500 | Mesh sprites / CSS | Individual DOM/mesh | Baixo |
| 500-5K | THREE.Points + BufferGeometry | Single draw call | Medio |
| 5K-100K | InstancedMesh | Instanced rendering | Medio-Alto |
| 100K-1M | GPGPU (FBO ping-pong) | Compute in shader | Alto |
| 1M+ | GPGPU + LOD culling | Shader + frustum | Muito Alto |

### 2. Configurar BufferGeometry (Points Approach)
```javascript
const count = 10000;
const positions = new Float32Array(count * 3);
const velocities = new Float32Array(count * 3);
const lifetimes = new Float32Array(count);
const sizes = new Float32Array(count);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));
geometry.setAttribute('aLifetime', new THREE.BufferAttribute(lifetimes, 1));
geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
```

### 3. Implementar Emitter
| Emitter Shape | Distribuicao | Uso |
|---------------|-------------|-----|
| Point | Todas do mesmo ponto | Sparks, explosion origin |
| Sphere | Random na superficie | Aura, magic orb |
| Box | Random dentro do volume | Snow, rain, dust |
| Cone | Direcional com spread | Fire, jet, fountain |
| Mesh surface | Random nos triangulos | Object dissolution |
| Line/curve | Ao longo de um path | Trail, ribbon |

### 4. Configurar Particle Lifecycle
```javascript
// Per-particle lifecycle
for (let i = 0; i < count; i++) {
  lifetimes[i] -= delta;
  if (lifetimes[i] <= 0) {
    respawnParticle(i); // Reset position, velocity, lifetime
  }
  // Age ratio for fade/size curves
  const age = 1.0 - (lifetimes[i] / maxLifetime);
  sizes[i] = sizeCurve(age); // Grow then shrink
  // Update opacity via age in shader
}
```

### 5. Aplicar Forces
| Force | Formula | Efeito |
|-------|---------|--------|
| Gravity | `vel.y -= 9.8 * mass * dt` | Queda natural |
| Wind | `vel.x += windStrength * dt` | Deriva lateral |
| Turbulence | `vel += noise3D(pos) * strength` | Movimento organico |
| Attraction | `vel += normalize(target - pos) * force` | Atrai para ponto |
| Drag | `vel *= (1.0 - drag * dt)` | Desaceleracao |
| Vortex | `vel += cross(axis, pos - center) * spin` | Espiral |

### 6. Implementar ShaderMaterial para Points
```glsl
// Vertex shader
attribute float aLifetime;
attribute float aSize;
varying float vAge;
void main() {
  vAge = 1.0 - aLifetime;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPos.z); // Size attenuation
  gl_Position = projectionMatrix * mvPos;
}

// Fragment shader
varying float vAge;
uniform sampler2D uTexture;
void main() {
  vec4 texColor = texture2D(uTexture, gl_PointCoord);
  float alpha = texColor.a * smoothstep(1.0, 0.8, vAge); // Fade out
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(texColor.rgb, alpha);
}
```

### 7. Adicionar Variacao Visual
- **Size:** Random range (minSize..maxSize) + age curve (grow-then-shrink)
- **Color:** Gradient ao longo do lifetime (e.g., white -> yellow -> orange -> transparent para fogo)
- **Speed:** Random initial velocity com spread angle
- **Rotation:** Random spin rate para sprites com textura nao circular
- **Opacity:** Fade-in rapido (0-10% lifetime), fade-out gradual (70-100%)

### 8. Implementar Object Pooling
```javascript
class ParticlePool {
  constructor(maxCount) {
    this.pool = new Array(maxCount);
    this.activeCount = 0;
    this.firstDead = 0;
  }
  spawn() {
    if (this.firstDead >= this.pool.length) return null;
    const p = this.pool[this.firstDead++];
    this.activeCount++;
    return p;
  }
  recycle(index) {
    // Swap dead particle to end of active range
    [this.pool[index], this.pool[--this.firstDead]] =
      [this.pool[this.firstDead], this.pool[index]];
    this.activeCount--;
  }
}
```

### 9. GPGPU Approach (100K+ Particulas)
- Usar dois FBOs (ping-pong) para posicao e velocidade
- Cada pixel do FBO = 1 particula (RGBA = xyz + w)
- Fragment shader computa physics (forces, collision)
- Vertex shader le textura para posicionar Points
- DataTexture para initial state
- Requer `WEBGL_color_buffer_float` ou WebGL2

### 10. Cleanup e Dispose
```javascript
function disposeParticleSystem(system) {
  system.geometry.dispose();
  system.material.dispose();
  if (system.material.uniforms.uTexture) {
    system.material.uniforms.uTexture.value.dispose();
  }
  scene.remove(system);
}
```

## Output
- Particle system completo e funcional
- Emitter configuravel (shape, rate, burst)
- Force system (gravity, wind, turbulence, attraction)
- Lifecycle management (spawn, age, die, recycle)
- Visual variation (size, color, opacity curves)
- Pooling/recycling para zero-allocation runtime
- ShaderMaterial otimizado
- Cleanup/dispose functions

## Quality Criteria
- [ ] Approach correto para quantidade de particulas
- [ ] Emitter shape configuravel
- [ ] Forces aplicadas corretamente (gravity, wind, turbulence)
- [ ] Lifecycle completo (spawn, age, fade, recycle)
- [ ] Size attenuation por distancia da camera
- [ ] Object pooling (zero allocation apos init)
- [ ] 60fps no target device
- [ ] Dispose limpa toda memoria (geometry, material, textures)
