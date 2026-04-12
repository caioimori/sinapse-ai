---
task: "build-brand-narrative"
responsavel: "park-howell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Brand/business context"
  - "Target customer profile"
Saida:
  - "Complete brand narrative with ABT and Story Cycle"
Checklist:
  - "[ ] Brand ABT defined (And, But, Therefore)"
  - "[ ] Story Cycle mapped (10 steps with customer as hero)"
  - "[ ] 5 Primal Elements verified"
---

# Task: Build Brand Narrative

**Task ID:** NARR-015
**Version:** 1.0.0
**Command:** `*build-brand-narrative`
**Agent:** Park Howell (park-howell)
**Purpose:** Build a complete brand storytelling strategy using ABT and Story Cycle System.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `brand_context` | Company, product, mission, values | YES |
| `target_customer` | Customer profile, pain points | YES |
| `competitors` | Competitive landscape | PREFERRED |
| `existing_messaging` | Current marketing copy | NO |

## Execution Phases

### Phase 1: Diagnose Current Communication

1. Is current messaging ABT or AAA?
2. Identify the "BUT" — where is the conflict/tension?
3. If AAA (And, And, And), note the narrative void

### Phase 2: Craft Brand ABT

**And:** {Context — the world your customer lives in, the status quo}
**But:** {Conflict — the problem, pain, obstacle, tension}
**Therefore:** {Resolution — how your brand resolves it, the transformation}

Test: Does this ABT make someone want to hear more?

### Phase 3: Build Story Cycle (10 Steps)

Map the customer's journey through all 10 steps:
1. Backstory — customer's world and history
2. Desire — what the customer wants
3. Resistance — obstacles in their way
4. Adventure — committing to seek a solution
5. Allies & Enemies — brand as guide, competitors as antagonist
6. Trial — the critical decision point
7. Death — old way of doing things must end
8. Rebirth — customer emerges transformed
9. Return — back to their world, but changed
10. Encore — advocacy, referrals, word of mouth

### Phase 4: Verify 5 Primal Elements

- Hero (customer) identified?
- Desire (job to be done) clear?
- Obstacle (conflict) compelling?
- Mentor (brand as guide) positioned correctly?
- Moral (transformation) evident?

### Phase 5: Application Map

Map the narrative to: website, pitch deck, social media, email sequences, sales scripts.

## Output Format

```yaml
brand_narrative:
  brand_abt:
    and: "{context/status quo}"
    but: "{conflict/tension}"
    therefore: "{resolution/transformation}"
  story_cycle:
    backstory: "{customer world}"
    desire: "{customer want}"
    resistance: "{obstacles}"
    adventure: "{commitment}"
    allies_enemies: "{brand as guide}"
    trial: "{critical decision}"
    death: "{old way dies}"
    rebirth: "{transformation}"
    return: "{changed world}"
    encore: "{advocacy}"
  primal_elements:
    hero: "{customer}"
    desire: "{job to be done}"
    obstacle: "{conflict}"
    mentor: "{brand}"
    moral: "{transformation}"
  application_map:
    website: "{how to apply}"
    pitch_deck: "{how to apply}"
    social_media: "{how to apply}"
    email: "{how to apply}"
    sales: "{how to apply}"
```

## Veto Conditions

- **NEVER** make the brand the hero — the customer is ALWAYS the hero
- **NEVER** accept AAA communication as final — convert to ABT
- **NEVER** skip the "BUT" — without conflict there is no story
- **NEVER** create a Story Cycle without a clear death/rebirth moment

## Completion Criteria

- [ ] Brand ABT defined and tested
- [ ] Story Cycle completed with all 10 steps
- [ ] 5 Primal Elements verified
- [ ] Application map created for key channels
- [ ] Customer is positioned as hero throughout
