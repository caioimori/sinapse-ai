---
task: create-noise-visualization
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: noise_viz_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: noise_visualization
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tipo de noise e dimensao (2D, 3D, 4D)"
  - "[ ] Implementar visualizacao (mesh deformation, color mapping, height map)"
  - "[ ] Animar com time dimension"
  - "[ ] Configurar escala e frequencia"
  - "[ ] Mapear para estetica desejada"
---

# Task: Create Noise Visualization

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar visualizacao animada baseada em noise functions — terrain height maps, mesh deformation, color fields, blob shapes. Selecionar tipo de noise correto, configurar parametros e animar usando dimensao temporal.

## Pre-Conditions
- Tipo de visualizacao definido (terrain, blob, color field, mesh deform)
- Noise library disponivel (simplex-noise, glsl-noise)
- Three.js scene ou Canvas 2D configurado
- Estetica desejada (organico, tecnico, abstrato, liquido)

## Passos

### 1. Selecionar Tipo de Noise
| Tipo | Dimensao | Visual | Uso |
|------|----------|--------|-----|
| Perlin 2D | 2D | Suave, organico | Terrain, backgrounds |
| Simplex 3D | 3D (xy + time) | Fluido, evolui | Animated surfaces |
| Worley (Cellular) | 2D/3D | Celular, cracks | Voronoi-like textures |
| FBM (Fractal) | 2D-4D | Multi-escala | Clouds, terrain detail |
| Curl noise | 2D/3D | Rotacional | Flow fields, smoke |
| Domain warping | 2D/3D | Distorcido | Marble, liquid metal |

### 2. Implementar Noise em JavaScript (CPU)
```javascript
import { createNoise3D } from 'simplex-noise';
const noise3D = createNoise3D();

// FBM (Fractal Brownian Motion)
function fbm(x, y, z, octaves = 4, lacunarity = 2, persistence = 0.5) {
  let value = 0, amplitude = 1, frequency = 1, maxAmplitude = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxAmplitude; // Normalize to [-1, 1]
}
```

### 3. Visualizacao: Height Map (Mesh Deformation)
```javascript
const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
const positions = geometry.attributes.position.array;

function updateTerrain(time) {
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    positions[i + 2] = fbm(x * 0.3, y * 0.3, time * 0.2) * 2; // Z = height
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals(); // For lighting
}
```

### 4. Visualizacao: Color Field (Canvas 2D)
```javascript
const imageData = ctx.createImageData(width, height);
function renderColorField(time) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = fbm(x * scale, y * scale, time, 4);
      const mapped = (val + 1) * 0.5; // [0, 1]
      const color = colorRamp(mapped, brandPalette);
      const idx = (y * width + x) * 4;
      imageData.data[idx]     = color.r;
      imageData.data[idx + 1] = color.g;
      imageData.data[idx + 2] = color.b;
      imageData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
```

### 5. Visualizacao: 3D Blob (Sphere Deformation)
```javascript
const geometry = new THREE.SphereGeometry(1, 64, 64);
const basePositions = geometry.attributes.position.array.slice(); // Copy original

function updateBlob(time) {
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = basePositions[i], y = basePositions[i+1], z = basePositions[i+2];
    const noiseVal = fbm(x * 2, y * 2, z * 2 + time * 0.5, 3);
    const displacement = 1 + noiseVal * 0.3; // 0.7 to 1.3
    positions[i]     = x * displacement;
    positions[i + 1] = y * displacement;
    positions[i + 2] = z * displacement;
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}
```

### 6. Implementar em GLSL (GPU — Melhor Performance)
```glsl
// Vertex shader for mesh deformation
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;

// Include noise functions (simplex3D)
#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

void main() {
  vec3 pos = position;
  float n = snoise3(pos * uFrequency + uTime * 0.3) * uAmplitude;
  pos += normal * n; // Displace along normal
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// Fragment shader for color mapping
varying float vNoise;
uniform vec3 uColor1;
uniform vec3 uColor2;
void main() {
  float t = vNoise * 0.5 + 0.5;
  vec3 color = mix(uColor1, uColor2, t);
  gl_FragColor = vec4(color, 1.0);
}
```

### 7. Domain Warping (Distorted Noise)
```javascript
// Warp noise coordinates with more noise
function domainWarp(x, y, time) {
  const warpAmount = 1.5;
  const wx = fbm(x + 0.0, y + 0.0, time) * warpAmount;
  const wy = fbm(x + 5.2, y + 1.3, time) * warpAmount;
  return fbm(x + wx, y + wy, time);
  // Can be nested: warp the warp for more complexity
}
```

### 8. Parametros Configuráveis
| Parametro | Range | Efeito |
|-----------|-------|--------|
| frequency | 0.1-5.0 | Escala do pattern (baixo = grande, alto = detalhe) |
| octaves | 1-8 | Niveis de detalhe (mais = mais complexo) |
| lacunarity | 1.5-3.0 | Ratio de frequencia entre octaves |
| persistence | 0.2-0.8 | Quanto cada octave contribui |
| amplitude | 0.1-2.0 | Intensidade do displacement/cor |
| timeSpeed | 0.01-0.5 | Velocidade da animacao |
| warpAmount | 0-3.0 | Intensidade do domain warping |

### 9. Material e Iluminacao
| Superficie | Material | Efeito Visual |
|-----------|----------|---------------|
| Terrain | MeshStandardMaterial | Iluminacao realista, sombras |
| Blob | MeshPhysicalMaterial + iridescence | Organico, liquido |
| Wireframe | MeshBasicMaterial wireframe | Tecnico, retro |
| Color field | ShaderMaterial | Cores custom, sem iluminacao |
| Matcap | MeshMatcapMaterial | Stylized, art direction |

### 10. Cleanup e Reduced Motion
```javascript
function dispose() {
  cancelAnimationFrame(animId);
  geometry.dispose();
  material.dispose();
  scene.remove(mesh);
}

// Reduced motion: show static noise snapshot
if (prefersReducedMotion) {
  updateTerrain(0); // Fixed time = static
  return; // No animation loop
}
```

## Output
- Noise visualization animada funcional
- Tipo de noise correto para estetica
- Parametros configuráveis (frequency, octaves, amplitude, speed)
- Animacao via time dimension
- Color mapping para brand palette
- GLSL version para GPU performance (se necessario)
- Cleanup/dispose functions
- Reduced motion variant

## Quality Criteria
- [ ] Tipo de noise correto para visual desejado
- [ ] FBM com octaves configuráveis
- [ ] Animacao suave via time dimension (sem pops)
- [ ] Displacement proporcional e natural
- [ ] Normais recomputadas para iluminacao correta
- [ ] Cores mapeadas para brand palette
- [ ] 60fps na resolucao target
- [ ] Reduced motion: snapshot estatico
