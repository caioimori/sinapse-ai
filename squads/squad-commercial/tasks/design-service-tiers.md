---
task: design-service-tiers
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

# Task: Design Service Tiers

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Desenhar tiers de servico (Good/Better/Best) — estruturar ofertas em 3 niveis que atendem diferentes segmentos, maximizando conversao e valor medio por projeto.

## Entrada
- Core service capabilities
- ICP segments by budget/need
- Competitive pricing data
- Margin targets

## Passos

### 1. Three-Tier Architecture
| Element | Starter (Good) | Growth (Better) | Enterprise (Best) |
|---------|---------------|-----------------|-------------------|
| **Target** | Small companies, limited budget | Mid-market, primary buyer | Enterprise, complex needs |
| **Scope** | Fixed, standardized | Core + customization | Full custom, strategic |
| **Team** | Junior + templates | Dedicated mid-level | Senior + strategic advisor |
| **Timeline** | Fast (2-4 weeks) | Standard (4-8 weeks) | Extended (8-16 weeks) |
| **Support** | Email, async | Email + weekly call | Dedicated + on-demand |
| **Price** | R$ [anchor low] | R$ [anchor: sweet spot] | R$ [premium] |
| **Margin** | Lower, but scalable | Target: 60-70% | Highest: 70%+ |

### 2. Feature Matrix
| Feature | Starter | Growth | Enterprise |
|---------|:-------:|:------:|:---------:|
| [Core feature 1] | ✅ | ✅ | ✅ |
| [Core feature 2] | ✅ | ✅ | ✅ |
| [Mid feature 1] | ❌ | ✅ | ✅ |
| [Mid feature 2] | ❌ | ✅ | ✅ |
| [Premium feature 1] | ❌ | ❌ | ✅ |
| [Premium feature 2] | ❌ | ❌ | ✅ |
| Strategy sessions | ❌ | Monthly | Weekly |
| Dedicated team | ❌ | ❌ | ✅ |
| Custom reporting | Basic | Standard | Custom |
| SLA | 48h | 24h | 4h |

### 3. Pricing Psychology
```
PRICING PSYCHOLOGY (Blair Enns — Three Options)

Option A (Starter): Set as "entry" — acceptable but limited
  → Anchors the conversation ("we start at R$X")
  → Some clients will self-select here (that's OK)

Option B (Growth): The "recommended" option
  → 2-3x price of Starter
  → Most clients choose this (60-70%)
  → Highest volume × margin sweet spot

Option C (Enterprise): The "premium" option
  → 3-5x price of Starter
  → Makes Option B look reasonable by comparison
  → 10-20% of clients choose this (highest margin)

Key: NEVER offer just one option. Three options = client chooses
     which to buy, not whether to buy.
```

### 4. Upgrade Path
```
Starter → Growth:
  Trigger: Client sees results, wants more
  Offer: "Based on [results], here's what Growth tier unlocks..."
  Timing: 60-90 days after start

Growth → Enterprise:
  Trigger: Complexity grows, strategic need emerges
  Offer: "Your growth requires dedicated strategy..."
  Timing: 6-12 months or at renewal
```

### 5. Delivery Playbook per Tier
| Phase | Starter | Growth | Enterprise |
|-------|---------|--------|-----------|
| Kickoff | Template call (30m) | Custom discovery (60m) | Full workshop (half-day) |
| Delivery | Playbook-driven | Adapted playbook | Custom methodology |
| Check-ins | Bi-weekly async | Weekly call | Weekly + on-demand |
| Reporting | Template report | Customized report | Executive + operational |

## Saida
- Three-tier service design document
- Feature matrix
- Pricing structure with psychology notes
- Upgrade path defined
- Delivery playbook per tier

## Validacao
- [ ] Three tiers clearly differentiated
- [ ] Feature matrix shows clear value progression
- [ ] Pricing follows anchor psychology
- [ ] Upgrade path documented
- [ ] Margin targets met per tier
