# Audit 1.7 — Doctor Matrix

**Verdict:** 🟡 CONCERNS
**Scope:** `sinapse doctor` coverage + accuracy on local repo.

## Local Run

`node bin/cli.js doctor` summary:

```
SINAPSE Doctor v2.1.0 — Environment Health Check
  [WARN] settings-json: Deny rules below threshold (0 rules, expected >= 40)
  [PASS] rules-files: All 7 rules files present
  [WARN] agent-memory: 5/10 MEMORY.md files present (missing: dev, qa, pm, po, sm)
  [PASS] entity-registry: ~17631 lines, updated 1h ago
  [PASS] git-hooks: pre-commit + pre-push installed
  [PASS] core-config: Schema valid, boundary section present
  [WARN] claude-md: Missing sections: Framework vs Project Boundary, Sistema de Agentes
  [PASS] ide-sync: 12/12 agents synced
  [PASS] graph-dashboard: All modules present (2 files)
  [PASS] code-intel: RegistryProvider (T1) active, 5/8 primitives, 753 entities, 511KB, CB: CLOSED
  [PASS] node-version: Node.js v24.13.1
  [PASS] npm-packages: node_modules present, .sinapse-ai deps (14) resolved
  [PASS] skills-count: 7 skills found
  [PASS] commands-count: 29 command files found
  [WARN] hooks-claude-count: 11 hook files found but not registered in settings.local.json

Summary: 11 PASS | 4 WARN | 0 FAIL | 0 INFO
```

## Coverage (15 checks)

| Check | Result | Note |
|---|---|---|
| settings-json | WARN | Deny rules <40 (admin/security setup) |
| rules-files | PASS | 7/7 |
| agent-memory | WARN | Only 5/10 MEMORY.md present |
| entity-registry | PASS | 753 entities |
| git-hooks | PASS | pre-commit + pre-push |
| core-config | PASS | schema valid |
| claude-md | WARN | missing sections |
| ide-sync | PASS | 12/12 agents synced (NOTE: this is framework agents only — 188 squad agents not tracked here) |
| graph-dashboard | PASS | 2 modules |
| code-intel | PASS | T1 active, CB CLOSED |
| node-version | PASS | v24.13.1 |
| npm-packages | PASS | 14 deps resolved |
| skills-count | PASS | 7 skills (note: `ls .claude/skills/` shows 18 entries; doctor counts 7) |
| commands-count | PASS | 29 commands |
| hooks-claude-count | WARN | misleading — see Audit 1.5 HK-1 |

## Findings

| ID | Sev | Finding |
|----|-----|---------|
| DOC-1 | P1 | `ide-sync: 12/12 agents synced` is misleading — only counts framework agents, ignores 188 squad agents. Users get false confidence | doctor output |
| DOC-2 | P2 | `skills-count: 7` but `ls .claude/skills/` shows 18 entries. Inconsistency between displayed and actual | doctor vs ls |
| DOC-3 | P2 | `hooks-claude-count` WARN is incorrect — checks wrong settings file (`settings.local.json` instead of `settings.json`) | bin/cli.js doctor logic |
| DOC-4 | P2 | 4 WARNs at every fresh install (settings-json deny rules, agent-memory missing 5 files, claude-md sections, hooks misread) — UX-noisy. Auto-fix available but defaults are warn-loud |
| DOC-5 | P3 | Doctor doesn't check: workflow YAML parsability, squad.yaml parity, MCP availability, manifest version vs package.json |

## Manifest Version Drift

`grep "^version:" .sinapse-ai/install-manifest.yaml` → `10.0.0-rc.10`
`package.json` version → `10.0.0-rc.11`

Doctor doesn't catch this. **P1 finding.**

## Recommendation
CONCERNS. Doctor passes overall but several checks are inaccurate or under-counting. Add Manifest Version Parity check + fix ide-sync coverage + correct hooks-claude-count before GA.
