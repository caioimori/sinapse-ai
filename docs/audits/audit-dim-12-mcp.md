# Clinical Audit — Dimension 12: MCP

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 1 (infra, low-risk)
> **Executor:** @devops
> **Date:** 2026-04-19
> **Verdict:** **PASS** — one MEDIUM (upstream instability, not SINAPSE's fault)

## Scope

MCP server registration (`~/.claude.json`), install / connect / failure semantics, installer integration (Chrome Brain capability), ownership (who can add/remove MCPs), documented governance.

## 1. Inventory

### Local MCPs (from `~/.claude.json`)

| Name | Command | Purpose |
|---|---|---|
| `chrome-devtools` | `cmd /c npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222` | Chrome CDP (29 tools) — part of Chrome Brain stack |
| `dev-browser` | `cmd /c dev-browser --connect` (env `CDP_URL`) | Playwright-backed browser (Story 7.4.2) |
| `terminal-bus` | `node ~/.claude/mcp-servers/terminal-bus/server.js` | Cross-terminal messaging |
| `figma-console` | `npx -y figma-console-mcp@latest` | Figma integration (UPSTREAM — not SINAPSE-installed) |

### claude.ai managed MCPs (server-side, not in local config)

ActiveCampaign, Figma (official), Google Drive, Notion, Supabase, Vercel. These are managed by claude.ai infra, not by SINAPSE or the user's local `~/.claude.json`.

### Installer integration

| Installer phase | MCP work | Source |
|---|---|---|
| Phase 7 (npx sinapse-ai install) | Registers chrome-devtools + dev-browser in `~/.claude.json` if Chrome detected | `bin/cli.js:547-566` |
| `installMcp` function | Idempotent upsert, not destructive | `bin/modules/chrome-brain-installer.js:387-440` |
| `uninstallChromeBrain` | Removes both entries | `bin/modules/chrome-brain-installer.js:962-983` (equivalent code in the capability variant) |

## 2. Contract

| Claim | Source |
|---|---|
| "All MCP infrastructure management handled EXCLUSIVELY by @devops" | `~/.claude/rules/mcp-usage.md:3-13` |
| Tool selection priority: native > MCP | `~/.claude/rules/mcp-usage.md:33-44` |
| Docker MCP Toolkit secrets bug documented | `~/.claude/rules/mcp-usage.md:193-224` |
| chrome-devtools requires Chrome debug already running on 9222 | `~/.claude.json#mcpServers.chrome-devtools.args` |
| SessionStart hook warms up Chrome before MCP init | Story 10.41 (PR #98) — `bin/modules/chrome-brain-installer.js:366-373` |
| `figma-console` is user/upstream-managed, not SINAPSE | (absence from installer code) |

## 3. Reality

- **Chrome-devtools + dev-browser:** registered, connected, validated during PR #98 execution. SessionStart hook (Story 10.41) eliminates the disconnect-at-boot failure mode observed pre-rc.8.
- **terminal-bus:** local-only, points to a bundled server script at `~/.claude/mcp-servers/terminal-bus/server.js`. Not shipped via `npx sinapse-ai install` (user-installed separately).
- **figma-console:** disconnected during this audit session (observed via system-reminder 2026-04-19 17:45 BRT). Upstream/user concern, not SINAPSE runtime.
- **claude.ai managed MCPs:** operational, confirmed by ToolSearch availability earlier in session.
- **Installer idempotency:** PR #98 and PR #99 each re-ran installer logic paths; no duplicate MCP entries created in `~/.claude.json`.

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| @devops owns MCP management | `mcp-usage.md:3-13` | `bin/modules/chrome-brain-installer.js` is the only place SINAPSE mutates `~/.claude.json`; changes reviewed via PRs (@devops flow) | **ALIGNED** |
| Native tools > MCP | `mcp-usage.md:33-44` | Audit session used Read/Grep/Glob/Write/Edit for all local ops, MCP only for browser + terminal-bus | **ALIGNED** |
| chrome-devtools ready at session start | Story 10.41 | SessionStart hook registered in both installer entrypoints | **ALIGNED** (fixed in rc.8) |
| MCP add/remove by other agents | `mcp-usage.md:3-13` says @devops exclusive | No evidence of other agents modifying MCP config | **ALIGNED** |
| figma-console stability | Not SINAPSE's claim | Disconnected mid-session | **MEDIUM: UPSTREAM** (not a SINAPSE bug; but worth documenting graceful-degrade pattern) |
| Docker MCP Toolkit | `mcp-usage.md:63-71` lists EXA, Context7, Apify via docker-gateway | Not present in local config — docker-gateway absent | **MEDIUM: DOC DRIFT** (rule describes an architecture Caio doesn't currently run locally; rule says "SINAPSE uses Docker MCP Toolkit as the primary MCP infrastructure" which is stronger than reality) |

## 5. Severity

**MEDIUM #1 — Upstream MCP instability (figma-console).** Observed live during this audit: MCP disconnected without SINAPSE-side cause. Not a defect to fix; worth a note in user-facing docs that MCP availability is not guaranteed and agents should handle ToolSearch misses gracefully (NSN Mode covers this).

**MEDIUM #2 — mcp-usage.md claims Docker MCP Toolkit is "primary MCP infrastructure" but it is not installed.** The rule describes an aspirational architecture. Either (a) tighten the rule wording to "optional / recommended for EXA + Context7 + Apify" or (b) add Docker setup to the installer. The second option adds friction to the install path (Docker is a heavy dep). Recommendation: (a) — soften the rule.

Neither is a GA blocker.

## 6. Recommendation

1. **Post-GA (LOW priority):** edit `~/.claude/rules/mcp-usage.md` — replace "primary infrastructure" with "optional acceleration layer". 5-min edit.
2. **Post-GA (LOW priority):** add user-facing note somewhere in `docs/guides/` that MCP availability is not guaranteed and agents degrade gracefully via ToolSearch + NSN Mode. 10-min edit.
3. **No runtime fix needed for GA.**

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **12. MCP** | **PASS** | Zero CRITICAL/HIGH. Two MEDIUMs, both documentation-level, neither a GA blocker. Chrome Brain stack stable post-rc.8 (SessionStart hook landed). Installer idempotent, @devops ownership observed. Upstream MCP instability is out of SINAPSE's locus of control. |

## Change Log

- 2026-04-19 — Dimension 12 audit executed as third pass of clinical audit Phase 1. PASS verdict. No GA blocker.
