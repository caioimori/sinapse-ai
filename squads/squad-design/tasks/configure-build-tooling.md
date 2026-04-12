---
task: configure-build-tooling
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

# Task: Configure Build Tooling

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Configurar tooling de build otimizado — bundler, transpilacao, minificacao, tree-shaking e otimizacoes de output.

## Entrada
- Framework selecionado
- Target browsers
- Performance budgets
- Deploy target

## Passos

### 1. Configurar Bundler
```javascript
// next.config.js (Next.js)
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@org/components', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### 2. Browser Targets
```
# .browserslistrc
>= 0.5%
last 2 versions
not dead
not IE 11
```

### 3. Bundle Analysis
```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "build": "next build",
    "postbuild": "next-bundle-analyzer"
  }
}
```

### 4. Performance Budgets
| Asset Type | Budget |
|-----------|--------|
| Total JS (initial) | < 300KB gzipped |
| Total CSS (initial) | < 50KB gzipped |
| Per-route JS | < 100KB gzipped |
| Images (per page) | < 500KB total |
| Fonts | < 100KB total |
| Third-party | < 50KB total |

### 5. Otimizacoes de Build
| Otimizacao | Config |
|-----------|--------|
| Tree shaking | Automatic (ESM) |
| Code splitting | Per-route (App Router) |
| CSS purging | Tailwind JIT |
| Image optimization | next/image, sharp |
| Font optimization | next/font, subset |
| Minification | SWC (default Next.js) |
| Compression | gzip + brotli |

### 6. CI Build Pipeline
```yaml
build_pipeline:
  steps:
    - lint: "npm run lint"
    - typecheck: "npm run typecheck"
    - test: "npm run test"
    - build: "npm run build"
    - analyze: "Check bundle sizes against budgets"
    - lighthouse: "Run Lighthouse CI"
```

## Saida
- Build configuration files
- Browser targets
- Performance budget enforcement
- Bundle analysis setup
- CI pipeline configuration

## Validacao
- [ ] Build completa sem errors
- [ ] Tree shaking funcional
- [ ] Bundle sizes dentro do budget
- [ ] Browser targets definidos
- [ ] CI pipeline funcional
- [ ] Source maps configurados (prod: hidden)
