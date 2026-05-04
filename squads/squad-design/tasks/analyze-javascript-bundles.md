---
task: analyze-javascript-bundles
responsavel: "@dx-performance-engineer"
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

# Task: Analyze JavaScript Bundles

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Analisar bundles JavaScript — identificar codigo desnecessario, duplicacoes, dependencies pesadas e oportunidades de code splitting.

## Entrada
- Build output
- Bundle analyzer reports
- Performance budgets (JS < 300KB)
- Route structure

## Passos

### 1. Gerar Bundle Report
```bash
# Next.js bundle analyzer
ANALYZE=true npm run build
```

### 2. Analisar por Categoria
| Categoria | Target | O que medir |
|-----------|--------|-----------|
| First-party code | < 100KB | App logic |
| Framework | < 80KB | React, Next.js runtime |
| UI Library | < 50KB | Component library |
| Third-party | < 50KB | Analytics, widgets |
| Polyfills | < 20KB | Browser compat |

### 3. Identificar Issues
| Issue | Diagnostico | Fix |
|-------|-----------|-----|
| Large dependency | Whole library imported | Tree-shake or replace |
| Duplicate packages | Same lib, different versions | Dedupe, align versions |
| Dead code | Unused exports | Tree-shake, remove |
| Monolithic import | `import * from 'lib'` | Named imports |
| Missing code splitting | Route-level splitting absent | Dynamic imports |
| Polyfill bloat | Unnecessary polyfills | Target modern browsers |

### 4. Top Dependencies Analysis
| Package | Size (gzipped) | Treeshakeable? | Alternative |
|---------|---------------|---------------|------------|
| | | [yes/no] | |

### 5. Code Splitting Strategy
```typescript
// Per-route splitting (automatic with App Router)
// Heavy component splitting
const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

// Conditional feature loading
const AdminPanel = dynamic(
  () => import('@/components/AdminPanel'),
  { loading: () => null }
);
```

### 6. Optimization Actions
| Action | Impact | Effort |
|--------|--------|--------|
| Replace moment → date-fns | -65KB | Low |
| Replace lodash → individual | -70KB | Medium |
| Lazy load chart library | -120KB initial | Low |
| Remove unused CSS | -20KB | Low |
| Optimize component imports | -30KB | Medium |
| Implement module federation | Variable | High |

## Saida
- Bundle analysis report
- Size breakdown by category
- Issue list with fixes
- Code splitting strategy
- Optimization action plan

## Validacao
- [ ] Total JS < 300KB gzipped
- [ ] Per-route JS < 100KB
- [ ] No duplicate packages
- [ ] Tree-shaking funcional
- [ ] Code splitting por route
- [ ] Third-party < 50KB
