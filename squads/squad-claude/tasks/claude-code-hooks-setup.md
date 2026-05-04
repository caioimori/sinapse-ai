---
task: claude-code-hooks-setup
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

# Claude Code Hooks Setup

## Objective

Set up a comprehensive Claude Code hooks system for a project, implementing automation hooks across all available event types (PreToolUse, PostToolUse, Notification, Stop, SubagentStop). Produce a fully configured hooks setup with testing and documentation.

## Pre-Conditions

- Claude Code installed and project initialized
- Automation goals documented (what should be automated)
- Understanding of project workflow (which tools are used, when)
- Shell scripting capability available (bash/zsh)
- Performance budget defined (max hook execution time)

## Steps

1. **Audit Automation Opportunities** — Review the project workflow and identify automation candidates: pre-commit validation, file generation after scaffold, notification on long operations, security scanning before file writes, format enforcement, and dependency checking.
2. **Map Goals to Hook Events** — For each automation goal, select the appropriate hook event: PreToolUse for gates and validation (block unsafe operations), PostToolUse for reactions (trigger after tool completes), Notification for alerts, Stop for session cleanup, SubagentStop for agent lifecycle management.
3. **Design Hook Scripts** — For each hook, write the shell script that will execute. Each script must: read the JSON payload from stdin, extract relevant fields (session_id, tool_name, tool_input), perform its action, and exit with appropriate code (0=allow, non-zero=block for PreToolUse).
4. **Configure Matchers** — Define precise matcher patterns to prevent false triggers. Use tool name matchers for tool-specific hooks, file glob matchers for path-specific hooks, and content pattern matchers for context-specific hooks. Test matchers against sample payloads.
5. **Set Performance Budgets** — Configure timeouts for each hook: PreToolUse hooks must complete in < 500ms (they block the tool), PostToolUse hooks should complete in < 2s, Notification hooks can be longer but should use async patterns for > 5s operations.
6. **Implement Error Handling** — Configure on_error behavior for each hook: "block" for security-critical PreToolUse hooks, "warn" for advisory PostToolUse hooks, "ignore" for non-critical notifications. Ensure hook failures never crash the Claude Code session.
7. **Create the Configuration** — Write the complete hooks configuration in .claude/settings.json (project-level) or ~/.claude/settings.json (user-level). Organize hooks by event type, add comments explaining each hook's purpose.
8. **Build Test Harness** — Create a test script that simulates hook payloads: generate sample JSON payloads for each hook event, pipe them through the hook scripts, verify exit codes and output. Include tests for edge cases (malformed JSON, missing fields, timeout).
9. **Test Integration** — Trigger each hook in a live Claude Code session: perform the action that should fire the hook, verify it executes correctly, check for false triggers on similar but non-matching actions, and measure actual latency.
10. **Document the Setup** — Write documentation covering: what each hook does, when it fires, how to disable individual hooks, how to add new hooks, troubleshooting common issues, and the test harness usage.

## Output

```markdown
# Claude Code Hooks Setup

## Hooks Registry
| Hook | Event | Matcher | Script | Timeout | On Error |
|------|-------|---------|--------|---------|----------|

## Configuration (.claude/settings.json)
{complete JSON configuration}

## Hook Scripts
### {hook_name}.sh
- Purpose: {description}
- Trigger: {event + matcher}
- Performance: {expected latency}

## Test Harness
- Location: {path to test script}
- Usage: `{command to run tests}`
- Coverage: {list of tested scenarios}

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
```

## Quality Criteria

- At least one hook must be configured for each event type used
- All PreToolUse hooks must complete within 500ms in testing
- Hook scripts must handle malformed JSON input without crashing
- Test harness must cover happy path, edge cases, and error scenarios
- Configuration must be valid JSON that Claude Code accepts without errors
- Documentation must explain how to add, modify, and disable hooks
