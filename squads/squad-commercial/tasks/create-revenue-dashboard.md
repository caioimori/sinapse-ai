---
task: create-revenue-dashboard
responsavel: "@cs-revops-analyst"
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

# Task: Create Revenue Dashboard

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Standard

## Objetivo
Criar dashboard de revenue board-ready — visualizacao executiva de todas as metricas de receita, pipeline, eficiencia e retencao em formato pronto para board de diretores.

## Entrada
- All revenue metrics (from other Ledger tasks)
- Pipeline data (from Vault)
- Retention data (from Bond)
- Funnel data (from Cascade)

## Passos

### 1. Dashboard Sections
| Section | Key Visualizations | Update Frequency |
|---------|-------------------|-----------------|
| Revenue Overview | ARR/MRR trend, MRR waterfall | Monthly |
| Pipeline Health | Coverage ratio, stage distribution | Weekly |
| Unit Economics | CAC, LTV, Magic Number, Quick Ratio | Monthly |
| Retention | NRR, GRR, churn trend, health distribution | Monthly |
| Forecast | Bear/Base/Bull, forecast vs actual | Monthly |
| Team Performance | Quota attainment, productivity | Monthly |

### 2. Executive Summary View (1-Page)
```
REVENUE DASHBOARD — [Period]

ARR: R$ [X] (+Y% YoY)  |  MRR: R$ [X] (+Y% MoM)
NRR: [X]%  |  GRR: [X]%  |  Quick Ratio: [X]

Pipeline: R$ [X] ([X]x coverage)
Forecast (Base): R$ [X] for Q[X]

CAC: R$ [X]  |  LTV:CAC: [X]:1  |  Payback: [X] months
Win Rate: [X]%  |  Avg Deal: R$ [X]  |  Cycle: [X] days

Health: [X]% Green  |  [X]% Yellow  |  [X]% Red
NPS: [X]  |  Expansion Rate: [X]%

TOP 3 PRIORITIES:
1. [Priority with metric impact]
2. [Priority]
3. [Priority]
```

### 3. Visualization Best Practices
| Metric | Best Chart Type | Why |
|--------|---------------|-----|
| ARR/MRR trend | Line chart | Shows trajectory |
| MRR waterfall | Waterfall chart | Shows composition of change |
| Pipeline stages | Horizontal bar/funnel | Shows stage distribution |
| NRR/GRR | Gauge/big number | Quick health read |
| Health distribution | Donut chart | Proportion visualization |
| Forecast scenarios | Band/area chart | Shows uncertainty range |
| Quota attainment | Bar chart with target line | Individual performance |

### 4. Drill-Down Capability
| Top Level | Drill to | Details |
|-----------|---------|---------|
| ARR | By segment (new/expansion/renewal) | Then by rep/territory |
| Pipeline | By stage | Then by deal |
| NRR | By cohort | Then by account |
| Win Rate | By segment/channel | Then by deal characteristics |

## Saida
- Board-ready revenue dashboard
- Executive 1-page summary template
- Drill-down views configured
- Automated refresh schedule

## Validacao
- [ ] All key metrics visible on 1 page
- [ ] Data refreshes automatically
- [ ] Drill-down capability operational
- [ ] Formatted for board/executive consumption
