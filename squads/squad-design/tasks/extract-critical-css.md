---
task: extract-critical-css
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

# Task: Extract Critical CSS

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Extrair e inline Critical CSS — identificar CSS necessario para renderizar above-the-fold content e otimizar CSS delivery para melhorar FCP e LCP.

## Entrada
- Page templates
- CSS bundle
- Above-fold content definition
- Performance metrics

## Passos

### 1. Tailwind CSS Optimization
```javascript
// tailwind.config.js — automatic purging
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // JIT mode generates only used classes
};
```

### 2. CSS Budget
| Metrica | Budget |
|---------|--------|
| Total CSS | < 50KB gzipped |
| Critical CSS (inline) | < 14KB |
| Per-component CSS | < 5KB |
| Unused CSS | < 5% |

### 3. Critical CSS Strategy
| Approach | Framework | Implementation |
|----------|-----------|---------------|
| Automatic | Next.js | Built-in CSS optimization |
| Manual | Any | Critical CSS tools |
| Utility-first | Tailwind | JIT = near-zero unused |

### 4. CSS Loading Pattern
```html
<!-- Critical CSS inline in <head> -->
<style>
  /* Above-fold styles only (~14KB max) */
  .header { ... }
  .hero { ... }
</style>

<!-- Non-critical CSS loaded async -->
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="/styles.css" /></noscript>
```

### 5. Optimize CSS Delivery
| Tecnica | Impact | Implementation |
|---------|--------|---------------|
| Inline critical CSS | Reduces FCP | Auto with Next.js |
| Async non-critical | No render-blocking | media="print" trick |
| Purge unused | Smaller bundle | Tailwind JIT / PurgeCSS |
| Minify | 10-20% reduction | PostCSS cssnano |
| Combine files | Fewer requests | Build tool handles |
| Cache immutable | No re-download | Content hash filenames |

### 6. Audit Unused CSS
```bash
# Chrome DevTools Coverage tab
# Shows used vs unused CSS per file
```

Remove:
- Unused utility classes (Tailwind JIT handles)
- Legacy component styles
- Vendor prefixes for unsupported browsers
- Reset/normalize duplications

## Saida
- CSS optimization configuration
- Critical CSS extraction setup
- Async CSS loading pattern
- Unused CSS audit report
- CSS budget enforcement

## Validacao
- [ ] Total CSS < 50KB gzipped
- [ ] Critical CSS < 14KB
- [ ] No render-blocking CSS
- [ ] Unused CSS < 5%
- [ ] Tailwind JIT configured
- [ ] FCP improvement measurable
