---
task: setup-testing-infrastructure
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

# Task: Setup Testing Infrastructure

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Configurar infraestrutura de testes completa — unit tests, integration tests, visual regression e E2E.

## Entrada
- Tech stack selecionado
- Component library
- CI/CD pipeline
- Coverage requirements

## Passos

### 1. Testing Pyramid
| Nivel | Ferramenta | Coverage Target | Speed |
|-------|-----------|----------------|-------|
| Unit | Vitest + Testing Library | >= 80% | Fast |
| Integration | Testing Library | Key flows | Medium |
| Visual Regression | Chromatic/Percy | All components | Medium |
| E2E | Playwright | Critical paths | Slow |
| A11y | axe-core + Storybook | 100% components | Fast |

### 2. Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['**/*.stories.*', '**/*.test.*', '**/index.ts'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

### 3. Testing Library Setup
```typescript
// test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
```

### 4. Test Patterns
```typescript
// Component test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

### 5. Playwright E2E
```typescript
// e2e/critical-flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-card"]');
  await page.click('text=Add to Cart');
  await page.goto('/checkout');
  await page.fill('#email', 'test@example.com');
  await page.click('text=Place Order');
  await expect(page).toHaveURL('/order/confirmation');
});
```

### 6. CI Integration
```yaml
test_pipeline:
  steps:
    - unit: "vitest run --coverage"
    - e2e: "playwright test"
    - visual: "chromatic --exit-zero-on-changes"
    - a11y: "test-storybook --stories-json"
  gates:
    - coverage: ">= 80%"
    - e2e: "all passing"
    - a11y: "0 violations"
```

## Saida
- Vitest configuration
- Testing Library setup
- Playwright configuration
- Visual regression setup
- CI test pipeline
- Test pattern examples

## Validacao
- [ ] Vitest rodando com coverage
- [ ] Testing Library configurado
- [ ] Playwright E2E funcional
- [ ] Coverage >= 80%
- [ ] CI pipeline funcional
- [ ] A11y testing integrado
