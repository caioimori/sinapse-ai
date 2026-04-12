---
task: implement-growth-flywheel
responsavel: "@ga-growth-hacker"
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

# Task: Implement Growth Flywheel

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Design a self-reinforcing growth flywheel — map flywheel stages, identify inputs/outputs per stage, measure conversion between stages, find friction points, optimize the weakest link, and model compound growth.

## Entrada
- Business model and revenue streams
- Current growth metrics (acquisition, activation, retention, revenue, referral)
- User journey data
- Channel performance data

## Passos

### 1. Map Flywheel Stages
```
┌─────────────────────────────────────────┐
│                                         │
│  [1. Attract] ──→ [2. Engage]           │
│       ↑                │                │
│       │                ▼                │
│  [5. Advocate] ←── [3. Delight]         │
│       ↑                │                │
│       │                ▼                │
│       └──────── [4. Monetize]           │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Inputs/Outputs per Stage
| Stage | Inputs | Outputs | Key Metric |
|-------|--------|---------|-----------|
| Attract | Content, SEO, ads, referrals | New visitors/leads | Traffic, lead volume |
| Engage | Onboarding, activation flow | Activated users | Activation rate |
| Delight | Product value, support | Satisfied users | NPS, retention rate |
| Monetize | Pricing, upsell | Revenue, margin | ARPU, LTV |
| Advocate | Referral program, social proof | Referrals, reviews | Referral rate, k-factor |

### 3. Measure Conversion Between Stages
| Transition | Metric | Formula | Benchmark |
|-----------|--------|---------|-----------|
| Attract → Engage | Signup rate | Signups / Visitors | 2-5% |
| Engage → Delight | Activation rate | Activated / Signups | 20-40% |
| Delight → Monetize | Conversion rate | Paying / Activated | 5-15% |
| Monetize → Advocate | Referral rate | Referrers / Paying | 10-20% |
| Advocate → Attract | Viral coefficient | New users from referrals / Referrers | 0.5-2.0 |

### 4. Find Friction Points
**Diagnostic framework:**
- Identify the stage with the lowest conversion rate
- Map specific drop-off points within that stage
- Categorize friction: UX, value proposition, timing, trust
- Prioritize by impact (ICE: Impact x Confidence x Ease)

### 5. Optimize Weakest Link
| Principle | Description |
|-----------|-------------|
| Theory of constraints | Flywheel speed = speed of slowest stage |
| Focus resources | Invest disproportionately in weakest stage |
| Measure improvement | Track stage conversion before/after optimization |
| Iterate | Once weakest link improves, next weakest becomes focus |

### 6. Model Compound Growth
```
Monthly compound growth model:

New users(t) = Organic(t) + Paid(t) + Viral(t)
Viral(t) = Active_users(t-1) x referral_rate x invite_conversion
Active_users(t) = New_users(t) x activation_rate + Active_users(t-1) x retention_rate
Revenue(t) = Active_users(t) x monetization_rate x ARPU
Reinvestment(t) = Revenue(t) x reinvestment_ratio

→ Flywheel accelerates when: Viral(t) grows faster than churn
→ Compound rate = (Active_users(t) - Active_users(t-1)) / Active_users(t-1)
```

## Saida
- Flywheel map with stages and metrics
- Stage conversion benchmarks and current state
- Friction analysis with prioritized improvements
- Compound growth model with projections
- Optimization roadmap (weakest link first)

## Validacao
- [ ] Flywheel stages mapped with inputs/outputs
- [ ] Conversion metrics defined between all stages
- [ ] Friction points identified with prioritization
- [ ] Weakest link identified with optimization plan
- [ ] Compound growth model built with projections
- [ ] Flywheel dashboard spec with key metrics
