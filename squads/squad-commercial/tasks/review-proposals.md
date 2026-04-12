---
task: review-proposals
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

# Task: Review Proposals

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Standard

## Objetivo
Revisar propostas comerciais — aplicar quality gate de proposta para garantir que cada proposta segue a framework Three-Options, conecta com discovery, e maximiza probabilidade de close.

## Entrada
- Draft proposal (from sales rep or Mint)
- Discovery summary (from discovery framework)
- Proposal quality checklist
- Pricing strategy (from Mint)
- Competitive intelligence

## Passos

### 1. Proposal Quality Gate (Mandatory Review)
```
PROPOSAL REVIEW CHECKLIST — Pre-Send Gate

SECTION A: DISCOVERY CONNECTION
  □ Proposal references specific pains from discovery
  □ Client's words/language used (not our jargon)
  □ Gap analysis metrics included (cost of status quo)
  □ Future state description matches what client articulated
  □ Decision criteria from MEDDIC addressed
  Score: ___ / 5

SECTION B: STRUCTURE & FORMAT
  □ Three-options framework used (Good/Better/Best)
  □ Executive summary < 1 page
  □ Clear scope per option (what's IN and OUT)
  □ Timeline with milestones
  □ Team assignment with relevant bios
  □ Professional formatting, no typos/errors
  Score: ___ / 6

SECTION C: VALUE FRAMING
  □ Investment framed against ROI (not as cost)
  □ Per-option ROI or value stated
  □ Pricing logic transparent (value-based, not cost-plus)
  □ Comparison to cost of inaction included
  □ Social proof (case study, testimonial, or metric)
  Score: ___ / 5

SECTION D: CLOSING MECHANICS
  □ Clear next steps defined
  □ Urgency element (timeline, limited capacity, market window)
  □ Terms and conditions included
  □ Easy to say yes (signature line, payment terms)
  □ Follow-up cadence planned
  Score: ___ / 5

TOTAL SCORE: ___ / 21
  18-21: Ready to send ✅
  14-17: Minor revisions needed ⚠️
  10-13: Major revisions needed ❌
  <10: Restart proposal ❌❌
```

### 2. Three-Options Audit
```
OPTIONS BALANCE CHECK (Blair Enns Framework)

                    OPTION 1        OPTION 2        OPTION 3
                    (Good)          (Better)        (Best)
────────────────────────────────────────────────────────────
Label:              [name]          [name]          [name]
Price:              R$ ________     R$ ________     R$ ________
Price ratio:        1x              ~2x             ~3-4x
Scope:              [description]   [description]   [description]
Timeline:           ____            ____            ____
Expected outcome:   [metric]        [metric]        [metric]

CHECKS:
  □ Option 2 (Better) is clearly the recommended choice
  □ Option 1 (Good) is viable but limited (creates contrast)
  □ Option 3 (Best) is aspirational but justifiable
  □ Price gap between options is intentional, not arbitrary
  □ Each option adds genuine additional VALUE (not just scope)
  □ All three options solve the core problem stated in discovery

ANCHORING:
  Present order: Option 3 first → Option 1 → Option 2 (recommended)
  Rationale: Anchoring effect — highest first, then show
  the recommended middle option as the smart choice.

RED FLAGS:
  ⚠️ All three options look the same with different prices
  ⚠️ Option 1 doesn't actually solve the problem
  ⚠️ Option 3 is unrealistically expensive (feels like a joke)
  ⚠️ No recommended option highlighted
  ⚠️ Options differentiated only by hours/volume, not value
```

### 3. Discovery-Proposal Alignment Matrix
| Discovery Finding | Must Appear In Proposal? | Location | Present? |
|------------------|------------------------|----------|----------|
| Primary pain identified | Yes | Executive Summary + Scope | ☐ |
| Quantified business impact | Yes | ROI Section | ☐ |
| Decision criteria (MEDDIC) | Yes | Approach + Why Us | ☐ |
| Stakeholder concerns | Yes | Addressed in relevant section | ☐ |
| Competitive alternatives considered | Yes (subtly) | Differentiation section | ☐ |
| Timeline requirements | Yes | Timeline section | ☐ |
| Budget range signal | Yes (pricing within range) | Investment section | ☐ |
| Success metrics defined | Yes | Expected Outcomes | ☐ |

### 4. Common Proposal Mistakes
| Mistake | Why It Hurts | Fix |
|---------|-------------|-----|
| Generic executive summary | Doesn't show you listened | Rewrite with client-specific language from discovery |
| Features over outcomes | Client doesn't see value | Frame everything as "this means you'll..." |
| Single-option pricing | No contrast, easy to say no | Always three options (Blair Enns) |
| No ROI calculation | Investment feels like a cost | Include conservative ROI estimate |
| No urgency | Proposal sits in inbox | Add timeline driver (market, capacity, season) |
| Too long (>15 pages) | Won't be read | 8-12 pages ideal, executive summary < 1 page |
| Missing team info | Feels impersonal | Include specific team members with relevant experience |
| No case study | Claims without evidence | Include 1-2 directly relevant case studies |
| Weak next steps | No clear path forward | "Sign by [date], kickoff by [date]" |
| Pricing before value | Sticker shock | Build value through the document, pricing at the end |

### 5. Review Process
| Step | Owner | SLA | Activity |
|------|-------|-----|----------|
| 1. Draft submitted | Sales rep | — | Upload to shared drive, tag for review |
| 2. Checklist review | Edge | 4 hours | Score against 21-point gate |
| 3. Feedback delivered | Edge | Same day | Written feedback with specific edits |
| 4. Revisions made | Sales rep | 24 hours | Address all feedback items |
| 5. Final approval | Edge | 2 hours | Re-score, approve for send |
| 6. Send tracking | Sales rep | — | Log in CRM, set follow-up reminders |

### 6. Proposal Win Rate Analysis
| Metric | Target | Tracking |
|--------|--------|---------|
| Proposals sent per month | Track | CRM |
| Win rate (proposal → close) | 40%+ | CRM |
| Average time to decision | <21 days | CRM stage duration |
| Option 2 (recommended) selection rate | 50%+ | CRM |
| Option 3 (best) selection rate | 20%+ | CRM |
| Proposals requiring major revision | <20% | Review log |
| Average review score (first submission) | 16+/21 | Checklist data |

## Saida
- 21-point proposal quality gate checklist
- Three-options audit framework
- Discovery-proposal alignment matrix
- Review process and SLAs
- Win rate analytics framework

## Validacao
- [ ] Every proposal must pass quality gate before sending
- [ ] Three-options framework consistently applied
- [ ] Discovery findings directly traceable in proposal
- [ ] Review turnaround within SLA
- [ ] Win rate tracked and improving
