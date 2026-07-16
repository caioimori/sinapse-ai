---
status: InReview
owner: sprint-lead
executor: developer
quality_gate: quality-gate
created: 2026-07-16
target_release: next
---

# Story: Public product foundation

## Status

InReview

## Story

Como pessoa avaliando o SINAPSE AI pelo GitHub, quero encontrar uma vitrine
profissional, documentação confiável e um fluxo de contribuição previsível,
para entender o valor do produto, instalar com segurança e contribuir sem
depender de conhecimento interno dos mantenedores.

## Scope

- Reestruturar os READMEs PT-BR e EN como uma página de produto clara, visual
  e verificável, preservando paridade entre os idiomas.
- Corrigir metadados públicos, comandos, métricas, políticas de suporte e
  referências desatualizadas nas superfícies de entrada do repositório.
- Profissionalizar community health, templates e documentação de GitFlow,
  release e automações do GitHub.
- Simplificar ou corrigir workflows somente quando houver evidência de
  redundância, trigger incorreto, permissão excessiva ou documentação em drift.

## Acceptance Criteria

- [x] AC1: README PT-BR e EN apresentam a mesma proposta de valor, instalação
  canônica, arquitetura, capacidades, prova de qualidade e navegação pública.
- [x] AC2: Claims públicos usam as métricas medidas do framework e o comando
  `npx sinapse-ai@latest install`.
- [x] AC3: `SECURITY.md`, `CONTRIBUTING.md`, suporte e governança descrevem o estado
  atual do produto, sem versões ou processos históricos apresentados como atuais.
- [x] AC4: Issue/PR templates e documentação de workflows orientam contribuidores
  externos sem depender de regras internas ou links inexistentes.
- [x] AC5: GitFlows possuem responsabilidades claras para CI, PR, release e publish,
  com permissões mínimas e sem duplicação funcional injustificada.
- [x] AC6: Metadados do repositório no GitHub refletem 17 squads, 172 agentes,
  Claude Code + Codex e a instalação canônica.
- [x] AC7: Links, Markdown, Articles IV/VII, paridade, lint, typecheck e testes aplicáveis
  passam antes da entrega.
- [x] AC8: Nenhuma alteração preexistente do worktree original e nenhum path L1/L2
  protegido são modificados.

## Out of scope

- Alterar Constitution, agentes, squads, tasks ou a arquitetura protegida do framework.
- Inventar roadmap comercial, SLA, patrocinadores ou canais de suporte que não
  existam.
- Publicar uma nova versão npm sem mudança de runtime que justifique release.

## Validation Plan

1. Medir claims com os validadores do repositório.
2. Validar links e comandos canônicos em todas as superfícies alteradas.
3. Auditar YAML, triggers e permissões dos workflows modificados.
4. Executar gates de documentação, paridade e qualidade proporcionais ao escopo.

## Handoffs

- Brand/Design/Copy entrega hierarquia e narrativa para os READMEs.
- Product Ops entrega arquitetura documental e community health.
- DevOps entrega GitFlow e automações auditadas.
- Quality Gate valida claims, links, YAML e regressão.

## Dev Agent Record

- Worktree isolado criado a partir de `origin/main` para preservar alterações
  locais existentes no checkout principal.
- Auditorias públicas de produto, community health e GitHub Actions executadas
  antes da edição.
- Superfície pública e workflows ativos consolidados no worktree isolado.
- Release consolidado em duas fases: PR de preparação e publish manual protegido,
  sem publicar uma nova versão nesta story.
- O canal de release foi restrito a `main`; a branch remota `next` historicamente
  divergente permanece inativa e não participa mais do cálculo de versão.
- Uma copia isolada em `main` comprovou o preparo `1.27.0 -> 1.27.1`, o cabecalho
  canônico do changelog e o `prepare-release.mjs --check` verde.
- Instalacoes isoladas `claude-code`, `codex` e `both` confirmaram 172 agentes e
  37 skills por provider; React Bits e squad de animacoes foram encontrados no
  pacote gerado.
- Gates finais: docs 28/28, Article VII, paridade, 13/13 guards, lint sem erros,
  typecheck, actionlint 1.7.12, 26/26 YAMLs parseados e 9/9 suites com 224/224
  testes afetados aprovados.
- O follow-up final do CodeRabbit passou 3/3 suites e 22/22 testes focados, além
  de `bash -n` no teste de performance macOS e nova validação dos Articles IV/VII.
- A repetição remota expôs um teste legado de wall clock do `SquadMigrator` que
  oscilou para 509 ms contra 500 ms. Ele passou a usar o helper canônico
  `perfBudget(500)`, preservando o orçamento nominal e tolerando carga de runner.
- A suíte completa concluiu 423 suites e 11.730 testes aprovados; 16 suites e
  176 testes foram ignorados de forma declarada, com 8 itens `todo`. O Jest
  manteve o aviso conhecido de um worker encerrado de forma forçada, sem alterar
  o exit code verde.
- A cobertura completa passou os quatro ratchets: 38,89% statements, 35,92%
  branches, 39,06% lines e 42,38% functions.
- A rastreabilidade estrita do Artigo IV mapeou 7/7 arquivos de produto depois
  da correção de parsing de paths formatados com crases Markdown.
- O scanner de secrets agora distingue blobs binarios de texto sem confiar na
  extensao; um texto malicioso renomeado para `.png` continua sendo analisado.
- `npm pack --dry-run` gerou `sinapse-ai@1.27.0` com 4.348 arquivos, cerca de
  10,06 MB compactados e 31,47 MB descompactados. `npm audit --omit=dev`
  encontrou 0 vulnerabilidades; a auditoria completa registra somente o alerta
  `HIGH` conhecido de `undici`, restrito a dependências de desenvolvimento.
- O tarball foi instalado com `HOME`, cache npm e projeto isolados. A instalação
  padrão selecionou `both`, criou os contratos Claude/Codex, entregou React Bits
  nos dois providers, incluiu `squad-animations` e resolveu 17 squads, 172 agents
  e 1.348 task pointers pelo catálogo Codex instalado.
- O teste de latência do greeting foi alinhado ao budget real de 500 ms do
  pipeline; o limite anterior de 150 ms media apenas scheduling de timer e era
  instável sob coverage paralelo.
- A cobertura foi consolidada no CI principal: Node 22 mede e publica coverage;
  Node 20/24 executam compatibilidade sem gerar relatórios duplicados.
- As referências públicas de agentes e tech stack foram reconstruídas a partir
  das fontes canônicas, sem listas congeladas, benchmarks inventados ou versões
  de dependências divergentes do `package.json`.

## File List

- `.github/CODEOWNERS`
- `.github/DISCUSSION_TEMPLATE/ideas.yml`
- `.github/DISCUSSION_TEMPLATE/q-and-a.yml`
- `.github/DISCUSSION_TEMPLATE/show-and-tell.yml`
- `.github/DISCUSSION_TEMPLATE/troubleshooting.yml`
- `.github/FUNDING.yaml`
- `.github/ISSUE_TEMPLATE/1-bug-report.yml`
- `.github/ISSUE_TEMPLATE/2-feature-request.yml`
- `.github/ISSUE_TEMPLATE/3-squad-proposal.md`
- `.github/ISSUE_TEMPLATE/3-test-coverage.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/issue-labeler.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/PULL_REQUEST_TEMPLATE/agent_contribution.md`
- `.github/PULL_REQUEST_TEMPLATE/squad.md`
- `.github/PULL_REQUEST_TEMPLATE/task_contribution.md`
- `.github/workflows/archived/npm-publish.yml.disabled`
- `.github/workflows/archived/pro-integration.yml.disabled`
- `.github/workflows/archived/README.md`
- `.github/workflows/archived/release.yml.disabled`
- `.github/workflows/article-gates.yml`
- `.github/workflows/bob-integration.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/install-matrix.yml`
- `.github/workflows/install-matrix/run-provider-mode.js`
- `.github/workflows/lint-guards.yml`
- `.github/workflows/macos-testing.yml`
- `.github/workflows/manifest-parity.yml`
- `.github/workflows/pr-automation.yml`
- `.github/workflows/pr-labeling.yml`
- `.github/workflows/pr-size-check.yml`
- `.github/workflows/quarterly-gap-audit.yml`
- `.github/workflows/README.md`
- `.github/workflows/release-prepare.yml`
- `.github/workflows/semantic-release.yml`
- `.github/workflows/stale.yml`
- `.github/workflows/test.yml`
- `.github/workflows/welcome.yml`
- `.releaserc.json`
- `.sinapse-ai/data/entity-registry.yaml`
- `.sinapse-ai/git-hooks/lib/staged-secret-scan.js`
- `.sinapse-ai/install-manifest.yaml`
- `bin/commands/help.js`
- `bin/utils/staged-secret-scan.js`
- `CHANGELOG.md`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `docs/assets/sinapse-ai-github-hero.png`
- `docs/agent-reference-guide.md`
- `docs/framework/roadmap.md`
- `docs/framework/tech-stack.md`
- `docs/getting-started.md`
- `docs/guides/contributing-squads.md`
- `docs/guides/agent-reference.md`
- `docs/guides/getting-started.md`
- `docs/guides/gitflow.md`
- `docs/guides/installation-troubleshooting.md`
- `docs/guides/README.md`
- `docs/guides/release-process.md`
- `docs/guides/squads-guide.md`
- `docs/guides/squads-overview.md`
- `docs/guides/user-guide.md`
- `docs/installation/faq.md`
- `docs/installation/linux.md`
- `docs/installation/macos.md`
- `docs/installation/npx-cache.md`
- `docs/installation/npx-install.md`
- `docs/installation/README.md`
- `docs/installation/troubleshooting.md`
- `docs/installation/uninstallation.md`
- `docs/installation/v4-quick-start.md`
- `docs/installation/windows.md`
- `docs/pt/architecture/tech-stack.md`
- `docs/pt/agent-reference-guide.md`
- `docs/pt/framework/tech-stack.md`
- `docs/pt/getting-started.md`
- `docs/pt/how-to-contribute-with-pull-requests.md`
- `docs/pt/guides/contributing-squads.md`
- `docs/pt/guides/installation-troubleshooting.md`
- `docs/pt/guides/squads-guide.md`
- `docs/pt/guides/squads-overview.md`
- `docs/pt/guides/user-guide.md`
- `docs/pt/installation/faq.md`
- `docs/pt/installation/linux.md`
- `docs/pt/installation/macos.md`
- `docs/pt/installation/README.md`
- `docs/pt/installation/troubleshooting.md`
- `docs/pt/installation/v4-quick-start.md`
- `docs/pt/installation/windows.md`
- `docs/pt/npx-install.md`
- `docs/pt/roadmap.md`
- `docs/pt/troubleshooting.md`
- `docs/pt/uninstallation.md`
- `docs/README.md`
- `docs/sinapse-agent-flows/squad-creator-system.md`
- `docs/stories/public-product-foundation.story.md`
- `docs/troubleshooting.md`
- `GOVERNANCE.md`
- `LICENSE`
- `NOTICE.md`
- `package.json`
- `package-lock.json`
- `packages/sinapse-install/README.md`
- `README.en.md`
- `README.md`
- `ROADMAP.md`
- `scripts/prepare-release.mjs`
- `scripts/generate-install-manifest.js`
- `scripts/release-readiness.js`
- `scripts/validate-article-iv.js`
- `scripts/validate-article-vii.js`
- `scripts/validate-install-docs.js`
- `scripts/validate-manifest.js`
- `scripts/validate-no-external-refs.js`
- `SECURITY.md`
- `SUPPORT.md`
- `tests/cli/validate-publish.test.js`
- `tests/installer/uninstall-completeness.test.js`
- `tests/installer/generate-manifest.test.js`
- `tests/integration/onboarding-smoke.test.js`
- `tests/macos/MANUAL-TESTING-GUIDE.md`
- `tests/macos/README.md`
- `tests/macos/test-apple-silicon-installation.sh`
- `tests/macos/test-intel-installation.sh`
- `tests/macos/test-local-package-installation.sh`
- `tests/macos/test-performance.sh`
- `tests/security/secret-scanning.test.js`
- `tests/unit/validate-article-iv.test.js`
- `tests/unit/generate-greeting.test.js`
- `tests/unit/squad/squad-migrator.test.js`
- `tests/scripts/release-readiness.test.js`
- `tests/scripts/validate-install-docs.test.js`
- `tests/scripts/validate-no-external-refs.test.js`
