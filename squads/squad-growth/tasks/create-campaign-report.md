---
task: create-campaign-report
responsavel: "@ga-campaign-analyst"
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

# Task: Create Campaign Report

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Criar report de campanhas — compilar performance de todas as campanhas de marketing em relatorio estruturado, com insights acionaveis e recomendacoes para o proximo periodo.

## Entrada
- Campaign performance data (all channels)
- Budget vs actual spend
- Conversion data
- Previous period data (for comparison)
- Business goals/targets

## Passos

### 1. Report Structure
| Secao | Conteudo | Paginas |
|-------|---------|---------|
| Executive Summary | Top 3 highlights, overall health | 1 |
| Budget & Spend | Planned vs actual, pacing | 1 |
| Channel Performance | Per-channel KPIs | 2-3 |
| Campaign Highlights | Top/bottom performers | 1-2 |
| Creative Performance | Best/worst creatives | 1 |
| Conversion Analysis | Funnel, attribution | 1 |
| Insights & Learnings | Data-driven takeaways | 1 |
| Recommendations | Prioritized next actions | 1 |

### 2. Executive Summary Template
```
CAMPAIGN PERFORMANCE — [Month/Quarter] [Year]

OVERALL HEALTH: [Green On Track / Yellow Attention / Red Behind]

TOP 3 HIGHLIGHTS:
1. [Highlight 1 — most impactful positive result]
2. [Highlight 2 — notable achievement or learning]
3. [Highlight 3 — emerging opportunity or concern]

KEY METRICS:
| Metric     | Actual    | Target    | Status |
|------------|-----------|-----------|--------|
| Revenue    | R$X       | R$Y       | +/-Z%  |
| ROAS       | X.Xx      | Y.Yx      | +/-Z%  |
| CAC        | R$X       | R$Y       | +/-Z%  |
| Conversions| X         | Y         | +/-Z%  |
```

### 3. Budget Tracking
| Canal | Budget | Actual Spend | Variance | Pacing |
|-------|--------|-------------|----------|--------|
| Paid Search | | | +/-% | On/Over/Under |
| Paid Social | | | +/-% | |
| Display | | | +/-% | |
| Other | | | +/-% | |
| **Total** | | | +/-% | |

### 4. Channel Performance Summary
| Canal | Impressions | Clicks | CTR | CPC | Conversions | CVR | Revenue | ROAS | CAC |
|-------|-----------|--------|-----|-----|-----------|-----|---------|------|-----|
| Paid Search | | | | | | | | | |
| Paid Social | | | | | | | | | |
| Display | | | | | | | | | |
| Email | | | | | | | | | |
| **Total** | | | | | | | | | |

### 5. Campaign Highlights
**Top 5 Performers:**
| Rank | Campaign | Canal | Spend | Revenue | ROAS | Key Insight |
|------|---------|-------|-------|---------|------|------------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

**Bottom 3 Performers:**
| Rank | Campaign | Canal | Spend | Revenue | ROAS | Issue | Action |
|------|---------|-------|-------|---------|------|-------|--------|
| 1 | | | | | | | |
| 2 | | | | | | | |

### 6. Insights & Learnings
| # | Insight | Data Support | Implication | Confidence |
|---|---------|-------------|-------------|-----------|
| 1 | | "We observed X, which resulted in Y" | "This means..." | High/Med/Low |
| 2 | | | | |
| 3 | | | | |

**Insight quality criteria:**
- Backed by data (not opinion)
- Actionable (leads to specific action)
- Non-obvious (adds value beyond raw numbers)
- Contextualized (compared to benchmark/prior period)

### 7. Recommendations
| # | Recommendation | Expected Impact | Effort | Priority | Owner |
|---|---------------|----------------|--------|----------|-------|
| 1 | | R$ or % improvement | Low/Med/High | P0 | |
| 2 | | | | P1 | |
| 3 | | | | P1 | |

### 8. Report Delivery
| Formato | Audiencia | Frequencia | Prazo |
|---------|----------|-----------|-------|
| Slide deck | CMO, VP Marketing | Monthly | 5th business day |
| Dashboard link | Marketing team | Weekly | Monday morning |
| Email digest | Stakeholders | Weekly | Friday EOD |
| Detailed doc | Campaign managers | Monthly | 3rd business day |

## Saida
- Campaign performance report
- Executive summary
- Channel-level analysis
- Campaign highlights (top/bottom)
- Insights & learnings
- Prioritized recommendations

## Validacao
- [ ] Executive summary com 3 highlights
- [ ] Budget tracking completo
- [ ] Todos canais analisados
- [ ] Top/bottom campaigns identificados
- [ ] Insights baseados em dados
- [ ] Recomendacoes priorizadas com impacto
- [ ] Comparacao com periodo anterior
