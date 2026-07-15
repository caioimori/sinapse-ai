# SINAPSE v4 Quick Start Guide

> 🌐 **EN** | [PT](../pt/installation/v4-quick-start.md)

**Version:** 2.1
**Last Updated:** 2026-01-26
**Time to Complete:** 5 minutes

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] GitHub CLI (`gh`) installed and authenticated (`gh auth status`)
- [ ] An AI-powered IDE or Claude Code CLI

---

## Step 1: Install SINAPSE Core

### Option A: npx Installation Wizard (Recommended)

```bash
# Run the interactive installation wizard
npx sinapse-ai@latest

# Or create a new project with a specific name
npx sinapse-ai@latest init my-project
cd my-project
```

### Option B: Clone Repository (Development)

```bash
git clone https://github.com/caioimori/sinapse-ai.git
cd sinapse-ai
npm install
```

---

## Step 2: Verify Installation

Run the diagnostics command:

```bash
npx sinapse-ai@latest doctor
```

Or if installed globally:

```bash
sinapse doctor
```

### Manual Verification

```bash
# Check core structure exists
ls -la .sinapse-ai/

# Verify key directories
ls .sinapse-ai/core/
ls .sinapse-ai/development/agents/
```

Expected structure:

```
.sinapse-ai/
├── core/               # Framework core (registry, health-check, orchestration)
├── development/        # Agents, tasks, workflows
├── product/            # Templates, checklists
└── infrastructure/     # Scripts, tools, integrations
```

---

## Step 3: Activate Your First Agent

SINAPSE uses specialized agents for different tasks. In your AI-powered IDE or Claude Code CLI, type:

```
@sinapse-orqx
```

The agent will greet you and show available commands:

```
🎯 SINAPSE Master ready!
Type *help to see available commands.
```

### Try These Commands

| Command   | Description                 |
| --------- | --------------------------- |
| `*help`   | Show all available commands |
| `*status` | Show project status         |
| `*agents` | List all available agents   |

---

## Step 4: Explore Available Agents

| Activation          | Role              | Purpose                         |
| ------------------- | ----------------- | ------------------------------- |
| `@developer` (Pixel)     | Development       | Code implementation, debugging  |
| `@quality-gate` (Litmus) | Quality Assurance | Testing and validation          |
| `@architect` (Stratum)   | Architecture      | System design and documentation |
| `@project-lead` (Beacon) | Product Manager   | Requirements and planning       |
| `@devops` (Pipeline)     | DevOps            | Git push, PR creation, CI/CD    |
| `@product-lead` (Axis)   | Product Owner     | Story validation and backlog    |
| `@sprint-lead` (Sync)    | Scrum Master      | Sprint management               |
| `@analyst` (Scope)       | Business Analyst  | Requirements analysis           |

### Example: Activate Developer Agent

```text
@developer
```

The developer agent (Pixel) will activate with a greeting showing:

- Project status
- Quick commands
- Agent collaboration options

---

## Step 5: Create Your First Story

Stories drive development in SINAPSE. Activate the Product Owner and create one:

```
@product-lead *create-story
```

Follow the prompts to define:

1. Story title
2. Description
3. Acceptance criteria
4. Priority

---

## Quick Reference

### Agent Commands

All agent commands use the `*` prefix:

```
*help          # Show help
*status        # Show status
*exit          # Exit current agent
```

### CLI Commands

```bash
# Installation and setup
npx sinapse-ai@latest           # Run wizard
npx sinapse-ai@latest doctor    # Run diagnostics
npx sinapse-ai@latest info      # Show system info

# Development
npm run lint                           # Check code style
npm run typecheck                      # Check TypeScript types
npm test                               # Run unit tests
npm run validate:manifest:parity             # Validate SINAPSE structure
```

### Project Structure

```
your-project/
├── .sinapse-ai/                    # Framework core
│   ├── core/                      # Core modules
│   │   ├── registry/              # Service registry (200+ workers)
│   │   ├── health-check/          # Health check system
│   │   ├── orchestration/         # Workflow orchestration
│   │   └── quality-gates/         # Quality validation layers
│   ├── development/               # Development assets
│   │   ├── agents/                # Agent definitions (12 agents)
│   │   ├── tasks/                 # Development workflows (211 development tasks)
│   │   └── workflows/             # Multi-step workflows
│   ├── product/                   # Product assets
│   │   ├── templates/             # Document templates
│   │   └── checklists/            # Validation checklists
│   └── infrastructure/            # Infrastructure
│       ├── scripts/               # Utility scripts (~80)
│       ├── integrations/          # PM tool adapters
│       └── templates/             # Config templates
├── .claude/                       # Claude Code configuration
│   ├── agents/                       # Native Claude agents
│   └── rules/                     # Agent rules
├── docs/                          # Documentation
│   └── stories/                   # Development stories
└── src/                           # Your source code
```

---

## Next Steps

1. **Read the full guide:** [Getting Started](../getting-started.md)
2. **Understand the architecture:** [Core Architecture](../framework/core-architecture.md)
3. **Learn about agents:** [Agent Definitions](../../.sinapse-ai/development/agents/)
4. **Join the community:** [Discord](https://discord.gg/gk8jAdXWmj)

---

## Troubleshooting

### "Command not found" errors

```bash
# Ensure Node.js is in PATH
node --version

# Clear npm cache if issues persist
npm cache clean --force
```

### Agent not responding

1. Ensure you're in Claude Code CLI or Codex CLI
2. Check you're using correct activation syntax: `@agent-name`
3. Verify agent file exists: `ls .sinapse-ai/development/agents/`

### Permission errors

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use a Node version manager (recommended)
# nvm, fnm, or volta
```

### SINAPSE structure not found

```bash
# Reinstall SINAPSE in current project
npx sinapse-ai@latest install

# Or clone fresh
git clone https://github.com/caioimori/sinapse-ai.git
```

---

## Getting Help

- **Documentation:** [GitHub Repository](https://github.com/caioimori/sinapse-ai)
- **GitHub Issues:** [github.com/caioimori/sinapse-ai/issues](https://github.com/caioimori/sinapse-ai/issues)
- **Discord Community:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

---

**Welcome to SINAPSE! Happy coding!**
