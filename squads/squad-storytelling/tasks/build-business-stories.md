---
task: "build-business-stories"
responsavel: "kindra-hall"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Business context (company, product, audience)"
Saida:
  - "Complete set of 4 business stories (Value, Founder, Purpose, Customer)"
Checklist:
  - "[ ] All 4 story types drafted with specific details"
  - "[ ] Each story follows Normal-Explosion-New Normal structure"
  - "[ ] Stories are 60-90 seconds when spoken aloud"
---

# Task: Build Business Stories

**Task ID:** NARR-013
**Version:** 1.0.0
**Command:** `*build-business-stories`
**Agent:** Kindra Hall (kindra-hall)
**Purpose:** Build the 4 essential business stories every company needs.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `business_context` | Company, product, mission | YES |
| `target_audiences` | Sales, marketing, leadership, HR | PREFERRED |
| `existing_stories` | Any stories currently in use | NO |
| `founder_background` | Founder's personal history | PREFERRED |

## Execution Phases

### Phase 1: Story Audit

1. Identify which of the 4 stories currently exist (even informally)
2. Assess quality: specific or generic? Structured or rambling?
3. Identify the biggest Story Gap — which missing story is costing the most?

### Phase 2: Build Each Story

For each story type, apply Normal-Explosion-New Normal:

**Value Story** (for sales):
- Normal: A real person with a real problem
- Explosion: The struggle, the pain point intensified
- New Normal: The solution (your product) transformed their reality

**Founder Story** (for trust):
- Normal: The founder's world before the insight
- Explosion: The specific moment of realization
- New Normal: The commitment born from that moment

**Purpose Story** (for culture):
- Normal: A customer/user before your company existed in their life
- Explosion: The moment your company's work made tangible human difference
- New Normal: The lasting impact, the reason the work matters

**Customer Story** (for social proof):
- Normal: The customer's world with the problem (before)
- Explosion: Discovering and choosing the solution (during)
- New Normal: The transformed reality (after)

### Phase 3: Polish for Stickiness

For each story, verify: specificity, emotion, relatability, simplicity, strategic intent.

### Phase 4: Usage Guide

Map each story to its primary use case: sales calls, website, investor meetings, team all-hands, social media.

## Output Format

```yaml
business_stories:
  story_gap_assessment: "{which gap is costing most}"
  value_story:
    normal: "{specific before state}"
    explosion: "{the struggle}"
    new_normal: "{the transformation}"
    use_case: "Sales conversations, landing pages"
    duration: "60-90 seconds"
  founder_story:
    normal: "{founder's world before}"
    explosion: "{the moment of realization}"
    new_normal: "{the commitment}"
    use_case: "About page, investor meetings, keynotes"
    duration: "60-90 seconds"
  purpose_story:
    normal: "{before impact}"
    explosion: "{the moment of impact}"
    new_normal: "{lasting difference}"
    use_case: "Team meetings, hiring, culture docs"
    duration: "60-90 seconds"
  customer_story:
    normal: "{customer before}"
    explosion: "{discovering solution}"
    new_normal: "{transformed reality}"
    use_case: "Case studies, testimonials, social proof"
    duration: "60-90 seconds"
```

## Veto Conditions

- **NEVER** write generic stories — specificity is everything
- **NEVER** skip the Normal phase — relatability requires it
- **NEVER** make the company the hero — the customer is always the hero
- **NEVER** create stories longer than 90 seconds when spoken

## Completion Criteria

- [ ] All 4 story types drafted with specific, vivid details
- [ ] Each follows Normal-Explosion-New Normal
- [ ] Stories are 60-90 seconds when spoken
- [ ] Strategic intent clear for each story
- [ ] Usage guide maps stories to business contexts
