---
task: implement-component-library
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

# Task: Implement Component Library

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Complex

## Objetivo
Implementar a biblioteca de componentes em codigo — traduzir API contracts, visual specs e tokens em componentes React/TypeScript production-ready.

## Entrada
- Component API contracts (de Stratum)
- Visual states specs (de Canvas)
- Design tokens (CSS custom properties)
- A11y requirements (de Beacon)
- Motion specs (de Kinetic)

## Passos

### 1. Setup do Projeto
```bash
# Recomendado: Monorepo com packages
packages/
├── tokens/          # @org/tokens
├── components/      # @org/components
├── icons/           # @org/icons
└── storybook/       # Documentation
```

### 2. Component Implementation Pattern
```typescript
// components/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-action-primary)] text-[var(--color-foreground-inverse)]',
        secondary: '...',
        ghost: '...',
        danger: '...',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {loading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### 3. Priority Order
| Priority | Components | Rationale |
|----------|-----------|-----------|
| P0 | Button, Input, Label, Icon | Foundation |
| P1 | Card, Badge, Avatar, Divider | Basic UI |
| P2 | FormField, Select, Textarea, Checkbox, Radio | Forms |
| P3 | Modal, Toast, Tooltip, Popover | Overlays |
| P4 | Tabs, Accordion, Table, Pagination | Complex |
| P5 | Navigation, Sidebar, Breadcrumb | Layout |

### 4. Per-Component Checklist
- [ ] TypeScript strict (no `any`)
- [ ] forwardRef for DOM access
- [ ] All variants implemented
- [ ] All states (hover, focus, active, disabled, loading, error)
- [ ] Dark mode works via tokens
- [ ] Responsive behavior
- [ ] A11y: ARIA, keyboard, focus management
- [ ] Motion: transitions, reduced-motion
- [ ] Tests: unit + interaction
- [ ] Storybook stories (all required categories)

### 5. Testing Strategy
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with default props', () => {});
  it('applies variant classes', () => {});
  it('handles disabled state', () => {});
  it('shows loading spinner', () => {});
  it('forwards ref', () => {});
  it('handles keyboard interaction', () => {});
  it('announces loading to screen readers', () => {});
});
```

### 6. Export Strategy
```typescript
// index.ts — tree-shakeable barrel export
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
// ...
```

## Saida
- Component library package
- TypeScript types exported
- Storybook documentation
- Test suite
- Package published (npm)

## Validacao
- [ ] TypeScript strict, 0 errors
- [ ] All components implemented per priority
- [ ] Test coverage >= 80%
- [ ] Storybook stories complete
- [ ] A11y: axe-core 0 violations
- [ ] Tree-shakeable exports
- [ ] Bundle size within budget
