# Task Ownership Map — squad-content v2.0

> **Status:** Canon (squad-content v2.0)
> **Owner:** content-orqx (Bulletin) — curator; all 7 agents contribute via audit
> **Created:** 2026-04-12 for Story fw-v2.4
> **Source of truth:** Disk reality of `squads/squad-content/tasks/` at 2026-04-12 (90 task files)

---

## 1. Why This Exists

squad-content is the heaviest task squad in SINAPSE (90 tasks across 7 agents). Without an explicit ownership map, tasks implicitly belong to the first agent that opened a file, which leads to:

- **Ownership ambiguity** — nobody feels accountable for a given task
- **Over-load and under-load drift** — some agents carry 25+ tasks, others carry 5
- **Orphaned tasks** — legacy tasks with no clear owner
- **Cross-agent duplication** — two agents quietly build parallel versions of the same capability

This KB makes ownership explicit: **every task has exactly one primary agent and zero to two secondary agents.** The yaml `components.agents` block in `squads/squad-content/squad.yaml` will carry a `tasks:` field per agent reflecting this map, so both humans and the framework runtime can resolve ownership deterministically.

---

## 2. Ownership Definitions

| Role | Responsibility |
|------|---------------|
| **Primary** | Owns the task: maintains it, receives the work request first, executes or delegates, accountable for output quality |
| **Secondary** | Collaborates when the primary requests help, adds domain-specific layers (ex: content-governor adds compliance check to a write-* task), can be a reviewer but not the executor |

A task can only have ONE primary. Up to TWO secondaries.

---

## 3. Full Ownership Matrix (90 tasks)

### 3.1 Orchestrator — content-orqx (Bulletin) — 5 primary tasks

| Task | Primary | Secondary | Phase in loop |
|------|---------|-----------|--------------|
| `orchestrate-content-pipeline.md` | content-orqx | — | cross-phase |
| `manage-content-sprint.md` | content-orqx | editorial-strategist | cross-phase |
| `coordinate-cross-squad.md` | content-orqx | — | cross-phase |
| `triage-content-requests.md` | content-orqx | editorial-strategist | pre-phase-1 |
| `triage-urgent-signal.md` | content-orqx | signal-intelligence | phase 1 |

### 3.2 Signal Intelligence (Radar) — 10 primary tasks

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `scan-daily-signals.md` | signal-intelligence | — | 1 |
| `detect-trending-topics.md` | signal-intelligence | — | 1 |
| `map-cultural-signals.md` | signal-intelligence | editorial-strategist | 1 |
| `curate-weekly-briefing.md` | signal-intelligence | content-orqx | 1 |
| `monitor-competitor-content.md` | signal-intelligence | content-analyst | 1 |
| `alert-opportunity-windows.md` | signal-intelligence | editorial-strategist | 1 |
| `classify-signal-temperature.md` | signal-intelligence | — | 1 |
| `map-signal-to-pillar.md` | signal-intelligence | editorial-strategist | 1 |
| `configure-signal-sources.md` | signal-intelligence | content-orqx | 1 |
| `curate-ugc-signals.md` | signal-intelligence | content-governor | 1 |

### 3.3 Editorial Strategist (North) — 10 primary tasks

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `define-big-idea.md` | editorial-strategist | content-orqx | pre-phase-1 |
| `define-editorial-pillars.md` | editorial-strategist | content-orqx, signal-intelligence | pre-phase-1 |
| `create-editorial-calendar.md` | editorial-strategist | platform-specialist | pre-phase-1 |
| `plan-content-sprint.md` | editorial-strategist | content-orqx | pre-phase-1 |
| `align-content-to-funnel.md` | editorial-strategist | — | pre-phase-1 |
| `map-content-gaps.md` | editorial-strategist | content-analyst | 6 (retrofeed) |
| `plan-seasonal-content.md` | editorial-strategist | — | pre-phase-1 |
| `prioritize-themes.md` | editorial-strategist | content-orqx | pre-phase-1 |
| `balance-content-mix.md` | editorial-strategist | platform-specialist | pre-phase-1 |
| `define-content-kpis.md` | editorial-strategist | content-analyst | pre-phase-1 |

### 3.4 Content Engineer (Arc) — 25 primary tasks

Structure mode (11):

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `design-content-spine.md` | content-engineer | editorial-strategist | 2 |
| `design-narrative-arc.md` | content-engineer | — | 2 |
| `structure-carousel-progression.md` | content-engineer | platform-specialist | 2 |
| `structure-video-script.md` | content-engineer | platform-specialist | 2 |
| `design-content-series.md` | content-engineer | editorial-strategist | 2 |
| `apply-storybrand-framework.md` | content-engineer | — | 2 |
| `design-pillar-cluster-model.md` | content-engineer | editorial-strategist | 2 |
| `create-content-brief.md` | content-engineer | content-orqx | 2 |
| `design-hook-system.md` | content-engineer | — | 2 |
| `structure-argument-progression.md` | content-engineer | — | 2 |
| `define-content-depth-levels.md` | content-engineer | editorial-strategist | 2 |

Write mode (12):

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `write-carousel-content.md` | content-engineer | platform-specialist | 2 |
| `write-instagram-caption.md` | content-engineer | platform-specialist | 2 |
| `write-linkedin-post.md` | content-engineer | platform-specialist | 2 |
| `write-blog-article.md` | content-engineer | — | 2 |
| `write-video-script.md` | content-engineer | platform-specialist | 2 |
| `write-reel-script.md` | content-engineer | platform-specialist | 2 |
| `write-newsletter-editorial.md` | content-engineer | editorial-strategist | 2 |
| `write-thread-content.md` | content-engineer | platform-specialist | 2 |
| `write-opinion-post.md` | content-engineer | editorial-strategist | 2 |
| `write-case-study.md` | content-engineer | content-analyst | 2 |
| `write-educational-content.md` | content-engineer | — | 2 |
| `write-product-content.md` | content-engineer | editorial-strategist | 2 |

Verification + Batch (2):

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `verify-algorithmic-hooks.md` | content-engineer | platform-specialist | 3/4 |
| `batch-content-production.md` | content-engineer | platform-specialist | 2 |

### 3.5 Platform Specialist (Morph) — 17 primary tasks

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `adapt-for-instagram-feed.md` | platform-specialist | content-engineer | 4 |
| `adapt-for-instagram-stories.md` | platform-specialist | content-engineer | 4 |
| `adapt-for-instagram-reels.md` | platform-specialist | content-engineer | 4 |
| `adapt-for-linkedin.md` | platform-specialist | content-engineer | 4 |
| `adapt-for-blog-seo.md` | platform-specialist | content-engineer | 4 |
| `adapt-for-tiktok.md` | platform-specialist | content-engineer | 4 |
| `adapt-for-twitter-threads.md` | platform-specialist | content-engineer | 4 |
| `define-posting-schedule.md` | platform-specialist | editorial-strategist | 4 |
| `create-platform-guidelines.md` | platform-specialist | content-governor | 4 |
| `optimize-for-algorithm.md` | platform-specialist | — | 4 |
| `design-content-atomization.md` | platform-specialist | content-engineer | 4 |
| `register-template-contract.md` | platform-specialist | content-governor | 4 |
| `update-template-specs.md` | platform-specialist | content-governor | 4 |
| `adapt-content-language.md` | platform-specialist | — | 4 |
| `batch-platform-adaptation.md` | platform-specialist | content-engineer | 4 |
| `flag-content-for-amplification.md` | platform-specialist | content-analyst | 4/5 |
| `integrate-brand-visual-assets.md` | platform-specialist | — | 4 |

### 3.6 Content Governor (Index) — 12 primary tasks

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `audit-content-library.md` | content-governor | content-analyst | 6 |
| `check-brand-consistency.md` | content-governor | — | 3 |
| `validate-content-quality.md` | content-governor | editorial-strategist | 3 |
| `manage-content-taxonomy.md` | content-governor | — | 6 |
| `organize-content-archive.md` | content-governor | — | 6 |
| `create-content-governance.md` | content-governor | content-orqx | cross-phase |
| `define-content-standards.md` | content-governor | content-orqx | cross-phase |
| `audit-template-compliance.md` | content-governor | platform-specialist | 4/6 |
| `validate-content-compliance.md` | content-governor | — | 3 |
| `process-content-rejection.md` | content-governor | editorial-strategist | 3 |
| `import-existing-content-library.md` | content-governor | — | pre-phase-1 |
| `update-content-preferences.md` | content-governor | content-analyst | 6 |

### 3.7 Content Analyst (Lens) — 11 primary tasks

| Task | Primary | Secondary | Phase |
|------|---------|-----------|-------|
| `analyze-content-performance.md` | content-analyst | — | 5 |
| `score-content-quality.md` | content-analyst | content-governor | 5 |
| `measure-content-roi.md` | content-analyst | — | 5 |
| `track-engagement-patterns.md` | content-analyst | — | 5 |
| `benchmark-against-competitors.md` | content-analyst | signal-intelligence | 5 |
| `evaluate-eeat-compliance.md` | content-analyst | content-governor | 5 |
| `generate-content-report.md` | content-analyst | — | 5 |
| `identify-top-performers.md` | content-analyst | — | 5 |
| `predict-content-performance.md` | content-analyst | — | 5 |
| `analyze-audience-behavior.md` | content-analyst | signal-intelligence | 5 |
| `generate-retrofeed-insights.md` | content-analyst | content-orqx, editorial-strategist | 6 |

---

## 4. Ownership Summary

| Agent | Primary Count | Phase Coverage | Load Category |
|-------|--------------|----------------|---------------|
| content-orqx (Bulletin) | 5 | cross-phase | Coordinator (intentionally light) |
| signal-intelligence (Radar) | 10 | Phase 1 | Balanced |
| editorial-strategist (North) | 10 | Pre-phase / Phase 6 | Balanced |
| content-engineer (Arc) | 25 | Phase 2 | **OVER-LOADED** |
| platform-specialist (Morph) | 17 | Phase 4 | High but coherent |
| content-governor (Index) | 12 | Phase 3 + 6 | Balanced |
| content-analyst (Lens) | 11 | Phase 5 + 6 | Balanced |
| **Total** | **90** | All 6 | — |

---

## 5. Imbalance Audit

### 5.1 content-engineer (Arc) is over-loaded

Arc carries 25 primary tasks — nearly 2x the next-heaviest agent. This is a legitimate imbalance because Arc owns both structural design AND the full writing surface (12 write-* tasks). In v2 we document the imbalance but do **not** create a new agent in this story (see `scope_out` of fw-v2.4).

**Open question for a future story:** should Arc split into `structure-engineer` (design-* + structure-*) + `content-writer` (write-* family)? This is a candidate for fw-v3 or a dedicated refactoring story. Logged here, not executed here.

### 5.2 content-orqx (Bulletin) is intentionally light

5 tasks is correct for the orchestrator — Bulletin delegates and coordinates, never executes write-* or analyze-*. Any attempt to grow Bulletin's primary count is a smell.

### 5.3 Phase 6 (Retrofeed) is thin

Only 3 tasks are explicitly phase-6 primaries (`generate-retrofeed-insights`, `audit-content-library`, `map-content-gaps`, `update-content-preferences`). This may be a real capability gap — retrofeed automation tasks could grow in a future story.

### 5.4 No orphans detected

Every one of the 90 tasks has a clear primary owner. No orphaned tasks found during the audit.

---

## 6. How to Use This Map

1. **Request routing** — When a client request hits `triage-content-requests`, the map determines which agent is invoked.
2. **Runtime enforcement** — The yaml `components.agents[].tasks` field reflects this map for deterministic resolution by the framework.
3. **Load balancing** — Future sprints should use the "Load Category" column to avoid bottlenecking Arc.
4. **Onboarding** — A new operator sees at a glance which agent owns what.
5. **Cross-agent handoffs** — When a primary needs a secondary, this map is the handshake reference.

---

## 7. Update Protocol

This KB must be re-synced whenever:
- A task file is added, removed or renamed in `squads/squad-content/tasks/`
- A new agent joins squad-content
- A task primary changes owner

The re-sync is run by `content-orqx` with co-sign from the affected primary/secondary agents.

---

## Change Log

- 2026-04-12 — v1.0 authored as part of Story fw-v2.4 (squad-content v2.0 upgrade). 90 tasks mapped, 7 agents covered, 0 orphans, Arc over-load formally logged.
