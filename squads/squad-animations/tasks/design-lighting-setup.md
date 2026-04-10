---
task: design-lighting-setup
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_setup
    tipo: code
    origem: "setup-threejs-scene"
    obrigatorio: true
  - campo: mood
    tipo: string
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: lighting_setup
    tipo: code
    destino: "create-material-system"

Checklist:
  - "[ ] Selecionar schema de iluminacao por mood"
  - "[ ] Configurar key, fill, rim lights"
  - "[ ] Ajustar intensidades e cores"
  - "[ ] Configurar sombras (type, mapSize, bias)"
  - "[ ] Testar com materiais finais"
---

# Task: Design Lighting Setup

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Projetar iluminacao da cena 3D — key light, fill, rim, ambient e special lights. Iluminacao define o mood visual e e tao importante quanto geometria e materiais.

## Pre-Conditions
- Scene setup funcional
- Mood desejado definido no brief
- Materiais planejados (PBR, toon, flat)
- Shadow requirements (sim/nao, qualidade)

## Lighting por Mood
- **Dramatico:** Key forte lateral, fill fraco, rim intenso
- **Suave/Premium:** Ambient alto, directional suave, sem sombras duras
- **Neon/Cyberpunk:** PointLights coloridos, sem ambient, bloom forte
- **Natural:** DirectionalLight como sol, hemisphere fill

## Passos

### 1. Configurar Three-Point Lighting
```javascript
// Key light — luz principal
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);

// Fill light — suaviza sombras
const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
fillLight.position.set(-5, 3, -5);

// Rim/back light — separa objeto do background
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(0, 5, -5);

scene.add(keyLight, fillLight, rimLight);
```

### 2. Adicionar Ambient Light
```javascript
// Hemisphere: cor do ceu + cor do chao
const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.5);
scene.add(hemiLight);
// Ou ambient flat:
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
```

### 3. Configurar Point Lights (Accent)
```javascript
const accent = new THREE.PointLight(0xff6600, 2, 10);
accent.position.set(2, 1, 0);
scene.add(accent);
// Decay: 2 (fisicamente correto)
accent.decay = 2;
```

### 4. Configurar Spot Lights
```javascript
const spot = new THREE.SpotLight(0xffffff, 2, 15, Math.PI / 6, 0.5, 2);
spot.position.set(0, 8, 0);
spot.target.position.set(0, 0, 0);
scene.add(spot);
scene.add(spot.target);
```

### 5. Setup Sombras
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 20;
keyLight.shadow.camera.left = -5;
keyLight.shadow.camera.right = 5;
keyLight.shadow.bias = -0.001;
```

### 6. Intensidades por Mood
| Mood | Key | Fill | Rim | Ambient |
|------|-----|------|-----|---------|
| Dramatico | 2.0 | 0.2 | 1.0 | 0.1 |
| Premium/Suave | 1.0 | 0.6 | 0.5 | 0.5 |
| Neon | 0 | 0 | 0 | 0 |
| Natural | 1.5 | 0.3 | 0.3 | 0.4 |

### 7. Animar Luzes
```javascript
function animate(elapsed) {
  // Subtle light movement
  keyLight.position.x = Math.sin(elapsed * 0.2) * 5;
  // Color temperature shift
  accent.color.setHSL(0.05 + Math.sin(elapsed * 0.1) * 0.02, 1, 0.5);
}
```

### 8. Light Helpers (Dev)
```javascript
if (DEV) {
  scene.add(new THREE.DirectionalLightHelper(keyLight, 1));
  scene.add(new THREE.PointLightHelper(accent, 0.5));
  scene.add(new THREE.CameraHelper(keyLight.shadow.camera));
}
```

### 9. Otimizar Performance
| Otimizacao | Impacto |
|-----------|---------|
| Menos shadow-casting lights | Alto |
| Shadow map 1024 em mobile | Alto |
| Desabilitar shadows em mobile | Alto |
| Bake lighting em textures | Maximo |

### 10. Testar com Materiais
- Verificar que PBR materials refletem corretamente
- Ajustar tone mapping exposure se necessario
- Testar com materiais claros E escuros
- Verificar que cores das luzes nao distorcem materiais

## Output
- Setup de iluminacao completo (key, fill, rim, ambient)
- Configuracao de sombras
- Intensidades e cores documentadas
- Animacao de luzes se solicitada
- Dev helpers para ajuste
- Notas de performance

## Quality Criteria
- [ ] Mood visual alcancado (conforme brief)
- [ ] Sombras suaves sem acne ou peter-panning
- [ ] Shadow camera frustum ajustado (sem clipping)
- [ ] Performance: max 2 shadow-casting lights
- [ ] Intensidades balanceadas (sem overexposure)
- [ ] Hemisphere ou ambient para fill global
- [ ] Light helpers removidos em production
- [ ] Testado com materiais finais
