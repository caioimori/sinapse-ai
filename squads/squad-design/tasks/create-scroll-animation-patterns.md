---
task: create-scroll-animation-patterns
responsavel: "@dx-interaction-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Create Scroll Animation Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Criar padroes de scroll-based animation — definir como elementos animam baseados na posicao de scroll de forma performatica e acessivel.

## Entrada
- Page layouts
- Content hierarchy
- Performance budgets
- Accessibility requirements

## Passos

### 1. Scroll Animation Types
| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| Entrance | Elementos aparecem ao scrollar | Fade-in on viewport entry |
| Parallax | Velocidades diferentes | Background moves slower |
| Progress | Ligado a posicao do scroll | Reading progress bar |
| Sticky | Fixo durante scroll range | Sticky header/sidebar |
| Reveal | Conteudo revelado progressivamente | Text underline on scroll |

### 2. Scroll-Driven Animations (CSS)
```css
/* Modern CSS approach */
@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-reveal {
  animation: fade-slide-in linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### 3. Intersection Observer Pattern
```typescript
function useScrollReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '1';
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('animate-in');
        observer.unobserve(element);
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

### 4. Allowed Scroll Animations
| Animation | Permitido | Condicao |
|-----------|----------|----------|
| Fade-in on scroll | SIM | Sutil, one-time |
| Slide-up on scroll | SIM | Short distance (20px), one-time |
| Parallax backgrounds | CONDICIONAL | Performance ok, reduced-motion off |
| Progress indicators | SIM | Ligado a scroll position |
| Sticky elements | SIM | CSS position:sticky |
| Counter animations | NAO | Distraction, CLS risk |
| Horizontal scroll hijack | NAO | Breaks expectations |

### 5. Performance Rules
| Regra | Descricao |
|-------|-----------|
| Use `transform` only | No width/height/margin |
| `will-change: transform` | Set before animation, remove after |
| Throttle scroll handlers | requestAnimationFrame or throttle |
| Prefer CSS over JS | CSS scroll-driven animations |
| No layout triggers | Only composite properties |
| Lazy observe | Disconnect after animation fires |

### 6. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .parallax {
    transform: none !important;
  }
}
```

## Saida
- Scroll animation pattern library
- CSS implementation examples
- JavaScript hooks
- Performance guidelines
- Reduced motion alternatives

## Validacao
- [ ] No scroll hijacking
- [ ] GPU-only properties
- [ ] Reduced motion: all animations disabled
- [ ] 60fps during scroll
- [ ] No CLS from scroll animations
- [ ] One-time animations (no re-trigger)
