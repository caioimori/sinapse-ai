---
task: design-referral-system
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

# Task: Design Referral System

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Desenhar sistema de referral — criar mecanismo de indicacao que transforma usuarios satisfeitos em canal de aquisicao, maximizando viral coefficient e minimizando custo por aquisicao.

## Entrada
- Product type and value proposition
- Current user base size
- Customer satisfaction data (NPS/CSAT)
- Budget for referral incentives

## Passos

### 1. Referral Model Selection
| Modelo | Mecanismo | Melhor Para | Exemplo |
|--------|----------|------------|---------|
| Single-sided | Reward only referrer | Low-cost products | Uber (credits) |
| Double-sided | Reward both referrer + referred | Subscription/SaaS | Dropbox (storage) |
| Tiered | Increasing rewards per referral | High-engagement products | Ambassador programs |
| Community | Status/recognition, not money | Communities | Stack Overflow |
| Affiliate | Revenue share | B2B, high-ticket | SaaS affiliate programs |

### 2. Incentive Design
| Tipo de Incentivo | Exemplos | Custo | Eficacia |
|------------------|---------|-------|---------|
| Credit/discount | R$50 off, 20% discount | Variable | Alta para e-commerce |
| Extended service | +1 month free, extra storage | Low marginal | Alta para SaaS |
| Cash/gift card | R$25 pix, gift card | Fixed | Alta mas menos sticky |
| Premium features | Unlock features temporariamente | Zero marginal | Media |
| Physical reward | Swag, merchandise | Fixed + shipping | Baixa eficacia, alta brand |
| Charity donation | Donate per referral | Fixed | Boa para brand values |

### 3. Viral Coefficient Calculation
```
K-Factor = i × c

Where:
  i = average invitations sent per user
  c = conversion rate of invitations

K > 1 = viral growth (each user brings > 1 new user)
K = 0.5-1.0 = viral amplification (boosts other channels)
K < 0.5 = minimal viral effect
```

| Componente | Otimizacao |
|-----------|-----------|
| Invitations (i) | Make sharing easy, multiple channels, prompt at moment of delight |
| Conversion (c) | Strong landing page, social proof, clear value prop, low friction signup |
| Cycle time | Reduce time between signup → value → share |

### 4. Referral Flow Design
```
┌─────────────────────────────────────────┐
│ 1. TRIGGER                              │
│    User reaches "moment of delight"     │
│    (e.g., first success, milestone)     │
│              │                          │
│              ▼                          │
│ 2. PROMPT                               │
│    In-app prompt, email, or push        │
│    "Share with friends, get [reward]"   │
│              │                          │
│              ▼                          │
│ 3. SHARE                                │
│    WhatsApp, Email, Link, Social        │
│    Unique referral code/link            │
│              │                          │
│              ▼                          │
│ 4. LANDING                              │
│    Personalized landing page            │
│    "[Friend] invited you to [Product]"  │
│    Social proof + reward display        │
│              │                          │
│              ▼                          │
│ 5. SIGNUP + ACTIVATION                  │
│    Streamlined onboarding               │
│    Referral code auto-applied           │
│              │                          │
│              ▼                          │
│ 6. REWARD                               │
│    Both parties rewarded                │
│    Referrer notified of success         │
│    Prompt referrer to share again       │
│              │                          │
│              ▼                          │
│ 7. LOOP RESTART                         │
│    New user reaches delight → shares    │
└─────────────────────────────────────────┘
```

### 5. Sharing Channels
| Canal | Conversao Tipica | UX | Implementacao |
|-------|-----------------|-----|-------------|
| WhatsApp | Alta (BR market) | Deep link + preview | WhatsApp Share API |
| Email | Media | Personalized invite | Email API + template |
| Copy link | Media | Simple, universal | Clipboard API |
| SMS | Alta | Direct, personal | SMS API |
| Social (Instagram, X) | Baixa | Broad reach | Social share APIs |
| QR Code | Media | In-person | QR generator |

### 6. Anti-Fraud Measures
| Risco | Prevencao | Deteccao |
|-------|----------|---------|
| Self-referral | Different email, device fingerprint | IP/device matching |
| Fake accounts | Email/phone verification | Cluster analysis |
| Referral farms | Limit referrals per user/period | Velocity checks |
| Coupon abuse | Single-use codes, linked to account | Code tracking |
| Bot signups | CAPTCHA, behavior analysis | Bot detection |

### 7. Referral Metrics Dashboard
| Metrica | Formula | Target |
|---------|---------|--------|
| K-Factor | Invites sent × Invite conversion | > 0.5 |
| Referral share of signups | Referred signups / Total signups | > 20% |
| Invite rate | Users who shared / Total eligible | > 15% |
| Invites per referrer | Total invites / Referrers | > 3 |
| Invite conversion | Signups / Invites sent | > 10% |
| Referred user LTV | LTV of referred vs organic | >= 1.0x |
| CAC via referral | Total rewards / Referred signups | < other CAC |
| Time to first referral | Days from signup to first share | < 14 days |
| Referral program ROI | (Revenue from referred - Rewards) / Rewards | > 3x |

## Saida
- Referral system design document
- Incentive model recommendation
- Flow design with wireframes
- Anti-fraud strategy
- KPI dashboard spec
- Implementation roadmap

## Validacao
- [ ] Modelo de referral selecionado com justificativa
- [ ] Incentivos desenhados (both sides)
- [ ] Flow de referral documentado (7 steps)
- [ ] Canais de share priorizados
- [ ] Anti-fraud measures definidas
- [ ] Metricas de tracking configuradas
- [ ] K-Factor target definido
