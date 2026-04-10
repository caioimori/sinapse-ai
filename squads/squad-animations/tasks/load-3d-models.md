---
task: load-3d-models
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: model_specs
    tipo: array
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: loaded_models
    tipo: code
    destino: "create-material-system"

Checklist:
  - "[ ] Selecionar loader correto (GLTFLoader, FBXLoader, OBJLoader)"
  - "[ ] Implementar loading manager com progress"
  - "[ ] Aplicar DRACOLoader para compressao"
  - "[ ] Normalizar escala e posicao"
  - "[ ] Extrair animations do modelo se existirem"
---

# Task: Load 3D Models

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Carregar modelos 3D em Three.js — GLTF/GLB (preferido), FBX, OBJ. Incluir progress loading, Draco compression, normalizacao de escala e extracao de animations embedded.

## Pre-Conditions
- Arquivos de modelo disponiveis (GLTF/GLB preferido)
- Formatos conhecidos e loaders necessarios identificados
- Texturas associadas acessiveis
- Budget de tamanho definido (GLTF comprimido < 5MB ideal)

## Passos

### 1. Selecionar Loader por Formato
| Formato | Loader | Quando Usar |
|---------|--------|-------------|
| GLTF/GLB | GLTFLoader | Default — melhor formato web |
| FBX | FBXLoader | Legacy assets, Mixamo |
| OBJ + MTL | OBJLoader + MTLLoader | Assets antigos |
| DRACO | GLTFLoader + DRACOLoader | GLTF comprimido |
| KTX2 | KTX2Loader | Texturas comprimidas |

### 2. Configurar DRACO Decoder
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
```

### 3. Implementar Loading Manager
```javascript
const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => {
  const progress = (loaded / total) * 100;
  updateLoadingBar(progress);
};
manager.onLoad = () => { hideLoadingScreen(); };
manager.onError = (url) => { console.error('Failed:', url); };
```

### 4. Carregar Modelo GLTF
```javascript
gltfLoader.load('model.glb', (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
}, onProgress, onError);
```

### 5. Normalizar Escala e Posicao
```javascript
function normalizeModel(model, targetSize = 2) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetSize / maxDim;
  model.scale.setScalar(scale);
  // Center model
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center.multiplyScalar(scale));
}
```

### 6. Extrair Animations
```javascript
let mixer;
gltfLoader.load('animated-model.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  if (gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }
});
// Em animate(): mixer?.update(delta);
```

### 7. Implementar Async Loading
```javascript
async function loadModel(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, resolve, undefined, reject);
  });
}
// Uso: const gltf = await loadModel('model.glb');
```

### 8. Otimizar Modelos
| Tecnica | Reducao | Como |
|---------|---------|------|
| DRACO compression | 80-90% geometry | DRACOLoader |
| KTX2 textures | 75% textures | KTX2Loader + BasisTextureLoader |
| Mesh simplification | Varies | Blender decimate |
| Texture atlas | Reduce draw calls | Merge textures |

### 9. Error Handling e Fallback
```javascript
function loadWithFallback(primaryUrl, fallbackUrl) {
  gltfLoader.load(primaryUrl,
    (gltf) => onSuccess(gltf),
    undefined,
    () => {
      console.warn('Primary failed, trying fallback');
      gltfLoader.load(fallbackUrl, onSuccess);
    }
  );
}
```

### 10. Cleanup ao Remover Modelo
```javascript
function removeModel(model) {
  scene.remove(model);
  model.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      Object.values(child.material).forEach((prop) => {
        if (prop?.isTexture) prop.dispose();
      });
      child.material.dispose();
    }
  });
}
```

## Output
- Modelo carregado e posicionado na cena
- Loading manager com progress callback
- DRACO compression configurado
- Animations extraidas e mixer configurado
- Normalizacao de escala e posicao
- Cleanup/dispose function

## Quality Criteria
- [ ] GLTF/GLB como formato preferido
- [ ] DRACO decoder configurado para compressao
- [ ] Loading progress visivel para usuario
- [ ] Modelo centralizado e escalado corretamente
- [ ] Shadows habilitadas (cast + receive)
- [ ] Animations extraidas e funcionais
- [ ] Error handling com fallback
- [ ] Dispose limpa geometrias, materiais e texturas
