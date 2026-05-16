# SINAPSE Autonomous Development Engine (ADE) - Guia Completo

> **Versão:** 1.0.0
> **Data:** 2026-01-29
> **Status:** Production Ready ✅

---

## O que é o ADE?

O **SINAPSE Autonomous Development Engine (ADE)** é um sistema de desenvolvimento autônomo que transforma requisitos vagos em código funcional através de pipelines estruturados e agentes especializados.

### Características Principais

- **Spec Pipeline** - Transforma ideias em especificações executáveis
- **Execution Engine** - Executa subtasks com self-critique obrigatório
- **Recovery System** - Recupera de falhas automaticamente
- **QA Evolution** - Review estruturado em 10 fases
- **Memory Layer** - Aprende e documenta padrões

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ADE Architecture                                   │
│                                                                              │
│  User Request ──► Spec Pipeline ──► Execution Engine ──► Working Code       │
│                                            │                                 │
│                                            ▼                                 │
│                                    Recovery System                           │
│                                            │                                 │
│                                            ▼                                 │
│                                    QA Evolution                              │
│                                            │                                 │
│                                            ▼                                 │
│                                    Memory Layer                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Os 7 Epics

### Epic 1: Worktree Manager

**Propósito:** Isolamento de branches via Git worktrees

**Comandos (@devops):**

- `*create-worktree {story}` - Criar worktree isolado
- `*list-worktrees` - Listar worktrees ativos
- `*merge-worktree {story}` - Fazer merge do worktree
- `*cleanup-worktrees` - Remover worktrees antigos

**Documentação:** ADE-EPIC1-HANDOFF.md

---

### Epic 2: Migration V2→V3

**Propósito:** Migração para formato autoClaude V3

**Comandos (@devops):**

- `*inventory-assets` - Inventário de assets V2
- `*analyze-paths` - Analisar dependências
- `*migrate-agent` - Migrar agente individual
- `*migrate-batch` - Migrar todos em batch

**Documentação:** ADE-EPIC2-HANDOFF.md

---

### Epic 3: Spec Pipeline

**Propósito:** Transformar requisitos em specs executáveis

**Fluxo:**

```
User Request → Gather → Assess → Research → Write → Critique → Spec Ready
```

**Comandos por Agente:**

| Agent      | Command                | Fase                   |
| ---------- | ---------------------- | ---------------------- |
| @project-lead        | `*gather-requirements` | Coletar requisitos     |
| @architect | `*assess-complexity`   | Avaliar complexidade   |
| @analyst   | `*research-deps`       | Pesquisar dependências |
| @project-lead        | `*write-spec`          | Escrever spec          |
| @quality-gate        | `*critique-spec`       | Criticar e aprovar     |

**Documentação:** ADE-EPIC3-HANDOFF.md

---

### Epic 4: Execution Engine

**Propósito:** Executar specs em código funcional

**13 Steps do Coder:**

1. Load Context
2. Read Implementation Plan
3. Understand Current Subtask
4. Plan Approach
5. Write Code
   - 5.5 SELF-CRITIQUE (obrigatório)
6. Run Tests
   - 6.5 SELF-CRITIQUE (obrigatório)
7. Fix Issues
8. Run Linter
9. Fix Lint Issues
10. Verify Manually
11. Update Plan Status
12. Commit Changes
13. Signal Completion

**Comandos (@architect):**

- `*create-plan` - Criar plano de implementação
- `*create-context` - Gerar contexto do projeto

**Comandos (@developer):**

- `*execute-subtask` - Executar subtask

**Documentação:** ADE-EPIC4-HANDOFF.md

---

### Epic 5: Recovery System

**Propósito:** Recuperar de falhas em subtasks

**Fluxo:**

```
Subtask Fails → Track Attempt → Retry (<3) → Stuck Detection → Rollback → Escalate
```

**Comandos (@developer):**

- `*track-attempt` - Registrar tentativa
- `*rollback` - Voltar para estado anterior

**Documentação:** ADE-EPIC5-HANDOFF.md

---

### Epic 6: QA Evolution

**Propósito:** Review estruturado em 10 fases

**10 Fases:**

1. Setup & Context Loading
2. Code Quality Analysis
3. Test Coverage Review
4. Security Scan
5. Performance Check
6. Documentation Audit
7. Accessibility Review
8. Integration Points Check
9. Edge Cases & Error Handling
10. Final Summary & Decision

**Comandos (@quality-gate):**

- `*review-build {story}` - Review completo
- `*request-fix {issue}` - Solicitar correção
- `*verify-fix {issue}` - Verificar correção

**Comandos (@developer):**

- `*apply-qa-fix` - Aplicar correção do QA

**Documentação:** ADE-EPIC6-HANDOFF.md

---

### Epic 7: Memory Layer

**Propósito:** Memória persistente de padrões e insights

**Tipos de Memória:**

- **Insights** - Descobertas durante desenvolvimento
- **Patterns** - Padrões de código extraídos
- **Gotchas** - Armadilhas conhecidas
- **Decisions** - Decisões arquiteturais

**Comandos (@developer):**

- `*capture-insights` - Capturar insights da sessão
- `*list-gotchas` - Listar gotchas conhecidas

**Comandos (@architect):**

- `*map-codebase` - Gerar mapa do codebase

**Comandos (@analyst):**

- `*extract-patterns` - Extrair padrões do código

**Documentação:** ADE-EPIC7-HANDOFF.md

---

## Quick Start

### 1. Criar Spec a partir de Requisito

```bash
# Ativar PM e coletar requisitos
@project-lead *gather-requirements

# Avaliar complexidade
@architect *assess-complexity

# Pesquisar dependências
@analyst *research-deps

# Escrever spec
@project-lead *write-spec

# Criticar e aprovar
@quality-gate *critique-spec
```

### 2. Executar Spec Aprovada

```bash
# Criar plano de implementação
@architect *create-plan

# Criar contexto do projeto
@architect *create-context

# Executar subtasks (loop)
@developer *execute-subtask 1.1
@developer *execute-subtask 1.2
...
```

### 3. QA Review

```bash
# Review estruturado
@quality-gate *review-build STORY-42

# Se há issues:
@quality-gate *request-fix "Missing error handling"
@developer *apply-qa-fix
@quality-gate *verify-fix
```

### 4. Capturar Aprendizado

```bash
# Capturar insights da sessão
@developer *capture-insights

# Documentar gotchas
@developer *list-gotchas
```

---

## Estrutura de Arquivos

```
.sinapse-ai/
├── development/
│   ├── agents/              # Definições de agentes V3
│   ├── tasks/               # Tasks executáveis
│   │   ├── spec-*.md        # Spec Pipeline tasks
│   │   ├── plan-*.md        # Execution Engine tasks
│   │   ├── qa-*.md          # QA Evolution tasks
│   │   └── capture-*.md     # Memory Layer tasks
│   └── workflows/
│       ├── spec-pipeline.yaml
│       ├── qa-loop.yaml
│       └── auto-worktree.yaml
│
├── infrastructure/
│   ├── scripts/
│   │   ├── worktree-manager.js     # Epic 1
│   │   ├── asset-inventory.js      # Epic 2
│   │   ├── migrate-agent.js        # Epic 2
│   │   ├── subtask-verifier.js     # Epic 4
│   │   ├── plan-tracker.js         # Epic 4
│   │   ├── recovery-tracker.js     # Epic 5
│   │   ├── rollback-manager.js     # Epic 5
│   │   ├── qa-loop-orchestrator.js # Epic 6
│   │   ├── codebase-mapper.js      # Epic 7
│   │   └── pattern-extractor.js    # Epic 7
│   └── schemas/
│       ├── agent-v3-schema.json
│       └── task-v3-schema.json
│
└── product/
    ├── templates/
    │   ├── spec-tmpl.md
    │   └── qa-report-tmpl.yaml
    └── checklists/
        └── self-critique-checklist.md
```

---

## autoClaude V3 Format

### Agent Definition

```yaml
autoClaude:
  version: '3.0'
  migratedAt: '2026-01-29T02:24:10.724Z'

  specPipeline:
    canGather: boolean # @pm
    canAssess: boolean # @architect
    canResearch: boolean # @analyst
    canWrite: boolean # @pm
    canCritique: boolean # @qa

  execution:
    canCreatePlan: boolean # @architect
    canCreateContext: boolean # @architect
    canExecute: boolean # @dev
    canVerify: boolean # @dev

  recovery:
    canTrackAttempts: boolean # @dev
    canRollback: boolean # @dev

  qa:
    canReview: boolean # @qa
    canRequestFix: boolean # @qa

  memory:
    canCaptureInsights: boolean # @dev
    canExtractPatterns: boolean # @analyst
    canDocumentGotchas: boolean # @dev
```

### Task Definition

```yaml
autoClaude:
  version: '3.0'
  pipelinePhase: spec-gather|spec-assess|exec-plan|exec-subtask|etc
  deterministic: boolean
  elicit: boolean
  composable: boolean

  verification:
    type: none|command|manual
    command: 'npm test'

  selfCritique:
    required: boolean
    checklistRef: 'self-critique-checklist.md'
```

---

## QA Gates

Cada Epic tem um QA Gate que deve passar antes de prosseguir:

```bash
@quality-gate *gate epic-{N}-{name}
```

**Decisões:**

- **PASS** - Próximo epic liberado
- **CONCERNS** - Aprovado com follow-ups
- **FAIL** - Retorna para correções
- **WAIVED** - Bypass autorizado por @po

---

## Troubleshooting

### Subtask Falha Repetidamente

```bash
# Verificar histórico de tentativas
@developer *track-attempt --status

# Rollback para último estado bom
@developer *rollback --hard

# Tentar abordagem diferente
@developer *execute-subtask 2.1 --approach alternative
```

### Spec não Aprovada

```bash
# Ver feedback do critique
cat docs/stories/STORY-42/spec-critique.json

# Refinar spec
@project-lead *write-spec --iterate

# Re-submeter para critique
@quality-gate *critique-spec
```

### Worktree Conflita

```bash
# Listar worktrees
@devops *list-worktrees

# Resolver conflitos
@devops *merge-worktree STORY-42 --resolve

# Cleanup
@devops *cleanup-worktrees
```

---

## Related Documentation

- ADE Architect Handoff - Overview geral
- ADE Agent Changes - Alterações em todos os agentes com matriz de capabilities
- Epic 1 - Worktree Manager
- Epic 2 - Migration V2→V3
- Epic 3 - Spec Pipeline
- Epic 4 - Execution Engine
- Epic 5 - Recovery System
- Epic 6 - QA Evolution
- Epic 7 - Memory Layer

---

_SINAPSE Autonomous Development Engine - Turning Ideas into Code Autonomously_

