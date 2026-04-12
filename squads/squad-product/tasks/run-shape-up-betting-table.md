---
task: run-shape-up-betting-table
responsavel: "@ps-delivery-manager"
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

# Run Shape Up Betting Table

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Betting table decisions, cycle plan, shaped pitches evaluation, resource allocation

## Purpose
Facilitar Betting Table (Ryan Singer, Shape Up) onde lideranca decide quais projetos serao apostados para o proximo ciclo. Diferente de sprint planning — aqui decidimos O QUE fazer, nao COMO fazer.

## Steps

### Step 1: Pre-Betting Table Preparation
**Inputs Needed:**
- Shaped pitches (projects already shaped with appetite, solution sketch, risks)
- Current cycle results (what shipped, what did not)
- Strategic priorities (from product strategy / OKRs)
- Team capacity for next cycle
- Client commitments and deadlines

**Pitch Quality Gate (each pitch must have):**
- [ ] Problem statement (why this matters)
- [ ] Appetite (time budget: 2 weeks or 6 weeks)
- [ ] Solution sketch (not detailed spec, but shaped direction)
- [ ] Rabbit holes identified (known risks)
- [ ] No-gos defined (what is explicitly out of scope)

### Step 2: Betting Table Session
**Participants:**
- Product lead (decision maker)
- Delivery lead (capacity + feasibility)
- Client lead (client priorities + commitments)
- Optional: Tech lead (for technical feasibility input)

**Agenda (2-3 hours):**

**Part 1: Review Last Cycle (30 min)**
- What shipped? What did not ship? Why?
- Any carry-over proposals?
- Client feedback on recent deliveries

**Part 2: Pitch Review (60-90 min)**
**Per Pitch (10-15 min each):**
```
PITCH: [project name]
PITCHER: [who shaped it]
APPETITE: [2-week small batch / 6-week big batch]
PROBLEM: [1-2 sentences]
SOLUTION SKETCH: [high-level approach]
RABBIT HOLES: [known risks]
NO-GOS: [explicit boundaries]

DISCUSSION:
- Does this solve a real problem? (value check)
- Is the appetite right? (sizing check)
- Are the risks manageable? (risk check)
- Does it align with strategy? (alignment check)
- Do we have the right team? (capability check)
```

**Part 3: Betting Decisions (30-60 min)**
**Per Pitch, Decide:**
| Decision | Meaning |
|----------|---------|
| **BET** | Approved for next cycle with stated appetite |
| **DEFER** | Good pitch but not this cycle — revisit next time |
| **RESHAPE** | Interesting but needs more shaping work |
| **KILL** | Not aligned or not worth the investment |

### Step 3: Cycle Planning
**Cycle Allocation:**
```
Cycle Duration: [N weeks]
Team Capacity: [N person-weeks]

BETS:
| Project | Appetite | Team | Start | Target End |
|---------|---------|------|-------|-----------|
| [project 1] | [weeks] | [who] | [date] | [date] |
| [project 2] | [weeks] | [who] | [date] | [date] |

COOLDOWN (between cycles):
Duration: [1-2 weeks]
Purpose: Bug fixes, tech debt, small improvements, exploration
```

**Team Assignment Rules:**
- Small batch (2 weeks): 1-2 developers + 1 designer
- Big batch (6 weeks): 2-3 developers + 1 designer
- Teams work autonomously within appetite (no micromanagement)
- If appetite runs out, project is not extended — it is cut or deferred

### Step 4: Shape Up Principles (Enforce)
**Key Rules:**
| Principle | Rule |
|-----------|------|
| Fixed time, variable scope | Appetite is the constraint, scope is adjusted |
| No carry-over by default | Unfinished work returns to the shaping table |
| No backlogs | Pitches compete fresh each cycle |
| Autonomy within appetite | Team decides implementation details |
| Circuit breaker | If 2 weeks in and stuck, escalate immediately |

**Anti-Patterns to Avoid:**
- Treating betting table like sprint planning (too detailed)
- Carrying over unfinished work automatically (no accountability)
- Extending appetite when team asks for more time (scope creep)
- Betting on unshaped work ("we will figure it out")
- Ignoring cooldown period (tech debt accumulates)

### Step 5: Communication
**Post-Betting Table Communication:**
```
CYCLE [N] PLAN
──────────────────────
Cycle: [start date] — [end date]
Cooldown: [cooldown dates]

BETS (what we are building):
1. [Project]: [1-sentence description] — Team: [names] — Appetite: [weeks]
2. [Project]: [1-sentence description] — Team: [names] — Appetite: [weeks]

DEFERRED (not this cycle):
- [Pitch]: [reason deferred]

COOLDOWN PRIORITIES:
- [bug fix / tech debt item]
- [exploration / small improvement]

Next Betting Table: [date]
```

## Output Artifacts
- `betting-table-cycle-[N].md` | `cycle-plan.md` | `pitch-decisions.md` | `deferred-pitches.md`

## Quality Criteria
- All pitches properly shaped before table | Every pitch gets explicit decision (bet/defer/reshape/kill) | Appetite respected as hard constraint | No carry-over without re-betting | Cooldown scheduled | Team assignments clear | Communication sent same day
