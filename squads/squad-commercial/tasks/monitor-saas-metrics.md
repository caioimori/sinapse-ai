---
task: monitor-saas-metrics
responsavel: "@cs-revops-analyst"
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

# Task: Monitor SaaS Metrics

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Standard

## Objetivo
Monitorar metricas SaaS/recurring revenue continuamente — tracking de ARR, MRR, NRR, GRR, Quick Ratio e Magic Number com alertas para desvios significativos.

## Entrada
- Revenue data (invoicing/billing)
- Customer data (new, churned, expanded)
- S&M spend data
- Historical trends

## Passos

### 1. Monthly Metrics Dashboard
| Metric | Formula | This Month | Last Month | MoM | Target |
|--------|---------|-----------|-----------|-----|--------|
| MRR | Sum of monthly recurring | R$ | R$ | % | |
| ARR | MRR × 12 | R$ | R$ | % | |
| New MRR | From new customers | R$ | R$ | % | |
| Expansion MRR | Upsells + cross-sells | R$ | R$ | % | |
| Contraction MRR | Downgrades | R$ | R$ | % | |
| Churned MRR | Lost customers | R$ | R$ | % | |
| Net New MRR | New + Exp - Con - Churn | R$ | R$ | % | |

### 2. Efficiency Metrics
| Metric | This Q | Last Q | Trend | Benchmark |
|--------|--------|--------|-------|-----------|
| NRR | % | % | | 120%+ |
| GRR | % | % | | 90%+ |
| Quick Ratio | x | x | | >4 |
| Magic Number | | | | >0.75 |
| CAC Payback | mo | mo | | <18 mo |
| LTV:CAC | x | x | | >3:1 |
| Burn Multiple | x | x | | <2 |

### 3. MRR Waterfall
```
MONTHLY MRR WATERFALL — [Month Year]

Beginning MRR:     R$ ________
+ New MRR:         R$ ________ (__ new customers)
+ Expansion MRR:   R$ ________ (__ accounts expanded)
- Contraction MRR: R$ ________ (__ accounts contracted)
- Churned MRR:     R$ ________ (__ accounts lost)
═══════════════════════════════
Ending MRR:        R$ ________
Net Change:        R$ ________ (+/- __%)
```

### 4. Alert Thresholds
| Metric | Yellow Alert | Red Alert | Action |
|--------|-------------|-----------|--------|
| MRR growth | < target pace | Negative growth | Pipeline review |
| Churn rate | > 1.5% monthly | > 2% monthly | CS intervention |
| NRR | < 110% | < 100% | Expansion + retention focus |
| Quick Ratio | < 3 | < 2 | Urgent growth/churn fix |
| Magic Number | < 0.6 | < 0.4 | S&M efficiency review |

## Saida
- Monthly SaaS metrics dashboard
- MRR waterfall visualization
- Alert configuration
- Quarterly trend report

## Validacao
- [ ] All core SaaS metrics tracked
- [ ] MRR waterfall accurate to billing data
- [ ] Alerts configured and tested
- [ ] Trends show 6+ months of data
