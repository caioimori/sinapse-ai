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
profissional, documentacao confiavel e um fluxo de contribuicao previsivel,
para entender o valor do produto, instalar com seguranca e contribuir sem
depender de conhecimento interno dos mantenedores.

## Scope

- Reestruturar os READMEs PT-BR e EN como uma pagina de produto clara, visual
  e verificavel, preservando paridade entre os idiomas.
- Corrigir metadados publicos, comandos, metricas, politicas de suporte e
  referencias desatualizadas nas superficies de entrada do repositorio.
- Profissionalizar community health, templates e documentacao de GitFlow,
  release e automacoes do GitHub.
- Simplificar ou corrigir workflows somente quando houver evidencia de
  redundancia, trigger incorreto, permissao excessiva ou documentacao em drift.

## Acceptance Criteria

- [x] AC1: README PT-BR e EN apresentam a mesma proposta de valor, instalacao
  canonica, arquitetura, capacidades, prova de qualidade e navegacao publica.
- [x] AC2: Claims publicos usam as metricas medidas do framework e o comando
  `npx sinapse-ai@latest install`.
- [x] AC3: `SECURITY.md`, `CONTRIBUTING.md`, suporte e governanca descrevem o estado
  atual do produto, sem versoes ou processos historicos apresentados como atuais.
- [x] AC4: Issue/PR templates e documentacao de workflows orientam contribuidores
  externos sem depender de regras internas ou links inexistentes.
- [x] AC5: GitFlows possuem responsabilidades claras para CI, PR, release e publish,
  com permissoes minimas e sem duplicacao funcional injustificada.
- [x] AC6: Metadados do repositorio no GitHub refletem 17 squads, 172 agentes,
  Claude Code + Codex e a instalacao canonica.
- [x] AC7: Links, Markdown, Article VII, paridade, lint, typecheck e testes aplicaveis
  passam antes da entrega.
- [x] AC8: Nenhuma alteracao preexistente do worktree original e nenhum path L1/L2
  protegido sao modificados.

## Out of scope

- Alterar Constitution, agentes, squads, tasks ou runtime do framework.
- Inventar roadmap comercial, SLA, patrocinadores ou canais de suporte que nao
  existam.
- Publicar uma nova versao npm sem mudanca de runtime que justifique release.

## Validation Plan

1. Medir claims com os validadores do repositorio.
2. Validar links e comandos canonicos em todas as superficies alteradas.
3. Auditar YAML, triggers e permissoes dos workflows modificados.
4. Executar gates de documentacao, paridade e qualidade proporcionais ao escopo.

## Handoffs

- Brand/Design/Copy entrega hierarquia e narrativa para os READMEs.
- Product Ops entrega arquitetura documental e community health.
- DevOps entrega GitFlow e automacoes auditadas.
- Quality Gate valida claims, links, YAML e regressao.

## Dev Agent Record

- Worktree isolado criado a partir de `origin/main` para preservar alteracoes
  locais existentes no checkout principal.
- Auditorias publicas de produto, community health e GitHub Actions executadas
  antes da edicao.
- Superficie publica e workflows ativos consolidados no worktree isolado.
- Release consolidado em duas fases: PR de preparacao e publish manual protegido,
  sem publicar uma nova versao nesta story.
- O canal de release foi restrito a `main`; a branch remota `next` historicamente
  divergente permanece inativa e nao participa mais do calculo de versao.
- Uma copia isolada em `main` comprovou o preparo `1.27.0 -> 1.27.1`, o cabecalho
  canonico do changelog e o `prepare-release.mjs --check` verde.
- Instalacoes isoladas `claude-code`, `codex` e `both` confirmaram 172 agentes e
  37 skills por provider; React Bits e squad de animacoes foram encontrados no
  pacote gerado.
- Gates finais: docs 28/28, Article VII, paridade, 13/13 guards, lint sem erros,
  typecheck, actionlint 1.7.12, 13/13 suites e 247/247 testes afetados.
- A rastreabilidade estrita do Artigo IV mapeou 6/6 arquivos de produto depois
  da correcao de parsing de paths formatados com crases Markdown.
- O scanner de secrets agora distingue blobs binarios de texto sem confiar na
  extensao; um texto malicioso renomeado para `.png` continua sendo analisado.
- `npm pack --dry-run` gerou `sinapse-ai@1.27.0` com 4.348 arquivos e todos os
  artefatos obrigatorios; `npm audit --omit=dev` encontrou 0 vulnerabilidades.
- O run monolitico de Jest sobre 439 arquivos ficou ocioso sem resumo e foi
  interrompido. A cobertura proporcional foi concluida pelos testes afetados,
  validadores deterministas e instalacoes isoladas acima.

## File List

- `.github/CODEOWNERS`
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
- `bin/utils/staged-secret-scan.js`
- `CHANGELOG.md`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `docs/assets/sinapse-ai-github-hero.png`
- `docs/framework/roadmap.md`
- `docs/framework/tech-stack.md`
- `docs/getting-started.md`
- `docs/guides/contributing-squads.md`
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
- `docs/installation/windows.md`
- `docs/pt/architecture/tech-stack.md`
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
- `docs/pt/installation/windows.md`
- `docs/pt/npx-install.md`
- `docs/pt/roadmap.md`
- `docs/pt/troubleshooting.md`
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
- `scripts/release-readiness.js`
- `scripts/validate-article-iv.js`
- `scripts/validate-no-external-refs.js`
- `SECURITY.md`
- `SUPPORT.md`
- `tests/cli/validate-publish.test.js`
- `tests/security/secret-scanning.test.js`
- `tests/unit/validate-article-iv.test.js`
- `tests/scripts/release-readiness.test.js`
- `tests/scripts/validate-no-external-refs.test.js`
