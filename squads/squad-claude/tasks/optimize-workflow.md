---
task: optimize-workflow
responsavel: "@skill-craftsman"
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

# Optimize Workflow

## Objective

Analyze and optimize Claude Code interaction workflows to minimize round-trips, reduce context consumption, and maximize output quality. Identify patterns that waste tokens or cause unnecessary back-and-forth and replace them with efficient alternatives.

## Inputs

- Current workflow patterns (how the team uses Claude Code)
- Common tasks and their typical interaction count
- Pain points (slow responses, context overflow, repetitive prompts)
- Available tools and skills

## Steps

1. **Map Current Workflows** — Document the most common interaction patterns: how many messages per typical task, what tools are invoked, how much context is consumed per interaction.
2. **Identify Anti-Patterns** — Find workflow inefficiencies: over-explaining tasks Claude Code can infer, reading the same files multiple times, not using batch operations, manual steps that could be automated.
3. **Measure Round-Trip Cost** — For each common task, count the number of human-AI round-trips. Calculate the theoretical minimum (what could be done in one prompt with proper context).
4. **Design Skill Extractions** — For repeated multi-step workflows, design slash command skills that encapsulate the steps into a single invocable unit.
5. **Optimize Tool Usage** — Identify cases where better tool selection would reduce interactions: using Glob instead of multiple Read calls, using Edit instead of Write for small changes, batching parallel tool calls.
6. **Improve Prompt Patterns** — Rewrite common prompt templates for maximum clarity and minimum tokens. Include examples of effective vs. wasteful prompting.
7. **Validate Improvements** — Estimate the reduction in round-trips, tokens, and time for each optimized workflow. Target >= 30% improvement.

## Quality Gates

- At least 3 workflow optimizations must be identified
- Each optimization must have measurable improvement (round-trips, tokens, or time)
- Skill extractions must be practically implementable
- Prompt pattern improvements must be tested against real scenarios

## Output Format

```markdown
# Workflow Optimization Report

## Current State
| Workflow | Avg Round-Trips | Avg Tokens | Pain Point |
|----------|----------------|------------|------------|

## Optimizations
### 1. {optimization name}
- **Before:** {current pattern}
- **After:** {optimized pattern}
- **Improvement:** {metrics}

## Extracted Skills
| Skill | Trigger | Steps Encapsulated |
|-------|---------|-------------------|

## Prompt Pattern Guide
| Pattern | Bad Example | Good Example |
|---------|-------------|--------------|
```
