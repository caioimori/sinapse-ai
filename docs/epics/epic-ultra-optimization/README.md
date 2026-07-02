# Épico-Mãe: Ultra-Otimização SINAPSE-AI com Fable 5

> **Criado:** 2026-06-10 · **Estado:** Plano aprovado, aguardando execução na próxima sessão (com Fable 5 ativo).
> **Engloba:** [`epic-orchestration-consolidation`](../epic-orchestration-consolidation/README.md) como Frente A.
> **Lastro:** [Auditoria Fria 2026-06-04](../../audits/AUDIT-2026-06-04-cold-review.md).

---

## 0. COMO RETOMAR (ler isto primeiro)

1. **Frase-gatilho do Caio:** *"quero voltar com a otimização do SINAPSE AI"*.
2. **Antes de tudo:** o Caio troca o modelo da sessão pro Fable 5 com `/model fable` (ou `/model claude-fable-5`). Se não aparecer → CLI desatualizado (`claude-code update` / reinstalar via npm) ou conta sob zero-data-retention (o picker omite o Fable 5).
3. **A IA lê este documento inteiro** (a §0.5 abaixo tem o estado mais recente), depois `audits/AF-20260702-fable5-upgrade.md` (auditoria de re-baseline), depois decide o próximo passo pelos itens pendentes da Onda 2/3 do relatório.
4. **Decisões já tomadas (não re-perguntar):**
   - Escopo: a ultra-otimização **engloba e turbina** o épico de consolidação + adiciona segurança/arquitetura/usabilidade.
   - Profundidade: **multi-agente exaustivo + verificação adversarial**.
   - Modelo: Fable 5 foi o motor da fase pesada original (janela grátis 09-22/06/2026, já encerrada); sessões novas usam o modelo padrão vigente.
5. **Primeiro passo de execução:** ~~§7 (validar a aposta do motor — checkpoint matar/dobrar)~~ **RESOLVIDO em 30/06/2026** — veredito **HÍBRIDO** (medido). O próximo passo real é continuar a **Onda 2** da auditoria AF-20260702 — ver §0.5.

---

## 0.5 Estado 2026-07-02 (re-baseline)

- **Frente A fechada:** veredito **HÍBRIDO** (medido, 30/06/2026) — o motor é um assistente confiável de **1 story** (spec + plano reais; QA com ressalva no Windows); orquestração autônoma **multi-story** foi medida e abandonada. PRs #307-#319 (inclui release v1.19.2).
- **Re-baseline:** `audits/AF-20260702-fable5-upgrade.md` re-verificou **94 claims** dos documentos-lastro contra a main atual — **49 resolved · 28 changed · 14 open · 3 unverifiable**.
- **Onda 1 executada:** PRs #321-#325 (15/15 itens).
- **Onda 2 em execução:** P1 mergeada (PR #326); esta story (Onda2-P2) cobre os itens 2.1 e 2.4 do relatório (docs).
- **Para continuar:** ler `audits/AF-20260702-fable5-upgrade.md` §3 e seguir os itens restantes da Onda 2/3 — as seções §2 e §6 abaixo são registro histórico (pré-re-baseline).

---

## 1. Contexto e decisão

O SINAPSE-AI v1.7.0 (18 squads, 189 agentes, ~339k LOC) passou por uma **auditoria fria** em 04/06/2026 (8 frentes paralelas + verificação adversarial). Veredito: **toolkit de prompts sólido + segurança forte, mas o motor de orquestração autônoma era "teatro"** — reportava `success: true` sem executar. O Caio decidiu **APOSTAR** (caminho C): consolidar o motor como diferencial, contra a recomendação da auditoria (que era cortar/híbrido).

Em 10/06/2026, o Caio pediu uma **ultra-otimização** com foco em qualidade, usabilidade (agents/rules/workflows/tasks), e **principalmente cybersegurança, arquitetura de código e "muros" a levantar** — usando o recém-lançado **Fable 5**. Esta é a iniciativa-mãe que organiza isso.

---

## 2. Estado atual (diagnóstico)

> ⚠️ **[superado pelo re-baseline de 2026-07-02 — ver `audits/AF-20260702-fable5-upgrade.md` e §0.5 acima]** — diagnóstico da auditoria fria de 04/06/2026, mantido como registro histórico.

### Veredito da auditoria
- Como *"Autonomous Development Engine"* (como se vende): **3/10**
- Como *"189 prompts + CLI + guardrails de segurança"* (o que é): **7/10**

### Saúde por dimensão
| Dimensão | Nota | Estado |
|---|---:|---|
| Segurança | 9/10 | Genuinamente forte (secret-scanner fail-closed, anti zip-slip/SSRF, assinatura Ed25519) |
| Testes | 7.5/10 | Majoritariamente reais (734 verdes) |
| Core auxiliares | 5/10 | Metade real, metade vaporware |
| Arquitetura & Boundary | 5/10 | Grafo acíclico são, **proteção L1-L4 desligada** |
| Multi-IDE parity | 5/10 | Gerador real, paridade perde 92% da persona em Cursor/Copilot |
| CLI & Installer | 4/10 | Ilhas boas + redundância + bug de corrupção no `uninstall` |
| Core orquestração | 4/10 | O coração era teatro (em correção) |
| Interligação agentes | 4/10 | Prosa, não código — 177/189 agentes não-endereçáveis por código |
| Governance/Constitution | 4/10 | Lint tem dentes; enforcement comportamental é oco |

### Topologia
- **18 squads** (`squads/`): claude-code-mastery, animations, artdir, brand, cloning, commercial, content, copy, council, courses, cybersecurity, design, finance, growth, paidmedia, product, research, storytelling.
- **Core** (`.sinapse-ai/core/`): 28 módulos. Reais: orchestration, execution, permissions, grounding, mcp, registry, telemetry. **Vaporware (sem consumidor real):** code-intel, synapse (8-layer), ideation, workflow-intelligence.
- **Development:** 211 tasks · 15 workflows · 74 templates · 8 checklists.
- **22 hooks de enforcement** (`.claude/hooks/`) + **22 rules** (`.claude/rules/`).

### Os 3 furos P0 de "muros" (o que o Caio chamou de muros a levantar)
1. **Proteção de fronteira L1-L4 DESLIGADA** — `core-config.yaml:383` tem `frameworkProtection: false # TEMPORARY: TOK-3 contributor mode`. `settings.json` tem zero deny rules.
2. **Article VIII (Mandatory Delegation, NON-NEGOTIABLE) é fail-open** — `enforce-delegation.cjs` lê `.sinapse/session-state.json`, arquivo gitignored e **inexistente** → o hook deixa passar um `rm -rf` de orquestrador. CLAUDE.md afirma "gates auto-block" — falso.
3. **Sem branch protection no GitHub** — `main` sem required checks; lint bom vira advisório.

---

## 3. O que JÁ foi feito (épico de consolidação)

Branch: `caio/epic/orchestration-consolidation` (só local, não pushed). HEAD `5a1eeb4`. 734 testes verdes.

| Frente | Estado | O que mudou |
|---|---|---|
| Auditoria + Épico | ✅ | Cold review + decisão de apostar + plano de 7 frentes |
| **F0a — Honestidade** | ✅ | Stubs pararam de "mentir verde"; 3 testes viraram trava anti-regressão |
| **F1.1 — Executor real** | 🔧 em progresso | `SubagentDispatcher` real virou executor default; epic-3 (Spec) gera spec via agente real; epic-4 (Execução) delega ao `BuildOrchestrator` (mata duplicação) |

**Furo honesto a resolver primeiro:** tudo foi testado **com mock**. O caminho real (`claude` de verdade) **nunca rodou uma vez**.

### Gotchas críticos (não quebrar)
- `_realExecutionAllowed()` + guard em `_createDispatchExecutor` bloqueiam invocação real de `claude` dentro do test runner (detecta `JEST_WORKER_ID`) salvo `SINAPSE_REAL_DISPATCH=1`. **Sem isso, `npm test` invoca `claude` de verdade e queima tokens.**
- `claude` ESTÁ no PATH — qualquer caminho real chama o CLI.
- Commits que tocam `.sinapse-ai/` fazem o pre-commit regenerar manifest + entity-registry → precisa de commit `chore:` extra pra limpar o working tree.
- `frameworkProtection` está OFF — por isso dá pra editar `.sinapse-ai/core/`. **Não religar antes da Frente B (F0.1).**

---

## 4. O Fable 5 (modelo da ultra-otimização)

Lançado **09/06/2026** (depois do cutoff jan/2026 — daí não estar no conhecimento-base). Primeira versão pública da classe **"Mythos"**, um tier **acima do Opus 4.8**.

| Dado | Valor |
|---|---|
| Model ID | `claude-fable-5` (alias `fable`) |
| Capacidade | >10% acima do Opus 4.8 em SWE/knowledge work/vision |
| Contexto / output | 1M / 128K tokens |
| Preço | $10/$50 por M (2× Opus 4.8) — **grátis no Claude Max de 09/06 a 22/06/2026** |
| Ativação Claude Code | `/model fable` · picker · `claude --model fable` · `ANTHROPIC_MODEL` · settings |
| ⚠️ Salvaguarda | **Bloqueia cyber-exploitation / bio / chem / distillation no nível do modelo e faz fallback pro Opus 4.8** (<5% das sessões) |

**Nuance crítica:** o foco principal do Caio é cybersegurança, e o Fable 5 é o modelo que faz fallback em cyber. Mas o trabalho aqui é **defensivo** (hardening do próprio framework, levantar muros) — não exploit-dev — então raramente dispara a salvaguarda. Quando disparar, o fallback é transparente e o Opus 4.8 já é 9/10 em segurança. **Não é bloqueador.**

Fontes: [Anthropic](https://www.anthropic.com/news/claude-fable-5-mythos-5) · [Claude Code model-config](https://code.claude.com/docs/en/model-config) · [TechCrunch](https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/)

---

## 5. Plano de Orquestração (como conduzir)

- **Eu coordeno; frotas de agentes em paralelo executam cada dimensão.** Multi-agente exaustivo.
- **Verificação adversarial obrigatória:** nenhum achado vira verdade sem N verificadores tentando refutá-lo primeiro (o método que pegou o "teatro" na auditoria de 04/06). Maioria precisa confirmar.
- **Loop-until-dry** nas auditorias de descoberta (segurança, arquitetura): rodar finders até K rodadas consecutivas não acharem nada novo.
- **Model routing:** Fable 5 pro pesado (arquitetura, segurança, motor); tiers menores (Haiku/Sonnet) pro mecânico (lint, contagem, rename) — não queimar token à toa.
- **Documentation-First:** cada frente nova gera story validada antes de qualquer código (regra NON-NEGOTIABLE do framework). O épico de consolidação já tem suas stories.
- **Isolamento:** mutações paralelas de arquivos usam worktree pra não conflitar.

---

## 6. Plano de Ação (4 frentes)

> ⚠️ **[superado pelo re-baseline de 2026-07-02 — ver `audits/AF-20260702-fable5-upgrade.md` e §0.5 acima]** — plano original de 10/06/2026, mantido como registro histórico. Frente A foi fechada (veredito HÍBRIDO); B/C/D foram parcialmente absorvidas pelas Ondas 1/2/3 do novo relatório.

| Frente | Ataca | Itens concretos |
|---|---|---|
| **A — Terminar o motor** | Fecha o épico de consolidação | Validar a aposta (§7); F2 (mapear 177 agentes no `subagent-dispatcher.js:46`); F4 (planning via `claude`, não grep de checkbox); F5 (gates IDS G5 + gate-evaluator com input real → 1 gate que bloqueia de verdade); F3 (podar `terminal-spawner→pm.sh` e epic-executors stub); F6 (decidir synapse engine: cabear ou cortar); F7 (suíte E2E anti-teatro como required check) |
| **B — Muros (cyber)** 🔴 | Defesa do framework | Religar `frameworkProtection: true` (**por último**); consertar Article VIII fail-open (`enforce-delegation.cjs` + `.sinapse/session-state.json`); branch protection no GitHub como required checks; auditoria de segurança nova via Fable 5 (defensiva); hardening dos achados |
| **C — Arquitetura** | Limpar o código | Podar vaporware sem consumidor (code-intel, synapse, ideation, workflow-intelligence — cabear ou cortar); consolidar os 3 entry points de CLI sobrepostos; corrigir `uninstall` que corrompe git (não reseta `core.hooksPath`); `config-loader` deprecated ainda exportado pelo barrel |
| **D — Usabilidade/Qualidade** | Agents/rules/workflows/tasks | Uniformizar schema dos 189 agents (86 YAML, 69 headers, 22 sem nada — só 20 orqx validados); paridade multi-IDE (Cursor/Antigravity/Copilot recebem stubs de 29-44 ln, 92% da persona descartada); auditar uso real das 211 tasks / 15 workflows; coverage real (hoje 24% decorativo, orchestration/execution excluídos) |

### Sequência e dependências
```
A.checkpoint (validar a aposta — §7)
   ├─> A.F2 + A.F4 (paralelo)  ┐
   ├─> B.auditoria + C.auditoria + D.auditoria (frotas paralelas Fable 5)  │
   │        ↓ (verificação adversarial em cada achado)                      │
   └─> A.F3 (poda) ──> A.F5 (gates com dentes) ──> A.F6 (synapse) ──────────┤
                                                                            ↓
                                                  Consolidação + correções
                                                                            ↓
                                          B.F0.1 — religar os muros (POR ÚLTIMO)
```
**Por que F0.1 por último:** religar `frameworkProtection` antes trava a própria cirurgia no `.sinapse-ai/core/`.

---

## 7. Primeiro passo (ponto de retomada exato)

**Checkpoint matar/dobrar — validar que o motor real funciona:**
- Criar uma story de teste mínima num projeto-sandbox isolado (NÃO no próprio repo).
- Rodar o epic-3 (ou o pipeline) com `SINAPSE_REAL_DISPATCH=1` e ver se gera um **spec real via `claude`**.
- Medir: o motor produz resultado **melhor, mais barato ou mais portável** do que rodar os mesmos agentes nativamente?
  - **Sim →** dobrar (seguir A.F2→F7 + frentes B/C/D).
  - **Não →** converter a aposta no caminho híbrido (B) com o aprendizado pago. Sem vergonha — decisão por evidência.
- Custo: poucos tokens + ~30s. **Pedir OK ao Caio antes (gasta token real).**

---

## 8. Definição de pronto (sucesso do épico-mãe)

- [ ] `sinapse orchestrate <story>` invoca agentes reais e produz código/testes reais (não stubs).
- [ ] Zero `return { success: true }` sem trabalho (lint anti-teatro verde no CI).
- [ ] Um único caminho de execução (3 linhagens viram 1).
- [ ] Os 177 agentes de squad endereçáveis pelo motor.
- [ ] ≥1 gate capaz de bloquear de verdade.
- [ ] Os 3 muros P0 levantados (frameworkProtection on, Article VIII fail-closed, branch protection ativa).
- [ ] Vaporware podado ou cabeado (nada "inteligente" sem consumidor).
- [ ] Schema dos 189 agents uniforme; paridade multi-IDE sem perda de 92%.
- [ ] Claims do README/Constitution alinhados ao que o motor faz de fato.
