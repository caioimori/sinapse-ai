---
task: "unblock-creative"
responsavel: "keith-johnstone"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Description of the creative block"
Saida:
  - "Block diagnosis with tailored exercises and micro-goal"
Checklist:
  - "[ ] Block type diagnosed with emotional root identified"
  - "[ ] At least 3 exercises prescribed and explained"
  - "[ ] Micro-goal set for immediate action"
---

# Task: Creative Unblocking

**Task ID:** NARR-016
**Version:** 1.0.0
**Command:** `*unblock-creative`
**Agent:** Keith Johnstone (keith-johnstone)
**Purpose:** Diagnose and overcome creative blocks using improvisation techniques and story games.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `block_description` | User describes their stuck point | YES |
| `project_context` | What they are working on | PREFERRED |
| `what_theyve_tried` | Previous attempts to unblock | NO |
| `deadline_pressure` | Time constraints | NO |

## Execution Phases

### Phase 1: Diagnose Block

1. Identify the type:
   - **Fear of failure** — Inner critic too loud (most common)
   - **Perfectionism** — Refusing to produce anything less than perfect
   - **Status anxiety** — Fear of looking foolish
   - **Decision paralysis** — Too many options
   - **Burnout** — Creative exhaustion
   - **Lost thread** — Started strong, lost direction
   - **Blank page** — No starting point at all
2. Assess severity (mild/moderate/severe)
3. Identify the emotional root
4. Look for patterns

### Phase 2: Improv Exercises

1. **"Yes, And"** — Write 10 terrible ideas, then build on each
2. **Status Shift** — Reverse power dynamics in the stuck story
3. **Blind Offer** — Write the next scene without knowing where it goes
4. **Tilt** — Introduce an unexpected element that changes everything
5. **Free Association** — Write without stopping for 10 minutes

### Phase 3: Story Games

1. **The Boring Version** — Write the most obvious version (paradoxically reveals the interesting one)
2. **The Worst Version** — Deliberately write terribly (defeats perfectionism)
3. **Character Interview** — Let the character speak for themselves
4. **Constraint Box** — Add arbitrary constraints to force creativity
5. **Steal from Life** — Mine personal experience for material

### Phase 4: Reframe & Reconnect

1. Reframe the block as information
2. Identify what IS working
3. Reconnect with original impulse
4. Set a micro-goal (one paragraph, not one chapter)
5. Schedule the next creative session

## Output Format

```yaml
creative_unblock:
  block_type: "{diagnosed type}"
  severity: "mild | moderate | severe"
  emotional_root: "{underlying feeling}"
  diagnosis: |
    {Why the block is happening and what it signals}
  exercises_prescribed:
    - exercise: "{name}"
      instructions: "{step by step}"
      purpose: "{why this helps}"
      time_required: "{duration}"
  reframe: |
    {How to see the block differently}
  micro_goal: "{immediate small action}"
  ongoing_practice: "{habit to prevent recurrence}"
```

## Veto Conditions

- **NEVER** tell someone to "just push through"
- **NEVER** critique the user's existing work during unblocking
- **NEVER** add pressure — it makes blocks worse
- **NEVER** prescribe a single approach — always offer multiple exercises
- **NEVER** dismiss the block as laziness

## Completion Criteria

- [ ] Block type diagnosed with emotional root
- [ ] At least 3 exercises prescribed and tailored
- [ ] Each exercise explained with clear instructions
- [ ] Block reframed as information
- [ ] Micro-goal set for immediate action
- [ ] Ongoing practice recommended
