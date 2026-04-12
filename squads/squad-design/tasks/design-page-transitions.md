---
task: design-page-transitions
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

# Task: Design Page Transitions

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Projetar transicoes entre paginas — criar continuidade visual durante navegacao mantendo performance e respeitando reduced motion.

## Entrada
- Route structure
- Navigation patterns
- Performance budgets
- Motion principles

## Passos

### 1. Transition Types
| Tipo | Quando | Duracao |
|------|--------|---------|
| Fade | Paginas sem relacao hierarquica | 200-300ms |
| Slide | Navegacao lateral (tabs, wizard) | 300ms |
| Shared Element | Elemento conecta paginas (card → detail) | 300-500ms |
| Morph | Elemento transforma em outro | 300-500ms |
| None | Same-page content swap | Instant |

### 2. View Transitions API
```typescript
// Next.js App Router approach
'use client';
import { useRouter } from 'next/navigation';

function NavigateWithTransition({ href }: { href: string }) {
  const router = useRouter();

  const navigate = () => {
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }

    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return <button onClick={navigate}>Navigate</button>;
}
```

```css
/* View transition styles */
::view-transition-old(root) {
  animation: fade-out 200ms var(--ease-accelerate);
}

::view-transition-new(root) {
  animation: fade-in 300ms var(--ease-decelerate);
}

/* Shared element transition */
.product-card {
  view-transition-name: product-hero;
}

::view-transition-old(product-hero),
::view-transition-new(product-hero) {
  animation-duration: 400ms;
}
```

### 3. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

### 4. Loading States During Transition
| Fase | Visual |
|------|--------|
| Navigate initiated | Subtle loading indicator (top bar) |
| Old page fading | Old content fades/slides |
| Loading | Skeleton or progress bar |
| New page appearing | New content fades/slides in |
| Complete | Loading indicator hides |

### 5. Transition Rules
| Regra | Descricao |
|-------|-----------|
| Old exits faster than new enters | 150ms out, 250ms in |
| No layout shifts during transition | CLS = 0 |
| Loading state if > 300ms | Show skeleton |
| Cancel on back navigation | Instant back |
| Respect browser back/forward | Native behavior |

### 6. Fallback Strategy
| Browser Support | Behavior |
|----------------|---------|
| View Transitions API | Full transition |
| No support | Instant page swap (no animation) |
| Reduced motion | Instant swap |

## Saida
- Page transition specifications
- View Transitions API implementation
- Loading state specs
- Reduced motion alternatives
- Fallback strategy

## Validacao
- [ ] Transitions suaves (no janky motion)
- [ ] No layout shifts (CLS = 0)
- [ ] Loading states para slow transitions
- [ ] Reduced motion: instant swap
- [ ] Fallback para browsers sem suporte
- [ ] 60fps durante transicao
