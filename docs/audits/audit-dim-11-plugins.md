# Clinical Audit — Dimension 11: Plugins

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 1 (infra, low-risk)
> **Executor:** @devops
> **Date:** 2026-04-19
> **Verdict:** **CONCERNS** — no GA blocker, but two MEDIUM observations worth logging

## Scope

Plugin system surface: `enabledPlugins`, `extraKnownMarketplaces`, installer footprint, uninstall completeness, security posture of third-party plugins.

## 1. Inventory

### Global `~/.claude/settings.json`

```json
"enabledPlugins": { "claude-mem@thedotmack": true }
"extraKnownMarketplaces": {
  "thedotmack": {
    "source": { "source": "github", "repo": "thedotmack/claude-mem" }
  }
}
```

Single plugin enabled, pulled from one third-party marketplace (GitHub repo `thedotmack/claude-mem`).

### SINAPSE installer footprint for plugins

Grep for plugin-related install code in `bin/`, `packages/sinapse-install/`, `.sinapse-ai/core/`: **none**. SINAPSE does not install, register, or manage any Claude Code plugin during `npx sinapse-ai install`.

### Plugin artifacts present

- 13 `claude-mem:*` skills loaded in session (timeline-report, smart-explore, mem-search, make-plan, do, knowledge-agent, version-bump)
- No `~/.sinapse/` footprint for plugins (confirmed by project memory audit)

## 2. Contract

Authoritative sources:

| Claim | Source |
|---|---|
| MCP + infra management exclusive to `@devops` | `~/.claude/rules/agent-authority.md:9-14` |
| "Plugin system" explicitly mentioned as audit dimension #11 | `docs/epics/epic-clinical-audit-pre-ga.md:22` |
| No rule document dedicated to plugin lifecycle / trust policy | (absence is itself a finding) |

## 3. Reality

- SINAPSE has zero code touching Claude Code's plugin mechanism. `enabledPlugins` and `extraKnownMarketplaces` are managed by the user directly via Claude Code's own commands (`/plugin` surface).
- The one plugin present (`claude-mem@thedotmack`) is a third-party memory plugin installed by Caio independently of SINAPSE.
- No uninstall path in SINAPSE for plugins — consistent with not installing them in the first place.
- No pin on plugin version. `claude-mem@thedotmack` resolves to whatever GitHub HEAD points to at session start.

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| Plugins installed by SINAPSE | Not a claim — SINAPSE does not claim to install plugins | No installer code | **ALIGNED** |
| Uninstall completeness | `safe-collaboration.md` implies "anything SINAPSE installs, SINAPSE can uninstall" | Nothing installed → nothing to uninstall | **ALIGNED** by construction |
| Plugin trust / review policy | No rule exists | No rule exists → users can install any marketplace, no guidance | **MEDIUM: POLICY MISSING** |
| Plugin version pinning | No rule exists | Neither pinned nor unpinned policy documented | **MEDIUM: POLICY MISSING** |

## 5. Severity

**MEDIUM #1 — No plugin trust/review rule.** The framework has zero documented guidance for users on which plugins are safe to enable, how to evaluate a third-party marketplace, or how to audit a plugin's hooks/skills before enabling. A compromised plugin could silently exfiltrate context or modify settings. Not a GA blocker — third-party plugin governance is genuinely Claude Code's concern first, SINAPSE's concern second — but worth a `docs/guides/plugin-governance.md` in the post-GA roadmap.

**MEDIUM #2 — No plugin version-pinning guidance.** GitHub-sourced marketplaces resolve to HEAD. If an upstream plugin ships a breaking change or malicious update, every SINAPSE user with it enabled inherits it on next session. Recommendation: policy doc + optional `pinned_plugins.yaml` concept.

Neither is a GA blocker.

## 6. Recommendation

1. **Post-GA (LOW priority):** write `docs/guides/plugin-governance.md` covering: (a) how to evaluate a marketplace's trust posture, (b) how to inspect a plugin's skills/hooks before enabling, (c) guidance on version pinning. Effort: 2h.
2. **No runtime fix needed for GA** — SINAPSE is correctly staying out of Claude Code's plugin lane.

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **11. Plugins** | **CONCERNS** | Zero CRITICAL/HIGH findings. Two MEDIUMs: both are documentation gaps, not defects. SINAPSE's runtime footprint on plugins is correctly zero. The gaps are third-party trust guidance (a post-GA docs story, not a GA blocker). |

## Change Log

- 2026-04-19 — Dimension 11 audit executed as second pass of clinical audit Phase 1. CONCERNS verdict (no GA blocker).
