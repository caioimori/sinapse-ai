# Story F1.1 — Executor único e real

> **Épico:** [Consolidação do Motor de Orquestração](../README.md) · **Frente:** F1 (fundação)
> **Status:** Draft · **Complexidade:** Alta · **Depende de:** F0.1 (pré-flight)

---

## Contexto

Hoje o `MasterOrchestrator` instancia um `AgentInvoker` cujo método `_executeTask` retorna `status: 'simulated'` por padrão (`core/orchestration/agent-invoker.js:404`), e o executor real (`core/execution/subagent-dispatcher.js`) — que spawna `claude` via `runSafe` com hardening anti-injeção — está órfão (zero chamadores em produção) e desligado por `useSubagentDispatch: false` (`build-orchestrator.js:89`).

Esta story conecta os dois: o dispatcher real vira o executor default do motor. É a fundação — todas as outras frentes dependem dela.

## Objetivo

Fazer com que invocar o orquestrador resulte em **invocação real de agente**, com resultado que reflete trabalho de verdade — eliminando os caminhos `'simulated'` e `{success:true}` fabricado.

## Acceptance Criteria

**AC1 — Executor real é o default**
- **Given** um `MasterOrchestrator` instanciado sem executor custom
- **When** ele executa uma tarefa de agente
- **Then** a invocação passa por `subagent-dispatcher` → `runSafe` → `claude`, e o resultado contém saída real do agente (não `status: 'simulated'`).

**AC2 — Sem sucesso fabricado**
- **Given** qualquer executor no caminho do `MasterOrchestrator`
- **When** o trabalho subjacente não foi feito (stub, erro, timeout)
- **Then** o retorno é `status: 'stub'` ou erro explícito — **nunca** `{ success: true }`.

**AC3 — Flag eliminada**
- **Given** `build-orchestrator.js`
- **When** o código é lido
- **Then** `useSubagentDispatch: false` não existe mais (o dispatch real é o único caminho, não um opt-in).

**AC4 — Falha graciosa quando o CLI não está disponível**
- **Given** ambiente sem `claude` no PATH
- **When** o motor tenta invocar um agente
- **Then** retorna erro claro e acionável ("claude CLI não encontrado"), não trava nem reporta sucesso.

## Scope

**IN:**
- Cabear `subagent-dispatcher` como executor default em `AgentInvoker`/`MasterOrchestrator`.
- Remover `_executeTask` simulado (`agent-invoker.js:404-414`) — substituir pelo dispatch real.
- Remover/inverter `useSubagentDispatch` em `build-orchestrator.js:89`.
- Garantir o invariante de honestidade (AC2) no ponto de retorno do executor.

**OUT:**
- Resolver os 177 agentes de squad (→ F2).
- Podar as linhagens mortas `pm.sh`/epic-executors (→ F3).
- Planning real (→ F4).
- Gates (→ F5).

## Arquivos-alvo (da auditoria)

| Arquivo | O que muda |
|---|---|
| `core/orchestration/agent-invoker.js:395-414` | `_executeTask` passa a delegar ao dispatcher; remover o bloco `'simulated'` |
| `core/orchestration/master-orchestrator.js:168,212-217` | `executor` default deixa de ser `null`; injeta o dispatcher real |
| `core/execution/subagent-dispatcher.js` | Expor a função de invocação como executor consumível pelo orquestrador |
| `core/execution/build-orchestrator.js:89` | Remover `useSubagentDispatch: false` |
| `core/execution/spawn-safe.js` (`runSafe`) | Reusar como está (já é seguro) — não reescrever |

## Plano técnico

1. Extrair de `subagent-dispatcher` uma função `executeAgentTask(agent, task, context)` que encapsula `executeClaude` (já existe, `subagent-dispatcher.js:700`).
2. Em `AgentInvoker`, trocar o default de `_executeTask` por uma chamada a `executeAgentTask` (mantendo o override `this.executor` para testes).
3. Em `MasterOrchestrator`, passar o dispatcher como `executor` default em vez de `null`.
4. Aplicar o guard de honestidade: normalizar o retorno para que ausência de trabalho vire `status:'stub'` (nunca `success:true`).
5. Remover a flag `useSubagentDispatch`.

## Testes (trava F7 desde já)

- **Unit:** `_executeTask` sem executor custom chama o dispatcher (mock de `runSafe`), nunca retorna `'simulated'`.
- **Anti-teatro:** um teste que falha se `agent-invoker.js` voltar a conter a string `status: 'simulated'` ou se um executor retornar `success:true` sem `filesModified`/saída.
- **Integração (opt-in, requer `claude`):** invocar um agente trivial e asseverar que a saída é real.

## Definição de pronto

- [ ] AC1–AC4 verdes.
- [ ] `grep "status: 'simulated'"` em `core/orchestration/` → vazio.
- [ ] `grep "useSubagentDispatch"` → vazio.
- [ ] Testes unit + anti-teatro passando; cobertura de `agent-invoker.js` e o caminho de dispatch incluída (sair da exclusão atual do `jest.config.js`).
- [ ] Sem regressão nos 607 testes de segurança/installer.
