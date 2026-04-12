---
task: setup-data-pipeline
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

# Task: Setup Data Pipeline

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Complex

## Objetivo
Configurar data pipeline — ETL/ELT de fontes diversas para data warehouse, transformacoes com dbt, e disponibilizacao para dashboards e analise.

## Entrada
- Data sources inventory
- Analytics requirements
- Dashboard architecture
- Data quality standards

## Passos

### 1. Pipeline Architecture
```yaml
pipeline:
  extract:
    sources:
      - ga4_bigquery: "Streaming + daily export"
      - crm: "API sync every hour"
      - payment: "Webhook real-time"
      - ad_platforms: "Daily API pull"
      - search_console: "Daily API pull"

  load:
    destination: BigQuery
    schema:
      raw: "Raw data, append-only"
      staging: "Cleaned, deduplicated"
      marts: "Business-ready models"

  transform:
    tool: dbt
    schedule: "Every 6 hours"
    models:
      staging:
        - stg_events: "GA4 events cleaned"
        - stg_users: "User profiles unified"
        - stg_transactions: "Revenue data normalized"
        - stg_campaigns: "Campaign data aggregated"
      marts:
        - mart_acquisition: "Channel performance"
        - mart_activation: "Activation funnel"
        - mart_retention: "Cohort retention"
        - mart_revenue: "Revenue metrics"
        - mart_experiments: "Experiment results"
```

### 2. dbt Model Structure
```
models/
├── staging/
│   ├── ga4/
│   │   ├── stg_ga4__events.sql
│   │   ├── stg_ga4__users.sql
│   │   └── stg_ga4__sessions.sql
│   ├── crm/
│   │   └── stg_crm__contacts.sql
│   └── payment/
│       └── stg_stripe__transactions.sql
├── intermediate/
│   ├── int_user_journey.sql
│   └── int_session_attribution.sql
└── marts/
    ├── mart_acquisition.sql
    ├── mart_retention.sql
    ├── mart_revenue.sql
    └── mart_experiments.sql
```

### 3. Data Quality Checks (dbt tests)
| Teste | Tipo | Target |
|-------|------|--------|
| Not null | Generic | Primary keys, required fields |
| Unique | Generic | Transaction IDs, event IDs |
| Accepted values | Generic | Enum fields (status, type) |
| Relationships | Generic | Foreign key integrity |
| Row count | Custom | > 0 rows per day |
| Freshness | Source | Data < 6 hours old |
| Value range | Custom | Revenue > 0, dates valid |

### 4. Scheduling
| Pipeline | Frequencia | SLA |
|----------|-----------|-----|
| GA4 → BigQuery | Streaming + daily batch | < 5 min (streaming), < 2h (daily) |
| CRM sync | Hourly | < 15 min |
| Payment webhooks | Real-time | < 1 min |
| Ad platforms | Daily 6:00 AM | < 1 hour |
| dbt run | Every 6 hours | < 30 min |
| Dashboard refresh | After dbt run | < 5 min |

### 5. Monitoring & Alerts
| Metrica | Alert Threshold |
|---------|----------------|
| Pipeline failure | Any failure |
| Data freshness | > 2x expected latency |
| Row count anomaly | > 50% change from baseline |
| dbt test failure | Any failure |
| Cost spike | > 2x daily average |

## Saida
- Data pipeline architecture
- dbt project structure
- Data quality tests
- Scheduling configuration
- Monitoring setup

## Validacao
- [ ] Sources extraindo dados corretamente
- [ ] BigQuery schema organizado (raw/staging/marts)
- [ ] dbt models rodando sem erros
- [ ] Data quality tests passando
- [ ] Scheduling automatizado
- [ ] Monitoring com alerts ativos
- [ ] Dados frescos nos dashboards
