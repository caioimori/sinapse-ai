---
task: prepare-product-handoff-package
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

# Prepare Product Handoff Package

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** High
- **Estimated Time:** 8-12 hours (across 1-2 weeks)
- **Produces:** Complete handoff package with 10 documents, KT sessions, shadow period plan

## Purpose
Preparar pacote completo de handoff de produto para quando um cliente assume gestao interna, um novo PM entra, ou o contrato encerra. O handoff garante continuidade sem perda de conhecimento critico.

## Steps

### Step 1: Handoff Readiness Assessment
**Readiness Scorecard:**
| Dimension | Score (1-5) | Status | Notes |
|-----------|------------|--------|-------|
| Documentation current | | Ready/Needs Work | |
| Backlog organized | | Ready/Needs Work | |
| Knowledge documented | | Ready/Needs Work | |
| Access/permissions mapped | | Ready/Needs Work | |
| Open items resolved | | Ready/Needs Work | |
| Stakeholders informed | | Ready/Needs Work | |
| **Average** | **/5** | | |

**Go/No-Go Threshold:** Average >= 3.5 to proceed with handoff

### Step 2: Assemble 10-Document Package

**Document 1: Product Backlog (Clean)**
```
Owner: ps-delivery-manager (Tempo)
Contents:
  - All items prioritized (no orphan items)
  - Estimates for top 20 items
  - Dependencies noted
  - Technical context per item
  - Items tagged: Ready / Needs Refinement / Blocked
Status: [Ready / In Progress]
```

**Document 2: Decision Log**
```
Owner: ps-client-product-manager (Proxy)
Contents:
  - All major product decisions with rationale
  - Trade-offs considered for each
  - Stakeholders involved
  - Date and context
  - Decisions that may need revisiting
Status: [Ready / In Progress]
```

**Document 3: Analytics & Metrics Guide**
```
Owner: ps-product-analyst (Delta)
Contents:
  - All tracked metrics with formulas
  - Dashboard locations and access
  - Tracking plan (events, properties)
  - Key reports and how to generate
  - Baseline values and targets
Status: [Ready / In Progress]
```

**Document 4: Product Roadmap**
```
Owner: ps-product-strategist (Charter)
Contents:
  - Current roadmap (Now/Next/Later)
  - Strategic rationale per theme
  - OKR alignment
  - Known opportunities not yet addressed
  - Roadmap maintenance guide
Status: [Ready / In Progress]
```

**Document 5: Technical Debt Register**
```
Owner: ps-delivery-manager (Tempo)
Contents:
  - All known tech debt items
  - Severity and priority
  - Recommended allocation (% of sprint)
  - Items requiring immediate attention
  - History of debt addressed
Status: [Ready / In Progress]
```

**Document 6: Operations Runbook**
```
Owner: ps-product-ops-specialist (Mosaic)
Contents:
  - Release process
  - Monitoring and alerting setup
  - Incident response procedure
  - Feature flag inventory
  - Environment access and configuration
Status: [Ready / In Progress]
```

**Document 7: Research & Discovery Archive**
```
Owner: ps-discovery-lead (Quorum)
Contents:
  - All research findings (interviews, tests, surveys)
  - User personas
  - Journey maps
  - Opportunity Solution Tree (current state)
  - Validated and invalidated hypotheses
Status: [Ready / In Progress]
```

**Document 8: Feature Flag Inventory**
```
Owner: ps-delivery-manager (Tempo)
Contents:
  - All active feature flags
  - Purpose and target audience
  - Age and cleanup schedule
  - Owner per flag
  - Rollout status
Status: [Ready / In Progress]
```

**Document 9: Stakeholder Map**
```
Owner: ps-client-product-manager (Proxy)
Contents:
  - Key stakeholders and their interests
  - Communication preferences
  - Decision authority matrix
  - Relationship status and history
  - Tips for working with each
Status: [Ready / In Progress]
```

**Document 10: OKR History**
```
Owner: ps-product-strategist (Charter)
Contents:
  - Past quarter OKRs with scores
  - Learnings from each quarter
  - Current quarter OKRs with progress
  - Recommended OKRs for next quarter
  - OKR process guide
Status: [Ready / In Progress]
```

### Step 3: Knowledge Transfer Sessions
**7 KT Sessions (1-2 hours each):**
| Session | Topic | Lead Agent | Audience |
|---------|-------|-----------|---------|
| 1 | Product strategy & vision | ps-product-strategist | Receiving PM |
| 2 | User research & discovery | ps-discovery-lead | Receiving PM + UX |
| 3 | Analytics & metrics | ps-product-analyst | Receiving PM + analyst |
| 4 | Delivery process & backlog | ps-delivery-manager | Receiving PM + tech lead |
| 5 | Client relationships & stakeholders | ps-client-product-manager | Receiving PM |
| 6 | Technical architecture & debt | Engineering lead | Receiving tech lead |
| 7 | Operations & processes | ps-product-ops-specialist | Receiving ops/PM |

### Step 4: Shadow Period Plan
**4-Week Transition:**
| Week | Mode | Outgoing PM Role | Incoming PM Role |
|------|------|-----------------|-----------------|
| 1 | Shadow | Lead all activities | Observe, ask questions |
| 2 | Paired | Lead with input from incoming | Co-lead meetings |
| 3 | Reverse Shadow | Available for questions | Lead all activities |
| 4 | Independent | On-call for escalations only | Fully independent |

### Step 5: Handoff Gate
**Final Handoff Checklist:**
- [ ] All 10 documents delivered and reviewed
- [ ] All 7 KT sessions completed
- [ ] Access/permissions transferred
- [ ] Incoming PM has completed shadow period
- [ ] Open questions documented and answered
- [ ] Emergency contact established for 30 days post-handoff
- [ ] Client stakeholders introduced to incoming PM
- [ ] Formal sign-off from both parties

## Output Artifacts
- `handoff-package/` (directory with all 10 documents) | `kt-session-notes/` | `handoff-timeline.md` | `handoff-signoff.md`

## Quality Criteria
- All 10 documents complete and current | KT sessions conducted with notes | Shadow period completed | Incoming PM can operate independently | No critical knowledge gaps | Client stakeholders comfortable with transition
