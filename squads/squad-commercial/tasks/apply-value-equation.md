---
task: apply-value-equation
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

# Task: Apply Value Equation

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Aplicar a Value Equation de Hormozi a uma oferta — maximizar Dream Outcome e Perceived Likelihood, minimizar Time Delay e Effort para criar uma oferta irresistivel.

## Entrada
- Target offer/service
- ICP and persona data
- Current offer structure
- Client feedback and objections

## Passos

### 1. Value Equation Framework
```
Value = (Dream Outcome × Perceived Likelihood of Achievement)
        / (Time Delay × Effort & Sacrifice)

To INCREASE value:
  ↑ Make Dream Outcome bigger and more specific
  ↑ Increase Perceived Likelihood (proof, guarantees)
  ↓ Reduce Time Delay (faster results, quick wins)
  ↓ Reduce Effort & Sacrifice (done-for-you, automation)
```

### 2. Current State Assessment
| Lever | Current Score (1-10) | Evidence | Improvement Opportunity |
|-------|---------------------|---------|------------------------|
| Dream Outcome | | How big/specific is the promise? | |
| Perceived Likelihood | | What proof/guarantees exist? | |
| Time Delay | | How fast do they see results? | |
| Effort & Sacrifice | | How much work do they do? | |

### 3. Dream Outcome Maximization
| Current Promise | Upgraded Promise | Why Better |
|----------------|-----------------|-----------|
| "We'll improve your marketing" | "We'll generate 50 qualified leads/month within 90 days" | Specific, measurable, time-bound |

Techniques:
- Make it specific (numbers, timeframes)
- Make it vivid (paint the after picture)
- Make it aspirational (what they really want, not what they say)
- Frame as transformation (before → after)

### 4. Perceived Likelihood Boosters
| Booster | Description | Implementation |
|---------|-----------|---------------|
| Case studies | Similar company, similar result | 3+ case studies per vertical |
| Testimonials | Client quotes with specific numbers | Video preferred |
| Guarantee | Risk reversal (money-back, performance) | Design specific guarantee |
| Process transparency | Show the methodology step by step | Visual process diagram |
| Team credentials | Expert profiles and track record | Team page with results |
| Social proof | Logos, numbers, awards | "Trusted by X companies" |

### 5. Time Delay Reduction
| Current Timeline | Quick Win (Week 1) | First Result (30d) | Full Result |
|-----------------|-------------------|-------------------|-------------|
| | | | |

Design "quick wins" that deliver visible value within first 7 days.

### 6. Effort Reduction
| Client Effort | Current | Ideal | How to Reduce |
|-------------|---------|-------|--------------|
| Time investment | hrs/week | hrs/week | Automation, done-for-you |
| Decisions required | #/week | #/week | Recommend vs ask |
| Technical setup | hours | hours | Template, concierge |
| Learning curve | weeks | days | Onboarding, training |

### 7. Grand Slam Offer Stack
```
CORE OFFER: [Main deliverable]
  Value: R$ [perceived value]

BONUS 1: [Addresses specific fear/objection]
  Value: R$ [perceived value]

BONUS 2: [Accelerates results]
  Value: R$ [perceived value]

BONUS 3: [Reduces effort]
  Value: R$ [perceived value]

GUARANTEE: [Risk reversal]

TOTAL PERCEIVED VALUE: R$ [sum]
INVESTMENT: R$ [price]
VALUE MULTIPLE: [perceived value / price] = Xx
```

## Saida
- Value Equation analysis for the offer
- Specific improvements per lever
- Grand Slam Offer stack designed
- Before/after comparison

## Validacao
- [ ] All 4 levers assessed and improved
- [ ] Dream Outcome is specific and measurable
- [ ] At least 3 proof elements included
- [ ] Quick win identified (first 7 days)
- [ ] Effort explicitly reduced
