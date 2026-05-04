---
task: implement-scroll-animation
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scroll_spec
    tipo: object
    origem: "animation_brief ou motion-choreographer"
    obrigatorio: true

Saida:
  - campo: scroll_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar lib (GSAP ScrollTrigger, CSS scroll-driven, Intersection Observer)"
  - "[ ] Configurar trigger points (start, end)"
  - "[ ] Implementar scrub ou toggle"
  - "[ ] Setup Lenis para smooth scroll se necessario"
  - "[ ] Testar em mobile (touch scroll)"
  - "[ ] Adicionar markers em dev mode"
---

# Task: Implement Scroll Animation

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Implementar animacoes driven por scroll — elementos que animam baseados na posicao de scroll usando GSAP ScrollTrigger, CSS scroll-driven animations ou Intersection Observer. Fundacao de qualquer experiencia scroll-based.

## Pre-Conditions
- Layout HTML com secoes scrollaveis definido
- Tipo de scroll animation (scrub vs toggle vs entrance)
- Lib decision (GSAP ScrollTrigger recomendado para controle fino)
- Smooth scroll strategy (Lenis ou nativo)

## Passos

### 1. Selecionar Approach
| Approach | Quando Usar | Controle |
|----------|-------------|----------|
| GSAP ScrollTrigger | Animacoes complexas, scrub, pin | Total |
| CSS scroll-driven | Simples, entrance, modern browsers | Limitado |
| Intersection Observer | Toggle on viewport entry | On/off |
| CSS animation-timeline: view() | Native scroll-linked | Crescente |

### 2. Setup GSAP ScrollTrigger
```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.to('.element', {
  y: -100,
  opacity: 1,
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',   // trigger top hits 80% viewport
    end: 'bottom 20%',
    scrub: 1,            // smooth scrub (1 second catch-up)
    markers: process.env.NODE_ENV === 'development',
  }
});
```

### 3. Setup Smooth Scroll (Lenis)
```javascript
import Lenis from 'lenis';
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
// Sync with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 4. Implementar Entrance Animation (Toggle)
```javascript
gsap.from('.card', {
  y: 50, opacity: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.cards-section',
    start: 'top 75%',
    toggleActions: 'play none none none', // Enter only, no reverse
  }
});
```

### 5. Implementar Scrub Animation
```javascript
// Animacao vinculada 1:1 ao scroll
gsap.to('.progress-bar', {
  scaleX: 1,
  scrollTrigger: {
    trigger: '.content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true, // Direto, sem smoothing
  }
});
```

### 6. CSS Scroll-Driven (Modern)
```css
.scroll-reveal {
  animation: fade-up linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 7. Intersection Observer Fallback
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

### 8. Mobile Touch Scroll
- Testar com touch events (nao apenas mouse wheel)
- Lenis smooth scroll funciona com touch
- Reduzir animacao em mobile se performance ruim
- Considerar `ScrollTrigger.normalizeScroll(true)` para mobile

### 9. Reduced Motion
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable scroll animations, show everything
  gsap.set('.animate-on-scroll', { opacity: 1, y: 0 });
  ScrollTrigger.getAll().forEach(st => st.kill());
}
```

### 10. Cleanup
```javascript
// Em SPA/React: cleanup ao desmontar
function cleanup() {
  ScrollTrigger.getAll().forEach(st => st.kill());
  lenis?.destroy();
}
```

## Output
- Scroll animations configuradas (GSAP/CSS/IO)
- Smooth scroll setup (Lenis)
- Entrance e scrub animations
- Mobile touch compatibility
- Reduced motion handling
- Cleanup functions para SPA

## Quality Criteria
- [ ] Scroll animations 60fps
- [ ] Touch scroll funciona em mobile
- [ ] Scrub suave (sem jank)
- [ ] Markers removidos em production
- [ ] prefers-reduced-motion respeitado
- [ ] Cleanup em SPA navigation
- [ ] Sem scroll hijacking (usuario mantem controle)
- [ ] Start/end triggers corretos (nao prematuro/tardio)
