---
task: run-dream-100-campaign
responsavel: "@cs-lead-generation-strategist"
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

# Task: Run Dream 100 Campaign

## Metadata
- **Squad:** squad-commercial
- **Agent:** Magnet (cs-lead-generation-strategist)
- **Complexity:** Standard

## Objetivo
Executar campanha Dream 100 (Chet Holmes) — identificar os 100 prospects ou parceiros ideais e conduzir campanha de outreach multi-touch personalizada durante 90 dias para converter em conversas de vendas.

## Entrada
- ICP definition
- Target account criteria
- Current network/connections
- Budget for outreach activities

## Passos

### 1. Dream 100 List Building
```
CRITERIA FOR SELECTION:
- Matches ICP perfectly
- Revenue potential > [R$ minimum]
- Reachable (can find decision-maker)
- Strategic value (logo, case study, referral potential)

RESEARCH PER PROSPECT:
- Company: size, revenue, industry, growth stage
- Decision-maker: name, role, LinkedIn, email
- Pain points: specific to their situation
- Trigger events: recent news, hiring, funding, complaints
- Connection paths: mutual connections, events, communities
```

### 2. Dream 100 Tracker
| # | Company | Contact | Role | Channel | Touch # | Last Touch | Status | Next Action |
|---|---------|---------|------|---------|---------|-----------|--------|-------------|
| 1 | | | | | /12 | | Cold/Warm/Hot/Meeting | |

### 3. Multi-Touch Sequence (12 touches over 90 days)
| Touch | Day | Channel | Content | Goal |
|-------|-----|---------|---------|------|
| 1 | 1 | LinkedIn connect | Personalized connection request | Get accepted |
| 2 | 3 | LinkedIn engage | Comment on their post meaningfully | Visibility |
| 3 | 7 | Email | Value-first email (insight, resource) | Open + click |
| 4 | 14 | LinkedIn DM | Reference their content, share insight | Start conversation |
| 5 | 21 | Email | Case study relevant to their industry | Credibility |
| 6 | 30 | LinkedIn engage | Share their content with commentary | Reciprocity |
| 7 | 37 | Email | Invite to event/webinar | Engagement |
| 8 | 45 | LinkedIn DM | Direct value proposition | Soft pitch |
| 9 | 52 | Email | ROI calculator or audit offer | Conversion |
| 10 | 60 | Phone/video | Attempt direct conversation | Meeting |
| 11 | 75 | Email | Final follow-up with urgency | Decision |
| 12 | 90 | LinkedIn | Relationship maintenance | Long-term |

### 4. Personalization Framework
```
LEVEL 1 (Required): Company name, contact name, industry
LEVEL 2 (Recommended): Reference specific content, recent news, mutual connection
LEVEL 3 (Premium): Custom insight/analysis for their business, video message
```

### 5. Campaign Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Connection acceptance rate | 40%+ | |
| Email open rate | 40%+ | |
| Email reply rate | 10%+ | |
| Meeting booked rate | 5-10% | |
| Pipeline generated | R$ | |

## Saida
- Dream 100 list (researched)
- 12-touch sequence templates
- Personalization playbook
- Tracking spreadsheet
- Weekly progress reports

## Validacao
- [ ] 100 prospects identified and researched
- [ ] Multi-touch sequence covers 90 days
- [ ] Personalization at Level 2 minimum
- [ ] Tracking system in place
- [ ] Metrics defined with targets
