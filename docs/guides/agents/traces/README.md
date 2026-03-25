# SINAPSE Agent Execution Traces - Index

> **Story:** SINAPSE-TRACE-001 | **Traced from source code, not documentation.**

## Overview

This directory contains comprehensive runtime execution trace documentation for all 12 SINAPSE agents. Each document shows **exactly** what files are loaded, in what order, and why - from agent activation through every command execution.

---

## Documents

### Shared Pipeline

| Document | Description |
|----------|-------------|
| [00-shared-activation-pipeline.md](./00-shared-activation-pipeline.md) | Common activation chain used by ALL 12 agents (GreetingBuilder, ContextDetector, GitConfigDetector, ProjectStatusLoader, PermissionMode) |

### Per-Agent Execution Traces

| Agent | Persona | Commands | Activation Path | Trace Document |
|-------|---------|----------|-----------------|----------------|
| @architect | Aria (Visionary) | 21 | Direct | [architect-execution-trace.md](./architect-execution-trace.md) |
| @developer | Dex (Builder) | 36 | Direct | [dev-execution-trace.md](./dev-execution-trace.md) |
| @quality-gate | Quinn (Guardian) | 25 | Direct | [qa-execution-trace.md](./qa-execution-trace.md) |
| @sinapse-orqx | Nova (Orchestrator) | 33 | Direct | [sinapse-orqx-execution-trace.md](./sinapse-orqx-execution-trace.md) |
| @devops | Gage (Pipeline) | 30 | CLI Wrapper | [devops-execution-trace.md](./devops-execution-trace.md) |
| @data-engineer | Dara (Architect) | 27 | CLI Wrapper | [data-engineer-execution-trace.md](./data-engineer-execution-trace.md) |
| @ux-design-expert | Uma (Harmonizer) | 24 | CLI Wrapper | [ux-design-expert-execution-trace.md](./ux-design-expert-execution-trace.md) |
| @product-lead | Pax (Balancer) | 17 | Direct | [po-execution-trace.md](./po-execution-trace.md) |
| @project-lead | Morgan (Strategist) | 13 | Direct | [pm-execution-trace.md](./pm-execution-trace.md) |
| @sprint-lead | River (Flow) | 6 | Direct | [sm-execution-trace.md](./sm-execution-trace.md) |
| @analyst | Alex (Explorer) | 14 | Direct | [analyst-execution-trace.md](./analyst-execution-trace.md) |
| @squad-creator | Forge (Creator) | 13 | Direct | [squad-creation-execution-trace.md](./squad-creation-execution-trace.md) |

---

## Two Activation Paths

```mermaid
graph LR
    subgraph "Direct Invocation (9 agents)"
        A1[@architect] --> GB[GreetingBuilder.buildGreeting]
        A2[@dev] --> GB
        A3[@qa] --> GB
        A4[@sinapse-orqx] --> GB
        A5[@po] --> GB
        A6[@pm] --> GB
        A7[@sm] --> GB
        A8[@analyst] --> GB
        A9[@squad-creator] --> GB
    end

    subgraph "CLI Wrapper (3 agents)"
        B1[@devops] --> GG[generate-greeting.js]
        B2[@data-engineer] --> GG
        B3[@ux-design-expert] --> GG
        GG --> GB
    end

    GB --> OUT[Formatted Greeting]
```

**Direct invocation:** Agent `.md` STEP 3 calls `GreetingBuilder.buildGreeting()` directly.
**CLI wrapper:** `generate-greeting.js` orchestrates context loading via `Promise.all()`, then calls `GreetingBuilder.buildGreeting()`.

---

## Cross-Agent Interaction Map

```mermaid
graph TD
    subgraph "Orchestration Layer"
        MASTER[@sinapse-orqx<br/>Nova]
    end

    subgraph "Management Layer"
        PM[@pm<br/>Morgan]
        PO[@po<br/>Pax]
        SM[@sm<br/>River]
    end

    subgraph "Execution Layer"
        DEV[@dev<br/>Dex]
        QA[@qa<br/>Quinn]
        ARCH[@architect<br/>Aria]
        DEVOPS[@devops<br/>Gage]
    end

    subgraph "Specialist Layer"
        DE[@data-engineer<br/>Dara]
        UX[@ux-design-expert<br/>Uma]
        ANALYST[@analyst<br/>Alex]
        SQUAD[@squad-creator<br/>Forge]
    end

    %% Orchestration flows
    MASTER -->|"delegates epic creation"| PM
    MASTER -->|"delegates story creation"| SM
    MASTER -->|"delegates brainstorming"| ANALYST
    MASTER -->|"delegates test suites"| QA
    MASTER -->|"delegates AI prompts"| ARCH
    MASTER -->|"delegates git push"| DEVOPS
    MASTER -->|"executes any task"| DEV

    %% Management flows
    PM -->|"creates epics"| PO
    PM -->|"strategic direction"| PO
    SM -->|"drafts stories"| PO
    PO -->|"validates stories"| SM
    PO -->|"backlog prioritization"| SM

    %% Development workflow
    PO -->|"approved story"| DEV
    DEV -->|"implementation done"| QA
    QA -->|"tests pass"| DEVOPS
    DEVOPS -->|"pushed to remote"| MASTER

    %% Specialist delegations
    ARCH -->|"architecture decisions"| DEV
    DE -->|"schema/migrations"| DEV
    UX -->|"design specs"| DEV
    ANALYST -->|"research findings"| PM
    SQUAD -->|"creates squads"| MASTER

    %% Escalation paths
    DEV -.->|"escalate"| MASTER
    QA -.->|"quality gate fail"| PO
    PO -.->|"course correction"| MASTER
```

---

## Agent Config Priority & Performance

| Agent | Priority | Config Sections | Files Loaded | Perf Target |
|-------|----------|-----------------|--------------|-------------|
| @sinapse-orqx | Critical | dataLocation, registry | sinapse-kb.md (lazy) | <30ms |
| @developer | High | devLoadAlwaysFiles, devStoryLocation, dataLocation | coding-standards.md, tech-stack.md, source-tree.md, technical-preferences.md | <50ms |
| @quality-gate | High | qaLocation, dataLocation, storyBacklog | technical-preferences.md, test-levels-framework.md, test-priorities-matrix.md | <50ms |
| @devops | High | dataLocation, cicdLocation | technical-preferences.md | <50ms |
| @architect | Medium | architecture, dataLocation, templatesLocation | technical-preferences.md | <75ms |
| @product-lead | Medium | devStoryLocation, prd, storyBacklog, templatesLocation | elicitation-methods.md | <75ms |
| @sprint-lead | Medium | devStoryLocation, storyBacklog, dataLocation | mode-selection-best-practices.md, workflow-patterns.yaml | <75ms |
| @data-engineer | Medium | dataLocation, etlLocation | technical-preferences.md | <75ms |
| @project-lead | Low | devStoryLocation, storyBacklog | (none) | <100ms |
| @analyst | Low | dataLocation, analyticsLocation | brainstorming-techniques.md | <100ms |
| @ux-design-expert | Low | dataLocation, uxLocation | (none) | <100ms |
| @squad-creator | Default | dataLocation | (none) | <150ms |

Source: `.sinapse-ai/data/agent-config-requirements.yaml`

---

## Scale

| Metric | Count |
|--------|-------|
| Agents traced | 12 |
| Total commands across all agents | ~246 |
| Unique task files referenced | ~160 |
| Templates referenced | 44 |
| Checklists referenced | 16 |
| Infrastructure scripts referenced | ~27 |
| Documents produced | 14 (1 shared + 12 agent + 1 index) |

---

## Per-Document Structure

Each agent trace document follows this structure:

```
1. Activation Trace
   1.1 Files Loaded (in order)
   1.2 Greeting Construction (Mermaid sequence diagram)
   1.3 Agent-Specific Config
   1.4 Context Brought to Session

2. Command Registry (table: command -> task -> visibility)

3. Per-Command Execution Traces
   - Task file loaded
   - Dependencies (templates, checklists, scripts, data)
   - Execution flow (Mermaid flowchart)
   - Expected output

4. Complete Dependency Graph (Mermaid)

5. Cross-Agent Interactions

6. Missing Dependencies
```

---

## Key Source Files

| File | Purpose | Lines |
|------|---------|-------|
| `.sinapse-ai/development/scripts/greeting-builder.js` | Main activation pipeline | 949 |
| `.sinapse-ai/development/scripts/agent-config-loader.js` | Config loading per agent | ~400 |
| `.sinapse-ai/development/scripts/generate-greeting.js` | CLI wrapper (3 agents) | 173 |
| `.sinapse-ai/core/session/context-detector.js` | Session type detection | ~100 |
| `.sinapse-ai/infrastructure/scripts/project-status-loader.js` | Git/project status | ~524 |
| `.sinapse-ai/infrastructure/scripts/git-config-detector.js` | Git config detection | ~294 |
| `.sinapse-ai/development/scripts/greeting-preference-manager.js` | Greeting level preference | ~146 |
| `.sinapse-ai/development/scripts/workflow-navigator.js` | Workflow suggestions | ~200 |
| `.sinapse-ai/core/permissions/index.js` | Permission mode badge | ~100 |
| `.sinapse-ai/data/agent-config-requirements.yaml` | Per-agent config requirements | 369 |

---

## Common Findings Across Traces

### Path Mismatch Pattern

Multiple agents reference dependencies using `development/{templates,checklists}/` paths, but the actual files reside in `product/{templates,checklists}/`. This affects:

| Agent | Affected Dependencies |
|-------|-----------------------|
| @quality-gate | Templates in `product/templates/` |
| @devops | github-actions-ci.yml, github-actions-cd.yml, github-pr-template.md, changelog-template.md, pre-push-checklist.md, release-checklist.md |
| @ux-design-expert | 9 templates, 4 checklists, 7 data files all in `product/` |
| @product-lead | story-tmpl.yaml, po-master-checklist.md, change-checklist.md |
| @project-lead | prd-tmpl.yaml, brownfield-prd-tmpl.yaml, pm-checklist.md, change-checklist.md |
| @sprint-lead | story-draft-checklist.md in `product/checklists/` |
| @analyst | 4 templates in `product/templates/` |

**Resolution:** The `AgentConfigLoader` resolves dependencies by searching multiple paths: `development/`, `product/`, and root `.sinapse-ai/` directories. The path mismatch does not cause runtime failures but is documented for accuracy.

### Missing Dependencies

Each trace documents files referenced but not found on disk:

| Agent | Missing File | Impact |
|-------|--------------|--------|
| @developer | 9 scripts (recovery-tracker.js, stuck-detector.js, etc.), 1 checklist | Non-functional commands |
| @sinapse-orqx | add-tech-doc.md | `*add-tech-doc` command non-functional |
| @ux-design-expert | integrate-Squad.md | Only `integrate-squad.md` exists |
| @devops | gitignore-manager, version-tracker | Referenced tools not found |

---

## Tracing Method

All traces were created by reading actual source code, **NOT** from documentation:

1. **Activation trace**: Read `greeting-builder.js` (949 lines) and traced execution path for each agent's specific config
2. **Config loading trace**: Read `agent-config-loader.js` and traced per-agent requirements from `agent-config-requirements.yaml`
3. **Command traces**: For each command, read the task `.md` file, then recursively traced all template/checklist/script references
4. **File verification**: Every referenced file path was checked for existence on disk using `Glob`

---

*Traced from source on 2026-02-05 | Story SINAPSE-TRACE-001*
