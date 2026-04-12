---
task: "website-narrative-audit"
responsavel: "park-howell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Website URL or copy"
  - "Brand context and target customer"
Saida:
  - "Complete narrative audit with SB7 gap analysis and rewrite recommendations"
Checklist:
  - "[ ] Every page audited against SB7 framework"
  - "[ ] AAA vs ABT patterns identified throughout copy"
  - "[ ] Specific rewrite recommendations with before/after examples"
---

# Task: Website Narrative Audit

**Task ID:** NARR-040
**Version:** 1.0.0
**Command:** `*website-narrative-audit`
**Agent:** Park Howell (park-howell)
**Purpose:** Audit website copy through the SB7 and ABT lens, identifying where the narrative breaks down and providing specific rewrite recommendations.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `website` | URL or copy from key pages | YES |
| `brand_context` | What the brand does and who it serves | YES |
| `target_customer` | Customer profile and pain points | YES |
| `business_goal` | What the website should achieve | PREFERRED |
| `brandscript` | Existing BrandScript (if available) | NO |

## Execution Phases

### Phase 1: AAA vs ABT Diagnosis

1. Read ALL website copy and classify each section:
   - **AAA (And, And, And)** — "We do this AND this AND this" (boring, no conflict)
   - **ABT (And, But, Therefore)** — "The world is X, BUT Y is a problem, THEREFORE we Z" (story)
   - **DHY (Despite, However, Yet)** — Contradiction that confuses the reader
2. Calculate the AAA ratio — what percentage of copy is non-narrative?
3. Identify the biggest "narrative void" — where is the story most needed?
4. Flag jargon and insider language that distances the customer

### Phase 2: SB7 Element Audit

For each key page (Home, About, Product, Pricing, Contact), check:

| SB7 Element | Present? | Quality (1-5) | Location on Page |
|-------------|----------|---------------|------------------|
| Character (customer want) | | | |
| Problem (external/internal/philosophical) | | | |
| Guide (empathy + authority) | | | |
| Plan (3-step simplification) | | | |
| Call to Action (direct + transitional) | | | |
| Failure (stakes of inaction) | | | |
| Success (aspirational outcome) | | | |

### Phase 3: Page-by-Page Analysis

1. **Homepage:**
   - Does the header pass the "grunt test"? (In 5 seconds: what do you offer, how does it make my life better, what do I do next?)
   - Is the customer positioned as the hero?
   - Is there a clear CTA above the fold?
   - Does the page tell a story or list features?
2. **About Page:**
   - Is this about the brand's story in service of the customer? Or just corporate history?
   - Does it establish guide credentials (empathy + authority)?
3. **Product/Service Pages:**
   - Are features presented as the plan? (how they solve the problem)
   - Is the internal problem addressed? (not just functional benefits)
4. **Pricing Page:**
   - Does it address failure stakes? (cost of NOT buying)
   - Is risk reduced? (guarantees, trials)

### Phase 4: Create Rewrite Recommendations

For each identified issue:
1. Quote the current copy (before)
2. Identify the narrative problem (diagnosis)
3. Write the recommended rewrite (after)
4. Explain why the rewrite works better (ABT principle applied)
5. Prioritize rewrites by impact: HIGH (homepage, CTAs), MEDIUM (product pages), LOW (footer)

### Phase 5: Build the Narrative Improvement Plan

1. Rank all recommendations by impact and effort
2. Create a "Quick Wins" list — changes that can be made today
3. Create a "Strategic Rewrites" list — pages that need full restructuring
4. Provide the overall narrative score (1-10) with breakdown by SB7 element
5. Design the implementation sequence: which pages to fix first for maximum impact
6. Create before/after mockup for the homepage structure

## Output Format

```yaml
website_narrative_audit:
  website: "{URL}"
  overall_score: "{1-10}"
  aaa_ratio: "{percentage of non-narrative copy}"
  biggest_void: "{where story is most needed}"
  sb7_audit:
    homepage:
      grunt_test: "{pass/fail}"
      elements_present: ["{which SB7 elements}"]
      elements_missing: ["{which are absent}"]
      score: "{1-5}"
    about:
      score: "{1-5}"
      issues: ["{specific problems}"]
    product:
      score: "{1-5}"
      issues: ["{specific problems}"]
  rewrite_recommendations:
    - page: "{which page}"
      priority: "{high/medium/low}"
      current_copy: "{before}"
      problem: "{narrative diagnosis}"
      recommended_copy: "{after}"
      principle: "{ABT/SB7 principle applied}"
  improvement_plan:
    quick_wins: ["{immediate changes}"]
    strategic_rewrites: ["{full page restructures}"]
    implementation_sequence: ["{page order by impact}"]
    homepage_wireframe: "{restructured layout with SB7 mapping}"
```

## Veto Conditions

- **NEVER** audit without understanding the customer — the audit is FROM the customer's perspective
- **NEVER** recommend "more copy" as the solution — clarity beats volume
- **NEVER** ignore the homepage — it is the most impactful page to fix
- **NEVER** provide vague recommendations — every suggestion must include specific rewrite copy

## Completion Criteria

- [ ] Every key page audited against SB7 framework
- [ ] AAA vs ABT patterns identified and quantified
- [ ] Specific rewrite recommendations with before/after copy
- [ ] Recommendations prioritized by impact
- [ ] Quick wins separated from strategic rewrites
- [ ] Homepage restructure wireframe provided
