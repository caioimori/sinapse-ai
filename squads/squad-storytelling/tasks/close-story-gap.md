---
task: "close-story-gap"
responsavel: "kindra-hall"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Current business communication or marketing"
Saida:
  - "Story Gap diagnosis with bridge stories"
Checklist:
  - "[ ] Current story identified (what is being told)"
  - "[ ] Desired story identified (what should be told)"
  - "[ ] Gap measured and bridge story crafted"
---

# Task: Close the Story Gap

**Task ID:** NARR-014
**Version:** 1.0.0
**Command:** `*close-story-gap`
**Agent:** Kindra Hall (kindra-hall)
**Purpose:** Diagnose the Story Gap in business communication and craft bridge stories to close it.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `current_communication` | Website copy, sales scripts, presentations | YES |
| `target_audience` | Who you're trying to reach | YES |
| `business_goals` | What outcomes you want | PREFERRED |

## Execution Phases

### Phase 1: Diagnose Current Story

1. What story are customers telling themselves about you RIGHT NOW?
2. What story is your marketing/sales currently telling?
3. Where are you relying on data/features instead of narrative?

### Phase 2: Define Desired Story

1. What story do you WANT customers to tell?
2. What emotional response do you want to create?
3. What action should the story drive?

### Phase 3: Measure the Gap

1. How far apart are the current and desired stories?
2. What is the gap costing? (lost sales, low engagement, weak culture)
3. Which of the 4 story types would best bridge this gap?

### Phase 4: Craft Bridge Stories

Create 1-3 stories specifically designed to close the gap, using Normal-Explosion-New Normal.

## Veto Conditions

- **NEVER** assume the business doesn't have a Story Gap
- **NEVER** close the gap with more data — stories bridge emotional gaps
- **NEVER** create bridge stories without specificity

## Completion Criteria

- [ ] Current story clearly identified
- [ ] Desired story articulated
- [ ] Gap measured with cost assessment
- [ ] 1-3 bridge stories crafted with structure
- [ ] Implementation recommendations provided
