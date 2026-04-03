# Epic 9.0: Ecosystem Quality & Standardization

> **Status:** Done
> **Version Target:** v9.0.0
> **Created:** 2026-04-05
> **Owner:** Imperator (sinapse-orqx)
> **Scope:** Quality audit + standardization across ALL 18 squads (89 workflows, 187 KBs, 1,272 tasks)
> **Complexity:** COMPLEX (~6 stories, 3 phases)

---

## Objective

Auditar e padronizar todo o ecossistema SINAPSE (18 squads, 186 agentes) garantindo consistencia de formato, qualidade de conteudo, e ferramentas CLI para quality gates. Toda melhoria DEVE beneficiar todo o ecossistema.

## Constraints

- **Zero breaking changes:** Nenhuma funcionalidade existente pode quebrar
- **Ecosystem-wide:** Toda melhoria atinge TODOS os 18 squads
- **CLI First:** Quality gates via CLI, nao UI
- **Automated:** Scripts de audit devem ser reutilizaveis

---

## Phase 1: Ecosystem Audit (parallel)

### Story 9.1: Squad Workflow Audit & Standardization
- [x] Auditar 89 workflows across 18 squads
- [x] Definir schema padrao para workflows
- [x] Corrigir inconsistencias de formato
- [x] Validar que todos workflows referenciam agents existentes
- [x] Gerar report de auditoria

### Story 9.2: Squad Knowledge Base Quality Audit
- [x] Auditar 187 KB files across 18 squads
- [x] Verificar formato (title, sections, content quality)
- [x] Identificar KBs vazias ou stub
- [x] Padronizar headers e estrutura
- [x] Gerar report de auditoria

### Story 9.3: Squad Task Quality Audit
- [x] Auditar 1,272 tasks across 18 squads
- [x] Verificar frontmatter obrigatorio (task, responsavel, Entrada, Saida)
- [x] Validar que tasks referenciam agents existentes
- [x] Identificar tasks duplicadas ou sobrepostas
- [x] Gerar report de auditoria

---

## Phase 2: Tools & CLI (sequential, depends on Phase 1)

### Story 9.4: Agent Teams Presets Validation
- [x] Validar 5 presets existentes contra entity-registry
- [x] Garantir cobertura de todos agents
- [x] Testar loading de cada preset

### Story 9.5: Quality Gate CLI (sinapse qa)
- [x] Implementar `sinapse qa` command
- [x] Layer 1: lint workflows (YAML schema)
- [x] Layer 2: lint tasks (frontmatter, agent refs)
- [x] Layer 3: lint KBs (structure, completeness)
- [x] Layer 4: cross-reference validation
- [x] Output: JSON + human-readable report

---

## Phase 3: Consolidation

### Story 9.6: Ecosystem Audit Report & Metrics Update
- [x] Consolidar resultados de todas auditorias
- [x] Atualizar entity-registry.yaml com metricas corretas
- [x] Gerar report executivo do ecossistema
- [x] Atualizar README com metricas atualizadas

---

## Phase Summary

| Phase | Stories | Focus | Parallel? |
|-------|---------|-------|-----------|
| 1 | 9.1-9.3 | Audit all squads | Yes (3 parallel) |
| 2 | 9.4-9.5 | Tools & CLI | Sequential |
| 3 | 9.6 | Consolidation | After 1+2 |

**Total: 6 stories | 3 phases | ~2 sprints if parallel**
