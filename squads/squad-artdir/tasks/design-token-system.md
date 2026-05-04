# Task: Design Token System

## Metadata
- **ID:** design-token-system
- **Version:** 1.0.0
- **Agent:** design-system-architect (Atlas) — primary
- **Supporting agents:** color-psychologist (Spectrum), type-systemist (Kern), motion-architect (Tempo), layout-engineer (Grid)
- **Squad:** squad-artdir
- **Pilar:** 9 (Multi-Surface Design System Architecture)

## Description

Produce the canonical multi-surface design token system. Define the brand root layer and the dialect translations for every surface the product will touch (marketing, product, email, docs, PDF, mobile). Establish versioning (semver), ownership, and consistency audit cadence.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| brand_tokens | object | required | Brand tokens from squad-brand (colors, type, motion, spacing) |
| target_surfaces | array | required | Which of the 7 canonical surfaces this product needs |
| product_context | string | required | Product type (SaaS / dashboard / marketplace / ...) |
| existing_system | object | optional | Existing token system if migration |
| breaking_change_acceptable | bool | optional | Whether major version bumps are acceptable |

## Steps

1. **define-canonical-root** — establish the single source of truth. All downstream tokens derive from here.
2. **identify-target-surfaces** — from the 7 canonical surfaces, which apply (always include billing PDF and transactional email — they are never optional for premium products).
3. **design-dialect-per-surface** — for each surface, define the dialect layer that translates canonical tokens into surface-supported equivalents.
4. **assign-ownership** — every token gets an owner + justification + last-reviewed date.
5. **versioning-strategy** — semver with changelog + migration guide protocol.
6. **automate-enforcement** — define which surfaces can be enforced via CI and which need manual audit.
7. **audit-cadence** — schedule quarterly drift audit.
8. **handoff-ddl** — produce full DDL ready for @data-engineer or squad-design to implement.
9. **validate-against-pillar-9** — checklist: SSOT, dialects, versioning, ownership, audit cadence.

## Outputs

| Output | Format | Description |
|--------|--------|-------------|
| canonical_tokens | yaml | Root token layer (brand dialect) |
| surface_dialects | yaml | Translation layer per surface |
| token_registry | yaml | Token + owner + justification + last-reviewed |
| versioning_protocol | markdown | Semver + changelog + migration process |
| audit_schedule | markdown | Quarterly audit with scope |
| pillar_9_checklist | markdown | Validation checklist result |

## Quality Gates

- Billing PDF and transactional email are NOT missing from target_surfaces
- Every token has an owner
- Semver versioning is active
- At least ONE automated enforcement mechanism is defined
- Quarterly audit is scheduled with a calendar placeholder

---

*squad-artdir v2.0 | Pilar 9 task*
