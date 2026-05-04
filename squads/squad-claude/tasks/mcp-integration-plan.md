---
task: mcp-integration-plan
responsavel: "@mcp-integrator"
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

# MCP Integration Plan

## Objective

Design a comprehensive MCP integration plan for a project, selecting the right servers, transport types, and security configurations. Produce ready-to-use configuration entries for settings.json.

## Inputs

- Project requirements (what external services are needed)
- Available MCP servers (from marketplace or custom)
- Infrastructure constraints (Docker available? Network restrictions?)
- Security requirements (authentication, network isolation)
- Budget for external services

## Steps

1. **Inventory Requirements** — List all external service integrations needed: database (Supabase), version control (GitHub), design (Figma), communication (Slack, Gmail), documentation (Notion), etc.
2. **Match Servers to Requirements** — For each requirement, identify the best MCP server. Check official registry, community servers, and evaluate if a custom server is needed.
3. **Select Transport Types** — For each server, choose transport: stdio for local CLI tools, SSE for remote HTTP services, Docker for isolated/managed deployments. Document the rationale.
4. **Design Security Configuration** — For each server: define required environment variables, authentication method, network access scope, and tool-level permissions.
5. **Plan Installation Order** — Sequence server installations to handle dependencies. Some servers may depend on others being available first.
6. **Generate Configuration** — Produce the complete MCP server configuration block for settings.json with all servers, their transports, commands, args, and env references.
7. **Create Test Plan** — For each server, define a smoke test: connect, list tools, execute one representative tool call, verify response.

## Quality Gates

- Every requirement must map to at least one MCP server
- No server should have hardcoded credentials (environment variables only)
- Transport type must match infrastructure constraints
- Each server must have a documented smoke test
- Total number of MCP servers should not exceed reasonable limits (< 15 for performance)

## Output Format

```markdown
# MCP Integration Plan

## Server Registry
| # | Server | Transport | Purpose | Auth Method |
|---|--------|-----------|---------|-------------|

## Configuration (settings.json)
{JSON block}

## Environment Variables Required
{list with descriptions}

## Smoke Tests
{per-server test instructions}

## Installation Order
1. ...
```
