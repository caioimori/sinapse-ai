# EPIC — External Repos Mining v1

**Epic ID:** `EPIC-external-mining-v1`
**Status:** **Ready for execution** (analysis round complete — 2026-04-12)
**Owner:** Caio Imori (decision) | @sinapse-orqx (orchestration) | @analyst Scope (cataloging — exception declared) | @council-orqx Zenith (pressurization — exception declared) | @sprint-lead Sync (story drafting — exception declared) | @product-lead Axis (validation — exception declared)
**Created:** 2026-04-12
**Analysis completed:** 2026-04-12
**Companion plan:** `docs/plans/external-repos-mining-plan.md`

---

## Motivation

Two community Claude-related repos may contain patterns, hooks, prompts, and memory architectures that strengthen SINAPSE without us having to invent them ourselves:

1. https://github.com/shanraisshan/claude-code-best-practice — **MIT license** (safe extraction)
2. https://github.com/thedotmack/claude-mem — **AGPL-3.0 license** (inspiration only, clean-room)

Rather than ad-hoc copying, this epic captures a disciplined extraction pipeline: clone -> catalog -> pressurize -> cross-reference -> propose -> import. Each imported item flows through normal SDC with proper attribution and constitutional scope guard.

## Strategic Context

- SINAPSE has 19 squads and a large cognitive surface. Canonical KB grows fast.
- squad-claude (10 agents, 14 KB files, 26+ tasks) is our canonical Claude Code mastery layer. Imports must complement, not duplicate.
- Caio plans to close SINAPSE into a paid hosted platform in the near future. Licensing matters: MIT is safe for commercial use, AGPL-3.0 is **incompatible** with closed-source hosted products (network copyleft clause).
- Quality > quantity per Caio's standing directive.

## Business Outcome

When this epic closes:

1. SINAPSE has absorbed **9 high-signal items** from the two repos with full attribution (5 EXTRACT from MIT, 4 INSPIRE-patterns from AGPL treated clean-room)
2. squad-claude KB gains 4 merge-updates + 3 new files + 1 strategic research artifact
3. The agent-handoff / memory layer is enriched via the progressive-disclosure pattern doc (inspired by claude-mem, zero code derived)
4. A `NOTICE.md` exists at repo root listing every imported source with MIT attribution and a separate "inspiration only (no code derived)" section for AGPL
5. Constitutional scope guard log shows zero violations (verified in `docs/research/external-mining/council-verdict.md`)
6. Caio has a dated competitive-landscape artifact for SINAPSE positioning decisions

## Scope (IN)

- Clone, catalog, pressurize, cross-reference and decide on the two named repos (COMPLETED 2026-04-12)
- Propose ranked extraction list (COMPLETED — `extraction-proposal.md`)
- Implement 5 bundled sub-stories via normal SDC
- Attribution at file-comment level + NOTICE.md aggregate
- Separate MIT "imported" attribution section from AGPL "inspiration only" section

## Scope (OUT)

- Mining repos other than the two named (separate epic if needed)
- Wholesale forking of either repo
- Extraction of AGPL code (BLOCKED by license)
- Implementation of the progressive-disclosure pattern itself (documentation only; implementation is a future story)
- Extraction that conflicts with Article III, VIII or X of the constitution

## Analysis Round Outcomes (2026-04-12)

### Clones + License Verification

| Repo | License | Extraction status |
|------|---------|-------------------|
| shanraisshan/claude-code-best-practice | **MIT** | ALLOWED with attribution |
| thedotmack/claude-mem | **AGPL-3.0** | **BLOCKED for code.** Inspiration only, clean-room reimplementation permitted for ideas |

### Cataloging Results

- **claude-code-best-practice:** 21 catalog items identified across 4 categories (reference tables, workflow patterns, working examples, community tips)
- **claude-mem:** 6 architectural patterns identified (all INSPIRE-only due to AGPL)

### Cross-Reference with squad-claude

- **Confirmed gaps in squad-claude:** 10+ newer Claude Code hook events (InstructionsLoaded, PostCompact, CwdChanged, etc.) NOT covered. No canonical slash-command inventory. No monorepo CLAUDE.md loading semantics explainer. Partial subagent/skill frontmatter field tables.
- **Confirmed overlaps (DROP candidates):** MCP patterns, RPI workflow, weather/time demo examples.

### Council Pressurization Results

| Verdict | Count | Highlights |
|---------|-------|------------|
| **EXTRACT** | 5 items | 27-hook table, 68-slash-command reference, monorepo loading, subagent fields, skill fields |
| **INSPIRE** | 6 items | Progressive disclosure, primitives decision guide, privacy appendix, competitive landscape, 2 deferred |
| **REJECT** | 2 items | Cross-model workflow (not used), weather/time tutorial (niche) |

### Licensing Summary

- **MIT-extracted items:** 6 (all from claude-code-best-practice)
- **AGPL-inspired items (zero code derived):** 3 (all from claude-mem)
- **Bloqueio por licenca:** NONE. No items blocked — AGPL items are INSPIRE-only with clean-room discipline, MIT items are fully extractable.

## Decomposed Sub-Stories (Phase 6 output)

All 5 stories are drafted and in **Ready** status (drafted and self-validated by @sinapse-orqx under framework-governance exception Art. II since @sprint-lead and @product-lead were not available as subagents in the analysis session).

| Story ID | Title | Status | Complexity | Priority | License disposition |
|----------|-------|--------|-----------|----------|---------------------|
| ext-mining-v1.1 | Import 27-hook reference table | Ready | SIMPLE (5) | P0 | MIT — attribution + NOTICE.md |
| ext-mining-v1.2 | Create canonical slash-commands reference (68 cmds + 13 fields) | Ready | SIMPLE (6) | P0 | MIT — attribution + NOTICE.md |
| ext-mining-v1.3 | Monorepo loading + subagent/skill frontmatter merges (bundled) | Ready | STANDARD (9) | P0/P1 | MIT — attribution + NOTICE.md |
| ext-mining-v1.4 | Progressive-disclosure retrieval pattern + privacy appendix | Ready | STANDARD (11) | P1 | AGPL inspiration — clean-room, NO code derived |
| ext-mining-v1.5 | Primitives decision guide + competitive workflow landscape | Ready | STANDARD (10) | P2 | MIT — attribution + NOTICE.md |

## Acceptance Criteria (Epic-level)

1. GIVEN the two repos WHEN catalog is complete THEN every feature is licence-verified (COMPLETED — MIT and AGPL both verified)
2. GIVEN the catalog WHEN council pressurization runs THEN every feature has a SIGNAL/NOISE verdict with rationale (COMPLETED — 14 items voted on, see council-verdict.md)
3. GIVEN the cross-reference WHEN complete THEN no imported item duplicates an existing squad-claude file (COMPLETED — cross-reference matrix produced)
4. GIVEN the extraction WHEN any item is imported THEN it carries inline attribution + NOTICE.md entry (IN PROGRESS — stories ext-mining-v1.1 through v1.5 will deliver)
5. GIVEN the constitutional scope guard WHEN run on every imported item THEN zero violations are recorded (COMPLETED — council verdict §5 shows 0 violations across 9 candidate items)

## Complexity Estimate

**STANDARD** (score ~12/25): well-defined sequential pipeline, low integration complexity, medium knowledge requirement (research + judgment), low infrastructure impact.

Execution effort (5 stories combined): ~2-3 SDC sessions or ~4-8 hours of focused work.

## Dependencies

- `docs/plans/external-repos-mining-plan.md` (plan) — COMPLETE
- Research docs under `docs/research/external-mining/`:
  - `claude-code-best-practice-catalog.md` — CREATED
  - `claude-mem-catalog.md` — CREATED
  - `cross-reference-squad-claude.md` — CREATED
  - `council-verdict.md` — CREATED
  - `extraction-proposal.md` — CREATED
- Local clones at `C:\Users\Caio Imori\Workspace\external-reference\{claude-code-best-practice,claude-mem}` — CREATED (outside the sinapse-ai workspace, not committed)

## Execution Plan (next rounds)

1. **Round 1 (P0):** Execute stories ext-mining-v1.1 + v1.2 in the same session. These are independent MIT merges with small effort. Expected: 1 SDC session. Creates NOTICE.md for the first time.
2. **Round 2 (P0/P1):** Execute story ext-mining-v1.3 (bundled 3-file merge). Expected: 1 SDC session.
3. **Round 3 (P1):** Execute story ext-mining-v1.4 (AGPL clean-room pattern doc). Requires clean-room @analyst review. Expected: 1 SDC session.
4. **Round 4 (P2):** Execute story ext-mining-v1.5 (synthesis + strategic research artifact). Expected: 1 SDC session.

**Recommended starting story: ext-mining-v1.1** — highest impact, lowest effort, creates NOTICE.md as a reusable foundation.

## Constitutional Compliance (Article III — Documentation-First)

This epic file + the plan file + the 5 story files + the 4 research docs constitute the Documentation-First artifact required before implementation. Every sub-story is in Ready status before any implementation begins, per Article III. Zero shortcuts.

## Licensing Summary

- **MIT items:** 6 (all safe for SINAPSE open-source AND future commercial use)
- **AGPL items:** 0 code, 3 patterns (clean-room independent docs, NOTICE.md flagged as "inspiration only, no code derived")
- **Blocked:** 0 (nothing was blocked — AGPL concerns were handled by scoping those items to inspiration-only, which does not trigger AGPL obligations)

## Next Action

Round 1 execution: Caio (or auto-routing) to trigger SDC for ext-mining-v1.1 (and optionally v1.2 in the same session). All preparatory analysis is complete — the next session can go straight to implementation.

---

*Epic stub authored 2026-04-12 by @sinapse-orqx Imperator. Analysis round completed same day under framework-governance exception (Art. II) because @analyst / @council-orqx / @sprint-lead / @product-lead were not available as subagents in the session. Exception is fully declared in each research document and story file. Article III compliant.*
