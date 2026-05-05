# Health Check Audit — 2026-05-04

> Auditoria pontual pós-v1.2.1 (GA). Foco: identificar gargalos atuais.
> Escopo: 5 dimensões (CI/CD, code health, promise vs delivery, backlog drift, co-maintainer flow).
> Método: análise read-only, sem fixes aplicados. Recomendações no final.

## Sumário executivo

**Status geral: SAUDÁVEL** com 1 ação **CRITICAL** (PR #42 abandonado).

Framework operacional, CI estável, governança nova válida. Principal risco é ruído visual (PR antigo + stories Draft acumuladas + branches stale) e 2 vulnerabilidades npm conhecidas mas não tratadas.

| Severidade | Quantidade |
|---|---|
| CRITICAL | 1 |
| HIGH | 3 |
| MEDIUM | 4 |
| LOW | 3 |

---

## Dimensão 1 — Pipeline CI/CD

**Estado**: estável. 6/7 runs success em CI, 7/7 em Manifest Parity, CodeQL, PR Size Check.

**Gargalos**:

| ID | Sev | Achado | Evidência |
|---|---|---|---|
| CI-1 | HIGH | **Article XI gate friction recorrente em chore/cleanup PRs**. Exige `Article XI override: <razão>` em commit msg OU PR body, mas script lê env var via workflow trigger — rerun não pega edit do PR body. Hoje gastei 2 reruns por causa disso (PR #147). | `scripts/validate-article-xi.js` linha 116. Run 25351658310. |
| CI-2 | MEDIUM | **CI overkill em versões de Node**. Jest + Benchmark rodam em 4 versões (18/20/22/24). Node 18 chega EOL abr/2025. Multiplica jobs ×4 sem ganho real. | `.github/workflows/ci.yml` matrix |
| CI-3 | LOW | **Flakes em `doctor-exception-classification.test.js` em Node 24**. Não-determinístico — passou no run anterior, falhou após empty commit, passou no rerun. | Run 25351658310 |

**Métricas brutas**:
- 40+ jobs por PR
- Tempo médio total: ~5-7 min (CI completo)
- Workflows ativos: 18

---

## Dimensão 2 — Code health

**Estado**: 2 vulnerabilidades npm conhecidas. Sem regressões estruturais.

**Gargalos**:

| ID | Sev | Achado | Evidência |
|---|---|---|---|
| CODE-1 | HIGH | **2 vulnerabilidades npm**: 1 HIGH (`brace-expansion`) + 1 MODERATE (`picomatch`). Story 10.34 existe mas continua em Draft. | `npm audit` 2026-05-04 |
| CODE-2 | MEDIUM | **52 scripts no `package.json`** — provável duplicação ou cruft. Mantém complexidade alta. | `package.json` |
| CODE-3 | LOW | **TODO/FIXME em 20+ arquivos do core** (cli, hooks, scripts). Débito controlado, não-bloqueante. | `grep TODO\|FIXME --include="*.js"` |

**Métricas**:
- 24 prod deps + 16 dev deps (saudável, framework slim)
- Bundle: NÃO MEDIDO (out of scope)
- TypeScript: ✅ pass

---

## Dimensão 3 — Promise vs Delivery

**Estado**: alinhado em geral. 1 ambiguidade no claim "1.237 tasks".

| Claim README | Real | Status |
|---|---|---|
| **"200 agentes"** | 22 core + 188 squad = **210** | ✅ Conservador (real é maior) |
| **"19 squads"** | 19 dirs em `squads/` | ✅ Bate |
| **"1.237 tasks executáveis"** | 213 core + 1.237 squad = **1.450** | ⚠️ **AMBÍGUO** |
| **"19 hooks ativos"** | 20 arquivos (.cjs/.py/.sh em `.claude/hooks/`) | ⚠️ Aproximação. Verificar quantos estão registered em `settings.json` vs dormant |
| **"Constitution com 10 artigos, 6 NON-NEGOTIABLE"** | NÃO VERIFICADO neste audit | ⏭️ Validar em audit futuro |

**Gargalos**:

| ID | Sev | Achado | Evidência |
|---|---|---|---|
| PROM-1 | HIGH | **Claim "1.237 tasks" ambíguo** — leitor entende como total. Se conta core (213) + squad (1237) = 1.450. Ou (a) atualizar pra "1.450 tasks (213 core + 1.237 nas squads)" ou (b) confirmar que 1237 é só squad e clarificar. | README linhas 26 e 175 |
| PROM-2 | MEDIUM | **"19 hooks ativos" não auditado**. Existem 20 arquivos no diretório, mas "ativos" implica registered em `settings.json`. Pode haver hooks dormants. | `.claude/hooks/` + `settings.json` |

---

## Dimensão 4 — Backlog drift

**Estado**: ruído visual significativo. Stories acumuladas + PR antigo + branches stale.

**Gargalos**:

| ID | Sev | Achado | Evidência |
|---|---|---|---|
| BL-1 | **CRITICAL** | **PR #42 abandonado há ~22 dias** ("refactor(cli): reduce top-level surface to 4 canonical commands"). Tem **13 labels** (scope creep evidente). Decidir: mergear, fechar, ou rebase. | `gh pr list` |
| BL-2 | MEDIUM | **12 stories em Draft acumuladas** (em `docs/stories/`). Revisar se ainda fazem sentido ou arquivar. | `grep "Status: Draft" docs/stories/*.md` |
| BL-3 | MEDIUM | **~15 branches remotas stale** (3+ dias). Várias de releases/audits passados (audit-1, audit-2, ga-1.2.0/*). Provavelmente já mergeadas mas não deletadas. | `git branch -r --sort=-committerdate` |
| BL-4 | LOW | **0 issues abertas** no GitHub. Esperado pra projeto novo, mas indica feedback público inexistente até agora. | `gh issue list` |

**Distribuição de stories** (62 total):
- Done: 13
- Ready: 8 + 4 = 12
- InReview: 3 + 4 = 7
- InProgress: 2
- Draft: 12
- Planned/exception: 2-4

---

## Dimensão 5 — Co-maintainer flow (validação pós-PR #148)

**Estado**: config aplicada e válida. Falta validar em PR real do Soier.

| Check | Status |
|---|---|
| Required reviews em main | ✅ 0 (era 1) |
| Code owner gating | ✅ desabilitado |
| Status check `Validation Summary` obrigatório | ✅ ativo |
| Force push em main | ✅ bloqueado |
| Deletions em main | ✅ bloqueada |
| Auto-merge habilitado | ✅ ativo |
| Delete branch on merge | ✅ ativo |
| CODEOWNERS — ambos co-maintainers | ✅ aplicado |
| Soier permission level | `write` (push/triage) — `maintain` não existe pra repos pessoais GitHub |

**Gargalos**:

| ID | Sev | Achado |
|---|---|---|
| COLLAB-1 | LOW | **Não validado em produção**. Nenhum PR do Soier passou pelo novo fluxo ainda. Próxima ação dele = teste real. |

---

## Recomendações priorizadas

### CRITICAL (fazer já)

1. **Decidir PR #42**. Opções:
   - (a) Rebase + revisar + mergear — se ainda relevante
   - (b) Fechar — se foi superado por GA-1.2/1.3
   - (c) Converter em draft + mover stories pra v1.3

### HIGH (fazer essa semana)

2. **Story 10.34 — fix vulns npm** (`brace-expansion` + `picomatch`). Já em Draft, promover pra Ready e executar.

3. **Clarificar claim "1.237 tasks" no README**. Trocar por "**1.450 tasks** (213 core + 1.237 nas squads)" ou similar.

4. **Article XI gate UX**. 2 opções:
   - (a) PR template auto-injeta linha "Article XI override: <razão se aplicável>" pra eliminar friction
   - (b) Workflow re-lê PR body em rerun (precisa mudança no script)

### MEDIUM (próximo ciclo)

5. **Reduzir matriz Node** no CI: rodar full em 20 (LTS) + 22 (LTS atual), smoke em 18 + 24. Economiza ~30% jobs.

6. **Auditar 12 stories em Draft** — fechar as obsoletas, promover as ativas.

7. **Cleanup branches remotas stale** — `gh api` + delete em massa após confirmar mergeadas.

8. **Auditar `package.json` 52 scripts** — consolidar duplicações.

### LOW (oportunístico)

9. Validar "19 hooks ativos" cruzando `.claude/hooks/` ↔ `settings.json`.

10. Resolver TODOs/FIXMEs em paths críticos (cli, hooks, scripts).

11. Promover canal de feedback público (issues + discussions) — atual é silêncio.

---

## Próximo audit recomendado

**Após v1.3.0** — incluir dimensões adicionais:
- Performance (install time benchmarks)
- Bundle size por módulo
- Constitution compliance (10 artigos × evidência real)
- Test coverage gaps
- Release process audit (OIDC, dist-tags, rollback)

---

*Audit conduzido por @snps-orqx · método: análise estática + queries gh/git/npm · zero fixes aplicados*
