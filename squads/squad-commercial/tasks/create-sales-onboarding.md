---
task: create-sales-onboarding
responsavel: "@cs-sales-enablement"
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

# Task: Create Sales Onboarding

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** High

## Objetivo
Criar programa de onboarding de vendedores — 90-day ramp plan estruturado que leva um novo vendedor de zero a produtivo, combinando conhecimento de produto, metodologia, ferramentas e prática.

## Entrada
- Sales playbook (from build-sales-playbook)
- Sales methodology (from audit-sales-methodology)
- Discovery framework (from design-discovery-framework)
- Objection library (from create-objection-library)
- Company/product knowledge base

## Passos

### 1. 90-Day Ramp Plan Architecture
```
SALES ONBOARDING — 90-DAY RAMP PLAN
Adapted from Mark Roberge's Sales Acceleration Formula

PHILOSOPHY:
  "The best onboarding doesn't teach people what to say —
  it teaches them how to THINK about the buyer."

  Three pillars:
  1. LEARN IT — Knowledge (company, market, methodology)
  2. SEE IT — Observation (shadowing, call library)
  3. DO IT — Practice (role-play, live calls, deals)

RAMP MILESTONES:
  Day 30 — Can articulate value proposition and ICP clearly
  Day 60 — Can run discovery call independently and qualify deals
  Day 90 — Can manage full sales cycle and hit ramped quota
```

### 2. Week-by-Week Curriculum

#### WEEK 1-2: FOUNDATION (Learn It)
| Day | Topic | Activity | Owner | Deliverable |
|-----|-------|---------|-------|-------------|
| 1 | Company overview | CEO/founder meeting, vision, values | Manager | Notes |
| 1 | Tools setup | CRM, email, calendar, LinkedIn, tools | Ops | Accounts active |
| 2 | Market & ICP | ICP deep dive, market positioning | Edge | ICP quiz (pass 80%+) |
| 3 | Service portfolio | Service lines, pricing, packaging | Mint materials | Service quiz (pass 80%+) |
| 4 | Client immersion | Listen to 5 client calls (from library) | Self-study | Call notes |
| 5 | Competitive landscape | Battlecards, positioning vs competitors | Edge | Positioning exercise |
| 6-7 | Case studies | Study 10 case studies, write summaries | Self-study | Written summaries |
| 8-9 | Sales methodology | MEDDIC, SPIN, Challenger overview | Edge training | Methodology quiz (pass 80%+) |
| 10 | Sales process | Stage-by-stage walkthrough with CRM | Edge + Vault | CRM simulation complete |

**Week 2 Checkpoint:**
- [ ] All quizzes passed (80%+ score)
- [ ] CRM configured and comfortable
- [ ] Can articulate value prop in <60 seconds
- [ ] Listened to minimum 5 calls from library

#### WEEK 3-4: METHODOLOGY (See It + Start Doing)
| Day | Topic | Activity | Owner | Deliverable |
|-----|-------|---------|-------|-------------|
| 11-12 | Discovery framework | Deep training on SPIN + Gap Selling | Edge | Discovery role-play (scored) |
| 13 | Shadow calls | Sit in on 3 live discovery calls | Senior rep | Observation notes |
| 14-15 | Objection handling | Library review + practice sessions | Edge | Objection role-play (scored) |
| 16 | Proposal framework | Three-options structure, proposal review | Edge + Mint | Mock proposal created |
| 17-18 | Demo/presentation | Presentation structure, practice delivery | Edge | Mock presentation (scored) |
| 19 | Shadow calls | Sit in on 3 more live calls (varied stages) | Senior rep | Observation notes |
| 20 | Week 4 assessment | Comprehensive role-play: full cycle | Manager + Edge | Pass/fail assessment |

**Week 4 Checkpoint:**
- [ ] Discovery role-play score ≥ 55/80
- [ ] Objection handling: can respond to top 10 objections
- [ ] Mock presentation delivered and scored
- [ ] 6+ live calls observed with notes
- [ ] Manager assessment: ready for supervised live calls

#### WEEK 5-8: PRACTICE (Do It — Supervised)
| Week | Activity | Support Level | Target |
|------|---------|--------------|--------|
| 5 | First discovery calls (own leads) | Manager on call (muted) | 3 calls, all scored |
| 6 | Independent discovery calls | Post-call debrief same day | 5 calls, average score ≥ 50/80 |
| 7 | First presentations/demos | Manager reviews deck pre-send | 2 presentations |
| 8 | First proposals submitted | Edge reviews all proposals | 1-2 proposals, quality gate passed |

**Week 8 Checkpoint:**
- [ ] 10+ discovery calls completed independently
- [ ] Average call score ≥ 55/80
- [ ] At least 1 proposal sent (quality gate passed)
- [ ] Pipeline building: ≥ 3 qualified opportunities
- [ ] Manager assessment: ready for reduced supervision

#### WEEK 9-12: INDEPENDENCE (Do It — Autonomous)
| Week | Activity | Support Level | Target |
|------|---------|--------------|--------|
| 9-10 | Full cycle management | Weekly 1:1 reviews only | Manage 5+ active deals |
| 11-12 | Ramped performance | Standard coaching cadence | Hit 50% of full quota |

**Day 90 Checkpoint:**
- [ ] Pipeline ≥ 3x ramped quota (coverage)
- [ ] At least 1 deal closed (or in final negotiation)
- [ ] Average call score ≥ 60/80
- [ ] All proposals pass quality gate independently
- [ ] Methodology adherence confirmed via call reviews
- [ ] Manager signs off: "Fully ramped"

### 3. Knowledge Certification Matrix
| Certification | Timing | Format | Pass Threshold | Retake? |
|--------------|--------|--------|---------------|---------|
| ICP & Market | Day 3 | Written quiz (20 questions) | 80% | Yes, within 2 days |
| Service Portfolio | Day 4 | Written quiz (20 questions) | 80% | Yes, within 2 days |
| Sales Methodology | Day 9 | Written quiz (25 questions) | 80% | Yes, within 2 days |
| Discovery Role-Play | Day 12 | Live role-play (scored) | 55/80 | Yes, within 3 days |
| Presentation | Day 18 | Live presentation (scored) | 55/80 | Yes, within 3 days |
| Full Cycle | Day 20 | Comprehensive role-play | 60/80 | Yes, within 5 days |

### 4. Buddy System
```
BUDDY ASSIGNMENT — NEW HIRE ONBOARDING

Role: Senior rep paired with new hire for 90 days

Buddy Responsibilities:
  Week 1-2:  □ Daily 15-min check-in ("What questions do you have?")
  Week 3-4:  □ Call shadowing partner (new hire observes buddy)
  Week 5-8:  □ Reverse shadow (buddy observes new hire calls)
  Week 9-12: □ Weekly check-in, available for ad-hoc questions

Buddy Selection Criteria:
  □ Top performer (top 25% by quota attainment)
  □ Positive attitude and willingness to coach
  □ At least 6 months tenure
  □ Different communication style than manager (diversity of input)

Buddy Incentive:
  □ Recognition in team meetings
  □ Buddy bonus if new hire hits day-90 milestone
  □ Priority for future leadership opportunities
```

### 5. Onboarding Content Library
| Resource | Format | When Used | Location |
|----------|--------|-----------|----------|
| Company overview deck | Slides | Day 1 | Shared drive |
| ICP one-pager | PDF | Day 2 | Sales playbook |
| Service portfolio guide | Document | Day 3 | Knowledge base |
| Competitive battlecards | Cards/PDF | Day 5 | Sales playbook |
| Case study collection | Documents | Week 1-2 | Knowledge base |
| Sales methodology guide | Document | Week 2 | Sales playbook |
| Discovery framework | Document | Week 3 | Sales playbook |
| Objection library | Document | Week 3 | Sales playbook |
| Proposal templates | Templates | Week 4 | Shared drive |
| Call recording library | Audio/Video | Ongoing | Call analytics tool |

### 6. Onboarding Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first qualified opportunity | ≤ 30 days | CRM pipeline |
| Time to first closed deal | ≤ 60 days | CRM closed/won |
| Time to full quota attainment | ≤ 90 days | Quota vs actual |
| Day-30 knowledge quiz pass rate | 100% | Quiz scores |
| Day-60 call quality score | ≥ 55/80 | Call review average |
| Day-90 pipeline coverage | ≥ 3x | CRM pipeline ÷ quota |
| 6-month retention rate | ≥ 90% | HR data |
| New hire satisfaction (onboarding NPS) | ≥ 50 | Post-onboarding survey |

## Saida
- 90-day ramp plan (week-by-week curriculum)
- Knowledge certification matrix
- Buddy system design
- Onboarding content library index
- Success metrics dashboard

## Validacao
- [ ] 90-day plan covers Learn It, See It, Do It phases
- [ ] Certifications gate each phase transition
- [ ] Buddy system with clear responsibilities
- [ ] All content resources available and indexed
- [ ] Metrics track ramp velocity and quality
