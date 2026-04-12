---
task: create-semantic-tokens
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

# Task: Create Semantic Tokens

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Criar o nivel L2 de design tokens — tokens semanticos que atribuem significado contextual aos primitives, habilitando theming (dark mode, multi-brand).

## Entrada
- Primitive tokens (L1)
- Token taxonomy
- Theme requirements (light/dark)
- Usage contexts

## Passos

### 1. Mapear Color Semantics
```json
{
  "color": {
    "background": {
      "default": { "$value": "{color.white}", "$type": "color" },
      "subtle": { "$value": "{color.neutral.50}", "$type": "color" },
      "muted": { "$value": "{color.neutral.100}", "$type": "color" },
      "emphasis": { "$value": "{color.neutral.900}", "$type": "color" },
      "inverse": { "$value": "{color.neutral.950}", "$type": "color" }
    },
    "foreground": {
      "default": { "$value": "{color.neutral.900}", "$type": "color" },
      "muted": { "$value": "{color.neutral.600}", "$type": "color" },
      "subtle": { "$value": "{color.neutral.400}", "$type": "color" },
      "inverse": { "$value": "{color.white}", "$type": "color" },
      "on-emphasis": { "$value": "{color.white}", "$type": "color" }
    },
    "action": {
      "primary": {
        "default": { "$value": "{color.blue.500}", "$type": "color" },
        "hover": { "$value": "{color.blue.600}", "$type": "color" },
        "active": { "$value": "{color.blue.700}", "$type": "color" },
        "disabled": { "$value": "{color.neutral.300}", "$type": "color" }
      }
    },
    "feedback": {
      "success": { "$value": "{color.green.500}", "$type": "color" },
      "warning": { "$value": "{color.amber.500}", "$type": "color" },
      "error": { "$value": "{color.red.500}", "$type": "color" },
      "info": { "$value": "{color.blue.500}", "$type": "color" }
    },
    "border": {
      "default": { "$value": "{color.neutral.200}", "$type": "color" },
      "emphasis": { "$value": "{color.neutral.400}", "$type": "color" },
      "focus": { "$value": "{color.blue.500}", "$type": "color" }
    }
  }
}
```

### 2. Mapear Spacing Semantics
```json
{
  "space": {
    "inset": {
      "xs": { "$value": "{spacing.1}", "$type": "dimension" },
      "sm": { "$value": "{spacing.2}", "$type": "dimension" },
      "md": { "$value": "{spacing.4}", "$type": "dimension" },
      "lg": { "$value": "{spacing.6}", "$type": "dimension" },
      "xl": { "$value": "{spacing.8}", "$type": "dimension" }
    },
    "gap": {
      "xs": { "$value": "{spacing.1}", "$type": "dimension" },
      "sm": { "$value": "{spacing.2}", "$type": "dimension" },
      "md": { "$value": "{spacing.4}", "$type": "dimension" },
      "lg": { "$value": "{spacing.6}", "$type": "dimension" },
      "xl": { "$value": "{spacing.10}", "$type": "dimension" }
    },
    "section": {
      "sm": { "$value": "{spacing.8}", "$type": "dimension" },
      "md": { "$value": "{spacing.12}", "$type": "dimension" },
      "lg": { "$value": "{spacing.16}", "$type": "dimension" },
      "xl": { "$value": "{spacing.24}", "$type": "dimension" }
    }
  }
}
```

### 3. Mapear Typography Semantics
```json
{
  "typography": {
    "display": {
      "$value": {
        "fontFamily": "{font.family.sans}",
        "fontSize": "{font.size.5xl}",
        "fontWeight": "{font.weight.extrabold}",
        "lineHeight": "{font.line-height.tight}",
        "letterSpacing": "-0.02em"
      },
      "$type": "typography"
    },
    "heading": {
      "h1": { "..." : "..." },
      "h2": { "..." : "..." },
      "h3": { "..." : "..." }
    },
    "body": {
      "default": { "..." : "..." },
      "small": { "..." : "..." }
    }
  }
}
```

### 4. Criar Dark Mode Overrides
Para cada semantic token, definir dark mode value:
| Semantic Token | Light | Dark |
|---------------|-------|------|
| color.background.default | white | neutral.950 |
| color.foreground.default | neutral.900 | neutral.50 |
| color.border.default | neutral.200 | neutral.800 |
| color.action.primary.default | blue.500 | blue.400 |

### 5. Mapear Remainders
- **Radius semantics:** radius.none, .sm, .md, .lg, .full
- **Shadow semantics:** shadow.none, .sm, .md, .lg
- **Motion semantics:** duration.instant, .fast, .normal, .slow
- **Z-index semantics:** z.base, .dropdown, .overlay, .modal, .toast

## Saida
- Semantic tokens JSON (W3C DTCG, light mode)
- Semantic tokens JSON (W3C DTCG, dark mode)
- Token mapping documentation
- Theme switching specification
- Handoff para create-component-tokens

## Validacao
- [ ] TODOS os semantic tokens referenciam primitives (nao raw values)
- [ ] Dark mode overrides para todos os color tokens
- [ ] Naming descreve uso (nao aparencia)
- [ ] W3C DTCG compliant
- [ ] Cobertura completa (color, spacing, typography, radius, shadow, motion, z-index)
