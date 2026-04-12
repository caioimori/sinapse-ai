---
task: define-grid-system
responsavel: "@brand-system-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: define-grid-system

## Metadata
- **Agent:** brand-system-architect (Grid)
- **Squad:** squad-brand
- **Trigger:** `*define-grid`
- **Inputs:** Visual guidelines, breakpoints, spacing base
- **Outputs:** Grid system spec completo

## Description
Define grid system completo com colunas, gutters, margins e breakpoints.

## Steps
1. Definir colunas: 12-col padrao (divisivel por 2, 3, 4, 6)
2. Definir gutter (gap): 16px mobile, 24px desktop
3. Definir margin lateral: 16px (mobile), 24px (tablet), 40px (desktop), 80px (wide)
4. Definir breakpoints: mobile 375px, tablet 768px, desktop 1024px, wide 1440px, ultra 1920px
5. Definir container max-width: 100% (mobile), 720px (tablet), 960px (desktop), 1200px (wide), 1400px (ultra)
6. Definir sub-grids para cards: 1-col (mobile), 2-col (tablet), 3-col (desktop), 4-col (wide)
7. Documentar com exemplos visuais (ASCII grid)
8. Gerar CSS classes (.container, .row, .col-{n})

## Validation Criteria
- 12-col consistente em todos os breakpoints
- Container max-width definido por breakpoint
- Sub-grids para layouts comuns
- CSS implementavel

## Output Format
Grid spec + CSS classes + exemplos visuais por breakpoint.
