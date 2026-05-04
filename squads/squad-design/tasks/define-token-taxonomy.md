---
task: define-token-taxonomy
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

# Task: Define Token Taxonomy

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Definir a taxonomia de design tokens de 3 niveis — estabelecer naming conventions, hierarquia e relacionamentos entre primitive, semantic e component tokens.

## Entrada
- Brand tokens (de squad-brand)
- Visual design decisions (de Canvas)
- Multi-brand requirements (se aplicavel)
- Dark mode requirements
- W3C DTCG spec reference

## Passos

### 1. Definir Arquitetura de 3 Niveis
```
┌─────────────────────────────────────┐
│  COMPONENT TOKENS (L3)              │
│  button.primary.background          │
│  card.border.radius                 │
│  input.focus.border                 │
│      ↑ References ↑                 │
├─────────────────────────────────────┤
│  SEMANTIC TOKENS (L2)               │
│  color.action.primary               │
│  radius.medium                      │
│  border.focus                       │
│      ↑ References ↑                 │
├─────────────────────────────────────┤
│  PRIMITIVE TOKENS (L1)              │
│  blue.500                           │
│  4px                                │
│  1px solid                          │
└─────────────────────────────────────┘
```

### 2. Naming Convention
```yaml
naming:
  format: "kebab-case"
  structure: "{category}.{property}.{modifier}"

  categories:
    - color
    - spacing
    - sizing
    - radius
    - shadow
    - font
    - motion
    - border
    - opacity
    - z-index

  properties:
    color: [background, foreground, border, outline, surface]
    spacing: [gap, padding, margin, inset]
    sizing: [width, height, min, max]

  modifiers:
    scale: [xs, sm, md, lg, xl, 2xl]
    state: [default, hover, active, focus, disabled]
    emphasis: [subtle, default, emphasis, inverse]
```

### 3. Token Type Definitions (W3C DTCG)
| Tipo | $type | Exemplo |
|------|-------|---------|
| Color | "color" | "#3B82F6" |
| Dimension | "dimension" | "16px" |
| Font Family | "fontFamily" | "Inter, sans-serif" |
| Font Weight | "fontWeight" | 600 |
| Duration | "duration" | "200ms" |
| Cubic Bezier | "cubicBezier" | [0.4, 0, 0.2, 1] |
| Shadow | "shadow" | {color, offsetX, offsetY, blur, spread} |
| Typography | "typography" | {fontFamily, fontSize, fontWeight, lineHeight, letterSpacing} |
| Composite | N/A | References to other tokens |

### 4. Resolucao de Referencias
Tokens devem usar `$value` com referencias:
```json
{
  "color": {
    "action": {
      "primary": {
        "$value": "{color.blue.500}",
        "$type": "color"
      }
    }
  }
}
```

### 5. Governance Rules
| Regra | Descricao |
|-------|-----------|
| L1 nunca referencia L2/L3 | Primitives sao standalone |
| L2 SEMPRE referencia L1 | Semantics derivam de primitives |
| L3 SEMPRE referencia L2 | Components derivam de semantics |
| Sem valores hardcoded em L2/L3 | Tudo deve ser referencia |
| Naming deve ser descritivo do USO | Nao da aparencia |

### 6. Documentar Taxonomy
```yaml
token_taxonomy:
  version: "1.0"
  format: "w3c-dtcg"
  tiers: 3
  naming_convention: "kebab-case"
  categories: []
  total_tokens:
    primitive: 0
    semantic: 0
    component: 0
  governance:
    review_required: true
    breaking_change_policy: "major version bump"
```

## Saida
- Token taxonomy document
- Naming convention guide
- Tier architecture diagram
- Governance rules
- W3C DTCG compliance notes
- Handoff para create-primitive/semantic/component-tokens

## Validacao
- [ ] 3 niveis claramente definidos
- [ ] Naming convention documentada
- [ ] W3C DTCG compliant
- [ ] Governance rules definidas
- [ ] Sem ambiguidades em naming
- [ ] Reference chain validada (L3→L2→L1)
