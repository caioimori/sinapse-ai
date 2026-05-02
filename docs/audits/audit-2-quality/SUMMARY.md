# Audit 2 — Qualidade (Pre-GA) — SUMMARY

> **Status:** Complete
> **Date:** 2026-05-02
> **Executor:** @architect (Aria)
> **Question:** "Tá bem feito por dentro?"
> **Verdict:** 🟡 Sólido com 3 P0 + 15 P1 antes do GA.

## Verdict per Sub-domain

| # | Sub-domain | Cor | Headline |
|---|---|:---:|---|
| 1 | Test coverage | 🟡 | 35.58% statements; chrome-brain.js (1145 LOC) e sinapse-pro.js a **0%** |
| 2 | Security (OWASP) | 🟡 | 2 vulns transitivas em npm-bundled (HIGH+MOD); código-level limpo |
| 3 | Performance | 🟢 | CLI cold start **45ms** (top decile); tarball 8.6MB / 4053 files |
| 4 | Code smells | 🟡 | 3 duplicações dev/ vs infra/; 7 god files >1500 LOC |
| 5 | Dependencies | 🟢* | `@eslint/js` e `yaml` usados sem declarar; CC-BY licenças sem NOTICE |
| 6 | Lint baseline | 🟢/🟡 | 0 errors, 359 warnings (329 auto-fixable) |
| 7 | Hooks isolation | 🟡 | 14/19 hooks sem teste; fail-mode não centralizado |
| 8 | Constitution enforcement | 🟡 | 3 NON-NEGOTIABLE (VII, VIII, XI) sem gate automatizado |

## Severities

| | P0 | P1 | P2 | P3 | Total |
|---|---:|---:|---:|---:|---:|
| Count | **3** | **15** | **22** | **8** | **48** |

## P0 — Bloqueia GA (3)

| ID | Domínio | Finding |
|---|---|---|
| Q1.2 | Coverage | `packages/sinapse-install/src/capabilities/chrome-brain.js` 1145 LOC, **0% coverage**. Flagship feature totalmente sem teste |
| Q1.3 | Coverage | `packages/sinapse-pro-cli/bin/sinapse-pro.js` 232 LOC, **0% coverage**. Pro CLI entrypoint cego |
| Q5.3 | Deps | `@eslint/js` e `yaml` usados em código mas **não declarados** em `package.json`. Hoisting/transitive — quebra silenciosa possível |

## P1 — Visível antes do GA (15 destaques)

- Q1.1 Coverage statements 35.58% vs target 70%
- Q1.4 `validate-manifest.js` 6.3% (publish gate)
- Q1.6 `sync-counts.js` 0% (Article VII protection)
- Q2.1/Q2.2 picomatch + brace-expansion (transitivas em `node_modules/npm/...` — `overrides` não alcança)
- Q3.6/Q4.5 `bin/cli.js` 1752 LOC — entry deveria ser dispatcher fino
- Q4.1/Q4.2/Q4.3 `template-validator.js`, `test-generator.js`, `code-quality-improver.js` duplicados dev/ ↔ infra/ (~5-6k LOC redundante)
- Q4.4 7 arquivos >1500 LOC violam SRP
- Q7.1 14 de 19 hooks `.claude/hooks/` sem teste
- Q7.2 Fail-mode (open vs closed) não está em registro central
- Q8.1 Article VII (NON-NEGOTIABLE) — gate só prosa, sem automação
- Q8.2 Article VIII (NON-NEGOTIABLE) — depende de auto-disciplina dos agentes
- Q8.3 Article XI (Conservative Default) — só procedural

## Stories — Bloco Fix Audit 2

**Wave A — P0 (3, blocks GA):**
- Q1-A — Smoke tests chrome-brain.js
- Q1-B — Smoke tests sinapse-pro.js
- Q5-A — Declare `@eslint/js` + `yaml` em package.json

**Wave B — P1 críticos (12, antes do GA):**
- Q1-C, Q1-D — Tests validate-manifest.js + sync-counts.js
- Q2-A — Documentar Q2.1/Q2.2 known-issues
- Q3-A/Q4-D — Refactor bin/cli.js (<500 LOC)
- Q4-A/B/C — Consolidar 3 duplicações dev/ vs infra/
- Q7-A — Fail-mode matrix em `.claude/hooks/README.md`
- Q7-B — Smoke tests pros 14 hooks descobertos
- Q8-A — Gate automatizado Article VII
- Q8-B — Detecção automatizada Article VIII
- Q8-C — Operacionalizar Article XI

**Wave C — P2/P3 (12+, pós-GA hardening):** detalhes nos sub-reports.

## Recomendação

**🟢 AVANÇAR para Audit 3 em paralelo ao Bloco Fix Audit 2.**

Justificativa: nenhum P0 é showstopper de **funcionamento** (Audit 1 já cobriu). Os 3 P0 são gaps de teste/declaração de deps, corrigíveis em 1-2 dias. 15 P1 endereçáveis em Waves A→B antes da promoção rc → 1.0.0. Audit 3 (UX/DX) independente — pode rodar em paralelo.

**Pré-requisitos para promover rc.X → 1.0.0:**
1. Wave A completa (3 P0)
2. Wave B críticos: Q5-A, Q8-A/B/C, Q7-A
3. Q2-A documentado (vulns transitivas conhecidas)
4. Recomendado: Q1-C/D, Q3-A

## Sinais positivos

- 45ms cold start = top decile Node CLIs
- 0 lint errors mantido
- 11003 tests passing, 75s wall-clock
- 6 de 12 articles constitucionais com mecanismo automatizado real
- No GPL/AGPL/SSPL na árvore de licenças
- Overrides proativos em 4 transitivas
- Secret-scan robusto com 8 padrões
