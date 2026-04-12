---
task: create-success-plan-template
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

# Task: Create Success Plan Template

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Criar template de Success Plan co-autorado — documento vivo que alinha agencia e cliente sobre objetivos, milestones e metricas de sucesso ao longo do engajamento.

## Entrada
- Onboarding playbook
- Service tier deliverables
- Client business objectives
- Success criteria framework

## Passos

### 1. Success Plan Template
```
SUCCESS PLAN — [Client Name]

Created: [Date]
Last Updated: [Date]
CSM: [Name]
Client Champion: [Name]

═══════════════════════════════════════════

1. DESIRED OUTCOME
   Required Outcome: [Functional goal they hired us for]
   Appropriate Experience: [How they need to achieve it]
   "Success looks like...": [In their words]

2. SUCCESS MILESTONES
   | # | Milestone | Target Date | Metric | Status |
   |---|----------|-----------|--------|--------|
   | 1 | [30-day activation] | | | ⬜ |
   | 2 | [60-day adoption] | | | ⬜ |
   | 3 | [90-day value] | | | ⬜ |
   | 4 | [6-month ROI] | | | ⬜ |

3. KEY METRICS
   | Metric | Baseline | Target | Current | Trend |
   |--------|---------|--------|---------|-------|
   | | | | | |

4. STAKEHOLDER MAP
   | Name | Role | Engagement | Last Contact |
   |------|------|-----------|-------------|
   | | Champion | High | |
   | | Decision Maker | Medium | |
   | | Day-to-day | High | |

5. COMMUNICATION CADENCE
   | Type | Frequency | Attendees | Purpose |
   |------|----------|----------|---------|
   | Weekly sync | Weekly | CSM + day-to-day | Status, blockers |
   | Monthly review | Monthly | CSM + Champion | Progress, adjustments |
   | QBR | Quarterly | Team leads both sides | Strategic alignment |

6. RISKS & MITIGATIONS
   | Risk | Likelihood | Impact | Mitigation |
   |------|-----------|--------|-----------|
   | | H/M/L | H/M/L | |

7. NOTES & HISTORY
   [Date]: [Key note or decision]
   [Date]: [Key note or decision]
```

### 2. Co-Authoring Process
| Step | Owner | When |
|------|-------|------|
| Draft plan | CSM | After kickoff call |
| Review with client | Client + CSM | Day 5-7 |
| Agree on milestones | Both | Day 7-10 |
| Sign-off | Both | Day 10-14 |
| Monthly update | CSM | Every month |
| QBR review | Both | Every quarter |

### 3. Success Plan Health Check
| Check | Frequency | Owner |
|-------|----------|-------|
| Milestones on track? | Monthly | CSM |
| Metrics trending positive? | Monthly | CSM |
| Stakeholder map current? | Quarterly | CSM |
| Risks updated? | Monthly | CSM |
| Client agrees plan is accurate? | Quarterly (at QBR) | Both |

## Saida
- Success Plan template
- Co-authoring process guide
- Health check schedule
- CRM integration (plan linked to account)

## Validacao
- [ ] Template covers all critical sections
- [ ] Co-authoring process documented
- [ ] Plan updated minimum monthly
- [ ] Client confirms accuracy at each QBR
