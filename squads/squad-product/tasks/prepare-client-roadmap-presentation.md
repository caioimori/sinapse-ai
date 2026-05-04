---
task: prepare-client-roadmap-presentation
responsavel: "@ps-client-product-manager"
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

# Prepare Client Roadmap Presentation

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** Client-facing roadmap, presentation deck, talking points, FAQ preparation

## Purpose
Preparar apresentacao de roadmap para clientes usando Dual Roadmap System: versao interna (detalhada) traduzida para versao client-facing (focada em outcomes). Clientes querem saber VALOR, nao features.

## Steps

### Step 1: Translate Internal to Client-Facing Roadmap
**Internal Roadmap (team-facing):**
- Features, stories, technical details
- Sprint-level timeline
- Dependencies, risks, technical debt
- Team assignments

**Client-Facing Roadmap (outcome-focused):**
- Business outcomes, not features
- Now/Next/Later (Janna Bastow), not dates
- Value delivered, not effort spent
- Strategic alignment, not technical decisions

**Translation Rules:**
| Internal Language | Client-Facing Language |
|------------------|----------------------|
| "Implement caching layer" | "Faster page load times" |
| "Refactor auth module" | "Improved security" |
| "Add Stripe integration" | "Accept online payments" |
| "Sprint 14-16" | "Next quarter" |
| "8 story points" | "Medium initiative" |
| "Tech debt reduction" | "Platform stability improvements" |

### Step 2: Structure Client Roadmap
**Now / Next / Later Format:**
```
NOW (Current Sprint/Month — High Confidence):
  [Outcome 1]: [value description] — Status: [progress]
  [Outcome 2]: [value description] — Status: [progress]

NEXT (Next 1-3 Months — Medium Confidence):
  [Outcome 3]: [value description]
  [Outcome 4]: [value description]

LATER (3-6 Months — Low Confidence):
  [Outcome 5]: [value description]
  [Outcome 6]: [value description]

EXPLORING (Ideas Under Investigation):
  [Opportunity 1]: [brief description]
```

**Confidence Indicators:**
| Timeframe | Confidence | What Client Should Expect |
|-----------|-----------|--------------------------|
| NOW | HIGH (>80%) | Committed, in progress |
| NEXT | MEDIUM (40-70%) | Planned, may shift |
| LATER | LOW (<40%) | Directional, subject to change |
| EXPLORING | VERY LOW | No commitment, investigating |

### Step 3: Build Presentation Structure
**Deck Outline (20-30 min presentation):**

**Slide 1: Agenda** (1 min)
- What we accomplished, what is coming, discussion

**Slide 2-3: What We Delivered** (5 min)
- Recent outcomes shipped (value language)
- Key metrics impact (if available)
- Client requests addressed

**Slide 4: Current Focus (NOW)** (5 min)
- What we are working on right now
- Expected delivery timeline
- Any blockers or decisions needed from client

**Slide 5-6: Upcoming (NEXT)** (7 min)
- What is planned for next period
- Strategic alignment (ties to their goals)
- Any trade-offs or options for client input

**Slide 7: Future Direction (LATER)** (5 min)
- Longer-term vision themes
- Areas of exploration
- Explicit: "These are directional, not commitments"

**Slide 8: Discussion** (10 min)
- Open questions
- Client priorities for input
- Feedback on direction

### Step 4: Prepare Talking Points & FAQ
**Per Roadmap Item, Prepare:**
```
ITEM: [outcome name]
WHY: [business rationale — why this matters to THEM]
WHAT: [brief description of what changes for users]
WHEN: [confidence level + timeframe]
DEPENDS ON: [any client actions needed]
RISK: [what could delay this]
```

**Anticipated Client Questions (prepare answers):**
| Likely Question | Prepared Answer |
|----------------|----------------|
| "When will [feature X] be ready?" | [answer with confidence level, not exact date] |
| "Can we move [item] up in priority?" | [trade-off explanation: "Yes, but that means..."] |
| "Why is [their request] not on the roadmap?" | [explanation + what IS being done instead] |
| "Why is this taking so long?" | [complexity explanation in business terms] |
| "What about [competitor feature]?" | [strategic response — why our approach differs] |

### Step 5: Visual Presentation Tips
**Roadmap Visualization Best Practices:**
- Use color to indicate confidence (green=NOW, yellow=NEXT, gray=LATER)
- Group by theme/goal, not by team or technology
- Show progress on current items (not just future plans)
- Include "delivered" section (celebrate wins together)
- No Gantt charts for clients (implies false precision)
- No story points or velocity (internal metrics)

**Things to NEVER show clients:**
- Internal team velocity or sprint capacity
- Technical debt details
- Individual developer assignments
- Bug count or defect metrics
- Internal team disagreements or debates

### Step 6: Post-Presentation Follow-Up
**Within 24h of presentation:**
- [ ] Send summary email with roadmap highlights
- [ ] Document any decisions made during discussion
- [ ] Log client feedback and priority input
- [ ] Update internal roadmap with client input
- [ ] Schedule next roadmap review (monthly or quarterly)

## Output Artifacts
- `client-roadmap-[client]-[date].md` | `roadmap-presentation-deck.md` | `talking-points.md` | `client-feedback-log.md`

## Quality Criteria
- Outcomes-focused (not features) | Now/Next/Later format used | Confidence levels explicit | No false precision (no exact dates for uncertain items) | FAQ prepared | Client feedback captured | Follow-up within 24h
