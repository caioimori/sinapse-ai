---
task: translate-feeling-to-parameters
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: feeling
    tipo: string
    origem: "prompt do usuario ou extract-animation-intent"
    obrigatorio: true

Saida:
  - campo: animation_parameters
    tipo: object
    destino: "build-animation-brief"

Checklist:
  - "[ ] Consultar feeling-to-parameters-mapping KB"
  - "[ ] Determinar duration range"
  - "[ ] Selecionar easing curve"
  - "[ ] Definir scale range e movement pattern"
  - "[ ] Recomendar technique e code approach"
---

# Task: Translate Feeling to Parameters

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** STANDARD

## Objetivo
Transformar adjetivos e sentimentos em parametros tecnicos concretos de animacao. Este e o core engine do animation-interpreter — converte linguagem subjetiva em numeros exatos. Consultar KB feeling-to-parameters-mapping.md para tabela completa.

## Pre-Conditions
- Feeling(s) extraidos do input do usuario
- KB feeling-to-parameters-mapping acessivel
- Animation system tokens definidos (ou usar defaults)
- Contexto do elemento (hero vs card vs button — afeta parametros)

## Passos

### 1. Normalizar Feelings de Entrada
| Input do Usuario | Feeling Normalizado |
|-----------------|-------------------|
| "quero algo legal" | engaging (default: energetico + clean) |
| "cinematico" | cinematico |
| "suave e premium" | [suave, premium] → media dos parametros |
| "nao muito rapido" | moderado (negacao de rapido) |
| "tipo Apple" | premium + cinematico + minimalista |

### 2. Consultar Tabela Core de Feelings
| Feeling | Duration | Easing | Distance | Scale | Opacity | Technique |
|---------|----------|--------|----------|-------|---------|-----------|
| Rapido | 150-250ms | power2.out | 10-20px | 0.98-1.0 | 0→1 | CSS transition |
| Suave | 300-500ms | ease-decelerate | 20-30px | 0.95-1.0 | 0→1 | GSAP tween |
| Premium | 400-700ms | ease-decelerate | 15-25px | 0.95-1.0 | 0→1 | GSAP timeline |
| Cinematico | 600-1000ms | ease-decelerate | 30-50px | 0.9-1.0 | 0→1 | ScrollTrigger |
| Energetico | 150-300ms | back.out(1.7) | 20-40px | 0.8-1.0 | 0→1 | Spring/bounce |
| Playful | 300-500ms | elastic.out(1,0.5) | 15-30px | 0.85-1.05 | 0→1 | Spring + overshoot |
| Minimalista | 200-400ms | ease-standard | 0-10px | 1.0 | 0→1 | Fade only |
| Organico | 400-800ms | spring(1,80,10) | Variable | Variable | 0→1 | Noise-based |
| Futurista | 200-400ms | power3.out | 20-30px | 0.9-1.0 | 0→1 | Glitch, clip-path |
| Dramatico | 600-1200ms | ease-decelerate | 40-80px | 0.8-1.0 | 0→1 | Layered timeline |
| Misterioso | 500-800ms | ease-decelerate | 10-20px | 0.95-1.0 | 0→1 | Blur + fade |
| Agressivo | 100-200ms | power4.out | 30-60px | 0.7-1.0 | 0→1 | Sharp, sudden |

### 3. Ajustar por Contexto do Elemento
| Elemento | Duration Modifier | Distance Modifier | Notas |
|----------|------------------|-------------------|-------|
| Hero | x1.5 | x1.5 | Mais dramatico, focal |
| Card | x1.0 | x1.0 | Padrao |
| Button | x0.5 | x0.3 | Micro, rapido |
| Text/paragraph | x0.8 | x0.7 | Nao competir com content |
| Modal | x1.2 | Scale (nao distance) | Focus capture |
| Background | x2.0 | x0.5 | Sutil, atmosferico |
| Icon | x0.5 | x0.3 | Micro-interaction |
| Navigation | x0.6 | x0.5 | Funcional, nao decorativo |

### 4. Compor Multiplos Feelings
```yaml
# When user says "suave e premium":
feeling_1: suave   → { duration: 400ms, easing: ease-decelerate, distance: 25px }
feeling_2: premium → { duration: 550ms, easing: ease-decelerate, distance: 20px }

# Resolution: average / take the more specific
composed: { duration: 475ms, easing: ease-decelerate, distance: 22px }

# When feelings conflict:
# "rapido e dramatico" → contradiction
# Resolution: dramatico timing (600ms) but with snappy easing (power3.out)
# = dramatic entrance that feels purposeful, not slow
```

### 5. Selecionar Easing por Feeling
| Feeling | Easing Function | cubic-bezier | GSAP |
|---------|----------------|-------------|------|
| Suave | ease-decelerate | (0.0, 0.0, 0.2, 1) | power2.out |
| Premium | ease-decelerate smooth | (0.0, 0.0, 0.1, 1) | power3.out |
| Energetico | back.out | (0.175, 0.885, 0.32, 1.275) | back.out(1.7) |
| Playful | elastic | — | elastic.out(1, 0.5) |
| Sharp | ease-sharp | (0.4, 0.0, 0.6, 1) | power1.inOut |
| Cinematico | ease-decelerate slow | (0.0, 0.0, 0.05, 1) | power4.out |
| Minimalista | ease-standard | (0.4, 0.0, 0.2, 1) | power2.inOut |

### 6. Definir Movement Pattern
| Feeling | Movement | Direction | Properties |
|---------|----------|-----------|-----------|
| Suave | translateY (small) | Bottom-up | opacity, transform |
| Premium | translateY (minimal) | Bottom-up | opacity, transform |
| Energetico | translateY (medium) + scale | Bottom-up | opacity, transform |
| Cinematico | translateY (large) + layered | Bottom-up | opacity, transform, filter |
| Playful | translateY + overshoot | Any | opacity, transform |
| Futurista | clip-path reveal | Left-right | clip-path, opacity |
| Misterioso | blur + fade | None (in-place) | opacity, filter |
| Organico | curved path | Arc | opacity, transform |

### 7. Recomendar Technique por Feeling
| Feeling | CSS Only? | Recommended Stack |
|---------|-----------|-------------------|
| Rapido | Yes | CSS transition |
| Suave | Yes | CSS transition or GSAP |
| Premium | Possible | GSAP (better control) |
| Cinematico | No | GSAP + ScrollTrigger |
| Energetico | Possible | CSS spring or GSAP |
| Playful | No | GSAP (elastic, spring) |
| Futurista | Partial | GSAP + CSS clip-path |
| Organico | No | Three.js or GSAP + noise |
| Dramatico | No | GSAP timeline + ScrollTrigger |

### 8. Gerar Parameters Object
```yaml
animation_parameters:
  feeling: premium
  duration: 550ms
  easing:
    css: "cubic-bezier(0.0, 0.0, 0.1, 1)"
    gsap: "power3.out"
  movement:
    type: translateY
    distance: 20px
    direction: bottom-up
  scale:
    from: 0.95
    to: 1.0
  opacity:
    from: 0
    to: 1
  properties: [opacity, transform]
  technique: GSAP
  stagger: 120ms
  trigger: viewport-enter
  reduced_motion:
    duration: 0ms
    movement: none
    opacity: { from: 0, to: 1, duration: 100ms }
```

### 9. Validar Parametros
- Duration dentro de range aceitavel (100ms - 1200ms)
- Distance proporcional ao tamanho do elemento
- Easing correto para tipo de movimento (entrance = out, exit = in)
- Properties sao composite-only (transform, opacity, filter)
- Stagger total < 800ms
- Reduced motion definido

### 10. Lidar com Feelings Nao Mapeados
| Situacao | Approach |
|----------|---------|
| Feeling desconhecido | Buscar sinonimo mais proximo |
| Feeling muito generico ("legal") | Default para "engaging" (energetico + clean) |
| Contradicao detectada | Priorizar o mais especifico |
| Nenhum feeling dado | Usar defaults do animation system |

## Output
- Animation parameters object completo
- Duration exata (ms)
- Easing curve (CSS + GSAP notation)
- Movement pattern (type, distance, direction)
- Scale range (from → to)
- Properties a animar
- Technique recomendada
- Reduced motion variant
- Stagger value (se grupo)

## Quality Criteria
- [ ] Feeling normalizado corretamente
- [ ] Duration dentro de range do feeling
- [ ] Easing correto para tipo de movimento
- [ ] Distance proporcional ao contexto do elemento
- [ ] Properties sao composite-only (performance)
- [ ] Multiplos feelings compostos sem contradicao
- [ ] Reduced motion definido para cada parametro
- [ ] Parametros executaveis (nao vagos, nao TBD)
