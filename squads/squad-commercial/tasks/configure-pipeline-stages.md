---
task: configure-pipeline-stages
responsavel: "@cs-crm-specialist"
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

# Task: Configure Pipeline Stages

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Configurar estagiios do pipeline no CRM — definir criterios de entrada e saida para cada stage, probabilidades, campos obrigatorios e automacoes de transicao.

## Entrada
- Sales process definition
- Current CRM pipeline config
- Industry benchmarks
- Sales methodology (from Edge)

## Passos

### 1. Stage Definition
| Stage | Entry Criteria | Exit Criteria | Probability | Required Fields |
|-------|---------------|---------------|-------------|----------------|
| **Lead** | Identified contact + interest signal | Meets ICP criteria | 5% | Name, Email, Source |
| **Qualified** | ICP match + BANT initial pass | MEDDIC ≥ 3/8, pain identified | 15% | + Company, Role, Pain |
| **Discovery** | First meeting completed | Full discovery done, needs mapped | 25% | + MEDDIC score, Notes |
| **Proposal** | Needs validated, solution designed | Proposal sent and received | 50% | + Deal value, Proposal doc |
| **Negotiation** | Verbal interest in proposal | Terms agreed, pending signature | 75% | + Negotiation notes |
| **Closed Won** | Contract signed | Payment terms confirmed | 100% | + Contract, Start date |
| **Closed Lost** | Deal disqualified or lost | Loss reason documented | 0% | + Loss reason, Competitor |

### 2. Stage Automation Rules
| Trigger | Action | Stage |
|---------|--------|-------|
| Deal created | Auto-assign based on territory | Lead |
| MEDDIC score ≥ 3 | Move to Qualified + notify AE | Lead → Qualified |
| Meeting booked | Update stage + log activity | → Discovery |
| Proposal doc attached | Move to Proposal + start timer | → Proposal |
| Deal idle > 30 days | Alert owner + manager | Any stage |
| Closed Won | Trigger onboarding handoff to Bond | Won |
| Closed Lost | Trigger win/loss survey | Lost |

### 3. Pipeline Views & Filters
| View | Filter | Users |
|------|--------|-------|
| My Pipeline | Owner = current user, Open only | All sales |
| Team Pipeline | Owner = team members, Open only | Managers |
| Stale Deals | Last activity > 14 days | Managers |
| Closing This Month | Close date = this month, Proposal+ | All |
| Forecast Board | Commit + Best Case | Leadership |

### 4. Stage Health Metrics
| Metric | Formula | Target |
|--------|---------|--------|
| Stage Conversion | Deals progressed / Deals entered | Track per stage |
| Time in Stage | Avg days in each stage | Reduce QoQ |
| Stage Distribution | % of deals per stage | Healthy = pyramid |
| Reverse Movements | Deals moved backward | < 5% |

## Saida
- Pipeline stages configured in CRM
- Automation rules active
- Views and filters created
- Stage health monitoring dashboard

## Validacao
- [ ] All stages have clear entry/exit criteria
- [ ] Required fields enforced per stage
- [ ] Automations tested and active
- [ ] Team trained on new pipeline config
