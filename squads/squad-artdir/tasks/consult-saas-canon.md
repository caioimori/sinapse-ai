# Task: Consult SaaS Canon

## Metadata
- **ID:** consult-saas-canon
- **Version:** 1.0.0
- **Agent:** platform-aesthetic-director (Vertex) — primary
- **Supporting agents:** analyst (Scope), visual-strategist (Prism)
- **Squad:** squad-artdir
- **Pilars:** 8, 9, 10 (lens)

## Description

Consult the `saas-art-direction-canon.md` KB to extract the most relevant references for a given platform briefing. Decompose the references across the 5 canonical dimensions (Visual DNA, Hero pattern, Design system, Pricing, Onboarding). Return a curated set of principles tailored to the briefing category. Prevents commodity contamination by blocking Pinterest moodboards and stock references.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| product_category | string | required | Product category (dev tool / fintech / creative tool / ...) |
| audience | string | required | Target audience |
| positioning | string | required | Positioning statement |
| pricing_posture | enum | optional | premium / mainstream / free |
| proposed_references | array | optional | References the user/client is proposing (for commodity audit) |

## Steps

1. **parse-briefing** — extract category, audience, positioning.
2. **commodity-audit** — if proposed_references contains Pinterest moodboards, Dribbble shots, or Figma community templates, BLOCK and escalate.
3. **category-match** — match the category to the closest refs in the canon (dev tool -> Vercel/Raycast; fintech -> Stripe; creative tool -> Framer/Arc; productivity -> Linear).
4. **decompose-refs** — for the 2-3 most relevant refs, produce the 5-dimension decomposition.
5. **extract-principles** — derive cross-reference principles relevant to the case.
6. **identify-custom-craft** — from the refs, identify candidate custom craft elements the new product should consider (e.g., "Vercel owns Geist — this product should own something equivalent").
7. **feedback-to-agents** — return principles to Axiom (product surface), Atlas (design system), Aura (premium packaging).
8. **log-consultation** — log the consultation for the quarterly canon review.

## Outputs

| Output | Format | Description |
|--------|--------|-------------|
| canon_consultation | markdown | Full consultation with refs, decomposition, principles |
| category_fit_matrix | markdown | How each canon ref fits (or not) the briefing category |
| custom_craft_candidates | markdown | List of candidate custom craft elements |
| commodity_audit_result | markdown | Pass / fail with blocking reasons |

## Quality Gates

- At least 2 canon refs decomposed for the briefing
- Commodity audit is performed (not skipped)
- Custom craft candidates are identified
- Principles are TRACED to specific refs (not invented)

---

*squad-artdir v2.0 | Canon consultation task*
