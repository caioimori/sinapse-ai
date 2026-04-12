---
task: generate-product-metrics-report
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

# Generate Product Metrics Report

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Weekly/monthly product metrics report, narrative analysis, action recommendations

## Purpose
Gerar relatorio periodico de metricas de produto que transforma numeros em narrativa acionavel. O relatorio nao e apenas dados — e uma historia sobre o que esta acontecendo com o produto e o que fazer a respeito.

## Steps

### Step 1: Report Configuration
| Attribute | Value |
|-----------|-------|
| Report Type | Weekly / Monthly / Quarterly |
| Period | [date range] |
| Audience | [product team / stakeholders / client] |
| Distribution | [email / Slack / dashboard link] |
| Previous Period | [for comparison] |

### Step 2: Executive Summary (1 paragraph)
**Template:**
```
This [period], [product name] [improved/declined/maintained] overall health
from [previous score] to [current score]. [Top positive highlight in one sentence].
[Top concern in one sentence]. [Key action needed in one sentence].
```

**Example:**
"This week, ProductX maintained healthy performance at 74/100. Activation rate improved to 42% following onboarding changes (+5pp WoW). However, D30 retention continues to decline for the third consecutive week, now at 28% (-2pp). Recommend prioritizing retention investigation this sprint."

### Step 3: Key Metrics Dashboard
**Metric Summary Table:**
| Metric | Current | Previous | Change | Target | Status |
|--------|---------|----------|--------|--------|--------|
| Health Score | [N] | [N] | [+/-N] | [N] | GREEN/YELLOW/RED |
| North Star | [N] | [N] | [+/-N%] | [N] | GREEN/YELLOW/RED |
| Activation Rate | [%] | [%] | [+/-pp] | [%] | GREEN/YELLOW/RED |
| D30 Retention | [%] | [%] | [+/-pp] | [%] | GREEN/YELLOW/RED |
| DAU/MAU | [ratio] | [ratio] | [+/-] | [ratio] | GREEN/YELLOW/RED |
| NPS | [score] | [score] | [+/-] | [score] | GREEN/YELLOW/RED |
| Error Rate | [%] | [%] | [+/-pp] | [<%] | GREEN/YELLOW/RED |
| Sprint Velocity | [pts] | [pts] | [+/-] | [pts] | GREEN/YELLOW/RED |

**Status Legend:**
- GREEN: At or above target
- YELLOW: Within 10% of target
- RED: More than 10% below target

### Step 4: Narrative Analysis (per metric group)
**For Each Section, Write:**
```
WHAT HAPPENED: [factual description of metric movement]
WHY: [root cause analysis or hypothesis]
SO WHAT: [business impact of this movement]
NOW WHAT: [recommended action]
```

**Sections:**
1. **Acquisition & Growth** — new users, channels, CAC movement
2. **Activation & Onboarding** — activation rate, TTV, onboarding funnel
3. **Engagement & Usage** — DAU/MAU, feature usage, session metrics
4. **Retention & Churn** — cohort retention, churn rate, at-risk users
5. **Revenue & Monetization** — MRR movement, ARPU, conversion rate
6. **Quality & Performance** — error rate, latency, bug count, incidents

### Step 5: Highlights & Lowlights
**Top 3 Wins This Period:**
| Win | Impact | What Drove It |
|-----|--------|--------------|
| 1. [positive outcome] | [metric improvement] | [cause] |
| 2. [positive outcome] | [metric improvement] | [cause] |
| 3. [positive outcome] | [metric improvement] | [cause] |

**Top 3 Concerns This Period:**
| Concern | Impact | Recommended Action |
|---------|--------|-------------------|
| 1. [negative trend] | [metric decline] | [what to do] |
| 2. [negative trend] | [metric decline] | [what to do] |
| 3. [negative trend] | [metric decline] | [what to do] |

### Step 6: Experiment & Initiative Updates
**Active Experiments:**
| Experiment | Status | Preliminary Result | Expected Completion |
|-----------|--------|-------------------|-------------------|
| [name] | Running / Complete / Paused | [early signal if available] | [date] |

**Recently Shipped:**
| Feature/Change | Ship Date | Early Metrics | Notes |
|---------------|-----------|--------------|-------|
| [feature] | [date] | [initial data] | [observations] |

### Step 7: Action Items
**This Period Action Items:**
| Action | Owner | Priority | Due Date | Metric Impact |
|--------|-------|----------|----------|--------------|
| [action 1] | [agent/person] | P1/P2 | [date] | [which metric] |
| [action 2] | [agent/person] | P1/P2 | [date] | [which metric] |

**Carried Forward (unresolved from last period):**
| Action | Owner | Status | Blocker |
|--------|-------|--------|---------|
| [action] | [owner] | [in progress/blocked] | [what blocks it] |

## Output Artifacts
- `product-metrics-report-[period].md` | `metrics-narrative-[period].md` | `action-items-[period].md`

## Quality Criteria
- Every metric has comparison to previous period + target | Narrative explains WHY, not just WHAT | Recommendations are specific and assigned | Wins and concerns balanced (honest) | Action items have owners and deadlines | Report delivered within 24h of period end
