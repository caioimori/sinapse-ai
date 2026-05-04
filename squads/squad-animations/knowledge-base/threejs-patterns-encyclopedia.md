# Three.js Patterns Encyclopedia

> Padroes essenciais para criar cenas 3D de nivel profissional no browser.

---

## Scene Setup Padrao

```javascript
// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Camera
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);

// Scene
const scene = new THREE.Scene();

// Animation loop
renderer.setAnimationLoop((time) => {
  // Update logic
  renderer.render(scene, camera);
});
```

---

## Camera Patterns

| Camera | Quando Usar |
|--------|------------|
| PerspectiveCamera(45) | Geral, realismo |
| PerspectiveCamera(75) | FPS-like, imersivo |
| PerspectiveCamera(20) | Telephoto, compressao de profundidade |
| OrthographicCamera | Isometrico, UI, data viz |
| Camera animated path | Scroll-driven, cinematico |

### Orbit Controls (Interativo)
```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2; // Limitar rotacao vertical
```

### Camera Path (Scroll-driven)
```javascript
const curve = new THREE.CatmullRomCurve3(points);
// No scroll handler:
const t = scrollProgress; // 0 a 1
const pos = curve.getPointAt(t);
const lookAt = curve.getPointAt(Math.min(t + 0.01, 1));
camera.position.copy(pos);
camera.lookAt(lookAt);
```

---

## Lighting Setups

### 3-Point (Studio)
```javascript
const key = new THREE.DirectionalLight(0xffffff, 1.5);
key.position.set(5, 5, 5);
const fill = new THREE.DirectionalLight(0x8888ff, 0.5);
fill.position.set(-5, 3, -5);
const rim = new THREE.DirectionalLight(0xffffff, 0.3);
rim.position.set(0, -3, -5);
```

### HDRI Environment
```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
new RGBELoader().load('studio.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture; // Opcional
});
```

### Emocao por Iluminacao
| Setup | Emocao |
|-------|--------|
| Warm key + cool fill | Acolhedor, natural |
| Cool key + warm rim | Tecnologico, futurista |
| Single dramatic spot | Misterioso, exclusivo |
| Bright ambient + soft shadows | Clean, moderno |
| Dark + neon accent | Cyberpunk, gaming |
| Golden hour HDRI | Premium, luxuoso |

---

## Materials

| Material | Uso | Performance |
|----------|-----|-------------|
| MeshBasicMaterial | Sem luz, flat, debug | Rapido |
| MeshStandardMaterial | PBR padrao | Medio |
| MeshPhysicalMaterial | PBR avancado (clearcoat, transmission) | Pesado |
| MeshToonMaterial | Cartoon, stylized | Leve |
| ShaderMaterial | Custom GLSL | Variavel |
| PointsMaterial | Point clouds, particulas | Leve |

---

## Post-Processing Chain

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(resolution, 0.5, 0.4, 0.85));
// No loop: composer.render() em vez de renderer.render()
```

### Post-Processing Presets
| Efeito | Resultado | Performance |
|--------|-----------|-------------|
| Bloom | Glow em areas claras | Medio |
| SSAO | Sombras de contato | Pesado |
| DOF (Bokeh) | Foco seletivo | Pesado |
| Film Grain | Textura cinematica | Leve |
| Vignette | Escurecimento nas bordas | Leve |
| Chromatic Aberration | Separacao RGB nas bordas | Leve |
| Color Grading (LUT) | Correcao de cor | Leve |

---

## Model Loading

### GLTF/GLB (Formato Preferido)
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load('model.glb', (gltf) => {
  scene.add(gltf.scene);
  // Animacoes
  const mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach(clip => mixer.clipAction(clip).play());
});
```

---

## Raycasting (Interatividade)

```javascript
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// No loop:
raycaster.setFromCamera(pointer, camera);
const intersects = raycaster.intersectObjects(scene.children);
if (intersects.length > 0) {
  // Hover effect
}
```

---

## React Three Fiber (R3F)

```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function Scene() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <Environment preset="studio" />
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls enableDamping />
    </Canvas>
  );
}
```
