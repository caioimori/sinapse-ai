---
task: setup-new-client-product-operations
responsavel: "@ps-product-ops-specialist"
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

# Setup New Client Product Operations

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium-High
- **Estimated Time:** 4-6 hours
- **Produces:** Client operations setup, tool configuration, process onboarding, baseline metrics

## Purpose
Configurar operacoes de produto para novo cliente de forma padronizada. O setup correto nos primeiros dias determina a eficiencia do engajamento inteiro.

## Steps

### Step 1: Client Ops Kickoff Checklist
**Day 1-2: Access & Tools**
- [ ] Client provides access to existing analytics (GA, Amplitude, etc.)
- [ ] Client provides access to existing project management tool
- [ ] Client provides access to design files (Figma, etc.)
- [ ] Client provides access to codebase (if applicable)
- [ ] Client provides access to support/feedback channels
- [ ] Client provides access to documentation (existing)
- [ ] Communication channels established (Slack channel, email list)
- [ ] Meeting cadence agreed (daily standup, weekly sync, etc.)

**Day 2-3: Tool Setup**
- [ ] Project board created (with standard columns/workflow)
- [ ] Sprint/cycle structure configured
- [ ] Labels/tags standardized (bug, feature, tech-debt, discovery)
- [ ] Notification rules configured
- [ ] Analytics dashboard created with baseline metrics
- [ ] Shared document space created (knowledge base structure)
- [ ] Time tracking configured (if retainer)

**Day 3-5: Process Onboarding**
- [ ] Sprint cadence confirmed
- [ ] Meeting schedule set (all recurring meetings created)
- [ ] Communication protocols shared with client
- [ ] Escalation path documented and shared
- [ ] RACI matrix created for key activities
- [ ] Reporting cadence agreed (weekly status, monthly metrics)

### Step 2: Baseline Metrics Capture
**Capture Current State (before we start):**
| Metric | Current Value | Date Captured | Source | Notes |
|--------|-------------|--------------|--------|-------|
| Active Users (MAU) | [N] | [date] | [tool] | |
| Activation Rate | [%] | [date] | [tool] | |
| D30 Retention | [%] | [date] | [tool] | |
| NPS | [score] | [date] | [tool] | |
| Page Load Time | [ms] | [date] | [tool] | |
| Error Rate | [%] | [date] | [tool] | |
| Feature Adoption (core) | [%] | [date] | [tool] | |

**Why Baseline Matters:** Without baseline, we cannot demonstrate improvement. Capture BEFORE making any changes.

### Step 3: Standard Project Board Setup
**Board Columns (standard):**
```
Backlog → Refined → Sprint Ready → In Progress → In Review → QA → Done
```

**Standard Labels:**
| Label | Color | Description |
|-------|-------|-------------|
| feature | Blue | New functionality |
| bug | Red | Defect/fix |
| tech-debt | Orange | Technical maintenance |
| discovery | Purple | Research/validation |
| spike | Yellow | Investigation/learning |
| client-request | Green | Client-initiated |
| blocked | Red border | Cannot proceed |

**Standard Fields:**
| Field | Type | Required? |
|-------|------|----------|
| Priority | P1-P4 | Yes |
| Estimate | Story points | Yes (for sprint items) |
| Sprint | Sprint selector | Yes (for sprint items) |
| Client | Client tag | Yes (if multi-client) |
| Type | feature/bug/debt/discovery | Yes |

### Step 4: Communication Setup
**Recurring Meetings:**
| Meeting | Frequency | Duration | Participants | Purpose |
|---------|-----------|----------|-------------|---------|
| Daily standup | Daily | 15 min | Dev team | Progress + blockers |
| Client sync | Weekly | 30 min | PM + client PO | Priorities + decisions |
| Sprint planning | Bi-weekly | 2h | Full team | Sprint commitment |
| Sprint demo | Bi-weekly | 1h | Team + client | Showcase deliveries |
| Sprint retro | Bi-weekly | 1h | Dev team | Process improvement |
| Monthly metrics | Monthly | 30 min | PM + stakeholders | Performance review |

**Async Communication Rules:**
| Type | Channel | Response SLA |
|------|---------|-------------|
| Urgent (production down) | Phone/direct message | 1 hour |
| Important (blocker) | Slack DM | 4 hours |
| Normal (question) | Slack channel | 24 hours |
| FYI (status update) | Email | 48 hours |
| Documentation | Shared docs | No SLA |

### Step 5: Documentation Bootstrap
**Initial Documents to Create:**
| Document | Owner | Timeline | Template |
|----------|-------|----------|---------|
| Stakeholder Map | Client PM | Day 1 | stakeholder-map-template |
| Product Health Baseline | Analyst | Day 3 | health-scorecard-template |
| Decision Log (start) | Client PM | Day 1 | decision-log-template |
| Sprint Cadence Doc | Delivery Mgr | Day 2 | sprint-template |
| Communication Plan | Client PM | Day 2 | comms-plan-template |

### Step 6: Operations Readiness Assessment
**Readiness Scorecard (end of Week 1):**
| Dimension | Score (1-5) | Status | Blocker if Not Ready |
|-----------|------------|--------|---------------------|
| Access & permissions | | Ready/Not | Cannot work without access |
| Tools configured | | Ready/Not | Inefficient without tools |
| Communication established | | Ready/Not | Misalignment risk |
| Baseline captured | | Ready/Not | Cannot measure improvement |
| Processes agreed | | Ready/Not | Unclear expectations |
| Team onboarded | | Ready/Not | Productivity delay |
| **Average** | **/5** | | |

**Readiness Threshold:** Average >= 4.0 to begin sprint work.
**Below 4.0:** Create action plan for remaining setup items.

## Output Artifacts
- `client-ops-setup-[client].md` | `baseline-metrics.md` | `communication-plan.md` | `ops-readiness-assessment.md`

## Quality Criteria
- All access obtained before sprint 1 | Tools configured with standard setup | Baseline metrics captured | Communication cadence agreed | Standard processes introduced | Readiness score >= 4.0 | All setup documented
