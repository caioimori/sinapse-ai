---
task: audit-core-web-vitals
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

# Task: Audit Core Web Vitals

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Complex

## Objetivo
Auditar Core Web Vitals do produto — medir LCP, INP e CLS em campo e lab, identificar bottlenecks e definir remediation plan.

## Entrada
- URLs para auditar
- Performance budgets
- Device/connection targets
- Current metrics (se disponiveis)

## Passos

### 1. Coletar Metricas Lab
| Metrica | Target | Tool | Medida |
|---------|--------|------|--------|
| LCP | < 2.5s | Lighthouse, WebPageTest | p75 |
| INP | < 200ms | Chrome DevTools | p75 |
| CLS | < 0.1 | Lighthouse | p75 |
| FCP | < 1.8s | Lighthouse | p75 |
| TTFB | < 0.8s | WebPageTest | p75 |
| TBT | < 200ms | Lighthouse | — |
| Speed Index | < 3.4s | Lighthouse | — |

### 2. Coletar Metricas de Campo (RUM)
Fontes:
- Chrome UX Report (CrUX) — dados reais de usuarios Chrome
- Google Search Console — CWV report
- RUM SDK (web-vitals library)

### 3. Analisar LCP
| Causa comum | Diagnostico | Fix |
|------------|-----------|-----|
| Slow server response | TTFB > 0.8s | CDN, caching, edge functions |
| Render-blocking resources | CSS/JS blocking | Critical CSS inline, defer JS |
| Slow resource loading | LCP image/font | Preload, optimize, CDN |
| Client-side rendering | CSR delay | SSR/SSG, streaming |
| Large LCP element | Image > 200KB | Compress, responsive images |

### 4. Analisar INP
| Causa comum | Diagnostico | Fix |
|------------|-----------|-----|
| Long tasks | Main thread > 50ms | Code splitting, web workers |
| Heavy event handlers | Click/input handler slow | Debounce, optimize |
| Large DOM | > 1500 elements | Virtualization, pagination |
| Third-party scripts | Blocking interactions | Defer, facade |
| Layout thrashing | Read-write loops | Batch DOM operations |

### 5. Analisar CLS
| Causa comum | Diagnostico | Fix |
|------------|-----------|-----|
| Images sem dimensoes | No width/height | Always set dimensions |
| Ads/embeds sem espaco | Dynamic content | Reserve space |
| Web fonts FOUT/FOIT | Font swap causing shift | font-display: optional |
| Dynamic content insert | Above-fold injection | Reserve space, transform |
| Animations | Layout-triggering | Use transform only |

### 6. Gerar Report
```yaml
cwv_audit:
  date: ""
  urls_audited: []

  results:
    - url: ""
      lcp:
        value: ""
        rating: "[good/needs-improvement/poor]"
        element: ""
        bottleneck: ""
      inp:
        value: ""
        rating: ""
        worst_interaction: ""
        bottleneck: ""
      cls:
        value: ""
        rating: ""
        largest_shift: ""
        cause: ""

  overall_verdict: "[CERTIFIED/EXCEEDS_BUDGET/FAIL]"

  remediation:
    - issue: ""
      metric: ""
      impact: "[high/medium/low]"
      fix: ""
      effort: ""
      owner: ""
```

## Saida
- CWV audit report
- Per-URL metrics table
- Bottleneck analysis
- Remediation plan priorizado
- Verdict (CERTIFIED/EXCEEDS_BUDGET/FAIL)

## Validacao
- [ ] Todas as URLs auditadas
- [ ] LCP, INP, CLS medidos (lab)
- [ ] Field data coletado (se disponivel)
- [ ] Bottlenecks identificados
- [ ] Remediation plan com owners
- [ ] Verdict comunicado ao Nexus
