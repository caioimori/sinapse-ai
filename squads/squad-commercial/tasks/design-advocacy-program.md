---
task: design-advocacy-program
responsavel: "@cs-client-success"
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

# Task: Design Advocacy Program

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Desenhar programa de advocacy — transformar Promotores em defensores ativos que geram referrals, testimonials, case studies e social proof.

## Entrada
- NPS data (Promoters identified)
- Health Score data (Green accounts)
- Client relationship history
- Marketing content needs

## Passos

### 1. Advocacy Ladder
| Level | Activity | Ask | Reward | Difficulty |
|-------|---------|-----|--------|-----------|
| 1 | Online review (G2, Clutch) | Low | Recognition | Easy |
| 2 | Testimonial quote | Low | Co-marketing | Easy |
| 3 | Case study participation | Medium | Publication credit | Medium |
| 4 | Reference call for prospect | Medium | Priority support | Medium |
| 5 | Speaking engagement / co-webinar | High | Thought leadership | Hard |
| 6 | Active referral (intro) | High | Referral reward | Hard |

### 2. Advocate Qualification
| Criteria | Required | Source |
|----------|---------|-------|
| NPS Promoter (9-10) | Yes | NPS survey |
| Health Score Green (80+) | Yes | Health dashboard |
| Tenure > 6 months | Yes | CRM |
| ROI demonstrated | Preferred | QBR data |
| Active champion | Yes | CSM assessment |

### 3. Referral Program
```
REFERRAL PROGRAM DESIGN

Mechanism:
  □ Advocate makes introduction (email or meeting)
  □ CSM facilitates warm handoff to sales
  □ Referral tracked in CRM with source attribution

Reward Structure:
  Option A: Cash/credit reward per qualified referral
  Option B: Service credits or upgrades
  Option C: Charitable donation in their name
  Option D: Exclusive access/events

Tracking:
  - Referrals submitted: [count]
  - Referrals qualified: [count] ([%])
  - Referrals closed: [count] ([%])
  - Revenue from referrals: R$ [total]
  - Avg deal size (referral vs non): R$ vs R$
```

### 4. Advocacy Content Pipeline
| Content Type | Source | Frequency | Owner |
|-------------|--------|----------|-------|
| Case studies | Advocacy interviews | Quarterly | Bond → @content |
| Testimonial videos | Advocate recordings | Monthly | Bond → @content |
| G2/Clutch reviews | Review request campaigns | Quarterly | Bond |
| Co-webinars | Advocate speakers | Quarterly | Bond → @content |
| Social proof quotes | QBR extracts | Ongoing | Bond |

### 5. Advocate Engagement Metrics
| Metric | Target |
|--------|--------|
| % of Green accounts as advocates | 30%+ |
| Reviews generated per quarter | 5+ |
| Referrals per quarter | 3+ |
| Revenue from referrals | 10%+ of new logo |
| Advocate retention rate | 95%+ |

## Saida
- Advocacy program design document
- Advocate qualification criteria
- Referral program mechanics
- Content pipeline plan

## Validacao
- [ ] Advocacy ladder defined with clear asks
- [ ] Qualification criteria objective and measurable
- [ ] Referral tracking configured in CRM
- [ ] Content pipeline planned with @content-intelligence
