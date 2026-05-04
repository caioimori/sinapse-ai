---
checklist: performance-audit-checklist
squad: squad-animations
description: "Checklist tecnico para auditoria de performance de animacoes"
used_by:
  - audit-animation-performance
  - optimize-threejs-scene
  - optimize-for-mobile
---

# Performance Audit Checklist

## 1. CSS Animations
- [ ] Apenas transform e opacity animados (compositor thread)
- [ ] will-change aplicado seletivamente (nao em tudo)
- [ ] Nenhum width/height/top/left animado
- [ ] contain: layout style onde possivel
- [ ] @keyframes sem propriedades de layout

## 2. JavaScript Animations
- [ ] requestAnimationFrame usado (nao setTimeout/setInterval)
- [ ] Delta time implementado para frame-independence
- [ ] GSAP timelines com cleanup (kill/revert)
- [ ] Event listeners com removeEventListener no cleanup
- [ ] Intersection Observer para trigger (nao scroll listener)

## 3. Three.js Specific
- [ ] Renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
- [ ] Geometrias estaticas merged
- [ ] InstancedMesh para objetos repetidos
- [ ] Frustum culling ativo
- [ ] Dispose() em geometrias e materiais nao usados
- [ ] Texturas comprimidas (KTX2/Basis)
- [ ] Shadow map resolution proporcional

## 4. Shaders
- [ ] Sem branches dinamicos no fragment shader
- [ ] step/smoothstep ao inves de if/else
- [ ] Constantes pre-computadas
- [ ] Precision adequada (mediump onde possivel)
- [ ] Uniforms atualizados apenas quando mudam

## 5. Particles
- [ ] Quantidade adequada ao device tier
- [ ] Object pooling implementado
- [ ] GPGPU para > 100K particulas
- [ ] BufferAttribute.needsUpdate seletivo
- [ ] Spatial partitioning para interacao

## 6. Scroll Animations
- [ ] ScrollTrigger.refresh() no resize
- [ ] Nenhuma animacao fora do viewport
- [ ] Batch reads/writes no DOM
- [ ] Passive event listeners
- [ ] Debounce em handlers pesados

## 7. Loading
- [ ] Assets preloaded ou lazy loaded
- [ ] Loading state visivel ao usuario
- [ ] Texturas em resolucao adequada (nao 4K desnecessario)
- [ ] Modelos 3D com Draco compression
- [ ] Code splitting para animacoes pesadas

## 8. Mobile
- [ ] Device tier detection implementado
- [ ] Pixel ratio limitado a 2
- [ ] Post-processing reduzido/removido
- [ ] Particle count reduzido
- [ ] Touch events otimizados (passive: true)

## Metricas Target
| Metrica | Desktop | Mobile |
|---------|---------|--------|
| FPS | 60 constante | 30 min, 60 target |
| First Animation | < 1s | < 2s |
| Memory Growth | 0 apos init | 0 apos init |
| Draw Calls | < 100 | < 50 |
| Triangles | < 1M | < 200K |
