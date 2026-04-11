---
name: sinapse-methodology
description: Complete SINAPSE AI development methodology in one self-contained skill
trigger: When teaching SINAPSE methodology to any AI tool or new team member
agents: [analyst, architect, developer, sprint-lead, product-lead]
---

# SINAPSE Methodology

A complete AI-orchestrated development methodology. Self-contained — works in any project, any AI tool.

## 1. Core Philosophy

**CLI First. Observability Second. UI Third.**

All intelligence lives in the CLI. Dashboards observe, never control. UI is optional. Every feature must work 100% via CLI before any UI exists.

## 2. Constitution (10 Articles)

Non-negotiable principles that govern all work:

| # | Article | Severity | Summary |
|---|---------|----------|---------|
| I | CLI First | NON-NEGOTIABLE | CLI is the source of truth |
| II | Agent Authority | NON-NEGOTIABLE | Each agent has exclusive operations |
| III | Documentation-First | NON-NEGOTIABLE | Story before code, always |
| IV | No Invention | MUST | Every spec traces to a requirement |
| V | Quality First | MUST | Quality gates cannot be bypassed |
| VI | Absolute Imports | SHOULD | No relative imports in codebase |
| VII | Ecosystem Metrics | NON-NEGOTIABLE | Metrics must reflect reality |
| VIII | Mandatory Delegation | NON-NEGOTIABLE | Orchestrators never do domain work |
| IX | Safe Collaboration | NON-NEGOTIABLE | Git safety net for non-git-experts |
| X | Security & Data | NON-NEGOTIABLE | 25 deployment blockers enforced |

## 3. Agent System

Specialized agents with exclusive authority domains:

### Development Agents

| Agent | Role | Exclusive Operations |
|-------|------|---------------------|
| Sprint Lead | Scrum Master | Story creation |
| Product Lead | Product Owner | Story validation |
| Developer | Implementation | Code, local git |
| Quality Gate | QA | Quality checks, verdicts |
| Architect | Design authority | Architecture decisions |
| Data Engineer | Database | Schema, RLS, migrations |
| DevOps | Deployment | git push, PR, CI/CD (EXCLUSIVE) |
| Analyst | Research | Research, analysis |
| Project Lead | PM | Epic orchestration |

### Key Rule: Mandatory Delegation
Orchestrators NEVER execute domain work. They absorb, diagnose, delegate, coordinate. Even if explicitly asked to "just do it," they delegate to the specialist.

## 4. Story Development Cycle (SDC)

The primary workflow for all development:

```
Phase 1: CREATE (Sprint Lead)
  Input: Epic/PRD
  Output: Story file with AC, scope, dependencies
  Status: Draft

Phase 2: VALIDATE (Product Lead)
  10-point checklist (title, AC, scope, deps, complexity, value, risks, DoD, alignment)
  Decision: GO (>=7/10) or NO-GO
  Status: Draft -> Ready

Phase 3: IMPLEMENT (Developer)
  Modes: YOLO (autonomous) | Interactive | Pre-Flight (plan-first)
  Self-healing code review (max 2 iterations)
  Status: Ready -> InProgress

Phase 4: QA GATE (Quality Gate)
  7 checks: code review, tests, AC met, no regressions, perf, security, docs
  Verdict: PASS | CONCERNS | FAIL | WAIVED
  Status: InProgress -> InReview -> Done
```

**Golden Rule:** No code without a validated story. No exceptions.

## 5. Quality Gates

### Pre-Commit
- Secrets scan (API keys, tokens, passwords)
- Lint + typecheck
- Fast review (unused imports, console.logs, patterns)

### Pre-Merge (QA Loop)
- Automated review with self-healing (max 5 iterations)
- Verdicts: APPROVE, REJECT (fix + re-review), BLOCKED (escalate)

### Pre-Deploy (25 Blockers)
- Tier 1: 10 absolute blockers (RLS, secrets, auth, SQL injection, deps)
- Tier 2: 7 compliance blockers (LGPD/Brazil)
- Tier 3: 8 operational blockers (logging, backups, incident response)

## 6. Safe Collaboration Protocol

For teams where members are product builders, not git experts:

1. **Auto-branch** — Never work on main. Create feature branch automatically.
2. **Auto-sync** — git fetch + pull at session start. Always.
3. **Auto-resolve** — Simple conflicts resolved by agent, complex ones shown to user.
4. **Auto-PR** — PR created with reviewer assignment after push.
5. **Secret scan** — Every commit checked for secrets. Blocked if found.

Users never touch git. They focus on WHAT to build. Agents handle HOW to save it.

## 7. Incremental Development (IDS)

Decision hierarchy for every new artifact:

```
REUSE (>=90% match) > ADAPT (60-89% match, <30% changes) > CREATE (justify)
```

Creating something new requires: evaluated patterns, rejection reasons, unique capability justification, and registry entry within 24 hours.

## 8. Security by Default

Security is not a feature — it is the foundation. From day one:

- RLS on every table with user data
- Parameterized queries only (no SQL concatenation)
- service_role never in frontend
- Rate limiting on all public APIs
- Input validation with schema (Zod)
- CORS restricted to known origins
- MFA on all admin accounts

## 9. Framework Boundary Model

4 layers with clear mutability rules:

| Layer | Mutability | Example |
|-------|-----------|---------|
| L1 Core | NEVER | Constitution, orchestration engine |
| L2 Templates | NEVER (extend only) | Tasks, templates, checklists |
| L3 Config | Mutable (guarded) | Knowledge base, agent memory |
| L4 Runtime | ALWAYS | Stories, packages, tests |

## 10. Workflow Selection

| Situation | Workflow |
|-----------|---------|
| New feature from epic | Story Development Cycle |
| QA found issues | QA Loop (max 5 iterations) |
| Complex feature needs spec | Spec Pipeline then SDC |
| Joining existing project | Brownfield Discovery (10-phase) |
| Trivial bug fix | SDC with fast-track |

## 11. Communication Principles

- Explain simply. "Saved your work" not "committed to HEAD."
- Never assume git knowledge from users.
- Always confirm before destructive operations.
- Document every decision for future context.
- Every finding references its source.

## 12. Applying to Any Project

To use SINAPSE methodology in a new project:

1. Define agents and their exclusive authorities
2. Enforce documentation-first (story before code)
3. Set up quality gates (pre-commit, pre-merge, pre-deploy)
4. Use the SDC workflow for all development
5. Apply REUSE > ADAPT > CREATE for every artifact
6. Implement safe collaboration for non-git-expert teams
7. Security from commit one, not "later"

This methodology scales from solo developers to multi-agent AI orchestration systems. The principles remain the same regardless of team size or tooling.
