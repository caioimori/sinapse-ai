---
task: extract-animation-intent
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: user_input
    tipo: string
    origem: "prompt ou briefing do usuario"
    obrigatorio: true

Saida:
  - campo: animation_intent
    tipo: object
    destino: "build-animation-brief"

Checklist:
  - "[ ] Identificar tipo de animacao"
  - "[ ] Identificar elemento alvo"
  - "[ ] Extrair sentimento desejado"
  - "[ ] Detectar referencias implicitas"
  - "[ ] Classificar complexidade"
---

# Task: Extract Animation Intent

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Analisar input textual do usuario e extrair intent estruturado — tipo de animacao, elemento alvo, sentimento desejado, referencias implicitas e complexidade. Este e o primeiro passo do pipeline de interpretacao.

## Pre-Conditions
- Input do usuario disponivel (pode ser vago ou detalhado)
- Vocabulario de motion do projeto (se ja gerado)
- Contexto do site/projeto (se disponivel)

## Passos

### 1. Parsear Input por Categorias
```yaml
# Input: "quero uma hero section com parallax que parece Apple, bem premium e cinematico"
parsed:
  raw: "quero uma hero section com parallax que parece Apple, bem premium e cinematico"
  segments:
    - { text: "hero section", category: "element" }
    - { text: "parallax", category: "technique" }
    - { text: "parece Apple", category: "reference" }
    - { text: "premium", category: "feeling" }
    - { text: "cinematico", category: "feeling" }
```

### 2. Identificar Tipo de Animacao
| Keywords no Input | Tipo Inferido |
|-------------------|---------------|
| scroll, parallax, reveal, pin | scroll-driven |
| hover, click, press, toggle | interaction |
| load, entrance, fade in, appear | entrance |
| transition, page, route, navigate | page-transition |
| 3D, rotate, orbit, scene | threejs |
| particles, stars, confetti, snow | particle-system |
| background, ambient, loop, continuous | ambient |
| text, headline, title, words | text-animation |
| shader, distortion, glitch, effect | shader |
| morph, transform, shape | shape-morph |

### 3. Identificar Elemento Alvo
| Keywords | Elemento |
|----------|----------|
| hero, banner, header, top | hero-section |
| card, grid, list, item | card-component |
| modal, popup, dialog, overlay | modal |
| nav, menu, hamburger, sidebar | navigation |
| button, CTA, link, action | button |
| footer, bottom | footer |
| section, block, container | generic-section |
| background, backdrop, behind | background |
| text, headline, title, paragraph | text-element |
| image, photo, gallery | image-element |

### 4. Extrair Sentimento (Feeling)
| Sinonimos do Usuario | Feeling Normalizado |
|---------------------|-------------------|
| bonito, elegante, sofisticado, chique | premium |
| rapido, energetico, snappy, punchy | energetico |
| suave, smooth, fluido, delicado | suave |
| cinematico, filme, dramatico, epic | cinematico |
| divertido, playful, bounce, fun | playful |
| limpo, clean, minimalista, sutil | minimalista |
| futurista, tech, cyber, digital | futurista |
| organico, natural, vivo, breathing | organico |
| agressivo, bold, impactante, strong | bold |
| misterioso, dark, moody, ethereal | misterioso |

### 5. Detectar Referencias Implicitas
| Referencia Mencionada | Site/Efeito Provavel |
|----------------------|---------------------|
| "tipo Apple" | apple.com — scroll-driven, product reveal |
| "estilo Stripe" | stripe.com — gradient mesh, subtle parallax |
| "como Awwwards" | Award-winning — complex scroll, transitions |
| "estilo Nike" | nike.com — bold typography, video bg |
| "tipo Vercel" | vercel.com — dark mode, code animations |
| "minimalista japones" | muji-like — white space, subtle fade |

### 6. Classificar Complexidade
| Fator | LOW (1) | MEDIUM (2) | HIGH (3) | CRITICAL (4) |
|-------|---------|-----------|----------|-------------|
| Tecnicas | 1 CSS | 2-3 CSS/GSAP | GSAP + scroll | Three.js + shaders |
| Elementos | 1-2 | 3-5 | 5-10 | 10+ ou full page |
| Interacao | Nenhuma | Hover | Scroll + click | Multi-input |
| Custom code | Template | Parametrizado | Custom logic | Custom shader |
| Dependencies | 0 | 1-2 tasks | 3-5 tasks | 5+ tasks, pipeline |

### 7. Identificar Constraints Implicitos
- "rapido" → performance-first, lightweight approach
- "mobile" → touch-friendly, reduced complexity
- "acessivel" → prefers-reduced-motion, WCAG compliance
- "leve" → no heavy libraries, CSS-first
- "sem jQuery" → modern approach only
- "React/Next.js" → Framer Motion ou GSAP with React

### 8. Detectar Anti-Patterns (O Que NAO Querem)
| Frase do Usuario | Anti-Pattern Detectado |
|-----------------|---------------------|
| "nada exagerado" | Avoid bounce, overshoot, large scale |
| "nao quero email marketing" | Avoid slide > 100px, slow fade |
| "sem distracao" | Subtle only, no attention-grabbing |
| "nao pode ser lento" | Duration < 400ms, snappy |
| "nada infantil" | No wobble, no cartoon easing |

### 9. Gerar Intent Object
```yaml
intent:
  type: scroll-driven
  element: hero-section
  feeling: [cinematico, premium]
  reference: "apple.com/iphone"
  anti_patterns: ["nao exagerado"]
  constraints: [mobile-friendly, 60fps]
  complexity: HIGH
  industry: fintech
  estimated_tasks: 3
  estimated_agents: [scroll-narrative-engineer, motion-choreographer]
  confidence: 0.85  # How confident in interpretation
```

### 10. Validar Intent e Passar Adiante
- Se confidence < 0.6: fazer 1 pergunta clarificadora
- Se confidence >= 0.6: propor interpretacao e prosseguir
- Passar intent para build-animation-brief
- Se referencia detectada: trigger analyze-reference-animation em paralelo

## Output
- Animation intent object estruturado
- Tipo de animacao classificado
- Elemento alvo identificado
- Feelings normalizados (mapeados para vocabulario padrao)
- Referencias identificadas (implicitas e explicitas)
- Complexidade classificada (LOW/MEDIUM/HIGH/CRITICAL)
- Constraints e anti-patterns extraidos
- Confidence score da interpretacao

## Quality Criteria
- [ ] Tipo de animacao identificado corretamente
- [ ] Elemento alvo extraido do input
- [ ] Feelings normalizados (nao raw do usuario)
- [ ] Referencias implicitas detectadas
- [ ] Complexidade classificada com justificativa
- [ ] Anti-patterns identificados (se mencionados)
- [ ] Confidence score realista
- [ ] Intent passavel para build-animation-brief sem ambiguidade
