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
| XI | Conservative Default | MUST |

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
governance/            # Framework evolution pipeline: audit → proposal → approval → PR
audits/                # Framework-level AuditFindings (promoted/ and archived/)
```

## Framework Boundary (L1-L4)

| Layer | Mutability | Key Paths |
|-------|-----------|-----------|
| L1 Core | NEVER | `.sinapse-ai/core/`, `bin/sinapse*.js` |
| L2 Templates | NEVER | `.sinapse-ai/development/{tasks,templates,checklists,workflows,external-executors}/` |
| L3 Config | Mutable | `.sinapse-ai/data/`, `core-config.yaml` |
| L4 Runtime | ALWAYS | `docs/stories/`, `packages/`, `squads/`, `tests/` |

**External Executors (opt-in delegation):** `sinapse-delegate` CLI outsources `@developer` implementation to an external CLI (e.g., Codex) while SINAPSE retains orchestration authority. Protocol: `.sinapse-ai/development/external-executors/`. Task: `.sinapse-ai/development/tasks/delegate-to-external-executor.md`. Run artifacts: `.sinapse/external-runs/<timestamp>-<slug>/`.

**Framework Governance (Evolution Pipeline):** How the framework evolves: `governance/evolution-pipeline.md`. AuditFindings that become framework proposals live in `governance/proposals/`. Approved patterns in `governance/patterns/`. Templates in `governance/templates/`. Framework-level promoted findings in `audits/promoted/`.

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

## Token Economy & Response Format (NON-NEGOTIABLE)

Auto-applied to all agents: `~/.claude/rules/token-economy.md` + `~/.claude/rules/response-format.md`. Compact at 60%, model route haiku/sonnet/opus, no preamble, no trailing summary.

## Delegation & Anti-Hallucination

- Persona switch for sequential work, sub-agent only for parallel (20K+ tokens each)
- Model routing: `haiku` routine, `sonnet` standard, `opus` complex
- Sub-agents announce their model for visual verification via statusline
- `npm view {pkg}` before adding deps. Cite file:line for claims.
- Mark uncertain claims with [NEEDS VERIFICATION]. Compact at 60%.

---
*SINAPSE v6.0 — CLI First | Observability Second | UI Third*
