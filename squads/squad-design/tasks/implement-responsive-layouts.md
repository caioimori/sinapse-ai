---
task: implement-responsive-layouts
responsavel: "@dx-frontend-engineer"
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

# Task: Implement Responsive Layouts

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Implementar layouts responsivos em codigo — traduzir grid system e responsive specs em CSS/Tailwind funcional.

## Entrada
- Grid system specification (de Canvas)
- Responsive design specs
- Breakpoint definitions
- Container query specs

## Passos

### 1. Configurar Breakpoints (Tailwind)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
    },
  },
};
```

### 2. Layout Components
```typescript
// Container component
function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}

// Grid component
function Grid({ children, cols = { default: 1, sm: 2, lg: 3 } }: GridProps) {
  return (
    <div className={cn(
      'grid gap-4',
      `grid-cols-${cols.default}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
    )}>
      {children}
    </div>
  );
}
```

### 3. Responsive Patterns
| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Card grid | 1 col | 2 cols | 3-4 cols |
| Sidebar | Hidden/drawer | Collapsible | Persistent |
| Navigation | Hamburger | Compact | Full |
| Table | Cards/scroll | Key cols | All cols |
| Hero | Stacked | Stacked | Side-by-side |

### 4. Container Queries
```css
/* Component-level responsiveness */
@container (min-width: 300px) {
  .card { flex-direction: row; }
}
```

```typescript
// Container query wrapper
function ResponsiveCard() {
  return (
    <div className="@container">
      <div className="flex flex-col @[300px]:flex-row">
        {/* Adapts to container, not viewport */}
      </div>
    </div>
  );
}
```

### 5. Fluid Typography
```css
/* globals.css */
:root {
  --fluid-min-width: 375;
  --fluid-max-width: 1440;

  --font-size-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
  --font-size-h1: clamp(2rem, 3vw + 1rem, 3.5rem);
}
```

### 6. Testing Responsive
```typescript
// Playwright responsive test
test.describe('Responsive', () => {
  for (const viewport of [375, 768, 1024, 1440]) {
    test(`layout at ${viewport}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport, height: 800 });
      await page.goto('/');
      await expect(page).toHaveScreenshot(`home-${viewport}.png`);
    });
  }
});
```

## Saida
- Responsive layout components
- Tailwind breakpoint configuration
- Container query implementation
- Fluid typography setup
- Responsive test suite

## Validacao
- [ ] Funciona em todos os breakpoints (375-1536px)
- [ ] Sem overflow horizontal
- [ ] Touch targets >= 44px em mobile
- [ ] Container queries onde especificado
- [ ] Fluid typography funcional
- [ ] Visual regression tests passando
