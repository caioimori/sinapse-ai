---
task: "brand-storytelling-strategy"
responsavel: "kindra-hall"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Brand context, values, and positioning"
  - "Target audience profiles"
Saida:
  - "Complete brand storytelling strategy with 4 story types and Story Gap analysis"
Checklist:
  - "[ ] All 4 story types (Value, Founder, Purpose, Customer) developed"
  - "[ ] Story Gap identified and bridge narrative designed"
  - "[ ] Story bank created with 10+ ready-to-deploy stories"
---

# Task: Brand Storytelling Strategy

**Task ID:** NARR-034
**Version:** 1.0.0
**Command:** `*brand-storytelling-strategy`
**Agent:** Kindra Hall (kindra-hall)
**Purpose:** Build a complete brand storytelling strategy using Hall's four story types and Story Gap methodology from Stories That Stick.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `brand_context` | Company, products, mission, values | YES |
| `audience` | Primary and secondary audience profiles | YES |
| `current_messaging` | Existing marketing copy and narratives | PREFERRED |
| `business_goals` | What storytelling should achieve (awareness, trust, conversion) | PREFERRED |
| `competitors` | How competitors tell their stories | NO |

## Execution Phases

### Phase 1: Diagnose the Story Gap

1. Identify the gap between what the brand BELIEVES about itself and what the AUDIENCE perceives
2. Map the "story gap" — the space where the brand's message is not landing
3. Assess current messaging: Is it telling stories or just stating facts?
4. Identify where stories are missing in the customer journey (awareness, consideration, decision, retention)
5. Determine the emotional connection deficit — what feelings are absent?
6. Define what "bridging the gap" looks like — the measurable outcome

### Phase 2: Develop the Value Story

1. The Value Story answers: "What's in it for me?" (the customer's question)
2. Identify the core value the product/service delivers — not features, but transformation
3. Structure: Normal → Explosion (problem) → New Normal (with your product)
4. Create 3 Value Stories from different angles:
   - Functional value (saves time, money, effort)
   - Emotional value (reduces anxiety, increases confidence)
   - Social value (improves status, belonging, identity)
5. Test each story: Does it make the audience say "I want that"?

### Phase 3: Develop the Founder Story

1. The Founder Story answers: "Why should I trust you?"
2. Find the founder's defining moment — when they became the person who HAD to create this
3. Structure: Normal (before the insight) → Explosion (the catalytic moment) → New Normal (the company born)
4. Ensure vulnerability is present — perfection kills trust
5. Connect the founder's "why" to the customer's "why"

### Phase 4: Develop the Purpose Story

1. The Purpose Story answers: "Why does this company exist beyond profit?"
2. Identify the bigger mission — what change does the brand want to create in the world?
3. Structure: Normal (the world's problem) → Explosion (why this matters now) → New Normal (the world with your mission fulfilled)
4. Connect purpose to daily actions — not just a mission statement but a lived narrative
5. Find examples of the purpose in action (community impact, team decisions, product choices)

### Phase 5: Develop the Customer Story

1. The Customer Story answers: "Can this work for someone like me?"
2. Collect and structure real customer narratives using:
   - Normal: Life before discovering the product
   - Explosion: The problem that drove them to search
   - New Normal: Life after using the product
3. Create 5 Customer Stories spanning different personas and use cases
4. Ensure diversity of contexts — different industries, sizes, challenges
5. Make the customer the hero — the brand is the tool, not the protagonist

### Phase 6: Build the Story Bank

1. Compile all stories into a categorized story bank
2. Tag each story by: type, audience, funnel stage, channel, emotional tone
3. Create "story starters" — prompts for gathering more stories from team and customers
4. Design the story collection process — ongoing, not one-time
5. Create deployment guidelines: which story type works best where

## Output Format

```yaml
brand_storytelling_strategy:
  story_gap:
    brand_belief: "{what the brand thinks about itself}"
    audience_perception: "{what the audience actually thinks}"
    gap: "{the disconnect}"
    bridge: "{how storytelling closes the gap}"
  value_stories:
    - angle: "{functional/emotional/social}"
      normal: "{before state}"
      explosion: "{problem}"
      new_normal: "{transformation with product}"
  founder_story:
    defining_moment: "{catalytic event}"
    vulnerability: "{honest struggle}"
    connection_to_customer: "{shared why}"
    narrative: "{the story}"
  purpose_story:
    mission: "{bigger change}"
    narrative: "{the story}"
    purpose_in_action: ["{concrete examples}"]
  customer_stories:
    - persona: "{who}"
      normal: "{before}"
      explosion: "{problem}"
      new_normal: "{after}"
  story_bank:
    total_stories: 0
    by_type: {value: 0, founder: 0, purpose: 0, customer: 0}
    deployment_guide:
      awareness: ["{which stories}"]
      consideration: ["{which stories}"]
      decision: ["{which stories}"]
      retention: ["{which stories}"]
  collection_process: "{how to gather ongoing stories}"
```

## Veto Conditions

- **NEVER** create stories without the Normal → Explosion → New Normal structure
- **NEVER** skip vulnerability in the Founder Story — polish kills authenticity
- **NEVER** make the brand the hero in Customer Stories — the customer is always the hero
- **NEVER** treat the story bank as a one-time project — it must be a living system

## Completion Criteria

- [ ] Story Gap diagnosed with clear bridge narrative
- [ ] All 4 story types developed with multiple variations
- [ ] Story bank created with 10+ stories tagged and categorized
- [ ] Deployment guide maps stories to funnel stages and channels
- [ ] Story collection process designed for ongoing gathering
- [ ] Each story tested for emotional resonance and audience relevance
