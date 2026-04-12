---
task: "create-beat-sheet"
responsavel: "blake-snyder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Story concept, logline, or existing draft"
Saida:
  - "Complete 15-beat sheet with all beats populated"
Checklist:
  - "[ ] All 15 beats defined with content and page targets"
  - "[ ] Genre type identified from the 10 genres"
  - "[ ] Primal test passed — connects to survival drives"
---

# Task: Create Beat Sheet

**Task ID:** NARR-007
**Version:** 1.0.0
**Command:** `*create-beat-sheet`
**Agent:** Blake Snyder (blake-snyder)
**Purpose:** Build a complete 15-beat Save the Cat beat sheet for any narrative.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `story_concept` | User prompt or logline | YES |
| `genre` | User-specified or to be determined | PREFERRED |
| `format` | Film, novel, series | NO (default: film) |

## Execution Phases

### Phase 1: Logline and Genre

1. Craft or refine the logline (irony + mental picture + audience)
2. Classify into one of the 10 genre types
3. Apply the primal test — does it connect to survival drives?

### Phase 2: Build 15 Beats

For each beat, define: what happens, the emotional state, and how it connects to the theme.

1. **Opening Image** (p.1) — The "before" snapshot
2. **Theme Stated** (p.5) — The lesson, stated but not yet understood
3. **Set-Up** (p.1-10) — World, flaws, relationships, stakes planted
4. **Catalyst** (p.12) — The life-changing inciting incident
5. **Debate** (p.12-25) — Should I? Can I? Last chance to turn back
6. **Break into Two** (p.25) — Proactive CHOICE to enter new world
7. **B Story** (p.30) — Love story / theme carrier
8. **Fun and Games** (p.30-55) — The promise of the premise
9. **Midpoint** (p.55) — False victory or false defeat; stakes raise
10. **Bad Guys Close In** (p.55-75) — External + internal pressure
11. **All Is Lost** (p.75) — Whiff of death; lowest point
12. **Dark Night of the Soul** (p.75-85) — Despair before breakthrough
13. **Break into Three** (p.85) — A + B stories cross; solution found
14. **Finale** (p.85-110) — Execute, defeat, transform
15. **Final Image** (p.110) — Opposite of Opening Image; proof of change

### Phase 3: Verify Structure

1. Does the Midpoint mirror/reverse All Is Lost?
2. Do A and B stories cross at Break into Three?
3. Is Fun and Games delivering the promise of the premise?
4. Is there a clear "whiff of death" at All Is Lost?
5. Does Final Image oppose Opening Image?

## Output Format

```yaml
beat_sheet:
  logline: "{one sentence with irony}"
  genre: "{one of 10 types}"
  primal_test: "{survival drive connection}"
  beats:
    - number: 1
      name: "Opening Image"
      page: "1"
      content: "{what happens}"
      emotional_state: "{feeling}"
      theme_connection: "{how it relates}"
    # ... all 15 beats
  structural_checks:
    midpoint_mirror: "{assessment}"
    ab_crossover: "{assessment}"
    promise_of_premise: "{assessment}"
    whiff_of_death: "{assessment}"
    transformation_proof: "{assessment}"
```

## Veto Conditions

- **NEVER** skip any of the 15 beats — the system requires completeness
- **NEVER** proceed without a logline — it is the foundation
- **NEVER** make Break into Two an accident — it must be a hero's CHOICE
- **NEVER** forget the whiff of death at All Is Lost

## Completion Criteria

- [ ] Logline crafted with irony and primal resonance
- [ ] Genre identified from the 10 types
- [ ] All 15 beats defined with content, emotion, and theme
- [ ] Structural checks passed
- [ ] Transformation visible from Opening to Final Image
