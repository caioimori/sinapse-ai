# Task: Audit Drift (Multi-Surface Consistency Audit)

## Metadata
- **ID:** audit-drift-multi-surface
- **Version:** 1.0.0
- **Agent:** design-system-architect (Atlas) — primary
- **Supporting agents:** platform-aesthetic-director (Vertex), premium-packaging-strategist (Aura)
- **Squad:** squad-artdir
- **Pilar:** 9 (Multi-Surface Design System Architecture)

## Description

Audit a product's deployed surfaces against the canonical token system. Detect drift. Produce remediation priorities sorted by impact on premium perception. This is the quarterly task that prevents surface degradation — the single strongest defense of pricing power.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| product_url | string | required | Main product URL |
| canonical_tokens | yaml | required | Reference token system (from design-token-system) |
| surfaces_to_audit | array | required | List of surfaces with URLs/access methods |
| audit_scope | enum | optional | full / critical-only / surface-specific |

## Steps

1. **inventory-surfaces** — list all 7 canonical surfaces and their current state (deployed / missing / partial).
2. **capture-screenshots** — screenshot each surface for visual comparison. Delegate to playwright MCP via Bash.
3. **token-diff** — for code-accessible surfaces (marketing, product), diff deployed CSS against canonical tokens.
4. **manual-audit** — for hard surfaces (email, PDF, support, mobile), manual visual audit against the canon.
5. **classify-drift** — every drift classified as: critical (visible to users on first impression) / moderate (visible on repeated use) / minor (internal inconsistency).
6. **premium-impact-score** — for each drift, score impact on premium perception (0-5).
7. **remediation-priorities** — ranked list with owner, effort estimate, and expected perception lift.
8. **handoff-to-aura** — Aura receives the audit and produces a packaging impact summary.
9. **schedule-re-audit** — calendar placeholder for next quarterly audit.

## Outputs

| Output | Format | Description |
|--------|--------|-------------|
| drift_inventory | markdown | Full inventory with classification |
| screenshots | folder | Visual evidence per surface |
| remediation_priorities | markdown | Ranked list with owner + effort + impact |
| premium_impact_report | markdown | Summary for Aura / executive |
| re_audit_schedule | markdown | Next audit date |

## Quality Gates

- All 7 canonical surfaces are audited (or explicitly excluded with justification)
- Every drift has an impact score
- Remediation priorities have owners assigned
- Billing PDF and transactional email are NOT missing from the audit

---

*squad-artdir v2.0 | Pilar 9 task*
