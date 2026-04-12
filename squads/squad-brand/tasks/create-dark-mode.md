---
task: create-dark-mode
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

# Task: create-dark-mode

## Metadata
- **Agent:** brand-system-architect (Grid)
- **Squad:** squad-brand
- **Trigger:** `*create-theme --variant dark`
- **Inputs:** Token system (semantic tokens do tema light)
- **Outputs:** Dark mode theme + CSS implementation

## Description
Cria variante dark mode — NAO inversao de cores, mas remapeamento semantico completo.

## Steps
1. Partir dos semantic tokens do tema light (default)
2. Remapear cada token para dark:
   - surface-primary: #ffffff → #121212 (ou dark brand color)
   - surface-secondary: #f5f5f5 → #1e1e1e
   - surface-tertiary: #e8e8e8 → #2a2a2a
   - text-primary: #1a1a1a → #e8e8e8
   - text-secondary: #666 → #aaa
   - text-muted: #999 → #777
   - border-default: #e0e0e0 → #333
3. Manter cores semanticas reconheciveis (success=verde, error=vermelho) mas ajustar luminosidade
4. Validar contrast ratios WCAG AA em TODAS as combinacoes dark
5. Implementar via CSS:
   - `prefers-color-scheme: dark` media query (automatico)
   - `[data-theme="dark"]` attribute (manual toggle)
6. Testar TODOS componentes em dark mode
7. Testar transicao light↔dark (sem flash)

## Validation Criteria
- Remapeamento semantico (NAO inversao mecanica)
- Contrast ratios WCAG AA em dark mode
- Funciona com prefers-color-scheme E toggle manual
- Todos componentes testados em ambos temas
- Transicao suave (sem flash)

## Output Format
Dark mode token map + CSS implementation + comparison screenshots.
