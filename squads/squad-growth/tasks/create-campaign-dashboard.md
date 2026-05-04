---
task: create-campaign-dashboard
responsavel: "@ga-campaign-analyst"
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

# Task: Create Campaign Dashboard

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Criar dashboard de campanhas — construir visualizacao unificada de performance de todas as campanhas de marketing, com drill-down por canal, campanha e creative, permitindo decisoes rapidas de otimizacao.

## Entrada
- Ad platform data (Google, Meta, LinkedIn, etc.)
- GA4 campaign data
- Revenue/conversion data
- UTM strategy document

## Passos

### 1. Dashboard Architecture
| Layer | Conteudo | Audiencia | Refresh |
|-------|---------|----------|---------|
| L1 Overview | Total spend, revenue, ROAS, conversions | CMO/VP | Daily |
| L2 Channel | Performance por canal | Channel managers | Daily |
| L3 Campaign | Drill-down por campanha | Campaign managers | Daily |
| L4 Creative | Ad-level performance | Creative team | Daily |

### 2. L1 — Campaign Overview
| Widget | Tipo | Dados |
|--------|------|-------|
| Total Spend MTD | Big number + vs target | Sum of all platform spend |
| Total Revenue MTD | Big number + vs forecast | Attributed revenue |
| Blended ROAS | Gauge + trend | Total revenue / Total spend |
| Total Conversions | Big number + trend | All conversion events |
| Blended CAC | Big number + trend | Total spend / New customers |
| Spend vs Revenue | Dual-axis line chart | 30-day trend |
| Channel Mix | Stacked bar or donut | Spend distribution |
| Top Campaigns | Table (sortable) | Top 10 by ROAS or revenue |

### 3. L2 — Channel Performance
| Widget | Tipo | Dados |
|--------|------|-------|
| Channel comparison | Horizontal bar | ROAS by channel |
| Spend allocation | Treemap | Spend by channel |
| Efficiency scatter | Scatter plot | X: Spend, Y: ROAS, Size: Revenue |
| Channel trends | Multi-line | ROAS trend by channel (90 days) |
| CAC by channel | Bar chart | CAC comparison |
| Conversion volume | Stacked area | Conversions by channel over time |
| Quality metrics | Table | Bounce, engagement, pages per channel |

### 4. L3 — Campaign Deep-Dive
| Widget | Tipo | Dados |
|--------|------|-------|
| Campaign table | Data table (sortable, filterable) | All campaigns with KPIs |
| Campaign comparison | Bar chart | Selected campaigns side-by-side |
| Daily performance | Line chart | Selected campaign daily metrics |
| Audience breakdown | Pie/donut | Performance by audience segment |
| Geo performance | Choropleth map | ROAS/conversions by region |
| Device split | Stacked bar | Mobile vs Desktop metrics |
| Hour of day | Heatmap | Conversions by day × hour |

### 5. L4 — Creative Performance
| Widget | Tipo | Dados |
|--------|------|-------|
| Ad creative gallery | Image grid + metrics | Creative thumbnails with CTR, ROAS |
| A/B comparison | Side-by-side | Two creatives with statistical comparison |
| Creative fatigue | Line chart | CTR decline over impressions |
| Copy performance | Table | Headline/description variants with CTR |
| Format comparison | Bar chart | Image vs Video vs Carousel |

### 6. Filters & Interactivity
| Filtro | Tipo | Opcoes |
|--------|------|--------|
| Date range | Date picker | Last 7/14/30/90 days, custom |
| Channel | Multi-select | All, Google, Meta, LinkedIn, etc. |
| Campaign objective | Dropdown | Awareness, Consideration, Conversion |
| Status | Toggle | Active, Paused, All |
| Budget type | Dropdown | All, Daily, Lifetime |
| Comparison | Toggle | vs Previous period, vs Same period last year |

### 7. Data Source Integration
| Fonte | Dados | Conexao | Refresh |
|-------|-------|---------|---------|
| Google Ads API | Spend, clicks, impressions, conversions | API or Connector | 6h |
| Meta Marketing API | Spend, reach, engagement, conversions | API or Connector | 6h |
| LinkedIn Campaign Manager | Spend, clicks, conversions | API or Connector | Daily |
| GA4 | Sessions, behavior, GA4 conversions | BigQuery or API | 4h |
| Backend/CRM | Revenue, customers, LTV | Database | Real-time |
| Spreadsheet | Budget targets, goals | Manual or sync | Weekly |

### 8. Alert Configuration
| Alerta | Condicao | Acao |
|--------|---------|------|
| Budget pacing | Spend > 110% of daily budget | Notify campaign manager |
| ROAS drop | Campaign ROAS < 50% of target | Notify + auto-pause option |
| Creative fatigue | CTR drop > 30% over 7 days | Notify creative team |
| Conversion spike | Conversions > 3x daily average | Investigate (possible tracking issue) |
| Zero spend | Active campaign with R$0 spend | Notify immediately |
| High CPA | CPA > 2x target | Notify for review |

## Saida
- Dashboard specification document
- Widget definitions por layer
- Data source mapping
- Filter/interactivity requirements
- Alert configuration
- Implementation plan

## Validacao
- [ ] 4 layers de dashboard especificados
- [ ] Widgets definidos com tipo e dados
- [ ] Data sources mapeados com refresh rates
- [ ] Filtros interativos definidos
- [ ] Alertas configurados
- [ ] Audiencia por layer documentada
- [ ] Implementation tool selecionado
