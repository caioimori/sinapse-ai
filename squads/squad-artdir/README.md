# squad-artdir — Art Direction for Conversion AND Platform Premium

**Version:** 2.0.0
**Changelog:** v2.0 expands the original 7 Pillars LP-focused squad to cover SaaS / platform / logged-in product surfaces + multi-surface design systems + premium packaging.

Art direction focused on retention, conversion AND premium perceived value. Every pixel carries behavioral intent.

## The 10 Pillars (v2.0 — LP + Platform unified)

### LP Core (v1.0 — preserved)
1. Visual Hierarchy & Controlled Attention
2. Psychologically Intentional Color System
3. Typography as Identity Signal
4. Motion as Kinesthetic Narrative
5. Information Architecture for Retention
6. Visual Persuasion via CRO Patterns
7. Layout & Spacing as Cognitive Breathing

### Platform + Premium (v2.0 — NEW)
8. **Product Surface Ergonomics** (Axiom) — daily-use cognitive ergonomics for logged-in surfaces
9. **Multi-Surface Design System Architecture** (Atlas) — canonical tokens, surface dialects, versioning
10. **Premium Packaging & Perceived Value** (Aura) — the 5 non-negotiables that justify 3x pricing

See `knowledge-base/ten-pillars-framework.md` for the full applicability matrix (LP vs Platform).

## Agents (14 total — 10 v1.0 + 4 v2.0)

### v1.0 LP Core
| Agent | Persona | Role |
|-------|---------|------|
| artdir-orqx | Canvas | Orchestrator — coordinates 10 pillars, routes LP vs Platform |
| visual-strategist | Prism | Visual language, mood, aesthetic positioning |
| motion-architect | Tempo | Motion system, timing, easing, lib selection |
| type-systemist | Kern | Type scale, font pairing, custom type (premium) |
| color-psychologist | Spectrum | Color systems with neuropsychological justification |
| layout-engineer | Grid | Grids, spacing, responsiveness |
| ia-architect | Flow | Information architecture for cognitive retention |
| cro-persuasion | Convert | Conversion patterns and persuasion |
| interaction-designer | Pulse | Hover states, micro-interactions, feedback |
| accessibility-guardian | Shield | WCAG AAA, accessibility quality gate |

### v2.0 Platform + Premium
| Agent | Persona | Role |
|-------|---------|------|
| product-surface-director | **Axiom** | Dashboards, empty states, dark mode parity, cognitive ergonomics for daily use (Pilar 8) |
| design-system-architect | **Atlas** | Multi-surface tokens, dialects, semver, drift audit (Pilar 9) |
| platform-aesthetic-director | **Vertex** | Custodian of SaaS canon (Linear/Vercel/Stripe/Framer/Arc/Raycast). Prevents commodity contamination (Lens 8, 9, 10) |
| premium-packaging-strategist | **Aura** | Translates "charge 3x more" into concrete aesthetic decisions. Applies the 5 non-negotiables (Pilar 10) |

## Workflows

- `full-art-direction-cycle` (v1.0) — LP / marketing surface, 7 Pillars
- `conversion-audit-cycle` (v1.0) — LP audit
- `saas-platform-art-direction-cycle` (v2.0) — Platform / SaaS, 10 Pillars: canon consult -> token system -> product surface -> first 5 minutes -> premium packaging -> drift audit -> validate

## Knowledge Bases (8)

- `seven-pillars-framework.md` (v1.0 canon, LP)
- `ten-pillars-framework.md` (v2.0 unified LP+Platform)
- `psychological-toolkit.md`
- `case-nyo-ia-reference.md`
- `motion-technique-catalog.md`
- `deliverables-templates.md`
- `saas-art-direction-canon.md` (v2.0) — 6 premium SaaS refs decomposed
- `premium-packaging-principles.md` (v2.0) — 5 non-negotiables from council pressurization

## When to use which workflow

- Landing page, site, campaign -> `full-art-direction-cycle`
- SaaS, dashboard, logged-in product, platform -> `saas-platform-art-direction-cycle`
- Existing LP audit -> `conversion-audit-cycle`
- Existing product drift audit -> task `audit-drift-multi-surface`
- Premium pricing justification -> task `create-premium-packaging-brief`

## Non-Negotiable Rules (all 14 agents)

1. Every aesthetic decision MUST cite a psychological principle
2. Performance > beauty (motion that causes lag kills conversion AND retention)
3. Accessibility > cinema (always fallback to prefers-reduced-motion)
4. Mobile-first, scale to desktop (LP)
5. Dark-first or parity-required (Platform)
6. Copy is design (microcopy, CTA labels, empty-state copy)
7. Measurable or not done — every delivery has an impact hypothesis
8. NO Pinterest moodboards, NO stock fonts for premium positioning, NO commodity contamination
9. Billing PDF and transactional email are NOT optional surfaces — they are part of the brief
10. Restraint reads as confidence — max 1 accent, max 3 type weights, max 3 CTAs per viewport

---

*squad-artdir v2.0.0 | 14 agents | 13 tasks | 8 KBs | 3 workflows | 10 Pillars*
