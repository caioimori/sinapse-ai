---
task: manage-client-retainer
responsavel: "@ps-client-product-manager"
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

# Manage Client Retainer

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours/month
- **Produces:** Retainer utilization report, allocation plan, burn rate tracking, renewal recommendation

## Purpose
Gerenciar contrato de retainer de produto de forma transparente e eficiente, maximizando valor entregue dentro do budget acordado e mantendo saude da relacao comercial.

## Steps

### Step 1: Retainer Configuration
**Retainer Details:**
```
Client: [client name]
Contract Period: [start] — [end]
Monthly Hours: [N hours]
Hourly Rate: [$]
Monthly Value: [$]
Rollover Policy: [Yes/No — max N hours]
Overage Policy: [pre-approved / requires approval / blocked]
Renewal Date: [date]
```

### Step 2: Monthly Allocation Planning
**Hour Allocation Template:**
| Category | Hours | % of Total | Rationale |
|----------|-------|-----------|-----------|
| Feature Development | [N] | [%] | Sprint delivery |
| Bug Fixes & Support | [N] | [%] | Maintenance |
| Product Management | [N] | [%] | Planning, prioritization, communication |
| Discovery & Research | [N] | [%] | User research, validation |
| Tech Debt | [N] | [%] | Platform maintenance |
| Meetings & Communication | [N] | [%] | Standups, reviews, client calls |
| Buffer | [N] | [%] | Unplanned needs |
| **TOTAL** | **[N]** | **100%** | |

### Step 3: Weekly Burn Rate Tracking
**Tracking Dashboard:**
| Week | Hours Used | Cumulative | Budget Remaining | Burn Rate | Projected End |
|------|-----------|-----------|-----------------|-----------|---------------|
| W1 | [N] | [N] | [N] | [N/week] | [projected total at month end] |
| W2 | [N] | [N] | [N] | [N/week] | [updated projection] |
| W3 | [N] | [N] | [N] | [N/week] | [updated projection] |
| W4 | [N] | [N] | [N] | [N/week] | [updated projection] |

**Burn Rate Alerts:**
| Condition | Alert | Action |
|-----------|-------|--------|
| On pace (within ±10%) | GREEN | Continue as planned |
| Under-burning (>20% below pace) | YELLOW | Are we delivering enough value? |
| Over-burning (>20% above pace) | ORANGE | Discuss with client before overage |
| Will exceed budget | RED | Immediate scope negotiation |

### Step 4: Utilization Analysis
**Monthly Utilization Report:**
```
RETAINER UTILIZATION — [Month, Year]
────────────────────────────────────
Contract hours: [N]
Hours used: [N] ([%])
Rollover from previous: [N hours]
Total available: [N hours]
Remaining: [N hours]
Rollover to next month: [N hours (if policy allows)]

BREAKDOWN BY CATEGORY:
  Development: [N hours] ([%]) — [items delivered]
  Bugs/Support: [N hours] ([%]) — [issues resolved]
  PM Activities: [N hours] ([%]) — [activities]
  Discovery: [N hours] ([%]) — [research conducted]
  Tech Debt: [N hours] ([%]) — [items addressed]
  Meetings: [N hours] ([%]) — [meeting types]

VALUE DELIVERED:
  Features shipped: [N]
  Bugs fixed: [N]
  Metrics improved: [list]
  Strategic value: [qualitative assessment]
```

### Step 5: Client Retainer Health
**Retainer Health Indicators:**
| Indicator | Value | Status | Notes |
|-----------|-------|--------|-------|
| Utilization rate | [%] | [status] | Target: 85-95% |
| Value perception (client feedback) | [1-5] | [status] | Target: >= 4 |
| Scope creep incidents | [N/month] | [status] | Target: <2 |
| Hours in meetings vs delivery | [ratio] | [status] | Target: <25% meetings |
| Unplanned work % | [%] | [status] | Target: <20% |

**Health Bands:**
| Utilization | Client Satisfaction | Diagnosis | Action |
|------------|-------------------|-----------|--------|
| High + High | Ideal | Maintain and grow |
| High + Low | Busy but not valuable | Reprioritize toward higher-impact work |
| Low + High | Efficient | Consider scope expansion or rate adjustment |
| Low + Low | At risk | Urgent conversation needed |

### Step 6: Renewal Recommendation
**30 Days Before Renewal:**
```
RETAINER RENEWAL RECOMMENDATION
────────────────────────────────
Client: [name]
Current Contract: [hours] × [$rate] = [$total/month]
Contract Period: [dates]
Average Utilization: [%]
Client Satisfaction: [score/feedback]

RECOMMENDATION: [Renew As-Is / Increase / Decrease / Restructure / End]

RATIONALE:
[Evidence-based reasoning for recommendation]

IF RENEWAL:
  Proposed hours: [N] (same / increase by [N] / decrease by [N])
  Proposed rate: [$] (same / adjusted)
  Proposed term: [N months]
  New focus areas: [if any strategic shift]

IF RESTRUCTURE:
  Current issues: [what is not working]
  Proposed changes: [new structure]
  Expected improvement: [what changes]
```

## Output Artifacts
- `retainer-report-[client]-[month].md` | `retainer-allocation-plan.md` | `retainer-health-check.md` | `renewal-recommendation.md`

## Quality Criteria
- Hours tracked weekly | Burn rate monitored with alerts | Utilization within 85-95% | Value delivered documented monthly | Client health assessed | Renewal recommendation prepared 30 days before expiry
