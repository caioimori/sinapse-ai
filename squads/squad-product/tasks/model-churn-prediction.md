---
task: model-churn-prediction
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

# Model Churn Prediction

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** High
- **Estimated Time:** 4-6 hours
- **Produces:** Churn prediction model, risk scores, early warning signals, intervention playbook

## Purpose
Construir modelo preditivo de churn para identificar usuarios em risco ANTES de cancelarem. Foco em sinais comportamentais acionaveis, nao apenas correlacoes estatisticas.

## Steps

### Step 1: Define Churn
**Churn Definition (be specific):**
```
A user is considered churned when:
  [specific behavioral definition]

Examples:
  - SaaS: No login for 30 consecutive days
  - Subscription: Subscription cancelled or not renewed
  - Freemium: No core action for 14 days
  - Agency client: Contract not renewed at end of term
```

**Churn Types to Track:**
| Type | Definition | Prediction Window |
|------|-----------|------------------|
| Voluntary churn | User actively cancels | 30-60 days ahead |
| Involuntary churn | Payment failure, no renewal | 7-14 days ahead |
| Silent churn | Gradual disengagement, stops using | 14-30 days ahead |
| Downgrade | Moves to lower plan | 30 days ahead |

### Step 2: Identify Leading Indicators
**Behavioral Signals (from analytics):**
| Signal | Typical Pattern | Weight |
|--------|----------------|--------|
| Login frequency decline | 50%+ drop vs previous period | High |
| Core feature usage decline | Stopped using primary feature | High |
| Session duration decline | Shorter sessions over time | Medium |
| Support ticket spike | 3+ tickets in a week | Medium |
| Feature exploration stops | Only uses 1-2 features | Medium |
| Export/download spike | Extracting data before leaving | High |
| Billing page visits | Checking plan/cancellation | Very High |
| Invite/sharing stops | No collaborative activity | Medium |
| Error encounter rate | Frequent errors without resolution | Medium |

**Engagement Score (composite):**
```
Engagement Score = w1 × (login frequency normalized) +
                   w2 × (core feature usage normalized) +
                   w3 × (feature breadth normalized) +
                   w4 × (session depth normalized) +
                   w5 × (collaboration activity normalized)

Score range: 0-100
Risk bands: >70 = Safe | 40-70 = Monitor | <40 = At Risk
```

### Step 3: Build Risk Scoring Model
**Simple Heuristic Model (start here):**
| Risk Factor | Points | Condition |
|------------|--------|-----------|
| Login decline >50% | +30 | vs 30-day average |
| No core action 7+ days | +25 | Feature X not used |
| Support tickets 3+ (week) | +15 | Recent week |
| NPS detractor | +15 | Last survey score 0-6 |
| Billing page visit | +20 | In last 14 days |
| Session duration decline >40% | +10 | vs 30-day average |
| Error encounters +3 (week) | +10 | Unresolved errors |
| No feature exploration | +5 | Same features only |
| **TOTAL POSSIBLE** | **130** | |

**Risk Tiers:**
| Score | Risk Level | % Likely to Churn | Action |
|-------|-----------|-------------------|--------|
| 0-25 | Low | <5% | Monitor |
| 26-50 | Medium | 10-25% | Proactive outreach |
| 51-80 | High | 25-50% | Urgent intervention |
| 81+ | Critical | >50% | Emergency save attempt |

### Step 4: Validate Model (Backtest)
**Validation Method:**
1. Take 3-6 months of historical data
2. Calculate risk scores for each user at each point in time
3. Compare predicted risk with actual churn outcome
4. Calculate model accuracy:

```
Precision = True Positives / (True Positives + False Positives)
  "Of those we flagged as at-risk, how many actually churned?"

Recall = True Positives / (True Positives + False Negatives)
  "Of those who churned, how many did we flag?"

F1 Score = 2 × (Precision × Recall) / (Precision + Recall)
  Target: >0.70
```

**Confusion Matrix:**
```
                  Predicted: Churn    Predicted: Stay
Actual: Churned    [True Positive]    [False Negative]
Actual: Stayed     [False Positive]    [True Negative]
```

### Step 5: Design Intervention Playbook
**Per Risk Level:**
```
RISK LEVEL: [Medium / High / Critical]
─────────────────────────────────────
Trigger: Score reaches [threshold]
Timeline: Intervene within [N days]

INTERVENTION SEQUENCE:
1. [Day 0] Automated: [email/in-app message]
   Content: [personalized based on risk factor]
2. [Day 3] Personal: [CS outreach]
   Script: [what to say/ask]
3. [Day 7] Escalation: [manager/product lead involvement]
   Offer: [retention offer if applicable]
4. [Day 14] Final: [exit interview / save attempt]

SUCCESS CRITERIA: User engagement score returns to >70 within 30 days
TRACKING: Log intervention + outcome for model improvement
```

### Step 6: Monitoring & Iteration
**Weekly Churn Dashboard:**
| Metric | This Week | Last Week | Trend |
|--------|----------|----------|-------|
| Users at Critical risk | [N] | [N] | [direction] |
| Users at High risk | [N] | [N] | [direction] |
| Interventions triggered | [N] | [N] | |
| Saves (returned to Low risk) | [N] | [N] | |
| Actual churns | [N] | [N] | |
| Model accuracy (rolling 30d) | [%] | [%] | |

**Model Improvement Cycle:**
- Monthly: Review false positives and false negatives
- Quarterly: Retrain weights based on new data
- Continuous: Add new signals as product evolves

## Output Artifacts
- `churn-prediction-model.md` | `risk-scoring-rules.md` | `intervention-playbook.md` | `model-validation-results.md` | `churn-dashboard-spec.md`

## Quality Criteria
- Churn clearly defined | Leading indicators identified from data (not assumed) | Risk score model documented with weights | Backtested against historical data | F1 score > 0.70 | Intervention playbook per risk level | Monthly review process defined
