---
task: configure-activity-tracking
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

# Task: Configure Activity Tracking

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Configurar tracking de atividades comerciais no CRM — definir atividades obrigatorias, automacao de logging e metricas de produtividade de vendas.

## Entrada
- Sales process steps
- CRM platform capabilities
- Activity benchmarks
- Team workflow

## Passos

### 1. Activity Types
| Activity | Auto-Log? | Required? | Data Captured |
|----------|----------|----------|--------------|
| Email Sent | Yes (SEP sync) | — | Subject, body, recipient, open/click |
| Email Received | Yes (SEP sync) | — | Subject, body, sender |
| Call Made | Partial (VoIP) | Log required | Duration, outcome, notes |
| Call Received | Partial | Log required | Duration, topic |
| Meeting | Yes (calendar sync) | — | Duration, attendees, type |
| LinkedIn Message | Manual | Recommended | Content, response |
| Proposal Sent | Manual trigger | Required | Document, value |
| Note Added | Manual | — | Free text |

### 2. Activity-to-Outcome Benchmarks
| Activity | Weekly Target | Monthly Target | Outcome Expected |
|----------|-------------|---------------|-----------------|
| Emails (personalized) | 50-80 | 200-320 | 8-15% reply rate |
| Calls | 30-50 | 120-200 | 10-15% connect rate |
| Meetings (discovery) | 5-8 | 20-32 | 60-70% advance rate |
| Meetings (demo/proposal) | 3-5 | 12-20 | 40-50% advance rate |
| Proposals Sent | 2-4 | 8-16 | 40-60% win rate |

### 3. Automation Rules
| Trigger | Auto-Action |
|---------|-----------|
| Email sent via SEP | Log in CRM, associate to deal |
| Meeting from calendar | Create activity, link attendees |
| Call via VoIP | Log duration, prompt for notes |
| Proposal created | Log activity, update deal stage |
| No activity 7 days | Send reminder to rep |
| Activity below 50% target | Alert manager |

### 4. Productivity Dashboard
| Metric | Visualization | Target |
|--------|-------------|--------|
| Activities per day | Trend line | Track consistency |
| Activity mix | Pie chart | Multi-channel balanced |
| Activity-to-meeting ratio | Ratio | Improving trend |
| Meeting-to-proposal ratio | Ratio | 50%+ |
| Rep activity ranking | Leaderboard | Gamification |

## Saida
- Activity types configured in CRM
- Auto-logging rules active
- Productivity benchmarks set
- Dashboard live

## Validacao
- [ ] All activity types trackable
- [ ] Auto-logging tested (email, calendar)
- [ ] Benchmarks set per role
- [ ] Alerting active for low activity
