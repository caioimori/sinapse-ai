# Audit 2 — Sub-Report 4: Code Smells

**Date:** 2026-04-28
**Verdict:** YELLOW
**Method:** LOC analysis, TODO/FIXME grep, duplication heuristics

## Big Picture

| Metric | Value | Verdict |
|---|---:|---|
| Total JS LOC (excl. node_modules) | ~189k | — |
| Files >1500 LOC | 7 | YELLOW |
| Files >1000 LOC | 22+ | YELLOW |
| TODO/FIXME/XXX/HACK markers | **141** in 32 files | YELLOW |

## Findings

### P1 — Duplication

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q4.1 | **P1** | `template-validator.js` exists in BOTH `.sinapse-ai/development/scripts/` AND `.sinapse-ai/infrastructure/scripts/` | direct duplication |
| Q4.2 | **P1** | `test-generator.js` exists in BOTH `development/scripts/` AND `infrastructure/scripts/` | direct duplication |
| Q4.3 | **P1** | `code-quality-improver.js` exists in BOTH `development/scripts/` (1329 LOC) AND `infrastructure/scripts/` (1312 LOC) — near-duplicate, drift risk | wc -l + paths |

These three pairs are **massive duplication** (~5-6k LOC redundant). Either consolidate into single home or document explicitly why dual-register is needed (Article XI Conservative Default).

### P1 — God Files

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q4.4 | P1 | 7 files exceed 1500 LOC — likely violate Single Responsibility | `find -name "*.js" -exec wc -l` |
| Q4.5 | P1 | `bin/cli.js` 1752 LOC — entry script doing too much | wc -l |
| Q4.6 | P2 | `master-orchestrator.js` 1543 LOC — orchestrator with 1543 lines is itself an anti-pattern | wc -l |

### P2 — Tech Debt Markers

141 TODO/FIXME/XXX/HACK across 32 files. Top offenders:

| File | Count |
|---|---:|
| `.sinapse-ai/development/scripts/migrate-task-to-v2.js` | 41 |
| `.sinapse-ai/infrastructure/scripts/performance-and-error-resolver.js` | 14 |
| `tests/license/security.test.js` | 8 |
| `.sinapse-ai/development/scripts/agent-assignment-resolver.js` | 7 |
| `.sinapse-ai/infrastructure/scripts/atomic-layer-classifier.js` | 7 |

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q4.7 | P2 | `migrate-task-to-v2.js` has 41 TODO markers — incomplete migration tool | grep |
| Q4.8 | P2 | No CI enforcement of TODO budget (e.g., must reference issue ID) | manual check |

### P2 — Hardcoded Paths / Magic Numbers

Spot checks (not exhaustive):

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q4.9 | P3 | `bin/cli.js:24-26` hardcodes `~/.sinapse`, `~/.claude/commands/SINAPSE/agents`, `~/bin` — could be config-driven for testability | `bin/cli.js:24-26` |
| Q4.10 | P3 | `staged-secret-scan.js:43` `maxBuffer: 5 * 1024 * 1024` — magic number, should be named const | `bin/utils/staged-secret-scan.js:43` |

### P2 — Dead Code Risk

Depcheck reports 9 "unused" production deps:
- `@kayvan/markdown-tree-parser`, `ansi-to-html`, `asciichart`, `chokidar`, `handlebars`, `picocolors`, `proper-lockfile`, `tar`, `validator`

Note: depcheck has high false-positive rate; many of these are likely used dynamically (handlebars in templates, chokidar in watchers, tar in install). Verify before removing.

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q4.11 | P2 | 9 deps flagged as unused by depcheck — likely false positives but worth verifying for size + supply-chain reduction | `npx depcheck` |

## Recommended Stories (Bloco Fix)

- **Story Q4-A (P1):** Consolidate `template-validator.js` (dev/ vs infra/) — pick one home, extract shared, delete duplicate
- **Story Q4-B (P1):** Same for `test-generator.js`
- **Story Q4-C (P1):** Same for `code-quality-improver.js` (1329 vs 1312 LOC near-duplicate)
- **Story Q4-D (P1):** Refactor `bin/cli.js` (covered in Q3-A)
- **Story Q4-E (P2):** Audit 9 "unused deps" — remove confirmed dead, document dynamic uses
- **Story Q4-F (P2):** Sweep TODO markers — convert to GitHub issues with story refs, delete or fix the rest
