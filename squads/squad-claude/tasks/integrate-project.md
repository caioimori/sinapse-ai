---
task: integrate-project
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

# Integrate Project

## Objective

Integrate Claude Code into an existing project by assessing current state, identifying the optimal configuration for the project's stack, and creating all necessary configuration files without disrupting existing workflows.

## Inputs

- Project root path
- Technology stack (language, framework, package manager)
- Existing AI tooling (Copilot, Cursor, other)
- Team conventions and coding standards
- CI/CD pipeline (if any)

## Steps

1. **Scan Project Structure** — Map the repository: identify source directories, test directories, config files, build systems, and any existing .claude/ or CLAUDE.md files.
2. **Identify Framework** — Detect the primary framework(s): Next.js, React, Vue, Angular, Express, FastAPI, Django, Rust, Go, etc. Each has specific Claude Code optimization patterns.
3. **Assess Current AI Tooling** — Check for existing AI configurations (.cursor/, .github/copilot/, etc.). Plan how Claude Code will coexist or replace these.
4. **Generate CLAUDE.md** — Delegate to `@config-engineer` via `claude-md-engineer` task. Include framework-specific conventions, project structure, and coding standards.
5. **Configure Settings** — Delegate to `@config-engineer` via `configure-settings` task. Set permissions appropriate for the project's security requirements.
6. **Create Initial Rules** — Delegate to `@config-engineer` via `create-rules` task. Create rules for the most common file patterns in the project.
7. **Validate Integration** — Run a test session: read a file, make a small edit, run a command. Verify Claude Code behaves according to the configuration.
8. **Document Integration** — Produce a summary of what was configured, what conventions were adopted, and what the team needs to know.

## Quality Gates

- All config files must pass validation
- CLAUDE.md must reference actual project paths and conventions
- No existing workflows disrupted (existing tooling still works)
- Test session must complete without permission errors or misconfigurations

## Output Format

```markdown
# Project Integration Complete

## Project: {name}
## Stack: {stack}

## Files Created
- {list}

## Configuration Summary
- Permissions: {mode}
- Rules: {count} files
- MCP servers: {count}

## Team Onboarding Notes
{what the team needs to know}
```
