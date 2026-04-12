---
task: calculate-funnel-math
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

# Task: Calculate Funnel Math

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Advanced

## Objetivo
Calcular a matematica do funil — trabalhar de tras pra frente a partir da meta de receita para determinar quantos leads, MQLs, SQLs e oportunidades sao necessarios por canal e por periodo.

## Entrada
- Revenue targets (quarterly/annual)
- Average deal value (ACV)
- Historical conversion rates by stage
- Channel mix and CPL by source
- Sales team capacity

## Passos

### 1. Reverse Funnel Calculation
```
FUNNEL MATH — [Period]

Revenue Target:           R$ ____________
Average Deal Value (ACV):  R$ ____________
Deals Needed:              Target / ACV = ________

Working Backward:
  Deals Needed:            ________ (Revenue / ACV)
  ÷ Win Rate (%):          ________ = Opportunities Needed
  ÷ SQL→Opp Rate (%):      ________ = SQLs Needed
  ÷ MQL→SQL Rate (%):      ________ = MQLs Needed
  ÷ Lead→MQL Rate (%):     ________ = Leads Needed
  ÷ Visit→Lead Rate (%):   ________ = Visits Needed
```

### 2. Worked Example
```
Revenue Target:   R$ 1,000,000 / quarter
ACV:              R$ 50,000
Deals Needed:     1,000,000 / 50,000 = 20 deals

20 deals ÷ 25% win rate = 80 opportunities
80 opps ÷ 65% SQL→Opp = 123 SQLs
123 SQLs ÷ 14% MQL→SQL = 879 MQLs
879 MQLs ÷ 30% Lead→MQL = 2,930 leads
2,930 leads ÷ 3% Visit→Lead = 97,667 visits

Monthly requirement:
  Visits: ~32,556/month
  Leads: ~977/month
  MQLs: ~293/month
  SQLs: ~41/month
  Opps: ~27/month
  Deals: ~7/month
```

### 3. Channel Allocation Model
| Channel | % of Leads | Leads/mo | CPL | Monthly Cost | Quality (MQL%) |
|---------|-----------|----------|-----|-------------|---------------|
| Organic/SEO | | | R$ | R$ | |
| Paid Search | | | R$ | R$ | |
| Paid Social | | | R$ | R$ | |
| Referral | | | R$ | R$ | |
| Outbound | | | R$ | R$ | |
| Events | | | R$ | R$ | |
| **Total** | 100% | | Blended: R$ | R$ | |

### 4. Sensitivity Analysis
| Scenario | Win Rate | ACV | Required MQLs | Monthly Cost |
|----------|---------|-----|--------------|-------------|
| Conservative | -5pp | Same | ↑ | R$ |
| Base | Current | Current | Base | R$ |
| Optimistic | +5pp | +10% | ↓ | R$ |

### 5. Capacity Check
| Resource | Available | Required | Gap |
|----------|----------|----------|-----|
| SDR capacity (meetings/mo) | | | |
| AE capacity (deals/mo) | | | |
| Marketing budget (R$/mo) | | | |
| Content production (pieces/mo) | | | |

## Saida
- Complete funnel math model
- Channel allocation with budget
- Sensitivity analysis (3 scenarios)
- Capacity gap analysis

## Validacao
- [ ] Math traces cleanly from revenue to visits
- [ ] Channel allocation sums to 100%
- [ ] Sensitivity analysis includes best/base/worst
- [ ] Capacity gaps identified and flagged
