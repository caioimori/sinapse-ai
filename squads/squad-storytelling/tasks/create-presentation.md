---
task: "create-presentation"
responsavel: "nancy-duarte"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Presentation topic"
  - "Target audience"
Saida:
  - "Complete Sparkline presentation structure"
Checklist:
  - "[ ] Audience profiled with current beliefs and resistance mapped"
  - "[ ] Sparkline structure created with alternating contrasts"
  - "[ ] S.T.A.R. moment designed and call to action defined"
---

# Task: Create Presentation Narrative

**Task ID:** NARR-011
**Version:** 1.0.0
**Command:** `*create-presentation`
**Agent:** Nancy Duarte (nancy-duarte)
**Purpose:** Design a presentation narrative using the Sparkline methodology (What Is / What Could Be).

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `presentation_topic` | User prompt | YES |
| `audience` | Who will attend | YES |
| `desired_action` | What audience should do after | YES |
| `key_data` | Supporting facts, metrics | PREFERRED |
| `duration` | Time available | NO (default: 20 min) |

## Execution Phases

### Phase 1: Audience Analysis

1. Profile the audience — role, knowledge level, concerns, motivations
2. Identify current belief vs desired belief
3. Map resistance points
4. Define the one key takeaway
5. Determine emotional journey: start → end

### Phase 2: Craft Big Idea

One sentence: subject + verb + unique POV + emotion + stakes.

### Phase 3: Build Sparkline

1. **Opening (What Is)** — Current reality, shared experience, pain
2. **First Contrast (What Could Be)** — The possibility, concrete terms
3. **Toggle 3-5 times** — Each round raises stakes, layers evidence
4. **S.T.A.R. Moment** — The unforgettable peak (dramatization, sound bite, visual, story, or statistic)
5. **Call to Action** — Specific, achievable, immediate
6. **New Bliss** — Vivid vision of the transformed world

### Phase 4: Visual & Delivery Notes

For each section: slide concept, timing, delivery mode (quiet/loud, analytical/emotional).

## Output Format

```yaml
presentation:
  topic: "{topic}"
  audience: "{who}"
  big_idea: "{one sentence}"
  desired_action: "{what audience does}"
  duration: "{time}"
  sparkline:
    - section: "Opening — What Is"
      content: "{description}"
      visual: "{slide concept}"
      duration: "{time}"
    # ... alternating sections
    - section: "S.T.A.R. Moment"
      content: "{the unforgettable moment}"
      type: "{dramatization|sound_bite|visual|story|statistic}"
    - section: "Call to Action"
      content: "{specific ask}"
    - section: "New Bliss"
      content: "{transformed future}"
  closing_statement: "{resonant ending}"
```

## Veto Conditions

- **NEVER** start with an agenda slide — open with story or striking data
- **NEVER** present all "what is" then all "what could be" — alternate them
- **NEVER** skip the S.T.A.R. moment
- **NEVER** end without a clear call to action
- **NEVER** let data replace story — use both

## Completion Criteria

- [ ] Audience profiled with resistance mapped
- [ ] Big Idea crafted as one sentence
- [ ] Sparkline structure with alternating contrasts
- [ ] S.T.A.R. moment designed
- [ ] Call to action is concrete and achievable
- [ ] New Bliss paints a compelling transformed future
