---
task: "customer-journey-narrative"
responsavel: "joseph-campbell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Customer persona and journey stages"
  - "Product/service context"
Saida:
  - "Customer journey mapped as Hero's Journey with narrative touchpoints"
Checklist:
  - "[ ] Customer positioned as hero throughout the journey"
  - "[ ] Each journey stage mapped to monomyth stage"
  - "[ ] Emotional arc designed for each touchpoint"
---

# Task: Map Customer Journey as Hero's Journey

**Task ID:** NARR-019
**Version:** 1.0.0
**Command:** `*customer-journey-narrative`
**Agent:** Joseph Campbell (joseph-campbell)
**Purpose:** Transform a standard customer journey map into a mythically structured Hero's Journey, creating deeper emotional resonance at every touchpoint.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `customer_persona` | Detailed customer profile with goals and pain points | YES |
| `journey_stages` | Existing customer journey map or funnel stages | YES |
| `product_service` | What the brand offers | YES |
| `touchpoints` | Current marketing/sales touchpoints | PREFERRED |
| `competitors` | Alternative solutions the customer considers | NO |

## Execution Phases

### Phase 1: Define the Customer-Hero

1. Identify the customer's Ordinary World — their daily reality before encountering the brand
2. Name the customer's core desire (conscious) and deeper need (unconscious)
3. Identify the customer's flaw or limiting belief that keeps them stuck
4. Map the customer's fears — what they risk by taking action (and by NOT taking action)
5. Define what "transformation" looks like — who they become after the journey

### Phase 2: Map Awareness Stage to Departure

1. **Ordinary World** → Pre-awareness: Customer lives with the problem, unaware of solutions
2. **Call to Adventure** → Trigger event: What makes them start searching? (pain spike, peer influence, ad)
3. **Refusal of the Call** → Objections: Why they hesitate (cost, effort, skepticism, past failures)
4. **Supernatural Aid** → First helpful content: Blog post, recommendation, review that opens their eyes
5. **Crossing the Threshold** → Engagement: First meaningful brand interaction (sign-up, demo, visit)

### Phase 3: Map Consideration Stage to Initiation

1. **Road of Trials** → Research phase: Comparing options, reading reviews, testing alternatives
2. **Meeting with the Goddess** → "Aha" moment: When they realize this solution could truly work
3. **Temptation** → Competitor pull: Cheaper, easier, or more familiar alternatives
4. **Atonement** → Commitment decision: Confronting the real cost/effort of change
5. **Apotheosis** → Purchase decision: The moment of clarity and commitment

### Phase 4: Map Post-Purchase to Return

1. **Boon** → Product/service delivery: Receiving the promised transformation
2. **Return** → Integration: Using the product in their daily life
3. **Master of Two Worlds** → Success realization: Achieving the desired outcome
4. **Freedom to Live** → Advocacy: Sharing the experience, becoming a brand evangelist

### Phase 5: Design Narrative Touchpoints

1. For each journey stage, define the emotional state and narrative need
2. Design content/messaging that matches the mythic moment (not just the funnel stage)
3. Identify "threshold guardian" moments — friction points that test commitment
4. Create mentor moments — where the brand guides without selling
5. Design the "elixir moment" — the post-purchase content that celebrates transformation
6. Map the "encore" — how to turn customers into storytellers

## Output Format

```yaml
customer_journey_narrative:
  customer_hero:
    persona: "{who they are}"
    ordinary_world: "{daily reality}"
    conscious_desire: "{what they want}"
    unconscious_need: "{what they truly need}"
    limiting_belief: "{what keeps them stuck}"
    transformation: "{who they become}"
  journey_mapping:
    departure:
      - stage: "{awareness}"
        mythic_moment: "{Call to Adventure}"
        emotional_state: "{curiosity, frustration}"
        narrative_need: "{validation of the problem}"
        touchpoint: "{content type and message}"
    initiation:
      - stage: "{consideration}"
        mythic_moment: "{Road of Trials}"
        emotional_state: "{uncertainty, hope}"
        narrative_need: "{proof and guidance}"
        touchpoint: "{content type and message}"
    return:
      - stage: "{post-purchase}"
        mythic_moment: "{Return with Elixir}"
        emotional_state: "{confidence, pride}"
        narrative_need: "{celebration and belonging}"
        touchpoint: "{content type and message}"
  threshold_guardians: ["{friction points and how to address them}"]
  mentor_moments: ["{non-selling guidance touchpoints}"]
  elixir_moment: "{post-purchase transformation celebration}"
  advocacy_design: "{how customers become storytellers}"
```

## Veto Conditions

- **NEVER** reduce the customer to a "lead" or "conversion" — they are the HERO
- **NEVER** skip the Refusal of the Call — objections are narratively essential
- **NEVER** ignore the emotional dimension of each stage
- **NEVER** make the brand the hero — the brand is the mentor/guide

## Completion Criteria

- [ ] Customer positioned as hero with clear desire, flaw, and transformation
- [ ] Every funnel stage mapped to a specific monomyth moment
- [ ] Emotional arc designed for each touchpoint
- [ ] Threshold guardians and mentor moments identified
- [ ] Advocacy/storyteller conversion designed
- [ ] Narrative touchpoint content recommendations provided
