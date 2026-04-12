---
task: enterprise-config
responsavel: "@roadmap-sentinel"
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

# Enterprise Config

## Objective

Design enterprise-grade Claude Code configuration with managed policies, compliance controls, audit logging, and organization-wide standards. Produce configurations suitable for deployment across multiple teams and projects.

## Inputs

- Organization size and structure (teams, projects, repos)
- Compliance requirements (SOC2, HIPAA, GDPR, etc.)
- Security policies (data classification, network restrictions)
- Managed policy deployment mechanism (MDM, central config repo)
- Standardization requirements (what must be uniform across teams)

## Steps

1. **Map Organization Structure** — Document teams, projects, and their relationships. Identify which configurations should be organization-wide, team-level, or project-level.
2. **Design Managed Policies** — Create top-level managed policies that enforce non-negotiable rules across the organization: deny lists for dangerous operations, required security hooks, mandatory MCP configurations.
3. **Define Compliance Controls** — For each compliance requirement, map to specific Claude Code configurations: data handling restrictions, audit logging, access controls, network restrictions.
4. **Create Policy Templates** — Build reusable configuration templates for common team types: frontend team, backend team, data team, DevOps team. Each template extends the organization policy.
5. **Design Deployment Strategy** — Plan how managed policies are distributed: central git repo with CI/CD, MDM push, or manual distribution with verification scripts.
6. **Build Audit Trail** — Design hooks and logging that create audit trails for Claude Code operations: what was generated, what was approved, what was denied, by whom.
7. **Create Rollout Plan** — Phase the enterprise deployment: pilot team first, then gradual expansion. Include feedback loops and adjustment periods.

## Quality Gates

- Managed policies must enforce all compliance requirements
- No team-level override can weaken organization-level policies
- Audit trail must capture all required compliance events
- Rollout plan must include rollback procedures

## Output Format

```markdown
# Enterprise Configuration

## Organization Policies
{managed policy files}

## Team Templates
{per-team-type configurations}

## Compliance Mapping
| Requirement | Control | Configuration |
|------------|---------|---------------|

## Deployment Strategy
{distribution plan}

## Rollout Plan
{phased timeline}
```
