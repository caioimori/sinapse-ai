# Claude Code Configuration Reference

## Overview

Claude Code's behavior is controlled by a layered configuration system. Higher layers override lower layers. Understanding this hierarchy is essential for effective configuration management.

## Configuration Hierarchy

```
Priority (highest to lowest):
1. Managed Policies (enterprise, cannot be overridden)
2. User Global (~/.claude/settings.json)
3. Project (.claude/settings.json)
4. Project Local (.claude/settings.local.json, gitignored)
5. Directory-level CLAUDE.md files
6. Root CLAUDE.md
```

### Layer Details

| Layer | Path | Committed to Git? | Who Controls? |
|-------|------|--------------------|---------------|
| Managed Policies | Deployed by IT/admin | N/A | Organization admins |
| User Global | `~/.claude/settings.json` | No | Individual developer |
| Project | `.claude/settings.json` | Yes | Team (code review) |
| Project Local | `.claude/settings.local.json` | No (.gitignored) | Individual developer |
| Dir CLAUDE.md | `{dir}/CLAUDE.md` | Yes | Team |
| Root CLAUDE.md | `CLAUDE.md` | Yes | Team |

---

## settings.json Schema

### Permissions

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm test)",
      "Read",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(curl*|*wget*)",
      "Write(~/.ssh/*)",
      "Write(.env*)"
    ],
    "auto_approve": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)"
    ]
  }
}
```

#### Permission Syntax

| Pattern | Meaning | Example |
|---------|---------|---------|
| `ToolName` | All invocations of that tool | `Read` — any file read |
| `ToolName(pattern)` | Tool with matching argument | `Bash(npm test)` — only npm test |
| `ToolName(glob*)` | Tool with glob-matched argument | `Bash(git *)` — any git command |
| `ToolName(path/*)` | Tool with path pattern | `Write(src/*)` — writes in src/ |

#### Permission Precedence

1. `deny` always wins over `allow` and `auto_approve`
2. `auto_approve` wins over `allow` (no prompt shown)
3. `allow` is the default for unmatched tools (prompt shown)
4. Unmatched tools prompt the user for approval

### MCP Servers

```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio",
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "KEY": "${ENV_VAR_NAME}"
      }
    }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"stdio"` or `"sse"` | Yes | Transport type |
| `command` | string | Yes (stdio) | Command to execute |
| `args` | string[] | No | Command arguments |
| `env` | object | No | Environment variables (supports `${}` substitution) |
| `url` | string | Yes (sse) | SSE server URL |
| `headers` | object | No (sse) | HTTP headers for SSE connection |

### Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "regex_pattern",
        "command": "shell_command",
        "timeout": 5000,
        "on_error": "warn"
      }
    ],
    "PostToolUse": [],
    "Notification": [],
    "Stop": [],
    "SubagentStop": []
  }
}
```

See `claude-code-hooks-reference.md` for detailed hook documentation.

---

## Environment Variables

### Claude Code Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_MAX_TOKENS` | Maximum tokens per response | Model default |
| `CLAUDE_CODE_USE_BEDROCK` | Use AWS Bedrock as provider | `false` |
| `CLAUDE_CODE_USE_VERTEX` | Use Google Vertex as provider | `false` |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Disable telemetry | `false` |
| `CLAUDE_CODE_SKIP_CLAUDE_MD` | Skip loading CLAUDE.md files | `false` |

### Anthropic API Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key for direct Anthropic API access |
| `ANTHROPIC_BASE_URL` | Custom API base URL (for proxies) |
| `ANTHROPIC_MODEL` | Override default model |

### AWS Bedrock Variables

| Variable | Purpose |
|----------|---------|
| `AWS_REGION` | AWS region for Bedrock |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_SESSION_TOKEN` | AWS session token (temporary credentials) |
| `ANTHROPIC_BEDROCK_MODEL_ID` | Bedrock model ID override |

### Google Vertex Variables

| Variable | Purpose |
|----------|---------|
| `CLOUD_ML_REGION` | Google Cloud region |
| `ANTHROPIC_VERTEX_PROJECT_ID` | GCP project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account key |

---

## .claude/ Directory Structure

```
.claude/
├── settings.json          # Project-level settings (committed)
├── settings.local.json    # Developer-local settings (gitignored)
├── rules/                 # Contextual rules directory
│   ├── global-rule.md     # Loads always (no paths: frontmatter)
│   └── scoped-rule.md     # Loads conditionally (has paths: frontmatter)
└── commands/              # Custom slash commands (if applicable)
```

### .gitignore Entries

```gitignore
# Claude Code local settings
.claude/settings.local.json

# Claude Code runtime data
.claude/cache/
.claude/logs/
```

---

## Managed Policies (Enterprise)

Managed policies are organization-level configurations that cannot be overridden by project or user settings. They are deployed by IT administrators.

### Policy Capabilities

| Policy | Effect |
|--------|--------|
| `deny` rules | Tools/commands that are always blocked organization-wide |
| `required_hooks` | Hooks that must be present in every project |
| `mcp_restrictions` | MCP servers that are allowed or blocked |
| `model_restrictions` | Which models can be used |
| `network_restrictions` | Allowed/blocked network destinations |

### Policy Deployment

Managed policies are distributed via:
- MDM (Mobile Device Management) systems
- Central configuration repositories
- Enterprise Claude Code admin console
- Environment variable injection

### Policy Merge Behavior

```
Managed deny + Project allow = DENY (managed always wins)
Managed allow + Project deny = DENY (most restrictive wins for deny)
Managed auto_approve + Project deny = DENY (deny always wins)
```

---

## CLAUDE.md File Format

### Root CLAUDE.md

Located at project root. Loaded on every interaction. Should contain universal project information.

```markdown
# Project Name

Brief description.

## Stack
{technology table}

## Commands
{build, test, lint commands}

## Conventions
{coding standards that differ from defaults}

## Anti-Patterns
{things to never do}
```

### Directory CLAUDE.md

Located in any subdirectory. Loaded when files in that directory (or subdirectories) are being edited. Should contain directory-specific instructions.

```markdown
# src/components/

Component conventions specific to this directory.

## Patterns
- Named exports only
- CSS Modules for styling
- Co-located tests
```

### Rules Files (.claude/rules/*.md)

Optional YAML frontmatter controls when the rule loads:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/api/**/*.js"
description: "API route conventions"
---

# API Routes

- Use Express Router pattern
- Include input validation with Zod
- Return consistent error format: { error: string, code: number }
```

Without `paths:` frontmatter, the rule loads globally (every interaction).

---

## Security Best Practices

### Minimal Permission Principle

Start with restrictive permissions and open up as needed:

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf*)",
      "Bash(*--force*)",
      "Bash(curl*|wget*)",
      "Write(.env*)",
      "Write(*.pem)",
      "Write(*.key)",
      "Read(.env*)"
    ],
    "auto_approve": [
      "Read(src/**)",
      "Read(tests/**)",
      "Glob",
      "Grep"
    ]
  }
}
```

### Secret Protection

1. **Never** put API keys, tokens, or passwords in settings.json
2. **Always** use `${ENV_VAR}` substitution for secrets
3. **Deny** read/write access to secret files (.env, .pem, .key)
4. **Gitignore** settings.local.json (may contain local paths)

### Network Access Control

```json
{
  "permissions": {
    "deny": [
      "Bash(curl*)",
      "Bash(wget*)",
      "Bash(nc *)",
      "WebFetch(*)",
      "WebSearch(*)"
    ],
    "allow": [
      "WebFetch(https://api.github.com/*)",
      "WebFetch(https://docs.*)"
    ]
  }
}
```

---

## Troubleshooting Configuration

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Settings not applied | Wrong file path | Verify `.claude/settings.json` exists at project root |
| Rules not loading | Missing/wrong `paths:` pattern | Validate glob pattern matches actual files |
| Permissions not working | Syntax error in pattern | Check tool name casing and pattern syntax |
| MCP server not connecting | Missing env var | Verify `${VAR}` resolves to actual value |
| CLAUDE.md ignored | `CLAUDE_CODE_SKIP_CLAUDE_MD=true` | Unset the environment variable |
| Local settings committed | Missing .gitignore | Add `.claude/settings.local.json` to .gitignore |

### Diagnostic Steps

1. **Check effective config:** Review which settings file is being loaded
2. **Validate JSON:** Ensure settings.json is valid JSON (no trailing commas)
3. **Check env vars:** Verify all `${}` references resolve
4. **Test rules loading:** Edit a file matching a rule's `paths:` and verify the rule applies
5. **Review merge order:** Remember managed > user > project > local precedence
