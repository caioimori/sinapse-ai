---
task: implement-reduced-motion
responsavel: "@dx-accessibility-specialist"
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

# Task: Implement Reduced Motion

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Standard

## Objetivo
Garantir que todas as animacoes respeitam prefers-reduced-motion — usuarios com vestibular disorders ou motion sensitivity devem ter experiencia confortavel.

## Entrada
- Motion specs (de Kinetic)
- Animation inventory
- CSS/JS animations
- Third-party animations

## Passos

### 1. Categorizar Animacoes
| Tipo | Reduced Motion Behavior |
|------|------------------------|
| Essential (loading, progress) | Simplificar, nao remover |
| Decorative (parallax, float) | REMOVER completamente |
| Informative (attention, status) | Substituir por fade/opacity |
| Transition (page, route) | Instant cut |
| Hover effects | Simplificar ou instant |

### 2. CSS Implementation
```css
/* Default: animations enabled */
.element {
  transition: transform 300ms ease-out;
  animation: slideIn 500ms ease;
}

/* Reduced motion: simplify or remove */
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

/* OR: selective approach (preferred) */
@media (prefers-reduced-motion: reduce) {
  .decorative-animation {
    animation: none;
  }

  .page-transition {
    transition: opacity 0.01ms;
  }

  .loading-spinner {
    /* Keep but simplify */
    animation: pulse 2s ease-in-out infinite;
  }
}
```

### 3. JavaScript Implementation
```typescript
// Hook for motion preference
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// Usage
function AnimatedComponent() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.div
      animate={prefersReduced ? {} : { x: 100 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
    />
  );
}
```

### 4. Framer Motion Integration
```typescript
// Global reduced motion config
import { MotionConfig } from 'framer-motion';

function App({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
```

### 5. Third-Party Considerations
| Library | Reduced Motion Support |
|---------|----------------------|
| Framer Motion | Built-in (reducedMotion prop) |
| GSAP | Manual (check mediaQuery) |
| Lottie | Manual (pause/simplify) |
| CSS animations | @media query |
| Scroll libraries | Disable parallax effects |
| Video backgrounds | Pause, show poster frame |

### 6. Testing
- [ ] Enable "Reduce motion" in OS settings
- [ ] Verify all decorative animations stop
- [ ] Verify essential animations simplify
- [ ] Verify page transitions are instant
- [ ] Verify no flashing content
- [ ] Verify auto-playing video pauses
- [ ] Verify parallax effects disabled

## Saida
- Reduced motion implementation guide
- CSS media query patterns
- JavaScript hook
- Third-party adaptation guide
- Testing checklist
- Handoff para Kinetic (motion specs update)

## Validacao
- [ ] prefers-reduced-motion respected globalmente
- [ ] Decorative animations removidas
- [ ] Essential animations simplificadas
- [ ] Page transitions instantaneas
- [ ] Third-party animations adaptadas
- [ ] Testado com OS setting ativo
