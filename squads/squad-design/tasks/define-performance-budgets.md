---
task: define-performance-budgets
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

# Task: Define Performance Budgets

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Definir performance budgets — estabelecer limites quantitativos para resources, metricas e timing que sao monitorados e enforced no CI/CD.

## Entrada
- CWV targets
- Page types (LP, dashboard, content)
- Target devices/connections
- Industry benchmarks

## Passos

### 1. Metric Budgets
| Metrica | Budget | Enforcement |
|---------|--------|------------|
| LCP | < 2.5s (p75) | Blocking |
| INP | < 200ms (p75) | Blocking |
| CLS | < 0.1 (p75) | Blocking |
| FCP | < 1.8s | Warning |
| TTFB | < 0.8s | Warning |
| TBT | < 200ms | Warning |
| Lighthouse Performance | >= 90 | Blocking |

### 2. Resource Budgets
| Resource | Budget | Per |
|----------|--------|-----|
| Total JS (initial) | < 300KB gzipped | App |
| Per-route JS | < 100KB gzipped | Route |
| Total CSS | < 50KB gzipped | App |
| Web Fonts | < 100KB | App (subset) |
| Images (per page) | < 500KB total | Page |
| Single image | < 200KB | Image |
| Third-party | < 50KB total | App |

### 3. Request Budgets
| Metrica | Budget | Per |
|---------|--------|-----|
| Total requests (initial) | < 30 | Page load |
| Third-party requests | < 5 | Page load |
| API requests (initial) | < 3 | Page load |
| Font files | <= 2 | App |

### 4. Budget por Tipo de Pagina
| Tipo | JS Budget | CSS Budget | LCP Target |
|------|----------|-----------|-----------|
| Landing Page | < 150KB | < 30KB | < 2.0s |
| Content Page | < 200KB | < 40KB | < 2.5s |
| Dashboard | < 350KB | < 60KB | < 3.0s |
| Auth Page | < 100KB | < 20KB | < 1.5s |

### 5. Enforcement via Lighthouse CI
```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }],
        "resource-summary:script:size": ["error", { "maxNumericValue": 307200 }],
        "resource-summary:stylesheet:size": ["error", { "maxNumericValue": 51200 }]
      }
    }
  }
}
```

### 6. Budget Review Process
| Situacao | Acao |
|----------|------|
| Budget exceeded | PR blocked, fix required |
| Budget warning | PR allowed, tracking |
| Budget request | Justify, measure impact, approve/deny |
| Budget increase | Requires Apex approval + offset |

## Saida
- Performance budget document
- Per-page budgets
- Lighthouse CI configuration
- Budget enforcement policy
- Review process documentation

## Validacao
- [ ] Metric budgets definidos
- [ ] Resource budgets por tipo
- [ ] Per-page budgets diferenciados
- [ ] CI enforcement configurado
- [ ] Review process documentado
- [ ] Budgets alinhados com CWV targets
