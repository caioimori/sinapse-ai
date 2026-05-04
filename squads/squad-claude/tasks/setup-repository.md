---
task: setup-repository
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

# Setup Repository

## Objective

Set up a new repository with Claude Code configuration from scratch, creating the optimal directory structure, configuration files, rules, and initial hooks for the specified technology stack and team size.

## Inputs

- Repository name and description
- Technology stack (language, framework, database)
- Team size (solo / small team / large team)
- Automation level (minimal / standard / full)
- MCP integrations needed
- Git hosting (GitHub, GitLab, Bitbucket)

## Steps

1. **Create Directory Structure** — Set up .claude/ directory with settings.json, rules/ subdirectory, and any template files. Create CLAUDE.md at project root.
2. **Generate CLAUDE.md** — Write project-specific CLAUDE.md with stack information, coding conventions, directory structure guide, common commands, and anti-patterns.
3. **Configure Settings** — Create settings.json with permissions tailored to team size and automation level. Solo developers get more auto-approve; large teams get stricter controls.
4. **Create Initial Rules** — Generate rules files for the primary file patterns: source code, tests, configuration files, documentation. Use `paths:` frontmatter.
5. **Set Up Hooks** — Based on automation level: minimal (no hooks), standard (auto-lint, auto-format), full (auto-lint, auto-test, security gates, notification routing).
6. **Configure MCP** — Add MCP server configurations for requested integrations. Verify each server connects successfully.
7. **Add .gitignore Entries** — Ensure .claude/settings.local.json and any local-only files are gitignored. Keep .claude/settings.json and rules/ tracked.
8. **Generate README Section** — Add a "Claude Code Setup" section to README.md explaining the AI-assisted development workflow for the project.

## Quality Gates

- All generated files must be valid (JSON valid, Markdown well-formed)
- Permission model must match team size requirements
- At least one smoke test of Claude Code in the new repo must pass
- .gitignore must protect local settings and secrets

## Output Format

File manifest with all created files and a quickstart guide for team members.
