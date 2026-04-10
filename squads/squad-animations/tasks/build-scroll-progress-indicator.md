---
task: build-scroll-progress-indicator
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: indicator_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: progress_indicator
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tipo (bar, dot, number, custom)"
  - "[ ] Vincular ao scroll progress"
  - "[ ] Posicionar fixed sem obstruir conteudo"
  - "[ ] Animar transicoes entre secoes"
  - "[ ] Estilizar com brand system"
---

# Task: Build Scroll Progress Indicator

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Criar indicadores de progresso de scroll — barras, dots, numeros ou custom visualizations que mostram ao usuario onde ele esta na pagina. Deve ser visualmente integrado, nao obstrutivo e acessivel.

## Pre-Conditions
- Tipo de indicator definido no brief
- Secoes/capitulos mapeados
- Brand colors disponveis
- Posicionamento definido (top, side, bottom)

## Passos

### 1. Selecionar Tipo
| Tipo | Melhor Para | Posicao |
|------|-------------|---------|
| Top bar | Blog, artigo, leitura | Top fixed |
| Side dots | Scroll storytelling, multi-section | Right fixed |
| Number/fraction | Portfolios, galerias | Corner |
| Circular | Single-page, loading | Corner |
| Custom SVG | Branded, creative | Varies |

### 2. Implementar Top Progress Bar
```html
<div class="scroll-progress-bar" aria-hidden="true"></div>
```
```css
.scroll-progress-bar {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left;
  z-index: 9999;
}
```
```javascript
gsap.to('.scroll-progress-bar', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
  }
});
```

### 3. Implementar Side Dots
```html
<nav class="scroll-dots" aria-label="Section navigation">
  <button class="dot active" data-section="0" aria-label="Section 1"></button>
  <button class="dot" data-section="1" aria-label="Section 2"></button>
  <button class="dot" data-section="2" aria-label="Section 3"></button>
</nav>
```
```css
.scroll-dots {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--color-text-muted);
  transition: background 200ms ease, transform 200ms ease;
}
.dot.active {
  background: var(--color-primary);
  transform: scale(1.4);
}
```

### 4. Sync Dots com ScrollTrigger
```javascript
sections.forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveDot(i),
    onEnterBack: () => setActiveDot(i),
  });
});
function setActiveDot(index) {
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}
```

### 5. Click-to-Navigate nos Dots
```javascript
dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.section);
    gsap.to(window, {
      scrollTo: sections[index],
      duration: 0.8,
      ease: 'power2.inOut',
    });
  });
});
```

### 6. Fraction/Number Indicator
```javascript
const counter = document.querySelector('.section-counter');
sections.forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    onEnter: () => {
      counter.textContent = `${i + 1} / ${sections.length}`;
    },
    onEnterBack: () => {
      counter.textContent = `${i + 1} / ${sections.length}`;
    },
  });
});
```

### 7. Circular Progress
```html
<svg class="circular-progress" viewBox="0 0 36 36">
  <circle class="bg" cx="18" cy="18" r="15.9" />
  <circle class="progress" cx="18" cy="18" r="15.9"
    stroke-dasharray="100" stroke-dashoffset="100" />
</svg>
```
```javascript
gsap.to('.circular-progress .progress', {
  strokeDashoffset: 0,
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true },
});
```

### 8. Acessibilidade
- `aria-label` em dots/buttons
- `aria-hidden="true"` em decorative progress bars
- Dots sao `<button>` focusable
- Keyboard navigation entre dots

### 9. Responsive Positioning
```css
@media (max-width: 768px) {
  .scroll-dots {
    right: 8px;
    gap: 8px;
  }
  .dot { width: 8px; height: 8px; }
}
```

### 10. Hide When Not Needed
```javascript
// Esconder em paginas curtas
if (document.body.scrollHeight <= window.innerHeight * 1.5) {
  document.querySelector('.scroll-progress-bar').style.display = 'none';
}
```

## Output
- Scroll progress indicator (tipo escolhido)
- ScrollTrigger sync
- Click-to-navigate se dots
- Responsive positioning
- Accessible markup
- Auto-hide para paginas curtas

## Quality Criteria
- [ ] Sincronizado precisamente com scroll position
- [ ] Nao obstrui conteudo principal
- [ ] Dots clickable e keyboard-accessible
- [ ] Responsive em mobile
- [ ] Brand colors aplicados
- [ ] Transicoes suaves entre secoes
- [ ] aria-label em elementos interativos
- [ ] Hidden em paginas que nao precisam
