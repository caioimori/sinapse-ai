---
task: optimize-threejs-scene
responsavel: "@animation-performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scene_code
    tipo: code
    origem: "threejs-architect"
    obrigatorio: true

Saida:
  - campo: optimized_scene
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Mergear geometrias estaticas (BufferGeometryUtils.mergeGeometries)"
  - "[ ] Implementar instancing para objetos repetidos"
  - "[ ] Configurar frustum culling"
  - "[ ] Otimizar shadow maps"
  - "[ ] Reduzir draw calls"
  - "[ ] Implementar LOD"
  - "[ ] Comprimir texturas (basis, ktx2)"
  - "[ ] Otimizar render loop (conditional rendering)"
---

# Task: Optimize Three.js Scene

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** HIGH
