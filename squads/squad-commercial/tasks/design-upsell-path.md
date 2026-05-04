---
task: design-upsell-path
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

# Task: Design Upsell Path

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Architect strategic upsell paths from current service tiers to premium offerings. Map natural upgrade triggers, design transition offers, and calculate incremental value. The best upsell doesn't feel like a sale — it feels like the obvious next step.

## Entrada
- Current service catalog with tier definitions
- Client portfolio segmentation data
- Usage and adoption analytics per tier
- Historical upsell data (success rates, triggers, timing)
- Revenue targets and expansion goals

## Passos

### 1. Map Current Service Catalog
| Tier | Services Included | Price Range | Typical Client Profile | Penetration |
|------|------------------|-------------|----------------------|-------------|
| Starter/Essentials | | R$ | | % of portfolio |
| Growth/Standard | | R$ | | % of portfolio |
| Enterprise/Premium | | R$ | | % of portfolio |
| Custom/Strategic | | R$ | | % of portfolio |

### 2. Identify Natural Upgrade Triggers
| Trigger | Signal | Current Tier | Target Tier | Timing |
|---------|--------|-------------|-------------|--------|
| **Usage ceiling** | Approaching limits on current plan | Starter | Growth | When usage >80% of tier limit |
| **Feature gap** | Requesting features in higher tier | Any | Next tier | After 2+ requests for premium features |
| **Team growth** | Adding users beyond tier allowance | Starter/Growth | Growth/Enterprise | When team size exceeds tier seats |
| **Complexity increase** | Multi-market, multi-brand needs | Growth | Enterprise | When scope outgrows standard delivery |
| **Strategic maturity** | Client wants dedicated strategy | Growth | Enterprise/Custom | After 6+ months, proven ROI |
| **Competitive pressure** | Client faces market pressure, needs more | Any | Higher tier | When client articulates urgency |

### 3. Design Transition Offers
| Upsell Path | Transition Offer | Pricing Approach | Risk Reversal |
|-------------|-----------------|-----------------|---------------|
| Starter → Growth | "Growth Accelerator" — 30-day pilot of Growth features at Starter price | Discounted first quarter, then standard | Full refund if no measurable improvement |
| Growth → Enterprise | "Strategic Upgrade" — Phased rollout with dedicated CSM from day 1 | Prorated upgrade, lock annual price | 90-day satisfaction guarantee |
| Enterprise → Custom | "Partnership Program" — Co-designed engagement with executive alignment | Value-based pricing on incremental scope | Quarterly review gates |
| Any → Add-on | "Capability Boost" — Modular add-on without full tier change | A la carte pricing, bundle discount at 3+ | Try for 1 month, cancel anytime |

### 4. Calculate Incremental Value
| Path | Avg Current MRR | Avg Upsell MRR | Delta | Conversion Rate | Annual Impact |
|------|----------------|----------------|-------|-----------------|--------------|
| Starter → Growth | R$ | R$ | R$ | % | R$ |
| Growth → Enterprise | R$ | R$ | R$ | % | R$ |
| Enterprise → Custom | R$ | R$ | R$ | % | R$ |
| Add-on attach | R$ | R$ | R$ | % | R$ |
| **Total Expansion Revenue** | | | | | **R$** |

## Saida
- Upsell path architecture document (tier-to-tier mapping)
- Trigger identification framework with signals and timing
- Transition offer designs with pricing and risk reversal
- Incremental value model with revenue projections
- Sales enablement materials for each upsell path

## Validacao
- [ ] All service tiers mapped with clear differentiators
- [ ] At least 5 natural upgrade triggers identified
- [ ] Transition offers designed for each major path
- [ ] Pricing logic is value-based, not cost-based
- [ ] Revenue impact modeled with realistic conversion rates
- [ ] Risk reversal included in each transition offer
