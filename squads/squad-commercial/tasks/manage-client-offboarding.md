---
task: manage-client-offboarding
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

# Task: Manage Client Offboarding

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Intermediate

## Objetivo
Execute graceful client offboarding — knowledge transfer, access revocation, exit interview, and win-back trigger scheduling. How you end a relationship determines whether it can restart. Every offboarding is a future win-back opportunity.

## Entrada
- Client contract and termination details
- Account history (tenure, services used, key contacts)
- Reason for departure (if known)
- Outstanding deliverables or commitments
- Access and credential inventory

## Passos

### 1. Notify Team and Initiate Process
| Action | Owner | Timeline |
|--------|-------|----------|
| Notify internal stakeholders (CS, Sales, Finance, Delivery) | CSM | Day 0 |
| Create offboarding checklist for this account | CSM | Day 0 |
| Confirm contractual obligations (notice period, final deliverables) | CS Lead + Legal | Day 0-2 |
| Assign offboarding coordinator | CS Lead | Day 1 |
| Communicate timeline to client | CSM | Day 1-2 |

### 2. Export Deliverables and Knowledge Transfer
| Deliverable | Format | Responsibility |
|------------|--------|---------------|
| All project files and assets | Organized archive (zip/drive) | Delivery team |
| Analytics and reporting data | CSV/PDF exports | Analytics team |
| Documentation and SOPs created | PDF/Google Docs | CSM |
| Integration configurations | Technical documentation | Engineering |
| Historical performance data | Dashboard export + summary | CSM |

### 3. Conduct Exit Interview
| Question Area | Purpose |
|--------------|---------|
| **Primary reason for leaving** | Identify root cause (price, value, fit, competitor, internal change) |
| **What worked well** | Preserve positive patterns for other accounts |
| **What could have been better** | Actionable improvement feedback |
| **Would you consider returning** | Gauge win-back potential and conditions |
| **Would you refer us** | Even departing clients can be advocates |
| **NPS at exit** | Benchmark against entry NPS for relationship trajectory |

### 4. Revoke Access and Close Account
| Action | System | Timeline |
|--------|--------|----------|
| Revoke platform access | Product/IT | Per contract end date |
| Remove from internal tools (Slack, project management) | IT/CSM | End date + 1 day |
| Archive CRM record (do NOT delete) | CRM admin | End date + 7 days |
| Close billing and process final invoice | Finance | Per contract terms |
| Update internal dashboards and reporting | RevOps | End date + 7 days |

### 5. Schedule Win-Back Cadence
| Touchpoint | Timing | Channel | Content |
|-----------|--------|---------|---------|
| **Graceful goodbye** | Last day | Email (personal) | Thank you, door is always open |
| **Check-in 1** | 90 days post-departure | Email | Industry insight or relevant content |
| **Check-in 2** | 6 months post-departure | Email or LinkedIn | New capability announcement relevant to their needs |
| **Win-back offer** | 9-12 months post-departure | Email + call | Tailored re-engagement offer addressing original departure reason |
| **Annual touch** | Every 12 months | Email | Relationship maintenance, no hard sell |

## Saida
- Offboarding checklist (completed)
- Deliverables archive with transfer confirmation
- Exit interview summary with insights
- Access revocation audit trail
- Win-back cadence calendar with triggers
- Churn post-mortem report (internal)

## Validacao
- [ ] All internal stakeholders notified
- [ ] Client deliverables exported and transferred
- [ ] Exit interview conducted and documented
- [ ] All access revoked and audit trail created
- [ ] Win-back cadence scheduled in CRM
- [ ] Churn reason categorized for pattern analysis
