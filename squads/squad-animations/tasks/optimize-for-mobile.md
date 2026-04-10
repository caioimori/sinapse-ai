---
task: optimize-for-mobile
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
  - campo: mobile_optimized
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Detectar device tier (GPU, cores, memory)"
  - "[ ] Reduzir particulas/complexidade em mobile"
  - "[ ] Limitar pixel ratio a 2"
  - "[ ] Desabilitar post-processing pesado"
  - "[ ] Simplificar shaders"
  - "[ ] Testar em throttled CPU/GPU"
  - "[ ] Implementar fallback para low-end"
---

# Task: Optimize for Mobile

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** HIGH
