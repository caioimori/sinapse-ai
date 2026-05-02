# Clinical Audit — Dimension 5: Workers

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 4 (actors)
> **Executor:** @architect (Aria, Visionary)
> **Date:** 2026-04-28
> **Verdict:** **CONCERNS** — 0 P0 / 1 P1 / 3 P2 / 2 P3
> **Severity:** **MEDIUM** — service registry drift + terminology overload (the word "worker" means three different things)

## Scope

Two distinct populations live under the "worker" umbrella in this codebase:

1. **Service-registry workers** — entities indexed in `.sinapse-ai/core/registry/service-registry.json` (tasks, templates, scripts, checklists, workflows, data) discoverable via `sinapse workers {search|list|info}`.
2. **Haiku workers** — short-lived, parallel sub-Task invocations used by skills like `tech-search` for fan-out search/extraction (model="haiku").

Plus a third, weaker meaning ("background process / long-running job") that is barely instantiated in this repo.

This audit covers all three meanings, with explicit attention to whether the terminology is coherent.

## 1. Inventory

### 1.1 Service-registry workers

`.sinapse-ai/core/registry/service-registry.json:1-7`:
```json
{
  "version": "1.0.0",
  "generated": "2025-11-29T22:20:21.295Z",
  "totalWorkers": 203,
  "categories": { ... },
  "workers": [ ... ]
}
```

| Category | Declared (`categories.X.count`) | Actual (count of `workers[].category == X`) |
|---|---:|---:|
| task | 115 | 115 |
| script | 54 | 54 |
| template | 19 | **11** |
| checklist | 6 | 6 |
| workflow | 6 | 6 |
| data | 3 | 3 |
| **Total declared (`totalWorkers`)** | **203** | — |
| **Total actual (`workers.length`)** | — | **195** |

Drift: `templates` declares 19 but only 11 are present in `workers[]`. Total declares 203 but the array has 195. **8 entries missing** vs declared.

Method: `python -c "import json; d=json.load(...); ..."` on the JSON.

The `generated` timestamp is `2025-11-29T22:20:21.295Z` — older than entity-registry's `2026-05-01` (Dim 3). Service registry has not been regenerated in the last ~5 months despite continuous merges.

### 1.2 Workers CLI surface

`.sinapse-ai/cli/commands/workers/index.js:13-37`:
```js
const { Command } = require('commander');
const { createSearchCommand } = require('./search');
const { createInfoCommand } = require('./info');
const { createListCommand } = require('./list');

function createWorkersCommand() {
  const workers = new Command('workers');
  workers
    .description('Manage and discover workers in the service registry')
    .addHelpText('after', `
Commands:
  search <query>    Search for workers matching a query
  list              List all workers grouped by category
  info <id>         Show detailed information about a worker
  ...
```

Subcommands: `search` (`.sinapse-ai/cli/commands/workers/search.js`), `list` (`list.js`), `info` (`info.js`). Plus 3 search variants: `search-keyword.js`, `search-semantic.js`, `search-filters.js`. Plus formatters and pagination utils.

The CLI is exposed via the legacy `sinapse` binary (`bin/sinapse.js`) — confirmed in Dim 8 audit (`audit-dim-08-commands.md:23` lists `workers` as a `sinapse` subcommand). It is NOT exposed via `bin/cli.js` (`npx sinapse-ai`). Same dual-CLI parity gap reported in Dim 1 / Dim 8.

### 1.3 Haiku workers (tech-search skill)

`.claude/skills/tech-search/SKILL.md:1-8`:
```yaml
---
name: tech-search
description: |
  Self-contained deep tech research. WebSearch + WebFetch + Haiku workers.
  Pipeline: Query > Decompose > Parallel Search (Haiku) > Evaluate > Synthesize > Document.
  Zero external dependencies. MCPs optional.
  Salva em docs/research/{YYYY-MM-DD}-{slug}/.
---
```

`SKILL.md:174-200` — Phase 3 ("PARALLEL SEARCH (Haiku Workers)"):
- Line 86: `model: "haiku"`
- Line 180: "Dispatches sub-queries as parallel Haiku workers."
- Line 196: `model: "haiku"`
- Line 279: `Wrap in Task(model: "haiku")`

The "Haiku worker" pattern is: `Task(prompt=..., model="haiku", run_in_background=true)` for fan-out, then `TaskOutput(task_id)` to collect. This matches the parallel pattern in `.sinapse-ai/development/tasks/blocks/execution-pattern.md:44-50` (Dim 4 §1.4).

References from non-skill code:
- `.sinapse-ai/development/agents/analyst/MEMORY.md:24` — "Use tech-search skill for deep research"
- `.sinapse-ai/development/tasks/resolve-github-issue.md:152` — "Use /tech-search skill for deep research"
- `.sinapse-ai/development/tasks/resolve-github-issue.md:466-468` — "**Tool:** /tech-search (skill); **Source:** .claude/skills/tech-search"

### 1.4 Background processes (the weak third meaning)

`grep -rln "run_in_background\|setInterval\|setTimeout" .sinapse-ai/development/scripts/ .sinapse-ai/core/` returns 10 files. Of these, none implement a long-running daemon. They use `setTimeout`/`setInterval` for in-process timers (e.g. `unified-activation-pipeline.js` 200ms timeout, `parallel-monitor.js` heartbeat). These are not "workers" in the queue/daemon sense.

The `Task(run_in_background=true)` mechanism IS the closest thing to a background process — but it is bounded to a single Claude Code session. There is no on-disk worker queue, no daemon, no cron entry that ships with this framework. The repo has 0 daemons.

## 2. Contract

| Claim | Source `file:line` |
|---|---|
| `service-registry.json` is the canonical worker registry | `.sinapse-ai/core/registry/service-registry.json:1-7` (top of file) |
| `sinapse workers list` lists all workers grouped by category | `.sinapse-ai/cli/commands/workers/index.js:25-26` |
| 6 categories: `task, template, script, checklist, workflow, data` | `.sinapse-ai/cli/commands/workers/list.js:50-58` (help text) |
| `totalWorkers` is the canonical count | `service-registry.json:4` |
| Haiku workers are ephemeral parallel `Task` calls (model="haiku") | `.claude/skills/tech-search/SKILL.md:174-200` |
| Token-economy: haiku for "Lint, rename, YAML, lookup, bulk" | `~/.claude/rules/token-economy.md` (§2 Model Routing) |
| Subagent threshold: ≥8 tool calls or fan-out parallel real | `~/.claude/rules/token-economy.md` (§3) |

## 3. Reality (this session)

### 3.1 Service registry drift

Per §1.1: `totalWorkers: 203` but `workers.length: 195` (Δ -8). `template` count declares 19 but only 11 entries. The `generated` timestamp is from 2025-11-29 — 5 months stale relative to ongoing development.

Likely cause: registry generation script has not been re-run since some templates were removed/renamed. The `data/registry-update-log.jsonl` exists (`.sinapse-ai/data/registry-update-log.jsonl`) and tracks updates to entity-registry, but service-registry has its own loader (`.sinapse-ai/core/registry/registry-loader.js`, referenced in `list.js:14`) that is decoupled.

The 8 ghost entries cause `sinapse workers list` to report inaccurate totals. Functional impact: low (search/info on existing entries still work; missing entries return "not found"). Trust impact: medium (the canonical count is wrong).

### 3.2 Haiku worker pattern is sound, but "worker" terminology overloaded

The pattern in `tech-search/SKILL.md:174-200` correctly uses `Task(model="haiku", run_in_background=true)` for fan-out. This is the intended use of the subagent threshold rule (§1.4 Dim 4): batch parallel, ≥N items, ephemeral, low-judgment work.

Problem: "worker" means:
- (a) An entry in the service registry (`task`, `script`, etc. — these are *artifacts*, not running processes).
- (b) An ephemeral Haiku Task spawned for parallel work (running process, single-session).
- (c) An imagined "background daemon" implied by the Imperator banner ("workforce") and the constitution.

A new user reading `sinapse workers list` will see 203 entries and reasonably assume they are 203 running things. They are 195 documents/scripts indexed for searchability. Vocabulary debt.

### 3.3 No persistent worker queue

There is no Redis/SQS/file-queue worker daemon shipped. `Task(run_in_background=true)` is the only async primitive. This is intentional (CLI-first, no servers) but the constitution and Imperator banner imply a "workforce" of "203 workers" doing work. The reality is closer to: 12 framework agents + 188 squad personas + 195 indexed artifacts + ephemeral Haiku spawns. None of this is "workers" in the daemon sense.

### 3.4 No worker-isolation contract

`Task(model="haiku")` in `tech-search/SKILL.md:196` does not declare a `tools:` allowlist. The Haiku worker inherits the parent session's tool list. The token-economy rule (§3) says haiku for lookup/lint/yaml/bulk — implying read-mostly — but nothing enforces "haiku worker can only read".

Compare to subagent frontmatter (Dim 4 §1.5) where each subagent has explicit `tools:`. Haiku workers have no analogous file. This is a documented capability gap, not a bug — but worth flagging.

### 3.5 CLI parity

`sinapse workers {list|search|info}` exists on legacy `bin/sinapse.js` only. `npx sinapse-ai` (canonical) does not expose `workers`. Same gap as `telemetry`, `qa`, `brand`, `validate`, `info` (Dim 1 §4 / Dim 8). Logged once, not repeated as a separate finding here.

## 4. Delta

| Item | Contract | Reality | Status | Severity |
|---|---|---|---|---|
| `totalWorkers: 203` | declared count | 195 entries in `workers[]` | DRIFT | P1 |
| `templates: 19` (category count) | declared | 11 actual | DRIFT | P1 |
| Service registry `generated` recent | implied | 2025-11-29 (5 months stale) | STALE | P2 |
| Worker terminology coherent | implied | "worker" = artifact + ephemeral task + imagined daemon | OVERLOADED | P2 |
| Haiku worker tool isolation | implicit (token-economy) | none enforced; inherits parent | DRIFT-by-design | P2 |
| `sinapse-ai workers ...` CLI parity | implied dual-CLI parity | only `sinapse workers ...` | DRIFT | P3 (already in Dim 1) |
| Background daemon | implied by "workforce" framing | none in repo | OVER-CLAIM | P3 |

## 5. Findings (concrete file:line citations)

### Finding F5-1 — Service registry has 8 ghost entries / template count off by 8 (P1)

`.sinapse-ai/core/registry/service-registry.json:4` declares `totalWorkers: 203`. The `workers[]` array (`workers` key) contains 195 entries. The `categories.template.count: 19` (declared) does not match the actual count of entries with `category == "template"` which is 11. **Counts are off by 8 in two places that should agree.**

Method: parsed JSON, counted `workers[]`, ran `Counter(w.get('category') for w in d['workers'])`.

Functional impact: `sinapse workers list --count` will print the wrong total. `sinapse workers list --category=template` will list 11 not 19. `sinapse workers info <id>` for the 8 ghost entries returns "not found".

### Finding F5-2 — Service registry stale by 5 months (P2)

`.sinapse-ai/core/registry/service-registry.json:3` says `"generated": "2025-11-29T22:20:21.295Z"`. Compare entity-registry: `"lastUpdated": "2026-05-01T16:26:51.800Z"` (Dim 3 §1.1). The two registries are decoupled — entity-registry has been kept in sync (PR #116 squad-validator updates), service-registry has not. There is no CI gate that fails on service-registry staleness.

Implication: every story landed since 2025-11-29 that added/removed a task/template/script/checklist/workflow has caused drift. F5-1 is the visible symptom.

### Finding F5-3 — "Worker" terminology means three different things (P2)

The repo uses "worker" for:

1. **Indexed artifact** in service registry — `.sinapse-ai/cli/commands/workers/index.js:25` ("Manage and discover workers in the service registry"); 195 artifacts.
2. **Ephemeral Haiku Task** — `.claude/skills/tech-search/SKILL.md:4` ("WebSearch + WebFetch + Haiku workers"); zero in repo, spawned at runtime.
3. **Implied daemon / workforce** — `.sinapse-ai/constitution.md` and `sinapse-orqx.md` activation banner refer to an "AI workforce"; zero in repo.

A user reading `sinapse workers list` and the Imperator activation banner will form an incorrect mental model. Recommend: rename the service-registry concept to `artifacts`, `entities`, or `library`; reserve "worker" for ephemeral runtime tasks.

### Finding F5-4 — Haiku workers have no tool-isolation contract (P2)

`.claude/skills/tech-search/SKILL.md:196`:
```js
Task(model: "haiku", ...)
```

No `tools:` allowlist is declared on the Task call. The spawned haiku worker inherits whatever tools the parent session has. Token-economy rule §2 ("Lint, rename, YAML, lookup, bulk") suggests read-mostly intent, but it is not enforced.

In practice, tech-search uses haiku workers only for WebSearch+WebFetch+lightweight analysis — low risk. But the pattern is replicated by reference (3 places in `resolve-github-issue.md:152, 159, 466-468`) and there is no template that says "haiku workers should declare their tool list" — opening a future leak.

### Finding F5-5 — No background daemon despite "workforce" framing (P3)

`.sinapse-ai/development/agents/sinapse-orqx.md` activation banner: "all 18 specialized squads (186 agents total) ... workforce". Reality: zero processes run outside an active Claude Code session. `Task(run_in_background=true)` is single-session-bounded. There is no `pm2`, no systemd unit, no Docker daemon shipped, no cron job in `.github/workflows/` outside CI.

Acceptable design (CLI-first per Constitution Article I), but the "workforce" framing in agent personas implies persistence. Consider language adjustment in v1 docs.

### Finding F5-6 — CLI parity (already logged) (P3)

`sinapse workers ...` is only on legacy binary. Same as Dim 1 / Dim 8 finding. Not repeated.

## 6. Severity Roll-Up

- **P0:** 0
- **P1:** 1 (F5-1 — service registry counts wrong)
- **P2:** 3 (F5-2 stale registry, F5-3 terminology, F5-4 haiku isolation)
- **P3:** 2 (F5-5 daemon claim, F5-6 CLI parity dup)

## 7. Recommendations

| # | Action | Owner | Window |
|---|---|---|---|
| R1 | Regenerate `service-registry.json` from disk. Add a `npm run` script (or extend `generate:manifest`) that produces the registry deterministically. Add a CI gate that fails if `service-registry.json` is stale (timestamp older than the most recent file in `.sinapse-ai/development/{tasks,templates,checklists,workflows,scripts,data}/`). | @devops | Pre-GA |
| R2 | Reconcile F5-1 specifically: the 8 missing template entries. Either restore the templates or remove them from the declared count. The discrepancy must be explained or fixed. | @architect | Pre-GA, same PR as R1 |
| R3 | Make a terminology decision. Recommendation: rename `sinapse workers` CLI to `sinapse artifacts` (or `sinapse library`), reserve "worker" for ephemeral runtime tasks. Update `.claude/skills/tech-search/SKILL.md` accordingly. | @architect → Caio | Pre-GA, low-risk |
| R4 | Add a worker template (`.claude/skills/_templates/haiku-worker-template.md`) that documents the contract: `Task(model="haiku", tools=[Read, WebSearch, WebFetch], run_in_background=true)` with explicit tool allowlist. | @architect | Pre-GA |
| R5 | Soften "workforce" framing in `sinapse-orqx.md` activation banner — or implement a minimal worker daemon (out of scope for v1). Recommendation: language fix only. | @architect | Pre-GA, paired with Dim 3 R2 |
| R6 | (Post-GA) Add `npx sinapse-ai workers` parity (already tracked in Dim 1). | @devops | Post-GA |

## 8. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **5. Workers** | **CONCERNS** | Zero P0 / 1 P1 / 3 P2 / 2 P3. F5-1 is the only P1 — registry counts are wrong, but functional impact is "search returns wrong totals", not "workflow breaks". The terminology debt (F5-3) and stale registry (F5-2) are reputational risks for v1. R1+R2 should ship pre-GA in a single PR. R3 is a clean-language fix worth doing pre-GA but not blocking. |

## 9. Blocks rename SNPS → SNPS?

**No.** None of the worker findings touch persona names. The SNPS rename can proceed independently of worker registry reconciliation.

## Change Log

- 2026-04-28 — Dim 5 audit completed (Block 2). CONCERNS, does not block SNPS rename. @architect (Aria, Visionary).
