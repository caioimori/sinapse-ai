---
task: mcp-workflow
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

# MCP Workflow

## Objective

Create MCP-powered workflows that combine multiple MCP servers into coherent automation pipelines. Design tool chains where the output of one MCP tool feeds into another, enabling complex cross-service automations.

## Inputs

- Workflow goal (e.g., "sync Figma designs to code", "auto-create GitHub issues from Notion tasks")
- Available MCP servers (already configured)
- Trigger condition (manual, hook-based, scheduled)
- Data flow requirements (what data moves between services)

## Steps

1. **Map Data Flow** — Draw the data flow between MCP servers: Source -> Transform -> Destination. Identify what data each tool needs and produces.
2. **Identify Tool Chain** — For each step in the flow, identify the specific MCP tool to call. Verify each tool's input/output schema is compatible with the chain.
3. **Design Error Handling** — For each step: what happens on failure? Retry? Skip? Compensate (undo previous steps)? Alert?
4. **Handle Authentication Flow** — Ensure each server in the chain has valid credentials and that token refresh or re-authentication is handled gracefully.
5. **Build Orchestration Logic** — Write the orchestration as either a hook chain (for event-driven), a Claude Code skill (for manual trigger), or a CI/CD step (for scheduled).
6. **Add Monitoring** — Design health checks and logging for each step in the workflow. Include latency tracking and error rate monitoring.
7. **Test End-to-End** — Create a test scenario that exercises the full workflow with representative data.

## Quality Gates

- Data flow must be fully mapped with no gaps
- Every tool in the chain must have compatible input/output schemas
- Error handling must cover all failure modes
- Authentication must not require manual intervention during workflow execution
- End-to-end test must pass

## Output Format

```markdown
# MCP Workflow: {name}

## Data Flow Diagram
{ASCII diagram or description}

## Tool Chain
| Step | MCP Server | Tool | Input | Output |
|------|-----------|------|-------|--------|

## Error Handling Matrix
| Step | Failure Mode | Action |
|------|-------------|--------|

## Orchestration
{hook config / skill definition / CI step}

## Test Plan
{end-to-end test scenario}
```
