# Session Handoff — Consolidação do Motor de Orquestração

> **Última sessão:** 2026-06-04 → 2026-06-10 · **Branch:** `caio/epic/orchestration-consolidation` · **HEAD:** `06ed016`
> **Estado:** working tree limpo · 734 testes verdes · 11 commits acima do base `f0a25c2`.
> **Como retomar:** leia este arquivo inteiro → depois `README.md` (o plano) → depois a seção "Próximo passo".

---

## Atualização 2026-06-30

**Épico fechado — 7/7 frentes resolvidas.** Lançado junto como **v1.19.0** (CHANGELOG atualizado).

- **3 PRs do motor mergeados na main nesta sessão:**
  - **#307 (F4.1)** — planning real via `claude`: `generatePlan` planeja sobre a story completa e mata o stub; fallback honestamente marcado `degraded`/`stub`.
  - **#308 (F5.1)** — gates com dentes: o gate `epic4_to_epic6` ganha o check `plan_is_real`, que BLOQUEIA plano degradado/ausente; score do gate ficou honesto (gate sem checks não recebe nota máxima).
  - **#309 (F3.1)** — terminal-spawner silenciado em headless via guard consciente de capacidade (opção B do arquiteto). A suíte do motor saiu de timeout (2min) para **~5s**; **1210 testes verdes**.
- **F0.1 fechada por design:** `frameworkProtection:false` é modo contribuidor deliberado (verificado 2026-06-11); projetos instalados recebem `true` via template; doctor espera `false` neste repo; `uninstall`-corrompe-git já corrigido no commit `82c048a`.
- **F3 reframe:** a frente foi resolvida pela **opção B** (silenciar o spawner em headless), com a **remoção física da linhagem `pm.sh` adiada para STORY-F3C** (follow-up).
- **Pendente honesto:** o checkpoint de reavaliação da aposta (seção 7 do README) — story real e2e via `orchestrate` medida contra o nativo — **ainda não foi medido**. Segue como follow-up obrigatório antes de dobrar (F6).

---

## TL;DR (o que aconteceu e onde estamos)

Foi feita uma **auditoria fria completa** do framework (`docs/audits/AUDIT-2026-06-04-cold-review.md`). Veredito: toolkit de prompts sólido + segurança forte, mas o **motor de orquestração autônoma (`sinapse orchestrate`) era teatro** — reportava `success: true` sem fazer trabalho. O Caio decidiu **APOSTAR** (consolidar o motor como diferencial), contra a recomendação da auditoria (que era cortar/híbrido).

Desde então, o motor **saiu do teatro** no caminho principal:
- Os stubs pararam de mentir verde (honestidade).
- O executor real (`SubagentDispatcher` → `claude`) foi cabeado como default.
- O epic-3 (Spec) gera spec via agente real.
- O epic-4 (Execução) delega ao `build-orchestrator` (o caminho que constrói de verdade) — matando a duplicação.

**O furo honesto a resolver primeiro:** tudo foi testado **com mock**. O caminho real **nunca foi exercitado de verdade** nem uma vez. Validar isso (rodar `claude` real numa story de teste) é o **próximo passo de maior valor** — é o "checkpoint matar/dobrar" do épico.

---

## A tese arquitetural (TRAVADA — não quebrar)

> **O motor NÃO substitui o Claude Code; orquestra POR CIMA dele.**

A plataforma sabe *spawnar 1 agente*. O motor *coordena N agentes* com gates/state/handoffs, delegando a invocação real à peça que funciona. Camadas:
- **Coordenação** (motor JS): `MasterOrchestrator` decide ordem/gates/state.
- **Invocação** (a ponte): `SubagentDispatcher` → `runSafe` → `claude` (shell-injection-proof).
- **Conhecimento**: as 189 personas em `squads/`.

Linhagem canônica única: `MasterOrchestrator → (epic-executors) → SubagentDispatcher/BuildOrchestrator → claude`. As outras 2 linhagens (terminal-spawner→pm.sh com `echo`; epic-executors stub) devem morrer (F3).

**Invariante de honestidade (vale sempre):** nenhum executor retorna `success: true` sem ter feito trabalho. Sem trabalho → `status: 'stub'` ou erro explícito.

---

## ✅ O que está FEITO (com commits)

| Frente | O que foi feito | Commits |
|---|---|---|
| **Auditoria + Épico** | Cold review completa + decisão de apostar + plano de 7 frentes | `e3f99c9` |
| **F0a — Honestidade** | Categoria `stub` na base (`epic-executor.js`); epic-3/4 + `master-orchestrator` reportam `mode:'stub'`/`success:false` em vez de sucesso fabricado. 3 testes que codificavam o teatro viraram **trava anti-regressão** | `a777783` |
| **F1.1 — Executor real** | `master-orchestrator` cria `_createDispatchExecutor()` (lazy) = `SubagentDispatcher` real como executor **default**; `AgentInvoker` não retorna mais `'simulated'` (agora `'stub'` honesto) | `68da98c` |
| **epic-3 (Spec) real** | `_generateSpecViaAgent()` — gera spec via `orchestrator.invokeAgent` quando há executor; fallback stub honesto. **Padrão estabelecido** | `d1c15e1` |
| **epic-4 (Execução) convergência** | epic-4 **delega ao `BuildOrchestrator`** (`_executeViaBuildOrchestrator`) em vez de reimplementar. Mata a duplicação. Antecipa F3 | `32f29c5` |

**Validação atual:** 734 testes verdes. Cada arquivo isolado roda <5s. (A suíte combinada leva ~35-43s por overhead de teardown — ver gotcha #4.)

---

## ⏭️ O que FALTA (priorizado)

### 0. ⭐ CHECKPOINT DA APOSTA — validar de verdade (FAZER PRIMEIRO)
Tudo está testado com mock. **O caminho real nunca rodou.** Antes de cabear mais, prove que funciona:
- Criar uma story de teste mínima.
- Rodar o epic-3 (ou o pipeline) com `SINAPSE_REAL_DISPATCH=1` e ver se gera um **spec real via `claude`**.
- Custo: poucos tokens + ~30s. **Pedir ok ao Caio antes** (gasta tokens reais).
- Se funcionar → a aposta tem base, seguir. Se não → ajustar antes de acumular mais.
- Esboço: `SINAPSE_REAL_DISPATCH=1 node -e "const {MasterOrchestrator}=require('./.sinapse-ai/core/orchestration'); ..."` num projeto-sandbox (NÃO no próprio repo, pra não bagunçar). Detalhar com cuidado.

### 1. epic-6 (QA) → conectar ao real
Mesmo padrão do epic-3. Hoje `_applyFixes` (epic-6) é stub ("Would fix..."). Invocar agente real (`@quality-gate`) pra aplicar fixes; fallback honesto. Usar `this._realExecutionAllowed()` (já existe na base).

### 2. AC3 — `useSubagentDispatch` (build-orchestrator)
`build-orchestrator.js:89` tem `useSubagentDispatch: false` na DEFAULT_CONFIG. Decidir: remover a flag morta OU usá-la pra rotear ao `SubagentDispatcher`. Não bloqueia (o build usa `executeSubtaskWithClaude` próprio).

### 3. F2 — mapear os 177 agentes de squad no dispatcher
`subagent-dispatcher.js:46` (`agentMapping`) só conhece ~10 agentes genéricos (`@dev/@qa/@architect`...). Estender pra resolver qualquer agente de `squads/` (a fonte única). Sem isso, o motor não endereça as squads de verdade.

### 4. F4 — planning real
`build-orchestrator.generatePlan` (e o do epic) planeja via `grep` de checkboxes de AC. Trocar por planning via `claude`. Falhar explícito se a story não tem ACs.

### 5. F5 — gates com input real
IDS G5 + `gate-evaluator` recebem contexto vazio → sempre passam. Popular com planning output + diffs. Cabear `WorkflowExecutor` a um comando real.

### 6. F3 (resto) — podar linhagens mortas
Remover `terminal-spawner` → `scripts/pm.sh` (o do `echo`). É a causa do ruído "não pode encontrar o caminho" + workers lentos nos testes.

### 7. F0.1 — religar `frameworkProtection` (POR ÚLTIMO)
`core-config.yaml:383` tem `frameworkProtection: false`. Religar SÓ depois do core estável (senão bloqueia a própria cirurgia). Inclui: branch protection no GitHub + corrigir o `uninstall` que corrompe git (P1 da auditoria).

---

## ⚠️ GOTCHAS CRÍTICOS (ignorar = quebrar / queimar tokens)

1. **Guard de teste — NÃO REMOVER.** `_realExecutionAllowed()` (base `epic-executor.js`) e o guard inline em `_createDispatchExecutor` (master) bloqueiam invocação real de `claude`/build dentro do test runner (detecta `JEST_WORKER_ID`) salvo `SINAPSE_REAL_DISPATCH=1`. **Sem isso, `npm test` invoca `claude` de verdade e queima tokens do Caio.**
2. **`claude` ESTÁ no PATH** (`...\AppData\Roaming\npm\claude.cmd`) — por isso o guard existe. Qualquer caminho real invoca o CLI de verdade.
3. **Padrão de teste:** testes de pipeline injetam `invokeAgent` mock no `beforeEach` (ver `master-orchestrator.test.js`). Testes que querem o caminho real: `process.env.SINAPSE_REAL_DISPATCH='1'` + `jest.spyOn(...prototype, 'build'/'invokeAgent').mockResolvedValue(...)` + restaurar no `finally`.
4. **Ruído de teste que NÃO é falha:** "O sistema não pode encontrar o caminho especificado" + "worker process failed to exit gracefully" = `terminal-spawner`/`pm.sh` headless (linhagem morta, F3). Pré-existente, ignorar. Cada arquivo isolado é rápido; a suíte combinada (~40s) é overhead de teardown desses handles.
5. **Hooks regeneram manifest:** todo commit que toca `.sinapse-ai/` faz o pre-commit regenerar `install-manifest.yaml` + `data/entity-registry.yaml`. Precisa de um **commit `chore:` extra** depois pra limpar o working tree (padrão usado em toda a branch).
6. **`frameworkProtection` está OFF** — por isso é possível editar `.sinapse-ai/core/`. Não religar antes da F0.1.

---

## Estado do git

- **Branch:** `caio/epic/orchestration-consolidation` (NÃO mergeada, NÃO pushed — só local).
- **HEAD:** `06ed016` · **Base:** `f0a25c2` (main: "Refino: gates que medem #215").
- **11 commits** na branch (auditoria → F0a → F1.1 → epic-3 → epic-4 → docs).
- Decisão pendente do Caio: quando mergear/PR esta branch (ainda é WIP — a aposta não foi validada e2e).

## Arquivos-chave tocados

- `.sinapse-ai/core/orchestration/executors/epic-executor.js` — base: `STUB`, `_stubExecution()`, `_realExecutionAllowed()`
- `.sinapse-ai/core/orchestration/executors/epic-3-executor.js` — spec via agente real
- `.sinapse-ai/core/orchestration/executors/epic-4-executor.js` — delega ao BuildOrchestrator
- `.sinapse-ai/core/orchestration/master-orchestrator.js` — `_createDispatchExecutor()` + finalize honesto
- `.sinapse-ai/core/orchestration/agent-invoker.js` — `'simulated'` → `'stub'`
- `.sinapse-ai/core/execution/subagent-dispatcher.js` — o executor real (NÃO modificado, só cabeado)
- `.sinapse-ai/core/execution/build-orchestrator.js` — o build real (NÃO modificado, só delegado)
- Testes: `tests/core/{epic-executors,master-orchestrator,agent-invoker}.test.js`

## Docs do épico

- `README.md` — o plano (7 frentes + sequência + definição de pronto + checkpoint matar/dobrar)
- `stories/STORY-F1.1-executor-unico-real.md` — a story detalhada
- `../../audits/AUDIT-2026-06-04-cold-review.md` — a auditoria-lastro
