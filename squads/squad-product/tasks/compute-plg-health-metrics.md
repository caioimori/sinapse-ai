---
task: compute-plg-health-metrics
responsavel: "@ps-product-analyst"
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

# Compute PLG Health Metrics

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium-High
- **Estimated Time:** 3-4 hours
- **Produces:** PLG scorecard, growth loop analysis, self-serve metrics, product-qualified lead scoring

## Purpose
Calcular metricas especificas de Product-Led Growth (PLG) para produtos onde o produto e o principal canal de aquisicao, ativacao e monetizacao. Referencia: Wes Bush (Product-Led Growth), Elena Verna, Kyle Poyar (OpenView).

## Steps

### Step 1: PLG Foundation Metrics
**Self-Serve Funnel:**
```
VISITOR → SIGNUP → ACTIVATED → ENGAGED → CONVERTED → EXPANDED

Visitor-to-Signup Rate: [%]
Signup-to-Activated Rate: [%]
Activated-to-Engaged Rate: [%]
Engaged-to-Paid Rate: [%]
Paid-to-Expanded Rate: [%]
Overall Visitor-to-Paid: [%]
```

**Time-Based Metrics:**
```
Time to Signup: [median from first visit]
Time to Value (TTV): [median from signup to aha moment]
Time to Paid: [median from signup to first payment]
Free Trial Duration Used: [% of trial period consumed before conversion]
```

### Step 2: Product-Qualified Lead (PQL) Scoring
**PQL Definition:**
```
A user becomes a PQL when they:
  1. Complete [activation milestone] AND
  2. Reach [engagement threshold] AND
  3. Match [ideal customer profile criteria]

Scoring Model:
  Behavioral Score (0-100):
    + [points] for completing onboarding
    + [points] for using core feature N times
    + [points] for inviting team members
    + [points] for reaching usage threshold
    + [points] for visiting pricing page
    - [points] for inactivity periods

  Firmographic Score (0-100):
    + [points] for company size match
    + [points] for industry match
    + [points] for role match
    + [points] for geography match

  PQL Score = (Behavioral × 0.7) + (Firmographic × 0.3)
  PQL Threshold: Score >= [threshold]
```

**PQL Metrics:**
```
PQL Rate = PQLs / Total Signups × 100
PQL-to-Customer Rate = Customers from PQLs / Total PQLs × 100
Time to PQL = Median(PQL timestamp - Signup timestamp)
PQL Accuracy = Actual conversions from PQLs / Predicted conversions
```

### Step 3: Growth Loop Metrics
**Viral Loop:**
```
Viral Coefficient (K-Factor):
  K = i × c
  Where: i = invitations per user, c = conversion rate per invitation
  K > 1 = viral growth (each user brings more than 1 new user)
  K = 0.5-1.0 = supported growth (virality assists other channels)
  K < 0.5 = minimal virality

Viral Cycle Time: [avg days from user activation to their invite converting]
Organic Signup %: [% of signups from non-paid channels]
Word-of-Mouth Index: [NPS promoters × sharing rate]
```

**Content Loop:**
```
User-Generated Content Rate: [content items per active user per month]
Content Discovery Rate: [% of new visitors from user-generated content]
SEO Contribution from UGC: [organic traffic from user content pages]
```

**Usage Loop:**
```
Network Effect Strength: [value increase per additional user/node]
Data Network Effect: [product improvement rate per data point added]
Switching Cost Index: [integrations + data + habits + team usage]
```

### Step 4: Monetization Efficiency
**PLG-Specific Revenue Metrics:**
```
Natural Rate of Revenue (NRR):
  Revenue from self-serve conversions (no sales touch) / Total new revenue × 100
  Target: >50% for PLG company

Sales-Assist Rate:
  Revenue where sales accelerated (but user started self-serve) / Total new revenue × 100

Average Contract Value by Motion:
  Self-serve ACV: [$]
  Sales-assist ACV: [$]
  Sales-led ACV: [$]

Expansion Revenue Rate:
  Revenue from upgrades + add-ons / Total revenue × 100
  PLG target: >30%

Product-Driven Expansion Rate:
  Expansion triggered by usage limits / Total expansion × 100
```

**Quick Ratio (Growth Efficiency):**
```
Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churn MRR)

Interpretation:
  > 4.0 = Excellent (hyper-growth efficient)
  2.0-4.0 = Good (healthy growth)
  1.0-2.0 = Concerning (leaky bucket)
  < 1.0 = Shrinking (losing more than gaining)
```

### Step 5: PLG Health Scorecard
**Composite PLG Score:**
| Dimension | Metric | Weight | Current | Target | Score (0-100) |
|-----------|--------|--------|---------|--------|--------------|
| Self-Serve | Visitor-to-Paid rate | 15% | [%] | [%] | |
| Activation | Time to Value | 15% | [days] | [days] | |
| PQL | PQL-to-Customer rate | 15% | [%] | [%] | |
| Virality | K-Factor | 10% | [score] | [target] | |
| Engagement | DAU/MAU | 10% | [ratio] | [ratio] | |
| Retention | D30 retention | 10% | [%] | [%] | |
| Monetization | Natural Rate of Revenue | 10% | [%] | [%] | |
| Expansion | Product-Driven Expansion | 10% | [%] | [%] | |
| Efficiency | Quick Ratio | 5% | [ratio] | [ratio] | |
| **TOTAL** | | **100%** | | | **/100** |

**PLG Maturity Bands:**
| Score | Stage | Description |
|-------|-------|-------------|
| 80-100 | PLG-Native | Product is the primary growth engine |
| 60-79 | PLG-Supported | Product assists but sales still drives |
| 40-59 | PLG-Emerging | Self-serve exists but underperforms |
| 0-39 | Sales-Led | Minimal product-led motion |

### Step 6: Recommendations by PLG Stage
**Based on Current Score:**
| Stage | Top Priority | Key Investment |
|-------|-------------|---------------|
| PLG-Native | Optimize expansion loops | Usage-based pricing, network effects |
| PLG-Supported | Reduce TTV, improve PQL accuracy | Onboarding, activation, PQL model |
| PLG-Emerging | Build self-serve funnel end-to-end | Pricing page, trial flow, activation |
| Sales-Led | Validate PLG viability | Free tier/trial, tracking, activation |

## Output Artifacts
- `plg-health-scorecard.md` | `pql-scoring-model.md` | `growth-loop-analysis.md` | `plg-recommendations.md`

## Quality Criteria
- Self-serve funnel fully instrumented | PQL model defined with scoring rules | Growth loops identified and measured | Monetization split by motion (self-serve vs sales) | PLG maturity honestly assessed | Recommendations match current stage
