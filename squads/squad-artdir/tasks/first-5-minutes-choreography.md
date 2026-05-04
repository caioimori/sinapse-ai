# Task: First 5 Minutes Choreography

## Metadata
- **ID:** first-5-minutes-choreography
- **Version:** 1.0.0
- **Agent:** product-surface-director (Axiom) + premium-packaging-strategist (Aura) — co-primary
- **Supporting agents:** motion-architect (Tempo), interaction-designer (Pulse), ia-architect (Flow)
- **Squad:** squad-artdir
- **Pilars:** 8, 10

## Description

Design the choreography of the first 5 minutes after user signup. This is the premium unboxing equivalent in digital products. Not an onboarding tutorial — a theatrical first-run experience that makes the user feel: "I am entering something serious."

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| product | string | required | Product name + core workflow |
| user_intent | string | required | What the user came to accomplish |
| activation_metric | string | required | The "aha moment" to reach |
| premium_positioning | bool | required | Whether the product claims premium positioning (triggers additional ceremony phase) |
| existing_onboarding | object | optional | Current onboarding flow if auditing |

## Steps

1. **define-phases** — break the 5 minutes into named phases:
   - **0-15s: Arrival** — the moment of entry. Must feel designed, not defaulted.
   - **15s-1min: Ceremony** (premium only) — intentional theater. Could be a personalization question, a moment of branded delight, a signature animation.
   - **1-2min: Orientation** — the product teaches itself. No modal walls. Inline hints.
   - **2-4min: First Value** — the user produces/receives something real. Not a demo — an actual artifact.
   - **4-5min: Activation** — the aha moment. The user now understands why this exists.
2. **arrival-design** — Axiom designs the arrival screen. No "Welcome to {product}" generic. Must be custom.
3. **ceremony-design** — Aura designs the ceremony moment (premium only). Consults Tempo (motion) and squad-brand (brand voice) for signature flourishes.
4. **orientation-strategy** — Flow (ia-architect) designs inline disclosure. No tutorial walls. No "Skip tutorial" button.
5. **first-value-design** — Axiom + Aura design the first-artifact experience. The user leaves the first 5 minutes with something they made or received.
6. **activation-choreography** — the aha moment is explicitly choreographed with visual punctuation (not hidden).
7. **motion-budget** — Tempo sets the motion budget for the 5 minutes. Higher than daily use, but intentional (Disney 12 principles apply).
8. **anti-pattern-audit** — verify no "Skip" buttons, no modal walls, no framework-default empty states, no Mailchimp-default welcome emails.
9. **validate-against-principle-4** — Principle 4 (Presentation > intrinsic quality) must be honored.

## Outputs

| Output | Format | Description |
|--------|--------|-------------|
| first_5_minutes_spec | markdown | Full phase-by-phase choreography |
| arrival_screen_design | markdown | The 0-15s arrival |
| ceremony_spec | markdown | The 15s-1min ceremony (premium) |
| first_value_experience | markdown | The 2-4min artifact creation |
| activation_punctuation | markdown | The 4-5min aha choreography |
| motion_budget | yaml | Motion budget across phases |
| anti_pattern_audit | markdown | Pass/fail audit |

## Quality Gates

- No "Skip tutorial" button in the first 5 minutes
- The arrival is custom-designed, not framework default
- For premium products, the ceremony phase exists and is > 15s
- The user leaves the 5 minutes with something real (not a demo)
- The activation moment has visual punctuation
- Welcome emails are NOT Mailchimp default

---

*squad-artdir v2.0 | Pilars 8 + 10 task*
