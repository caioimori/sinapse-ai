# AI-Native Content Loop — Canon Playbook

> **Status:** Canon (squad-content v2.0)
> **Owner:** content-orqx (Bulletin) with cross-agent collaboration
> **Created:** 2026-04-12 for Story fw-v2.4
> **Relationship to existing KBs:** Builds on `content-spine-engine.md`, `ai-leverage-content-framework.md`, `content-measurement-framework.md` and `ai-content-production.md`. This KB is the **canonical end-to-end pipeline** — the other KBs are mechanisms inside phases of this loop.

---

## 1. Why This Exists

In 2026, the content pipeline for any mature SINAPSE user is no longer `brief → writer → editor → publish → measure`. AI assistance is now a load-bearing layer at every step, and the real bottleneck has shifted to **where humans intervene and why**.

This playbook canonizes the 6-phase loop that squad-content runs for every content program, regardless of client, language or platform. It makes the human-in-the-loop decision explicit so that AI-native work does not mean commodity work.

## 2. The 6-Phase Loop

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│   1. SIGNAL → 2. AI DRAFT → 3. HUMAN EDIT → 4. PLATFORM ADAPT →       │
│         ↑                                                  ↓          │
│         └────────── 6. RETROFEED ←── 5. MEASURE ←──────────┘          │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

The loop is **closed** on purpose. Phase 6 (Retrofeed) is what turns a one-shot pipeline into a compounding asset.

---

## 3. Phase-by-Phase Specification

### Phase 1 — SIGNAL

| Field | Value |
|-------|-------|
| **Lead agent** | `signal-intelligence` (Radar) |
| **Inputs** | Editorial pillars, client brief, calendar gaps, opportunity windows |
| **Outputs** | Classified signal (type, temperature, pillar, opportunity window), signal brief (1 paragraph + evidence) |
| **Tool stack** | Google Trends, X/Twitter API v2, TikTok Research API, Reddit API, Apify actors, Substack RSS, YouTube Data API, Exploding Topics, SparkToro |
| **Quality gate** | Signal-quality score ≥ 3/5 on (relevance, novelty, evidence, actionability, pillar fit) |
| **Failure modes** | Low-evidence hype, pillar drift, redundant signal (already covered), stale signal (window closed), competitor-exclusive signal (not adaptable) |
| **Hands off to** | Phase 2 only if quality gate passes; otherwise returns to source scan or archives signal with notes |

### Phase 2 — AI DRAFT

| Field | Value |
|-------|-------|
| **Lead agent** | `content-engineer` (Arc) with structured prompt template |
| **Inputs** | Signal brief, Espinha Dorsal template (tese/mecanismo/prova/direcao), client voice profile, format target |
| **Outputs** | First-draft artifact (carousel/post/thread/script/article) grounded on the Espinha Dorsal; draft-confidence score (self-reported by the AI), list of claims needing verification |
| **Tool stack** | Claude / GPT / in-house prompts (see `ai-content-production.md`), retrieval over client KBs for voice lock, `content-spine-engine.md` as structural contract |
| **Quality gate** | Draft has: (a) one thesis explicit, (b) mechanism explained, (c) at least 1 proof item, (d) direction/CTA, (e) no invented facts flagged, (f) voice within ±1 on Halvorson Voice & Tone scale |
| **Failure modes** | Drift from Espinha Dorsal, invented facts ("hallucination"), commodity phrasing, voice drift, format-agnostic output that ignores target platform |
| **Hands off to** | Phase 3 with structured annotations from the AI (what it is confident about, what it is guessing) |

### Phase 3 — HUMAN EDIT

| Field | Value |
|-------|-------|
| **Lead agent** | `editorial-strategist` (North) for high-stakes content; `content-governor` (Index) for compliance/voice enforcement; human editor in the client-side loop |
| **Inputs** | AI draft + AI annotations, client voice profile, brand guidelines from squad-brand, editorial preferences log |
| **Outputs** | Edited master version (format-agnostic), edit-reason log (what was changed and why), voice-lock confirmation |
| **Tool stack** | Markdown diff, `content-quality-checklist.md`, `editorial-governance.md`, preference tracking (`preferences/`) |
| **Quality gate** | Zero invented facts remaining, voice within ±0.5, E-E-A-T signals preserved or added, claims either removed or cited, hook/pattern-interrupt verified per `viral-potential-scoring.md` |
| **Failure modes** | Over-editing (losing AI's useful phrasing), under-editing (shipping invented facts), voice-scrubbing (removing brand specificity), missing human-in-the-loop on high-stakes pieces |
| **Hands off to** | Phase 4 after the master version is signed off |

### Phase 4 — PLATFORM ADAPT

| Field | Value |
|-------|-------|
| **Lead agent** | `platform-specialist` (Morph) |
| **Inputs** | Edited master version, target platform set, `template-contract-system.md` contracts |
| **Outputs** | Platform-native variants (carousel for IG, thread for X, reel script, LinkedIn post, newsletter section, etc.), each bound to a Template Contract |
| **Tool stack** | `platform-algorithm-intelligence.md`, `content-atomization-repurposing.md`, `template-contract-system.md`, platform previewers, character counters |
| **Quality gate** | Each variant respects its Template Contract 100% (character limits, field counts, formatting); algorithmic hooks verified per `verify-algorithmic-hooks` task; no variant loses the core thesis during atomization |
| **Failure modes** | Contract violations, hook dilution, algorithm mismatch (wrong format for platform), lost thesis in atomization, copy-paste across platforms without nativization |
| **Hands off to** | Phase 5 via client publishing pipeline (outside squad authority) |

### Phase 5 — MEASURE

| Field | Value |
|-------|-------|
| **Lead agent** | `content-analyst` (Lens) |
| **Inputs** | Published variants across platforms, analytics windows (24h, 7d, 30d), client KPIs |
| **Outputs** | Performance report per variant + cross-platform rollup; top-performer identification; underperformer diagnosis; retrofeed dataset |
| **Tool stack** | Parse.ly, Semrush, BuzzSumo, native analytics APIs, `content-scoring-models.md`, `content-measurement-framework.md`, `viral-potential-scoring.md` |
| **Quality gate** | Metrics collected for every variant (no missing variants), attribution model applied, benchmarks set, insights ranked by actionability |
| **Failure modes** | Vanity metrics only, no attribution, missing variants, retroactive benchmark inflation, platform-silo analysis with no cross-platform rollup |
| **Hands off to** | Phase 6 with structured retrofeed payload |

### Phase 6 — RETROFEED

| Field | Value |
|-------|-------|
| **Lead agent** | `content-orqx` (Bulletin) as coordinator; updates flow to Radar (signal tuning), North (pillar/calendar adjustment), Arc (prompt library update), Morph (template contract refinement), Index (preference log) |
| **Inputs** | Phase 5 performance dataset, hypotheses that produced each piece, prompt versions used |
| **Outputs** | Updated signal-quality scoring weights, refined editorial pillars, refreshed AI prompt library, updated template contracts, updated preferences/ log for the client |
| **Tool stack** | `generate-retrofeed-insights` task, preference log template, `ai-content-production.md` prompt library versioning |
| **Quality gate** | Every update is traceable to a phase-5 insight (no invented tuning); previous prompt/pillar/contract versions archived, not overwritten |
| **Failure modes** | Retrofeed ignored ("one-shot pipeline"), overfitting to single-post noise, loss of previous version history, no communication of changes to the other phases |
| **Hands off to** | Phase 1 of the next cycle (loop closes) |

---

## 4. Human-in-the-Loop Decision Tree

The biggest decision of the AI-native loop is **when AI draft ships with light touch vs. when a human must intervene heavily**. This decision happens at the Phase 2 → Phase 3 transition.

```
                     ┌──────────────────┐
                     │  AI draft ready  │
                     └────────┬─────────┘
                              │
                    Has any of these?
       ┌──────────────────────┴─────────────────────┐
       │ YES                                        │ NO
       ▼                                            ▼
  Human REQUIRED                             Evaluate stakes
  (Heavy intervention)                        and signals
       │                                            │
       │                                            ▼
       │                               ┌────────────────────┐
       │                               │ High-stakes piece? │
       │                               │ (Manifesto,        │
       │                               │ flagship, PR,      │
       │                               │ crisis response)   │
       │                               └────┬───────────┬───┘
       │                                    │ YES       │ NO
       │                                    ▼           ▼
       │                              Human heavy   Awareness
       │                              review        level high?
       │                                            (L4/L5
       │                                             Schwartz)
       │                                                 │
       │                                        ┌────────┴───────┐
       │                                        │ YES            │ NO
       │                                        ▼                ▼
       │                                   Human light      AI draft
       │                                   review only      can ship
       │                                   (craft polish)   with voice
       │                                                    check only
       └── "Human REQUIRED" triggers:
           - Invented fact flagged by AI itself
           - Legal/compliance topic (health, finance, legal)
           - Crisis response or reputation-sensitive
           - Brand new concept not covered in prior content
           - Voice drift score >1.0 on client voice-tone scale
           - Opinion piece or manifesto (voice IS the product)
```

### Gate Signals Table

| Signal | Weight | Where to check |
|--------|--------|---------------|
| Copy/content type (opinion vs informational) | HIGH | Editorial calendar tag |
| Market awareness level (Schwartz L1-L5) | HIGH | Editorial brief + audience research |
| Stakes (flagship/manifesto vs daily post) | HIGH | Editorial pillars priority |
| Brand voice criticality | MEDIUM | Client preferences log |
| Legal/compliance category | CRITICAL | `validate-content-compliance` task |
| AI self-reported confidence | MEDIUM | Phase 2 annotations |
| Novelty of subject matter | MEDIUM | Prior content overlap check |

---

## 5. Tool Stack per Phase (Canonical Stack)

| Phase | Required KBs | Required Tasks | Required Templates |
|-------|-------------|----------------|-------------------|
| 1. Signal | `signal-detection-methods.md`, `signal-intelligence-v2.md`, `competitor-analysis-methods.md` | `scan-daily-signals`, `classify-signal-temperature`, `map-signal-to-pillar` | `weekly-signal-briefing-template.md` |
| 2. AI Draft | `content-spine-engine.md`, `ai-content-production.md`, `narrative-structures-library.md`, `hook-formulas-library.md` | `design-content-spine`, `write-*` family | `content-spine-template.md`, `content-brief-template.md` |
| 3. Human Edit | `editorial-governance.md`, `content-quality-criteria.md`, `writing-rules-engine.md`, `brazilian-content-context.md` | `validate-content-quality`, `check-brand-consistency` | `content-quality-checklist.md` |
| 4. Platform Adapt | `template-contract-system.md`, `platform-algorithm-intelligence.md`, `content-atomization-repurposing.md`, `viral-potential-scoring.md` | `adapt-for-*` family, `verify-algorithmic-hooks`, `batch-platform-adaptation` | `template-contract-registry-template.md` |
| 5. Measure | `content-measurement-framework.md`, `content-scoring-models.md`, `eeat-quality-standards.md` | `analyze-content-performance`, `score-content-quality`, `generate-content-report` | `content-performance-report-template.md` |
| 6. Retrofeed | `content-strategy-master-reference.md`, `content-governance-principles.md` | `generate-retrofeed-insights`, `update-content-preferences` | `preference-log-template.md` |

---

## 6. Anti-Patterns (Loop Violations)

- **Shipping Phase 2 as final** — skipping human edit for speed destroys the voice differential.
- **Skipping Phase 6** — without retrofeed the loop becomes a forever-beginner pipeline that never learns from performance.
- **Phase 4 before Phase 3** — platform adapting an unedited draft wastes work when the master version changes.
- **Phase 1 as gut feeling** — signals without quality gates produce noisy calendars and pillar drift.
- **Phase 5 with no attribution** — performance data that can't be traced back to hypotheses cannot retrofeed.
- **Bypassing the Espinha Dorsal at Phase 2** — AI drafts without thesis/mechanism/proof/direction collapse into commodity content.
- **Phase 3 voice-scrubbing** — editors removing brand specificity to make content "safer" kills the differentiation.
- **Cross-platform copy-paste at Phase 4** — ignoring Template Contracts is a contract violation per `template-contract-system.md`.

---

## 7. Success Criteria

The loop is operating at v2 standard when:

1. Every phase has its lead agent identified in the sprint plan
2. Every Phase 2 output carries AI annotations (confidence + claims to verify)
3. Every Phase 4 variant passes its Template Contract before publishing
4. Every cycle closes with a Phase 6 retrofeed payload that updates at least one upstream parameter
5. No piece ships without passing the Phase 3 human-in-the-loop gate
6. Cross-phase metrics are cross-referenced (signal type → performance type)

---

## 8. Relationship to Other Canon KBs

- `content-spine-engine.md` — structural contract for Phase 2 (AI draft must be spine-grounded)
- `template-contract-system.md` — contract enforcement for Phase 4
- `ai-content-production.md` — prompt library feeding Phase 2
- `ai-leverage-content-framework.md` — strategic framing for AI-about-AI pieces specifically
- `signal-intelligence-v2.md` (sibling KB from this story) — source taxonomy for Phase 1
- `task-ownership-map.md` (sibling KB from this story) — which of the 90 tasks live in which phase

---

## Change Log

- 2026-04-12 — v1.0 authored as part of Story fw-v2.4 (squad-content v2.0 upgrade)
