---
task: "create-pitch"
responsavel: "oren-klaff"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "What is being pitched"
  - "Target audience (investors, clients, partners)"
Saida:
  - "Complete pitch narrative using STRONG method"
Checklist:
  - "[ ] Audience profiled with decision criteria mapped"
  - "[ ] STRONG method applied with all 6 phases structured"
  - "[ ] Clear ask with objection handling prepared"
---

# Task: Create Pitch Narrative

**Task ID:** NARR-009
**Version:** 1.0.0
**Command:** `*create-pitch`
**Agent:** Oren Klaff (oren-klaff)
**Purpose:** Craft a compelling pitch narrative using the STRONG method with frame control strategy.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `pitch_subject` | User prompt | YES |
| `target_audience` | Investors, clients, partners, internal | YES |
| `desired_outcome` | Funding, deal, approval, buy-in | YES |
| `key_data_points` | Metrics, traction, financials | PREFERRED |
| `time_limit` | Pitch duration | NO (default: 10 min) |

## Execution Phases

### Phase 1: Analyze Audience & Status

1. Profile the audience — values, fears, decision criteria
2. Identify their current frame — how they see the world
3. Determine status dynamics — pitching up, down, or laterally?
4. Map potential beta traps in the environment
5. Identify potential objections and resistance points

### Phase 2: Design Frame Strategy

1. Select primary frame: Prize, Time, Authority, Intrigue
2. Identify counter-frames for anticipated buyer frames
3. Plan frame stacking (typical: Prize + Time + Intrigue)
4. Design status-establishment moments for first 30 seconds

### Phase 3: Apply STRONG Method

1. **Set the Frame** — Establish dominance before content begins
2. **Tell the Story** — Hook with narrative, build tension, create desire
3. **Reveal the Intrigue** — Unique insight that changes everything
4. **Offer the Prize** — Position yourself/product as the prize
5. **Nail the Hookpoint** — The moment they lean in (within first 5 min)
6. **Get the Deal** — Drive to clear yes/no; remove friction

### Phase 4: Optimize for Croc Brain

1. Simplify: croc brain demands simplicity
2. Novelty: introduce something unexpected
3. High-contrast: clear before/after or with/without
4. Tension: maintain unresolved intrigue throughout
5. Emotional peaks: design 2-3 hot cognition moments

### Phase 5: Design Resolution

1. Make the ask crystal clear
2. Simplify to binary choice
3. Create immediate next steps
4. Prepare for top 5 objections
5. End with resonance — memorable closing

## Output Format

```yaml
pitch_narrative:
  subject: "{what is being pitched}"
  approach: "klaff_strong_method"
  audience: "{target audience}"
  desired_outcome: "{what success looks like}"
  duration: "{estimated time}"
  frame_strategy:
    primary_frame: "{frame type}"
    counter_frames: ["{anticipated frames and counters}"]
    status_play: "{how status is established}"
  strong_beats:
    - phase: "Set Frame"
      content: "{what to do/say}"
      duration: "{time}"
    # ... all 6 phases
  croc_brain_optimizations: ["{specific techniques}"]
  the_ask: "{specific request}"
  objection_handling:
    - objection: "{concern}"
      response: "{preemptive answer}"
  closing_statement: "{memorable ending}"
```

## Veto Conditions

- **NEVER** pitch without understanding the audience first
- **NEVER** target the neocortex before activating hot cognition
- **NEVER** bury the ask — it must be explicit and clear
- **NEVER** create a pitch longer than the time limit
- **NEVER** chase — maintain prize frame throughout

## Completion Criteria

- [ ] Audience profiled with decision criteria
- [ ] Frame strategy designed with counter-frames
- [ ] All 6 STRONG phases structured
- [ ] Croc brain optimizations applied
- [ ] Clear ask with objection handling
- [ ] Memorable closing designed
