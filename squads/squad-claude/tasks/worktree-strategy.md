---
task: worktree-strategy
responsavel: "@swarm-orqx"
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

# Worktree Strategy

## Objective

Design a Git worktree isolation strategy for parallel Claude Code agents, defining branch naming conventions, worktree lifecycle management, merge protocols, and cleanup procedures.

## Inputs

- Number of parallel agents planned
- Branch strategy (feature branches, trunk-based, etc.)
- Base branch for worktrees
- Merge conflict likelihood (low/medium/high based on file overlap)
- Disk space constraints

## Steps

1. **Assess Worktree Need** — Determine if worktrees are necessary. If agents work on completely separate files on the same branch, worktrees add unnecessary overhead. If agents modify overlapping areas, worktrees provide essential isolation.
2. **Design Branch Naming Convention** — Define a pattern: `agent/{agent-name}/{feature-slug}` or `parallel/{task-id}/{unit-number}`. Must be sortable and identifiable.
3. **Define Worktree Lifecycle** — Create -> Configure -> Execute -> Verify -> Merge -> Cleanup. Each phase must have explicit entry/exit criteria.
4. **Plan Merge Protocol** — Define merge order (least conflicts first), conflict resolution strategy (agent re-merge, human review, or automated resolution), and verification steps post-merge.
5. **Design Cleanup Procedure** — Automatic worktree removal after successful merge. Handle orphaned worktrees (agent failure without cleanup). Include disk space monitoring.
6. **Handle Edge Cases** — Plan for: agent failure mid-work, merge conflicts that require human intervention, disk space exhaustion, and worktree corruption.
7. **Generate Commands** — Produce the exact git commands for each lifecycle phase: create, configure, merge, and cleanup.

## Quality Gates

- Branch naming convention must be consistent and machine-parseable
- Merge protocol must handle all identified conflict scenarios
- Cleanup procedure must leave no orphaned worktrees or branches
- Disk space impact must be estimated and within constraints

## Output Format

```markdown
# Worktree Strategy: {project}

## Branch Naming
Pattern: `{pattern}`

## Lifecycle
| Phase | Command | Criteria |
|-------|---------|----------|
| Create | git worktree add ... | ... |
| Merge | git merge ... | ... |
| Cleanup | git worktree remove ... | ... |

## Merge Protocol
{ordered steps}

## Edge Case Handling
{scenarios and responses}

## Estimated Disk Impact
{size per worktree x number of worktrees}
```
