---
task: context-rot-audit
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

# Context Rot Audit

## Objective

Detect and catalog all instances of context rot in a Claude Code project's configuration files. Context rot is stale, redundant, contradictory, or bloated information that wastes context tokens and can mislead Claude Code.

## Inputs

- All CLAUDE.md files
- All .claude/rules/ files
- Knowledge base files
- Current project state (actual files, commands, dependencies)
- Git history of config files (to detect age of content)

## Steps

1. **Scan for Staleness** — Check every reference in config files against current project state: Do referenced files still exist? Are listed commands still valid? Are mentioned dependencies still installed? Are API endpoints still active?
2. **Detect Redundancy** — Find duplicate information: same instruction in multiple files, overlapping rules with identical advice, knowledge base content repeated in CLAUDE.md.
3. **Find Contradictions** — Identify conflicting instructions: one file says "use semicolons" while another says "no semicolons," rules that contradict CLAUDE.md directives, permission settings that conflict with stated policies.
4. **Measure Bloat** — Identify sections that contain information Claude Code already knows: generic programming advice, well-known framework conventions, obvious coding standards. These waste tokens without adding value.
5. **Check Path References** — Verify all file paths mentioned in `paths:` frontmatter, CLAUDE.md examples, and rules actually match existing project files.
6. **Assess Decay Rate** — Using git history, determine how quickly config files become stale. Flag files not updated in > 30 days if the project is actively developed.
7. **Generate Rot Report** — Catalog all findings by category (stale, redundant, contradictory, bloated) with specific locations and recommended fixes.

## Quality Gates

- Every file in the config surface must be scanned
- Findings must include specific line references
- Each finding must have a recommended action (remove, update, merge, or rewrite)
- Contradiction findings must list both conflicting sources

## Output Format

```markdown
# Context Rot Audit

## Summary
- Stale items: {count}
- Redundant items: {count}
- Contradictions: {count}
- Bloat items: {count}
- Total rot token estimate: {X} tokens ({Y}% of total context)

## Findings

### Stale
| # | File | Line | Content | Recommended Action |
|---|------|------|---------|-------------------|

### Redundant
| # | File A | File B | Duplicate Content | Action |
|---|--------|--------|-------------------|--------|

### Contradictory
| # | File A (says) | File B (says) | Resolution |
|---|---------------|---------------|------------|

### Bloated
| # | File | Section | Why It's Bloat | Token Cost |
|---|------|---------|---------------|------------|
```
