---
task: build-cs-playbooks
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

# Task: Build CS Playbooks

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Construir biblioteca de playbooks de Customer Success — guias de acao para cenarios recorrentes que garantem resposta consistente e de alta qualidade independente do CSM.

## Entrada
- Common CS scenarios
- Best practices from top CSMs
- Health score triggers
- Account lifecycle stages

## Passos

### 1. Playbook Inventory
| Playbook | Trigger | Priority | Status |
|----------|---------|----------|--------|
| New Client Onboarding | Contract signed | P0 | |
| 30-Day Check-in | Day 30 milestone | P0 | |
| QBR Preparation | 2 weeks before QBR | P0 | |
| Health Score Drop (Yellow) | Score drops to 50-79 | P0 | |
| Health Score Drop (Red) | Score drops to <50 | P0 | |
| Expansion Conversation | Green + trigger detected | P1 | |
| Renewal Preparation | 90 days before renewal | P0 | |
| Champion Change | Key contact leaves | P0 | |
| Escalation Management | Client escalation | P0 | |
| Win-Back | Churned client (6+ months) | P2 | |

### 2. Playbook Template
```
PLAYBOOK: [Name]

TRIGGER: [What activates this playbook]
OWNER: CSM (with escalation to CS Director if needed)
SLA: [Response time]

PRE-WORK:
  □ [Preparation step 1]
  □ [Preparation step 2]

STEPS:
  1. [Action] — [Timeline]
  2. [Action] — [Timeline]
  3. [Action] — [Timeline]

TALK TRACK:
  Opening: "[Script for initial outreach]"
  Key questions:
    - "[Question 1]"
    - "[Question 2]"
  Close: "[Script for next steps]"

ESCALATION:
  If [condition]: Escalate to [role] within [timeframe]

SUCCESS CRITERIA:
  □ [Measurable outcome 1]
  □ [Measurable outcome 2]

ARTIFACTS:
  - [Email template link]
  - [Presentation template link]
  - [CRM automation link]
```

### 3. Champion Change Playbook (Example)
```
TRIGGER: Key contact leaves client organization

HOUR 0-4:
  □ Confirm departure (LinkedIn, CRM, client)
  □ Identify interim contact
  □ Update CRM stakeholder map
  □ Assess relationship health impact

DAY 1-3:
  □ Reach out to new contact or interim
  □ Introduction call: re-establish relationship
  □ Share value summary (what we've achieved)
  □ Update Success Plan with new stakeholder

DAY 7-14:
  □ Identify new champion candidate
  □ Build relationship with multiple stakeholders
  □ Assess if departed contact is a Promoter at new company (future lead)

ESCALATION: If no viable contact within 14 days → CS Director
```

## Saida
- Playbook library (10+ playbooks)
- Templates and talk tracks
- CRM automation triggers
- Playbook usage tracking

## Validacao
- [ ] All P0 playbooks created
- [ ] Each playbook has trigger, steps, talk track
- [ ] CRM automations configured
- [ ] CSM team trained on playbook usage
