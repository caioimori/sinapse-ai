---
task: implement-layout-animation
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: layout_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: layout_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Implementar com FLIP technique ou View Transitions API"
  - "[ ] Animar layout changes sem reflow (transform only)"
  - "[ ] Configurar shared element transitions"
  - "[ ] Testar com conteudo dinamico"
  - "[ ] Fallback para browsers sem suporte"
---

# Task: Implement Layout Animation

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Animar mudancas de layout — reordenacao de listas, grid changes, expand/collapse, shared element transitions entre estados. Usar FLIP technique ou View Transitions API para performance maxima.

## Pre-Conditions
- Estados de layout (before/after) definidos
- Tipo de mudanca: reorder, add/remove, expand/collapse, navigate
- Framework context (React, vanilla, Next.js)
- Browser targets definidos (View Transitions support)

## Passos

### 1. Classificar Layout Change
| Tipo | Tecnica | Exemplo |
|------|---------|---------|
| Reorder | FLIP | Sortable list, filter grid |
| Add/Remove | AnimatePresence/FLIP | Item add to cart, dismiss |
| Expand/Collapse | height auto animation | Accordion, details |
| Shared element | View Transitions API | Card to detail page |
| Grid resize | FLIP on children | Filter category change |

### 2. Implementar FLIP Technique
```javascript
// First: capture initial position
const first = element.getBoundingClientRect();

// (execute DOM change here)

// Last: capture final position
const last = element.getBoundingClientRect();

// Invert: calculate difference
const dx = first.left - last.left;
const dy = first.top - last.top;
const sw = first.width / last.width;
const sh = first.height / last.height;

// Play: animate from inverted to final
element.style.transform = `translate(${dx}px, ${dy}px) scale(${sw}, ${sh})`;
requestAnimationFrame(() => {
  element.style.transition = 'transform 300ms ease-out';
  element.style.transform = '';
});
```

### 3. Implementar View Transitions API
```javascript
if (document.startViewTransition) {
  document.startViewTransition(() => {
    updateDOM(); // Your DOM change
  });
} else {
  updateDOM(); // Fallback: instant
}
```
```css
::view-transition-old(root) {
  animation: fade-out 200ms ease;
}
::view-transition-new(root) {
  animation: fade-in 300ms ease;
}
```

### 4. Shared Element com view-transition-name
```css
.card-image { view-transition-name: hero-image; }
.detail-image { view-transition-name: hero-image; }

::view-transition-old(hero-image),
::view-transition-new(hero-image) {
  animation-duration: 400ms;
}
```

### 5. Animar Height Auto
```css
.expandable {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease;
}
.expandable.open {
  grid-template-rows: 1fr;
}
.expandable > .content {
  overflow: hidden;
}
```

### 6. React: Framer Motion Layout
```jsx
<motion.div layout layoutId="card-1">
  {/* Content */}
</motion.div>
```
- `layout` para auto FLIP
- `layoutId` para shared element entre componentes

### 7. List Reorder Animation
```javascript
// FLIP all children when list order changes
function animateListReorder(container) {
  const children = [...container.children];
  const firstRects = children.map(c => c.getBoundingClientRect());

  // (re-sort DOM here)

  children.forEach((child, i) => {
    const last = child.getBoundingClientRect();
    const dx = firstRects[i].left - last.left;
    const dy = firstRects[i].top - last.top;
    child.animate([
      { transform: `translate(${dx}px, ${dy}px)` },
      { transform: '' }
    ], { duration: 300, easing: 'ease-out' });
  });
}
```

### 8. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
  .expandable { transition: none; }
}
```

### 9. Fallback Strategy
| Feature | Suporte | Fallback |
|---------|---------|----------|
| View Transitions API | Chrome 111+ | Instant DOM swap |
| FLIP technique | Universal | N/A (JS-based) |
| grid-template-rows 0fr | Modern browsers | JS height calc |
| Web Animations API | Wide | element.style + rAF |

### 10. Performance Guardrails
- FLIP deve completar calculo em < 1 frame (16ms)
- Nao animar mais de 20 items simultaneamente
- Usar `contain: layout` em containers de animacao
- Cancelar animacoes em andamento antes de iniciar novas

## Output
- Implementacao FLIP e/ou View Transitions
- Shared element transition setup
- Height auto animation
- React/framework integration se aplicavel
- Fallback para browsers sem suporte
- Demo HTML com layout change animado

## Quality Criteria
- [ ] Layout changes animados sem reflow visible
- [ ] FLIP calcula em < 16ms
- [ ] View Transitions graceful fallback
- [ ] Height auto funciona sem JS
- [ ] Reduced motion: instant transitions
- [ ] 60fps durante reorder/expand
- [ ] Sem CLS causado por animacao
- [ ] Cancelamento limpo de animacoes interrompidas
