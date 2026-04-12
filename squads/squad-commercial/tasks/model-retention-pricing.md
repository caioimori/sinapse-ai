---
task: model-retention-pricing
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

# Task: Model Retention Pricing

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Design retention-focused pricing strategies — loyalty discounts, long-term lock-in incentives, and at-risk save offers. Analyze churn patterns, design retention tiers, model financial impact, and create an approval matrix. It costs 5-25x more to acquire a new client than to retain an existing one — price accordingly.

## Entrada
- Historical churn data with reasons and timing
- Client portfolio with contract values and tenure
- Current pricing and discount structures
- Client health scores and risk indicators
- Customer Lifetime Value (CLV) data
- Competitive pricing intelligence

## Passos

### 1. Analyze Churn Patterns
| Analysis Dimension | Method | Insight |
|-------------------|--------|---------|
| **Churn by reason** | Categorize exits: price, value, fit, competitor, internal | Primary drivers |
| **Churn by tenure** | Churn rate at 3mo, 6mo, 12mo, 24mo+ | Risk windows |
| **Churn by tier** | Which tiers have highest churn | Pricing/value misalignment |
| **Churn by health score** | Score at time of churn | Prediction threshold |
| **Price sensitivity** | Churn correlation with price increases | Elasticity estimate |
| **Save play success** | Historical save offer acceptance rates | What works |

### 2. Design Retention Tiers
| Retention Tier | Trigger | Offer Type | Discount Range | Lock-In |
|---------------|---------|-----------|----------------|---------|
| **Loyalty Reward** | 12+ months tenure, Green health | Annual commitment discount | 5-10% | 12-month renewal |
| **Long-Term Lock-In** | Any tenure, proactive | Multi-year discount | 10-20% | 24-36 month contract |
| **At-Risk Save (Yellow)** | Health score 50-79 | Value-add bundle at current price | 0% discount + added value | 6-month minimum |
| **At-Risk Save (Red)** | Health score <50, active churn signal | Temporary discount + success plan | 15-25% for 3-6 months | 3-month recovery period |
| **Win-Back** | Former client, 6-12 months post-churn | Re-engagement offer | 20-30% for first quarter | 6-month minimum |

### 3. Model Financial Impact
| Scenario | Accounts Affected | Avg MRR | Discount Cost | Retained Revenue | Net Impact |
|----------|------------------|---------|--------------|-----------------|------------|
| **No intervention** | X at-risk accounts | R$ | R$ 0 | R$ (lost) | -R$ |
| **Loyalty rewards** | X eligible | R$ | R$ (discount) | R$ (retained) | +R$ |
| **Long-term lock-in** | X eligible | R$ | R$ (discount) | R$ (retained) | +R$ |
| **Save offers (Yellow)** | X at-risk | R$ | R$ (added value cost) | R$ (retained) | +R$ |
| **Save offers (Red)** | X critical | R$ | R$ (discount) | R$ (retained) | +R$ |
| **Total Program Impact** | | | **R$ (total cost)** | **R$ (total retained)** | **+R$ net** |

### 4. Create Approval Matrix
| Retention Offer | Discount Level | Approver | Conditions |
|----------------|---------------|----------|-----------|
| Loyalty 5% | Up to 5% | CSM | Green health, 12+ months tenure |
| Loyalty 10% | 6-10% | CS Lead | Green health, 24+ months tenure |
| Lock-in 15% | 11-15% | CS Director | Multi-year commitment confirmed |
| Lock-in 20% | 16-20% | VP CS + Finance | 36+ month commitment, strategic account |
| Save (Yellow) | Value-add only | CSM + CS Lead | Documented risk, success plan in place |
| Save (Red) | Up to 25% | CS Director + Finance | Documented churn risk, CLV justifies |
| Win-back | Up to 30% | VP CS | Former client, clear re-engagement plan |

## Saida
- Churn pattern analysis with key insights
- Retention pricing tier definitions
- Financial impact model (cost vs. retained revenue)
- Approval matrix with clear authority levels
- Retention offer templates ready for CSM use
- Monitoring metrics and success criteria

## Validacao
- [ ] Churn patterns analyzed across all dimensions
- [ ] Retention tiers cover loyalty, lock-in, save, and win-back scenarios
- [ ] Financial model shows positive net impact
- [ ] Approval matrix has clear authority levels and conditions
- [ ] Offer templates created and reviewed by Finance
- [ ] Monitoring metrics defined (save rate, cost per save, net retention impact)
