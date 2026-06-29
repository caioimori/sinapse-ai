---
id: AF-20260629-clinical-pre-launch
type: clinical-audit
date: 2026-06-29
framework_version: 1.17.0
verdict: NO_GO
critical: 3
major: 15
minor: 20
confirmed: 49
refuted: 27
method: 17 dimensoes / evidencia arquivo:linha / verificacao adversarial tripla
agents_used: 141
---
# Auditoria Clínica Pré-Divulgação — SINAPSE-AI v1.17.0

> Síntese de 17 dimensões (achados já verificados adversarialmente; refutados descartados).
> Data: 2026-06-28 · Veredito: **NO_GO** (3 CRITICAL confirmados)

## Placar

| Severidade | Confirmados |
|---|---:|
| CRITICAL | 3 |
| MAJOR | 15 |
| MINOR | 20 |
| (NIT/UNVERIFIED, fora da contagem) | 9 |

**Veredito:** NO_GO — qualquer CRITICAL bloqueia divulgação. Todos os 3 CRITICAL são correções de texto/config, não de arquitetura. Estimativa: 1–2 dias.

**Temas dominantes (causa-raiz que se repete):**
- **Métrica de agentes sem fonte única** (160/172/182/30 espalhados) → 6+ achados.
- **Documentação com links/comandos quebrados** (toggles, caminhos relativos, comandos CLI inventados) → 9+ achados.
- **Instalador novo não-localizado** (telas em inglês + URLs/pacotes errados) → 5 achados.

---

## Camada C — Anti-Alucinação (mais grave: 2 dos 3 CRITICAL)

### CRITICAL

**1. user-guide.md documenta comandos `sinapse` que não existem** (Alucinação factual / Art. IV)
- Evidência: `docs/guides/user-guide.md:214` `sinapse workflow greenfield-fullstack`; `:217` `sinapse workflow brownfield-integration`; `:251` `sinapse squads list`; `:254` `sinapse squads download etl-squad`; `:473` `sinapse squads search`. O switch real (`bin/sinapse.js:1026-1466`) não tem `workflow` nem `squads` — cai no default e é repassado ao Claude Code, não executa nada.
- Ação: Reescrever seções Workflows/Squads do user-guide.md (+ espelho `docs/pt/guides/user-guide.md`) com comandos reais (`sinapse orchestrate <story-id>`, `sinapse build "<brief>"`); remover/marcar `sinapse squads *` como roadmap.

**2. Workflow CI "Lint Guards" com YAML inválido — falha 100% e exibe X vermelho público** (Enforcement real)
- Evidência: `.github/workflows/lint-guards.yml:58-84` — job `validate-agents:` seguido de `name: Cross-IDE Parity` (L82) sem chave de job própria. `js-yaml` rejeita: "duplicated mapping key (82:5)". `gh run view 28344424277`: "run likely failed because of a workflow file issue". Todas as runs recentes = failure em 0s. Introduzido no commit que criou o arquivo (4b57b5f / PR #187).
- Ação: Dar ao bloco Cross-IDE Parity sua própria chave de job no nível `jobs:`. Adicionar teste que faça `yaml.load()` de TODOS os arquivos em `.github/workflows/` (repo já tem js-yaml).

### MINOR

**3. service-discovery.md descreve feature inteira com comandos inexistentes** (MAJOR)
- Evidência: `docs/guides/service-discovery.md:134` `sinapse discover`; `:218` `sinapse list`. Espelho PT idêntico. O comando real é `sinapse workers search <query>`.
- Ação: Substituir por `sinapse workers search` em ambos (EN+PT).

**4. squads-overview.md instrui `sinapse squads list/download/search`** (MAJOR)
- Evidência: `docs/guides/squads-overview.md:188` + espelho PT. `squads` não é case em `bin/sinapse.js`.
- Ação: Marcar como 'planejado' ou documentar como squads são realmente adicionados (filesystem em `squads/`).

**5. Banner do Imperator atribui 172 agentes aos 17 squads (squads têm 160)** (MINOR — Vazamento de voz)
- Evidência: `.sinapse-ai/development/agents/snps-orqx.md:3` e `:28` '172 agents total' (greeting MANDATORY exibido EXATAMENTE) vs `docs/framework/architecture-overview.md:57` '160 agentes'. Disco: 160 squad + 12 core = 172.
- Ação: Padronizar narrativa única ('160 de squad + 12 core = 172').

**6. routing_table do Imperator superdeclara tamanho de squads (vaza via *status)** (MINOR)
- Evidência: `snps-orqx.md:376` 'agents: 11' para claude-code-mastery (disco=8); finance '5' (disco=8); copy '12' (disco=13); cloning '8' (disco=9).
- Ação: Gerar contadores do filesystem ou corrigir os 4 valores.

### Dimensão HEALTHY nesta camada
- **Segurança e dados (Art. X):** LIMPO. Secret scan sobre todos os arquivos rastreados = zero credenciais reais (únicos hits são os próprios patterns do scanner). `.env.example` só com placeholders. `.gitignore` cobre `.env`/`*.key`/`*.pem`/`secrets/`. Pre-commit roda `staged-secret-scan.js` como primeiro guard. Único NIT: flag `--dangerously-bypass-approvals-and-sandbox` no delegate-cli (gated, intencional).
- **Vazamento de voz/persona:** essencialmente saudável — a seção '## Exemplo de execução' (origem das 14/16 violações N8N) NÃO existe em nenhum dos 172 agentes; codinomes só aparecem em seções exemptas (persona, handoff matrix).

---

## Camada D — Experiência (1 CRITICAL + maior volume de MAJOR)

### CRITICAL

**7. Comando de recuperação aponta para pacote npm inexistente (`npx @caioimori/sinapse`)** (UX de saída)
- Evidência: `packages/installer/src/wizard/validation/report-generator.js:89` `npx @caioimori/sinapse@latest init`; `troubleshooting-system.js:24` e `:40` idem. `package.json` name real = `sinapse-ai`.
- Ação: Trocar as 3 ocorrências por `npx sinapse-ai@latest install`. Centralizar a string num único módulo.

### MAJOR

**8. Instalador novo imprime mensagens hardcoded em inglês com jargão, ignorando i18n PT-BR**
- Evidência: `wizard/index.js:506` 'Installing SINAPSE core framework...'; `:533`; `:753` 'IDE sync validation: drift detected — run sinapse doctor --fix'; `:796`. Chave PT pronta não usada: `i18n.js:132` `installingCore`.
- Ação: Rotear pelo `t()`/`tf()` e neutralizar jargão.

**9. Relatório de validação pós-install 100% em inglês, mostrado a todo usuário**
- Evidência: `report-generator.js:22` 'Installation Validation Report'; `:86-88`. Chamado incondicional em `wizard/index.js:1080`.
- Ação: Migrar para `t()`/`tf()` com chaves PT ou suprimir no modo assistido (default).

**10. Guia de troubleshooting em inglês aponta para docs inexistente e repo de issues errado**
- Evidência: `troubleshooting-system.js:247` `docs.SinapseAI.com/troubleshooting`; `:254` `github.com/caioimori/sinapse/issues`. Real (`package.json`): `.../sinapse-ai/issues`.
- Ação: Corrigir URL de issues, remover/atualizar `docs.SinapseAI.com`, traduzir via `t()`.

**11. Tela de conclusão crava '172 agentes disponíveis' hardcoded e inconsistente**
- Evidência: `feedback.js:178` `172 ${t('completionAgents')}`. Diverge do selo (160), disco (182 .md), ide-sync (30).
- Ação: Calcular dinamicamente do manifest/registry instalado.

**12. README documenta postinstall automático de npm install que foi REMOVIDO** (Instalação)
- Evidência: `README.md:70` descreve postinstall + `SINAPSE_SKIP_POSTINSTALL=1`. Mas `package.json` não tem script `postinstall` (só `setup`), e `bin/postinstall.js:6-11` diz literalmente que não é mais wired no npm install (surface de supply-chain).
- Ação: Atualizar README.md:70 — setup roda via `npx sinapse-ai install` / `npm run setup`.

**13. Rollback transacional e taxonomia de erro acionável são código morto** (Instalação)
- Evidência: `bin/utils/install-transaction.js` e `bin/utils/install-errors.js` existem mas só são referenciados por testes e entre si — nenhum caminho de produção os importa. O install real (`cmdInstallGlobal`) não cria transação; falha bolha para `bin/cli.js:105` com dica genérica.
- Ação: Ligar `formatErrorMessage` no catch de `cmdInstallGlobal` e envolver fases em `InstallTransaction`, OU remover os módulos mortos.

### MINOR

**14. Banner "installed successfully!" impresso incondicionalmente, mesmo com ✗ na verificação**
- Evidência: `bin/commands/install.js:411-424` — `verifyInstall()` (só imprime ✓/✗, não muda exit code) seguido sem condicional pelo banner verde.
- Ação: Se houver ✗, trocar para "instalação concluída com avisos — rode doctor".

**15. Condução automática (camada 2) não está plugada no prompt — só o piso reativo garante doc-first** (Pipeline doc-first)
- Evidência: `.claude/settings.json:3-13` registra só `synapse-wrapper.cjs` em UserPromptSubmit; `synapse-engine.cjs` tem ZERO refs a route/doc-first/greenfield. A tabela só aparece se o agente rodar `sinapse route` proativamente; senão o usuário é conduzido só reativamente pela mensagem de bloqueio.
- Ação: Hook UserPromptSubmit leve que classifique brief de projeto novo e injete `<doc-first-routing>`. OU documentar que é 'floor-only de propósito'.
- Nota positiva: a hipótese de 2026-06-25 ('prosa, não enforcement; greenfield órfão') foi REFUTADA — o plano de 3 camadas foi implementado; `sinapse route 'criar um site'` classifica e BLOQUEIA corretamente; 9 testes passam.

**16. CHANGELOG [Unreleased] defasado: omite hardening cross-platform (#294/#295)** (Versionamento)
- Evidência: `## [Unreleased]` só tem entradas de ciclo antigo (glossary.md, semantic-lint.js); `git log` mostra #294/#295 já mergeados.
- Ação: Registrar #294/#295 e mover entradas órfãs.

**17. URL/org GitHub inconsistente entre package.json e release notes do npm-publish** (Versionamento)
- Evidência: `package.json:193` `caioimori/sinapse-ai`; `.github/workflows/npm-publish.yml` hardcoda `github.com/SinapseAI/sinapse-ai`.
- Ação: Padronizar para `caioimori/sinapse-ai` ou usar `${{ github.repository }}`.

### Pontos fortes nesta camada
- Caminho de install **robusto e idempotente** (upsert, 8 fases, ensurePath Windows/Unix). Deps CJS (chalk@4, inquirer@8, ora@5, execa@5) sem risco de ERR_REQUIRE_ESM.
- Versões 1.17.0 batem em package.json/install-manifest/CHANGELOG/npm pack; dist-tag latest coerente; provenance/OIDC presentes.

---

## Camada B — Verdade (1 dimensão MAJOR forte: cross-refs)

### MAJOR

**18. Descrição do comando master diz '160 agents' enquanto README/persona dizem 172** (Métricas Art. VII)
- Evidência: `bin/lib/command-generator.js:25` soma só agentes de squad (=160, exclui 12 core) → injeta na descrição visível na paleta de skills. No mesmo arquivo de persona, `snps-orqx.md:3` diz '172 agents total'. Canônico (`node scripts/sync-counts.js`): 172.
- Ação: Incluir os 12 core no `agentCount` (ou usar `totalAgents`).

**19. Toggle [ES] morto em toda a árvore de docs — 111 links quebrados** (Cross-references)
- Evidência: `docs/installation/linux.md:3` `[ES](../es/installation/linux.md)`; `docs/es/` não existe. 111 links `[ES]` quebrados.
- Ação: Remover item [ES] do toggle até tradução existir (PT funciona, manter EN|PT).

**20. Guias de instalação com links internos quebrados (caminho relativo + diretório ausente)** (Cross-references)
- Evidência: `docs/installation/linux.md:358` `[Uninstallation Guide](../uninstallation.md)` → resolve para docs/uninstallation.md (inexistente; real é `./uninstallation.md`). Mesmo bug em windows.md:401. `docs/installation/README.md:90` `[Architecture](../architecture/)` (inexistente); `:91` `[Changelog](../CHANGELOG.md)` (deveria ser `../../`).
- Ação: Corrigir caminhos.

**21. CONTRIBUTING.md (raiz) com 2 links mortos para contribuidores novos** (Cross-references)
- Evidência: `CONTRIBUTING.md:371` `[Template de Squad](templates/squad/)` (real: `.sinapse-ai/development/templates/squad-template/`); `:688` `[Arquitetura](docs/architecture/)` (inexistente).
- Ação: Repontar para os caminhos reais.

**22. Árvore PT-BR (docs/pt, público-alvo real) com 37 links internos quebrados** (Cross-references)
- Evidência: `docs/pt/contributing.md:341`; `docs/pt/architecture/module-system.md:368` `[Guia de Migração](../../migration/migration-guide.md)` (docs/migration/ inexistente); `docs/pt/community/...:52`.
- Ação: Rodar link-checker sobre docs/pt e corrigir.

### MINOR

**23. README repete '19 hooks ativos' (7x) mas o disco tem 17 .cjs / 15 registrados** (Métricas)
- Evidência: `README.md:24,38,196,357` + `README.en.md:22,36,338`. `ls .claude/hooks/*.cjs` = 17; registrados em settings.json = 15.
- Ação: Definir métrica canônica e ancorar num contador reproduzível (adicionar 'hooks' ao sync-counts.js).

**24. docs/README.md aponta para constitution-compliance.md inexistente** (Cross-references)
- Evidência: `docs/README.md:46` `[Constitution Compliance](./constitution-compliance.md)`; não existe em docs/.
- Ação: Remover linha ou criar/repontar.

**25. Versão da constituição se contradiz dentro do próprio arquivo** (Coerência constituição)
- Evidência: `.sinapse-ai/constitution.md:3` 'Version: 2.2.0' vs `:392` 'v1.0.0'.
- Ação: Sincronizar footer com header.

**26. Article V cita gate `pre-push.md` que não existe com esse nome** (Coerência constituição)
- Evidência: `.sinapse-ai/constitution.md:118`; arquivos reais: `github-devops-pre-push-quality-gate.md`, `.sinapse-ai/git-hooks/pre-push`.
- Ação: Trocar pela referência real.

**27. Doctor `constitution-consistency` valida só 10 dos 11 artigos (omite Article XI)** (Coerência constituição)
- Evidência: `.sinapse-ai/core/doctor/checks/constitution-consistency.js:22-33` — array `KEY_ARTICLES` sem 'Conservative Default'.
- Ação: Adicionar Article XI ao array ou documentar exclusão intencional.

**28. Master orquestrador duplicado e DESATUALIZADO no espelho .claude committed** (Paridade dual-register)
- Evidência: `.claude/commands/SINAPSE/agents/` tem `sinapse-orqx.md` (40912 bytes, sem rodapé 'Synced from') E `snps-orqx.md` (43927 bytes, canônico). Fonte só tem snps-orqx.md. O órfão não tem 'Deterministic engine' nem bloco ENG-GROUNDING:v2. Passa no validate:parity só porque `failOnOrphaned: false`.
- Ação: Deletar o órfão ou convertê-lo em redirect-stub; considerar `failOnOrphaned: true`.

**29. Contagem 160 vs 172 entre camadas geradas** (Paridade — mesma raiz do #18)
- Evidência: `command-generator.js:25` (160) vs corpo da persona (172, 4 ocorrências) vs codex (172 pointers).
- Ação: Padronizar.

### Dimensões fortes nesta camada
- **Paridade .codex:** PERFEITA — 172 pointers = 172 ids de fonte, 0 órfãos, 0 stale. `validate:parity` e `validate:codex-sync` PASS. O `ideSync.targets.codex.enabled: false` é design pós-E8 documentado.
- **Métricas (superfície de marketing principal):** README/README.en/package.json/constitution internamente consistentes em 172/17/1.200. A divergência está em camadas geradas/docs secundárias.

---

## Camada A — Esqueleto (estrutura sólida; achados são métricas + ponteiros mortos)

### MAJOR

**30. getting-started.md afirma que o wizard 'instala 19 squads' — são 17** (Integridade squads)
- Evidência: `docs/getting-started.md:17`. `ls squads/` = 17. Resíduo legado.
- Ação: Trocar '19 squads' por '17 squads'; varrer docs/ por contagens legadas.

**31. brownfield-handler chama `WorkflowExecutor.executeWorkflow()` — método inexistente** (Wiring workflows)
- Evidência: `.sinapse-ai/core/orchestration/brownfield-handler.js:356`. A classe não define `executeWorkflow` (só `execute`, `loadWorkflow`, `executePhase`). Teste passa por mock (`brownfield-handler.test.js:47`). Em produção → TypeError capturado pelo try/catch → retorna `{action:'brownfield_error'}` (discovery morre silenciosamente).
- Ação: Renomear call-site para `execute(...)` ou criar `executeWorkflow` real. Substituir mock por teste de contrato.

### MINOR

**32. Codinomes duplicados entre agentes (colisão de identidade do selo)** (Qualidade agentes)
- Evidência: `name: "Forge"` em squad-brand/brand-creative-engineer.md:5 E squad-cloning/agent-forger.md:5. `name: "Lens"` (content-analyst E production-director). `name: "Arc"` (content-engineer E storytelling-orqx).
- Ação: Renomear um lado de cada colisão + lint guard rejeitando `name:` duplicado.

**33. Contagem de agentes inconsistente README/Imperator (172) vs docs/framework (160)** (Qualidade agentes)
- Evidência: README.md:24/285/469 e snps-orqx.md dizem 172; architecture-overview.md:57 e guiding-principles.md:71/84 dizem 160.
- Ação: Padronizar narrativa.

**34. Contagem de agentes fragmentada em docs/ (160/172/177/178/185/189)** (Integridade squads)
- Evidência: `docs/agent-reference-guide.md:3,106` (172); architecture-overview.md (160); a própria auditoria E8-EXECUCAO admite '172/178/185/189'. orqx-plan.md:253 ainda cita '18 squads'.
- Ação: Criar `validate:metrics` que computa do filesystem e falha o CI se qualquer doc divergir.

**35. Contagem de hooks inconsistente README (19) vs getting-started/agent-reference-guide (13)** (Integridade squads)
- Evidência: README.md:24,38,357 (19) vs docs (13).
- Ação: Confirmar número real e unificar (idealmente no `validate:metrics`).

**36. 43 tasks embarcam ponteiros 'Source:' mortos (~78 paths inexistentes)** (Integridade tasks)
- Evidência: `advanced-elicitation.md:132` `Source: .sinapse-ai/core/task-runner.js` (inexistente); `utils/logger.js`, `scripts/execute-task.js` ausentes. Runner real em `core/execution/`. 43x task-runner.js, 43x utils/logger.js, etc.
- Ação: Remover rodapé ## Tools/## Scripts dessas 43 tasks OU corrigir 'Source:'. Como é gerado por template, corrigir o gerador.

**37. Exemplos de input do 'code-graph' não batem com schema real do provider** (MCP)
- Evidência: `mcp-tool-examples.yaml:184-198` ensina `{scope, depth}` e `{check: "circular"}`; provider real (`code-graph-provider.js:9-17`) expõe `find_definition`/`find_references`/`dependency_analysis` etc — sem 'circular' nem scope/depth.
- Ação: Reescrever os 2 exemplos com nomes/params reais do TOOL_MAP.

**38. Cabeçalho do tool-registry.yaml aponta consumidor errado** (MCP)
- Evidência: `tool-registry.yaml:7-10` diz que é lido por `registry-loader.js`; grep retorna vazio. Consumidor real: `capability-detection.js:128-131`.
- Ação: Corrigir o comentário.

### Estrutura HEALTHY nesta camada (confirmado)
- **Squads:** 17 com squad.yaml válido; `validate:squad-schema:strict` 17 ok/0 fail; `validate:orqx-discipline` OK (0 verbos de execução); todos têm orqx; declared==filesystem; sem stubs (menor agente = 70 linhas).
- **Workflows:** 15 YAMLs todos válidos; greenfield-handler NÃO é órfão (alcançável via `sinapse build`); spec-pipeline/qa-loop wired via master-orchestrator.
- **Tasks:** 0 totalmente mortas (217 constam em registries).
- **MCP:** tools reais bem-exemplificados (git, github, context7, browser, supabase, exa, coderabbit); docker-gateway honestamente rotulado opt-in.

---

## Gates automáticos (baseline — verdes, não re-auditados)
- doctor: 12 PASS / 0 WARN / 0 FAIL / 4 INFO
- 8 lint guards: TODOS PASS
- ESLint PASS · tsc --noEmit PASS · suíte 11k+ testes PASS (exit 0)
> Observação: o gate verde dos lint guards LOCAIS contrasta com o workflow `lint-guards.yml` do GitHub Actions QUEBRADO (finding #2) — os scripts funcionam, o wrapper de CI não carrega.

---

## Recomendação de execução (ordem sugerida)
1. **Desbloquear divulgação (3 CRITICAL):** finding #1 (user-guide), #2 (lint-guards.yml), #7 (npx pacote).
2. **Onda de localização do instalador (#8,#9,#10,#11):** uma passada no wizard/i18n resolve 4 MAJOR juntos.
3. **Onda de links/docs (#19,#20,#21,#22,#24):** rodar o link-checker próprio e corrigir em lote.
4. **Fonte única de métrica (#18,#23,#33,#34,#35,#29):** adicionar `hooks` ao sync-counts.js + `validate:metrics` no CI — mata a família inteira de uma vez e previne regressão.
5. **Resto dos MAJOR/MINOR** conforme capacidade.