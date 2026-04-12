---
task: develop-pricing-strategy
responsavel: "@cs-offer-designer"
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

# Task: Develop Pricing Strategy

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Desenvolver estrategia de pricing — mover de cost-plus para value-based pricing, ancorando preco ao resultado de negocio do cliente, nao ao custo de entrega.

## Entrada
- Service delivery costs
- Client outcome data (ROI)
- Competitive pricing landscape
- Market willingness to pay

## Passos

### 1. Pricing Model Comparison
| Model | Description | When to Use | Risk |
|-------|-----------|------------|------|
| **Hourly** | Time × rate | Legacy/commodity | Low margin, no upside |
| **Project-Based** | Fixed scope, fixed price | Well-defined deliverables | Scope creep risk |
| **Value-Based** | Priced on client outcome | Clear ROI measurable | Requires trust |
| **Retainer** | Monthly fixed fee | Ongoing relationship | Revenue predictability |
| **Performance** | Base + success bonus | Confidence in delivery | Revenue variability |
| **Hybrid** | Base retainer + performance | Best of both worlds | Complexity |

### 2. Value-Based Pricing Discovery
```
VALUE CONVERSATION (Ron Baker / Blair Enns method):

1. "What would success look like for this project?"
   → Quantify the outcome in business terms

2. "What is that outcome worth to your business annually?"
   → Get a dollar figure (or help them calculate)

3. "What have you tried before? What did you invest?"
   → Understand reference price and past spend

4. "What would it cost you to NOT solve this problem?"
   → Quantify the cost of inaction (pain of status quo)

PRICING RULE:
  If client outcome = R$ 1M additional revenue
  Pricing at R$ 100K = 10x ROI (compelling)
  Pricing at R$ 200K = 5x ROI (still compelling)
  Cost-plus might suggest R$ 50K (leaving R$ 150K on table)
```

### 3. Price Anchoring Framework
| Element | Purpose | Example |
|---------|---------|---------|
| Total Value | Anchor high | "The total program value is R$ 250K..." |
| Outcome Value | Show ROI | "Based on your targets, this should generate R$ 1.2M..." |
| Investment | Actual price | "Your investment for the Growth tier is R$ 85K" |
| Comparison | Context | "That's less than your monthly ad spend" |
| Per-unit | Make digestible | "That's R$ 7K/month or R$ 230/day" |

### 4. Discount Governance
| Scenario | Max Discount | Approval | Condition |
|----------|-------------|---------|----------|
| Standard deal | 0% | None | Full price |
| Multi-year commitment | 10% | Manager | 2+ year contract |
| Strategic account | 15% | VP | Reference + case study rights |
| Competitive pressure | 10% | Manager | Documented competitor bid |
| Cash-flow deal | 5% | Manager | Full upfront payment |

**Rule:** Never discount without getting something in return.

### 5. Pricing Metrics
| Metric | Formula | Target |
|--------|---------|--------|
| Average Selling Price | Revenue / Deals | Increasing trend |
| Price Realization | Actual / List price | 85-95% |
| Discount Frequency | Deals discounted / Total | < 30% |
| Average Discount | Total discounts / Discounted deals | < 10% |
| Revenue per Hour | Revenue / Delivery hours | Increasing trend |

## Saida
- Pricing strategy document
- Value-based pricing discovery script
- Discount governance policy
- Price list per tier
- Pricing metrics dashboard

## Validacao
- [ ] Value-based approach prioritized over cost-plus
- [ ] Discount governance established
- [ ] Price realization target set
- [ ] Sales team trained on value conversations
