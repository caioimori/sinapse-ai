---
task: facilitate-sprint-retrospective
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

# Facilitate Sprint Retrospective

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 1-1.5 hours
- **Produces:** Retrospective notes, action items, team health indicators, improvement commitments

## Purpose
Facilitar retrospectiva de sprint focada em melhoria continua do processo e da equipe. Retros eficazes geram acoes concretas, nao apenas desabafos.

## Steps

### Step 1: Pre-Retro Data Collection
**Sprint Metrics (bring to retro):**
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Sprint Goal achieved? | Yes/Partial/No | Yes | |
| Velocity (points completed) | [N] | [N] | |
| Completion rate | [%] | >80% | |
| Carryover items | [N] | 0 | |
| Bugs found in sprint | [N] | <[threshold] | |
| Unplanned work % | [%] | <20% | |
| Tech debt addressed | [N items / points] | [target] | |

**Previous Retro Actions (accountability check):**
| Action | Owner | Status | Notes |
|--------|-------|--------|-------|
| [action from last retro] | [name] | Done/In Progress/Not Started | |

### Step 2: Retrospective Facilitation
**Format Options (rotate to avoid fatigue):**

**Option A: 4Ls (Liked, Learned, Lacked, Longed For)**
| Category | Question |
|----------|---------|
| Liked | What went well that we should keep doing? |
| Learned | What new insight did we gain? |
| Lacked | What was missing or insufficient? |
| Longed For | What do we wish we had? |

**Option B: Start/Stop/Continue**
| Category | Question |
|----------|---------|
| Start | What should we begin doing? |
| Stop | What should we stop doing? |
| Continue | What is working and should continue? |

**Option C: Sailboat**
| Element | Metaphor | Question |
|---------|----------|---------|
| Wind | What propels us forward? | What gave us speed? |
| Anchor | What holds us back? | What slowed us down? |
| Rocks | What are the risks? | What could sink us? |
| Island | What is the destination? | What are we trying to achieve? |

**Option D: Mad/Sad/Glad**
| Emotion | Question |
|---------|---------|
| Mad | What frustrated you this sprint? |
| Sad | What disappointed you? |
| Glad | What made you happy or proud? |

### Step 3: Session Structure (60-90 min)
**Agenda:**
```
1. Check-in (5 min): One word to describe the sprint
2. Data Review (10 min): Sprint metrics + previous action status
3. Gather Data (15 min): Individual reflection (silent writing)
4. Generate Insights (20 min): Group discussion, theme identification
5. Decide Actions (15 min): Vote on top themes, assign actions
6. Close (5 min): One thing you appreciate about a teammate
```

**Facilitation Rules:**
- [ ] Everyone speaks (use round-robin if needed)
- [ ] No blame, focus on process not people
- [ ] Timebox each section strictly
- [ ] Vote to prioritize (dot voting: 3 dots per person)
- [ ] Max 3 action items (more = none get done)
- [ ] Every action has an owner and deadline

### Step 4: Action Items Definition
**Per Action Item:**
```
ACTION: [specific, measurable action]
OWNER: [single person — not "the team"]
DEADLINE: [by when — ideally before next retro]
SUCCESS CRITERIA: [how do we know this is done]
THEME: [which retro theme this addresses]
```

**Action Quality Check:**
- [ ] Specific (not "communicate better" but "add 5-min sync at 10am daily")
- [ ] Has single owner (not shared ownership)
- [ ] Has deadline (not "ongoing")
- [ ] Measurable (we can tell if it worked)
- [ ] Within team control (not dependent on external factors)

### Step 5: Team Health Check (Optional, quarterly)
**Spotify Team Health Check Model:**
| Dimension | Score (1-5) | Trend | Notes |
|-----------|------------|-------|-------|
| Delivering Value | | Up/Down/Same | |
| Speed | | | |
| Code Quality | | | |
| Fun | | | |
| Learning | | | |
| Mission Clarity | | | |
| Teamwork | | | |
| Support | | | |
| Process | | | |

### Step 6: Document & Distribute
**Retro Summary:**
```
Sprint: [number]
Date: [date]
Participants: [list]
Format Used: [4Ls / Start-Stop-Continue / etc.]

TOP THEMES:
1. [theme — N votes]
2. [theme — N votes]
3. [theme — N votes]

ACTION ITEMS:
1. [action] — Owner: [name] — By: [date]
2. [action] — Owner: [name] — By: [date]
3. [action] — Owner: [name] — By: [date]

PREVIOUS ACTIONS STATUS:
- [action]: DONE / IN PROGRESS / NOT STARTED

TEAM MORALE: [emoji or score summary]
```

## Output Artifacts
- `retro-sprint-[number].md` | `retro-action-items.md` | `team-health-check.md`

## Quality Criteria
- Data-driven (metrics reviewed, not just feelings) | Everyone participated | Max 3 action items | Each action has owner + deadline | Previous actions reviewed for accountability | Format rotated periodically
