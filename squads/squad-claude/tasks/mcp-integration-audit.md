---
task: mcp-integration-audit
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

# MCP Integration Audit

## Objective

Audit all existing MCP server integrations in a project for health, security, performance, and usage patterns. Identify unused servers, misconfigured tools, security vulnerabilities, and optimization opportunities. Produce an actionable audit report with prioritized remediation steps.

## Pre-Conditions

- Access to project MCP configuration (settings.json, .claude.json, Docker MCP config)
- List of all configured MCP servers and their purposes
- Access to run diagnostic commands against each server
- Understanding of which tools are actively used vs. dormant
- Security policy for credential management

## Steps

1. **Inventory All MCP Servers** — Scan all configuration sources: project settings.json, user .claude.json, Docker MCP catalog, and any custom server registrations. List every server with its name, transport type, tool count, and configuration status.
2. **Test Connectivity** — For each server, perform a health check: attempt connection, verify handshake, list available tools, and measure connection latency. Flag servers that fail to connect or have latency above 5 seconds.
3. **Audit Security Configuration** — For each server, check: are credentials stored in environment variables (not hardcoded)? Are API keys rotated regularly? Is network access scoped appropriately? Are tool permissions restrictive or permissive? Flag any security violations.
4. **Analyze Usage Patterns** — Review recent usage data: which tools are called frequently, which are never used, which have high error rates. Cross-reference with project needs to identify servers that are no longer needed.
5. **Check for Redundancy** — Identify overlapping capabilities: multiple servers providing similar tools (e.g., two web search servers), tools duplicating native Claude Code capabilities, or servers with overlapping resource access.
6. **Assess Performance Impact** — Measure the performance overhead of each server: startup time, per-tool latency, memory usage, and impact on Claude Code context window (tool descriptions consume tokens). Calculate total MCP overhead.
7. **Verify Error Handling** — For each server, trigger common error scenarios: invalid input, auth failure, timeout. Verify that error messages are informative, non-leaking (no credentials in errors), and that failures don't crash the Claude Code session.
8. **Review Configuration Drift** — Compare current configuration against the documented integration plan (if one exists). Identify configuration that has drifted: changed environment variables, updated server versions, added/removed tools without documentation.
9. **Generate Remediation Plan** — Prioritize findings by severity (Critical/High/Medium/Low). For each finding, provide: description, impact, remediation steps, estimated effort, and responsible party. Group related findings.
10. **Produce Audit Report** — Compile all findings into a structured report with executive summary, detailed findings, server-by-server health cards, and the prioritized remediation plan.

## Output

```markdown
# MCP Integration Audit Report

## Executive Summary
- Servers audited: {count}
- Healthy: {count} | Degraded: {count} | Failed: {count}
- Critical findings: {count}
- Estimated remediation effort: {hours}

## Server Health Cards
### {Server Name}
| Metric | Value | Status |
|--------|-------|--------|
| Connectivity | {pass/fail} | {emoji} |
| Security | {score}/5 | {emoji} |
| Usage (30d) | {call count} | {active/dormant} |
| Latency (p95) | {ms} | {ok/slow} |
| Error rate | {%} | {ok/high} |

## Findings
| # | Severity | Server | Finding | Remediation |
|---|----------|--------|---------|-------------|

## Remediation Plan
### Critical (fix immediately)
1. {finding + steps}

### High (fix this sprint)
1. {finding + steps}

### Medium (schedule)
1. {finding + steps}

## Recommendations
- Remove: {servers to decommission}
- Upgrade: {servers needing updates}
- Add: {missing capabilities}
```

## Quality Criteria

- Every configured MCP server must be tested (zero skipped)
- Security audit must check credentials storage, network scope, and permission breadth
- Usage analysis must cover at least 30 days of activity (or available history)
- Remediation plan must have estimated effort for every Critical and High finding
- Audit report must be actionable without requiring additional investigation
- Redundant servers must be identified with a specific recommendation (keep/remove/merge)
