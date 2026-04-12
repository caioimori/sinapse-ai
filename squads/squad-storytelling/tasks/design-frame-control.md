---
task: "design-frame-control"
responsavel: "oren-klaff"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Interaction context (meeting, negotiation, pitch, presentation)"
  - "Participants and their likely frames"
Saida:
  - "Frame control strategy with counter-frame playbook"
Checklist:
  - "[ ] All participant frames identified"
  - "[ ] Counter-frames designed for each scenario"
  - "[ ] Status dynamics mapped and strategy defined"
---

# Task: Design Frame Control Strategy

**Task ID:** NARR-010
**Version:** 1.0.0
**Command:** `*design-frame-control`
**Agent:** Oren Klaff (oren-klaff)
**Purpose:** Analyze an interaction and design a frame control strategy for dominance.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `interaction_context` | Meeting type, stakes, setting | YES |
| `participants` | Who will be present, their roles | YES |
| `your_goal` | What you want to achieve | YES |
| `known_dynamics` | Any known power dynamics | NO |

## Execution Phases

### Phase 1: Frame Analysis

For each participant, identify their likely frame:
- Power frame (authority-based)
- Time frame (pressure-based)
- Analyst frame (detail-based — the pitch killer)
- Prize frame (scarcity-based)
- Moral authority frame (values-based)

### Phase 2: Counter-Frame Design

For each anticipated frame, design a specific counter:
- Power frame → Small acts of defiance + humor
- Time frame → Set your own time constraint first
- Analyst frame → Acknowledge + redirect to narrative
- Prize frame → Out-prize them (be more selective)

### Phase 3: Status Strategy

1. Identify beta traps in the environment
2. Design status-establishment moves for first 30 seconds
3. Plan push-pull dynamics throughout
4. Create recovery plays for status challenges

### Phase 4: Frame Stacking

Design a multi-frame approach combining 2-3 frames simultaneously.

## Veto Conditions

- **NEVER** accept a frame that lowers your status without counter-play
- **NEVER** engage the analyst frame head-on — redirect always
- **NEVER** show neediness — it signals low status instantly

## Completion Criteria

- [ ] All participant frames identified and analyzed
- [ ] Counter-frames designed for each scenario
- [ ] Status dynamics mapped with establishment strategy
- [ ] Frame stacking strategy defined
- [ ] Recovery plays prepared for status challenges
