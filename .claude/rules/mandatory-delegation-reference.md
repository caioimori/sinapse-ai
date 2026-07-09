---
paths:
  - "squads/**"
  - ".sinapse-ai/development/**"
  - ".claude/commands/**"
  - ".claude/agents/**"
---

# Mandatory Delegation — Operational Reference

> Companion to `mandatory-delegation.md` (the always-on core law). This file carries
> the full matrices and handoff detail and loads when you work on agent/squad files.

## Delegation Matrix

### Framework Agents (Development Workflow)

| Request Type | Delegate To |
|-------------|-------------|
| Code implementation | @developer (Pixel) |
| Story creation | @sprint-lead (Sync) |
| Story validation | @product-lead (Axis) |
| Architecture decisions | @architect (Stratum) |
| Quality/testing | @quality-gate (Litmus) |
| Database work | @data-engineer (Tensor) |
| UX/UI design | @ux-design-expert (Mosaic) |
| Git push/PR/release | @devops (Pipeline) |
| Epic orchestration | @project-lead (Beacon) |
| Research/analysis | @analyst (Scope) |

### Squad Orchestrators (Domain Expertise)

| Request Domain | Delegate To |
|---------------|-------------|
| Branding, identidade visual | @brand-orqx (Meridian) |
| Vendas, CRM, pipeline | @commercial-orqx (Pipeline) |
| Conteudo, editorial | @content-orqx |
| Copywriting, persuasao | @copy-orqx (Quill) |
| Animacoes web, motion | @animations-orqx (Kinetic) |
| UX/UI, design system | @design-orqx (Nexus) |
| Financeiro, pricing | @finance-orqx (Ledger) |
| Growth, SEO, analytics | @growth-orqx (Catalyst) |
| Midia paga, ads | @paidmedia-orqx (Apex) |
| Produto, roadmap | @product-orqx (Vector) |
| Pesquisa, inteligencia | @research-orqx (Prism) |
| Claude Code mastery | @swarm-orqx (Relay) |
| Conselho estrategico | @council-orqx (Zenith) |
| Storytelling, pitch | @storytelling-orqx (Arc) |
| Cybersecurity | @cyber-orqx (Fortress) |
| Clonagem cognitiva | @cloning-orqx (Helix) |
| Cursos, workshops | @courses-orqx (Syllabus) |

## What Orchestrators CAN Do (their actual domain)

Orchestrators have their OWN domain of expertise:

| Orchestrator | Own Domain (can execute directly) |
|-------------|----------------------------------|
| Imperator (sinapse-orqx) | Routing, diagnostico, plano de orquestracao, coordenacao cross-squad, framework governance |
| Squad *-orqx | Routing intra-squad, coordenacao de agentes do squad, handoff management |

Everything OUTSIDE their orchestration domain MUST be delegated.

## Universal Auto-Routing — detail

**On EVERY user message (not just orchestrator):**
1. Detect the domain of the request
2. If a specialist exists → delegate automatically (no confirmation needed)
3. Brief acknowledgment via selo: o bloco do especialista abre com o selo dele (`▌ {emoji} · SNPS · {ÁREA} · {Nome}`) — nunca `@id` técnico em texto user-facing
4. Return the result to the user

**Auto-detect project state on first interaction:**
- Check for `.sinapse-ai/` → SINAPSE-managed (continue SDC)
- Check for `package.json` or `.git` → Brownfield (run quick tech scan first)
- Empty directory → Greenfield (ask project type, scaffold)

**Cross-agent handoff (automatic, never ask user):**
- Agent needs git push → auto-delegate to @devops
- Agent needs tests → auto-delegate to @quality-gate
- Agent needs schema → auto-delegate to @data-engineer
- Agent needs story → auto-create via fast-track or @sprint-lead
- Agent needs architecture decision → auto-delegate to @architect

## Anti-Patterns (FORBIDDEN) — full list

- Orchestrator writing application code
- Orchestrator making architectural decisions without @architect
- Orchestrator creating stories without @sprint-lead
- Orchestrator running quality checks without @quality-gate
- Orchestrator doing database work without @data-engineer
- Orchestrator doing ANY specialist work outside of orchestration
- Saying "vou fazer isso eu mesmo" instead of delegating
- Absorbing a request and executing it instead of routing
