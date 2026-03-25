---
task: compose-multi-squad-plan
responsavel: "@sinapse-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: initiative
    tipo: string
    origem: "user input ou strategic-brief"
    obrigatorio: true

Saida:
  - campo: execution_plan
    tipo: document
    destino: "coordinate-cross-squad task"

Checklist:
  - "[ ] Objetivo decomposto em work packages"
  - "[ ] Squads atribuidas a cada package"
  - "[ ] Sequencia definida (paralelo/serial)"
  - "[ ] Handoffs entre fases especificados"
  - "[ ] Lead squad designada"
---

# Task: Compose Multi-Squad Execution Plan

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-orqx)
- **Complexity:** Advanced

## Objetivo
Desenhar um plano de execucao detalhado para iniciativas que exigem 2+ squads trabalhando coordenadamente. O plano define work packages, atribuicoes, sequencia, handoffs e metricas de sucesso.

## Entrada
- Initiative description (o que o usuario quer alcançar)
- Strategic brief (se ja existe, do task `strategic-brief`)
- Constraints (timeline, budget, prioridades)
- Current assets (o que ja existe)

## Passos

### 1. Initiative Decomposition

Quebrar a iniciativa em work packages independentes:

```
INITIATIVE DECOMPOSITION
========================
Initiative: {nome}
Objective: {objetivo final}

WORK PACKAGES:
WP-1: {nome}
  Domain: {dominio}
  Squad: squad-{x}
  Orchestrator: {name} ({codename})
  Invocation: /{prefix}:agents:{orchestrator-id}
  Deliverables: {lista}
  Estimated Effort: {Small/Medium/Large}

WP-2: {nome}
  Domain: {dominio}
  Squad: squad-{y}
  Orchestrator: {name} ({codename})
  Invocation: /{prefix}:agents:{orchestrator-id}
  Deliverables: {lista}
  Estimated Effort: {Small/Medium/Large}
  Depends On: WP-1

WP-N: ...
```

### 2. Dependency Graph

Mapear dependencias entre work packages:

```
DEPENDENCY GRAPH:

WP-1 (brand-system) ──→ WP-3 (digital-experience)
         │                        │
         └──→ WP-2 (copywriting) ─┘──→ WP-5 (growth-analytics)
                                       │
WP-4 (content) ──────────────────────→─┘

Legend: ──→ = "must complete before"
Parallel: WP-1 and WP-4 can run simultaneously
Serial: WP-3 waits for WP-1 + WP-2
```

### 3. Phase Design

Agrupar WPs em fases executaveis:

```
EXECUTION PHASES:

PHASE 1 — FOUNDATION
  Timeline: {estimado}
  Parallel Execution:
    - WP-1: squad-brand / Meridian
      → /brand:agents:brand-orqx
    - WP-4: squad-content / content-orqx
      → /content:agents:content-orqx
  Gate: Both WPs complete → proceed to Phase 2

PHASE 2 — BUILD
  Timeline: {estimado}
  Parallel Execution:
    - WP-2: squad-copy / Quill
      → /copywriting:agents:copy-strategist
      Inputs from: WP-1 (brand voice, tone)
    - WP-3: squad-design / Nexus
      → /digital-experience:agents:design-orqx
      Inputs from: WP-1 (design tokens, visual identity)
  Gate: Both WPs complete → proceed to Phase 3

PHASE 3 — LAUNCH
  Timeline: {estimado}
  Sequential:
    - WP-5: squad-growth / Catalyst
      → /growth:agents:growth-orqx
      Inputs from: WP-2 (content), WP-3 (pages), WP-4 (editorial)
  Gate: Launch metrics defined → GO

LEAD SQUAD FOR SYNTHESIS: squad-{x} / {orchestrator}
```

### 4. Handoff Specifications

Para cada transicao entre fases:

| From WP | To WP | Handoff Content | Format |
|---------|-------|----------------|--------|
| WP-1 | WP-2 | Brand voice, tone of voice, DO/DON'Ts | Markdown doc |
| WP-1 | WP-3 | Design tokens, color palette, typography | JSON tokens + guidelines |
| WP-2 | WP-5 | Web copy, meta descriptions, CTAs | Markdown docs |
| WP-3 | WP-5 | Page templates, sitemap, technical specs | Figma + HTML |

### 5. Risk & Contingency

| Risk | Impact | Contingency |
|------|--------|------------|
| WP-1 delays → all downstream blocks | High | Start WP-4 early (independent) |
| Quality rejection at gate | Medium | 1 revision cycle built into timeline |
| Squad unavailable | Low | Imperator handles directly or substitutes |

### 6. Success Criteria

| Phase | Success Criteria | Measured By |
|-------|-----------------|-------------|
| Phase 1 | Brand foundation approved | brand-system quality gate |
| Phase 2 | Copy + Design aligned with brand | cross-review between squads |
| Phase 3 | Launch metrics on track | growth-analytics dashboard |
| Overall | {business KPI} | {measurement method} |

## Saida
- Multi-squad execution plan document
- Dependency graph
- Phase-by-phase breakdown with invocation commands
- Handoff specifications
- Risk contingency table
- Success criteria

## Validacao
- [ ] Todos os work packages tem squad e orchestrator atribuidos
- [ ] Dependencias entre WPs estao mapeadas
- [ ] Fases respeitam dependencias (nada executa antes do que depende)
- [ ] Handoffs entre fases tem conteudo e formato especificados
- [ ] Lead squad para sintese final designada
- [ ] Invocation commands corretos para cada squad
- [ ] Riscos identificados com contingencias
