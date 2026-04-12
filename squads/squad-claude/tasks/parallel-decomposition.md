---
task: parallel-decomposition
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

# Parallel Decomposition

## Objective

Decompose a complex task into parallelizable work units that can be executed by multiple Claude Code subagents simultaneously. Produce a dependency graph, work unit definitions, and aggregation strategy.

## Inputs

- Complex task description
- Files involved (full list)
- Known dependencies between files or features
- Available parallelism (max concurrent agents)
- Time constraint (if any)

## Steps

1. **Analyze Dependencies** — Map all file-level and feature-level dependencies. Build a dependency graph identifying which work can proceed independently.
2. **Identify Parallel Units** — Group work into units that have no shared file writes. Each unit must be completable by one agent without needing another agent's output.
3. **Apply Independence Test** — For each pair of units, verify: no shared file writes, no data dependency (unit B needs unit A's output), no ordering constraint (unit B must follow A).
4. **Design Synchronization Points** — Where units must reconverge (e.g., all feature code done before integration tests), define explicit sync points with completion criteria.
5. **Plan Merge Strategy** — Define how parallel outputs are combined: git merge (for worktree isolation), file concatenation (for documentation), or manual review (for conflicting concerns).
6. **Estimate Speedup** — Calculate theoretical speedup: total sequential time vs. critical path time with N agents. Account for coordination overhead (typically 10-20%).
7. **Generate Work Unit Specs** — For each parallel unit, produce a complete specification: scope, files, expected output, dependencies, and completion criteria.

## Quality Gates

- No two parallel units may write to the same file
- Dependency graph must be acyclic (no circular dependencies between units)
- Every file in the original task must be assigned to exactly one unit
- Merge strategy must handle all identified conflict scenarios
- Estimated speedup must be >= 1.5x to justify parallelization overhead

## Output Format

```markdown
# Parallel Decomposition: {task name}

## Dependency Graph
{ASCII diagram}

## Work Units
| Unit | Files | Dependencies | Agent | Est. Time |
|------|-------|-------------|-------|-----------|

## Synchronization Points
1. {point}: {criteria}

## Merge Strategy
{description}

## Estimated Speedup
- Sequential: {X} min
- Parallel ({N} agents): {Y} min
- Speedup: {ratio}x
```
