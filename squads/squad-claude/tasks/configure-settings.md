---
task: configure-settings
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

# Configure Settings

## Objective

Create or update the .claude/settings.json file for a project with properly configured permissions, MCP server entries, behavioral flags, and tool access controls tailored to the project's security and workflow requirements.

## Inputs

- Project technology stack
- Security requirements (strict / standard / permissive)
- Tools that should be auto-approved
- Tools or commands that should be blocked
- MCP servers to include
- Team size (affects managed policy needs)

## Steps

1. **Assess Current Settings** — Read existing .claude/settings.json if present. Note current permissions, MCP configs, and any custom flags. If absent, start from blank template.
2. **Design Permission Model** — Based on security requirements, define the three permission lists: allow (tools permitted with prompt), deny (tools blocked entirely), auto-approve (tools permitted without prompt).
3. **Configure Tool Permissions** — Set permissions for core tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, MCP tools. Apply principle of least privilege.
4. **Add MCP Server Entries** — For each required MCP server, add the configuration with correct transport type (stdio/sse), command, args, and environment variables.
5. **Set Behavioral Flags** — Configure model preferences, context limits, and any project-specific behavioral overrides.
6. **Validate Schema** — Ensure the settings.json conforms to Claude Code's expected schema. Check for typos, invalid keys, and conflicting permissions.
7. **Create settings.local.json Template** — Generate a template for developer-specific overrides that should not be committed to version control.

## Quality Gates

- No tool appears in both allow and deny lists
- All MCP server entries have valid transport configurations
- Permission model matches stated security requirements
- settings.json passes schema validation
- Sensitive values (API keys, tokens) are in environment variables, not hardcoded

## Output Format

Complete .claude/settings.json file plus documentation of each configuration choice and a settings.local.json template.
