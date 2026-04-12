---
task: execute-save-play
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

# Task: Execute Save Play

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Advanced

## Objetivo
Executar save play para conta em risco critico (Red) — intervencao estruturada com escalacao executiva, root cause analysis e plano de remediacao com milestones.

## Entrada
- At-risk account identified (from identify-churn-risks)
- Account history and health data
- Stakeholder map
- Contract terms

## Passos

### 1. Save Play Protocol (24-Hour Response)
```
HOUR 0-4: TRIAGE
  □ CSM reviews full account history
  □ Identifies root cause hypothesis
  □ Escalates to CS Director
  □ Notifies Pipeline (orchestrator)

HOUR 4-8: INTERNAL ALIGNMENT
  □ CS Director reviews account
  □ Executive sponsor identified (our side)
  □ Remediation plan drafted
  □ Concessions/offers prepared (if needed)

HOUR 8-24: CLIENT ENGAGEMENT
  □ CSM reaches out to champion (if exists)
  □ Executive-to-executive call scheduled
  □ Root cause conversation with client
  □ Remediation plan presented

DAY 2-14: INTENSIVE RECOVERY
  □ Weekly (or more frequent) check-ins
  □ Remediation milestones tracked
  □ Quick wins delivered first
  □ Progress reported to client and internal team

DAY 14-30: STABILIZATION
  □ Health score monitored daily
  □ Recovery milestone achieved
  □ Client confirms improvement
  □ Transition back to normal CS cadence
```

### 2. Root Cause Investigation
| Area | Questions | Finding |
|------|----------|---------|
| Delivery | Are we delivering what was promised? | |
| Communication | Does the client feel heard and valued? | |
| Outcomes | Are they seeing the expected results? | |
| Stakeholders | Has our champion changed? Who's the decision maker? | |
| Competition | Is a competitor approaching them? | |
| Budget | Has their budget or priorities shifted? | |

### 3. Concession Options (if needed)
| Concession | Use When | Approval |
|-----------|---------|---------|
| Extra service hours | Delivery gap acknowledged | CS Director |
| Temporary discount | Price sensitivity, competitive threat | VP |
| Extended contract terms | Budget timing issue | VP |
| Senior team assignment | Quality concern | CS Director |
| Custom feature/deliverable | Gap in standard offering | VP + Product |

### 4. Save Play Outcome Tracking
| Outcome | Definition | Rate Target |
|---------|-----------|------------|
| Saved (Green) | Health recovers to 70+, client confirms satisfaction | 50%+ |
| Stabilized (Yellow) | Bleeding stopped, but not fully recovered | 20% |
| Managed Exit | Graceful wind-down, door open for return | 15% |
| Lost | Client churns despite intervention | <15% |

## Saida
- Save play execution record
- Root cause documentation
- Remediation plan with milestones
- Outcome and learning captured

## Validacao
- [ ] 24-hour response protocol followed
- [ ] Root cause identified (not just symptoms)
- [ ] Client engaged within 24 hours
- [ ] Outcome documented and learning shared
