# Scroll Animation Patterns

> Padroes de animacao scroll-driven usados pelos melhores estudios do mundo.

---

## Stack Recomendado

| Ferramenta | Papel |
|-----------|-------|
| Lenis | Smooth scrolling (inertia) |
| GSAP ScrollTrigger | Scroll-driven animations |
| GSAP SplitText | Text splitting |
| Intersection Observer | Trigger basico (sem scrub) |
| CSS scroll-timeline | Native (experimental) |

### Setup Base
```javascript
// Lenis + GSAP
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## Padroes

### 1. Fade-Up Reveal (O mais comum e efetivo)
```javascript
gsap.from('.reveal', {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
  }
});
```

### 2. Parallax Layer
```javascript
gsap.to('.bg-layer', {
  y: -200,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
});
```

### 3. Pinned Section com Progresso (Apple-style)
```javascript
gsap.to('.product-3d', {
  rotationY: 360,
  ease: 'none',
  scrollTrigger: {
    trigger: '.showcase',
    start: 'top top',
    end: '+=3000',
    pin: true,
    scrub: 1,
  }
});
```

### 4. Horizontal Scroll
```javascript
const sections = gsap.utils.toArray('.panel');
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-scroll-container',
    pin: true,
    scrub: 1,
    end: () => '+=' + document.querySelector('.h-scroll-container').offsetWidth,
  }
});
```

### 5. Text Reveal Word-by-Word
```javascript
const split = new SplitText('.headline', { type: 'words' });
gsap.from(split.words, {
  opacity: 0.1,
  stagger: 0.05,
  scrollTrigger: {
    trigger: '.headline',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  }
});
```

### 6. Scale-Up Section Reveal
```javascript
gsap.from('.full-section', {
  scale: 0.8,
  opacity: 0,
  borderRadius: '20px',
  scrollTrigger: {
    trigger: '.full-section',
    start: 'top 90%',
    end: 'top 20%',
    scrub: true,
  }
});
```

### 7. Number Counter on Scroll
```javascript
gsap.from('.stat-number', {
  textContent: 0,
  duration: 2,
  ease: 'power1.in',
  snap: { textContent: 1 },
  scrollTrigger: {
    trigger: '.stats-section',
    start: 'top 70%',
  }
});
```

### 8. Scroll-Linked Video (Apple-style)
```javascript
const video = document.querySelector('video');
ScrollTrigger.create({
  trigger: '.video-section',
  start: 'top top',
  end: '+=5000',
  pin: true,
  onUpdate: (self) => {
    video.currentTime = video.duration * self.progress;
  }
});
```

### 9. Scroll Velocity Effect
```javascript
let velocity = 0;
lenis.on('scroll', ({ velocity: v }) => { velocity = v; });

// No animation loop:
elements.forEach(el => {
  el.style.transform = `skewY(${velocity * 2}deg)`;
});
```

### 10. Progressive Blur (Profundidade)
```javascript
gsap.to('.bg-text', {
  filter: 'blur(10px)',
  opacity: 0.3,
  ease: 'none',
  scrollTrigger: {
    trigger: '.content-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});
```

---

## Regras de Ouro

1. **start: 'top 80%'** — Trigger quando 80% visivel (nao esperar bottom)
2. **scrub: true** — Para animacoes vinculadas ao progresso do scroll
3. **scrub: 1** — Para smoothing de 1 segundo (mais suave)
4. **pin: true** — Usa apenas para secoes hero/showcase
5. **ease: 'none'** — Sempre para scrubbed animations (easing vem do scroll)
6. **stagger: 0.05-0.1** — Para reveals de multiplos elementos
7. **Testar sem smooth scroll** — Garantir que funciona com scroll nativo tambem
