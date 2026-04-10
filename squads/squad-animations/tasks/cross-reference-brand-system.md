---
task: cross-reference-brand-system
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: brand_guidelines
    tipo: document
    origem: "brand system, briefing do site"
    obrigatorio: true

Saida:
  - campo: brand_animation_context
    tipo: object
    destino: "build-animation-brief"

Checklist:
  - "[ ] Extrair paleta de cores → cores para particulas, gradients, luzes"
  - "[ ] Mapear personalidade da marca → estilo de motion"
  - "[ ] Traduzir valores → principios de animacao"
  - "[ ] Identificar tipografia → abordagem de text animation"
  - "[ ] Gerar contexto de animacao alinhado a marca"
---

# Task: Cross-Reference Brand System

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Traduzir brand system (cores, personalidade, valores, tipografia) em parametros de animacao concretos. Garantir que toda animacao do projeto reflete a identidade visual e emocional da marca.

## Pre-Conditions
- Brand guidelines disponiveis (documento, brand book, ou briefing)
- Paleta de cores definida (primaria, secundaria, neutros)
- Personalidade da marca descrita (adjetivos, arquetipo)
- Tipografia selecionada (familias, pesos)

## Passos

### 1. Extrair Paleta de Cores para Animacao
| Brand Color | Uso em Animacao |
|-------------|----------------|
| Primary | Particulas primarias, glow, accent animations |
| Secondary | Gradients, secondary elements, hover states |
| Background | Scene background, fog, ambient light |
| Accent | Highlights, interactive feedback, CTA pulse |
| Neutral/dark | Shadows, text, subtle elements |
| Neutral/light | Glow, soft particles, blur overlays |

```yaml
animation_colors:
  particles_primary: "#brand-primary"
  particles_secondary: "#brand-secondary"
  glow_color: "#brand-accent"
  gradient: ["#brand-primary", "#brand-secondary"]
  three_js:
    ambient_light: "#brand-neutral-light"
    point_light: "#brand-accent"
    fog_color: "#brand-background"
```

### 2. Mapear Personalidade da Marca para Motion Style
| Personalidade | Motion Style | Duration | Easing | Movement |
|---------------|-------------|----------|--------|----------|
| Sofisticada | Contido, elegante | 400-800ms | ease-decelerate | Minimal, precise |
| Energetica | Bold, snappy | 150-300ms | back.out | Large, bouncy |
| Confiavel | Consistente, previsivel | 300-500ms | ease-standard | Smooth, steady |
| Inovadora | Experimental, bold | 200-600ms | custom spring | Unconventional |
| Acolhedora | Suave, warm | 400-600ms | ease-decelerate | Gentle, organic |
| Profissional | Clean, minimal | 200-400ms | ease-standard | Subtle, functional |
| Luxuosa | Slow, dramatic | 600-1000ms | ease-decelerate | Cinematic, layered |
| Rebelde | Aggressive, unexpected | 100-300ms | power4.out | Sharp, glitch |

### 3. Traduzir Valores da Marca para Principios de Animacao
| Valor da Marca | Principio de Animacao | Implementacao |
|----------------|----------------------|---------------|
| Transparencia | Animacoes claras, sem surpresas | ease-out consistente, no randomness |
| Inovacao | Tecnicas modernas, efeitos custom | Shaders, particles, ScrollTrigger |
| Sustentabilidade | Animacoes leves, low-energy | CSS-first, minimal JS, green coding |
| Velocidade | Rapido, sem espera | Duration < 300ms, no blocking |
| Qualidade | Polished, refinado | Disney principles, 60fps, attention to detail |
| Simplicidade | Minimal, clean | Fade-only, no complex transforms |
| Humanidade | Organic, imperfeito | Spring easing, slight overshoot, natural |

### 4. Mapear Tipografia para Text Animation
| Tipo de Fonte | Animation Approach | Tecnica |
|---------------|-------------------|---------|
| Serif classica | Reveal letra por letra, elegante | SplitType + clip-path reveal |
| Sans-serif moderna | Slide-in rapido, fade | translateX + opacity |
| Display/decorativa | Morphing, scale dramático | Scale entrance, stagger chars |
| Monospace | Typewriter, terminal | Char-by-char com cursor |
| Handwritten | Drawing/stroke animation | SVG stroke-dashoffset |

```yaml
text_animation:
  headline_font: "Playfair Display" # Serif
  headline_approach: "char-reveal, stagger 30ms, clip-path"
  body_font: "Inter" # Sans-serif
  body_approach: "fade-in, line-by-line, 200ms"
```

### 5. Analisar Arquetipo da Marca
| Arquetipo | Motion Personality | Exemplos |
|-----------|-------------------|----------|
| Heroi | Bold, impactful, confident | Nike — strong transitions |
| Mago | Transformative, magical | Disney — morph, sparkle |
| Sabio | Clean, structured, precise | Google — material design motion |
| Explorador | Dynamic, adventurous | Patagonia — parallax, nature |
| Criador | Creative, expressive | Adobe — colorful, experimental |
| Cuidador | Gentle, warm, reassuring | Health brands — soft fade, calm |
| Rebelde | Disruptive, edgy, raw | Punk brands — glitch, shake |
| Amante | Sensual, smooth, flowing | Luxury — slow reveals, golden |

### 6. Definir Color Animation Guidelines
```yaml
color_rules:
  gradients:
    allowed_pairs: [["primary", "secondary"], ["primary", "accent"]]
    angle: 135  # Diagonal
    animation: "hue-shift 10deg over 5s, loop"
  particles:
    base_color: "primary"
    variation: "hue +-15deg, saturation +-10%"
  glow:
    color: "accent"
    intensity: 0.3  # Subtle
    radius: "20-40px"
  dark_mode:
    adjust: "increase luminance 10%, reduce saturation 20%"
```

### 7. Definir Photography/Image Style Impact
| Image Style | Animation Impact |
|-------------|-----------------|
| Minimalist, lots of white | Subtle animations, fade-only |
| Bold, saturated colors | Stronger motion, color shifts |
| Photography-heavy | Ken Burns, parallax, reveal |
| Illustration-heavy | Character animation, SVG morph |
| Abstract/geometric | Geometric transitions, grid |

### 8. Gerar Motion Personality Document
```yaml
motion_personality:
  name: "Confident Clarity"
  description: "Animations are purposeful and precise. Movement feels confident
    but never aggressive. Transitions guide the user with clarity."
  do:
    - "Use ease-decelerate for all entrances"
    - "Keep durations between 300-600ms"
    - "Stagger elements to create reading order"
    - "Use brand primary for accent animations"
  dont:
    - "Never use bounce or elastic easing"
    - "Never exceed 800ms for any single animation"
    - "Never animate more than 3 properties simultaneously"
    - "Never use random or chaotic motion"
```

### 9. Criar Color Token Mapping
```css
/* Animation-specific color tokens derived from brand */
:root {
  --anim-primary: var(--brand-primary);
  --anim-secondary: var(--brand-secondary);
  --anim-glow: var(--brand-accent);
  --anim-particle: var(--brand-primary);
  --anim-bg-gradient-start: var(--brand-primary);
  --anim-bg-gradient-end: var(--brand-secondary);
  --anim-text-reveal: var(--brand-primary);
  --anim-shadow: rgba(var(--brand-primary-rgb), 0.2);
}
```

### 10. Validar Coerencia e Entregar
- Verificar que motion personality nao contradiz brand personality
- Confirmar que cores de animacao sao acessiveis (contrast ratios)
- Testar combinacoes de cor em dark mode e light mode
- Entregar brand_animation_context para build-animation-brief

## Output
- Brand animation context completo
- Paleta de cores mapeada para usos em animacao
- Motion personality derivada da personalidade da marca
- Text animation approach por tipo de fonte
- Do/Dont list alinhado com valores da marca
- Color token mapping (CSS custom properties)
- Arquetipo de motion identificado
- Guidelines de uso de cor em animacoes

## Quality Criteria
- [ ] Cores da marca mapeadas para usos de animacao especificos
- [ ] Personalidade da marca traduzida em motion style
- [ ] Valores da marca refletidos em principios de animacao
- [ ] Tipografia mapeada para approach de text animation
- [ ] Do/Dont list coerente e acionavel
- [ ] Color tokens exportados (CSS custom properties)
- [ ] Sem contradicoes entre brand e motion personality
- [ ] Testado em dark mode e light mode
