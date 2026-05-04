---
task: track-client-health-score
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

# Task: Track Client Health Score

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Advanced

## Objetivo
Implement and maintain a client health scoring system with weighted dimensions, actionable thresholds, dashboard visualization, review cadence, and automated triggers. Health scores are the early warning system — they turn gut feelings into data-driven interventions.

## Entrada
- Product usage and engagement data
- Support ticket history and sentiment
- NPS/CSAT survey results
- Contract and renewal timeline
- Business outcomes achieved vs. promised
- Stakeholder engagement patterns

## Passos

### 1. Define Weighted Dimensions
| Dimension | Weight | Data Source | Measurement |
|-----------|--------|-------------|-------------|
| **Product Usage / Engagement** | 25-40% | Analytics platform | DAU/MAU, feature adoption, session depth |
| **Key Feature Adoption** | 15-25% | Product analytics | % of contracted features actively used |
| **Support Health** | 10-15% | Ticketing system | Ticket volume trend, resolution satisfaction, escalation rate |
| **NPS / Satisfaction** | 10-15% | Survey tool | Latest NPS score, trend direction |
| **Contract Status** | 10-20% | CRM | Renewal proximity, expansion signals, payment history |
| **Business Outcomes** | 15-20% | QBR data, success plans | % of agreed outcomes achieved |

### 2. Set Thresholds
| Zone | Score Range | Meaning | Action Protocol |
|------|------------|---------|-----------------|
| **Green** | 80-100 | Healthy — expansion candidate | Regular QBR cadence, proactive expansion conversations |
| **Yellow** | 50-79 | At risk — proactive intervention needed | Executive outreach within 48h, success plan review, blocker resolution |
| **Red** | 0-49 | Critical risk — save play required | CS leadership escalation within 24h, root cause analysis, remediation plan |

### 3. Build Dashboard
| Dashboard Component | Purpose |
|--------------------|---------|
| **Portfolio Overview** | Distribution of accounts by health zone (pie/bar chart) |
| **Trend View** | Health score trajectory per account over time |
| **Dimension Breakdown** | Which dimensions are dragging score down per account |
| **Alert Feed** | Real-time notifications for threshold crossings |
| **Cohort Analysis** | Health patterns by segment, tier, tenure, CSM |
| **At-Risk List** | Sorted list of Yellow/Red accounts with next actions |

### 4. Establish Review Cadence
| Review | Frequency | Participants | Focus |
|--------|-----------|-------------|-------|
| **Portfolio Review** | Weekly | CS team | Zone distribution changes, new at-risk accounts |
| **Account Deep Dive** | Bi-weekly | CSM + Account Owner | Individual account trajectories, action items |
| **Executive Review** | Monthly | CS Leadership + Revenue | Revenue-at-risk, save play effectiveness, expansion pipeline |
| **Model Calibration** | Quarterly | CS + Data/Analytics | Weight adjustments, threshold validation, new signals |

### 5. Trigger Automation
| Trigger | Condition | Automated Action |
|---------|-----------|-----------------|
| **Yellow Alert** | Score drops below 80 | Slack notification to CSM, task created for outreach |
| **Red Alert** | Score drops below 50 | Escalation to CS Lead, war room channel created |
| **Green Recovery** | Score rises above 80 from Yellow/Red | Celebration notification, expansion trigger activated |
| **Rapid Decline** | Score drops 20+ points in 30 days | Immediate flag regardless of current zone |
| **Renewal Risk** | Red/Yellow within 90 days of renewal | Executive sponsor notification, save play initiated |

## Saida
- Health score model documentation with weights and formulas
- Threshold definitions with action protocols
- Dashboard specification (components, data sources, refresh cadence)
- Review cadence calendar with RACI
- Automation rules and trigger definitions

## Validacao
- [ ] All 6 dimensions defined with weights summing to 100%
- [ ] Green/Yellow/Red thresholds validated against historical data
- [ ] Dashboard covers portfolio, trend, and individual account views
- [ ] Review cadence established with clear ownership
- [ ] Automation triggers cover critical state transitions
- [ ] Model calibration process defined for ongoing refinement
