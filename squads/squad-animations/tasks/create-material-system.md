---
task: create-material-system
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_setup
    tipo: code
    origem: "setup-threejs-scene"
    obrigatorio: true
  - campo: material_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: materials
    tipo: code
    destino: "shader-artist ou proxima fase"

Checklist:
  - "[ ] Selecionar tipo de material (Standard, Physical, Toon, Shader)"
  - "[ ] Configurar PBR maps (roughness, metalness, normal, ao)"
  - "[ ] Implementar texture loading otimizado"
  - "[ ] Configurar envMap e reflections"
  - "[ ] Testar performance dos materiais"
---

# Task: Create Material System

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar sistema de materiais Three.js — PBR (Standard/Physical), Toon, custom ShaderMaterial. Materiais definem a aparencia visual dos objetos e sao cruciais para o look and feel da cena.

## Pre-Conditions
- Scene com renderer e tone mapping configurados
- Estilo visual definido (realista, estilizado, flat)
- Texturas e maps disponiveis (ou cores solidas)
- Environment map carregado (para reflexoes PBR)

## Passos

### 1. Selecionar Tipo de Material
| Tipo | Quando Usar | Performance |
|------|-------------|-------------|
| MeshStandardMaterial | PBR default, maioria dos casos | Media |
| MeshPhysicalMaterial | Clearcoat, transmission, sheen | Alta |
| MeshToonMaterial | Cartoon/cel-shaded look | Baixa |
| MeshBasicMaterial | Sem iluminacao, fullbright | Minima |
| ShaderMaterial | Efeitos customizados | Varia |

### 2. Criar Material PBR Standard
```javascript
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#cc8844'),
  roughness: 0.4,
  metalness: 0.8,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  aoMap: aoTexture,
  aoMapIntensity: 1.0,
  envMap: envMapTexture,
  envMapIntensity: 1.0,
});
```

### 3. Configurar Material Physical (Glass, Clearcoat)
```javascript
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  roughness: 0.05,
  metalness: 0.0,
  transmission: 0.95,
  thickness: 0.5,
  ior: 1.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});
```

### 4. Criar Toon Material
```javascript
const toonMaterial = new THREE.MeshToonMaterial({
  color: '#ff6644',
  gradientMap: threeToneTexture, // 3-step gradient
});
// Criar gradient texture
const colors = new Uint8Array([0, 128, 255]);
const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
```

### 5. Texture Loading Otimizado
```javascript
const textureLoader = new THREE.TextureLoader();
function loadTexture(url, options = {}) {
  const texture = textureLoader.load(url);
  texture.colorSpace = options.isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}
// Color maps: sRGB | Normal/roughness/metalness: Linear
```

### 6. Material Variants
```javascript
// Criar variantes do mesmo material base
function createMaterialVariant(baseMaterial, overrides) {
  return baseMaterial.clone();
  Object.assign(variant, overrides);
  return variant;
}
const matRed = createMaterialVariant(baseMat, { color: new THREE.Color('red') });
```

### 7. Configurar Environment Map nos Materiais
```javascript
scene.traverse((child) => {
  if (child.isMesh && child.material.isMeshStandardMaterial) {
    child.material.envMap = envMap;
    child.material.envMapIntensity = 1.0;
    child.material.needsUpdate = true;
  }
});
```

### 8. Material para Wireframe e Debug
```javascript
const wireframeMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: '#00ff00',
  transparent: true,
  opacity: 0.3,
});
```

### 9. Otimizar Materiais
| Tecnica | Impacto |
|---------|---------|
| Compartilhar materiais identicos | Reduz draw calls |
| Texture atlas (combinar maps) | Reduz texture binds |
| Reduzir resolucao de normal maps | Reduz VRAM |
| Desabilitar maps desnecessarios | Performance |
| `material.precision = 'mediump'` | Mobile perf |

### 10. Dispose de Materiais
```javascript
function disposeMaterial(material) {
  const maps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'envMap'];
  maps.forEach((mapName) => {
    if (material[mapName]) material[mapName].dispose();
  });
  material.dispose();
}
```

## Output
- Materiais configurados por tipo (PBR, toon, shader)
- Texture loading com color space correto
- Material variants para diferentes objetos
- Environment map integration
- Dispose function para cleanup
- Documentacao de material properties

## Quality Criteria
- [ ] Color space correto (sRGB para color, Linear para data maps)
- [ ] Roughness e metalness fisicamente plausiveis
- [ ] Environment map aplicado e contribui para reflexoes
- [ ] Materiais compartilhados onde possivel
- [ ] Textures com anisotropy maxima
- [ ] Dispose limpa todos maps e materiais
- [ ] Performance aceitavel (renderer.info.render.calls)
- [ ] Visual consistente com tone mapping da cena
