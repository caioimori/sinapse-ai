---
task: create-expansion-offer
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

# Task: Create Expansion Offer

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Design expansion offers for existing clients — cross-sell bundles, add-on services, and scope upgrades. Analyze client portfolio gaps, design modular add-ons, price using the value equation, and create sales materials. Expansion revenue is the highest-margin revenue — the trust is already built.

## Entrada
- Client portfolio with current services per account
- Service catalog with all available offerings
- Client health scores and satisfaction data
- Usage analytics and feature adoption
- Historical expansion data (what worked, what didn't)
- Revenue targets for expansion

## Passos

### 1. Analyze Client Portfolio Gaps
| Analysis Dimension | Method | Output |
|-------------------|--------|--------|
| **Service coverage** | Map current services vs. full catalog per client | Gap matrix |
| **Usage patterns** | Identify underutilized services and high-engagement areas | Adoption heatmap |
| **Stated needs** | Review QBR notes, support tickets, feature requests | Unmet needs list |
| **Peer comparison** | Compare to similar clients in same tier/industry | Benchmark gaps |
| **Growth signals** | Hiring, new markets, product launches | Expansion triggers |

### 2. Design Modular Add-Ons
| Add-On Type | Description | Target Client | Pricing Model |
|------------|-------------|---------------|---------------|
| **Capability Add-On** | New service area (e.g., add analytics to content retainer) | Clients with adjacent needs | Monthly retainer increment |
| **Depth Add-On** | More volume/scope within existing service (e.g., more content pieces) | Clients at capacity limits | Per-unit or tiered increment |
| **Speed Add-On** | Faster delivery, priority queue, dedicated resources | Time-sensitive clients | Premium surcharge (20-40%) |
| **Strategy Add-On** | Executive consulting, strategic planning, board-level reporting | Mature clients | Quarterly or project-based |
| **Technology Add-On** | Platform access, tool licenses, automation setup | Tech-forward clients | SaaS pricing model |

### 3. Price Using Value Equation (Hormozi)
```
Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort & Sacrifice)

For each add-on:
1. Dream Outcome: What business result does this enable? Quantify in R$.
2. Perceived Likelihood: How confident is the client this will work? (Case studies, guarantees)
3. Time Delay: How quickly do they see results? (Reduce = increase value)
4. Effort & Sacrifice: How much work on their end? (Reduce = increase value)

Price = 10-20% of the quantified Dream Outcome value
```

| Add-On | Dream Outcome (R$) | Value Multiplier | Suggested Price | Margin |
|--------|-------------------|-----------------|-----------------|--------|
| | R$ | x | R$/mo | % |

### 4. Create Sales Materials
| Material | Purpose | Format |
|----------|---------|--------|
| **Expansion One-Pager** | Quick overview for CSM/AE to share with client | PDF, 1 page |
| **Value Calculator** | Interactive tool showing ROI of add-on | Spreadsheet or web tool |
| **Case Study** | Proof of results from similar expansion | PDF, 2 pages |
| **Proposal Template** | Ready-to-customize proposal for each add-on type | Google Docs/Slides |
| **Objection Handlers** | Top 5 objections with responses for each add-on | Internal doc for sales team |

## Saida
- Portfolio gap analysis per client segment
- Modular add-on catalog with descriptions and pricing
- Value equation calculations per add-on
- Sales materials package (one-pagers, calculators, case studies)
- Expansion playbook for CSM/AE team

## Validacao
- [ ] Portfolio gaps analyzed across all major client segments
- [ ] At least 5 modular add-on types designed
- [ ] Pricing grounded in value equation, not cost-plus
- [ ] Each add-on has clear dream outcome quantified in R$
- [ ] Sales materials created and reviewed by sales team
- [ ] Expansion playbook includes triggers, talk tracks, and objection handling
