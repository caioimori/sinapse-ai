---
task_id: self-heal
agent: developer
phase: 3 (development-cycle)
type: stub
---

# self-heal — Self-Healing Loop with CodeRabbit

> **Stub task** (master-workflow-audit 2026-05-06 / Wave A PR-3): formalizes the self-healing capability invoked by `development-cycle.yaml` Phase 3. The actual implementation logic lives inside `dev-develop-story.md` and the `@developer` agent's CodeRabbit integration.

## Purpose

Run an automated self-healing loop after `dev-develop-story.md` produces an initial implementation. Uses CodeRabbit to detect CRITICAL and HIGH severity issues and apply fixes iteratively (max 3 iterations).

## When This Task Runs

- **Triggered by:** `development-cycle.yaml` Phase 3 (`3_self_healing`)
- **Condition:** `config.coderabbit_integration.enabled == true`
- **Skip if:** CodeRabbit disabled or unavailable

## Inputs

- `implementation` (from `2_development.implementation`) — code produced by developer

## Outputs

- `healed_code`:
  - `iterations` (number): how many self-heal cycles ran
  - `issues_fixed` (array): issues resolved per iteration
  - `issues_remaining` (array): unresolved CRITICAL/HIGH issues

## Execution

```
iteration = 0
while CRITICAL or HIGH issues found AND iteration < max_iterations:
  invoke CodeRabbit review
  apply auto-fix for CRITICAL + HIGH (severity_filter)
  iteration++

if CRITICAL persist after max_iterations (default: 3):
  HALT — escalate to manual intervention
  emit healed_code with issues_remaining
```

## Configuration

Defined in `.sinapse-ai/core-config.yaml` under `coderabbit_integration`:

```yaml
coderabbit_integration:
  enabled: true
  max_iterations: 3
  severity_filter: [CRITICAL, HIGH]
  auto_fix: true
```

## Implementation Reference

The actual self-healing logic is implemented in:
- `.claude/rules/coderabbit-integration.md` — protocol details
- `dev-develop-story.md` — invokes self-heal as part of Phase 3
- `@developer` agent persona — orchestrates the loop

## Acceptance Criteria

- [ ] Self-heal completes within `max_iterations` OR halts with clear escalation message
- [ ] All auto-fixes are committed atomically (no partial fix states)
- [ ] `healed_code.issues_remaining` is empty OR escalation logged

## Error Handling

| Error | Recovery |
|---|---|
| CodeRabbit unavailable | Skip phase, proceed to 4_quality_gate |
| Auto-fix breaks build | Rollback iteration, log, continue |
| Persistent CRITICAL after max_iterations | Halt, escalate manually |

## See Also

- `dev-develop-story.md` — main developer task
- `qa-review-story.md` — Phase 4 quality gate (runs after self-heal)
- `.claude/rules/coderabbit-integration.md` — full protocol
