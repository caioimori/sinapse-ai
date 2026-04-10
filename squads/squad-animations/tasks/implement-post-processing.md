---
task: implement-post-processing
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_output
    tipo: code
    origem: "threejs-architect"
    obrigatorio: true
  - campo: post_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: post_pipeline
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Criar EffectComposer"
  - "[ ] Adicionar RenderPass base"
  - "[ ] Configurar passes (Bloom, DOF, SSAO, etc)"
  - "[ ] Ordenar passes corretamente"
  - "[ ] Adicionar GammaCorrectionShader no final"
  - "[ ] Otimizar resolucao dos passes"
---

# Task: Implement Post-Processing

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Implementar pipeline de post-processing para cenas Three.js — bloom, depth of field, SSAO, color grading, film grain e custom passes. Post-processing transforma cena 3D basica em experiencia cinematica.

## Pre-Conditions
- Cena Three.js funcional (threejs-architect)
- Efeitos desejados listados no brief
- Performance budget (cada pass adiciona custo)
- Target look definido (cinematico, stylized, clean)

## Post-Processing Pipeline (ordem recomendada)
1. RenderPass (cena base)
2. SSAOPass (ambient occlusion)
3. UnrealBloomPass (glow)
4. BokehPass (depth of field)
5. FilmPass (grain, scanlines)
6. Custom ShaderPass (color grading)
7. GammaCorrectionShader (final)

## Passos

### 1. Configurar EffectComposer
```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
```

### 2. Adicionar Bloom (Glow)
```javascript
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass';

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.5,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);
```

### 3. Adicionar Depth of Field
```javascript
import { BokehPass } from 'three/addons/postprocessing/BokehPass';

const bokehPass = new BokehPass(scene, camera, {
  focus: 5.0,
  aperture: 0.002,
  maxblur: 0.01,
});
composer.addPass(bokehPass);
```

### 4. Adicionar SSAO
```javascript
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass';

const ssaoPass = new SSAOPass(scene, camera, width, height);
ssaoPass.kernelRadius = 16;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);
```

### 5. Adicionar Film Grain
```javascript
import { FilmPass } from 'three/addons/postprocessing/FilmPass';

const filmPass = new FilmPass(0.2, false); // intensity, grayscale
composer.addPass(filmPass);
```

### 6. Custom Color Grading Pass
```javascript
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';

const colorGradingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uContrast: { value: 1.1 },
    uSaturation: { value: 1.2 },
    uBrightness: { value: 0.0 },
  },
  vertexShader: `/* ... */`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uContrast;
    uniform float uSaturation;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      // Contrast
      color.rgb = (color.rgb - 0.5) * uContrast + 0.5;
      // Saturation
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(vec3(gray), color.rgb, uSaturation);
      gl_FragColor = color;
    }
  `,
};
composer.addPass(new ShaderPass(colorGradingShader));
```

### 7. Gamma Correction Final
```javascript
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader';
composer.addPass(new ShaderPass(GammaCorrectionShader));
```

### 8. Render com Composer
```javascript
function animate() {
  requestAnimationFrame(animate);
  // NAO usar renderer.render() — usar composer
  composer.render();
}
```

### 9. Otimizar Resolucao dos Passes
```javascript
// Bloom em half resolution
bloomPass.resolution.set(width * 0.5, height * 0.5);
// SSAO em half resolution
ssaoPass.width = width * 0.5;
ssaoPass.height = height * 0.5;
```

### 10. Resize Handler
```javascript
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  composer.setSize(width, height);
  // Update individual pass sizes if needed
});
```

## Output
- EffectComposer configurado com passes ordenados
- Bloom, DOF, SSAO conforme brief
- Color grading custom pass
- Gamma correction final
- Resize handler para composer
- Performance-optimized pass resolutions

## Quality Criteria
- [ ] Passes na ordem correta (render first, gamma last)
- [ ] Bloom nao causa overexposure (threshold correto)
- [ ] DOF focus point alinhado com subject
- [ ] 60fps com todos passes ativos em desktop
- [ ] 30fps minimo em mobile (desabilitar passes pesados)
- [ ] Resize handler atualiza composer e passes
- [ ] Gamma correction no final do pipeline
- [ ] Sem banding visivel em gradients
