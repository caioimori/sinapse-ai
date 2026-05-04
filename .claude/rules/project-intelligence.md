# Project Intelligence — Auto-Detection (NON-NEGOTIABLE)

> Applies to ALL agents, ALL sessions. Users NEVER configure project type manually.

## Auto-Detect on First Interaction

Before ANY work, silently detect project state:

```
1. Check: does .sinapse-ai/ exist?
   YES → SINAPSE-managed project. Read core-config.yaml for context.
   NO  → Continue to step 2.

2. Check: is directory empty (or only has .git)?
   YES → GREENFIELD. Ask project type, then scaffold.
   NO  → Continue to step 3.

3. Check: does package.json or .git exist?
   YES → BROWNFIELD. Run quick tech scan, then proceed.
   NO  → UNKNOWN. Ask user what they want to build.
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
- Prioritize: scaffolding, architecture decisions, project setup
- Workflow: setup → story → implement (no brownfield discovery needed)
- Auto-apply: infra templates (PR template, CI, .env.example, CODEOWNERS)
- Ask: "Que tipo de projeto? (web app, API, SaaS, landing page)"

### Brownfield Behavior
- Prioritize: understanding existing code before changing anything
- First action: read README, package.json, folder structure
- Workflow: quick scan → understand → then proceed with user request
- NEVER rewrite or refactor without understanding existing patterns
- Respect existing conventions (naming, folder structure, testing framework)

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
