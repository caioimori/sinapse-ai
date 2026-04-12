---
task: design-multi-brand-theming
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

# Task: Design Multi-Brand Theming

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Projetar sistema de multi-brand theming — permitir que a mesma base de componentes suporte multiplas marcas trocando apenas token values no nivel L1/L2.

## Entrada
- Token taxonomy (3 niveis)
- Brand guidelines por marca
- Component library
- Dark mode requirements per brand

## Passos

### 1. Definir Arquitetura Multi-Brand
```
┌────────────────────────────────┐
│ Component Tokens (L3)          │ ← Shared across brands
│ button.primary.background      │
│     ↓ references               │
├────────────────────────────────┤
│ Semantic Tokens (L2)           │ ← Shared structure, brand-specific values
│ color.action.primary           │
│     ↓ references               │
├───────────┬───────────┬────────┤
│ Brand A   │ Brand B   │ Brand C│ ← Different L1 values
│ blue.500  │ green.600 │ red.500│
└───────────┴───────────┴────────┘
```

### 2. Identificar Token Layers
| Layer | Shared? | Per-Brand? |
|-------|---------|-----------|
| L1 Primitives | NO | YES — each brand has own palette |
| L2 Semantics | Structure shared | Values per brand |
| L3 Components | YES — fully shared | NO changes needed |

### 3. Definir Brand Configuration
```yaml
multi_brand:
  brands:
    - id: "brand-a"
      name: ""
      primitive_file: "tokens/brand-a/primitives.json"
      themes: ["light", "dark"]

    - id: "brand-b"
      name: ""
      primitive_file: "tokens/brand-b/primitives.json"
      themes: ["light", "dark"]

  shared:
    semantic_structure: "tokens/shared/semantics.json"
    component_tokens: "tokens/shared/components.json"

  resolution_order:
    1: "component (L3)"
    2: "semantic (L2)"
    3: "primitive (L1, brand-specific)"
```

### 4. Mapear Diferencas por Brand
| Token Category | O que muda | O que permanece |
|---------------|-----------|----------------|
| Colors | Primary, secondary palettes | Neutral, feedback colors (optional) |
| Typography | Font family | Scale, weights (usually) |
| Spacing | Rarely changes | Almost always shared |
| Radius | May vary (sharp vs rounded) | — |
| Shadows | May vary | Usually shared |
| Motion | Rarely changes | Usually shared |

### 5. Build Pipeline por Brand
```yaml
build_pipeline:
  input:
    - "tokens/shared/semantics.json"
    - "tokens/{brand}/primitives.json"

  transforms:
    - resolve_references
    - apply_brand_overrides
    - generate_themes

  output:
    - "dist/{brand}/light.css"
    - "dist/{brand}/dark.css"
    - "dist/{brand}/tokens.js"
```

### 6. Testing Strategy
- Visual regression per brand
- Token coverage verification
- Contrast compliance per brand per theme
- Component render test per brand

## Saida
- Multi-brand architecture document
- Per-brand primitive token files
- Shared semantic/component token files
- Build pipeline configuration
- Testing strategy
- Migration guide (single to multi-brand)

## Validacao
- [ ] L3 tokens 100% shared (nenhum brand-specific)
- [ ] L2 structure shared, values per brand
- [ ] L1 fully per-brand
- [ ] Cada brand/theme combinacao gera output valido
- [ ] Contraste WCAG 2.2 AA em todas as combinacoes
- [ ] Build pipeline funcional
