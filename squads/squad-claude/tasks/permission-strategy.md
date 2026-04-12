---
task: permission-strategy
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

# Permission Strategy

## Objective

Design a comprehensive permission strategy for Claude Code that balances security, productivity, and developer experience. Define allow, deny, and auto-approve lists with clear rationale for each decision.

## Inputs

- Project security classification (public / internal / confidential)
- Team trust level (new team / established / solo developer)
- Sensitive files and directories (secrets, credentials, production configs)
- Dangerous commands to restrict (destructive git ops, system commands, network access)
- Desired automation level (high friction / balanced / low friction)

## Steps

1. **Classify Operations by Risk** — Create a risk matrix of all Claude Code operations: file read/write, bash execution, web access, MCP tool calls. Rate each as low/medium/high/critical risk.
2. **Define Deny List** — Block operations that should never be executed: reading .env files with secrets, executing destructive system commands, accessing production databases, pushing to protected branches.
3. **Define Allow List** — Permit with confirmation: operations that are useful but carry moderate risk. File writes outside project scope, network requests, git operations beyond local.
4. **Define Auto-Approve List** — Permit without confirmation: low-risk, high-frequency operations. File reads within project, grep/glob searches, local git status/diff/log.
5. **Design File-Level Permissions** — Create glob patterns for sensitive paths that should be read-only or completely blocked: `**/.env*`, `**/credentials/**`, `**/secrets/**`.
6. **Plan Escalation Path** — Define what happens when Claude Code encounters a blocked operation: clear error message, suggestion for alternative, manual override instructions.
7. **Document Rationale** — For every permission decision, document why it was made. This enables future teams to adjust without guessing.

## Quality Gates

- Every critical-risk operation must be in the deny list
- Auto-approve list must not contain any high-risk operations
- Permission strategy must be implementable in settings.json
- Rationale must be documented for every deny and auto-approve entry

## Output Format

```markdown
# Permission Strategy

## Risk Classification
| Operation | Risk | Permission | Rationale |
|-----------|------|------------|-----------|

## Deny List (settings.json format)
...

## Allow List
...

## Auto-Approve List
...

## File-Level Restrictions
...
```
