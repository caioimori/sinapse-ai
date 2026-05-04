---
task: implement-point-cloud-animation
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: point_cloud_data
    tipo: file
    origem: "usuario (.pcd, .ply, .xyz, .las)"
    obrigatorio: true
  - campo: animation_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: animated_point_cloud
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Carregar dados com loader correto (PCDLoader, PLYLoader)"
  - "[ ] Normalizar posicoes e escala"
  - "[ ] Implementar animacao (morph, explode, flow, colorize)"
  - "[ ] Configurar PointsMaterial ou ShaderMaterial"
  - "[ ] Otimizar para quantidade de pontos"
  - "[ ] Adicionar interatividade (hover, click regions)"
---

# Task: Implement Point Cloud Animation

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Carregar dados de point cloud (scan 3D, LiDAR, modelos convertidos), normalizar, e implementar animacoes — morph entre shapes, explosao, flow, colorize, e interatividade. Otimizar rendering para grandes quantidades de pontos.

## Pre-Conditions
- Arquivo de point cloud disponivel (.pcd, .ply, .xyz, .las)
- Three.js scene configurada com camera e controls
- Quantidade de pontos estimada (afeta approach)
- Animacao desejada definida no brief (morph, explode, wave, colorize)

## Passos

### 1. Selecionar Loader por Formato
| Formato | Loader | Import | Notas |
|---------|--------|--------|-------|
| .pcd | PCDLoader | `three/addons/loaders/PCDLoader` | Point Cloud Data, binario/ASCII |
| .ply | PLYLoader | `three/addons/loaders/PLYLoader` | Polygon File, pode ter cores |
| .xyz | Custom parser | Manual (fetch + parse) | ASCII: x y z [r g b] por linha |
| .las/.laz | LASLoader / copc.js | Externo | LiDAR, requer decompressao |
| .obj (vertices) | OBJLoader + extract | `three/addons/loaders/OBJLoader` | Extrair posicoes dos vertices |

### 2. Carregar e Parsear
```javascript
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';

const loader = new PCDLoader();
const points = await loader.loadAsync('/data/model.pcd');

// Extract raw data
const positions = points.geometry.attributes.position.array;
const colors = points.geometry.attributes.color?.array;
const pointCount = positions.length / 3;
console.log(`Loaded ${pointCount} points`);
```

### 3. Normalizar Posicoes e Escala
```javascript
function normalizePointCloud(geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.0 / maxDim; // Fit in [-1, 1]

  const pos = geometry.attributes.position.array;
  for (let i = 0; i < pos.length; i += 3) {
    pos[i]     = (pos[i]     - center.x) * scale;
    pos[i + 1] = (pos[i + 1] - center.y) * scale;
    pos[i + 2] = (pos[i + 2] - center.z) * scale;
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.computeBoundingSphere();
}
```

### 4. Configurar Material
| Approach | Quando | Vantagem |
|----------|--------|----------|
| PointsMaterial | Simples, < 50K | Facil setup, cores built-in |
| ShaderMaterial | Custom fx, > 50K | Controle total, GPU animation |
| RawShaderMaterial | Performance max | Zero overhead, WebGL2 |

```javascript
// ShaderMaterial com size attenuation e alpha
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPointSize: { value: 3.0 },
    uProgress: { value: 0 },
  },
  vertexShader: pointCloudVert,
  fragmentShader: pointCloudFrag,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
```

### 5. Implementar Animacao: Explode
```javascript
// Store original positions, compute explosion directions
const originalPos = new Float32Array(positions);
const directions = new Float32Array(positions.length);
for (let i = 0; i < positions.length; i += 3) {
  const dir = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]).normalize();
  directions[i] = dir.x;
  directions[i+1] = dir.y;
  directions[i+2] = dir.z;
}
geometry.setAttribute('aDirection', new THREE.BufferAttribute(directions, 3));
// In vertex shader: position + aDirection * uProgress * explosionRadius
```

### 6. Implementar Animacao: Wave/Flow
```glsl
// Vertex shader: wave displacement
uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
void main() {
  vec3 pos = position;
  float wave = sin(pos.x * uWaveFrequency + uTime) * uWaveAmplitude;
  pos.y += wave;
  pos.z += cos(pos.z * uWaveFrequency * 0.7 + uTime * 1.3) * uWaveAmplitude * 0.5;
  // ... gl_Position
}
```

### 7. Implementar Animacao: Colorize por Atributo
| Mapeamento | Fonte | Visual |
|------------|-------|--------|
| Height (Y) | position.y | Gradiente vertical |
| Distance from center | length(position) | Radial gradient |
| Normal direction | computed normal | Orientation colors |
| Density | neighbor count | Hot/cold map |
| Custom attribute | loaded data | Data-driven |

### 8. Adicionar Interatividade
```javascript
// Raycaster for point selection
const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.05; // Adjust for point density

canvas.addEventListener('pointermove', (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(pointCloud);
  if (intersects.length > 0) {
    const idx = intersects[0].index;
    highlightRegion(idx, radius);
  }
});
```

### 9. Otimizar para Grandes Quantidades
| Tecnica | Pontos | Descricao |
|---------|--------|-----------|
| Frustum culling | > 100K | Apenas renderizar pontos no view |
| LOD por distancia | > 500K | Reduzir point count quando longe |
| Octree spatial index | > 100K | Acelerar raycasting e queries |
| WebWorker loading | > 1M | Parse em thread separada |
| Streaming | > 5M | Carregar por chunks (copc.js) |
| GPU sorting | > 100K | Sort por depth no shader |

### 10. Cleanup e Reduced Motion
```javascript
// Cleanup
function dispose() {
  geometry.dispose();
  material.dispose();
  scene.remove(pointCloud);
}

// Reduced motion: show static point cloud, skip animations
if (prefersReducedMotion) {
  material.uniforms.uProgress.value = 0; // Default state
  // Skip all animated transitions
}
```

## Output
- Point cloud carregado e normalizado
- Material configurado (Points ou Shader)
- Animacoes implementadas (explode, wave, colorize, morph)
- Interatividade (hover highlight, click selection)
- Otimizacoes aplicadas para quantidade de pontos
- Cleanup/dispose functions
- Reduced motion variant

## Quality Criteria
- [ ] Loader correto para formato do arquivo
- [ ] Posicoes normalizadas (centered, scaled)
- [ ] Material com size attenuation e alpha
- [ ] Pelo menos 2 tipos de animacao implementados
- [ ] Raycaster configurado para interatividade
- [ ] 60fps com a quantidade de pontos do dataset
- [ ] Memoria limpa no dispose (geometry, material)
- [ ] Reduced motion: static cloud sem animacao
