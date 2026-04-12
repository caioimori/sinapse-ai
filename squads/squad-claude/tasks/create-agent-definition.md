---
task: create-agent-definition
responsavel: "@skill-craftsman"
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

# Create Agent Definition

## Objective

Create a complete agent definition file following the squad agent format. Design the agent's identity, persona, competencies, frameworks, metrics, delegation matrix, and cross-squad handoffs for effective Claude Code operation.

## Inputs

- Agent purpose and domain
- Required competencies
- Tools the agent needs access to
- Tasks the agent will execute
- Related agents (for delegation matrix)
- Squad membership

## Steps

1. **Define Identity** — Choose a meaningful name, icon, agent ID (lowercase-hyphenated), and squad assignment. The name should evoke the agent's domain.
2. **Craft Persona** — Write a personality description that shapes how Claude Code behaves when this agent is active. Include thinking style, communication preferences, and decision-making approach.
3. **List Core Competencies** — Define 5-8 specific competencies with descriptions. Each must be actionable and measurable, not vague (e.g., "React component testing with Jest and RTL" not "testing").
4. **Design Frameworks** — Create 3-5 mental models or decision frameworks the agent uses. These shape how the agent approaches problems (e.g., "Security-First Checklist", "Performance Budget Model").
5. **Set Key Metrics** — Define 4-6 measurable metrics with targets that indicate the agent is performing well.
6. **Build Delegation Matrix** — Map incoming request types to actions: handle directly, collaborate with another agent, or delegate entirely. Be explicit about boundaries.
7. **Define Cross-Squad Handoffs** — Specify inbound and outbound handoff triggers with other squads. Include the triggering condition for each handoff.
8. **Validate Completeness** — Check all sections against the agent template. Ensure no section is missing or placeholder.

## Quality Gates

- Agent ID must be unique across all squads
- Every competency must map to at least one task
- Delegation matrix must cover all reasonable request types
- Persona must be distinct from other agents in the same squad
- Frameworks must be specific to the agent's domain (not generic)

## Output Format

Complete agent definition Markdown file following the standard structure: Identity table, Role, Personality, Core Competencies, Frameworks, Key Metrics, Delegation Matrix, Tasks, Cross-Squad Handoffs.
