# Epic — Clinical Audit (Pre-GA 1.0.0)

> **Status:** Draft (plan-first)
> **Blocks:** GA 1.0.0 promotion
> **Owner:** @project-lead → @architect → each dimension delegated to domain specialist
> **Rule:** No audit execution begins before this epic + its 17 stories are written, reviewed, and Ready.
> **Anti-hallucination contract:** every claim in an audit story MUST cite `file:line` of the current codebase. No memory-based assertions, no paraphrased recollections.

## Motivation

The GA 1.0.0 release is a one-shot market positioning moment. Shipping with broken features, drift between docs and code, or hallucinated claims would sabotage first-user trust. The clinical audit is the price of calling v1 "v1" without an asterisk.

Caio explicitly framed this as "literalmente todas as funcionalidades" must be verified, and the execution plan must be detailed enough that the AI **cannot hallucinate** mid-audit.

## Scope — 17 Dimensions

Each dimension becomes one story. Stories execute independently in order of risk + blast radius.

| # | Dimension | Scope | Primary executor |
|---|---|---|---|
| 1 | Funcionalidades | Features exposed to the end user (install, doctor, init, chrome-brain, etc.) | @developer |
| 2 | Workflows | SDC, QA Loop, Spec Pipeline, Brownfield Discovery — each phase wiring verified | @sprint-lead |
| 3 | Agents | Framework agents: @developer, @architect, @project-lead, @product-lead, @sprint-lead, @analyst, @data-engineer, @ux-design-expert, @devops, @quality-gate | @architect |
| 4 | Subagents | Agents spawned via Agent tool — per-subagent capability + isolation verification | @architect |
| 5 | Workers | Haiku workers, tech-search workers, any long-running background processes | @developer |
| 6 | Squads | 19 squad orchestrators (*-orqx) + squad members — membership sync, handoff contracts | @architect |
| 7 | Clones | Cloning squad (Helix), mind synthesis, DNA governance hook | @architect |
| 8 | Comandos | `*help`, `*draft`, `*validate`, all slash-command surfaces; canonical CLI + legacy binary parity | @developer |
| 9 | Skills | Registered skills (update-config, simplify, loop, schedule, claude-api, etc.) — install path + invocation contract | @developer |
| 10 | Ferramentas (Tools) | Bash, Edit, Glob, Grep, Read, Write, Agent, Task — usage rules, anti-patterns, hook coverage | @quality-gate |
| 11 | Plugins | Plugin system (claude-mem, extraKnownMarketplaces) — install footprint + uninstall completeness | @devops |
| 12 | MCP | chrome-devtools, figma, notion, supabase, vercel, terminal-bus — registration + connection + failure mode | @devops |
| 13 | Gitflows | Branch protection, PR automation, safe-collaboration rules, pre-push validators | @devops |
| 14 | Pesquisas (research) | tech-search, deep research pipelines, vault grounding, WebFetch/WebSearch contracts | @analyst |
| 15 | Base de conhecimento | Second Brain, vault routing, domain rules, rule-injection layers | @analyst |
| 16 | Economia de tokens | token-economy.md enforcement, model routing (haiku/sonnet/opus), compaction thresholds | @architect |
| 17 | Alucinações | Anti-hallucination checks, no-invention gate, verification protocols, file:line citation discipline | @quality-gate |

## Execution Protocol — Per Dimension

Every dimension story MUST follow this structure or be rejected at the G3 gate (@product-lead validation):

```
1. Inventory      — enumerate every artifact in scope, with file path + line range
2. Contract       — restate the documented behavior (from the rule/doc that governs it)
3. Reality        — read the current code, cite file:line for every observation
4. Delta          — diff between contract and reality, classified: ALIGNED | DRIFT | BROKEN | MISSING
5. Severity       — CRITICAL (blocks GA) | HIGH (fix before GA) | MEDIUM (tech debt) | LOW (cosmetic)
6. Recommendation — one of: {no-action, update-doc, fix-code, escalate-to-architect, create-follow-up-story}
7. Gate           — @quality-gate approves before next dimension begins
```

Stories that do not cite `file:line` for Reality claims MUST be returned to the executor. Memory-based assertions are a hallucination signal.

## Dependency Chain

```
Pre-condition:     All Fase A/B work merged (Chrome Brain, Dependabot, Doctor, NSN guard, init parity) ✓
Trigger:           Caio explicitly approves starting (cannot be inferred)
Pre-audit step:    Agent rename (SNPS) — Fase C — MUST happen before dim 3 (Agents) and dim 6 (Squads)
                   to avoid auditing names that will churn
Execution order:   Lower-risk dimensions first (to build confidence), then core, then cross-cutting:
                   → Phase 1: dims 13, 11, 12 (infra — gitflows, plugins, MCP)
                   → Phase 2: dims 1, 8, 9 (user surfaces — features, commands, skills)
                   → Phase 3: dims 2, 10, 16 (process — workflows, tools, token economy)
                   → Phase 4: dims 3, 4, 5, 6, 7 (actors — agents, subagents, workers, squads, clones)
                   → Phase 5: dims 14, 15, 17 (cognition — research, KB, hallucinations)
```

## Non-negotiables

1. **Plan-first discipline** — no dimension executes before its story is Ready.
2. **Story quality gate** — @product-lead validates every dimension story against the 10-point checklist BEFORE execution.
3. **Citation discipline** — every Reality claim carries `file:line`. No exceptions.
4. **Modular execution** — one dimension, one story, one PR. No monolithic audit PR.
5. **Checkpoint per dimension** — @quality-gate approves before the next dimension begins. Failure blocks the chain until fixed.
6. **No new features during audit** — fix-only. New capability work waits until audit clears.

## Out of Scope

- Features discovered during the audit that are missing entirely (create follow-up story, do NOT graft into audit story)
- Refactors (audit identifies; refactors are separate stories)
- Name changes (covered by Fase C rename epic)
- Performance optimization (separate epic if surfaced)

## Definition of Done (Epic)

- [ ] All 17 dimension stories written and validated Ready
- [ ] Execution phases ordered per dependency chain above
- [ ] Every dimension story has a @quality-gate verdict of PASS (or WAIVED with explicit rationale)
- [ ] No unresolved CRITICAL or HIGH findings
- [ ] MEDIUM findings either fixed or logged as post-GA tech debt with severity justification
- [ ] Rename epic (Fase C) executed between audit Phase 3 and Phase 4 (agents / squads) — see ordering above
- [ ] @project-lead sign-off that audit is complete and codebase is GA-ready

## Related

- Pending Execution Plan (pre-GA): `~/.claude/projects/.../memory/project_pending_execution_ga.md`
- SNPS naming convention (feeds Fase C rename): `~/.claude/projects/.../memory/project_apse_naming_convention.md`
- Reset versão 10.x → 1.0.0 (last step): `~/.claude/projects/.../memory/project_versioning_reset_v1.md`

## Change Log

- 2026-04-19 — Epic drafted as plan-first deliverable. Follows explicit Caio directive: "IA não pode alucinar durante a auditoria — plano extremamente detalhado ANTES da execução". Individual dimension stories to be created on explicit Caio go-ahead.
