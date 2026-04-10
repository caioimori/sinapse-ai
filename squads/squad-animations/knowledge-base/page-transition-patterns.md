# Page Transition Patterns

> Transicoes de pagina que eliminam o flash branco e criam experiencia fluida.

---

## Ferramentas

| Ferramenta | Abordagem |
|-----------|-----------|
| Barba.js | Intercepta links, AJAX fetch, anima entre paginas |
| Swup | Similar ao Barba, API mais simples |
| View Transitions API | Nativa do browser (Chrome 111+) |
| Custom (SPA) | React Router + AnimatePresence / GSAP |

---

## Padroes de Transicao

### 1. Fade Crossfade
```javascript
// Barba.js
barba.init({
  transitions: [{
    leave: ({ current }) => gsap.to(current.container, { opacity: 0, duration: 0.4 }),
    enter: ({ next }) => gsap.from(next.container, { opacity: 0, duration: 0.4 }),
  }]
});
```

### 2. Curtain Wipe
```css
.transition-curtain {
  position: fixed; inset: 0;
  background: #000;
  transform: scaleY(0);
  transform-origin: bottom;
}
/* Leave: scaleY(0) → scaleY(1) from bottom
   Enter: scaleY(1) → scaleY(0) from top */
```

### 3. Slide Lateral
```javascript
leave: ({ current }) => gsap.to(current.container, { x: '-100%', duration: 0.5 }),
enter: ({ next }) => gsap.from(next.container, { x: '100%', duration: 0.5 }),
```

### 4. Circular Reveal
```css
.transition-circle {
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 0.8s var(--ease-out-quart);
}
.transition-circle.active {
  clip-path: circle(150% at 50% 50%);
}
```

### 5. Shared Element (Morph)
```javascript
// View Transitions API (nativo)
document.startViewTransition(() => {
  // Update DOM
  updateContent(newPage);
});

// CSS
.hero-image { view-transition-name: hero; }
::view-transition-old(hero) { animation: fade-out 0.3s; }
::view-transition-new(hero) { animation: fade-in 0.3s; }
```

### 6. Staggered Exit/Enter
```javascript
leave: ({ current }) => {
  const items = current.container.querySelectorAll('.animate-out');
  return gsap.to(items, { y: -30, opacity: 0, stagger: 0.05, duration: 0.3 });
},
enter: ({ next }) => {
  const items = next.container.querySelectorAll('.animate-in');
  return gsap.from(items, { y: 30, opacity: 0, stagger: 0.05, duration: 0.4 });
}
```

---

## Regras

1. **Max 800ms total** — Transicoes longas irritam
2. **Preload next page** — Fetch durante animacao de saida
3. **Scroll to top** — Resetar scroll na nova pagina
4. **Reinit scripts** — Re-executar JS da nova pagina (ScrollTrigger.refresh)
5. **Loading fallback** — Se pagina demora, mostrar loading state
6. **Back button** — Transicao reversa para navegacao de volta
