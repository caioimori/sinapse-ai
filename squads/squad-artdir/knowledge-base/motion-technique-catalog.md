# Motion Technique Catalog

> Catalogo completo de tecnicas de motion para art direction.
> Cada tecnica inclui: quando usar, lib recomendada, easing, duracao, performance e principio psicologico.

---

## Categorias de Motion

### 1. Micro-interactions (150-400ms)

Respostas imediatas a acoes do usuario. Devem ser quase imperceptiveis conscientemente, mas sentidas como "responsividade".

| Tecnica | Duracao | Easing | Lib | Trigger | Principio |
|---------|---------|--------|-----|---------|-----------|
| Button hover brighten | 200ms | power2.out | CSS | mouseenter | Feedback (affordance) |
| Button press scale | 100ms | power1.in | CSS | mousedown | Squash & Stretch |
| Button release bounce | 200ms | back.out(1.2) | CSS | mouseup | Follow Through |
| Input focus glow | 200ms | power1.out | CSS | focus | Feedback (state change) |
| Toggle switch | 250ms | back.out(1.4) | GSAP | click | Slow In/Out |
| Checkbox draw | 300ms | power2.out | SVG/CSS | change | Timing (confirmation) |
| Tooltip appear | 200ms | power2.out | CSS | hover 300ms delay | Staging |
| Icon morph | 300ms | power2.inOut | GSAP | state change | Appeal |
| Link underline grow | 200ms | power2.out | CSS | mouseenter | Secondary Action |
| Card hover lift | 250ms | power2.out | CSS | mouseenter | Exaggeration (subtle) |

**Performance:** CSS transitions only. Nenhum JS necessario para micro-interactions basicas.

### 2. Entrance Animations (300-800ms)

Elementos que aparecem no viewport. Devem comunicar "eu cheguei" sem atrasar a leitura.

| Tecnica | Duracao | Easing | Lib | Trigger | Principio |
|---------|---------|--------|-----|---------|-----------|
| Fade in | 400ms | power2.out | CSS/GSAP | scroll enter | Timing (peso minimo) |
| Slide up + fade | 600ms | power3.out | GSAP | scroll enter | Slow In/Out |
| Slide left/right + fade | 600ms | power3.out | GSAP | scroll enter | Staging |
| Scale up + fade | 500ms | power2.out | GSAP | scroll enter | Squash & Stretch |
| Stagger children | 400ms + 80ms stagger | power2.out | GSAP | scroll enter | Follow Through |
| Clip-path reveal | 600ms | power3.out | GSAP | scroll enter | Staging (dramatic) |
| Text split reveal | 800ms | power3.out | GSAP SplitText | scroll enter | Timing + Staging |
| Counter increment | 1000ms | power2.out | GSAP | scroll enter | Anticipation (buildup) |
| Draw SVG path | 800ms | power2.inOut | GSAP DrawSVG | scroll enter | Straight Ahead |
| Blur to sharp | 500ms | power2.out | CSS/GSAP | scroll enter | Staging (focus) |

**Performance:** GSAP ScrollTrigger com `start: "top 80%"` como default trigger. Intersection Observer como fallback.

### 3. Scroll-Driven Animations (Scrubbed)

Animacoes vinculadas ao scroll position. O usuario controla o ritmo — NUNCA auto-play.

| Tecnica | Scrub | Pin | Lib | Principio |
|---------|-------|-----|-----|-----------|
| Parallax layers | true | false | GSAP ScrollTrigger | Depth (Solid Drawing) |
| Pinned section | true | true | GSAP ScrollTrigger | Staging (palco fixo) |
| Frame sequence | true | true | GSAP ScrollTrigger | Cinema (Straight Ahead) |
| Horizontal scroll | true | true | GSAP ScrollTrigger | Staging (direcional) |
| Text scramble on scroll | true | true | GSAP + custom | Anticipation |
| Progress bar | true | false | CSS/JS | Zeigarnik, goal gradient |
| Counter scrub | true | false | GSAP | Anchoring (numeros) |
| Clip-path morph | true | true | GSAP | Staging (reveal) |
| Opacity scrub | true | false | GSAP/CSS | Progressive disclosure |
| Scale scrub | true | false | GSAP | Exaggeration |

**Performance:** `scrub: true` usa `requestAnimationFrame` internamente. `pin: true` usa `position: fixed` — testar em mobile.

### 4. Page Transitions (400-800ms)

Transicoes entre paginas ou views. Devem comunicar continuidade, nao interrupacao.

| Tecnica | Duracao | Easing | Lib | Principio |
|---------|---------|--------|-----|-----------|
| Crossfade | 400ms | power2.inOut | GSAP/Barba | Timing (simples) |
| Slide + fade | 500ms | power2.inOut | GSAP/Barba | Arcs |
| Clip-path wipe | 600ms | power3.inOut | GSAP | Staging (dramatic) |
| Scale out/in | 500ms | power2.inOut | GSAP | Exaggeration |
| Shared element morph | 600ms | power3.out | GSAP FLIP | Continuity |
| View Transitions API | 300ms | ease-in-out | Native | Timing (native) |
| Cover reveal (overlay) | 800ms | power3.inOut | GSAP | Staging |
| Curtain (split) | 600ms | power2.inOut | GSAP | Appeal |

**Performance:** Barba.js para MPA, View Transitions API para suporte nativo, GSAP para SPA custom.

### 5. Ambient/Background (3000ms+)

Motion continuo que cria atmosfera sem demandar atencao. Deve ser percebido subconscientemente.

| Tecnica | Duracao | Loop | Lib | Principio |
|---------|---------|------|-----|-----------|
| Gradient shift | 8-15s | infinite | CSS | Appeal (atmosphere) |
| Noise texture | continuous | infinite | GLSL/Canvas | Appeal (texture) |
| Particle drift | continuous | infinite | Three.js/Canvas | Appeal (life) |
| Floating elements | 5-10s | infinite | CSS/GSAP | Secondary Action |
| Glow pulse | 2-4s | infinite | CSS | Secondary Action |
| Cursor trail | continuous | n/a | JS | Appeal (interactivity) |
| Live clock | 1s interval | infinite | JS | Secondary Action |
| Subtle parallax | continuous | n/a | JS/CSS | Solid Drawing (depth) |

**Performance:** Ambient animations DEVEM rodar em GPU. Testar FPS em mobile. Desativar em `prefers-reduced-motion`.

---

## Easing Reference Completo

### REGRA: Nunca usar `linear` para motion de UI

Linear e aceitavel APENAS para:
- Marquee text (scroll continuo)
- Loading spinner rotation
- Progress bar fill
- Ambient gradient shift

### Easing por Intencao

| Intencao | Easing | CSS cubic-bezier | GSAP |
|----------|--------|-----------------|------|
| Entrada natural | power2.out | (0.22, 1, 0.36, 1) | "power2.out" |
| Entrada dramatica | power3.out | (0.16, 1, 0.3, 1) | "power3.out" |
| Entrada explosiva | expo.out | (0.19, 1, 0.22, 1) | "expo.out" |
| Saida suave | power2.in | (0.55, 0, 1, 0.45) | "power2.in" |
| Saida dramatica | power3.in | (0.7, 0, 0.84, 0) | "power3.in" |
| Transicao equilibrada | power2.inOut | (0.76, 0, 0.24, 1) | "power2.inOut" |
| Transicao dramatica | power3.inOut | (0.85, 0, 0.15, 1) | "power3.inOut" |
| Bounce/overshoot | back.out | (0.34, 1.56, 0.64, 1) | "back.out(1.7)" |
| Elastic | elastic.out | N/A (spring-based) | "elastic.out(1, 0.3)" |
| Suave/ambient | sine.inOut | (0.37, 0, 0.63, 1) | "sine.inOut" |

### Duration Rules

| Categoria | Range | Default |
|-----------|-------|---------|
| Micro (hover, click) | 100-300ms | 200ms |
| Entrance (reveal) | 300-800ms | 500ms |
| Exit (dismiss) | 200-400ms | 300ms |
| Page transition | 400-800ms | 500ms |
| Scroll scrub | viewport-based | N/A |
| Ambient | 3000-15000ms | 8000ms |
| Stagger delay | 30-120ms | 80ms |

---

## Performance Rules

### GPU-Only Properties

| USAR (GPU composited) | NUNCA USAR (layout thrashing) |
|----------------------|------------------------------|
| `transform: translate()` | `top`, `left`, `right`, `bottom` |
| `transform: scale()` | `width`, `height` |
| `transform: rotate()` | `margin`, `padding` |
| `opacity` | `font-size` |
| `filter` (com cuidado) | `border-width` |
| `clip-path` (GPU em browsers modernos) | `box-shadow` (layout em alguns browsers) |

### will-change Strategy

```css
/* Adicionar ANTES da animacao */
.element-about-to-animate {
  will-change: transform, opacity;
}

/* Remover APOS a animacao */
.element-finished-animating {
  will-change: auto;
}

/* NUNCA aplicar globalmente */
* { will-change: transform; } /* PROIBIDO */
```

### Mobile Performance Budget

| Metrica | Budget |
|---------|--------|
| Elementos animados simultaneamente | Max 30 |
| Frame rate minimo | 30fps |
| DOM nodes animados | Max 50 no viewport |
| Texture size (Three.js) | Max 1024x1024 mobile |
| Total JS para animacao | Max 100KB gzipped |

### Intersection Observer Pattern

```javascript
// CORRETO: Intersection Observer para trigger
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateElement(entry.target);
      observer.unobserve(entry.target); // Uma vez
    }
  });
}, { threshold: 0.2 });

// ERRADO: Scroll event listener
window.addEventListener('scroll', () => { /* NUNCA */ });
```

---

## prefers-reduced-motion Strategy

### Abordagem Progressiva

```css
/* Nivel 1: Remover transitions e animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```javascript
// Nivel 2: Desabilitar GSAP ScrollTrigger
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Mostrar todo conteudo sem animacao
  gsap.globalTimeline.clear();
  ScrollTrigger.getAll().forEach(st => st.kill());

  // Conteudo visivel imediatamente
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
```

### Substituicoes

| Com Motion | Sem Motion |
|-----------|-----------|
| Slide + fade entrance | Instant appear (opacity 1) |
| Parallax scroll | Static positioning |
| Frame sequence | First frame static |
| Text scramble | Text static visible |
| Marquee scroll | Static grid of items |
| Custom cursor | System cursor |
| Hover scale | Hover color change |
| Page transition | Instant page swap |
| Loading spinner | "Loading..." text |
| Background particles | Static background |
