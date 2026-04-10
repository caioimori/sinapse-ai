---
task: build-parallax-effect
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: parallax_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: parallax_effect
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Definir layers com velocidades diferentes"
  - "[ ] Implementar com transform: translateY (GPU)"
  - "[ ] Configurar depth ratios por layer"
  - "[ ] Testar suavidade do efeito"
  - "[ ] Desabilitar em mobile se performance ruim"
---

# Task: Build Parallax Effect

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar efeitos parallax — layers que se movem em velocidades diferentes durante scroll, criando ilusao de profundidade. Implementar com transforms GPU-accelerated para performance maxima.

## Pre-Conditions
- Layout com elementos em diferentes "profundidades" definido
- Numero de layers e speed ratios planejados
- Performance budget (parallax e CPU/GPU intensive em mobile)
- Decision: desabilitar em mobile ou simplificar

## Passos

### 1. Definir Parallax Layers
| Layer | Speed Ratio | Exemplo |
|-------|-------------|---------|
| Background | 0.2 (mais lento) | Background image, sky |
| Mid-back | 0.5 | Decorative elements |
| Content | 1.0 (normal) | Main content |
| Foreground | 1.3 (mais rapido) | Overlapping elements |

### 2. Implementar com GSAP ScrollTrigger
```javascript
gsap.to('.parallax-bg', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});
gsap.to('.parallax-fg', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});
```

### 3. CSS Puro (scroll-driven)
```css
.parallax-layer {
  animation: parallax-shift linear;
  animation-timeline: scroll();
}
@keyframes parallax-shift {
  from { transform: translateY(0); }
  to { transform: translateY(calc(var(--parallax-speed) * -100px)); }
}
.layer-slow { --parallax-speed: 0.3; }
.layer-fast { --parallax-speed: 0.8; }
```

### 4. Multi-Layer Setup HTML
```html
<section class="parallax-container">
  <div class="parallax-layer layer-bg" data-speed="0.2">
    <img src="bg.jpg" alt="">
  </div>
  <div class="parallax-layer layer-content" data-speed="1.0">
    <h1>Content</h1>
  </div>
  <div class="parallax-layer layer-fg" data-speed="1.5">
    <div class="decorative"></div>
  </div>
</section>
```

### 5. Implementar Mouse Parallax (Bonus)
```javascript
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  layers.forEach((layer) => {
    const speed = layer.dataset.speed;
    gsap.to(layer, {
      x: x * speed * 20,
      y: y * speed * 20,
      duration: 0.8,
      ease: 'power2.out',
    });
  });
});
```

### 6. Overflow e Clipping
```css
.parallax-container {
  overflow: hidden; /* Esconder layers que saem do container */
  position: relative;
}
.parallax-layer {
  position: absolute;
  inset: -20%; /* Extra space para parallax movement */
  will-change: transform;
}
```

### 7. Images com Object-Fit
```css
.parallax-layer img {
  width: 100%;
  height: 120%; /* Extra para cobrir durante parallax */
  object-fit: cover;
}
```

### 8. Mobile Strategy
```javascript
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) {
  // Option 1: Disable parallax
  gsap.set('.parallax-layer', { clearProps: 'all' });
  // Option 2: Reduce intensity
  parallaxSpeed *= 0.3;
}
```

### 9. Reduced Motion
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable all parallax
  document.querySelectorAll('.parallax-layer').forEach(el => {
    el.style.transform = 'none';
  });
}
```

### 10. Performance Optimization
- Usar APENAS `transform: translateY()` (composite property)
- `will-change: transform` nos parallax layers
- Limit to 3-4 layers maximum
- Throttle scroll handler com rAF se custom JS

## Output
- Parallax effect com layers configuradas
- Speed ratios documentados
- Mobile strategy (disable ou reduce)
- Mouse parallax se solicitado
- Overflow handling
- Reduced motion alternative

## Quality Criteria
- [ ] Scroll parallax 60fps
- [ ] Apenas transforms (sem top/left/margin)
- [ ] Overflow hidden previne layers visiveis fora
- [ ] Mobile: desabilitado ou reduzido
- [ ] prefers-reduced-motion: parallax desativado
- [ ] Layers nao criam gap visivel durante scroll
- [ ] Max 4 parallax layers
- [ ] Images com extra height para cobrir movimento
