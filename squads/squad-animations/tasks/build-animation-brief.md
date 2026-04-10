---
task: build-animation-brief
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_intent
    tipo: object
    origem: "extract-animation-intent"
    obrigatorio: true

Saida:
  - campo: animation_brief
    tipo: document
    destino: "animations-orqx"

Checklist:
  - "[ ] Escrever descricao visual da animacao"
  - "[ ] Definir parametros tecnicos (duration, easing, transforms)"
  - "[ ] Selecionar agente executor e tecnologia"
  - "[ ] Estimar complexidade e dependencias"
  - "[ ] Incluir notas de acessibilidade"
---

# Task: Build Animation Brief

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Transformar o animation intent estruturado em um Animation Brief completo e executavel — documento que qualquer agente da squad pode ler e implementar sem ambiguidades. O brief e o contrato entre interpretacao e execucao.

## Pre-Conditions
- Animation intent extraido (tipo, feeling, element, constraints)
- Brand animation context disponivel (se cross-referenced)
- Animation system tokens definidos (se ja criados)
- Feeling-to-parameters mapping consultado

## Passos

### 1. Estruturar Sections do Brief
| Section | Conteudo | Obrigatorio |
|---------|----------|-------------|
| Project Context | Industria, tom, audiencia | Sim |
| Original Request | Prompt raw do usuario | Sim |
| Intent | Tipo, feeling, elemento, referencia | Sim |
| Visual Description | Como a animacao se parece, frame by frame | Sim |
| Technical Spec | Duration, easing, properties, trigger | Sim |
| Technology | Lib/framework recomendado | Sim |
| Executor Agent | Quem implementa | Sim |
| Complexity | LOW/MEDIUM/HIGH/CRITICAL | Sim |
| Dependencies | Tasks que precisam rodar antes | Sim |
| Accessibility | Reduced motion fallback | Sim |
| Assets Needed | Models, textures, fonts, images | Se aplicavel |
| Performance Budget | Max draw calls, FPS target | Se 3D/particles |

### 2. Escrever Visual Description
```markdown
## Visual Description

### Entrance (T=0ms → T=800ms)
1. Background image loads instantly (no animation)
2. Headline text fades in from opacity:0, slides up 30px (T=0-400ms, ease-decelerate)
3. Subtitle follows with 150ms delay (T=150-550ms)
4. CTA button appears last with scale 0.95→1.0 + fade (T=300-600ms)

### Scroll Interaction (scroll 0% → 100%)
1. Background image moves at 0.3x scroll speed (parallax)
2. Headline moves at 0.7x speed (foreground)
3. At scroll 60%: content fades out (opacity 1→0)
4. Next section begins entering at scroll 70%
```

### 3. Definir Parametros Tecnicos
```yaml
spec:
  entrance:
    headline:
      from: { opacity: 0, y: 30 }
      to: { opacity: 1, y: 0 }
      duration: 400ms
      easing: cubic-bezier(0.0, 0.0, 0.2, 1)
      delay: 0ms
    subtitle:
      from: { opacity: 0, y: 20 }
      to: { opacity: 1, y: 0 }
      duration: 350ms
      easing: cubic-bezier(0.0, 0.0, 0.2, 1)
      delay: 150ms
    cta:
      from: { opacity: 0, scale: 0.95 }
      to: { opacity: 1, scale: 1 }
      duration: 300ms
      easing: back.out(1.2)
      delay: 300ms
  scroll:
    background_speed: 0.3
    headline_speed: 0.7
    fade_out_start: 60%
    fade_out_end: 80%
  trigger: page-load + scroll
  properties_animated: [opacity, transform]
```

### 4. Selecionar Tecnologia e Justificar
| Criterio | Opcao A | Opcao B | Escolha |
|----------|---------|---------|---------|
| Scroll-driven | GSAP ScrollTrigger | CSS scroll-driven | GSAP (mais controle, pin) |
| Entrance | GSAP timeline | CSS @keyframes | GSAP (sequencia, stagger) |
| Parallax | GSAP scrub | Lenis + CSS | GSAP (integrado com scroll) |
| Performance | transform + opacity | transform + opacity | Ambos OK |

**Decisao:** GSAP + ScrollTrigger + Lenis (smooth scroll)
**Razao:** Controle preciso de timeline, pin, scrub e stagger

### 5. Designar Agente Executor
| Componente do Brief | Agente | Task |
|---------------------|--------|------|
| Scroll parallax + pin | @scroll-narrative-engineer | implement-scroll-animation |
| Entrance timing | @motion-choreographer | design-animation-timing |
| Text reveal | @css-motion-artist | build-text-animation |
| Performance audit | @animation-performance-engineer | audit-animation-performance |

**Lead executor:** @scroll-narrative-engineer (componente principal e scroll-driven)

### 6. Estimar Complexidade e Dependencias
```yaml
complexity:
  score: HIGH
  factors:
    - Scroll-driven + entrance = 2 interaction models
    - Parallax layers = 3+ elements coordinated
    - Mobile adaptation needed
  dependencies:
    required:
      - create-animation-system (tokens de duration/easing)
    optional:
      - cross-reference-brand-system (cores e personalidade)
    parallel:
      - design-animation-timing (pode rodar em paralelo)
  estimated_effort: 4-6 hours
```

### 7. Definir Accessibility Fallback
```yaml
accessibility:
  prefers_reduced_motion:
    entrance: "All elements visible immediately, no animation"
    scroll: "Static layout, no parallax, content scrolls normally"
    method: "@media (prefers-reduced-motion: reduce)"
  color_contrast:
    - "Text over image: ensure 4.5:1 contrast ratio"
    - "Use text-shadow or overlay if needed"
  keyboard:
    - "Scroll animations don't block keyboard navigation"
    - "Focus indicators visible during all animation states"
```

### 8. Incluir Assets Necessarios
| Asset | Tipo | Source | Notas |
|-------|------|--------|-------|
| Hero image | Image (WebP) | Design team | Optimize < 200KB |
| Custom font | WOFF2 | Brand system | Preload for text animation |
| Noise texture | PNG (256x256) | Generate | Para shader effects |
| 3D model | GLTF/GLB | Modelador | Se 3D scene needed |

### 9. Definir Performance Budget
```yaml
performance:
  fps_target: 60
  max_simultaneous_animations: 5
  properties_allowed: [transform, opacity, filter]
  properties_forbidden: [width, height, margin, top, left]
  max_draw_calls: 10  # If WebGL
  max_texture_memory: 50MB  # If 3D
  lighthouse_impact: "CLS < 0.1, LCP not affected"
```

### 10. Compilar Brief Final
- Reunir todas sections em documento unico
- Verificar que nao ha contradicoes (ex: "rapido" + duration 1000ms)
- Adicionar notas para o agente executor (tips, warnings, gotchas)
- Marcar como READY para routing pelo animations-orqx

## Output
- Animation Brief completo (documento estruturado)
- Visual description frame-by-frame
- Parametros tecnicos exatos (from/to, duration, easing, delay)
- Tecnologia selecionada com justificativa
- Agente executor designado
- Dependencias mapeadas
- Accessibility fallback definido
- Assets listados
- Performance budget definido

## Quality Criteria
- [ ] Visual description compreensivel sem ver a animacao
- [ ] Parametros tecnicos completos (sem "TBD")
- [ ] Tecnologia justificada (nao arbitraria)
- [ ] Agente executor correto para o tipo de animacao
- [ ] Dependencias explicitadas (required vs optional)
- [ ] Accessibility fallback definido para cada interacao
- [ ] Performance budget realista
- [ ] Brief executavel por qualquer agente sem perguntas adicionais
