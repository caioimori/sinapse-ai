---
task: calculate-product-health-metrics
responsavel: "@ps-product-analyst"
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

# Calculate Product Health Metrics

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours (setup) + weekly updates
- **Produces:** Product health scorecard, metric calculations, trend analysis, health alerts

## Purpose
Calcular metricas compostas de saude do produto de forma consistente e reproducivel. Formulas padronizadas para garantir que todos estejam olhando os mesmos numeros.

## Steps

### Step 1: Core Metric Formulas

**Acquisition Metrics:**
```
Signup Rate = New Signups / Unique Visitors × 100
CAC (Customer Acquisition Cost) = Total Marketing Spend / New Customers
Viral Coefficient (K) = Invitations per User × Conversion Rate of Invitations
Payback Period = CAC / Monthly Revenue per Customer
```

**Activation Metrics:**
```
Activation Rate = Users who complete Aha Moment / Total Signups × 100
Time to Value (TTV) = Median(Aha Moment Timestamp - Signup Timestamp)
Onboarding Completion Rate = Users who complete onboarding / Users who started × 100
Setup Success Rate = Users with complete setup / Total new users × 100
```

**Engagement Metrics:**
```
DAU/MAU Ratio = Daily Active Users / Monthly Active Users
  (>25% = excellent engagement, 15-25% = good, <15% = concerning)

Stickiness = DAU / WAU (or DAU/MAU)
Session Frequency = Total Sessions / Unique Users (per period)
Session Duration = Avg(session_end - session_start)
Feature Adoption Rate = Users of Feature X / Total Active Users × 100
Depth of Engagement = Core Actions per Session (avg)
```

**Retention Metrics:**
```
D7 Retention = Users active on Day 7 / Users who signed up on Day 0 × 100
D30 Retention = Users active on Day 30 / Users who signed up on Day 0 × 100
Churn Rate (Monthly) = Customers Lost / Customers at Start of Month × 100
Net Revenue Retention = (MRR Start + Expansion - Contraction - Churn) / MRR Start × 100
Logo Retention = (Customers Start - Churned) / Customers Start × 100
```

**Revenue Metrics:**
```
MRR = Sum of all active monthly recurring subscriptions
ARR = MRR × 12
ARPU (Average Revenue Per User) = Total Revenue / Total Active Users
ARPPU (Average Revenue Per Paying User) = Total Revenue / Paying Users
LTV = ARPU × Average Customer Lifetime (months)
LTV/CAC Ratio = LTV / CAC (target: >3x)
Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churn MRR)
  (>4 = excellent growth efficiency, 2-4 = good, <2 = leaky bucket)
```

### Step 2: Product Health Score (Composite)
**4-Domain Model:**
```
Product Health Score = (Product Metrics × 0.30) +
                       (Delivery Health × 0.25) +
                       (Client Health × 0.25) +
                       (Strategic Progress × 0.20)
```

**Product Metrics Sub-Score (30%):**
| Metric | Weight | Current | Target | Score (0-100) |
|--------|--------|---------|--------|--------------|
| Activation Rate | 25% | [%] | [%] | [0-100] |
| D30 Retention | 25% | [%] | [%] | [0-100] |
| Feature Adoption (core) | 20% | [%] | [%] | [0-100] |
| NPS | 15% | [score] | [score] | [0-100] |
| Error Rate | 15% | [%] | [<%] | [0-100] |

**Delivery Health Sub-Score (25%):**
| Metric | Weight | Current | Target | Score (0-100) |
|--------|--------|---------|--------|--------------|
| Sprint Velocity Consistency | 30% | [%] | [%] | [0-100] |
| Deployment Frequency | 25% | [/week] | [/week] | [0-100] |
| Bug Escape Rate | 25% | [%] | [<%] | [0-100] |
| Tech Debt Ratio | 20% | [%] | [<%] | [0-100] |

**Client Health Sub-Score (25%):**
| Metric | Weight | Current | Target | Score (0-100) |
|--------|--------|---------|--------|--------------|
| Client Satisfaction (CSAT) | 35% | [score] | [score] | [0-100] |
| On-time Delivery | 30% | [%] | [%] | [0-100] |
| Scope Creep | 20% | [%] | [<%] | [0-100] |
| Communication Quality | 15% | [score] | [score] | [0-100] |

**Strategic Progress Sub-Score (20%):**
| Metric | Weight | Current | Target | Score (0-100) |
|--------|--------|---------|--------|--------------|
| OKR Progress | 40% | [avg score] | [0.6-0.7] | [0-100] |
| Roadmap Completion | 30% | [%] | [%] | [0-100] |
| Discovery Velocity | 30% | [experiments/quarter] | [target] | [0-100] |

### Step 3: Health Bands
| Score Range | Status | Action |
|------------|--------|--------|
| 80-100 | GREEN — Healthy | Monitor, optimize |
| 60-79 | YELLOW — Needs Attention | Investigate, plan improvements |
| 40-59 | ORANGE — At Risk | Immediate action required |
| 0-39 | RED — Critical | Escalate, emergency intervention |

### Step 4: Trend Analysis
**Week-over-Week Movement:**
| Metric | 4 wks ago | 3 wks ago | 2 wks ago | Last wk | This wk | Trend |
|--------|----------|----------|----------|---------|---------|-------|
| Health Score | [N] | [N] | [N] | [N] | [N] | [arrow] |
| Product | [N] | [N] | [N] | [N] | [N] | [arrow] |
| Delivery | [N] | [N] | [N] | [N] | [N] | [arrow] |
| Client | [N] | [N] | [N] | [N] | [N] | [arrow] |
| Strategic | [N] | [N] | [N] | [N] | [N] | [arrow] |

### Step 5: Alert Rules
| Condition | Alert Level | Action |
|-----------|------------|--------|
| Any domain drops to ORANGE | Warning | Notify product lead |
| Overall score drops to ORANGE | Urgent | Notify stakeholders + action plan |
| Any domain drops to RED | Critical | Emergency review meeting |
| 3 consecutive weeks declining | Trend Alert | Root cause investigation |
| Metric data missing >24h | Data Alert | Check tracking/pipeline |

## Output Artifacts
- `product-health-scorecard.md` | `metric-formulas-reference.md` | `health-trend-analysis.md` | `health-alert-log.md`

## Quality Criteria
- All formulas documented with exact definitions | No ambiguous metric definitions | Health score reproducible (same data = same score) | Trends tracked over min 4 weeks | Alert thresholds defined | Sub-scores traceable to raw metrics
