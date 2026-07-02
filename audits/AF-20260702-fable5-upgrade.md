# AF-20260702 — Auditoria Fable 5 Upgrade

> **Data:** 2026-07-02 · **Repo:** `main` @ `92463d0` (v1.19.2)
> **Método:** 10 frentes paralelas (4 re-baseline: R1 cold-review, R2 épico-mãe, R3 clínica, R4 motor pós-híbrido + 6 descoberta: O1-O6) → dedup → verificação adversarial (critical/high: 2 lentes — evidência e risco; medium: 1 lente; low: sem verificação individual; voto dividido = não-verificado) → síntese.
> **Modelo motor:** Fable 5 nas frentes de julgamento, Sonnet no mecânico.
> **Escopo de leitura:** read-only sobre a main (sem execução de suíte, sem instalação real, sem PR de teste).

---

## 1. Sumário executivo

A dívida estrutural das auditorias anteriores foi majoritariamente quitada: os 3 CRITICAL do NO_GO de 29/06 estão resolvidos, os 3 muros P0 estão fechados ou reclassificados com fundamento (branch protection ativa; Art. VIII fechado no caminho autônomo; frameworkProtection é modo-contribuidor deliberado com instalações nascendo protegidas), e o motor pós-híbrido tem caminho canônico único, honesto e com gates reais para 1 story. A nova safra de 37 achados confirmados muda de natureza: em vez de teatro de execução, o problema agora é staleness de era-de-modelo (regras, registry e docs ainda calibrados para Opus 4.7/200K num mundo Fable 5/1M), custo fixo de contexto (a Constitution inteira reinjetada em todo prompt, ~1.831 tokens medidos) e vitrine desalinhada (guias shipped vendendo o motor autônomo abandonado enquanto o motor real está invisível no README e inacessível pelo binário canônico). Dos 81 achados únicos, 37 sobreviveram à verificação adversarial (1 critical, 15 high, 21 medium), 9 foram refutados e 35 ficaram não-verificados — o roadmap cabe em 3 ondas: 15 correções baratas (dias), 17 consertos de alto valor (1-2 semanas) e 5 apostas estruturais com gate de medição (mês+).

| Métrica | Valor |
|---|---|
| Achados brutos (10 frentes, pré-dedup) | ≥84 (81 únicos + 3 duplicatas cross-frente registradas via `also_reported_by`) |
| Achados únicos pós-dedup | **81** |
| Confirmados (verificação adversarial) | **37** — 1 critical · 15 high · 21 medium |
| Refutados | **9** |
| Não-verificados | **35** — 4 high · 10 medium · 21 low |
| Claims de re-baseline verificados | **94** — 49 resolved · 28 changed · 14 open · 3 unverifiable |

**Veredito:** o motor ficou honesto — agora é a moldura (regras de modelo, dieta de contexto e vitrine) que precisa alcançá-lo; nenhum bloqueador novo de divulgação, mas o upgrade Fable 5 ainda não aconteceu dentro do framework.

---

## 2. Re-baseline

94 claims dos 4 documentos-lastro re-verificados item a item contra a main atual.

| Documento-lastro | Claims | Resolved | Changed | Open | Unverifiable |
|---|---:|---:|---:|---:|---:|
| Cold review 04/06 (`docs/audits/AUDIT-2026-06-04-cold-review.md`) | 32 | 12 | 11 | 7 | 2 |
| Épico-mãe (`docs/epics/epic-ultra-optimization/`) | 16 | 4 | 9 | 3 | 0 |
| Clínica 29/06 (`audits/AF-20260629-clinical-pre-launch.md`) | 32 | 28 | 3 | 1 | 0 |
| Motor pós-híbrido (`docs/epics/epic-orchestration-consolidation/`) | 14 | 5 | 5 | 4 | 0 |
| **Total** | **94** | **49** | **28** | **14** | **3** |

> Nota de leitura: nos "pontos fortes" do cold review, `open` significa "a propriedade positiva continua de pé" (bom), não dívida aberta.

### 2.1 Cold review 04/06 — 32 claims

| # | Claim (04/06) | Status | Nota |
|---|---|---|---|
| 1 | Veredito: motor reporta success:true sem executar ("toolkit embrulhado como motor autônomo") | changed | `sinapse orchestrate` hoje invoca SubagentDispatcher real (`master-orchestrator.js:989-993`); checkpoint 30/06 rebaixou o motor a assistente de 1 story — veredito virou HÍBRIDO |
| 2 | Tabela de saúde por dimensão (9 scores 4-9/10) | unverifiable | Reproduzir exige refazer as 8 frentes originais; evidência direcional de melhora em orquestração/governança/parity, sem novos números atribuídos |
| 3 | P0-1a: agent-invoker retorna `status:'simulated'` | resolved | Hoje retorna `status:'stub'` com invariante de honestidade explícita (`agent-invoker.js:~426-429`) |
| 4 | P0-1b: epic-4 fabrica success:true; `_runTests` ran:false; stub spec segue adiante | changed | Stub de spec só como fallback pós-agente real e reporta STUB; `_runTests` segue literal (`epic-4-executor.js:319-330`), mas a leitura "2º buraco" foi refutada — QA é papel do Epic 6 por arquitetura documentada |
| 5 | 3 linhagens paralelas; `pm.sh` é echo | resolved | `pm.sh` deletado (F3C, #312, commit 0dcb022); Glob confirma ausência |
| 6 | build-orchestrator é 4º caminho à parte, acionado por *build | resolved | Fundido como modo do motor; `sinapse orchestrate` é o entry point CLI único |
| 7 | P0-2: interligações não existem como código (dispatcher órfão, 177 de squad não endereçáveis) | resolved | Dispatcher chamado de fato (`master-orchestrator.js:993`); `squad-agent-resolver.js` indexa todos os .md de `squads/` |
| 8 | P0-3 code-intel: fallback `line:1`/`lines:0` | changed | Mecanismo igual (`registry-provider.js:311,342,358,501`), mas moldura honesta ("sempre opcional, graceful fallback") e doctor PASS (802 entities) |
| 9 | P0-3 synapse 8 camadas: XML vazio; `.synapse/` não existe | open | Camadas existem como módulos, mas installer não cria `.synapse/` — nunca ativa fora do repo-fonte (**achado confirmado → Onda 2**) |
| 10 | P0-3 ideation: grep + conselho enlatado, sem consumidor | changed | Consumidor real hoje (`bin/commands/ideate.js`); docstring "AI-powered" ainda supervaloriza (não-verificado, low) |
| 11 | P0-3 workflow-intelligence (4.400 ln): sem consumidor de runtime | open | Único require é `wave-executor.js:18`, que por sua vez tem 0 chamadores vivos (**achado confirmado → Onda 2**) |
| 12 | P0-4: proteção L1-L4 desligada ("# TEMPORARY: TOK-3") | changed | Reclassificado "CONTRIBUTOR MODE (deliberate, not temporary)" (`core-config.yaml:371-377`); installs nascem com `frameworkProtection:true` (`core-config-template.js:176`) |
| 13 | P0-5: Article VIII fail-open permanente | changed | `SINAPSE_ACTIVE_AGENT` fecha o caminho autônomo; interativo segue fail-open por design documentado (**achado confirmado → Onda 2**) |
| 14 | P0-6: sem branch protection (404; rulesets vazios) | resolved | Proteção ATIVA: `strict:true` + 4 contexts (Validation Summary, Art. VII/VIII/XI) |
| 15 | P1: uninstall corrompe `core.hooksPath` | resolved* | Corrigido em `bin/commands/uninstall.js:29-44` — MAS reaberto no outro binário (`bin/sinapse.js`), ver Onda 1 |
| 16 | P1: 3-4 árvores de agentes divergentes (.codex 185 hand-maintained) | resolved | `.codex/agents/*` virou pointer runtime de 4 linhas; drift eliminado por design (ideSync codex disabled) |
| 17 | P1: paridade multi-IDE lossy (stubs 29-44 ln, 92% descartado) | resolved | Transformers de Cursor/Antigravity/Copilot removidos do produto; descopado pra Claude Code + Codex |
| 18 | P1: rollback de install é código morto (InstallTransaction) | resolved | Usado por `bin/commands/install.js:49,217,372-378` + testes de rollback |
| 19 | P1: packages/installer quebrado (src/index.js inexistente) | resolved | Árvore completa existe; wizard compartilhado com `bin/sinapse.js` |
| 20 | P1: schema de agente não-uniforme (86 YAML / 69 headers / 22 sem nada) | changed | `validate:agents`: 172 OK, 0 errors; 226 warnings viraram dívida rastreada com tiering formal (Core strict / Squad warn) |
| 21 | P1: config-loader deprecated exportado pelo barrel | open* | Segue deprecated+exportado, mas com decisão documentada (DEPRECATED-BARREL-1, audit 2026-06-11) — a leitura "dívida zumbi sem dono" foi refutada na verificação |
| 22 | P1: coverage decorativo (24%); core/orchestration e execution excluídos | resolved | Ambos na cobertura; `.sinapse-ai/core/` tem piso próprio mais alto que o global (78/67/79/78) |
| 23 | P1: release-readiness.js órfão citando v10.0.0 | changed | Cabeado a `validate:release-readiness` (`package.json:142`); resíduo cosmético "v10.0.0" no header |
| 24 | P1: 3 entry points CLI; `sinapse install` autodeclara deprecated | changed | Install roda o wizard real; `sinapse-delegate` é ferramenta distinta — mas a duplicação `sinapse.js`×`cli.js` segue causando bugs reais (Onda 1) |
| 25 | P1: Constitution v2.2 vs v1.0; contagens 189/175 divergem | resolved | Header e rodapé batem (v2.2.0); 17 squads / 172 agentes consistentes entre docs e disco |
| 26 | Forte: segurança 9/10 (secret-scanner fail-closed, Ed25519, anti-leak) | open (mantém) | secret-scanner/downloader inalterados; `.env` fora do git; 0 vulns em produção |
| 27 | Forte: testes majoritariamente reais (9.374 it / 19.151 assertions) | open (mantém) | Volume segue substancial (spot-check: 5.163 `it(` só em tests/); números exatos não reproduzidos — suíte não executada nesta missão |
| 28 | Forte: engenharia defensiva (runSafe, atomic writes, circuit breakers) | open (mantém) | runSafe em uso ativo no caminho vivo; checagem estrutural, não linha a linha |
| 29 | Forte: lint estático com dentes e wired | open (mantém) | pre-push roda 6 guards em paralelo — mantido e expandido |
| 30 | Forte: contagens honestas (18 squads / 189 agentes) | changed | Números viraram 17/172, mas a propriedade central (docs batem entre si e com o disco) se mantém |
| 31 | Forte: grafo de dependência do core acíclico | unverifiable | Sem script de checagem de ciclos; reconstituir o grafo de require() ficou fora do orçamento |
| 32 | Decisão de rumo 2026-06-04: C — APOSTAR no motor como diferencial | changed | Superada pelo checkpoint medido de 30/06: veredito HÍBRIDO, orquestração autônoma multi-story abandonada (`KNOWN-LIMITATIONS.md`) |

### 2.2 Épico-mãe ultra-optimization — 16 claims

**Placar dos 3 muros P0 (destaque):**

| Muro P0 | Estado hoje | Síntese |
|---|---|---|
| #1 `frameworkProtection: false` | **CHANGED (reclassificado)** | Modo-contribuidor deliberado no repo-fonte (`core-config.yaml:377`, comentário "deliberate, not temporary"); projetos instalados nascem com `true` + deny rules (`packages/installer/src/config/templates/core-config-template.js:176`) — usuários finais SÃO protegidos |
| #2 Article VIII fail-open | **CHANGED (fechado no caminho perigoso)** | `SINAPSE_ACTIVE_AGENT` setado pelo dispatcher real (`subagent-dispatcher.js:504-513`) bloqueia orquestrador autônomo; caminho interativo (chat) segue fail-open **por design documentado** (`enforce-delegation.cjs:24-30`) — achado confirmado pede escopo honesto ou fechamento (Onda 2) |
| #3 Branch protection ausente | **RESOLVED** | `required_status_checks` ativo, `strict:true`, 4 contexts (Validation Summary + Art. VII/VIII/XI); ressalva: `enforce_admins:false` (esperado p/ maintainer solo) |

| # | Claim (épico-mãe, ~15/06) | Status | Nota |
|---|---|---|---|
| 1 | Muro P0 #1: frameworkProtection false | changed | Ver destaque acima |
| 2 | Muro P0 #2: Art. VIII depende de session-state.json inexistente | changed | Ver destaque acima; fallback `session-state.json` segue tipicamente inexistente |
| 3 | Muro P0 #3: sem branch protection | resolved | Ver destaque acima |
| 4 | §8.1: orchestrate invoca agentes reais, produz código/testes reais | changed | Verdadeiro para 1 story isolada; multi-story medido (1/3 vs 3/3 nativo) e ABANDONADO em 30/06 — deixou de ser meta |
| 5 | §8.2: zero `success:true` sem trabalho (lint anti-teatro em CI) | changed | 5 ocorrências residuais fora de teste; a auditada (build-loop:593) é legítima; o default 'simulate' do AutonomousBuildLoop foi confirmado como resíduo real (Onda 1) |
| 6 | §8.3: um único caminho de execução | resolved | F3C #312 (commit 0dcb022) na main |
| 7 | §8.4: 177 agentes de squad endereçáveis | changed | Resolver escaneia `squads/` dinamicamente (não hardcoded); contagem hoje = 172 em 18 grupos (17 squads + framework); squad "artdir" não existe mais |
| 8 | §8.5: ≥1 gate capaz de bloquear de verdade | resolved | `implementation_exists` exige arquivos reais (`gate-evaluator.js:446-461`, PR #317) |
| 9 | §8.6: os 3 muros P0 levantados | changed | #3 resolvido; #2 no caminho autônomo; #1 reclassificado (ligar no repo-fonte travaria a edição do próprio framework) |
| 10 | §8.7: vaporware podado ou cabeado | changed | code-intel/synapse-runtime/ideation cabeados; workflow-intelligence PARCIAL — WaveExecutor consome WaveAnalyzer mas ninguém consome WaveExecutor (Onda 2) |
| 11 | §8.8: schema uniforme; paridade sem perda de 92% | changed | Mecanismo existe (`persona-renderer.js`, fix PARIDADE-IDE-002); cobertura 100% não medida empiricamente (lacuna do critic #6) |
| 12 | §8.9: claims README/Constitution alinhados ao motor | open | `docs/guides/user-guide.md:43` ainda ensina `sinapse agents list`, inexistente no binário `sinapse` (Onda 1) |
| 13 | Frente C: 3 entry points de CLI sobrepostos | open* | Duplicação real `sinapse.js`×`cli.js` com bugs derivados confirmados (agents/ideate, uninstall) — mas a leitura "3 sobrepostos com implementações 100% independentes" foi refutada (delegate é distinto; núcleo compartilha módulos; depreciação rastreada, Story 10.13 → v11) |
| 14 | Frente C: uninstall corrompe hooksPath | changed | Corrigido no `cli.js` (UNINSTALL-GIT-HOOKS); reaberto via binário `sinapse` (Onda 1) |
| 15 | Frente C: config-loader deprecated no barrel | open | Mantido por compat com decisão documentada (DEPRECATED-BARREL-1) — dívida conhecida e aceita |
| 16 | Rodar `sinapse doctor` e registrar placar | resolved | 12 PASS · 0 WARN · 0 FAIL · 4 INFO (exit 0); code-intel PASS 802 entities; manifest 1.19.2 alinhado |

### 2.3 Auditoria clínica 29/06 — 32 claims

**Placar dos 3 CRITICAL do NO_GO (destaque): 3/3 RESOLVIDOS.** O NO_GO está, na prática, quitado — nenhum bloqueador de divulgação sobrevive. Placar completo do re-baseline R3:

| Severidade original | Verificados | Resolvidos | Parcial ("changed") | Ainda abertos |
|---|---:|---:|---:|---:|
| CRITICAL | 3/3 | **3** | 0 | 0 |
| MAJOR | 16/15* | **15** | 1 (#10) | 0 |
| MINOR (amostra) | 14/20 | 12 | 2 (#23, #32) | 0 |

*\#29 compartilha a evidência de arquivo com #18 (mesma causa-raiz corrigida).*

| # | Claim (29/06) | Status | Nota |
|---|---|---|---|
| C#1 | user-guide ensina `sinapse workflow *` / `sinapse squads *` inexistentes | resolved | EN+PT usam `sinapse build`/`route`/`orchestrate <story-id>` reais; squads via filesystem + nota de roadmap |
| C#2 | `lint-guards.yml` com YAML inválido (X vermelho público) | resolved | 3 jobs top-level válidos; js-yaml parseia os 19 workflows; `gh run list`: 5/5 runs recentes `completed success` |
| C#7 | Recovery aponta `npx @caioimori/sinapse` inexistente | resolved | `troubleshooting-system.js:30,46` usa `npx sinapse-ai@latest install`; report-generator reescrito |
| M#3 | service-discovery ensina `sinapse discover`/`list` | resolved | EN+PT usam `sinapse workers search` |
| M#4 | squads-overview ensina `squads list/download/search` | resolved | Reescrito: gestão via filesystem + roadmap para distribuição remota |
| M#8 | Instalador com mensagens hardcoded EN | resolved | `wizard/index.js` usa `t('installingCore')` etc. |
| M#9 | Relatório pós-install 100% EN | resolved | `report-generator.js` 100% via `t()/tf()`, chaves PT existem |
| M#10 | troubleshooting: URLs erradas + sem i18n | changed | URLs corrigidas (`REPO_URL` correto, com comentário); i18n NÃO feita — 27 strings EN vs 3 usos de t() (**achado confirmado → Onda 2**) |
| M#11 | "172 agentes" hardcoded inconsistente | resolved | `feedback.js` com `ECOSYSTEM` single-source + comentário anti-regressão |
| M#12 | README documenta postinstall removido | resolved | `README.md:70` casa com `bin/postinstall.js` |
| M#13 | InstallTransaction/install-errors mortos | resolved | Usados em produção (`bin/commands/install.js`, `bin/cli.js:105`) |
| M#18 | command-generator soma só 160 | resolved | `command-generator.js:53` soma squad+core = 172, comentário cita o bug antigo |
| M#19 | Toggle [ES] morto (111 links) | resolved | 0 ocorrências de `[ES]` em docs/ |
| M#20 | Guias de instalação com links quebrados | resolved | `./uninstallation.md`; paths reais em installation/README.md |
| M#21 | CONTRIBUTING.md com 2 links mortos | resolved | Ambos corrigidos para paths existentes |
| M#22 | docs/pt com 37 links quebrados | resolved | Scan de 340 links relativos em docs/pt = 0 quebrados |
| M#30 | getting-started afirma 19 squads | resolved | "17 squads", bate com o disco |
| M#31 | brownfield chama `executeWorkflow()` inexistente | resolved | Método existe (`workflow-executor.js:455`), assinatura bate com o call-site |
| m#5 | Banner 172 vs overview 160 | resolved | architecture-overview reconcilia 160+12=172 |
| m#6 | routing_table superdeclara 4 squads | resolved | claude-code-mastery=8, finance=8, copy=13, cloning=9 — batem com o disco |
| m#16 | CHANGELOG [Unreleased] defasado | resolved | Vazio, seguido de [1.19.2], sem órfãos |
| m#17 | Org GitHub inconsistente no npm-publish | resolved | `${{ github.repository }}` dinâmico |
| m#23 | README "19 hooks" vs disco 17 | changed | "17 hooks" consistente (bate com os .cjs); 1:1 com hooks registrados em settings.json não confirmado |
| m#24 | Link para constitution-compliance.md inexistente | resolved | Link removido de docs/README.md |
| m#25 | Constituição 2.2.0 vs 1.0.0 | resolved | Só "2.2.0" declarada; "1.0.0" restante é narrativa histórica |
| m#26 | Art. V cita gate `pre-push.md` inexistente | resolved | Cita `.sinapse-ai/git-hooks/pre-push`, que existe |
| m#27 | doctor valida só 10 dos 11 artigos | resolved | `KEY_ARTICLES` inclui "Conservative Default" (Art. XI) |
| m#28 | Master duplicado/desatualizado no espelho .claude | resolved | `sinapse-orqx.md` virou stub de 316 bytes com redirect → snps-orqx |
| m#32 | Codinomes duplicados (Forge, Lens, Arc) | changed | 3 colisões originais resolvidas + guard novo criado; guard tem blind spot de regex que deixa passar colisão nova "Nexus" ×3 (**achado confirmado → Onda 1**) |
| m#33/#34 | Contagens fragmentadas entre docs (160-189) | resolved | agent-reference-guide consistente (172/17/12); `validate:article-vii` PASS |
| m#36 | 43 tasks com ponteiros `Source:` mortos | resolved | 0 remanescentes; path real `.sinapse-ai/core/execution/` confirmado |
| m#14/#15/#35/#37/#38 | (5 MINOR) | unverifiable | Fora da amostra desta rodada — declarado por transparência |

### 2.4 Motor pós-híbrido — 14 claims

| # | Claim (épico orchestration-consolidation) | Status | Nota |
|---|---|---|---|
| 1 | Linhagem canônica única viva (orchestrate → MasterOrchestrator → dispatcher → claude) | resolved | `bin/sinapse.js:1355-1387` → `cli-commands.js:79-99` → `master-orchestrator.js:45` |
| 2 | F3C: linhagem terminal-spawner → pm.sh removida fisicamente | resolved | ~3.7k linhas removidas (#312); Glob não encontra terminal-spawner em `.sinapse-ai/` |
| 3 | Gates com dentes (plan_is_real + implementation_exists + no_critical_errors) | resolved | `gate-evaluator.js:59,420,446` (#308/#314/#317) |
| 4 | Zero `success:true` sem trabalho em todos os executores | changed | Executores do pipeline honestos (`agent-invoker.js:427` 'stub'); `autonomous-build-loop.js:538-555` ainda fabrica sucesso no default 'simulate' (**achado confirmado → Onda 1**) |
| 5 | F2: 189 agentes de squad endereçáveis pelo dispatcher | changed | SquadAgentResolver cabeado; comentário no código diz "172 agent ids" — 189 vs 172 nunca reconciliado (lacuna do critic #3) |
| 6 | Suíte E2E anti-teatro como required check | changed | `tests/core/anti-theater.test.js` existe (SINAPSE_REAL_DISPATCH); condição "required check" não verificável via repo local |
| 7 | Orquestração autônoma multi-story | changed | ABANDONADA por medição (1/3 vs 3/3 nativo, ~13,5min vs 64s); sem DAG executor no CLI; virou limitação documentada |
| 8 | Motor = assistente confiável para 1 story | open | No Windows o Epic 6 (QA) sempre cai em stub e pode reportar FAILED com build bom (**achado confirmado → Onda 2**) |
| 9 | 2 bugs multi-story não corrigidos por decisão consciente | resolved* | Decisão documentada e código confirma (`build-state-manager.js:227`, `epic-4-executor.js:190`); ressalva: o bug 2 atinge também o caminho suportado |
| 10 | Maquinário paralelo shipped sem consumidor | open | ~4.2k linhas em 7 módulos de `core/execution/`, só os próprios testes consomem (**achado confirmado → Onda 2**) |
| 11 | EpicContextAccumulator/WorkflowOrchestrator exportados no barrel sem consumidor | open | `index.js:101,241-243`; não-verificado (low) |
| 12 | Piso guiado doc-first vivo (route + build + handlers + WorkflowExecutor) | resolved | `bin/sinapse.js:1404-1464`; `bob-orchestrator.js:13` "honest manual hand-off" |
| 13 | "Docs públicos já eram honestos" (varredura #318) | changed | Verdade para README/Constitution/user-guide; guias SHIPPED no npm ficaram fora (ade-guide "Production Ready ✅" etc. — **achado confirmado → Onda 2**) |
| 14 | KNOWN-LIMITATIONS visível a quem usa o produto | open | `docs/epics/` fora do array `files` do package.json; help do CLI e user-guide não citam escopo 1-story (**achado confirmado → Onda 1**) |

---

## 3. Roadmap em ondas

37 achados confirmados, agrupados por impacto×esforço. Convenção: itens critical sempre na Onda 1; itens cuja recomendação envolve **remoção** carregam a marca **[Conservative Default]** = requer validação de arquitetura + dono do domínio antes de remover.

### Onda 1 — crítico/barato (dias) · 15 itens

**1.1 Hook reinjeta a Constitution inteira (96 regras) em todo prompt** — `CRITICAL · opportunity · M · O5-dieta-de-contexto`
- Evidência: `.claude/settings.json:8` (synapse-wrapper em UserPromptSubmit, sem matcher), `.sinapse-ai/core/synapse/layers/l0-constitution.js:33` ("ALWAYS_ON"), `.sinapse-ai/core/synapse/engine.js:191` (`DEFAULT_ACTIVE_LAYERS = [0,1,2]`), `.synapse/constitution:2`. Medido com o formatter real: bloco `<synapse-rules>` = 7.324 chars (~1.831 tokens), idêntico em todo prompt — 20 turnos ≈ 36,6K tokens repetidos. Maior custo fixo por prompt encontrado nesta auditoria.
- Recomendação: L0 emite a Constitution completa só no 1º prompt da sessão (session-manager.js já expõe `prompt_count`); turnos seguintes recebem lembrete curto. Ressalva da verificação: o ponteiro curto deve apontar para a fonte com as 96 regras granulares (o CLAUDE.md só tem a tabela de 11 artigos).

**1.2 Binário `sinapse` não tem os comandos `agents`/`ideate` ensinados pela documentação** — `high · bug · S · R2-epico-mae-muros`
- Evidência: `bin/sinapse.js:1535` (comando desconhecido → repassado como prompt bruto ao Claude Code), `bin/cli.js:142` (`case 'agents'` só no binário `sinapse-ai`), `docs/guides/user-guide.md:43` (`sinapse agents list` no Quick Start). Verificação achou o mesmo erro em `docs/pt/guides/user-guide.md:49` e `docs/pt/architecture/high-level-architecture.md:57`.
- Recomendação: delegar `agents`/`ideate` em `bin/sinapse.js` para o mesmo módulo do cli.js (padrão já usado para `ids:*` via spawnSync) ou corrigir a doc para `npx sinapse-ai agents list`; estender o guard `validate-install-docs.js` para cobrir user-guide e esses comandos.

**1.3 `sinapse uninstall` não reseta git `core.hooksPath` (bug reaberto por duplicação de CLI)** — `high · bug · S · R2-epico-mae-muros`
- Evidência: `bin/sinapse.js:694` (`runUninstall` próprio, 0 menções a hooksPath no arquivo inteiro); `bin/commands/uninstall.js:238` + `:25` (fix UNINSTALL-GIT-HOOKS só no binário `sinapse-ai`).
- Recomendação: chamar a mesma lógica de `removeGitHooksConfig()` no `runUninstall` de `bin/sinapse.js`, ou unificar os 2 binários num módulo único de comando — sem isso, quem usa o binário `sinapse` (registrado no package.json) reproduz o bug original: commits futuros quebram.

**1.4 token-economy.md rotula routing e threshold de subagente como 'Opus 4.7'** — `high · stale · S · O1-roteamento-modelo (+O2)`
- Evidência: `.claude/rules/token-economy.md:25,29,41` (tabela e títulos pinados em "Opus 4.7"; claim datada de thinking_budget). `.claude/rules/` está no `files` do package.json (linha 33) — a regra viaja para toda instalação nova.
- Recomendação: re-rotular seções 2/3 para a família atual sem pin de versão (ou aliases de família); remover a afirmação datada; o rótulo "Opus 4.7" em regra NON-NEGOTIABLE também data publicamente o framework.

**1.5 Registry executável de modelos não contém claude-fable-5 nem claude-sonnet-5** — `high · stale · S · O1-roteamento-modelo`
- Evidência: `.sinapse-ai/core-config.yaml:398` (consumido por `context-tracker.js getModelConfig`), `:401` (`active: claude-opus-4-8`), `:404`. Único ponto do repo onde routing é dado executável.
- Recomendação: adicionar `claude-fable-5` (e `claude-sonnet-5`) ao registry e apontar `active` pro modelo real — hoje o cálculo de contexto de quem roda Fable 5 acerta por coincidência de janela (ambos 1M) e quebra silenciosamente na primeira divergência.

**1.6 Orçamento de tokens por bracket (FRESH=800) é estruturalmente inatingível** — `high · bug · S · O5-dieta-de-contexto`
- Evidência: `.sinapse-ai/core/synapse/output/formatter.js:398` (CONSTITUTION no set PROTECTED, nunca truncada), `.sinapse-ai/core/synapse/context/context-tracker.js:30,42`. A seção CONSTITUTION sozinha ≈ 1.806-1.831 tokens > teto de 800 (FRESH) e > 1.500 (MODERATE); entrega 2,3x/1,2x o prometido sem sinalizar a violação.
- Recomendação: recalibrar TOKEN_BUDGETS pro piso real (~1.850) ou reduzir o conteúdo protegido pra caber no orçamento declarado; `enforceTokenBudget()` deve sinalizar quando estourar. Executar coordenado com 1.1 (o corte da reinjeção muda o piso).

**1.7 Template de instalação do CLAUDE.md desatualizado e 3,4x maior que o usado pelo time** — `high · stale · S · O5-dieta-de-contexto`
- Evidência: `.sinapse-ai/product/templates/ide-rules/claude-rules.md:44` ("@developer = Dex", quando o agente real é Pixel — `.sinapse-ai/development/agents/developer.md:57`, `.claude/CLAUDE.md:53`), `:31` (tabela da Constitution sem o Artigo XI). 13.269 chars (~3.318 tok) vs 3.866 (~967 tok) do `.claude/CLAUDE.md` real.
- Recomendação: regenerar `claude-rules.md` a partir do `.claude/CLAUDE.md` (ou gerar ambos de um único template); verificação apontou blind spot: o doctor `constitution-consistency` não varre o template de instalação — incluir.

**1.8 CHANGELOG afirma docs públicos honestos, mas ade-guide/permission-modes/api-reference não foram tocados** — `high · bug · S · O6-vitrine-ga`
- Evidência: `CHANGELOG.md:20` ("Docs públicos já eram honestos (#318)"), `docs/guides/permission-modes.md:206`, `docs/guides/api-reference.md:197`, `docs/guides/ade-guide.md:5` ("Production Ready ✅"). O diff do #318 tocou só `docs/epics/`.
- Recomendação: corrigir a entrada do CHANGELOG (ela mesma é vitrine) pra refletir o escopo real da varredura; a revisão dos guides em si é o item 2.1 da Onda 2. É a mesma classe de falha (afirmar sucesso sem checar) que o épico existiu para eliminar do motor.

**1.9 user-guide.md ~5 meses desatualizado com resíduo de comando quebrado** — `medium · stale · S · R2-epico-mae-muros`
- Evidência: `docs/guides/user-guide.md:10` ("Last Updated: 2026-01-28"), `:43` (`sinapse agents list`); `audits/AF-20260629-clinical-pre-launch.md:42` (mesma classe do CRITICAL#1, remediado parcialmente).
- Recomendação: atualizar header de data/versão e revisar o Quick Start inteiro contra os switches reais de `bin/sinapse.js` e `bin/cli.js` — não só as seções Workflows/Squads já corrigidas.

**1.10 Guard anti-colisão de codinome tem blind spot e não detecta colisão real de 'Nexus'** — `medium · bug · S · R3-clinica`
- Evidência: `scripts/validate-agent-codenames.js:86` (regex só reconhece `name: "X"` com aspas), `squads/claude-code-mastery/agents/swarm-orqx.md:58` (`name: Nexus`, sem aspas), `squads/squad-content/agents/content-orqx.md:5` (`name: "Nexus"`); design-orqx declara "Nexus" em prosa, também invisível. O script reporta "OK — every codename is unique" (falso negativo) com 3 orquestradores respondendo por "Nexus".
- Recomendação: aceitar `name:` sem aspas (YAML válido) + tratar/alertar formato prosa; renomear um dos 3; verificação apontou que o script nem está cabeado em CI — cabear.

**1.11 Require quebrado do PlanTracker no caminho vivo do Epic 4** — `medium · bug · S · R4-motor-pos-hibrido`
- Evidência: `.sinapse-ai/core/orchestration/executors/epic-4-executor.js:39` (`../../infrastructure/...` resolve pra `core/infrastructure/`, que não existe; arquivo real em `.sinapse-ai/infrastructure/scripts/plan-tracker.js`), `docs/epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md:57`. PlanTracker é sempre null no pipeline suportado — degradação silenciosa (só warn).
- Recomendação: corrigir para `../../../infrastructure/scripts/plan-tracker` E ajustar o destructuring (`{ PlanTracker }`) — verificação mostrou que só corrigir o path faria `new PlanTracker` explodir (module.exports é objeto).

**1.12 Default 'simulate' do AutonomousBuildLoop retorna success:true sem fazer trabalho** — `medium · risk · S · R4-motor-pos-hibrido`
- Evidência: `.sinapse-ai/core/execution/autonomous-build-loop.js:538` ("Default: simulate execution"), `:553` (`success: true`); `build-orchestrator.js:442` é o único injetor de executor real; o módulo tem CLI standalone próprio que instancia sem executor.
- Recomendação: alinhar ao invariante do épico: sem executor → `status:'stub'`/`success:false` (padrão já usado em `agent-invoker.js:427`); atualizar o teste que trava o comportamento antigo. É a exata classe de defeito que as 7 frentes do épico eliminaram — este ficou pra trás.

**1.13 Limitação medida (1 story) não chega à superfície do usuário** — `medium · risk · S · R4-motor-pos-hibrido`
- Evidência: `docs/epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md:66` (tabela do escopo suportado) vive em `docs/epics/`, fora do array `files` do npm (`package.json:62`); `docs/guides/user-guide.md:224` ensina `orchestrate` sem ressalva.
- Recomendação: 1 frase no help do `orchestrate` ("roda 1 story por vez") + subseção curta no user-guide EN/PT com a tabela de 2 linhas — sem isso o usuário encadeia stories no mesmo diretório e reproduz a contaminação de estado medida no checkpoint.

**1.14 Docs de usuário (EN/PT) ensinam ids de modelo 2-3 gerações atrás** — `medium · stale · S · O1-roteamento-modelo`
- Evidência: `docs/guides/user-guide.md:344` e `docs/pt/guides/user-guide.md:307` (`model: claude-3-opus`, aposentado), `docs/pt/platforms/claude-code.md:154` (`claude-sonnet-4-20250514`), `.sinapse-ai/infrastructure/integrations/ai-providers/README.md:81` (`claude-3-5-sonnet`). Todos no `files` do npm.
- Recomendação: trocar por alias de família ou placeholder neutro ("use o alias, o CLI resolve a versão") — o próprio `claude-provider.js` já evita hardcode com o comentário "stale IDs break the CLI"; a doc-espelho ficou pra trás.

**1.15 token-economy.md calibrada 200K/Opus 4.7 enquanto core-config já registra modelos 1M** — `medium · simplification · S · O2-simplificacao-pos-hibrido`
- Evidência: `.claude/rules/token-economy.md:13,17,124` (auto-compact 60%, "context amnesia", Budget 200K/working ≤80K) vs `.sinapse-ai/core-config.yaml:404` (`contextWindow: 1000000`). Seguir a regra ao pé da letra num modelo 1M dispara compactação ~5x cedo demais.
- Recomendação: parametrizar a regra pelo `models.registry` existente (tabela §8 com colunas 200K e 1M); medir antes de fixar novo gatilho (compactar cedo demais destrói contexto útil — mesma classe de dano da coordenação excessiva medida no HÍBRIDO).

### Onda 2 — alto valor (1-2 semanas) · 17 itens

**2.1 Guias do ADE vendem sistema autônomo 'Production Ready' (pré-veredito híbrido)** — `high · bug · M · R4-motor-pos-hibrido (+O6)`
- Evidência: `docs/guides/ade-guide.md:5` ("Status: Production Ready ✅"), `docs/guides/workflows/auto-worktree-workflow.md:12` ("desenvolvimento paralelo de multiplas stories"), `docs/pt/architecture/ade-architecture.md:27`, `docs/framework/source-tree.md:744`; `package.json:51` confirma docs/guides no npm.
- Recomendação: varredura de honestidade nos docs SHIPPED (docs/guides, docs/pt, docs/framework, docs/sinapse-workflows): trocar "Production Ready/autônomo" por linguagem do híbrido (assistente de 1 story) + nota de escopo com link para a limitação. Usuário que instala via npm hoje lê guia oficial prometendo exatamente o que foi medido e abandonado.

**2.2 Promessa de '1 story confiável' é falsa no Windows (bug de QA arquivado como multi-story)** — `high · bug · M · R4-motor-pos-hibrido`
- Evidência: `KNOWN-LIMITATIONS.md:3` ("confiável para 1 story isolada") vs `:47` ("mesmo quando o build é bom, o pipeline pode reportar FAILED"); `CHECKPOINT-multistory-2026-06-30.md:148` (Epic 6 sempre STUB no Windows, 0xC0000142). Story 1 do checkpoint: código correto, 5/5 testes, pipeline FAILED.
- Recomendação: reclassificar o bug 2 como dívida do caminho VIVO — corrigir o spawn aninhado no Windows OU dar saída honesta ao single-story (flag `--skip-qa` / veredito "PASS_COM_QA_PULADA"). Verificação: `displayResult()` nem exibe o `result.warning` que explicaria o FAILED — a distinção já existe nos dados internos, está sendo ocultada na UX.

**2.3 Valor medido do assistente (spec+plano) não tem superfície própria no CLI** — `high · opportunity · M · R4-motor-pos-hibrido`
- Evidência: `docs/epics/epic-orchestration-consolidation/README.md:13` ("Epic 3 (spec) e Epic 4 (plano) geram artefatos reais e de qualidade"), `bin/sinapse.js:162` (única porta = pipeline completo), `.sinapse-ai/core/orchestration/cli-commands.js:74` (`--dry-run` já existe, não documentado no help).
- Recomendação: expor `sinapse spec <story>` e `sinapse plan <story>` (ou `--only-spec/--only-plan`) parando antes do QA; documentar `--dry-run`. Hoje spec e plano bons ficam enterrados num veredito vermelho no Windows — comandos dedicados transformam o híbrido em produto percebível.

**2.4 Motor de orquestração ausente do README e inacessível pelo binário canônico** — `high · bug · M · O6-vitrine-ga`
- Evidência: `bin/cli.js:21` (KNOWN_COMMANDS sem orchestrate/build/route), `bin/sinapse.js:162` + `:1017` (o próprio código rotula o binário `sinapse` de "legacy"), `docs/guides/user-guide.md:224`, `README.md:404` (superfície pública declarada só com `npx sinapse-ai`).
- Recomendação: documentar orchestrate/build/route no README (rotulados "avançado / 1 story") e/ou expor os mesmos comandos em `bin/cli.js` — quem instala como o README ensina nunca descobre o único recurso validado pelo veredito HÍBRIDO.

**2.5 Article VIII (Mandatory Delegation) fail-open no modo de uso primário (chat interativo)** — `high · risk · M · R1-cold-review`
- Evidência: `.claude/hooks/enforce-delegation.cjs:27` ("the INTERACTIVE path ... intentionally NOT wired"), `.sinapse-ai/development/scripts/agent-exit-hooks.js:6` ("not in scope"). Verificação: fallback `session-state.json` é código morto (único writer nunca é chamado); referência à Story 6.1.6 está obsoleta (6.1.6 = Output Formatter).
- Recomendação: escopar honestamente a claim "Gates auto-block violations" na Constitution/CLAUDE.md (caminho autônomo apenas), OU fechar o sinal do caminho interativo (ex.: hook que infere o agente ativo a partir do último Task/slash-command). Hoje o Art. VIII declara "AUTOMÁTICO e INVIOLÁVEL" sem ressalva de escopo — a doc pública não reflete a decisão real.

**2.6 Motor de contexto synapse (8 camadas) nunca ativa em projeto recém-instalado** — `high · bug · M · R1-cold-review`
- Evidência: `.sinapse-ai/core/synapse/runtime/hook-runtime.js:45` (`if (!fs.existsSync(synapsePath)) return null;`, inalterado desde 2026-05-04); `packages/installer/src/` sem NENHUMA referência a `.synapse` — nenhum projeto instalado ganha a pasta; ela só existe no repo-fonte por dogfooding (gitignored).
- Recomendação: resolver a F6 do épico de consolidação (nunca fechada — ficou condicionada ao "dobrar" que não veio): ou o instalador cria `.synapse/` (sessions/constitution) no setup, ou o subsistema é formalmente descontinuado e documentado. **Descontinuação: requer validação de arquitetura + dono do domínio (Conservative Default).**

**2.7 workflow-intelligence sem consumidor de produção alcançável** — `high · stale · M · R1-cold-review (+R2)`
- Evidência: `.sinapse-ai/core/execution/wave-executor.js:18` (único require de workflow-intelligence no repo) — e o próprio WaveExecutor tem 0 chamadores fora de `tests/core/wave-executor.test.js:2`. `entity-registry.yaml` documenta `usedBy: []`. Mesma falha que a auditoria original classificou como violação do Art. IV, sobrevivente ao épico que declarou "o motor deixou de ser teatro".
- Recomendação: decisão formal estilo F3C: cabear o wave-executor a um caminho CLI real (dentro de `sinapse orchestrate`) OU aposentar o módulo e registrar em KNOWN-LIMITATIONS. **Remoção: requer validação de arquitetura + dono do domínio (Conservative Default).**

**2.8 ~4.2k linhas de maquinário paralelo/multi-story órfão em core/execution** — `medium · stale · M · R4-motor-pos-hibrido`
- Evidência: `wave-executor.js:5`, `semantic-merge-engine.js:6`, `result-aggregator.js:31`, `parallel-executor.js:5` (ainda referencia o provider Gemini já removido — 45 menções) — 7 módulos (wave-executor 401, parallel-monitor 430, result-aggregator 486, rate-limit-manager 315, context-injector 537, semantic-merge-engine 1.748, parallel-executor 299 linhas), só os próprios testes como consumidores; tudo shipped no npm (L1 core).
- Recomendação: NÃO deletar já — story de decisão formal por módulo (arquivar/remover vs manter como reserva com marcador `@abandoned-path`). **Requer validação de arquitetura + dono do domínio (Conservative Default).**

**2.9 i18n do troubleshooting não concluída (base 100% em inglês)** — `medium · stale · M · R3-clinica`
- Evidência: `packages/installer/src/wizard/validation/troubleshooting-system.js:23,30` — 27 strings problem/causes/solutions em EN bruto vs 3 usos de `t()/tf()` no arquivo; o arquivo irmão (`report-generator.js`) já é 100% i18n.
- Recomendação: migrar o TROUBLESHOOTING_DATABASE para chaves de `i18n.js` (PT+EN), completando a ação do achado #10 da clínica (a metade das URLs já foi feita no #298).

**2.10 Atlas hardcoda tabela opus-xhigh em 3 fontes JS + doc gerado** — `medium · stale · M · O1-roteamento-modelo`
- Evidência: `.sinapse-ai/core/atlas/render-markdown.js:84`, `.sinapse-ai/core/atlas/flows-pt.js:70` (+`flows.js:74`), `docs/framework/atlas/OPERATING-ATLAS.md:389`. Nenhum teste/CI compara essas tabelas com a regra-fonte — deriva passa despercebida.
- Recomendação: atualizar as 3 fontes junto com a regra e regenerar OPERATING-ATLAS/atlas.html/atlas-data.json; avaliar extrair a tabela de routing para UMA fonte (core-config/data yaml) consumida por regra e atlas. Mudança em L1 — **processo de override do Artigo XI (validação de arquitetura + dono do domínio)**.

**2.11 Squad claude-code-mastery distribui 'Opus 4.6' como FRONTIER_MODEL_NAME** — `medium · stale · M · O1-roteamento-modelo`
- Evidência: `squads/claude-code-mastery/knowledge-base/claude-code-internals-reference.md:119,691`; `squads/claude-code-mastery/tasks/create-agent-definition.md:133` (placeholders `{opus-4|sonnet-4|haiku-4}` em template de geração ativa), `squads/claude-code-mastery/data/claude-code-quick-ref.yaml:294`. Critic: mesmo valor também em `claude-code-internals-deep.md:142`.
- Recomendação: varredura dedicada na squad (knowledge-base/, tasks/, data/, agents/): frontier atual + placeholders por família em create-agent-definition e create-team-topology (linhas 233/237). A squad é o multiplicador — cada agent/topologia que ela cria herda o id stale.

**2.12 Thresholds de contexto calibrados pra 200K perdem sentido com janela 1M** — `medium · opportunity · M · O1-roteamento-modelo`
- Evidência: `.claude/rules/token-economy.md:13,124`; `.sinapse-ai/core/synapse/context/context-tracker.js:61` (`DEFAULTS.maxContext: 200000` — e os templates de install não têm seção `models`, então instalações reais caem no fallback mesmo com modelo 1M); `.sinapse-ai/product/templates/statusline/statusline-script.js:125` (alerta `>200k`).
- Recomendação: dual-trigger (percentual + absoluto — compactar no MENOR entre 60% da janela e ~150-180K de histórico vivo); re-significar o alerta ">200k!" de perigo para fronteira de pricing long-context; derivar `maxContext` do registry; §8 da regra com colunas 200K e 1M.

**2.13 Injeção de constituição por prompt duplica o que já está estático** — `medium · simplification · M · O2-simplificacao-pos-hibrido`
- Evidência: `.claude/hooks/synapse-engine.cjs:8`, `.sinapse-ai/core/synapse/engine.js:191`, `.synapse/constitution:2`, `context-tracker.js:30`. O hook injeta as 96 regras em todo prompt, repetindo conteúdo já presente em CLAUDE.md + rules sempre-carregadas.
- Recomendação: decidir UMA fonte de constituição por prompt; piloto reversível: em bracket FRESH, reduzir a injeção a ponteiro de 1 linha e medir 2 semanas (violações de gate — métricas já existem em `.synapse/metrics`). Hooks determinísticos (story-gate, delegation, secret-scan, git-push-authority) ficam intactos — eles são o enforcement real. Executar coordenado com 1.1/1.6. **Redução/remoção de camada: requer validação de arquitetura + dono do domínio (Conservative Default).**

**2.14 Boilerplate de ativação idêntico (~51 linhas) em 12 agentes** — `medium · simplification · M · O2-simplificacao-pos-hibrido`
- Evidência: `.sinapse-ai/development/agents/developer.md:18,51,242`; `sprint-lead.md:95,98` ("dumb AI agents" — contradiz o posicionamento do produto); grep: "STAY IN CHARACTER!" em 35 arquivos, "GREENFIELD GUARD" em 31; bloco ~85-95% idêntico em 11/12 agentes core.
- Recomendação: extrair o bloco para template único e aposentar a linguagem de coerção pra modelo fraco, mantendo identidade/comandos/autoridade/greeting (que é produto). Piloto em 1-2 agentes com `validate:agents` + `validate:parity` antes de tocar os 160 de squads. Nota: o template citado (`activation-instructions-template.md`) existe mas está desatualizado — precisa reescrita. **Remoção de texto de agentes: requer validação de arquitetura + dono do domínio (Conservative Default).**

**2.15 Escada de brackets (FRESH/MODERATE/DEPLETED/CRITICAL) é maquinaria dormente** — `medium · simplification · M · O2-simplificacao-pos-hibrido`
- Evidência: `engine.js:188` ("L3-L7 produced 0 rules — disabled"), `:304` ("Bracket management replaced by native /compact"), `core-config.yaml:401,404`, `synapse-engine.cjs:79`. Com modelo 1M, sair de FRESH exige >166 prompts; sessions locais: 9/10 em FRESH (o único não-FRESH é fixture sintética) — 3 dos 4 brackets são código morto na prática.
- Recomendação: concluir a aposentadoria que o NOG-18 começou — medir 2-4 semanas de `.synapse/sessions` e hook-metrics, então decidir remover ou congelar SYNAPSE_LEGACY_MODE, budgets DEPLETED/CRITICAL e persistência de last_bracket. Cada remoção como decisão própria com evidência, **conforme Artigo XI — requer validação de arquitetura + dono do domínio (Conservative Default)**; nada de sweep.

**2.16 Protocolo de handoff (~379 tokens) não enforçado, otimiza fração mínima da janela** — `medium · simplification · S · O2-simplificacao-pos-hibrido`
- Evidência: `.claude/rules/agent-handoff.md:10,22,108` ("mentally generate" — sem enforcement; aritmética "33% reduction" de outra era), `.claude/CLAUDE.md:89`; `.sinapse/handoffs/` vazio nesta máquina; nenhum hook/gate lê ou escreve o artifact desse protocolo.
- Recomendação: separar as duas funções — MANTER o artifact YAML como sinal de workflow (alimenta o "Suggested next command" via workflow-chains.yaml), APOSENTAR a contabilidade de compaction (379 tok/33%/limite de 3 summaries). Medir primeiro: contar artifacts reais em uso normal. **Aposentadoria da metade compaction: requer validação de arquitetura + dono do domínio (Conservative Default).**

**2.17 Inventário dos 15 YAMLs de workflow: só development-cycle tem engine real** — `medium · opportunity · S · O3-orquestracao-deterministica`
- Evidência: `.sinapse-ai/core/orchestration/workflow-executor.js:104` (único YAML executado in-process), `greenfield-handler.js:149` (carrega mas steps são prosa — e nem lê o próprio YAML), `service-registry.json:11956` (catálogo puro), `auto-worktree.yaml:24` (`event: story_started` que nenhum engine escuta), `story-development-cycle.yaml:6`.
- Recomendação: classificação verificada — (a) engine real: development-cycle; (b) carregados por handlers com steps em prosa: greenfield-{ui,fullstack,service}, brownfield-{ui,fullstack,service,discovery}; (c) citados por executor mas quebrado/parcial: qa-loop, spec-pipeline; (d) catálogo puro: story-development-cycle, epic-orchestration, fast-track, auto-worktree, design-system-build-quality. Decisão: manter YAML como espec/fonte da verdade e criar camada executável `.workflow.js` APENAS pros 3-5 fluxos de maior valor — não tentar "executar" os 15. Esta decisão escopa a Onda 3.

### Onda 3 — estrutural (mês+) · 5 itens

**3.1 Eval de regressão comportamental não institucionalizado** — `high · opportunity · L · O4-pesquisa-para-produto`
- Evidência: pesquisa prescreve ("Evals antes de otimizar", "Eval em CI bloqueia merge" — `_research/engenharia-software/fase-4-agents/KIT-ai-engineering.md:58,79`; `LOOPS-onda-8:279`); produto tem fundação (`tests/evals/README.md:3,5` — camada determinística G1-G5) mas a decisão estratégica mais importante do framework (HÍBRIDO, 30/06) nasceu de eval manual irrepetível em scratchpad (`CHECKPOINT-multistory-2026-06-30.md:30` — "Nothing written to the framework repo except this report") e a falha achada virou 1 teste jest ad-hoc (`gate-evaluator.js:449`), não processo.
- Recomendação: golden set comportamental versionado: todo bug de comportamento (badge leak, gate frouxo, spec degradada) vira caso permanente; PR que altera `agents|tasks/*.md` exige baseline verde; promover o protocolo do checkpoint (2 braços + scoreboard) a script repetível (`npm run eval:e2e`). Ressalva da verificação: casos comportamentais exigem invocar LLM — o harness atual é determinístico por design ("No LLM"), então o esforço real é maior que "estender": é construir a camada com-LLM ao lado da determinística.

**3.2 No Invention (Art. IV) sem dente determinístico — BLOCK é auto-julgamento do LLM** — `medium · opportunity · M · O4-pesquisa-para-produto`
- Evidência: `KIT-ai-engineering.md:72` e `LOOPS-onda-8:108` (pesquisa: "código órfão é tratado como invenção"); `.sinapse-ai/constitution.md:101` (gate = task .md que o próprio LLM lê e se auto-aplica, `spec-write-spec.md:65`); `.claude/hooks/enforce-story-gate.cjs:7` garante QUE existe story, não que o diff implementa o que a story pede. `article-gates.yml` cobre só Art. VII/VIII/XI — não existe `validate:article-iv`.
- Recomendação: check leve de rastreabilidade (hook ou CI): para PR com ref de story, extrair os ACs e exigir mapa arquivo→AC; órfão começa como warning e vira BLOCK após calibração.

**3.3 TOP 3 — Brownfield Discovery com fan-out real (parallel() + gate de QA em código)** — `medium · opportunity · M · O3-orquestracao-deterministica`
- Evidência: `.sinapse-ai/development/workflows/brownfield-discovery.yaml:23` (cada passo "executed via manual prompt"), `:32` (paralelismo aspiracional, nunca implementado — `executeWorkflow()` só carrega/valida e devolve handoff), `:6`.
- Recomendação: Fase Coleta = parallel(arquiteto→system-architecture, dados→SCHEMA+DB-AUDIT, ux→frontend-spec) com schema por artefato; Draft consolidado por agente único; Review = fan-out de 2-3 céticos; Gate QA = APPROVED/NEEDS_WORK com retorno automático (máx 2 voltas); Final = síntese + epic/stories. É o fluxo de onboarding do caso mais comum de usuário real. Ressalva de risco (da verificação): a decisão HÍBRIDO mediu coordenação sabotando — adotar só com gate de medição.

**3.4 TOP 4 — Greenfield Discovery Phase 1 como pipeline com gates de artefato** — `medium · opportunity · M · O3-orquestracao-deterministica`
- Evidência: `.claude/rules/documentation-first.md:51` (layer-2 conduction declarada como roadmap intencional), `.sinapse-ai/development/workflows/greenfield-fullstack.yaml:19` (`confirmation_required: true` é decorativo — o handler nunca parseia o YAML e `_spawnAgent` sempre retorna success), `:75`.
- Recomendação: pipeline(analyst→brief, pm→prd, ux→spec, architect→arch, po→validação) onde cada estágio tem (1) schema de saída, (2) gate determinístico "artefato existe e não está vazio" (eco do fix #317; `doc-first-resolver.js::fileHasContent` já existe e é reutilizável), (3) checkpoint humano honrando o confirmation_required. Ataca a queixa histórica nº1 (framework pulando doc-first em projeto grande) sem hook always-on — só quando o usuário aceita rodar o workflow.

**3.5 TOP 5 — Epic waves multi-story como wrapper fino no harness (exige piloto medido)** — `medium · opportunity · M · O3-orquestracao-deterministica`
- Evidência: `.sinapse-ai/development/workflows/epic-orchestration.yaml:4,66` (template genérico com `maxConcurrency: 4` que nunca teve executor — só entrada de catálogo, `service-registry.json:11739`); o próprio épico aponta a saída: "o caminho nativo (ou um wrapper fino por story) é mais correto, mais barato e mais portável" (`docs/epics/epic-orchestration-consolidation/README.md:15`).
- Recomendação: sem re-litigar o veredito — para cada wave, fan-out POR STORY em worktree isolado (zero estado compartilhado: o bug de contaminação `plan/build-state.json` não existe no harness), gate de wave = testes/lint verdes + arquivos realmente escritos, checkpoint humano entre waves. **Gate inegociável de adoção: repetir o protocolo de medição de 30/06 (3 stories dependentes vs nativo puro); se não vencer ou empatar com custo menor, não vira produto.**

---

## 4. As 6 frentes Fable 5

**O1 — Roteamento de modelo.** Descobriu staleness sistêmico de era-de-modelo: a regra NON-NEGOTIABLE de routing ainda mira "Opus 4.7" como teto (`token-economy.md:25,29,41`), o único registry executável de modelos não conhece `claude-fable-5`/`claude-sonnet-5` (`core-config.yaml:401` — o cálculo de contexto acerta por coincidência de janela), o Atlas triplica a tabela opus-xhigh em 3 fontes JS + doc gerado, docs EN/PT ensinam `claude-3-opus` (2-3 gerações atrás) e a squad claude-code-mastery — cujo produto é maestria em Claude Code — distribui "Opus 4.6" como frontier e templates que pinam novos agents em modelos Claude 4. O que vale mais: um refresh coordenado com fonte única de routing (a proposta de "tabela única família Claude 5" ficou não-verificada, mas os 6 achados confirmados já dão o mapa das superfícies); a hipótese de que o skill model-router estaria stale "por outra porta" foi refutada — "fable" nunca foi adotado como rebranding de tier no repo.

**O2 — Simplificação pós-híbrido.** Descobriu que, com o motor honesto e a era 1M, sobrou cerimônia calibrada pra modelos fracos e janela 200K: a constituição reinjetada por prompt duplica o que já está estático, ~51 linhas de boilerplate de ativação idênticas em 12 agentes (com linguagem "dumb AI agents" que contradiz o produto), a escada de brackets é maquinaria dormente (o próprio código diz "replaced by native /compact"; 9/10 sessões nunca saem de FRESH), o protocolo de handoff de 379 tokens não é enforçado e otimiza fração mínima da janela, e a token-economy prescreve números de outro hardware. O que vale mais: pilotos reversíveis e medidos (não sweep) que cortam custo fixo mantendo o enforcement real — os hooks determinísticos ficam intactos; a suspeita de "delegação duplicada em 4 camadas" foi refutada (a 4ª camada não existe; rules agregam conteúdo operacional próprio).

**O3 — Orquestração determinística.** Mapeou os 15 YAMLs de workflow e cravou o gap central: só development-cycle tem engine real; o workflow primário (SDC) e o de épico são prosa que o modelo pode seguir ou não; `auto-worktree.yaml` declara triggers que nenhum engine escuta. A via pós-veredito não é ressuscitar o motor caseiro, e sim wrapper fino no harness com gates determinísticos e fan-out por story em worktree isolado — TOP 3 (brownfield), TOP 4 (greenfield com gates de artefato) e TOP 5 (epic waves, condicionado a repetir o protocolo de medição de 30/06) confirmados; TOP 2 (QA loop "de graça") e a fachada `sinapse workflow` foram refutados justamente por reabrirem a aposta recém-encerrada ou confundirem ferramenta interna com produto. O que vale mais: executar a camada `.workflow.js` só nos 3-5 fluxos de maior valor, cada adoção com gate de medição.

**O4 — Pesquisa para produto.** Cruzou a base de engenharia (ondas 8, domínio 27) com o que o framework pratica e achou a lacuna mais estratégica da auditoria: eval não é gate. A decisão mais importante do produto (HÍBRIDO) nasceu de um eval manual irrepetível em scratchpad; a falha achada virou 1 teste ad-hoc, não golden set; e o Art. IV (No Invention) não tem dente determinístico — o piso garante QUE existe story, não que o diff implementa o que a story pede. O que vale mais: institucionalizar o protocolo do checkpoint (2 braços + scoreboard) como script repetível e criar o check de rastreabilidade arquivo→AC; os 4 achados de qualidade de spec/ACs/LLM-judge ficaram não-verificados e são candidatos naturais da 2ª rodada (junto com os LOOPS W19-W27 nunca lidos).

**O5 — Dieta de contexto.** Encontrou (e mediu com o formatter real) o maior custo fixo por prompt do framework: a Constitution inteira — 96 regras, ~1.831 tokens — reinjetada em TODO prompt via hook, estourando estruturalmente os budgets declarados dos brackets FRESH (800) e MODERATE (1.500) sem sinalizar, enquanto o template de CLAUDE.md que toda instalação recebe é 3,4x maior que o usado pelo próprio time e ensina personas erradas (Dex vs Pixel) sem o Artigo XI. O que vale mais: o trio 1.1 + 1.6 + 1.7 (emitir a constituição 1x por sessão, recalibrar budgets, regenerar o template) — correções S/M com impacto imediato em toda instalação; os achados de duplicação CLAUDE.md/AGENTS.md e rules sem escopo por path ficaram não-verificados.

**O6 — Vitrine GA.** Encontrou a inversão de vitrine: o produto real validado (motor híbrido honesto, spec+plano de qualidade para 1 story) está invisível no README e inacessível pelo binário canônico que o README ensina (`npx sinapse-ai`), enquanto os guias shipped no npm ainda vendem o sistema autônomo multi-story "Production Ready" que foi medido e abandonado — e o próprio CHANGELOG afirma uma varredura de honestidade que não cobriu esses guias (a alegação de honestidade virou, ela mesma, uma imprecisão pública). É a mesma classe de falha do NO_GO de 29/06, agora na camada de guias. O que vale mais: a varredura de honestidade nos docs SHIPPED + expor/documentar orchestrate no caminho canônico; os itens de contagem (hooks 17vs19, doctor checks) são low e ficaram não-verificados.

---

## 5. Refutados e não-verificados

### 5.1 Refutados (9)

| Título | Por que caiu |
|---|---|
| TOP 2 — QA Loop como workflow harness conserta de graça o spawn quebrado no Windows | Toda invocação real de agente resolve em `runSafe('claude', ...)` — o mesmo spawn que quebra no Windows; portar YAML pra `.workflow.js` não muda o mecanismo; e a não-correção é decisão consciente documentada (KNOWN-LIMITATIONS) que a recomendação revertia sem reconhecer |
| Onde mora no produto: `.claude/workflows/` versionado + fachada CLI `sinapse workflow` | Confunde ferramenta interna de auto-auditoria (Workflow tool de sessão, módulos hardcoded do próprio framework) com lacuna de produto; o lar canônico de workflows é `.sinapse-ai/development/workflows/` (versionado e shipped); deny-by-default do .gitignore é arquitetura vigente; remediação do CRITICAL#1 foi documental por decisão |
| Risco: custo de tokens da frota de auditoria completa (~2-3M) | Artefato é interno (docs/epics fora do npm, sem subcomando no CLI); as mitigações pedidas (routing sonnet/opus, retomada incremental, OK prévio do Caio) já existem no próprio arquivo citado |
| config-loader.js deprecated e exportado pelo barrel | Dívida tem dono e decisão documentada (DEPRECATED-BARREL-1, audit 2026-06-11, warning runtime único); e "v4.0.0" está no futuro (repo em v1.19.2 pós-reset), não "vários majors atrás" |
| `_runTests()` do Epic 4 é stub literal (nunca roda testes) | Só alcançável em fallback de teste (sem SINAPSE_REAL_DISPATCH); em execução real o Epic 4 delega ao BuildOrchestrator e QA é papel do Epic 6 por arquitetura documentada ("QA is Epic 6's job") |
| 3 entry points de CLI sobrepostos com implementações independentes | `sinapse-delegate` é capacidade distinta; o núcleo compartilha módulos reais (doctor/wizard); convivência é decisão ativa rastreada (Story 10.13, deprecation → v11). A parte verdadeira (bugs derivados da duplicação) sobreviveu como 2 achados confirmados próprios (1.2 e 1.3) |
| Skill model-router define 'opus (default)' sem fable | "fable" nunca foi adotado como rebranding do tier no repo (só docs de épico datados, janela grátis encerrada); core-config mantém opus-4-8; não existe "regra corrigida" que o skill estaria descompassando |
| Mesma política de delegação duplicada em 4 camadas | A 4ª camada (reinjeção via prompt) não existe pra essa política — o hook UserPromptSubmit é o synapse engine (sistema distinto, sem referência a Mandatory Delegation); hooks de delegação são gates determinísticos, não replicadores; rules agregam conteúdo operacional não-redundante |
| Risco: acoplamento ao harness Claude Code sem degrade declarado | O documento citado É o degrade declarado (checkpoint medido + "use o caminho nativo"); paridade Codex tem programa dedicado com limites declarados; a recomendação pressupunha comando/tool inexistentes no repo |

### 5.2 Não-verificados (35)

Motivos sistêmicos (do método): **[L]** low = sem verificação individual por política; **[C]** medium/high = fora do orçamento de verificação ou sem veredito unânime nas lentes (o dado bruto não distingue os dois casos). Permanecem hipóteses de frente, não fatos auditados — candidatos da 2ª rodada, priorizados pelos high.

| Título | Sev | Frente | Motivo |
|---|---|---|---|
| 120 links relativos quebrados sobrevivem em docs/ fora do fix pontual | high | R3-clinica | [C] — scan da frente indicou 120 em 58 arquivos; scanner ignora links absolutos/âncoras (ver §6) |
| Proposta: tabela única de routing família Claude 5 em todas as superfícies | high | O1-roteamento-modelo | [C] — proposta agregadora; os 6 achados-base foram confirmados individualmente |
| TOP 1 — Frota de auditoria multi-dimensão como workflow executável de produto | high | O3-orquestracao-deterministica | [C] — adjacente a 2 refutados da mesma frente; exige validação de produto |
| Veredito medido não virou guarda: orchestrate aceita cenário reprovado sem aviso | high | O4-pesquisa-para-produto | [C] — sobrepõe parcialmente 1.13/2.2 confirmados |
| LLM-as-judge decide o Done sem calibração documentada com humano | medium | O4-pesquisa-para-produto | [C] |
| ACs são lista copiada do épico, não Given/When/Then executável | medium | O4-pesquisa-para-produto | [C] |
| spec.md validado só por existência, sem schema/grounding/auto-repair | medium | O4-pesquisa-para-produto | [C] |
| 7 regras 'sempre-ativas' carregam conteúdo situacional sem escopo por path | medium | O5-dieta-de-contexto | [C] |
| CLAUDE.md e AGENTS.md duplicam a mesma lei em dois arquivos mantidos à mão | medium | O5-dieta-de-contexto | [C] |
| Constitution representada 2x em granularidades diferentes na mesma sessão | medium | O5-dieta-de-contexto | [C] |
| npx sinapse-ai install não escreve nada no projeto | medium | O5-dieta-de-contexto | [C] |
| user-guide.md ensina personas e modelo obsoletos (Dex/Quinn/Aria, claude-3-opus) | medium | O6-vitrine-ga | [C] — parcialmente coberto pelos confirmados 1.7/1.9/1.14 |
| README ensina 'sinapse-orqx' como orquestrador, repo marca DEPRECATED | medium | O6-vitrine-ga | [C] |
| Motor híbrido honesto é valor real e invisível no README | medium | O6-vitrine-ga | [C] — o lado "bug de acesso" foi confirmado (2.4) |
| ideation-engine: docstring vende 'AI-powered' pra grep/heurística | low | R1-cold-review | [L] |
| KNOWN-LIMITATIONS descreve como 'não aplicada' correção já parcialmente feita | low | R2-epico-mae-muros | [L] |
| sinapse-minimal.js promete auto-remoção 'em v11' (linha do tempo inexistente) | low | R2-epico-mae-muros | [L] |
| 'Livro de Ouro' cita pacote npm errado (@caioimori/sinapse) em arquivos shipped | low | R3-clinica | [L] |
| Exports mortos no barrel de orchestration (EpicContextAccumulator, WorkflowOrchestrator) | low | R4-motor-pos-hibrido | [L] |
| Flag morta parallelMode/maxParallel no DEFAULT_CONFIG do BuildOrchestrator | low | R4-motor-pos-hibrido | [L] |
| buildOptions passado em dobro no Epic 4 | low | R4-motor-pos-hibrido | [L] |
| Agents de squad com model: pinado no frontmatter e exemplo SDK datado | low | O1-roteamento-modelo | [L] |
| Template canônico de story calibrado nominalmente pra 'Opus 4.7' | low | O1-roteamento-modelo | [L] |
| Task distribuída assina commits como 'Co-Authored-By: Claude Opus 4.6' | low | O1-roteamento-modelo | [L] |
| CLAUDE.md do projeto resume routing como haiku/sonnet/opus (vai divergir) | low | O1-roteamento-modelo | [L] |
| Workflow CodeRabbit WSL duplicado em 5 agentes + rules + config | low | O2-simplificacao-pos-hibrido | [L] |
| Blocos anti-alucinação e lembrete NSN repetidos em dezenas de arquivos | low | O2-simplificacao-pos-hibrido | [L] |
| 12 de 13 rules byte-idênticas entre ~/.claude/rules e .claude/rules | low | O2-simplificacao-pos-hibrido | [L] |
| Compactar a 60% é regra NON-NEGOTIABLE sem medidor de uso de janela | low | O4-pesquisa-para-produto | [L] |
| Limite de 500 tokens do handoff é declarado mas nunca contado | low | O4-pesquisa-para-produto | [L] |
| Contrato de tool sem lint que exija descrição o-que/quando/quando-não | low | O4-pesquisa-para-produto | [L] |
| Gate de cerimônia COMPLEX>=16 existe só em prosa, não no classificador real | low | O4-pesquisa-para-produto | [L] |
| Camadas L1/L2 rodam todo prompt sem produzir conteúdo em instalação padrão | low | O5-dieta-de-contexto | [L] |
| README se contradiz sobre número de hooks (17 vs 19) | low | O6-vitrine-ga | [L] — R3 verificou "17" consistente; resíduo é o 1:1 com settings.json |
| Número de health checks do doctor diverge entre 3 fontes (12/16/15) | low | O6-vitrine-ga | [L] |

---

## 6. Limitações desta auditoria

**Caps do método aplicados:**
- Low sem verificação individual por política (21 dos 35 não-verificados); medium com 1 lente apenas; voto dividido = não-verificado (o dado consolidado não distingue "fora do orçamento" de "voto dividido" nos medium/high não-verificados).
- Missão read-only: a suíte de testes NÃO foi executada em nenhuma das 10 rodadas; nenhuma instalação real de teste foi gerada; nenhum PR de teste foi aberto contra o branch protection.
- Os 9 scores de saúde por dimensão do cold review não foram reproduzidos (exigiria refazer a metodologia original de 8 frentes) — melhora registrada só direcionalmente.
- Contagem de achados brutos é um piso (≥84): só as 3 duplicatas cross-frente formalmente registradas via `also_reported_by` foram contabilizadas.

**Lacunas concretas do critic para a 2ª rodada (8):**
1. **CI do Windows não é gate de merge** (verificação preliminar do critic): `cross-platform-pr` (`.github/workflows/ci.yml:692`) está ausente do `needs:` de `validation-summary` (`ci.yml:456`) e dos 4 contexts do branch protection — o job pode falhar vermelho e o PR seguir mergeável; explicação estrutural de como o bug de QA no Windows sobrevive sem re-quebrar CI. Validar com PR de teste.
2. **`FRONTIER_MODEL_NAME: "Opus 4.6"` em 2 arquivos** (`claude-code-internals-reference.md:119` E `claude-code-internals-deep.md:142`) — não verificado se um é fonte e outro cópia driftada, nem se o padrão se repete em irmãos não lidos.
3. **172 vs 189 agentes nunca reconciliado** — fonte do "189" localizada (`subagent-dispatcher.js:265`) vs "172" fixado em README/constitution/PR #300; rodar a contagem real do resolver em runtime.
4. **Knowledge-base files nunca abertos** — ~14 fora da claude-code-mastery + 2 dentro dela (`memory-systems-reference.md`, `context-window-optimization.md`); alta probabilidade de mais achados da classe "Opus 4.6".
5. **LOOPS W19-W27 (cauda do domínio 27, Evals/Guardrails) não lidos** — único jeito de saber se a pesquisa já prescreve o processo que falta no produto (item 3.1) ou se a lacuna é também da pesquisa.
6. **Paridade multi-IDE não medida empiricamente** — fidelidade de persona aceita só pela leitura do mecanismo; sem instalação real, a colisão "Nexus" nos mirrors gerados também fica sem base empírica.
7. **Suíte de testes nunca executada** — números citados (9.374 it / 19.151 assertions / 607 segurança) não reproduzidos; evidência indireta favorável (jest alimenta validation-summary; anti-theater não está em testPathIgnorePatterns) confirma que o mecanismo existe, não que passa hoje.
8. **Assimetria EN/PT em docs/architecture** — `docs/architecture/` (EN, plana) nunca existiu; 15 arquivos contêm a string literal `docs/architecture`; o scanner da R3 ignora links absolutos e não valida âncoras, então esses 15 podem não estar nos "120 quebrados" — resolver cada ocorrência e decidir se é extensão do achado ou algo maior.

*Duas suspeitas do critic já checadas e descartadas (não reabrir): validation-summary agrega test/lint/typecheck com lógica real de FAILED; anti-theater não é silenciosamente ignorado pelo jest.*

---

## 7. Próximo passo

Aprovar o roadmap e disparar a Onda 1 (15 itens, escala de dias — começando pelo corte da reinjeção da Constitution, o maior custo fixo por prompt), enquanto a 2ª rodada de verificação cobre as 8 lacunas do critic e os 4 não-verificados high antes de abrir a Onda 2.

---

*Relatório gerado pela auditoria Fable 5 Upgrade · 10 frentes → dedup → verificação adversarial → síntese · fiel aos dados coletados em 2026-07-02 sobre `main` @ `92463d0` (v1.19.2).*
