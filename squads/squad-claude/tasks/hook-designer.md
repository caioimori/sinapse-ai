---
task: hook-designer
responsavel: "@hooks-architect"
responsavel_type: Agent
atomic_layer: Task
elicit: false
Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true
Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Hook Designer

## Objective

Design and implement custom Claude Code hooks for specific automation needs. Produce hook configurations with proper event bindings, matchers, command definitions, and error handling for the target hook events.

## Inputs

- Automation goal (what should happen automatically)
- Target hook event(s) (PreToolUse, PostToolUse, Notification, Stop, SubagentStop, etc.)
- Trigger conditions (tool name, file pattern, error type, etc.)
- Desired action (run command, block action, modify output, send notification)
- Performance constraints (max latency tolerance)

## Steps

1. **Map Goal to Events** — Determine which hook event(s) are needed. PreToolUse for gates/blocking, PostToolUse for reactions, Notification for alerts, Stop for cleanup, SubagentStop for agent lifecycle.
2. **Define Matchers** — Specify the matcher configuration: tool name patterns, file globs, content patterns, or custom conditions that trigger the hook.
3. **Design Command** — Write the shell command or script that executes when the hook fires. Ensure it handles the hook payload (stdin JSON with session_id, tool_name, tool_input, etc.).
4. **Implement Error Handling** — Define behavior on command failure: block (for PreToolUse), warn (for PostToolUse), retry (with backoff), or ignore.
5. **Set Timeout and Performance** — Configure timeout values. PreToolUse hooks must be fast (< 500ms). PostToolUse hooks can be slower. Notification hooks should be async.
6. **Write Hook Configuration** — Produce the complete hook entry for settings.json or .claude/hooks.json in the correct schema format.
7. **Test Hook** — Describe test scenarios to verify the hook fires correctly, handles edge cases, and meets performance targets.

## Quality Gates

- Hook must fire on correct events only (no false triggers)
- Command must handle all expected payload shapes
- Timeout must be set appropriately for the event type
- Error handling must not block Claude Code operation (except intentional PreToolUse gates)
- Hook must be documented with purpose, trigger, and expected behavior

## Output Format

```json
{
  "hooks": {
    "{event_name}": [
      {
        "matcher": "{pattern}",
        "command": "{shell command}",
        "timeout": 5000,
        "on_error": "warn"
      }
    ]
  }
}
```

Plus documentation block explaining purpose, trigger conditions, and test plan.
