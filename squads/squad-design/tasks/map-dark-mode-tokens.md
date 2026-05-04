---
task: map-dark-mode-tokens
responsavel: "@dx-design-system-architect"
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

# Task: Map Dark Mode Tokens

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Mapear todos os semantic tokens para dark mode — criar o set completo de overrides que transforma a UI de light para dark mantendo contraste, legibilidade e coerencia.

## Entrada
- Semantic tokens light mode (L2)
- Dark mode design decisions (de Canvas)
- WCAG 2.2 contrast requirements
- Brand color adaptations

## Passos

### 1. Principios de Dark Mode Mapping
| Principio | Regra |
|-----------|-------|
| Background | Nunca #000 puro, usar neutral-950 |
| Text | Nunca #FFF puro, usar neutral-50 |
| Elevation | Inverter: shadows → lighter surfaces |
| Saturation | Reduzir 10-15% para cores vibrantes |
| Brand colors | Shift para lighter variant (500→400) |
| Borders | Lighter para visibilidade |

### 2. Color Mapping Table
| Semantic Token | Light Value | Dark Value | Notes |
|---------------|------------|-----------|-------|
| bg.default | white | neutral-950 | |
| bg.subtle | neutral-50 | neutral-900 | |
| bg.muted | neutral-100 | neutral-800 | |
| bg.emphasis | neutral-900 | neutral-100 | Inverted |
| fg.default | neutral-900 | neutral-50 | |
| fg.muted | neutral-600 | neutral-400 | |
| fg.subtle | neutral-400 | neutral-500 | |
| border.default | neutral-200 | neutral-800 | |
| border.emphasis | neutral-400 | neutral-600 | |
| action.primary | blue-500 | blue-400 | Lighter for dark bg |
| action.primary.hover | blue-600 | blue-300 | |
| feedback.success | green-600 | green-400 | |
| feedback.error | red-600 | red-400 | |
| feedback.warning | amber-600 | amber-400 | |
| surface.raised | white + shadow | neutral-900 no shadow | |
| surface.overlay | white + shadow | neutral-800 no shadow | |

### 3. Gerar Dark Token File
```json
{
  "$metadata": {
    "theme": "dark"
  },
  "color": {
    "background": {
      "default": { "$value": "{color.neutral.950}" },
      "subtle": { "$value": "{color.neutral.900}" },
      "muted": { "$value": "{color.neutral.800}" },
      "emphasis": { "$value": "{color.neutral.100}" }
    },
    "foreground": {
      "default": { "$value": "{color.neutral.50}" },
      "muted": { "$value": "{color.neutral.400}" },
      "subtle": { "$value": "{color.neutral.500}" }
    }
  }
}
```

### 4. Verificar Contraste
Para cada combinacao fg/bg no dark mode:
| Combinacao | Min Ratio | Actual | Pass? |
|-----------|-----------|--------|-------|
| fg.default / bg.default | 4.5:1 | | |
| fg.muted / bg.default | 4.5:1 | | |
| fg.subtle / bg.default | 3:1 (UI) | | |
| action.primary / bg.default | 3:1 (UI) | | |
| focus ring / bg.default | 3:1 | | |

### 5. Shadow → Surface Mapping
| Light | Dark Equivalent |
|-------|----------------|
| shadow-sm | surface: neutral-900 |
| shadow-md | surface: neutral-850 |
| shadow-lg | surface: neutral-800 |
| shadow-xl | surface: neutral-750 |

### 6. Special Cases
- Code blocks: Dark-on-dark (separate syntax theme)
- Images: Apply subtle brightness reduction (brightness(0.9))
- Data viz: Ensure distinct colors in both modes
- Focus rings: High contrast in both modes

## Saida
- Dark mode semantic token file (W3C DTCG)
- Contrast verification matrix
- Shadow-to-surface mapping
- Special case documentation
- Handoff para Canvas (verification) e Scaffold (implementation)

## Validacao
- [ ] TODOS os semantic tokens tem dark override
- [ ] Contraste WCAG 2.2 AA em todas as combinacoes
- [ ] Background nunca e #000 puro
- [ ] Cores desaturadas para dark mode
- [ ] Elevation invertida corretamente
- [ ] Focus indicators visiveis em dark mode
