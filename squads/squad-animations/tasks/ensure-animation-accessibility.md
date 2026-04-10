---
task: ensure-animation-accessibility
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
  - campo: accessible_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Implementar prefers-reduced-motion media query"
  - "[ ] Definir fallback para reduced motion (opacity only ou static)"
  - "[ ] Verificar WCAG 2.3.3 (animation from interactions)"
  - "[ ] Adicionar pause/play control se animacao > 5s"
  - "[ ] Verificar contraste durante animacao"
  - "[ ] Evitar flash rates > 3/segundo"
  - "[ ] Testar com screen reader"
---

# Task: Ensure Animation Accessibility

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## WCAG Requirements
- 2.3.1 Three Flashes or Below Threshold (Level A)
- 2.3.3 Animation from Interactions (Level AAA)
- prefers-reduced-motion: OBRIGATORIO em toda animacao
