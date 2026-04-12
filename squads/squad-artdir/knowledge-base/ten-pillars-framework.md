# The 10 Pillars of Art Direction — LP + Platform Unified Framework

> v2.0 extension of the original 7 Pillars. The first 7 pillars are preserved verbatim from `seven-pillars-framework.md` (backward compatible). Pillars 8, 9, 10 are NEW and were added to cover SaaS / platform / dashboard / premium packaging contexts that v1.0 did not address.
>
> **Every pillar now carries TWO applicability ratings:** LP (landing page context) and Platform (logged-in product context). This is how Canvas routes work intelligently based on briefing type.

---

## Applicability Matrix — All 10 Pillars

| # | Pillar | LP | Platform | Primary Agent | Secondary Agent |
|---|--------|----|---------:|---------------|-----------------|
| 1 | Visual Hierarchy & Controlled Attention | YES | YES | Prism (visual-strategist) | Grid (layout-engineer) |
| 2 | Psychologically Intentional Color | YES | YES | Spectrum (color-psychologist) | Shield (accessibility-guardian) |
| 3 | Typography as Identity Signal | YES | YES | Kern (type-systemist) | Prism (visual-strategist) |
| 4 | Motion as Kinesthetic Narrative | YES | PARTIAL | Tempo (motion-architect) | Pulse (interaction-designer) |
| 5 | Information Architecture for Retention | YES | YES | Flow (ia-architect) | Convert (cro-persuasion) |
| 6 | Visual Persuasion via CRO Patterns | YES | PARTIAL | Convert (cro-persuasion) | Flow (ia-architect) |
| 7 | Layout & Spacing as Cognitive Breathing | YES | YES | Grid (layout-engineer) | Prism (visual-strategist) |
| **8** | **Product Surface Ergonomics (NEW)** | NO | YES | **Axiom (product-surface-director)** | Flow (ia-architect), Grid (layout-engineer) |
| **9** | **Multi-Surface Design System Architecture (NEW)** | PARTIAL | YES | **Atlas (design-system-architect)** | Spectrum, Kern, Tempo |
| **10** | **Premium Packaging & Perceived Value (NEW)** | YES | YES | **Aura (premium-packaging-strategist)** | Canvas (artdir-orqx), Vertex (platform-aesthetic-director) |

**Note:** Vertex (platform-aesthetic-director) is the KB custodian for the SaaS canon and is invoked on Pillars 8, 9, 10 for reference intelligence but does not own any single pillar exclusively — Vertex is the lens, not a pillar owner.

---

## Pillars 1-7 (v1.0 — preserved verbatim, see `seven-pillars-framework.md`)

1. **Visual Hierarchy & Controlled Attention** — Hick, Fitts, Von Restorff, Gestalt, reading patterns
2. **Psychologically Intentional Color System** — neuropsychology, WCAG AAA, emotion mapping
3. **Typography as Identity Signal** — pairings by positioning, fluid type, tracking
4. **Motion as Kinesthetic Narrative** — Disney 12, easing, lib selection, perf budget
5. **Information Architecture for Retention** — Zeigarnik, progressive disclosure, curiosity gaps
6. **Visual Persuasion via CRO Patterns** — comparison tables, social proof, scarcity, risk reversal
7. **Layout & Spacing as Cognitive Breathing** — grid systems, spacing tokens, container queries

These are unchanged. Canvas still owns the 7-pillar validation for LP briefings.

---

## Pillar 8 — Product Surface Ergonomics (NEW, v2.0)

**Owner:** Axiom (product-surface-director)
**Applicability:** Platform YES, LP NO

### Principle

Logged-in product surfaces are not landing pages. They are inhabited — users see them 100 times, not once. The aesthetic goals shift from first-impression conversion to long-term cognitive ergonomics. The product's job is to disappear into the user's workflow, not to impress.

### Core Laws

#### The Inhabitation Law
- **Principle:** Users will see this surface 100+ times. Every decoration becomes visual noise on the 2nd impression.
- **Application:** Strip ornamentation. Prefer information density over marketing flash.

#### The Daily-Use Fitts's Law
- **Principle:** Fitts applies, but in a product surface the action targets are hit THOUSANDS of times. Micro-optimization matters.
- **Application:** Primary actions (save, send, create) are large, consistent positions, keyboard-accessible.

#### The Empty-State Promise
- **Principle:** Empty states are the second impression (after the LP). If the first real interaction after signup is an empty dashboard with no guidance, the user churns.
- **Application:** Every surface has an intentional empty state. It teaches, it motivates, it previews value.

#### The Data Density Balance
- **Principle:** Too sparse = "this product is not useful" signal. Too dense = cognitive overload. Find the Goldilocks per surface.
- **Application:** Dashboards lean dense. Settings lean sparse. Onboarding leans sparse. Data tables lean ultra-dense.

#### The Dark-Mode Mandate
- **Principle:** For product surfaces, dark mode is a requirement, not an option. Users spend 6+ hours/day in the app — eye strain is real.
- **Application:** Design dark-first OR design both in parallel. Never retrofit.

### Cognitive Zones in a Product Surface

| Zone | Role | Density | Motion |
|------|------|---------|--------|
| Top bar / nav | Orientation | Low | Minimal |
| Primary content | Focus | Medium-High | Purposeful only |
| Side panels / inspectors | Context | Medium | Subtle reveal |
| Toasts / notifications | Interruption | Low | Von Restorff motion |
| Modals | Decision | Medium | Entry/exit only |
| Empty states | Onboarding | Low | Tempo-guided |

### Checkpoints Axiom enforces

1. Every dashboard has a clear KPI hero zone
2. Every empty state is intentionally designed (not the framework default)
3. Dark mode is at parity with light mode (not a 80% retrofit)
4. Notifications use Von Restorff motion sparingly
5. Keyboard shortcuts are visible in the UI (learnable velocity)
6. No vanity animations on surfaces users see daily

---

## Pillar 9 — Multi-Surface Design System Architecture (NEW, v2.0)

**Owner:** Atlas (design-system-architect)
**Applicability:** Platform YES, LP PARTIAL (LP benefits from the token system but rarely needs full versioning)

### Principle

A product company does not have one surface — it has many: brand identity, marketing site, product UI, transactional emails, documentation, support center, billing/invoice PDFs, mobile apps, embeds, social media assets. If these surfaces drift apart, premium perception collapses. A design system is the only enforcement mechanism that scales.

### Core Laws

#### The Single Source of Truth Law
- **Principle:** Brand tokens are the root. Every downstream surface inherits from the same canonical source.
- **Application:** Tokens are defined once (brand layer), translated into surface-specific dialects (marketing tokens, product tokens, email-safe tokens, print tokens).

#### The Surface Dialect Law
- **Principle:** Surfaces have constraints. Email cannot use CSS grid. Print cannot use interactive color. Tokens must translate, not break.
- **Application:** Each surface gets a dialect layer that maps canonical tokens to surface-supported equivalents.

#### The Versioning Law
- **Principle:** A design system without versioning is a bug farm. Breaking changes must ship with migration guides.
- **Application:** Semver for design tokens. Changelog. Deprecation notices. Automated migration scripts when possible.

#### The Ownership Law
- **Principle:** Every token has an owner. If no one owns it, it drifts.
- **Application:** Token registry with owner, justification, and last-reviewed date.

#### The Consistency Audit Law
- **Principle:** Every quarter, audit all surfaces for drift. Drift is inevitable; detection is mandatory.
- **Application:** Automated diff of deployed surfaces vs token system. Manual audit of hard-to-automate surfaces (emails, PDFs).

### The 7 Canonical Surfaces

| Surface | Token Dialect | Enforcement Difficulty |
|---------|--------------|----------------------|
| Brand identity | Canonical | (source of truth) |
| Marketing site | Web tokens | Easy (code-enforced) |
| Product UI | Web tokens + component contracts | Medium |
| Transactional email | Email-safe tokens (inline CSS) | Hard |
| Documentation | Web tokens, often 3rd-party themed | Hard |
| Billing / invoice PDF | Print tokens | Very hard (often forgotten) |
| Mobile apps | Platform-native token maps | Hard |

### Checkpoints Atlas enforces

1. There is ONE canonical brand token layer
2. Each surface has a documented dialect mapping
3. Tokens are versioned (semver)
4. Every token has an owner + justification
5. A quarterly consistency audit is scheduled
6. Breaking changes have migration guides
7. Email and invoice surfaces are NOT forgotten

---

## Pillar 10 — Premium Packaging & Perceived Value (NEW, v2.0)

**Owner:** Aura (premium-packaging-strategist)
**Applicability:** LP YES, Platform YES (both surfaces need to justify the price tag)

### Principle

Price is a signal. Design is the proof. Every surface must signal premium; every interaction must earn the price tag. Premium is not decoration — it is a consistent choreography of restraint, custom craft, strategic friction, first-run theater, and multi-surface consistency.

### The 5 Non-Negotiables

See `premium-packaging-principles.md` for the full pressurization output.

1. **Restraint reads as confidence** (Signaling theory)
2. **Custom craft = unfakeable signal** (Veblen + Bourdieu)
3. **Friction at the right moment creates value** (Ariely, IKEA effect)
4. **Presentation > intrinsic quality** (Framing effect)
5. **Consistency across surfaces defends the price** (Cognitive consistency)

### Diagnostic Questions (Aura's briefing intake)

1. What is the ONE custom craft element this product will own?
2. Where is the strategic friction in the funnel?
3. What is the choreography of the first 5 minutes after signup?
4. Is there a documented multi-surface token system?
5. Do the invoice PDF and transactional emails match the marketing site quality?

**Any "no" = the product is pricing itself as commodity.**

### Checkpoints Aura enforces

1. Briefing has a named custom craft element
2. Funnel has at least one strategic friction point
3. First 5 Minutes Choreography is documented
4. Multi-surface token system exists (delegates to Atlas)
5. Full surface audit covers: marketing, product, email, docs, support, billing, mobile

---

## How Canvas (artdir-orqx) Routes with 10 Pillars

### LP / Marketing site briefing
- Activate Pillars 1-7 (primary) + Pillar 10 (premium check)
- Agents: Prism, Spectrum, Kern, Tempo, Flow, Convert, Grid, Pulse, Shield, Aura
- Optional: Vertex (if premium SaaS category)

### Platform / SaaS / Dashboard briefing
- Activate Pillars 1-5, 7 (LP pillars that apply) + Pillars 8, 9, 10 (NEW)
- Pillar 4 (Motion) becomes PARTIAL — only purposeful motion, no marketing flash
- Pillar 6 (CRO) becomes PARTIAL — CRO applies to upgrade/upsell paths, not to daily surfaces
- Agents: Axiom (primary), Atlas, Aura, Vertex, Prism, Spectrum, Kern, Flow, Grid, Pulse, Shield

### Multi-surface / design-system work
- Activate Pillars 9, 10 (primary) + Pillars 2, 3, 4, 7 (tokens)
- Agents: Atlas (primary), Aura, Spectrum, Kern, Tempo, Grid, Vertex

### Premium packaging audit
- Activate Pillars 8, 9, 10 (primary) + Pillar 2 (color), Pillar 3 (type), Pillar 4 (motion)
- Agents: Aura (primary), Vertex, Atlas, Axiom, Spectrum, Kern, Tempo

---

## Backward Compatibility

- `seven-pillars-framework.md` is preserved verbatim as the canonical LP framework.
- All existing v1.0 tasks and workflows continue to work (they reference Pillars 1-7).
- `ten-pillars-framework.md` (this file) is the v2.0 extension, referenced by the new platform workflow and new agents.
- Canvas's routing logic (in `artdir-orqx.md`) is updated to check the briefing type and select the right pillar set.

---

*@design-orqx (Nexus) + @brand-orqx (Meridian) collaborative output | squad-artdir v2.0 | KB v1.0*
