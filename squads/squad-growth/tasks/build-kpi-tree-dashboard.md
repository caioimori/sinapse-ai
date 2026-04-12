---
task: build-kpi-tree-dashboard
responsavel: "@ga-data-analyst"
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

# Task: Build KPI Tree Dashboard

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Standard

## Objetivo
Construir KPI tree dashboard — criar arvore hierarquica de metricas que conecta North Star Metric aos drivers operacionais, com dashboard interativo para drill-down e diagnostico.

## Entrada
- North Star Metric definition
- Business model (SaaS, e-commerce, marketplace)
- Revenue/growth drivers
- Data sources available

## Passos

### 1. KPI Tree Structure
```
North Star Metric (ex: Monthly Revenue)
├── Acquisition
│   ├── Traffic (sessions)
│   │   ├── Organic Search
│   │   ├── Paid Search
│   │   ├── Social
│   │   ├── Direct
│   │   ├── Referral
│   │   └── Email
│   └── Conversion Rate
│       ├── Landing Page CR
│       ├── Funnel Completion Rate
│       └── Cart Abandonment Rate
├── Monetization
│   ├── AOV (Average Order Value)
│   │   ├── Items per Order
│   │   ├── Average Item Price
│   │   └── Upsell/Cross-sell Rate
│   └── Purchase Frequency
│       ├── Time Between Purchases
│       └── Repeat Purchase Rate
├── Retention
│   ├── D30 Retention Rate
│   ├── Monthly Churn Rate
│   ├── Net Revenue Retention
│   └── Customer Lifetime (months)
└── Efficiency
    ├── CAC (Customer Acquisition Cost)
    │   ├── Marketing Spend
    │   └── New Customers Acquired
    ├── LTV:CAC Ratio
    └── Payback Period
```

### 2. KPI Definitions
| KPI | Formula | Frequencia | Owner | Target |
|-----|---------|-----------|-------|--------|
| North Star | Definir por negocio | Daily | CEO | |
| Traffic | Total sessions | Daily | Marketing | |
| Conversion Rate | Conversions / Sessions | Daily | CRO | |
| AOV | Revenue / Orders | Daily | Product | |
| Retention D30 | Active D30 / Acquired | Weekly | Product | |
| CAC | Total Spend / New Customers | Monthly | Marketing | |
| LTV | See LTV task | Monthly | Analytics | |
| ARPU | Revenue / Active Users | Monthly | Finance | |

### 3. Dashboard Architecture
| Layer | Conteudo | Audiencia | Refresh |
|-------|---------|----------|---------|
| L1 Executive | North Star + 4-5 top KPIs | C-level | Daily |
| L2 Strategic | KPI branches (Acquisition, Monetization, Retention) | VPs/Directors | Daily |
| L3 Operational | Detailed drivers per branch | Managers | Daily/Hourly |
| L4 Tactical | Individual metrics, A/B tests, experiments | Analysts | Real-time |

### 4. Dashboard Spec — L1 Executive
| Widget | Tipo | Dados |
|--------|------|-------|
| North Star | Big Number + Sparkline | MTD vs target, 12-month trend |
| Revenue | Scorecard | MTD actual vs forecast, YoY change |
| Traffic | Line chart | 30-day trend, by channel |
| Conversion Rate | Gauge | Current vs target |
| CAC/LTV | Dual scorecard | Current values + trend arrows |
| Health Score | Traffic light | Red/Yellow/Green based on KPI thresholds |

### 5. Dashboard Spec — L2 Acquisition
| Widget | Tipo | Dados |
|--------|------|-------|
| Channel breakdown | Stacked area | Traffic por canal, 90 days |
| Conversion funnel | Funnel chart | Stage-by-stage with drop-off |
| CAC by channel | Horizontal bar | CAC + volume por canal |
| Top campaigns | Table | Top 10 campaigns by ROI |
| New vs Returning | Pie + trend | Ratio e tendencia |

### 6. Alert Configuration
| KPI | Green | Yellow | Red | Action |
|-----|-------|--------|-----|--------|
| North Star | On/above target | -5% to -10% | > -10% | Notify CEO |
| Traffic | +/- 5% | -5% to -15% | > -15% | Notify Marketing |
| Conversion Rate | +/- 0.3pp | -0.3 to -1pp | > -1pp | Notify CRO |
| CAC | On/below target | +10% to +25% | > +25% | Notify CMO |
| Churn | On/below target | +1pp to +3pp | > +3pp | Notify Product |

### 7. Data Source Mapping
| KPI | Source | Table/View | Refresh |
|-----|--------|-----------|---------|
| Traffic | GA4 | analytics_sessions | Hourly |
| Revenue | Payment System | orders | Real-time |
| Conversions | GA4 + Backend | conversion_events | Hourly |
| CAC | Ads APIs + Finance | marketing_spend | Daily |
| Retention | Backend | user_activity | Daily |
| LTV | Data Warehouse | customer_ltv_model | Weekly |

### 8. Implementation Stack Options
| Ferramenta | Tipo | Custo | Integracao |
|-----------|------|-------|-----------|
| Looker Studio | BI Cloud | Free | GA4, BigQuery native |
| Metabase | BI Self-hosted | Free/Open | SQL databases |
| Preset (Superset) | BI Cloud | Freemium | Any SQL source |
| Grafana | Monitoring | Free/Open | Time series + SQL |
| Custom (Next.js + Chart.js) | App | Dev cost | Full control |

## Saida
- KPI tree documentation
- Dashboard specifications por layer
- Alert configuration
- Data source mapping
- Implementation plan

## Validacao
- [ ] North Star Metric definida e conectada aos drivers
- [ ] KPI tree com pelo menos 3 niveis de profundidade
- [ ] Dashboard specs para L1 e L2 (minimo)
- [ ] Alert thresholds definidos
- [ ] Data sources mapeados e acessiveis
- [ ] Refresh rates adequados para cada metrica
- [ ] Owners definidos para cada KPI
