---
task: context-window-audit
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

# Context Window Audit

## Objective

Perform a comprehensive audit of context window usage in a Claude Code project. Measure token consumption across all context sources, identify waste and inefficiency, and produce an optimization plan that maximizes useful information density within the available context budget.

## Pre-Conditions

- Project with CLAUDE.md, rules, knowledge bases, or agent definitions
- Understanding of the project's primary workflows and use cases
- Token estimation tools or methods available
- Target context budget defined (or model's context limit known)
- List of most frequent interaction patterns

## Steps

1. **Inventory All Context Sources** — Enumerate every file that contributes to the context window: root CLAUDE.md, directory-level CLAUDE.md files, .claude/rules/ files (always-loaded and path-conditional), knowledge base files, agent definitions, MCP tool descriptions, and system prompts.
2. **Measure Token Footprint** — Estimate token count for each context source. Use character-to-token heuristics (1 token per ~4 characters for English) or tokenizer tools. Create a breakdown table sorted by token consumption (largest first).
3. **Classify Information Type** — Tag each section of each file with its information type: behavioral rules (MUST/SHOULD), reference data (tables, schemas), examples (code samples, templates), metadata (version, dates), and filler (generic advice, obvious instructions).
4. **Score Information Value** — Rate each section on a 1-5 value scale: 1=Claude already knows this (generic best practices), 2=nice to have but rarely referenced, 3=useful for specific tasks, 4=important for common workflows, 5=critical and unique (project-specific rules that prevent errors).
5. **Calculate Efficiency Ratio** — For each file, compute: (tokens scored 4-5) / (total tokens) = efficiency ratio. Files below 40% efficiency are optimization candidates. Rank all files by efficiency ratio.
6. **Identify Always-Loaded Waste** — Find content that is always loaded but only relevant to specific tasks. This is the highest-impact optimization: move task-specific content to path-conditional rules (using `paths:` frontmatter) so it only loads when relevant files are being edited.
7. **Detect Redundancy** — Find duplicated information: same rules stated in CLAUDE.md and in rules files, examples repeated across knowledge bases, instructions that duplicate Claude's built-in behavior. Mark each redundancy with the recommended resolution (remove, merge, or reference).
8. **Analyze MCP Tool Description Overhead** — Count tokens consumed by MCP tool descriptions that load into context. Identify tools that are rarely used but always present. Recommend tool description optimization or selective loading.
9. **Produce Optimization Plan** — Create a prioritized action plan: each action has a description, affected file(s), estimated token savings, effort level (easy/medium/hard), and risk level (safe/moderate/risky). Sort by token savings descending.
10. **Project Post-Optimization Footprint** — Calculate the expected context footprint after all optimizations are applied. Compare with current footprint. Estimate the percentage of context freed for actual conversation and tool results.

## Output

```markdown
# Context Window Audit Report

## Summary
| Metric | Value |
|--------|-------|
| Total context sources | {count} |
| Total token footprint | {tokens} |
| Average efficiency ratio | {%} |
| Estimated waste | {tokens} ({%}) |
| Post-optimization estimate | {tokens} |

## Token Breakdown (Top Sources)
| Source | Tokens | Efficiency | Type |
|--------|--------|-----------|------|
| {file} | {tokens} | {%} | {always/conditional} |

## Optimization Plan
| # | Action | File(s) | Token Savings | Effort | Risk |
|---|--------|---------|--------------|--------|------|
| 1 | {action} | {file} | {tokens} | {effort} | {risk} |

## Redundancy Map
| Content | Found In | Resolution |
|---------|----------|------------|

## MCP Overhead
| MCP Server | Tools | Description Tokens | Usage Frequency |
|-----------|-------|-------------------|----------------|

## Recommendations
1. {highest impact recommendation}
2. {second highest}
3. {third highest}
```

## Quality Criteria

- Every context source must be measured (zero sources skipped)
- Token estimates must be within 20% of actual (validate with sample tokenization)
- Optimization plan must target at least 20% token reduction
- No optimization may remove content scored 5 (critical/unique)
- Path-conditional migrations must include correct `paths:` frontmatter syntax
- Report must be actionable without requiring additional analysis
