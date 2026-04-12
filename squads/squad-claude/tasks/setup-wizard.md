---
task: setup-wizard
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

# Setup Wizard

## Objective

Guide the creation of a complete Claude Code setup for a new or existing project. Orchestrate all specialist agents to produce configuration, hooks, MCP integrations, rules, and CLAUDE.md files tailored to the project's stack and team.

## Inputs

- Project type (greenfield / brownfield)
- Technology stack (language, framework, database, etc.)
- Team size and structure
- Desired automation level (minimal / standard / full)
- Existing CI/CD pipeline (if any)
- MCP servers needed (Supabase, GitHub, Figma, etc.)

## Steps

1. **Classify Project** — Determine if greenfield or brownfield. For brownfield, delegate initial assessment to `@project-integrator` via `brownfield-setup` task.
2. **Design Configuration** — Delegate to `@config-engineer` to create .claude/settings.json, CLAUDE.md, and .claude/rules/ structure via `configure-settings` and `claude-md-engineer` tasks.
3. **Plan MCP Integration** — Delegate to `@mcp-integrator` to design MCP server setup via `mcp-integration-plan` task based on required integrations.
4. **Design Hooks** — Delegate to `@hooks-architect` to create automation hooks via `hook-designer` task based on desired automation level.
5. **Optimize Context** — Delegate to `@skill-craftsman` to review and optimize context footprint via `optimize-context` task.
6. **Validate Setup** — Run `audit-setup` on the completed configuration to verify all dimensions meet minimum thresholds.
7. **Generate Setup Summary** — Compile all outputs into a single setup document with file manifest and next steps.

## Quality Gates

- All generated files must pass syntax validation
- Settings.json must have no conflicting permissions
- CLAUDE.md total token footprint must be under budget (context efficiency >= 3/5)
- At least 3 hooks configured for standard automation level
- All specified MCP servers must have valid configurations

## Output Format

```markdown
# Claude Code Setup Complete

## Files Created
- .claude/settings.json
- CLAUDE.md
- .claude/rules/*.md
- .claude/settings.local.json (template)

## MCP Servers Configured
- [ ] Server 1: status
- [ ] Server 2: status

## Hooks Installed
- PreToolUse: ...
- PostToolUse: ...

## Next Steps
1. ...
2. ...
```
