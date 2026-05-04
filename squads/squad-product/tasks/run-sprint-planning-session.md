---
task: run-sprint-planning-session
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

# Run Sprint Planning Session

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours (session) + 1h prep
- **Produces:** Sprint backlog, sprint goal, capacity plan, commitment confirmation

## Purpose
Facilitar sessao de sprint planning que resulte em compromisso claro da equipe com um sprint goal e backlog priorizado. Combina Scrum planning com agency-specific adaptacoes (multi-client, variabilidade de escopo).

## Steps

### Step 1: Pre-Planning Preparation
**Capacity Calculation:**
```
Sprint Duration: [N days]
Team Members: [list with availability %]

Per Member:
  Available Days = Sprint Days × Availability %
  Productive Hours = Available Days × Focus Factor (typically 0.6-0.8)
  Story Points Capacity = Productive Hours × Historical Points/Hour

Team Capacity:
  Total Available Days: [sum]
  Total Story Points: [sum of individual capacities]
  Buffer (10-15%): [points reserved for unknowns]
  Committable Capacity: Total - Buffer = [points]
```

**Budget Allocation:**
| Category | % of Capacity | Points | Rationale |
|----------|--------------|--------|-----------|
| Delivery (new features) | 60-70% | [pts] | Sprint goal progress |
| Tech Debt | 15-20% | [pts] | Non-negotiable maintenance |
| Discovery | 10-15% | [pts] | Research, validation |
| Buffer | 5-10% | [pts] | Unplanned, meetings, support |

**Pre-Planning Checklist:**
- [ ] Backlog refined and prioritized (top items ready)
- [ ] Acceptance criteria clear for top 10-15 items
- [ ] Dependencies identified and resolved
- [ ] Previous sprint velocity known
- [ ] Team availability confirmed (vacations, holidays, other clients)

### Step 2: Sprint Planning Session
**Agenda (2-3 hours):**

**Part 1: Context & Goal (30 min)**
- Previous sprint review (velocity, completion rate, learnings)
- Product priorities for this sprint (from product-orqx)
- Client expectations and deadlines
- Draft sprint goal

**Sprint Goal Template:**
```
This sprint, we will [primary deliverable]
so that [user/business benefit]
measured by [how we know we succeeded].

Secondary objectives (if capacity allows):
- [secondary goal 1]
- [secondary goal 2]
```

**Part 2: Backlog Selection (60-90 min)**
- Walk through prioritized backlog items
- For each candidate item:
  - Clarify: "Do we understand what this requires?"
  - Estimate: Team estimation (Planning Poker or T-shirt)
  - Dependencies: "What blocks this or what does this block?"
  - Commit: "Can we complete this in this sprint?"

**Estimation Reference:**
| Size | Story Points | Typical Effort | Confidence |
|------|-------------|---------------|-----------|
| XS | 1 | < 0.5 day | Very High |
| S | 2-3 | 0.5-1 day | High |
| M | 5 | 2-3 days | Medium |
| L | 8 | 3-5 days | Medium-Low |
| XL | 13 | > 1 week | Low (should split) |

**Part 3: Commitment & Plan (30 min)**
- Review total committed vs capacity
- Confidence vote (Fist of Five: 1-5)
  - >= 3.5 average: Proceed with commitment
  - < 3.5: Reduce scope until confidence rises
- Identify risks and mitigation

### Step 3: Sprint Backlog Compilation
**Sprint Backlog Document:**
| # | Item | Type | Points | Assignee | Dependencies | Status |
|---|------|------|--------|----------|-------------|--------|
| 1 | [story/task] | Feature/Debt/Discovery | [pts] | [name] | [blockers] | Ready |
| 2 | [story/task] | | [pts] | [name] | | Ready |
| ... | | | | | | |

**Sprint Summary:**
```
Sprint: [sprint number / name]
Duration: [start date] — [end date]
Sprint Goal: [goal statement]
Total Points Committed: [N] / [capacity] ([% of capacity])
Team Confidence: [score /5]
Key Risks: [list]
```

### Step 4: Post-Planning Actions
- [ ] Sprint backlog visible to all (update tool)
- [ ] Sprint goal posted in team channel
- [ ] Daily standup scheduled
- [ ] Mid-sprint check scheduled
- [ ] Sprint review/demo scheduled
- [ ] Dependencies communicated to dependent teams
- [ ] Client-facing deadlines confirmed

## Output Artifacts
- `sprint-plan-[sprint-number].md` | `sprint-backlog.md` | `capacity-plan.md` | `sprint-risks.md`

## Quality Criteria
- Capacity calculated with actual availability | Budget allocation follows ratio | Sprint goal specific and measurable | All items estimated | Confidence vote >= 3.5 | Buffer included | Dependencies mapped
