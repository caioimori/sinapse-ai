# Checkpoint "matar ou dobrar" — medição e2e real (seção 7)

> **Data:** 2026-06-30 · **Avaliador:** engenheiro de avaliação (sonnet/high)
> **Pergunta:** O motor de orquestração SINAPSE produz resultado **melhor, mais barato ou mais portável** do que rodar a mesma tarefa **nativamente** no Claude Code?
> **Status do checkpoint antes desta medição:** pendente honesto (README §7 / SESSION-HANDOFF) — o caminho real nunca havia sido exercitado ponta-a-ponta.

---

## 1. Metodologia

**Tarefa única, trivial e idêntica nos dois braços:** implementar `isValidCPF(cpf): boolean` em JavaScript (dois dígitos verificadores) + testes unitários cobrindo válido, inválido, formatação com pontos/traço e entrada de tamanho errado.

**Sandboxes isolados** (fora do repo do framework), cada um um repositório git limpo:
- Braço A (motor): `scratchpad/e2e-checkpoint/engine/` — com `docs/stories/SANDBOX-CPF.md` (status `Ready`, 4 ACs no formato `- [ ] ACn:`).
- Braço B (nativo): `scratchpad/e2e-checkpoint/native/`.

**Braço A — MOTOR (caminho canônico):**
```
SINAPSE_REAL_DISPATCH=1  node bin/sinapse.js orchestrate SANDBOX-CPF   (cwd = sandbox engine)
```
Pipeline completo `MasterOrchestrator.executeFullPipeline()` = Epic 3 (Spec) → Epic 4 (Execução → `BuildOrchestrator`) → Epic 6 (QA). Timeout duro externo de 8 min.

**Braço B — NATIVO (baseline):** uma única invocação
```
claude --print --dangerously-skip-permissions   (prompt equivalente via stdin, cwd = sandbox native)
```

**Correção medida objetivamente:** rodando os testes gerados (`node --test`) em cada braço.

**Ambiente:** Windows 11, Node v24.13.1, Claude Code CLI 2.1.195, `claude` real na PATH.

---

## 2. Dados — Braço B (NATIVO)

| Métrica | Valor |
|---|---|
| Invocações `claude` | **1** |
| Tempo de parede | **48 s** |
| Exit code | 0 |
| Arquivos entregues | `src/isValidCPF.js`, `test/isValidCPF.test.js` |
| Testes | **6/6 PASS** (`node --test`) |
| Correção | ✅ código correto, ACs cobertas |

Entregou o deliverable real, correto e testado, em uma única passada.

---

## 3. Dados — Braço A (MOTOR)

| Métrica | Valor |
|---|---|
| Invocações `claude` reais | **3** (spec gen + plan gen + QA review) |
| Tempo de parede | **193 s** (3m12s) — dentro do budget |
| Exit code | **0** |
| Veredito reportado | **"✅ ORCHESTRATION COMPLETE", Epics Executed: 3** |
| **Código entregue (`src/`, `test/`)** | **NENHUM** |
| Artefatos produzidos | `spec.md`, `plan/implementation.yaml`, `build-report`, `build-state.json`, QA report, state JSON |
| Testes | **N/A — não há código pra testar** |

### Linha do tempo interna
| Fase | Janela | Resultado |
|---|---|---|
| Epic 3 — Spec | ~63 s | ✅ `spec.md` **real e de alta qualidade** via `claude`. Gate: `needs_revision` (3.3) — pipeline seguiu mesmo assim. |
| Epic 4 — Plan | ~14 s | ✅ `implementation.yaml` gerado via `claude`. |
| Epic 4 — Execute | **4 ms** | ❌ **CRASHOU** ao reler o próprio plano: `expected hexadecimal character (6:18)`. **Zero código escrito.** |
| Epic 6 — QA | ~116 s | Review real via `claude`: "critical issues found" → relatório **BLOCKED**, mas "Issues Found: 0". Gate: **approved (5.0)**. |

### Root cause (defeito concreto e reproduzível)
O `BuildOrchestrator` serializa o `specPath` (um path Windows) **sem escapar** dentro de um escalar YAML de aspas duplas:
```yaml
metadata:
  specPath: "C:\Users\<user>\AppData\Local\Te..."
```
`\U` é uma sequência de escape inválida em YAML de aspas duplas → o `yaml.load` da fase execute lança, a fase morre em 4 ms, e nenhuma subtask chega a invocar `claude` pra escrever código. **Bug de path Windows — exatamente a plataforma do usuário.**

### Achado mais grave — vazamento da invariante de honestidade
O `epic-4-executor` faz a coisa certa internamente (`_failExecution` no build falho). Mas o resultado observável do pipeline é **mentira verde**:
- O master logou **"✅ Epic 4 completed successfully"** logo após **"Epic 4 failed: ..."**.
- Com `strict:false` (default), o Epic 4 falho não é crítico → não interrompe.
- Epic 6 fechou com gate **approved (5.0)** apesar do QA report dizer **BLOCKED**.
- O pipeline terminou **exit 0 + "ORCHESTRATION COMPLETE"** entregando **zero código**.

A invariante TRAVADA do épico ("nenhum executor retorna `success:true` sem ter feito trabalho") vale no nível do executor, mas **vaza no nível master/gate**: o usuário recebe "pronto, concluído" sem deliverable.

---

## 4. Comparação por dimensão

| Dimensão | Nativo (B) | Motor (A) | Vencedor |
|---|---|---|---|
| **Correção** | 6/6 testes, código correto | 0 deliverable (build crashou) | **Nativo** |
| **Custo** | 1 invocação · 48 s | 3 invocações · 193 s · 0 resultado | **Nativo** (~4× tempo, 3× chamadas, nada produzido) |
| **Portabilidade/estrutura** | Sem gates/state/handoffs | Gera spec+plan reais; gates/state existem mas **um falhou-aberto** (gate aprovou build quebrado) | **Empate técnico negativo** — a estrutura existe mas não protegeu o resultado |
| **Determinismo** | Saída direta | Pipeline determinístico **no fluxo**, mas defeito de serialização determinístico **quebra** o caminho em Windows | **Nativo** |
| **Honestidade do report** | "pronto" = pronto | "COMPLETE" com 0 deliverable | **Nativo** |

---

## 5. Leitura honesta (a favor e contra o motor)

**A favor do motor (o que funcionou de verdade):**
- A **camada de conhecimento + a ponte de dispatch funcionam**: o Epic 3 gerou um `spec.md` real, bem estruturado, via `claude` real (inclusive com o selo de agente). O Epic 4 gerou um plano real. Não é teatro nessas duas fases — é trabalho real.
- O caminho `MasterOrchestrator → epic-executors → BuildOrchestrator → claude` está cabeado e roda fora do mock pela primeira vez.

**Contra o motor (o que a evidência mostra):**
1. **Para uma tarefa pequena, o nativo ganha em tudo** que dá pra medir aqui: mais barato, mais rápido, correto, portável. O motor cobra ~4× o tempo e 3× as chamadas e, neste run, entregou nada.
2. **Defeito de execução na plataforma-alvo (Windows):** o motor quebra o próprio plano por escaping de path. Não é impossibilidade fundamental — é bug corrigível — mas está vivo no caminho canônico, em produção, na plataforma do usuário.
3. **Vazamento de honestidade no veredito final:** "ORCHESTRATION COMPLETE" + exit 0 sem deliverable é pior que falhar — induz confiança falsa. O gate de QA aprovou (5.0) um build BLOCKED.

**Caveat de escopo (a favor da prudência, não do motor):** este micro-benchmark **NÃO exercita** a proposta de valor real do motor — trabalho **multi-agente/multi-fase com gates e state compartilhado**. Uma função pura com testes é exatamente o caso onde uma única invocação nativa deveria ganhar. Então o resultado **não refuta a tese central** do épico; mas, ao tentar exercê-la, **expôs defeitos críticos** que precisam cair antes de a tese sequer poder ser testada com justiça.

---

## 6. Veredito

**NÃO dobrar como está. Caminho híbrido (B) + correções obrigatórias antes de qualquer re-medição.**

A aposta, no estado atual e na plataforma do usuário, **não se sustenta** para o caso real medido: o pipeline autônomo falhou em produzir o deliverable e **reportou sucesso** mesmo assim. Para uma tarefa pequena o nativo é estritamente melhor. O valor diferencial do motor (orquestrar N agentes com gates/state/handoffs) **não foi demonstrado** aqui — e o micro-benchmark, por design, não consegue demonstrá-lo.

Classificação precisa: **FAIL na execução** (defeito + mentira verde) + **INCONCLUSIVO na tese** (benchmark não exercita multi-agente). Os dois juntos apontam para **híbrido com disciplina**, não para dobrar.

### O que medir a seguir (antes de reabrir "dobrar")
1. **Corrigir 2 defeitos bloqueantes primeiro:**
   - (a) Escaping de path no `BuildOrchestrator` (serializar YAML com `yaml.dump`/aspas simples, nunca interpolar path Windows em escalar de aspas duplas).
   - (b) Vazamento de honestidade master/gate: build falho **deve** reprovar o pipeline (não "COMPLETE/exit 0"); gate de QA não pode aprovar (5.0) um QA report `BLOCKED`.
2. **Re-rodar este mesmo benchmark** pós-fix, em Windows **e** POSIX, e confirmar que o motor entrega `src/` + `test/` verdes.
3. **Trocar a tarefa por uma que exercite a tese:** trabalho multi-story com dependências entre fases, onde gates/state/handoffs paguem o overhead — é o único terreno onde o motor pode ganhar do nativo. Medir aí.
4. Só com (1)+(2)+(3) verdes o checkpoint "dobrar" pode ser reaberto com base em evidência.

---

## 7. Apêndice — comandos exatos

```bash
# Braço B (nativo)
cd sandbox/native
echo "<prompt isValidCPF + testes>" | claude --print --dangerously-skip-permissions
node --test            # 6/6 PASS

# Braço A (motor)
cd sandbox/engine      # docs/stories/SANDBOX-CPF.md (status Ready, 4 ACs)
SINAPSE_REAL_DISPATCH=1 node <repo>/bin/sinapse.js orchestrate SANDBOX-CPF
# → ORCHESTRATION COMPLETE / exit 0, mas sem src/ nem test/
```

Evidência bruta preservada no scratchpad da sessão: `engine-stdout.txt`, `engine-stderr.txt`, `native-stdout.txt`, `plan/build-report-SANDBOX-CPF.md`, `docs/stories/SANDBOX-CPF/{spec.md,plan/implementation.yaml}`.
