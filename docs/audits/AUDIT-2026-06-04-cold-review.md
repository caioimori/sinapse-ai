# Auditoria Fria — SINAPSE-AI v1.7.0

> **Data:** 2026-06-04 · **Método:** 8 frentes paralelas + verificação adversarial + spot-checks manuais dos achados críticos.
> **Escopo:** código inteiro — 339k LOC JS/TS · 1.169 arquivos de código · 3.135 markdowns · todas as features e interligações.
> **Status:** Auditoria fechada. Decisão de rumo tomada (ver §8).

---

## 1. Veredito

> **SINAPSE-AI é um toolkit de prompts com engenharia de borda séria, embrulhado como um "motor de orquestração autônoma" que — no caminho que o usuário realmente aciona — não executa nada: apenas reporta `success: true`.**

Cinco frentes independentes, sem coordenação, convergiram no mesmo padrão estrutural: *a lógica existe, é bem-escrita e testada, mas o input que a alimentaria nunca é cabeado — e o caminho real vem desativado por flag ou órfão de chamador.*

**A ironia central:** o framework define como leis NON-NEGOTIABLE o **No Invention** (Art. IV), a **Metrics Accuracy** (Art. VII) e os **Gates que auto-bloqueiam** — e seus três maiores defeitos são exatamente features inventadas que não rodam, sucesso reportado que não corresponde à realidade, e gates que não bloqueiam. Viola as três leis que mais prega.

**Dois números honestos:**
- Como *"Autonomous Development Engine"* (como se vende): **3/10**
- Como *"189 prompts + CLI com bons guardrails de segurança"* (o que de fato é): **7/10**
- O abismo entre os dois é o diagnóstico.

## 2. Saúde por dimensão

| Dimensão | Score | Estado |
|---|---:|---|
| Segurança | 9/10 | Genuinamente forte |
| Testes | 7.5/10 | Majoritariamente reais |
| Core — subsistemas auxiliares | 5/10 | Metade real, metade vaporware |
| Arquitetura & Boundary | 5/10 | Grafo são, proteção desligada |
| Multi-IDE parity | 5/10 | Gerador real, paridade lossy |
| CLI & Installer | 4/10 | Ilhas boas, redundância + bug de corrupção |
| Core — orquestração/execução | 4/10 | O coração é teatro |
| Agentes/Squads & interligações | 4/10 | Interligação é prosa, não código |
| Governance & Constitution | 4/10 | Lint tem dentes; enforcement comportamental é oco |

## 3. BLOCO A — O motor central é encenação (P0)

### P0-1 · A orquestração autônoma reporta sucesso sem fazer trabalho
- `core/orchestration/agent-invoker.js:404` — `// Default: return simulated result` → retorna `status: 'simulated'`.
- `core/orchestration/executors/epic-4-executor.js:221` — `// For now, return stub results` → empurra `{ success: true }` fabricado; `_runTests:262` retorna `ran: false`; `_createStubSpec` grava markdown placeholder e segue.
- Três linhagens de execução paralelas; **duas são 100% simulação** (`scripts/pm.sh:395` literalmente faz `echo 'Agent execution would happen here...'`). A única real (`execution/build-orchestrator.js`, roda `claude` via `runSafe`) é um quarto caminho à parte, acionado por `*build`, não pelo orquestrador anunciado.

### P0-2 · As "interligações entre agentes" não existem como código
- `delegation-matrix.json` é consumido só por `resolve-codex-delegation.js:81` (lookup + `console.log`, não spawna nada).
- O único motor real de spawn (`core/execution/subagent-dispatcher.js`, 888 ln, testado) está **órfão** (zero chamadores em produção). `build-orchestrator.js:89` traz `useSubagentDispatch: false` hardcoded. Só mapeia ~10 agentes genéricos — **nenhum dos 177 agentes de squad é endereçável por código**.

### P0-3 · Subsistemas "inteligentes" são vaporware
| Subsistema | Promete | É | Evidência |
|---|---|---|---|
| `code-intel` | Análise de código (callers, complexidade) | Caminho AST exige MCP nunca instalado → lookup de YAML com `line:1`/`lines:0` | `code-graph-provider.js:37,61`; `registry-provider.js:300,501` |
| `synapse` (8-layer) | Injeção de contexto em 8 camadas | Produz XML vazio; `.synapse/` não existe, manifest nunca passado, L3-L7 desativadas | `runtime/hook-runtime.js:46`; `engine.js:184` |
| `ideation` | "AI-powered analysis" | `execSync('grep …')` + conselho enlatado. Sem consumidor | `ideation-engine.js:5,344` |
| `workflow-intelligence` (4.400 ln) | "Intelligence" preditiva | Lookup YAML + soma ponderada. Sem consumidor de runtime | `workflow-intelligence/index.js:186` |

## 4. BLOCO B — Os guardrails não seguram (P0)

### P0-4 · Proteção de fronteira L1-L4 DESLIGADA no que é entregue
A doc afirma "deny rules em `.claude/settings.json`" — **`settings.json` tem zero deny rules**. A proteção real são dois hooks, ambos no-op porque `core-config.yaml:383` traz `frameworkProtection: false # TEMPORARY: TOK-3 contributor mode`.

### P0-5 · Article VIII (Mandatory Delegation, NON-NEGOTIABLE) é fail-open permanente
`enforce-delegation.cjs` lê `lastAgent` de `.sinapse/session-state.json` — arquivo **gitignored e inexistente** (verificado: `git check-ignore` confirma). O único writer (`agent-exit-hooks.js`) admite no cabeçalho: *"Actual integration requires modifications to the agent activation framework (not in scope for this story)"*. Sem o arquivo, o hook deixa passar um `rm -rf` de orquestrador. CLAUDE.md afirma "Gates auto-block violations" — falso.

### P0-6 · Sem branch protection, o lint (que é bom) vira advisório
Verificado: `branches/main/protection` → `404`; `rulesets` → `[]`. Há CI com dentes, mas se os jobs não forem *required status checks*, PR pode mesclar com eles vermelhos e push direto em `main` é possível. (Confirmação 100% exige conta admin.)

## 5. P1 — Dívida séria

| Achado | Evidência |
|---|---|
| `uninstall` corrompe git do usuário (deleta git-hooks mas não reseta `core.hooksPath`) | `uninstall.js` vs `git-hooks-installer.js:353` |
| 3-4 árvores de agentes divergentes sincronizadas por cópia manual (.codex: 185 hand-maintained) | `brand-orqx.md`: 149 ln (squads) vs 95 (.codex) |
| Paridade multi-IDE lossy — Cursor/Antigravity/Copilot recebem stubs de 29-44 ln (92% da persona descartada) | `transformers/cursor.js:28` |
| Rollback de install é código morto — `InstallTransaction` (446 ln) sem chamadores | `bin/utils/install-transaction.js` |
| `packages/installer` quebrado — `main`/`bin` apontam pra `src/index.js` inexistente | `packages/installer/package.json:5` |
| Schema de agente não-uniforme — 86 YAML, 69 headers, 22 sem nada; só os 20 orqx validados | varredura dos 177 |
| `config-loader` deprecated (remoção v4.0.0) ainda é o exportado pelo barrel | `config/config-loader.js:1` |
| Coverage decorativo (24%); `core/orchestration` e `core/execution` excluídos; 27 testes hard-excluídos | `jest.config.js:19,84,146` |
| `release-readiness.js` órfão, referencia "v10.0.0" num pacote v1.7.0 | `scripts/release-readiness.js:13` |
| 3 entry points CLI sobrepostos; `sinapse install` se auto-declara deprecated | `bin/sinapse.js:963` |
| Constitution: v2.2.0 (header) vs v1.0.0 (rodapé); claims 189/175 divergem | `constitution.md:3,388` |

## 6. Pontos fortes reais (sem condescendência)

- **Segurança (9/10):** `.env` não commitado (só placeholders); secret-scanner fail-**closed** com 20+ padrões + entropia de Shannon (`secret-scanner-core.js:30`); defesa contra zip-slip e SSRF (`squad-downloader.js:41,394`); assinatura de manifesto com minisign/Ed25519; validadores anti-vazamento de contexto pessoal no pacote npm.
- **Testes majoritariamente reais:** 9.374 blocos `it`, 19.151 assertions (densidade 2.04), só 0.08% tautologias; 607 testes de segurança/installer rodados passaram.
- **Engenharia defensiva consistente:** `runSafe` (cross-spawn, anti-injeção); atomic writes; circuit breakers; `git-hooks-installer` e `postinstall.js` exemplares.
- **Lint estático tem dentes e está wired** (pre-push + CI): orqx-discipline, no-personal-leaks, cross-refs, manifest-parity.
- **Contagens honestas e auto-corrigidas** — 18 squads / 189 agentes batem com o disco.
- **Grafo de dependência do core acíclico.**

## 7. Diagnóstico estratégico

O SINAPSE-AI tem duas naturezas que não conversam:
1. **O que funciona:** prompt framework (189 personas) + CLI de install/MCP/doctor + guardrails de segurança + disciplina de lint. Entrega valor real hoje.
2. **O que afirma ser e não funciona:** Autonomous Development Engine que orquestra agentes em código. Esse motor é encenação.

**Causa-raiz:** stories empilhadas sem consolidação. O código está cheio de `// For now, return stub` / `// In full implementation` / `Story X.Y` — features começadas, marcadas como "done" na doc, nunca cabeadas ao caminho real. Não falta engenharia; falta fechar o laço entre o que foi escrito e o que executa.

## 8. Decisão de rumo (2026-06-04)

Três caminhos foram colocados: **(A) cortar tudo** → prompt-framework puro; **(B) híbrido** → cortar o teatro e preservar só o `*build` supervisionado; **(C) apostar** → épico de consolidação que faz o motor funcionar de verdade.

**Recomendação da auditoria:** B (híbrido), por entender que o motor JS compete com a orquestração nativa do Claude Code.

**Decisão do dono do produto:** **C — APOSTAR.** Consolidar o motor de orquestração como diferencial do produto.

→ Plano de execução: [`docs/epics/epic-orchestration-consolidation/`](../epics/epic-orchestration-consolidation/README.md)
