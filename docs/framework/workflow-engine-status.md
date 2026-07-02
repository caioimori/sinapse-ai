# Workflow Engine Status — o que os 15 YAMLs de workflow realmente fazem

> **Fonte:** `audits/AF-20260702-fable5-upgrade.md` §3 Onda 2, item 2.17 (verificado por leitura direta de código nesta story).
> **Story:** `docs/stories/story-o2p5-enforcement-honesto.md` (Onda2-P5).
> **Data:** 2026-07-02.

## Por que este documento existe

`.sinapse-ai/development/workflows/*.yaml` descreve 15 fluxos de trabalho. Isso NÃO significa que existem 15 fluxos executados por um engine — cada YAML tem um nível de "vivência" no código diferente, e a documentação pública nunca distinguiu isso explicitamente. Este documento é a fonte da verdade sobre o que cada YAML É de fato, verificado por leitura de código (não por inferência).

## Contagem

`Glob(.sinapse-ai/development/workflows/*.yaml)` retorna exatamente **15 arquivos** (confirmado em 2026-07-02) — bate com a contagem do relatório de auditoria.

## Classificação verificada

| # | Workflow | Classe | Evidência (lida diretamente) |
|---|---|---|---|
| 1 | `development-cycle.yaml` | **(a) Engine real, in-process** | `workflow-executor.js:104` — único YAML cujo path é carregado e cujas fases o `WorkflowExecutor` de fato interpreta e avança em código. |
| 2 | `greenfield-ui.yaml` | **(b) Handler + prosa** | `greenfield-handler.js:144-150` resolve o YAML pelo `project_type` (`resolveGreenfieldWorkflow`) e monta `workflowPath`; o handler chama `WorkflowExecutor`, mas os `steps` do YAML são instrução em linguagem natural — o executor carrega/valida o arquivo e devolve handoff, não interpreta os steps como programa. |
| 3 | `greenfield-fullstack.yaml` | **(b) Handler + prosa** | Idem (mesmo `greenfield-handler.js`, variante `fullstack`). |
| 4 | `greenfield-service.yaml` | **(b) Handler + prosa** | Idem (mesmo `greenfield-handler.js`, variante `service`). |
| 5 | `brownfield-ui.yaml` | **(b) Handler + prosa** | `brownfield-handler.js:78-84` mapeia `project_type` → `brownfield-ui`/`fullstack`/`service` (`resolveBrownfieldWorkflow`, mesmo padrão do greenfield); `:135-138` monta `workflowPath`; `:360` chama `workflowExecutor.executeWorkflow(this.workflowPath, ...)`. |
| 6 | `brownfield-fullstack.yaml` | **(b) Handler + prosa** | Idem. |
| 7 | `brownfield-service.yaml` | **(b) Handler + prosa** | Idem. |
| 8 | `brownfield-discovery.yaml` | **(b) Handler + prosa** | `brownfield-handler.js:13,326-360` — entry point específico da descoberta; o próprio YAML declara em `metadata.action_types.workflow-action` (linha ~23): "Action is a workflow orchestration step executed via **manual prompt**". |
| 9 | `qa-loop.yaml` | **(c) Citado, quebrado/parcial** | `epic-6-executor.js` reimplementa o loop review→fix→re-review direto em JS (`_runReview`/`_applyFixes`/contagem de iteração), sem nunca ler o YAML. O comentário do próprio arquivo (linhas 40-45) diz que o caminho antigo que citava o YAML via `qa-loop-orchestrator.js` era "triple-broken theater" e foi substituído por invocação direta de agente. `qa-loop-orchestrator.js` (que guarda `workflowPath: '.../qa-loop.yaml'` como constante) não tem nenhum call site fora de si mesmo — está órfão. |
| 10 | `spec-pipeline.yaml` | **(c) Citado, quebrado/parcial** | `epic-3-executor.js:36-41` guarda `this.pipelinePath` apontando pro YAML — mas essa é a **única** ocorrência da variável no arquivo inteiro (grep confirma), nunca é lida (`fs.readFileSync` nunca chamado sobre ela). As fases rodam de um array JS hardcoded (`SPEC_PHASES`), não do conteúdo do YAML. |
| 11 | `story-development-cycle.yaml` | **(d) Catálogo puro** | Só existe como entrada em `service-registry.json:11941-11972` (`path` na linha 11956). Nenhum executor em `.sinapse-ai/core/` referencia esse path. |
| 12 | `epic-orchestration.yaml` | **(d) Catálogo puro** | Só existe em `service-registry.json:11739` (`maxConcurrency: 4` nunca teve executor). Nenhum código carrega o arquivo. |
| 13 | `fast-track.yaml` | **(d) Catálogo puro** | Só existe em `service-registry.json:11770`. Nenhum código carrega o arquivo. |
| 14 | `auto-worktree.yaml` | **(d) Catálogo puro** | `triggers` declara `event: story_started` (linha 24) — nenhum engine do repo escuta esse evento. Os blocos `script:` dentro de cada step (JS embutido em YAML) nunca são interpretados/executados por nenhum runtime; é só entrada de catálogo em `service-registry.json`. |
| 15 | `design-system-build-quality.yaml` | **(d) Catálogo puro** | Só existe em `service-registry.json:11677`. Nenhum código carrega o arquivo. |

**Total: 1 (a) + 7 (b) + 2 (c) + 5 (d) = 15.**

## O que cada classe significa na prática

- **(a) Engine real (1/15)** — o único caso em que o YAML é literalmente a fonte de execução: `WorkflowExecutor` lê o arquivo e avança fase a fase em código.
- **(b) Handler + prosa (7/15)** — existe código real e vivo (`greenfield-handler.js`, `brownfield-handler.js`) que resolve qual YAML usar por tipo de projeto e invoca `WorkflowExecutor.executeWorkflow()` — mas isso carrega/valida o arquivo e devolve um handoff para o humano/agente seguir manualmente. Os `steps` descritos no YAML são instrução em linguagem natural, não um programa interpretado.
- **(c) Citado mas quebrado/parcial (2/15)** — em algum ponto do histórico o código apontava para o YAML (variável de path guardada, ou um script satélite), mas o caminho vivo de hoje contorna o arquivo por completo: ou porque foi reescrito para chamar um agente real diretamente (`qa-loop`), ou porque a variável do path nunca chega a ser lida (`spec-pipeline`).
- **(d) Catálogo puro (5/15)** — existem apenas como entrada em `service-registry.json` (id, nome, tags, path). Nenhuma linha de código em `.sinapse-ai/core/` carrega ou executa o arquivo.

## Decisão

O YAML continua sendo a **especificação / fonte da verdade** de cada workflow — é o contrato que a documentação em `docs/sinapse-workflows/` deriva e que humanos/agentes seguem manualmente hoje. Construir uma camada executável (`.workflow.js`) para os 15 não é a aposta certa: o veredito HÍBRIDO medido em 30/06/2026 mostrou que orquestração multi-agente sem gate determinístico tende a piorar (coordenação sabotou 1/3 vs 3/3 do caminho nativo — ver `docs/epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md`).

A decisão é: **camada executável real só para os 3-5 fluxos de maior valor**, cada um condicionado a um gate de medição antes de virar produto (repetir o protocolo do checkpoint de 30/06 — comparar contra o caminho nativo em custo e resultado). Candidatos, escopados para a Onda 3 (`audits/AF-20260702-fable5-upgrade.md` §3 Onda 3, itens 3.3-3.5):

1. **Brownfield Discovery (TOP 3)** — fan-out real (`parallel()`) na fase de coleta (arquiteto/dados/UX em paralelo) + gate de QA em código (APPROVED/NEEDS_WORK com retorno automático, máx. 2 voltas).
2. **Greenfield Discovery Phase 1 (TOP 4)** — pipeline com gate determinístico por artefato ("arquivo existe e não está vazio", reaproveitando `doc-first-resolver.js::fileHasContent`) + checkpoint humano honrando `confirmation_required`.
3. **Epic waves multi-story (TOP 5)** — wrapper fino no harness, fan-out por story em worktree isolado (zero estado compartilhado) — **gate inegociável de adoção:** repetir a medição de 30/06 (3 stories dependentes vs. nativo puro); só vira produto se empatar ou vencer em custo.

Sem essas 3, os outros 12 YAMLs continuam sendo espec, não motor — e está tudo bem, contanto que nenhum documento afirme o contrário.

## Docs shipped verificados (busca dirigida, sem correção necessária)

Busca em 2026-07-02 por afirmações de que os 15 YAMLs seriam executados automaticamente por um engine:

- `docs/framework/source-tree.md` (seção "Autonomous Development Engine") — já escopado por uma Onda 2 anterior: "**Measured scope:** reliable as a single-story assistant", com link para `KNOWN-LIMITATIONS.md`. Não overclaima.
- `docs/framework/atlas/OPERATING-ATLAS.md` §6 ("Workflow catalog") — lista os 15 com nome/tipo/descrição; é um catálogo neutro gerado do `service-registry.json`, não afirma execução automática.
- `docs/sinapse-workflows/README.md` — descreve o uso como algo que humano/agente "segue" ("Siga os Steps na ordem"), consistente com a realidade de handler+prosa.

Nenhuma correção adicional foi necessária além do que a Onda 2 anterior (itens 2.1/2.4 do relatório) já cobriu.

## Links

- Épico-mãe: [`docs/epics/epic-ultra-optimization/README.md`](../epics/epic-ultra-optimization/README.md) §0.5 (Estado).
- Evidência completa: `audits/AF-20260702-fable5-upgrade.md`, item 2.17 e §3 Onda 3 (itens 3.3-3.5).
- Limitação medida do motor: [`docs/epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md`](../epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md).
