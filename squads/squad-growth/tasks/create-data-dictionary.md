---
task: create-data-dictionary
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

# Task: Create Data Dictionary

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Criar data dictionary — documentacao completa de todas as tabelas, campos, tipos, descricoes e regras de negocio para garantir entendimento compartilhado dos dados.

## Entrada
- Database schema
- Event taxonomy
- Business rules
- Stakeholder terminology

## Passos

### 1. Data Dictionary Structure
| Campo | Descricao |
|-------|----------|
| Table name | Nome da tabela/view |
| Column name | Nome do campo |
| Data type | STRING, INTEGER, FLOAT, TIMESTAMP, BOOLEAN, ARRAY, STRUCT |
| Description | Descricao clara do campo |
| Business rule | Regra de negocio aplicavel |
| Example value | Valor de exemplo |
| Nullable | Sim/Nao |
| PII | Sim/Nao (se sim, hash required) |
| Source | Origem do dado |

### 2. Core Tables Documentation
| Tabela | Descricao | Granularidade | Source |
|--------|----------|--------------|--------|
| mart_acquisition | Metricas de aquisicao por canal | Daily × Channel | GA4 + Ads |
| mart_activation | Funnel de ativacao | Event-level | GA4 |
| mart_retention | Cohort retention | Weekly × Cohort | GA4 + CRM |
| mart_revenue | Metricas de receita | Daily × Product | Payment + CRM |
| mart_experiments | Resultados de experimentos | Experiment × Variant | Experiment platform |
| stg_events | Eventos limpos do GA4 | Event-level | GA4 BigQuery export |
| stg_users | Perfis de usuarios unificados | User-level | GA4 + CRM |
| stg_sessions | Sessoes reconstruidas | Session-level | GA4 |

### 3. Metrics Definitions
| Metrica | Formula | Descricao | Owner |
|---------|---------|----------|-------|
| North Star Metric | {defined in growth brief} | Core value metric | Catalyst |
| DAU | COUNT(DISTINCT user_id) WHERE date = today | Daily active users | Insight |
| MAU | COUNT(DISTINCT user_id) WHERE date >= today-30 | Monthly active users | Insight |
| Activation Rate | activated_users / signed_up_users | % users who reach first value | Lever |
| D30 Retention | users_active_day30 / cohort_size | % users retained after 30 days | Insight |
| CAC | total_acquisition_cost / new_customers | Cost to acquire one customer | Pulse |
| LTV | avg_revenue_per_user × avg_lifetime_months | Lifetime value of customer | Insight |
| ARPU | total_revenue / active_users | Average revenue per user | Insight |
| Churn Rate | churned_users / total_users_start | % users lost per period | Insight |
| Conversion Rate | conversions / visitors | % visitors who convert | Convert |

### 4. Dimension Definitions
| Dimensao | Valores Possiveis | Descricao |
|----------|------------------|----------|
| channel | organic, paid_search, paid_social, email, direct, referral | Traffic source channel |
| device_category | desktop, mobile, tablet | User device type |
| user_type | anonymous, prospect, customer, churned | User lifecycle stage |
| plan_type | free, starter, pro, enterprise | Subscription plan |
| country | ISO 3166-1 codes | User country |
| content_type | blog, landing, product, docs | Page content category |

### 5. Glossary
| Termo | Definicao |
|-------|----------|
| Session | Group of user interactions within 30 min of activity |
| Conversion | Completion of a defined goal (sign_up, purchase, etc.) |
| Attribution | Assignment of credit to marketing touchpoints |
| Cohort | Group of users who share a common characteristic (e.g., signup week) |
| Funnel | Sequence of steps toward a conversion goal |
| Bounce | Session with only one page view |
| Engagement rate | Sessions with engagement / total sessions (GA4) |

## Saida
- Complete data dictionary document
- Metrics definitions with formulas
- Dimension definitions
- Business glossary
- Data lineage documentation

## Validacao
- [ ] Todas as tabelas documentadas
- [ ] Campos com tipo, descricao e exemplo
- [ ] Metricas com formulas claras
- [ ] Dimensoes com valores possiveis
- [ ] Glossario de termos de negocio
- [ ] PII fields identificados
- [ ] Stakeholders revisaram e aprovaram
