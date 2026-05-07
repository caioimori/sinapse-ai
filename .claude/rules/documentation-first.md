# Documentation-First Development (NON-NEGOTIABLE)

> **Constitution Article III — Elevated to NON-NEGOTIABLE**
> Applies to ALL agents, ALL projects, ALL requests. No exceptions.

## Rule

Before ANY code implementation begins, the full documentation pipeline MUST be completed. This is AUTOMATIC behavior — no user needs to request it.

### Required Pipeline

```
User briefing → Epic (if new initiative) → Story → Validation → Implementation
```

1. **Epic** — The initiative MUST have an epic defined (or an existing one identified)
2. **Story** — Each work unit MUST have a story file in `docs/stories/` with:
   - Clear acceptance criteria (Given/When/Then preferred)
   - Defined scope (IN/OUT)
   - Dependencies mapped
   - Complexity estimate
3. **Validation** — Story MUST be validated (@product-lead) before implementation starts
4. **Status** — Story status MUST be >= `Ready` before any code is written

## Automatic Behavior (NON-NEGOTIABLE)

This is NOT something the user needs to request. It happens AUTOMATICALLY on every briefing:

| User Says | Agent Does |
|-----------|-----------|
| "Implementa feature X" | Creates story FIRST, then implements |
| "Corrige esse bug" | Creates bug-fix story FIRST, then fixes |
| "Faz isso rapidinho" | Creates story anyway — no shortcuts |
| "Pula a documentacao" | REFUSES. Explains this is NON-NEGOTIABLE |
| "So quero o codigo" | Routes to @sprint-lead for story, then @developer |

## Gate: BLOCK

No implementation proceeds without ALL of these:
- Story file exists in `docs/stories/`
- Story has acceptance criteria defined
- Story has scope (IN/OUT) documented
- Story status is `Ready` or higher (validated by @product-lead)

**Attempting to write code without a valid story → BLOCKED.**

## Project Type Gate (NON-NEGOTIABLE)

> **Why this exists:** A bare `epic + story` pipeline is necessary but not sufficient for **large projects**. A site, landing page, SaaS platform, mobile app, or backend service needs *upstream* artifacts (project brief, PRD, architecture, design spec) **before** stories can be written meaningfully. Without this gate, the framework writes stories from a vague verbal description and produces generic / off-brand output.

### Classification matrix

The first thing every agent does on a briefing is **classify the project type** by intent + keywords:

| Project type | Trigger keywords (PT/EN) | Required workflow |
|---|---|---|
| `site` | site, website, institutional, página | `greenfield-ui.yaml` |
| `lp` | landing page, LP, captura, sales page | `greenfield-ui.yaml` |
| `app` | app, mobile, ios, android, react native | `greenfield-ui.yaml` |
| `platform` | plataforma, dashboard, admin, portal | `greenfield-fullstack.yaml` |
| `saas` | SaaS, software as a service, app web | `greenfield-fullstack.yaml` |
| `api` | API, backend, microservice, serviço | `greenfield-service.yaml` |
| `service` | worker, integration, automation, ETL | `greenfield-service.yaml` |
| `feature` | feature, funcionalidade (existing project) | SDC (Story Development Cycle) |
| `fix` | bug, conserta, corrige, ajusta, tweak | SDC YOLO mode |
| `refactor` | refatora, limpa, renomeia | SDC interactive mode |

### The gate

```
project_type ∈ [site, lp, app, platform, saas, api, service]
  AND no epic exists in docs/epics/
  → BLOCK execution
  → INVOKE the required greenfield workflow
  → No "implement first, document later" — ever
```

### Required upstream artifacts per project type

| Project type | Required artifacts BEFORE first story |
|---|---|
| `site` / `lp` / `app` | project-brief.md → prd.md → front-end-spec.md → front-end-architecture.md |
| `platform` / `saas` | project-brief.md → prd.md → front-end-spec.md → fullstack-architecture.md |
| `api` / `service` | project-brief.md → prd.md → service-architecture.md |
| `feature` (in existing project) | epic.md → story.md (no upstream re-doc needed) |
| `fix` / `refactor` | story.md only (SDC) |

### Complexity gate (Spec Pipeline trigger)

When the user briefing is ambiguous or the scope is large, the gate ALSO triggers the Spec Pipeline (see `workflow-execution.md` § 3):

```
complexity_score ≥ 16 (COMPLEX class) → run Spec Pipeline FIRST
  → @project-lead gathers requirements
  → @architect assesses + plans
  → @analyst researches
  → @project-lead writes spec.md
  → @quality-gate critiques
  → only then: epic + stories
```

### Examples

| User says | Classification | What the framework does |
|---|---|---|
| "criar um site pra meu cliente Vascularte" | `site` | Invokes `greenfield-ui.yaml` (5-agent Phase 1) |
| "monta uma plataforma SaaS de gestão" | `saas` (COMPLEX) | Spec Pipeline → then `greenfield-fullstack.yaml` |
| "API de cobrança Asaas" | `api` | Invokes `greenfield-service.yaml` |
| "corrige o botão verde da home" | `fix` | SDC YOLO direct |
| "implementa dark mode na plataforma" | `feature` | SDC interactive |
| "landing page do lançamento de outubro" | `lp` | Invokes `greenfield-ui.yaml` |

## Workflow Enforcement

### CORRECT Flow (always)
```
User briefing
  → @sprint-lead *draft (create story)
  → @product-lead *validate (validate story)
  → @developer *develop (implement)
  → @quality-gate *qa-gate (quality check)
  → @devops *push (deploy)
```

### FORBIDDEN Flow (never)
```
User briefing → @developer *develop (BLOCKED — no story)
User briefing → Direct code writing (BLOCKED — no story)
```

## Exception

The ONLY exception is framework governance work by @sinapse-orqx (constitutional amendments, ecosystem health), which operates above the story layer. Even then, changes SHOULD be documented.

## Anti-Patterns (FORBIDDEN)

- Writing ANY code without a story
- "Quick fix" without documentation
- Implementing features based only on verbal description
- Skipping story validation
- Starting implementation with a Draft story (must be Ready)
- Treating documentation as "optional" or "we'll do it later"
- Any agent accepting implementation work without verifying story exists
- Routing a `site` / `lp` / `app` / `platform` / `saas` / `api` request directly to a domain orchestrator (e.g., `@artdir-orqx`, `@design-orqx`) **before** the greenfield workflow runs and produces project-brief.md + prd.md
- Skipping the Spec Pipeline on COMPLEX briefings (score ≥ 16)
- Generating UI without DS grounding (see `~/.claude/rules/design-system-grounding.md`)
