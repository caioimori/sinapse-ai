---
task: build-client-product-success-plan
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

# Build Client Product Success Plan

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium-High
- **Estimated Time:** 4-6 hours
- **Produces:** Success plan, milestone map, health scorecard, escalation procedures

## Purpose
Criar plano de sucesso para engajamento de produto com cliente, definindo como medimos sucesso, marcos de valor e mecanismos de alerta precoce para riscos de churn.

## Steps

### Step 1: Define Success Criteria (with Client)
**Co-created Success Definition:**
```
SUCCESS PLAN: [Client Name] — [Product/Project Name]
──────────────────────────────────────────────────────
Engagement Start: [date]
Success Plan Created: [date]
Reviewed: [quarterly]

CLIENT DEFINITION OF SUCCESS:
"[In the client's own words, what does success look like?]"

QUANTIFIED SUCCESS METRICS:
| Metric | Baseline | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|---------|---------------|---------------|----------------|
| [metric 1] | [current] | [target] | [target] | [target] |
| [metric 2] | [current] | [target] | [target] | [target] |
| [metric 3] | [current] | [target] | [target] | [target] |
```

### Step 2: Milestone Map
**Value Delivery Milestones:**
| Milestone | Target Date | Success Criteria | Status |
|-----------|-----------|-----------------|--------|
| Quick Win (Month 1) | [date] | [tangible value delivered] | Pending |
| Foundation (Month 2-3) | [date] | [core capability live] | Pending |
| Growth (Month 4-6) | [date] | [metrics moving toward targets] | Pending |
| Maturity (Month 7-12) | [date] | [client-defined success achieved] | Pending |

**Quick Win Strategy (Critical for Early Trust):**
```
Objective: Deliver visible value within first 30 days
Candidate Quick Wins:
1. [Small but visible improvement that shows competence]
2. [Fix a known pain point quickly]
3. [Data insight that changes a decision]

Selected Quick Win: [choice]
Deadline: [30 days from start]
Owner: [who delivers]
```

### Step 3: Health Scorecard
**Monthly Client Health Assessment:**
| Dimension | Score (1-5) | Weight | Weighted Score | Notes |
|-----------|------------|--------|---------------|-------|
| Product Progress | | 25% | | On-track to milestones? |
| Relationship Quality | | 20% | | Communication satisfaction? |
| Value Perception | | 25% | | Client sees ROI? |
| Engagement Level | | 15% | | Client involved and responsive? |
| Strategic Alignment | | 15% | | Still aligned on direction? |
| **TOTAL** | | **100%** | **/5.0** | |

**Health Bands:**
| Score | Status | Action |
|-------|--------|--------|
| 4.0-5.0 | Healthy | Maintain, look for expansion |
| 3.0-3.9 | Attention | Proactive check-in, address concerns |
| 2.0-2.9 | At Risk | Escalation meeting, recovery plan |
| Below 2.0 | Critical | Executive escalation, emergency intervention |

### Step 4: Communication Cadence
**Structured Touchpoints:**
| Touchpoint | Frequency | Participants | Purpose |
|-----------|-----------|-------------|---------|
| Daily standup | Daily (async) | PM + dev lead | Progress + blockers |
| Weekly sync | Weekly | PM + client PO | Progress, decisions, priorities |
| Sprint demo | Bi-weekly | Full team + client | Showcase deliveries |
| Monthly metrics | Monthly | PM + client stakeholders | Performance review |
| QBR | Quarterly | PM + client leadership | Strategy + renewal |

### Step 5: Risk Monitoring & Escalation
**Early Warning Signals:**
| Signal | Detection Method | Severity | Response |
|--------|-----------------|----------|---------|
| Client stops attending meetings | Attendance tracking | HIGH | PM outreach within 24h |
| Feedback becomes negative | NPS/CSAT trend | MEDIUM | Root cause investigation |
| Response time increases | Communication tracking | MEDIUM | Gentle check-in |
| Scope disputes increase | Change request frequency | HIGH | Alignment meeting |
| Budget concerns raised | Client mentions | HIGH | Value demonstration + options |
| Champion leaves | Org change | CRITICAL | Relationship rebuilding plan |

**Escalation Path:**
```
Level 1 (PM resolves): Communication issues, minor scope questions
Level 2 (PM + Lead): Budget concerns, priority disagreements
Level 3 (Leadership): Contract disputes, strategic misalignment
Level 4 (Executive): At-risk account, potential churn
```

### Step 6: Success Plan Review (Quarterly)
**Review Agenda:**
- [ ] Milestone progress (on track / behind / ahead)
- [ ] Health score trend (improving / stable / declining)
- [ ] Metrics vs targets (meeting / missing / exceeding)
- [ ] Risk register update
- [ ] Success criteria still relevant? (pivot if needed)
- [ ] Next quarter milestones set

## Output Artifacts
- `success-plan-[client].md` | `milestone-map.md` | `health-scorecard-[month].md` | `escalation-procedures.md`

## Quality Criteria
- Success criteria co-created with client | Milestones time-bound with measurable criteria | Quick win delivered within 30 days | Health scored monthly | Escalation path clear | Quarterly review conducted
