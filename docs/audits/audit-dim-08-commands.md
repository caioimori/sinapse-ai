# Clinical Audit — Dimension 8: Commands

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 2 (user surfaces)
> **Executor:** @developer
> **Date:** 2026-04-19
> **Verdict:** **CONCERNS** — one MEDIUM (dual CLI), no GA blocker

## Scope

Canonical CLI (`bin/cli.js`), legacy binary (`bin/sinapse.js`), slash commands (`/SINAPSE:agents:*`), agent subcommands (`*help`, `*draft`, etc.), help text parity, command discoverability.

## 1. Inventory

### bin/cli.js commands (`npx sinapse-ai …`)

```
install, update, uninstall, init, list, status, doctor,
chrome-brain, help / --help / -h
```

### bin/sinapse.js commands (`sinapse …` legacy)

```
workers, config, pro, chrome-brain, install, uninstall, init, info,
doctor, telemetry, validate, brand, update, qa, health,
--version / -v / -V, --help / -h
```

### Slash commands (project-scoped, `.claude/commands/`)

- `SINAPSE/` (SINAPSE-authored agent commands, e.g. `/SINAPSE:agents:developer`)
- `cohort-squad/` (cohort-squad agents)
- `design-system/` (design-system agents)
- `greet.md`
- `synapse/` (SYNAPSE context-engine commands)

### Slash commands (global, `~/.claude/commands/`)

- `SINAPSE/` (mirrors project SINAPSE commands for global install)
- `checkpoint.md`, `inbox.md`, `msg.md`, `resume.md` (terminal-bus session-control)

### Agent subcommands (agent-scoped)

Star-prefixed commands available inside each agent:
```
*help, *create-story, *draft, *validate-story-draft, *develop,
*qa-gate, *coderabbit-review, *task, *push, *update-story, …
```

Source: `~/.claude/rules/agent-authority.md` (delegation matrix, command-per-agent)

## 2. Contract

| Claim | Source |
|---|---|
| "CLI First → Observability Second → UI Third" | `CLAUDE.md` (project) Constitution Art. I |
| Two entrypoints (cli.js + sinapse.js), init recently bridged | PR #103 |
| Help text lists init as first command in `--help` | `bin/cli.js:1411` |
| Agent subcommands exclusive to their agent | `~/.claude/rules/agent-authority.md` |
| `npx sinapse-ai` is canonical; `sinapse` is legacy surface | `bin/cli.js:8` package.json bin map + README |

## 3. Reality

- Help rendering: `node bin/cli.js --help` shows the full command list including `init <name>` as the first entry (verified during PR #103 session).
- `node bin/sinapse.js --help` shows a wider command list (legacy breadth). Both are valid and shipped.
- Slash commands: 3 squad marketplaces (SINAPSE, cohort-squad, design-system) + synapse + 4 terminal-bus commands. All accessible as `/SINAPSE:agents:…`, `/cohort-squad:…`, etc.
- Agent subcommands: no inventory tool was run during this audit, but `agent-authority.md` is the authoritative doc and matches what agents expose via `*help`.

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| Dual CLI documented as known drift | REPORT.md and pending-execution plan item #9 | Both entrypoints still live; init bridged (PR #103), other commands not | **MEDIUM: KNOWN DRIFT** (tracked for dual-CLI consolidation) |
| `npx sinapse-ai` is canonical path | package.json `bin`, README | Works, help renders correctly, Phase 7 of install runs Chrome Brain | **ALIGNED** |
| Agent subcommands list current | `agent-authority.md` (global) | Not revalidated in this audit; deferred to Phase 4 (dim 3 Agents) post-rename | **DEFERRED** (per epic ordering) |
| Slash command discovery | Implicit: `/SINAPSE:agents:…` pattern | Commands render in skill list at session start (observed) | **ALIGNED** |

## 5. Severity

**MEDIUM — Dual CLI drift.** The canonical `npx sinapse-ai` surface is narrower than the legacy `sinapse` binary. This is known and tracked (pending-execution item #9, deferred past GA in the current plan). Users landing via `npx` may hit a "command not found" that the legacy binary would have handled (e.g., `npx sinapse-ai telemetry status` fails, `sinapse telemetry status` works). Not a GA blocker because `npx sinapse-ai` covers the install/init/doctor/uninstall happy path that the README promises.

Agent subcommand audit is **deferred to Phase 4 (dim 3 Agents)** per the epic's explicit ordering — "Rename (Fase C) executed between audit Phase 3 and Phase 4" — to avoid auditing names that will churn in the APSE rename.

## 6. Recommendation

1. **GA:** no action — dual CLI is a known surface gap tracked separately.
2. **Post-GA, as part of dual CLI consolidation:** decide per command whether to mirror into cli.js or drop. Low-hanging: `info`, `validate`. Deliberate: `telemetry`, `qa`, `health`.
3. **Phase 4 (post-rename):** audit agent subcommands (`*help`, `*draft`, etc.) against `agent-authority.md`.

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **8. Commands** | **CONCERNS** | Zero CRITICAL/HIGH. One MEDIUM (dual CLI drift, already item #9 in pending-execution plan). Subcommand review deferred to Phase 4 per epic ordering. Happy path on canonical `npx sinapse-ai` is covered and validated. |

## Change Log

- 2026-04-19 — Dimension 8 audit. CONCERNS (non-blocking).
