---
task: build-lead-scoring-model
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

# Task: Build Lead Scoring Model

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Advanced

## Objetivo
Construir modelo de lead scoring — combinar sinais demograficos e comportamentais para classificar leads por probabilidade de conversao, garantindo que sales foque nos leads com maior potencial.

## Entrada
- ICP profile (from define-icp-profile)
- Historical conversion data
- CRM and analytics data
- Sales feedback on lead quality

## Passos

### 1. Scoring Dimensions
| Dimension | Type | Max Points | Description |
|-----------|------|-----------|-------------|
| **Demographic** | Explicit | 50 pts | Who they are (job title, company size) |
| **Behavioral** | Implicit | 50 pts | What they do (visits, downloads, opens) |
| **Negative** | Deduction | -30 pts | Disqualifying signals |
| **Total** | | 100 pts | MQL threshold = 60+ |

### 2. Demographic Scoring
| Attribute | Value | Points |
|-----------|-------|--------|
| Job Title | C-Level, VP | +20 |
| | Director, Head of | +15 |
| | Manager | +10 |
| | Individual contributor | +5 |
| | Student, Intern | -10 |
| Company Size | Enterprise (500+) | +15 |
| | Mid-Market (50-499) | +12 |
| | Small (10-49) | +8 |
| | Micro (1-9) | +3 |
| Industry | Target industries | +10 |
| | Adjacent industries | +5 |
| | Non-target | 0 |
| Location | Target regions | +5 |

### 3. Behavioral Scoring
| Behavior | Points | Decay |
|----------|--------|-------|
| Visited pricing page | +15 | -5/30 days |
| Requested demo | +20 | No decay |
| Downloaded BOFU content | +12 | -3/30 days |
| Downloaded MOFU content | +8 | -3/30 days |
| Downloaded TOFU content | +3 | -2/30 days |
| Attended webinar | +10 | -3/30 days |
| Opened 3+ emails | +5 | -2/30 days |
| Clicked email CTA | +8 | -3/30 days |
| Replied to email | +15 | No decay |
| Visited 5+ pages in session | +5 | -2/30 days |
| Return visit (within 7 days) | +8 | -3/30 days |

### 4. Negative Scoring
| Signal | Points |
|--------|--------|
| Competitor company | -20 |
| Free email domain (gmail, hotmail) for B2B | -10 |
| Unsubscribed from emails | -15 |
| Bounced email | -10 |
| No activity > 90 days | -15 |
| Job title: Student/Intern | -10 |

### 5. Score Tiers & Actions
| Tier | Score | Label | Action |
|------|-------|-------|--------|
| Hot | 80-100 | MQL (High) | Immediate sales outreach (< 5 min SLA) |
| Warm | 60-79 | MQL (Standard) | Sales outreach (< 4 hour SLA) |
| Nurture | 40-59 | Marketing Qualified | Continue nurture sequence |
| Cold | 20-39 | Interested | Long-term nurture |
| Disqualified | <20 | Not Qualified | Remove from active nurture |

### 6. Model Calibration
```
Quarterly calibration process:
1. Export all leads scored 60+ in past quarter
2. Track which converted to SQL → Opp → Won
3. Calculate conversion rate by score tier
4. Adjust weights where tier conversion diverges from expected
5. Validate with sales team (quality feedback)

Target: 80%+ of MQLs should be accepted by sales as genuine SQLs
```

## Saida
- Lead scoring model documented
- Scoring rules configured in CRM/MA platform
- Score-to-action automation active
- Calibration schedule established

## Validacao
- [ ] Both demographic and behavioral dimensions scored
- [ ] Negative scoring prevents false positives
- [ ] Score decay prevents stale leads from persisting
- [ ] MQL threshold validated against historical data
