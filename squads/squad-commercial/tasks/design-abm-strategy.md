---
task: design-abm-strategy
responsavel: "@cs-funnel-architect"
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

# Task: Design ABM Strategy

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Advanced

## Objetivo
Desenhar estrategia Account-Based Marketing (ABM) — tiering de contas, personalizacao por tier, orchestracao multi-channel e metricas de account engagement.

## Entrada
- ICP profile (from define-icp-profile)
- Target account list
- Budget and resources
- Sales team input on key accounts

## Passos

### 1. ABM Tiering Framework
| Tier | Accounts | Approach | Budget/Account | Personalization |
|------|---------|---------|---------------|----------------|
| **1:1 (Strategic)** | 5-15 | Fully custom campaigns per account | High | 100% custom |
| **1:Few (Cluster)** | 20-50 | Shared campaigns by segment/vertical | Medium | 70% custom |
| **1:Many (Programmatic)** | 100-500 | Scaled, personalized at segment level | Low | 30% custom |

### 2. Account Selection Criteria
| Criterion | Weight | Scoring |
|----------|--------|---------|
| ICP fit score | 30% | From ICP scoring model |
| Revenue potential | 25% | Estimated ACV |
| Strategic value | 15% | Reference potential, brand, expansion |
| Win probability | 15% | Based on engagement, intent signals |
| Sales input | 15% | Rep confidence and relationship |

### 3. Tier 1 (1:1) Playbook
```
STRATEGIC ABM — Per Account

Research Phase (Week 1-2):
  □ Company deep dive (10K, news, org chart)
  □ Stakeholder mapping (4-6 key contacts)
  □ Pain point hypotheses
  □ Competitive landscape for this account
  □ Personalized value proposition

Engagement Phase (Week 3-8):
  □ Custom content piece (article, video, or report)
  □ Personalized outreach to each stakeholder
  □ LinkedIn engagement program (comment, share, connect)
  □ Direct mail or gift (physical touchpoint)
  □ Custom landing page / microsite
  □ Executive-to-executive introduction

Acceleration Phase (Week 8-12):
  □ Custom event or workshop invitation
  □ ROI model specific to their business
  □ Reference call with similar company
  □ Proposal tailored to their specific needs
```

### 4. Tier 2 (1:Few) Playbook
```
CLUSTER ABM — Per Segment (e.g., "Mid-market SaaS in LatAm")

Shared assets:
  □ Industry-specific content (blog, webinar, guide)
  □ Segment landing page with relevant case studies
  □ Email sequence personalized by segment pain points
  □ LinkedIn ad targeting by company list

Per-account touches:
  □ Personalized first email (company-specific opening)
  □ LinkedIn connection with tailored message
  □ Account-specific insights in follow-ups
```

### 5. Metrics by Tier
| Metric | Tier 1 | Tier 2 | Tier 3 |
|--------|--------|--------|--------|
| Account Engagement Score | Per-account | Per-cluster | Per-segment |
| Meetings Booked | By account | By cluster | By segment |
| Pipeline Generated | $ per account | $ per cluster | $ per program |
| Win Rate | By account | vs non-ABM | vs non-ABM |
| Deal Size | vs non-ABM | vs non-ABM | vs non-ABM |
| Sales Cycle | vs non-ABM | vs non-ABM | vs non-ABM |

## Saida
- ABM strategy document with tiering
- Account list with tier assignments
- Playbooks per tier (1:1, 1:Few, 1:Many)
- Engagement scoring model
- Budget allocation per tier

## Validacao
- [ ] Accounts tiered with clear criteria
- [ ] Each tier has specific playbook
- [ ] Budget allocated per tier
- [ ] Metrics defined for ROI measurement
