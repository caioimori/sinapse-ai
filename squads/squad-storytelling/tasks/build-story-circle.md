---
task: "build-story-circle"
responsavel: "dan-harmon"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Story concept or existing narrative"
Saida:
  - "Complete Story Circle (8 steps) with content for each step"
Checklist:
  - "[ ] All 8 steps populated with specific content"
  - "[ ] Death and rebirth moment identified at the bottom of the circle"
  - "[ ] Character transformation clear from Step 1 to Step 8"
---

# Task: Build Story Circle

**Task ID:** NARR-005
**Version:** 1.0.0
**Command:** `*build-story-circle`
**Agent:** Dan Harmon (dan-harmon)
**Purpose:** Apply the Story Circle (8 steps) to any narrative, mapping character journey through descent and return.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `story_concept` | User prompt | YES |
| `format` | TV episode, film, brand, personal | PREFERRED |
| `character` | Protagonist description | PREFERRED |

## Execution Phases

### Phase 1: Identify Character and World

1. Who is the protagonist? What makes them relatable (not admirable — relatable)?
2. What is their zone of comfort? (Not necessarily pleasant — just familiar)
3. What is the conscious WANT vs the unconscious NEED?

### Phase 2: Map the 8 Steps

1. **YOU** — Establish the character in their status quo
2. **NEED** — Something disrupts; a want or lack emerges
3. **GO** — The character crosses the threshold into the unfamiliar
4. **SEARCH** — Struggle, adaptation, trial and error in the new world
5. **FIND** — They get what they wanted (midpoint; the nadir; symbolic death)
6. **TAKE** — But they pay a heavy price for it
7. **RETURN** — They cross back to the familiar world
8. **CHANGE** — They are fundamentally different now

### Phase 3: Verify the Circle

1. Is there clear death and rebirth at steps 4-5-6?
2. Does Step 8 mirror but differ from Step 1?
3. Is the WANT resolved differently from the NEED?
4. Would the audience FEEL something at each step?

### Phase 4: Fractal Check (optional)

Map nested circles if applicable: scene circles within episode circles within season circles.

## Output Format

```yaml
story_circle:
  character: "{protagonist}"
  want: "{conscious desire}"
  need: "{unconscious need}"
  steps:
    you: "{status quo}"
    need: "{disruption/desire}"
    go: "{crossing threshold}"
    search: "{trials and adaptation}"
    find: "{getting what was wanted — symbolic death}"
    take: "{paying the price}"
    return: "{coming back}"
    change: "{transformed state}"
  death_rebirth: "{what dies and what is born}"
  emotional_arc: "{feeling progression}"
  theme: "{what the circle is really about}"
```

## Veto Conditions

- **NEVER** skip the death and rebirth — without it there is no transformation
- **NEVER** make Step 8 identical to Step 1 — the whole point is change
- **NEVER** confuse WANT and NEED — they must be different
- **NEVER** let structure override character truth

## Completion Criteria

- [ ] All 8 steps populated with specific content
- [ ] Death and rebirth clearly identified
- [ ] Character transformation visible from Step 1 to Step 8
- [ ] Emotional arc mapped throughout the circle
