---
task: tool-orchestration-pattern
responsavel: "@mcp-integrator"
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

# Tool Orchestration Pattern

## Objective

Design tool orchestration patterns that coordinate multiple MCP tools and native Claude Code tools into efficient workflows. Define sequencing rules, parallel execution strategies, error propagation chains, and fallback hierarchies for complex multi-tool operations.

## Pre-Conditions

- Available tools inventoried (native + MCP tools)
- Target workflows requiring multi-tool coordination identified
- Tool dependencies and data flow requirements mapped
- Performance requirements (latency budgets) established
- Error handling requirements per workflow defined

## Steps

1. **Map Tool Capabilities** — Create a capability matrix of all available tools: what each tool does, its input/output types, latency profile (fast < 1s, medium 1-5s, slow > 5s), reliability rating, and side effects (read-only vs. mutating).
2. **Identify Orchestration Scenarios** — Document workflows that require multiple tools: code analysis (Read + Grep + Bash), deployment (Git + CI + Notification), research (WebSearch + Read + Write), and data pipeline (Query + Transform + Store).
3. **Design Sequencing Patterns** — For each scenario, determine the execution order: sequential (output of tool A feeds tool B), parallel (tools A and B run independently, results merged), conditional (tool B runs only if tool A returns X), and iterative (tool A runs until condition met).
4. **Define Data Flow Contracts** — Specify how data passes between tools: direct piping (output schema matches input schema), transformation (intermediate mapping step), aggregation (multiple outputs combined), and filtering (subset of output forwarded).
5. **Build Parallel Execution Groups** — Identify tools that can run simultaneously within each workflow. Group independent tool calls for parallel execution. Define synchronization points where parallel branches must converge before proceeding.
6. **Design Error Propagation** — Define how errors cascade through the orchestration: fail-fast (abort entire workflow), fail-safe (skip failed tool, continue with partial data), retry-then-fail (retry N times with backoff), and fallback (switch to alternative tool).
7. **Create Fallback Hierarchies** — For critical operations, define tool fallback chains: primary tool fails -> try secondary tool -> try manual workaround -> escalate. Each fallback must produce compatible output for downstream tools.
8. **Implement Circuit Breakers** — Design circuit breaker patterns for unreliable tools: track failure rate over a sliding window, open circuit after N consecutive failures, attempt half-open after cooldown period, close circuit on success.
9. **Optimize for Token Efficiency** — Minimize unnecessary tool calls: cache results for reuse within the workflow, batch related operations (multiple file reads in one call), and avoid re-reading data that is already in context.
10. **Document Pattern Library** — Create a reusable pattern library with: pattern name, trigger conditions, tool sequence diagram, data flow, error handling strategy, and performance characteristics. Include code-level examples.

## Output

```markdown
# Tool Orchestration Patterns

## Tool Capability Matrix
| Tool | Type | Latency | Reliability | Side Effects |
|------|------|---------|------------|-------------|

## Orchestration Patterns

### Pattern: {name}
**Trigger:** {when to use this pattern}
**Tools:** {list of tools involved}
**Sequence:**
1. {step} -> {tool} -> {output}
2. {step} -> {tool} -> {output}

**Data Flow:**
{tool A} --{data type}--> {tool B} --{data type}--> {tool C}

**Error Handling:** {strategy}
**Fallback:** {alternative path}

**Performance:**
- Expected latency: {ms}
- Token cost: {estimate}

## Parallel Execution Groups
| Workflow | Parallel Group | Tools | Sync Point |
|----------|---------------|-------|-----------|

## Circuit Breaker Configuration
| Tool | Failure Threshold | Cooldown | Fallback |
|------|------------------|----------|----------|

## Anti-Patterns
| Anti-Pattern | Problem | Correct Approach |
|-------------|---------|-----------------|
```

## Quality Criteria

- At least 5 distinct orchestration patterns must be documented
- Every pattern must include error handling strategy and at least one fallback
- Parallel execution groups must be validated for no data dependencies
- Circuit breaker thresholds must be justified with expected failure rates
- Token efficiency optimizations must be quantified (estimated savings vs. naive approach)
- Anti-patterns section must include at least 3 common mistakes with corrections
