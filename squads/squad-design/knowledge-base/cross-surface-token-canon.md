# Knowledge Base: Cross-Surface Token Canon

> **Status:** Canon — canonical source of truth for how `squad-design` (Nexus) and `squad-artdir` (Atlas) share responsibility for tokens that cross surfaces.
> **Version:** 1.0 (shipped with squad-design v2.0.0)
> **Contracts with:** `squads/squad-artdir/agents/design-system-architect.md` (Atlas)
> **Depends on:** `design-token-architecture.md` (this squad)

## Why this doc exists

Until squad-design v2.0.0, "design tokens" in SINAPSE lived in two places without a clear boundary:

1. `squad-design/knowledge-base/design-token-architecture.md` — a generic three-tier taxonomy (primitive → semantic → component) useful for a single product surface.
2. `squad-artdir` v2.0 introduced **Atlas** (`design-system-architect`), whose Pilar 9 is multi-surface design system architecture — brand, marketing, product, email, docs, PDF, mobile.

Both were correct in isolation but the **boundary** between them was undefined. Product teams building a SaaS (marketing page + logged-in product + transactional email) did not know which squad to ask when a token decision spanned those surfaces, which led to ad-hoc token drift — the exact failure mode Atlas was created to prevent.

This canon makes the boundary explicit and sets the handoff contract.

---

## 1. Token tiers (recap — single surface)

The existing `design-token-architecture.md` three-tier model still holds for **a single surface**:

| Tier | Name | Role | Example |
|------|------|------|---------|
| L1 | Primitive | Raw design value | `color.blue.500: #3B82F6` |
| L2 | Semantic | Intent mapping | `color.action.primary: {color.blue.500}` |
| L3 | Component | Component-specific | `button.primary.bg: {color.action.primary}` |

Rules: L3 → L2 → L1. L3 → L1 is forbidden. L1 → L1 is forbidden. These rules are enforced by Nexus (squad-design) inside any single surface's design system.

---

## 2. The cross-surface problem (why L1-L2-L3 is insufficient alone)

A modern product runs on **multiple surfaces**, and each surface has different rendering constraints:

| Surface | Constraint | Example mismatch |
|---------|-----------|------------------|
| Brand identity | Canonical — no rendering | "#3B82F6 is our blue" |
| Marketing site | Full CSS, modern browsers | `color-mix()`, `clamp()`, container queries |
| Product UI | Full CSS but component contracts matter | `--button-primary-bg` token must exist |
| Transactional email | Inline CSS, no `:root`, no custom props | `style="background:#3B82F6"` — no reference |
| Documentation | Often a 3rd-party theme (Docusaurus, Mintlify) | Limited override surface |
| Billing / invoice PDF | Print CSS or server-rendered PDF | No JS, muted color profile, CMYK concerns |
| Mobile apps (iOS/Android) | Native token maps (XML, Swift) | No CSS variables at all |

Primitive `color.blue.500: #3B82F6` is stable across all surfaces. Semantic `color.action.primary` is stable. But **component** `button.primary.bg` CAN NOT be the same token on email (no custom props) vs web product (full CSS) vs mobile (`UIColor`). Something has to translate. That translation layer is what Atlas calls a **surface dialect**.

---

## 3. Surface dialects (what Atlas owns)

A **surface dialect** is a surface-specific translation of the canonical token tree into whatever that surface can actually consume.

```
Brand canon (Meridian)
        │
        ▼
Token canon (Atlas) — versioned semver, single source of truth
        │
   ┌────┴────────┬──────────────┬──────────────┬──────────────┐
   ▼             ▼              ▼              ▼              ▼
Marketing    Product UI    Transactional    PDF          Mobile
dialect      dialect       email dialect    dialect      dialects
(Nexus       (Nexus        (Atlas —         (Atlas —     (Atlas —
 owns)        owns)         specialized)     print)       native)
```

Atlas owns:
- The canonical root (what the token values ARE)
- The dialect definitions for surfaces that Nexus does not work on (email, PDF, mobile)
- Semver versioning of the canonical token tree
- Cross-surface drift audits
- Breaking-change migration guides

Nexus (squad-design) owns:
- The component-level token usage on **web surfaces** (marketing + product UI)
- The three-tier (L1/L2/L3) enforcement inside those surfaces
- The component → token binding (which component reads which semantic token)
- The design-to-code pipeline on the web surfaces

## 4. Ownership diff matrix (authoritative)

| Decision | Owner | Rationale |
|----------|-------|-----------|
| "What's our brand blue?" | Meridian (squad-brand) | Brand-level decision, upstream of both |
| "What's the canonical hex for `color.action.primary`?" | Atlas | Canonical root — single source of truth |
| "How is `color.action.primary` represented in a transactional email?" | Atlas | Email dialect — email cannot reference a CSS variable |
| "How is `color.action.primary` represented in a PDF invoice?" | Atlas | PDF dialect — print-safe color profile |
| "How is `color.action.primary` bound to `Button` component on the product UI?" | Nexus | Component binding inside web product surface |
| "What is `spacing.md` on marketing site?" | Nexus | Marketing surface = web, Nexus domain |
| "What is `spacing.md` on mobile (iOS/Android)?" | Atlas | Mobile is a surface Nexus does not work on |
| "We need a `button.destructive` variant" | Nexus | Component-level addition inside web surface |
| "We need to change `color.action.primary` from blue to teal" | Atlas | Canonical root change — requires semver major bump + migration guide |
| "We found that marketing and product UI render `color.bg.subtle` slightly differently" | Atlas | Cross-surface drift audit, Atlas domain |
| "Tailwind theme config for our marketing site" | Nexus | Web-surface token pipeline |
| "Figma Variables that mirror the design tokens" | Nexus + Atlas (joint) | Figma lives on the boundary — nexus for day-to-day, Atlas for canonical publishes |

**Rule of thumb:**
- If the question is "single web surface, single component" → Nexus.
- If the question is "canonical root, multi-surface, versioning, or non-web surface" → Atlas.

## 5. Immutable vs surface-adapted tokens

Not every token can or should be identical across all surfaces. The canon distinguishes three classes:

| Class | Description | Example | Who decides |
|-------|------------|---------|-------------|
| **Immutable** | MUST be byte-identical across every surface | Brand primary color hex, logo colors, brand gradient stops | Meridian → Atlas |
| **Semantically stable** | Meaning stays constant, rendering adapts per surface | `spacing.md` (web: 16px, mobile: 16pt, PDF: 12pt, email: 16px inline) | Atlas |
| **Surface-local** | Only exists on one surface, no cross-surface meaning | `card.hover.shadow` (web only), `email.footer.divider.color` (email only) | Nexus (if web) / Atlas (if non-web) |

**Immutable tokens are non-negotiable.** If a dialect cannot render the immutable token (e.g. email cannot render a 3-stop gradient), the dialect MUST document the fallback and the fallback is itself immutable. Surface owners cannot unilaterally pick their own fallback.

**Semantically stable tokens** are where most of the day-to-day work happens. The meaning (`spacing.md = one comfortable unit`) is shared; the value differs per surface constraint.

**Surface-local tokens** are small and should be kept small — aggressive growth of surface-local tokens is a smell that the semantic layer is too thin.

## 6. Versioning contract

Atlas owns semver on the canonical token tree.

| Change type | Semver | Who approves | Example |
|------------|--------|-------------|---------|
| Add a new token (no break) | **MINOR** | Atlas alone | Add `color.action.tertiary` |
| Change a value without changing the name | **MINOR** (if immutable class: **MAJOR**) | Atlas alone | Shift `color.border.subtle` one step lighter |
| Rename a token | **MAJOR** | Atlas + Nexus + Meridian | Rename `color.action.primary` → `color.intent.primary` |
| Remove a token | **MAJOR** | Atlas + Nexus + Meridian | Drop `color.action.tertiary` |
| Change the canonical hex of an immutable | **MAJOR** | Atlas + Meridian | Brand rebrand |

Every MAJOR bump MUST ship with:
1. A migration guide (`CHANGELOG.md` entry with before/after per affected surface)
2. Deprecation warnings on the old token for ≥1 minor cycle before the MAJOR cuts it
3. A drift audit run after the MAJOR lands on all surfaces

Nexus MUST consume canonical token tree by exact version, never "latest". `squad-design` tokens in a given project pin to a specific Atlas token tree version.

## 7. Handoff protocol — Nexus ↔ Atlas

### 7.1 When Nexus needs to request a token change

1. Nexus opens a request describing: the component use case, the surface(s) affected, why existing tokens are insufficient.
2. Atlas assesses: does this need a new semantic token, or does an existing semantic cover it?
3. If NEW: Atlas creates the canonical token (L2 semantic), publishes a MINOR bump, and defines the dialect for each surface.
4. Nexus binds the new semantic into the component library.

### 7.2 When Atlas needs Nexus to adapt to a canonical change

1. Atlas announces the upcoming canonical change with a proposed semver bump.
2. Nexus reviews impact on web surface components.
3. If MAJOR: migration guide is co-authored before the bump lands.
4. Nexus migrates component bindings on the release boundary.

### 7.3 When Meridian (brand) changes the brand canon

1. Meridian publishes the brand change (brand guidelines update).
2. Atlas absorbs the change, decides which tokens become immutable vs re-derived, publishes a MAJOR bump.
3. Nexus cascades into web surface components.
4. All three sign off on the migration guide before ship.

---

## 8. What goes in Nexus KBs vs Atlas KBs

To avoid duplication going forward:

**Nexus (squad-design) KBs cover:**
- Single-surface token architecture (L1/L2/L3 — `design-token-architecture.md`)
- Component → token bindings
- Web-surface token export pipelines (CSS variables, Tailwind, Figma Variables sync)
- Design-to-code pipeline on web
- Component library patterns

**Atlas (squad-artdir) KBs cover:**
- Multi-surface canon
- Surface dialects (email, PDF, mobile)
- Semver and versioning strategy
- Drift audits
- Migration guides
- Cross-surface enforcement automation

**This KB (cross-surface-token-canon.md)** is the only doc that sits on the boundary and is co-authored / co-owned. If its content changes, both Nexus and Atlas orchestrators must agree.

---

## 9. Anti-patterns (forbidden)

- **Nexus unilaterally defining an "email variant"** of a component → email is Atlas territory, request a dialect.
- **Atlas designing component APIs** → component APIs are Nexus territory on web surfaces.
- **Any agent hard-coding a hex value inside a component file** → always bind through the token tree.
- **Skipping semver because "it's just a small value tweak"** → immutable-class values need MAJOR, always.
- **Creating a new surface-local token when a semantic already covers the intent** → surface-local should be rare and justified.
- **Copy-pasting tokens across surfaces instead of going through the dialect** → defeats the single source of truth.

---

## 10. Reference index

- `design-token-architecture.md` — L1/L2/L3 taxonomy (this squad)
- `design-to-code-pipeline.md` — how Nexus exports tokens to web (this squad)
- `squads/squad-artdir/agents/design-system-architect.md` — Atlas persona
- `squads/squad-artdir/knowledge-base/` — Atlas's full KB set (multi-surface, dialects, drift audits)
- `squads/squad-brand/knowledge-base/` — Meridian's upstream brand canon

## Change log

- **2026-04-12 (v1.0)** — Created as part of squad-design v2.0.0 / fw-v2.2. Establishes the Nexus ↔ Atlas boundary, the ownership diff matrix, the immutable-vs-adapted token classes, and the semver handoff contract.
