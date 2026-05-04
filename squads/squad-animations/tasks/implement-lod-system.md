---
task: implement-lod-system
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_setup
    tipo: code
    origem: "setup-threejs-scene"
    obrigatorio: true
  - campo: models
    tipo: array
    origem: "load-3d-models"
    obrigatorio: true

Saida:
  - campo: lod_system
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Criar LOD groups para modelos pesados"
  - "[ ] Definir distancias de transicao"
  - "[ ] Implementar instancing para objetos repetidos"
  - "[ ] Configurar frustum culling"
  - "[ ] Testar transicoes suaves entre niveis"
---

# Task: Implement LOD System

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Implementar Level of Detail (LOD) — diferentes niveis de qualidade geometrica baseados na distancia da camera. Essencial para cenas com muitos objetos ou modelos complexos.

## Pre-Conditions
- Modelos carregados com diferentes resolutions disponiveis
- Cena com objetos em diferentes distancias
- Performance issue identificada ou prevenida
- Camera system configurado

## Passos

### 1. Criar LOD Group
```javascript
const lod = new THREE.LOD();
// High detail (perto)
lod.addLevel(highDetailMesh, 0);
// Medium detail
lod.addLevel(mediumDetailMesh, 10);
// Low detail (longe)
lod.addLevel(lowDetailMesh, 25);
// Invisible (muito longe)
lod.addLevel(new THREE.Object3D(), 50);
scene.add(lod);
```

### 2. Definir Distancias por Tipo de Objeto
| Objeto | LOD0 (high) | LOD1 (medium) | LOD2 (low) | Cull |
|--------|-------------|---------------|------------|------|
| Hero object | 0 | 15 | 30 | 60 |
| Secondary | 0 | 8 | 20 | 40 |
| Background | 0 | 5 | 12 | 25 |
| Vegetation | 0 | 6 | 15 | 30 |

### 3. Gerar LOD Meshes
```javascript
// Simplificar geometria programaticamente
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier';

const modifier = new SimplifyModifier();
const lod1Geometry = modifier.modify(
  originalGeometry,
  Math.floor(originalGeometry.attributes.position.count * 0.5) // 50%
);
const lod2Geometry = modifier.modify(
  originalGeometry,
  Math.floor(originalGeometry.attributes.position.count * 0.25) // 25%
);
```

### 4. Implementar InstancedMesh
```javascript
// Para objetos repetidos (arvores, rochas, particulas)
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
const matrix = new THREE.Matrix4();
for (let i = 0; i < count; i++) {
  matrix.setPosition(positions[i]);
  matrix.scale(scales[i]);
  instancedMesh.setMatrixAt(i, matrix);
}
instancedMesh.instanceMatrix.needsUpdate = true;
```

### 5. Frustum Culling
```javascript
// Habilitado por default em Object3D
mesh.frustumCulled = true; // Default
// Para objetos com vertex displacement (shader), pode precisar:
mesh.geometry.computeBoundingSphere();
// Ou expandir bounding sphere manualmente:
mesh.geometry.boundingSphere.radius *= 1.5;
```

### 6. LOD Update no Render Loop
```javascript
function animate() {
  // LOD auto-updates baseado na camera
  scene.traverse((child) => {
    if (child.isLOD) {
      child.update(camera);
    }
  });
  renderer.render(scene, camera);
}
```

### 7. Material LOD
```javascript
// Simplificar materiais em LODs distantes
const lod0Mat = new THREE.MeshStandardMaterial({
  map: texture, normalMap: normalMap, roughnessMap: roughMap
});
const lod1Mat = new THREE.MeshStandardMaterial({
  map: texture // Sem normal/roughness maps
});
const lod2Mat = new THREE.MeshBasicMaterial({
  map: texture // Sem lighting
});
```

### 8. Merge Distant Objects
```javascript
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils';
// Merge geometrias de objetos distantes em um unico mesh
const merged = mergeGeometries(distantGeometries);
const mergedMesh = new THREE.Mesh(merged, sharedMaterial);
```

### 9. Adaptive LOD (Device-Based)
```javascript
function getDeviceLODBias() {
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  if (isMobile || isLowEnd) return 0.5; // Use lower LOD sooner
  return 1.0;
}
const bias = getDeviceLODBias();
lod.addLevel(highMesh, 0 * bias);
lod.addLevel(medMesh, 10 * bias);
```

### 10. Monitorar LOD Performance
```javascript
function logLODStats() {
  const info = renderer.info;
  console.log(`Triangles: ${info.render.triangles}`);
  console.log(`Draw calls: ${info.render.calls}`);
  console.log(`Textures: ${info.memory.textures}`);
  console.log(`Geometries: ${info.memory.geometries}`);
}
```

## Output
- LOD groups configurados com distancias
- InstancedMesh para objetos repetidos
- Material LOD (simplificado por distancia)
- Frustum culling otimizado
- Device-adaptive LOD bias
- Performance monitoring

## Quality Criteria
- [ ] LOD transitions nao visiveis (distancia correta)
- [ ] InstancedMesh para 10+ objetos iguais
- [ ] Frustum culling ativo em todos meshes
- [ ] Triangle count reduzido em 50%+ com LOD
- [ ] Draw calls reduzidos com merge/instancing
- [ ] Mobile: LOD mais agressivo
- [ ] Bounding spheres corretas (shader displacement)
- [ ] 60fps alcancado com LOD system ativo
