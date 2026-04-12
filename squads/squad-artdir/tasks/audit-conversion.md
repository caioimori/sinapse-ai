# Task: Audit Conversion

## Metadata
- **ID:** audit-conversion
- **Version:** 1.0.0
- **Agent:** cro-persuasion (Convert), ia-architect (Flow) contributes
- **Squad:** squad-artdir

## Description

Audit an existing site or landing page against CRO patterns and suggest improvements. Produces a prioritized list of changes with impact hypotheses and effort estimates.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | required | URL to audit |
| objective | string | required | Primary conversion objective |
| current_metrics | object | optional | Current conversion rate, bounce rate, time on page, scroll depth |
| audience | string | required | Target audience description |

## Steps

1. **capture-current-state**
   - Fetch and analyze the URL
   - Screenshot key sections
   - Map current section sequence

2. **audit-clarity** (Score 1-10)
   - Is the value proposition clear in < 5 seconds?
   - Is the CTA visible above the fold?
   - Is the copy specific or generic?

3. **audit-proof** (Score 1-10)
   - Types of social proof present (logos, testimonials, numbers, UGC)
   - Specificity of proof (names, photos, results vs anonymous)
   - Verifiability (real handles vs generic)

4. **audit-urgency** (Score 1-10)
   - Is there a reason to act now?
   - Scarcity elements (real or perceived)
   - Time-bound offers

5. **audit-friction** (Score 1-10)
   - Number of clicks to convert
   - Form length and complexity
   - Loading speed and perceived performance

6. **audit-risk** (Score 1-10)
   - Are objections addressed?
   - Risk reversal elements (guarantees, free trial, no CC)
   - Trust signals (security badges, compliance)

7. **audit-accessibility** (Score 1-10)
   - CTA contrast and visibility
   - Keyboard navigation to conversion
   - Screen reader CTA accessibility

8. **audit-mobile** (Score 1-10)
   - Mobile conversion path clarity
   - Touch target sizes
   - Mobile-specific CTA visibility

9. **identify-gaps**
   - Cross-reference present patterns against full CRO catalog
   - Identify missing high-impact patterns
   - Identify patterns that exist but are poorly implemented

10. **prioritize-recommendations**
    - For each gap: estimate impact (metric + direction + magnitude)
    - For each gap: estimate implementation effort (low/medium/high)
    - Sort by impact/effort ratio
    - Mark quick wins (high impact, low effort)

11. **compile-audit**
    - Overall CRO Score (average of 7 dimensions)
    - Top 5 quick wins
    - Top 5 strategic improvements
    - Before/after descriptions for each recommendation

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| audit_report | document | Complete CRO audit with scores and analysis |
| dimension_scores | array | Score 1-10 for each audit dimension |
| recommendations | array | Prioritized list of improvements with impact estimates |
| quick_wins | array | Top 5 high-impact, low-effort changes |
| overall_score | number | Average of dimension scores |

## Quality Criteria

- Every recommendation MUST include impact hypothesis (metric + direction + estimated %)
- Every recommendation MUST include effort estimate (low/medium/high)
- Missing patterns MUST be compared against the full CRO catalog
- Quick wins MUST be actionable within 1 dev day
- Scores MUST be justified with specific observations from the site
