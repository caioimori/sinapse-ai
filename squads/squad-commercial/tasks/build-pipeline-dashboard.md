---
task: build-pipeline-dashboard
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

# Task: Build Pipeline Dashboard

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Construir dashboard de pipeline — visualizacao em tempo real de saude do pipeline, deal flow, velocidade e cobertura para decisoes comerciais rapidas e informadas.

## Entrada
- CRM data (deals, activities, stages)
- Revenue targets and quotas
- Team structure
- KPI definitions

## Passos

### 1. Dashboard Sections
| Section | Key Visualizations | Audience |
|---------|-------------------|----------|
| Pipeline Overview | Total value by stage (waterfall) | All |
| Pipeline Coverage | Coverage ratio vs quota (gauge) | Leadership |
| Deal Flow | New vs moved vs closed (flow chart) | Managers |
| Stage Health | Avg time in stage, conversion rates | Managers |
| Rep Performance | Deals, value, activities per rep | Leadership |
| Forecast Board | Commit/Best Case/Pipeline (stacked bar) | Leadership |
| Activity Metrics | Calls, emails, meetings (trend line) | All |

### 2. Key Metrics
| Metric | Visualization | Refresh |
|--------|-------------|---------|
| Total Pipeline Value | Big number + trend | Real-time |
| Pipeline Coverage Ratio | Gauge (target 3-5x) | Daily |
| Win Rate (30d rolling) | Line chart | Daily |
| Avg Deal Size | Big number + trend | Daily |
| Sales Velocity | Line chart | Weekly |
| Stage Conversion Rates | Funnel chart | Weekly |
| Deals Aging > 2x Cycle | Counter (red if > 0) | Real-time |
| Activity Volume | Bar chart by type | Daily |
| Lead Response Time | Avg (target < 5 min) | Real-time |

### 3. Filters & Segmentation
| Filter | Options |
|--------|---------|
| Time Period | This week, month, quarter, custom |
| Team / Rep | Individual or team view |
| Pipeline | By pipeline (new, expansion, renewal) |
| Stage | Any specific stage or all |
| Deal Size | Small / Medium / Large / Enterprise |
| Lead Source | By acquisition channel |

### 4. Alert Configuration
| Alert | Condition | Notify |
|-------|----------|--------|
| Stale Deal | No activity > 14 days | Rep + manager |
| Low Coverage | Pipeline coverage < 3x | Manager + VP |
| SLA Breach | Lead response > 10 min | Rep + manager |
| Big Deal Movement | Deal > $50K changes stage | VP |
| Lost Deal | Any deal closed lost | Manager |

## Saida
- Pipeline dashboard built and live
- Alerts configured
- Team trained on dashboard usage
- Refresh schedule documented

## Validacao
- [ ] All key metrics visible
- [ ] Real-time data refresh working
- [ ] Filters operational
- [ ] Alerts tested and delivering
