# Cross-Squad Workflow Patterns

> Reference document for Imperator (sinapse-orqx). Contains common patterns for multi-squad coordination, including proven sequences, handoff specifications, and anti-patterns to avoid.

## Pattern Catalog

### 1. Brand Launch (Full)

**When:** Building a complete brand from scratch with digital presence.

**Squads:** brand-system, digital-experience, content-intelligence, copywriting-persuasion, creative-animations

**Sequence:**
```
Phase 1: Brand Foundation
  Lead: brand-system (Meridian)
  Parallel: research-intelligence (Prism) — competitive landscape
  Output: Brand strategy, visual identity, design tokens, voice guidelines

Phase 2: Digital Build
  Lead: digital-experience (Nexus) — UX/UI, wireframes, prototypes
  Parallel: copywriting-persuasion (Quill) — web copy, CTAs
  Handoff from Phase 1: Design tokens, brand voice, color palette, typography
  Output: Website design, component library, page layouts

Phase 3: Content & Motion
  Lead: content-intelligence — editorial strategy, blog, social
  Parallel: creative-animations (Kinetic) — page animations, interactions
  Handoff from Phase 2: Page designs, component specs
  Output: Launch content, animation implementations

Phase 4: Launch Preparation
  Lead: growth-analytics (Catalyst) — SEO, analytics setup
  Parallel: paid-media (Apex) — launch campaigns
  Handoff from Phase 3: Content, pages, creative assets
  Output: Live site, tracking, initial campaigns
```

**Key Handoffs:**
| From | To | Content |
|------|----|---------|
| brand-system | digital-experience | Design tokens (JSON), style guide, logo assets |
| brand-system | copywriting-persuasion | Tone of voice doc, message house, DO/DON'Ts |
| digital-experience | creative-animations | Component specs, interaction points, performance budget |
| copywriting-persuasion | content-intelligence | Web copy, CTAs, headline library |
| content-intelligence | growth-analytics | Sitemap, meta descriptions, keyword strategy |

---

### 2. Go-to-Market Launch

**When:** Launching a new product or service to market.

**Squads:** product-systems, commercial-systems, content-intelligence, paid-media, growth-analytics, copywriting-persuasion, narrative-masters

**Sequence:**
```
Phase 1: Strategy
  Lead: product-systems (Vector) — positioning, PMF validation
  Parallel: research-intelligence (Prism) — market analysis
  Optional: strategic-council (Zenith) — if strategic uncertainty
  Output: Go-to-market strategy, ICP, positioning

Phase 2: Commercial Architecture
  Lead: commercial-systems (Pipeline) — offer, pricing, funnel
  Parallel: financial-intelligence (Ledger) — unit economics model
  Handoff from Phase 1: Positioning, ICP, competitive landscape
  Output: Offer tiers, pricing, funnel design, sales process

Phase 3: Narrative & Copy
  Lead: narrative-masters (Arc) — pitch, story
  Parallel: copywriting-persuasion (Quill) — landing page, email, ads
  Handoff from Phase 2: Offer details, value proposition, pricing
  Output: Pitch deck, launch copy, email sequences, ad copy

Phase 4: Launch Execution
  Lead: paid-media (Apex) — ad campaigns
  Parallel: content-intelligence — launch content, social
  Parallel: growth-analytics (Catalyst) — SEO, analytics tracking
  Handoff from Phase 3: Copy assets, narrative framework
  Output: Live campaigns, content calendar, tracking dashboards
```

---

### 3. Strategic Pivot

**When:** Reassessing business direction, major strategic decision.

**Squads:** strategic-council, research-intelligence, financial-intelligence, product-systems

**Sequence:**
```
Phase 1: Counsel & Research
  Lead: strategic-council (Zenith) — advisory session
  Parallel: research-intelligence (Prism) — market/competitive data
  Output: Strategic recommendations, market analysis

Phase 2: Financial Viability
  Lead: financial-intelligence (Ledger) — modeling scenarios
  Handoff from Phase 1: Strategic options, market data
  Output: Financial models, risk assessment, scenario comparison

Phase 3: Product Redesign
  Lead: product-systems (Vector) — updated roadmap
  Handoff from Phase 2: Chosen scenario, financial constraints
  Output: New product strategy, updated roadmap, revised OKRs
```

---

### 4. Content Marketing Engine

**When:** Building a systematic content machine for organic growth.

**Squads:** content-intelligence, copywriting-persuasion, growth-analytics, brand-system

**Sequence:**
```
Phase 1: Foundation
  Lead: brand-system (Meridian) — voice guidelines (if not yet defined)
  Parallel: growth-analytics (Catalyst) — keyword research, SEO audit
  Output: Brand voice doc, keyword map, SEO opportunities

Phase 2: Strategy
  Lead: content-intelligence — pillar content, editorial calendar
  Handoff from Phase 1: Voice guidelines, keyword map
  Output: Content strategy, editorial calendar, topic clusters

Phase 3: Production
  Lead: content-intelligence — article production
  Parallel: copywriting-persuasion (Quill) — headlines, CTAs, email
  Handoff from Phase 2: Content calendar, topic briefs
  Output: Published content, email sequences, social posts

Phase 4: Optimization
  Lead: growth-analytics (Catalyst) — performance tracking, CRO
  Handoff from Phase 3: Published URLs, conversion points
  Output: Performance dashboard, optimization recommendations
```

---

### 5. Investor Pitch Preparation

**When:** Preparing for fundraising or investor meetings.

**Squads:** narrative-masters, financial-intelligence, commercial-systems, brand-system, research-intelligence

**Sequence:**
```
Phase 1: Data Gathering
  Lead: financial-intelligence (Ledger) — financials, projections
  Parallel: commercial-systems (Pipeline) — revenue data, pipeline
  Parallel: research-intelligence (Prism) — market size, trends
  Output: Financial model, revenue metrics, market data

Phase 2: Narrative Design
  Lead: narrative-masters (Arc) — pitch structure, story
  Handoff from Phase 1: All data and metrics
  Output: Pitch narrative, key messages, story arc

Phase 3: Visual Polish
  Lead: brand-system (Meridian) — pitch deck design
  Handoff from Phase 2: Pitch narrative, structure
  Output: Designed pitch deck, branded materials
```

---

### 6. Security & Compliance Audit

**When:** Ensuring the business meets security and compliance requirements.

**Squads:** cyber-defense, research-intelligence

**Sequence:**
```
Phase 1: Assessment
  Lead: cyber-defense (Fortress) — security audit, vulnerability scan
  Output: Audit report, vulnerability list, risk matrix

Phase 2: Compliance Research
  Lead: research-intelligence (Prism) — regulatory research (if needed)
  Parallel: cyber-defense (Fortress) — compliance gap analysis
  Handoff from Phase 1: Audit findings
  Output: Compliance roadmap, remediation plan

Phase 3: Remediation Guidance
  Lead: cyber-defense (Fortress) — implementation guidance
  Output: Remediation playbook, security policies
```

---

### 7. Full Digital Presence Build

**When:** Creating a complete online presence from scratch.

**Squads:** brand-system, digital-experience, content-intelligence, creative-animations, copywriting-persuasion, growth-analytics, paid-media

**Sequence:**
```
Phase 1: Brand + UX (parallel)
  brand-system (Meridian) → brand foundation
  digital-experience (Nexus) → UX research, wireframes

Phase 2: Design + Copy (parallel, depends on Phase 1)
  digital-experience (Nexus) → UI design with brand tokens
  copywriting-persuasion (Quill) → all website copy
  creative-animations (Kinetic) → animation concepts

Phase 3: Build + Content (parallel, depends on Phase 2)
  creative-animations (Kinetic) → animation implementation
  content-intelligence → launch content, blog, social

Phase 4: Launch + Growth (parallel, depends on Phase 3)
  growth-analytics (Catalyst) → SEO, analytics, tracking
  paid-media (Apex) → launch ad campaigns
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|-------------|---------|-----------------|
| Skip brand foundation | Copy, content, and UX lack coherence | Always start with brand-system if brand is undefined |
| Parallel when serial needed | Squad B works without Squad A's output | Map dependencies first, only parallelize independent WPs |
| No handoff specification | Receiving squad lacks context | Always define handoff content, format, and expectations |
| Too many squads at once | Coordination overhead exceeds value | Max 4-5 squads per initiative; phase the rest |
| No lead squad | Deliverables are fragmented | Always designate one lead squad for final synthesis |
| Micromanaging squads | Imperator tries to control domain execution | Squads are autonomous; Imperator coordinates, not executes |
| Ignoring strategic-council | Major decisions made without advisory | Invoke strategic-council for any decision with high uncertainty |

## Coordination Principles

1. **Parallel when independent, serial when dependent** — Never wait unnecessarily, never skip prerequisites.
2. **Handoffs carry context, not just files** — Include decisions made, constraints, and expectations.
3. **Lead squad owns synthesis** — One squad assembles the final deliverable.
4. **Squads are autonomous** — Imperator coordinates the "what" and "when", squads own the "how".
5. **Gates between phases** — Validate output before passing downstream.
6. **Max 4-5 active squads** — More than that creates coordination overhead. Phase the rest.
7. **Strategic council for uncertainty** — When the right path is unclear, consult before executing.

