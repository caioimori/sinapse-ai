---
task: create-rules
responsavel: "@config-engineer"
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

# Create Rules

## Objective

Design and create .claude/rules/ files with proper frontmatter for conditional loading based on file paths, providing Claude Code with context-specific instructions that activate only when relevant files are being edited.

## Inputs

- Project structure and key directories
- Rules needed (coding standards, framework-specific guidance, testing patterns, security policies)
- File path patterns for conditional activation
- Existing rules (to avoid conflicts)

## Steps

1. **Map Rules to Contexts** — Identify which instructions are needed for which file patterns. E.g., React component rules for `src/components/**/*.tsx`, API rules for `src/api/**/*.ts`.
2. **Design Frontmatter** — Create proper YAML frontmatter with `paths:` field using glob patterns. Rules without `paths:` load globally (use sparingly).
3. **Write Rule Content** — Write clear, actionable instructions. Use imperative mood. Be specific about what Claude Code should and should not do when editing matching files.
4. **Check for Conflicts** — Verify new rules don't contradict existing rules or CLAUDE.md instructions. Check for overlapping path patterns that could cause confusion.
5. **Organize File Names** — Use descriptive names: `react-components.md`, `api-routes.md`, `testing-standards.md`, `security-policies.md`. Prefix with domain.
6. **Validate Loading** — Verify that rules would load correctly by checking path patterns against actual project file paths.
7. **Document Rule Set** — Create an index of all rules with their activation patterns and purposes.

## Quality Gates

- Every rule with `paths:` frontmatter must match at least one existing file in the project
- No two rules should give contradictory instructions for the same file pattern
- Global rules (no `paths:`) must be genuinely universal
- Rule content must be actionable (not just informational)

## Output Format

Individual .claude/rules/*.md files with frontmatter, plus an index document listing all rules and their activation patterns.
