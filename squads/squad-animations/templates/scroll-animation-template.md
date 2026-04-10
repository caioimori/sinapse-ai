---
template: scroll-animation-template
squad: squad-animations
description: "Template de codigo para scroll animations com GSAP ScrollTrigger"
used_by:
  - implement-scroll-animation
  - build-parallax-effect
  - create-pinned-section
  - create-scroll-storytelling
---

# Scroll Animation Template

## Setup Base
```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Opcional: Lenis smooth scroll
// import Lenis from 'lenis';
// const lenis = new Lenis();
// lenis.on('scroll', ScrollTrigger.update);
// gsap.ticker.add((time) => lenis.raf(time * 1000));
// gsap.ticker.lagSmoothing(0);
```

## Fade Up on Scroll
```javascript
gsap.from('.element', {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  }
});
```

## Parallax
```javascript
gsap.to('.parallax-bg', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
});
```

## Pinned Section
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.pin-section',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
  }
});

tl.to('.step-1', { opacity: 1, y: 0 })
  .to('.step-2', { opacity: 1, y: 0 })
  .to('.step-3', { opacity: 1, y: 0 });
```

## Horizontal Scroll
```javascript
const sections = gsap.utils.toArray('.h-panel');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-container',
    start: 'top top',
    end: () => '+=' + document.querySelector('.h-container').offsetWidth,
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
  }
});
```

## Stagger on Scroll
```javascript
gsap.from('.card', {
  y: 40,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.cards-container',
    start: 'top 75%',
  }
});
```

## Cleanup
```javascript
// IMPORTANTE: sempre limpar no unmount
function cleanup() {
  ScrollTrigger.getAll().forEach(st => st.kill());
  // lenis?.destroy();
}
```

## Regras
1. Sempre usar `scrub: true` para animacoes vinculadas ao scroll
2. Usar `toggleActions` para animacoes triggered (play once)
3. Testar em mobile com touch scroll
4. Adicionar `markers: true` em desenvolvimento
5. Chamar `ScrollTrigger.refresh()` apos mudancas de layout
6. SEMPRE implementar cleanup no unmount
