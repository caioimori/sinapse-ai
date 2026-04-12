---
task: brownfield-setup
responsavel: "@project-integrator"
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

# Brownfield Setup

## Objective

Perform a brownfield assessment of an existing project's Claude Code setup, identify the current maturity level, and create an upgrade plan to reach the target maturity level with minimal disruption.

## Inputs

- Project root path
- Current .claude/ directory contents
- Current CLAUDE.md files
- Target maturity level (basic / standard / advanced / expert)
- Constraints (files that must not be modified, team preferences)

## Steps

1. **Assess Current Maturity** — Score the existing setup using the Integration Maturity Model: Level 0 (no Claude Code), Level 1 (basic CLAUDE.md), Level 2 (rules + settings), Level 3 (hooks + MCP), Level 4 (full automation + CI/CD).
2. **Identify Gaps** — Compare current level to target level. List every configuration, file, and integration missing to reach the target.
3. **Check for Anti-Patterns** — Scan existing configuration for common mistakes: overly broad permissions, stale CLAUDE.md content, missing deny rules, hardcoded paths, etc.
4. **Design Upgrade Path** — Create a step-by-step migration plan from current level to target. Each step must be independently valuable (no "all or nothing" migrations).
5. **Estimate Effort** — For each step, estimate time and risk. Order steps by value/effort ratio for optimal adoption.
6. **Execute First Step** — Implement the highest-value, lowest-risk step to demonstrate immediate improvement.
7. **Generate Upgrade Plan** — Produce the complete upgrade plan with timeline, dependencies, and rollback instructions for each step.

## Quality Gates

- Current maturity must be accurately assessed (validated against actual files)
- Upgrade path must be incremental (each step independently valuable)
- Anti-patterns must be flagged with severity
- First step must be successfully executed and validated

## Output Format

```markdown
# Brownfield Assessment

## Current Maturity: Level {X}
## Target Maturity: Level {Y}

## Gap Analysis
| Gap | Priority | Effort | Risk |
|-----|----------|--------|------|

## Anti-Patterns Found
| # | Pattern | Severity | Fix |
|---|---------|----------|-----|

## Upgrade Plan
### Step 1 (DONE): {description}
### Step 2: {description}
...

## Timeline
{estimated timeline to reach target}
```
