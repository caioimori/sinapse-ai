# Audit 1.5 — Hooks Runtime

**Verdict:** 🟡 CONCERNS
**Scope:** All runtime hooks — registration, trigger correctness, fail-mode, idempotency.

## Inventory (33 hook artifacts found)

### `.claude/hooks/` (21 files)
synapse-engine.cjs, synapse-wrapper.cjs, precompact-session-digest.cjs, precompact-wrapper.cjs, enforce-architecture-first.{cjs,py}, enforce-delegation.cjs, enforce-git-push-authority.sh, enforce-nsn-guard.cjs, enforce-story-gate.cjs, mind-clone-governance.py, pre-commit-version-check.sh, read-protection.py, secret-scanning.cjs, slug-validation.py, sql-governance.py, verify-packages.cjs, write-path-validation.{cjs,py}, install-hooks.sh, README.md

### `.sinapse-ai/hooks/` (7 files)
ids-post-commit.js, ids-pre-push.js, unified/{hook-interface, hook-registry, index, runners/precompact-runner}.js

### `.sinapse-ai/core/grounding/` (5 files)
brand.cjs, config-loader.cjs, design-system.cjs, vault.cjs, README.md

## Registration Status

`.claude/settings.json` registers 11 hooks across 4 events:

| Event | Matcher | Hook | Timeout |
|---|---|---|---|
| UserPromptSubmit | * | synapse-wrapper.cjs | 10s |
| PreCompact | * | precompact-wrapper.cjs | 10s |
| PreToolUse | Bash | enforce-git-push-authority.sh | 5s |
| PreToolUse | Write\|Edit | enforce-architecture-first.cjs, write-path-validation.cjs, enforce-story-gate.cjs, enforce-nsn-guard.cjs | 5s each |
| PreToolUse | Write\|Edit\|Bash | enforce-delegation.cjs | 5s |
| PreToolUse | Bash | verify-packages.cjs (10s), sql-governance.py (5s) |
| PreToolUse | Read | read-protection.py | 5s |
| PreToolUse | Write\|Edit | slug-validation.py, mind-clone-governance.py, secret-scanning.cjs | 5s each |

`.claude/settings.local.json` `hooks: {}` (empty — no override). Doctor reports `hooks-claude-count: 11 hook files found but not registered in settings.local.json` (this is **expected**: registration lives in `settings.json`, not `settings.local.json`).

## Findings

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| HK-1 | P2 | Doctor's `hooks-claude-count` check looks at `settings.local.json` only, but registration is at `settings.json`. Generates false WARN. Misleading | doctor output line `[WARN] hooks-claude-count: 11 hook files found but not registered in settings.local.json` |
| HK-2 | P2 | 21 hook files in `.claude/hooks/` but only ~11 are registered in `settings.json`. Unregistered: `precompact-session-digest.cjs`, `enforce-architecture-first.py` (cjs version is registered, py is dead?), `pre-commit-version-check.sh`, `install-hooks.sh`. Need to know if dead code or runtime-loaded elsewhere | grep settings.json vs `ls .claude/hooks/` |
| HK-3 | P2 | No documented fail-mode contract per hook (block / warn / log-only). README.md exists but doesn't enumerate per-hook semantics | `.claude/hooks/README.md` |
| HK-4 | P3 | Mix of `.cjs`, `.py`, `.sh` for hooks — runtime needs node, python3, bash all available. On Windows fresh installs without WSL/python3, `read-protection.py`, `slug-validation.py`, `sql-governance.py`, `mind-clone-governance.py` will silently no-op (ENOENT) | settings.json `python3 ...` invocations |
| HK-5 | P2 | `.sinapse-ai/hooks/unified/` is a separate hook system from `.claude/hooks/` — not registered in `.claude/settings.json`. Unclear whether it's wired through git-hooks (`ids-post-commit.js`) or fully orphan | inventory |
| HK-6 | P3 | `enforce-architecture-first.cjs` AND `.py` both exist; `synapse-engine.cjs` AND `synapse-wrapper.cjs` co-exist. Need clear naming: which is the canonical, which is wrapper |

## Idempotency / Fail-Mode (NOT VERIFIED)
This audit did not run each hook with edge-case payloads. Idempotency claim cannot be verified at file-inspection level — needs runtime test harness. Defer to post-GA dedicated test story.

## Recommendation
CONCERNS. Hooks are wired but inventory has dead/unregistered files (HK-2), platform fragility on Windows (HK-4), and a misleading doctor check (HK-1). Worth one cleanup story before GA.
