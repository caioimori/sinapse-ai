---
task: setup-performance-monitoring
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
  - campo: monitoring_setup
    tipo: code
    destino: "animations-orqx"

Checklist:
  - "[ ] Integrar stats.js ou custom FPS counter"
  - "[ ] Monitorar draw calls e triangles"
  - "[ ] Monitorar memory usage"
  - "[ ] Monitorar GPU time se disponivel"
  - "[ ] Configurar alertas de performance"
  - "[ ] Setup dev-only dashboard"
---

# Task: Setup Performance Monitoring

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** LOW
