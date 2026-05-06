---
task_id: push-and-pr
agent: devops
phase: 5 (development-cycle)
type: stub
---

# push-and-pr — Push & Pull Request Creation

> **Stub task** (master-workflow-audit 2026-05-06 / Wave A PR-3): formalizes the push + PR automation invoked by `development-cycle.yaml` Phase 5. The actual implementation lives inside the `@devops` agent's `*push` command and `bin/utils/pre-push-safety.js` infrastructure.

## Purpose

After `qa-review-story.md` produces a PASS/CONCERNS verdict, automatically:
1. Push the story branch to origin
2. Create a Pull Request with title + body referencing the story
3. Optionally enable auto-merge if branch protections + CI allow

## When This Task Runs

- **Triggered by:** `development-cycle.yaml` Phase 5 (`5_push`)
- **Pre-condition:** Story status `InReview`, QA verdict `PASS` or `CONCERNS`
- **Spawn behavior:** `spawn_in_terminal: true` (uses TerminalSpawner if available)

## Inputs

- `reviewed_code` (from `4_quality_gate.review_result`) — QA verdict + issues
- `story_file` — story markdown with metadata
- `implementation` (from `2_development.implementation`) — final code

## Outputs

- `push_result`:
  - `commit_hash` (string): SHA of pushed commit
  - `branch_name` (string): branch pushed to origin
  - `pr_url` (string): GitHub PR URL
  - `pr_number` (number)
  - `auto_merge_enabled` (boolean)

## Execution

```
1. Verify branch is up-to-date with origin/main (rebase if behind)
2. Run pre-push safety checks:
   - validate:no-personal-leaks
   - validate:no-external-refs
   - validate:orqx-discipline
   - validate:manifest:parity
   - validate:parity:fast (if agent files changed)
3. Push branch to origin (force-with-lease if amended)
4. gh pr create with auto-generated title + body referencing story
5. gh pr merge --auto --squash (if branch protections allow)
6. Return push_result
```

## Implementation Reference

The actual push + PR logic is implemented in:
- `@devops` agent persona — owns this exclusive authority
- `bin/utils/pre-push-safety.js` — safety checks
- `.husky/pre-push` — hook chain
- `.claude/rules/safe-collaboration.md` — branch / PR protocol

## Authority Note

Per `.claude/rules/agent-authority.md`, **only `@devops` (Pipeline) can execute push/PR commands**. Other agents (developer, quality-gate, etc.) MUST delegate to `@devops` for this phase.

## Acceptance Criteria

- [ ] Branch pushed successfully to origin
- [ ] PR created with valid title + body
- [ ] Story file references PR number
- [ ] All pre-push validations pass

## Error Handling

| Error | Recovery |
|---|---|
| Pre-push validation fails | Halt, report to user with fix instructions |
| Push rejected (behind upstream) | Auto-rebase + retry once |
| `gh` CLI not installed | Fall back to manual instructions |
| Branch protection blocks merge | Leave PR open, notify reviewer |

## See Also

- `@devops` agent (`.sinapse-ai/development/agents/devops.md`)
- `.claude/rules/safe-collaboration.md` — git safety protocol
- `.husky/pre-push` — hook chain
- `bin/utils/pre-push-safety.js` — implementation
