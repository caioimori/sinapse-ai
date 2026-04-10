---
task: build-shadow-system
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: lighting_setup
    tipo: code
    origem: "design-lighting-setup"
    obrigatorio: true

Saida:
  - campo: shadow_system
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Configurar shadow map type (PCFSoft, VSM)"
  - "[ ] Ajustar shadow camera frustum"
  - "[ ] Definir shadow map resolution"
  - "[ ] Configurar shadow bias para evitar acne"
  - "[ ] Implementar contact shadows se necessario"
---

# Task: Build Shadow System

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Configurar sistema de sombras Three.js — shadow maps, bias, camera frustum e contact shadows. Sombras adicionam grounding e profundidade mas sao o maior custo de performance em cenas 3D web.

## Pre-Conditions
- Lighting setup funcional
- Tipo de sombra desejado (hard, soft, contact)
- Performance budget (shadows custam caro)
- Objetos que devem cast/receive shadows identificados

## Passos

### 1. Habilitar Shadows no Renderer
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Opcoes: BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
```

### 2. Selecionar Shadow Map Type
| Type | Qualidade | Performance | Nota |
|------|----------|-------------|------|
| BasicShadowMap | Baixa (pixelada) | Rapido | Dev only |
| PCFShadowMap | Media | Medio | Acceptable |
| PCFSoftShadowMap | Alta (soft edges) | Medio-Alto | Recomendado |
| VSMShadowMap | Alta (very soft) | Alto | Bleed artifacts |

### 3. Configurar Shadow na Light
```javascript
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.castShadow = true;
light.shadow.mapSize.set(2048, 2048); // Resolution
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 20;
light.shadow.camera.left = -5;
light.shadow.camera.right = 5;
light.shadow.camera.top = 5;
light.shadow.camera.bottom = -5;
```

### 4. Ajustar Shadow Bias
```javascript
// Shadow acne: aumentar bias (positivo)
// Peter panning: diminuir bias
light.shadow.bias = -0.001;
light.shadow.normalBias = 0.02;
// Regra: comecar com -0.001 e ajustar visualmente
```

### 5. Marcar Objetos para Shadows
```javascript
scene.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
// Desabilitar em objetos que nao precisam (performance)
background.castShadow = false;
smallDetail.castShadow = false;
```

### 6. Implementar Contact Shadows
```javascript
// Plane com blur que recebe sombra suave de contato
import { ContactShadows } from '@react-three/drei'; // R3F
// Ou custom: render cena de cima em render target, blur, projetar
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.4,
  })
);
```

### 7. Shadow Map Resolution por Device
| Device | Resolution | Nota |
|--------|-----------|------|
| Desktop high-end | 2048x2048 | Melhor qualidade |
| Desktop mid | 1024x1024 | Bom tradeoff |
| Mobile | 512x512 | Performance |
| Mobile low-end | Desabilitar | Sem shadows |

### 8. Ajustar Shadow Camera Frustum
```javascript
// Frustum deve ser o menor possivel que engloba a cena
// Maior frustum = menos resolucao por pixel
if (DEV) {
  const helper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(helper);
}
```

### 9. Otimizar Performance
- Apenas 1-2 lights com castShadow = true
- Objetos pequenos: castShadow = false
- Shadow map resolution: menor possivel com qualidade aceitavel
- Cascaded shadow maps para cenas grandes (CSM)

### 10. Animated Shadows
- Shadows seguem objetos automaticamente
- Se light se move, shadow camera frustum deve cobrir nova area
- Atualizar `light.shadow.camera.updateProjectionMatrix()` se mudar frustum

## Output
- Shadow system configurado (type, resolution, bias)
- Objetos marcados para cast/receive
- Shadow camera frustum otimizado
- Contact shadows se solicitado
- Device-specific resolution settings
- Dev helpers para debug

## Quality Criteria
- [ ] Sem shadow acne (bias correto)
- [ ] Sem peter panning (bias nao excessivo)
- [ ] Sombras suaves (PCFSoft ou VSM)
- [ ] Frustum ajustado (sem desperdicio de resolucao)
- [ ] Max 2 shadow-casting lights
- [ ] Resolution adequada por device
- [ ] Ground plane recebe shadows
- [ ] Performance: shadows nao causam drop abaixo de 30fps
