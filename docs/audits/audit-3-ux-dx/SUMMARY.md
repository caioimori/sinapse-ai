# Audit 3 — UX/DX (Pre-GA) — SUMMARY

> **Status:** Complete
> **Date:** 2026-05-02
> **Executor:** @architect (Aria)
> **Question:** "Tá pronto pro público entender + querer usar?"
> **Verdict:** 🟡 Sólido em fundação, mas messaging tem 6 P0 antes do GA.

## Verdict per Sub-domain

| # | Sub-domain | Verdict | P0 | P1 | P2 | P3 |
|---|---|:---:|---:|---:|---:|---:|
| 1 | README primeira impressão | 🟡 CONCERNS | 2 | 2 | 2 | 2 |
| 2 | Onboarding wizard UX | 🟢 PASS | 0 | 2 | 3 | 2 |
| 3 | Docs consistency | 🔴 FAIL | 2 | 3 | 3 | 1 |
| 4 | Naming consistency | 🔴 FAIL | 1 | 2 | 1 | 1 |
| 5 | Help text quality | 🟡 CONCERNS | 0 | 3 | 3 | 2 |
| 6 | Error messages | 🟡 CONCERNS | 0 | 3 | 4 | 1 |
| 7 | CHANGELOG quality | 🟢 PASS | 0 | 0 | 2 | 2 |
| 8 | Examples completeness | 🟡 CONCERNS | 0 | 2 | 3 | 2 |
| 9 | First-run experience | 🟡 CONCERNS | 0 | 2 | 4 | 2 |
| 10 | Community files | 🟡 CONCERNS | 1 | 4 | 4 | 2 |
| | **TOTAIS** | | **6** | **23** | **29** | **17** |

**75 findings totais.** 2 sub-domínios FAIL (Docs consistency, Naming consistency), 7 CONCERNS, 2 PASS (Onboarding wizard, CHANGELOG).

## P0 — Bloqueia GA (6, vergonha pública)

| # | Sub | Issue | Onde |
|---|-----|-------|------|
| P0-1 | 1 | README contagens drift (186/18/1425 vs real 200/19/1237) | `README.md:24,26,36,68,86,305,329,487` |
| P0-2 | 1 | Badge testes desatualizado (10729 vs 11003) | `README.md:5` |
| P0-3 | 3 | `getting-started.md` persona table com 8 nomes legacy-upstream legacy | `docs/guides/getting-started.md:117-126` |
| P0-4 | 3 | `agent-reference.md` é AGENTS.md do Codex, não referência de agentes | `docs/guides/agent-reference.md:1` |
| P0-5 | 4 | Org GitHub split-brain SinapseAI vs caioimori (20+ refs) | múltiplos arquivos |
| P0-6 | 10 | `SECURITY.md` lista v7.x como suportado em pré-GA 10.0.0-rc.11 | `SECURITY.md:5-8` |

**Característica comum:** todos defeitos de **honestidade pública**. P0-1, P0-2, P0-6 violam Article VII (Metrics Accuracy — NON-NEGOTIABLE). P0-6 tem implicação real de security disclosure.

## Stories — Bloco Fix Audit 3

**Bloco 3-Fix-A (P0 públicos, 1-2h, sequencial):**
- AUD3-A1 — Reconciliar contagens README ↔ realidade (single source via `npm run sync:counts`)
- AUD3-A2 — Atualizar badge de testes
- AUD3-A3 — Reescrever `getting-started.md` persona table com nomes canônicos
- AUD3-A4 — Renomear `agent-reference.md` → `codex-config.md`; criar verdadeiro `agent-reference.md`
- AUD3-A5 — Decisão Caio: org SinapseAI ou caioimori? Script de rewrite + lint hook
- AUD3-A6 — `SECURITY.md` — atualizar tabela versões (10.x), unificar org com A5

**Bloco 3-Fix-B (P0/P1 community, paralelizável com A):**
- AUD3-B1 — `CODE_OF_CONDUCT.md` — adicionar email privado pra reports
- AUD3-B2 — Apagar `.github/ISSUE_DRAFT_P0_missing_module.md` (jan/2025, personas legacy)
- AUD3-B3 — Limpar `.github/FUNDING.yaml`
- AUD3-B4 — Remover `SINAPSE-FullStack` de error messages, headers, scripts públicos

**Bloco 3-Fix-C (P1 CLI/UX, pode esperar rc.13):**
- AUD3-C1 — Padronizar todas error messages do CLI em PT
- AUD3-C2 — Decidir status `sinapse` vs `sinapse-ai` binary; doc + deprecation
- AUD3-C3 — Fuzzy match em "Unknown command"
- AUD3-C4 — Postinstall — adicionar "Próximo passo"
- AUD3-C5 — `init --help` — listar `--template` flag + EXAMPLES

**Bloco 3-Fix-D (P1 docs):**
- AUD3-D1 — `docs/community/` snippets — atualizar org URLs
- AUD3-D2 — `docs/framework/roadmap.md` — atualizar org URLs
- AUD3-D3 — Criar `docs/examples/quickstart-recording.md` com asciinema
- AUD3-D4 — Criar `docs/guides/cli-errors.md` com tabela de exit codes

**Bloco 3-Fix-E (P2 polish, post-GA OK):** 29 P2 items agrupados em 4-5 stories de affinity. Tracker em `docs/tech-debt.md`.

## Observações estratégicas

1. **Trio constitucional pré-GA:** Audit 1 fechou Article III blockers; Audit 2 fechou Article V; Audit 3 expõe Article VII drift residual.
2. **P0-5 (org split-brain) é decisão de produto.** Caio decide; depois é trivial (sed + lint hook).
3. **Persona naming legacy** em `getting-started.md` é prelude do rename APSE planejado pós-GA. Substituir pelos canônicos atuais agora; APSE rename fica pra v1.x.
4. **CHANGELOG (Sub 7 PASS)** é o template de excelência interno — replicar disciplina em getting-started, SECURITY, agent-reference.
5. **Esforço total Bloco Fix Audit 3:** 1-2 dias focados pra P0+P1.

## Recomendação

**🟡 PAUSAR P0+P1 críticos antes de promover rc → 1.0.0 latest.** P0-5 desbloqueia AUD3-A5/A6/D1/D2.
