---
status: InReview
owner: sprint-lead
executor: developer
quality_gate: quality-gate
created: 2026-07-16
target_release: next
---

# Story: GitHub Actions Node 24 and public link hardening

## Status

InReview

## Story

Como mantenedor do SINAPSE AI, quero workflows ativos em runtimes suportados e
documentacao sem links quebrados, para que o repositorio publico permaneca
seguro, confiavel e livre de alertas operacionais conhecidos.

## Scope

- Atualizar actions ativas para as releases oficiais mais recentes verificadas
  em 2026-07-16, sempre com SHA imutavel e major version documentada.
- Migrar CodeQL para v4 e actions JavaScript elegiveis para Node 24.
- Corrigir os tres links quebrados reportados pela varredura inicial da CI em
  343 arquivos Markdown.
- Normalizar os criterios legados das tres stories recentes que ainda geravam
  avisos no validador Given/When/Then.
- Preservar workflows `.disabled` como historico inativo.

## Acceptance Criteria

- [x] AC1: Given as tags oficiais verificadas, When os pins ativos sao
  inspecionados, Then todos os SHAs correspondem aos commits dessas tags.
- [x] AC2: Given as actions JavaScript ativas, When seus metadados sao lidos,
  Then cada runtime e `node24` ou `composite`.
- [x] AC3: Given o workflow de analise de seguranca, When sua dependencia e
  inspecionada, Then CodeQL usa a linha v4 suportada.
- [x] AC4: Given os documentos Markdown publicos, When o verificador de links
  e executado, Then ele encontra 0 links quebrados.
- [x] AC5: Given os workflows ativos, When YAML, pinning e scripts v9 sao
  validados, Then todos passam sem referencia mutavel ou incompatibilidade.
- [x] AC6: Given o PR pronto, When release-readiness, CI e CodeQL terminam,
  Then todos passam antes da integracao.
- [x] AC7: Given o checkout original e os paths protegidos, When o diff e
  auditado, Then nenhum deles recebe alteracao desta story.
- [x] AC8: Given as stories recentes deste ciclo, When o validador estrito de
  criterios e executado, Then ele nao encontra formato legado.

## Out of scope

- Reativar ou modernizar workflows arquivados em `.github/workflows/archived/`.
- Alterar a logica de produto, instalacao ou release do framework.
- Substituir ferramentas de terceiros sem necessidade comprovada.

## Validation Plan

1. Resolver cada tag oficial para seu commit SHA e conferir `uses:` ativos.
2. Executar o verificador de links e exigir zero ocorrencias quebradas.
3. Parsear YAML, validar SHA pinning e executar os gates do framework.
4. Abrir PR, aguardar a matriz completa e validar os workflows em `main`.

## Updated Dependency Evidence

As 12 familias abaixo receberam novos pins. O inventario total de 16 refs
unicas tambem conta `init`, `autobuild` e `analyze` do CodeQL separadamente,
além de `actions/first-interaction` e `actions/labeler`, que já estavam atuais.

| Action | Release | Immutable SHA |
|---|---:|---|
| `actions/checkout` | v7.0.0 | `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` |
| `actions/setup-node` | v7.0.0 | `820762786026740c76f36085b0efc47a31fe5020` |
| `actions/setup-python` | v6.3.0 | `ece7cb06caefa5fff74198d8649806c4678c61a1` |
| `actions/github-script` | v9.0.0 | `3a2844b7e9c422d3c10d287c895573f7108da1b3` |
| `actions/stale` | v10.4.0 | `1e223db275d687790206a7acac4d1a11bd6fe629` |
| `actions/upload-artifact` | v7.0.1 | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` |
| `actions/download-artifact` | v8.0.1 | `3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c` |
| `codecov/codecov-action` | v7.0.0 | `fb8b3582c8e4def4969c97caa2f19720cb33a72f` |
| `dorny/paths-filter` | v4.0.2 | `7b450fff21473bca461d4b92ce414b9d0420d706` |
| `github/codeql-action` | v4.37.1 | `7188fc363630916deb702c7fdcf4e481b751f97a` |
| `gitleaks/gitleaks-action` | v3.0.0 | `e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e` |
| `pnpm/action-setup` | v6.0.9 | `0ebf47130e4866e96fce0953f49152a61190b271` |

## Dev Agent Record

- Releases e SHAs consultados diretamente nos repositorios oficiais das
  actions antes da edicao.
- Trabalho realizado em worktree isolado baseado no merge `641554cf`.
- Metadados oficiais confirmaram 16 refs de actions unicas ativas como `node24` ou
  `composite`; os 108 usos permanecem fixados a SHAs de 40 caracteres.
- Os inputs `with:` de 108/108 steps foram comparados aos metadados dos novos
  SHAs, sem chave removida ou input obrigatorio ausente.
- Links: 344 arquivos, 736 links validos e 0 links quebrados.
- Validacao local: ESLint sem warnings, 19/19 testes focados, 16/16 YAMLs,
  13/13 guards e release-readiness 11/11.
- O modo estrito de acceptance criteria passou 81/81 criterios em formato
  Given/When/Then, eliminando os 21 avisos legados deste ciclo.
- O PR remoto aprovou CodeQL v4, cobertura, Jest 20/24, macOS Intel e Apple
  Silicon, os smokes de macOS e Windows, além de todos os gates menores.

## File List

- `.github/workflows/article-gates.yml`
- `.github/workflows/bob-integration.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/install-matrix.yml`
- `.github/workflows/lint-guards.yml`
- `.github/workflows/macos-testing.yml`
- `.github/workflows/manifest-parity.yml`
- `.github/workflows/pr-labeling.yml`
- `.github/workflows/quarterly-gap-audit.yml`
- `.github/workflows/release-prepare.yml`
- `.github/workflows/semantic-release.yml`
- `.github/workflows/stale.yml`
- `.github/workflows/test.yml`
- `.github/workflows/welcome.yml`
- `docs/pt/community.md`
- `docs/pt/contributing.md`
- `docs/sinapse-agent-flows/data-engineer-system.md`
- `docs/stories/public-product-foundation.story.md`
- `docs/stories/snpsai-readme-wordmark.story.md`
- `docs/stories/story-canonical-install-and-public-readme.story.md`
- `docs/stories/github-actions-node24-and-links.story.md`
- `scripts/research/generate-react-bits-catalog.mjs`
- `tests/unit/track-selo-handoff.test.js`
- `tests/unit/validate-codex-native.test.js`
