---
task: "product-launch-narrative"
responsavel: "dan-harmon"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Product details and value proposition"
  - "Target market and launch timeline"
Saida:
  - "Complete product launch narrative using Story Circle 8 steps"
Checklist:
  - "[ ] Launch narrative follows complete Story Circle arc"
  - "[ ] Pre-launch, launch, and post-launch phases mapped to circle steps"
  - "[ ] Audience emotional journey designed for each phase"
---

# Task: Product Launch Narrative

**Task ID:** NARR-022
**Version:** 1.0.0
**Command:** `*product-launch-narrative`
**Agent:** Dan Harmon (dan-harmon)
**Purpose:** Structure a product launch as a Story Circle narrative, creating emotional momentum from teaser through post-launch.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `product` | Product name, features, value proposition | YES |
| `target_market` | Audience profile, needs, current alternatives | YES |
| `launch_timeline` | Key dates and milestones | YES |
| `brand_context` | Brand story, voice, positioning | PREFERRED |
| `competitive_landscape` | Alternatives and differentiators | NO |

## Execution Phases

### Phase 1: Map Launch to Story Circle

1. **YOU (Status Quo)** — The market as it exists today; the audience's current reality and habits
2. **NEED (Desire)** — The unmet need, frustration, or aspiration the product addresses
3. **GO (Departure)** — The teaser phase; inviting the audience into something new
4. **SEARCH (Exploration)** — Revealing features, benefits, use cases progressively
5. **FIND (Discovery)** — The "aha" moment — the core insight that makes the product click
6. **TAKE (Acquisition)** — Launch day; making the product available; the call to action
7. **RETURN (Integration)** — Post-launch; customers using the product in their real lives
8. **CHANGE (Transformation)** — The new normal; how life/work is different with the product

### Phase 2: Design Pre-Launch (Steps 1-3)

1. Craft the "status quo acknowledgment" — show you understand their world (YOU)
2. Agitate the gap — make the NEED visceral and urgent without revealing the solution
3. Design teaser content that creates curiosity without over-promising (GO)
4. Plan the "threshold moment" — when early adopters commit to learning more
5. Build anticipation mechanics: waitlists, countdown, behind-the-scenes
6. Identify the "herald" — who announces the coming change? (influencer, event, ad)

### Phase 3: Design Launch (Steps 4-6)

1. Structure the reveal sequence — progressive disclosure of features/benefits (SEARCH)
2. Design the "eureka moment" — when the audience truly gets it (FIND)
3. Create the launch event/content as a climactic narrative moment
4. Structure the offer as the natural resolution to the story's tension (TAKE)
5. Remove friction — the TAKE must feel inevitable, not forced
6. Design social proof moments that validate the decision

### Phase 4: Design Post-Launch (Steps 7-8)

1. Plan onboarding as the RETURN journey — integrating the product into daily life
2. Design "quick win" moments that reinforce the purchase decision
3. Create transformation stories from early adopters (CHANGE evidence)
4. Build community narrative — shared identity among users
5. Plan the "new status quo" content — life WITH the product as the new normal

### Phase 5: Create Narrative Timeline

1. Map each Story Circle step to specific calendar dates
2. Assign content types to each phase (email, social, video, PR, event)
3. Design emotional intensity curve across the timeline
4. Identify the 3 highest-energy moments (announce, reveal, launch day)
5. Plan the "quiet after" — post-launch narrative that sustains engagement

## Output Format

```yaml
product_launch_narrative:
  product: "{name}"
  story_circle:
    you: "{market status quo}"
    need: "{unmet need}"
    go: "{teaser/departure}"
    search: "{progressive reveal}"
    find: "{aha moment}"
    take: "{launch/acquisition}"
    return: "{integration}"
    change: "{new normal}"
  pre_launch:
    duration: "{weeks}"
    content_plan: ["{teaser content pieces}"]
    anticipation_mechanics: ["{waitlist, countdown, etc}"]
    emotional_arc: "{curiosity → desire → impatience}"
  launch:
    date: ""
    reveal_sequence: ["{progressive disclosure steps}"]
    eureka_content: "{the piece that makes it click}"
    offer_structure: "{how the TAKE is presented}"
    social_proof: ["{validation moments}"]
  post_launch:
    onboarding_narrative: "{return journey design}"
    quick_wins: ["{early success moments}"]
    transformation_stories: "{early adopter narratives}"
    community_building: "{shared identity design}"
  timeline:
    - date: ""
      circle_step: ""
      content: ""
      emotional_intensity: "[1-10]"
  peak_moments:
    - moment: "{description}"
      date: ""
      content_type: ""
```

## Veto Conditions

- **NEVER** launch without establishing the NEED — features without context are noise
- **NEVER** reveal everything at once — the SEARCH phase requires progressive disclosure
- **NEVER** treat launch day as the end — RETURN and CHANGE are essential
- **NEVER** skip the emotional design — a launch without feeling is just an announcement

## Completion Criteria

- [ ] Complete Story Circle mapped to launch phases
- [ ] Pre-launch builds genuine anticipation (not just hype)
- [ ] Launch moment designed as narrative climax
- [ ] Post-launch narrative sustains engagement and builds community
- [ ] Timeline created with emotional intensity mapped
- [ ] Content types assigned to each phase
