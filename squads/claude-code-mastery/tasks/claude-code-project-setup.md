---
task: claude-code-project-setup
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

# Claude Code Project Setup

## Objective

Create an optimal Claude Code project configuration from scratch, establishing the CLAUDE.md hierarchy, rules system, settings, hooks, and MCP integrations that maximize Claude Code's effectiveness for the specific project type and team workflow.

## Pre-Conditions

- Project repository exists (or will be created)
- Project type identified (web app, API, library, monorepo, etc.)
- Team size and workflow preferences documented
- Technology stack defined
- Development methodology chosen (agile, kanban, etc.)

## Steps

1. **Assess Project Requirements** — Analyze the project to determine Claude Code configuration needs: project type (affects rules and conventions), tech stack (affects code patterns and linting), team size (affects permission model), workflow (affects hooks and automation), and complexity (affects context engineering strategy).
2. **Create CLAUDE.md Hierarchy** — Design the CLAUDE.md file structure: root CLAUDE.md with project-wide rules and conventions, directory-level CLAUDE.md files for component-specific instructions (e.g., src/api/CLAUDE.md for API conventions, src/ui/CLAUDE.md for frontend patterns). Keep root CLAUDE.md under 3000 tokens.
3. **Configure .claude/settings.json** — Set up project settings: allowed and denied tool patterns, permission boundaries (which directories Claude can modify), MCP server configurations, and custom settings. Balance security with productivity.
4. **Design Rules System** — Create .claude/rules/ files for contextual instructions: always-loaded rules for universal conventions, path-conditional rules for file-type-specific guidance. Use `paths:` frontmatter to control when each rule loads.
5. **Set Up Hooks** — Configure automation hooks based on project needs: PreToolUse hooks for safety gates (block writes to protected files), PostToolUse hooks for automation (auto-format after file writes, auto-lint after code changes), and Notification hooks for team alerts.
6. **Configure MCP Integrations** — Set up MCP servers relevant to the project: Supabase for database projects, Figma for design-heavy projects, GitHub for all projects, Notion for documented projects. Configure each with proper auth and permissions.
7. **Create .env.example** — Document all environment variables the project uses with Claude Code: API keys for MCP servers, project-specific configuration, and debug flags. Include descriptions and example values (never real credentials).
8. **Set Up Git Integration** — Configure git-related settings: commit message conventions, branch naming patterns, PR templates, and any git hooks that complement Claude Code hooks. Ensure .claude/ directory is properly gitignored or committed as appropriate.
9. **Build Onboarding Document** — Create a quick-start guide for team members: how to install Claude Code, how to configure their environment, what the project's Claude Code setup does, and how to use the custom rules and hooks effectively.
10. **Validate the Setup** — Test the complete configuration: create a new Claude Code session, verify CLAUDE.md loads correctly, trigger each hook, test MCP connections, verify rules load for the correct files, and check that permissions work as expected.
11. **Create Maintenance Checklist** — Document ongoing maintenance tasks: when to update CLAUDE.md (after architectural changes), when to review rules (quarterly), when to audit hooks (after workflow changes), and when to update MCP configurations (after service changes).

## Output

```markdown
# Claude Code Project Setup Report

## Configuration Summary
| Component | Status | Files |
|-----------|--------|-------|
| CLAUDE.md hierarchy | {configured} | {file list} |
| Settings | {configured} | .claude/settings.json |
| Rules | {count} rules | .claude/rules/*.md |
| Hooks | {count} hooks | {hook locations} |
| MCP servers | {count} servers | {server list} |

## File Tree
```
.claude/
├── settings.json
├── rules/
│   ├── {rule files}
CLAUDE.md
src/
├── api/CLAUDE.md
├── ui/CLAUDE.md
```

## Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|

## Onboarding Steps
1. {step}
2. {step}

## Maintenance Schedule
| Task | Frequency | Trigger |
|------|-----------|---------|
```

## Quality Criteria

- Root CLAUDE.md must be under 3000 tokens and contain only project-wide essentials
- All rules must have appropriate `paths:` frontmatter (no unnecessary always-load rules)
- Settings must follow least-privilege principle (deny by default, allow explicitly)
- Hooks must complete within performance budgets (PreToolUse < 500ms)
- MCP servers must connect successfully in validation testing
- Onboarding document must enable a new developer to set up in under 15 minutes
