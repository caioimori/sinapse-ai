# Doc-First Bug — Imperator skips Greenfield/Spec Pipeline on large projects

**Date:** 2026-05-07
**Severity:** 🔴 CRITICAL — violates Article III (Documentation-First) NON-NEGOTIABLE
**Reporter:** Caio (runtime test, fresh install)
**Status:** Audit complete, fix in progress

---

## Symptom (observed by Caio)

Caio installed SINAPSE-AI fresh and asked the framework to create a new project (site / LP / platform). The framework went **straight to execution** without:

- Investigation / research plan
- Architecture
- PRD / system design docs
- Epics
- Validated stories
- Pre-implementation validation (`@product-lead`, `@architect`, `@analyst`)

This violates the doc-first contract that the framework promises (Article III is `NON-NEGOTIABLE`).

---

## Expected behavior

For **relatively large projects** (site, landing page, SaaS platform, mobile app, API service), the doc-first pipeline is mandatory:

```
1. @analyst         → research / discovery
2. @architect       → technical architecture
3. @project-lead    → PRD + epic
4. @sprint-lead     → stories
5. @product-lead    → story validation
6. @ux-design-expert → wireframes/design (if UI)
7. @design-orqx + @brand-orqx → DS + visual identity (if UI)
8. @developer       → execution
9. @quality-gate    → QA
10. @devops         → push
```

For **small projects** (bug fix, tweak): SDC YOLO mode is fine.

---

## Root cause

After auditing the relevant files, the bug has **four contributing causes**:

### 1. `sinapse-orqx.md` (Imperator) — no bootstrap classification

The Imperator agent definition has:

- ✅ Routing intelligence with keyword tables for 18 squads
- ✅ Mention of "Estimated complexity (SIMPLE / STANDARD / COMPLEX)" (line 59)
- ✅ NON-NEGOTIABLE rule "ORCHESTRATION PLAN ON EVERY BRIEFING"

But it has:

- ❌ **No reference to `greenfield-handler.js`**
- ❌ **No reference to `greenfield-{ui,service,fullstack}.yaml` workflows**
- ❌ **No reference to `spec-pipeline.yaml`**
- ❌ **No project-type sub-classification** (site vs lp vs platform vs api)
- ❌ **No "is this a new project bootstrap?" check** before routing to a domain orqx

When Caio said "criar um site", Imperator's keyword table matched "site" → `squad-artdir` (keywords list at line 221). Routing went directly to the domain orqx, which proceeded to execute without doc-first.

### 2. `project-intelligence.md` — generic greenfield handling

The rule detects greenfield/brownfield/SINAPSE-managed correctly. But the greenfield branch says only:

> Workflow: setup → story → implement (no brownfield discovery needed)
> Ask: "Que tipo de projeto? (web app, API, SaaS, landing page)"

There is:

- ❌ No invocation of `greenfield-handler.js`
- ❌ No mapping of project sub-type → specific workflow file
- ❌ No enforcement of doc-first pipeline before "implement"

### 3. `greenfield-handler.js` — exists but is orphan code

The handler is well-built (Phase 0 Bootstrap → Phase 1 Discovery 5-agent → Phase 2 Sharding → Phase 3 Dev Cycle), with PAUSE/resume, idempotency, error handling.

But:

- ❌ **No agent definition references it**
- ❌ **Imperator has no wiring to invoke it on a "create new project" request**
- ❌ **TerminalSpawner fallback returns `manual: true` with instructions string** (lines 528–534) — not actionable in normal Imperator flow

### 4. `documentation-first.md` (project rule) — no project-type gate

The rule says "before ANY code implementation begins, the full documentation pipeline MUST be completed", but:

- ❌ **No explicit `project_type` gate**: nothing differentiates "site/LP/platform" from "tweak"
- ❌ **No mapping** of project type → required workflow (greenfield-ui vs greenfield-service vs greenfield-fullstack vs SDC YOLO)
- ❌ **No enforcement mechanism** beyond "BLOCKED" text — nothing actually stops Imperator from routing past it

---

## Fix plan (3 PRs)

### PR 0.2 — `documentation-first.md`: add project-type gate

Add a new section "Project Type Gate" with:

- Classification matrix: keywords → project_type → required workflow
- Explicit BLOCK rule: `project_type IN [site, lp, platform, app, saas, mobile, api, service]` AND `no epic exists` → BLOCK execution
- List of required artifacts per project type

### PR 0.3 — `sinapse-orqx.md`: Imperator pre-routing classification

Add a new section "PROJECT BOOTSTRAP CLASSIFICATION" that runs **before** the existing routing table. It must:

1. Detect "new project" intent (keywords: criar, novo, build, montar, fazer um/uma)
2. Sub-classify the target: site / lp / platform / app / saas / api / service / fix / tweak
3. Check if `docs/epics/` has an epic and `docs/stories/` has stories
4. If new + large + no epic → invoke greenfield workflow:
   - `greenfield-ui.yaml` for UI projects (site, lp, app)
   - `greenfield-service.yaml` for API / backend services
   - `greenfield-fullstack.yaml` for SaaS / platforms
5. If COMPLEX (score ≥ 16 in the 5 dimensions) → run Spec Pipeline first
6. Only after epic + stories exist → route to domain orqx for execution

### PR 0.4 — `project-intelligence.md`: greenfield sub-classification

Replace the generic greenfield branch with:

- Sub-classify project type via keyword detection
- Map sub-type to specific workflow file
- Force the doc-first pipeline before any implementation step
- Reference `greenfield-handler.js` as the execution mechanism

---

## Validation criteria (post-fix)

A successful fix means:

1. Caio installs fresh, says "criar um site pra X" → framework asks discovery questions, generates project-brief.md, prd.md, front-end-spec.md, front-end-architecture.md, validates artifacts, shards, creates stories, **then** implements.
2. Caio says "corrige esse bug do botão" → framework executes SDC YOLO directly (no over-cerimony).
3. Caio says "monta uma plataforma SaaS" → framework runs greenfield-fullstack.yaml + Spec Pipeline (COMPLEX).
4. Imperator never lets a domain orqx (artdir, design, etc.) start visual work without a validated brief + spec.

---

## Anti-patterns this fix forbids

- Imperator routing "criar site" directly to `@artdir-orqx` without epic
- Domain orqx generating code without validated stories
- Skipping architecture "porque é simples" when the project is not simple
- Generic visual output (`max-w-7xl`, shadcn default) without DS grounding

---

## References

- Bug report: `~/.claude/projects/.../memory/feedback_orchestrator_must_plan_before_executing_large_projects.md`
- Article III: `.sinapse-ai/constitution.md` (Documentation-First, NON-NEGOTIABLE)
- Imperator: `.claude/commands/SINAPSE/agents/sinapse-orqx.md`
- Project Intelligence: `.claude/rules/project-intelligence.md`
- Doc-First Rule: `.claude/rules/documentation-first.md`
- Greenfield Handler: `.sinapse-ai/core/orchestration/greenfield-handler.js`
- Greenfield UI Workflow: `.sinapse-ai/development/workflows/greenfield-ui.yaml`
- Spec Pipeline: `.sinapse-ai/development/workflows/spec-pipeline.yaml`
