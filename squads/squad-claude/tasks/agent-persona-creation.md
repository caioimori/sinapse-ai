---
task: agent-persona-creation
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

# Agent Persona Creation

## Objective

Create effective AI agent personas with distinct identities, expertise domains, behavioral rules, communication styles, and operational boundaries. Produce complete agent definition files that can be activated within Claude Code or multi-agent orchestration systems.

## Pre-Conditions

- Agent's role and domain clearly defined
- Team of existing agents documented (to avoid overlap)
- Delegation matrix established (who does what)
- Communication patterns between agents designed
- Agent file format and storage location determined

## Steps

1. **Define Agent Identity** — Choose a unique name (short, memorable, thematic), assign a role title, and write a one-paragraph identity statement. The identity should make the agent immediately recognizable and establish its authority in its domain. Example: "Aria, the Architect — designs system architecture with a focus on scalability and simplicity."
2. **Map Expertise Domain** — Define exactly what the agent knows deeply: primary expertise (core domain), secondary expertise (adjacent knowledge), and explicit non-expertise (what the agent should defer to others). Use a knowledge boundary table.
3. **Design Communication Style** — Define how the agent communicates: tone (authoritative, collaborative, cautious), verbosity level (concise, detailed, adaptive), formatting preferences (tables, bullet points, code blocks), and signature patterns (how the agent starts and ends interactions).
4. **Establish Behavioral Rules** — Write explicit MUST/MUST NOT rules: what the agent always does (validates before acting), what it never does (modify files outside its domain), how it handles uncertainty (ask before assuming), and how it handles conflicts (escalate to orchestrator).
5. **Define Command Interface** — Design the agent's commands: activation command (@agent-name or /namespace:agent), available sub-commands (*help, *status, *execute), parameter formats, and output conventions. Each command should have a clear purpose and usage example.
6. **Create Dependency Map** — Document the agent's relationships: which agents it delegates to (and for what), which agents delegate to it, shared resources, and handoff protocols. Reference the agent-handoff protocol for context compaction rules.
7. **Write the Agent Definition File** — Produce the complete agent definition in the project's format (YAML frontmatter + Markdown body): metadata (name, role, version), persona description, commands, dependencies, behavioral rules, and activation instructions.
8. **Design Memory Configuration** — Define the agent's memory needs: what it should remember across sessions (decisions, patterns, preferences), where memories are stored (MEMORY.md), memory format, and cleanup rules. Reference the memory-system-design task.
9. **Test Persona Consistency** — Validate the agent persona across scenarios: does it maintain character when asked to act outside its domain? Does it correctly defer to other agents? Does it follow its behavioral rules under pressure? Does its communication style remain consistent?
10. **Create Persona Evaluation Rubric** — Build a rubric for ongoing persona quality: identity clarity (is the agent distinguishable from others?), expertise accuracy (does it know what it should?), boundary respect (does it stay in its lane?), and communication quality (is its style effective?).

## Output

```markdown
# Agent Definition: {Agent Name}

## Identity
- **Name:** {name}
- **Role:** {title}
- **Domain:** {primary expertise}
- **Version:** v{X.Y}

## Persona
{1-2 paragraph persona description}

## Expertise
| Level | Domain | Examples |
|-------|--------|----------|
| Primary | {domain} | {specific skills} |
| Secondary | {domain} | {specific skills} |
| Defers to | {agent} | {what it defers} |

## Communication Style
- Tone: {description}
- Verbosity: {level}
- Format preferences: {list}

## Behavioral Rules
### MUST
- {rule 1}
- {rule 2}

### MUST NOT
- {rule 1}
- {rule 2}

## Commands
| Command | Description | Parameters |
|---------|------------|-----------|
| *help | Show available commands | none |

## Dependencies
| Agent | Relationship | Trigger |
|-------|-------------|---------|

## Memory Configuration
- Storage: {location}
- Categories: {list}
- Cleanup: {policy}
```

## Quality Criteria

- Agent must be distinguishable from all existing agents in the team (no role overlap)
- Behavioral rules must cover at least 5 MUST and 3 MUST NOT directives
- Command interface must include at least *help, one domain-specific command, and *exit
- Persona must maintain consistency across 5+ simulated interactions in testing
- Dependency map must be bidirectional (both this agent and related agents reference each other)
- Agent definition file must be under 2000 tokens (efficient for context loading)
