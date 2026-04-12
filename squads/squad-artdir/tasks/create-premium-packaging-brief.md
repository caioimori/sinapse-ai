# Task: Create Premium Packaging Brief

## Metadata
- **ID:** create-premium-packaging-brief
- **Version:** 1.0.0
- **Agent:** premium-packaging-strategist (Aura) — primary
- **Supporting agents:** platform-aesthetic-director (Vertex), design-system-architect (Atlas), product-surface-director (Axiom), type-systemist (Kern), motion-architect (Tempo)
- **Squad:** squad-artdir
- **Pilar:** 10 (Premium Packaging & Perceived Value)

## Description

Produce the Premium Packaging Brief — the master deliverable that justifies and operationalizes premium pricing through art direction. Applies the 5 non-negotiable principles from `premium-packaging-principles.md`. Blocks the brief if the product cannot commit to the 5 principles.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| product | string | required | Product name + description |
| target_price | number | required | Target price point |
| competitor_price | number | required | Direct competitor reference price |
| multiplier | number | derived | target / competitor (should be >= 2x for this task to apply) |
| brand_tokens | object | optional | Brand token system from squad-brand |
| existing_surfaces | array | optional | Inventory of currently deployed surfaces |

## Steps

1. **diagnostic-intake** — Aura asks the 5 diagnostic questions. If ANY answer is "no" or "we do not know," escalate with remediation plan.
2. **select-custom-craft** — identify the ONE custom craft element (type / icon / motion / illustration). Delegate to Kern (type) or Tempo (motion) or squad-brand (icon/illustration) for specification.
3. **design-strategic-friction** — identify at least one strategic friction point in the funnel. Coordinate with Convert (cro-persuasion) for CRO implications.
4. **first-5-minutes-choreo** — design the onboarding choreography for the first 5 minutes. Coordinate with Axiom (product-surface-director).
5. **surface-inventory-audit** — delegate to Atlas via `audit-drift-multi-surface` to audit current state of all 7 canonical surfaces.
6. **consult-vertex** — Vertex identifies category-fit references from the canon.
7. **restraint-audit** — apply Principle 1 (restraint reads as confidence). Count accents, type weights, CTAs per viewport.
8. **assemble-brief** — produce the Premium Packaging Brief deliverable.
9. **validate-against-pillar-10** — checklist: 5 principles, 5 diagnostic answers, 7 surface inventory.
10. **handoff-to-canvas** — Canvas (artdir-orqx) integrates the brief with the rest of the art direction deliverables.

## Outputs

| Output | Format | Description |
|--------|--------|-------------|
| premium_packaging_brief | markdown | Master brief with the 5 principles applied |
| custom_craft_spec | markdown | Specification for the ONE custom craft element |
| friction_point_design | markdown | Strategic friction point and justification |
| first_5_minutes_choreography | markdown | Onboarding theater spec |
| restraint_audit | markdown | Accent/type-weight/CTA count vs. principle |
| pillar_10_checklist | markdown | Validation checklist result |

## Quality Gates

- The 5 diagnostic questions ALL have answers (not "we don't know")
- At least ONE custom craft element is identified
- At least ONE strategic friction point is designed
- First 5 Minutes Choreography is documented
- Surface inventory covers all 7 canonical surfaces
- Restraint audit shows: max 1 accent, max 3 type weights, max 3 CTAs/viewport

---

*squad-artdir v2.0 | Pilar 10 task*
