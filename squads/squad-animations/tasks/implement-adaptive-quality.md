---
task: implement-adaptive-quality
responsavel: "@animation-performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_code
    tipo: code
    origem: "qualquer agente"
    obrigatorio: true

Saida:
  - campo: adaptive_system
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Implementar FPS monitor"
  - "[ ] Definir thresholds de degradacao"
  - "[ ] Reduzir qualidade progressivamente (particles, shadows, post-fx)"
  - "[ ] Escalar pixel ratio dinamicamente"
  - "[ ] Restaurar qualidade quando FPS estabiliza"
  - "[ ] Log decisoes de adaptacao"
---

# Task: Implement Adaptive Quality

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Cascade de Degradacao
1. Reduzir post-processing (primeiro bloom, depois DOF)
2. Reduzir shadow quality
3. Reduzir particle count
4. Reduzir pixel ratio
5. Simplificar shaders (fallback)
