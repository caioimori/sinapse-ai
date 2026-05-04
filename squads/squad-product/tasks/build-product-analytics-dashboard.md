---
task: build-product-analytics-dashboard
responsavel: "@ps-product-analyst"
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

# Build Product Analytics Dashboard

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** Dashboard spec, metric definitions, visualization recommendations, alert configuration

## Purpose
Especificar dashboard de analytics de produto que de visibilidade em tempo real sobre saude do produto, comportamento de usuarios e progresso de metricas-chave. Dashboard como ferramenta de decisao, nao apenas visualizacao.

## Steps

### Step 1: Define Dashboard Audience & Purpose
| Dashboard | Primary Audience | Update Frequency | Key Decision It Informs |
|-----------|-----------------|-----------------|------------------------|
| Executive Overview | C-level, client stakeholders | Weekly | Strategic direction, investment |
| Product Health | Product team, product lead | Daily | Priority, intervention |
| Feature Performance | Product + Engineering | Weekly | Feature investment, optimization |
| Growth & Acquisition | Growth team, marketing | Daily | Channel allocation, campaigns |
| Retention Deep Dive | Product + CS | Weekly | Retention strategy, churn prevention |

### Step 2: Specify Metrics per Dashboard
**Executive Overview Dashboard:**
| Section | Metrics | Visualization | Target |
|---------|---------|--------------|--------|
| Health Score | Composite (0-100) + 4 sub-scores | Gauge + trend sparkline | >= 70 |
| North Star | [metric] + trend | Big number + 30d trend | [target] |
| Acquisition | New signups, CAC, channel mix | Bar + line chart | [target] |
| Activation | Activation rate, TTV | Gauge + histogram | [target] |
| Retention | D30, churn rate | Cohort heatmap + line | [target] |
| Revenue | MRR, ARPU, LTV/CAC | Line + ratio gauge | [target] |
| OKR Progress | Per-KR progress bars | Horizontal bar chart | 0.6-0.7 avg |

**Product Health Dashboard:**
| Section | Metrics | Visualization |
|---------|---------|--------------|
| Real-time | Active users (now), errors (now), latency | Live counters |
| Funnels | Core funnels with conversion rates | Funnel charts |
| Features | Top 10 features by usage this week | Horizontal bar |
| Engagement | DAU/MAU, session frequency, depth | Line charts |
| Quality | Error rate, crash rate, load time | Line + threshold |
| Alerts | Active health alerts | Alert table |

### Step 3: Data Source Mapping
**Per Metric:**
| Metric | Source System | Query/Event | Refresh Interval | Data Lag |
|--------|-------------|-------------|-------------------|----------|
| [metric 1] | [Amplitude/Mixpanel/BigQuery] | [event/query] | [real-time/hourly/daily] | [minutes/hours] |
| [metric 2] | [source] | [event/query] | [interval] | [lag] |

### Step 4: Visualization Best Practices
**Chart Type Selection:**
| Data Type | Best Chart | Avoid |
|-----------|-----------|-------|
| Trend over time | Line chart | Pie chart |
| Part of whole | Stacked bar or treemap | 3D pie |
| Comparison | Horizontal bar | Radar chart |
| Distribution | Histogram or box plot | Bar chart |
| Correlation | Scatter plot | Line chart |
| Current vs target | Gauge or bullet chart | Pie chart |
| Funnel | Funnel chart | Bar chart |
| Cohort retention | Heatmap | Line chart (too many lines) |

**Dashboard Layout Rules:**
- Top-left: Most important metric (eye goes here first)
- Above the fold: Key decisions metrics (no scrolling needed)
- Filters: Date range + segment at top (global filters)
- Comparison: Always show vs previous period or target
- Context: Include benchmarks or targets on every chart
- Annotations: Mark product launches, incidents, experiments on timelines

### Step 5: Alert Configuration
**Per Critical Metric:**
| Metric | Alert Condition | Severity | Notification | Recipient |
|--------|----------------|----------|-------------|-----------|
| Error rate | > 5% for 15 min | Critical | Slack + Email | Engineering |
| Activation rate | < [target-10%] for 3 days | Warning | Slack | Product lead |
| Churn rate | > [baseline+20%] monthly | Urgent | Email | Product + CS |
| Health score | < 60 | Urgent | Slack + Email | All stakeholders |
| Data pipeline | No data for > 2 hours | Critical | Slack | Data team |

### Step 6: Dashboard Spec Document
**For Each Dashboard:**
```
DASHBOARD: [name]
────────────────────────────
Audience: [who uses this]
Update frequency: [how often data refreshes]
Access: [who can see it — link or permissions]
Tool: [Amplitude/Looker/Metabase/custom]

SECTIONS:
[Section 1]: [metrics, chart type, data source]
[Section 2]: [metrics, chart type, data source]
...

FILTERS:
- Date range (default: last 30 days)
- Segment (default: all users)
- Platform (default: all)

ALERTS:
[alert configurations]

MAINTENANCE:
- Owner: ps-product-analyst (Delta)
- Review frequency: Monthly (check relevance + accuracy)
- Data quality check: Weekly
```

## Output Artifacts
- `dashboard-spec-[name].md` | `metric-definitions.md` | `alert-configuration.md` | `dashboard-maintenance-plan.md`

## Quality Criteria
- Audience and purpose clear per dashboard | Every metric has source + formula | Visualization type appropriate for data | Alerts configured for critical metrics | Dashboard answers specific questions (not just shows data) | Monthly review process defined
