---
task: design-animation-timing
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_brief
    tipo: document
    origem: "animations-orqx"
    obrigatorio: true

Saida:
  - campo: timing_spec
    tipo: object
    destino: "agente executor"

Checklist:
  - "[ ] Definir duration por elemento"
  - "[ ] Selecionar easing curves"
  - "[ ] Configurar delays e staggers"
  - "[ ] Mapear sequencia temporal"
  - "[ ] Aplicar principios Disney relevantes"
  - "[ ] Validar ritmo geral"
---

# Task: Design Animation Timing

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Projetar o timing completo de uma animacao — durations, easing curves, delays, staggers e sequenciamento. O timing e o que diferencia animacao amadora de profissional. Entregar uma timing spec executavel pelos agentes implementadores.

## Pre-Conditions
- Animation brief com tipo e elementos a animar
- Contexto da animacao (micro-interaction, entrance, page transition)
- Feeling desejado (snappy, smooth, dramatic, playful)
- Numero de elementos no sequence

## Regras de Timing
- Micro-interactions: 100-300ms
- Transitions: 200-500ms
- Entrance animations: 300-800ms
- Complex sequences: 600-1200ms
- Page transitions: 400-800ms

## Passos

### 1. Classificar Contexto de Timing
| Contexto | Duration Range | Easing Family |
|----------|---------------|---------------|
| Immediate feedback | 50-150ms | ease-out |
| State change | 150-300ms | ease-in-out |
| Entrance/reveal | 300-600ms | ease-out (decelerate) |
| Exit/dismiss | 150-300ms | ease-in (accelerate) |
| Dramatic/hero | 600-1200ms | custom bezier |
| Scroll-driven | N/A (scrub) | linear/ease-out |

### 2. Definir Duration por Elemento
| Elemento | Duration | Justificativa |
|----------|----------|---------------|
| Button hover | 150ms | Feedback imediato |
| Card entrance | 400ms | Noticeable but not slow |
| Modal open | 300ms | Standard |
| Page transition | 500ms | Smooth handoff |
| Hero sequence | 800ms | Dramatic impact |

### 3. Selecionar Easing Curves
| Tipo | CSS | Feeling |
|------|-----|---------|
| Standard | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Balanced, natural |
| Decelerate | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Entrance, appearing |
| Accelerate | `cubic-bezier(0.4, 0.0, 1, 1)` | Exit, disappearing |
| Sharp | `cubic-bezier(0.4, 0.0, 0.6, 1)` | Quick, decisive |
| Spring | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Bouncy, playful |

### 4. Mapear Sequencia Temporal
```
t=0ms    Element A starts (entrance)
t=100ms  Element B starts (stagger)
t=200ms  Element C starts (stagger)
t=400ms  Element A complete
t=500ms  Element B complete
t=600ms  Element C complete
Total: 600ms perceived, 400ms per element
```

### 5. Configurar Stagger Pattern
| Pattern | Stagger Delay | Quando |
|---------|--------------|--------|
| Cascade | 50-100ms fixo | Listas, cards |
| Accelerating | 80, 60, 40ms | Building energy |
| Decelerating | 40, 60, 80ms | Settling down |
| From center | Distancia-based | Grid, radial |

### 6. Aplicar Regra de Assimetria
- Entrance: mais lento (ease-out, 300-600ms)
- Exit: mais rapido (ease-in, 70% do entrance)
- Exemplo: entrance 400ms, exit 280ms

### 7. Validar Perceived Duration
- Animacao mais rapida que 100ms: user nao percebe como animacao
- Mais lenta que 1000ms: user percebe como lenta
- Sweet spot para UI: 200-400ms
- Teste: fechar os olhos, abrir, a animacao ja deveria estar quase completa

### 8. Considerar Contexto de Repeticao
| Frequencia | Timing Approach |
|-----------|----------------|
| Uma vez (page load) | Mais dramatico (600-800ms) |
| Frequente (hover) | Mais rapido (100-200ms) |
| Repetitivo (lista) | Minimo (50-80ms stagger) |
| Scroll-driven | Scrub (sem duration fixo) |

### 9. Documentar Timing Spec
```yaml
timing_spec:
  element_a:
    duration: 400ms
    easing: cubic-bezier(0.0, 0.0, 0.2, 1)
    delay: 0ms
    property: [opacity, transform]
  element_b:
    duration: 400ms
    easing: cubic-bezier(0.0, 0.0, 0.2, 1)
    delay: 100ms
    property: [opacity, transform]
  total_perceived: 500ms
```

### 10. Reduced Motion Timing
- Reduce durations to 0ms (instant state change)
- Remove staggers
- Keep color/opacity changes (reduce, not eliminate)
- Document which animations are decorative vs functional

## Output
- Timing spec completa por elemento
- Easing curves selecionadas com justificativa
- Stagger pattern definido
- Sequencia temporal mapeada
- Reduced motion variants
- Total perceived duration

## Quality Criteria
- [ ] Durations dentro dos ranges recomendados
- [ ] Easing curves adequadas ao contexto (decelerate/accelerate)
- [ ] Stagger nao faz animacao total exceder 1s
- [ ] Entrada mais lenta que saida (assimetria)
- [ ] Timing spec documentada e executavel
- [ ] Reduced motion: instant ou sem animacao
- [ ] Perceived duration validada mentalmente
- [ ] Ritmo geral consistente (nao mistura rapido e lento sem razao)
