---
task: setup-performance-ci-gates
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

# Task: Setup Performance CI Gates

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Configurar gates de performance no CI/CD — automatizar Lighthouse CI, bundle size checks e Web Vitals monitoring para bloquear PRs que degradam performance.

## Entrada
- Performance budgets definidos
- CI/CD pipeline (GitHub Actions)
- Current baseline metrics
- Team notification preferences

## Passos

### 1. CI Gate Architecture
| Gate | Trigger | Blocking? | Tool |
|------|---------|-----------|------|
| Bundle size check | Every PR | YES (if > budget) | size-limit / bundlesize |
| Lighthouse CI | Every PR | YES (if score < 90) | LHCI |
| Build time check | Every PR | WARNING only | Custom script |
| Type/Lint check | Every PR | YES | TypeScript + ESLint |
| Visual regression | Every PR | YES (if diff > threshold) | Chromatic |
| CWV monitoring | Post-deploy | Alert only | RUM dashboard |

### 2. Lighthouse CI Configuration
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/dashboard"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }],
        "speed-index": ["warn", { "maxNumericValue": 3400 }],
        "interactive": ["warn", { "maxNumericValue": 3800 }],
        "resource-summary:script:size": [
          "error", { "maxNumericValue": 307200 }
        ],
        "resource-summary:stylesheet:size": [
          "error", { "maxNumericValue": 51200 }
        ],
        "resource-summary:font:size": [
          "error", { "maxNumericValue": 102400 }
        ],
        "resource-summary:image:size": [
          "warn", { "maxNumericValue": 512000 }
        ],
        "resource-summary:third-party:size": [
          "error", { "maxNumericValue": 51200 }
        ]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 3. Bundle Size Gate
```javascript
// .size-limit.js
module.exports = [
  {
    name: 'Total JS (initial)',
    path: '.next/static/chunks/**/*.js',
    limit: '300 KB',
    gzip: true,
  },
  {
    name: 'Main bundle',
    path: '.next/static/chunks/main-*.js',
    limit: '80 KB',
    gzip: true,
  },
  {
    name: 'Framework',
    path: '.next/static/chunks/framework-*.js',
    limit: '80 KB',
    gzip: true,
  },
  {
    name: 'CSS total',
    path: '.next/static/css/**/*.css',
    limit: '50 KB',
    gzip: true,
  },
];
```

### 4. GitHub Actions Workflow
```yaml
# .github/workflows/performance.yml
name: Performance Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Start server
        run: npm start &
        env:
          PORT: 3000

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

  bundle-size:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Check bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          skip_step: build

  build-metrics:
    name: Build Metrics
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - name: Build with timing
        run: |
          START=$(date +%s)
          npm run build
          END=$(date +%s)
          DURATION=$((END-START))
          echo "Build time: ${DURATION}s"
          if [ $DURATION -gt 120 ]; then
            echo "::warning::Build time exceeded 2 minutes (${DURATION}s)"
          fi

      - name: Analyze build output
        run: |
          echo "## Build Output Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          du -sh .next/static/chunks/ | sed 's/\t/ | /' >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          find .next/static -name "*.js" | wc -l | xargs -I {} echo "JS files: {}" >> $GITHUB_STEP_SUMMARY
          find .next/static -name "*.css" | wc -l | xargs -I {} echo "CSS files: {}" >> $GITHUB_STEP_SUMMARY
```

### 5. PR Comment Integration
| Metrica | PR Comment | Blocking |
|---------|-----------|----------|
| Lighthouse score | Score badge + link to report | Yes if < 90 |
| Bundle size delta | Size change table (+/- KB) | Yes if over budget |
| Build time | Duration + trend | Warning only |
| New dependencies | Added packages + sizes | Warning |
| CWV prediction | Estimated impact | Info only |

### 6. Baseline Management
```yaml
baseline:
  storage: ".performance/baseline.json"

  update_policy:
    trigger: "merge to main"
    method: "rolling average of last 5 builds"

  comparison:
    method: "percentage change from baseline"
    thresholds:
      bundle_size: "+5%"
      lighthouse_score: "-3 points"
      build_time: "+20%"
      lcp: "+200ms"
      cls: "+0.02"

  alerts:
    regression_detected:
      notify: ["slack:#dx-performance", "pr-comment"]
      block: true
    improvement_detected:
      notify: ["pr-comment"]
      block: false
      action: "Update baseline"
```

### 7. Gate Decision Matrix
| Situacao | Acao | Override |
|----------|------|---------|
| All gates pass | Auto-approve performance | N/A |
| Lighthouse < 90 | Block PR | Apex approval required |
| Bundle > budget | Block PR | Apex approval + offset plan |
| Build time warning | Allow PR | N/A |
| Visual regression | Block PR | Design approval |
| New heavy dependency | Warning | Team discussion |

## Saida
- Lighthouse CI configuration
- Bundle size check configuration
- GitHub Actions workflow
- PR comment integration
- Baseline management strategy

## Validacao
- [ ] Lighthouse CI rodando em todo PR
- [ ] Bundle size check blocking
- [ ] Performance score >= 90 enforced
- [ ] A11y score >= 95 enforced
- [ ] Resource budgets enforced
- [ ] PR comments com metricas
- [ ] Baseline atualizado automaticamente
- [ ] Override process documentado
