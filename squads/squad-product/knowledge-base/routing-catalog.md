# Routing Catalog — Product Systems

Maps keywords and domains to specialist agents for intelligent routing within the Product squad.

<!-- TODO: expand content -->

## Domain Routing Matrix

| Domain | Keywords | Primary Agent | Secondary Agent |
|--------|----------|--------------|-----------------|
| Product strategy | product strategy, vision, roadmap, competitive positioning | ps-product-strategist | product-orqx |
| Product discovery | discovery, user research, problem space, opportunity, Jobs-to-be-Done | ps-discovery-lead | ps-product-strategist |
| Product analytics | product metrics, usage analytics, activation, retention, feature adoption | ps-product-analyst | product-orqx |
| Product operations | sprint, backlog, velocity, delivery, tools, Jira, Linear | ps-product-ops-specialist | ps-delivery-manager |
| Delivery management | delivery, release, deployment, timeline, dependencies, sprint planning | ps-delivery-manager | ps-product-ops-specialist |
| Client product management | client roadmap, stakeholder management, client requirements, priorities | ps-client-product-manager | product-orqx |
| Orchestration | cross-squad coordination, triage, product requests, delegation | product-orqx | ps-product-strategist |

## Usage Notes

- Route to the **Primary Agent** by default for each domain.
- Use the **Secondary Agent** when the primary is overloaded or when the request spans multiple domains.
- For requests that span multiple domains, the orchestrator (product-orqx) coordinates handoffs.

## Knowledge Base Index

| KB File | Domain | Key Contents |
|---------|--------|-------------|
| `pm-frameworks-reference.md` | Frameworks gerais | RICE, OST, OKRs, Kano, JTBD, roadmaps, Shape Up |
| `discovery-methodology-playbook.md` | Discovery | Continuous Discovery, OST deep, JTBD, interviews, A/B |
| `product-analytics-formulas.md` | Analytics | Formulas, cohorts, NSM, tooling (Amplitude/Mixpanel), benchmarks |
| `product-led-growth-reference.md` | PLG | PLG fundamentos, PQL, freemium, viral loops, PLS, network effects |
| `experimentation-framework.md` | Experimentacao | A/B testing, estatistica, MAB, cultura, ferramentas |
| `customer-success-integration.md` | CS + Produto | Health score, NRR, QBR, NPS, churn, expansion revenue |
| `product-market-fit-framework.md` | PMF | Sean Ellis test, retention curves, pivots, quando escalar |
| `brazilian-product-context.md` | Contexto BR | PIX, WhatsApp-first, LGPD, mobile, ecossistema, growth BR |
| `multi-client-roadmap-management.md` | Multi-cliente | ICE/RICE cross-client, resource allocation, conflicts |
| `agency-product-management-patterns.md` | Agencia | Dual roadmap, Rich Mironov, scope negotiation, anti-patterns |
| `client-stakeholder-management-protocols.md` | Stakeholders | Power/interest grid, escalacao, comunicacao, health |
| `agile-lean-ceremonies-guide.md` | Ceremonias | Sprint planning, retro, discovery sync, QBR |
| `product-tool-stack-guide.md` | Ferramentas | PM tools, analytics tools, design, comunicacao |
| `technical-debt-management-framework.md` | Tech debt | Fowler quadrant, severity scoring, budget allocation |

## Cross-KB Links

| Se o usuario perguntar sobre... | Consultar |
|--------------------------------|-----------|
| PMF de um produto novo | `product-market-fit-framework.md` + `discovery-methodology-playbook.md` |
| Como escalar growth | `product-led-growth-reference.md` + `product-market-fit-framework.md` |
| Retencao caindo | `customer-success-integration.md` + `product-analytics-formulas.md` |
| Produto brasileiro | `brazilian-product-context.md` + `product-led-growth-reference.md` |
| Priorizar roadmap | `pm-frameworks-reference.md` + `multi-client-roadmap-management.md` |
| Experimento especifico | `experimentation-framework.md` + `product-analytics-formulas.md` |
| Discovery de usuario | `discovery-methodology-playbook.md` + `pm-frameworks-reference.md` |
| OKRs de produto | `pm-frameworks-reference.md` (secao OKRs deep) |
