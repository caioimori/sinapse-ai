---
task: manage-client-escalation-protocol
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

# Task: Manage Client Escalation Protocol

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Advanced

## Objetivo
Define and execute a structured client escalation protocol — severity tiers (P1-P4), SLAs, communication cadence, resolution tracking, and post-mortem analysis. A well-defined escalation protocol turns crises into trust-building moments.

## Entrada
- Client account data and health scores
- Support ticket history and severity patterns
- Current SLA definitions (if any)
- Stakeholder contact matrix
- Historical escalation data

## Passos

### 1. Classify Severity
| Tier | Severity | Description | Example |
|------|----------|-------------|---------|
| **P1 — Critical** | Service down / revenue impact | Client business directly affected, complete blocker | Production outage, data loss, billing error |
| **P2 — High** | Major degradation | Significant feature broken, workaround exists but painful | Key integration failing, major bug in core workflow |
| **P3 — Medium** | Moderate impact | Feature issue with reasonable workaround | Minor bug, performance degradation, UX friction |
| **P4 — Low** | Minor / cosmetic | No business impact, improvement request | UI polish, documentation gap, feature request |

### 2. Define SLAs per Tier
| Tier | First Response | Status Update Cadence | Resolution Target | Escalation Trigger |
|------|---------------|----------------------|-------------------|-------------------|
| P1 | 15 minutes | Every 1 hour | 4 hours | Immediate to CS leadership |
| P2 | 1 hour | Every 4 hours | 24 hours | After 12 hours unresolved |
| P3 | 4 hours | Every 24 hours | 72 hours | After 48 hours unresolved |
| P4 | 24 hours | Weekly | 2 weeks | After 1 week unresolved |

### 3. Notify Stakeholders
| Tier | Internal Notification | Client Communication | Executive Involvement |
|------|----------------------|---------------------|----------------------|
| P1 | CS Lead + Account Owner + Engineering Lead | Client sponsor + Day-to-day contact | VP/C-level briefed within 1 hour |
| P2 | Account Owner + Relevant team lead | Day-to-day contact | Director briefed if SLA at risk |
| P3 | Account Owner | Day-to-day contact | None unless escalated |
| P4 | Account Owner (async) | Standard ticket update | None |

### 4. Assign Owner and Track Resolution
- **Single-threaded owner:** Every escalation has ONE named owner responsible for resolution
- **War room protocol (P1):** Dedicated channel/thread, 15-min standups until resolved
- **Resolution log:** Document every action taken, decisions made, timeline of events
- **Client communication:** Proactive updates before SLA cadence when possible

### 5. Post-Mortem and Continuous Improvement
| Element | Description |
|---------|-------------|
| **Timeline** | Minute-by-minute reconstruction of the incident |
| **Root Cause** | 5-Whys analysis to find true root cause |
| **Impact** | Client impact (business, trust, satisfaction) |
| **Response Assessment** | Did we meet SLAs? What went well? What didn't? |
| **Action Items** | Preventive measures with owners and deadlines |
| **Client Communication** | Post-mortem summary shared with client (P1/P2) |

## Saida
- Escalation protocol document with tier definitions and SLAs
- Stakeholder notification matrix
- Resolution tracking template
- Post-mortem template and process
- Escalation metrics dashboard definition

## Validacao
- [ ] All 4 severity tiers defined with clear criteria
- [ ] SLAs are realistic and measurable
- [ ] Stakeholder notification matrix covers all scenarios
- [ ] Single-threaded ownership model documented
- [ ] Post-mortem process includes root cause and preventive actions
- [ ] Protocol reviewed with CS leadership and client-facing teams
