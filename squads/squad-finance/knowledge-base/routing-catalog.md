# Routing Catalog — Financial Intelligence

Maps keywords and domains to specialist agents for intelligent routing within the Finance squad.

<!-- TODO: expand content -->

## Domain Routing Matrix

| Domain | Keywords | Primary Agent | Secondary Agent |
|--------|----------|--------------|-----------------|
| Profitability analysis | profit, margin, P&L, profitability, cost analysis, unit economics | profitability-analyst | finance-orqx |
| Pricing strategy | pricing, rate card, value-based pricing, tiers, price increase | pricing-strategist | profitability-analyst |
| Budget & forecasting | budget, forecast, planning, cash flow, projections, variance | budget-controller | finance-orqx |
| Revenue analysis | revenue, MRR, ARR, recurring, pipeline, recognition, waterfall | revenue-analyst | profitability-analyst |
| Financial orchestration | financial review, reporting, quarterly review, financial strategy | finance-orqx | profitability-analyst |

## Usage Notes

- Route to the **Primary Agent** by default for each domain.
- Use the **Secondary Agent** when the primary is overloaded or when the request spans multiple domains.
- For requests that span multiple domains, the orchestrator (finance-orqx) coordinates handoffs.
