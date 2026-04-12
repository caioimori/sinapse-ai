---
task: design-call-review-process
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

# Task: Design Call Review Process

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Standard

## Objetivo
Desenhar processo de call review — framework de coaching baseado em análise de calls reais para desenvolver skills da equipe comercial com feedback estruturado e actionable.

## Entrada
- Sales methodology (from audit-sales-methodology)
- Discovery framework (from design-discovery-framework)
- Call recordings (Gong, Chorus, or equivalent)
- Performance data per rep

## Passos

### 1. Call Review Philosophy
```
COACHING PRINCIPLES (Mark Roberge — Sales Acceleration Formula)

1. DIAGNOSE BEFORE PRESCRIBE
   "Don't tell reps what to do — help them see what happened."
   Listen to the call first, then ask them what they noticed.

2. ONE SKILL AT A TIME
   "Trying to fix everything at once fixes nothing."
   Each review session focuses on ONE improvement area.

3. POSITIVE BEFORE CONSTRUCTIVE
   "Start with what went well — build on strengths."
   2:1 ratio (2 positives for every constructive point).

4. BEHAVIOR-BASED, NOT RESULTS-BASED
   "You can't coach outcomes. You can only coach behaviors."
   Focus on what they DID, not just the result.

5. PRACTICE, NOT JUST DISCUSS
   "Knowing what to do vs. doing it are different skills."
   Every review ends with a practice exercise.
```

### 2. Call Scoring Framework
```
CALL REVIEW SCORECARD — [Rep Name] — [Date]
Call Type: Discovery / Presentation / Negotiation / Other
Prospect: [Company]
Duration: [min]
Reviewer: [Manager/Peer]

DIMENSION 1: PREPARATION (10 pts)
  □ Pre-call research evident (2)
  □ Agenda set at opening (2)
  □ Hypothesis or insights prepared (2)
  □ Relevant materials ready (2)
  □ CRM notes from prior interactions referenced (2)
  Score: ___ / 10

DIMENSION 2: DISCOVERY QUALITY (20 pts)
  □ Situation questions (context mapped) (3)
  □ Problem questions (pain identified) (4)
  □ Implication questions (impact quantified) (5)
  □ Need-Payoff questions (value articulated by prospect) (5)
  □ Active listening demonstrated (paraphrase, reflect) (3)
  Score: ___ / 20

DIMENSION 3: METHODOLOGY ADHERENCE (15 pts)
  □ MEDDIC elements explored (3)
  □ Champion tested or developed (3)
  □ Decision process mapped (3)
  □ Next steps with specific commitment (3)
  □ Qualification criteria applied correctly (3)
  Score: ___ / 15

DIMENSION 4: COMMUNICATION SKILLS (15 pts)
  □ Talk/listen ratio appropriate (<60% talk) (3)
  □ Questions are open-ended (not leading) (3)
  □ No feature dumping or premature pitch (3)
  □ Confident but not arrogant tone (3)
  □ Silence used effectively (comfortable pauses) (3)
  Score: ___ / 15

DIMENSION 5: OBJECTION HANDLING (10 pts)
  □ Objection acknowledged (not dismissed) (2)
  □ Clarifying question asked (Sandler reverse) (3)
  □ Framework response applied (ARB/FFF/Reframe) (3)
  □ Resolution confirmed with prospect (2)
  Score: ___ / 10

DIMENSION 6: CLOSE & NEXT STEPS (10 pts)
  □ Summary of key findings provided (2)
  □ Value recap before asking for next step (2)
  □ Specific next step proposed (not vague) (2)
  □ Stakeholder mapping advanced (2)
  □ Timeline confirmed (2)
  Score: ___ / 10

TOTAL: ___ / 80

Rating:
  70-80: Exceptional
  55-69: Strong
  40-54: Developing
  25-39: Needs improvement
  <25: Requires immediate coaching intervention
```

### 3. Review Session Structure
```
CALL REVIEW SESSION — 30 min

BEFORE SESSION (5 min):
  Manager:
    □ Listen to full call
    □ Score using framework
    □ Identify 1 primary coaching opportunity
    □ Find 2 positive moments to highlight

  Rep:
    □ Re-listen to call (or relevant sections)
    □ Self-assess: "What went well? What would I do differently?"

SESSION FLOW:

  [0-5 min] SELF-REFLECTION
  "Before I share my thoughts, what's your take on this call?"
  → Let rep self-diagnose
  → Often they'll identify the same issue
  → If they do: "Exactly right. Let's talk about how to fix it."
  → If they don't: "I noticed something else too..."

  [5-10 min] POSITIVE REINFORCEMENT
  "Here's what I thought you did really well..."
  → Play specific clip from call
  → Name the skill: "That was an excellent implication question."
  → Connect to methodology: "That's textbook SPIN — the prospect
     quantified the impact themselves because of how you asked."

  [10-20 min] COACHING OPPORTUNITY
  "Here's the one thing that could elevate your game..."
  → Play the relevant clip
  → Ask: "What were you trying to do here?"
  → Explain the gap (behavior, not character)
  → Model the alternative: "Here's how I might approach it..."
  → Practice: Role-play the scenario with improvement

  [20-25 min] PRACTICE
  "Let's try it again. I'll be the prospect."
  → Role-play the specific moment
  → Rep applies the coaching
  → Feedback: "That's it. Did you feel the difference?"

  [25-30 min] ACTION PLAN
  "So for your next 3 calls, here's the focus..."
  → One specific behavior to practice
  → How to self-assess (what to notice)
  → "I'll listen to your [next call] and we'll check progress."
```

### 4. Review Cadence
| Activity | Frequency | Participants | Focus |
|---------|----------|-------------|-------|
| 1:1 Call Review | Weekly | Manager + Rep | Individual skill development |
| Peer Review | Bi-weekly | 2 reps (paired) | Learn from each other |
| Team Call of the Week | Weekly | Full sales team | Celebrate great call, learn collectively |
| Ride-Along (live) | Monthly | Manager joins call live | Real-time observation |
| Self-Review | After every call | Individual rep | Self-score, identify own patterns |

### 5. Call Library
| Category | Criteria | Purpose | Curator |
|----------|---------|---------|---------|
| "Hall of Fame" | Score 70+ | Best-in-class examples per stage | Edge |
| "Discovery Master" | Perfect discovery score | Template for new hires | Edge |
| "Objection Judo" | Excellent objection handling | Objection response examples | Edge |
| "The Close" | Exceptional closing moment | Closing technique gallery | Edge |
| "Learning Moments" | Anonymized improvement examples | What NOT to do (constructive) | Edge |

### 6. Call Review Metrics
| Metric | Target | Tracking |
|--------|--------|---------|
| Calls reviewed per rep per month | ≥ 4 | Review log |
| Average call score trend | ↑ over time | Scorecard data |
| Talk/listen ratio improvement | <60% talk | Call analytics |
| Discovery score improvement | ↑ per quarter | Scorecard data |
| Self-review completion rate | 100% of calls | Self-report |
| Time from call to review | <7 days | Review log |

## Saida
- Call scoring framework (80-point scorecard)
- Review session structure (30-min format)
- Review cadence schedule
- Call library categories
- Coaching metrics dashboard

## Validacao
- [ ] Scorecard covers all methodology dimensions
- [ ] Review session structure follows coaching best practices
- [ ] Cadence realistic and sustainable
- [ ] Call library organized and curated
- [ ] Metrics track improvement over time
