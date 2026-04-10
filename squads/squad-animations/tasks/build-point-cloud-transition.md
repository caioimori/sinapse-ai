---
task: build-point-cloud-transition
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: source_cloud
    tipo: code
    origem: "implement-point-cloud-animation"
    obrigatorio: true
  - campo: target_shape
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: cloud_transition
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Definir posicoes source e target"
  - "[ ] Implementar morphing com lerp ou GSAP"
  - "[ ] Equalizar quantidade de pontos (sampling)"
  - "[ ] Adicionar stagger ou wave no morph"
  - "[ ] Configurar easing da transicao"
  - "[ ] Manter performance durante transicao"
---

# Task: Build Point Cloud Transition

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar transicoes entre formas de point cloud — morph de uma geometria para outra, de dados reais para shapes, ou entre estados visuais. Equalizar quantidade de pontos, implementar stagger/wave patterns e manter performance.

## Pre-Conditions
- Source point cloud carregado e normalizado
- Target shape definido (outra cloud, geometria, texto, imagem)
- Quantidade de pontos das duas fontes conhecida
- Easing e duration definidos no brief

## Passos

### 1. Definir Source e Target Positions
| Source | Target | Tipo de Transicao |
|--------|--------|-------------------|
| Loaded .pcd/.ply | THREE.SphereGeometry | Data to shape |
| Random scatter | Text vertices | Chaos to order |
| Shape A | Shape B | Shape morph |
| Image pixels | 3D object | 2D to 3D |
| Organized grid | Scattered | Order to chaos |

```javascript
// Extract positions from any geometry
function getPositions(geometry, count) {
  if (geometry.attributes.position) {
    return geometry.attributes.position.array;
  }
  // Sample surface for mesh geometries
  return sampleSurface(geometry, count);
}
```

### 2. Equalizar Quantidade de Pontos
```javascript
function matchPointCounts(sourcePos, targetPos) {
  const sourceCount = sourcePos.length / 3;
  const targetCount = targetPos.length / 3;

  if (sourceCount === targetCount) return { source: sourcePos, target: targetPos };

  if (sourceCount > targetCount) {
    // Duplicate random target points to match source count
    const expanded = new Float32Array(sourceCount * 3);
    for (let i = 0; i < sourceCount; i++) {
      const ti = (i < targetCount) ? i : Math.floor(Math.random() * targetCount);
      expanded[i * 3]     = targetPos[ti * 3];
      expanded[i * 3 + 1] = targetPos[ti * 3 + 1];
      expanded[i * 3 + 2] = targetPos[ti * 3 + 2];
    }
    return { source: sourcePos, target: expanded };
  } else {
    // Duplicate random source points
    // ... similar logic
  }
}
```

### 3. Implementar Nearest-Neighbor Matching
```javascript
// Match each source point to nearest target for smooth morph
function matchNearestNeighbor(sourcePos, targetPos) {
  const count = sourcePos.length / 3;
  const matched = new Float32Array(count * 3);
  const used = new Set();

  for (let i = 0; i < count; i++) {
    let minDist = Infinity, bestIdx = 0;
    const sx = sourcePos[i*3], sy = sourcePos[i*3+1], sz = sourcePos[i*3+2];
    for (let j = 0; j < count; j++) {
      if (used.has(j)) continue;
      const dx = targetPos[j*3] - sx;
      const dy = targetPos[j*3+1] - sy;
      const dz = targetPos[j*3+2] - sz;
      const d = dx*dx + dy*dy + dz*dz;
      if (d < minDist) { minDist = d; bestIdx = j; }
    }
    used.add(bestIdx);
    matched[i*3]   = targetPos[bestIdx*3];
    matched[i*3+1] = targetPos[bestIdx*3+1];
    matched[i*3+2] = targetPos[bestIdx*3+2];
  }
  return matched;
}
// NOTE: O(n^2) — para > 10K pontos, usar KD-Tree
```

### 4. Morph via Shader (GPU)
```glsl
// Vertex shader: lerp between source and target
attribute vec3 aTargetPosition;
uniform float uProgress; // 0.0 = source, 1.0 = target

void main() {
  vec3 pos = mix(position, aTargetPosition, uProgress);
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0 * (300.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
```

```javascript
// Animate progress
geometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));
gsap.to(material.uniforms.uProgress, {
  value: 1.0,
  duration: 2,
  ease: 'power2.inOut',
});
```

### 5. Stagger Pattern no Morph
```glsl
// Per-point delay based on position or index
attribute float aDelay; // 0.0 - 1.0 normalized delay
uniform float uProgress;
uniform float uStaggerAmount; // 0.0 - 0.5

void main() {
  float localProgress = smoothstep(aDelay * uStaggerAmount,
                                    aDelay * uStaggerAmount + (1.0 - uStaggerAmount),
                                    uProgress);
  vec3 pos = mix(position, aTargetPosition, localProgress);
  // ...
}
```

| Stagger Pattern | Delay Calculo | Visual |
|----------------|---------------|--------|
| Distance from center | `length(position) / maxDist` | Radial wave |
| Y axis (top-down) | `(position.y - minY) / range` | Cascade |
| Random | `random(index)` | Organic scatter |
| Angle | `atan2(z, x) / TAU` | Spiral |
| Index | `float(index) / float(count)` | Sequential |

### 6. Easing Curves para Morph
| Easing | Feeling | cubic-bezier |
|--------|---------|-------------|
| Power2.inOut | Smooth, balanced | (0.4, 0, 0.2, 1) |
| Back.out | Overshoot no target | (0.175, 0.885, 0.32, 1.275) |
| Elastic.out | Bouncy settle | Spring simulation |
| Power3.in | Dramatic departure | (0.4, 0, 1, 1) |
| Steps | Discrete, glitchy | step() function |

### 7. Adicionar Efeitos Durante Transicao
```glsl
// Add turbulence during morph (noise displacement)
uniform float uTurbulence;
vec3 pos = mix(position, aTargetPosition, localProgress);
// Only apply turbulence in the middle of transition
float turbMask = sin(localProgress * 3.14159); // Peak at 50%
pos += snoise3(pos * 3.0 + uTime) * uTurbulence * turbMask;
```

| Efeito | Quando | Visual |
|--------|--------|--------|
| Turbulence | Mid-morph | Pontos se desviam e convergem |
| Color shift | During morph | Gradiente de cor na transicao |
| Size pulse | Mid-morph | Pontos crescem e encolhem |
| Scatter | Before morph | Explodem antes de convergir |
| Trail | During morph | Lines entre old e new position |

### 8. Multi-State Transitions (Chain)
```javascript
const states = [spherePositions, cubePositions, torusPositions, textPositions];
let currentState = 0;

function morphToNext() {
  const nextState = (currentState + 1) % states.length;
  geometry.setAttribute('aTargetPosition',
    new THREE.BufferAttribute(states[nextState], 3));
  gsap.fromTo(material.uniforms.uProgress, { value: 0 }, {
    value: 1,
    duration: 2,
    ease: 'power2.inOut',
    onComplete: () => {
      // Swap: target becomes new source
      geometry.attributes.position.array.set(states[nextState]);
      geometry.attributes.position.needsUpdate = true;
      material.uniforms.uProgress.value = 0;
      currentState = nextState;
    }
  });
}
```

### 9. Generate Target from Text/Image
```javascript
// Text to points: render text to canvas, sample non-transparent pixels
function textToPoints(text, font, size, count) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, 0, size);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const points = [];
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (imageData.data[(y * canvas.width + x) * 4 + 3] > 128) {
        points.push(x, -y, 0); // Flip Y
      }
    }
  }
  // Subsample to target count
  return subsample(points, count);
}
```

### 10. Cleanup e Reduced Motion
```javascript
function dispose() {
  geometry.dispose();
  material.dispose();
  scene.remove(points);
}

// Reduced motion: instant state change, no morph animation
if (prefersReducedMotion) {
  material.uniforms.uProgress.value = 1; // Jump to target
  return;
}
```

## Output
- Point cloud transition funcional (source -> target)
- Point count equalizacao implementada
- Nearest-neighbor matching para smooth morph
- Shader-based lerp com stagger
- Easing configuravel
- Mid-transition effects (turbulence, color shift)
- Multi-state chain support
- Cleanup/dispose functions

## Quality Criteria
- [ ] Source e target com mesma quantidade de pontos
- [ ] Matching minimiza distancia total de morph
- [ ] Morph suave sem pops ou clusters
- [ ] Stagger pattern visualmente interessante
- [ ] Mid-transition effects nao obscurecem formas
- [ ] Multi-state chain funcional com swap correto
- [ ] 60fps durante transicao
- [ ] Reduced motion: salto instantaneo
