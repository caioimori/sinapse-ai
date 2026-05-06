# Claude Code Hooks Reference

## Overview

Claude Code hooks are user-defined shell commands that execute at specific points during the Claude Code lifecycle. They enable automation, enforcement, and integration without modifying Claude Code itself. Hooks are configured in `.claude/settings.json` under the `hooks` key.

## Configuration Location

Hooks can be defined at multiple levels:
- **Project:** `.claude/settings.json` (shared with team, committed to git)
- **User:** `~/.claude/settings.json` (personal, not committed)
- **Managed policies:** Enterprise-level (cannot be overridden)

## Hook Configuration Schema

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "optional_pattern",
        "command": "shell_command_to_execute",
        "timeout": 5000,
        "on_error": "warn"
      }
    ]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `matcher` | string (regex) | No | Pattern to match against the tool name or event context. If omitted, hook fires for ALL events of this type. |
| `command` | string | Yes | Shell command to execute. Receives event payload via stdin as JSON. |
| `timeout` | number (ms) | No | Maximum execution time. Default varies by event type. |
| `on_error` | string | No | Behavior on command failure: `"warn"` (log and continue), `"error"` (block and report), `"ignore"` (silent). Default: `"warn"`. |

---

## Hook Events Reference

### PreToolUse

**Trigger:** Before any tool is executed.
**Purpose:** Gate/block tool execution, validate inputs, enforce policies.
**Timing:** Synchronous — Claude Code waits for the hook to complete before proceeding.

**Payload (stdin JSON):**
```json
{
  "session_id": "uuid",
  "tool_name": "Bash",
  "tool_input": {
    "command": "rm -rf /tmp/test",
    "description": "Delete test directory"
  }
}
```

**Return behavior:**
- Exit code 0: Tool execution proceeds
- Exit code non-0: Tool execution is BLOCKED, error message shown to user
- Stdout: If non-empty and exit 0, replaces the tool input (advanced usage)

**Use Cases:**
- Block dangerous commands (`rm -rf`, `git push --force`)
- Validate file paths before Write/Edit operations
- Enforce naming conventions on file creation
- Log all tool invocations for audit trail
- Rate-limit expensive operations

**Example: Block destructive git commands**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "python .claude/hooks/block-dangerous-git.py",
        "timeout": 3000,
        "on_error": "error"
      }
    ]
  }
}
```

### PostToolUse

**Trigger:** After a tool completes execution successfully.
**Purpose:** React to tool outputs, trigger side effects, chain automations.
**Timing:** Synchronous — Claude Code waits before presenting the result.

**Payload (stdin JSON):**
```json
{
  "session_id": "uuid",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "content": "..."
  },
  "tool_output": {
    "success": true,
    "file_path": "/path/to/file.ts"
  }
}
```

**Return behavior:**
- Exit code 0: Normal continuation
- Exit code non-0: Warning logged (does not undo the tool execution)
- Stdout: If non-empty, appended to the tool output as additional context

**Use Cases:**
- Auto-lint after file Write/Edit operations
- Auto-run tests after code changes
- Update dependency graphs after package changes
- Notify external systems of file changes
- Auto-format code after generation

**Example: Auto-lint on file write**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "node .claude/hooks/auto-lint.js",
        "timeout": 10000,
        "on_error": "warn"
      }
    ]
  }
}
```

### Notification

**Trigger:** When Claude Code generates a notification (e.g., task complete, error encountered, waiting for input).
**Purpose:** Route notifications to external channels, log events, trigger alerts.
**Timing:** Asynchronous — does not block Claude Code operation.

**Payload (stdin JSON):**
```json
{
  "session_id": "uuid",
  "type": "notification",
  "title": "Task Complete",
  "message": "Successfully refactored auth module",
  "severity": "info"
}
```

**Use Cases:**
- Send Slack/Discord messages on task completion
- Email notifications for long-running operations
- Desktop notifications via OS notification system
- Log notifications to a monitoring dashboard
- Trigger CI/CD pipelines on specific events

**Example: Desktop notification**
```json
{
  "hooks": {
    "Notification": [
      {
        "command": "python .claude/hooks/desktop-notify.py",
        "timeout": 5000,
        "on_error": "ignore"
      }
    ]
  }
}
```

### Stop

**Trigger:** When Claude Code completes a turn (finishes responding).
**Purpose:** Cleanup, logging, state persistence, post-turn automation.
**Timing:** Synchronous — runs before control returns to user.

**Payload (stdin JSON):**
```json
{
  "session_id": "uuid",
  "type": "stop",
  "reason": "end_of_turn",
  "stop_reason": "natural",
  "token_usage": {
    "input": 5000,
    "output": 2000
  }
}
```

**Use Cases:**
- Log token usage for cost tracking
- Persist session state to disk
- Run comprehensive tests after a coding session
- Generate session summary reports
- Clean up temporary files created during the turn

**Example: Token usage tracker**
```json
{
  "hooks": {
    "Stop": [
      {
        "command": "node .claude/hooks/track-tokens.js",
        "timeout": 5000,
        "on_error": "ignore"
      }
    ]
  }
}
```

### SubagentStop

**Trigger:** When a subagent (spawned by the main agent) completes its task.
**Purpose:** Aggregate subagent results, trigger follow-up actions, manage agent lifecycle.
**Timing:** Synchronous — runs before the main agent processes the subagent's result.

**Payload (stdin JSON):**
```json
{
  "session_id": "uuid",
  "type": "subagent_stop",
  "subagent_id": "uuid",
  "result": "...",
  "status": "completed"
}
```

**Use Cases:**
- Aggregate results from parallel subagents
- Trigger next subagent in a chain
- Log subagent performance metrics
- Clean up subagent worktrees
- Validate subagent output before accepting

### PreToolUseOutput

**Trigger:** Before tool output is presented to the model.
**Purpose:** Filter, transform, or redact tool output before Claude processes it.
**Timing:** Synchronous.

**Use Cases:**
- Redact sensitive information from command output
- Truncate overly large outputs to save context tokens
- Transform output format for better model comprehension
- Add annotations or metadata to output

### PostToolUseOutput

**Trigger:** After tool output has been processed by the model.
**Purpose:** Log final tool results, update external tracking, chain reactions.
**Timing:** Asynchronous.

**Use Cases:**
- Log all tool results for compliance
- Update project dashboards with operation results
- Trigger external webhook on specific outcomes

---

## Hook Patterns

### Pattern 1: Auto-Lint Pipeline

Chain PostToolUse with a linter to automatically fix code after generation:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "bash -c 'INPUT=$(cat); FILE=$(echo $INPUT | jq -r .tool_input.file_path); npx eslint --fix \"$FILE\" 2>/dev/null || true'",
        "timeout": 15000,
        "on_error": "warn"
      }
    ]
  }
}
```

### Pattern 2: Security Gate

Block execution of dangerous commands using PreToolUse:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "bash -c 'INPUT=$(cat); CMD=$(echo $INPUT | jq -r .tool_input.command); echo \"$CMD\" | grep -qE \"rm -rf /|:(){ :|:& };:|dd if=/dev|mkfs|> /dev/sd\" && exit 1 || exit 0'",
        "timeout": 2000,
        "on_error": "error"
      }
    ]
  }
}
```

### Pattern 3: Notification Router

Route notifications to different channels based on severity:

```json
{
  "hooks": {
    "Notification": [
      {
        "command": "python .claude/hooks/route-notification.py",
        "timeout": 10000,
        "on_error": "ignore"
      }
    ]
  }
}
```

Where `route-notification.py` reads severity from payload and sends to Slack (critical), email (warning), or log file (info).

### Pattern 4: Auto-Test on Change

Run relevant tests after code changes:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "bash -c 'INPUT=$(cat); FILE=$(echo $INPUT | jq -r .tool_input.file_path); if [[ \"$FILE\" == *.test.* ]]; then npx jest \"$FILE\" --passWithNoTests 2>&1 | tail -5; elif [[ \"$FILE\" == *.ts || \"$FILE\" == *.tsx ]]; then TEST=\"${FILE%.ts*}.test${FILE##*.ts}\"; [ -f \"$TEST\" ] && npx jest \"$TEST\" --passWithNoTests 2>&1 | tail -5; fi'",
        "timeout": 30000,
        "on_error": "warn"
      }
    ]
  }
}
```

### Pattern 5: Pre-Commit Quality Gate

Run quality checks before any git commit:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "bash -c 'INPUT=$(cat); CMD=$(echo $INPUT | jq -r .tool_input.command); if echo \"$CMD\" | grep -q \"git commit\"; then npm run lint --silent && npm run typecheck --silent || (echo \"Quality checks failed\" && exit 1); fi'",
        "timeout": 60000,
        "on_error": "error"
      }
    ]
  }
}
```

### Pattern 6: Token Budget Monitor

Track cumulative token usage and warn when approaching limits:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "node .claude/hooks/token-budget.js",
        "timeout": 3000,
        "on_error": "ignore"
      }
    ]
  }
}
```

---

## Best Practices

### Performance
- PreToolUse hooks MUST be fast (< 500ms) — they block tool execution
- PostToolUse hooks should complete within 10s — they block result display
- Notification and Stop hooks can be slower — they run at natural pauses
- Use `timeout` to prevent hung hooks from blocking the session

### Reliability
- Always set `on_error` explicitly — don't rely on defaults
- Use `"error"` only for security-critical PreToolUse gates
- Use `"warn"` for automation that should not block work
- Use `"ignore"` for optional enhancements (notifications, logging)

### Security
- Never pass untrusted data directly to shell commands — always sanitize
- Use `jq` to extract specific fields rather than eval-ing the entire payload
- Keep hook scripts in version control for auditability
- Test hooks in a sandbox before deploying to production

### Ordering
- Multiple hooks on the same event execute in array order
- If hook A must run before hook B, place A first in the array
- Hooks do NOT have explicit dependency declarations — order is implicit

### Debugging
- Add `set -x` to shell commands temporarily for debug output
- Check stderr for hook execution errors
- Use a logging hook on Stop to capture session diagnostics
- Test hooks independently with `echo '{"tool_name":"Bash"}' | your_hook_command`
