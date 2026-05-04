---
task: identify-churn-risks
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

# Task: Identify Churn Risks

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Identificar clientes em risco de churn — analise mensal de health scores, sinais comportamentais e triggers de risco para intervencao proativa antes que o cliente decida sair.

## Entrada
- Health Score data
- Usage/engagement trends
- Support ticket patterns
- NPS/CSAT responses
- Contract renewal dates

## Passos

### 1. Churn Risk Signals
| Signal | Source | Severity | Weight |
|--------|--------|---------|--------|
| Usage decline > 30% MoM | Analytics | High | 20% |
| NPS Detractor (0-6) | Survey | High | 15% |
| Support escalation | Tickets | High | 15% |
| Champion left company | CRM/LinkedIn | Critical | 20% |
| Budget cut/reorg at client | News/contact | High | 10% |
| No response to 2+ outreach | CRM | Medium | 10% |
| Late payment > 30 days | Billing | Medium | 10% |

### 2. Monthly At-Risk Review
| Account | ARR | Health | Risk Signal | Days to Renewal | Priority | Owner |
|---------|-----|--------|------------|----------------|----------|-------|
| | R$ | Red/Yellow | | | P0/P1/P2 | CSM |

### 3. Risk Triage Framework
| Priority | Criteria | Response Time | Action |
|----------|---------|--------------|--------|
| P0 | Red health + renewal < 90 days + ARR > $X | 24 hours | Save play (execute-save-play) |
| P1 | Yellow health or Red + renewal > 90 days | 48 hours | Recovery plan |
| P2 | Yellow health + renewal > 180 days | 1 week | Proactive outreach |

### 4. Churn Post-Mortem Template
```
CHURN POST-MORTEM — [Account Name]

Account: [Name] | ARR: R$ [X] | Duration: [X months]
CSM: [Name] | Last Health Score: [X] ([Color])

Timeline of Decline:
  [Date]: First risk signal detected
  [Date]: Intervention attempted
  [Date]: Churn confirmed

Primary Churn Reason: [Category]
  □ Product/Service fit
  □ Price/budget
  □ Poor experience/delivery
  □ Champion left
  □ Business change (M&A, reorg, pivot)
  □ Competitor won
  □ No longer needed

Could We Have Prevented This?
  □ Yes — missed signals: [detail]
  □ Yes — late response: [detail]
  □ Maybe — with better: [detail]
  □ No — external factors: [detail]

Learning: [What we'll do differently]
```

## Saida
- Monthly at-risk account list
- Risk triage with priorities
- Intervention assignments
- Churn post-mortems for lost accounts

## Validacao
- [ ] All accounts with health < 60 reviewed
- [ ] P0 risks have 24h intervention plan
- [ ] Every churned account has post-mortem
- [ ] Learnings fed back to team
