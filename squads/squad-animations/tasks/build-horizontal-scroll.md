---
task: build-horizontal-scroll
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: horizontal_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: horizontal_scroll
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Configurar container com overflow e pin"
  - "[ ] Mapear scroll vertical para translateX horizontal"
  - "[ ] Calcular scroll distance baseado no conteudo"
  - "[ ] Adicionar snap points se necessario"
  - "[ ] Testar em touch devices"
---

# Task: Build Horizontal Scroll

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar secoes de horizontal scroll — scroll vertical mapeado para movimento horizontal de conteudo. Usado para portfolios, timelines, product showcases e galerias. Implementar com GSAP ScrollTrigger + pin.

## Pre-Conditions
- Conteudo horizontal definido (cards, slides, images)
- Numero de panels/items conhecidos
- Snap behavior definido (sim/nao)
- Mobile strategy (horizontal ou fallback vertical)

## Passos

### 1. HTML Structure
```html
<section class="horizontal-wrapper">
  <div class="horizontal-track">
    <div class="panel">Panel 1</div>
    <div class="panel">Panel 2</div>
    <div class="panel">Panel 3</div>
    <div class="panel">Panel 4</div>
  </div>
</section>
```

### 2. CSS Setup
```css
.horizontal-wrapper {
  overflow: hidden;
}
.horizontal-track {
  display: flex;
  width: max-content;
}
.panel {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
}
```

### 3. GSAP Horizontal Scroll
```javascript
const track = document.querySelector('.horizontal-track');
const panels = gsap.utils.toArray('.panel');

gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    start: 'top top',
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  }
});
```

### 4. Animar Items Durante Horizontal Scroll
```javascript
panels.forEach((panel, i) => {
  gsap.from(panel.querySelector('.content'), {
    opacity: 0, y: 50,
    scrollTrigger: {
      trigger: panel,
      start: 'left center',
      end: 'right center',
      containerAnimation: horizontalScrollTween,
      toggleActions: 'play reverse play reverse',
    }
  });
});
```

### 5. Snap entre Panels
```javascript
ScrollTrigger.create({
  trigger: '.horizontal-wrapper',
  start: 'top top',
  end: () => `+=${track.scrollWidth - window.innerWidth}`,
  pin: true,
  scrub: 1,
  snap: {
    snapTo: 1 / (panels.length - 1),
    duration: 0.3,
    ease: 'power2.inOut',
  },
});
```

### 6. Progress Indicator
```javascript
gsap.to('.horizontal-progress', {
  scaleX: 1,
  transformOrigin: 'left center',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    start: 'top top',
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    scrub: true,
  }
});
```

### 7. Touch/Mobile Strategy
```css
@media (max-width: 768px) {
  .horizontal-track {
    flex-direction: column;
    width: 100%;
  }
  .panel {
    width: 100%;
    height: auto;
    min-height: 80vh;
  }
}
```

### 8. Keyboard Navigation
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') scrollToNextPanel();
  if (e.key === 'ArrowLeft') scrollToPrevPanel();
});
```

### 9. Dynamic Width Calculation
```javascript
// Recalcular ao resize
ScrollTrigger.addEventListener('refreshInit', () => {
  // Track width pode mudar com responsive panels
  gsap.set(track, { x: 0 });
});
```

### 10. Reduced Motion
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Converter para scroll vertical normal
  document.querySelector('.horizontal-track').style.flexDirection = 'column';
  ScrollTrigger.getAll().forEach(st => st.kill(true));
}
```

## Output
- Horizontal scroll com GSAP ScrollTrigger + pin
- Panel animations durante scroll
- Snap points se solicitado
- Progress indicator
- Mobile fallback (vertical stack)
- Keyboard navigation

## Quality Criteria
- [ ] Scroll horizontal 60fps
- [ ] Scrub suave sem jank
- [ ] Snap between panels funciona
- [ ] Mobile: fallback para vertical
- [ ] Keyboard arrows navegam panels
- [ ] Resize recalcula corretamente
- [ ] prefers-reduced-motion: vertical layout
- [ ] Progress indicator sincronizado
