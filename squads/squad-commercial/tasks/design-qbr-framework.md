---
task: design-qbr-framework
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

# Task: Design QBR Framework

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Desenhar framework de Quarterly Business Review — reuniao estrategica trimestral com o cliente para demonstrar valor, alinhar objetivos e identificar oportunidades de expansao.

## Entrada
- Account performance data
- Health score history
- Success plan milestones
- Expansion opportunity map

## Passos

### 1. QBR Agenda Template (60 minutes)
| Block | Duration | Content | Owner |
|-------|----------|---------|-------|
| Opening | 5 min | Agenda, attendees, context | CSM |
| Value Recap | 15 min | KPIs achieved, ROI delivered | CSM |
| Insights | 10 min | Data-driven insights and recommendations | CSM |
| Client Feedback | 10 min | Satisfaction, challenges, needs | Client |
| Next Quarter Goals | 10 min | Align on priorities and targets | Both |
| Growth Discussion | 5 min | Expansion opportunities (if appropriate) | CSM |
| Close | 5 min | Action items, next steps | CSM |

### 2. Value Recap Section
```
VALUE DELIVERED — Q[X]

GOALS SET LAST QBR:
1. [Goal 1]: [Target] → [Actual] [✅/❌]
2. [Goal 2]: [Target] → [Actual] [✅/❌]
3. [Goal 3]: [Target] → [Actual] [✅/❌]

KEY METRICS:
| Metric | Last Quarter | This Quarter | Change |
|--------|-------------|-------------|--------|
| | | | +/-% |

ROI CALCULATION:
  Investment: R$ [service cost]
  Value Generated: R$ [measurable outcomes]
  ROI: [value / investment] = Xx return
```

### 3. Insight Delivery
| Insight | Data Supporting | Recommendation | Expected Impact |
|---------|---------------|---------------|----------------|
| | | | |

### 4. QBR Stakeholder Strategy
| Attendee (Us) | Attendee (Client) | Purpose |
|-------------|------------------|---------|
| CSM | Day-to-day contact | Operational review |
| CS Director or VP | VP/Director | Strategic alignment |
| Subject matter expert | Relevant team lead | Deep dive on specific topic |

### 5. QBR Scoring
After each QBR, CSM rates:
| Dimension | Score (1-5) | Notes |
|-----------|-----------|-------|
| Client engagement level | | Were they participative? |
| Value acknowledged | | Did they recognize ROI? |
| Future commitment | | Did they express continued interest? |
| Expansion signals | | Did growth opportunities surface? |
| Relationship health | | How strong is the relationship? |

## Saida
- QBR framework document
- Presentation template
- Value calculation methodology
- QBR scoring rubric

## Validacao
- [ ] Agenda covers value, insights, and growth
- [ ] ROI calculation methodology defined
- [ ] Stakeholder strategy documented
- [ ] Post-QBR scoring captures expansion signals
