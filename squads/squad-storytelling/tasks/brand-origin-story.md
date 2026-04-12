---
task: "brand-origin-story"
responsavel: "joseph-campbell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Brand/company background and founding context"
  - "Key moments in the brand's history"
Saida:
  - "Complete brand origin story structured as Hero's Journey"
Checklist:
  - "[ ] Founder/brand positioned as hero with clear flaw and calling"
  - "[ ] All three acts (Departure, Initiation, Return) mapped to brand history"
  - "[ ] Emotional arc creates authentic connection with audience"
---

# Task: Create Brand Origin Story

**Task ID:** NARR-018
**Version:** 1.0.0
**Command:** `*brand-origin-story`
**Agent:** Joseph Campbell (joseph-campbell)
**Purpose:** Craft a compelling brand origin story using the Hero's Journey monomyth, transforming company history into a mythically resonant narrative.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `brand_history` | Founding story, key milestones, pivotal moments | YES |
| `founder_profile` | Founder background, motivations, personal story | YES |
| `brand_values` | Core values and mission statement | YES |
| `target_audience` | Who will hear this origin story | PREFERRED |
| `existing_origin` | Current "About Us" or origin narrative | NO |

## Execution Phases

### Phase 1: Identify the Mythic Core

1. Interview/analyze the founder's personal backstory — what was their Ordinary World?
2. Identify the founding moment as Call to Adventure — what disruption sparked action?
3. Determine the founder's core flaw or wound that drove them to create the brand
4. Map the "why" behind the brand to a universal human desire or need
5. Identify which mythological archetype the founder embodies (Creator, Explorer, Rebel, etc.)

### Phase 2: Map Brand History to Departure

1. **Ordinary World** — The industry or market before the brand existed; what was broken or missing
2. **Call to Adventure** — The specific moment of insight, frustration, or vision that sparked creation
3. **Refusal of the Call** — Doubts, risks, reasons NOT to start (financial, personal, social)
4. **Supernatural Aid** — Early mentors, investors, partners, or lucky breaks
5. **Crossing the Threshold** — The irreversible commitment (quitting a job, first investment, launch)

### Phase 3: Map Brand History to Initiation

1. **Road of Trials** — Early struggles, failed products, market rejection, near-death moments
2. **Meeting with the Goddess** — The first real validation (key customer, breakthrough, press)
3. **Temptation** — Opportunities to sell out, pivot away from mission, or compromise values
4. **Atonement** — Confronting the biggest challenge (scaling, competition, internal crisis)
5. **Apotheosis** — The moment the brand became what it was meant to be
6. **Ultimate Boon** — The unique value/solution the brand now offers the world

### Phase 4: Map Brand History to Return

1. **Return with the Elixir** — How the brand's solution transforms its customers' lives
2. **Master of Two Worlds** — How the brand balances growth with original mission
3. **Freedom to Live** — The brand's vision for the future; the ongoing story

### Phase 5: Craft the Narrative

1. Write the origin story in 3 versions: long-form (1500+ words), medium (500 words), micro (100 words)
2. Identify the single most powerful sentence — the "mythic hook"
3. Ensure the customer can see themselves in the story (they share the hero's values)
4. Test emotional resonance: Does it inspire? Create empathy? Build trust?
5. Map deployment: About page, pitch deck, keynote, social media, packaging

## Output Format

```yaml
brand_origin_story:
  mythic_core:
    archetype: "{founder archetype}"
    universal_desire: "{human need the brand addresses}"
    core_wound: "{founder's driving flaw or frustration}"
  departure:
    ordinary_world: "{pre-brand status quo}"
    call_to_adventure: "{founding moment}"
    refusal: "{doubts and risks}"
    supernatural_aid: "{early helpers}"
    threshold_crossing: "{point of no return}"
  initiation:
    road_of_trials: "{early struggles}"
    validation_moment: "{first real win}"
    temptation: "{compromise opportunities}"
    atonement: "{biggest challenge faced}"
    apotheosis: "{becoming what was meant to be}"
    boon: "{unique value created}"
  return:
    elixir: "{transformation offered to customers}"
    master_of_worlds: "{mission vs growth balance}"
    freedom_to_live: "{future vision}"
  narrative_versions:
    long_form: "{1500+ word origin story}"
    medium: "{500 word version}"
    micro: "{100 word version}"
  mythic_hook: "{single most powerful sentence}"
  deployment_map:
    about_page: "{adaptation notes}"
    pitch_deck: "{adaptation notes}"
    keynote: "{adaptation notes}"
    social_media: "{adaptation notes}"
```

## Veto Conditions

- **NEVER** invent or fabricate events — mythic framing must honor actual history
- **NEVER** make the brand story about the product — it is about the human journey
- **NEVER** skip the struggle — without trials, the origin story lacks credibility
- **NEVER** create a sterile corporate timeline — this is a STORY, not a chronology

## Completion Criteria

- [ ] Founder/brand positioned as hero with identifiable flaw and calling
- [ ] All three acts mapped to actual brand history with mythic framing
- [ ] Three narrative versions created (long, medium, micro)
- [ ] Mythic hook sentence identified
- [ ] Emotional arc tested for inspiration, empathy, and trust
- [ ] Deployment map created for key channels
