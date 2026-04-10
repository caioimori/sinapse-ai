---
task: refine-animation-specification
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: feedback
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: current_brief
    tipo: document
    origem: "build-animation-brief"
    obrigatorio: true

Saida:
  - campo: refined_brief
    tipo: document
    destino: "animations-orqx"

Checklist:
  - "[ ] Analisar feedback do usuario"
  - "[ ] Ajustar parametros conforme pedido"
  - "[ ] Regenerar brief refinado"
---

# Task: Refine Animation Specification

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** STANDARD

## Refinamentos Comuns
- "mais rapido" → reduzir duration 30-50%
- "mais sutil" → reduzir scale range, increase duration
- "mais bounce" → trocar easing para elastic/back
- "mais dramatico" → increase scale, add delay antes
