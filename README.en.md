# SINAPSE AI

> **English** | [Portugues](README.md)

[![npm](https://img.shields.io/npm/v/sinapse-ai.svg)](https://www.npmjs.com/package/sinapse-ai)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success.svg)](LICENSE)

> **175 AI agents. 18 specialized squads. One CLI.**
>
> SINAPSE AI is an open source framework that organizes AI agents into specialized squads to solve real problems in business, marketing, development, copywriting, design and more. Works directly in your terminal with Claude Code, Codex CLI or any compatible IDE.

---

## What is SINAPSE AI

SINAPSE AI is not another chatbot. It is an orchestration system where each agent has a clear role, each squad masters a discipline, and everything runs via CLI.

**What you get when you install:**

- **18 squad orchestrators (orqx)** ready to activate from the terminal
- **175 specialized agents** with their own knowledge bases
- **Complete workflows** for planning, development, QA and deploy
- **Documentation-First Development** with automatic epic, story and validation pipeline
- **Multi-IDE support**: Claude Code and Codex CLI

### Architecture: CLI First

```
CLI First > Observability Second > UI Third
```

All intelligence lives in the CLI. Dashboards observe. The UI is never a requirement.

---

## Installation (2 minutes)

```bash
# New project
npx sinapse-ai init my-project

# Existing project
cd your-project && npx sinapse-ai install

# Update existing installation
npx sinapse-ai@latest install
```

The wizard detects your environment, configures your IDE and installs squads automatically.

```bash
# Diagnostics
npx sinapse-ai doctor

# System info
npx sinapse-ai info
```

**Requirements:** Node.js 18+ (v20+ recommended)

---

## Available Squads

Each squad is a team of specialized agents with its own knowledge base, workflows and tasks. All squads are **free and open source**.

| Squad | Focus | Agents |
|-------|-------|--------|
| **squad-brand** | Brand strategy, archetypes, auditing | 15 |
| **squad-copy** | Persuasive copywriting, headlines, conversion | 14 |
| **squad-council** | Strategic advisors (Munger, Dalio, Thiel) | 11 |
| **squad-storytelling** | Narrative, scripts, story frameworks | 11 |
| **squad-commercial** | Sales, funnel, revenue, pipeline | 11 |
| **squad-animations** | Motion design, CSS, particles, 3D | 9 |
| **squad-paidmedia** | Meta Ads, Google Ads, campaigns, optimization | 10 |
| **squad-claude** | Claude Code, MCP, advanced integration | 10 |
| **squad-cloning** | Cognitive cloning, mind synthesis | 9 |
| **squad-courses** | Courses, curriculum, assessments, launch | 8 |
| **squad-cybersecurity** | Security, threat intel, pentest | 9 |
| **squad-design** | Design systems, components, tokens | 15 |
| **squad-content** | Editorial governance, content strategy | 7 |
| **squad-product** | Product discovery, strategy, operations | 7 |
| **squad-research** | Market analysis, competitive intelligence | 8 |
| **squad-growth** | Analytics, CRO, SEO, growth hacking | 7 |
| **squad-finance** | Budget, pricing, profitability analysis | 5 |
| **claude-code-mastery** | Advanced Claude Code mastery | 8 |

**Total: 18 squads, 175 specialized agents**

---

## How to Use

### In Claude Code

Activate any orchestrator by name:

```
/sinapse            # Main orchestrator
@brand-orqx         # Brand squad
@copy-orqx          # Copy squad
@research-orqx      # Research squad
```

Or use the development agents:

```
@developer           # Code implementation
@quality-gate        # Testing and quality
@architect           # Architecture and design
@sprint-lead         # Story creation
@product-lead        # Story validation
@project-lead        # Product management
@analyst             # Research and analysis
@data-engineer       # Database design
@devops              # CI/CD and git push (exclusive)
```

### In Codex CLI

```
/skills              # List all available agents
sinapse-dev          # Activate the developer
sinapse-architect    # Activate the architect
```

### Agent Commands

Inside any agent, use `*` for commands:

```
*help                # Available commands
*create-story        # Create development story
*task <name>         # Execute specific task
*exit                # Exit the agent
```

---

## Development Agents

SINAPSE comes with 12 core agents for the complete development cycle:

| Agent | Persona | Scope |
|-------|---------|-------|
| `sinapse-orqx` | Imperator | Main orchestrator for all squads |
| `developer` | Dex | Code implementation |
| `quality-gate` | Quinn | Testing, QA and quality gates |
| `architect` | Aria | Architecture and technical design |
| `project-lead` | Morgan | Product management and epics |
| `product-lead` | Pax | Story validation and backlog |
| `sprint-lead` | River | Story creation and sprints |
| `analyst` | Alex | Business research and analysis |
| `data-engineer` | Dara | Database design and migrations |
| `ux-design-expert` | Uma | UX/UI design and experience |
| `devops` | Gage | CI/CD, git push (exclusive) |
| `squad-creator` | - | New squad creation |

### Development Workflow

```
@sprint-lead creates story > @product-lead validates > @developer implements > @quality-gate tests > @devops pushes
```

---

## Documentation-First Development

All SINAPSE development follows the automatic documentation pipeline (NON-NEGOTIABLE):

1. **Epic defined** for each initiative
2. **Stories in** `docs/stories/` with clear acceptance criteria
3. **Validation** by @product-lead before any code
4. **Progress tracked** via checkboxes `[ ]` > `[x]`
5. **File List** kept updated in the story
6. **Quality gates** run automatically before merge

---

## Creating Your Own Squad

Anyone can create a squad for any domain:

```
squads/my-squad/
  squad.yaml            # Squad manifest
  agents/               # Specialized agents
  knowledge-base/       # Knowledge base
  tasks/                # Executable tasks
  workflows/            # Squad workflows
```

Use `@squad-creator` or see the [Squads Guide](docs/guides/squads-guide.md).

---

## Claude Code vs Codex CLI — Full Comparison

SINAPSE works on both IDEs. Both support most features with different approaches.

### Features

| Feature | Claude Code | Codex CLI | Notes |
|---------|:-----------:|:---------:|-------|
| **18 squads with 186 agents** | YES | YES | Identical on both |
| **Knowledge bases per squad** | YES | YES | Identical on both |
| **Tasks and workflows** | YES | YES | Identical on both |
| **Documentation-First Development** | YES | YES | Identical on both |
| **Agent commands (`*help`, `*task`)** | YES | YES | Identical on both |
| **Squad awareness auto-routing** | YES | YES | Identical on both |
| **NSN Mode (Never Say Never)** | YES | YES | Global rule on both |
| **Chrome Brain (browser automation)** | YES | YES | Claude: hooks auto-launch. Codex: via MCP or chrome-cdp-skill |
| **MCP servers** | YES | YES | Claude: `~/.claude.json`. Codex: `config.toml` or `codex mcp add` |
| **Hooks (PreToolUse / PostToolUse)** | YES | PARTIAL | Codex: Bash tool only, disabled on Windows |
| **Agent handoff protocol** | YES | YES | Via instructions + skills on both |
| **SYNAPSE context engine** | YES | PARTIAL | Codex: via instructions.md + skills (no dynamic rules) |
| **Native skills system** | NO | YES | Codex has `$skill-name` with progressive disclosure |
| **Multi-model (Claude + others)** | NO | YES | Codex supports any OpenAI model |
| **Parallel subagents** | YES | YES | Codex: configurable max 6 threads |
| **Non-interactive CI/CD** | NO | YES | Codex: `codex exec` with `--json` |

### How to Activate Agents

| Action | Claude Code | Codex CLI |
|--------|-------------|-----------|
| Main orchestrator | `/SINAPSE:agents:sinapse-orqx` | `@sinapse-orqx` or `$sinapse-orqx` |
| Brand squad | `@brand-orqx` | `@brand-orqx` or `$sinapse-brand` |
| Copy squad | `@copy-orqx` | `@copy-orqx` or `$sinapse-copy` |
| Developer | `@developer` | `@developer` or `$sinapse-dev` |
| List agents | `@sinapse-orqx *help` | `/skills` |
| Chrome Brain | Auto-activates by prompt | `codex mcp add chrome-devtools` |

### Where Each IDE Shines

**Claude Code** — Most integrated experience:
- Chrome Brain auto-activates via hooks (zero manual config)
- Context engine injects rules automatically by domain and file
- Deny/allow rules protect files deterministically
- Largest MCP server ecosystem (Figma, Supabase, Notion, etc.)

**Codex CLI** — Most flexible and extensible:
- Native skills with `$skill-name` and progressive disclosure
- Supports any OpenAI model (not just Claude)
- `codex exec` for non-interactive CI/CD automation
- Can run AS an MCP server (other agents can invoke Codex)
- Profiles for quick config switching
- Subagents with max 6 parallel threads

### Chrome Brain Setup on Codex CLI

```bash
# Add Chrome DevTools MCP to Codex
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest

# OR install the chrome-cdp skill (direct connection, no Puppeteer)
# pi install git:github.com/pasky/chrome-cdp-skill@v1.0.1
```

### Recommendation

> **Claude Code** for the most integrated and automated experience — Chrome Brain auto-activates, hooks run automatically, context engine injects rules.
>
> **Codex CLI** for model flexibility, native skills, and CI/CD automation — with minimal manual setup for Chrome Brain.

---

## CLI

```bash
npx sinapse-ai init <project>       # Create project
npx sinapse-ai install              # Install in current project
npx sinapse-ai update               # Update
npx sinapse-ai doctor               # Diagnostics
npx sinapse-ai doctor --fix         # Fix issues
npx sinapse-ai info                 # System info
npx sinapse-ai uninstall            # Remove
```

---

## Quality and Validation

```bash
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # Tests
npm run test:coverage  # Coverage
```

Pre-commit and pre-push hooks validate automatically.

---

## Documentation

| Resource | Link |
|----------|------|
| User Guide | [docs/guides/user-guide.md](docs/guides/user-guide.md) |
| Architecture | [docs/pt/architecture/](docs/pt/architecture/) |
| Squads Guide | [docs/guides/squads-guide.md](docs/guides/squads-guide.md) |
| Getting Started | [docs/getting-started.md](docs/getting-started.md) |
| Troubleshooting | [docs/troubleshooting.md](docs/troubleshooting.md) |
| Guiding Principles | [docs/GUIDING-PRINCIPLES.md](docs/GUIDING-PRINCIPLES.md) |

---

## Contributing

```bash
git clone https://github.com/SinapseAI/sinapse-ai.git
cd sinapse-ai && npm install
```

1. Fork the repository
2. Create your branch (`git checkout -b feat/my-feature`)
3. Commit (`git commit -m 'feat: description'`)
4. Push (`git push origin feat/my-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Legal

| Doc | Link |
|-----|------|
| License | [MIT](LICENSE) |
| Privacy | [Privacy](docs/legal/privacy.md) |
| Terms | [Terms](docs/legal/terms.md) |
| Conduct | [Code of Conduct](CODE_OF_CONDUCT.md) |
| Security | [Security](docs/security.md) |

---

## Contributors

[![Contributors](https://contrib.rocks/image?repo=SinapseAI/sinapse-ai)](https://github.com/SinapseAI/sinapse-ai/graphs/contributors)

---

Built for builders.

**[Back to top](#sinapse-ai)**
