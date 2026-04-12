---
task: create-onboarding-playbook
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

# Task: Create Onboarding Playbook

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Advanced

## Objetivo
Criar playbook de onboarding estruturado — jornada do dia 0 ao dia 90 com milestones de ativacao, garantindo que cada cliente alcance o primeiro valor (Time-to-Value) em no maximo 30 dias.

## Entrada
- Service offerings and tiers
- Client success criteria
- Delivery team workflows
- Historical TTV data

## Passos

### 1. Onboarding Timeline
| Phase | Timeline | Goal | Owner |
|-------|----------|------|-------|
| Handoff | Day 0 | Sales → CS transition | Pipeline + Bond |
| Kickoff | Day 1-3 | Align on Desired Outcome | Bond |
| Setup | Day 3-14 | Technical/access setup | Bond + Delivery |
| Activation | Day 14-30 | First value milestone | Bond + Delivery |
| Adoption | Day 30-60 | Regular usage established | Bond |
| Optimization | Day 60-90 | Full value realization | Bond |

### 2. Day-by-Day Playbook
```
DAY 0 — HANDOFF
  □ CRM handoff from sales to CS (Vault updates)
  □ CS reviews deal notes, desired outcome, success criteria
  □ CSM assigned based on tier and industry
  □ Welcome email sent (automated)
  □ Kickoff call scheduled within 48 hours

DAY 1-3 — KICKOFF
  □ Kickoff call (60 min):
    - Introductions and relationship building
    - Review desired outcome and success criteria
    - Agree on communication cadence
    - Identify key stakeholders and champions
    - Set 30/60/90 day milestone targets
  □ Co-author Success Plan
  □ Share onboarding checklist with client

DAY 3-14 — SETUP
  □ Access provisioning and technical setup
  □ Data collection and initial analysis
  □ First deliverable or quick win
  □ Training session (if applicable)
  □ Weekly check-in #1

DAY 14-30 — ACTIVATION
  □ First value milestone achieved [define per service]
  □ Client confirms "aha moment"
  □ Health score initialized
  □ Weekly check-in #2-3
  □ 30-day NPS pulse survey

DAY 30-60 — ADOPTION
  □ Regular usage cadence established
  □ Monthly review call
  □ Expansion conversation (if appropriate)
  □ Introduce additional features/services
  □ Client testimonial request (if satisfied)

DAY 60-90 — OPTIMIZATION
  □ First QBR at day 90
  □ ROI calculation shared
  □ Success Plan review and update
  □ Renewal/expansion conversation initiated
  □ Advocacy program invitation
```

### 3. Activation Milestones by Tier
| Tier | Activation Milestone | Target TTV |
|------|---------------------|-----------|
| Starter | First deliverable reviewed and approved | 14 days |
| Growth | First measurable result reported | 30 days |
| Enterprise | First strategic review with ROI data | 45 days |

### 4. Onboarding Health Tracking
| Metric | Target | Alert |
|--------|--------|-------|
| Time-to-Kickoff | < 3 business days | > 5 days |
| Time-to-Value | < 30 days | > 45 days |
| Onboarding Completion | > 85% milestones hit | < 70% |
| 30-day NPS | > 8 avg | < 7 |
| CSM Response Time | < 4 hours | > 24 hours |

## Saida
- Onboarding playbook document
- Day-by-day checklist
- Automated workflow in CRM
- Onboarding health dashboard

## Validacao
- [ ] Every phase has clear milestones
- [ ] Activation milestone defined per tier
- [ ] Success Plan template integrated
- [ ] TTV tracking automated
