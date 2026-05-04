---
task: interpret-animation-prompt
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: user_prompt
    tipo: string
    origem: "usuario (prompt, briefing, descricao)"
    obrigatorio: true
  - campo: site_context
    tipo: object
    origem: "briefing do site, brand system, wireframes"
    obrigatorio: false

Saida:
  - campo: animation_brief
    tipo: document
    destino: "animations-orqx para execucao"

Checklist:
  - "[ ] Receber e analisar prompt do usuario"
  - "[ ] Extrair keywords e sentimento desejado"
  - "[ ] Consultar feeling-to-parameters-mapping KB"
  - "[ ] Cross-referenciar com brand system se disponivel"
  - "[ ] Determinar tipo de animacao e tecnologia"
  - "[ ] Gerar Animation Brief completo"
  - "[ ] Fazer NO MAXIMO 2 perguntas clarificadoras se necessario"
---

# Task: Interpret Animation Prompt

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** CRITICAL

## Objetivo
Receber qualquer input do usuario — vago, tecnico, referencial ou emocional — e traduzir em Animation Brief executavel com parametros concretos. Esta e a task mais critica da squad, pois resolve a dor principal: descrever animacoes e dificil.

## Pre-Conditions
- Input do usuario disponivel (prompt textual, URL de referencia, screenshot, ou briefing)
- KB feeling-to-parameters-mapping acessivel
- Brand system do projeto acessivel (se existir)
- Animation system tokens conhecidos (se ja definidos)

## Passos

### 1. Classificar Tipo de Input
| Tipo de Input | Exemplo | Approach |
|---------------|---------|----------|
| Vago | "quero algo legal na hero" | Inferir feeling, propor opcoes |
| Com feeling | "quero algo cinematico e premium" | Mapear feeling -> parametros |
| Com referencia | "como o site da Apple" | Analisar referencia, extrair tecnicas |
| Briefing completo | "parallax na hero, cards fadeIn" | Parsear spec, validar viabilidade |
| Spec tecnica | "GSAP scroll scrub, pin 3 sections" | Traduzir direto para brief |

### 2. Extrair Keywords do Input
```yaml
extracted:
  feelings: [cinematico, premium, suave]
  elements: [hero-section, cards, background]
  actions: [parallax, fade-in, scroll-driven]
  references: ["apple.com/iphone", "stripe.com"]
  constraints: [mobile-friendly, fast-loading]
  industry: fintech
  anti_patterns: ["nao quero nada barulhento"]
```

### 3. Consultar Feeling-to-Parameters KB
| Feeling | Duration | Easing | Movement | Scale | Technique |
|---------|----------|--------|----------|-------|-----------|
| Cinematico | 600-1000ms | ease-decelerate | Slow, layered | Subtle | ScrollTrigger, parallax |
| Premium | 400-800ms | ease-decelerate | Minimal, clean | 0.95-1.0 | Fade, subtle scale |
| Energetico | 150-300ms | back.out | Snappy, bold | 1.0-1.1 | Spring, bounce |
| Organico | 400-600ms | spring(1,80,10) | Flowing, curves | Variable | Flow field, noise |
| Tech/futurista | 200-500ms | power3.out | Geometric, grid | Sharp | Glitch, particles |

### 4. Cross-Referenciar com Brand System
- Paleta de cores → cores de particulas, gradients, glow
- Personalidade da marca → estilo de motion (contido vs expressivo)
- Valores → principios de animacao (confianca = consistente, inovacao = bold)
- Tipografia → approach de text animation (serif = reveal elegante, sans = slide rapido)
- Se brand system nao disponivel: usar defaults neutros

### 5. Selecionar Tecnologia
| Tipo de Animacao | Tech Primaria | Alternativa |
|-----------------|---------------|-------------|
| UI transitions, hover, fade | CSS animations | — |
| Scroll-driven, timeline | GSAP + ScrollTrigger | CSS scroll-driven |
| Page transitions | View Transitions API | Barba.js + GSAP |
| 3D scenes, objects | Three.js | — |
| Shaders, effects | GLSL + Three.js | — |
| Particles (< 5K) | Three.js Points | Canvas 2D |
| Particles (> 100K) | GPGPU shader | — |
| Layout animations | Framer Motion | FLIP + GSAP |
| Text splitting | SplitType + GSAP | CSS clip-path |

### 6. Determinar Agente Executor
| Tipo | Agente | Quando |
|------|--------|--------|
| CSS animations, hover, micro | css-motion-artist | Pure CSS, no JS needed |
| Scroll, parallax, pin | scroll-narrative-engineer | ScrollTrigger, scroll-driven |
| 3D scene, models | threejs-architect | WebGL, Three.js |
| Shaders, effects | shader-artist | GLSL, post-processing |
| Particles, generative | generative-particle-engineer | Particles, flow, boids |
| Timing, easing, system | motion-choreographer | Choreography, guidelines |

### 7. Gerar Animation Brief
```yaml
animation_brief:
  project_context: "Site de fintech, tom premium e confiavel"
  original_request: "quero uma hero cinematica com parallax"
  intent:
    type: scroll-driven
    element: hero-section
    feeling: [cinematico, premium]
    reference: null
    constraints: [mobile-friendly, 60fps]
  spec:
    duration: "800ms entrance, scroll-scrubbed parallax"
    easing: "ease-decelerate (0.0, 0.0, 0.2, 1)"
    properties: [opacity, transform]
    stagger: "100ms between layers"
    trigger: "scroll + page-load"
  technology: "GSAP + ScrollTrigger"
  executor: "@scroll-narrative-engineer"
  complexity: HIGH
  dependencies: ["create-animation-system (tokens)"]
  accessibility:
    reduced_motion: "static hero, no parallax"
    contrast: "text legivel sobre background"
```

### 8. Regra de Ouro: Propor Antes de Perguntar
- SEMPRE propor interpretacao concreta primeiro
- Formato: "Entendi que voce quer [X]. Vou implementar [Y] com [Z]. Certo?"
- So perguntar se ambiguidade critica (nao saber se 2D ou 3D, por exemplo)
- Max 2 perguntas clarificadoras
- Se nao ha ambiguidade: gerar brief e entregar

### 9. Lidar com Inputs Especiais
| Input | Tratamento |
|-------|------------|
| URL de referencia | Executar analyze-reference-animation primeiro |
| Screenshot/video | Descrever o que ve, inferir tecnicas |
| "igual ao projeto X" | Buscar em projetos anteriores ou KBs |
| Input contraditorios | Apontar contradicao, sugerir resolucao |
| Scope muito grande | Decompor em fases, priorizar |

### 10. Validar e Entregar
- Verificar que brief cobre: tipo, feeling, tech, executor, accessibility
- Confirmar que parametros sao realizaveis (feasibility check rapido)
- Se complexidade CRITICAL: sugerir fase de prototipo
- Entregar brief ao animations-orqx para routing

## Output
- Animation Brief completo (YAML ou documento estruturado)
- Intent classificado (tipo, feeling, element, constraints)
- Parametros tecnicos (duration, easing, properties, trigger)
- Tecnologia e agente executor recomendados
- Dependencias identificadas
- Accessibility fallback definido
- Max 2 perguntas clarificadoras (se necessario)

## Quality Criteria
- [ ] Input classificado corretamente (vago/feeling/ref/spec)
- [ ] Feeling mapeado para parametros concretos
- [ ] Brand system cross-referenciado (se disponivel)
- [ ] Tecnologia correta para tipo de animacao
- [ ] Agente executor correto designado
- [ ] Brief completo e executavel (sem ambiguidades)
- [ ] Accessibility fallback incluido
- [ ] Max 2 perguntas (propor antes de perguntar)
