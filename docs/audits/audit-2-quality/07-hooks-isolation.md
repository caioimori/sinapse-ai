# Audit 2 — Sub-Report 7: Hooks Isolation

**Date:** 2026-04-28
**Verdict:** YELLOW
**Method:** Read all hooks (.husky + .claude/hooks + .sinapse-ai/hooks), check fail-mode, idempotency, tests

## Hook Inventory

### `.husky/` (git hooks)

| Hook | Steps | Fail Mode |
|---|---|---|
| `pre-commit` | branch-guard → secret-scan → framework-guard → manifest-validate | **fail-closed** (set -e implicit, exits non-zero block commit) |
| `pre-push` | pre-push-safety + parity-fast | **fail-closed** (`set -e`) |
| `post-commit` | post-commit cache invalidation + IDS update | **fail-open** (`2>/dev/null \|\| true`) |

### `.claude/hooks/` (Claude Code session hooks)

| Hook | Fail Mode | Documented? |
|---|---|---|
| `enforce-architecture-first.cjs` | fail-open | YES (line 110 comment) |
| `enforce-architecture-first.py` | fail-open | YES |
| `enforce-delegation.cjs` | fail-open | YES (line 68, 89) |
| `enforce-git-push-authority.sh` | **fail-closed** | YES (line 14) |
| `enforce-nsn-guard.cjs` | unknown | (not explicitly tagged) |
| `enforce-story-gate.cjs` | fail-open | YES (line 125, 159) |
| `mind-clone-governance.py` | **mixed** (open for parse fail, closed for existing-file edit) | YES (line 116, 148-150) |
| `read-protection.py` | unknown | — |
| `secret-scanning.cjs` | unknown | — |
| `slug-validation.py` | unknown | — |
| `sql-governance.py` | unknown | — |
| `synapse-engine.cjs` | unknown | — |
| `synapse-wrapper.cjs` | unknown | — |
| `verify-packages.cjs` | unknown | — |
| `write-path-validation.cjs` | unknown | — |
| `precompact-session-digest.cjs` | unknown | — |
| `precompact-wrapper.cjs` | unknown | — |
| `pre-commit-version-check.sh` | unknown | — |
| `install-hooks.sh` | unknown (installer) | — |

## Test Coverage of Hooks

Hook-related test files found:

| Test | What it covers |
|---|---|
| `tests/code-intel/hook-runtime.test.js` | Code intel hooks |
| `tests/hooks/enforce-git-push-authority.test.js` | YES — git push enforcement |
| `tests/hooks/grounding-hooks.test.js` | YES — grounding |
| `tests/hooks/story-update-hook.test.js` | YES — story updates |
| `tests/hooks/unified/hook-interface.test.js` | YES — interface |
| `tests/hooks/unified/runners/precompact-runner.test.js` | YES — precompact |
| `tests/integration/hooks/precompact-flow.integration.test.js` | YES — integration |
| `tests/security/hook-security.test.js` | YES — security props |
| `tests/synapse/e2e/hook-integration.e2e.test.js` | YES — e2e |
| `tests/synapse/hook-entry.test.js` | YES — entry |

**Coverage of 19 .claude/hooks scripts: ~5 explicitly tested.** The other 14 are not covered by name in the test inventory.

## Findings

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q7.1 | **P1** | Of 19 hooks in `.claude/hooks/`, only ~5 have direct tests. 14 hooks have unknown behavior under failure (e.g., what does `slug-validation.py` do on YAML parse error?) | hook inventory vs test list |
| Q7.2 | P2 | Fail-mode (open vs closed) is documented in some hooks via comments but not in a central registry. Auditor must read each script to know. | hook headers |
| Q7.3 | P2 | `post-commit` hook chains `\|\| true` — silent failure of cache invalidation. Acceptable for non-critical, but no logging means we can't detect when it's failing systematically. | `.husky/post-commit:7,11` |
| Q7.4 | P2 | Idempotency: `mind-clone-governance.py` correctly distinguishes "file exists" (closed) from "parse fail" (open) — sophisticated. Other hooks don't show similar nuance documentation. | `.claude/hooks/mind-clone-governance.py:116-150` |
| Q7.5 | P3 | No central hook contract test (e.g., "every hook must respond to a sentinel input within Xms or fail-open by default") | manual review |

## Strengths

- Pre-commit chain is properly fail-closed for security-critical paths (secret-scan, framework-guard)
- Most session hooks are intentionally fail-open (don't block dev for Claude session glitches)
- `enforce-git-push-authority.sh` is fail-closed — correct for Article II enforcement
- `tests/security/hook-security.test.js` validates structural properties

## Recommended Stories (Bloco Fix)

- **Story Q7-A (P1):** Document fail-mode for all 19 hooks in a central matrix (`.claude/hooks/README.md` table)
- **Story Q7-B (P1):** Add minimal smoke tests for the 14 untested hooks (load + fail-safe input)
- **Story Q7-C (P2):** Add lightweight logging when post-commit hooks silent-fail (so we know when caches stop invalidating)
- **Story Q7-D (P3):** Define hook contract: every hook must complete in <2s or self-abort fail-open (already implicit in IDS principles `circuit_breaker.timeout_ms: 2000`)
