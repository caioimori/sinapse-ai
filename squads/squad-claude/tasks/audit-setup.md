---
task: audit-setup
responsavel: "@claude-orqx"
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

# Audit Setup

## Objective

Perform a comprehensive audit of a project's Claude Code setup across all 6 dimensions: configuration completeness, hooks maturity, MCP integration, context efficiency, agent topology, and CI/CD readiness. Produce a scored report with prioritized recommendations.

## Inputs

- Project root path
- Current .claude/ directory contents (if any)
- CLAUDE.md files at all levels
- Active MCP server configurations
- Existing hooks (if any)

## Steps

1. **Scan Configuration Layer** — Read .claude/settings.json, all CLAUDE.md files, and .claude/rules/ directory. Check for missing required fields, deprecated options, and permission gaps.
2. **Assess Hooks Maturity** — Enumerate all configured hooks, check event coverage (PreToolUse, PostToolUse, Notification, Stop), identify missing automation opportunities.
3. **Evaluate MCP Integration** — List all configured MCP servers, verify connectivity, check for unused tools, assess security configuration.
4. **Measure Context Efficiency** — Calculate total token footprint of CLAUDE.md + rules + knowledge bases. Identify redundancy, staleness, and bloat.
5. **Review Agent Topology** — Assess subagent configurations, team topology patterns, worktree usage, and delegation clarity.
6. **Check CI/CD Readiness** — Verify if Claude Code is integrated into CI/CD pipelines, check for automated review hooks, and assess deployment patterns.
7. **Score Each Dimension** — Rate each dimension 1-5 (1=absent, 2=basic, 3=functional, 4=optimized, 5=exemplary). Calculate overall health score.
8. **Generate Recommendations** — Produce prioritized list of improvements ordered by impact/effort ratio.

## Quality Gates

- All 6 dimensions must be assessed (no skips)
- Each recommendation must include estimated effort (hours) and expected impact
- Score justifications must reference specific files or configurations
- Report must be actionable, not just descriptive

## Output Format

```markdown
# Claude Code Setup Audit Report

## Summary
- **Overall Score:** X/30 (sum of 6 dimensions)
- **Health Level:** [Critical | Needs Work | Functional | Optimized | Exemplary]

## Dimension Scores
| Dimension | Score | Key Finding |
|-----------|-------|-------------|
| Configuration | X/5 | ... |
| Hooks | X/5 | ... |
| MCP Integration | X/5 | ... |
| Context Efficiency | X/5 | ... |
| Agent Topology | X/5 | ... |
| CI/CD Readiness | X/5 | ... |

## Prioritized Recommendations
1. [HIGH IMPACT] ...
2. [MEDIUM IMPACT] ...
3. ...

## Detailed Findings
### Configuration
...
### Hooks
...
(etc.)
```
