---
template: threejs-scene-template
squad: squad-animations
description: "Template de codigo para setup de cena Three.js"
used_by:
  - setup-threejs-scene
  - create-3d-environment
---

# Three.js Scene Template

## Boilerplate
```javascript
import * as THREE from 'three';

class Scene {
  constructor(container) {
    this.container = container;
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.clock = new THREE.Clock();

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.addObjects();
    this.setupResize();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x000000);
    // this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45, // FOV — ajustar por tipo
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    // Ajustar por mood — consultar design-lighting-setup
  }

  addObjects() {
    // Adicionar geometrias, modelos, particulas
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Update animations with delta/elapsed

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    // Cleanup: dispose geometries, materials, textures
    // Remove event listeners
    // Remove renderer DOM element
    this.renderer.dispose();
  }
}

export default Scene;
```

## Notas
- Sempre usar delta time para animacoes frame-independent
- Sempre implementar destroy() para cleanup
- Limitar pixelRatio a 2
- Usar powerPreference high-performance
