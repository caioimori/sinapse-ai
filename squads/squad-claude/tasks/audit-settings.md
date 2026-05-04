---
task: audit-settings
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

# Audit Settings

## Objective

Audit existing Claude Code settings for security gaps, permission inconsistencies, deprecated options, missing configurations, and optimization opportunities. Produce a scored report with specific fixes.

## Inputs

- .claude/settings.json (project level)
- ~/.claude/settings.json (user level, if accessible)
- Managed policies (if applicable)
- .claude/settings.local.json (if exists)

## Steps

1. **Read All Settings Layers** — Collect settings from all levels: managed policies, user global, project, and local. Document the effective merged configuration.
2. **Check Permission Consistency** — Verify no contradictions between layers. Check that deny rules at higher levels are not overridden at lower levels (they should not be).
3. **Assess Security Posture** — Flag overly permissive auto-approve lists, missing deny rules for dangerous operations (rm -rf, git push --force, etc.), and exposed secrets.
4. **Validate MCP Configurations** — Check each MCP server entry for correct schema, valid environment variable references, and appropriate transport type.
5. **Identify Deprecated Options** — Flag any configuration keys that are deprecated in the current Claude Code version.
6. **Check Completeness** — Compare against a reference configuration for the project's stack. Identify missing permissions, unregistered MCP servers, and absent behavioral flags.
7. **Generate Recommendations** — Produce prioritized fixes ordered by security impact, then usability impact.

## Quality Gates

- All settings layers must be examined
- Security issues must be flagged with severity (critical/high/medium/low)
- Each finding must include the specific fix
- Report must distinguish between project settings and user settings issues

## Output Format

```markdown
# Settings Audit Report

## Effective Configuration Summary
{merged settings overview}

## Security Findings
| # | Severity | Finding | Fix |
|---|----------|---------|-----|

## Consistency Issues
...

## Missing Configurations
...

## Score: X/5
```
