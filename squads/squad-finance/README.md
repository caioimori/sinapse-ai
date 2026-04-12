# Squad Finance

> Squad especializada em inteligencia financeira para agencias e negocios digitais. Cobre analise de rentabilidade, precificacao, forecasting, unit economics, controle orcamentario e otimizacao de custos.

## Visao Geral

| Metrica | Quantidade |
|---------|-----------|
| Agentes | 5 |
| Tasks | 45 |
| Workflows | 4 |
| Knowledge Bases | 8 |

## Agentes

| Agente | Papel |
|--------|-------|
| Ledger (finance-orqx) | Orquestrador — coordena analises e gera reports executivos |
| Margin (profitability-analyst) | Rentabilidade — P&L por projeto/cliente, cost-per-delivery, unit economics |
| Mint (pricing-strategist) | Precificacao — modelos de pricing, service tiers, value-based pricing |
| Vault (budget-controller) | Orcamento — forecasting, budget tracking, cost optimization |
| Flow (revenue-analyst) | Receita — revenue recognition, invoicing, collection optimization |

## Ativacao

```bash
# Via orquestrador (recomendado)
@finance-orqx

# Via agente especifico
@profitability-analyst
@pricing-strategist
@budget-controller
```

## Tasks Principais

**Rentabilidade**
- calculate-project-profitability, analyze-client-profitability
- calculate-cost-per-delivery, analyze-unit-economics, run-monthly-p-and-l

**Precificacao**
- model-pricing-scenario, design-service-tiers, calculate-rate-card
- design-value-based-pricing, simulate-pricing-impact

**Orcamento e Forecasting**
- forecast-revenue-pipeline, track-monthly-budget, analyze-budget-variance
- create-annual-budget, forecast-cash-flow

**Receita**
- reconcile-invoicing, analyze-revenue-waterfall, track-accounts-receivable
- track-recurring-revenue, manage-revenue-recognition

## Workflows

- **monthly-financial-cycle** — Coleta, P&L, budget review, pricing review, report
- **pricing-design-cycle** — Market analysis, cost modeling, tier design, validacao
- **quarterly-financial-review** — Revenue, profitability, budget, forecast, board report
- **client-profitability-audit** — Revenue, custos, scoring, recomendacoes

## Knowledge Bases

- agency-financial-models
- pricing-strategy-frameworks
- unit-economics-reference
- budget-forecasting-methods
- revenue-recognition-guide
- financial-metrics-benchmarks
- cost-optimization-playbook

## Integracao com Core Agents

Este squad trabalha com o framework SINAPSE core:
- @architect (Aria) para decisoes tecnicas
- @developer (Dex) para implementacao
- @quality-gate (Quinn) para validacao de qualidade

---

*Parte do ecossistema SINAPSE-AI — 18 squads, 186 agentes*
