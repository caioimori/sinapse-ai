---
task: analyze-reference-animation
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: reference
    tipo: string
    origem: "URL, descricao ou screenshot"
    obrigatorio: true

Saida:
  - campo: reference_analysis
    tipo: object
    destino: "build-animation-brief"

Checklist:
  - "[ ] Identificar tecnicas usadas na referencia"
  - "[ ] Estimar parametros (duration, easing, effects)"
  - "[ ] Listar bibliotecas provavelmente usadas"
  - "[ ] Classificar dificuldade de reproducao"
  - "[ ] Sugerir adaptacoes para o projeto atual"
---

# Task: Analyze Reference Animation

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Desmembrar uma referencia de animacao (URL, video, screenshot, ou descricao) em componentes reproduziveis — identificar tecnicas, estimar parametros, listar bibliotecas e classificar dificuldade. Estilo reverse-engineering a la Yuri Artiukh (Akella).

## Pre-Conditions
- Referencia fornecida pelo usuario (URL de site, video, screenshot, codepen, ou descricao textual)
- Acesso ao site de referencia (se URL) ou descricao detalhada
- Conhecimento das bibliotecas de animacao web (GSAP, Three.js, Framer Motion, etc.)

## Passos

### 1. Classificar Tipo de Referencia
| Tipo | Source | Approach de Analise |
|------|--------|---------------------|
| URL de site | Live website | Inspecionar DevTools, analisar JS |
| Video/GIF | Recording | Frame-by-frame analysis |
| Screenshot | Static image | Inferir motion de layout/states |
| Codepen/sandbox | Code available | Read code directly |
| Descricao textual | User's words | Parse description, infer techniques |
| Awwwards/showcase | Portfolio site | Identify common patterns |

### 2. Identificar Tecnicas por Layer
```yaml
analysis:
  layers:
    - name: "Hero section entrance"
      techniques:
        - type: staggered-fade
          elements: [headline, subtitle, CTA]
          estimated_duration: 800ms total
          estimated_stagger: 150ms

    - name: "Background parallax"
      techniques:
        - type: scroll-parallax
          layers: 3
          speed_range: [0.2, 0.5, 0.8]
          library_likely: "GSAP ScrollTrigger"

    - name: "3D product reveal"
      techniques:
        - type: threejs-scene
          features: [orbit, lighting, environment-map]
          estimated_polycount: "50K-100K"
          library_likely: "Three.js + GLTF"
```

### 3. Estimar Parametros de Timing
| O Que Observar | Como Estimar | Ferramenta |
|----------------|-------------|------------|
| Duration | Contar frames no video (24/30/60fps) | Screen record + frame count |
| Easing | Observar aceleracao visual | Slow-motion replay |
| Stagger | Tempo entre primero e ultimo elemento | Frame comparison |
| Delay | Tempo antes da animacao iniciar | Timestamp analysis |
| Total sequence | Do primeiro ao ultimo movimento | Full recording time |

```yaml
estimated_parameters:
  hero_entrance:
    headline: { duration: 500ms, easing: ease-decelerate, delay: 0ms }
    subtitle: { duration: 400ms, easing: ease-decelerate, delay: 150ms }
    cta: { duration: 350ms, easing: back.out, delay: 300ms }
    total_sequence: 650ms
```

### 4. Identificar Bibliotecas Provaveis
| Pista Visual | Biblioteca Provavel | Confianca |
|-------------|-------------------|-----------|
| Smooth scroll custom | Lenis / Locomotive Scroll | Alta |
| Scroll-driven animations | GSAP ScrollTrigger | Alta |
| Spring/physics easing | Framer Motion / React Spring | Media |
| 3D scene interativo | Three.js | Alta |
| Shader effects (distortion) | Three.js + GLSL shaders | Alta |
| Text splitting animation | SplitType + GSAP | Alta |
| Page transitions smooth | Barba.js / View Transitions | Media |
| SVG morphing | GSAP MorphSVG / Flubber | Media |
| Particle effects | Three.js / tsParticles / Canvas | Media |
| Layout animation | Framer Motion | Media |

### 5. Inspecionar Codigo (Se URL Disponivel)
```yaml
inspection_checklist:
  - "View Page Source: check for Three.js, GSAP, Framer imports"
  - "DevTools > Sources: search for gsap, ScrollTrigger, THREE"
  - "DevTools > Elements: check for data-scroll, data-speed attributes"
  - "DevTools > Performance: record scroll, check paint/composite"
  - "DevTools > Network: check for .glb, .gltf, .hdr, shader files"
  - "Wappalyzer/BuiltWith: detect frameworks"
  - "bundle-analyzer tools: check JS bundle contents"
```

### 6. Classificar Dificuldade de Reproducao
| Nivel | Descricao | Horas Estimadas | Exemplo |
|-------|-----------|----------------|---------|
| EASY | CSS only, standard patterns | 2-4h | Fade-in cards, hover effects |
| MEDIUM | GSAP + ScrollTrigger, text split | 4-8h | Parallax hero, stagger reveals |
| HARD | Three.js scene, custom shaders | 8-20h | 3D product viewer, particles |
| EXTREME | Custom physics, complex pipeline | 20-40h | Full WebGL experience, fluid sim |
| REQUIRES_ASSETS | Depende de assets 3D/video | Variable | Model-dependent scenes |

### 7. Decompor em Tasks Reproduziveis
```yaml
decomposition:
  total_difficulty: HARD
  tasks:
    - task: "setup-threejs-scene"
      agent: "@threejs-architect"
      difficulty: MEDIUM
      hours: 4

    - task: "implement-scroll-animation"
      agent: "@scroll-narrative-engineer"
      difficulty: MEDIUM
      hours: 3

    - task: "create-custom-shader"
      agent: "@shader-artist"
      difficulty: HARD
      hours: 6

    - task: "build-text-animation"
      agent: "@css-motion-artist"
      difficulty: EASY
      hours: 2
```

### 8. Sugerir Adaptacoes para o Projeto
| Aspecto da Referencia | Adaptacao Sugerida | Razao |
|----------------------|-------------------|----|
| Complexidade 3D excessiva | Simplificar para 2D parallax | Budget/timeline |
| Efeito shader especifico | Usar efeito similar mais simples | Browser support |
| Biblioteca pesada | Alternativa mais leve | Performance |
| Efeito nao acessivel | Adicionar reduced motion | Compliance |
| Assets que nao temos | Substituir por generativo | Independencia |

### 9. Criar Comparison Table
```yaml
comparison:
  reference_vs_project:
    | Aspecto | Referencia | Nosso Projeto | Decisao |
    |---------|-----------|---------------|---------|
    | 3D scene | Three.js full | Three.js simplified | Reduce polygon count |
    | Scroll | Locomotive | GSAP ScrollTrigger | More lightweight |
    | Text | SplitType premium | SplitType (open source) | Same approach |
    | Colors | Blue gradient | Brand colors | Adapt to brand |
    | Performance | Desktop-focused | Mobile-first | Lighter animations |
```

### 10. Compilar Reference Analysis
```yaml
reference_analysis:
  url: "https://example.com"
  summary: "Premium scroll-driven experience with 3D product and parallax layers"
  techniques:
    - scroll-parallax (3 layers)
    - text-split-reveal (SplitType)
    - 3D-product-viewer (Three.js)
    - custom-shader-transition
  libraries: [GSAP, ScrollTrigger, Three.js, SplitType, Lenis]
  difficulty: HARD
  estimated_hours: 20-30
  adaptations:
    - "Simplify 3D to image parallax (saves 15h)"
    - "Keep text animation approach (2h)"
    - "Replace custom shader with preset effect (saves 5h)"
  recommended_approach: "Implement 60% of the reference, focus on scroll + text"
```

## Output
- Reference analysis completa
- Tecnicas identificadas por layer
- Parametros estimados (duration, easing, stagger)
- Bibliotecas provaveis listadas
- Dificuldade classificada (EASY-EXTREME)
- Decomposicao em tasks reproduziveis
- Adaptacoes sugeridas para o projeto
- Comparison table (referencia vs projeto)
- Horas estimadas

## Quality Criteria
- [ ] Todas tecnicas visiveis identificadas
- [ ] Parametros estimados com confianca razoavel
- [ ] Bibliotecas provaveis listadas (nao chutadas)
- [ ] Dificuldade classificada com justificativa
- [ ] Decomposicao em tasks acionaveis
- [ ] Adaptacoes realistas para o projeto
- [ ] Horas estimadas incluem margem
- [ ] Analysis util para build-animation-brief
