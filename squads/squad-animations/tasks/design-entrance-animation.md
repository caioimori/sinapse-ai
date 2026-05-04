---
task: design-entrance-animation
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: element_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: entrance_animation
    tipo: object
    destino: "css-motion-artist ou threejs-architect"

Checklist:
  - "[ ] Definir estado inicial (from)"
  - "[ ] Definir estado final (to)"
  - "[ ] Selecionar tipo (fade, slide, scale, clip, blur)"
  - "[ ] Configurar easing e duration"
  - "[ ] Considerar viewport trigger"
---

# Task: Design Entrance Animation

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Projetar animacoes de entrada — como elementos aparecem no viewport ou na pagina. Definir from/to states, easing e duration que criam uma entrada natural e engajante.

## Pre-Conditions
- Elemento e contexto definidos (hero, card, text, image)
- Trigger definido (page load, scroll, interaction)
- Feeling desejado (sutil, impactante, elegante)
- Performance constraints (composite-only properties)

## Passos

### 1. Selecionar Tipo de Entrance
| Tipo | From State | Melhor Para |
|------|-----------|-------------|
| Fade-in | opacity: 0 | Universal, sutil |
| Slide-up | y: 20-40px, opacity: 0 | Cards, text, content |
| Scale-in | scale: 0.8-0.95, opacity: 0 | Modals, images, heroes |
| Clip-reveal | clip-path: inset(100%) | Headlines, premium |
| Blur-in | filter: blur(10px), opacity: 0 | Dramatic, cinematic |
| Slide-from-side | x: +-50px, opacity: 0 | Navegacao lateral |

### 2. Definir From/To States
```yaml
entrance_spec:
  from:
    opacity: 0
    transform: translateY(30px)
  to:
    opacity: 1
    transform: translateY(0)
  duration: 400ms
  easing: cubic-bezier(0.0, 0.0, 0.2, 1) # decelerate
  trigger: viewport-enter
```

### 3. Duration por Importancia
| Elemento | Duration | Razao |
|----------|----------|-------|
| Hero/headline | 500-700ms | Dramatico, focal |
| Cards/items | 300-400ms | Balanceado |
| Text/paragraph | 300-400ms | Rapido |
| Icons/small | 200-300ms | Sutil |
| Background | 600-800ms | Lento, atmosferico |

### 4. Easing para Entrances
- SEMPRE usar ease-out (decelerate) para entrances
- Objeto "chega rapido e freia" — mais natural
- Nunca ease-in para entrance (parece que "desacelera antes de chegar")
- Spring easing para playful/bouncy

### 5. Distance de Movimento
| Distancia | Feeling | Uso |
|-----------|---------|-----|
| 10-20px | Sutil, profissional | UI elements, forms |
| 20-40px | Notavel, engajante | Cards, sections |
| 40-80px | Dramatico | Hero, full-section |
| 0px (scale/opacity only) | Clean, minimal | Images, icons |

### 6. Trigger Types
| Trigger | Quando | Ferramenta |
|---------|--------|-----------|
| Page load | Imediato | CSS animation, GSAP |
| Viewport enter | Scroll reveals | ScrollTrigger, IO |
| User action | Click, hover | Event listener |
| Data loaded | Async complete | Callback/promise |

### 7. Composicao de Propriedades
- Combinar 2-3 propriedades max (opacity + transform)
- Evitar animar width/height (layout trigger)
- Scale + opacity = modal feel
- translateY + opacity = content reveal

### 8. Stagger Entrance (Grupo)
- Primeiro elemento: sem delay
- Demais: stagger 60-100ms
- Total sequence < 800ms
- Ver task: choreograph-stagger-sequence

### 9. Reduced Motion
- Entrance com opacity fade rapido (100ms)
- OU mostrar tudo instantaneo (no animation)
- NUNCA remover conteudo — so remover motion

### 10. Anti-Patterns
- Distance > 100px (exagerado, parece email marketing)
- Duration > 1s (usuario ja perdeu interesse)
- Ease-in em entrance (nao natural)
- Scale < 0.5 (muito pequeno, distrai)
- Rotate em entrance (confuso para text content)

## Output
- Entrance spec: from/to states, duration, easing
- Trigger type e configuration
- Stagger settings se grupo
- Reduced motion variant
- Anti-pattern warnings

## Quality Criteria
- [ ] Ease-out (decelerate) para todas entrances
- [ ] Duration dentro de 200-700ms
- [ ] Distance proporcional ao tamanho do elemento
- [ ] Apenas propriedades composite (transform, opacity)
- [ ] Trigger correto (load vs scroll vs action)
- [ ] Reduced motion: conteudo visivel
- [ ] Nao exagerado (sutil > dramatico para UI)
- [ ] Consistente com animation system do projeto
