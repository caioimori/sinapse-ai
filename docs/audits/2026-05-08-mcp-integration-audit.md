# MCP Integration Audit — 2026-05-08

> **Sessao 2 / Categoria 5.2**
> Read-only audit — no behavior changes
> Baseline: `docs/audits/audit-dim-12-mcp.md` (2026-04-19, verdict PASS)

## Scope

Verify that the MCP servers SINAPSE depends on are documented, governed by the right agent, installed via the correct path, and free of contract drift since the previous audit (2026-04-19).

Servers in scope: `chrome-devtools`, `dev-browser`, `figma-console`, `terminal-bus`. Plus the optional Docker MCP Toolkit acceleration layer (EXA, Context7, Apify) and claude.ai-managed MCPs (Notion, Vercel, Supabase, etc.).

## 1. Inventory (re-verified 2026-05-08)

### Local MCPs (declared in `~/.claude.json`)

| MCP | Owner | Installed by | Purpose |
|---|---|---|---|
| `chrome-devtools` | SINAPSE | `npx sinapse-ai install` Phase 7 (Chrome Brain) | Chrome CDP, ~29 tools |
| `dev-browser` | SINAPSE | `npx sinapse-ai install` Phase 7 (Chrome Brain) | Playwright-backed browser |
| `terminal-bus` | User | Manual install (not in installer) | Cross-terminal messaging |
| `figma-console` | User / upstream | Manual install (not in installer) | Figma plugin integration |

### Optional Docker MCP layer (NOT shipped)

| MCP | When to enable |
|---|---|
| `EXA` | Web search / research |
| `Context7` | Library docs |
| `Apify` | Scraping / Actors |

Path: opt-in via Docker Desktop + MCP Toolkit extension. Documented in `.claude/rules/mcp-usage.md`. Not installed by SINAPSE installer; user-driven.

### claude.ai server-side MCPs

ActiveCampaign, Figma (official), Google Drive, Notion, Supabase, Vercel. Managed by claude.ai infra. Out of scope for SINAPSE installer; documented as available consumers in `.claude/rules/mcp-usage.md`.

## 2. Governance contract

| Claim | Source | Status |
|---|---|---|
| All MCP infra mgmt handled exclusively by `@devops` | `.claude/rules/mcp-usage.md:9-21` | OK — only `bin/modules/chrome-brain-installer.js` mutates `~/.claude.json`, reviewed via PR (devops flow) |
| Tool selection priority: native > MCP | `.claude/rules/mcp-usage.md:49-60` | OK — install/manifest/parity scripts use Read/Write/Glob/Grep, not MCP |
| Docker MCP Toolkit secrets bug documented | `.claude/rules/mcp-usage.md:163-184` | OK — workaround still required upstream (Dec 2025 issue not yet fixed) |
| chrome-devtools requires Chrome on debug port 9222 | `~/.claude.json#mcpServers.chrome-devtools.args` | OK — SessionStart hook (Story 10.41) warms it |
| `terminal-bus` and `figma-console` are user-managed | (absence from installer code) | OK — installer only touches chrome-devtools + dev-browser |

## 3. Reality check (2026-05-08 session)

- `chrome-devtools` and `dev-browser` were available throughout the session.
- `terminal-bus` was responsive (cross-session messaging works).
- `figma-console` connected (visible in session reminder list).
- `aidesigner` MCP appeared in session reminders during this session — runtime detection picked it up correctly even though it's user-managed (not framework-installed).
- Installer idempotency: PRs #185 / #186 / #187 of this session re-ran no installer paths; no risk of duplicate registrations.

## 4. Delta vs previous audit (2026-04-19)

| Dimension | 2026-04-19 | 2026-05-08 | Change |
|---|---|---|---|
| Local MCPs documented | 4 | 4 | none |
| Installer path | Phase 7 (chrome-brain) | Phase 7 (chrome-brain) | none |
| Governance ownership | `@devops` exclusive | `@devops` exclusive | none |
| Docker secrets bug | Open (upstream) | Open (upstream) | none |
| Tool priority rule (native > MCP) | Active | Active | none |

## 5. Findings

### 🟡 LOW — `figma-console` documentation drift

`.claude/rules/mcp-usage.md` describes `figma-console` as a write-side MCP for Figma plugins, but the local config under `.codex/skills/sinapse-design/` and the brand squad still reference it as canonical for Figma access (alongside the claude.ai-managed Figma MCP). This dual-server reality is fine but the rule doesn't say so explicitly.

**Recommendation:** add 1 line clarifying that `figma-console` is the *write* path (plugin execution) while claude.ai-managed `Figma` is the *read* path (get_design_context). No code change.

### 🟢 INFO — Documented MCP allowlist is healthy

The 4 local + 6 claude.ai + 3 Docker (opt-in) inventory matches both the rule file and the installer behavior. No phantom MCPs found in agent definitions or workflow YAMLs.

### 🟢 INFO — `aidesigner` is correctly user-managed

Detected during this session, not in framework code, no rule update needed. Acts as expected: connects when available, disconnects gracefully.

## 6. Verdict

**PASS** — same verdict as 2026-04-19. One LOW recommendation (doc clarification only). No GA blocker, no behavior change required.

## 7. Recommendations (non-blocking)

1. Add a 1-line clarification to `.claude/rules/mcp-usage.md` distinguishing Figma write (figma-console) vs read (claude.ai Figma) paths. Optional follow-up PR.
2. Re-validate after next significant Chrome Brain change (none planned this sprint).

## References

- Previous audit: `docs/audits/audit-dim-12-mcp.md` (2026-04-19)
- Governance rule: `.claude/rules/mcp-usage.md`
- Installer code: `bin/modules/chrome-brain-installer.js:387-440` (installMcp), `:962-983` (uninstallChromeBrain)
- SessionStart hook: Story 10.41 / PR #98
