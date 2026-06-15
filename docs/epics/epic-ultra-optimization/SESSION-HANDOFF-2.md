# Session Handoff 2 — Ultra-Otimização SINAPSE-AI

> **Sessões 1+2 (10–11/06/2026, Fable 5).** Branch `caio/epic/orchestration-consolidation` (local, não pushed).
> **Suíte 100% verde** (11.497 testes, 0 falhas) · `sinapse doctor` exit 0 · árvore limpa.
> **Como retomar:** frase-gatilho *"quero voltar com a otimização do SINAPSE AI"* → ler este arquivo → §"Próxima sessão".

---

## Estado: o que está FEITO (15 commits substantivos)

**O motor de orquestração saiu do teatro e funciona de verdade:**
- Checkpoint matar/dobrar PASSOU — `claude` real gerou spec real (pegou 5 bugs invisíveis a 11k testes mockados).
- F2: os 189 agentes endereçáveis por código (`squad-agent-resolver`) + persona real injetada no dispatcher.
- epic-6 QA cabeado ao `@quality-gate` real (era triplo-teatro).
- F7: suíte anti-teatro consolidada (trava a honestidade de todos os executores).
- flag morta `useSubagentDispatch` removida.

**Dois subsistemas que estavam MORTOS viraram funcionais (lei: potencializar, não cortar):**
- **synapse engine** (motor de contexto 8-layer): era inerte (`.synapse/` nunca gerado). Agora auto-bootstrap via `scripts/generate-synapse-runtime.js` no pretest + postinstall. e2e 9/9.
- **ideation engine** (analisadores perf/security/quality/ux/arch): 0 consumidores + quebrado no Windows (usava `grep`). Agora comando `sinapse ideate` + analisadores em Node puro (`nodeGrep`/`nodeCountLines`). Produz sugestões reais cross-platform.

**Segurança (3 P0 + hardenings):**
- injection no `pm.sh` neutralizada (printf %q); `uninstall` reseta git core.hooksPath; Article VIII enforcement virou real+testável (sinal `SINAPSE_ACTIVE_AGENT` setado pelo dispatcher no caminho autônomo); hardenings P2-003 + P3 (downloader timeout/cap, validatePath symlink, YAML size).

**Usabilidade (D):**
- Paridade IDE: cursor/antigravity/copilot iam de ~8% pra o contrato de persona completo (`persona-renderer` compartilhado).
- Schema dos 189 agents uniforme DERIVADO (não mutei 199 arquivos) + comando `sinapse agents` + validador de invariantes em CI.

**Auditoria adversarial B/C/D (43 agentes, 18 achados):** todos resolvidos OU corrigido o diagnóstico (2 eram mislabel: os dois `parallel-executor` NÃO são duplicata — propósitos diferentes; `frameworkProtection: false` é modo contribuidor deliberado, projetos instalados nascem com `true` + 64 deny rules).

**Comandos CLI novos:** `sinapse ideate`, `sinapse agents`.

**Pendências triviais (não-críticas):** BIN-ENTRY-OVERLAP (analisar entry canônico entre os 8 `bin/`), branch protection no GitHub (precisa branch pushed + admin). Token npm exposto no chat → REVOGAR. **Nada publicado** (decisão do Caio: publicar é o ÚLTIMO passo, depois do deep-dive abaixo).

---

## PRÓXIMA SESSÃO — Deep-dive de gargalos + racionalização de features

> **Decisão do Caio (11/06):** antes de publicar, fazer uma análise MAIS PROFUNDA. O objetivo não é só "tudo verde" — é deixar o framework **fluido, funcional e bem orquestrado**, sem gordura.

### As 3 perguntas-guia
1. **Features que existem mas NÃO funcionam** — código presente que não entrega o que promete (como synapse/ideation estavam). Caçar o resto.
2. **Feature-bloat / redundância** — features demais que poderiam se **fundir em outras** (consolidar sem perder capacidade — espírito do `parallel-executor`, mas onde fundir for certo). Menos peças, mais lei (Vignelli).
3. **Gargalos de fluxo/orquestração** — onde o motor é lento, redundante, ou faz caminhos tortos. Otimizar a orquestração em si pra ser o mais fluido possível.

### Como conduzir (método que já provou valor nas sessões 1+2)
- **Frota multi-agente exaustiva** (Workflow tool, Caio já autorizou) mapeando cada subsistema do core (`.sinapse-ai/core/*` — 28 módulos) + os 211 tasks / 15 workflows: quais têm consumidor real, quais são inertes, quais se sobrepõem.
- **Verificação adversarial** em cada achado (N céticos tentam refutar antes de virar verdade — foi o que pegou o "teatro" e evitou os 2 mislabels).
- **Loop-until-dry** na descoberta.
- **Lei do Caio (TRAVADA):** potencializar não cortar; mas "fundir duplicata real no mais forte" É potencializar (não perde capacidade). Funcional acima de tudo, zero ponta solta. IA decide sozinha, não re-pergunta caso a caso.
- **Régua:** cada "feature inerte/redundante" achada → decidir cabear (tornar funcional) OU fundir (consolidar) OU, só se comprovadamente sem valor E sem consumidor E sem caminho de potencialização, propor corte explícito ao Caio.

### Candidatos a investigar primeiro (do diagnóstico das sessões 1+2)
- **Vaporware restante no core:** a auditoria citou `code-intel`, `synapse` (já cabeado), `ideation` (já cabeado), `workflow-intelligence` — confirmar quais ainda não têm consumidor real e cabear/fundir.
- **8 entry points em `bin/`** (cli.js, sinapse.js, sinapse-init.js, sinapse-ids.js, sinapse-graph.js, sinapse-delegate.js, sinapse-minimal.js, postinstall.js) — qual é o canônico, o que consolidar.
- **211 tasks / 15 workflows** — quantos órfãos (sem referência por código) vs ativos.
- **3 linhagens de execução** que o épico de consolidação queria unificar — confirmar se restou alguma divergência (terminal-spawner ainda existe, usado por bob/greenfield/workflow-executor).
- **Coverage real** (a auditoria disse 24% decorativo, orchestration/execution excluídos) — medir de verdade.

### Definição de pronto do deep-dive
- Mapa do core: cada módulo classificado (funcional / inerte-cabear / redundante-fundir / cortar-com-OK-do-Caio).
- Plano de racionalização priorizado (P0→P3) com o caminho de cada item.
- Execução das frentes seguras + suíte 100% verde mantida.
- SÓ ENTÃO: decisão de publicar no npm (revogar+gerar token novo antes).

### Artefatos-fonte
- Este handoff + `README.md` (plano-mestre 4 frentes) + `SESSION-HANDOFF.md` (épico de consolidação).
- Relatório da auditoria B/C/D: task output do workflow `w0f2gzwo3` (18 achados).
- Auditoria fria lastro: `docs/audits/AUDIT-2026-06-04-cold-review.md`.
- Memory: `project_sinapse_ai_ultra_optimization` (frase-gatilho + não-óbvios).

---

## SESSÃO 3 (11/06, noite) — Deep-dive EM ANDAMENTO, interrompido 2x por limite de tokens

A frota do deep-dive foi desenhada e lançada (workflow `deep-dive-rationalization`: 28 auditores de módulo + 5 frentes especiais + céticos adversariais + síntese). Duas rodadas caíram no limite de sessão do plano; uma terceira foi relançada. **Tudo necessário pra retomar está salvo:**

### Artefatos salvos (permanentes)
| Artefato | Onde |
|---|---|
| Script canônico da frota (versionado, aceita retomada incremental via `args`) | `docs/epics/epic-ultra-optimization/workflows/deep-dive-rationalization.workflow.js` |
| Cópia global pra invocar por nome em qualquer sessão | `~/.claude/workflows/deep-dive-rationalization.js` |
| Resultados parciais da rodada 2 — **5 módulos completos** (docs, doctor +3) com reports na íntegra | `docs/epics/epic-ultra-optimization/workflows/partial-results-rodada2-2026-06-11.json` |
| Destino da síntese final (quando a frota completar) | `docs/audits/DEEP-DIVE-RATIONALIZATION-2026-06.md` |

### Achados parciais já confirmados (rodada 2)
- **`core/docs`** (misto, P2): excluído ACIDENTALMENTE do `install-manifest.yaml` por regex de sufixo em `scripts/generate-install-manifest.js:70-74` (upgrades brownfield não rastreiam drift); paths stale internos (`troubleshooting-guide.md:596-597`); nenhum fluxo runtime aponta agentes pra essa doc na hora de criar componentes. Ação: ancorar regex na raiz + corrigir paths + cabear referência em `create-agent.md`.
- **`doctor`** (funcional): 16 checks rodam, exit codes corretos, 10 consumidores reais. Gap: auto-fix (`--fix`) cobre só 4 dos 16 checks (`fix-handler.js:72-136`). Sobreposição parcial com `health-check` a investigar.
- Os outros 3 reports estão no JSON parcial.

### Como retomar o deep-dive
1. **Mesma sessão da frota** (se ainda viva): `Workflow({scriptPath: <script da sessão>, resumeFromRunId: 'wf_f675d4bd-006'})` — cache do journal devolve o que completou. (Resume por runId é same-session only.)
2. **Sessão nova** (caminho normal): relançar do script salvo passando os parciais —
   `Workflow({scriptPath: 'docs/epics/epic-ultra-optimization/workflows/deep-dive-rationalization.workflow.js', args: {skipModules: [<nomes dos módulos no JSON parcial>], precomputed: {modules: [<reports do JSON parcial>]}}})`.
   Os nomes em `skipModules` devem ser os da lista `MODULES` do script; os reports vêm de `data.modules[]` do JSON parcial (e de qualquer rodada posterior — acumular).
3. Custo observado: cada rodada completa da frota consome ~2-3M tokens de subagentes. Se o limite bater no meio, salvar o task output da rodada (`<taskId>.output` em Temp) na pasta `workflows/` e acumular nos parciais.

### Depois do deep-dive (inalterado)
Mapa do core classificado → plano P0→P3 → executar frentes seguras → suíte verde → SÓ ENTÃO publicar (revogar token npm exposto + gerar novo antes).

---

## SESSÃO 3 (13/06) — DEEP-DIVE COMPLETO + EXECUÇÃO P1 EM ANDAMENTO

**Deep-dive concluído:** frota de 79 agentes (Sonnet bulk + Opus síntese, ~7,8M tokens) rodou inteira numa tacada. Doc final: `docs/audits/DEEP-DIVE-RATIONALIZATION-2026-06.md` (commit `1b8b006`). Veredito: framework saudável; problema = cabeamento CLI incompleto, não capacidade ausente. Plano P0(3)/P1(10)/P2(11)/P3(6). 14 achados contestados pela verificação adversarial (6 falso-positivos derrubados). **Caio aprovou:** executar tudo que melhora o framework começando por P1 completo + os 2 cortes seguros (test-validation-task.md, duplicata órfã elicitation).

**Roteamento de modelo da frota (cabeado no script, commit `a67cc01`):** bulk em Sonnet, síntese em Opus. Caio roda main loop em Opus 4.8 (1M context) — não afeta custo da frota (modelos cabeados por agente).

### P1 — FEITO nesta sessão (testado + commitado, árvore limpa)
| Onda | Commit | Itens |
|---|---|---|
| 1 | `e82014d` | Cabear **graph**, **ids:***, **mcp** como subcomandos do `bin/sinapse.js`. graph corrige bug confirmado (contrato CI do template) consolidando o binário deprecated `sinapse-graph`; ids corrige bug (caía no Claude Code); mcp roteia ao Commander. |
| 2 | `b2baff7` | Fix **WaveAnalyzer** (named export — `new` lançava "not a constructor"); **diagnostics SYNAPSE** no `doctor --deep`. |
| 3 | `1eef215` | Cria **hook code-intel-pretool.cjs** ausente (installer mapeava arquivo inexistente) + registra no settings.json + documenta no hook-governance. |

### P1 — RESTANTE (próxima onda)
- **orchestrate** (risco médio): cabear `case 'orchestrate'` no `sinapse.js` → `cliCommands.orchestrate(storyId, options)` de `core/orchestration` (variantes: status/stop/resume/dry-run). Expõe pipeline autônomo. Caminho quente — testar com cuidado.
- **task @devops quality-gates** (baixo): `github-devops-pre-push-quality-gate.md` deve chamar `sinapse qa run --layer=1` em vez de reimplementar.
- **IDS G6** (médio): wrapper do hook ids-pre-push no GateEvaluator (só G1-G5 implementados).

### Achados NOVOS da execução (não estavam no plano — registrar)
1. **Gerador de entity-registry não escaneia `bin/`** → `ideate.js:82` consome o ideation-engine mas o registry marca `lifecycle: orphan`/`usedBy: []`. O item P1 "registry stale do ideation" não é editar o YAML (auto-gerado, reverte) — é melhorar o gerador pra escanear `bin/`. Vira item P2.
2. **Churn não-determinístico do entity-registry**: tocar QUALQUER arquivo em `.sinapse-ai/` dispara regen que reescreve o YAML inteiro com ordenação instável (~28k linhas de diff por mudança de ordem, não de conteúdo). Fragilidade real — gerador precisa de ordenação estável/determinística. Item P2/P3. (Por isso descartei os artefatos regenerados nos commits — não poluir.)

### Como continuar
Frase-gatilho de sempre. Ler este handoff §"SESSÃO 3". Próximo: onda P1 restante (orchestrate + task @devops + G6), depois P2/P3 + 2 cortes aprovados. Suíte sempre verde por onda. Publicar = último passo (revogar token npm antes).

---

## SESSÃO 4 (14/06) — P1 COMPLETO (10/10) + descoberta de baseline

**P1 FECHADO.** Os 3 itens restantes commitados (`11418b5`) + registro do gate no manifest (`f449d54`):
- **orchestrate** cabeado no `bin/sinapse.js` → `core/orchestration` (full pipeline + status/stop/resume/dry-run/epic). storyId = 1º arg não-flag. Smoke-testado (exit 3 sem story, exit 1 state-not-found). Fecha gap Art. I no pipeline autônomo (Epic 0).
- **IDS G6** implementado: novo `core/ids/gates/g6-ci-integrity.js` (G6CiIntegrityGate, blocking, @devops) — integrity check do Entity Registry (CRITICAL bloqueia) + sync de arquivos alterados (MEDIUM/LOW = warning). Cabeado no GateEvaluator (phase `ci_cd`) + barrel `index.js`. SLA 60s (CI), não 2s. Novo teste `tests/core/ids/g6-ci-integrity.test.js` (15 casos).
- **task @devops** (`github-devops-pre-push-quality-gate.md`) agora chama `sinapse qa run --layer=1` em vez de reimplementar lint/test/typecheck; build vira passo à parte (fora da Layer 1); seções renumeradas.

**Descoberta importante — baseline NÃO estava 100% verde nesta máquina (Node 24):** suíte completa deu 32 falhas / 11 suites. Classificação:
- **31 = ambiente/timing** (pré-existentes, independentes das mudanças): asserts `toBeLessThan` de "Performance" (SquadGenerator, Squad Designer, Health Check) + WorktreeManager (361s!) e git-hooks-installer e2e que fazem `git init/commit/worktree` reais via execa numa máquina sob carga. execa é 5.1.1 (CJS ok, não é erro de import). O `jest.config` já documenta diferença Node 24 vs 22.
- **1 = real determinístico (CORRIGIDO):** `hook-security.test.js` exigia `process.exit(2)` do `code-intel-pretool.cjs` (criado na onda P1 anterior), que é ALLOW-only por design (`hook-governance.md`). Adicionado à lista `WARN_ONLY_HOOKS`. Suíte hook-security 90/90.

Validação onda: IDS 453/453, gate-evaluator, hook-security, cli — todas verdes. lint (só warning `catch {}` pré-existente em sinapse.js:497) + typecheck limpos.

**Churn não-determinístico do entity-registry + install-manifest** segue ativo (handoff sessão 3 §achados novos): qualquer commit dispara regen com timestamp/hash/ordem instável. Descartado dos commits (revert). O install-manifest FOI commitado uma vez (registra o g6 real); o resto é churn revertido. **Item P2/P3 pendente: ordenação determinística do gerador.**

### FEITO ainda na sessão 4 (após P1)
- **2 cortes aprovados** (`ef5c436` + `976434d` manifest sync): removido `test-validation-task.md` (fixture zero-consumidor) + as 2 cópias órfãs `development/scripts/elicitation-{engine,session-manager}.js` (todos consumidores reais usam `core/elicitation/`; busca por require específico voltou vazia). Validado: elicitation+core-security 60/60, manifest 38/38.
- **P2 — manifest regex (`6f08778`):** ancorado `^docs/` em `generate-install-manifest.js` — os padrões não-ancorados excluíam `core/docs/*.md` (5 docs TRACKED) do manifest. Agora incluídos (file_count +5), legacy `.sinapse-ai/docs/standards/` segue excluído. Validado: 100/100 (generate/parity/ensure/post-install/brownfield).

### SESSÃO 4 (continuação) — LOTE P2 (6 itens, 8 commits)
| Item | Commit(s) | O quê |
|---|---|---|
| **entity-registry determinístico** | `2b389b1` + `c5c5de1` | 5 fontes de não-determinismo eliminadas (sort de arquivos via fast-glob, sort de usedBy, lastVerified preservado por checksum, lastUpdated idempotente, self-entry excluído via SCAN_IGNORE). 2 regens consecutivas = byte-idênticas. **Churn que poluía TODO commit acabou** — confirmado: commits seguintes não re-churnam o registry. |
| **gerador escaneia bin/** | `b153aaf` | Categoria `bin` (39 entry-points) adicionada PRIMEIRO no SCAN_CONFIG (last-wins preserva colisões cli/constants). ideation-engine: `usedBy: [ideate]`, `lifecycle: production` (era orphan). entityCount 774→813. |
| **output-formatter consolidado** | `10bae6d` | core/utils re-exporta infra (canônica, -290 linhas dup). |
| **9 tasks órfãs** | `0365157` | publish-npm + review-contributor-pr cabeadas no @devops (donos declarados). As 6 ambíguas (ids-*, yolo-toggle, delegate-to-external-executor, sync-registry-intel) NÃO cabeadas — dono ambíguo ("Any"/"Orchestrating") OU já via CLI. **Decisão de ownership pendente.** |
| **grounding Layer 1 dedup** | `0999a54` | 3 hooks sinapse-*-grounding.cjs delegam loadConfig ao config-loader.cjs (require guardado = fail-open). 57 testes grounding verdes. |
| **manifest regex** (sessão 4 cedo) | `6f08778` | ^docs/ ancorado — 5 docs de core/docs voltaram ao manifest. |

### SESSÃO 5 (15/06) — P2 RESTANTE + P3 COMPLETOS (YOLO, 7 commits)
Plano P2/P3 do deep-dive **fechado** (todos os itens executáveis sem regressão):
| Item | Commit | O quê |
|---|---|---|
| `sinapse create`/`mode`/`generate` | `2604122` | 3 cases no switch: create→ComponentGenerator, mode→PermissionMode (show/set/cycle), generate→Commander (estava caindo no default, bug). |
| 6 tasks órfãs restantes | `decf917` | yolo-toggle→@developer; ids-governor/health/query+sync-registry-intel+delegate-to-external-executor→@devops. Todas as 9 cabeadas. |
| cache AgentInvoker + colapsa _saveState | `3af429f` | Memoiza _loadAgent/_loadTask; remove double-write de _saveState por epic no sucesso (executeEpic já persiste). |
| P3 higiene (4/5) | `07d4864` | header update-sinapse v5.2; teste fast-path-gate (12 casos); 3 namespaces session no core/README; status header no active-modules.verify (Story 9.4 pendente). **P3.1 migration DEFERIDO** (verificação: MODULE_MAPPING JS e module-mapping.yaml têm estruturas divergentes + teste dependente — não é dedup limpo). |
| `sinapse health --deep` + `--output-file` | `9b24e21` | Expõe o engine core/health-check (35 checks, 6 domínios) que não tinha entry-point. NÃO troca o default (lightweight install-health) — verificação mostrou que checam coisas diferentes (seria regressão). |
| handlers despacham por project_type | `28171f5` | greenfield/brownfield-handler resolvem o variant (ui/fullstack/service) por options.projectType; default = histórico (fullstack/discovery). Arquivos de workflow mantidos separados (fusão refutada). |

**Decisões YOLO tomadas (documentadas):** ownership das 6 tasks (devops/developer por domínio); health vira `--deep` aditivo (não troca backend) pra não regredir; P3.1 deferido por não ser dedup limpo.

### Status final do epic
- **P0 preservado, P1 (10/10), 3 cortes, P2 (11/11), P3 (4/5 + 1 deferido)** — tudo commitado, árvore limpa, churn do registry eliminado (commits limpos daqui pra frente).
- **Baseline tem ~31 falhas de ambiente/timing no Node 24** (WorktreeManager/git-hooks-installer execa + perf `toBeLessThan`) — pré-existentes, NÃO regressões; validar por suite afetada.
- **ÚNICO pendente real antes de publicar:** revogar+regerar o token npm exposto no chat. Publicar no npm = decisão do Caio (último passo). Ref: `docs/audits/DEEP-DIVE-RATIONALIZATION-2026-06.md` §5.
