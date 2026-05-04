# CSS Animation Mastery

> Dominio completo de CSS animations, transitions, transforms e SVG.

---

## Transforms Performaticos (Compositor Thread)

Apenas estas propriedades rodam na GPU sem triggering layout/paint:
- `transform` (translate, rotate, scale, skew)
- `opacity`
- `filter` (com will-change)

NUNCA animar: `width`, `height`, `top`, `left`, `margin`, `padding`, `border`

---

## Easing Reference

```css
/* Suaves */
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Dramaticos */
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--ease-in-out-back: cubic-bezier(0.68, -0.6, 0.32, 1.6);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Spring-like */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

---

## Patterns Essenciais

### Hover Underline Grow
```css
.link { position: relative; }
.link::after {
  content: '';
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s var(--ease-out-expo);
}
.link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### Card Lift
```css
.card {
  transition: transform 0.3s var(--ease-out-cubic), box-shadow 0.3s var(--ease-out-cubic);
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```

### Staggered Grid Reveal
```css
.grid-item {
  opacity: 0; transform: translateY(40px);
  animation: reveal 0.6s var(--ease-out-quart) forwards;
}
.grid-item:nth-child(1) { animation-delay: 0ms; }
.grid-item:nth-child(2) { animation-delay: 80ms; }
.grid-item:nth-child(3) { animation-delay: 160ms; }
/* ... */

@keyframes reveal {
  to { opacity: 1; transform: translateY(0); }
}
```

### Magnetic Button
```javascript
button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});
button.addEventListener('mouseleave', () => {
  button.style.transform = 'translate(0, 0)';
  button.style.transition = 'transform 0.5s var(--ease-out-expo)';
});
```

### clip-path Reveal
```css
.reveal { clip-path: inset(0 100% 0 0); transition: clip-path 0.8s var(--ease-out-quart); }
.reveal.visible { clip-path: inset(0 0 0 0); }
```

### SVG Stroke Drawing
```css
.svg-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s var(--ease-out-quart) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
```

---

## Acessibilidade

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
