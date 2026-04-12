---
task: design-component-api-contracts
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

# Task: Design Component API Contracts

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Projetar contratos de API de componentes — definir props, variants, slots, eventos e composicao de cada componente de forma que a interface publica seja estavel, previsivel e extensivel.

## Entrada
- Component inventory
- Visual design specs (de Canvas)
- Accessibility requirements (de Beacon)
- Usage patterns observados

## Passos

### 1. Definir API Design Principles
| Principio | Descricao |
|-----------|-----------|
| Minimal API surface | Menor numero de props necessarias |
| Sensible defaults | Funciona sem props opcionais |
| Composable | Compoe com outros componentes |
| Accessible by default | A11y built-in, nao opt-in |
| Type-safe | TypeScript strict |
| Consistent | Padroes iguais entre componentes |

### 2. Template de API Contract
```typescript
// Component API Contract
interface ButtonProps {
  // Required
  children: React.ReactNode;

  // Variants
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';

  // State
  disabled?: boolean;
  loading?: boolean;

  // Behavior
  onClick?: (event: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';

  // Composition
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Polymorphism
  as?: React.ElementType;

  // A11y (built-in)
  // - role="button" (default)
  // - aria-disabled when disabled
  // - aria-busy when loading

  // Styling
  className?: string;
}
```

### 3. Padroes de API Cross-Component
| Pattern | Componentes | Props |
|---------|-----------|-------|
| Variant + Size | Button, Input, Badge, Avatar | variant, size |
| Controlled/Uncontrolled | Input, Select, Checkbox | value/defaultValue, onChange |
| Compound Components | Tabs, Accordion, Menu | Parent + Child |
| Render Props/Slots | Modal, Popover, Table | header, content, footer |
| Polymorphic (as) | Button, Link, Card | as={Component} |

### 4. Definir per Component
Para cada componente core:

```yaml
component_api:
  name: ""
  element: ""  # Semantic HTML base
  description: ""

  props:
    required: []
    variants: []
    state: []
    behavior: []
    composition: []
    a11y_auto: []  # Handled internally

  events:
    - name: ""
      payload: ""
      when: ""

  slots:
    - name: ""
      type: ""
      description: ""

  composition_rules:
    allowed_children: []
    forbidden_patterns: []

  a11y_contract:
    role: ""
    aria_attributes: []
    keyboard: {}
    focus_management: ""
```

### 5. Versioning Strategy
| Change Type | Version Impact | Example |
|------------|---------------|---------|
| New optional prop | Patch | Add `leftIcon` to Button |
| New variant | Minor | Add `ghost` variant |
| Rename prop | Major (breaking) | `color` → `variant` |
| Remove prop | Major (breaking) | Remove `outline` |
| Change default | Major (if behavior changes) | Change default size |

### 6. Documentation Requirements
Cada API contract deve incluir:
- Props table com types e defaults
- Usage examples (basic, with variants, composed)
- Do/Don't examples
- Accessibility notes
- Migration guide (se breaking change)

## Saida
- API contracts per component (TypeScript interfaces)
- Cross-component pattern documentation
- Versioning policy
- Documentation templates
- Handoff para Scaffold (implementation)

## Validacao
- [ ] API minimal (sem props desnecessarias)
- [ ] Defaults sensiveis (funciona sem config)
- [ ] TypeScript strict compliant
- [ ] A11y built-in (nao opt-in)
- [ ] Consistent patterns cross-component
- [ ] Versioning policy definida
