---
task: design-network-effects
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

# Task: Design Network Effects

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Identify and amplify network effects — understand direct vs indirect effects, local vs global dynamics, design features that strengthen the network, and measure network density, engagement, and value per node.

## Entrada
- Product/service model
- User interaction data
- Platform/marketplace dynamics
- Current network metrics (if available)

## Passos

### 1. Network Effect Types
| Type | Description | Example | Strength |
|------|-------------|---------|----------|
| Direct (same-side) | More users = more value for same users | Social networks, messaging | Strong |
| Indirect (cross-side) | Users attract providers and vice versa | Marketplaces, app stores | Very strong |
| Data network effects | More usage = better product (ML/AI) | Google Search, Netflix | Moderate |
| Protocol/standard | Adoption creates compatibility value | Email, USB, Ethereum | Very strong |

### 2. Local vs Global Effects
| Scope | Description | Example | Defensibility |
|-------|-------------|---------|--------------|
| Local | Value from nearby/connected users | Uber (city-level), Nextdoor | Lower (city-by-city) |
| Global | Value from total user base | Facebook, Wikipedia | Higher (winner-take-all) |

**Implication:** Local effects require market-by-market growth strategy; global effects benefit from broad acquisition.

### 3. Design Features That Strengthen Network
| Feature Category | Examples | Effect |
|-----------------|---------|--------|
| User-generated content | Reviews, posts, answers | Content attracts new users |
| Social graph | Friends, followers, connections | Increases switching cost |
| Collaboration | Shared workspaces, co-editing | Direct network value |
| Marketplace liquidity | More sellers = more buyers | Cross-side effect |
| Data contributions | Ratings, preferences, usage | Improves product for all |
| Integrations/APIs | Third-party apps, plugins | Platform lock-in |

### 4. Measure Network Density
| Metric | Formula | Significance |
|--------|---------|-------------|
| Network density | Actual connections / Possible connections | Health of network |
| Clustering coefficient | Connected neighbor pairs / Possible pairs | Community strength |
| Average degree | Total connections / Total nodes | Engagement breadth |
| Active node ratio | Active users / Total users | Network vitality |

### 5. Measure Engagement and Value per Node
| Metric | Formula | Target |
|--------|---------|--------|
| Value per node | Total network value / Active nodes | Increasing over time |
| Engagement per node | Actions per user per period | Growing with network size |
| Contribution rate | Users who contribute / Total users | > 10% (1% rule baseline) |
| Cross-side ratio | Supply nodes / Demand nodes | Balanced for marketplace |
| Time to value | Time for new node to receive network value | Decreasing |

### 6. Network Effect Amplification Strategy
- **Cold start:** Solve chicken-and-egg with single-player value or supply-side subsidies
- **Tipping point:** Identify critical mass threshold per market/segment
- **Defensibility:** Build switching costs through data, social graph, content
- **Anti-network effects:** Monitor quality degradation at scale (spam, noise)

## Saida
- Network effect type identification and assessment
- Feature roadmap to strengthen network effects
- Network metrics dashboard specification
- Cold start strategy for new markets/segments
- Anti-network effect mitigation plan

## Validacao
- [ ] Network effect type(s) identified with evidence
- [ ] Direct vs indirect effects distinguished
- [ ] Local vs global scope analyzed
- [ ] Features designed to strengthen network
- [ ] Network density and engagement metrics defined
- [ ] Cold start and tipping point strategies documented
