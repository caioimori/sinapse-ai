# DEC-03 — 7 módulos multi-story órfãos em core/execution: veredito por módulo

> Parecer de arquitetura · Story onda2-p8 · Item 2.8 do AF-20260702 · 2026-07-02
> Status: **✅ EXECUTADA (2026-07-03)** — OK do dono ("faça pra finalizarmos 100% a
> otimização", em resposta à fila que listava esta decisão). Story de execução:
> `dec03-orphan-cluster-removal`. Removidos os 5 módulos com veredito de remoção +
> wave-analyzer (split DEC-02) + task `*waves`; `result-aggregator` e
> `rate-limit-manager` mantidos como reserva marcada condicionada ao piloto TOP-5.

## Contexto

Cluster "Parallel Agent Execution" da era v10 (stories 8.3, 10.1, 10.3, 10.5, 10.6,
11.3, GEMINI-INT.17 — visíveis nos cabeçalhos dos arquivos). **4.216 linhas** shipped
no npm (L1) cujo único executor são os próprios testes. O veredito HÍBRIDO
(2026-06-30, KNOWN-LIMITATIONS do épico de consolidação) abandonou a orquestração
multi-story autônoma — a razão de existir do cluster.

**Pergunta do futuro:** o TOP-5 da Onda 3 ("Epic waves multi-story como wrapper fino
no harness", AF-20260702 item 3.5) reutiliza algo daqui? **Não.** O wrapper é
harness-based por design — fan-out por story em worktree isolado, "zero estado
compartilhado: o bug de contaminação plan/build-state.json não existe no harness"
(item 3.5). Ele substitui esta arquitetura em vez de consumi-la. No máximo,
`result-aggregator` serve de referência de DESIGN (detecção de conflito) — não de
dependência de código.

## Evidência (require-graph verificado por grep em 2026-07-02) e veredito por módulo

Legenda: RESERVA = manter-como-reserva-marcada (`@abandoned-path`); REMOVER = candidato
a remoção na primeira janela aprovada pelo dono (com story própria e manifest regen).

### 1. wave-executor.js (401 ln) → RESERVA, candidato a remoção em lote
- Consumidores: só `tests/core/wave-executor.test.js:26`. Registry: `usedBy: []`,
  `lifecycle: experimental` (`entity-registry.yaml:9984-9998`).
- Acoplamento: requer `rate-limit-manager` (`wave-executor.js:25`) e o wave-analyzer
  do workflow-intelligence (`:18`) — é a cabeça do cluster e o único elo com DEC-02.
- Valor de reserva: nulo pro TOP-5 (harness não usa executor caseiro).

### 2. parallel-monitor.js (430 ln) → RESERVA, candidato forte a remoção
- Consumidores: só `tests/core/parallel-monitor.test.js:14`. Registry é explícito:
  `lifecycle: orphan`, `usedBy: []` (`entity-registry.yaml:9878-9890`).
- Valor de reserva: monitora execuções paralelas que não acontecem. No harness, a
  visibilidade vem do próprio harness — não deste EventEmitter.

### 3. result-aggregator.js (486 ln) → RESERVA
- Consumidores: só `tests/core/result-aggregator.test.js:17`. `usedBy: []`
  (`entity-registry.yaml:9918-9926`).
- Valor de reserva: o ÚNICO com sobrevida conceitual — a detecção de conflito entre
  resultados paralelos é o problema que o "gate de wave" do TOP-5 vai reencontrar.
  Manter como referência de design até o piloto do TOP-5 decidir; não como dependência.

### 4. rate-limit-manager.js (315 ln) → RESERVA
- Consumidores: só `wave-executor.js:25` (intra-cluster) + teste. Registry:
  `usedBy: [wave-executor]` (`entity-registry.yaml:9897-9908`).
- Valor de reserva: é o único genérico (backoff exponencial, throttling) sem amarra ao
  multi-story. AINDA ASSIM, 0 consumidores externos hoje — mover pra `utils/` só SE um
  consumidor real aparecer; não especular (Art. IV). Cai junto do cluster se nada usar.

### 5. context-injector.js (537 ln) → RESERVA, candidato a remoção
- Consumidores: só `tests/core/context-injector.test.js:22`. `usedBy: []`,
  `lifecycle: experimental` (`entity-registry.yaml:9836-9851`).
- Sobreposição: injeção de contexto é a função do motor synapse (DEC-01) — dois
  sistemas pra mesma preocupação; o framework escolheu o synapse (S2/P4 investiram lá).

### 6. semantic-merge-engine.js (1.748 ln) → RESERVA, maior peça do lote
- Consumidores: só testes — `tests/core/semantic-merge-engine.test.js:27` e
  `.sinapse-ai/core/memory/__tests__/active-modules.verify.js:144-228` (é teste,
  apesar do nome; o registry o lista como usedBy — `entity-registry.yaml:9946-9947`).
  `CustomRulesLoader` exportado (`:1741`) só tem uso interno + testes.
- Valor de reserva: merge semântico de trabalho paralelo que não existe. É 41% das
  linhas do cluster — o maior ganho de pacote se o dono aprovar remoção. O TOP-5
  resolve conflito por ISOLAMENTO (worktree por story), não por merge AI.

### 7. parallel-executor.js de core/execution (299 ln) → veredito mais duro: REMOVER
  (na primeira janela aprovada; até lá, reserva marcada)
- Consumidores: só `tests/core/execution/parallel-executor.test.js:9`.
- **Referencia o provider Gemini já removido do repo — 45 menções** (grep -ci
  `gemini` no arquivo). É "reserva" ilusória: a capacidade que ele orquestra
  (RACE/CONSENSUS entre Claude e Gemini) não existe mais no framework. Reserva de um
  caminho que não pode voltar a funcionar sem reescrever a integração inteira.
- **CUIDADO — homônimo VIVO:** `core/orchestration/parallel-executor.js` é OUTRO
  módulo (fases de workflow, não providers) e está no caminho real:
  `workflow-orchestrator.js:19,59` + `orchestration/index.js:19,168` ←
  `bin/sinapse.js:1435,1507`. O próprio cabeçalho do órfão documenta a não-duplicata
  (`core/execution/parallel-executor.js:7-11`). O marcador foi aplicado SÓ no de
  `execution/`. Nota: o registry está STALE aqui — `entity-registry.yaml:9866-9867`
  dá `usedBy: [workflow-orchestrator]` ao de execution, conflando os dois; corrigir
  quando a decisão executar.

## Resumo dos vereditos

| Módulo | ln | Consumidor real hoje | Veredito recomendado |
|---|---:|---|---|
| wave-executor | 401 | nenhum (só teste) | reserva marcada → remoção em lote |
| parallel-monitor | 430 | nenhum (registry: orphan) | reserva marcada → remoção em lote |
| result-aggregator | 486 | nenhum (só teste) | reserva marcada (referência p/ gate TOP-5) |
| rate-limit-manager | 315 | wave-executor (intra-cluster) | reserva marcada (genérico; utils só com consumidor real) |
| context-injector | 537 | nenhum (só teste) | reserva marcada → remoção em lote |
| semantic-merge-engine | 1.748 | nenhum (só testes) | reserva marcada → remoção em lote (maior ganho) |
| parallel-executor (execution/) | 299 | nenhum (só teste) + provider removido | **remover** na 1ª janela aprovada |

## O que a decisão destrava

- OK do dono nos vereditos → UMA story de execução (remoções + `generate-install-manifest`
  + registry fix + KNOWN-LIMITATIONS) tira ~4,2k linhas mortas do pacote npm — sem
  re-litigar nada, porque cada veredito já tem evidência aqui.
- `result-aggregator`/`rate-limit-manager` ficam explícitos como "reserva com
  condição": o piloto do TOP-5 (Onda 3) é quem confirma ou libera a remoção deles.
- O marcador `@abandoned-path` garante que nenhuma sessão futura "descobre" esses
  módulos e constrói em cima sem passar por este parecer.
