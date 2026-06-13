# Deep-Dive de Racionalização — SINAPSE-AI

> Data: 2026-06-13 · Branch: `caio/epic/orchestration-consolidation`
> Lei travada (decisão do dono): **potencializar, não cortar**. Fundir duplicata real no módulo mais forte É potencializar. Corte só pode ser PROPOSTO quando comprovadamente sem valor, sem consumidor e sem caminho de potencialização.
> Metodologia: 28 módulos do core + 5 frentes especiais, cada achado submetido a verificação adversarial (auditor vs cético com evidência concreta). Consumo dinâmico (dispatch por string, registries YAML, paths em markdown, subcommands montados em runtime) foi rastreado além de require/import direto.

---

## 1. Resumo executivo

O framework está em estado saudável no nível de código: 35 de 40 módulos de orquestração/execução têm testes reais, e os subsistemas mais críticos (motor de contexto, IDS, doctor, registry, execução autônoma) funcionam quando invocados. O problema central não é capacidade ausente — é **cabeamento incompleto**: os fluxos mais poderosos (pipeline autônomo, IDS, graph dashboard, diagnostics do motor de contexto) existem e funcionam mas não têm porta de entrada no CLI principal, ficando acessíveis só por chamada programática. As poucas duplicatas reais são consolidáveis sem perda de capacidade, e há apenas um único candidato legítimo a corte em todo o repositório.

---

## 2. Mapa do core (28 módulos)

| Módulo | Veredicto | Ação recomendada | Prioridade | Contestado? |
|---|---|---|---|---|
| code-intel | funcional | potencializar (criar hook entry-point ausente) | P1 | não |
| config | funcional | potencializar (adoção interna + delegar migrate à CLI) | P1 | não |
| core/docs | misto | potencializar (corrigir bug de manifest + 2 paths stale + cabear runtime) | P2 | não |
| doctor | funcional | potencializar (guard de teste em prod + ampliar auto-fix) | P1 | não |
| elicitation | funcional | potencializar (deletar duplicata órfã + expor `sinapse create`) | P2 | não |
| errors | funcional | potencializar (ampliar consumo + categoria AGENT) | P1 | não |
| events | misto | potencializar (cabear emitSession*/emitBob* restantes) | P2 | não |
| execution | misto | potencializar (corrigir bug WaveAnalyzer + cabear camada paralela) | P1 | não |
| external-executors | funcional | potencializar (2º provider + doctor check) | P2 | não |
| graph-dashboard | misto | potencializar (cabear `sinapse graph` no CLI) | P1 | **sim (confirmado+reforçado)** |
| grounding | misto | potencializar (deduplicar Layer 1 → config-loader.cjs) | P2 | não |
| health-check | misto | potencializar (trocar backend de `sinapse health` p/ os 35 checks) | P2 | não |
| ideation | funcional | potencializar (atualizar registry stale + cabear ao doctor) | P2 | não |
| ids | funcional | potencializar (expor no bin + implementar G6) | P1 | não |
| logger | funcional | potencializar (ampliar adoção em módulos core) | P1 | não |
| manifest | funcional | potencializar (integrar CSV ao doctor / consolidar com registry) | P2 | não |
| mcp | funcional | potencializar (cabear `sinapse mcp` no switch) | P1 | não |
| memory | misto | potencializar (alinhar verify script + stubs siblings) | P1 | **sim (urgência rebaixada)** |
| migration | misto | potencializar (YAMLs viram fonte de verdade real) | P3 | **sim (confirmado)** |
| orchestration | funcional | potencializar (cabear `*orchestrate` no CLI) | P1 | não |
| permissions | funcional | potencializar (CLI `sinapse mode` + deduplicar classificação) | P2 | não |
| quality-gates | funcional | potencializar (task @devops invocar o módulo, não reimplementar) | P1 | não |
| registry | funcional | potencializar (clarear naming + adicionar build ao lifecycle) | P1 | não |
| session | funcional | potencializar (documentar 3 namespaces + remover wrapper deprecated) | P2 | não |
| synapse | misto | potencializar (cabear diagnostics ao doctor — já há consumidores via skill) | P1 | **sim (auditor refutado em parte)** |
| telemetry | funcional | potencializar (endpoint HTTP + aggregator DORA) | P2 | não |
| ui | funcional | potencializar (`sinapse status --watch` + renderJSON) | P2 | não |
| utils | misto | potencializar (consolidar output-formatter duplicado — direção invertida) | P2 | **sim (auditor refutado em parte)** |

---

## 3. Frentes especiais

### 3.1 Binários (`bin/`)

3 binários públicos (`sinapse`, `sinapse-ai`, `sinapse-delegate`) e 5 internos. Os dois principais têm identidades distintas e DEVEM coexistir: `cli.js` (`sinapse-ai`) é o router de install/manage; `sinapse.js` (`sinapse`) é o launcher do Claude Code com branding (comportamento default exclusivo, prioridade P0 — não tocar).

Achados acionáveis:
- **Bug silencioso confirmado:** `sinapse ids:query` e `sinapse graph --deps` caem no default case de `sinapse.js:1215-1218` e são passados como args ao Claude Code. A CLAUDE.md documenta `sinapse graph --deps` como válido, mas ele não funciona via binário. Cabear `ids:*` e `graph` no switch (P1).
- **Overlap install/update/uninstall:** auditor propôs fundir tudo em `cli.js`, mas o cético **refutou** — `sinapse.js` opera escopo **local** (cwd) e `cli.js` opera escopo **global** (`~/.sinapse/`). São operações diferentes, não duplicatas. A fusão válida é só `chrome-brain` (shell fino sem valor agregado).
- `sinapse-init.js`, `postinstall.js`, `sinapse-minimal.js`: corretos como estão (fallback/setup/deprecação). Manter.

### 3.2 Tasks órfãos

De 211 tasks, **11 confirmadas órfãs** (zero refs fora de registries auto-gerados). 95% do catálogo é saudável. Os 4 registries auto-gerados inflam contagens; sem eles, o quadro real aparece.

- **9 das 11 não são lixo** — são gaps de cabeamento (task existe, código existe, falta o binding task→agent): `ids-governor/health/query`, `yolo-toggle`, `delegate-to-external-executor`, `publish-npm`, `review-contributor-pr`, `sync-registry-intel`. Cabear nas dependencies.tasks dos agentes (P2).
- **Único corte legítimo:** `test-validation-task.md` — fixture auto-declarado "Test/Validation Only" (2025-01-17), zero consumidor, sem caminho de potencialização. Confirmado pelo cético. Proposta de corte (precisa de OK do dono).
- **Fusões contestadas e ajustadas** (ver §4): `github-issue-triage`, `db-supabase-setup` e `update-sinapse` foram **refutadas** pelo cético com evidência — NÃO entram como fusão/deprecação.

### 3.3 Workflows órfãos

De 16 workflows, **3 são cabeados em código real** (`development-cycle`, `greenfield-fullstack`, `brownfield-discovery` — P0, manter). Os demais são consumidos por LLM como contexto (consumo válido) ou têm cabeamento parcial.

- **spec-pipeline.yaml:** auditor disse "nunca lido"; cético **refutou** — tem consumidores reais via `workflow-chains.yaml` (dispatch de agente em runtime) e `entity-registry.yaml`. O que está realmente morto é só a variável `pipelinePath` em `epic-3-executor.js`. Achado ajustado: não é inerte, é variável dead-code interna.
- **qa-loop.yaml / greenfield-variants / brownfield-variants:** confirmados inertes em código (handlers hardcoded). Cabear routing por `project_type` no handler é o caminho (P2).
- **Fusões de variants (greenfield/brownfield trios):** auditor propôs fundir; cético **refutou parcialmente** — os variants têm contratos distintos (dependency chains, early-exit routing, agent-team bundles). A potencialização correta é cabear o handler a despachar para o variant certo, mantendo os arquivos separados (não fundir).
- **story-development-cycle vs development-cycle:** auditor propôs fusão; cético **refutou** — são camadas diferentes (instrução-LLM vs orquestração-máquina), com consumidores distintos. Não fundir.

### 3.4 Linhagens de orquestração e gargalos

Duas linhagens coexistem sem duplicação real: **Bob** (PM/autônomo) e **ADE/MasterOrchestrator** (Epic 0). Convergem no `SubagentDispatcher`. Os dois `parallel-executor` têm propósitos distintos (fases de workflow vs provedores de IA) — mislabel já corrigido.

Gargalos confirmados:
- **CLI gap (P1):** BobOrchestrator e MasterOrchestrator não têm porta de entrada no `sinapse.js`. Os pipelines mais poderosos só rodam por invocação programática. Viola Art. I (CLI First).
- **I/O serial (P2):** MasterOrchestrator chama `_saveState()` 4-5x por pipeline. Colapsável.
- **Hops redundantes (P2):** AgentInvoker lê agente+task do disco sem cache a cada invocação.
- **WIS "degradado" — REFUTADO:** auditor afirmou que falta `.sinapse/synapse-runtime.json`. Cético **refutou com prova**: esse arquivo não existe nem é referenciado por código. O bootstrap gera `.synapse/constitution` (que existe — verificado), o hook checa o **diretório** `.synapse/` (que existe — verificado), e o WaveAnalyzer lê `workflow-patterns.yaml` (que existe). O motor NÃO está degradado. Achado descartado.

### 3.5 Coverage real

O coverage de 24% é **honesto dentro do escopo declarado**, não fabricado. `jest.config.js:84-85` exclui `core/orchestration` e `core/execution` de `collectCoverageFrom` (verificado). A auditoria anterior estava certa na suspeita (módulos críticos fora da medição), errada no diagnóstico ("decorativo").

- Os módulos excluídos TÊM testes reais (35 de 40), apenas não contam na métrica.
- 5 módulos sem teste dedicado: `checklist-runner`, `subagent-prompt-builder`, `fast-path-gate` (confirmados sem cobertura); `tech-stack-detector` e `skill-dispatcher` foram **refutados** — têm cobertura via testes de integração. `fast-path-gate` é o único totalmente órfão (só no barrel export).
- Diferença 24% (CI Node 24) vs ~35% (local Node 22) = 24 suites skipped por incompatibilidade de Node, documentado no próprio config.

---

## 4. Achados CONTESTADOS — julgamento

### 4.1 synapse/diagnostics — "inerte no CLI"
- **Auditor:** `runDiagnostics` não tem consumidor (zero grep em `bin/commands/doctor.js`).
- **Cético (refutou):** há consumo via dispatch por string — `.claude/commands/synapse/tasks/diagnose-synapse.md` invoca via `node -e require(...)`, 6+ agentes Codex declaram o skill `synapse:tasks:diagnose-synapse`, e `scripts/package-synapse.js` empacota o módulo para distribuição.
- **Julgamento — cético vence parcialmente.** O módulo TEM consumidor real (via skill system), então não é "inerte" no sentido absoluto. Mas o gap legítimo permanece: não está no `sinapse doctor` (CLI público). Ação ajustada: **cabear ao doctor** continua válido (P1), mas a justificativa muda de "ativar código morto" para "expor no CLI um diagnóstico que hoje só roda via skill". Integração é literalmente 1 linha (`result.formatted += '\n' + runDiagnostics(cwd)`).

### 4.2 graph-dashboard — routing gap
- **Auditor:** falta `case 'graph'` em `sinapse.js`.
- **Cético (confirmou + reforçou):** o gap é maior — `claude-md-template-v5.test.js:93-98` é teste CI-blocking que exige `sinapse graph --deps` no template instalado em todo projeto cliente. O contrato de interface está distribuído, mas o roteamento não existe.
- **Julgamento — ambos convergem, cético reforça.** Achado mantido e **escalado em justificativa**: não é só conveniência, é um contrato de interface publicado quebrado. Ação P1 firme: cabear `case 'graph'` no switch.

### 4.3 memory — "test in-module runs in CI and will fail"
- **Auditor:** `active-modules.verify.js` testa exports inexistentes e quebra CI (risco máximo).
- **Cético (refutou):** o arquivo termina em `.verify.js`, e `jest.config.js:10-16` só casa `*.test.js`/`*.spec.js`. **Verificado independentemente** — o arquivo nunca roda em CI.
- **Julgamento — cético vence.** O contract gap existe no código mas NÃO bloqueia CI. Ação rebaixada de "urgência CI-blocking" para **tech debt low-friction**. Potencialização (adicionar `FeedbackType` + métodos da Story 9.4) continua válida, mas não é emergência. Prioridade mantida P1 só pela coerência do módulo, sem o framing de emergência.

### 4.4 utils — output-formatter e security-utils
- **Auditor:** consolidar `infrastructure/output-formatter` → `core/utils`; redirecionar `validate-paths.js` para `security-utils`; cabear `build-orchestrator` como caller.
- **Cético (refutou em parte):** (a) os TESTES importam da cópia de **infra**, não do core — a consolidação correta é **invertida** (core importa de infra, ou move testes para core); (b) `validate-paths.js` faz `validatePaths()` (varre SKILL.md) — domínio diferente, não é reimplementação de `validatePath`; (c) `build-orchestrator.generateReport()` já gera Markdown e não recebe objeto `agent` — `PersonalizedOutputFormatter` não é plugável ali sem refactor.
- **Julgamento — cético vence na direção e nos detalhes.** A duplicata `PersonalizedOutputFormatter` é real (diff só de whitespace) e consolidável — mas na direção que o cético apontou. Os outros dois sub-achados do auditor (security-utils cabling + build-orchestrator caller) são descartados. Ação ajustada: consolidar output-formatter mantendo a versão de infra como fonte (tem os consumidores), P2.

### 4.5 Fusões de tasks refutadas
- **github-issue-triage → triage-github-issues:** cético **refutou** — `elicit: true` já existe no alvo, são entidades de lifecycle diferente (experimental vs production), e `github-issue-triage` ancora uma cadeia Story GHIM-001 (script + checklist + 2 workflows CI). Fusão **descartada**. Manter ambos.
- **db-supabase-setup → setup-database:** cético **refutou** — não tem 2 refs em docs, tem 6 incluindo 3 scripts de dispatch vivos (`atomic-layer-classifier.js`, `performance-and-error-resolver.js`) que classificam por filename, e os dois arquivos pertencem a atomic layers diferentes (Organism vs Config). Fusão/deprecação **descartada**.
- **update-sinapse → `sinapse update`:** cético **refutou** — alvos diferentes (sync project-local via sparse-clone vs refresh global de agentes). O script é v5.2/175 linhas (não v4.0/15 linhas), registrado como L2 ativo e distribuído. Deprecação **descartada**. Único ajuste real: corrigir o header stale do MD.

### 4.6 fast-path-gate vs fast-track.yaml (workflow)
- **Auditor:** "potencializar conectando fast-path-gate.js ao fast-track.yaml".
- **Cético (refutou):** são domínios ortogonais — `fast-track.yaml` é elegibilidade de **workflow SDC** (bugfix pula validação); `fast-path-gate.js` é elegibilidade de **execução** (task automatizável em batch). E `fast-path-gate` tem consumidor real no barrel (`index.js:160`).
- **Julgamento — cético vence.** Não conectar os dois. `fast-track.yaml` é contrato formal da skill (manter). `fast-path-gate.js` está cabeado no barrel mas sem caller funcional — candidato a teste unitário puro (P3), não a fusão com o YAML.

### 4.7 epic-executors excluídos da métrica (confirmado)
- Cético confirmou: `jest.config.js:84` exclui toda `orchestration/**`, então 1.314 linhas de executors testados não contam nos 24%. Sem contestação — fato aritmético.

---

## 5. Plano de racionalização P0 → P3

> Regra: nenhum item de corte entra sem OK explícito do dono. Achados refutados pelo cético entram ajustados ou são descartados (marcados).

### P0 — Preservar (não tocar)
| Item | O quê | Risco se mexer |
|---|---|---|
| `sinapse.js` default launcher | Comportamento `sinapse` sem args = abre Claude Code com branding | Quebra contrato público do binário principal |
| 3 workflows cabeados | `development-cycle`, `greenfield-fullstack`, `brownfield-discovery` | São o motor real de execução |
| Exclusão de coverage | Manter exclusão de orchestration/execution OU mover para integration suite consciente | Mexer sem plano infla/desinfla métrica artificialmente |

### P1 — Cabeamento crítico (alto ROI, zero corte)
| Item | Como | Risco | OK do dono? |
|---|---|---|---|
| Cabear `ids:*` no CLI | Adicionar `case 'ids:...'` em `sinapse.js` delegando a `bin/sinapse-ids.js` (ou extrair `bin/commands/ids.js`) | Baixo | Não |
| Cabear `graph` no CLI | `case 'graph'` → `require('.sinapse-ai/core/graph-dashboard/cli').run(...)`; fecha contrato CI do template | Baixo | Não |
| Cabear `mcp` no CLI | `case 'mcp'` → `cli/index.js` (padrão dos cases workers/config/qa) | Baixo | Não |
| Cabear `*orchestrate` no CLI | `case 'orchestrate'` → `cliCommands.orchestrate()` (expõe pipeline autônomo) | Médio (caminho quente) | Não |
| Criar hook code-intel ausente | `.claude/hooks/code-intel-pretool.cjs` (~30 linhas, já mapeado no installer + testes esperam) | Baixo | Não |
| Diagnostics ao doctor | `result.formatted += runDiagnostics(cwd)` em `bin/commands/doctor.js:47` (1 linha; já tem consumidor via skill) | Baixo | Não |
| Corrigir bug WaveAnalyzer | `WaveAnalyzer = require(...).WaveAnalyzer` em `wave-executor.js:15` (named export, não objeto) | Baixo | Não |
| Implementar IDS G6 | Wrapper do hook ids-pre-push dentro do GateEvaluator (G6 documentado, código só tem G1-G5) | Médio | Não |
| Task @devops invocar quality-gates | `github-devops-pre-push-quality-gate.md` chama `sinapse qa run --layer=1` em vez de reimplementar | Baixo | Não |
| Atualizar registry stale (ideation) | `usedBy` += `bin/commands/ideate.js`, `lifecycle: active` (cabeamento já é real pós-VAPORWARE-1) | Nenhum | Não |

### P2 — Consolidação e adoção (potencialização, fusões só onde confirmadas)
| Item | Como | Risco | OK do dono? |
|---|---|---|---|
| Consolidar output-formatter | core importa de infra (direção corrigida pelo cético); eliminar diff de whitespace | Baixo | Não (é fusão de duplicata = potencializar) |
| Deduplicar grounding Layer 1 | 3 hooks `sinapse-*-grounding.cjs` passam a usar `config-loader.cjs` (-45 linhas) | Baixo | Não |
| Backend de `sinapse health` | Trocar implementação lightweight pelos 35 checks de `core/health-check` + `--output-file` p/ dashboard | Médio | Não |
| Deletar duplicata órfã elicitation | `development/scripts/elicitation-*.js` (cópia divergente, zero consumidor externo) → usar `core/elicitation/` | Baixo | **Sim (é corte de duplicata órfã)** |
| Expor `sinapse create` / `sinapse mode` | Cabear ComponentGenerator e PermissionMode.cycleMode ao CLI | Baixo | Não |
| Cabear variants por project_type | `greenfield-handler.js` e `brownfield-handler.js` despacham por tipo (mantém arquivos separados — fusão refutada) | Médio | Não |
| Cabear tasks órfãs nos agentes | Adicionar 9 tasks (ids-*, yolo-toggle, delegate, publish-npm, review-contributor-pr, sync-registry-intel) nas dependencies.tasks | Baixo | Não |
| Colapsar `_saveState()` redundante | MasterOrchestrator: unificar gravações pós-epic/erro/stub | Baixo | Não |
| Cache de agent/task no AgentInvoker | Eliminar leituras de disco repetidas | Baixo | Não |
| Corrigir bug de manifest (core/docs) | Ancorar regex em `generate-install-manifest.js:70-74`; corrigir 2 paths stale; cabear create-agent.md | Baixo | Não |

### P3 — Higiene e tech debt
| Item | Como | Risco | OK do dono? |
|---|---|---|---|
| **Cortar test-validation-task.md** | Remover de `tasks/` + entity-registry + install-manifest (fixture auto-declarado, zero valor/consumidor/caminho) | Baixo | **SIM — único corte legítimo do repo** |
| Migration YAMLs como fonte de verdade | `analyze.js` lê `module-mapping.yaml` em runtime (hoje duplica constante) | Baixo | Não |
| Corrigir header stale update-sinapse.md | v4.0/15 linhas → v5.2/175 linhas (NÃO deprecar — fusão refutada) | Nenhum | Não |
| Teste unitário fast-path-gate | Pure function, sem deps pesadas (único módulo orch totalmente órfão) | Nenhum | Não |
| Documentar 3 namespaces de session | README do core: session (ativação) vs orchestration/session-state vs synapse/session-manager | Nenhum | Não |
| Memory: alinhar verify script | Adicionar FeedbackType+métodos OU ajustar `.verify.js` (NÃO é CI-blocking — refutado) | Baixo | Não |

---

## 6. Módulos 100% saudáveis (veredicto funcional, sem ação corretiva)

Estes têm consumidores reais, smoke tests passando e responsabilidade bem delimitada. As ações listadas para eles no §2 são **potencializações opcionais**, não correções — o módulo funciona como está:

- **errors** — foundation de erro tipado, 3 consumidores em caminho quente, 13 códigos SNPS_*, registry funcional.
- **ids** — 777 entidades, decision engine TF-IDF, gates G1-G5 no caminho real do SDC, CLI completo, hooks git registrados.
- **logger** — singleton correto, 13 consumidores diretos em `bin/`, zero deps externas.
- **registry** — service-registry (369 workers) + squad-agent-resolver (189 agentes), ambos com consumidores reais (CLI + SubagentDispatcher).
- **external-executors** — `sinapse-delegate` operacional, spawn end-to-end testado, arquitetura limpa.
- **orchestration** — 115 exports, CI gate (bob-integration.yml, 9 suites), SubagentDispatcher real por default.
- **permissions** — caminho de leitura e enforcement (hook PreToolUse) ativos no ciclo de ativação dos 12 agentes.
- **quality-gates** — CLI `sinapse qa run` completamente cabeado e executável (lint/test/typecheck via spawn real).
- **session (core)** — ContextDetector + SessionContextLoader cabeados no Tier 3 do pipeline de ativação.
- **telemetry** — 4 pontos de consumo reais (CLI + gate-evaluator + 2 hooks de sessão), canais ortogonais.
- **ui** — ObservabilityPanel com consumidor real (bob-orchestrator), lifecycle start/stop cabeado.
- **doctor** — 16 checks, exit codes canônicos, cabeado em CLI + postinstall + CI + task health-check.
- **config** — resolveConfig funcional em modo layered, 4+ consumidores estáticos, CLI cabeado.
- **code-intel** — 8 primitivas, circuit-breaker, consumidores reais (graph-dashboard + registry-updater); só falta o entry-point do hook.
- **ideation** — `sinapse ideate` cabeado e verificado (pós-fix VAPORWARE-1), analisadores em Node puro.
- **mcp** — 4 sub-módulos carregam, detectOS/checkLinkStatus funcionais; só falta o roteamento no switch.

---

*Fim do deep-dive. Linhagens, motor de contexto e execução autônoma estão funcionais; a alavanca de maior ROI é fechar os gaps de cabeamento CLI (P1), todos sem corte de capacidade.*
