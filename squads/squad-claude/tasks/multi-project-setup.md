---
task: multi-project-setup
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

# Multi-Project Setup

## Objective

Configure Claude Code for multi-repo or monorepo setups where multiple projects or packages share common conventions but have distinct configurations. Design the configuration hierarchy to maximize reuse and minimize duplication.

## Inputs

- Repository structure (monorepo with packages/ or multi-repo)
- Shared conventions (common to all projects)
- Per-project differences (different stacks, different rules)
- Workspace tooling (npm workspaces, pnpm, Turborepo, Nx, Lerna)
- Shared MCP servers vs per-project MCP servers

## Steps

1. **Map Project Topology** — Enumerate all projects/packages with their stacks, dependencies, and unique requirements. Identify shared patterns and divergences.
2. **Design Configuration Hierarchy** — For monorepo: root CLAUDE.md (shared) + per-package CLAUDE.md (specific). For multi-repo: shared template + per-repo customization.
3. **Create Root Configuration** — Write root-level CLAUDE.md and settings.json with conventions that apply to ALL projects: coding standards, git conventions, CI/CD patterns.
4. **Create Per-Project Overrides** — For each project/package, create directory-level CLAUDE.md files with stack-specific instructions that override or extend root conventions.
5. **Design Shared Rules** — Create .claude/rules/ files for patterns that span multiple projects (e.g., testing standards, API conventions). Use `paths:` to scope them correctly.
6. **Configure MCP Per-Scope** — Determine which MCP servers are shared (GitHub, Supabase) vs per-project (framework-specific tools). Configure accordingly.
7. **Test Cross-Project Navigation** — Verify Claude Code loads the correct configuration when navigating between projects/packages within the workspace.

## Quality Gates

- Root configuration must not contain project-specific instructions
- Per-project configurations must not duplicate root instructions
- Navigation between projects must load correct context
- Total configuration size must be within budget for the largest project

## Output Format

```markdown
# Multi-Project Configuration

## Topology
{project map}

## Hierarchy
- Root: {shared config}
- Project A: {overrides}
- Project B: {overrides}

## Shared Resources
{rules, MCP servers, conventions}

## Per-Project Specifics
{deviations from root}
```
