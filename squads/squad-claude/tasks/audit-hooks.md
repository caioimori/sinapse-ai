---
task: audit-hooks
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

# Audit Hooks

## Objective

Audit all existing Claude Code hooks for completeness, correctness, performance, and security. Identify missing automation opportunities, redundant hooks, and potential failure points.

## Inputs

- Current hook configurations (settings.json hooks section or .claude/hooks.json)
- Project automation requirements
- Known hook-related issues (if any)

## Steps

1. **Inventory All Hooks** — List every configured hook with its event, matcher, command, timeout, and error handling. Create a complete registry.
2. **Check Event Coverage** — Map hooks to the full event list (PreToolUse, PostToolUse, Notification, Stop, SubagentStop, etc.). Identify unhandled events that could benefit from automation.
3. **Validate Matchers** — Verify each matcher pattern is correct, specific enough (no overly broad matches), and does not conflict with other hooks on the same event.
4. **Test Commands** — For each hook command, verify it exists, is executable, handles the expected payload schema, and returns within the configured timeout.
5. **Assess Performance** — Check timeout configurations against event type requirements. Flag PreToolUse hooks with > 500ms timeout. Identify hooks that could cause latency spikes.
6. **Review Security** — Check if any hooks execute untrusted commands, expose sensitive data in payloads, or could be exploited via crafted tool inputs.
7. **Identify Gaps** — Based on project requirements, recommend hooks that should exist but don't (e.g., no auto-lint hook, no security gate, no notification routing).
8. **Generate Report** — Produce a scored audit report with findings and recommendations.

## Quality Gates

- Every configured hook must be validated
- Performance assessment must include measured or estimated latency
- Security review must cover command injection and data exposure risks
- Recommendations must be actionable with specific hook configurations

## Output Format

```markdown
# Hook Audit Report

## Hook Inventory
| # | Event | Matcher | Command | Timeout | Status |
|---|-------|---------|---------|---------|--------|
| 1 | PreToolUse | ... | ... | 5000ms | OK/WARN/FAIL |

## Coverage Map
- PreToolUse: X hooks (coverage: Y%)
- PostToolUse: X hooks
- ...

## Issues Found
1. [CRITICAL] ...
2. [WARNING] ...

## Missing Hooks (Recommendations)
1. ...

## Score: X/5
```
