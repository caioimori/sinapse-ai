---
task: "community-narrative-design"
responsavel: "dan-harmon"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Community context (brand, movement, or group)"
  - "Community goals and values"
Saida:
  - "Complete community narrative framework with shared story and rituals"
Checklist:
  - "[ ] Community origin story crafted with Story Circle structure"
  - "[ ] Shared narrative elements defined (language, rituals, milestones)"
  - "[ ] Member journey mapped as recurring Story Circle"
---

# Task: Build Community Narrative

**Task ID:** NARR-023
**Version:** 1.0.0
**Command:** `*community-narrative-design`
**Agent:** Dan Harmon (dan-harmon)
**Purpose:** Design the narrative architecture of a community using Story Circle, creating shared stories, rituals, and identity that bind members together.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `community_context` | Brand, movement, cause, or interest group | YES |
| `community_values` | Core beliefs and shared principles | YES |
| `member_profile` | Who the community members are | YES |
| `community_goals` | What the community aims to achieve together | PREFERRED |
| `existing_narrative` | Current community story or messaging | NO |

## Execution Phases

### Phase 1: Design the Community Origin Story

1. Apply Story Circle to the community's founding moment:
   - YOU: The world before this community existed
   - NEED: What was missing? What gap or injustice sparked creation?
   - GO: The founding act — who decided to build something different?
   - SEARCH: Early struggles, finding members, defining identity
   - FIND: The moment the community discovered what it truly was
   - TAKE: The core value or insight the community now carries
   - RETURN: How the community began changing the world around it
   - CHANGE: What is different because this community exists?
2. Identify the "founding myth" — the story members retell to each other
3. Define the community's "enemy" or "antagonist" (a problem, not a person)

### Phase 2: Design Shared Narrative Elements

1. **Sacred language** — Terms, phrases, inside jokes that only members understand
2. **Origin rituals** — How new members are welcomed (initiation story)
3. **Milestone celebrations** — How achievements are narratively framed
4. **Conflict resolution narrative** — How disagreements are understood within the story
5. **Shared symbols** — Visual or verbal shortcuts that invoke the community story
6. Define the community's "we believe" statement — the narrative manifesto

### Phase 3: Map the Member Journey

1. Design the individual member's Story Circle within the community:
   - YOU: Life before joining
   - NEED: What drew them to seek this community
   - GO: First interaction, lurking, tentative engagement
   - SEARCH: Deepening involvement, finding their place
   - FIND: The "belonging moment" — when they feel truly part of it
   - TAKE: What they contribute and receive
   - RETURN: How membership changes their life outside the community
   - CHANGE: Their identity shift — "I am a [community member]"
2. Identify the key transition points where members might disengage
3. Design narrative interventions for each potential drop-off point

### Phase 4: Create Narrative Rituals

1. **Weekly/recurring rituals** — Content, events, or practices that reinforce the story
2. **Seasonal arcs** — Larger narrative cycles (quarterly themes, annual events)
3. **Member spotlight format** — How individual stories are shared and celebrated
4. **Challenge narratives** — How the community frames and overcomes obstacles together
5. **Legacy stories** — How departing members are honored and remembered

### Phase 5: Design Narrative Governance

1. Define who can tell the community's story and how (brand, leaders, any member)
2. Create story guidelines — what is on-brand and what is not
3. Design the "story collection" process — how member stories are gathered
4. Plan narrative evolution — how the community story grows without losing its core
5. Define the "North Star narrative" — the story that will still be told in 10 years

## Output Format

```yaml
community_narrative:
  community: "{name}"
  origin_story:
    story_circle: {you, need, go, search, find, take, return, change}
    founding_myth: "{retellable origin story}"
    antagonist: "{the problem the community fights}"
  shared_elements:
    sacred_language: ["{terms and phrases}"]
    we_believe: "{manifesto statement}"
    symbols: ["{visual and verbal markers}"]
  member_journey:
    story_circle: {you, need, go, search, find, take, return, change}
    belonging_moment: "{when they feel 'in'}"
    identity_shift: "{who they become}"
    drop_off_points: ["{risk moments and narrative interventions}"]
  rituals:
    recurring: ["{weekly/monthly practices}"]
    seasonal_arcs: ["{quarterly/annual narrative themes}"]
    member_spotlight: "{format for sharing individual stories}"
    challenges: "{how obstacles are framed}"
    legacy: "{how departures are honored}"
  governance:
    storytellers: "{who can tell the story}"
    guidelines: "{what is on-brand}"
    collection_process: "{how stories are gathered}"
    north_star: "{the enduring story}"
```

## Veto Conditions

- **NEVER** design community narrative without member input or empathy — top-down stories ring hollow
- **NEVER** create an "us vs them" narrative that targets people — target problems
- **NEVER** make the brand the center — the community and its members are the heroes
- **NEVER** design static narratives — communities evolve and the story must breathe

## Completion Criteria

- [ ] Community origin story crafted with complete Story Circle
- [ ] Shared narrative elements defined (language, symbols, manifesto)
- [ ] Member journey mapped as individual Story Circle
- [ ] Drop-off points identified with narrative interventions
- [ ] Rituals designed for recurring engagement
- [ ] Narrative governance established
