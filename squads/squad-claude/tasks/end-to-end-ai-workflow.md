---
task: end-to-end-ai-workflow
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

# End-to-End AI Workflow

## Objective

Design complete AI-powered workflows that take a process from input to final output using Claude Code as the orchestration layer. Map every step, tool interaction, decision point, and quality gate to create a repeatable, auditable workflow that maximizes AI assistance while maintaining human oversight.

## Pre-Conditions

- Business process or development workflow to automate identified
- Current manual process documented with pain points
- Available AI tools and MCP servers inventoried
- Human-in-the-loop requirements defined (which decisions need human approval)
- Success metrics established (time saved, quality improvement, error reduction)

## Steps

1. **Map the Current Process** — Document the existing workflow step by step: who does what, in what order, with what tools, producing what outputs. Identify bottlenecks, error-prone steps, and steps that are purely mechanical (candidates for full automation).
2. **Classify Automation Potential** — For each step, classify: fully automatable (no judgment needed, clear rules), AI-assisted (AI does the work, human reviews), human-required (judgment, creativity, or approval needed), and hybrid (AI prepares, human decides). Create an automation heat map.
3. **Design the AI Workflow** — Redesign the process with AI integration: replace mechanical steps with tool calls, add AI analysis where human judgment was needed for routine decisions, and keep human checkpoints for critical decisions. Produce a step-by-step workflow definition.
4. **Select Tools per Step** — For each automated step, select the optimal tool: native Claude Code tools (Read, Write, Bash, Grep), MCP tools (Supabase, GitHub, Figma), external APIs, or custom scripts. Document why each tool was chosen and its fallback.
5. **Design Data Flow** — Map how data moves through the workflow: inputs enter at step 1, transformed through intermediate steps, quality-checked at gates, and delivered as final output. Define the data schema at each transition point.
6. **Implement Quality Gates** — Place automated quality checks at critical points: after data transformation (validate output schema), before external actions (confirm parameters), after AI generation (check for hallucination markers), and before delivery (final quality sweep).
7. **Add Error Handling and Recovery** — For each step, define: what can go wrong (tool failure, unexpected input, quality gate failure), how to detect it (error codes, validation failures), how to recover (retry, fallback, escalate), and how to communicate the issue.
8. **Create Monitoring Points** — Design observability: log each step's input/output (with PII redaction), track execution time per step, measure quality gate pass rates, and alert on failures or degradation.
9. **Build the Workflow Definition** — Package the workflow as a reusable definition: YAML or markdown format, step definitions with tool references, quality gate definitions, error handling rules, and human checkpoint specifications.
10. **Test End-to-End** — Execute the workflow against real scenarios: standard input (happy path), edge case input (boundary conditions), failure scenarios (tool unavailable, invalid data), and high-volume input (performance test). Document results and refine.
11. **Measure ROI** — Compare the AI workflow against the manual process: time per execution, error rate, human effort required, and output quality. Calculate the automation ROI.

## Output

```markdown
# End-to-End AI Workflow: {Workflow Name}

## Process Overview
| Step | Type | Tool | Input | Output | Gate |
|------|------|------|-------|--------|------|

## Automation Map
| Step | Current (Manual) | Proposed (AI) | Classification |
|------|-----------------|---------------|---------------|

## Data Flow
{step 1} --{schema}--> {step 2} --{schema}--> {step 3}

## Quality Gates
| Gate | After Step | Checks | Pass Criteria | On Fail |
|------|-----------|--------|--------------|---------|

## Error Handling
| Step | Failure Mode | Detection | Recovery | Escalation |
|------|-------------|-----------|----------|-----------|

## Workflow Definition
```yaml
workflow:
  name: "{name}"
  steps:
    - id: "{step_id}"
      tool: "{tool}"
      input: "{schema}"
      output: "{schema}"
      gate: "{gate_id}"
      on_error: "{strategy}"
```

## ROI Analysis
| Metric | Manual | AI-Powered | Improvement |
|--------|--------|-----------|-------------|
| Time per execution | {duration} | {duration} | {%} |
| Error rate | {%} | {%} | {%} |
| Human effort | {hours} | {hours} | {%} |
```

## Quality Criteria

- Every step must have defined input/output schemas (no ambiguous data flow)
- Quality gates must be placed after every AI-generation step
- Error handling must cover at least 3 failure modes per step
- Human checkpoints must be placed at all critical decision points
- Workflow must be reproducible (same input produces consistent output)
- ROI analysis must show at least 30% improvement on one key metric
