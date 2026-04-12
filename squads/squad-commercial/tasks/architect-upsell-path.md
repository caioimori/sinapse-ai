---
task: architect-upsell-path
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

# Task: Architect Upsell Path

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Standard

## Objetivo
Arquitetar caminhos de upsell e cross-sell entre servicos — desenhar a jornada de expansao natural do cliente, desde oferta inicial ate portfolio completo.

## Entrada
- Service tier structure
- Offer portfolio
- Client journey data
- Expansion triggers (from Bond)

## Passos

### 1. Value Ladder Design (Russell Brunson)
```
LEVEL 5: R$ [High]  ─── Strategic Retainer / Ongoing Advisory
                         (Continuity — recurring revenue)
    ↑
LEVEL 4: R$ [High]  ─── Enterprise Solution / Full Scope
                         (Profit Maximizer — highest margin)
    ↑
LEVEL 3: R$ [Mid]   ─── Growth Package / Core Engagement
                         (Core Offer — primary revenue driver)
    ↑
LEVEL 2: R$ [Low]   ─── Starter Package / Quick Win
                         (Frontend Offer — gets them in the door)
    ↑
LEVEL 1: R$ 0       ─── Free Audit / Assessment / Lead Magnet
                         (Lead Gen — builds trust and demonstrates value)
```

### 2. Cross-Sell Map
| Current Service | Natural Cross-Sell | Trigger | Timing |
|----------------|-------------------|---------|--------|
| [Service A] | [Service B] | [What indicates need] | [After X months] |
| [Service B] | [Service C] | | |

### 3. Upsell Triggers & Playbooks
| Trigger | Current Tier | Upsell To | Playbook |
|---------|-------------|----------|---------|
| Usage exceeds tier limits | Starter | Growth | Show usage data → ROI of Growth |
| Positive ROI demonstrated | Growth | Enterprise | QBR results → strategic pitch |
| New stakeholder engaged | Any | Cross-sell | Discovery → adjacent service |
| Budget cycle approaching | Any | Higher tier | Business case for next fiscal |
| Competitor threat | Any | Bundle discount | Retention + expansion combo |

### 4. Bundle Strategy
| Bundle | Services Included | Individual Total | Bundle Price | Discount | Target |
|--------|------------------|-----------------|-------------|---------|--------|
| Growth Pack | A + B | R$ | R$ | % | Mid-market |
| Enterprise Suite | A + B + C + D | R$ | R$ | % | Enterprise |

### 5. Expansion Revenue Targets
| Metric | Target |
|--------|--------|
| Expansion Rate | 25-35% of eligible accounts annually |
| Upsell Win Rate | 50-60% (existing relationships) |
| Cross-Sell Win Rate | 30-40% |
| Average Expansion Value | R$ per account |
| NRR Contribution | NRR > 110% |

## Saida
- Value Ladder visualization
- Cross-sell map with triggers
- Upsell playbooks per tier transition
- Bundle strategy
- Expansion targets

## Validacao
- [ ] Value Ladder has 4-5 levels
- [ ] Every service has at least 1 cross-sell path
- [ ] Upsell triggers are specific and measurable
- [ ] Expansion targets align with NRR goals
