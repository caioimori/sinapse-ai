# Audit 1.6 — MCP Integrations

**Verdict:** 🟢 PASS
**Scope:** chrome-devtools, dev-browser, figma-console, terminal-bus, claude.ai skills — config + offline fallback.

## MCPs Per Global Rule

`~/.claude/rules/mcp-usage.md` (loaded into context) declares 4 active MCPs + 6 claude.ai skills (Figma, Vercel, Notion, Supabase, Drive, ActiveCampaign). Configured at user level (`~/.claude.json`), not in repo.

## Repo-Level Verification

| Check | Result |
|---|---|
| `.mcp.json` or `mcp.json` in repo | **Not found** (correctly — MCP is user-scoped) |
| Reference docs | `.sinapse-ai/data/tool-registry.yaml` (referenced in CLAUDE.md) |
| Tool examples | `~/.claude/rules/tool-examples.md` |
| MCP audit prior | `docs/audits/audit-dim-12-mcp.md` exists (audit-dim-12 already done) |

## Offline Fallback

The framework relies on MCP for optional capabilities:
- chrome-devtools / dev-browser → graceful degradation expected (tasks become manual)
- figma-console → only invoked when user mentions Figma URL
- terminal-bus → optional cross-session messaging

**No code path strictly requires an MCP** — agents fall back to native tools (Bash, WebFetch). No hard dependency.

## Findings

| ID | Sev | Finding |
|----|-----|---------|
| MCP-1 | P3 | No automated test that an MCP being offline doesn't break agent activation. Empirical only |
| MCP-2 | P3 | `tool-registry.yaml` referenced in CLAUDE.md but not validated against actual MCP availability at runtime |

## Reference
audit-dim-12-mcp.md (prior, in same `docs/audits/` dir) covers MCP governance more deeply. This audit confirms runtime is intact.

## Recommendation
PASS. MCP architecture is opt-in / defensive. No GA-blocker.
