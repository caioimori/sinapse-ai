---
task: build-unit-economics-model
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

# Task: Build Unit Economics Model

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Advanced

## Objetivo
Construir modelo de unit economics — CAC, LTV, CAC Payback, LTV:CAC ratio e Magic Number para entender a saude financeira do motor comercial e guiar decisoes de investimento.

## Entrada
- Revenue data (MRR/ARR)
- Sales & marketing spend
- Customer acquisition data
- Churn and expansion data

## Passos

### 1. Core Unit Economics
```
CAC (Customer Acquisition Cost):
  CAC = (Total Sales Spend + Total Marketing Spend) / New Customers Acquired
  Period: Quarterly (aligned with sales cycle)

LTV (Lifetime Value):
  Simple: LTV = ARPU × Gross Margin % × (1 / Monthly Churn Rate)
  Cohort: LTV = Σ (Monthly Revenue per Cohort × GM%) over customer lifetime

LTV:CAC Ratio:
  Ratio = LTV / CAC
  Target: ≥ 3:1 minimum, 5:1+ excellent
  Rule: If < 3:1, fix unit economics before scaling

CAC Payback Period:
  Payback = CAC / (Monthly ARPU × Gross Margin %)
  Target: < 12 months (consumer), < 18 months (SMB), < 24 months (enterprise)
```

### 2. Revenue Efficiency Metrics
```
Magic Number:
  = (Current Q ARR - Prior Q ARR) × 4 / Prior Q S&M Spend
  > 0.75: Invest more in S&M
  0.5-0.75: Optimize efficiency
  < 0.5: Fix product or GTM

SaaS Quick Ratio:
  = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
  > 4: Excellent
  2-4: Good
  1-2: Concerning
  < 1: Declining

Burn Multiple:
  = Net Burn / Net New ARR
  < 1: Efficient
  1-2: Acceptable for growth stage
  > 2: Inefficient
```

### 3. Model Template
| Metric | Q-2 | Q-1 | Current Q | Trend | Benchmark |
|--------|-----|-----|----------|-------|-----------|
| New Customers | | | | | |
| S&M Spend | R$ | R$ | R$ | | |
| CAC | R$ | R$ | R$ | ↑↓→ | Industry avg |
| ARPU (monthly) | R$ | R$ | R$ | | |
| Gross Margin | % | % | % | | 60-80% |
| Monthly Churn | % | % | % | | <1% |
| LTV | R$ | R$ | R$ | | |
| LTV:CAC | x | x | x | | ≥3:1 |
| CAC Payback | mo | mo | mo | | <18 mo |
| Magic Number | | | | | >0.75 |
| Quick Ratio | | | | | >4 |
| NRR | % | % | % | | >110% |

### 4. Scenario Modeling
| Scenario | CAC Change | Churn Change | Impact on LTV:CAC | Action |
|----------|-----------|-------------|-------------------|--------|
| Improve win rate +5pp | CAC ↓ 15% | — | +0.5x | Sales training |
| Reduce churn 0.5pp | — | LTV ↑ 20% | +0.8x | CS investment |
| Increase ARPU 10% | — | LTV ↑ 10% | +0.4x | Upsell program |
| Cut S&M 20% | CAC ↑ (fewer leads) | — | Depends | Efficiency first |

## Saida
- Unit economics model (spreadsheet/dashboard)
- Quarterly benchmark report
- Scenario analysis
- Investment recommendations

## Validacao
- [ ] All core metrics calculated with real data
- [ ] Trending over 3+ quarters
- [ ] Scenarios modeled for key decisions
- [ ] Board-ready presentation format
