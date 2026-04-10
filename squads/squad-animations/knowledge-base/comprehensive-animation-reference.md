# Comprehensive Animation Reference — Deep Dive Companion

> Referencia aprofundada cobrindo todos os dominios de animacao web.
> Complementa as KBs especializadas com contexto mais profundo,
> exemplos de codigo e heuristicas de tomada de decisao.

---

## 1. Disney 12 Principles — Web Quick Guide

### Squash and Stretch
- Button press: `scaleY(0.95) scaleX(1.05)` por 80ms, spring back
- Modal landing: arrive `scaleY(1.05)` -> settle `scaleY(0.97)` -> `scale(1)`

### Anticipation
- Accordion: compress 2-3px por 100ms antes de expandir
- Page transition: scale 0.98, opacity 0.9 por 150ms antes da transicao
- **Regra:** 50-150ms, movimento pequeno

### Staging
- Hero: bg fade 300ms -> headline slide 200ms depois -> subtext 150ms -> CTA ultimo
- Modal: overlay dim 200ms -> modal scale-in 300ms

### Follow-Through
- Cards: stagger 50-80ms entre cada card
- Elastic easing: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` overshoot e settle
- Dragged element: overshoot 5-10%, shadow chega 30ms depois

### Slow In/Slow Out (FUNDAMENTAL)
- **Ease-out** `(0.0, 0.0, 0.2, 1.0)`: Elementos ENTRANDO. Mais usado
- **Ease-in** `(0.4, 0.0, 1, 1)`: Elementos SAINDO
- **Ease-in-out** `(0.4, 0.0, 0.2, 1.0)`: Reposicionando ON SCREEN
- **NUNCA linear** para UI (exceto spinners)

### Arc
- `offset-path: path(...)` ou GSAP MotionPath
- Aproximar: X linear + Y ease-in (parabola)
- Usar para movimentos > 200px

### Timing Quick Ref
- Micro-interactions: 100-200ms
- Small transitions: 200-300ms
- Medium transitions: 300-500ms
- Large transitions: 500-800ms
- Ambient: 2000-8000ms
- **NUNCA > 1000ms** para user-initiated action
- **Mobile:** ~30% mais rapido que desktop

### Exaggeration
- Hover scale: `scale(1.05)` cards, `scale(1.1)` icons (nao 1.01)
- Error shake: 10-15px (nao 2px)
- Banking: 1.02x | Gaming: 1.1x

---

## 2. Psicologia do Motion

### 3-Second Rule
- 0-50ms: Gut reaction visceral
- 50ms-500ms: Loading ou loaded?
- 500ms-1.5s: Hero animation. Cool ou slow?
- 1.5s-3s: Scroll ou leave
- **Golden rule:** Core content visivel em 1.5s

### Continuity Illusion
Transicoes animadas parecem MAIS RAPIDAS que swaps instantaneos (Google research)

### Hierarchy of Motion Attention
1. Large fast center movement (highest)
2. Color/contrast change peripheral (high)
3. Slow continuous movement (medium)
4. Micro-movements subconscious (low)
- **Regra:** Apenas UM elemento high-attention por vez

### Emotional Response

| Speed | Association |
|-------|------------|
| 50-100ms | Snappy, tech-forward |
| 150-250ms | Efficient, professional |
| 300-500ms | Balanced, approachable |
| 600-1000ms | Luxurious, premium |
| 1000ms+ | Ambient, dramatic |

| Direction | Association |
|-----------|------------|
| Bottom to Top | Growth, progress |
| Top to Bottom | Weight, gravity |
| Left to Right | Forward (LTR) |
| Scale up | Importance |
| Scale down | Dismissal |

### Dopamine Loops
- Pull-to-refresh: anticipation -> reward cycle
- Like animations: binary action -> micro-celebration
- Scroll reveals: piece by piece curiosity
- Easter eggs: variable reward discovery

---

## 3. The Vocabulary Gap — Complete Translation Table

| Description | What They Mean | Parameters |
|-------------|---------------|------------|
| Smooth | No jerkiness | ease-out `(0.0, 0, 0.2, 1)`, 300-500ms |
| Snappy | Fast response | strong ease-out, 150-250ms |
| Bouncy | Overshoots target | spring stiffness~300, damping~10-15 |
| Elastic | Overshoots AND oscillates | `elastic.out(1, 0.3)` |
| Elegant | Slow, graceful | ease-in-out, 600-1000ms |
| Dramatic | Large visual change | Scale 0-1 or translateY 100px+, fast |
| Playful | Bounce, energetic | Spring, 200-300ms, random stagger |
| Cinematic | Film-like, depth | 800ms+, camera movement, DOF blur |
| Organic | Natural, imperfect | Perlin noise offsets, +/-15% random |
| Futuristic | Tech-forward | Glitch, clip-path, RGB split, steps |
| Liquid/Fluid | Morphing, flowing | SVG morph, metaball shader |
| Sharp/Crisp | Precise, clean | Linear/slight ease, short, no spring |
| Subtle | Barely noticeable | 2-5px, 0.02 scale, 200-300ms |
| Bold | Confident, visible | 1.2x+ scale, bright, fast |
| Minimalist | Fade and translate | opacity + translateY(20px), 300ms |
| Premium | Controlled, no overshoot | ease-in-out, 500-800ms |
| Aggressive | Hard-hitting | 100-200ms, shake, flash |
| Corporate | Conservative | `(0.4, 0, 0.2, 1)`, 250-350ms |
| Luxurious | Long fade, minimal | `(0.16, 1, 0.3, 1)`, 700-1200ms |

### Brand Archetype Motion Language

| Archetype | Motion Style | Speed |
|-----------|-------------|-------|
| Innovator/Tech | Precise, grid-based, data-driven | Fast |
| Luxury/Premium | Slow, minimal, controlled | Slow |
| Playful/Youth | Bouncy, colorful, energetic | Fast |
| Professional/Trust | Conservative, reliable, subtle | Medium |
| Creative/Art | Experimental, unexpected, bold | Variable |
| Nature/Organic | Flowing, natural, imperfect | Slow-medium |
| Minimal/Clean | Fade-and-slide only, restrained | Medium |

### 10 Clarifying Questions for Vague Requests
1. Mostre 2-3 sites com animacao correta para o projeto
2. De instantaneo a luxuoso, onde deve ficar?
3. Energetico/bouncy ou calmo/controlado?
4. Elementos param preciso ou bounce/settle?
5. Muitas animacoes pequenas ou poucos momentos impactantes?
6. Quao importante e performance mobile?
7. Site de competitor mais proximo? O que mudaria?
8. Se fosse pessoa entrando numa sala, como caminharia?
9. Animacoes toda visita ou so primeira?
10. Mais importante: conteudo rapido ou experiencia completa?

---

## 4. Performance Budgets

| Metric | Desktop | Mobile |
|--------|---------|--------|
| FPS | 60 constante | 30 min, 60 target |
| JS per frame | < 4ms | < 4ms |
| DOM animated | < 20 elements | < 10 elements |
| Draw calls | < 300 | < 100 |
| Texture memory | < 200MB | < 50MB |
| Total 3D weight | < 20MB | < 5MB |
| LCP | < 2.5s | < 2.5s |
| CLS | < 0.1 | < 0.1 |
| INP | < 200ms | < 200ms |

---

## 5. Masters Deep Techniques

### Bruno Simon
- Physics-driven (cannon-es), nao hand-animated
- Baked lighting em Blender, minimal real-time lights
- Low-poly como estrategia de performance E estetica
- Single-Canvas Architecture
- "Se voce fizer alguem JOGAR com seu portfolio, vai lembrar pra sempre"

### Akella (Yuri Artiukh)
- Image displacement com displacement map texture no hover
- Decomposition: reconstruir efeitos complexos passo a passo
- GLSL mastery: UV distortion, channel separation, noise warping
- "Efeitos complexos sao construidos de partes simples"

### Active Theory
- Custom rendering pipelines por projeto
- Shader-first design
- Audio-visual sync com Web Audio API
- "Se alguem diz cool WebGL, percebeu a tech — ideal e sentir a marca"

### Locomotive
- `smoothScroll += (target - smoothScroll) * 0.1`
- Scroll-speed effects: fast scroll = mais parallax, mais skew
- Data-attribute-driven animation
- "Scroll e a interacao mais fundamental"

### Lusion
- Custom pipelines alem do standard Three.js
- Physically-based tudo: camera, atmosfera, particulas
- Loading como cerimonia: preloader e primeiro ato
- "Web 3D deve parecer 3D, ponto"

### Bees and Bombs
- Perfect loops: sin/cos over 2PI
- Parametric equations: posicoes como funcao do tempo
- Staggered repetition: offset de timing
- "Complexidade da simplicidade"

### Resn
- Surprise-driven interaction
- Exaggerated cartoony physics
- Sound as interaction feedback
- "Se o usuario nao esta se divertindo, o site falhou"

---

## 6. GSAP Patterns

### Timeline Architecture
```javascript
const master = gsap.timeline();
const heroTL = gsap.timeline();
heroTL.from(".hero-title", { y: 100, opacity: 0, duration: 0.8 })
      .from(".hero-subtitle", { y: 50, opacity: 0, duration: 0.6 }, "-=0.4");
master.add(heroTL);
```

### ScrollTrigger Pin + Scrub
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".sticky-section",
    start: "top top",
    end: "+=3000",
    scrub: 1,
    pin: true
  }
})
.to(".phone", { rotateY: 360 })
.to(".feature-1", { opacity: 0 }, "<")
.to(".feature-2", { opacity: 1 }, "<");
```

### Grid Stagger
```javascript
gsap.from(".grid-item", {
  opacity: 0, y: 50,
  stagger: { grid: "auto", from: "center", amount: 0.8 }
});
```

### Easing Quick Reference
- `power2.out` — workhorse entrances
- `power2.inOut` — repositioning
- `back.out(1.7)` — playful overshoot
- `elastic.out(1, 0.3)` — bouncy attention
- `expo.out` — luxury dramatic

---

## 7. Easing Functions Reference

```
Linear:         cubic-bezier(0, 0, 1, 1)
Ease-out:       cubic-bezier(0.0, 0.0, 0.2, 1.0)        — Material Design
Ease-in:        cubic-bezier(0.4, 0.0, 1, 1)             — Material Design
Ease-in-out:    cubic-bezier(0.4, 0.0, 0.2, 1.0)         — Material Design
Ease-out-back:  cubic-bezier(0.175, 0.885, 0.32, 1.275)  — Overshoot
Ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1)            — Luxury
Ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1)           — Dramatic
Snappy:         cubic-bezier(0.2, 0, 0, 1)               — Fast tech
```

---

## 8. Accessibility Minimum

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- WCAG 2.3.1: No flash > 3x/segundo
- WCAG 2.3.3: Animation from interactions desabilitavel
- WCAG 2.2.2: Moving content pausavel
- Vestibular: parallax, zoom, rotacao sao mais problematicos
- ~35% adultos > 40 anos tem algum disturbio vestibular
