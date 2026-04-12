# EPIC — Framework Upgrade v2 (Squads + Core Engine)

**Epic ID:** `EPIC-framework-upgrade-v2`
**Status:** In Progress
**Owner:** Caio Imori (via @sinapse-orqx Imperator orchestration)
**Created:** 2026-04-12
**Version Target:** Framework-wide v2 consolidation
**Orchestration Plan:** This document

---

## Strategic Context

SINAPSE reached the point where the infrastructure (installer, CI, hooks, push authority, registry) is stable (epics 9 and 10 closed). The next lever is **framework depth**: the squads that produce the actual user-facing deliverables (brand, design, content, copy, art direction) and the engine primitives that every agent depends on (tasks, templates, workflows, handoff).

Caio's briefing (2026-04-12) redirected all upgrade work from `sinapse-plataform` to the framework itself. The mandate: take the 5 most-used squads plus the core engine and raise the ceiling on each — **not by rewriting**, but by **targeted upgrades** that close high-leverage gaps identified during a rigorous diagnostic pass.

This epic is the orchestration umbrella. Each squad is a sub-story. The core engine is a sub-story. Nothing here is greenfield; every upgrade is additive or corrective, per Article IV (No Invention).

## Business Outcome

When this epic closes, SINAPSE will have:

1. **squad-artdir v2.0 finalized** — the in-progress expansion (v1 LP-only to v2 Platform/SaaS) moved all the way through QA and merged.
2. **squad-design v2.0** — a canonical cross-surface token KB, DX agent persona refinement pass, design-to-code pipeline KB refresh.
3. **squad-brand v2.0** — AI visual generation canon, brand-ops playbook, platform/SaaS token extension bridge (handoff contract with Atlas from artdir v2).
4. **squad-content v2.0** — agent count rebalanced against the 90-task load, signal intelligence v2 KB, AI-native content loop playbook.
5. **squad-copy v2.0** — RSA/Google Ads v2 specialist addition, AI-copy human-in-the-loop playbook, cross-lingual conversion KB.
6. **Core engine v2 intervention** — one high-leverage improvement to the engine primitive most responsible for agent efficiency (handoff compaction / story lifecycle enforcement).

## Scope (IN)

- One sub-story per squad listed above (5 total)
- One sub-story for core framework engine intervention (1 total)
- Upgrade cadence is **additive** — no v1 agent/task/KB is removed unless explicitly deprecated in the story
- Each sub-story declares its own IN/OUT, AC, dependencies, owner agents
- Each sub-story is validated (@product-lead) before implementation
- Each sub-story goes through its own SDC (draft → validate → implement → qa → push)
- PRs may be consolidated (single PR for the whole epic) or split per squad — decided at implementation time based on review feedback

## Scope (OUT)

- `sinapse-plataform` / forum work (explicitly out of scope by Caio briefing)
- Infrastructure changes (hooks, CI, push authority — those are covered by epic 10)
- Touching files being actively modified by `caio/fix/operational-hooks` branch (`.claude/hooks/enforce-git-push-authority.sh`, `.sinapse-ai/core/code-intel/registry-syncer.js`) — at the time of this epic creation those changes are already merged in `main` via PR #39, so the constraint is lifted.
- Rewriting any v1 squad/agent from scratch
- New squads (this epic only upgrades the existing 5)
- Core engine rewrite — only targeted surgical interventions

## Sub-Stories

| Story ID | Title | Squad/Area | Status |
|----------|-------|------------|--------|
| fw-v2.1 | squad-artdir v2.0 finalization (close story 2.1 + 2.3) | squad-artdir | Done |
| fw-v2.2 | squad-design cross-surface token canon + DX persona refinement | squad-design | Ready (handoff prepared) |
| fw-v2.3 | squad-brand AI visual generation canon + platform bridge | squad-brand | Ready (handoff prepared) |
| fw-v2.4 | squad-content agent rebalance + AI-native loop | squad-content | Done (runtime — see note) |
| fw-v2.5 | squad-copy AI human-in-the-loop playbook + cross-lingual | squad-copy | Ready (handoff prepared) |
| fw-v2.6 | Core engine intervention — agent handoff compaction enforcer | core | Done |

### Status Notes (2026-04-12 update)

- **fw-v2.1 Done** — Closed via PR #41 (squad-artdir v2.0 platform expansion + handoff enforcer + framework upgrade epic)
- **fw-v2.6 Done** — Handoff compaction enforcer task `generate-agent-handoff.md` shipped via PR #41 + workflow integration in `story-development-cycle.yaml`
- **fw-v2.4 Done (runtime)** — All 5 ACs PASS per QA gate `docs/qa/gates/fw-v2.4-content-qa-gate.yml`. Deliverables on disk:
  - `squads/squad-content/knowledge-base/ai-native-content-loop.md` (canon 6-phase loop)
  - `squads/squad-content/knowledge-base/task-ownership-map.md` (90-task ownership matrix, 0 orphans)
  - `squads/squad-content/knowledge-base/signal-intelligence-v2.md` (2026 source landscape + classification + scoring)
  - `squads/squad-content/squad.yaml` reconciled to v2.0.0 (KB count 16 → 32, agent_task_ownership block added, full changelog)
  - **GOVERNANCE FINDING (medium):** `squads/squad-content/*` is gitignored in this repo per `.gitignore` line 61 (`squads/*` blocked, only 3 squads whitelisted: claude-code-mastery, squad-animations, squad-artdir). The work is delivered at the runtime layer (on disk) but cannot ship via PR until @devops decides between (a) whitelisting squad-content for publication, (b) moving squad-content to a sibling published repo, or (c) creating a sync mechanism to `~/.sinapse/squad-content/`. The same issue affects fw-v2.2, fw-v2.3, fw-v2.5 — none of those squads are whitelisted either.
- **fw-v2.2, fw-v2.3, fw-v2.5 Ready** — Story files on disk + structured handoff artifacts prepared at `docs/handoffs/framework-v2-{design,brand,copy}.yaml` (also gitignored — workspace artifacts) ready for next-session execution by `@design-orqx`, `@brand-orqx`, `@copy-orqx`. Each handoff contains the AC contract, deliverables expected, scope IN/OUT, dependencies, and concrete next action.

### Cross-cutting governance issue (raised 2026-04-12)

The four "squad upgrade" sub-stories (fw-v2.2 through fw-v2.5) all target squads that are gitignored in the `sinapse-ai` repo. This is a deliberate framework boundary: only `claude-code-mastery`, `squad-animations`, and `squad-artdir` are published. Before fw-v2.2, fw-v2.3 and fw-v2.5 are executed, Caio + @devops should decide the publishing model so the work either ships in-repo or in a clearly-defined external location. Without this decision, the upgrade work remains a per-machine runtime artifact rather than a framework deliverable.

## Dependencies

- `EPIC-artdir-v2` must be closed (or rolled into fw-v2.1) before fw-v2.3 can finalize the brand-to-platform token bridge (Meridian ↔ Atlas handoff contract).
- `EPIC-framework-upgrade-v2` depends on main being clean of hooks work (satisfied: PR #39 merged 2026-04-12).
- Research (`@analyst` Scope) is an upstream dependency for fw-v2.3, fw-v2.4, fw-v2.5 where benchmark material is required.

## Acceptance Criteria (Epic-level)

1. GIVEN the 6 sub-stories WHEN all close THEN every target squad's `squad.yaml` declares version `>= 2.0.0` and its metadata counts match disk reality (no drift between declared and actual).
2. GIVEN the core engine intervention WHEN delivered THEN at least one measurable improvement in agent handoff efficiency is documented (before/after token count, or enforcement gate added).
3. GIVEN the full epic WHEN merged to `main` THEN no v1 agent/task/KB file is deleted; all changes are additive or corrective.
4. GIVEN the sub-stories WHEN each goes through QA gate THEN gate file verdict is PASS or CONCERNS (never FAIL merged).
5. GIVEN this epic WHEN complete THEN the `MEMORY.md` for `@sinapse-orqx` is updated with a one-line summary of the upgrade and pointer to this epic file.

## Complexity Estimate

**COMPLEX** (score ~17/25): large scope (5 squads + core), low risk per sub-story but high coordination overhead, no infra changes, well-defined deliverables, additive only.

## Orchestration Plan (by Imperator)

### Phase 1 — Consolidate artdir v2 (in-flight)
- **Lead:** @project-lead (Beacon)
- **Executors:** @quality-gate (Litmus) for QA gate on story 2.1, @devops (Pipeline) for PR close
- **Handoff:** Once 2.1 is Done, epic-artdir-v2 closes, unlocks fw-v2.3 brand bridge

### Phase 2 — Squad diagnostics & story drafting (parallel)
- **Lead:** @sprint-lead (Sync)
- **Executors in parallel:**
  - @design-orqx (Nexus) → drafts fw-v2.2 content
  - @brand-orqx (Meridian) → drafts fw-v2.3 content
  - @content-orqx → drafts fw-v2.4 content
  - @copy-orqx (Quill) → drafts fw-v2.5 content
- **Handoff:** Drafts returned to @sprint-lead who packages them in the SINAPSE story template

### Phase 3 — Validation gate
- **Lead:** @product-lead (Axis)
- **Action:** Run 10-point validation on all 5 new stories, transition Draft → Ready

### Phase 4 — Implementation (sequential per story, parallel tool calls within)
- **Lead:** @developer (Pixel) with squad-orqx pairing per story
- **Handoff:** Each story's File List maintained in story file

### Phase 5 — QA Gate + Push
- **Lead:** @quality-gate (Litmus) → @devops (Pipeline)
- **Action:** One consolidated PR `caio/feat/framework-upgrade-v2` to `main`

---

## Documentation-First Compliance (Article III)

This epic file itself IS the Documentation-First artifact required before ANY implementation proceeds. Sub-stories will be created in `docs/stories/` with the `fw-v2.{N}` prefix. No code is written until each sub-story reaches Ready status.

## Notes on Realistic Execution

Caio's briefing explicitly says: "qualidade > quantidade. Se der pra entregar 3 squads perfeitos e 2 no mínimo, melhor que 5 meia-bomba." This epic captures the full target, but Imperator explicitly acknowledges that materializing all 6 sub-stories in a single execution session is **not realistic**. The honest delivery model is:

- **Turn 1 (2026-04-12 morning):** Created epic + 6 sub-stories (Ready), closed artdir v2.1 finalization (PR #41), implemented 1 core engine intervention (handoff compaction enforcer task in PR #41). fw-v2.1 + fw-v2.6 → Done.
- **Turn 2 (2026-04-12 afternoon, this turn):** Executed fw-v2.4 end-to-end at the runtime layer (3 KBs + yaml reconciliation, QA gate PASS 9.5/10). Surfaced cross-cutting governance finding: squad-content/squad-design/squad-brand/squad-copy are all gitignored, blocking PR-based delivery. Prepared structured handoff artifacts for fw-v2.2/2.3/2.5 in `docs/handoffs/framework-v2-{design,brand,copy}.yaml` so next-session execution starts with full context.
- **Turn 3+ (next sessions, after governance decision):** Execute fw-v2.2 / fw-v2.3 / fw-v2.5 once Caio + @devops decide the squad publishing model. Each handoff carries the full contract; specialist orqx (Nexus / Meridian / Quill) drives execution from there.

This is documented so a future session (human or agent) can resume without ambiguity about what remains.

---

*Epic drafted by @sinapse-orqx Imperator | Documentation-First Article III compliant | Generated 2026-04-12*
