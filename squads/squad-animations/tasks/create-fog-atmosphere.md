---
task: create-fog-atmosphere
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_setup
    tipo: code
    origem: "setup-threejs-scene"
    obrigatorio: true
  - campo: atmosphere_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: atmosphere
    tipo: code
    destino: "shader-artist"

Checklist:
  - "[ ] Selecionar tipo (Fog linear, FogExp2)"
  - "[ ] Configurar cor e density por mood"
  - "[ ] Implementar volumetric fog se necessario (shader)"
  - "[ ] Testar com depth of field"
---

# Task: Create Fog and Atmosphere

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Criar efeitos atmosfericos na cena Three.js — fog linear, exponential fog, volumetric fog shader, haze e depth-based color shift. Atmosfera adiciona profundidade e mood a cenas 3D.

## Pre-Conditions
- Scene setup com background color definido
- Mood desejado (mistico, clean, cyberpunk)
- Far plane da camera definido (fog deve respeitar)
- Decisao: fog builtin vs volumetric shader

## Passos

### 1. Selecionar Tipo de Fog
| Tipo | Comportamento | Melhor Para |
|------|--------------|-------------|
| Fog (linear) | Gradual, near-to-far | Cenas com distancia conhecida |
| FogExp2 | Exponencial, mais natural | Outdoor, floresta, mist |
| Volumetric (shader) | Raios de luz, density variavel | Cinematico, god rays |
| Color fog (custom) | Shift de cor com distancia | Estilizado, gradient |

### 2. Implementar Fog Linear
```javascript
scene.fog = new THREE.Fog(
  '#000000',  // Color (match background)
  5,          // Near (onde comeca)
  20          // Far (onde e totalmente opaco)
);
scene.background = new THREE.Color('#000000'); // DEVE ser igual
```

### 3. Implementar FogExp2
```javascript
scene.fog = new THREE.FogExp2(
  '#112233',  // Color
  0.05        // Density (0.01 = sutil, 0.1 = denso)
);
scene.background = new THREE.Color('#112233');
```

### 4. Animar Fog
```javascript
function animate(elapsed) {
  // Pulsar densidade
  scene.fog.density = 0.05 + Math.sin(elapsed * 0.3) * 0.02;
  // Shift de cor
  const hue = (elapsed * 0.01) % 1;
  scene.fog.color.setHSL(hue, 0.3, 0.1);
  scene.background.copy(scene.fog.color);
}
```

### 5. Fog por Mood
| Mood | Type | Color | Density/Near-Far |
|------|------|-------|-----------------|
| Mistico | FogExp2 | #1a0a2e | 0.04 |
| Clean/Minimal | Fog | #ffffff | near:8, far:25 |
| Cyberpunk | FogExp2 | #0a0020 | 0.06 |
| Floresta | FogExp2 | #1a3a1a | 0.03 |
| Underwater | FogExp2 | #003355 | 0.08 |

### 6. Volumetric Fog (Shader)
```glsl
// Fragment shader para volumetric light rays
uniform vec3 uLightPosition;
uniform float uDensity;

float volumetricFog(vec3 ro, vec3 rd, float maxDist) {
  float fog = 0.0;
  float stepSize = maxDist / 32.0;
  for (float t = 0.0; t < maxDist; t += stepSize) {
    vec3 p = ro + rd * t;
    float lightDist = length(p - uLightPosition);
    fog += exp(-lightDist * uDensity) * stepSize;
  }
  return fog;
}
```

### 7. Fog com Custom Materials
```javascript
// MeshBasicMaterial NAO respeita fog por default
const material = new THREE.MeshBasicMaterial({
  color: '#ff0000',
  fog: true, // Habilitar fog neste material
});
// ShaderMaterial: precisa implementar fog manualmente
```

### 8. Layered Atmosphere
```javascript
// Combinar fog com particulas para atmosfera rica
// Fog: background haze
scene.fog = new THREE.FogExp2('#111111', 0.03);
// Particulas: floating dust/mist (via generative-particle-engineer)
```

### 9. Fog e Transparency
- Fog interage com objetos transparentes de forma diferente
- `material.transparent = true` + fog pode causar artifacts
- Considerar order de renderizacao (depthWrite, renderOrder)

### 10. Performance
- Fog builtin (Fog/FogExp2): custo zero (GPU calcula automaticamente)
- Volumetric fog: custoso (ray marching no fragment shader)
- Volumetric: reduzir samples em mobile (16 vs 32)

## Output
- Fog configurado (tipo, cor, density)
- Fog animado se solicitado
- Volumetric fog shader se necessario
- Background color sincronizado com fog
- Notas de interacao com transparencia
- Performance considerations

## Quality Criteria
- [ ] Fog color IGUAL ao background color
- [ ] Density adequada ao mood (nao excessiva)
- [ ] Objetos distantes desaparecem naturalmente
- [ ] Near plane do fog nao corta objetos proximos
- [ ] Fog animado suave (sem popping)
- [ ] Materiais custom respeitam fog (fog: true)
- [ ] Volumetric fog 30fps minimo
- [ ] Transparencia nao causa artifacts com fog
