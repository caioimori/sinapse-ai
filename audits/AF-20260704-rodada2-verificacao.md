# AF-20260704 — 2ª rodada de verificação da auditoria Fable 5 (AF-20260702)

> Story `rodada2-verificacao-af20260702` · 2026-07-04 · main @ v1.21.0
> Escopo: os 35 não-verificados (§5.2) + as 8 lacunas do critic (§6) do AF-20260702.
> Método: 4 frentes de verificação adversarial em paralelo, evidência file:line por item,
> contra o estado ATUAL (pós Ondas 1-3, mesa de decisões e segurança A/B/C).

## Placar

**43 itens verificados:** 20 CONFIRMADOS · 8 PARCIAIS · 5 REFUTADOS · 8 JÁ-RESOLVIDOS
(pelas Ondas 1-3) · 2 ABERTOS (exigem trabalho fora do repo).

A leitura macro: **as ondas de correção realmente pagaram** — todos os 4 highs de
não-verificados ou já estavam resolvidos ou têm correção barata; o que confirmou "grande"
é de natureza processo/produto (calibração de juiz, formato de AC, schema de spec), não
defeito de código.

## Vereditos (evidência-chave por item; detalhe completo nos laudos das frentes)

### Highs

| Item | Veredito | Evidência / desdobramento |
|---|---|---|
| 120 links quebrados em docs/ | **PARCIAL** | Contagem real HOJE: **109 em 56 arquivos** (scan estrito de links .md relativos); CI usa baseline 523 (categorias mais amplas) e não bloqueia. → Backlog M (sweep) |
| Tabela única de routing Claude 5 | **PARCIAL** | Superfícies principais consistentes e cruzadas (token-economy = tiers · core-config models.registry = janelas · CLAUDE.md = resumo fiel). Resíduo: `.docker/llm-routing/config.yaml` com aliases datados claude-3-5 (infra LiteLLM). → Mesa (renomear alias quebra consumidores) |
| TOP 1 — frota de auditoria como produto | **PARECER: NÃO PRODUTIZAR** | Mesma classe dos 2 refutados da frente (confunde ferramenta interna com lacuna de produto); a ferramenta interna cumpre o papel; produtizar cria promessa de manutenção sem demanda medida. → Mesa (palavra final do dono) |
| Veredito medido não virou guarda no orchestrate | **CONFIRMADO** | Escopo "1 story per run" só existe no --help (`bin/sinapse.js:1423-1439`); `cli-commands.js:61-70` não avisa em runtime nem com `--epic`. → **EXECUTAR (Lote B)** |

### Mediums

| Item | Veredito | Desdobramento |
|---|---|---|
| LLM-judge decide Done sem calibração | **CONFIRMADO** (`epic-6-executor.js:206-271`, zero doc de calibração) | Mesa (processo: golden set de calibração juiz-vs-humano) |
| ACs = lista copiada, não GWT | **CONFIRMADO** (`story-tmpl.yaml:98-100` "Copy the acceptance criteria... from the epic") | Mesa (mudança de formato é decisão de produto) |
| spec.md validado só por existência | **CONFIRMADO** (`gate-evaluator.js:380-385` spec_exists = !!path; heurística fraca só no executor) | Mesa (check de substância no gate = story própria) |
| 7 rules sempre-ativas com conteúdo situacional | **PARCIAL** (7 confirmadas; 4 escopáveis ~625 linhas, 3 genuinamente globais; tensão com NON-NEGOTIABLE) | Mesa (escopar Artigos por path é decisão constitucional) |
| CLAUDE.md × AGENTS.md duplicam a lei | **CONFIRMADO** (6 seções semânticas duplicadas; sync só de contagens) | Mesa (gerar um do outro = decisão de arquitetura de docs) |
| Constitution 2x na mesma sessão | **PARCIAL** | Overlap residual ~170 tokens 1x/sessão + títulos ~700 chars/turno — custo material já eliminado pela Onda 1. **ACEITO com registro** |
| npx install não escreve nada | **REFUTADO** (instalador escreve `.claude/`, `.sinapse-ai/`, `.synapse/` — P9/#334) | — |
| user-guide personas/modelo obsoletos | **CONFIRMADO nas personas** (Dex/Quinn/Aria/Pax + @sinapse-orqx + "Version 1.19.2"; modelo já migrado pra alias) | **EXECUTAR (Lote A)** |
| README ensina sinapse-orqx deprecated | **CONFIRMADO** (`README.md:222` vs redirect DEPRECATED) | **EXECUTAR (Lote A)** |
| Motor híbrido invisível no README | **JÁ-RESOLVIDO** (`README.md:426-434` documenta com escopo honesto) | — |

### Lows (21)

| Item | Veredito | Desdobramento |
|---|---|---|
| ideation-engine docstring "AI-powered" | CONFIRMADO | **EXECUTAR (A)** — docstring honesta |
| KNOWN-LIMITATIONS "não aplicada" imprecisa | PARCIAL | **EXECUTAR (A)** — metade do Bug 1 (gate build-vazio) JÁ aplicada; escopo-de-estado e Bug 2 seguem não-aplicados (texto correto nesses) |
| sinapse-minimal promete "v11" | CONFIRMADO | **EXECUTAR (A)** |
| Livro de Ouro cita @caioimori/sinapse (shipped) | CONFIRMADO | **EXECUTAR (A)** |
| Exports mortos no barrel (WorkflowOrchestrator, EpicContextAccumulator) | CONFIRMADO (0 consumidores de produção) | **EXECUTAR (B)** — anotar `@deprecated` (barrel é API pública do pacote; remoção física só com janela de major — Art. XI) |
| Flags mortas parallelMode/maxParallel | CONFIRMADO (definidas em `build-orchestrator.js:91-92`, nunca lidas; waves removidas) | **EXECUTAR (B)** — remover |
| buildOptions em dobro no Epic 4 | CONFIRMADO (`epic-4-executor.js:201+203`) | **EXECUTAR (B)** — repasse único |
| Agents com model: datado | REFUTADO (só aliases de tier) | — |
| story-tmpl calibrado pra "Opus 4.7" | CONFIRMADO (4+ pontos em `product/templates/story-tmpl.yaml`) | **EXECUTAR (A)** |
| Co-Authored-By: Claude Opus 4.6 | CONFIRMADO (só `resolve-github-issue.md:343`) | **EXECUTAR (A)** |
| CLAUDE.md routing divergente | REFUTADO (resumo fiel da regra) | — |
| CodeRabbit WSL duplicado 5 agentes+rules+config | CONFIRMADO | Mesa (dedup = tocar 5 agentes+espelhos; single-source com include) |
| Blocos anti-alucinação/NSN repetidos | PARCIAL ("anti-alucinação" não existe; NSN = one-liner em 10 agentes + headers) | **ACEITO** (volume baixo) |
| 12/13 rules byte-idênticas home×repo | PARCIAL (hoje 16/22 idênticas) | **ACEITO com registro** (política deliberada: pessoal do Caio ≠ framework — memória `framework-vs-personal-config`) |
| Compactar 60% sem medidor | JÁ-RESOLVIDO (context-tracker dual-trigger + statusline, #329) | — |
| Handoff 500 tokens declarado | JÁ-RESOLVIDO (número removido no DEC-05; disciplina qualitativa) | — |
| Tool sem lint de descrição | CONFIRMADO (nenhum validador cobre tool-registry) | Mesa (lint novo = story própria) |
| COMPLEX>=16 só em prosa | CONFIRMADO (threshold vive em task .md + labels de diagrama; classificador JS usa 0.3/0.7 pra modelo) | Mesa (cabear cerimônia = decisão de processo) |
| L1/L2 rodam sem produzir conteúdo | CONFIRMADO (retornam null em instalação padrão; custo sub-ms) | **ACEITO** (custo desprezível; design fail-open) |
| README 17 vs 19 hooks | CONFIRMADO (17 4x + 19 1x no mesmo README; EN=17; real: ver Lote A) | **EXECUTAR (A)** — alinhar ao número real 1:1 com settings.json |
| Doctor 12/15/16 checks | CONFIRMADO (real = 16 default; 12 em getting-started/troubleshooting, 15 no docstring do registry e devops.md) | **EXECUTAR (A)** |

### Lacunas do critic (8)

| Gap | Veredito | Desdobramento |
|---|---|---|
| G1 CI Windows não é gate de merge | **CONFIRMADO** (`cross-platform-pr` fora do needs do validation-summary e dos 4 required checks) | **EXECUTAR (B)** |
| G2 FRONTIER "Opus 4.6" 2 arquivos | JÁ-RESOLVIDO (ambos des-datados, idênticos) | — |
| G3 172 vs 189 | JÁ-RESOLVIDO (real medido = 172; docs todas em 172; resíduo: comentário `subagent-dispatcher.js:265`) | **EXECUTAR (B)** — comentário |
| G4 knowledge-base com era antiga | PARCIAL (4 exemplos "200K" sem nota de era; `Opus 4.6` em copy-canon:198 e roadmap-sentinel 5 linhas) | **EXECUTAR (A)** |
| G5 LOOPS W19-W27 não lidos | **ABERTO** (trabalho de leitura da base de pesquisa, fora do repo) | Backlog |
| G6 paridade multi-IDE empírica | **ABERTO** (exige instalação real de teste) | Backlog |
| G7 suíte nunca executada | **JÁ-RESOLVIDO nesta rodada** — suíte executada N vezes nos ciclos de 03-04/07: 11.403 passed / 0 failed na main v1.21.0 | — |
| G8 docs/architecture fantasma | CONFIRMADO (dir não existe; 86 refs em 23 arquivos) | Backlog (junto do sweep de links H34) |

## Execução desta rodada

- **Lote A (texto/vitrine/números)** — story `rodada2-lote-a-vitrine-numeros` · **PR #353 MERGED** (main `615aaf4d`): user-guide (personas/ids/versão, +espelhos), README (snps-orqx, contagem de hooks), doctor=16 em 4 fontes, story-tmpl des-datado, Co-Authored-By, ideation docstring, sinapse-minimal, Livro de Ouro, KNOWN-LIMITATIONS precisão, KB era-de-modelo (200K/Opus 4.6).
- **Lote B (código/CI)** — story `rodada2-lote-b-codigo-ci` · **PR #354 MERGED** (main `ce18459d`): guarda runtime no orchestrate, cross-platform-pr no gate de merge, buildOptions único, flags mortas removidas (`Article XI override`), @deprecated no barrel, comentário 189.

Ambos os PRs passaram por CI completo (suíte jest ~11.4k testes, lint 0/0, typecheck, cross-platform smoke). Stories locais → Done. Publicação npm dos lotes A+B fica pendente de "publica" explícito do Caio (seria um patch/minor novo sobre 1.21.0).

## Mesa (aguardam palavra do dono — nenhum é urgente)

1. **TOP 1 frota como produto:** recomendação NÃO produtizar (ferramenta interna cumpre o papel).
2. **Calibração do juiz LLM** (golden set juiz-vs-humano) — processo novo, M.
3. **ACs em formato executável (GWT)** — muda o template canônico, decisão de produto.
4. **Check de substância do spec no gate** (seções obrigatórias + grounding) — story M.
5. **Dedup CodeRabbit WSL** (single-source) — M, toca 5 agentes+espelhos.
6. **Escopar por path as 4 rules situacionais** (~625 linhas/prompt) — tensão com NON-NEGOTIABLE, decisão constitucional.
7. **CLAUDE.md ⇄ AGENTS.md gerados de fonte única** — arquitetura de docs.
8. **Sweep de links quebrados** (109 + 86 refs a docs/architecture fantasma) — M-L.
9. **Lint de descrição de tools** e **cerimônia COMPLEX>=16 em código** — stories próprias.
10. **Aliases datados no LiteLLM** (.docker) — renomear quebra consumidores; decidir se moderniza ou aceita como infra legada.

## Execução da Mesa — épico `rodada2-mesa` (6 itens atacáveis) ✅ FECHADO

Os 6 itens código/docs, reversíveis via PR e sem dependência de decisão de produto/constitucional,
foram executados doc-first (épico → story Ready → implementação → verificação adversarial → PR):

| # | Item da Mesa | Story | PR |
|---|--------------|-------|----|
| M1 | Sweep de links quebrados + `docs/architecture` fantasma (itens 8) | `rodada2-m1-link-sweep` | #357 |
| M2 | Check de substância do spec no gate (item 4) | `rodada2-m2-spec-substance-gate` | #358 |
| M3 | Lint de descrição de tools (item 9a) | `rodada2-m3-tool-description-lint` | #359 |
| M4 | Cerimônia COMPLEX≥16 em código (item 9b) | `rodada2-m4-complex-ceremony-code` | #360 |
| M5 | CLAUDE.md ⇄ AGENTS.md fonte única (item 7) | `rodada2-m5-claude-agents-single-source` | #361 |
| M6 | Dedup CodeRabbit WSL single-source (item 5) | `rodada2-m6-coderabbit-dedup` | #362 |

Os 5 itens restantes (decision-gated ou build próprio) migraram para o épico
`epic-rodada2-mesa-fase2` e estão sendo desfechados na ordem ideal (custo × risco × valor):

| Item | Desfecho | Artefato |
|------|----------|----------|
| 1 — frota como produto | **FECHADO**: não produtizar | ADR `DEC-01-frota-nao-produtizar` |
| 10 — aliases LiteLLM | **FECHADO**: aceito como infra legada | ADR `DEC-02-litellm-aliases-legado` |
| 3 — ACs em GWT | em execução (guard advisory) | story `mesa2-acs-gwt-guard` |
| 2 — calibração do juiz LLM | em execução (golden set + harness) | story `mesa2-llm-judge-calibration` |
| 6 — escopo por path das rules NON-NEGOTIABLE | **aguarda decisão do dono** (tensão constitucional) | ADR `DEC-03` (pendente) |

---
*4 frentes de verificação adversarial · 2026-07-04 · evidências completas nos laudos das frentes (transcritos nos PRs do ciclo).*
