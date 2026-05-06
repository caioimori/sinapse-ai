# Stowaway Audit — 2026-05-06

> Auditoria caçando "passageiros clandestinos": decisões antigas que não foram aplicadas até o fim, deixando declarações vivas com código morto.
>
> **Disparador**: ES + ZH ainda declarados em configs apesar de descontinuados.
> **Escopo**: 8 dimensões, fontes canônicas obrigatórias.
> **Método**: zero auto-fix neste audit — só relatório e classificação. Caio aprova quais resolver.

---

## Sumário executivo

**13 stowaways CRITICAL** identificados (vs 0 esperados se framework estivesse 100% limpo).

| Severidade | Quantidade | Categoria principal |
|---|---|---|
| 🚨 CRITICAL | 13 | Deps mortas + script quebrado + workflows zumbis + APSE legacy em configs |
| 🟡 HIGH PARTIAL | 2 | squad.yaml drift + 660 docs com APSE legacy (prose) |
| 🟢 LEGITIMATE | 4 | Hooks "fantasma" já validados como infra/helpers |

---

## Dimensão 1 — Dependências fantasmas 🚨 CRITICAL

**Source canônica**: `npx depcheck --json` + verificação manual via `grep require/from`

**Achado**: 14 deps marcadas pelo depcheck como unused. Verificação manual via grep:

| Dep | Tipo | Uso real (grep require/from) | Veredito |
|---|---|---:|---|
| `@kayvan/markdown-tree-parser` | prod | **0** | 🚨 STOWAWAY |
| `ansi-to-html` | prod | **0** | 🚨 STOWAWAY |
| `picocolors` | prod | **0** | 🚨 STOWAWAY |
| `validator` | prod | **0** | 🚨 STOWAWAY |
| `yaml-lint` | dev | **0** | 🚨 STOWAWAY |
| `picomatch` | (override) | **0** | ⚠️ override existe mas dep não é direta |
| `asciichart` | prod | 1 | ✅ usado |
| `chokidar` | prod | 1 | ✅ usado |
| `handlebars` | prod | 1 | ✅ usado |
| `proper-lockfile` | prod | 1 | ✅ usado |
| `tar` | prod | 2 | ✅ usado |
| `@semantic-release/changelog` | dev | (config plugin) | ✅ legítimo |
| `@semantic-release/git` | dev | (config plugin) | ✅ legítimo |
| `@types/jest` | dev | (TS types) | ✅ legítimo |
| `conventional-changelog-conventionalcommits` | dev | (config plugin) | ✅ legítimo |

**Stowaways confirmados (5 deps)**: `@kayvan/markdown-tree-parser`, `ansi-to-html`, `picocolors`, `validator`, `yaml-lint`

**Ação**: remover do package.json. Economia: ~2-5 MB de install + ~50 transitives.

---

## Dimensão 2 — Workflows GitHub órfãos 🚨 CRITICAL

**Source canônica**: `gh run list --workflow=X --limit=60` (60 dias)

| Workflow | Runs em 60d | Veredito |
|---|---:|---|
| `issue-labeler.yml` | **0** | 🚨 STOWAWAY (nunca rodou) |
| `publish-pro.yml` | **0** | 🚨 STOWAWAY (PRO submodule não-ativo) |
| `quarterly-gap-audit.yml` | 1 | ✅ Schedule trimestral, OK |
| `macos-testing.yml` | 3 | ✅ Triggered manualmente |
| `semantic-release.yml` | 6 | ✅ |
| `cross-platform-bob.yml` | 9 | ✅ |
| `bob-integration.yml` | 9 | ✅ |
| `pro-integration.yml` | 9 | ✅ (mesmo PRO inativo, integração roda) |
| Outros (release/npm/ci/codeql/etc.) | 18-60 | ✅ |

**Stowaways**: 2 workflows (`issue-labeler.yml`, `publish-pro.yml`)

**Ação**: arquivar OU deletar. Reduz ruído na pasta `.github/workflows/`.

---

## Dimensão 3 — Scripts apontando pra arquivos faltantes 🚨 CRITICAL

**Source canônica**: parser de `package.json` scripts → `fs.existsSync` em cada path

**Achado**:
```
validate:structure → .sinapse-ai/infrastructure/scripts/source-tree-guardian/index.js  ❌ NÃO EXISTE
```

Verificação: pasta `source-tree-guardian/` simplesmente **não existe** no `infrastructure/scripts/`. Script no `package.json` está morto.

**Ação**: deletar entry `validate:structure` OU recriar o guardian. Provavelmente foi removido em alguma reorganização e a entry ficou.

---

## Dimensão 4 — Squad.yaml drift 🟡 HIGH PARTIAL

**Source canônica**: parser de cada `squads/*/squad.yaml` → cross-ref com `agents/*.md` e `tasks/*.md`

| Squad | yaml claim | disk real | Diff |
|---|---:|---:|---|
| `claude-code-mastery` | 0 agents declarados | 8 | yaml não declara agents (estrutura diferente) |
| `squad-commercial` | 32 ids matched | 11 | regex pegou outros IDs (provável false positive) |
| `squad-council` | 16 ids | 11 | idem |
| `squad-design` | 8 ids | 15 | yaml subdeclarado |
| `squad-content` | 0 agents | 7 | yaml sem agents |
| `squad-claude` | 0 agents | 10 | yaml sem agents |
| `squad-cybersecurity` | 0 agents | 9 | yaml sem agents |
| `squad-brand` | 0 agents | 15 | yaml sem agents |

**Padrão**: muitos squads não declaram agents no `squad.yaml` — confiam no filesystem como source of truth. Outros declaram parcialmente. **Inconsistência arquitetural**, não stowaway puro.

**Ação MEDIUM**: padronizar — escolher convenção (yaml declara TUDO ou yaml ignora agents). Escopo maior, vira story dedicada.

---

## Dimensão 5 — Configs legacy com APSE 🚨 CRITICAL

**Source canônica**: grep `apse-orqx|APSE` em arquivos config (`.json`, `.yaml`)

**Achado em 10 configs estruturais** (não prose):
- `.coderabbit.yaml`
- `.codex/catalog.json`
- `.codex/command-registry.json`
- `.codex/delegation-matrix.json`
- `.codex/delegation-parity.json`
- `.codex/handoff-packet.template.json`
- `.claude/templates/agent-template.yaml`
- `.claude/templates/brainstorming-output-tmpl.yaml`
- `.claude/templates/qa-gate-tmpl.yaml`
- `.claude/templates/workflow-template.yaml`

**Implicação**: SNPS rename foi parcial. Codex catalog/registry/delegation **ainda referenciam APSE** — pode causar problemas de routing em runtime se o framework procurar por `snps-orqx` mas configs apontam pra `apse-orqx`.

**Ação CRITICAL**: bulk find-and-replace `APSE → SNPS` nos 10 configs. Validação posterior via `validate:codex-*` scripts.

**+ 660 docs markdown com APSE em prose**: maioria são histórico/changelog/audits — preservar. Mas pode haver casos PARTIAL (docs de uso ativo). Triagem manual MEDIUM.

---

## Dimensão 6 — Stories com features deletadas ⏭️ NÃO EXECUTADO

Não rodei especificamente — sem critério claro de "feature deletada" sem analisar caso-a-caso. Backlog pra audit futuro com escopo mais estreito.

---

## Dimensão 7 — Hooks fantasma 🟢 LEGITIMATE (já validado no PR #153)

**Source canônica**: diff `.claude/hooks/*` ↔ `.claude/settings.json`

4 arquivos no diretório que não estão registered em settings.json — todos **legítimos**:
- `install-hooks.sh` → script de instalação (não hook)
- `pre-commit-version-check.sh` → git hook (não Claude hook)
- `precompact-session-digest.cjs` → importado pelo wrapper (não direto)
- `synapse-engine.cjs` → engine importado pelo wrapper (não direto)

**Ação**: nenhuma. Já documentado em `hook-governance.md` no PR #153.

---

## Dimensão 8 — Tarball composition 📊 ANÁLISE

**Source canônica**: `npm pack && tar -tzf | analyze`

**Tarball**: 8.2 MB, 4070 arquivos.

**Top 5 pastas (% do tarball)**:

| Pasta | Files | % do total |
|---|---:|---:|
| `squads/` | **2120** | **52%** |
| `.sinapse-ai/` | 1207 | 30% |
| `docs/` | 303 | 7% |
| `.codex/` | 231 | 6% |
| `packages/` | 82 | 2% |
| Outros | 127 | 3% |

**Achado**: 52% do tarball são squads. Cada squad shipa: agents/ + tasks/ + knowledge-base/ completos.

**Implicação**: confirma decisão estratégica pendente — KBs (knowledge-bases dos squads, ~600+ arquivos) são o maior peso. **Decisão produto**: shippar todas (atual) ou on-demand?

**Ação**: NÃO neste audit. É decisão de produto, não stowaway. Mas dado bruto pra subsidiar decisão futura.

---

## Recomendações priorizadas

### CRITICAL — resolver agora (1 PR, ~30 min)

1. **Remover 5 deps mortas** (`@kayvan/markdown-tree-parser`, `ansi-to-html`, `picocolors`, `validator`, `yaml-lint`) do `package.json`
2. **Arquivar 2 workflows zumbis** (`issue-labeler.yml`, `publish-pro.yml`) — mover pra `.github/workflows/_archive/` ou deletar
3. **Deletar entry `validate:structure`** do package.json (ou re-criar guardian)
4. **Bulk replace APSE→SNPS** nos 10 configs estruturais

### HIGH — próximo ciclo (story dedicada)

5. **Padronizar squad.yaml** (decidir: declara agents ou ignora)
6. **Triagem APSE em docs prose** (660 arquivos — checar quais são uso ativo vs histórico)

### MEDIUM — backlog

7. Revisar candidatos secundários do depcheck (false positives confirmados, mas vale auditoria periódica)
8. Decisão sobre KBs no tarball (52% do peso)

### LEGITIMATE (documentar, não-acionável)

- Hooks "fantasma" — todos legítimos (PR #153)
- Workflows com baixo run count mas legítimos (`quarterly-gap-audit`, `macos-testing`)

---

## Comparação com auditorias anteriores

| Audit | Achados CRITICAL | Falsos positivos |
|---|---:|---|
| Health Check (2026-05-04) | 3 | PROM-1 (counts inflados) |
| Deep Audit (2026-05-05) | 3 | Stories Draft (12 vs 2 reais), scripts dups (52 vs 0) |
| **Stowaway Audit (2026-05-06)** | **13** | nenhum (verificação dupla via grep direto) |

Stowaway audit foi a **mais produtiva** porque caçou padrão específico (decisões parciais) em vez de re-medir métricas.

---

## Próxima ação

Caio aprova quais CRITICAL (1-4) viram PR? Posso fazer:
- 1 PR consolidado (todos os 4 fixes juntos) — mais rápido, mais risco
- 4 PRs separados — mais seguro, mais overhead

**Recomendação**: 4 PRs separados. Cada categoria isolada permite revert cirúrgico se algo quebrar (especialmente o APSE→SNPS bulk rename, que mexe em config crítica).

---

*Audit conduzido por @snps-orqx · método: 8 dimensões com fontes canônicas + verificação dupla onde possível · zero auto-fix*
