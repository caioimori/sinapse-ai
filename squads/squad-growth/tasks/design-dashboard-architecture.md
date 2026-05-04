---
task: design-dashboard-architecture
responsavel: "@ga-analytics-engineer"
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

# Task: Design Dashboard Architecture

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Complex

## Objetivo
Projetar arquitetura de dashboards — hierarquia de KPIs, layout por audience, data sources e refresh strategy para informar decisoes em todos os niveis.

## Entrada
- North Star Metric and OKRs
- KPI tree
- Stakeholder requirements
- Data sources inventory

## Passos

### 1. Dashboard Hierarchy
| Level | Audience | Refresh | Content |
|-------|---------|---------|---------|
| L1 Executive | C-level, founders | Daily | North Star, revenue, growth rate |
| L2 Strategic | Directors, managers | Daily | Channel performance, funnel, cohorts |
| L3 Operational | Analysts, marketers | Real-time | Campaign metrics, experiment status |
| L4 Tactical | Engineers, specialists | Real-time | Tracking health, data quality |

### 2. L1 Executive Dashboard
| Widget | Tipo | Metrica | Visualization |
|--------|------|---------|--------------|
| North Star | Scorecard | NSM value + trend | Big number + sparkline |
| Revenue | Scorecard | MRR/ARR + growth | Big number + % change |
| Acquisition | Timeseries | New users/week | Line chart (4 weeks) |
| Activation | Gauge | Activation rate | Progress bar + target |
| Retention | Cohort | D30 retention | Heatmap (simplified) |
| Top channels | Bar | Users by channel | Horizontal bar |

### 3. L2 Strategic Dashboard
| Widget | Tipo | Metrica |
|--------|------|---------|
| AARRR Funnel | Funnel chart | Full funnel with conversion rates |
| Channel Performance | Table | CAC, ROAS, volume by channel |
| Cohort Retention | Heatmap | Weekly cohort retention curves |
| Experiment Status | Table | Active experiments, status, impact |
| Content Performance | Table | Top pages by traffic + conversion |
| SEO Overview | Scorecard | Organic traffic, rankings, CTR |

### 4. Data Source Architecture
```yaml
data_sources:
  primary:
    - name: GA4
      type: web_analytics
      connection: BigQuery export
      refresh: streaming + daily
    - name: CRM
      type: customer_data
      connection: API / ETL
      refresh: hourly
    - name: Payment
      type: revenue
      connection: Stripe API
      refresh: real-time webhooks

  secondary:
    - name: Ad Platforms
      type: campaign
      connection: Supermetrics / API
      refresh: daily
    - name: Search Console
      type: seo
      connection: API
      refresh: daily
    - name: Experiment Platform
      type: experimentation
      connection: API
      refresh: real-time

  warehouse:
    platform: BigQuery
    models: dbt
    schema:
      raw: "raw_{source}"
      staging: "stg_{domain}"
      marts: "mart_{domain}"
```

### 5. KPI Tree Structure
```
North Star Metric
├── Acquisition
│   ├── Organic traffic
│   ├── Paid traffic
│   ├── Referral traffic
│   └── Direct traffic
├── Activation
│   ├── Sign-up rate
│   ├── Time to first value
│   └── Feature adoption rate
├── Retention
│   ├── D1 retention
│   ├── D7 retention
│   └── D30 retention
├── Revenue
│   ├── ARPU
│   ├── Conversion rate
│   └── Expansion revenue
└── Referral
    ├── NPS
    ├── Referral rate
    └── Viral coefficient
```

### 6. Dashboard Design Principles
| Principio | Descricao |
|-----------|----------|
| One question per dashboard | Cada dashboard responde uma pergunta |
| 5-second rule | Insight principal em 5 segundos |
| Progressive disclosure | Overview → drill down |
| Context always | Comparison (vs period, vs target) |
| Action-oriented | Every metric suggests an action |
| No vanity metrics | Only metrics that drive decisions |

## Saida
- Dashboard architecture document
- KPI tree visualization
- Dashboard specs per level
- Data source architecture
- Refresh strategy

## Validacao
- [ ] Dashboard hierarchy por audience level
- [ ] KPI tree alinhado com North Star
- [ ] Data sources mapeados
- [ ] Refresh strategy definida
- [ ] Design principles seguidos
- [ ] Stakeholders aprovaram specs
