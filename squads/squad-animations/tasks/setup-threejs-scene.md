---
task: setup-threejs-scene
responsavel: "@threejs-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_brief
    tipo: document
    origem: "animations-orqx"
    obrigatorio: true

Saida:
  - campo: scene_setup
    tipo: code
    destino: "proxima fase do pipeline"

Checklist:
  - "[ ] Criar Scene com background correto"
  - "[ ] Configurar renderer (antialias, pixelRatio, toneMapping)"
  - "[ ] Setup resize handler responsivo"
  - "[ ] Implementar animation loop otimizado"
  - "[ ] Configurar clock para delta time"
---

# Task: Setup Three.js Scene

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Configurar cena Three.js completa — renderer otimizado, scene, animation loop, resize handler e clock. Esta e a fundacao de qualquer projeto 3D na squad.

## Pre-Conditions
- Animation brief com tipo de cena (realista, estilizado, performance)
- Container DOM element definido
- Target devices conhecidos (desktop, mobile, ambos)
- Framework context (vanilla, React/R3F, Vue)

## Renderer Config por Tipo
- **Realista:** ACESFilmicToneMapping, outputColorSpace=SRGBColorSpace
- **Estilizado:** NoToneMapping, cores flat
- **Performance:** powerPreference high-performance, antialias por device

## Passos

### 1. Criar Renderer
```javascript
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: window.devicePixelRatio <= 1, // Desabilitar em retina
  alpha: true, // Para background transparente
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

### 2. Configurar Tone Mapping e Color Space
```javascript
// Realista
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

### 3. Criar Scene e Background
```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
// Ou transparente: nao definir background (alpha: true no renderer)
```

### 4. Implementar Animation Loop
```javascript
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  // Update animations with delta
  renderer.render(scene, camera);
}
animate();
```

### 5. Setup Resize Handler
```javascript
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onResize);
```

### 6. Configurar Canvas Responsivo
```css
#canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: -1; /* Background */
}
```

### 7. Implementar Cleanup/Dispose
```javascript
function dispose() {
  window.removeEventListener('resize', onResize);
  renderer.dispose();
  scene.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}
```

### 8. Detectar WebGL Support
```javascript
if (!THREE.WEBGL.isWebGLAvailable()) {
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('fallback').style.display = 'block';
}
```

### 9. Debug Helpers (Dev Mode)
```javascript
if (process.env.NODE_ENV === 'development') {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);
}
```

### 10. Stats Monitor (Dev)
```javascript
import Stats from 'three/addons/libs/stats.module';
const stats = new Stats();
document.body.appendChild(stats.dom);
// In animate(): stats.update();
```

## Output
- Renderer configurado com tone mapping e color space
- Scene com background correto
- Animation loop com clock e delta time
- Resize handler responsivo
- Cleanup/dispose function
- WebGL fallback
- Dev helpers (axes, grid, stats)

## Quality Criteria
- [ ] Pixel ratio capped em 2 (performance)
- [ ] Antialias condicional por device
- [ ] Resize handler atualiza camera e renderer
- [ ] Animation loop usa delta time (frame-independent)
- [ ] Dispose function limpa todos recursos
- [ ] WebGL availability check com fallback
- [ ] Canvas responsivo (100vw x 100vh)
- [ ] 60fps idle (cena vazia)
