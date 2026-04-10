---
task: create-3d-environment
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_setup
    tipo: code
    origem: "setup-threejs-scene"
    obrigatorio: true
  - campo: environment_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: environment
    tipo: code
    destino: "configure-camera-system"

Checklist:
  - "[ ] Criar geometrias do ambiente"
  - "[ ] Aplicar materiais e texturas"
  - "[ ] Posicionar elementos na cena"
  - "[ ] Configurar environment map se necessario"
  - "[ ] Otimizar draw calls"
---

# Task: Create 3D Environment

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Construir ambiente 3D completo — geometrias, disposicao espacial, materiais base e environment maps. O ambiente define o "palco" onde todos os outros elementos (modelos, particulas, efeitos) serao colocados.

## Pre-Conditions
- Scene setup funcional (setup-threejs-scene)
- Tipo de ambiente definido: abstrato, realista, minimalista
- Escala da cena definida (units: metros, unidades arbitrarias)
- Asset list (quais geometrias e texturas serao necessarias)

## Passos

### 1. Classificar Tipo de Ambiente
| Tipo | Geometrias | Materiais | Exemplo |
|------|-----------|-----------|---------|
| Abstrato | Primitivos | Flat/Toon | Portfolio hero, creative showcase |
| Produto | Plano + pedestal | PBR | Product viewer, e-commerce |
| Paisagem | Plane + noise displacement | Terrain shader | Generative landscape |
| Interior | Box + planes | PBR + envMap | Showroom, gallery |
| Vazio/Infinito | Nenhuma (apenas background) | — | Particulas, floating objects |

### 2. Criar Ground Plane
```javascript
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.8,
    metalness: 0.1,
  })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
```

### 3. Posicionar Elementos com Grid
```javascript
// Layout grid para posicionamento
const spacing = 2.0;
objects.forEach((obj, i) => {
  const col = i % columns;
  const row = Math.floor(i / columns);
  obj.position.set(
    col * spacing - (columns * spacing) / 2,
    0,
    row * spacing - (rows * spacing) / 2
  );
});
```

### 4. Implementar Backdrop/Cyclorama
```javascript
// Curved backdrop for product shots
const backdrop = new THREE.Mesh(
  new THREE.CylinderGeometry(10, 10, 8, 32, 1, true, 0, Math.PI),
  new THREE.MeshStandardMaterial({ color: '#f0f0f0', side: THREE.BackSide })
);
scene.add(backdrop);
```

### 5. Adicionar Environment Map
```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader';
const pmrem = new THREE.PMREMGenerator(renderer);
new RGBELoader().load('environment.hdr', (texture) => {
  const envMap = pmrem.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  scene.background = envMap; // Opcional
  texture.dispose();
  pmrem.dispose();
});
```

### 6. Organizar Scene Graph
```javascript
// Agrupar elementos logicamente
const environmentGroup = new THREE.Group();
environmentGroup.name = 'environment';
const objectsGroup = new THREE.Group();
objectsGroup.name = 'objects';
scene.add(environmentGroup);
scene.add(objectsGroup);
```

### 7. Otimizar Geometrias
- Merge geometrias estaticas: `BufferGeometryUtils.mergeGeometries()`
- Compartilhar materiais identicos entre meshes
- Usar `InstancedMesh` para objetos repetidos
- Definir `frustumCulled = true` (default)

### 8. Implementar Bounding Box Helpers (Dev)
```javascript
if (DEV) {
  scene.traverse((child) => {
    if (child.isMesh) {
      const box = new THREE.BoxHelper(child, 0xff0000);
      scene.add(box);
    }
  });
}
```

### 9. Configurar Escalas Consistentes
| Elemento | Escala Tipica |
|----------|--------------|
| Ground plane | 20x20 units |
| Product object | 1-2 units |
| Camera distance | 3-8 units |
| Light range | 10-20 units |

### 10. Validar Orientacao e Coordenadas
- Three.js: Y-up, right-handed
- Verificar que modelos importados usam mesma orientacao
- Normalizar posicao para centro (0,0,0) se necessario

## Output
- Ambiente 3D completo com geometrias e materiais
- Environment map aplicado
- Scene graph organizado em grupos logicos
- Geometrias otimizadas (merge, instance)
- Documentacao de escala e coordenadas
- Dev helpers para debug

## Quality Criteria
- [ ] Scene graph organizado (grupos nomeados)
- [ ] Materiais compartilhados onde possivel
- [ ] Environment map aplicado e limpo (dispose PMREM)
- [ ] Geometrias estaticas merged
- [ ] Y-up consistente em toda a cena
- [ ] Draw calls minimizados
- [ ] Ground plane recebe sombras
- [ ] Performance baseline medida (renderer.info)
