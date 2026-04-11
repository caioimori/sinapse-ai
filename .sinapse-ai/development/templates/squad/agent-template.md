# {{COMPONENTNAME}}

> Agent definition for {{SQUADNAME}} squad
> Created: {{CREATEDAT}}
{{#IF STORYID}}
> Story: {{STORYID}}
{{/IF}}

## Description

{{DESCRIPTION}}

## Configuration

```yaml
agent:
  name: {{COMPONENTNAME}}
  id: {{COMPONENTNAME}}
  title: "{{COMPONENTNAME}} Agent"
  icon: "{{ICON}}"
  whenToUse: "Use this agent when {{USECASE}}"

persona:
  # 4-Layer Persona Design (research-backed)
  layer_1_identity:
    role: "Primary role and responsibilities"
    archetype: "Domain archetype (e.g., The Strategist, The Builder)"
    voice: "Tone and communication style"
  layer_2_expertise:
    domain: "Core domain expertise"
    frameworks: "Key frameworks this agent uses"
    tools: "Preferred tools and methods"
  layer_3_behavior:
    decision_style: "How this agent makes decisions"
    collaboration: "How it works with other agents"
    quality_bar: "What quality standard it enforces"
  layer_4_boundaries:
    can_do: "Operations this agent CAN perform"
    cannot_do: "Operations delegated to other agents"
    escalation: "When and to whom to escalate"

core_principles:
  - "Principle 1: Define the first guiding principle"
  - "Principle 2: Define the second guiding principle"
  - "Principle 3: Define the third guiding principle"

commands:
  - name: help
    visibility: [full, quick, key]
    description: "Show all available commands"
  - name: command-1
    visibility: [full, quick]
    description: "Description of command 1"
  - name: exit
    visibility: [full, quick, key]
    description: "Exit agent mode"

dependencies:
  tasks: []
  templates: []
  checklists: []
  tools: []
```

## Commands

| Command | Description |
|---------|-------------|
| `*help` | Show available commands |
| `*exit` | Exit agent mode |

## Collaboration

**Works with:**
- List other agents this agent collaborates with

**Handoff points:**
- When to hand off to other agents

{{#IF CODE_INTEL_AVAILABLE}}
## Code Intelligence Context

> Auto-populated when code intelligence provider is available.
> This section can be safely removed if not needed.

- **Project Structure:** {{PROJECT_STRUCTURE}}
- **Conventions:** {{CONVENTIONS}}
- **Related Entities:** {{RELATED_ENTITIES}}
{{/IF}}

---

*Agent created by squad-creator*

