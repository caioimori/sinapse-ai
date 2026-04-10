# Point Cloud Data Guide — Animacao com Dados 3D Reais

> Guia completo para trabalhar com point clouds (.pcd, .ply, .xyz, .las) em animacoes web.
> De escaneamentos LiDAR a visualizacoes artisticas interativas.

---

## 1. O Que Sao Point Clouds

Uma nuvem de pontos e uma colecao de pontos no espaco 3D (x, y, z), cada um podendo
carregar atributos adicionais como cor (r, g, b), normal (nx, ny, nz), intensidade e
classificacao. Sao produzidos por:

- **LiDAR** — escaneamento laser de ambientes
- **Fotogrametria** — reconstrucao 3D a partir de fotos
- **Sensores de profundidade** — Kinect, RealSense, iPhone LiDAR
- **Simulacoes** — dados sinteticos de particulas/fluidos
- **CAD/BIM** — export de modelos arquitetonicos

---

## 2. Formatos Suportados

| Formato | Ext | Encoding | Atributos | Loader Three.js |
|---------|-----|----------|-----------|----------------|
| PCD | .pcd | ASCII, binary, binary_compressed | pos, rgb, normal, intensity | PCDLoader |
| PLY | .ply | ASCII, binary_little_endian, binary_big_endian | pos, rgb, normal, faces | PLYLoader |
| XYZ | .xyz | ASCII | pos, rgb (opcional) | Custom (parseFloat) |
| LAS | .las | Binary | pos, rgb, class, intensity, return# | Custom / Potree |
| LAZ | .laz | Compressed LAS | Idem LAS | LASZip + custom |
| E57 | .e57 | XML + binary | pos, rgb, normal, intensity | Custom |
| OBJ (points) | .obj | ASCII | pos (vertices sem faces) | OBJLoader |

### PCD Format Detalhado
```
# .PCD v0.7 - Point Cloud Data file format
VERSION 0.7
FIELDS x y z rgb
SIZE 4 4 4 4
TYPE F F F U
COUNT 1 1 1 1
WIDTH 307200
HEIGHT 1
VIEWPOINT 0 0 0 1 0 0 0
POINTS 307200
DATA binary
```

---

## 3. Pipeline de Importacao no Three.js

### PCD
```javascript
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';

const loader = new PCDLoader();
loader.load('scan.pcd', (points) => {
  points.geometry.center();           // Centralizar
  points.geometry.rotateX(Math.PI);   // Corrigir orientacao LiDAR
  points.material.size = 0.01;        // Tamanho dos pontos
  points.material.color.set(0x00ff88); // Cor override
  scene.add(points);
});
```

### PLY
```javascript
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const loader = new PLYLoader();
loader.load('model.ply', (geometry) => {
  geometry.computeVertexNormals();
  const material = new THREE.PointsMaterial({ size: 0.005, vertexColors: true });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
});
```

---

## 4. Tecnicas de Animacao com Point Clouds

### 4.1 Transformacao Basica
- Rotacao continua (`points.rotation.y += 0.002`)
- Translacao (mover a nuvem toda)
- Scale pulsante (`1.0 + sin(time) * 0.05`)

### 4.2 Deformacao por Vertex Shader
```glsl
uniform float uTime;
uniform float uAmplitude;

void main() {
  vec3 pos = position;
  // Noise-based deformation
  pos.x += sin(pos.y * 4.0 + uTime) * uAmplitude;
  pos.y += cos(pos.x * 4.0 + uTime) * uAmplitude;
  pos.z += sin(pos.z * 4.0 + uTime * 0.5) * uAmplitude;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
```

### 4.3 Explosao / Implosao
- Cada ponto move na direcao da sua normal (ou radialmente do centro)
- Controlar com `uProgress` uniform (0.0 = original, 1.0 = explodido)
- Reverse = implosao (pontos convergem para formar o objeto)

### 4.4 Morphing Entre Clouds
- Dois BufferGeometries com mesmo numero de pontos
- Interpolar posicoes: `mix(posA, posB, uProgress)`
- Se quantidades diferentes: amostrar o maior para igualar

### 4.5 Efeitos de Particulas
- Cada ponto da cloud vira particula independente com velocidade e aceleracao
- Gravidade, vento, turbulencia aplicados via shader
- Pontos se dispersam e reagrupam

### 4.6 Coloracao Dinamica
```glsl
// Mapear altitude para cor
float height = (position.y - minY) / (maxY - minY);
vec3 color = mix(vec3(0.0, 0.3, 1.0), vec3(1.0, 0.2, 0.0), height);
```

### 4.7 Transicao Cloud → Mesh
- Delaunay 3D ou Poisson surface reconstruction
- Renderizar como Points, interpolar para Mesh (triangulos)
- Animacao: pontos se conectam progressivamente

### 4.8 Animacao Temporal (4D)
- Sequencia de scans ao longo do tempo
- Interpolar entre frames de scan
- "Time-lapse 3D" de ambientes reais

---

## 5. Otimizacao de Point Clouds

| Tecnica | Impacto |
|---------|---------|
| Downsample (voxel grid) | Reduz pontos mantendo forma |
| LOD (nivel de detalhe) | Mais pontos perto, menos longe |
| Frustum culling | So renderizar pontos visiveis |
| Octree spatial index | Queries espaciais rapidas |
| GPU instancing | Para pontos com geometria (spheres) |
| gl_PointSize adaptativo | Pontos maiores = menos necessarios |
| Texture atlas para cores | Evitar per-point color attribute |

### Limites de Performance
| Pontos | Desktop 60fps | Mobile 30fps |
|--------|---------------|---------------|
| 10K | Trivial | Trivial |
| 100K | Facil | Facil |
| 500K | Ok | Cuidado |
| 1M | Shader otimizado | Downsample |
| 5M+ | GPGPU obrigatorio | Nao recomendado |

---

## 6. Ferramentas Complementares

| Ferramenta | Uso |
|-----------|-----|
| CloudCompare | Visualizar, filtrar, alinhar point clouds |
| Potree | Visualizador web otimizado para point clouds massivos |
| PDAL | Pipeline de processamento de point clouds |
| Open3D (Python) | Processamento e reconstrucao |
| Meshlab | Reconstrucao de superficie |
| Blender | Import/export point clouds com add-ons |
