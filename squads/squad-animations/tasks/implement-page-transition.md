---
task: implement-page-transition
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: transition_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: page_transition
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar lib (Barba.js, Swup, View Transitions API)"
  - "[ ] Implementar animacao de saida (leave)"
  - "[ ] Implementar animacao de entrada (enter)"
  - "[ ] Configurar shared elements se necessario"
  - "[ ] Garantir cleanup de ScrollTrigger entre paginas"
  - "[ ] Testar navegacao back/forward"
---

# Task: Implement Page Transition

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Implementar transicoes entre paginas — animacoes de saida e entrada que criam continuidade durante navegacao. Usar View Transitions API, Barba.js ou Swup dependendo do stack.

## Pre-Conditions
- Framework/stack definido (MPA, SPA, Next.js)
- Tipo de transicao desejado (fade, slide, morph, overlay)
- Shared elements identificados (se houver)
- ScrollTrigger cleanup strategy

## Passos

### 1. Selecionar Approach
| Stack | Approach | Lib |
|-------|----------|-----|
| MPA (multi-page) | View Transitions API | Nativo |
| MPA + fallback | Barba.js | barba.js |
| SPA (React) | Framer Motion AnimatePresence | framer-motion |
| SPA (Next.js) | App Router + View Transitions | Nativo |
| SPA (generic) | Swup | swup |

### 2. View Transitions API (Modern)
```javascript
// Interceptar navegacao
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link || link.origin !== location.origin) return;
  e.preventDefault();
  if (!document.startViewTransition) {
    location.href = link.href;
    return;
  }
  document.startViewTransition(async () => {
    const response = await fetch(link.href);
    const html = await response.text();
    document.documentElement.innerHTML = html;
  });
});
```

### 3. CSS para View Transitions
```css
::view-transition-old(root) {
  animation: fade-out 200ms ease-in;
}
::view-transition-new(root) {
  animation: fade-in 300ms ease-out;
}
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
```

### 4. Shared Element Transitions
```css
/* Page A */
.product-card { view-transition-name: product-hero; }
/* Page B */
.product-detail-image { view-transition-name: product-hero; }
/* Transition */
::view-transition-group(product-hero) {
  animation-duration: 400ms;
}
```

### 5. Barba.js Setup
```javascript
import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [{
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0, y: -20, duration: 0.3,
      });
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0, y: 20, duration: 0.4,
      });
    },
  }],
});
```

### 6. ScrollTrigger Cleanup entre Paginas
```javascript
barba.hooks.beforeLeave(() => {
  ScrollTrigger.getAll().forEach(st => st.kill());
  lenis?.destroy();
});
barba.hooks.afterEnter(() => {
  ScrollTrigger.refresh();
  // Re-initialize scroll animations for new page
  initScrollAnimations();
});
```

### 7. Overlay Transition Pattern
```javascript
// Overlay que cobre, troca conteudo, revela
barba.init({
  transitions: [{
    async leave() {
      await gsap.to('.transition-overlay', {
        scaleY: 1, transformOrigin: 'bottom', duration: 0.4,
      });
    },
    async enter() {
      await gsap.to('.transition-overlay', {
        scaleY: 0, transformOrigin: 'top', duration: 0.4, delay: 0.1,
      });
    },
  }],
});
```

### 8. Loading State During Transition
```javascript
barba.hooks.before(() => {
  document.body.classList.add('is-transitioning');
});
barba.hooks.after(() => {
  document.body.classList.remove('is-transitioning');
});
```

### 9. Back/Forward Navigation
- View Transitions API: handled automatically by browser
- Barba.js: `barba.history` tracks navigation
- Testar: transicao deve funcionar em ambas direcoes
- Scroll position: restaurar ao voltar

### 10. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

## Output
- Page transition implementation (View Transitions/Barba/Swup)
- Leave e enter animations
- Shared element transitions se aplicavel
- ScrollTrigger cleanup hooks
- Overlay transition se solicitado
- Reduced motion fallback

## Quality Criteria
- [ ] Transicao suave sem flash de conteudo
- [ ] ScrollTrigger cleanup entre paginas
- [ ] Back/forward navigation funciona
- [ ] Shared elements morph corretamente
- [ ] Loading state se transicao demora
- [ ] prefers-reduced-motion: instant swap
- [ ] Scroll position restaurada em back
- [ ] 60fps durante transicao
