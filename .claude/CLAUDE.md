# CLAUDE.md - SINAPSE

## Constitution

Full doc: `.sinapse-ai/constitution.md`. Gates auto-block violations.

| Art. | Principle | Severity |
|------|-----------|----------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Documentation-First | NON-NEGOTIABLE |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |
| VII | Metrics Accuracy | NON-NEGOTIABLE |
| VIII | Mandatory Delegation | NON-NEGOTIABLE |
| IX | Safe Collaboration | NON-NEGOTIABLE |
| X | Security & Data Protection | NON-NEGOTIABLE |

## CLI First

`CLI First → Observability Second → UI Third`. New features MUST work 100% via CLI before any UI.

## Project Structure

```
.sinapse-ai/           # Framework core, data, agents, tasks, templates
bin/                   # CLI executables
docs/stories/          # Development stories
packages/              # Shared packages
squads/                # Squad expansions
tests/                 # Tests
```

## Framework Boundary (L1-L4)

| Layer | Mutability | Key Paths |
|-------|-----------|-----------|
| L1 Core | NEVER | `.sinapse-ai/core/`, `bin/sinapse*.js` |
| L2 Templates | NEVER | `.sinapse-ai/development/{tasks,templates,checklists,workflows}/` |
| L3 Config | Mutable | `.sinapse-ai/data/`, `core-config.yaml` |
| L4 Runtime | ALWAYS | `docs/stories/`, `packages/`, `squads/`, `tests/` |

## Agents

Use `@agent-name` or `/SINAPSE:agents:agent-name`. Commands: `*help`, `*create-story`, `*task {name}`, `*exit`.

| Agent | Persona | Scope |
|-------|---------|-------|
| @developer | Pixel | Code implementation |
| @quality-gate | Litmus | Testing & quality |
| @architect | Stratum | Architecture |
| @project-lead | Beacon | Product Management |
| @product-lead | Axis | Product Owner |
| @sprint-lead | Sync | Scrum Master |
| @analyst | Scope | Research |
| @data-engineer | Tensor | Database |
| @ux-design-expert | Mosaic | UX/UI |
| @devops | Pipeline | CI/CD, push (EXCLUSIVE) |

## Documentation-First (NON-NEGOTIABLE)

Pipeline: Epic → Story → Validation → Implementation. No code without a story at status >= Ready.

## Code Patterns

- **Naming:** PascalCase components, `use` prefix hooks, kebab-case files, SCREAMING_SNAKE constants
- **Imports:** Always absolute (`@/...`), never relative. Order: React → external → UI → utils → stores → features → CSS
- **TypeScript:** No `any`, always define props interfaces, `as const` for constants
- **Commits:** Conventional Commits + story ref: `feat: feature [Story 2.1]`
- **Push:** Only `@devops` can push to remote

## Tests

```bash
npm test && npm run lint && npm run typecheck
```

## Tool Usage

Use Grep (not grep), Read (not cat), Edit (not sed), Glob (not find). Prefer native tools over MCP. Tool registry: `.sinapse-ai/data/tool-registry.yaml`.

## Context Management

- Rules with `paths:` frontmatter only load when working on matching files
- Agent handoff compacts to ~379 tokens on switch
- Agent memory in `.sinapse-ai/development/agents/{id}/MEMORY.md`
- **Memory as hints:** Memory entries are hints, NOT ground truth. Always verify against actual codebase before acting on remembered facts.

## Delegation Model

- **Persona switch:** For sequential agent work in same context (lightweight)
- **Sub-agent (Agent tool):** Only for parallel/isolated work (min ~20K tokens overhead)
- **Model routing:** Use `model: "haiku"` for routine sub-agent tasks (file reads, linting). Reserve Opus for architecture/complex implementation.
- **Never** spawn sub-agents for simple sequential tasks — use persona switch instead

## Anti-Hallucination

- **Verify before recommending:** `npm view {pkg}` before adding any dependency
- **Cite sources:** Reference file paths and line numbers when making claims about code
- **Mark uncertainty:** Use [NEEDS VERIFICATION] for claims not grounded in actual files
- Compact at 60% context usage (not default 83%) — run `/compact` proactively

---
*SINAPSE v6.0 — CLI First | Observability Second | UI Third*
