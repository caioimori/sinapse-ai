# EPIC — External Repos Mining v1

**Epic ID:** `EPIC-external-mining-v1`
**Status:** Proposal (not started)
**Owner:** Caio Imori (decision) | @sinapse-orqx (orchestration) | @analyst Scope (cataloging) | @council-orqx Zenith (pressurization)
**Created:** 2026-04-12
**Companion plan:** `docs/plans/external-repos-mining-plan.md`

---

## Motivation

Two community Claude-related repos may contain patterns, hooks, prompts, and memory architectures that strengthen SINAPSE without us having to invent them ourselves:

1. https://github.com/shanraisshan/claude-code-best-practice
2. https://github.com/thedotmack/claude-mem

Rather than ad-hoc copying, this epic captures a disciplined extraction pipeline: clone → catalog → pressurize → cross-reference → propose → import. Each imported item flows through normal SDC with proper attribution and constitutional scope guard.

## Strategic Context

- SINAPSE has 18 squads, 186 agents, 1,430 tasks. The cognitive surface is large.
- squad-claude (8 agents, 26 tasks) is our canonical Claude Code mastery layer. Imports must complement, not duplicate, squad-claude.
- The vault-grounding + per-agent MEMORY.md + agent-handoff layer is our existing memory architecture. claude-mem may offer mechanisms that fill gaps in the compaction or retrieval flow.
- We are time-constrained. Quality > quantity per Caio's standing directive.

## Business Outcome

When this epic closes:

1. SINAPSE has absorbed 0 to N high-signal patterns from the two repos with full attribution
2. squad-claude is enriched (or formally confirmed not to need enrichment from these sources)
3. The agent-handoff / memory layer is enriched (or formally confirmed it does not need help from claude-mem)
4. A `NOTICE.md` exists at repo root listing every imported source
5. Constitutional scope guard log shows zero violations

## Scope (IN)

- Clone, catalog, pressurize and decide on the two named repos
- Cross-reference catalog against existing squad-claude
- Propose ranked extraction list
- Implement accepted items via normal SDC (one story per cluster of related items)
- Attribution at file-comment level + NOTICE.md aggregate

## Scope (OUT)

- Mining repos other than the two named (separate epic if needed)
- Wholesale forking of either repo
- Extraction without licence verification (BLOCKED by §3.1 of the plan)
- Extraction that conflicts with Article III, VIII or X of the constitution

## Sub-Stories (to be drafted after Phase 5 of the plan)

The exact sub-stories depend on the extraction proposal. Placeholder shape:

| Story ID | Title | Status |
|----------|-------|--------|
| ext-v1.1 | Run mining pipeline Phases 0-5 (catalog + pressurize + propose) | Not started |
| ext-v1.2 | Extract cluster A (TBD after proposal) | Not started |
| ext-v1.3 | Extract cluster B (TBD after proposal) | Not started |
| ext-v1.N | NOTICE.md aggregation + attribution audit | Not started |

## Acceptance Criteria (Epic-level)

1. GIVEN the two repos WHEN catalog is complete THEN every feature is licence-verified
2. GIVEN the catalog WHEN council pressurization runs THEN every feature has a SIGNAL/MAYBE/NOISE verdict with rationale
3. GIVEN the cross-reference WHEN complete THEN no imported item duplicates an existing squad-claude file
4. GIVEN the extraction WHEN any item is imported THEN it carries inline attribution + NOTICE.md entry
5. GIVEN the constitutional scope guard WHEN run on every imported item THEN zero violations are recorded

## Complexity Estimate

**STANDARD** (score ~12/25): well-defined sequential pipeline, low integration complexity, medium knowledge requirement (research + judgment), low infrastructure impact.

## Dependencies

- Squads-gitignore governance decision (raised in fw-v2.4 QA gate) — affects whether imported items destined for squad-claude can ship via PR
- @analyst (Scope) availability for Phases 2 (cataloging)
- @council-orqx (Zenith) availability for Phase 3 (pressurization)
- Network access (verified)

## Recommended Timing

WAIT for EPIC-framework-upgrade-v2 to stabilize first. Detailed reasoning in `docs/plans/external-repos-mining-plan.md` §7. Approximate window: after fw-v2.2/2.3/2.5 are resolved.

## Documentation-First Compliance (Article III)

This epic file IS the Documentation-First artifact required before any implementation. The companion plan provides the operational detail. Sub-stories will be drafted after the catalog/pressurize/propose phases run, which is the only way to know the actual import shapes.

---

*Epic stub drafted by @sinapse-orqx Imperator alongside fw-v2.4 execution | 2026-04-12 | Article III compliant*
