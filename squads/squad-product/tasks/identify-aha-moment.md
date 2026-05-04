---
task: identify-aha-moment
responsavel: "@ps-discovery-lead"
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

# Identify Aha Moment

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** High
- **Estimated Time:** 4-6 hours (analysis) + ongoing monitoring
- **Produces:** Aha moment definition, activation metrics, onboarding optimization recommendations

## Purpose
Identificar o momento exato em que usuarios percebem valor do produto (Aha Moment). Essencial para otimizar onboarding, reducir churn e acelerar ativacao. Referencia: Chamath Palihapitiya (Facebook Growth), Hiten Shah, Wes Bush (Product-Led Growth).

## Steps

### Step 1: Hypothesize Aha Moment Candidates
**Common patterns by product type:**
| Product Type | Typical Aha Moment |
|-------------|-------------------|
| SaaS Tool | First successful task completion |
| Marketplace | First match/transaction |
| Content platform | First content that resonates |
| Communication tool | First reply/response received |
| Analytics tool | First insight that changes a decision |
| Collaboration tool | First team interaction |

**Generate Candidates:**
- From user interviews: "When did you realize this product was valuable?"
- From analytics: What actions correlate with retention?
- From support: What do successful users do that churned users did not?
- From power users: What was the turning point?

**Candidate List:**
| # | Candidate Aha Moment | Data Source | Hypothesis Strength |
|---|---------------------|-----------|-------------------|
| 1 | [action/event] | [interviews/analytics/both] | High/Med/Low |
| 2 | [action/event] | [interviews/analytics/both] | High/Med/Low |
| 3 | [action/event] | [interviews/analytics/both] | High/Med/Low |

### Step 2: Quantitative Validation
**For each candidate, analyze correlation with retention:**

**Cohort Analysis:**
```
Users who did [candidate action] within [timeframe]:
  - Day 7 retention: [%]
  - Day 30 retention: [%]
  - Day 90 retention: [%]

Users who did NOT do [candidate action] within [timeframe]:
  - Day 7 retention: [%]
  - Day 30 retention: [%]
  - Day 90 retention: [%]

Delta (lift): [percentage point difference]
```

**Threshold Analysis:**
- Test different thresholds: Did it once? 3 times? Within 1 day? 7 days?
- Find the threshold that maximizes retention delta

**Statistical Significance:**
- Sample size sufficient? (min 100 per cohort)
- Chi-square or Fisher test for significance
- Control for confounders (user segment, acquisition channel)

### Step 3: Qualitative Validation
**Interview Activated Users:**
- "Tell me about the moment you realized this product was worth using"
- "What changed between your first visit and when you decided to stay?"
- "If you had to convince a friend to try this, what would you tell them?"

**Interview Churned Users:**
- "What were you hoping to achieve?"
- "At what point did you decide it was not working for you?"
- "What would have changed your mind?"

**Pattern Match:** Does the qualitative "aha" match the quantitative retention driver?

### Step 4: Define the Aha Moment
**Aha Moment Statement:**
```
When a [user type] performs [specific action]
[N times] within [timeframe] of signing up,
they are [X%] more likely to become a retained user
(vs [Y%] for users who do not reach this milestone).

Retention lift: [X-Y] percentage points
Time to Aha (median): [N days/hours]
Current reach rate: [% of new users who reach Aha]
```

### Step 5: Define Activation Metric
**Based on Aha Moment, create trackable metric:**

```
ACTIVATION METRIC
────────────────────────────────
Name: [descriptive name]
Definition: [exact event/action that counts]
Timeframe: [within N days of signup]
Threshold: [min occurrences or value]
Current rate: [% of new users activated]
Target rate: [% goal]
Measurement: [analytics event/query]
```

**Activation Funnel:**
```
Signup → [Step 1] → [Step 2] → [AHA MOMENT] → Retained User
[100%]   [X%]       [Y%]       [Z%]           [W%]
```

### Step 6: Onboarding Optimization Recommendations
**Reduce Time-to-Aha:**
| Barrier | Current Impact | Recommendation | Expected Lift |
|---------|---------------|----------------|---------------|
| [what blocks users from Aha] | [% drop-off here] | [specific change] | [estimated improvement] |

**Key Strategies:**
- Remove steps between signup and Aha moment
- Add guided tours that lead TO the Aha action
- Use empty states that prompt the Aha action
- Send triggered emails/notifications when users stall before Aha
- Personalize onboarding path by user segment

## Output Artifacts
- `aha-moment-analysis.md` | `activation-metric-definition.md` | `activation-funnel.md` | `onboarding-optimization-recommendations.md`

## Quality Criteria
- Min 3 candidates tested quantitatively | Retention correlation validated with sufficient sample | Qualitative and quantitative evidence aligned | Activation metric clearly defined and measurable | Onboarding recommendations specific and prioritized
