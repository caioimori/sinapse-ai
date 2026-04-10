---
task: implement-environment-maps
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_setup
    tipo: code
    origem: "setup-threejs-scene"
    obrigatorio: true

Saida:
  - campo: environment
    tipo: code
    destino: "create-material-system"

Checklist:
  - "[ ] Selecionar tipo (HDR, EXR, CubeTexture)"
  - "[ ] Carregar com PMREMGenerator"
  - "[ ] Aplicar como scene.environment e/ou background"
  - "[ ] Ajustar intensidade e rotacao"
  - "[ ] Otimizar resolucao para performance"
---

# Task: Implement Environment Maps

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Implementar environment maps em cenas Three.js — HDR/EXR para reflexoes PBR reais e image-based lighting. Environment maps adicionam realismo dramatico a materiais metalicos e reflexivos.

## Pre-Conditions
- Scene e renderer configurados (tone mapping ativo)
- HDR/EXR file disponivel (ou usar Polyhaven/HDRI Haven)
- Materiais PBR que se beneficiam de reflexoes
- Performance budget considerado (PMREM gera mipmaps)

## Passos

### 1. Selecionar Tipo de Environment Map
| Tipo | Formato | Loader | Uso |
|------|---------|--------|-----|
| Equirectangular HDR | .hdr | RGBELoader | Mais comum, boa qualidade |
| Equirectangular EXR | .exr | EXRLoader | HDR com mais range dinamico |
| CubeTexture | 6x .jpg/.png | CubeTextureLoader | Legacy, 6 faces separadas |
| Procedural | Codigo | THREE.Color + gradient | Backgrounds abstratos |

### 2. Carregar HDR com PMREMGenerator
```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader';

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load('environment.hdr', (texture) => {
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;     // IBL para materiais
  scene.background = envMap;      // Background visivel
  texture.dispose();
  pmremGenerator.dispose();
});
```

### 3. Separar Environment de Background
```javascript
// Environment para reflexoes, background diferente
scene.environment = envMap;
scene.background = new THREE.Color('#000000'); // Background solido
// Ou blur no background
scene.backgroundBlurriness = 0.5;
scene.backgroundIntensity = 0.8;
```

### 4. Ajustar Intensidade
```javascript
scene.environmentIntensity = 1.0; // Three.js r155+
// Ou por material:
material.envMapIntensity = 1.5;
```

### 5. Rotacionar Environment
```javascript
// Util para ajustar direcao da luz no HDR
scene.environmentRotation = new THREE.Euler(0, Math.PI / 4, 0);
// Ou animar rotacao lentamente
function animate(elapsed) {
  scene.environmentRotation.y = elapsed * 0.05;
}
```

### 6. CubeTexture (6 faces)
```javascript
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  'px.jpg', 'nx.jpg', // positive-x, negative-x
  'py.jpg', 'ny.jpg', // positive-y, negative-y
  'pz.jpg', 'nz.jpg', // positive-z, negative-z
]);
scene.environment = envMap;
```

### 7. Procedural Environment (Gradient Sky)
```javascript
const canvas = document.createElement('canvas');
canvas.width = 2; canvas.height = 256;
const ctx = canvas.getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 256);
gradient.addColorStop(0, '#001133');
gradient.addColorStop(0.5, '#003366');
gradient.addColorStop(1, '#006699');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 2, 256);
const texture = new THREE.CanvasTexture(canvas);
texture.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
```

### 8. Otimizar Resolucao
- HDR file: 2K (2048x1024) sufficient para maioria dos casos
- 1K para mobile / performance-critical
- 4K apenas para backgrounds visiveis de alta qualidade

### 9. Pre-load antes da cena
```javascript
async function preloadEnvironment(url) {
  return new Promise((resolve) => {
    new RGBELoader().load(url, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      texture.dispose();
      resolve(envMap);
    });
  });
}
```

### 10. Cleanup
```javascript
function disposeEnvironment() {
  if (scene.environment) scene.environment.dispose();
  if (scene.background?.isTexture) scene.background.dispose();
  pmremGenerator.dispose();
}
```

## Output
- Environment map carregado e aplicado
- IBL ativo para materiais PBR
- Background configurado (envMap, blur ou cor solida)
- Intensidade e rotacao ajustados
- Cleanup/dispose function
- Loading progress integration

## Quality Criteria
- [ ] PMREMGenerator usado (nao raw HDR)
- [ ] Texture original disposed apos PMREM
- [ ] Reflexoes visiveis em materiais metalicos
- [ ] Background blur se envMap visivel mas nao desejado nitido
- [ ] Resolucao HDR adequada (2K default)
- [ ] Intensidade balanceada com iluminacao direta
- [ ] Dispose limpa envMap e PMREM
- [ ] Loading nao bloqueia render da cena
