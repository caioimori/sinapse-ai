# Stowaway Audit — Escopo (proposta pra aprovação)

> **Origem**: sinal vermelho do Caio em 2026-05-06.
> "Decisões antigas que não foram aplicadas até o fim. Fica resíduo que confunde quem lê."
>
> **Caso disparador**: ES + ZH continuavam declarados em `package.json`/configs/docs apesar de descontinuados há tempos (pastas vazias mas refs vivas). Resolvido em PR `caio/chore/remove-es-zh-stowaways`.

---

## Hipótese central

O framework acumulou drift estrutural ao longo de várias reorganizações (v10→v1, GA-1.2, audits clínicos). Decisões foram parcialmente aplicadas: código removido, mas referências/configs/docs ficaram pra trás como "stowaways" (passageiros clandestinos).

Essa auditoria caça especificamente esse padrão.

---

## Dimensões de busca (8 categorias suspeitas)

### 1. **Dependências fantasmas** (`package.json` → `dependencies` + `devDependencies`)
- **Source**: `npx depcheck` (lista deps declaradas mas nunca importadas)
- **Achado esperado**: 5-15 deps zumbis
- **Ação**: deletar do package.json + lockfile

### 2. **Workflows GitHub órfãos** (`.github/workflows/`)
- **Source**: cada `.yml` vs jobs realmente disparados nos últimos 60 dias (`gh run list`)
- **Achado esperado**: 1-3 workflows nunca disparados ou disparando vazios
- **Ação**: arquivar ou deletar

### 3. **Scripts em `package.json` apontando pra arquivos faltantes**
- **Source**: parser de `scripts.*` → cada path → `fs.existsSync`
- **Achado esperado**: 0-3 scripts quebrados
- **Ação**: deletar entry

### 4. **Tasks/agents declarados em `squad.yaml` mas sem arquivo**
- **Source**: parser de cada `squads/*/squad.yaml` → cross-ref com `agents/*.md` e `tasks/*.md`
- **Achado esperado**: 5-20 entradas órfãs nos 19 squads
- **Ação**: remover entry OU criar arquivo

### 5. **Configs `.codex/` e `.claude/` com keys legacy**
- **Source**: revisão manual de `.codex/catalog.json`, `.codex/command-registry.json`, `.codex/delegation-matrix.json`, `.claude/settings.json`
- **Achado esperado**: keys referenciando agents/skills antigos (ex: pré-rename APSE→SNPS)
- **Ação**: limpar

### 6. **Stories mencionando features deletadas**
- **Source**: grep em `docs/stories/*.md` por features históricas que sumiram (ex: `mind clones`, `tools system`, `clickup integration` se removidos)
- **Achado esperado**: 5-10 stories com refs zumbis
- **Ação**: marcar Status: Archived ou atualizar refs

### 7. **Hooks/rules listadas em README mas não registradas em `settings.json`**
- **Source**: cross-ref `.claude/hooks/README.md` ↔ `.claude/settings.json` ↔ `.claude/rules/`
- **Achado esperado**: já descobrimos 2 (.py duplicates) — pode ter mais
- **Ação**: deletar arquivo OU atualizar README

### 8. **4070 arquivos no tarball — onde está o peso?**
- **Source**: `npm pack && tar -tzf | awk -F/ '{print $2"/"$3}' | sort | uniq -c | sort -rn`
- **Achado esperado**: top 5 pastas = >70% dos arquivos. Provável: `squads/*/knowledge-base/`
- **Ação**: decisão estratégica (KBs todas vs on-demand) — fora deste audit
- **Output**: relatório com peso por pasta pra subsidiar decisão

---

## Critério de seleção

Pra cada achado, marcar:
- **STOWAWAY**: declaração viva, código morto → DELETAR
- **PARTIAL**: parte aplicada, parte não → COMPLETAR
- **LEGITIMATE**: parece zumbi mas tem uso real → DOCUMENTAR

---

## Output esperado

`docs/audits/2026-05-06-stowaway-audit.md` com:
- Tabela por dimensão: encontrados / classificação / ação
- Lista de stowaways CRITICAL pra resolver imediato
- Backlog de PARTIAL pra próximo ciclo
- LEGITIMATE documentados pra evitar serem flagrados de novo

---

## Não-escopo

- Refatoração de código vivo (só remoção de morto)
- Decisões estratégicas de produto (bundle on-demand etc.)
- Reorganização de docs (só remove refs quebradas)

---

## Tempo estimado

- Coleta de dados: ~5 min (paralelo)
- Análise + classificação: ~10 min
- Relatório: ~5 min
- **Total: ~20 min**

---

## Ação após aprovação

1. Crio branch `caio/chore/stowaway-audit`
2. Executo as 8 buscas em paralelo
3. Gero relatório consolidado
4. Te apresento achados antes de qualquer fix
5. Você aprova quais resolver agora vs backlog
6. Fixes em PR(s) separado(s) por categoria

---

*Aguardando aprovação do escopo (responda OK pra eu executar).*
