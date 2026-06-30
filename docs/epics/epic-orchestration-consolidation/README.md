# Épico: Consolidação do Motor de Orquestração — "Do teatro ao real"

> **Origem:** [Auditoria Fria 2026-06-04](../../audits/AUDIT-2026-06-04-cold-review.md) · Decisão de rumo: **APOSTAR** (caminho C).
> **Status:** ✅ Concluído (2026-06-30) — 7/7 frentes resolvidas. Restam follow-ups explícitos: STORY-F3C (remoção da linhagem `pm.sh`) e o checkpoint de reavaliação da aposta (seção 7), ainda não medido.
> **Owner:** framework governance.

---

## 1. Por que este épico existe

A auditoria provou que a feature-bandeira do framework — orquestração autônoma multi-agente — é encenação no caminho que o usuário aciona (`agent-invoker.js:404` retorna `'simulated'`; os epic-executors retornam `{ success: true }` fabricado; 2 das 3 linhagens de execução são simulação por `echo`). A decisão foi **apostar**: transformar o teatro em motor real, como diferencial de produto.

Este épico fecha o laço entre o que foi escrito e o que executa.

## 2. A tese arquitetural (decisão-mãe — TRAVADA antes de qualquer código)

> **O motor JS não substitui o Claude Code; ele orquestra POR CIMA dele.**

A plataforma (Claude Code / Codex) já sabe *spawnar 1 agente*. O valor do motor SINAPSE é *coordenar N agentes* com gates, state, handoffs, paralelismo e retry determinísticos. Três camadas:

| Camada | Responsabilidade | Peça canônica |
|---|---|---|
| **Coordenação** (motor JS) | Ordem, paralelismo, gates, state, handoffs, retry | `MasterOrchestrator` (consolidado) |
| **Invocação** (a ponte) | Spawnar o agente real | `subagent-dispatcher` → `runSafe` → `claude` CLI (futuro: API) |
| **Conhecimento** (os prompts) | As 189 personas | `squads/` resolvidas e injetadas no dispatcher |

**Linhagem canônica única:** `MasterOrchestrator → subagent-dispatcher → claude`.
Mata-se a linhagem `terminal-spawner → pm.sh` (a do `echo`). Funde-se `build-orchestrator` como um *modo* do motor (execução de story isolada), não um caminho concorrente.

## 3. Princípio de honestidade (invariante — vale durante TODO o épico)

> **Nenhum executor retorna `success: true` sem ter feito trabalho.**

Enquanto uma frente não fecha, o caminho retorna `status: 'stub'` ou erro explícito — **nunca verde falso**. Isso protege a aposta: você nunca confia num resultado fabricado durante a transição. Um lint anti-teatro (Frente 7) torna isso enforçável.

## 4. As frentes (em ordem de dependência)

| ID | Frente | Objetivo | Depende de |
|---|---|---|---|
| **F0** | Pré-flight / rede de segurança | Religar `frameworkProtection: true`; branch protection como required checks; honestidade transitória (stubs → `status:'stub'`); corrigir `uninstall` que corrompe git | — |
| **F1** | Executor único e real | `subagent-dispatcher` vira o executor default do `MasterOrchestrator`/`AgentInvoker`; remover `'simulated'` e `{success:true}` stub | F0 |
| **F2** | Resolver os 177 agentes | Estender `agentMapping` para resolver qualquer agente de `squads/` (fonte única), não só os ~10 genéricos | F1 |
| **F3** | Poda das linhagens mortas | Remover `terminal-spawner→pm.sh`, epic-executors stub, `autonomous-build-loop` simulate; fundir `build-orchestrator` na fachada única | F1 |
| **F4** | Planning real | `generatePlan` via Claude (não `grep` de checkbox); story sem AC formatado ainda gera plano | F1 |
| **F5** | Gates com dentes | IDS G5 + `gate-evaluator` recebem planning output + diffs + constraints reais; `WorkflowExecutor` cabeado a comando CLI; um gate consegue BLOQUEAR | F4 |
| **F6** | Decisão Synapse | Gerar `.synapse/manifest` e cabear ao engine, OU cortar o synapse engine do escopo da aposta (sub-decisão) | F1 |
| **F7** | E2E anti-teatro | Testes que exercitam o caminho REAL (`orchestrate → dispatcher → claude`); um teste que QUEBRA se reintroduzirem stub | acompanha F1–F5 |

## 5. Sequência de execução

```
F0 (pré-flight)
  └─> F1 (fundação: executor real)
        ├─> F2 (177 agentes)  ┐
        ├─> F4 (planning real)┤── F3 (poda) ──> F5 (gates com dentes) ──> F6 (decisão synapse)
        └─> F7 (e2e) acompanha e trava cada frente acima
```

## 6. Definição de pronto do épico ("feito de verdade")

- [x] `sinapse orchestrate <story>` invoca agentes reais e produz código/testes reais — não stubs.
- [x] Zero `return { success: true }` sem trabalho subjacente (lint anti-teatro verde no CI).
- [ ] Um único caminho de execução (as 3 linhagens viram 1). — **parcial:** a linhagem `terminal-spawner → pm.sh` foi silenciada em headless (opção B, #309), mas ainda não removida; remoção fechada em STORY-F3C (follow-up).
- [x] Os 189 agentes de squad endereçáveis pelo motor.
- [x] Pelo menos 1 gate capaz de bloquear de verdade num caso de teste.
- [x] Suite E2E anti-teatro rodando como required check.
- [ ] Claims do README/Constitution alinhados ao que o motor faz de fato. — em andamento (CHANGELOG e este épico atualizados nesta sessão; varredura completa de claims segue como follow-up).

> **Pendente honesto (checkpoint da seção 7):** o "teste do caso real" — implementar uma story end-to-end via `orchestrate` e medir se o motor é **melhor / mais barato / mais portável** que rodar os mesmos agentes nativamente — **ainda NÃO foi medido**. Fica como follow-up obrigatório antes de dobrar a aposta (F6 + roadmap de orquestração como produto).

## 7. Checkpoint de reavaliação da aposta (matar ou dobrar)

A aposta foi feita contra a recomendação da auditoria (que via competição com o Claude Code nativo). Para não ser fé cega, há um checkpoint objetivo **após F1–F5**:

> **Teste do caso real:** escolher uma story de verdade e implementá-la end-to-end via `orchestrate`. Medir: o motor produz resultado **melhor, mais barato ou mais portável** do que rodar os mesmos agentes nativamente no Claude Code?

- **Sim** → dobrar (F6 + roadmap de orquestração como produto).
- **Não** → a aposta se converte no caminho híbrido (B) com o aprendizado pago. Sem vergonha — decisão baseada em evidência.

Este checkpoint é a diferença entre apostar e apostar com disciplina.

## 8. Fora de escopo deste épico

- BLOCO B além da F0 (multi-IDE lossy, schema de agentes, redundância de installers) — vira épico separado de *higiene de borda*.
- Reescrita dos 189 prompts (a camada de conhecimento já funciona).

## 9. Stories

| Story | Frente | Status |
|---|---|---|
| F0a — Honestidade transitória (stubs param de mentir verde) | F0 | ✅ **Concluída** — categoria `stub` na base; epic-3/4 + master-orchestrator honestos; 3 testes viraram trava. 732 testes verdes |
| [F1.1 — Executor único e real](stories/STORY-F1.1-executor-unico-real.md) | F1 | ✅ **Concluída** — executor real (`SubagentDispatcher`) é o default; epic-3 (spec), epic-4 (build) e epic-6 (QA) via agente real (na main antes desta sessão) |
| F2.1 — Resolver os 177 agentes de squad no dispatcher | F2 | ✅ **Concluída** — 189 agentes de squad endereçáveis pelo dispatcher (na main antes desta sessão) |
| F3.1 — Poda das linhagens mortas (terminal-spawner/pm.sh) | F3 | ✅ **Concluída (opção B do arquiteto)** — guard consciente de capacidade silencia o terminal-spawner em headless; remoção da linhagem `pm.sh` adiada para **STORY-F3C** (#309) |
| F4.1 — Planning via Claude (não grep de checkbox) | F4 | ✅ **Concluída** — `generatePlan` planeja via `claude` real sobre a story completa; fallback honesto `degraded`/`stub` (#307) |
| F5.1 — Gates com input real | F5 | ✅ **Concluída** — gate `epic4_to_epic6` ganha o check `plan_is_real` que BLOQUEIA plano degradado/ausente; score honesto (#308) |
| F0.1 — Pré-flight: religar `frameworkProtection` (POR ÚLTIMO — só com core estável) | F0 | ✅ **Resolvida-por-design** — `frameworkProtection:false` é modo contribuidor deliberado (verificado 2026-06-11); projetos instalados recebem `true` via template; doctor espera `false` aqui; `uninstall`-corrompe-git já corrigido no commit `82c048a` |
| F7.1 — Suite E2E anti-teatro | F7 | ✅ **Concluída** — suíte anti-teatro exercita o caminho real (`orchestrate → dispatcher → claude`) como required check (na main antes desta sessão) |
