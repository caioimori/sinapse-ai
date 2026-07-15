# IDE Integration Guide

> **EN**

---

Guide for integrating SINAPSE with supported IDEs and AI development platforms.

**Version:** 7.0.5
**Last Updated:** 2026-03-25

---

## Supported IDEs

SINAPSE supports the following AI-powered development platforms:

### Quick Status Matrix

| IDE/CLI | Overall Status | How to Activate an Agent | Auto-Checks Before/After Actions |
| --- | --- | --- | --- |
| Claude Code | Works | `/agent-name` commands | Works (full) |
| Codex CLI | Limited | `/skills` then `sinapse-<agent-id>` | Limited (some checks need manual sync) |

Legend:
- `Works`: fully recommended for new users.
- `Limited`: usable with the documented workaround.

### What You Lose Without Full Auto-Checks

Some IDEs run automatic checks before and after each action (e.g., validating context, enforcing rules). Where this is not available, you compensate manually:

| IDE | Auto-Check Level | What Is Reduced | How to Compensate |
| --- | --- | --- | --- |
| Claude Code | Full | Nothing | Built-in checks handle everything |
| Codex CLI | Partial | Less automatic session tracking; some pre/post-action checks need manual trigger | Use `AGENTS.md` + `/skills` + sync/validation scripts |

### Beginner Decision Guide

If your goal is to get started as fast as possible:

1. **Best option:** Use `Claude Code` -- it has the most automation and fewest manual steps.
2. **Good option:** Use `Codex CLI` if you prefer a terminal-first workflow and can follow the `/skills` activation flow.

### Practical Consequences by Capability

- **Session tracking** (automatic start/end detection):
  - Automatic on Claude Code.
  - Manual or partial on Codex CLI.
- **Pre/post-action guardrails** (checks that run before and after each tool use):
  - Full on Claude Code.
  - Partial on Codex CLI (run sync scripts to compensate).
- **Automatic audit trail** (record of what happened in each session):
  - Richest on Claude Code.
  - Reduced on Codex CLI (compensate with manual logging or validator output).

---

## Setup Instructions

### Claude Code

**Recommendation Level:** Best SINAPSE integration

```yaml
config_file: .claude/CLAUDE.md
agent_folder: .claude/agents
activation: /agent-name (slash commands)
format: full-markdown-yaml
mcp_support: native
special_features:
  - Task tool for subagents
  - Native MCP integration
  - Hooks system (pre/post)
  - Custom skills
  - Memory persistence
```

**Setup:**

1. SINAPSE automatically creates `.claude/` directory on init
2. Agents are available as slash commands: `/dev`, `/qa`, `/architect`
3. Configure MCP servers in `~/.claude.json`

**Configuration:**

```bash
# Sync all enabled IDE targets (including Claude)
npm run sync:ide

# Verify setup
ls -la .claude/agents/
```

---

### Codex CLI

**Recommendation Level:** Best (terminal-first workflow)

```yaml
config_file: AGENTS.md
agent_folder: .codex/agents
activation: terminal instructions
skills_folder: .agents/skills (single native source)
format: markdown
mcp_support: native via Codex tooling
special_features:
  - AGENTS.md project instructions
  - /skills activators (sinapse-<agent-id>)
  - Strong CLI workflow support
  - Easy integration with repository scripts
  - Notify command plus emerging tool hooks in recent Codex releases
```

**Setup:**

1. Keep `AGENTS.md` at repository root
2. Run `npm run sync:ide:codex` to sync auxiliary agent files
3. Run `npm run sync:skills:codex` to generate project-local skills in `.agents/skills`
4. Use `/skills` and choose `sinapse-architect`, `sinapse-dev`, etc.
5. Use `npm run sync:skills:codex:global` only when you explicitly want global installation

**Configuration:**

```bash
# Sync Codex support files
npm run sync:ide:codex
npm run sync:skills:codex
npm run validate:codex-sync
npm run validate:codex-integration
npm run validate:codex-skills

# Verify setup
ls -la AGENTS.md .codex/agents/ .agents/skills/
```

---

## Sync System

### How Sync Works

SINAPSE maintains a single source of truth for agent definitions and synchronizes them to all configured IDEs:

```
┌─────────────────────────────────────────────────────┐
│                    SINAPSE Core                     │
│  .sinapse-ai/development/agents/  (Source of Truth) │
│                        │                            │
│            ┌───────────┼───────────┐                │
│            ▼           ▼                            │
│  .claude/     .codex/                               │
└─────────────────────────────────────────────────────┘
```

### Sync Commands

```bash
# Sync all IDE targets
npm run sync:ide

# Validate sync
npm run sync:ide:check
```

### Automatic Sync

SINAPSE can be configured to automatically sync on agent changes:

```yaml
# .sinapse-ai/core/config/sync.yaml
auto_sync:
  enabled: true
  watch_paths:
    - .sinapse-ai/development/agents/
  platforms:
    - claude
    - codex
```

---

## Troubleshooting

### Agent Not Appearing in IDE

```bash
# Verify agent exists in source
ls .sinapse-ai/development/agents/

# Sync and validate
npm run sync:ide
npm run sync:ide:check

# Check platform-specific directory
ls .claude/agents/       # Claude Code
```

### Sync Conflicts

```bash
# Preview what would change
npm run sync:ide -- --dry-run

# Force sync
npm run sync:ide
```

### MCP Not Working

```bash
# Check MCP status
sinapse mcp status

# Verify MCP configuration for IDE
cat ~/.claude.json  # For Claude Code
```

### IDE-Specific Issues

**Claude Code:**

- Ensure `.claude/` is in project root
- Check hooks permissions: `chmod +x .claude/hooks/*.py`

---

## Related Documentation

- [Claude Code Guide](../pt/platforms/claude-code.md)
- [Agent Selection Guide](./agent-selection-guide.md)
- [MCP Global Setup](./mcp-global-setup.md)

---

_SINAPSE IDE Integration Guide v7.0.5_
