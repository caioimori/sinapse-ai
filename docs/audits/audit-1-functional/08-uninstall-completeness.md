# Audit 1.8 — Uninstall Completeness

**Verdict:** 🔴 FAIL
**Scope:** `npx sinapse-ai uninstall --yes` removes everything install wrote, no orphans.

## Methodology

Compared install side-effects (file writes) vs uninstall removal scope by reading `bin/cli.js`.

## Install writes the following to `~/`

| Path | Code | Cleanup status |
|------|------|----------------|
| `~/.sinapse/` (entire dir, all squad files) | `bin/cli.js:489` `fs.mkdirSync(SINAPSE_HOME)` | ✅ removed (`rmDirSync`) |
| `~/.claude/commands/SINAPSE/` (29 command .md files) | `bin/cli.js:537,560,1063` | ✅ removed |
| `~/bin/sinapse`, `~/bin/sinapse.cmd` | `bin/cli.js:891,909` | ✅ removed |
| `~/.claude/agents/*.md` (ALL agents copied — not just orqx) | `bin/cli.js:584-588`, `1107` `fs.copyFileSync(... globalAgentsDir ...)` | ❌ **only `*-orqx.md` removed** (`bin/cli.js:1216-1230`) |
| `~/.codex/agents/*.md` (ALL agents copied) | `bin/cli.js:593-597`, `1117` | ❌ **only `*-orqx.md` removed** |
| `~/.claude/CLAUDE.md` (master CLAUDE.md) | `bin/cli.js:812` `fs.writeFileSync(claudeDir, 'CLAUDE.md', ...)` | ❌ **NEVER cleaned by uninstall** |
| `~/.claude/agents/sinapse-orqx.md` | `bin/cli.js:834` | ✅ matches `*-orqx.md` glob, removed |
| `~/.claude/settings.json` (SINAPSE keys merged in) | `cleanClaudeSettingsJson` | ✅ keys stripped |
| `~/.profile` (PATH export `marker`) | `bin/cli.js:949` `fs.writeFileSync(... '.profile' ..., {flag: 'a'})` | ❌ **NEVER cleaned** (uninstall log says: `Note: PATH entry in shell RC files was not removed. Clean up manually if desired.`) |
| `~/.sinapse/metadata.json` | `bin/cli.js:630` | ✅ removed via `~/.sinapse/` |

## Orphans Left After Uninstall

| Orphan | Severity | Count |
|--------|----------|-------|
| **~178 non-orqx agent .md files in `~/.claude/agents/`** | **P0** | 200 written - 22 orqx removed = ~178 orphans |
| **~178 non-orqx agent .md files in `~/.codex/agents/`** | **P0** | (if codex chosen) |
| `~/.claude/CLAUDE.md` (master file) | P1 | 1 file, may collide with user's existing CLAUDE.md |
| `~/.profile` PATH export | P2 | 1 line, documented as manual cleanup |

## Findings

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| UN-1 | **P0** | Uninstall leaves 178+ agent files orphaned in `~/.claude/agents/` and `~/.codex/agents/`. Install copies ALL (`f.endsWith('.md')`), uninstall only removes `*-orqx.md`. **This breaks the contract `npx sinapse-ai uninstall --yes` removes everything** | install: `bin/cli.js:586`; uninstall: `bin/cli.js:1220` `/-orqx\.md$/` regex |
| UN-2 | **P1** | `~/.claude/CLAUDE.md` written by install (line 812) is never removed by uninstall. May overwrite user's pre-existing CLAUDE.md during install AND leave SINAPSE content behind after uninstall | code grep |
| UN-3 | P2 | `~/.profile` PATH entry not auto-cleaned (acknowledged in code comment — "Clean up manually if desired") | `bin/cli.js:1351` |
| UN-4 | P2 | Uninstall has no `--dry-run` flag to preview removals. User can't audit before destructive action | CLI help |
| UN-5 | P3 | Uninstall has TTY guard for `--yes` requirement in non-TTY (good), but no rollback on partial failure | code review |

## Reproduction (Conceptual — not executed)

```
1. fresh npx sinapse-ai install (with claude-code option)
   → writes 200 agent .md files to ~/.claude/agents/
2. npx sinapse-ai uninstall --yes
   → only ~22 *-orqx.md files removed
   → ~/.claude/agents/ still contains 178+ SINAPSE agent files
3. fresh user's `ls ~/.claude/agents/` shows SINAPSE pollution
```

## Recommendation
**FAIL — GA-blocker**.

UN-1 is a P0 contract violation. Users running uninstall will believe SINAPSE is gone but ~/.claude/agents/ keeps 178 SINAPSE-authored agent files that pollute their global Claude Code namespace and may conflict with future installs (other frameworks, other versions).

UN-2 (CLAUDE.md handling) needs design decision — is the install supposed to merge or overwrite? Either way, uninstall should restore.

**Must fix before promoting rc.11 → 1.0.0 latest.** Story for fix block.
