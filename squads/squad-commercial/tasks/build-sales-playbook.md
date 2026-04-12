---
task: build-sales-playbook
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

# Task: Build Sales Playbook

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** High

## Objetivo
Construir playbook de vendas completo — guia operacional stage-by-stage que padroniza o processo, acelera ramp-up de novos vendedores e eleva a consistência da equipe.

## Entrada
- Sales methodology audit (from audit-sales-methodology)
- Win/loss analysis data (from Vault)
- Service portfolio and pricing (from Mint)
- ICP profile (from Cascade)
- Top performer interviews

## Passos

### 1. Playbook Architecture
```
SALES PLAYBOOK — [Agency Name]

Version: [X.X]
Last Updated: [Date]
Owner: Edge (cs-sales-enablement)

TABLE OF CONTENTS
═══════════════════════════════════════════

PART I: FOUNDATION
  1. Our Market & ICP
  2. Our Value Proposition
  3. Competitive Landscape
  4. Sales Methodology Overview

PART II: THE SALES PROCESS
  5. Prospecting & Outreach
  6. Discovery & Qualification
  7. Solution Design & Presentation
  8. Proposal & Negotiation
  9. Close & Handoff
  10. Post-Sale Expansion

PART III: ENABLEMENT
  11. Objection Handling
  12. Email & Call Templates
  13. Demo Scripts
  14. Competitive Battlecards
  15. Case Studies & Social Proof

APPENDIX
  A. CRM Usage Guide
  B. Tools & Technology
  C. Compensation & Quota
  D. Glossary
```

### 2. Stage-by-Stage Process Definition
| Stage | Entry Criteria | Activities | Exit Criteria | Duration Target | Tools |
|-------|---------------|------------|---------------|----------------|-------|
| 1. Prospecting | ICP match identified | Research, outreach sequence | Meeting booked | 1-2 weeks | CRM, LinkedIn, outreach tool |
| 2. Discovery | Meeting confirmed | SPIN questions, pain mapping | Qualified (MEDDIC ≥ 5/8) | 1-2 calls | Discovery framework, CRM |
| 3. Solution Design | MEDDIC qualified | Map needs → services, build scope | Solution aligned to outcomes | 3-5 days | Service portfolio, templates |
| 4. Proposal | Solution agreed verbally | Three-options proposal, pricing | Proposal delivered and reviewed | 2-3 days | Proposal framework (Mint) |
| 5. Negotiation | Proposal in review | Handle objections, align terms | Verbal commitment | 1-2 weeks | Objection library, battlecards |
| 6. Close | Verbal yes | Contract, SOW, payment terms | Signed contract | 3-5 days | Legal templates, CRM |
| 7. Handoff | Contract signed | Intro to CS, kickoff prep | Kickoff scheduled | 2-3 days | Handoff template (Bond) |

### 3. Discovery Script (SPIN Framework)
```
DISCOVERY CALL STRUCTURE — 45 min

PRE-CALL PREP (15 min before):
  □ Research company (annual report, recent news, job postings)
  □ Check LinkedIn (decision makers, org chart, mutual connections)
  □ Review any existing relationship history in CRM
  □ Prepare 3 hypothesis-driven insights

OPENING (5 min):
  "Thanks for taking the time, [Name]. Before we dive in, I'd love
  to understand — what prompted you to take this meeting? What are
  you hoping to get out of our conversation today?"

  [Set agenda, confirm time, establish mutual purpose]

SITUATION QUESTIONS (5 min):
  "To make sure I give you relevant perspective..."
  □ "What does your current [marketing/digital/brand] operation look like?"
  □ "What tools and partners are you working with today?"
  □ "How is your team structured for [relevant area]?"
  □ "What metrics are you tracking to measure success?"

PROBLEM QUESTIONS (10 min):
  "Where are you seeing the biggest challenges?"
  □ "What's working well vs. what's frustrating?"
  □ "Where do you feel like you're leaving money on the table?"
  □ "What have you tried before that didn't work as expected?"
  □ "What's preventing you from reaching [stated goal]?"

IMPLICATION QUESTIONS (10 min):
  "Let me explore the impact of that..."
  □ "If [problem] continues, what happens to [business metric]?"
  □ "How does this affect other areas of the business?"
  □ "What's the cost of NOT solving this in the next 6-12 months?"
  □ "How does [problem] impact your team's day-to-day?"

NEED-PAYOFF QUESTIONS (10 min):
  "Imagine we could solve that..."
  □ "If you could [desired state], what would that mean for [metric]?"
  □ "How would solving this change your priorities?"
  □ "What would success look like 12 months from now?"
  □ "If we could [specific capability], how valuable would that be?"

CLOSE & NEXT STEPS (5 min):
  "Based on what you've shared, I think there's a strong fit.
  Here's what I'd recommend as next steps..."
  □ Summarize 3 key pains identified
  □ Connect to relevant case study
  □ Propose specific next step (solution presentation, proposal)
  □ Confirm timeline and stakeholders needed
```

### 4. Qualification Scorecard (MEDDIC)
| Element | Question | Evidence Found | Score (0-2) |
|---------|---------|---------------|-------------|
| **M**etrics | What measurable outcome are they pursuing? | | |
| **E**conomic Buyer | Who has budget authority? Have we engaged them? | | |
| **D**ecision Criteria | What factors will they use to decide? | | |
| **D**ecision Process | What are the steps, timeline, and approvals? | | |
| **I**dentify Pain | Is the pain compelling enough to drive action? | | |
| **C**hampion | Do we have an internal advocate pushing for us? | | |
| **Paper Process** | Do we understand procurement/legal requirements? | | |
| **Competition** | Who else are they evaluating? Where do we stand? | | |
| **TOTAL** | | | /16 |

**Qualification Thresholds:**
- 12-16: Strong — proceed with proposal
- 8-11: Medium — fill gaps before proposing
- 4-7: Weak — re-qualify or nurture
- 0-3: Unqualified — do not pursue

### 5. Competitive Positioning Quick-Reference
| Competitor Type | Their Pitch | Our Differentiator | Talk Track |
|----------------|------------|-------------------|-----------|
| Large agency | "Full service, global scale" | Agility, senior attention, speed | "Unlike large agencies where you talk to senior team in the pitch and juniors do the work..." |
| Freelancers | "Cheaper, flexible" | Reliability, methodology, breadth | "Freelancers are great for tactical work, but when you need strategic thinking across channels..." |
| In-house team | "We know our business better" | External perspective, specialized skills, speed to ramp | "Your team knows your business — we complement that with capabilities that are expensive to build in-house..." |
| Consulting firms | "Strategy and frameworks" | Execution capability, measurable results | "Strategy without execution is a shelf-document. We deliver strategy AND the hands to make it happen..." |
| Niche specialists | "Deep expertise in one area" | Integrated approach, cross-channel synergy | "Specialists optimize one channel — we orchestrate the full journey, which is where the real ROI comes from..." |

### 6. Playbook Metrics
| Metric | Baseline | Target | Measurement |
|--------|---------|--------|-------------|
| Playbook adoption rate | % | 90%+ | CRM compliance audit |
| Win rate | % | +5pp within 6 months | CRM closed/won ÷ total |
| Average deal size | R$ | +15% | CRM average ACV |
| Sales cycle length | days | -15% | CRM stage duration |
| Ramp time (new hires) | months | <3 months to quota | Time to first closed deal |
| Discovery call quality | /10 | 8+/10 | Call review scoring |
| Qualification accuracy | % | 85%+ | Predicted vs actual close rate |

## Saida
- Complete sales playbook document
- Stage-by-stage process with templates
- Discovery and qualification frameworks
- Competitive positioning guide
- Adoption metrics dashboard

## Validacao
- [ ] Every stage has entry/exit criteria and clear activities
- [ ] Discovery script uses SPIN framework with agency-specific questions
- [ ] MEDDIC scorecard with thresholds defined
- [ ] Competitive positioning covers all main competitor types
- [ ] Playbook metrics baseline established
