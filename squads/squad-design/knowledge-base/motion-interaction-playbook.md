# Knowledge Base: Motion & Interaction Playbook

## Escopo
Referencia completa de motion design para interfaces — principios, easing, duracao, micro-interacoes, transicoes e performance.

---

## 1. Motion Principles

### 5 Principios Fundamentais
| Principio | Descricao | Exemplo |
|-----------|----------|---------|
| Purposeful | Toda animacao tem razao de existir | Loading indicator = feedback |
| Responsive | Feedback imediato a acao do usuario | Button press = instant response |
| Natural | Movimento imita fisica do mundo real | Spring easing, gravity |
| Accessible | Respeita prefers-reduced-motion | Desabilitar decorativas |
| Performant | 60fps, GPU-accelerated | transform + opacity only |

### Disney's 12 Principles (Adapted for UI)
| Principio | Aplicacao UI |
|-----------|-------------|
| Squash & Stretch | Button press effect |
| Anticipation | Micro-pull before action |
| Staging | Direct attention with motion |
| Follow Through | Overshoot on stop |
| Slow In/Slow Out | Ease-in-out for natural feel |
| Arcs | Curved motion paths |
| Secondary Action | Icon spin while loading |
| Timing | Duration matches importance |
| Exaggeration | Emphasis on key moments |
| Appeal | Personality through motion |

---

## 2. Easing Curves

### Standard Curves
| Nome | CSS | Bezier | Uso |
|------|-----|--------|-----|
| Standard | ease | (0.4, 0, 0.2, 1) | Movimento geral |
| Decelerate | ease-out | (0, 0, 0.2, 1) | Elementos entrando |
| Accelerate | ease-in | (0.4, 0, 1, 1) | Elementos saindo |
| Sharp | ease-in-out | (0.4, 0, 0.6, 1) | Transicoes rapidas |
| Linear | linear | (0, 0, 1, 1) | Progress bars, loops |

### Spring Configs (Framer Motion)
```typescript
const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  bouncy: { type: 'spring', stiffness: 300, damping: 10 },
  stiff: { type: 'spring', stiffness: 400, damping: 30 },
  slow: { type: 'spring', stiffness: 100, damping: 20 },
};
```

### Regra de Escolha
| Situacao | Easing |
|----------|--------|
| Elemento aparece | Decelerate (ease-out) |
| Elemento desaparece | Accelerate (ease-in) |
| Elemento se move | Standard (ease) |
| Feedback tactil | Spring (bouncy) |
| Loading/progress | Linear |
| Emphasis | Spring (gentle) |

---

## 3. Duration Scale

### Escala Padrao
| Token | Valor | Uso |
|-------|-------|-----|
| instant | 0ms | State changes (color, opacity) |
| fast | 100ms | Micro-feedback (hover, press) |
| normal | 200ms | Standard transitions |
| moderate | 300ms | Component animations |
| slow | 400ms | Page transitions |
| slower | 500ms | Complex choreography |
| slowest | 700ms | Dramatic emphasis |

### Duration Rules
| Regra | Descricao |
|-------|----------|
| Doherty Threshold | Feedback em < 400ms para manter flow |
| Smaller = Faster | Elementos menores = duracao menor |
| Distance = Duration | Mais distancia = mais duracao |
| Exit < Enter | Saida mais rapida que entrada |
| Max 700ms | Nenhuma animacao > 700ms |
| Mobile shorter | Mobile duracoes 20-30% menores |

### Staggering
| Padrao | Valor | Cap |
|--------|-------|-----|
| Stagger delay | 50ms por item | 500ms total |
| List items | 30-50ms stagger | Max 10 items |
| Grid items | 50ms stagger | Max 12 items |
| Cascade | 75ms stagger | Max 6 items |

---

## 4. Micro-Interactions

### Button
```typescript
const buttonMotion = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

// CSS alternative
.button {
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.button:hover { transform: scale(1.02); }
.button:active { transform: scale(0.98); }
```

### Switch/Toggle
```typescript
const switchMotion = {
  layout: true,
  transition: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  },
};
```

### Input Focus
```css
.input {
  transition: border-color 150ms ease, box-shadow 150ms ease;
  border: 1px solid var(--border-default);
}
.input:focus {
  border-color: var(--color-action-primary);
  box-shadow: 0 0 0 3px var(--color-action-primary / 0.15);
}
```

### Checkbox
```css
.checkbox-indicator {
  transition: transform 200ms ease, opacity 200ms ease;
  transform-origin: center;
}
.checkbox[data-state="checked"] .checkbox-indicator {
  transform: scale(1);
  opacity: 1;
}
.checkbox[data-state="unchecked"] .checkbox-indicator {
  transform: scale(0.5);
  opacity: 0;
}
```

---

## 5. Page Transitions

### View Transitions API
```css
/* CSS-based page transitions */
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: fade-out 200ms ease-in;
}

::view-transition-new(root) {
  animation: fade-in 300ms ease-out;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Transition Types
| Tipo | Quando | Duracao |
|------|--------|---------|
| Fade | Default page change | 200-300ms |
| Slide | Navegacao lateral/hierarquica | 250-350ms |
| Shared element | Elemento compartilhado entre views | 300-400ms |
| Morph | Transformacao de layout | 300-500ms |
| Scale | Modal/dialog open | 200-300ms |

### Loading During Transition
| Pattern | Uso |
|---------|-----|
| Skeleton screens | Content loading |
| Progress bar (top) | Page navigation |
| Spinner (inline) | Button actions |
| Content shimmer | List/card loading |
| Placeholder → Content | Gradual reveal |

---

## 6. Scroll Animations

### Intersection Observer Pattern
```typescript
const useScrollReveal = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate once
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};
```

### CSS Scroll-Driven Animations
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-reveal {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### Scroll Animation Rules
| Regra | Descricao |
|-------|----------|
| Subtle movement | Max 30px translation |
| Fade in preferred | Opacity 0 → 1 |
| No parallax on mobile | Performance concern |
| Animate once | Nao re-animar ao scrollar pra cima |
| Respect reduced motion | Sem scroll animations |
| Content first | Conteudo visivel mesmo sem JS |

---

## 7. Feedback Animations

### Success
```typescript
const checkmarkDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 0.5, bounce: 0 },
      opacity: { duration: 0.1 },
    },
  },
};
```

### Error Shake
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.error-shake {
  animation: shake 400ms ease-in-out;
}
```

### Toast Notification
```typescript
const toastMotion = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
  transition: {
    enter: { type: 'spring', stiffness: 300, damping: 24 },
    exit: { duration: 0.2, ease: 'easeIn' },
  },
};
```

---

## 8. Reduced Motion

### CSS Implementation
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### React Hook
```typescript
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
```

### Animation Categories
| Categoria | Reduced Motion | Exemplo |
|-----------|---------------|---------|
| Essential | KEEP (simplify) | Loading spinners, progress |
| Informative | SIMPLIFY | State changes, transitions |
| Decorative | REMOVE | Parallax, hover effects |
| Interactive | SIMPLIFY | Button press, toggle |

---

## 9. Performance Guidelines

### GPU-Only Properties
| Property | GPU? | Uso |
|----------|------|-----|
| transform | YES | Mover, escalar, rotacionar |
| opacity | YES | Fade in/out |
| filter | YES | Blur, brightness |
| clip-path | Partial | Reveal animations |
| background-color | NO | Avoid animating |
| width/height | NO | Use transform: scale |
| top/left | NO | Use transform: translate |
| box-shadow | NO | Use pseudo-element trick |

### Performance Targets
| Metrica | Target |
|---------|--------|
| Frame rate | 60fps (16.67ms/frame) |
| Jank frames | < 1% of total frames |
| Layout thrashing | 0 forced reflows |
| Paint area | Minimize repaint regions |
| Composite layers | < 30 promoted layers |

### will-change Usage
```css
/* Apply BEFORE animation starts, remove after */
.about-to-animate {
  will-change: transform, opacity;
}

/* NEVER apply to many elements at once */
/* NEVER use will-change: all */
```

---

## Referencias
- Material Design Motion Guidelines (Google)
- Human Interface Guidelines — Motion (Apple)
- Framer Motion Documentation
- View Transitions API (MDN)
- WCAG 2.3.1, 2.3.3 — Motion and Animation
