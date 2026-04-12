---
task: create-mobile-first-designs
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

# Task: Create Mobile-First Designs

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar interfaces mobile-first — comecar pelo viewport mais restrito, progressivamente adicionando complexidade para viewports maiores.

## Entrada
- Wireframes (de Compass)
- Grid system responsivo
- Component library
- Touch interaction patterns
- Performance budgets

## Passos

### 1. Mobile-First Principles
| Principio | Aplicacao |
|-----------|----------|
| Content first | Priorizar conteudo essencial |
| Progressive enhancement | Adicionar features em viewports maiores |
| Thumb-friendly | Zona de alcance do polegar |
| Performance | Menos recursos = mais rapido |
| Focus | Reduzir distractions |

### 2. Touch Targets (WCAG 2.5.8)
| Elemento | Min Size | Spacing |
|----------|---------|---------|
| Buttons | 44x44px | 8px gap |
| Links em texto | N/A (inline) | Sufficient line-height |
| Icons actionable | 44x44px touch area | 8px gap |
| Form inputs | 44px height | 8px vertical gap |
| List items tappable | 44px min height | — |

### 3. Thumb Zone Design
```
┌─────────────────┐
│  Hard to reach   │  ← Acoes secundarias, settings
│                  │
│  OK to reach     │  ← Conteudo principal, navegacao
│                  │
│  Easy to reach   │  ← CTAs principais, nav bar
└─────────────────┘
```

### 4. Mobile-Specific Patterns
| Pattern | Quando usar | Exemplo |
|---------|------------|---------|
| Bottom nav | App-like, <= 5 items | Tab bar |
| Hamburger menu | Muitos items | Slide-over drawer |
| Pull to refresh | Feeds, listas | Swipe down |
| Swipe actions | List items | Delete, archive |
| Sheet/Drawer | Secondary content | Bottom sheet |
| Sticky CTA | Conversao | Fixed bottom button |
| Infinite scroll | Content feeds | Load more on scroll |

### 5. Progressive Enhancement
```yaml
responsive_enhancement:
  mobile:  # Base
    navigation: "hamburger"
    sidebar: "hidden"
    cards: "1 column stacked"
    images: "compressed, lazy-loaded"
    tables: "card view or horizontal scroll"

  tablet:  # Enhanced
    navigation: "horizontal compact"
    sidebar: "collapsible"
    cards: "2 columns"
    images: "medium quality"
    tables: "key columns visible"

  desktop:  # Full
    navigation: "full horizontal"
    sidebar: "persistent"
    cards: "3-4 columns"
    images: "full quality, 2x retina"
    tables: "all columns"
```

### 6. Performance Considerations
- Images: Use `srcset` e `sizes` para servir tamanho certo
- Fonts: Subset para mobile, full set para desktop
- JS: Minimal bundle para mobile, progressive loading
- CSS: Critical CSS inline, rest async
- Animations: `prefers-reduced-motion` respected

## Saida
- Mobile-first designs para cada template
- Touch interaction specifications
- Progressive enhancement plan
- Performance considerations
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Design comeca pelo mobile (nao adapta do desktop)
- [ ] Touch targets >= 44x44px
- [ ] Thumb zone considerada para CTAs
- [ ] Progressive enhancement documentado
- [ ] Performance considerations para mobile
- [ ] Horizontal scroll evitado
