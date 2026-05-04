---
task: design-discovery-framework
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

# Task: Design Discovery Framework

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** High

## Objetivo
Desenhar framework de discovery — processo estruturado de diagnóstico comercial que combina SPIN Selling com Gap Selling para identificar dor real, medir impacto e construir business case irrefutável.

## Entrada
- Sales methodology audit (from audit-sales-methodology)
- ICP profile (from Cascade)
- Service portfolio (from Mint)
- Win/loss patterns (from Vault)
- Top performer call analysis

## Passos

### 1. Discovery Philosophy
```
CORE PRINCIPLE: Discovery is not interrogation — it's diagnosis.

The goal is NOT to find a way to sell our services.
The goal IS to understand their world so deeply that
the right solution becomes obvious to THEM.

"People don't buy what you do; they buy WHY it matters
to THEM." — adapted from Sinek + Rackham

THREE OUTCOMES OF GREAT DISCOVERY:
  1. Client feels deeply understood (Trust Equation: ↑ Intimacy)
  2. Pain is quantified in their language (Gap Selling: Current → Future State)
  3. Business case writes itself (SPIN: Need-Payoff → Clear ROI)

ANTI-PATTERNS TO AVOID:
  ✗ Pitching during discovery ("Let me tell you about our services...")
  ✗ Leading questions ("Wouldn't you agree that...")
  ✗ Feature dumping ("We also do X, Y, Z...")
  ✗ Premature prescription ("What you need is...")
  ✗ Surface-level discovery ("What keeps you up at night?")
```

### 2. Three-Phase Discovery Model
```
PHASE 1: CONTEXT MAPPING (Before the call)
═══════════════════════════════════════════
Time: 15-30 min prep per prospect
Goal: Walk into the call more informed than they expect

Research Checklist:
  □ Company: Revenue, employees, growth trajectory, funding
  □ Industry: Trends, challenges, competitive landscape
  □ Digital presence: Website audit, social channels, content quality
  □ Key people: LinkedIn profiles, career history, recent posts
  □ Trigger event: What prompted the meeting? News, job posting, competitor move
  □ Hypothesis: 3 informed guesses about their problems

Sources:
  - LinkedIn (company + individuals)
  - Company website, blog, careers page
  - Press releases, news mentions
  - G2/Glassdoor (culture signals)
  - SimilarWeb/SEMrush (digital performance signals)
  - Annual reports (if public)

Output: 1-page Pre-Call Brief

PHASE 2: DIAGNOSTIC CONVERSATION (The call)
═══════════════════════════════════════════
Time: 45-60 min
Goal: Map current state, future state, and the gap between them

Structure:
  Part A — Rapport & Agenda (5 min)
  Part B — Situation & Context (10 min) [SPIN: Situation]
  Part C — Problems & Frustrations (15 min) [SPIN: Problem + Gap: Current State]
  Part D — Impact & Implications (10 min) [SPIN: Implication + Gap: Impact]
  Part E — Desired Future State (5 min) [SPIN: Need-Payoff + Gap: Future State]
  Part F — Next Steps & Alignment (5 min)

PHASE 3: SYNTHESIS & BUSINESS CASE (After the call)
═══════════════════════════════════════════
Time: 30 min post-call
Goal: Convert conversation into structured diagnosis

Output: Discovery Summary Document
  → Sent to prospect within 24h
  → Demonstrates you LISTENED
  → Frames the problem in business terms
  → Sets up the proposal naturally
```

### 3. Question Bank by Phase

#### Part B: Situation Questions
| Area | Question | What You're Mapping |
|------|---------|-------------------|
| Team | "Walk me through how your [marketing/digital/brand] team is structured today." | Resource capacity |
| Process | "Take me through a typical campaign from idea to execution — how does that flow?" | Workflow maturity |
| Stack | "What tools and platforms are you using? How well are they integrated?" | Tech ecosystem |
| Partners | "Are you working with any external partners today? How's that going?" | Competitive positioning |
| Metrics | "What metrics does your leadership look at to evaluate success?" | Success criteria |
| Budget | "Without getting into specific numbers yet, how do you typically approach investment in this area?" | Budget signal |

#### Part C: Problem Questions
| Area | Question | What You're Mapping |
|------|---------|-------------------|
| Performance | "Where are you seeing the biggest gap between where you are and where you want to be?" | Primary pain |
| Friction | "What's the most frustrating part of your current setup?" | Emotional pain |
| Attempts | "What have you tried to solve this? What worked, what didn't?" | Sophistication level |
| Constraints | "What's holding you back from fixing this internally?" | Capability gaps |
| Urgency | "How long has this been a problem? What's changed recently?" | Trigger identification |

#### Part D: Implication Questions
| Area | Question | What You're Mapping |
|------|---------|-------------------|
| Revenue | "If [problem] continues for another 12 months, what's the impact on revenue?" | Financial cost |
| Opportunity | "What opportunities are you missing because of [problem]?" | Opportunity cost |
| Competitive | "How does [problem] affect your position vs competitors?" | Strategic risk |
| Team | "How does [problem] impact your team's morale and retention?" | People cost |
| Cascading | "What other areas of the business are affected when [problem] persists?" | Systemic impact |

#### Part E: Need-Payoff Questions
| Area | Question | What You're Mapping |
|------|---------|-------------------|
| Vision | "If we could wave a magic wand, what does the ideal state look like in 12 months?" | Desired outcome |
| Metrics | "What numbers would tell you 'this was worth it'?" | Success metrics |
| Priorities | "Of everything we've discussed, what would you solve first?" | Priority ranking |
| Decision | "How will you evaluate whether a partner is the right fit?" | Decision criteria (MEDDIC) |
| Value | "If you achieved [desired state], what would that mean for you personally?" | Personal win |

### 4. Gap Analysis Canvas
```
GAP SELLING CANVAS — [Prospect Name]

CURRENT STATE                              FUTURE STATE
═══════════════                            ═══════════════
Business results: ___________              Business results: ___________
Technical environment: ______              Technical environment: ______
Processes: _________________              Processes: _________________
Team capabilities: _________              Team capabilities: _________
Customer experience: ________              Customer experience: ________

                    THE GAP
                ═══════════════
  Business Impact: R$ _____________ / year
  Opportunity Cost: R$ ____________ / year
  Risk of Inaction: _____________________
  Root Causes:
    1. _________________________________
    2. _________________________________
    3. _________________________________

MINIMUM VIABLE CHANGE                     FULL TRANSFORMATION
═══════════════════════                   ═══════════════════════
Investment: R$ ____________               Investment: R$ ____________
Timeline: _________ months               Timeline: _________ months
Expected ROI: ____x                       Expected ROI: ____x
```

### 5. Discovery Quality Scorecard
| Dimension | Score (1-5) | Evidence |
|-----------|-------------|---------|
| Pre-call preparation quality | | Research depth, hypotheses |
| Rapport and trust established | | Client comfort, openness |
| Pain identified and quantified | | Specific $ or metric impact |
| Implication depth explored | | Cascading effects mapped |
| Future state articulated by client | | In their words, specific |
| Decision process mapped | | MEDDIC elements captured |
| Compelling next step secured | | Specific, time-bound |
| Discovery summary sent < 24h | | Written, sent, confirmed |
| **TOTAL** | /40 | |

**Scoring Thresholds:**
- 35-40: Excellent — ready for proposal
- 28-34: Good — minor gaps to fill
- 20-27: Adequate — follow up to deepen
- <20: Insufficient — re-engage before proposing

## Saida
- Three-phase discovery framework
- Question bank by category (40+ questions)
- Gap Analysis Canvas
- Discovery quality scorecard
- Pre-call brief template

## Validacao
- [ ] Discovery philosophy clearly articulated (diagnosis, not interrogation)
- [ ] Three phases cover pre-call, call, and post-call
- [ ] Questions organized by SPIN + Gap Selling hybrid
- [ ] Gap Analysis Canvas connects current state to future state quantitatively
- [ ] Quality scorecard enables coaching and self-assessment
