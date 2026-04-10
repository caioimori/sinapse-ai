---
task: review-animation-quality
responsavel: "@animations-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_output
    tipo: code
    origem: "agentes especializados"
    obrigatorio: true
  - campo: animation_brief
    tipo: document
    origem: "animation-interpreter"
    obrigatorio: true

Saida:
  - campo: quality_verdict
    tipo: object
    destino: "animations-orqx para decisao"

Checklist:
  - "[ ] Verificar aderencia ao brief"
  - "[ ] Avaliar qualidade visual do motion"
  - "[ ] Checar performance (FPS, GPU)"
  - "[ ] Validar acessibilidade"
  - "[ ] Testar responsividade"
  - "[ ] Emitir verdict: APPROVED | NEEDS_REVISION | REJECTED"
---

# Task: Review Animation Quality

## Metadata
- **Agent:** animations-orqx (Kinetic)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Criterios de Qualidade
1. **Fidelidade ao brief:** animacao entrega o feeling solicitado?
2. **Fluidez:** 60fps consistente, sem jank?
3. **Timing:** easing e duration corretos?
4. **Responsividade:** funciona em mobile?
5. **Acessibilidade:** prefers-reduced-motion?
