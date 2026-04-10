---
template: shader-template
squad: squad-animations
description: "Template de codigo para shaders GLSL customizados"
used_by:
  - create-custom-shader
  - build-noise-based-effect
  - create-distortion-effect
---

# Shader Template

## Vertex Shader
```glsl
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;

  vec3 pos = position;

  // Vertex displacement aqui
  // pos.z += sin(pos.x * 2.0 + uTime) * 0.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

## Fragment Shader
```glsl
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec2 uv = vUv;

  // Efeito aqui
  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;
}
```

## Three.js Integration
```javascript
import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(width, height) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uTexture: { value: texture },
  },
  // transparent: true,
  // side: THREE.DoubleSide,
});

// No animation loop:
material.uniforms.uTime.value = elapsed;
```

## Noise Functions (incluir conforme necessario)
```glsl
// Simplex 2D — use para maioria dos casos
// Simplex 3D — use para variacao temporal
// Worley — use para padroes celulares
// FBM — use para complexidade organica
```

## Regras de Performance
- Evitar branches (if/else) — usar step(), smoothstep(), mix()
- Pre-computar constantes fora do loop
- Minimizar texture lookups
- Usar mediump onde possivel
- Testar em GPU integrada
