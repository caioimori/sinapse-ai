# DEC-05 — Protocolo de handoff: separar sinal de workflow de contabilidade de compaction

> Parecer de arquitetura · Story onda2-p8 · Item 2.16 do AF-20260702 · 2026-07-02
> Status: **AGUARDA OK DO DONO** (Art. XI) — diff proposto abaixo, **não aplicado**.

## Contexto

`.claude/rules/agent-handoff.md` define que toda troca de agente gera um artifact
YAML (~379 tokens) no lugar da persona completa (~3-5K), prometendo "33% reduction
per switch" (`agent-handoff.md:10,108`). O verbo é "mentally generate" (`:22`) — não
há enforcement: nenhum hook lê ou escreve o artifact.

## Medição feita AGORA (2026-07-02)

| Medição | Resultado |
|---|---|
| Artifacts em `.sinapse/handoffs/` | **0** — diretório existe desde 2026-05-12 e está vazio (~7 semanas de uso intenso do repo, incl. 2 auditorias e 2 ondas de execução) |
| Código que lê/escreve `handoffs/` | grep em `.claude/hooks/`, `.sinapse-ai/core/`, `bin/` → **só `bin/postinstall.js`**, que apenas CRIA o diretório vazio (`postinstall.js:353`) |
| Consumidores de `workflow-chains.yaml` | 10 agentes `.md` (prosa do "Suggested next command": `developer.md`, `quality-gate.md`, etc.), `tests/unit/workflow-chains/workflow-chains.test.js` (teste de integridade) e `entity-registry.yaml`. **Zero código runtime** |
| Template do artifact | `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml` existe (shipped) |
| Aritmética vs. era atual | 379 tok = **0,038%** da janela de 1M do modelo ativo (`core-config.yaml:400-402`); a conta "33%" (`agent-handoff.md:104-108`) soma personas de 3-5K numa janela 200K — hardware de outra era |

## As duas funções (o item 2.16 manda separar)

1. **Sinal de workflow** — o artifact YAML carrega story ativa, decisões, próximo
   passo; o "Suggested next command" dos agentes se alimenta da cadeia de
   `workflow-chains.yaml`. Consumo REAL: prosa dos 10 agentes core + teste de
   integridade que trava a cadeia. Custo de manter: ~zero.
2. **Contabilidade de compaction** — os números 379 tok / 500 tok máx / "max 3
   summaries" / "33% reduction" (`agent-handoff.md:64-72,104-114`). Consumo real:
   nenhum (0 artifacts, 0 leitores). Numa janela 1M com auto-compact nativo, a
   otimização declarada é irrelevante e a promessa não é honrada por ninguém.

## Opções

- **Manter tudo como está** — custo zero hoje, mas a regra segue prometendo mecânica
  que não existe (mesma classe de desonestidade estrutural dos itens 2.1/2.5).
- **Aposentar o protocolo inteiro** — mataria também o sinal de workflow, que TEM
  consumo real (prosa + teste) e custo ~zero. Corte além da evidência.
- **Separar (RECOMENDADA):** manter o artifact/cadeia como SINAL (conteúdo, não
  contagem) e aposentar a contabilidade de compaction + o storage `handoffs/` nunca
  usado, deixando o scratchpad (que tem função de disco análoga e o mesmo custo).

## Recomendação

**Separar.** A função de continuidade (o QUE passar adiante na troca de agente) fica;
a promessa quantitativa de compaction (379/33%/limite de 3) sai. É correção de
honestidade documental — zero mudança de comportamento executável, porque nunca houve
comportamento executável nessa metade.

## Diff proposto para `.claude/rules/agent-handoff.md` (NÃO aplicado — aguarda OK)

```diff
@@ ## Purpose @@
-Prevent context window accumulation when switching between SINAPSE agents (`@agent` commands). Each agent switch compacts the previous agent's full persona into a structured handoff artifact (~379 tokens) instead of retaining the full definition (~3-5K tokens).
+Preserve working continuity when switching between SINAPSE agents (`@agent` commands). Each agent switch passes forward a structured handoff artifact — active story, key decisions, files touched, blockers, next action — instead of the previous agent's full persona. (Context-window accounting was retired: with 1M-class windows and native auto-compact, the old token arithmetic no longer applies — see DEC-05.)
@@ ### Compaction Limits @@
-### Compaction Limits
-
-| Limit | Value |
-|-------|-------|
-| Max handoff artifact size | 500 tokens |
-| Max retained agent summaries | 3 (oldest discarded on 4th switch) |
-| Max decisions in artifact | 5 |
-| Max files_modified entries | 10 |
-| Max blockers | 3 |
+### Artifact discipline
+
+Keep the artifact SHORT and factual (a screenful): up to 5 decisions, 10 files,
+3 blockers. It is a signal for the incoming agent, not a log.
@@ ## Storage @@
-Handoff artifacts are stored at `.sinapse/handoffs/` (runtime, gitignored). Format: `handoff-{from}-to-{to}-{timestamp}.yaml`.
+Persisting the artifact to disk is OPTIONAL (`.sinapse/handoffs/`, runtime,
+gitignored) — measured 2026-07-02: zero artifacts ever written; the artifact's value
+is in the conversation, not the file.
@@ ## Example @@
-After `@sm` → `@dev` switch:
-- `@sm` full persona (~3K tokens) is **discarded**
-- Handoff artifact (~379 tokens) is **retained**: story ID, decisions, files, next action
-- `@dev` full persona (~5K tokens) is **loaded**
-- **Total context: ~5.4K** instead of ~8K (33% reduction per switch)
-
-After `@dev` → `@qa` switch:
-- `@dev` full persona is **discarded**
-- `@dev` handoff artifact is **retained** alongside `@sm` handoff
-- `@qa` full persona is **loaded**
-- **Total context: ~5.2K** instead of ~12K (57% reduction after 2 switches)
+After `@sm` → `@dev` switch: `@dev` starts from the handoff artifact (story ID,
+decisions, files, next action) — it does not re-derive `@sm`'s reasoning, and it
+does not need `@sm`'s persona.
```

Ajustes-satélite no mesmo pacote (quando aprovado): `.claude/CLAUDE.md:89` troca
"Agent handoff compacts to ~379 tokens on switch" por "Agent handoff passes a compact
artifact on switch"; espelhos sincronizados via `npm run sync:ide`.

## O que a decisão destrava

- Remove a última promessa quantitativa não-enforçada da camada de rules (fecha o
  padrão dos itens 2.1/2.5/2.16 — doc diz só o que o sistema faz).
- `workflow-chains.yaml` fica explícito como o dono único do "sinal de próximo passo"
  — candidato natural a consumo determinístico futuro (Onda 3, output formatter).
