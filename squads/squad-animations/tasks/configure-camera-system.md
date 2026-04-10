---
task: configure-camera-system
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
  - campo: camera_system
    tipo: code
    destino: "motion-choreographer"

Checklist:
  - "[ ] Selecionar tipo de camera (Perspective/Orthographic)"
  - "[ ] Configurar FOV, near, far planes"
  - "[ ] Implementar controles se necessario (OrbitControls)"
  - "[ ] Definir posicoes de camera para animacao"
  - "[ ] Setup frustum culling"
---

# Task: Configure Camera System

## Metadata
- **Agent:** threejs-architect (Vertex)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Configurar sistema de camera Three.js — tipo, FOV, posicionamento, controles interativos e camera paths para animacao. Camera define como o usuario ve a cena.

## Pre-Conditions
- Scene setup funcional
- Tipo de experiencia definido (interativa, cinematica, fixa)
- Escala da cena conhecida (para near/far planes)
- Interaction model (orbit, scroll-driven, auto-animate)

## Padroes de Camera
- **Cinematico:** FOV 35-50, dolly + truck moves
- **Produto:** FOV 45, orbit lento, zoom suave
- **Imersivo:** FOV 75+, mouse-driven parallax
- **Isometrico:** OrthographicCamera, angulo fixo

## Passos

### 1. Criar Camera
```javascript
// Perspective (mais comum)
const camera = new THREE.PerspectiveCamera(
  45,                                    // FOV
  window.innerWidth / window.innerHeight, // Aspect
  0.1,                                   // Near
  100                                    // Far
);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);
```

### 2. Selecionar FOV por Uso
| Uso | FOV | Efeito |
|-----|-----|--------|
| Product showcase | 35-45 | Telephoto, minimal distortion |
| Room/environment | 50-65 | Natural perspective |
| Immersive/VR-like | 75-90 | Wide angle, dramatic |
| Cinematic | 35-50 | Film-like framing |

### 3. Configurar OrbitControls
```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2; // Prevent going below ground
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
// Em animate(): controls.update();
```

### 4. Implementar Mouse Parallax (sem OrbitControls)
```javascript
const targetRotation = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  targetRotation.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
  targetRotation.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
});
function animate() {
  camera.position.x += (targetRotation.x - camera.position.x) * 0.05;
  camera.position.y += (-targetRotation.y - camera.position.y + 2) * 0.05;
  camera.lookAt(0, 0, 0);
}
```

### 5. Definir Camera Waypoints para Animacao
```javascript
const waypoints = [
  { position: [0, 2, 5], target: [0, 0, 0], duration: 2000 },
  { position: [3, 1, 3], target: [0, 1, 0], duration: 1500 },
  { position: [-2, 3, 4], target: [0, 0, 0], duration: 2000 },
];
```

### 6. Animar Camera com GSAP
```javascript
function animateToWaypoint(wp) {
  gsap.to(camera.position, {
    x: wp.position[0], y: wp.position[1], z: wp.position[2],
    duration: wp.duration / 1000,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(...wp.target),
  });
}
```

### 7. Configurar Near/Far Planes
| Cena | Near | Far | Nota |
|------|------|-----|------|
| Produto pequeno | 0.1 | 50 | — |
| Ambiente grande | 0.5 | 500 | — |
| Particulas/space | 0.01 | 1000 | Cuidado com z-fighting |

### 8. Implementar Scroll-Driven Camera
```javascript
window.addEventListener('scroll', () => {
  const progress = window.scrollY / maxScroll;
  const index = Math.floor(progress * (waypoints.length - 1));
  const t = (progress * (waypoints.length - 1)) % 1;
  // Interpolate between waypoints
  camera.position.lerpVectors(waypoints[index], waypoints[index + 1], t);
});
```

### 9. Resize Handler para Camera
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
```

### 10. Camera Debug (Dev)
```javascript
if (DEV) {
  const helper = new THREE.CameraHelper(camera);
  scene.add(helper);
  // GUI para ajustar FOV, position em tempo real
}
```

## Output
- Camera configurada (tipo, FOV, near/far)
- Controls interativos (orbit, parallax, scroll)
- Waypoints para animacao cinematica
- Resize handler
- Camera animation integration (GSAP/scroll)
- Dev helpers e debug tools

## Quality Criteria
- [ ] FOV apropriado para o tipo de experiencia
- [ ] Near/far planes otimizados (sem z-fighting)
- [ ] OrbitControls com damping suave
- [ ] Limites de orbit previnem vistas indesejadas
- [ ] Camera animation 60fps (sem jank)
- [ ] Resize handler atualiza aspect ratio
- [ ] Scroll-driven camera suave (lerp)
- [ ] Mobile touch controls funcionais
