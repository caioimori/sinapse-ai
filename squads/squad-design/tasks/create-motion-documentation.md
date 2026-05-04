---
task: create-motion-documentation
responsavel: "@dx-interaction-designer"
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

# Task: Create Motion Documentation

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Criar documentacao completa de motion design — consolidar principios, tokens, specs e guidelines em documento de referencia para todo o squad.

## Entrada
- Motion principles
- Easing curve library
- Duration scale
- Micro-interaction specs
- Page transition specs
- Scroll animation patterns
- Loading choreography
- Feedback animations
- Motion tokens

## Passos

### 1. Estrutura do Documento
```
Motion Design System
├── 1. Principles (por que)
├── 2. Tokens (o que)
│   ├── Duration scale
│   ├── Easing curves
│   └── Delay values
├── 3. Patterns (como)
│   ├── Micro-interactions
│   ├── Page transitions
│   ├── Scroll animations
│   ├── Loading choreography
│   └── Feedback animations
├── 4. Accessibility
│   ├── Reduced motion
│   ├── No flashing
│   └── Focus animation
├── 5. Performance
│   ├── GPU-only properties
│   ├── will-change usage
│   └── 60fps guidelines
└── 6. Implementation Guide
    ├── CSS patterns
    ├── Framer Motion patterns
    └── Testing
```

### 2. Compilar Token Reference
Tabela de todos os motion tokens com:
- Token name
- Value
- CSS custom property
- Usage description
- Visual example reference

### 3. Pattern Catalog
Para cada pattern, documentar:
- When to use
- Visual example (video/GIF reference)
- Code snippet (CSS + React)
- Reduced motion alternative
- Performance notes

### 4. Decision Tree
```
Preciso de animacao?
├── YES: Tem proposito funcional?
│   ├── YES: Qual tipo?
│   │   ├── Feedback → Use feedback pattern
│   │   ├── Transition → Use page transition
│   │   ├── Reveal → Use scroll animation
│   │   └── State change → Use micro-interaction
│   └── NO: Nao anime
└── NO: Nao anime
```

### 5. Anti-Patterns
| Anti-Pattern | Por que evitar | Alternativa |
|-------------|---------------|-------------|
| Bounce on everything | Infantiliza | Use spring seletivamente |
| Long delays | Frustra | Max 200ms delay |
| Scroll hijack | Quebra expectativa | Parallax sutil |
| Auto-playing video bg | Performance + a11y | Poster frame + play button |
| Flashing elements | Seizure risk + distraction | Subtle pulse |
| Layout animations | CLS + janky | Transform only |

### 6. Storybook Integration
Criar stories de motion:
- Duration comparison
- Easing curve visualization
- Interactive playground
- Reduced motion toggle demo

## Saida
- Motion design system document completo
- Token reference table
- Pattern catalog com code snippets
- Decision tree
- Anti-patterns guide
- Storybook motion stories

## Validacao
- [ ] Todos os tokens documentados
- [ ] Todos os patterns com code examples
- [ ] Decision tree claro
- [ ] Anti-patterns listados
- [ ] Reduced motion em cada pattern
- [ ] Storybook stories planejadas
