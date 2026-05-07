# Project Intelligence — Auto-Detection (NON-NEGOTIABLE)

> Applies to ALL agents, ALL sessions. Users NEVER configure project type manually.

## Initial State Audit (ALWAYS FIRST — runs before classification)

> **This is a NON-NEGOTIABLE preflight step.** Without it, the framework treats every fresh-looking directory as "greenfield" and ignores partial work that's already there (existing brand, components, half-written PRD, abandoned epics, an in-progress design system, brownfield code with no `package.json`, etc.). The audit costs ~2 seconds and prevents the framework from overwriting or duplicating work.

### Eight dimensions to check (silent, parallel)

The audit collects existence + summary for each dimension. Each is a YES/NO/PARTIAL signal:

| # | Dimension | Signals checked |
|---|---|---|
| 1 | **Docs** | `docs/project-brief.md`, `docs/prd.md`, `docs/architecture*.md`, `docs/front-end-spec.md`, `docs/epics/`, `docs/stories/` |
| 2 | **Brand** | `brand/`, `brandbook*`, `assets/brand/`, `public/brand/`, `*logo*`, `BRAND.md`, `BRANDBOOK.md` |
| 3 | **Design system** | `tokens.json`, `design-tokens.json`, `tailwind.config.*` with custom theme, `components/ui/`, `DESIGN.md`, `DS.md` |
| 4 | **Components** | `components/`, `src/components/`, `app/`, `pages/` with `.tsx` / `.jsx` / `.vue` files |
| 5 | **Code** | `package.json`, `tsconfig.json`, `src/`, language-specific markers (`go.mod`, `pyproject.toml`, `Cargo.toml`) |
| 6 | **Tests** | `jest.config.*`, `vitest.config.*`, `__tests__/`, `tests/`, `*.test.*`, `*.spec.*` |
| 7 | **Infra** | `.github/workflows/`, `Dockerfile`, `docker-compose.*`, `vercel.json`, `.env.example`, CI configs |
| 8 | **Git history** | `.git/` exists, `git log` has commits, recent activity (last 30 days), branch count |

### Maturity classification

Combining the 8 signals produces 1 of 5 maturity levels:

| Level | Criteria | Recommended workflow |
|---|---|---|
| `EMPTY` | 0/8 signals; directory has only `.git/` or nothing | Full greenfield workflow (greenfield-handler.js) |
| `BOOTSTRAPPED` | Only Infra (7) present (CI, Dockerfile, .env.example) — no code yet | Skip Phase 0 Bootstrap, jump to Phase 1 Discovery |
| `PARTIAL` | Some Docs/Brand/DS but no Code, OR Code without Docs | **Continue from where it stopped** — never overwrite, merge with existing |
| `MATURE` | Code + Tests + (Docs OR Infra) — real working project | Brownfield Discovery (10-phase technical debt) before any change |
| `SINAPSE_MANAGED` | `.sinapse-ai/` exists with `core-config.yaml` | Resume SDC: read `docs/stories/`, find active story, continue |

### Audit output (always presented to user before proceeding)

After running the audit, the framework reports in ONE structured paragraph (PT-BR):

```
Estado detectado: {maturity_level}
Já existe: {list of YES dimensions, e.g., "Brand (logo + brandbook), 1 PRD parcial em docs/, 5 componentes UI"}
Faltando: {list of NO dimensions critical to the user's request}
Recomendação: {workflow + concrete first step}
```

Only AFTER this report (and any user adjustment) does the framework proceed to classification + workflow invocation.

### Anti-shortcuts (FORBIDDEN)

- Skipping the audit because "it looks empty" — always run, always check all 8 dimensions
- Calling a directory "greenfield" because `package.json` is missing (could have brand assets, half-written PRD, design tokens — all without `package.json`)
- Calling a directory "brownfield" only because `package.json` exists (could be just bootstrapped infra with zero feature work — different workflow)
- Overwriting existing partial work without listing it to the user first
- Ignoring `docs/epics/` and `docs/stories/` from a previous session

## Classification (after audit)

Use the maturity level from the audit to pick the path:

```
maturity == EMPTY              → Full greenfield (see Greenfield Behavior below)
maturity == BOOTSTRAPPED       → Greenfield Phase 1 onward (skip Bootstrap)
maturity == PARTIAL            → Continuation Behavior (below)
maturity == MATURE             → Brownfield Behavior (below)
maturity == SINAPSE_MANAGED    → SINAPSE-Managed Behavior (below)
```

## Quick Tech Scan (BROWNFIELD, < 5 seconds)

When brownfield detected, silently check:

| Check | How | Sets Context |
|-------|-----|-------------|
| Framework | package.json dependencies | next/react/vue/angular/express |
| Language | tsconfig.json exists? | typescript/javascript |
| Database | supabase/, prisma/, .env | supabase/prisma/drizzle/none |
| Tests | jest.config, vitest.config | jest/vitest/none |
| CI | .github/workflows/ | github-actions/none |

Report to user in ONE line: "Projeto Next.js + TypeScript + Supabase detectado."

## Behavior Adaptation by State

### Greenfield Behavior

A bare `setup → story → implement` loop is **not enough** for greenfield. Large projects need upstream artifacts (project-brief, PRD, architecture, design spec) BEFORE stories. The greenfield branch sub-classifies the request and invokes the right workflow.

#### Step 1 — Sub-classify project_type

Detect intent and target from the user's first message (PT-BR or EN keywords):

| project_type | Triggers |
|---|---|
| `site` | site, website, institucional, página, web page |
| `lp` | landing page, LP, captura, sales page, squeeze page |
| `app` | app mobile, ios, android, react native, flutter |
| `platform` | plataforma, dashboard, admin panel, portal interno |
| `saas` | SaaS, software as a service, app web com login, multi-tenant |
| `api` | API, backend, REST, GraphQL, microservice |
| `service` | worker, cron job, ETL, integration, automation |

If detection is ambiguous, ask ONE clarifying question with these options as choices.

#### Step 2 — Map to required workflow

| project_type | Workflow file | Phase 1 agents |
|---|---|---|
| `site` / `lp` / `app` | `.sinapse-ai/development/workflows/greenfield-ui.yaml` | analyst → project-lead → ux-design-expert → architect → product-lead |
| `platform` / `saas` | `.sinapse-ai/development/workflows/greenfield-fullstack.yaml` | analyst → project-lead → ux-design-expert → architect → product-lead |
| `api` / `service` | `.sinapse-ai/development/workflows/greenfield-service.yaml` | analyst → project-lead → architect → product-lead |

Execution mechanism: `.sinapse-ai/core/orchestration/greenfield-handler.js` orchestrates Phase 0 (Bootstrap) → Phase 1 (Discovery 5-agent) → Phase 2 (Sharding) → Phase 3 (Dev Cycle).

#### Step 3 — Apply DS grounding (UI projects)

For `site` / `lp` / `app` / `platform` / `saas`, the DS Resolver runs before any visual output (see `~/.claude/rules/design-system-grounding.md`). Internal projects use the SINAPSE Brandbook; external clients use the client's brand or the high-quality fallback.

#### Step 4 — Forbidden shortcut

The greenfield branch NEVER skips to "implement" without:
- `docs/project-brief.md` validated
- `docs/prd.md` validated
- `docs/{front-end-spec | service-architecture}.md` validated
- `docs/architecture.md` (or `fullstack-architecture.md`) validated
- Stories in `docs/stories/` with status ≥ Ready

#### Auto-apply infra templates

Independent of project_type: PR template, CI, `.env.example`, CODEOWNERS, gitignore. These run during Phase 0 (Bootstrap) of the greenfield workflow.

### Continuation Behavior (PARTIAL maturity)

When the audit detects partial work — e.g., a brandbook without a site, a PRD without code, components without architecture, an abandoned epic — the framework MUST treat it as a continuation, not a bootstrap.

- **Inventory first:** list every existing artifact and tell the user what's there
- **Identify gaps:** what's missing to ship the user's stated goal?
- **Propose continuation plan:** which greenfield phase resumes from here? which brownfield steps apply?
- **Merge, never replace:** existing brand/DS/components are inputs to the workflow, not throwaway scaffolding
- **Preserve epic + story state:** if `docs/epics/` or `docs/stories/` exist, resume their lifecycle (Draft → Ready → InProgress → Done)

Example: user says "criar um site" but the audit finds a `brand/` folder with logo + brandbook. The framework reports:
> Estado: `PARTIAL`. Já existe: brand assets (logo + brandbook). Faltando: PRD, design spec, código. Recomendação: greenfield-ui.yaml começando da Phase 1, usando seu brandbook como input.

### Brownfield Behavior (MATURE maturity)
- Prioritize: understanding existing code before changing anything
- First action: read README, package.json, folder structure
- Workflow: quick scan → understand → then proceed with user request
- NEVER rewrite or refactor without understanding existing patterns
- Respect existing conventions (naming, folder structure, testing framework)
- For non-trivial changes: invoke Brownfield Discovery (10-phase technical debt assessment)

### SINAPSE-Managed Behavior
- Check for active story in docs/stories/
- Resume where last session left off
- Follow SDC workflow (story → implement → QA → push)

## Anti-Patterns (FORBIDDEN)

- Asking user "is this a new or existing project?"
- Asking user to set `projectType` in config
- Starting implementation in brownfield without reading existing code first
- Applying greenfield templates to a brownfield project (overwriting existing CI/configs)
- Ignoring existing patterns and imposing SINAPSE conventions forcefully
- Treating greenfield as "setup → story → implement" without sub-classifying project_type
- Skipping `greenfield-handler.js` (or its workflow file) on a `site` / `lp` / `platform` / `saas` / `api` request
- Letting a domain orchestrator (artdir, design, brand) generate visual output before greenfield Phase 1 produces project-brief.md + prd.md + design spec
- Generating UI without DS grounding (see `~/.claude/rules/design-system-grounding.md`)
