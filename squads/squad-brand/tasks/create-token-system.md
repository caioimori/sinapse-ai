---
task: create-token-system
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

# Task: create-token-system

## Metadata
- **Agent:** brand-system-architect (Grid)
- **Squad:** squad-brand
- **Trigger:** `*create-token-system`
- **Inputs:** Paleta de cores, tipografia, spacing base de Iris
- **Outputs:** Token system 3 niveis (primitive, semantic, component)

## Description
Cria sistema de design tokens em 3 niveis — a unica fonte de verdade para implementacao.

## Steps
1. **Nivel 1 — Primitive Tokens** (raw values):
   - Colors: todos os hex da paleta (primary-50 a primary-900, secondary, accent, neutrals, semantics)
   - Typography: font families, sizes em px, weights, line-heights
   - Spacing: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
   - Border: radius (none, sm, md, lg, xl, full), widths (1, 2, 4)
   - Shadows: sm, md, lg, xl (valores de box-shadow)
   - Breakpoints: 375, 768, 1024, 1440, 1920
2. **Nivel 2 — Semantic Tokens** (usage-based):
   - Surface: surface-primary (bg), surface-secondary (cards), surface-tertiary (elevated)
   - Text: text-primary, text-secondary, text-muted, text-inverse
   - Border: border-default, border-strong, border-focus
   - Interactive: interactive-primary, interactive-hover, interactive-active, interactive-disabled
   - Status: success, warning, error, info (each with bg, text, border variants)
3. **Nivel 3 — Component Tokens** (component-specific):
   - button-bg, button-text, button-border, button-hover-bg
   - card-bg, card-border, card-shadow
   - input-bg, input-border, input-focus, input-error
   - nav-bg, nav-text, nav-active
4. Naming convention: `--{level}-{category}-{variant}` (ex: `--color-primary-500`, `--surface-primary`, `--button-bg`)
5. Exportar em 4 formatos:
   - CSS Custom Properties (`:root { --var: value }`)
   - JSON (flat e nested)
   - Tailwind config (`extend: { colors: {...} }`)
   - SCSS variables e maps

## Validation Criteria
- 3 niveis claramente separados
- Zero hardcoded values em semantic e component (todos referenciam primitive)
- Naming convention consistente
- 4 formatos de export gerados
- Cobre todos os valores usados no design system

## Output Format
Token files em CSS + JSON + Tailwind + SCSS + documentacao de naming convention.
