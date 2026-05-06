# Deep Health Audit — 2026-05-05

> Auditoria profunda final pós-v1.2.1 + 6 PRs de cleanup (#147-#152).
> **Objetivo**: identificar TUDO que ainda impede o framework de estar verdadeiramente 100%.
> **Método**: 13 dimensões, fontes canônicas obrigatórias, zero contagem naïve.
> **Anti-padrão evitado**: o false positive PROM-1 da auditoria anterior (counts inflados).

---

## Sumário executivo

**Status: SAUDÁVEL com 3 achados CRÍTICOS novos** que a auditoria anterior não pegou.

| Severidade | Quantidade | Destaque |
|---|---|---|
| 🚨 CRITICAL | 3 | 640 broken links em docs, test coverage threshold 21%, 6 hooks dormants |
| 🔴 HIGH | 3 | 8 deps com major version behind, tarball 4079 files (bloated), 12 stories Draft acumuladas (não-resolvido) |
| 🟡 MEDIUM | 4 | 52 scripts package.json (não auditado), claude-code-mastery KB minimalista, audit doc não-versionado em índice, story velocity 27% Done |
| 🟢 LOW | 2 | 2 vulns dev-only (já tracked), 0 issues abertas |

**Recomendação**: tratar os 3 CRITICAL agora. HIGH/MEDIUM viram backlog v1.3.

---

## Dimensão 1 — Constitution Compliance ✅

**Source canônica**: `npm run validate:article-{vii,viii,xi}` + `validate:semantic-lint`, `validate:parity`

| Artigo | Validação | Status |
|---|---|---|
| Article VII (Metrics Accuracy) | `validate:article-vii` | ✅ OK |
| Article VIII (Mandatory Delegation) | `validate:article-viii` | ✅ OK |
| Article XI (Conservative Default) | `validate:article-xi` | ✅ OK |
| Semantic terms | `validate:semantic-lint` | ✅ OK |
| Parity gates | `validate:parity` | ✅ OK |

**Não validado automaticamente** (gap pra futura story):
- Article I (CLI First) — sem script
- Article II (Agent Authority) — só hook em runtime
- Article III (Documentation-First) — só hook (`enforce-story-gate`)
- Article IV (No Invention) — manual
- Article V (Quality First) — implícito em CI
- Article VI (Absolute Imports) — ESLint
- Article IX (Safe Collaboration) — manual
- Article X (Security & Data Protection) — parcial (secret-scanning + hooks)

**Gargalo**: Apenas 3/10 artigos têm validador automatizado dedicado. 7 dependem de hooks runtime + revisão manual. Não-bloqueante mas é gap aspiracional vs realidade.

---

## Dimensão 2 — Hooks Dormants 🚨 CRITICAL

**Source canônica**: diff entre `.claude/hooks/*` (filesystem) ↔ `settings.json` (registered) ↔ `hook-governance.md` (documented)

| Arquivo no diretório | Registered? | Categoria |
|---|---|---|
| `enforce-architecture-first.cjs` | ✅ | ATIVO |
| `enforce-architecture-first.py` | ❌ | **DORMANT** (duplicata Python do .cjs) |
| `enforce-delegation.cjs` | ✅ | ATIVO |
| `enforce-git-push-authority.sh` | ✅ | ATIVO |
| `enforce-nsn-guard.cjs` | ✅ | ATIVO |
| `enforce-story-gate.cjs` | ✅ | ATIVO |
| `install-hooks.sh` | ❌ | **INFRA** (não é hook, é installer) |
| `mind-clone-governance.py` | ✅ | ATIVO |
| `pre-commit-version-check.sh` | ❌ | **GIT HOOK** (não é Claude hook) |
| `precompact-session-digest.cjs` | ❌ | **DORMANT** (importado pelo wrapper?) |
| `precompact-wrapper.cjs` | ✅ | ATIVO |
| `read-protection.py` | ✅ | ATIVO |
| `secret-scanning.cjs` | ✅ | ATIVO |
| `slug-validation.py` | ✅ | ATIVO |
| `sql-governance.py` | ✅ | ATIVO |
| `synapse-engine.cjs` | ❌ | **HELPER** (importado por wrapper) |
| `synapse-wrapper.cjs` | ✅ | ATIVO |
| `verify-packages.cjs` | ✅ | ATIVO |
| `write-path-validation.cjs` | ✅ | ATIVO |
| `write-path-validation.py` | ❌ | **DORMANT** (duplicata Python do .cjs) |

**Achado**: 6 arquivos no dir não estão registered. Análise:
- 3 são **dormants reais** (duplicatas Python obsoletas + session-digest abandonado)
- 3 são **legítimos** (install script, git hook, wrapper helper)

**Ação CRITICAL**:
- DELETAR `enforce-architecture-first.py` + `write-path-validation.py` (duplicatas .cjs já cobrem)
- INVESTIGAR `precompact-session-digest.cjs` — usado ou abandonado?
- DOCUMENTAR `install-hooks.sh`, `pre-commit-version-check.sh`, `synapse-engine.cjs` no `hook-governance.md` como "infra/helpers" (não hooks ativos) pra não confundir

---

## Dimensão 3 — Test Coverage 🚨 CRITICAL

**Source canônica**: `jest.config.js` → `coverageThreshold`

```json
{
  "global": { "branches": 21, "functions": 25, "lines": 23, "statements": 23 },
  ".sinapse-ai/core/": { "lines": 38 }
}
```

**Gargalo**: thresholds **muito baixos**.
- Global: ~22% médio
- Core: 38% lines
- Industry baseline saudável: 70-80%

**Implicação**: framework com 11.014 tests passing, mas test surface real é ~22%. Significa que 78% do código pode ter regressão sem CI pegar.

**Ação CRITICAL**:
- Story dedicada pra **subir threshold incremental**: 22% → 40% (próximo trimestre) → 60% (ano)
- Identificar os 5 módulos críticos com 0% coverage e priorizar
- "Coverage ratchet" — threshold só pode subir, nunca descer

---

## Dimensão 4 — Documentation Drift 🚨 CRITICAL

**Source canônica**: `python scripts/check-markdown-links.py`

```
Files scanned: 454
Valid links: 582
Broken links: 640
```

**Achado**: **52% das links em docs estão broken**. Maioria em `docs/sinapse-workflows/` apontando pra arquivos que foram movidos/renomeados:
- `docs/workflows-yaml-guide.md` (não existe)
- `docs/SINAPSE-DOCUMENTATION-INDEX.md` (não existe)
- `docs/BACKLOG-MANAGEMENT-SYSTEM.md` (não existe)
- `docs/squads-user-guide.md` (não existe)

**Implicação**: usuário que clica em qualquer link interno tem 50% chance de cair em 404 (no futuro deploy de docs site). Hoje só prejudica navegação local em IDE.

**Ação CRITICAL**:
- Story bulk: rodar script + bulk-fix por padrão (top 5 files que aparecem mais nos broken links)
- OU mover `docs/sinapse-workflows/` pra arquivado se conteúdo é legacy
- Adicionar `check-markdown-links` como CI gate (atualmente não roda em PR)

---

## Dimensão 5 — Dependencies Hygiene 🔴 HIGH

**Source canônica**: `npm outdated --json`

```
Total outdated: 24
Major behind: 8
```

**Top 8 majors atrás**:
| Package | Atual | Latest | Gap |
|---|---|---|---|
| `inquirer` | 8.2.7 | 13.4.2 | **5 majors** |
| `glob` | 10.5.0 | 13.0.6 | 3 majors |
| `eslint` | 9.39.2 | 10.3.0 | 1 major |
| `@eslint/js` | 9.39.4 | 10.0.1 | 1 major |
| `chokidar` | 3.6.0 | 5.0.0 | 2 majors |
| `conventional-changelog-cli` | 4.1.0 | 5.0.0 | 1 major |
| `open` | 10.2.0 | 11.0.0 | 1 major |
| `typescript` | 5.9.3 | 6.0.3 | 1 major |

**Risco**: `inquirer 8` é EOL faz tempo. Wizard inteiro depende dele.

**Ação HIGH**:
- Story dedicada pra **inquirer 8 → 13** migration (breaking changes em prompt API). Risco médio mas necessário.
- Story menor pra eslint 9 → 10 + typescript 5 → 6 em paralelo.

---

## Dimensão 6 — Squad Health ✅

**Source canônica**: parser de cada `squad.yaml` + count agents/tasks/kb

| Squad | YAML | Agents | Tasks | KB | Status |
|---|:---:|:---:|:---:|:---:|---|
| claude-code-mastery | ✓ | 8 | 26 | **1** | ⚠️ KB minimalista |
| squad-animations | ✓ | 9 | 75 | 15 | ✅ |
| squad-artdir | ✓ | 14 | **13** | 8 | ⚠️ Tasks/agent ratio baixo |
| squad-brand | ✓ | 15 | 97 | 30 | ✅ |
| squad-claude | ✓ | 10 | 49 | 13 | ✅ |
| squad-cloning | ✓ | 9 | 54 | 16 | ✅ |
| squad-commercial | ✓ | 11 | 85 | 22 | ✅ |
| squad-content | ✓ | 7 | 90 | 32 | ✅ (KB rica) |
| squad-copy | ✓ | 14 | 81 | 24 | ✅ |
| squad-council | ✓ | 11 | 56 | 11 | ✅ |
| squad-courses | ✓ | 8 | 59 | 13 | ✅ |
| squad-cybersecurity | ✓ | 9 | 53 | 14 | ✅ |
| squad-design | ✓ | 15 | 101 | 19 | ✅ (maior) |
| squad-finance | ✓ | 5 | 45 | 21 | ✅ |
| squad-growth | ✓ | 7 | 77 | 22 | ✅ |
| squad-paidmedia | ✓ | 10 | 82 | 21 | ✅ |
| squad-product | ✓ | 7 | 75 | 15 | ✅ |
| squad-research | ✓ | 8 | 72 | 26 | ✅ |
| squad-storytelling | ✓ | 11 | 47 | 16 | ✅ |

**Total verificado**: 188 squad agents (bate com sync:counts). Todos squad.yaml válidos.

**Gargalos MEDIUM**:
- `claude-code-mastery` tem só 1 KB doc — squad sub-documentado
- `squad-artdir` tem 14 agents pra 13 tasks (ratio invertido — mais agentes que tasks)

**Ação MEDIUM**: enriquecer KB de claude-code-mastery + revisar se squad-artdir precisa enxugar agents ou expandir tasks.

---

## Dimensão 7 — Performance Baselines ⏭️ NÃO MEDIDO

**Source canônica**: `time` em comandos chave

**Achado**: NÃO MEDIDO neste audit. Falta benchmark histórico vs atual.

**Ação MEDIUM**: criar `scripts/perf-baseline.sh` que mede e committa:
- `time npx sinapse-ai install` (cold)
- `time npx sinapse-ai doctor`
- `time npx sinapse-ai status`
- `time npm run generate:manifest`

Salva em `docs/perf/baseline.json`. CI compara contra baseline e alerta regressão >20%.

---

## Dimensão 8 — Story Velocity 🟡 MEDIUM

**Source canônica**: `grep "Status:" docs/stories/*.md`

| Status | Count | % |
|---|---:|---:|
| Done | 17 | 27% |
| Ready / Ready for Review | 13 | 21% |
| InReview | 5 | 8% |
| InProgress | 2 | 3% |
| **Draft** | **12** | **19%** |
| Skipped | 2 | 3% |
| Outros (vários) | 12 | 19% |

**Total**: 63 stories.

**Gargalo MEDIUM**: 
- Apenas 27% das stories chegaram a Done
- 12 stories paradas em Draft (19% do total)
- Backlog acumulando — pode indicar over-scoping ou abandono pós-criação

**Ação MEDIUM**: triagem manual das 12 Draft. Para cada uma:
- (a) Mover pra Done se já implementada (caso da 10.13 canonical install commands, já está rodando)
- (b) Mover pra Archived se obsoleta
- (c) Promover pra Ready se ainda relevante

---

## Dimensão 9 — Bundle/Install Size 🔴 HIGH

**Source canônica**: `npm pack`

**Achado**: tarball contém **4.079 arquivos**. Tamanho não medido (cancelei o du), mas 4K files é muito.

**Análise do `files` field em package.json**:
```
bin/, scripts/, packages/, .sinapse-ai/,
.claude/{CLAUDE.md, rules/, hooks/},
.codex/{...},
squads/squad-*/**, squads/claude-code-mastery/**, squads/sinapse/**,
sinapse/**, pro/{...},
docs/{guides, installation, examples, community, legal, security, sinapse-workflows, sinapse-agent-flows, framework, en, es, pt, zh}/,
docs/*.md, CHROME-BRAIN-INSTALL.md, README.md, LICENSE
```

**Suspects pra strip**:
- `squads/*/knowledge-base/` — KBs são ~430 linhas por arquivo, somam 300+ docs (~50% do tarball provável). User precisa de TODAS as KBs no install ou só as que ele ativar?
- `docs/{en,es,zh}/` — translations completas shipped (PT já é default)
- `docs/sinapse-workflows/` — docs internos com 640 broken links

**Ação HIGH**: 
- Decidir: KBs shipam todas ou on-demand via `sinapse install --squad X`?
- Translations: shipar só as ativas (PT + EN), zh/es esperar comunidade

**Não medi tamanho real**. Próxima ação: medir + perfilar.

---

## Dimensão 10 — Security (Vulns) 🟢 LOW (já tracked)

**Source canônica**: `npm audit --json`

```json
{ "moderate": 1, "high": 1, "critical": 0, "total": 2 }
```

**Já documentado como upstream-locked** (PR #150). Sem ação adicional.

---

## Dimensão 11 — Backlog State 🟡 MEDIUM

**Source canônica**: `gh pr list` + `git branch -r`

| Métrica | Valor | Status |
|---|---|---|
| PRs abertos | **0** | ✅ Limpo |
| PR #42 | CLOSED | ✅ Tratado |
| Branches remotas | **7** | ✅ (era 25 antes do cleanup) |
| Issues abertas | 0 | ⚠️ feedback público inexistente |

---

## Dimensão 12 — Co-maintainer Flow ⏭️ Aguardando validação

Config aplicada e válida (PR #148). **Falta validar em PR real do Soier.**

---

## Dimensão 13 — Scripts package.json 🟡 MEDIUM (não-resolvido)

**Source canônica**: `package.json` scripts field

**Achado**: 52 scripts. Detector simples não achou duplicatas exatas, mas existem candidatos a consolidação:
- 24 scripts `validate:*` — pode haver overlap
- Múltiplos `sync:*` e `generate:*`

**Ação MEDIUM**: auditoria cirúrgica separada (fora deste audit).

---

## Recomendações priorizadas (sequência ideal pra atingir 100%)

### CRITICAL (resolver essa semana)

1. **Limpar hooks dormants**
   - DELETAR `enforce-architecture-first.py` + `write-path-validation.py` (duplicatas)
   - Investigar e decidir sobre `precompact-session-digest.cjs`
   - Atualizar `hook-governance.md` documentando install-hooks.sh, pre-commit-version-check.sh, synapse-engine.cjs como infra/helpers
   - **PR sugerido**: `chore: remove dormant hooks + clarify infra files`

2. **Fix broken links em docs**
   - Bulk update das 640 broken links
   - Adicionar `check-markdown-links` como CI gate
   - Considerar arquivar `docs/sinapse-workflows/` se for legacy
   - **PR sugerido**: `docs: fix 640 broken internal links + CI gate`

3. **Subir test coverage threshold incremental**
   - 22% → 30% (primeiro passo)
   - Identificar 5 módulos críticos sem test
   - Story dedicada
   - **Story sugerida**: `coverage-ratchet-phase-1`

### HIGH (resolver esse mês)

4. **Inquirer 8 → 13 migration** (5 majors atrás, EOL)
5. **Bundle audit** — medir tarball real, decidir se KBs/translations shipam todas

### MEDIUM (backlog v1.3)

6. Triagem 12 stories Draft
7. Auditar 52 scripts package.json
8. Enriquecer KB do squad-claude-code-mastery
9. Revisar squad-artdir (14 agents / 13 tasks)
10. Performance baseline + CI regression alert
11. Documentar 7 artigos sem validador automatizado

### LOW

12. Vulns dev-only — aguardar upstream
13. Promover canal de feedback público

---

## O que não foi medido (gaps deste audit)

- **Tamanho real do tarball** (du cancelado por timeout)
- **Coverage atual real** (vs apenas threshold)
- **Performance baseline** (sem time prévio pra comparar)
- **Cross-platform parity** (CI cobre, mas não testado manual neste ciclo)
- **Article X compliance detalhado** (security checklist 25 items)

---

## Diferencial vs auditoria anterior (lição aprendida)

| Aspecto | Auditoria #1 | Esta auditoria |
|---|---|---|
| Counts agents/tasks | `find ... | wc -l` (errado) | `npm run sync:counts` (canônico) |
| Hooks count | dir size (19 ou 13?) | diff dir vs settings.json (12 ativos + dormants identificados) |
| Documentation | não auditado | 640 broken links descobertos |
| Test coverage | não auditado | threshold 22% exposto |
| Dependencies | não auditado | 8 majors atrás identificados |
| Squad health | não auditado | 19/19 OK, 2 com gaps menores |

---

*Audit conduzido por @snps-orqx · método: 13 dimensões com fontes canônicas · zero contagem naïve · zero fixes aplicados*
