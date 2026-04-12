# Task: Diagnose Visual Language

## Metadata
- **ID:** diagnose-visual-language
- **Version:** 1.0.0
- **Agent:** visual-strategist (Prism)
- **Squad:** squad-artdir

## Description

Analyze a URL or briefing and diagnose the current visual language against the 7 pillars framework. Produces a diagnostic report with scores, gaps, and prioritized recommendations.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | conditional | URL to analyze (if existing site) |
| briefing | string | conditional | Written briefing (if new project) |
| audience | string | required | Target audience description |
| category | string | required | Market category |
| objective | string | required | Primary conversion objective |

At least one of `url` or `briefing` must be provided.

## Steps

1. **gather-context**
   - If URL provided: fetch and analyze current visual language
   - If briefing: parse requirements and constraints
   - Identify audience, category, competitors

2. **analyze-pillar-1** (Visual Hierarchy)
   - Evaluate focal points, reading patterns, Hick's/Fitts's compliance
   - Score hierarchy clarity (1-10)

3. **analyze-pillar-2** (Color System)
   - Count accent colors (should be max 1)
   - Check WCAG contrast ratios on CTAs and text
   - Evaluate Von Restorff application
   - Score color intentionality (1-10)

4. **analyze-pillar-3** (Typography)
   - Evaluate font pairing vs category conventions
   - Check type scale consistency
   - Assess tracking and leading
   - Score typographic identity (1-10)

5. **analyze-pillar-4** (Motion)
   - Catalog existing animations
   - Check performance (GPU-only, FPS)
   - Verify prefers-reduced-motion
   - Score motion narrative (1-10)

6. **analyze-pillar-5** (Information Architecture)
   - Map section sequence against cognitive roles
   - Check progressive disclosure
   - Evaluate retention devices
   - Score IA effectiveness (1-10)

7. **analyze-pillar-6** (CRO Patterns)
   - Catalog existing CRO patterns
   - Identify missing high-impact patterns
   - Score conversion readiness (1-10)

8. **analyze-pillar-7** (Layout & Spacing)
   - Check spacing consistency (4px/8px baseline)
   - Evaluate full-bleed vs contained decisions
   - Check responsive behavior
   - Score layout breathing (1-10)

9. **synthesize-diagnostic**
   - Aggregate scores across 7 pillars
   - Identify top 3 gaps (highest impact, lowest score)
   - Generate prioritized recommendations
   - Estimate impact of each recommendation

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| diagnostic_report | object | Full diagnostic with scores and analysis |
| pillar_scores | array | Score 1-10 for each pillar |
| top_gaps | array | Top 3 gaps with impact estimate |
| recommendations | array | Prioritized list of improvements |
| overall_score | number | Weighted average of pillar scores |

## Quality Criteria

- Every gap MUST cite the psychological principle it violates
- Every recommendation MUST include estimated impact (metric + direction)
- Scores MUST be justified with specific observations
- Recommendations MUST be prioritized by impact/effort ratio
