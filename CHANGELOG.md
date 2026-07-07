# Changelog

All notable changes to SINAPSE will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.22.0] — 2026-07-07 — 🎛️ Mesa AF-20260704: guards doc-first + economia de contexto + calibração do juiz

> Minor. Atualização segura via `npx sinapse-ai update`. Executa integralmente a Mesa da rodada 2 (épicos `epic-rodada2-mesa` + `epic-rodada2-mesa-fase2`, PRs #357–#368) — dos guards de qualidade ao contexto enxuto, tudo com verificação adversarial.

### Features

- **gate:** verificação de substância do spec no gate doc-first — passa de "arquivo existe" para conteúdo real (#358)
- **gate:** check de fonte única CLAUDE.md ⇄ AGENTS.md no gate de PR (#361)
- **lint:** guard de descrição de ferramentas/comandos — descrição vaga/vazia degrada roteamento, agora barrada (#359)
- **lint:** ACs nascem em Given/When/Then executável (template) + guard advisory `validate:story-acs` (#364)
- **spec:** cerimônia COMPLEX≥16 do spec-pipeline aplicada em código, não só em prosa (#360)
- **quality:** calibração do juiz LLM — golden set determinístico (gate 100% em CI) + primeira medição semântica **95,2%** juiz-vs-humano, 15/15 nos casos críticos (#365, #368)

### Refactoring

- **rules:** híbrido core+companion nas 4 rules NON-NEGOTIABLE situacionais — a lei fica sempre-ativa, o detalhe carrega por path. Contexto fixo de regras **−48%** (856→445 linhas/prompt), enforcement preservado (#367)
- **agents:** dedup da integração CodeRabbit para fonte única — −140 linhas de config duplicada em 6 agentes (#362)

### Documentation

- **links:** zera 121 links markdown quebrados (#357)
- **decisões:** 3 ADRs de governança (frota como ferramenta interna, aliases LiteLLM legados, escopo das rules) + fundação dos épicos da Mesa (#356, #363, #366)

## [1.21.0] — 2026-07-04 — 🏗️ Onda 3 estrutural: gates determinísticos em todos os fluxos + eval como gate de merge

> Minor. Atualização segura via `npx sinapse-ai update`. Fecha a Onda 3 da auditoria AF-20260702 (épico `epic-onda3-estrutural`, PRs #346–#351) — do "otimizado" ao "robusto por design".

### Features

- **constitution:** Artigo IV (No Invention) ganha dente determinístico — `validate:article-iv` no pre-push rastreia arquivos de produto alterados contra o File List da story referenciada; órfão = warning na calibração, `--strict` promove a bloqueio. CI reporta SKIP explícito (stories são locais por design) (#346)
- **orchestration:** Phase 1 do greenfield só avança com artefatos reais no disco (gate `fileHasContent` por estágio) + `metadata.confirmation_required` do YAML passa a ser consumido de verdade (`false` = auto-GO nas pausas go_pause) (#347)
- **orchestration:** brownfield discovery com progresso determinístico (`brownfield-progress.js` mede as 10 fases pelos artefatos no disco, com ponto exato de retomada) + gate QA da Fase 7 avaliado em código (APPROVED/NEEDS WORK, máx 2 reworks → escalate) (#348)
- **evals:** golden set comportamental permanente do gate de épicos (6 casos travando os bugs medidos em 30/06: build vazio, plano stub, zero-checks, sinal de falha ignorado) + `npm run eval:e2e` rodando dentro de `npm test` — regressão comportamental agora bloqueia merge. Protocolo de medição 2 braços promovido a doc executável (#349)
- **orchestration:** `scripts/wave-gate.js` — gate determinístico por wave (testes verdes + arquivos realmente escritos). O wrapper autônomo de epic waves foi construído, MEDIDO pelo protocolo pré-registrado e **reprovado** (empate em correctness, ~2x custo vs caminho nativo) — não vira produto; o gate fica como utilitário standalone e os templates ganham nota de honestidade (#350)

### Maintenance

- manifests regenerados pós-consolidação da Onda 3; entidades novas registradas (#351)

## [1.20.1] — 2026-07-03 — 🛡️ Segurança em 3 ondas + ativação enxuta + corte do cluster órfão (DEC-03)

> Patch. Atualização segura via `npx sinapse-ai update`. Fecha a execução da mesa de decisões da otimização: PRs #337–#344.

### Bug Fixes

- **security:** Onda A da triagem AF-20260703 — 4 fixes cirúrgicos: CodeQL volta a analisar `actions`, escape de HTML na fonte geradora do atlas, âncoras agrupadas no secret-scan (equivalência validada com 20.030 casos), sanitização de log no updater (#337)
- **security:** Onda B1 — TOCTOU eliminado na cadeia de confiança do instalador (manifest-signature/file-hasher/post-install-validator em file descriptor único) + git sem shell no gate do Artigo XI (#340)
- **security:** Onda B2 — escrita atômica (tmp+rename) em ~30 pontos/21 arquivos de todo o caminho de instalação (#341)

### Maintenance

- **security:** Onda C — higiene do code scanning (`paths-ignore` de testes fecha ~366 alertas de teste na análise da main) + 2 falso-positivos dismissados com evidência + os 5 únicos fixes de qualidade fora de testes (#339)
- **agents:** rollout da ativação enxuta pós-piloto — 22 arquivos (9 núcleo + 8 mastery + 4 locais + template), −717/+374 linhas, zero coerção restante (#342)
- **cleanup:** DEC-03 — remoção do cluster multi-story órfão (~4,4k linhas de código morto shipped: wave-executor, parallel-monitor, context-injector, semantic-merge-engine, parallel-executor de execution/, wave-analyzer + task `*waves`) com split DEC-02 preservando suggestion-engine/learning; registries e manifests regenerados (#344)

### Documentation

- **decisions:** mesa de decisões registra Ondas A/B/C de segurança, rollout da ativação enxuta e execução de DEC-02/DEC-03 (#338, #343)

## [1.20.0] — 2026-07-03 — 🧠 Ciclo Fable 5: dieta de contexto, spec/plan de 1ª classe, era de modelo sincronizada

> Minor. Atualização segura via `npx sinapse-ai update`. Consolida o ciclo de upgrade Fable 5 (auditoria AF-20260702 → Onda 1 → Onda 2 → mesa de decisões): 15 PRs (#321–#335).

### Features

- **cli** — `sinapse spec` e `sinapse plan` como comandos de 1ª classe + `orchestrate` no binário canônico + QA honesto no Windows (`PASS_QA_SKIPPED`, exit 0) (#328)
- **installer** — motor de contexto ativo pós-install: `.synapse/` criado no caminho canônico + models no template; 2º prompt em diante entrega ~−88% de contexto injetado (#334)
- **synapse** — dieta de contexto: Constitution completa só no 1º prompt (−90,5%/turno) + budgets honestos (#323)

### Bug Fixes

- **cli** — binário canônico honesto: `agents`/`ideate` reais, uninstall de hooksPath, PlanTracker, simulate stub (#321)
- **context** — dual-trigger de compactação (60% OU 165K) + statusline re-significado pra era 1M (#329)
- **models** — registry na era Fable 5 (`active: claude-fable-5`) + token-economy sem pin de versão (#322); varredura final de era — atlas sincronizado + squad mastery sem pins (#326)

### Documentation

- **honestidade** — Art. VIII escopado ao caminho real + `docs/framework/workflow-engine-status.md` com status executável dos workflows (#330)
- **vitrine** — guides públicos no veredito híbrido do motor + README com motor real (#327); docs de vitrine imediata da Onda 1 (#325)
- **decisions** — mesa de decisões da Onda 2 (5 pareceres) (#333); execução DEC-02/DEC-05 + triagem de segurança (429 alertas, zero crítico-real) (#335)

### Maintenance

- **agents** — piloto de ativação enxuta + 24 colisões de codinome resolvidas (27 renames, reversíveis) (#332)
- **installer** — bilíngue (troubleshooting i18n) + init sem TTY não crasha (#331)
- **template** — CLAUDE.md enxuto + guard de codinomes (Nexus→Relay/Bulletin) (#324)

## [1.19.2] — 2026-07-01 — 🔒 Honestidade do gate (build vazio não passa) + aposta medida

> Patch. Atualização segura via `npx sinapse-ai update`. Fecha o último furo de honestidade do motor achado ao medir a aposta de orquestração multi-story.

### Bug Fixes

- **orchestration** — o gate `epic4_to_epic6` aprovava (score 5.0) um build que não escreveu **nenhum arquivo**: o check `implementation_exists` aceitava `implementationPath`, que o epic-4 setava para o caminho do **plano** (sempre existe). Agora o check exige arquivos de código **reais** (`codeChanges` + `filesModified`, excluindo o plano) e bloqueia build vazio; o epic-4 não usa mais o `implementationPath` enganoso e o `BuildOrchestrator` expõe `filesModified` de verdade. Estende a invariante de honestidade — build "sucedido" sem arquivos ≠ sucesso (#317).

### Documentation

- **epic** — fecha o épico `orchestration-consolidation` com o **veredito medido do checkpoint "matar ou dobrar"**: HÍBRIDO. Na medição multi-story, o modo nativo entregou 3/3 stories em 64s e 1 chamada, enquanto o motor entregou 1/3 em ~13,5min (a coordenação multi-story corrompeu o estado entre stories). O motor é assumido como **assistente de story isolada** (spec + plano reais); a orquestração autônoma multi-story vira **limitação documentada** (`KNOWN-LIMITATIONS.md`), não promessa. Escopo real do #318: atualiza os docs do próprio épico (`docs/epics/`) — a revisão dos guides públicos (user-guide, ade-guide, permission-modes, api-reference) segue pendente e é tratada nas ondas seguintes (Onda 1/Onda 2).

## [1.19.1] — 2026-06-30 — 🔧 Motor honesto ponta-a-ponta + Windows-safe

> Patch. Atualização segura via `npx sinapse-ai update`. Fecha 2 defeitos do motor expostos pelo checkpoint e2e do épico orchestration-consolidation.

### Bug Fixes

- **orchestration** — fecha o vazamento da invariante de honestidade no nível master/gate: um épico que falhava **retornando** `{success:false}` (sem lançar) escapava do `catch` e era marcado COMPLETED, fazendo o pipeline reportar `ORCHESTRATION COMPLETE` + exit 0 com zero trabalho; o gate de QA aprovava (score 5.0) um QA report `BLOCKED`. Agora o master marca FAILED, `finalize` exige zero falhas e o gate ganhou o check crítico `result_not_failed` (#314).
- **orchestration** — corrige crash no Windows: `_createStubPlan` serializava o `specPath` Windows por template-string em YAML de aspas duplas (`\U` inválido), matando a fase de execução em ~4ms; agora usa `yaml.dump` (robusto a qualquer path) (#315).

### Refactor

- **engine** — F3C: aposenta a linhagem morta `terminal-spawner → pm.sh` (stub que nunca invocou claude), unificando no caminho canônico `dispatcher → claude` e fechando a DoD "3 linhagens viram 1" do épico; fallback honesto preservado, ~3.7k linhas de código morto removidas (#312).

### Documentation

- **epic** — relatório do checkpoint e2e "matar ou dobrar" (orchestrate vs nativo); veredito: híbrido com disciplina, re-medir com tarefa multi-story (#313).
- **changelog** — consolida entrada `[Unreleased]` órfã na `[1.2.1]` (#311).

## [1.19.0] — 2026-06-30 — ⚙️ Motor de orquestração real (do teatro ao código)

> Minor release. Atualização segura via `npx sinapse-ai update`.

### Features

- **orchestration** — `generatePlan` agora planeja via `claude` real sobre a story completa, em vez do stub anterior; quando o agente não está disponível, o fallback é honestamente marcado como `degraded`/`stub` (sem fabricar sucesso) (#307).
- **orchestration** — o gate `epic4_to_epic6` ganha o check `plan_is_real`, que BLOQUEIA plano degradado ou ausente; o score do gate ficou honesto — gate sem checks não recebe mais nota máxima (#308).

### Bug Fixes

- **cross-platform** — hardening Windows/macOS: exec bits, spawn de `.cmd` shims, shell pipelines e gate de CI pré-merge (#294).
- **cross-platform** — hardening Windows/macOS (ondas 2+3): statusline git, normalização de paths, BOM em config e EPERM por file-locking (#295).
- **cross-platform** — hardening onda 3: retry de file-locking no install/migração de MCP, BOM no config global e CRLF no doctor (#296).
- **orchestration** — `BrownfieldHandler` chamava um método inexistente no `WorkflowExecutor`, fazendo a discovery brownfield falhar em silêncio; `executeWorkflow()` implementado e coberto por teste de contrato.
- **installer** — falha de `install` agora exibe mensagem de erro classificada e acionável (permissão, disco, rede, etc.) em vez de texto genérico.
- **orchestration** — terminal-spawner em ambiente headless (CI/SSH/Docker/VSCode) não tenta mais `spawn(bash, pm.sh)`: guard consciente de capacidade que cai no fallback de "manual execution", eliminando ruído de teste e workers lentos — a suíte do motor caiu de timeout (2min) para ~5s (#309).
- **installer** — rollback transacional em upgrades: se o upgrade falha no meio, o estado anterior é restaurado por inteiro (#306).
- **perf** — perf-tests do squad tolerantes a carga: o orçamento de tempo deixa de gerar falsos negativos sob carga de CI (#303).
- **tasks** — paths fabricados removidos dos rodapés de tasks (Tools/Scripts), com guard no validador para impedir reincidência (#304).
- **orchestration** — espelho do orquestrador master sincronizado + invariante de contagem honesto (#305).

### Documentation

- **readme** — corrige a nota de `npm install`: o setup roda explicitamente via `npx sinapse-ai install` (ou `npm run setup`), não mais por um postinstall automático.

### Maintenance

- **ci** — release notes do workflow de publish apontam para o repositório correto (`caioimori/sinapse-ai`).
- **audit** — auditoria clínica pré-divulgação em andamento: correções de runtime, instalador, documentação e precisão de métricas.

## [1.17.0] — 2026-06-27 — 🗺️ Atlas auto-documentado + motor doc-first religado + sweep de segurança

> Minor release. Atualização segura via `npx sinapse-ai update`.

### Features

- **doc-first** — tabelas de aprovação escaneáveis para PRD/épico/story/spec (#281).
- **doc-first** — motor de roteamento + gate de enforcement (Camadas 1+2) (#282).
- **atlas** — Framework Operating Atlas: mapa auto-documentado do framework (LLM + visual) (#283).
- **atlas** — fluxos operacionais visuais de como o framework funciona (#284).
- **orchestration** — `sinapse build` religa o motor BobOrchestrator ao CLI (#286).
- **atlas** — fluxos completos do framework: 6 → 12 meta-workflows (#287).
- **atlas** — research card PT-BR: SINAPSE como estudo de caso + LOOPS (#288).

### Bug Fixes

- **atlas** — headings do research-card no formato do parser do site (MF1 — …) (#289).
- **atlas** — remove vazamento de vault pessoal do framework público + endurece guard (#290).
- **security** — sweep profundo: remove leaks pessoais/cliente residuais + endurece guard (#291).

### Documentation

- **orqx** — alinha a prosa de bootstrap do Imperator ao motor doc-first resolver (#285).

## [1.16.0] — 2026-06-25 — 🚦 Gates de clarify + analyze no Spec Pipeline

> Minor release. Atualização segura via `npx sinapse-ai update`.

### Features

- Adiciona gates de clarify e analyze ao Spec Pipeline (#280).

## [1.15.0] — 2026-06-24 — 🌐 Chrome Brain nativo + selos de identidade na statusline

> Minor release. Atualização segura via `npx sinapse-ai update`.

### Features

- **chrome-brain** — scripts nativos em Node; não mata mais a janela boa; janela fixa + login.
- **statusline** — selos de identidade de agente + banner de install.

## [1.14.0] — 2026-06-24 — ⚙️ Munição de engenharia em 170 agentes

> Minor release. Atualização segura via `npx sinapse-ai update`.

### Features

- **agents** — potencializa 170 agentes com a base de engenharia de software (#278).

### Maintenance

- **release** — sincroniza main com a v1.13.0 publicada (package.json + CHANGELOG) (#277).

## [1.13.0] — 2026-06-22 — 🧹 Limpeza profunda (varredura de 6 ondas) + munição de engenharia nos agents

> Minor release. Atualização segura via `npx sinapse-ai update`.

### Features

- Injeta munição de engenharia de software nos 8 agents técnicos (#264).

### Bug Fixes

- **Onda 1** — remove grounding público do install, corrige leaks pessoais, unifica wordmark "SINAPSE AI" (#266).
- **Onda 2** — torna os portões do framework reais (cobertura honesta) (#267).
- **Onda 3** — remove ~1.900 linhas de código morto (assistente "Pro") e conserta a regeneração de agents no `update` (#268).
- **Onda 4** — pacote enxuto (dist/sourcemap/zips fora do npm), config de release e footprint honesto no README (#269).
- **Onda 5 (segura)** — frontmatter de squad-product, hard-skip do Codex no ide-sync, gitignore defensivo (#270).
- **test** — conserta `test:health-check` (mocha→jest) e remove `mocha` órfão (#274).
- **release** — remove `@semantic-release/git` (incompatível com branch protection) (#276).

### Refactoring

- **Onda 5-pesada** — remove ~11.6k linhas de cluster git duplicado morto em `development/scripts` (#271).

### Documentation

- **Onda 6** — alinha a Constituição à realidade (build condicional, branch-protection solo, enforcement honesto) e religa 11 testes válidos (#272).
- Conserta o doctor `constitution-consistency` (CLAUDE.md + AGENTS.md citam os 10 artigos canônicos) (#273).
- README (PT+EN): badge de testes e contagem de health checks atualizados (#275).
- Atualiza triagem Dependabot — undici (#265).

## [1.12.2] — 2026-06-21 — 🧹 Zera warnings de validação + conserta ponteiros Codex

> Patch de higiene. Atualização segura via `npx sinapse-ai update`.

### Fixed

- **`validate:agents` 3 → 0 warnings**: artefatos residuais resolvidos em todos os homes canônicos.
- **`ide-sync` clobberando ponteiros Codex**: o sync de IDE sobrescrevia os ponteiros `.codex` indevidamente — corrigido para tocar apenas o espelho `.claude`.

## [1.12.1] — 2026-06-20 — 📝 Higiene de validação + ortografia do README

> Patch de polimento. Atualização segura via `npx sinapse-ai update`.

### Fixed

- **`validate-agents` 98 → 3 warnings**: resolução de artefatos em todos os homes canônicos.

### Changed

- **README**: ortografia PT-BR completa + contagem de hooks consistente.
- **Guard de refs externas**: referência interna genericizada.

### Documentation

- Entrada da v1.12.0 (hardening + conformidade) adicionada ao changelog.

## [1.12.0] — 2026-06-20 — 🛡️ Hardening + Conformidade

> Maior release de robustez do framework até aqui: ~1 mês de hardening (auditoria clínica de 8 frentes + conformidade às diretrizes) entregue de uma vez. Sem breaking changes — atualização segura via `npx sinapse-ai update`.

### Added

- **Guard anti-deleção de arquivos críticos** no pre-commit — bloqueia commits que removam/untrackeiem arquivos protegidos (ex.: `service-registry.json`). Sempre ativo, independe do modo contribuidor; bypass intencional via `--no-verify`.
- **API programática** no root `package.json` (`main`/`module`/`types`/`exports`) + `index.d.ts` — o framework pode ser usado como biblioteca, não só CLI.

### Fixed

- **Ativação de agents**: 6 dos 12 agents core caíam num greeting degradado por falta de resolução de alias (`dev`→`developer`, `sinapse-orqx`→`snps-orqx`, etc.). Todos ativam 100% agora (papel + status + comandos).
- **Instalação em Modo Assistido por padrão**: o instalador defaultava silenciosamente para avançado; agora entra assistido (para leigos), com o avançado disponível como toggle opt-in.
- **Roteamento de squads**: religados ~16 especialistas órfãos em 5 squads, o squad comercial e as 56 tasks do conselho — nenhum agent perdido no roteamento.
- **Identidade SINAPSE canônica**: Imperator unificado (3 fontes divergentes) + remoção de diretório de comandos stale.
- **Integridade do registro**: dedup robusto de IDs + ressync do `service-registry` + detector de drift em CI.
- **`doctor` honesto**: git-hooks reporta WARN (não FAIL) para quem tem hook system próprio.
- **ide-sync**: resync de mirror `.claude` + conserto de YAML malformado.

### Changed

- **Pacote 23MB menor**: `node_modules` removidos do tarball + higiene de dependências de runtime.
- **Cobertura de testes honesta**: suíte `workflow-intelligence` religada (+204 testes), semântica do `coverageThreshold` corrigida (o `global` do jest exclui chaves de path) e piso real do `core/` (~80%).
- **Branding**: instalador legado rebrandado para o banner branco "SNPS AI" (sem resquícios off-brand).
- **Qualidade**: lint 0 erros / 0 warnings; testes mortos do tools-system removidos; `colaborator/` fora do jest.
- **Escopo**: idiomas apenas **PT + EN** (resíduo de espanhol removido); CLIs apenas **Claude Code + Codex**.

### Security

- `undici` (dev) atualizado para corrigir vulnerabilidade HIGH dev-only. **0 vulnerabilidades em produção.**

## [1.11.3] — 2026-06-19 — 🌐 Chrome Brain não abre mais a cada sessão

> Patch de UX. Atualização segura via `npx sinapse-ai update`.

### Fixed

- **Chrome Brain**: removido o hook `SessionStart` que abria o browser em toda sessão.

## [1.11.2] — 2026-06-18 — 🧼 Saída do install limpa

> Patch de UX. Atualização segura via `npx sinapse-ai update`.

### Fixed

- **Install**: saída limpa — sem dumps, sem duplicação, branding calmo.

## [1.11.1] — 2026-06-18 — 🔧 Dependabot + ide-sync + greeting

> Patch de manutenção. Atualização segura via `npx sinapse-ai update`.

### Fixed

- **Greeting**: normalização de id longo do agente na sugestão de próximo-passo e no gating do modo assistido.
- **ide-sync**: commit do espelho `.claude` (squad orqx) para destravar o gate de paridade.

### Security

- **Dependabot**: 9 alertas resolvidos (prod + dev) sem quebra de comportamento.

## [1.11.0] — 2026-06-18 — 🚦 Pré-check de Node + mensagens honestas

> Atualização segura via `npx sinapse-ai update`.

### Added

- **Pré-check de versão do Node** antes do install/init (falha rápido em runtime incompatível).

### Fixed

- **Install**: mensagem de conclusão honesta (deps instaladas + contagem real de agentes).
- **Secret-scanner**: deixa de falso-positivar em labels de UI com a palavra "password".

## [1.10.0] — 2026-06-18 — 🧭 CLI descobrível + guardas de drift

> Atualização segura via `npx sinapse-ai update`.

### Added

- **`--help` completo**: todos os comandos do CLI ficam descobríveis, com guard de regressão.
- **Guard do Artigo VII**: protege a contagem de artigos da Constitution contra drift.

### Fixed

- **Reinstall preserva arquivos L3 user-owned** (`core-config`, `MEMORY.md`).
- **Segurança**: eliminada interpolação de shell no `setx PATH` do install (Windows); 2 vulns moderadas corrigidas (`js-yaml`, `tar`).

### Changed

- **README**: contagem da Constitution corrigida (10→11 artigos, 6→7 NON-NEGOTIABLE).

### Tests

- Flakiness eliminado nos testes de orçamento de tempo do UAP bridge e do seed-metrics.

## [1.9.1] — 2026-06-18 — 🩹 Correções pós-1.9.0

> Patch de correção da auditoria adversarial pós-1.9.0. Atualização segura via `npx sinapse-ai update`.

### Fixed

- **Release**: `@semantic-release/git` removido temporariamente (a branch protegida rejeitava o push direto na main).
- Correções pontuais da auditoria adversarial pós-1.9.0.

## [1.9.0] — 2026-06-17 — 🧭 Refino Macro (E1–E9) + Paridade Codex

> **Refino macro do framework em 9 etapas.** Invocação unificada `@sinapse`/`@snps`; remoção dos editores extras (foco Claude + Codex); medidor de tasks honesto; instalação/update reais; fusão `squad-artdir`→`squad-design` + aposentadoria de 7 chiefs (→ 17 squads · 172 agentes · 1200 tasks); feedback visual de orquestração na statusline; trava de git reativada; paridade Codex de fachada para real; pente-fino de segurança.

### Added

- Invocação por `@sinapse` / `@snps` / `@sinapse-orqx` / `@snps-orqx` com stub rico do Imperator (diagnose → handoff → delegate).
- Feedback visual de orquestração: statusline acende `Imperator` + `N especialistas`; `sinapse status --watch`.
- `sinapse update` baixa e aplica a versão nova de verdade.
- Entrega do runtime Codex (`.codex/` + `AGENTS.md`) ao projeto do usuário; resolução paramétrica dos 172 agentes.
- Secret-scan no publish (`prepublishOnly`) + paridade travada das 2 cópias do scanner.

### Fixed

- Resolução de mock robusta a `node_modules` aninhado em `.sinapse-ai/` (testes locais deixam de falhar por mock que não intercepta).
- `core.hooksPath` reapontado pela trava gerenciada no `npm install`.

### Changed

- Catálogo consolidado: **17 squads · 172 agentes · 18 orqx · 1200 tasks**.

## [1.8.0] — 2026-06-15 — ⚡ Orchestration, IDS & CLI Optimization

> **Release de racionalizacao do core.** Deep-dive de 28 modulos + frentes especiais (plano P0–P3, verificacao adversarial): fecha gaps de cabeamento CLI (pipelines poderosos existiam mas nao tinham porta de entrada), torna o gerador de entity-registry deterministico, consolida duplicatas reais e cabeia tasks orfas — tudo sem corte de capacidade. Lei travada: potencializar, nao cortar.

### Added

- `sinapse orchestrate <story-id>` — porta de entrada CLI do pipeline autonomo (Epic 0 / MasterOrchestrator): `--status` / `--stop` / `--resume` / `--dry-run` / `--epic N`.
- `sinapse create <agent|task|workflow>` — gerador de componentes (ComponentGenerator) no CLI.
- `sinapse mode [explore|ask|auto] [--cycle]` — gerenciador de modo de permissao.
- `sinapse health --deep [--output-file <path>]` — expoe o engine completo de ~35 checks (dominios deployment/local/project/repository/services), antes sem entry-point. O `sinapse health` default (install-health) permanece inalterado.
- **IDS Gate G6** (CI/CD registry integrity, blocking) — implementado e cabeado no GateEvaluator (fase `ci_cd`); o codigo so trazia G1–G5.
- Dispatch de workflow por `project_type` nos handlers greenfield/brownfield (site/lp/app→ui, platform/saas→fullstack, api/service→service); variants mantidos como arquivos separados.
- Teste unitario do `fast-path-gate` (unico modulo de orquestracao sem cobertura dedicada).

### Fixed

- `sinapse graph`, `sinapse ids:*`, `sinapse mcp`, `sinapse generate` caiam no `default` do binario (passados ao Claude Code como args) — agora cabeados no switch. Fecha contrato de CI do template `sinapse graph --deps`.
- **Gerador de entity-registry agora e DETERMINISTICO**: sort de arquivos (fast-glob retornava ordem de readdir), sort de `usedBy`, `lastVerified` preservado por checksum, `lastUpdated` idempotente, self-entry excluido. Elimina o churn de ~1600 linhas por commit.
- Gerador passa a escanear `bin/` — corrige `ideation-engine` falsamente marcado como `orphan` (agora `usedBy: [ideate]`, `lifecycle: production`).
- Regex de exclusao de docs ancorado em `^docs/` — 5 docs tracked de `core/docs` voltam ao install-manifest (drift de upgrade brownfield deixava de ser rastreado).
- WaveAnalyzer named export (`new` lancava "not a constructor"); diagnostics SYNAPSE no `doctor --deep`; hook `code-intel-pretool.cjs` ausente criado e registrado.

### Changed

- `output-formatter` consolidado — `core/utils` re-exporta a fonte unica em `infrastructure/scripts` (−290 linhas de duplicata byte-identica).
- Os 3 grounding hooks (`sinapse-{brand,ds,vault}-grounding.cjs`) delegam `loadConfig` ao `config-loader.cjs` compartilhado (require guardado, fail-open preservado).
- Task @devops pre-push invoca `sinapse qa run --layer=1` em vez de reimplementar lint/test/typecheck.
- `AgentInvoker` memoiza `_loadAgent`/`_loadTask`; `MasterOrchestrator` colapsa o `_saveState()` redundante por epic no caminho de sucesso.
- 9 tasks orfas cabeadas aos agentes (devops/developer por dominio); 3 namespaces de session documentados em `core/README.md`.

### Removed

- `test-validation-task.md` (fixture auto-declarado, zero consumidor) e as 2 copias orfas `development/scripts/elicitation-{engine,session-manager}.js` (consumidores reais usam `core/elicitation/`).

### Security

- **Auto-execucao no install removida (supply-chain).** O hook npm `postinstall` (`node bin/postinstall.js`) foi retirado do `package.json`. Executar codigo automaticamente em `npm install` e uma superficie de supply-chain — um publish comprometido rodaria na maquina de todos os instaladores sem nenhuma acao explicita. O setup agora e EXPLICITO: via `npx sinapse-ai install` (caminho recomendado, ja documentado no README) ou via `npm run setup`. O modulo `bin/postinstall.js` foi mantido sem mudanca de comportamento — apenas deixou de ser auto-executado. CI install-matrix e comentarios ajustados ao novo modelo.

## [1.7.0] — 2026-06-02 — 🔒 Security & Robustness Hardening

> **Release de seguranca e robustez.** Auditoria de ciberseguranca completa (6 frentes + verificacao adversarial) + fundacao de robustez (execucao segura cross-OS, learning loop, cadeia de erros tipada). Prepara o framework para distribuicao publica.

### Security

- **Command injection / RCE eliminado** nos motores de execucao de subagentes: troca de `spawn('sh','-c', ...)` por execucao via argv+stdin sem shell (cross-spawn). Resolve injecao via story/task/gotcha.
- **github-adapter** — `execSync(string)` -> `execFileSync('gh', argv)`: fecha injecao de shell via titulo/corpo de story.
- **ideation-engine** — validacao de `rootPath` contra metacaracteres de shell.
- **semantic-merge-engine** — `execFileSync('git', argv)` nas chamadas git; cap de tamanho/iteracoes no scan de funcoes (ReDoS).
- **squad-downloader** — protecao anti zip-slip (containment de path) + allowlist de host no follow de redirect (SSRF).
- **merge-utils** — deny-list `__proto__`/`constructor`/`prototype` (prototype pollution).
- **renderer** — escaping configuravel com security contract documentado.
- **docker-compose (llm-routing)** — master key sem default conhecido (fail-fast).

### Changed (robustez — base de execucao)

- **Execucao de agentes cross-OS**: resolucao segura do binario da CLI no Windows (sem shell injection, sem quebra de `claude.cmd`).
- **Learning loop religado**: gotcha-loader endurecido + janela rolante de erro.
- **Cadeia de erros tipada** (`core/errors/`): SinapseError com normalize/serialize, sem vazar stack em producao.
- **context-tracker model-aware** + bloco `models:` no core-config (estimativa de contexto precisa).
- **semantic-handshake-engine**: motor de constraints executaveis.

### Privacy & Packaging

- Removidos nomes pessoais e referencias a projeto privado dos materiais publicados.
- `files`: glob `docs/*.md` substituido por allow-list explicita de docs publicos + `.npmignore` (impede vazamento de docs internos no pacote).

## [1.6.1] — 2026-05-26 — 🩹 Patch: fix installer regression do BUG-001

> **Patch release imediato.** O v1.6.0 corrigiu o BUG-001 (orqx voltando ao auto-plano) nas personas canônicas e no template YAML, MAS deixou 3 arquivos JS do installer com `"HALT and await user input"` hardcoded. Resultado: `npx sinapse-ai install` ou `update` gerava stubs orqx errados de novo, regredindo o fix.

### Fixed

- **`bin/commands/install.js`** — função `generateCommandMd()` agora detecta orquestradores (id termina em `-orqx` OU é Imperator) e gera STEP 4/6 com briefing-on-activation flow. Specialists continuam com HALT (correto).
- **`bin/commands/install.js`** — bloco do Imperator template substitui `Then HALT and await user input` por briefing-on-activation check + Initial State Audit + Bootstrap Classification + Orchestration Plan + Execute.
- **`packages/installer/src/wizard/index.js`** — `buildAgentTemplate()` (que só gera stubs orqx) corrigida pra emitir STEP 4 com briefing-on-activation.
- **`.sinapse-ai/development/scripts/apply-inline-greeting-all-agents.js`** — INLINE_GREETING_LOGIC STEP 5 agora é condicional (orqx → auto-plan; specialist → HALT).

### Why this matters

Sem este patch, **toda instalação fresh do v1.6.0 regredia o BUG-001 imediatamente**. Detectado ao rodar `npx sinapse-ai@latest update`: o sinapse-orqx.md stub voltou pro formato curto com "HALT and await user input".

## [1.6.0] — 2026-05-26 — 🔧 Framework cleanup release (15 bugs P0/P1/P2/P3)

> **Cleanup + 2 squads oficiais.** Resolve 15 bugs estruturais mapeados pela auditoria 2026-05-25, oficializa n8n + higgsfield-studio como squads SINAPSE, simplifica regras opt-in, e corrige comportamento crítico dos orquestradores (auto-plano de orquestração ao receber briefing).

### Fixed (Onda 1 — P0 críticos, PR #208)

- **BUG-001 — orchestrators agora disparam plano automático** ao receber briefing. Persona Imperator tinha regra contraditória: `"HALT and await user input. Do NOT do anything else."` vencia sobre a regra `"NON-NEGOTIABLE: ORCHESTRATION PLAN ON EVERY BRIEFING"`. Resultado: usuário sempre precisava pedir `cria plano`. Fix: substituído por briefing-on-activation check em 6 personas Imperator + template `activation-instructions-inline-greeting.yaml` + swarm-orqx STEP 5.
- **BUG-002 — Imperator (sinapse-orqx) era "fantasma"**: stub apontava pra `~/.sinapse/sinapse/agents/sinapse-orqx.md` que nunca existiu. Fix: source canônico criado em `sinapse/agents/sinapse-orqx.md` (791 linhas, persona completa com ASCII art, 18 squads routing table, Initial State Audit, Bootstrap Classification, NSN mode).
- **BUG-003 — 19 dos 22 stubs orqx em formato truncado** (15 linhas, sem blocos Activation Instructions / How to Execute / Cross-Squad Handoff). Fix: novo script `scripts/regenerate-orqx-stubs.ps1` regenera todos os 22 stubs no formato completo (42-55 linhas) com o flow de briefing-auto-orchestration.
- **BUG-005 — slash command `/SINAPSE:agents:sinapse-orqx` ausente** (só existiam os 21 squad-orqx + snps-orqx). Fix: criado em `~/.claude/commands/SINAPSE/agents/sinapse-orqx.md`.

### Fixed (Onda 2 — P1, PR #209)

- **BUG-004** — 12 commands SNPS (`/SNPS:agents:*`) propagados pra `~/.claude/commands/SNPS/agents/` (parity Codex no nível local).
- **BUG-006 + BUG-012** — **n8n vira squad oficial SINAPSE**. Consolidação em `~/.sinapse/squad-n8n/` (18 agents + squad.yaml v1.0). Rule `n8n-squad-routing.md` atualizada removendo "não faz parte do framework". Knowledge base externa em `Workspace/sinapse/n8n/` (18k linhas) mantida.
- **BUG-009** — MEMORY.md de 29.6KB → 12.6KB (limite 24.4KB, agora com margem). Entradas longas encurtadas pra <200 chars cada, mantendo discovery via pointers.

### Changed (Onda 3 — P1+P2, PR #209)

- **BUG-007 — rules opt-in viram always-on**. `CLAUDE.md` global bumpado pra v6.4. `documentation-first`, `mandatory-delegation`, `workflow-execution` agora sempre carregadas; agente calibra cerimônia conforme escopo (story epic vs bug fix simples). Mais simples que implementar hook trigger custom por path/keyword.
- **BUG-014** — **higgsfield-studio vira squad oficial SINAPSE**. Consolidação em `~/.sinapse/squad-higgsfield-studio/` (14 agents + squad.yaml v1.0). Mesma arquitetura padrão dos outros squads.
- **BUG-010** — `vault-routing.json` corrigido: 7 entradas apontavam pra notas inexistentes. Substituídas por equivalentes funcionais.
- **BUG-008** — rules deprecated (`sinapse-source-of-truth.md`, `response-format.md`) movidas pra `~/.claude/rules/_deprecated/`.

### Cleanup (Onda 4 — P2/P3, PR #209)

- **BUG-011** — `.backup-stubs-20260512-120825/` movido de `~/.claude/agents/` pra `~/.claude/backups/`.
- **BUG-013** — nova doc `docs/guides/hooks-two-layers.md` explicando arquitetura intencional dos hooks (camada global `~/.claude/hooks/` vs camada framework `<repo>/.claude/hooks/`).
- **BUG-015** — memory sincronizada: removidas menções de stories Ready (10.35/10.38/10.39/10.40/10.41/10.42) que já estavam Done.
- **BUG-016** — 9 skills com espaço no nome renomeadas pra kebab-case (`Creative Skills` → `creative-skills`, etc).

### Added

- `docs/audits/2026-05-25-framework-gargalos-audit.md` — relatório completo da auditoria que mapeou os 15 bugs deste release.
- `sinapse/agents/sinapse-orqx.md` — persona canônica Imperator (faltava no source do repo).
- `scripts/regenerate-orqx-stubs.ps1` — script PowerShell que regenera os 22 stubs em qualquer máquina.
- `docs/guides/hooks-two-layers.md` — doc da arquitetura de hooks.

### Notes

- **Sem breaking changes** se você só usa o framework como orchestrator. Comportamento novo dos orqx (auto-plano) é uma melhoria, não quebra fluxos existentes.
- **Inclui também outros 5 PRs entre v1.5.0 e v1.6.0**: #203 (limpa claude-code-mastery orphan agents), #204 (docs audit Onda 3 orqx coverage gap), #205 (canonical flat squad-schema + validator), #206 (169 broken links fixed), #207 (squad-finance ganha 3 agentes).
- **3 investigações pendentes** (fora do escopo desta release): hooks órfãos no settings.json, validação cruzada task_refs em workflows, health check completo dos 17 squads canonicos.

## [1.5.0] — 2026-05-15 — 🚀 Feature release (sinapse-delegate + fast-path-gate)

> **Feature release.** Adiciona dois patterns úteis ao SINAPSE: outsource explícito pra executor externo via `sinapse-delegate` e heurística de fast-path no orchestrator. Sem breaking changes; ambos opt-in.

### Added

- **`sinapse-delegate` CLI** — novo entry point pra outsource de tasks específicas (story implementations, refactors, mechanical edits) pra executor externo como Codex CLI. Grava prompt + output + log em `.sinapse/external-runs/<timestamp>-<slug>/` pra audit completo. Suporta sandboxes (read-only, workspace-write, full-auto, danger-full-access), git cleanliness gate (`--allow-dirty` pra bypass intencional), dry-run, foreground/background. **Caso de uso principal:** economizar tokens Opus em tasks repetitivas/mecânicas roteando-as pra modelos menores (Codex/Haiku).
  - Entry: `bin/sinapse-delegate.js` (registrado em `package.json#bin`)
  - Implementação: `.sinapse-ai/core/external-executors/delegate-cli.js`
  - Provider suportado nesta release: `codex` (extensível pra outros via `PROVIDERS` map)
  - Uso: `sinapse-delegate codex -t story-10.50 -f prompt.md --sandbox workspace-write`

- **Fast-Path Gate** em `.sinapse-ai/core/orchestration/fast-path-gate.js` — heurística determinística que avalia se uma task pode rodar em modo acelerado (`parallel_batch`, `deterministic_batch`, `external_executor`) versus workflow padrão sequencial. Analisa sinais de automação (bulk-edit, structured-transform, mechanical-edit, map-then-apply, repetition, parallelizable) versus sinais de risco (architecture, security, destructive, production, migration). Retorna `mode`, `confidence` (0-1), `parallelizable`, `riskLevel`, `reasons` e `actions` recomendadas. Configurável via `DEFAULT_FAST_PATH_CONFIG`.
  - Exportado em `.sinapse-ai/core/orchestration/index.js` como `evaluateFastPath`, `DEFAULT_FAST_PATH_CONFIG`, `getAutomationPatterns`, `getRiskPatterns`, `getStructuredFileExtensions`, `normalizeFastPathConfig`, `normalizeFastPathTask`
  - Sem state global, sem dependências externas, pure function — fácil de integrar em qualquer decisão de roteamento

### Notes

- **Service Discovery (`sinapse workers search/list/info`) já existia** desde versão anterior em `.sinapse-ai/cli/commands/workers/` — confirmado via smoke test e bin/sinapse.js já roteia. Sem ação necessária nesta release.
- **Implementação:** pure functions, sem state global, sem dependências externas além do que já existe. Integração via export em `.sinapse-ai/core/orchestration/index.js`.
- **Sem breaking changes.** Features são opt-in: ninguém precisa rodar `sinapse-delegate` ou chamar `evaluateFastPath` se não quiser.

### Migration

Nada necessário pra usuários da v1.4.x. Quem quiser usar:

```bash
npm install sinapse-ai@latest

# Outsource uma task pesada pro Codex
sinapse-delegate codex -t my-task -p "Replace deprecated React imports in src/" --sandbox workspace-write

# Avaliar uma task antes de executar (programático)
node -e "console.log(require('sinapse-ai/.sinapse-ai/core/orchestration').evaluateFastPath({ task: { description: 'bulk rename yaml files', files: ['a.yaml','b.yaml','c.yaml'] }}))"
```

## [1.4.2] — 2026-05-14 — 🩹 Doctor bugfix patch (Story 10.42 regression + false-FAIL cleanup)

> **Bugfix patch.** Smoke test pós-v1.4.1 detectou 1 regressão real + 4 ruídos no doctor que arruinavam a primeira impressão pra users novos. Esta release consolida os 5 fixes.

### Fixed

- **Story 10.42 regressão** — `npx sinapse-ai doctor` em projeto fresh exibia 11 FAILs ao invés da mensagem amigável `NOT_INSTALLED`. Root cause: `detectInstallState()` qualificava `~/.sinapse/` e `~/.claude/commands/SINAPSE/` como markers globais — esses sempre existem em máquinas que já rodaram SINAPSE em qualquer outro projeto, anulando completamente a detecção de fresh-project. Agora só `<projectRoot>/.sinapse-ai/` qualifica. EXIT=4 + mensagem amigável confirmados em smoke test.
- **`npm-packages` check** — não falha mais quando `node_modules/` está ausente no projeto raiz. Confia em `canResolveDep` (Story 10.48) para validar deps do `.sinapse-ai/` via Node module resolution (parent + global). Projetos sem deps Node próprios (writing repos, design repos, infra-only) não levam mais FAIL falso.
- **`skills-count` check** — `.claude/skills/` é OPCIONAL e não shipado pelo install (verificado contra `install-manifest.yaml`). Status mudado de FAIL para INFO. Mensagem revisada: "skills are optional — install via `npx claude-skills add <name>`". `onError` policy: `'warn'` ao invés de `'fail'`.
- **`manifest-version-parity` check** — comparava `<projectRoot>/package.json#version` (do user) com `.sinapse-ai/install-manifest.yaml#version` (do framework) em qualquer cwd. Em projeto user isso sempre dava FAIL com "Run `npm run generate:manifest`" — script que só existe no repo do framework. Agora detecta context via `package.json#name === "sinapse-ai"`: se não for o repo do framework, INFO + skipped.
- **`scripts/sinapse-patch.js` Windows detection** — `findCliPath` só procurava `cli.js` em paths POSIX. Claude Code 2.x no Windows ships `cli-wrapper.cjs` em `~/AppData/Roaming/npm/node_modules/@anthropic-ai/claude-code/`. Adicionados Windows-specific candidates + variantes de filename (`cli.js`, `cli-wrapper.cjs`, `bin/cli.js`). Plus mensagem `[ERRO]` → `[INFO]` e `process.exit(1)` → `process.exit(0)` quando CLI não é encontrado: branding patch é cosmético opcional, não deve nunca bloquear o install pipeline.

### Removed

- **`validator` dep órfã** removida de `.sinapse-ai/package.json`. Estava declarada como dependency mas sem nenhum import no código. Causava FAIL legítimo em `npm-packages` check porque era unresolvable. Zero impacto runtime.

### Smoke test confirmation (2026-05-14)

| Capability | Antes (v1.4.1) | Agora (v1.4.2) |
|---|---|---|
| `doctor` em projeto fresh | 11 FAIL, EXIT=2 | mensagem amigável, EXIT=4 |
| `doctor` em projeto instalado | 3 FALSE FAIL | 0 FAIL |
| `npm install` + branding patch | `[ERRO]` visível | `[INFO]` informativo + exit 0 |
| `npm-packages` em repo do framework | FAIL "validator unresolvable" | PASS "13 deps resolved" |

## [1.4.1] — 2026-05-14 — 🔒 Security + docs honesty patch

> **Patch release.** Consolida no npm o que entrou em main depois da v1.4.0: README com copy honesta sobre o estado real dos hooks de grounding (PR #198) + bump transitivo de `ip-address` para versão patched, resolvendo Dependabot #21 (PR #199). Mais cleanup completo de versões legacy no npm registry.

### Security

- **Dependabot #21** — `ip-address` (dev-scope, transitive): vulnerable versions `<= 10.1.0` carregam XSS em métodos `Address6` HTML-emitting (severity: medium). Bundled `ip-address` dentro de `npm` (consumido por `@semantic-release/npm`) bumped para 10.1.1 via regeneração limpa de `package-lock.json`. `package.json` overrides também carregam `"ip-address": "^10.1.1"` como safeguard.

### Documentation

- **README** — Seção "Grounding semantico" reescrita para alinhar messaging com implementação real:
  - Status renomeado "foundation pre-GA" (substituindo claims de injection concreta)
  - Tabela cobre "Funcao na release atual" e "Injecao semantica" (roadmap)
  - Adicionado bloco explicando o moat (opt-in declarativo vs runtime-coupled grounding em frameworks competidores)

### Changed (npm registry cleanup)

- **72 versões legacy deprecated no npm** com mensagens orientando pra `@latest`:
  - 3 da linha 1.x pré-reset (1.0.0, 1.0.1, 1.1.0)
  - 5.x série completa (6 versões: 5.0.3-5.0.8)
  - 6.x série completa (5 versões: 6.0.0-6.0.4)
  - 7.x série completa (39 versões: 7.0.0-7.7.11)
  - 8.x série completa (3 versões: 8.0.0-8.0.2)
  - 9.x série completa (6 versões: 9.0.0-9.5.0)
  - 10.x série completa (13 versões: 10.0.0 + 12 RCs)
- **dist-tag `rc` removida** (era órfã apontando pra `10.0.0-rc.12` deprecated). Apenas `latest` permanece, apontando para 1.4.1.

### Migration

Sem ação necessária para quem já está na linha 1.x. Patch transparente.

```bash
npm install sinapse-ai@latest
```

## [1.4.0] — 2026-05-12 — 📦 Install UX Hardening epic complete

> **Consolidation release.** Fecha formalmente o epic `install-ux-hardening` (8 stories validadas e marcadas Done) e estabelece v1.4.0 como o baseline pós-pré-GA estável. Sem mudanças de código vs 1.3.0 — todo o trabalho já estava em main desde os PRs de abril/maio. Esta release marca o fim do ciclo e sinaliza pros users no canal 10.x (deprecated em 2026-05-12) que o caminho oficial é `npm install sinapse-ai@latest`.

### Changed (epic closure — documentation only)

- **All 8 stories of `epic install-ux-hardening` validated and closed as Done:**
  - **10.35** — `--reconfigure` flag (re-prompt language/LLM without `--force` wipe)
  - **10.38** — Install merge-only for existing config files (PR #195 today — status closure)
  - **10.39** — Postinstall exit code fix (warn never kills `npm install`)
  - **10.40** — Uninstall completeness + update staleness + npx cache docs
  - **10.41** — Chrome Brain SessionStart hook (prevent MCP disconnect at boot)
  - **10.42** — Doctor fresh-project detection (friendly NOT_INSTALLED message)
  - **10.46** — Setup wizard always prompts language + LLM (PR #117, validated PR #196 today)
  - **10.47** — Generalize grounding semantico as opt-in BYO (PR #118 + #142, validated PR #196 today)

### Deprecated (npm distribution)

- **All `10.x` versions deprecated on npm** (13 total: `10.0.0` plus `10.0.0-rc.1` through `10.0.0-rc.12`). Message: "Published in error during framework reset. Run `npm install sinapse-ai@latest` for the current GA release (1.3.0+)."
- The `10.x` line was published during the pre-rename phase; `1.x` is the canonical, supported line.

## [1.3.0] — 2026-05-08 — 🎉 Pre-GA hardening (Install UX + Greenfield/Brownfield handoff)

> **Versão oficial estável.** Fecha os dois bloqueadores de release reportados pelo maintainer: install UX que pulava configurações (idioma/IDE/modo) e handoff greenfield→brownfield onde projetos nunca graduavam. Soma 14 PRs nesta sessão (#180-#193): doc-first hardening (Categoria 0), lint hardening (Categoria 2), MCP+Skills audits (5.2/5.3) e os 4 PRs estruturais de pré-GA.

### Added (Pre-GA structural — PRs #190-#193)

- **Real interactive wizard** (PR #190 — `selectInstallationMode()`): usuário confirma greenfield vs brownfield via inquirer list; non-interactive (CI / piped stdin / `SINAPSE_NON_INTERACTIVE=1`) cai pro detected mode imprimindo a escolha. Novo helper `confirmInstallSummary()` renderiza summary estruturado (mode/language/IDE/target/grounding) antes de qualquer ação destrutiva.
- **Skip-announce** em `bin/commands/install.js`: quando idioma/IDE são reusados de `~/.claude/settings.json` (upsert), o installer agora imprime exatamente o que foi reusado e como forçar re-prompt (`--reconfigure`). Antes pulava silenciosamente.
- **Pre-install summary block** antes da Phase 1: `Idioma / IDE / Modo / Destino` com chance de Ctrl+C.
- **8-dimension maturity audit** (PR #191 — `auditMaturityDimensions()`): substitui os 3 signals antigos por checagem de docs, brand, designSystem, components, code, tests, infra, git history. Single-digit ms; safe to call em todo detect.
- **`MATURE` e `PARTIAL` no enum `ProjectState`** (PR #191): código alinha com a doc do PR #184 (5 maturity levels). Decisão tree em `detectProjectState()` reescrita em camadas; legacy paths preservados verbatim.
- **Routing cases `_handleMature()` e `_handlePartial()`** no `_routeByState()` switch.
- **Graduation signal** (PR #192 — `greenfield-handler` Phase 3): emite evento `graduation` + grava marker `workflow.maturity = 'mature'` em SessionState. Best-effort — falhas não bloqueiam.
- **MATURE-aware brownfield welcome** (PR #192 — `brownfield-handler`): aceita `context.projectState === 'MATURE'` como entry point legítimo e troca a mensagem de boas-vindas pra "Detectei um projeto maduro..." em vez do first-touch genérico.
- **Continuation Behavior real** (PR #193 — `_handlePartial()`): inventário das dimensões presentes + gap analysis + recomendação de phase (heurística: docs+code sem tests → Phase 3, components sem docs → Phase 1, etc) + 3-way surface (`continue` / `brownfield` / `start-over`). Nunca sobrescreve.
- **`handleContinuationDecision(choice)`** roteia a escolha do user pro handler correto, propagando `continuation.inventory` como input ao próximo handler.

### Added (Doc-first hardening — PRs #180-#184)

- **Project Type Gate** em `.claude/rules/documentation-first.md`: bloqueia execução em [site, lp, app, platform, saas, api, service] sem epic/PRD/architecture.
- **Bootstrap Classification** no Imperator (`sinapse-orqx.md`): Step -1 (Initial State Audit) → Step 0 (project_type sub-classification) → Step 1 (route).
- **Greenfield sub-classification** em `.claude/rules/project-intelligence.md`: project_type → workflow file (greenfield-{ui,service,fullstack}.yaml).
- **Continuation Behavior (PARTIAL maturity)** documentada como contrato.
- **Audit doc-first**: `docs/audits/2026-05-07-doc-first-bug.md` com root cause de 4 gaps.

### Added (Lint hardening — PRs #185-#187)

- **`validate:cross-refs`** (PR #185): novo lint guard que checa refs `agent: <id>` em workflow YAMLs contra registry de agents. **Achou 71 refs quebrados em 13 workflows** — fix via aliases backward-compat (`pm` → `project-lead`, `po` → `product-lead`, `sm` → `sprint-lead`, `qa` → `quality-gate`, `dev` → `developer`).
- **`validate:all`** (PR #186): runner paralelo dos 6 lint guards (no-external-refs, no-personal-leaks, orqx-discipline, cross-refs, manifest:parity, squad-yaml). **~6x faster** (~5s sequencial → 0.85s paralelo).
- **CI lint mirror** (PR #187 — `.github/workflows/lint-guards.yml`): mesmos 6 guards rodam em PR + push to main, cobrindo contributors sem husky e pushes com `--no-verify`.

### Added (Audits read-only — PRs #188-#189)

- `docs/audits/2026-05-08-mcp-integration-audit.md`: PASS, 1 LOW recommendation.
- `docs/audits/2026-05-08-skills-audit.md`: PASS com 1 MEDIUM (`.claude/skills/` não está em `package.json#files`).
- `docs/audits/2026-05-08-install-ux-audit.md`: FAIL pra GA (resolvido em PR #190).
- `docs/audits/2026-05-08-greenfield-brownfield-handoff-audit.md`: FAIL pra GA (resolvido em PRs #191-#193).

### Changed

- 5 framework agents (`project-lead`, `product-lead`, `sprint-lead`, `quality-gate`, `developer`) ganharam aliases backward-compat (`pm`, `po`, `sm`, `qa`, `dev`) pra workflows que usam IDs legacy continuarem resolvíveis.
- `pre-push` hook: 6 lint guards seriais consolidados em uma única chamada paralela `validate:all` (tempo de push reduzido).

### Fixed

- ESLint pré-existente em `scripts/sync-squad-yaml-components.js:58` (no-regex-spaces — literal duplo espaço → `{2}` quantifier).

## [1.2.1] — 2026-05-04 — Polish patch (--version flag)

### Added

- **Canonical `--version` flag** (`-v` / `version` aliases): every CLI user
  expects `npx sinapse-ai --version` to return the semver. Previously routed
  to fuzzy match (`Comando desconhecido: --version`). Now reads from
  package.json and prints raw semver only — no banner, no ANSI — so scripts
  capture cleanly.
- 5 contract tests in `tests/unit/cli-version-flag.test.js`.
- `docs/glossary.md` with official SINAPSE taxonomy terms: `squad`, `flow-state`, `confidence gate`, `execution profile`.
- `scripts/semantic-lint.js` for semantic terminology regression checks, plus `tests/unit/semantic-lint.test.js`.

### Changed

- CI now includes a `Semantic Lint` job (`npm run validate:semantic-lint`).
- Pre-commit markdown pipeline now runs semantic lint through `lint-staged`.

### Migration Notes

- Deprecated terminology replacements: `expansion pack` -> `squad`, `permission mode` -> `execution profile`, `workflow state` -> `flow-state` (warning-level migration).

## [1.2.0] — 2026-05-04 — 🎉 GA Definitiva (versioning reset, branding SNPS AI)

> **Branding reset.** Após bloqueio de v1.0.0/1.0.1/1.1.0 no npm (publishes legacy de março/2026), v1.2.0 estabelece a linha 1.x oficial do framework. Linha 10.x mantida no histórico.
> **Visible branding:** o logo e ASCII art agora mostram **SNPS AI** (abreviação de SINAPSE) em wizard, postinstall, banners, help, status. Nome formal `SINAPSE AI` permanece em README h1, LICENSE, npm package name (`sinapse-ai`).
> **Inclui (PRs #138-#143):** refactor cli.js modular (1752→175 LOC), audit 3 CLI UX polish, SNPS rename + slash namespace migration, article gates VII/VIII/XI automatizados, grounding hooks shipados (vault/DS/brand), trusted publishing OIDC, 3 revisões clínicas com zero P0/P1.

### Added (Story GA-1.6 — Grounding hooks shipados: vault / DS / brand)

- **3 executable Claude Code hooks** at `.sinapse-ai/hooks/sinapse-{vault,ds,brand}-grounding.cjs`,
  closing the gap left by Story 10.47 (which shipped the wizard + library
  hooks but no executable hooks). Hooks read `~/.claude/sinapse-ai-config.yaml`
  and inject `<vault-grounding>`, `<ds-grounding>`, or `<brand-grounding>`
  blocks into the user prompt via the standard `UserPromptSubmit` contract.
- **Auto-registration in `~/.claude/settings.json`** during `sinapse-ai install`
  and `update` — idempotent, non-destructive (preserves any existing personal
  hooks like `vault-grounding.cjs`, `terminal-bus.cjs`).
- **Coexistence with personal hooks:** `sinapse-` filename prefix + dedicated
  config file (`sinapse-ai-config.yaml` instead of `vault-routing.json` /
  `ds-routing.json`) means both layers can run side-by-side.
- **Fail-open guarantees:** every error path exits 0 silently. 3500 ms timeout
  per hook. Anti-double-injection check. Size caps (6000 / 3000 / 2000 chars).
- **31 new tests** in `tests/hooks/` covering executable contract (spawned
  child processes with isolated `HOME`), helpers (pure functions), and the
  settings.json registrar (idempotence, missing-file safety, malformed JSON
  handling, personal-hook preservation).
- **Docs:** new "How the hooks work" section in `docs/guides/grounding-setup.md`
  covering activation triggers, size caps, and coexistence policy.

### Added (Story GA-1.5 — Article gates VII/VIII/XI automated)

- **Article VII gate (Metrics Accuracy):** new `scripts/validate-article-vii.js`
  detects drift in squad/agent/orqx/task counts across `README.md`, `README.en.md`,
  `AGENTS.md`, `package.json` description, and `packages/installer/src/wizard/feedback.js`.
  Runs in CI on every PR/push and as a pre-publish step in `npm-publish.yml`.
- **Article VIII gate (Mandatory Delegation):** new `scripts/validate-article-viii.js`
  verifies `enforce-delegation.cjs` is registered in `.claude/settings.json`,
  has valid syntax, and that no `*-orqx.md` agent contains direct execution
  instructions (e.g., "use Edit tool", "run npm").
- **Article XI gate (Conservative Default):** new `scripts/validate-article-xi.js`
  blocks PRs that delete files in protected paths (`squads/*/agents/`,
  `squads/*/tasks/`, `squads/*/knowledge-base/`, `bin/`, `.claude/hooks/`,
  `.sinapse-ai/development/agents/`) without an explicit
  `Article XI override: <reason>` justification in commit messages or PR body.
  Renames (`git mv`) are not blocked.
- **CI workflow:** new `.github/workflows/article-gates.yml` with three parallel
  jobs (article-vii, article-viii, article-xi) wired to PR and push triggers.
- **NPM scripts:** `validate:article-vii`, `validate:article-viii`, `validate:article-xi`.
- **Docs:** `docs/pt/architecture/article-gates.md` explaining each gate and
  the override protocol for Article XI.

### Fixed (Story GA-1.5 — collateral metrics drift)

- README.md, README.en.md, AGENTS.md, and `packages/installer/src/wizard/feedback.js`
  updated from stale counts (18/186, 18/175, 1,425/1,430/1,370 tasks) to canonical
  counts (19 squads, 200 agents, 1,237 tasks) — surfaced and required by the new
  Article VII gate.

### Changed (Story GA-1.4 — SNPS Rename)

- **Master orchestrator renamed:** `sinapse-orqx` → `snps-orqx`.
  Backward-compat alias `@sinapse-orqx` preserved for one release (until v1.3.0).
- **Slash command namespace migrated:** `/SINAPSE:agents:*` → `/SNPS:agents:*`.
  The legacy `/SINAPSE:` namespace remains available as a deprecation alias for one release.
- **Visual branding updated:** CLI banner ASCII art and user-facing strings
  ("Bem-vindo ao SNPS AI", postinstall summary, update messages) now show **SNPS AI**.
- **Formal name preserved:** the npm package (`sinapse-ai`), README h1, LICENSE,
  internal env vars (`SINAPSE_HOME`, `SINAPSE_SKIP_POSTINSTALL`, etc.), and source
  file names are intentionally unchanged.

### Files renamed

- `.sinapse-ai/development/agents/sinapse-orqx.md` → `snps-orqx.md`
- `.claude/agents/sinapse-orqx.md` → `snps-orqx.md`
- `.codex/agents/sinapse-orqx.md` → `snps-orqx.md`
- `.github/agents/sinapse-orqx.agent.md` → `snps-orqx.agent.md`
- `sinapse/agents/sinapse-orqx.md` → `snps-orqx.md`
- `docs/guides/agents/traces/sinapse-orqx-execution-trace.md` → `snps-orqx-execution-trace.md`
- `docs/sinapse-agent-flows/sinapse-orqx-system.md` → `snps-orqx-system.md`
- `.claude/commands/SINAPSE/` content copied to `.claude/commands/SNPS/` (SINAPSE/ retained as alias)

## [10.0.0] — 2026-05-02 — 🎉 General Availability

> **Note on versioning:** initial plan was a 10.x → 1.0.0 reset, but
> versions 1.0.0/1.0.1/1.1.0 were already published in March 2026 to
> npm under the same package name (legacy). Skipping the symbolic
> reset and promoting `10.0.0` (clean, no -rc) as GA on the
> `latest` dist-tag. Functionally equivalent: same code, same
> contracts, same audit results. The 10.x line becomes the official
> stable line.

## [1.0.0] — 2026-05-02 — 🎉 General Availability

**SINAPSE-AI v1.0 is here.** First public stable release. The framework
that started as IMORI experiments and grew into a 19-squad / 200-agent
orchestration system with Constitutional governance is now production-ready.

### Migration from rc.x

If you were tracking `dist-tag rc`:
```bash
npm install -g sinapse-ai@latest
```

Or pin v1 explicitly:
```bash
npm install -g sinapse-ai@1.0.0
```

There are no breaking changes between `10.0.0-rc.12` and `1.0.0` — the
version reset to v1.0.0 is the formal GA promotion of the rc.x line
(decision: 10.x was the beta version of the product; v1.0.0 is the
official launch).

### What v1.0.0 ships

- **19 squads** organized around domain expertise (brand, copy,
  growth, paid media, finance, content, design, animations, cybersec,
  product, research, council, courses, commercial, storytelling,
  cloning, art direction, claude-code-mastery, plus the master)
- **200 agents** (12 framework + 188 squad specialists)
- **22 orqx** orchestrators (21 squad + 1 master `sinapse-orqx`)
- **1.237 tasks** executable across the squads
- **Constitution** with 12 articles, 6 marked NON-NEGOTIABLE, enforced
  by 19 runtime hooks
- **Multi-IDE parity:** Claude Code + Codex CLI
- **Grounding semantic foundation** (vault / design-system / brand
  opt-in BYO via `~/.claude/sinapse-ai-config.yaml`)
- **Doctor** with 16 health checks, fail-fast on broken state
- **Safe Collaboration** for non-developer users (Caio + Matheus)
- **Persona simulation notice** in 22 mind clones (LICENSE §VII)
- **`--provenance`** signed publish via OIDC trusted publishing

### Pre-GA cycles closed

This GA is built on top of three sequential pre-GA audit cycles:

- Audit 1 (Functional) — runtime/install verified across 8 sub-domains.
  Closed P0 uninstall completeness.
- Audit 2 (Quality) — code/security/perf reviewed across 8 sub-domains.
  Closed 3 P0 (chrome-brain coverage, sinapse-pro coverage, undeclared deps).
- Audit 3 (UX/DX) — public messaging/onboarding reviewed across 10
  sub-domains. Closed 6 P0 (counts/badge/persona table/agent reference/
  org consolidation/security versions).

11 of 15 P0 surfaced by the audits are closed. Remaining P1/P2 items
become v1.0.x or v1.1 backlog — none block GA.

### Backlog for v1.0.x and beyond

- Audit 2 Wave B/C — refactor `bin/cli.js` (1752 LOC), consolidate
  `dev/` vs `infra/` duplications, fail-mode matrix doc, automated
  Article VII/VIII/XI gates
- Audit 3 Bloco C/D/E — CLI error PT consolidation, `sinapse` vs
  `sinapse-ai` binary deprecation path, fuzzy-match unknowns,
  postinstall next-step hint, examples library expansion
- SNPS prefix rename (`sinapse-X` → `snps-X` agent files) — v1.1
- Dim 14/15/17 audit reactivation — driven by post-GA telemetry

### Acknowledgments

Built with Claude Opus 4.7 (1M context) co-author across the entire
audit + GA preparation cycle. Full transcript-to-PR traceability in
the commit log.

## [10.0.0-rc.12] — 2026-05-02

3-audit consolidation. Closes 11 of the 15 P0 surfaced by the three
sequential pre-GA audits (Functional / Quality / UX-DX). Remaining
P1/P2 are tracked in `docs/audits/` for follow-up; none block GA.

### Fixed — Audit 1 (Functional)

- Uninstall now removes every SINAPSE-authored agent file via
  `~/.sinapse/installed-agents.json` manifest (was leaving ~178
  orphaned files in `~/.claude/agents/` + `~/.codex/agents/`).
  Backward-compat heuristic for pre-manifest installs. (PR #129)
- Doctor `ide-sync` check no longer reports `12/12 ✓` while ~21
  squad orqx files are missing — now expects framework + squad orqx
  baseline. (PR #130)
- New doctor `manifest-version-parity` check fails on package.json ↔
  install-manifest.yaml drift. (PR #130)

### Fixed — Audit 2 (Quality)

- `chrome-brain.js` (1145 LOC) now has 6 smoke tests locking the
  public contract — was 0% coverage. (PR #132)
- `sinapse-pro.js` bin (232 LOC) now has 5 smoke tests — was 0%. (PR #132)
- `yaml@^2.8.3` declared in `dependencies` (was used but undeclared,
  silent-break risk on hoist-strip publish). (PR #132)
- `@eslint/js@^9.39.4` declared in `devDependencies` (used in
  `eslint.config.js`, was undeclared). (PR #132)

### Fixed — Audit 3 (UX/DX)

- README counts reconciled to disk reality: 200 agentes (was 186), 19
  squads (was 18), 1.237 tasks (was 1.425). Test badge bumped to 11014. (PR #134)
- `getting-started.md` persona table replaced legacy-upstream codenames
  with canonical SINAPSE codenames (Litmus/Stratum/Beacon/Axis/Scope/
  Tensor/Mosaic/Pipeline). (PR #134)
- `agent-reference.md` was misnamed AGENTS.md for Codex — renamed to
  `codex-config.md`; created a real `agent-reference.md` documenting
  the 10 framework agents + 21 squad orqx + ~170 specialists. (PR #134)
- GitHub org consolidated to `caioimori/` across ~120 files (was a
  split-brain with vestigial `SinapseAI/` references). (PR #134)
- `SECURITY.md` supported-versions table replaced legacy v7.x with the
  real channel matrix (rc.x on `rc`, 9.x last-GA on `latest`). (PR #134)
- Replaced illustrative `ghp_xxxx` / `sk-xxxx` placeholders in
  security-hardening.md with `<your-X-here>` form. (PR #134)
- Deleted `.github/ISSUE_DRAFT_P0_missing_module.md` (Jan 2025
  obsolete draft referencing legacy persona names). (PR #134)

### Added — Pre-GA hardening artifacts

- `docs/audits/audit-1-functional/` — 8 sub-reports + SUMMARY (PR #128)
- `docs/audits/audit-2-quality/` — 8 sub-reports + SUMMARY (PR #131)
- `docs/audits/audit-3-ux-dx/` — 10 sub-reports + SUMMARY (PR #133)

### Notes for v1.0.0 promotion

This RC closes the three pre-GA audit cycles. Remaining open items
(Audit 2 Wave B/C, Audit 3 Bloco C/D/E) are P1/P2 that do not block
GA — they become v1.0.x or v1.1 backlog.

For the v1.0.0 GA promotion (next event):
- Tag `v1.0.0` (clean semver, no -rc suffix) → workflow auto-routes
  to `latest` (per PR #127 fix)
- `--provenance` automatic via OIDC
- GitHub release notes + migration guide

## [10.0.0-rc.11] — 2026-05-02

Pre-GA hardening sprint. Closes the remaining clinical-audit blockers and the
last UX/legal items that were holding back v1.0.0 promotion. Zero new features
— this RC exists to make v1.0.0 boring.

### Added — Clinical Audit completion (14/17 dimensions)

- **Dim 3 — Agents (CONCERNS).** 0 P0 / 3 P1 / 3 P2 / 2 P3. Constitutional
  drift in the canonical counts block, Imperator banner referencing stale
  numbers, and undecided subagent surface across 178 files in `.claude/agents/`.
  None block runtime; all block honest v1 messaging. `docs/audits/audit-dim-03-agents.md`. (PR #121)
- **Dim 4 — Subagents (CONCERNS).** 0 P0 / 1 P1 / 4 P2 / 2 P3. Spawn vs
  activator surface is undocumented; `sinapse-` prefix policy still pending.
  Mirrors Dim 3 F3-4. `docs/audits/audit-dim-04-subagents.md`. (PR #121)
- **Dim 5 — Workers (CONCERNS).** 0 P0 / 1 P1 / 3 P2 / 2 P3. Service registry
  was 5 months stale with 8 phantom entries (regenerated in Block 3a).
  `docs/audits/audit-dim-05-workers.md`. (PR #121)
- **Dim 6 — Squads (CONCERNS).** 0 P0 / 2 P1 / 4 P2 / 2 P3. 10/19 squad
  manifests had count drift; 3 lacked the metrics block entirely. Reconciled
  in Block 3a via new idempotent script. `docs/audits/audit-dim-06-squads.md`. (PR #121)
- **Dim 7 — Clones (CONCERNS).** 0 P0 / 2 P1 / 3 P2 / 1 P3. 22 simulated
  personas of real public figures shipped with no licensing or disclaimer
  in the OSS package. Resolved in Block 3b — disclaimer in every persona
  file + LICENSE notice + governance hook hardened to fail-closed.
  `docs/audits/audit-dim-07-clones.md`. (PR #121)
- **Dim 14, 15, 17 — DEFERRED.** Cognition-layer dimensions deferred from
  v1.0.0 with explicit justification. `docs/audits/dim-14-15-17-deferral.md`. (PR #121)

### Added — Pre-GA hardening (Block 1, 3, 7)

- Auto-generated counts block in `.sinapse-ai/constitution.md`
  with `npm run sync:counts`. Real numbers: 19 squads, 200 agents,
  22 orqx commands, 1237 tasks. (PR #119, #122)
- 16 squad manifests reconciled with disk reality via
  `npm run reconcile:squads` (idempotent). (PR #122)
- Service registry rebuilt: 369 workers, fresh timestamp. (PR #122)
- Persona simulation notice in 22 mind clones across squad-council,
  squad-storytelling, squad-design + machine-readable markers
  + `npm run apply:persona-disclaimer` (idempotent) +
  fail-closed `mind-clone-governance.py`. (PR #123)
- `LICENSE` "PERSONA SIMULATION NOTICE" section with takedown procedure. (PR #123)
- `.claude/agents/README.md` documents the activator pattern (decision 2a). (PR #122)
- `README.md` grounding section aligned with foundation-only state of
  Story 10.47 hooks (Concern 1 from Story 10.47 QA). (PR #119)
- `APSE → SNPS` string rename across docs/CHANGELOG (Caio decision 2026-05-02).
  Word-boundary safe — `SINAPSE` brand and `sinapse-` prefix preserved. (PR #124)

### Fixed

- Doctor `npm-packages` check honors Node module resolution instead of
  expecting sibling `.sinapse-ai/node_modules/`. Resolves Bug 3 GA blocker.
  Also adds `tar` as direct runtime dep (was only in `overrides`). (PR #120)
- Pre-existing `no-fallthrough` ESLint error at `bin/cli.js` cleared
  (Story 10.45 piggyback inside Story 10.46). (PR #117)
- Setup wizard now prompts for language + LLM in Git Bash + Windows where
  `process.stdin.isTTY === undefined` previously bypassed the prompts.
  Multi-signal `detectInteractiveMode()` honors stdout TTY + flag overrides
  + CI env vars. P0 GA blocker. (PR #117 / Story 10.46)
- Setup wizard now collects optional grounding paths (vault, design system,
  brand) via opt-in BYO and ships shipping-ready hooks under
  `.sinapse-ai/core/grounding/` with no-op default + JSON example templates
  + full guide `docs/guides/grounding-setup.md`. (PR #118 / Story 10.47)
- `tar` removed from `package.json` overrides after becoming a direct dep
  (resolves EOVERRIDE on `npm install`). (PR #125)

### Resolved (no work needed)

- Dependabot 20 historical alerts: all 17 fixed + 3 dismissed. 0 open. (Block 4)
- CodeQL 3s phantom check: self-resolved across PRs #117–#119. (Block 6)

### Notes for v1.0.0 promotion

This RC closes Phase 1 of the pre-GA gate. The next promotion event publishes
v1.0.0 to `latest` with `--provenance` (OIDC trusted publishing). Migration
notes for users on rc.x: backward compat alias for the (so-far-unused) APSE
prefix is unnecessary because no rc shipped APSE-prefixed agents publicly.

## [10.0.0-rc.10] — 2026-04-19

Release candidate capturing the first nine dimensions of the pre-GA Clinical Audit (Phases 1 through 3) and one rule-drift correction surfaced by the audit. Zero runtime changes — all deliverables here are documentation / governance artifacts that land ahead of the Fase C agent-rename work scheduled for 2026-04-23.

### Added — Clinical Audit coverage (9/17 dimensions)

- **Dim 13 Gitflows — PASS.** Branch protection, husky hooks (pre-commit + pre-push), and CI status checks verified against `safe-collaboration.md`. Admin-bypass flow exercised 7 times this session (PRs #98–#107) without issue. One MEDIUM logged (session-start auto-fetch is a convention, not a hook — post-GA stub). Evidence in `docs/audits/audit-dim-13-gitflows.md`. (PR #108)
- **Dim 11 Plugins — CONCERNS.** Installer footprint on plugin system confirmed zero (as intended). Two MEDIUMs: no plugin trust/review rule, no version-pinning guidance. Both are post-GA docs stories, not GA blockers. `docs/audits/audit-dim-11-plugins.md`. (PR #109)
- **Dim 12 MCP — PASS.** Chrome Brain MCP stack validated stable post-rc.8 (SessionStart hook in place). Installer idempotency observed. Two MEDIUMs: upstream figma-console instability (out of SINAPSE locus of control) and rule-drift in `mcp-usage.md` (fixed in PR #112). `docs/audits/audit-dim-12-mcp.md`. (PR #109)
- **Dim 1 Features — PASS.** Inventory of user-facing features validated against CLI help text + installer code. One MEDIUM (partial canonical-CLI parity, tracked as item #9 dual-CLI). `docs/audits/audit-dim-01-features.md`. (PR #110)
- **Dim 8 Commands — CONCERNS.** Dual CLI drift confirmed (`npx sinapse-ai` narrower than `sinapse`). Agent-subcommand audit deferred to Phase 4 per epic ordering (post-SNPS-rename). `docs/audits/audit-dim-08-commands.md`. (PR #110)
- **Dim 9 Skills — PASS.** All 17 authored skills + plugin + third-party skills load cleanly. One LOW (no top-level skill index doc). `docs/audits/audit-dim-09-skills.md`. (PR #110)
- **Dim 2 Workflows — PASS.** Four primary workflows (SDC, QA Loop, Spec Pipeline, Brownfield Discovery) have corresponding YAML definitions; 210 task files present. One MEDIUM (per-task contract quality not covered by shell audit — folded into Phase 5 follow-up). `docs/audits/audit-dim-02-workflows.md`. (PR #111)
- **Dim 10 Tools — PASS.** Hook coverage matches `hook-governance.md`; 74 hook-security tests pass; native-first discipline observed throughout session. One LOW (hook timeout guidance unwritten). `docs/audits/audit-dim-10-tools.md`. (PR #111)
- **Dim 16 Token Economy — PASS.** All 9 sections of the NON-NEGOTIABLE rule aligned with observed session behavior. One LOW (compaction threshold is convention, not hook — intentional). `docs/audits/audit-dim-16-token-economy.md`. (PR #111)

### Fixed

- **`.claude/rules/mcp-usage.md` drift** — Rule no longer claims Docker MCP Toolkit is the "primary MCP infrastructure"; relabeled as an optional acceleration layer. The "Direct in Claude Code" table now lists the three MCPs the SINAPSE installer actually registers (`chrome-devtools`, `dev-browser`, `terminal-bus`) instead of the previous `playwright` + `desktop-commander` entries that no installer path produces. Doc-only, no runtime change. (PR #112)

### Audit summary

Across the 9 dimensions audited pre-rename: **zero CRITICAL, zero HIGH, zero GA blockers.** Findings breakdown: 7 MEDIUM (all docs-only or tracked elsewhere) + 3 LOW (all optional polish). The remaining 8 dimensions (3 Agents, 4 Subagents, 5 Workers, 6 Squads, 7 Clones, 14 Research, 15 Knowledge Base, 17 Hallucinations) are deferred to Phase 4 + Phase 5 per the epic's ordering rule: "Rename (Fase C) executed between audit Phase 3 and Phase 4" to avoid auditing names that will churn.

## [10.0.0-rc.9] — 2026-04-19

Release candidate closing Fase B (Hardening): CLI surface parity, NSN guard enforcement at the hook layer, and the plan-first clinical audit epic. No new user-facing features — this is trust-infrastructure work ahead of GA.

### Added

- **Story 10.43** — `init <name>` on the canonical `npx sinapse-ai` entry. The greenfield scaffolder was reachable through the legacy `sinapse` binary but missing from `npx sinapse-ai`. Fixed with a thin `case 'init'` that forwards via `spawnSync` to the existing wizard — single source of truth, identical flags (`--force`, `--skip-install`, `--template default|minimal|enterprise`). Help text updated. (PR #103)
- **Story 10.44** — NSN Mode guard hook (`.claude/hooks/enforce-nsn-guard.cjs`). Scans `.md/.mdx/.txt` content on Write/Edit PreToolUse for NSN anti-patterns ("abra o dashboard manualmente", "siga esses passos manualmente", "não consigo acessar a interface", "você precisa abrir/clicar", "I can't do this"). WARN mode (stderr + exit 0) — gives agents visibility without false-positive blocking. Registered in `.claude/settings.json` and documented in `hook-governance.md`. (PR #104)
- **Epic: Clinical Audit (Pre-GA)** — `docs/epics/epic-clinical-audit-pre-ga.md`. Plan-first deliverable per explicit directive ("IA não pode alucinar — plano ANTES da execução"). Defines 17-dimension audit scope, per-dimension execution protocol (Inventory → Contract → Reality → Delta → Severity → Recommendation → Gate), phased dependency chain, and citation discipline (file:line required for every Reality claim). Audit execution does NOT begin with this merge — individual dimension stories must be written + validated Ready first. (PR #105)

### Changed

- **CLI help surface** — `npx sinapse-ai --help` now lists `init <name>` as the first command, reflecting the greenfield path now has parity.

### Unblocked

With rc.9, the pre-GA backlog is reduced to: (1) execute the clinical audit (blocked on explicit go-ahead per epic), (2) dual-CLI consolidation (separate story, not a GA blocker), (3) Fase C SNPS rename (separate epic).

## [10.0.0-rc.8] — 2026-04-19

Release candidate clearing the rc.8 gate: the three pre-GA blockers (Dependabot, Doctor FAIL on fresh project, Yarn v1 Windows platform exception) are resolved or durably triaged.

### Fixed

- **Story 10.41** — Chrome Brain SessionStart hook. The `chrome-devtools` MCP is configured with `--browser-url=http://127.0.0.1:9222`, so it tries to connect to an already-running Chrome at boot. Before this release the installer only registered `PreToolUse` / `PostToolUse` hooks — both fire **after** MCP init — so the MCP would fail, mark itself disconnected, and never auto-reconnect (user had to restart Claude Code). Installer now registers a `SessionStart` hook (`timeout=15s`) that runs `chrome-ensure` before MCP startup, and deduplicates hooks by `(matcher + command)` so the `matcher=""` slot does not collide with other modules (e.g. vault-grounding). Uninstall drops SessionStart entries by matching `chrome-ensure` in the command. Applied to both installer entrypoints (`bin/modules/chrome-brain-installer.js` + `packages/sinapse-install/src/capabilities/chrome-brain.js`). (PR #98)
- **Story 10.42 / Bug 3** — Doctor fresh-project detection. Running `sinapse doctor` in a directory where SINAPSE was never installed previously produced 11 FAIL entries — every check fired because no artifact existed. New users read that as "the framework is broken" on first contact. Fix: pre-flight `detectInstallState` in `.sinapse-ai/core/doctor/index.js`. If ALL THREE markers are absent (`<projectRoot>/.sinapse-ai/`, `~/.sinapse/`, `~/.claude/commands/SINAPSE/`), doctor short-circuits with a three-line NOT_INSTALLED block ("SINAPSE is not installed in this project. Run: npx sinapse-ai install") and exits code **4** (distinct from 0/1/2/3). JSON output carries `notInstalled: true` + `installCommand`. `--homeDir` option and `SINAPSE_DOCTOR_HOME` env override added for test isolation. Any single marker present → full 15-check suite runs unchanged. 5 new unit tests. (PR #100)

### Changed

- **Story 10.34 — re-executed + hardened.** GitHub Dependabot open-alert count already 0 (all 12 rc.1-era alerts closed). `npm audit --omit=dev` is clean. The 2 remaining advisories on the full tree (`picomatch@4.0.3` HIGH, `brace-expansion@5.0.4` MODERATE) are bundled inside `npm@11.12.1` within `@semantic-release/npm` — outside the reach of root `overrides`. Accepted with audit trail at `docs/security/dependabot-triage.md`. CI gate upgraded per Constitution Art. X Tier 1 #7: new job `npm audit --omit=dev --audit-level=high` (HIGH/CRITICAL in prod deps blocks); existing `--audit-level=critical` full-tree job retained. (PR #99)
- **Install matrix Yarn v1 Windows exception re-affirmed for GA.** `docs/audits/install-matrix-2026-04-16.md` sign-off updated: Dependabot + Doctor FAIL blockers cleared, gate decision marked durable through GA 1.0.0 with explicit revalidation triggers. 24/27 combo matrix stands. (PR #101)

### Infrastructure

- **Doctor exit code table expanded.** `0=PASS, 1=WARN, 2=FAIL, 3=internal-error, 4=NOT_INSTALLED`. Release notes for downstream scripts that branch on exit code.
- **CI security gate** now enforces zero HIGH/CRITICAL in production deps on every PR that touches `package-lock.json`.

## [10.0.0-rc.4] — 2026-04-16

Release candidate closing the pre-v1.0.0 GA gate. Three blockers resolved today:

### Fixed

- **Story 10.39** — Postinstall exit code fix. Fresh `npm install sinapse-ai` no longer fails with `npm error command failed` when the framework is operational but doctor reports non-critical WARN findings. Exit 1 removed from the contract; only critical failures (sync:ide error, doctor exit ≥ 2) now produce non-zero exit. `--json` output still carries `status: warn` for pipelines that want strict behavior. (PR #82)
- **Story 10.34** — Dependabot vulnerabilities cleanup. Root lockfile now overrides `serialize-javascript ^7.0.5`, `picomatch ^4.0.4`, `brace-expansion ^5.0.5`. Health-dashboard subpackage lockfile regenerated against current `package.json` (vite@7.3.1, react@18.2). `npm audit --omit=dev` on root = 0 vulnerabilities; `npm audit` on health-dashboard = 0 vulnerabilities. Remaining dev-only vulns inside bundled npm CLI (via `@semantic-release/npm`) dismissed as tolerable risk. (PR #83)

### Changed

- **Story A.5 closed** — Windows Wrapper & Cross-Platform Test Matrix accepted with 24/27 PASS. The 3 FAIL combos are all Windows × Yarn v1 (classic), documented as an unsupported platform: Yarn v1 has been in maintenance mode since 2020 with Yarn Berry (v2+) as successor. Windows users should migrate to Yarn v2+ or use npm/pnpm. macOS/Linux on Yarn v1 remain supported. (PR #80)
- `README.md` — "Supported Platforms" matrix published under installation FAQ, documenting the Yarn v1 Windows exception.
- `docs/audits/install-matrix-2026-04-16.md` — full decision record for the A.5 gate.

## [Previous Unreleased]

Epic `install-ux-hardening` — hardens the install pipeline, CLI output,
agent activation and handoff runtime so a non-technical user can
`npm install -g sinapse-ai` on Windows / macOS / Linux, see a minimal
friendly output, invoke `@developer` immediately, and get a clean
`sinapse doctor` on a fresh machine. 6 stories Done, 1 (A.5) InReview
gated on rc.4 CI matrix execution. Resolves gargalos G1-G7 from the
2026-04-14 internal install audit. Blocks v1.0.0 GA.

### Added

- **Story A.1** — Postinstall orchestrator (`bin/postinstall.js`). Fresh
  `npm install -g sinapse-ai` now automatically runs `sync:ide --ide
  claude-code`, creates `.sinapse/handoffs/` and `.sinapse/scratchpad/`
  runtime dirs, and runs `sinapse doctor --quiet`. No manual sync step
  needed after install. Respects `SINAPSE_SKIP_POSTINSTALL=1`
  (explicit opt-out) and auto-skips on common CI env vars
  (`CI=true`, `GITHUB_ACTIONS`, etc.) unless
  `SINAPSE_FORCE_POSTINSTALL=1` is set. Fails loudly (exit 2) on
  critical failures (sync:ide error, doctor FAIL). Resolves G1, G2, G7.
- **Story A.2** — Structured logger (`.sinapse-ai/core/logger/`) with
  levels `error | warn | info | debug`. Default level is `warn` so
  fresh installs emit ≤ 10 lines of output. `--verbose` promotes to
  `info`, `--debug` to `debug`, `--quiet` suppresses all but `error`,
  `--json` emits structured output for CI/automation. All 336
  existing `console.*` calls in `bin/cli.js` and `bin/sinapse.js`
  migrated to the logger. ASCII art header only shown on `--verbose`
  or first-run. Resolves structural half of G3.
- **Story A.3** — Doctor exception classification. Each check module
  now declares its own failure severity via `onError: 'fail' | 'warn'
  | 'skip'`. The generic `catch` in `.sinapse-ai/core/doctor/index.js`
  no longer marks every exception as FAIL. `entity-registry`,
  `agent-memory`, `git-hooks` are `warn` in fresh-install context;
  `node-version`, `npm-packages`, `settings-json` remain `fail`.
  Doctor exit codes: `0` PASS, `1` WARN only, `2` FAIL, `3` internal.
  Fresh install on clean machine now returns exit code `0`. Resolves
  G4.
- **Story A.4** — Manifest parity validation. New script
  `.sinapse-ai/infrastructure/scripts/validate-manifest-parity.js`
  compares `install-manifest.yaml` against real files in
  `.sinapse-ai/development/{agents,tasks,templates,checklists}/`.
  Wired into `pre-push` hook and `npm run validate:manifest`. CI
  workflow `.github/workflows/manifest-parity.yml` runs parity check
  on every PR. `install-manifest.yaml` regenerated with accurate
  counts (12 agents, not 23) and hashes. Resolves G5.
- **Story A.5** — Cross-platform install test matrix infra
  (`.github/workflows/install-matrix.yml` + local harness
  `scripts/test-install-matrix-local.sh`). 27 combos (Win/Mac/Linux ×
  npm/pnpm/yarn × global/npx/local). Gated behind release label —
  execution deferred to rc.4 CI run (A.5 remains `InReview` until
  matrix is green). Resolves G6 (infra only).
- **Story B.1** — Minimalist install output. Default `sinapse install`
  output is ≤ 8 lines: version, agent/squad count, `sinapse doctor`
  hint, `@sinapse` hint, docs URL. `--verbose` preserves full
  relatório for power users, `--json` for CI, first-run detection
  adds a "Bem-vindo ao SINAPSE!" line once per machine. Copy reviewed
  for non-technical PT-BR voice. Resolves content half of G3.
- **Story C.1** — Exit codes, auto-doctor and opt-in telemetry stub.
  Install script exits `0` success, `1` partial (warnings), `2`
  failed. `sinapse doctor --quiet` runs at end of postinstall with a
  one-liner on failure. New `.sinapse-ai/core/telemetry/` module —
  **disabled by default**, opt-in via `sinapse telemetry enable` or
  `SINAPSE_TELEMETRY=1`. Anonymized payload (no paths, no usernames):
  failure category + platform + version only. Privacy policy in
  `docs/TELEMETRY.md`. Real endpoint is follow-up work.

### Notes

- **Story A.5 (`InReview`)** — workflow infrastructure is merged; the
  27-combo matrix itself will execute as part of the rc.4 release
  cycle. A.5 is promoted to `Done` only after the matrix passes
  green, per the epic-level gate for `rc → latest` promotion.

## [10.0.0-rc.3] - 2026-04-13

Critical UX fix: installer can no longer destroy user config.

### Fixed

- **Story 10.38** — Installer merge-only policy. Existing `CLAUDE.md`,
  `.env` and other known config files are ALWAYS merged during
  install — never overwritten, never prompted. User customizations
  (custom rules, env values) are preserved by default and
  unconditionally. Files without a registered merge strategy are
  backed up (`<file>.backup.<ts>`) before any change. Legacy fallback
  installer (`bin/sinapse-init.js`) now also runs `MarkdownMerger` on
  existing `CLAUDE.md` instead of plain `fse.copy`. The old
  `--merge` / `--no-merge` flags are accepted as no-ops for
  backward compatibility.

## [10.0.0-rc.2] - 2026-04-13

Bug fix: `--reconfigure` flag for `npx sinapse-ai install`.

### Fixed

- **Story 10.35** — `npx sinapse-ai install --reconfigure` re-prompts
  language and LLM choice without wiping existing install. Upsert fast
  path (plain `install`) is unchanged. Non-TTY guard preserved. PR #69.

## [10.0.0-rc.1] - 2026-04-13

Phase 0 + Phase 1 closeout for the v10.0.0 release. 15 stories shipped
across 5 cycles, +130 tests, zero regressions, deterministic working
tree, idempotent installer + updater, doctor reachable from canonical
CLI, hardened cross-IDE parity, and full release-readiness aggregator.

### Added

- **Story 10.17** — External-refs CI guard (`scripts/validate-no-external-refs.js`)
  scanning 100% of git-tracked files, plus Phase 0 authorial hygiene
  pass and Epic 11.0 placeholder. PR #51.
- **Story 10.18** — Cross-IDE parity hardening: self-sufficient
  `validate-parity.js` error reporting, new `validate:parity:fast`
  pre-push guard with smart short-circuit, compatibility contract
  versioning policy (`sinapse-current.yaml`). PR #52.
- **Story 10.19** — Coverage floor ratchet (jest.config.js policy
  comment + 23/21/23/25 floors) and story-meta linter
  (`scripts/validate-story-meta.js`). PR #53.
- **Story 10.20** — Install upsert idempotente in `bin/cli.js`:
  `syncDirSync`, `detectExistingInstall`, `--force` escape hatch.
  Re-running install preserves `installedAt` and reuses prior
  language/LLM choices. PR #54.
- **Story 10.21** — `npx sinapse-ai doctor` wired into the canonical
  CLI with `--fix`, `--dry-run`, `--json`, `--quiet`, `--deep`,
  `--help` flags. Mirrors legacy `bin/sinapse.js` wiring but uses
  `process.exitCode` for clean stdout flush. PR #55.
- **Story 10.22** — Update upsert idempotente: `cmdUpdateGlobal`
  reuses settings, calls `syncDirSync`, preserves `installedAt`,
  prints "Update complete" summary mirroring 10.20 install upsert. PR #56.
- **Story 10.23** — Squad allow-list cleanup. 5 of 6 pre-existing
  fork attribution files rewritten in authorial voice; the 6th
  (`skill-craftsman.md`) kept as permanent allow-list entry with
  documented rationale. PR #57.
- **Story 10.25** — Coverage Report Summary script
  (`scripts/coverage-report-summary.js`) replaces the no-op CI step;
  emits a Markdown table to `$GITHUB_STEP_SUMMARY` so PR reviewers
  see coverage at a glance. PR #59.
- **Story 10.28** — Squad orqx activation verification
  (`scripts/validate-squad-orqx.js`) covering 21 squad orchestrators
  across 4 distinct file formats. Companion to the existing
  `validate-agents.js` for core framework agents. PR #61.
- **Story 10.29** — Release readiness aggregator
  (`scripts/release-readiness.js`) wraps every validator built
  throughout Epic 10.0 into one pre-release report. PR #62.
- **Story 10.31** — Surgical README polish: CLI Reference now matches
  the canonical command surface, badges include test count and
  Constitution. PR #64.
- **Story 10.32** — This release prep: bump to 10.0.0-rc.1 +
  CHANGELOG entry summarizing all of Phase 0 + Phase 1.

### Fixed

- **Story 10.24** — Registry write idempotency. Changed
  `_writeRegistry` from `sortKeys: false` to `sortKeys: true`. Two
  writes of the same data now produce byte-identical files,
  eliminating the recurring `M entity-registry.yaml` churn that
  polluted git status throughout cycles 1-2. PR #58.
- **Story 10.27** — Pre-commit manifest auto-regen. The IDS
  post-commit hook now also regenerates `install-manifest.yaml`
  after any `.sinapse-ai/` change, and `generate-install-manifest.js`
  no longer writes a non-deterministic `generated_at` timestamp
  into the file body. The recurring "manifest outdated" warning
  is gone. PR #60.

### Changed

- **Story 10.30** — `sinapse-minimal` and `sinapse-graph` removed
  from `package.json` `bin`. The .js files stay for one release
  cycle as direct-node fallbacks, then are deleted entirely in
  v11. The canonical surface is now exactly two binaries:
  `sinapse` (legacy router) and `sinapse-ai` (canonical CLI). PR #63.

### Quality Metrics

- Tests: 10599 → 10729 (+130 across cycles 1-5, 0 regressions)
- Coverage actual: statements 34.9%, branches 32.47%, lines 35.03%,
  functions 37.73% (all above the 23/21/23/25 ratchet floors)
- Working tree determinism: every commit converges to clean state
- CI: 32-33 checks pass per PR (the only "fail" is the standalone
  CodeQL standalone scan unrelated to PR content)
- Allow-list shrunk from 6 → 1 permanent entry
- 6 new validators / scripts in production

### Breaking Changes

None. v10.0.0-rc.1 is fully backward-compatible with 9.x. The only
removal (`sinapse-minimal` / `sinapse-graph` bin entries) is for
binaries that have been deprecated since v3.11.1 with runtime
warnings.

---

## [6.0.0] - 2026-03-25

### Breaking Changes
- Standardized agent IDs to full names: `developer`, `quality-gate`, `project-lead`, `product-lead`, `sprint-lead`
- Unified orchestrator naming to `sinapse-orqx`
- Wizard simplified: PT-BR only, single LLM question, auto-detect everything
- Removed Spanish (ES) and Chinese (ZH) language support
- Only 19 orqx agents visible as commands (specialist agents are backend-only)

### Added
- Immersive SINAPSE AI welcome screen with ASCII art banner
- Auto-detection of project type (greenfield/brownfield/upgrade)
- Auto-detection of tech preset from project files
- LLM selection: Claude Code / Codex CLI / Both
- 19 global agent definitions installed to ~/.claude/agents/
- 18 orqx command files in .claude/commands/SINAPSE/agents/

### Changed
- Default language hardcoded to Portuguese (PT-BR)
- Installation wizard reduced to 1 interactive question
- CODEOWNERS updated to @caioimori & @eusoier
- Welcome banner updated to SINAPSE AI branding

### Removed
- All legacy external references cleaned from codebase
- Spanish (docs/es/) and Chinese (docs/zh/) documentation
- 11 core agent commands (dev, qa, pm, po, sm, etc.) — now backend-only
- Language selection from wizard (hardcoded PT-BR)
- User profile selection from wizard (hardcoded Quick Mode)
- Project type selection from wizard (auto-detected)
- Tech preset selection from wizard (auto-detected)

### Security
- LICENSE updated with complete MIT copyright chain
- Zero external references in codebase (verified via automated scan)

## [4.2.11] - 2026-02-16

### Added

- Squad agent commands are now automatically installed to active IDEs during pro scaffolding (`installSquadCommands`).
- Supports Claude Code (`.claude/commands/{squad}/`), Codex CLI (`.codex/agents/`), Gemini CLI (`.gemini/rules/{squad}/`), and Cursor (`.cursor/rules/`).
- Installed files are tracked in `pro-installed-manifest.yaml` and `pro-version.json`.

## [4.2.10] - 2026-02-16

### Fixed

- Handle `ALREADY_ACTIVATED` license status gracefully instead of throwing error.
- Fix error envelope parsing in pro license client — correctly extracts error messages from API responses.

## [4.2.9] - 2026-02-16

### Fixed

- Pass `targetDir` correctly to `runProWizard` — fixes pro install failing in non-CWD projects.
- Surface pro install errors to user instead of silently swallowing them.

## [4.2.8] - 2026-02-16

### Fixed

- Exclude `mmos-squad` (private) from pro scaffolding via `SCAFFOLD_EXCLUDES`.
- Merge `pro-config.yaml` sections into `core-config.yaml` during pro install (`mergeProConfig`).

## [4.2.7] - 2026-02-16

### Fixed

- Pro wizard (`npx sinapse-ai install`) now auto-installs `@sinapse-fullstack/pro` package during Step 2, fixing "Pro package not found" error in greenfield and brownfield projects.
- Greenfield projects without `package.json` now get `npm init -y` automatically before pro install.
- Removed unused `headings` import in `pro-setup.js`.

## [3.9.0] - 2025-12-26

### Highlights

This release introduces **Squad Continuous Improvement** capabilities with analyze and extend commands, plus a massive codebase cleanup removing 116K+ lines of deprecated content.

### Added

#### Story SQS-11: Squad Analyze & Extend
- **`*analyze-squad` command** - Analyze squad structure, coverage, and get improvement suggestions
- **`*extend-squad` command** - Add new components (agents, tasks, workflows, etc.) incrementally
- **New Scripts:**
  - `squad-analyzer.js` - Inventory and coverage analysis
  - `squad-extender.js` - Component creation with templates
- **8 Component Templates:**
  - `agent-template.md`, `task-template.md`, `workflow-template.yaml`
  - `checklist-template.md`, `template-template.md`
  - `tool-template.js`, `script-template.js`, `data-template.yaml`
- **New Tasks:**
  - `squad-creator-analyze.md`
  - `squad-creator-extend.md`

### Changed

#### Story TD-1: Tech Debt Cleanup
- Fixed ESLint warnings in 5 core files
- Removed 284 deprecated files (~116,978 lines deleted)
- Cleaned `.github/deprecated-docs/` directory
- Removed obsolete backup files

### Fixed
- ESLint `_error` variable warnings in test utilities
- Context loader error handling improvements

---

## [3.8.0] - 2025-12-26

*Previous release with WIS and SQS features.*

---

## [2.2.3] - 2025-12-22

### Highlights

This release marks the **Open-Source Community Readiness** milestone, preparing SINAPSE for public contribution while introducing the **Squad System** for extensibility.

### Added

#### Epic OSR: Open-Source Community Readiness (10 Stories)

- **Legal Foundation** (OSR-3)
  - `PRIVACY.md` / `PRIVACY-PT.md` - Privacy policies (EN/PT)
  - `TERMS.md` / `TERMS-PT.md` - Terms of use (EN/PT)
  - `CODE_OF_CONDUCT.md` - Community guidelines with contact info

- **Community Process** (OSR-6)
  - Feature request templates and triage process
  - Issue labeling standards

- **Public Roadmap** (OSR-7)
  - Public roadmap documentation
  - Community visibility into planned features

- **Squads Guide** (OSR-8)
  - Comprehensive guide for creating community squads
  - Examples and best practices

- **Rebranding to SINAPSE** (OSR-9)
  - Brand investigation complete
  - Namespace updated to SinapseAI

- **Release Checklist** (OSR-10)
  - GitHub configuration validated
  - CodeQL security scanning active (30+ alerts addressed)
  - Branch protection rules configured
  - Smoke test passed on clean clone

#### Epic SQS: Squad System Enhancement (Sprint 7)

- **Squad Designer Agent** (SQS-9)
  - New `@squad-creator` agent for guided squad creation
  - Interactive wizard with `*create-squad` command
  - AI-powered naming and structure suggestions

- **Squad Loader Utility** (SQS-2)
  - Local squad resolution from `./squads/` directory
  - Simplified loading without complex caching

- **Squad Validator + Schema** (SQS-3)
  - JSON Schema for squad manifest validation
  - `*validate-squad` command for compliance checking

- **Squad Creator Tasks** (SQS-4)
  - `*create-squad` - Interactive squad creation
  - `*validate-squad` - Manifest validation
  - `*list-squads` - Local squad discovery

#### Infrastructure & Documentation

- **Documentation Integrity System** (6.9)
  - Automated cross-reference validation
  - Link checking in CI pipeline

- **MCP Governance Consolidation** (6.14)
  - Unified MCP configuration rules
  - `.claude/rules/mcp-usage.md` guidance

- **Agent Config Path Fix** (6.15)
  - Resolved path resolution issues across platforms

- **Scripts Path Consolidation** (6.16)
  - Standardized script locations under `.sinapse-ai/scripts/`

- **Semantic Release Automation** (6.17)
  - Automated versioning on merge to main
  - Conventional commit parsing
  - Automatic CHANGELOG generation

- **Agent Command Rationalization** (Story 6.1.2.3)
  - Command consolidation: `sinapse-orqx` 44→30 commands (32% reduction)
  - Command consolidation: `data-engineer` 31→28 commands (9.7% reduction)
  - New consolidated tasks: `security-audit`, `analyze-performance`, `test-as-user`, `setup-database`
  - Migration guide: `docs/guides/command-migration-guide.md`
  - Agent selection guide: `docs/guides/agent-selection-guide.md`

- **Dynamic Project Status Context** (Story 6.1.2.4)
  - Git branch, modified files, and recent commits shown in agent greetings
  - Current story and epic detection from `docs/stories/`
  - 60-second cache mechanism (<100ms first load, <10ms cached)
  - Cross-platform support (Windows/Linux/macOS)

### Changed

- **Agent Delegation Guidance** - All agents now include "NOT for" sections in `whenToUse`
- **PR Title Format** - DevOps `*create-pr` now generates Conventional Commits format titles
- **Scripts Location** - Consolidated under `.sinapse-ai/scripts/` for consistency
- **MCP Configuration** - Unified rules in `.claude/rules/mcp-usage.md`

### Fixed

- **Agent Config Paths** (6.15) - Resolved path resolution issues on Windows
- **Script References** (6.16) - Fixed broken script imports across agents

### Security

- **CodeQL Scanning** - Active with 30+ alerts reviewed
- **Branch Protection** - Enabled on main (1 approver, dismiss stale reviews)

### Documentation

- **Squads Guide** - Complete guide for community squad creation
- **Feature Process** - Templates and triage workflow documented
- **Public Roadmap** - Community visibility into planned features
- **Legal Documents** - Privacy policy, Terms of Use (EN/PT)

---

## [4.32.0] - 2025-11-12

### Removed
- **Private squads** - Moved to separate private repository (`sinapse-squads`)
  - Removed `squads/creator/` (CreatorOS)
  - Removed `squads/innerlens/`
  - Removed `squads/mmos-mapper/`
  - Removed `squads/sinapse-infrastructure-devops/`
  - Removed `squads/meeting-notes/`
  - Repository: https://github.com/caioimori/sinapse-squads (PRIVATE)
- **Internal development tools** - Moved to separate private repository (`sinapse-dev-tools`)
  - Removed analysis scripts: `analyze-batches.js`, `analyze-decision-patterns.js`, `analyze-epic3.js`, etc.
  - Removed consolidation scripts: `consolidate-entities.js`, `consolidate-results.js`, etc.
  - Removed extraction scripts: `extract-all-claude-backups.js`, `extract-claude-history.js`
  - Removed generation scripts: `generate-entity-summary.js`, `generate-entity-table.js`
  - Repository: https://github.com/caioimori/sinapse-dev-tools (PRIVATE)
- **hybrid-ops squad** - Moved to separate repository for independent maintenance
  - Removed `squads/hybrid-ops/` directory
  - Removed `.hybrid-ops/` directory
  - Updated `core-config.yaml` to reference external repository
  - Updated `install-manifest.yaml` (removed 47 file entries)
  - Repository: https://github.com/caioimori/sinapse-hybrid-ops

### Changed
- README.md - hybrid-ops now listed under "Squads Externos"
- Squad can now be installed independently via GitHub
- **Squad naming convention** - Applied consistent `{agent-id}-` prefix to agent-specific tasks across all 6 squads
  - ETL pack: 4 tasks renamed (youtube-specialist, social-specialist, web-specialist)
  - Creator pack: 4 tasks already renamed (pre-existing migration)
  - Innerlens pack: 4 tasks renamed (fragment-extractor, psychologist, quality-assurance)
  - Mmos-mapper pack: 7 tasks renamed (cognitive-analyst, research-specialist, system-prompt-architect, emulator, mind-pm)
  - Sinapse-infrastructure-devops pack: 2 tasks already renamed (pre-existing)
  - Meeting-notes pack: 1 task already renamed (pre-existing)
  - All agent dependencies updated to reference new task names
  - Shared tasks correctly have NO prefix (conservative approach)

### Technical
- Story: 4.6 - Move Hybrid-Ops to Separate Repository
- Breaking Change: hybrid-ops no longer bundled with sinapse-ai
- Migration: Users can install from external repo to `squads/hybrid-ops/`
- Story: 4.7 - Removed `squads/hybrid-ops.legacy/` directory (legacy backup no longer needed)
- Story: 4.5.3 - Squads Naming Convention Migration
  - Applied naming convention from Story 4.5.2 to all 6 squads
  - Total: 15 tasks renamed (11 new + 4 pre-existing)
  - 18 agent files updated with new dependencies
  - Validation: 100% compliance, 0 broken references

## [4.31.1] - 2025-10-22

### Added
- NPX temporary directory detection with defense-in-depth architecture
- PRIMARY detection layer in `tools/sinapse-npx-wrapper.js` using `__dirname`
- SECONDARY fallback detection in `tools/installer/bin/sinapse.js` using `process.cwd()`
- User-friendly help message with chalk styling when NPX temp directory detected
- Regex patterns to identify macOS NPX temporary paths (`/private/var/folders/.*/npx-/`, `/.npm/_npx/`)
- JSDoc documentation for NPX detection functions

### Fixed
- NPX installation from temporary directory no longer attempts IDE detection
- Clear error message guides users to correct installation directory
- Prevents confusion when running `npx sinapse-ai install` from home directory

### Changed
- Early exit with `process.exit(1)` when NPX temporary context detected
- Help message provides actionable solution: `cd /path/to/your/project && npx sinapse-ai install`

### Technical
- Story: 2.3 - NPX Installation Context Detection & Help Text (macOS)
- Defense in depth: Two independent detection layers provide redundancy
- macOS-specific implementation (other platforms unaffected)
- Non-breaking change (patch version)

## [4.31.0] - Previous Release

*(Previous changelog entries to be added)*
