# Clinical Audit — Dimension 10: Tools

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 3 (process)
> **Date:** 2026-04-19
> **Verdict:** **PASS** — no GA blocker

## Scope

Claude Code tool usage policy: native tools preferred (Read / Write / Edit / Glob / Grep / Bash), Agent and Task for delegation, hook coverage on Bash and Write|Edit, documented anti-patterns.

## 1. Inventory

### Native tools referenced in session

Read, Write, Edit, Glob, Grep, Bash, Agent, Task — all exercised this audit session.

### Hook coverage (from `hook-governance.md`)

| Event | Matcher | Hooks |
|---|---|---|
| PreToolUse | Bash | git-push-authority, verify-packages, sql-governance, enforce-delegation |
| PreToolUse | Write\|Edit | architecture-first, write-path-validation, story-gate, nsn-guard, slug-validation, mind-clone-governance, delegation |
| PreToolUse | Read | read-protection |
| UserPromptSubmit | — | synapse-wrapper |
| PreCompact | — | precompact-wrapper |
| SessionStart | — | chrome-ensure (added rc.8) |
| Stop | — | session-capture |

## 2. Contract

| Claim | Source |
|---|---|
| Native > MCP for file ops | `~/.claude/rules/token-economy.md:8` (Hierarchy table) |
| Read known path, Grep known pattern, Glob file lists, Edit targeted | `~/.claude/rules/token-economy.md` Section 5 |
| Bash only for ops no dedicated tool covers | `~/.claude/rules/token-economy.md` Section 5 |
| Hook governance principles (fail-open, < 5s, silent on success) | `.claude/rules/hook-governance.md:40-45` |
| 74 hook-security tests | `tests/security/hook-security.test.js` (confirmed passing during PR #107) |

## 3. Reality

- This session used Read/Write/Edit/Glob/Grep primarily; Bash only when no dedicated tool covered (git, npm, curl, echo for JSON-to-stdin-to-hook).
- `verify-packages.cjs` fired during the `npm install` step that regenerated the lockfile (observed manifest-regen side effect from `[IDS-Hook]`).
- `enforce-nsn-guard.cjs` added this session as WARN hook; fail-open design verified in PR #104 shell test + PR #107 allowlist fix.
- All 74 hook-security tests pass on main (run during rc.9 publish CI, run 24622851119 SUCCESS).

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| Native tools preferred | `token-economy.md` Section 5 | Observed pattern in this session | **ALIGNED** |
| Bash has PreToolUse hooks | `hook-governance.md` | Active: git-push-authority + verify-packages + sql-governance + enforce-delegation | **ALIGNED** |
| Write\|Edit has PreToolUse hooks | `hook-governance.md` | Active: 7 hooks incl. NSN guard added this session | **ALIGNED** |
| Hook fail-open design | `hook-governance.md:40` | hook-security.test.js confirms exit(0) paths in every CJS hook | **ALIGNED** |
| Hook governance doc drift | Rules list 10 hooks; actual count 11 (added enforce-nsn-guard) | Updated in same PR #104 | **ALIGNED** |

## 5. Severity

No findings above LOW.

**LOW — Hook timeout uniformity.** Hooks declared in `settings.json` carry `timeout: 5` (seconds) except `chrome-ensure` at 15s and `vault-grounding`/`session-capture` at 4s/3s. No rule specifies what the right timeout is per hook class. Not a defect; worth a sentence in `hook-governance.md`.

## 6. Recommendation

- **GA:** no action.
- **Post-GA:** add "hook timeout guidance" paragraph to `hook-governance.md` (2 min edit).

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **10. Tools** | **PASS** | Zero CRITICAL/HIGH/MEDIUM. One LOW (timeout guidance unwritten). Hook coverage matches governance doc; 74 hook-security tests pass; native-first discipline observed during this session's execution. |

## Change Log

- 2026-04-19 — Dimension 10 audit. PASS.
