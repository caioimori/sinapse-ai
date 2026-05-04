---
task: create-product-tracking-plan
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

# Create Product Tracking Plan

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium-High
- **Estimated Time:** 4-6 hours
- **Produces:** Tracking plan, event taxonomy, metric definitions, implementation spec

## Purpose
Definir plano de tracking completo para medir product metrics de forma consistente e confiavel. Um bom tracking plan e a fundacao de todas as decisoes baseadas em dados.

## Steps

### Step 1: Define Metric Framework
**North Star Metric:**
```
Metric: [the ONE metric that best captures value delivered to users]
Formula: [how it is calculated]
Leading Indicators: [metrics that predict North Star movement]
Lagging Indicators: [metrics that confirm North Star impact]
```

**Metric Hierarchy:**
| Level | Metrics | Review Cadence |
|-------|---------|---------------|
| North Star | [1 metric] | Weekly |
| L1 — Acquisition | [signup rate, CAC, channel mix] | Weekly |
| L1 — Activation | [activation rate, time-to-value, aha completion] | Weekly |
| L1 — Engagement | [DAU/MAU, session frequency, feature adoption] | Weekly |
| L1 — Retention | [D7/D30/D90, cohort curves, churn rate] | Weekly |
| L1 — Revenue | [ARPU, MRR, expansion revenue, LTV] | Monthly |
| L2 — Feature | [per-feature adoption, usage depth] | Bi-weekly |

### Step 2: Design Event Taxonomy
**Naming Convention:**
```
Format: [object]_[action]
Examples: page_viewed, button_clicked, form_submitted, feature_activated
```

**Event Categories:**
| Category | Purpose | Examples |
|----------|---------|---------|
| Pageview | Navigation tracking | page_viewed |
| Interaction | User actions | button_clicked, form_submitted |
| Lifecycle | Key moments | account_created, trial_started, plan_upgraded |
| Feature | Feature usage | feature_activated, feature_completed |
| Error | Failures | error_occurred, payment_failed |
| System | Backend events | email_sent, notification_delivered |

### Step 3: Define Event Spec (per event)
**Event Card:**
```
EVENT: [event_name]
────────────────────────────────
Category: [pageview|interaction|lifecycle|feature|error|system]
Trigger: [exactly when this fires]
Description: [what this event represents]

Properties:
| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| [prop_1] | string | Yes | [what it captures] | [example value] |
| [prop_2] | number | Yes | [what it captures] | [example value] |
| [prop_3] | string | No | [what it captures] | [example value] |

User Properties (attached to all events):
| Property | Type | Description |
|----------|------|-------------|
| user_id | string | Unique user identifier |
| account_id | string | Organization/account identifier |
| plan_type | string | Current subscription plan |
| user_role | string | Role within the product |
| signup_date | date | When user first signed up |

Funnel Membership: [which funnels this event belongs to]
Dashboard: [which dashboard uses this metric]
Owner: [who is responsible for this event]
```

### Step 4: Map Events to Funnels
**Core Funnels:**
```
ACQUISITION FUNNEL:
landing_page_viewed → signup_started → signup_completed → email_verified

ACTIVATION FUNNEL:
first_login → onboarding_started → [key_action_1] → [key_action_2] → aha_moment_reached

CONVERSION FUNNEL:
trial_started → feature_explored → pricing_viewed → checkout_started → payment_completed

ENGAGEMENT FUNNEL:
session_started → [primary_action] → [secondary_action] → session_ended
```

### Step 5: Data Quality Rules
**Validation Rules:**
| Rule | Description | Impact if Violated |
|------|-------------|-------------------|
| Required properties always present | Every event has user_id + timestamp | Cannot attribute events |
| No duplicate events | Same event + timestamp + user = 1 record | Inflated metrics |
| Consistent naming | All events follow taxonomy convention | Broken dashboards |
| Property type enforcement | Numbers are numbers, strings are strings | Analysis errors |
| Event ordering | Timestamps sequential within session | Funnel miscalculation |

**QA Checklist Before Launch:**
- [ ] All events fire in correct sequence
- [ ] Properties have correct types and values
- [ ] No PII (personally identifiable information) in event properties
- [ ] Events fire on all platforms (web, mobile, API)
- [ ] Duplicate prevention works
- [ ] Events appear in analytics tool within expected latency

### Step 6: Implementation Spec for Engineering
**Per Event Group:**
```
Implementation Priority: P0 (launch blocker) | P1 (week 1) | P2 (week 2)
Platform: Web | Mobile | Backend | All
Analytics Tool: [Amplitude/Mixpanel/Segment/etc.]
Code Location: [where tracking code should go]
Test Method: [how to verify it works]
```

## Output Artifacts
- `tracking-plan.md` | `event-taxonomy.md` | `event-specs/[event-name].md` | `funnel-definitions.md` | `data-quality-rules.md`

## Quality Criteria
- North Star metric defined | Naming convention consistent | Every event has trigger + properties + owner | Funnels mapped to events | Data quality rules specified | No PII in events | Implementation priority assigned
