---
task: "map-heros-journey"
responsavel: "joseph-campbell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Story concept, situation, or existing narrative"
Saida:
  - "Complete Hero's Journey mapping (17 stages)"
Checklist:
  - "[ ] All 17 stages mapped with specific content"
  - "[ ] Archetypes identified and assigned"
  - "[ ] Emotional arc coherent from Departure through Return"
---

# Task: Map the Hero's Journey

**Task ID:** NARR-003
**Version:** 1.0.0
**Command:** `*map-heros-journey`
**Agent:** Joseph Campbell (joseph-campbell)
**Purpose:** Map any story, situation, or concept to the complete 17-stage Hero's Journey monomyth.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `story_concept` | User prompt or existing narrative | YES |
| `context` | Business, personal, literary, or educational | PREFERRED |
| `depth` | Overview (12 stages) or full (17 stages) | NO (default: full) |

## Execution Phases

### Phase 1: Identify the Hero and the World

1. Who is the hero? (person, brand, community, character)
2. What is the Ordinary World? (the status quo before transformation)
3. What is the hero's flaw or incompleteness?
4. What is the ultimate boon the hero seeks (even if unconsciously)?

### Phase 2: Map the Departure (Act 1)

1. **Call to Adventure** — What disrupts the ordinary world?
2. **Refusal of the Call** — What fear or attachment holds the hero back?
3. **Supernatural Aid** — Who or what provides guidance?
4. **Crossing the First Threshold** — What marks the point of no return?
5. **Belly of the Whale** — How does the old self symbolically die?

### Phase 3: Map the Initiation (Act 2)

1. **Road of Trials** — What tests does the hero face?
2. **Meeting with the Goddess** — What encounter with beauty/love/power occurs?
3. **Woman as Temptress** — What tempts the hero to abandon the quest?
4. **Atonement with the Father** — What ultimate power must be confronted?
5. **Apotheosis** — How does the hero transcend their limited self?
6. **Ultimate Boon** — What is the prize, knowledge, or elixir gained?

### Phase 4: Map the Return (Act 3)

1. **Refusal of Return** — Why might the hero resist returning?
2. **Magic Flight** — What chase or escape occurs?
3. **Rescue from Without** — Does the hero need external help to return?
4. **Crossing the Return Threshold** — How is the wisdom integrated into daily life?
5. **Master of Two Worlds** — How does the hero balance both worlds?
6. **Freedom to Live** — What does the transformed life look like?

### Phase 5: Identify Archetypes

Map each character/force to an archetype: Hero, Mentor, Threshold Guardian, Herald, Shapeshifter, Shadow, Trickster, Allies.

## Output Format

```yaml
heros_journey:
  hero: "{who}"
  ordinary_world: "{status quo}"
  core_flaw: "{incompleteness}"
  ultimate_boon: "{what is sought}"
  departure:
    call_to_adventure: "{description}"
    refusal_of_call: "{description}"
    supernatural_aid: "{description}"
    crossing_threshold: "{description}"
    belly_of_whale: "{description}"
  initiation:
    road_of_trials: "{description}"
    meeting_goddess: "{description}"
    temptress: "{description}"
    atonement: "{description}"
    apotheosis: "{description}"
    ultimate_boon: "{description}"
  return:
    refusal_of_return: "{description}"
    magic_flight: "{description}"
    rescue_from_without: "{description}"
    crossing_return: "{description}"
    master_two_worlds: "{description}"
    freedom_to_live: "{description}"
  archetypes:
    - character: "{name}"
      archetype: "{type}"
      role: "{function in the journey}"
  emotional_arc: "{description of the feeling progression}"
  mythic_resonance: "{which mythological traditions this echoes}"
```

## Veto Conditions

- **NEVER** force all 17 stages if the story genuinely skips some — note which are absent and why
- **NEVER** treat the monomyth as prescriptive formula — it is descriptive of universal patterns
- **NEVER** ignore the emotional/psychological dimension in favor of plot mechanics
- **NEVER** elevate one cultural tradition over another when drawing parallels

## Completion Criteria

- [ ] All applicable stages mapped with specific content
- [ ] Archetypes identified and assigned to characters/forces
- [ ] Emotional arc is coherent from Departure through Return
- [ ] Mythic parallels noted where relevant
- [ ] Hero's transformation is clear and earned
