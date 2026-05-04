---
task: create-component-tokens
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

# Task: Create Component Tokens

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Criar o nivel L3 de design tokens — tokens especificos de componente que mapeiam semantic tokens para cada propriedade visual de cada componente.

## Entrada
- Semantic tokens (L2)
- Component inventory
- Component visual states (de Canvas)
- Variant definitions

## Passos

### 1. Definir Component Token Structure
```json
{
  "button": {
    "primary": {
      "background": {
        "default": { "$value": "{color.action.primary.default}" },
        "hover": { "$value": "{color.action.primary.hover}" },
        "active": { "$value": "{color.action.primary.active}" },
        "disabled": { "$value": "{color.action.primary.disabled}" }
      },
      "foreground": {
        "default": { "$value": "{color.foreground.inverse}" },
        "disabled": { "$value": "{color.foreground.subtle}" }
      },
      "border": {
        "radius": { "$value": "{radius.md}" }
      },
      "padding": {
        "x": { "$value": "{space.inset.lg}" },
        "y": { "$value": "{space.inset.sm}" }
      },
      "font": {
        "size": { "$value": "{font.size.sm}" },
        "weight": { "$value": "{font.weight.semibold}" }
      }
    }
  }
}
```

### 2. Componentes Prioritarios
| Componente | Variants | States |
|-----------|---------|--------|
| Button | primary, secondary, ghost, danger | default, hover, active, focus, disabled, loading |
| Input | default, error, success | default, focus, filled, disabled, readonly |
| Card | default, elevated, outlined | default, hover, selected |
| Badge | info, success, warning, error | — |
| Modal | default | — |
| Toast | success, error, warning, info | — |
| Tabs | default | default, active, hover, disabled |
| Table | default | — |
| Pagination | default | default, active, disabled |
| Avatar | default | — |

### 3. Token por Variant
Para cada variant de cada componente:
- background (all states)
- foreground/text (all states)
- border.color (all states)
- border.radius
- border.width
- padding (x, y)
- font (size, weight, family)
- shadow
- min-height/width
- gap (internal spacing)

### 4. Size Variants
Componentes com tamanhos:
```json
{
  "button": {
    "size": {
      "sm": {
        "height": { "$value": "{sizing.8}" },
        "padding-x": { "$value": "{space.inset.sm}" },
        "font-size": { "$value": "{font.size.xs}" }
      },
      "md": {
        "height": { "$value": "{sizing.10}" },
        "padding-x": { "$value": "{space.inset.md}" },
        "font-size": { "$value": "{font.size.sm}" }
      },
      "lg": {
        "height": { "$value": "{sizing.12}" },
        "padding-x": { "$value": "{space.inset.lg}" },
        "font-size": { "$value": "{font.size.base}" }
      }
    }
  }
}
```

### 5. Validar Reference Chain
Verificar que TODOS os component tokens apontam para semantic tokens:
- L3 → L2 → L1 (correto)
- L3 → L1 (INCORRETO — pular semantic)
- L3 → raw value (INCORRETO — hardcoded)

## Saida
- Component tokens JSON (W3C DTCG format)
- Token mapping per component
- Variant/size/state matrix
- Reference chain validation report
- Handoff para Scaffold (CSS custom properties)

## Validacao
- [ ] TODOS os tokens referenciam L2 (semantics)
- [ ] Todos os estados cobertos
- [ ] Todas as variants documentadas
- [ ] Size variants consistentes
- [ ] Reference chain L3→L2→L1 validada
- [ ] W3C DTCG compliant
