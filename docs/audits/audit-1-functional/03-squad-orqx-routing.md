# Audit 1.3 — Squad Orqx Routing

**Verdict:** 🟢 PASS (with caveats)
**Scope:** 21 squad orqx + 1 master sinapse-orqx; each must have `squad.yaml` + handoff documentation.

## Manifest Coverage

All 19 squads have `squad.yaml` at `squads/<squad-name>/squad.yaml`:

| Check | Result |
|---|---|
| `find squads -maxdepth 2 -name 'squad.yaml'` | 19/19 ✓ |
| All 21 orqx files exist | 21/21 ✓ |
| Master `sinapse-orqx.md` exists | ✓ at `.sinapse-ai/development/agents/sinapse-orqx.md` |

## Schema Sanity (sample)

`squad-brand/squad.yaml` (162 files, v3.3.0): full schema (name, version, description, metadata block with counts, agents block).
`squad-animations/squad.yaml` (v1.0.0): same schema.
**Schema appears consistent** post the HYBRID schema fix in commit `3167776` (Story 10.43, 19 squads).

## Handoff Contract

- Global rule: `~/.claude/rules/agent-handoff.md` (~379 token artifact spec, max 500 tok per artifact)
- Template: `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml`
- Storage: `.sinapse/handoffs/` (runtime, gitignored)
- **Per-squad handoff docs**: NOT verified individually — relies on global template

## Anomalies

| ID | Sev | Finding |
|----|-----|---------|
| ORQX-1 | P3 | `squad-claude` has 3 orqx files (claude-orqx, swarm-orqx, tools-orqx) and `claude-code-mastery` also has `swarm-orqx.md` — duplicate name across 2 squads. May be intentional shared topology agent but creates routing ambiguity |
| ORQX-2 | P2 | No automated test verifies `squad.yaml` parses cleanly + agent file count in metadata matches `find squads/<name>/agents -name '*.md'` count. squad-creator validation (Story 10.43) ran ad-hoc not as CI gate |
| ORQX-3 | P2 | Squad-level `quality-standards.md` and per-squad checklists exist for some squads (squad-brand) but not standardized — no linter verifying parity |

## Recommendation
PASS. Routing infrastructure is in place and squad-creator (Story 10.43) recently mass-fixed schema drift. Add a CI job validating squad.yaml parity (counts) post-GA.
