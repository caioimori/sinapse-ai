# Limitações conhecidas — Motor de orquestração (`sinapse orchestrate`)

> **Escopo suportado:** `sinapse orchestrate <story-id>` é confiável para **1 story isolada**.
> Ele gera spec (Epic 3) e plano (Epic 4) reais e de qualidade, e produz código correto para
> uma story, com invariantes de honestidade que impedem verde falso.
>
> **NÃO suportado:** orquestração autônoma **multi-story** (várias stories encadeadas com
> dependências entre elas). Isso foi medido em 2026-06-30 e **abandonado** como caminho — ver
> [CHECKPOINT-multistory-2026-06-30.md](CHECKPOINT-multistory-2026-06-30.md) e a seção 7 do
> [README do épico](README.md). Para trabalho multi-story, use o caminho nativo (ou um wrapper
> fino por story): é mais correto, mais barato e mais portável.

## Por que multi-story não é suportado

O checkpoint decisivo rodou o motor contra o nativo numa tarefa de 3 stories dependentes
(1→2→3). Resultado: o nativo entregou **3/3 stories (9/9 testes, 1 call, 64s)**; o motor
entregou **1/3 stories (~13,5 min, dezenas de calls)**. A camada de coordenação multi-story
não agregou valor — ela **degradou** o resultado. Dois bugs são a causa raiz, e a decisão
consciente é **não corrigi-los** (não vale investir num caminho abandonado).

## Os 2 bugs multi-story NÃO corrigidos (decisão consciente)

### 1. Contaminação de estado cross-story (CRITICAL — quebra o encadeamento)

Rodar stories em sequência no mesmo diretório de trabalho faz uma story herdar o estado de
build da anterior e **pular toda a implementação** (zero código gerado).

- **Causa:** o `build-orchestrator` persiste `build-state.json` sob `plan/` (config
  `planDir = 'plan'`), um caminho **não escopado por story**. Como o executor de Epic 4 roda com
  `useWorktree: false`, o estado/plano resolve para o diretório-raiz compartilhado. O
  `completedSubtasks` de uma story faz a próxima concluir "já feito" e não gerar nada.
- **Evidência:** com a story 1 (`url-1-codec`) já concluída, as stories 2 e 3 carregaram
  `completedSubtasks: ["1.1","2.1","3.1","4.1"]`, logaram "Skipping completed subtask" e
  escreveram **zero** arquivos (`store.js` / validação nunca criados).
- **Efeito colateral:** um gate (`epic4_to_epic6`) chegou a **aprovar um build vazio** (score
  5.0) porque não checa se o build produziu/modificou arquivos.
- **Correção teórica (não aplicada):** escopar o estado por story
  (ex.: `plan/<storyId>/build-state.json`) + adicionar precondição "o build escreveu arquivos?"
  ao gate.

### 2. QA (Epic 6) falha ao spawnar `claude` aninhado no Windows (MAJOR)

O loop de QA do Epic 6 chama um `claude` aninhado (review/fix) que **falha em todas as
tentativas no Windows** com `exit 3221225794` (`0xC0000142`, falha de init de DLL numa invocação
de processo aninhada). Com isso o Epic 6 sempre cai em STUB — a etapa de QA não inspeciona nada.

- **Efeito:** mesmo quando o build de uma story é bom, o pipeline pode reportar `FAILED` porque a
  QA não conseguiu rodar (foi o caso da story 1 no checkpoint — código correto, 5/5 testes, mas
  pipeline FAILED por QA stub). As invariantes de honestidade seguraram (não houve verde falso).
- **Correção teórica (não aplicada):** corrigir/substituir o spawn de `claude` aninhado no
  Windows na etapa de QA.

## Bugs menores relacionados (contexto, não bloqueadores)

Registrados no checkpoint para completude; nenhum é corrigido aqui:

- `require` quebrado de um `plan-tracker` inexistente (degrada em silêncio para `PlanTracker = null`).
- `buildOptions` passado em dobro no executor de Epic 4 (inofensivo, mas frágil).
- Selo de identidade interno do agente vazando no topo do `spec.md` gerado (violação de
  agent-output-format).

## Nota relacionada — subsistema de waves (`workflow-intelligence`)

waves: sem caminho de produção — decisão
[DEC-02](../epic-ultra-optimization/decisions/DEC-02-workflow-intelligence.md)/[DEC-03](../epic-ultra-optimization/decisions/DEC-03-modulos-multi-story-orfaos.md).
O `engine/wave-analyzer` de `.sinapse-ai/workflow-intelligence/` (análise de waves para
execução paralela) só era consumido pelo `wave-executor`
(`.sinapse-ai/core/execution/wave-executor.js`), que por sua vez não tinha chamador de
produção — nenhuma orquestração real usa análise de waves.

**Execução (2026-07-03, OK do dono):** o cluster multi-story órfão foi REMOVIDO —
`wave-executor`, `parallel-monitor`, `context-injector`, `semantic-merge-engine` e o
`parallel-executor` de `core/execution/` (não confundir com o homônimo VIVO de
`core/orchestration/`), mais o `wave-analyzer` e a task `*waves` (superfície de comando
dele). Permanecem como reserva marcada (`@abandoned-path`): `result-aggregator` (referência
de design pro gate de wave do TOP-5) e `rate-limit-manager` (genérico) — o piloto do TOP-5
da Onda 3 confirma ou libera a remoção deles. A metade `suggestion-engine`/`learning`
(consumida por `*next`/`*patterns`, com consumidor real) ficou intocada.

## Resumo operacional

| Uso | Suportado? |
|---|---|
| `orchestrate` de **1 story** (spec + plano + build) | ✅ Sim, confiável |
| `orchestrate` de **múltiplas stories** encadeadas | ❌ Não — use o caminho nativo |
