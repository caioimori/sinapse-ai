# Epic: GA v1.2.0 — Execução até zero gargalo

**Status:** In Progress
**Owner:** sinapse-orqx (Imperator)
**Created:** 2026-05-04
**Target Release:** sinapse-ai@1.2.0 (latest)

## Contexto

v10.0.0 GA shipped em 2026-05-02. Linha 1.x foi bloqueada no npm (legacy publishes março/2026 ocupam 1.0.0/1.0.1/1.1.0). Decisão: GA simbólico final será **`sinapse-ai@1.2.0`** — primeira versão livre na linha 1.x.

Este epic consolida 6 fases de execução + 3 revisões clínicas iterativas até **zero P0/P1**, antes de promover `1.2.0` pra dist-tag `latest`.

## Fases

### Fase 1 — Execução até 100%

| # | Fase | Status | PR(s) |
|---|---|---|---|
| 1.1 | Infra Hygiene + NPM_TOKEN rotation | ✅ Done | manual ops 2026-05-04 |
| 1.2 | Audit 2 Wave B — refactor `bin/cli.js` (1752 → ~150 LOC) | In Progress | TBD |
| 1.3 | Audit 2 Wave C + Audit 3 Bloco C/D/E (CLI errors PT, fuzzy, postinstall, examples) | Pending | TBD |
| 1.4 | SNPS prefix rename (`sinapse-X` → `snps-X`) com dual-naming alias | Pending | TBD |
| 1.5 | Article gates VII/VIII/XI automated + Trusted Publishing OIDC | Pending | TBD |
| 1.6 | Grounding concreto (vault parser + DS resolver + brand reader) | Pending | TBD |

### Fase 2 — 3 Revisões Clínicas back-to-back

| # | Revisão | Foco | Loop critério |
|---|---|---|---|
| R1 | Funcional + Técnica | Install matrix, CLI flows, agent invocation, hooks runtime, MCP, doctor edge cases | Fix todos P0 |
| R2 | Qualidade + Segurança | Test coverage, lint warnings, security scan, deps audit, secret scan | Fix todos P0 |
| R3 | UX/DX + Docs | Onboarding, error messages, fuzzy-match, README clareza, examples | Fix todos P0 |

**Loop:** Se R3 ainda achar qualquer P0/P1, repete R1→R2→R3. Só publica quando 3 revisões consecutivas retornam **zero P0 e zero P1**.

### Fase 3 — Publicação Oficial

1. rc.final → 7 dias baking
2. Smoke test 5 ambientes (Win+npm/yarn/pnpm, Mac+npm, Linux+pnpm)
3. Bump pra `1.2.0` definitivo
4. Promote `latest` → `1.2.0`
5. Deprecate `1.0.0`/`1.0.1`/`1.1.0` apontando pra `1.2.0`
6. GitHub release + memory entry "GA v1.2.0 pós 3-revisões"

## Acceptance Criteria

- [ ] Fase 1 completa (6 sub-fases)
- [ ] 3 revisões consecutivas com zero P0/P1
- [ ] `sinapse-ai@1.2.0` published em `latest`
- [ ] Legacy 1.x deprecated apontando pra 1.2.0
- [ ] Memory entry "GA v1.2.0 SHIPPED"

## Out of Scope (deferred to v1.3+)

- v11.0 simbólico
- Dim 14/15/17 audit reactivation (post-GA telemetry)
- Mobile/web UI surface

## Dependencies

- npm Trusted Publishing setup (Fase 1.5) — opcional pré-GA, obrigatório pré-v1.3
