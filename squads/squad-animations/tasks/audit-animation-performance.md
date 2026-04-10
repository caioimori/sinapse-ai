---
task: audit-animation-performance
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
  - campo: performance_report
    tipo: document
    destino: "animations-orqx"

Checklist:
  - "[ ] Medir FPS em idle e durante animacao"
  - "[ ] Identificar layout thrashing"
  - "[ ] Checar propriedades que causam reflow"
  - "[ ] Verificar memory leaks (listeners, timelines)"
  - "[ ] Testar em low-end device simulado"
  - "[ ] Medir GPU usage"
  - "[ ] Gerar relatorio com issues e prioridades"
---

# Task: Audit Animation Performance

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Targets
- Desktop: 60fps constante
- Mobile: 30fps minimo, 60fps target
- Memory: crescimento zero apos init
- First paint: animacao visivel em menos de 1s
