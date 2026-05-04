---
task: validate-animation-feasibility
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_brief
    tipo: document
    origem: "build-animation-brief"
    obrigatorio: true

Saida:
  - campo: feasibility_report
    tipo: document
    destino: "animations-orqx"

Checklist:
  - "[ ] Verificar suporte de browser"
  - "[ ] Avaliar impacto de performance"
  - "[ ] Checar compatibilidade mobile"
  - "[ ] Validar requisitos de acessibilidade"
  - "[ ] Identificar riscos tecnicos"
---

# Task: Validate Animation Feasibility

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** STANDARD

## Checklist de Viabilidade
- Browser: WebGL support? WebGPU needed? CSS features?
- Performance: Quantas particulas? Draw calls estimados?
- Mobile: GPU tier minimo? Fallback necessario?
- Assets: Modelos 3D? Texturas? Fontes?
