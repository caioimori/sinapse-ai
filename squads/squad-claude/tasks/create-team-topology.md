---
task: create-team-topology
responsavel: "@swarm-orqx"
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

# Create Team Topology

## Objective

Design a multi-agent team topology for a Claude Code project, defining agent roles, communication patterns, shared resources, and coordination protocols. Produce agent configuration files and orchestration rules.

## Inputs

- Project scope and complexity
- Types of work to be done (coding, testing, review, documentation, deployment)
- Parallelism potential (independent features? shared codebase?)
- Team topology preference (stream-aligned, platform, enabling, or hybrid)

## Steps

1. **Assess Workload** — Classify the project's work into domains: feature development, testing/QA, infrastructure, documentation, research. Estimate relative effort for each.
2. **Select Topology Pattern** — Choose the primary pattern: Stream-aligned (feature teams, one agent per feature), Platform (shared service agents), Enabling (coaching/review agents), or Hybrid.
3. **Define Agent Roles** — For each agent in the topology: name, responsibility scope, tools needed, files it can access, and its interaction pattern with other agents.
4. **Design Communication Channels** — Define how agents communicate: shared files (handoff artifacts), status files (JSON), or direct subagent invocation. Minimize coordination overhead.
5. **Set Boundaries** — Define explicit boundaries: which files each agent owns, which tools each agent can use, and what decisions each agent can make autonomously vs. must escalate.
6. **Create Coordination Protocol** — Define the orchestration flow: who spawns whom, dependency order, synchronization points, and completion criteria.
7. **Generate Configuration** — Produce agent definition files, orchestration rules, and a team manifest document.

## Quality Gates

- Every work domain must be covered by at least one agent
- No two agents should own the same file (ownership conflicts)
- Communication protocol must be documented and testable
- Coordination overhead must be estimated and acceptable (< 20% of total work)

## Output Format

```markdown
# Team Topology: {project name}

## Topology Pattern: {pattern}

## Agent Roster
| Agent | Role | Domain | Tools | Files Owned |
|-------|------|--------|-------|-------------|

## Communication Protocol
{diagram or description}

## Coordination Flow
{sequence of operations}

## Agent Definition Files
{list of files to create}
```
