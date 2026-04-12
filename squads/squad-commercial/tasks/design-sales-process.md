---
task: design-sales-process
responsavel: "@cs-sales-closer"
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

# Task: Design Sales Process

## Metadata
- **Squad:** squad-commercial
- **Agent:** Close (cs-sales-closer)
- **Complexity:** Complex

## Objetivo
Projetar processo de vendas end-to-end — da qualificacao ao fechamento, com etapas claras, criterios de passagem, playbooks por etapa e metricas. O processo deve ser replicavel, mensuravel e escalavel.

## Entrada
- Current sales process (if any)
- Sales team structure
- Average deal size and cycle
- Target close rate
- CRM system in use

## Passos

### 1. Sales Process Stages
| Stage | Definition | Entry Criteria | Exit Criteria | Duration Target |
|-------|-----------|---------------|--------------|----------------|
| 1. Lead Qualified | Matches ICP | Passes lead scoring | Discovery scheduled | 1-2 days |
| 2. Discovery | Understand needs | Meeting confirmed | Pain, budget, timeline known | 1 call |
| 3. Solution Design | Propose solution | Pain validated | Proposal ready | 2-3 days |
| 4. Proposal | Present offer | Solution accepted | Proposal sent | 1-2 days |
| 5. Negotiation | Handle concerns | Proposal reviewed | Terms agreed | 3-7 days |
| 6. Close | Secure commitment | Terms agreed | Contract signed | 1-3 days |
| 7. Handoff | Transfer to CS | Contract signed | Onboarding started | Same day |

### 2. Stage Playbooks
For each stage, define:
```
STAGE: [Name]
OBJECTIVE: [What must be accomplished]
KEY ACTIVITIES:
  - [Activity 1]
  - [Activity 2]
REQUIRED MATERIALS:
  - [Document/tool]
QUESTIONS TO ASK:
  - [Question 1]
  - [Question 2]
RED FLAGS (disqualify):
  - [Red flag 1]
GREEN FLAGS (advance):
  - [Green flag 1]
EXIT CRITERIA:
  - [Criteria 1]
```

### 3. Qualification Framework
| Criteria | Question | Must-Have? | Score |
|----------|---------|-----------|-------|
| Budget | "What's your budget range?" | Yes | /25 |
| Authority | "Who else is involved in this decision?" | Yes | /25 |
| Need | "What problem are you trying to solve?" | Yes | /25 |
| Timeline | "When do you need this resolved?" | Yes | /25 |
| **Total** | | | **/100** |

Threshold: >= 70 to advance to Discovery

### 4. Sales Metrics Dashboard
| Metric | Definition | Target | Measured |
|--------|-----------|--------|---------|
| Win Rate | Closed Won / Total Opps | 25-40% | Weekly |
| Sales Cycle | Days from SQL to Close | < X days | Weekly |
| Average Deal Size | Revenue / Closed Deals | R$ | Monthly |
| Pipeline Velocity | (Opps × Win% × Deal Size) / Cycle | R$/day | Weekly |
| Stage Conversion | % moving to next stage | Varies | Weekly |
| Activity Metrics | Calls, emails, meetings/week | X/week | Daily |

### 5. Handoff Protocols
| From | To | Handoff Content | SLA |
|------|----|----------------|-----|
| Marketing | Sales | Lead score, source, engagement history | < 4 hours |
| SDR | AE | Discovery notes, qualification score | Same day |
| AE | CS | Contract, expectations, key contacts | < 24 hours |

## Saida
- Complete sales process (7 stages)
- Stage playbooks with scripts
- Qualification framework
- Metrics dashboard spec
- Handoff protocols
- CRM pipeline configuration guide

## Validacao
- [ ] All stages have clear entry/exit criteria
- [ ] Qualification framework with scoring
- [ ] Playbooks are actionable (not generic)
- [ ] Metrics defined with targets
- [ ] Handoff protocols ensure no lead is dropped
