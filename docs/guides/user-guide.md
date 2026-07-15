# SINAPSE User Guide

> **EN**

---

Complete guide for using SINAPSE - the AI-Orchestrated System for Full Stack Development.

**Version:** 1.21.0
**Last Updated:** 2026-07-02

---

## Quick Start

### Prerequisites

Before using SINAPSE, ensure you have:

- **Node.js** version 18.0.0 or higher
- **npm** version 9.0.0 or higher
- **Git** for version control
- An AI provider API key (Anthropic, OpenAI, or compatible)

### Installation

```bash
# New project (Greenfield)
npx sinapse-ai init my-project

# Existing project (Brownfield)
cd existing-project
npx sinapse-ai install
```

### First Steps

```bash
# Navigate to your project
cd my-project

# List available agents
npx sinapse-ai agents list

# Claude Code: activate an agent
@developer

# Get help
*help
```

In Codex, use `$snps` for routing or `$sinapse-agent developer` for direct activation.

---

## Core Concepts

### Philosophy

> **"Structure is Sacred. Tone is Flexible."**

SINAPSE provides orchestrated structure while allowing flexibility in communication. This means:

- **Fixed:** Template positions, section order, metric formats, file structure, workflows
- **Flexible:** Status messages, vocabulary choices, emoji usage, personality, tone

### The SINAPSE Difference

| Traditional AI Dev            | SINAPSE                                    |
| ----------------------------- | --------------------------------------- |
| Uncoordinated agents          | 172 specialized agents across 17 squads |
| Inconsistent results          | Structured workflows with quality gates |
| Context lost between sessions | Persistent memory and learning          |
| Reinventing the wheel         | Reusable tasks, workflows, and squads   |

---

## Agents

SINAPSE includes 172 specialized agents across 17 squads. The table below highlights the core development agents:

IDs in the table use Claude Code's `@agent-name` syntax. In Codex, replace it
with `$sinapse-agent agent-id`; use `$snps` for the primary orchestrator.

| Agent     | ID               | Archetype    | Responsibility          |
| --------- | ---------------- | ------------ | ----------------------- |
| **Pixel** | `@developer` | Builder      | Code implementation     |
| **Litmus** | `@quality-gate` | Guardian     | Quality assurance       |
| **Stratum** | `@architect` | Architect    | Technical architecture  |
| **Axis** | `@product-lead` | Visionary    | Product backlog         |
| **Beacon** | `@project-lead` | Balancer     | Product strategy        |
| **Sync** | `@sprint-lead` | Facilitator  | Process facilitation    |
| **Scope** | `@analyst` | Explorer     | Business analysis       |
| **Tensor** | `@data-engineer` | Architect    | Data engineering        |
| **Pipeline** | `@devops` | Optimizer    | CI/CD and operations    |
| **Mosaic** | `@ux-design-expert` | Creator      | User experience         |
| **Imperator** | `@snps-orqx` | Orchestrator | Framework orchestration |

### Agent Activation

```bash
# Claude Code: activate an agent using @ syntax
@developer                # Activate Pixel (Developer)
@quality-gate                 # Activate Litmus (QA)
@architect          # Activate Stratum (Architect)
@snps-orqx        # Activate Imperator (Orchestrator)

# Agent commands use * prefix
*help               # Show available commands
*task <name>        # Execute specific task
*exit               # Deactivate agent
```

Codex activation:

```text
$snps
$sinapse-agent developer
```

### Agent Context

When an agent is active:

- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction

### Command Visibility Levels

Agent commands use visibility levels to control when they appear:

| Level | Name    | Description                                      |
|-------|---------|--------------------------------------------------|
| `key` | Key     | Critical commands shown in minimal greeting      |
| `quick` | Quick | Essential commands shown in quick reference    |
| `full` | Full    | All commands shown in `*help` output            |

**How visibility works:**

```yaml
commands:
  - name: help
    visibility: [full, quick, key]  # Always shown
    description: "Show available commands"

  - name: create-prd
    visibility: [full, quick]       # Shown in quick reference
    description: "Create product requirements"

  - name: session-info
    visibility: [full]              # Only in full help
    description: "Show session details"
```

**Command Authority:**

Each command has exactly one authoritative agent owner. When multiple agents might handle similar tasks:

| Command        | Owner      | Others Should...                |
|----------------|------------|---------------------------------|
| `*create-prd`  | @project-lead        | Delegate to @project-lead                 |
| `*create-epic` | @project-lead        | Delegate to @project-lead                 |
| `*draft`       | @sprint-lead        | Use @sprint-lead for story creation      |
| `*develop`     | @developer       | Use @developer for implementation     |
| `*review`      | @quality-gate        | Use @quality-gate for code review         |

See the Command Authority Matrix for the complete mapping.

---

## Tasks

Tasks are the primary entry point in SINAPSE. Everything is a task.

### Task-First Architecture

```
User Request --> Task --> Agent Execution --> Output
                  |
             Workflow (if multi-step)
```

### Executing Tasks

```bash
# Execute a specific task
*task develop-story --story=1.1

# List available tasks
sinapse tasks list

# Get task help
*task --help
```

### Task Categories

| Category          | Examples                                |
| ----------------- | --------------------------------------- |
| **Development**   | develop-story, code-review, refactor    |
| **Quality**       | run-tests, validate-code, security-scan |
| **Documentation** | generate-docs, update-readme            |
| **Workflow**      | create-story, manage-sprint             |

---

## Workflows

Workflows orchestrate multiple tasks and agents for complex operations.

### Available Workflows

| Workflow                  | Use Case                            |
| ------------------------- | ----------------------------------- |
| `greenfield-ui`           | New site / landing page / app       |
| `greenfield-fullstack`    | New platform / SaaS                 |
| `greenfield-service`      | New API / backend service           |
| `brownfield-fullstack`    | Add SINAPSE to an existing project  |
| `spec-pipeline`           | Complex briefing (spec first)       |
| `story-development-cycle` | Implement a single story            |

### Running a Workflow

You don't invoke workflows by name — describe what you want and SINAPSE picks
the right one (greenfield vs brownfield, UI vs fullstack vs service).

```bash
# Describe the project — SINAPSE classifies it and runs the right workflow
sinapse build "new SaaS platform for gym management"

# Preview which workflow a briefing would trigger (without running it)
sinapse route "add dark mode to the platform"

# Run the development cycle for an existing story
sinapse orchestrate <story-id>
```

### Orchestrate — Supported Scope (Measured)

`sinapse orchestrate` is reliable for **one story at a time**. Sequential
multi-story orchestration in the same working directory is **not supported** —
this was measured directly (native flow: 3/3 stories, 64s, 1 call; the
orchestrate pipeline: 1/3 stories, ~13.5min, state leaked across stories) and
the autonomous multi-story path was abandoned in favor of the native flow.
Full write-up: [KNOWN-LIMITATIONS.md](https://github.com/caioimori/sinapse-ai/blob/main/docs/epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md).

| Use                                                   | Supported?                  |
| ------------------------------------------------------ | ---------------------------- |
| `orchestrate` for **1 story** (spec + plan + build)     | ✅ Yes, reliable              |
| `orchestrate` for **multiple chained stories**          | ❌ No — use the native flow   |

---

## Squads

Squads are modular teams of AI agents that extend SINAPSE functionality.

### What is a Squad?

A squad is a self-contained package containing:

| Component     | Purpose                       |
| ------------- | ----------------------------- |
| **Agents**    | Domain-specific AI personas   |
| **Tasks**     | Executable workflows          |
| **Workflows** | Multi-step orchestrations     |
| **Config**    | Coding standards, tech stack  |
| **Templates** | Document generation templates |
| **Tools**     | Custom tool integrations      |

### Distribution Levels

```
Level 1: LOCAL        --> ./squads/      (today — managed in your project)
Level 2: REGISTRY     --> remote sharing (roadmap)
Level 3: MARKETPLACE  --> paid squads    (roadmap)
```

### Using Squads

Squads live in the `squads/` directory of your project. To add one, drop its
folder there; to build a new one, scaffold it with the squad-creator agent:

```bash
# Create your own squad
@squad-creator
*create-squad my-custom-squad
```

> Remote squad distribution (browse / download from a registry) is on the
> roadmap — today squads are managed directly under `squads/`.

### Official Squads

| Squad           | Description                        |
| --------------- | ---------------------------------- |
| `etl-squad`     | Data collection and transformation |
| `creator-squad` | Content generation utilities       |

---

## Basic Usage

### Project Structure

```
my-project/
├── .sinapse-ai/                # Framework configuration
│   ├── development/agents/    # Agent definitions
│   ├── development/tasks/     # Task workflows
│   ├── product/templates/     # Document templates
│   └── product/checklists/    # Validation checklists
├── docs/
│   ├── stories/               # Development stories
│   ├── architecture/          # System architecture
│   └── guides/                # User guides
├── squads/                    # Local squads
└── src/                       # Application source code
```

### Common Commands

```bash
# SINAPSE Master Commands
*help                # Show available commands
*create-story        # Create new story
*task {name}         # Execute specific task
*workflow {name}     # Run workflow

# Development Commands
npm run dev          # Start development
npm test             # Run tests
npm run lint         # Check code style
npm run build        # Build project
```

### Documentation-First Development

1. **Define the epic** - Every initiative starts with an epic
2. **Create a story** - Use `*create-story` to define requirements with acceptance criteria
3. **Validate** - @product-lead validates the story before any code
4. **Work from stories** - All development starts with a validated story in `docs/stories/`
5. **Update progress** - Mark checkboxes as tasks complete: `[ ]` --> `[x]`
6. **Track changes** - Maintain the File List section in the story
7. **Follow criteria** - Implement exactly what the acceptance criteria specify

---

## Configuration

### Main Configuration File

The primary configuration is in `.sinapse-ai/core/config/`:

```yaml
# sinapse.config.yaml
version: 2.1.0
projectName: my-project

features:
  - agents
  - tasks
  - workflows
  - squads
  - quality-gates

ai:
  provider: anthropic
  model: opus # family alias (opus | sonnet | haiku) — the CLI resolves the current version; never hardcode a dated snapshot id

environment: development
```

### Environment Variables

```bash
# AI Provider Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key
# or
OPENAI_API_KEY=your-openai-api-key

# Framework Settings
NODE_ENV=development
SINAPSE_DEBUG=false
```

### IDE Integration

SINAPSE supports multiple IDEs. Configuration is synchronized across:

- Claude Code (`.claude/`)
- Cursor (`.cursor/`)
- VS Code (`.vscode/`)

```bash
# Sync agents to your IDE
npm run sync:ide
```

---

## Troubleshooting

### Common Issues

**Agent won't activate**

```bash
# Check agent exists
ls .sinapse-ai/development/agents/

# Verify configuration
sinapse doctor
```

**Task execution fails**

```bash
# Check task definition
cat .sinapse-ai/development/tasks/{task-name}.md

# Run with verbose output
*task {name} --verbose
```

**Memory/context issues**

```bash
# Clear cache
rm -rf .sinapse-ai/core/cache/*

# Rebuild index
sinapse rebuild
```

### Getting Help

- **GitHub Discussions**: [github.com/caioimori/sinapse-ai/discussions](https://github.com/caioimori/sinapse-ai/discussions)
- **Issue Tracker**: [github.com/caioimori/sinapse-ai/issues](https://github.com/caioimori/sinapse-ai/issues)
- **Discord**: [Join our server](https://discord.gg/gk8jAdXWmj)

---

## Next Steps

### Learning Path

1. **Quick Start** - Follow this guide to get up and running
2. **Agent Reference** - Learn about each agent's capabilities: [Agent Reference Guide](../agent-reference-guide.md)
3. **Architecture** - Understand the system: [Architecture Overview](../pt/architecture/ARCHITECTURE-INDEX.md)
4. **Squads** - Extend functionality: [Squads Guide](./squads-guide.md)

### Advanced Topics

- [Quality Gates Guide](./quality-gates.md)
- [Multi-Repo Strategy](../pt/architecture/multi-repo-strategy.md)
- [MCP Integration](./mcp-global-setup.md)
- [IDE Integration](../ide-integration.md)

---

## Best Practices

### 1. Start with Stories

Always create a story before implementing features:

```bash
@snps-orqx
*create-story
```

### 2. Use the Right Agent

Choose the appropriate agent for each task:

| Task                | Agent      |
| ------------------- | ---------- |
| Write code          | @developer       |
| Review code         | @quality-gate        |
| Design system       | @architect |
| Define requirements | @product-lead        |

### 3. Follow Quality Gates

SINAPSE implements 3-layer quality gates:

1. **Layer 1 (Local)**: Pre-commit hooks, linting, type checking
2. **Layer 2 (CI/CD)**: Automated tests, CodeRabbit review
3. **Layer 3 (Human)**: Architecture review, final approval

### 4. Keep Context

Maintain context through sessions by:

- Using story-driven development
- Updating progress checkboxes
- Documenting decisions in stories

### 5. Leverage Squads

Don't reinvent the wheel — browse the squads already shipped under `squads/`
before building a new agent from scratch.

---

## Related Documentation

- [Getting Started](../getting-started.md)
- [Installation Guide](../installation/README.md)
- [Agent Reference Guide](../agent-reference-guide.md)
- [Architecture Overview](../pt/architecture/ARCHITECTURE-INDEX.md)
- [Squads Guide](./squads-guide.md)
- [Troubleshooting](../troubleshooting.md)

---

_SINAPSE User Guide v1.21.0_
