---
task: build-referral-program
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

# Task: Build Referral Program

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Design a referral program with double-sided incentives, robust tracking, fraud prevention, optimization metrics, and program tiers to drive sustainable user acquisition through existing customers.

## Entrada
- Product/service model and pricing
- Current customer base size and engagement
- Unit economics (CAC, LTV, margins)
- Existing referral behavior (organic)

## Passos

### 1. Double-Sided Incentives
| Tier | Referrer Reward | Referee Reward | Trigger |
|------|----------------|---------------|---------|
| Standard | Credit/discount | Welcome discount | First purchase |
| Premium | Cash/higher credit | Extended trial | Subscription start |
| VIP | Exclusive access | Premium onboarding | Revenue threshold |

**Design principles:**
- Reward must exceed effort (perceived value > friction)
- Referee reward reduces acquisition barrier
- Referrer reward reinforces loyalty loop

### 2. Referral Tracking
- Unique referral codes per user (alphanumeric, shareable)
- Unique referral links with UTM parameters
- Cookie-based tracking with fallback to code entry
- Deep linking for mobile app referrals
- Attribution window: 30-day click, 7-day view

### 3. Fraud Prevention
| Mechanism | Description | Implementation |
|-----------|-------------|---------------|
| Velocity limits | Max referrals per user per period | 10/day, 50/month |
| Device fingerprinting | Detect same device multiple accounts | Canvas + WebGL hash |
| Email domain check | Block disposable email domains | Blocklist + MX check |
| IP clustering | Detect same IP multiple signups | IP + subnet analysis |
| Behavior scoring | Flag suspicious patterns | ML model on activity |
| Delayed rewards | Pay after confirmed activity | 7-14 day hold period |

### 4. Optimization Metrics
| Metric | Formula | Target |
|--------|---------|--------|
| Referral rate | Users who refer / Total active users | > 15% |
| Referred conversion | Referred signups who convert / Total referred | > 50% |
| CAC reduction | (Standard CAC - Referral CAC) / Standard CAC | > 40% |
| Referral LTV ratio | LTV of referred users / LTV of non-referred | > 1.1x |
| Program ROI | (Revenue from referred - Program cost) / Program cost | > 3x |

### 5. Program Tiers
| Tier | Referrals Required | Benefits |
|------|-------------------|----------|
| Bronze | 1-5 | Standard rewards |
| Silver | 6-15 | 1.5x rewards + badge |
| Gold | 16-50 | 2x rewards + early access |
| Platinum | 50+ | Custom rewards + ambassador status |

## Saida
- Referral program specification document
- Incentive structure with cost modeling
- Tracking system technical requirements
- Fraud prevention rules and thresholds
- Program tier structure
- Launch and optimization roadmap

## Validacao
- [ ] Double-sided incentive structure defined with unit economics
- [ ] Referral tracking system specified (codes, links, attribution)
- [ ] Fraud prevention mechanisms documented with thresholds
- [ ] Optimization metrics defined with baseline and targets
- [ ] Program tiers designed with progression logic
- [ ] Cost model validated against CAC targets
