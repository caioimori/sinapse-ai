# Routing Catalog — Research Intelligence

Maps keywords and domains to specialist agents for intelligent routing within the Research squad.

<!-- TODO: expand content -->

## Domain Routing Matrix

| Domain | Keywords | Primary Agent | Secondary Agent |
|--------|----------|--------------|-----------------|
| Market analysis | market research, market size, TAM/SAM/SOM, industry analysis | market-analyst | research-orqx |
| Competitive intelligence | competitor, competitive analysis, market landscape, benchmarking | competitive-intelligence | market-analyst |
| Deep research | deep dive, comprehensive research, literature review, analysis | deep-researcher | data-synthesizer |
| Audience intelligence | audience, personas, segments, demographic, psychographic, behavior | audience-intelligence | market-analyst |
| Trend forecasting | trends, emerging, future, forecast, signals, weak signals | trend-forecaster | deep-researcher |
| Data synthesis | synthesis, report, insights, executive summary, findings | data-synthesizer | research-orqx |
| Orchestration | research coordination, multi-source, research brief, delegation | research-orqx | deep-researcher |

## Usage Notes

- Route to the **Primary Agent** by default for each domain.
- Use the **Secondary Agent** when the primary is overloaded or when the request spans multiple domains.
- For requests that span multiple domains, the orchestrator (research-orqx) coordinates handoffs.
