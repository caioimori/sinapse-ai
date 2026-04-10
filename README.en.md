[![npm version](https://img.shields.io/npm/v/sinapse-ai.svg)](https://www.npmjs.com/package/sinapse-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![CI](https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml)

```
 ____  ___ _   _    _    ____  ____  _____
/ ___|/ _ \ \ | |  / \  |  _ \/ ___|| ____|
\___ \ | | |  \| | / _ \ | |_) \___ \|  _|
 ___) | |_| | |\  |/ ___ \|  __/ ___) | |___
|____/ \___/|_| \_/_/   \_\_|   |____/|_____|
```

> **AI squads that build with you, not for you.**

[English] | [**Portugues**](README.md)

---

## What is SINAPSE?

SINAPSE is an open-source meta-framework that organizes **186 AI agents into 18 specialized squads**, operating directly in the terminal via Claude Code or Codex CLI. Each agent has a defined role, each squad masters a discipline, and the entire system is governed by a **Constitution with real enforcement** -- 19 active hooks that block violations at runtime.

The core concept is simple: instead of a single AI assistant trying to do everything, SINAPSE structures work into specialized teams. A branding squad handles visual identity. A cybersecurity squad handles compliance and pentesting. A copywriting squad handles persuasion and conversion. Each with its own knowledge base, workflows, and tasks -- totaling **1,425 executable tasks** ready to use.

Unlike tools that just chat with AI, SINAPSE enforces discipline. The **Documentation-First** pipeline requires a story to be created and validated before any code is written. Quality gates run automatically before merge. Unauthorized agents are blocked from pushing. All via hooks that intercept operations in real time -- not after the fact.

---

## Quick Start

### 1. Install

```bash
npx sinapse-ai install
```

The wizard detects your environment, configures your IDE, and installs squads automatically.

### 2. Verify

```bash
npx sinapse-ai doctor
```

### 3. Activate your first agent

```
@developer          # Activate the development agent
*help               # List available commands
```

Done. You have 18 squads operating in your terminal.

---

## Architecture

### CLI First

```
CLI First  >  Observability Second  >  UI Third
```

All intelligence lives in the terminal. Dashboards observe. The UI is never required to operate the system. This is Article I of the Constitution -- non-negotiable.

### 4-Layer Model

SINAPSE separates framework and project artifacts into 4 layers with automatic protection:

| Layer | Mutability | Content |
|-------|-----------|---------|
| **L1** Framework Core | Never | `.sinapse-ai/core/`, `bin/`, Constitution |
| **L2** Templates | Never | Tasks, templates, checklists, workflows |
| **L3** Configuration | Restricted | Entity registry, agent memory, config |
| **L4** Project | Always | Stories, packages, squads, tests |

Deny rules in `.claude/settings.json` enforce this deterministically.

### Constitution

SINAPSE is governed by a formal Constitution with 10 articles and 19 enforcement hooks:

| Article | Principle | Severity |
|---------|-----------|----------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Documentation-First Development | NON-NEGOTIABLE |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |
| VII | Ecosystem Metrics Accuracy | NON-NEGOTIABLE |
| VIII | Mandatory Delegation | NON-NEGOTIABLE |
| IX | Safe Collaboration | NON-NEGOTIABLE |
| X | Security & Data Protection | NON-NEGOTIABLE |

6 articles are NON-NEGOTIABLE -- violations are automatically blocked before execution.

---

## Agent System

SINAPSE includes 12 core agents covering the complete development cycle:

| Agent | Persona | Role |
|-------|---------|------|
| `sinapse-orqx` | **Imperator** | Master orchestrator -- routing and cross-squad coordination |
| `developer` | **Pixel** | Code implementation and story development |
| `quality-gate` | **Litmus** | Testing, QA, and quality gates |
| `architect` | **Stratum** | Architecture and technology decisions |
| `project-lead` | **Beacon** | Product management and epics |
| `product-lead` | **Axis** | Story validation and prioritization |
| `sprint-lead` | **Sync** | Story creation and sprints |
| `analyst` | **Scope** | Business research and analysis |
| `data-engineer` | **Tensor** | Database design, migrations, and RLS |
| `ux-design-expert` | **Mosaic** | UX/UI design |
| `devops` | **Pipeline** | CI/CD, git push (exclusive), releases |
| `squad-creator` | **Loom** | New squad creation |

Activate any agent with `@agent-name` and use `*help` to see its commands.

### Development Workflow

```
@sprint-lead creates story
       |
@product-lead validates
       |
@developer implements
       |
@quality-gate tests
       |
@devops push + PR
```

The framework ensures no step is skipped.

---

## 18 Specialized Squads

Each squad is an autonomous team with its own orchestrator, specialist agents, knowledge base, tasks, and workflows.

| Squad | Domain | Agents |
|-------|--------|--------|
| **squad-brand** | Brand strategy, archetypes, visual audit | 15 |
| **squad-design** | Design systems, components, tokens, UI | 15 |
| **squad-copy** | Persuasive copywriting, headlines, conversion | 14 |
| **squad-council** | Strategic advisors (Munger, Dalio, Thiel, ...) | 11 |
| **squad-storytelling** | Narrative, scripts, story frameworks | 11 |
| **squad-commercial** | Sales, funnel, revenue, commercial pipeline | 11 |
| **squad-paidmedia** | Meta Ads, Google Ads, campaigns, optimization | 10 |
| **squad-claude** | Advanced Claude Code, MCP, deep integration | 10 |
| **squad-animations** | Motion design, CSS, particles, 3D | 9 |
| **squad-cloning** | Cognitive cloning, mind synthesis, digital twins | 9 |
| **squad-cybersecurity** | Threat intel, pentest, compliance, LGPD | 9 |
| **squad-courses** | Courses, curricula, assessments, educational launch | 8 |
| **squad-research** | Market analysis, competitive intelligence | 8 |
| **claude-code-mastery** | Advanced Claude Code tool mastery | 8 |
| **squad-content** | Editorial governance, content strategy | 7 |
| **squad-product** | Product discovery, strategy, operations | 7 |
| **squad-growth** | Analytics, CRO, SEO, growth hacking | 7 |
| **squad-finance** | Budget, pricing, profitability analysis | 5 |

**Total: 18 squads, 186 specialized agents, 1,425 tasks**

Activate any squad via its orchestrator:

```
@brand-orqx         # Brand squad
@copy-orqx          # Copy squad
@cyber-orqx         # Cybersecurity squad
@research-orqx      # Research squad
```

The orchestrator receives your request and automatically delegates to the right specialist within the squad.

---

## IDE Support

SINAPSE supports two IDEs with deep integrations:

| IDE | Activation | Highlights |
|-----|------------|------------|
| **Claude Code** | `@agent-name` | Hooks, contextual rules, deny/allow, Chrome Brain |
| **Codex CLI** | `/skills` or `$skill-name` | Native skills, multi-model, `codex exec` for CI/CD |

Both IDEs have access to all 18 squads, 186 agents, workflows, and knowledge bases. The installer detects and configures automatically.

### Parity Table

| Feature | Claude Code | Codex CLI |
|---------|:-----------:|:---------:|
| Agent activation (@agent) | Full | Full |
| Constitutional hooks (19) | Full | Partial (5) |
| Story-driven development | Full | Full |
| Quality gates | Full | Full |
| Delegation enforcement | Full | Partial |
| Secret scanning | Full | Manual |
| CodeRabbit integration | Full | N/A |
| Skills system | Full | Commands |
| MCP servers | Full | N/A |
| Terminal Bus | Full | N/A |

**Claude Code** for the most integrated and automated experience.
**Codex CLI** for model flexibility and CI/CD automation.

---

## Quality and Security

### Constitutional Enforcement

SINAPSE doesn't just document rules -- it enforces them with **19 active hooks**:

- `enforce-git-push-authority.sh` -- blocks push by unauthorized agents
- `enforce-story-gate.cjs` -- blocks code without a validated story
- `sql-governance.py` -- blocks dangerous SQL (injection patterns)
- `enforce-delegation.cjs` -- blocks orchestrators from executing domain work
- `enforce-architecture-first.cjs` -- blocks code in protected paths without documentation

### 25 Deployment Blockers (3 Tiers)

No project goes to production without passing all of them:

- **Tier 1** -- 10 absolute blockers: RLS, zero hardcoded keys, protected service_role, MFA, authenticated APIs, parameterized SQL
- **Tier 2** -- 7 compliance blockers: DPO, consent, data subject rights, breach notification (LGPD)
- **Tier 3** -- 8 operational blockers: logging, backup, vulnerability scanning, incident response

### Quality Gates

```bash
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # Tests
npm run test:coverage  # Coverage
```

Pre-commit and pre-push hooks validate automatically before each operation.

---

## Documentation

| Resource | Link |
|----------|------|
| Getting Started | [docs/guides/getting-started.md](docs/guides/getting-started.md) |
| Architecture | [docs/framework/core-architecture.md](docs/framework/core-architecture.md) |
| Squads Guide | [docs/guides/squads-guide.md](docs/guides/squads-guide.md) |
| Agent Reference | [docs/guides/agent-reference.md](docs/guides/agent-reference.md) |
| Workflows | [docs/guides/workflows-guide.md](docs/guides/workflows-guide.md) |
| Security | [SECURITY.md](SECURITY.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## CLI Reference

```bash
npx sinapse-ai init <name>       # Create project
npx sinapse-ai install           # Install in current project
npx sinapse-ai update            # Update framework
npx sinapse-ai doctor            # System diagnostics
npx sinapse-ai doctor --fix      # Diagnostics with auto-fix
npx sinapse-ai info              # System information
npx sinapse-ai uninstall         # Remove framework
```

---

## Contributing

```bash
git clone https://github.com/caioimori/sinapse-ai.git
cd sinapse-ai && npm install
```

1. Fork the repository
2. Create your branch (`git checkout -b feat/my-feature`)
3. Commit (`git commit -m 'feat: description'`)
4. Push (`git push origin feat/my-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

---

## Legal

| Document | Link |
|----------|------|
| License | [MIT](LICENSE) |
| Security | [SECURITY.md](SECURITY.md) |
| Code of Conduct | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## Maintainers

- [@caioimori](https://github.com/caioimori) -- Lead Maintainer
- [@Matheus-soier](https://github.com/Matheus-soier) -- Co-Maintainer

---

Built for builders.

**[Back to top](#sinapse-ai)**
