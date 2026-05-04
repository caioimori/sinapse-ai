---
task: optimize-context
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

# Optimize Context

## Objective

Analyze and optimize the total context window usage of a Claude Code project. Reduce token waste from CLAUDE.md, rules, and knowledge bases while preserving essential information. Target measurable improvement in context efficiency.

## Inputs

- All CLAUDE.md files (root and directory-level)
- All .claude/rules/ files
- Knowledge base files (if any)
- Current pain points (context overflow? slow responses? missing context?)
- Token budget target

## Steps

1. **Measure Current Footprint** — Estimate token count for each context source: root CLAUDE.md, directory CLAUDE.md files, each rules file, each knowledge base file. Sum for total.
2. **Score Information Density** — For each section of each file, rate 1-5: 1=noise (generic advice Claude already knows), 3=useful (project-specific but verbose), 5=essential (unique knowledge, high value per token).
3. **Identify Redundancy** — Find information duplicated across files: same instructions in CLAUDE.md and rules, repeated patterns across directory-level files, knowledge base content also in CLAUDE.md.
4. **Identify Staleness** — Flag outdated information: references to removed features, old file paths, deprecated patterns, completed TODOs still listed.
5. **Compress Low-Density Sections** — Rewrite sections scored 1-2: convert paragraphs to tables, remove explanations of things Claude Code knows, replace verbose examples with concise ones.
6. **Restructure for Conditional Loading** — Move context-specific content from always-loaded CLAUDE.md into .claude/rules/ with `paths:` frontmatter so it only loads when relevant.
7. **Validate Optimized Context** — Verify no essential information was lost. Re-measure token footprint. Calculate savings percentage.

## Quality Gates

- Total token footprint must decrease by >= 15%
- No essential information (scored 4-5) may be removed
- All moved content must have correct `paths:` frontmatter
- Optimized CLAUDE.md must pass readability check (clear, well-structured)

## Output Format

```markdown
# Context Optimization Report

## Before
- Total tokens: {X}
- Files: {count}

## After
- Total tokens: {Y}
- Files: {count}
- Savings: {percentage}%

## Changes Made
| File | Action | Token Impact |
|------|--------|-------------|

## Moved to Rules
| Content | From | To (rules file) | Path Pattern |
|---------|------|-----------------|-------------|
```
