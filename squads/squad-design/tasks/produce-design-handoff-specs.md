---
task: produce-design-handoff-specs
responsavel: "@dx-ui-designer"
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

# Task: Produce Design Handoff Specs

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Complex

## Objetivo
Produzir especificacoes de design handoff completas — documentar cada detalhe necessario para que Scaffold (frontend) implemente o design com fidelidade pixel-perfect.

## Entrada
- Screen layouts finais
- Component visual states
- Grid system
- Token mappings
- Responsive behavior
- Motion specs (de Kinetic)
- Accessibility specs (de Beacon)

## Passos

### 1. Estruturar Handoff por Pagina
Para cada pagina/template:

```yaml
design_handoff:
  page: ""
  last_updated: ""
  designer: "Canvas"
  status: "[ready/in-progress/needs-review]"

  specs:
    layout:
      grid: ""
      max_width: ""
      padding: ""
      gap: ""

    typography:
      - element: ""
        font: ""
        size: ""
        weight: ""
        line_height: ""
        letter_spacing: ""
        color: ""  # Semantic token name

    colors:
      - usage: ""
        token: ""
        light_value: ""
        dark_value: ""

    spacing:
      - between: "[element A] and [element B]"
        value: ""
        token: ""

    components:
      - name: ""
        variant: ""
        props: {}
        token_overrides: []
```

### 2. Anotar Interacoes
| Elemento | Trigger | Comportamento | Animation |
|----------|---------|--------------|-----------|
| | [click/hover/focus/scroll] | | [duration, easing] |

### 3. Documentar Responsive Behavior
Para cada breakpoint:
| Breakpoint | Mudancas |
|-----------|---------|
| xl → lg | |
| lg → md | |
| md → sm | |
| < sm | |

### 4. Content Specifications
| Slot | Tipo | Min/Max chars | Truncation | Fallback |
|------|------|-------------|-----------|---------|
| | | | | |

### 5. Assets Export
| Asset | Formato | Resolucao | Tamanho Max | Otimizacao |
|-------|---------|-----------|------------|-----------|
| Icons | SVG | Vector | — | SVGO |
| Photos | WebP + AVIF | 1x, 2x | 200KB | Quality 80 |
| Illustrations | SVG | Vector | — | SVGO |
| Logos | SVG | Vector | — | Inline |

### 6. Accessibility Notes
Incluir para cada componente/elemento:
- Semantic HTML element recomendado
- ARIA roles/attributes necessarios
- Keyboard interaction expected
- Screen reader announcement
- Focus management notes

### 7. Quality Criteria
| Aspecto | Criterio |
|---------|----------|
| Design fidelity | >= 95% match |
| Responsive | Funciona em todos os breakpoints |
| States | Todos os estados implementados |
| A11y | Annotations seguidas |
| Performance | Assets otimizados |

## Saida
- Design handoff document completo por pagina
- Annotated mockups
- Asset export package
- Interaction specifications
- Responsive behavior documentation
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Todos os tokens referenciados (nao valores hardcoded)
- [ ] Spacing em multiplos de 8px (ou token)
- [ ] Responsive behavior documentado
- [ ] Interacoes especificadas
- [ ] A11y annotations incluidas
- [ ] Assets exportados e otimizados
