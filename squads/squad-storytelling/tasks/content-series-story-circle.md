---
task: "content-series-story-circle"
responsavel: "dan-harmon"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Content series theme or topic"
  - "Platform and audience context"
Saida:
  - "Complete content series plan structured with Story Circle for each episode"
Checklist:
  - "[ ] Series arc mapped with overarching Story Circle"
  - "[ ] Each episode structured with its own 8-step circle"
  - "[ ] Fractal narrative maintains coherence across episodes"
---

# Task: Plan Content Series Using Story Circle

**Task ID:** NARR-021
**Version:** 1.0.0
**Command:** `*content-series-story-circle`
**Agent:** Dan Harmon (dan-harmon)
**Purpose:** Plan a multi-episode content series using Story Circle structure, ensuring each piece works standalone while contributing to a larger narrative arc.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `series_theme` | Overarching topic or message | YES |
| `episode_count` | Number of content pieces planned | YES |
| `platform` | Blog, podcast, video, social, newsletter | YES |
| `audience` | Target audience profile | YES |
| `brand_voice` | Tone and style guidelines | PREFERRED |
| `call_to_action` | What the series should ultimately drive | NO |

## Execution Phases

### Phase 1: Design the Macro Story Circle (Series Arc)

1. **YOU** — Where is the audience right now? (their comfort zone, current beliefs)
2. **NEED** — What gap or desire will the series address?
3. **GO** — What unfamiliar territory will the series take them into?
4. **SEARCH** — What will they explore across episodes?
5. **FIND** — What is the central insight or revelation of the series?
6. **TAKE** — What do they gain? (skill, perspective, tool)
7. **RETURN** — How do they come back to their world, changed?
8. **CHANGE** — What is different about them after consuming the series?

### Phase 2: Design Episode Arcs (Micro Circles)

For each episode, create an individual Story Circle:
1. Map the episode's own YOU → CHANGE cycle
2. Ensure each episode delivers a complete satisfying arc
3. Identify the "hook" (first 10% of content that establishes YOU and NEED)
4. Identify the "midpoint reversal" (FIND moment — the insight)
5. Design the "return gift" (TAKE — actionable takeaway)
6. Create the cliffhanger or bridge to next episode (maintaining series tension)

### Phase 3: Design Fractal Coherence

1. Map how each episode's micro-circle nests within the macro-circle
2. Identify which macro-stage each episode serves (early episodes = GO/SEARCH, later = FIND/TAKE)
3. Ensure progressive deepening — each episode builds on previous understanding
4. Design recurring motifs or callbacks that create series cohesion
5. Plan the "dark night" episode (the one that challenges everything established so far)

### Phase 4: Create Episode Outlines

For each episode, document:
1. Title and hook (compelling reason to consume)
2. Story Circle mapping (all 8 steps)
3. Key content points and teaching moments
4. Emotional journey of the episode
5. Bridge to next episode
6. Standalone value (what someone gets if they only see this one)

### Phase 5: Design Series Mechanics

1. Plan the release cadence and build anticipation mechanics
2. Design the "previously on" recaps for continuity
3. Create engagement prompts that invite audience into the story
4. Plan the series finale — the ultimate CHANGE moment
5. Design post-series content (the "encore" — what comes after transformation)

## Output Format

```yaml
content_series_plan:
  series_title: "{title}"
  theme: "{overarching message}"
  platform: "{where it lives}"
  episode_count: 0
  macro_story_circle:
    you: "{audience starting point}"
    need: "{gap or desire}"
    go: "{unfamiliar territory}"
    search: "{exploration theme}"
    find: "{central revelation}"
    take: "{what they gain}"
    return: "{coming back changed}"
    change: "{transformed state}"
  episodes:
    - number: 1
      title: "{episode title}"
      macro_stage: "{which macro step this serves}"
      micro_circle:
        you: "{episode starting point}"
        need: "{episode gap}"
        go: "{episode exploration}"
        search: "{episode search}"
        find: "{episode insight}"
        take: "{episode takeaway}"
        return: "{episode return}"
        change: "{episode change}"
      hook: "{opening hook}"
      key_content: ["{main points}"]
      emotional_journey: "{feeling progression}"
      bridge_to_next: "{connection to next episode}"
  fractal_map: "{how episodes nest in macro arc}"
  recurring_motifs: ["{callbacks and patterns}"]
  release_cadence: "{schedule}"
  engagement_prompts: ["{audience participation hooks}"]
```

## Veto Conditions

- **NEVER** create episodes that only work in sequence — each must deliver standalone value
- **NEVER** skip the NEED step — without it, content is information, not story
- **NEVER** front-load all insights — the FIND should land at the right moment
- **NEVER** forget the CHANGE — every episode must leave the audience slightly different

## Completion Criteria

- [ ] Macro Story Circle designed for complete series arc
- [ ] Each episode has its own micro Story Circle
- [ ] Fractal coherence verified (episodes nest within macro arc)
- [ ] Episode outlines include hooks, bridges, and standalone value
- [ ] Series mechanics designed (cadence, recaps, engagement)
- [ ] Finale delivers on the macro CHANGE promise
