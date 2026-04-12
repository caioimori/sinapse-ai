---
task: "write-manifesto"
responsavel: "marshall-ganz"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Movement, brand, or cause description"
  - "Core values"
Saida:
  - "Complete manifesto using Public Narrative (Self, Us, Now)"
Checklist:
  - "[ ] Story of Self crafted with authentic personal origin"
  - "[ ] Story of Us builds shared identity and belonging"
  - "[ ] Manifesto text woven with rallying cry"
---

# Task: Write Movement/Brand Manifesto

**Task ID:** NARR-018
**Version:** 1.0.0
**Command:** `*write-manifesto`
**Agent:** Marshall Ganz (marshall-ganz)
**Purpose:** Create a powerful manifesto using the Public Narrative framework (Story of Self, Us, Now).

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `movement_or_brand` | User description | YES |
| `core_values` | User specification | YES |
| `target_community` | Who this is for | YES |
| `urgency_trigger` | Why now? | PREFERRED |
| `founder_story` | Personal origin narrative | PREFERRED |
| `enemy_or_obstacle` | What the movement opposes | NO |

## Execution Phases

### Phase 1: Story of Self

1. Identify the personal origin — what experience created the commitment?
2. Find the choice point — the moment that changed everything
3. Define the values expressed — what did the choice reveal?
4. Craft the narrative — specific, vivid, emotionally honest
5. Connect personal story to universal human experience
6. Test: Does this answer "Why do I care?" authentically?

### Phase 2: Story of Us

1. Identify shared experiences — what does this community have in common?
2. Define shared values — what does this group believe together?
3. Find the collective challenge — what obstacle unites us?
4. Craft moments of "we" — individual stories become communal identity
5. Build belonging — the reader feels part of something larger
6. Test: Does this answer "Why should WE care?" compellingly?

### Phase 3: Story of Now

1. Define the urgent challenge — what demands action right now?
2. Articulate the choice — what must we decide, and what are the stakes?
3. Create tension between hope and fear
4. Issue the call to action — specific, achievable, immediate
5. Paint the future — what does the world look like when we succeed?
6. Test: Does this answer "What must we do NOW?" with urgency?

### Phase 4: Manifesto Draft

1. Weave all three stories into a cohesive document
2. Open with a bold declaration — core belief stated without apology
3. Build from personal to collective to urgent
4. Use short, punchy sentences — meant to be spoken aloud
5. Include the enemy or obstacle — what we stand against
6. Close with a rallying cry — the sentence people will repeat
7. Review for emotional power — every paragraph moves the reader
8. Test readability — read aloud, check rhythm and cadence

## Output Format

```yaml
manifesto:
  title: "{manifesto title}"
  movement_or_brand: "{name}"
  core_values: ["{values}"]
  target_community: "{audience}"
  story_of_self:
    origin: "{personal story}"
    choice_point: "{the moment}"
    values_expressed: ["{values revealed}"]
  story_of_us:
    shared_experience: "{what unites us}"
    shared_values: ["{collective beliefs}"]
    collective_challenge: "{our obstacle}"
  story_of_now:
    urgent_challenge: "{why now}"
    the_choice: "{what we must decide}"
    call_to_action: "{specific action}"
    future_vision: "{the world we create}"
  manifesto_text: |
    {The full manifesto text}
  rallying_cry: "{the one sentence people will repeat}"
```

## Veto Conditions

- **NEVER** write a manifesto without genuine emotional truth
- **NEVER** skip Story of Self — personal authenticity is the foundation
- **NEVER** issue a call to action without defining what success looks like
- **NEVER** create division through hatred — oppose ideas, not people
- **NEVER** write a manifesto that could not be read aloud with conviction

## Completion Criteria

- [ ] Story of Self crafted with authentic personal origin
- [ ] Story of Us builds shared identity and belonging
- [ ] Story of Now creates urgency and defines the choice
- [ ] All three stories woven into cohesive manifesto
- [ ] Bold opening declaration established
- [ ] Clear call to action with specific next steps
- [ ] Rallying cry crafted for memorability
- [ ] Manifesto reads powerfully when spoken aloud
