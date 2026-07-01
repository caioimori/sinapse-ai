# Épico: Consolidação do Motor de Orquestração — "Do teatro ao real"

> **Origem:** [Auditoria Fria 2026-06-04](../../audits/AUDIT-2026-06-04-cold-review.md) · Decisão de rumo inicial: **APOSTAR** (caminho C).
> **Status:** ✅ Frentes técnicas concluídas (7/7) · ⚖️ Checkpoint da aposta MEDIDO (2026-06-30) → veredito **HÍBRIDO** (ver seção 7 e [Estado final](#estado-final-2026-06-30--híbrido)). O motor é assumido como **assistente de story isolada** (spec + plano reais); a alegação de **orquestração autônoma multi-story foi medida e abandonada** (vira limitação documentada — ver [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md)).
> **Owner:** framework governance.

---

## Estado final (2026-06-30) — Híbrido

As frentes técnicas F0–F7 foram concluídas e o motor deixou de ser teatro: no caminho single-story ele invoca agentes reais e produz spec, plano e código reais, com invariantes de honestidade que impedem verde falso. **Mas o checkpoint "matar ou dobrar" (seção 7) foi finalmente medido** — e o veredito é **HÍBRIDO**, não "dobrar".

- **O que o motor É:** um **assistente de story isolada**. Epic 3 (spec) e Epic 4 (plano) geram artefatos reais e de qualidade para 1 story; o build produz código correto. `sinapse orchestrate <story-id>` é confiável para **1 story**.
- **O que o motor NÃO é (abandonado):** um **orquestrador autônomo multi-story**. Medido em 3 stories encadeadas, entregou 1/3, custou ~13× o tempo do nativo e sua coordenação **degradou** o resultado (contaminação de estado cross-story zerou as stories 2 e 3). Não há executor de DAG multi-story no CLI.
- **Consequência prática:** multi-story sequencial **não é suportado** pelo motor; para isso, o caminho nativo (ou um wrapper fino por story) é mais correto, mais barato e mais portável.
- **Dívida deliberadamente não paga:** os 2 bugs que quebram o multi-story (ver [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md)) **não serão corrigidos** — é um caminho abandonado, não vale investir.

Detalhes e números: seção 7 e [CHECKPOINT-multistory-2026-06-30.md](CHECKPOINT-multistory-2026-06-30.md).

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

**O que É verdade (verificado):**

- [x] `sinapse orchestrate <story>` invoca agentes reais e produz código/testes reais — não stubs. **(medido: verdadeiro para 1 story isolada — spec + plano + build reais, código correto.)**
- [x] Epic 3 (spec) e Epic 4 (plano) produzem artefatos reais de qualidade para uma story isolada — spec preciso e AC-grounded, plano com subtasks e verificações executáveis (evidência no [checkpoint multi-story](CHECKPOINT-multistory-2026-06-30.md), seção "Quality of what the engine did produce").
- [x] Zero `return { success: true }` sem trabalho subjacente (lint anti-teatro verde no CI). **(medido: as invariantes de honestidade seguraram — a story que falhou foi reportada `FAILED`, sem verde falso.)**
- [x] Os 189 agentes de squad endereçáveis pelo motor.
- [x] Pelo menos 1 gate capaz de bloquear de verdade num caso de teste.
- [x] Suite E2E anti-teatro rodando como required check.

**O que NÃO foi atingido / abandonado (decisão baseada em evidência — ver seção 7):**

- [ ] **NÃO ATINGIDO / ABANDONADO — orquestração autônoma multi-story.** Medido em 3 stories encadeadas: entregou 1/3 (as stories 2 e 3 pularam toda implementação por contaminação de estado cross-story). Não há executor de DAG multi-story no CLI — `orchestrate` roda 1 story por processo; a ordenação é trabalho do operador. Assumido como **limitação documentada**, não promessa. Ver [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md).
- [ ] **NÃO ATINGIDO — "melhor / mais barato / mais portável que nativo".** Medido: **pior** no caso multi-story — nativo entregou 3/3 stories, 9/9 testes, 1 call, 64s; o motor entregou 1/3 stories em ~13,5min e dezenas de calls. A camada de coordenação degradou o resultado em vez de agregar valor.
- [ ] Um único caminho de execução (as 3 linhagens viram 1). — **parcial:** a linhagem `terminal-spawner → pm.sh` foi silenciada em headless (opção B, #309), mas ainda não removida; remoção fechada em STORY-F3C (follow-up).
- [x] Claims do README/Constitution alinhados ao que o motor faz de fato — **verdadeiro após esta sessão.** Varredura ampla (README, `docs/`, constitution, AGENTS.md) confirmou que os docs públicos já eram modestos: o hero do README é "Squads de IA que constroem **com** você, não **para** você" e `orchestrate` é descrito como "ciclo de desenvolvimento de **uma** story" (singular). Nenhum overclaim de motor autônomo multi-story a corrigir; épico + KNOWN-LIMITATIONS registram a realidade medida.

## 7. Checkpoint de reavaliação da aposta (matar ou dobrar)

A aposta foi feita contra a recomendação da auditoria (que via competição com o Claude Code nativo). Para não ser fé cega, há um checkpoint objetivo **após F1–F5**:

> **Teste do caso real:** escolher uma story de verdade e implementá-la end-to-end via `orchestrate`. Medir: o motor produz resultado **melhor, mais barato ou mais portável** do que rodar os mesmos agentes nativamente no Claude Code?

- **Sim** → dobrar (F6 + roadmap de orquestração como produto).
- **Não** → a aposta se converte no caminho híbrido (B) com o aprendizado pago. Sem vergonha — decisão baseada em evidência.

Este checkpoint é a diferença entre apostar e apostar com disciplina.

### ⚖️ Veredito final MEDIDO (2026-06-30) — **HÍBRIDO** (caminho B)

O checkpoint foi rodado com dispatch real do `claude` CLI numa tarefa multi-story (3 stories encadeadas, com dependências reais 1→2→3), fora do repo do framework. Relatório completo: **[CHECKPOINT-multistory-2026-06-30.md](CHECKPOINT-multistory-2026-06-30.md)**.

| Dimensão | Nativo (`claude` direto) | Motor (`orchestrate`) | Vencedor |
|---|---|---|---|
| Stories entregues | **3 / 3** | 1 / 3 | Nativo |
| Testes | **9 pass / 0 fail** | 5 pass (só a story 1) | Nativo |
| `claude` calls | **1** | dezenas | Nativo |
| Wall time | **64 s** | ~13,5 min | Nativo |
| Coordenação multi-story | n/a | **negativa** (sabotou) | Nativo |

**A aposta foi medida e NÃO se sustenta para multi-story autônomo.** No terreno onde o motor deveria vencer, ele entregou **menos** e custou **muito mais**: um estado de build compartilhado e não escopado por story fez as stories 2 e 3 pularem toda a implementação (zero código), o loop de QA não conseguiu executar, e um gate aprovou um build vazio. A única vitória real: as **invariantes de honestidade seguraram** (a story que falhou foi reportada `FAILED`, sem verde falso).

**A aposta SE sustenta para single-story:** o caminho spec → plano → build de uma story isolada é genuinamente bom (spec preciso, plano AC-grounded, código correto).

**Decisão:** híbrido (caminho B). O motor é assumido como **assistente de story isolada** (Epic 3 spec + Epic 4 plano geram artefatos reais de qualidade). A alegação de **orquestração autônoma multi-story é abandonada** — vira limitação documentada ([KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md)), não promessa. Os 2 bugs multi-story que quebram o caminho abandonado **não serão corrigidos** (decisão consciente de não investir num caminho abandonado).

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
