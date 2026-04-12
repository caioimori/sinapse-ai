# Task: Design Product Surface

## Metadata
- **ID:** design-product-surface
- **Version:** 1.0.0
- **Agent:** product-surface-director (Axiom) — primary
- **Supporting agents:** ia-architect (Flow), layout-engineer (Grid), interaction-designer (Pulse), design-system-architect (Atlas)
- **Squad:** squad-artdir
- **Pilar:** 8 (Product Surface Ergonomics)

## Description

Produce a complete art direction brief for a single product surface (dashboard, settings, empty state, data table, modal, inspector, etc). Unlike `create-art-direction-brief` (which is LP-focused), this task optimizes for daily-use cognitive ergonomics, not first-visit conversion.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| surface | string | required | Surface name (dashboard / settings / empty-state / data-table / modal / ...) |
| product_context | string | required | What the product does, core user workflow |
| personas | array | required | Daily-use personas and their frequency/duration |
| existing_tokens | object | optional | Design tokens from Atlas if already defined |
| density_target | enum | optional | low / medium / high (defaults based on surface type) |
| dark_mode_priority | enum | required | dark-first / light-first / parity-required |

## Steps

1. **inhabit-the-surface** — Axiom mentally simulates 100 uses of this surface per month. Lists every decoration that would become noise.
2. **define-cognitive-zones** — map the surface into zones (orientation / focus / context / interruption / decision / onboarding) with density and motion budgets per zone.
3. **design-kpi-hero** — if dashboard, identify the single KPI hero zone.
4. **design-empty-state** — draft the intentional empty state (teach + motivate + preview value).
5. **specify-keyboard-shortcuts** — list visible shortcuts that teach velocity.
6. **dark-mode-parity** — design dark and light in parallel, not retrofit.
7. **notification-rules** — specify Von Restorff motion budget for notifications.
8. **fitts-audit** — verify primary actions are in consistent positions, sized for repeated use.
9. **handoff-to-atlas** — flag any new tokens that need to be added to the design system.
10. **validate-against-pillar-8** — checklist: inhabitation, Fitts, empty state, density, dark mode, notifications, shortcuts.

## Outputs

| Output | Format | Description |
|--------|--------|-------------|
| product_surface_brief | markdown | Full brief with cognitive zones, density, tokens, interactions |
| empty_state_spec | markdown | Intentional empty state design |
| dark_mode_spec | markdown | Dark-light parity matrix |
| token_requests | yaml | New tokens requested from Atlas |
| pillar_8_checklist | markdown | Validation checklist result |

## Quality Gates

- Every zone has a documented density rationale
- Empty state is NOT the framework default
- Dark mode and light mode are specified with equal detail
- Primary actions are visible WITHOUT scrolling on reference viewport (1440x900 and 375x812)
- Keyboard shortcuts are visible in the UI
- No decorative animations on daily-use zones

---

*squad-artdir v2.0 | Pilar 8 task*
