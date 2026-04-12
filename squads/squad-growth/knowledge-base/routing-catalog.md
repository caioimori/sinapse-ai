# Routing Catalog — Growth Analytics

Maps keywords and domains to specialist agents for intelligent routing within the Growth squad.

## Domain Routing Matrix

| Domain | Keywords | Primary Agent | Secondary Agent |
|--------|----------|--------------|-----------------|
| SEO strategy | SEO, search engine, organic traffic, rankings, keywords, backlinks, topical authority, programmatic SEO | ga-seo-strategist | ga-data-analyst |
| Growth hacking | growth hacking, viral, referral, activation, network effects, flywheel, PLG, growth loop, K-factor | ga-growth-hacker | growth-orqx |
| Analytics & data | analytics, GA4, dashboard, metrics, KPIs, data analysis, reporting, cohort, retention | ga-data-analyst | ga-analytics-engineer |
| Analytics engineering | tracking, tag manager, GTM, data pipeline, event schema, data layer, BigQuery, dbt | ga-analytics-engineer | ga-data-analyst |
| CRO (organic) | conversion rate, A/B test, experimentation, optimization, funnel, landing page, checkout | ga-cro-specialist | ga-growth-hacker |
| Campaign analysis | campaign performance, channel attribution, ROI analysis, spend analysis, CAC, LTV | ga-campaign-analyst | ga-data-analyst |
| Orchestration & strategy | growth strategy, OKRs, growth model, north star metric, unit economics, AARRR | growth-orqx | ga-growth-hacker |
| Retention & lifecycle | retention, churn, lifecycle email, win-back, engagement, DAU/MAU, Hook Model | ga-growth-hacker | ga-data-analyst |
| Referral & viral | referral program, viral coefficient, K-factor, referral mechanics, incentive design | ga-growth-hacker | ga-cro-specialist |
| Product-led growth | PLG, PQL, onboarding, time-to-value, freemium, trial conversion, activation | ga-growth-hacker | ga-data-analyst |
| Email marketing | email automation, drip campaign, deliverability, segmentation, ESP, lifecycle | ga-campaign-analyst | ga-growth-hacker |
| Community-led growth | community, DevRel, CLG, SPACES, Discord, forum, developer relations | ga-growth-hacker | growth-orqx |
| Brazilian market | PIX, LGPD, RD Station, Hotmart, infoprodutos, WhatsApp marketing, BR SEO | growth-orqx | ga-seo-strategist |
| Attribution | multi-touch attribution, attribution model, incrementality, MMM, data-driven | ga-analytics-engineer | ga-campaign-analyst |
| Experimentation | A/B test, Bayesian, frequentist, multi-armed bandit, Statsig, statistical significance | ga-cro-specialist | ga-analytics-engineer |

## Task File Mapping

| Mission Keyword | Task File | Agent |
|----------------|-----------|-------|
| `funil` | `analyze-conversion-funnel.md` | @ga-data-analyst |
| `canais` | `analyze-channel-performance.md` | @ga-campaign-analyst |
| `cac` | `analyze-cac-by-channel.md` | @ga-analytics-engineer |
| `retencao` | `analyze-retention-churn.md` | @ga-data-analyst |
| `kpi` | `build-kpi-tree-dashboard.md` | @ga-analytics-engineer |
| `seo` | `audit-sitemap-robots.md` | @ga-seo-strategist |
| `backlinks` | `analyze-backlink-profile.md` | @ga-seo-strategist |
| `tracking` | `audit-tracking-accuracy.md` | @ga-analytics-engineer |
| `experimento` | `analyze-experiment-results.md` | @ga-growth-hacker |
| `referral` | `build-referral-program.md` | @ga-growth-hacker |
| `cro` | `analyze-funnel-segmented.md` | @ga-cro-specialist |

## Multi-Domain Requests — Routing Logic

Quando um request abrange multiplos dominios, o growth-orqx coordena:

```
Request: "Analisar por que o funil de conversao caiu 20% esse mes"
  → ga-data-analyst: Analise de funil (dados quantitativos)
  → ga-cro-specialist: Hipoteses de conversao (qualitativo + experimentos)
  → ga-campaign-analyst: Verificar mudancas em canais (attribution)
  → growth-orqx: Sintetizar e recomendar plano de acao

Request: "Construir estrategia de growth para novo produto SaaS"
  → growth-orqx: Estrategia geral (AARRR, loops, NSM)
  → ga-growth-hacker: PLG, viral, referral mechanics
  → ga-seo-strategist: Canal SEO e content
  → ga-data-analyst: Definir metricas e dashboards
```

## Usage Notes

- Route to the **Primary Agent** by default for each domain.
- Use the **Secondary Agent** when the request spans two domains.
- For multi-domain requests, the orchestrator (growth-orqx) coordinates handoffs.
- For requests com keyword "brasil" ou "BR" — sempre incluir contexto de `brazilian-growth-context.md`.
- Para qualquer experimento, verificar `experimentation-boundaries.md` para ownership.
