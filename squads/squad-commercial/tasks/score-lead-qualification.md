---
task: score-lead-qualification
responsavel: "@cs-sales-enablement"
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

# Task: Score Lead Qualification

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Advanced

## Objetivo
Implement a lead scoring model combining demographic, firmographic, behavioral, and intent signals. Define MQL/SQL thresholds and validate with historical data. Not all leads are created equal — scoring ensures sales time goes to the highest-probability opportunities.

## Entrada
- Enriched lead data (firmographic + technographic)
- Website and content engagement data
- Email interaction history
- Form submission and conversion data
- Historical win/loss data for model validation
- ICP definition and buyer personas

## Passos

### 1. Define Scoring Criteria
| Signal Category | Weight | Description |
|----------------|--------|-------------|
| **Demographic** | 15-20% | Job title, seniority, department, decision-making authority |
| **Firmographic** | 25-30% | Company size, industry, revenue, ICP fit |
| **Behavioral** | 30-35% | Website visits, content downloads, email engagement, demo requests |
| **Intent** | 15-25% | Third-party intent data, search behavior, competitor research |

### 2. Weight Individual Signals
| Signal | Category | Points | Rationale |
|--------|----------|--------|-----------|
| C-level / VP title | Demographic | +20 | Decision maker |
| Manager title | Demographic | +10 | Influencer |
| ICP industry match | Firmographic | +25 | High-fit vertical |
| Revenue in target range | Firmographic | +15 | Budget likely exists |
| Pricing page visit | Behavioral | +20 | High purchase intent |
| Case study download | Behavioral | +15 | Evaluating solutions |
| Blog visit only | Behavioral | +3 | Early awareness |
| Demo request | Behavioral | +30 | Strongest intent signal |
| Competitor comparison search | Intent | +20 | Active evaluation |
| Job posting for relevant role | Intent | +10 | Budget allocation signal |
| Free email domain | Demographic | -15 | Lower B2B probability |
| Unsubscribe / bounce | Behavioral | -20 | Disengagement |

### 3. Set MQL/SQL Thresholds
| Threshold | Score Range | Definition | Handoff |
|-----------|------------|------------|---------|
| **Cold** | 0-29 | Not yet engaged, no fit signals | Nurture sequence |
| **Warm** | 30-59 | Some engagement or fit, not ready | Targeted content, re-engagement |
| **MQL** | 60-79 | Marketing Qualified — sufficient fit + engagement | SDR outreach within 24h |
| **SQL** | 80-100 | Sales Qualified — strong fit + intent + engagement | AE assigned, first meeting within 48h |

### 4. Validate with Historical Data
| Validation Step | Method | Success Criteria |
|----------------|--------|-----------------|
| **Backtest** | Score historical leads, compare to actual outcomes | Correlation between score and conversion rate |
| **Win rate by score band** | Analyze win rate per score range | Higher scores = higher win rates (monotonic) |
| **False positive rate** | High-score leads that didn't convert | <20% false positive rate for SQL |
| **False negative rate** | Low-score leads that did convert | <10% false negative rate |
| **Time-to-close by score** | Avg sales cycle per score band | Higher scores = shorter cycles |
| **Model drift** | Compare current scoring accuracy to baseline | Re-calibrate quarterly if drift >10% |

## Saida
- Lead scoring model documentation (criteria, weights, thresholds)
- MQL/SQL threshold definitions with handoff protocols
- Validation report with historical backtesting results
- Scoring automation rules for CRM/MAP implementation
- Model calibration schedule and process

## Validacao
- [ ] All 4 signal categories defined with weights
- [ ] Individual signal scores documented with rationale
- [ ] MQL/SQL thresholds set and documented
- [ ] Model validated against historical data
- [ ] False positive/negative rates within acceptable range
- [ ] Quarterly calibration process defined
