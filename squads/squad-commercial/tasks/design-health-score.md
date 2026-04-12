---
task: design-health-score
responsavel: "@cs-client-success"
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

# Task: Design Health Score

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Advanced

## Objetivo
Desenhar Customer Health Score — composite score preditivo que combina usage, satisfaction, outcomes e engagement para identificar clientes saudaveis, em risco e com potencial de expansao.

## Entrada
- Client portfolio data
- Product/service usage metrics
- Support ticket data
- NPS/satisfaction data
- Contract and billing data

## Passos

### 1. Health Score Dimensions (Gainsight Framework)
| Dimension | Weight | Data Source | Scoring |
|-----------|--------|-----------|---------|
| **Usage/Engagement** | 25-40% | Analytics, deliverables consumed | High/Med/Low activity |
| **Feature Adoption** | 15-25% | Product analytics, service utilization | Key features adopted? |
| **Support Health** | 10-15% | Ticket volume, sentiment, resolution | Low tickets + fast resolution |
| **Satisfaction** | 10-15% | NPS, CSAT, QBR feedback | Score and trend |
| **Contract Health** | 10-20% | Billing, renewal date, growth | On time, growth signals |
| **Business Outcomes** | 15-20% | KPI tracking, ROI reports | Outcomes achieved? |

### 2. Scoring Scale per Dimension
| Dimension | Green (3 pts) | Yellow (2 pts) | Red (1 pt) |
|-----------|-------------|---------------|-----------|
| Usage | Active weekly, all deliverables consumed | Biweekly activity | Monthly or less |
| Adoption | Using 80%+ of service scope | 50-79% | <50% |
| Support | <2 tickets/mo, positive sentiment | 2-5 tickets, neutral | 5+ tickets, negative |
| Satisfaction | NPS 9-10 (Promoter) | NPS 7-8 (Passive) | NPS 0-6 (Detractor) |
| Contract | Growing, early renewal signals | Status quo | Late payments, downgrade talk |
| Outcomes | KPIs met or exceeded | Partial KPI achievement | KPIs not met |

### 3. Health Score Calculation
```
Health Score = Σ (Dimension Score × Weight) / Max Possible × 100

Color Coding:
  Green (80-100): Healthy — expansion candidate
  Yellow (50-79): At risk — proactive intervention needed
  Red (0-49): Critical — save play required

Distribution Target:
  Green: 70%+ of portfolio
  Yellow: 20-25%
  Red: <10%
```

### 4. Alert & Action Rules
| Score Change | Alert | Action |
|-------------|-------|--------|
| Green → Yellow | CSM notified | Schedule proactive check-in within 48h |
| Yellow → Red | CSM + Manager notified | Execute save play within 24h |
| Red → Yellow | CSM notified (positive) | Continue monitoring, validate recovery |
| Any → Green | Celebrate | Consider for expansion, advocacy |
| Stable Red > 30 days | VP escalation | Executive intervention required |

### 5. Health Score Dashboard
| View | Content | Audience |
|------|---------|----------|
| Portfolio Overview | Distribution pie + trend line | CS Leadership |
| Account Detail | Score breakdown per dimension | CSM |
| At-Risk List | All Yellow/Red sorted by ARR | CS Leadership |
| Expansion Candidates | Green accounts with growth signals | CS + Sales |

## Saida
- Health Score model documented
- Scoring algorithm configured
- Alert rules active
- Dashboard live

## Validacao
- [ ] All dimensions weighted and sourced
- [ ] Scoring criteria specific and measurable
- [ ] Alerts configured for score transitions
- [ ] Historical correlation: Red accounts churn more (validated)
