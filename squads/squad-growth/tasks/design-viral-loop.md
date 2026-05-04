---
task: design-viral-loop
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

# Task: Design Viral Loop

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Design viral growth mechanisms — calculate k-factor, optimize viral cycle time, design incentive structures, select sharing mechanics and channels, and build a measurement framework for viral growth.

## Entrada
- Product/service model
- Current user base metrics
- Sharing/invite capabilities
- Target audience profile

## Passos

### 1. K-Factor Calculation
| Component | Formula | Target |
|-----------|---------|--------|
| K-factor | k = invites_per_user x conversion_rate | k > 1 = viral |
| Invites per user | Total invites sent / Total users | Maximize |
| Invite conversion | Signups from invites / Total invites | Maximize |
| Viral cycle time | Average time from signup to first invite sent | Minimize |

### 2. Viral Cycle Time Optimization
- Map each step from user activation to invite sent
- Identify friction points that delay sharing
- Reduce steps between value moment and share prompt
- A/B test timing of share prompts (immediate vs delayed)
- Optimize for mobile-first sharing flows

### 3. Incentive Design
| Incentive Type | Description | Best For |
|---------------|-------------|----------|
| Double-sided | Both referrer and referee get reward | Marketplaces, SaaS |
| One-sided (referrer) | Only referrer rewarded | Low-cost products |
| One-sided (referee) | Only new user rewarded | High-value products |
| Tiered | Rewards increase with more referrals | Power users |
| Social proof | Status, badges, leaderboards | Community products |

### 4. Sharing Mechanics
- Direct invite (email, SMS, messaging apps)
- Social sharing (public posts, stories)
- Content sharing (user-generated, achievements)
- Collaborative features (shared workspaces, multiplayer)
- Embed/widget distribution

### 5. Channel Selection
| Channel | Friction | Reach | Conversion | Best For |
|---------|---------|-------|-----------|----------|
| WhatsApp/SMS | Low | Personal | High | 1:1 products |
| Email | Medium | Professional | Medium | B2B, SaaS |
| Social media | Low | Broad | Low | Consumer apps |
| In-product | None | Existing users | High | Collaboration tools |

### 6. Measurement Framework
- K-factor by channel and cohort
- Viral cycle time (days)
- Invite send rate (% of users who invite)
- Invite accept rate (% of invites that convert)
- Viral attribution (% of new users from viral)
- Cost per viral acquisition vs paid

## Saida
- Viral loop design document
- K-factor model with projections
- Incentive structure specification
- Channel strategy and prioritization
- Measurement dashboard spec

## Validacao
- [ ] K-factor formula defined with current baseline
- [ ] Viral cycle time mapped with optimization opportunities
- [ ] Incentive structure designed with cost modeling
- [ ] Sharing mechanics selected and prioritized
- [ ] Measurement framework with tracking events defined
- [ ] A/B test plan for viral optimizations
