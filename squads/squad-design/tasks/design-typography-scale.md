---
task: design-typography-scale
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

# Task: Design Typography Scale

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Projetar a escala tipografica do design system — definir type scale ratio, sizes, weights e composites que garantem hierarquia e legibilidade.

## Entrada
- Brand typography (fonts selecionadas)
- Visual hierarchy decisions (de Canvas)
- Accessibility requirements (min sizes)
- Content types (long-form, UI, data)

## Passos

### 1. Selecionar Type Scale Ratio
| Ratio | Nome | Sensacao |
|-------|------|---------|
| 1.125 | Major Second | Compacto, sutil |
| 1.200 | Minor Third | Moderado |
| 1.250 | Major Third | Balanceado (recomendado) |
| 1.333 | Perfect Fourth | Claro, pronunciado |
| 1.414 | Augmented Fourth | Dramatico |
| 1.500 | Perfect Fifth | Muito dramatico |

### 2. Gerar Scale
Com ratio 1.250 e base 16px:
```yaml
type_scale:
  ratio: 1.250
  base: "16px"

  steps:
    - name: "caption"
      size: "0.75rem"    # 12px
      computed: "12px"

    - name: "body-sm"
      size: "0.875rem"   # 14px
      computed: "14px"

    - name: "body"
      size: "1rem"       # 16px (base)
      computed: "16px"

    - name: "body-lg"
      size: "1.125rem"   # 18px
      computed: "18px"

    - name: "h4"
      size: "1.25rem"    # 20px
      computed: "20px"

    - name: "h3"
      size: "1.563rem"   # 25px
      computed: "25px"

    - name: "h2"
      size: "1.953rem"   # 31.25px
      computed: "31px"

    - name: "h1"
      size: "2.441rem"   # 39px
      computed: "39px"

    - name: "display"
      size: "3.052rem"   # 48.8px
      computed: "49px"

    - name: "display-xl"
      size: "3.815rem"   # 61px
      computed: "61px"
```

### 3. Definir Line Heights
| Tipo de conteudo | Line Height | Quando |
|-----------------|-------------|--------|
| Display/Headings | 1.1 - 1.25 | Tight, dramatic |
| Subheadings | 1.25 - 1.35 | Clear but compact |
| Body text | 1.5 - 1.625 | Comfortable reading |
| UI text (labels) | 1.25 - 1.5 | Compact UI |
| Long-form | 1.6 - 1.75 | Extended reading |

### 4. Definir Font Weights
| Weight | Value | Uso |
|--------|-------|-----|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Labels, captions, emphasis |
| Semibold | 600 | Headings, subheadings |
| Bold | 700 | Primary headings, strong emphasis |
| Extrabold | 800 | Display text, hero |

### 5. Criar Typography Composites
```json
{
  "typography": {
    "display-xl": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.family.sans}",
        "fontSize": "{font.size.6xl}",
        "fontWeight": "{font.weight.extrabold}",
        "lineHeight": "{font.line-height.none}",
        "letterSpacing": "-0.025em"
      }
    },
    "body": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.family.sans}",
        "fontSize": "{font.size.base}",
        "fontWeight": "{font.weight.regular}",
        "lineHeight": "{font.line-height.normal}",
        "letterSpacing": "0"
      }
    }
  }
}
```

### 6. Fluid Typography (Optional)
```css
/* clamp(min, preferred, max) */
--font-display: clamp(2.5rem, 5vw + 1rem, 3.815rem);
--font-h1: clamp(1.75rem, 3vw + 0.75rem, 2.441rem);
--font-body: clamp(0.938rem, 0.5vw + 0.813rem, 1.125rem);
```

### 7. Measure (Line Length)
| Tipo | Ideal | Min | Max |
|------|-------|-----|-----|
| Body text | 65-75 ch | 45 ch | 85 ch |
| Headings | Natural | — | 35 ch |
| Captions | Natural | — | 45 ch |

## Saida
- Typography scale with all steps
- Line height guidelines
- Font weight usage guide
- Typography composites (W3C DTCG)
- Fluid typography config (optional)
- Measure guidelines
- Handoff para Canvas (application) e Scaffold (implementation)

## Validacao
- [ ] Scale ratio consistente
- [ ] Min font size >= 12px (caption)
- [ ] Body text >= 16px
- [ ] Line heights por tipo definidos
- [ ] Composites em formato W3C DTCG
- [ ] Measure guidelines incluidos
