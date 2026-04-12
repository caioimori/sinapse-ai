---
task: manage-stakeholder-communication
responsavel: "@product-orqx"
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

# Manage Stakeholder Communication

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** Medium
- **Estimated Time:** Ongoing (1-2 hours/week)
- **Produces:** Communication cadence, status updates, escalation handling

## Purpose
Gerenciar comunicação com stakeholders internos e externos garantindo informação certa para pessoa certa no momento certo.

## Steps

### Step 1: Stakeholder Map (Power/Interest Grid)
High Power + High Interest → Manage Closely | High Power + Low Interest → Keep Satisfied
Low Power + High Interest → Keep Informed | Low Power + Low Interest → Monitor

### Step 2: Communication Cadence
| Cadence | Audience | Format | Owner |
|---------|----------|--------|-------|
| Daily | Internal team | Standup 15min | Tempo |
| Weekly | Client PO | Status email + call | Proxy |
| Bi-weekly | Client tech lead | Technical sync | Tempo |
| Monthly | Client leadership | Health report | Vector + Proxy |
| Quarterly | All stakeholders | QBR | Vector + Charter |

### Step 3: Weekly Status Template
Highlights → Progress (sprint %, discovery update) → Metrics Snapshot → Upcoming → Needs from Client

### Step 4: Escalation Communication
**Template:** ISSUE → IMPACT → CAUSE → ACTION → NEED → TIMELINE
**Rule:** Always escalate BEFORE the client discovers the issue.

## Output Artifacts
- `stakeholder-map.md` | `communication-calendar.md` | Weekly status updates

## Quality Criteria
- No stakeholder surprised by bad news
- Communication cadence maintained consistently
- Escalations communicated proactively
