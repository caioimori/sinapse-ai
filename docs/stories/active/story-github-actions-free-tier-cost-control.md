---
status: Ready
owner: sprint-lead
executor: devops
quality_gate: architect
quality_gate_tools:
  - node
  - jest
  - js-yaml
  - github-cli
  - coderabbit
created: 2026-07-28
target_release: next
story_type: Deployment
secondary_types:
  - Security
---

# Story: Controle de custo do GitHub Actions no free tier

## Status

Ready

## Story

Como mantenedor do SINAPSE AI, quero reduzir execuções e minutos faturáveis
desnecessários do GitHub Actions, para manter o repositório dentro do free tier
sem remover ou enfraquecer validações de qualidade, segurança, constituição,
paridade, pós-merge e release.

## Contexto e evidência atual

O repositório já usa concorrência e alguns filtros, mas ainda mantém superfícies
caras ou cosméticas que podem ser acionadas sem necessidade:

- `macos-testing.yml` executa três jobs macOS e um job de relatório em mudanças
  de installer, binários, scripts e testes macOS tanto em PR quanto em push para
  `main`.
- `install-matrix.yml` cria ao menos o job `Gate (release label check)` em todo
  evento de PR que toca seus paths, mesmo quando a matriz completa é pulada por
  ausência da label `release`.
- `ci.yml`, `codeql.yml`, `manifest-parity.yml`, `article-gates.yml`,
  `lint-guards.yml` e `test.yml` continuam sendo controles essenciais e devem
  permanecer ativos no escopo em que protegem o produto.
- `release-prepare.yml` e `semantic-release.yml` compõem o fluxo canônico de
  release manual/protegido e não podem ser removidos nem substituídos por um
  atalho automático.

Leitura remota feita em 2026-07-28 com `gh workflow list --all` confirmou quatro
workflows cosméticos em estado `disabled_manually`, cujos arquivos locais devem
ser preservados e documentados:

| Workflow remoto | Arquivo | Estado observado |
| --- | --- | --- |
| PR Labeling | `.github/workflows/pr-labeling.yml` | `disabled_manually` |
| Manage Stale Issues | `.github/workflows/stale.yml` | `disabled_manually` |
| Welcome New Contributors | `.github/workflows/welcome.yml` | `disabled_manually` |
| PR Size Check | `.github/workflows/pr-size-check.yml` | `disabled_manually` |

A proteção atual de `main`, lida pela API do GitHub em 2026-07-28, exige os
contextos `Validation Summary`, `Article VII (Metrics Accuracy)`,
`Article VIII (Mandatory Delegation)` e `Article XI (Conservative Default)`.
Filtros não podem fazer esses contextos desaparecerem de PRs protegidos.

## Outcome

PRs comuns deixam de consumir os três runners macOS dedicados e deixam de criar
jobs da Install Matrix. A entrega altera os gatilhos desses dois workflows e
adiciona ao publish real de `semantic-release.yml` um gate mínimo, fail-closed e
vinculado ao SHA candidato. Fora desse delta controlado, todos os gates
essenciais mantêm seus gatilhos, condições, nomes e falhas atuais.

## Escopo

- Restringir `macos-testing.yml` a `workflow_dispatch`; a execução de
  compatibilidade antes de release passa a ser um dispatch explícito de DevOps
  no ref/SHA candidato, sem execução automática em PR ou push comum para `main`.
- Restringir `install-matrix.yml` a `workflow_dispatch` e ao evento
  `pull_request:labeled`; somente a aplicação explícita da label `release`
  inicia a matriz, sem criar job em abertura, sincronização ou reabertura de PR.
- Associar toda evidência de macOS e Install Matrix ao `head_sha` efetivamente
  testado. Se o SHA mudar, a evidência anterior é inválida e DevOps deve remover
  e reaplicar a label `release` ou fazer novo dispatch antes de publicar.
- Alterar minimamente `.github/workflows/semantic-release.yml` para adicionar
  somente `permissions.checks: read` e, antes da publicação, um gate com
  `if: ${{ inputs.dry_run == false }}` que consulta os check-runs do
  `github.sha` exato e exige:
  `Gate Summary (24 combos + 3 clean + 3 upgrades)` e
  `macOS Validation Gate`, ambos com `status=completed` e
  `conclusion=success`. Erro de API, ausência, estado pendente, conclusão
  diferente de `success` ou evidência de outro SHA bloqueiam o publish.
- Manter byte-a-byte inalterados `ci.yml`, `codeql.yml`,
  `manifest-parity.yml`, `article-gates.yml`, `lint-guards.yml`, `test.yml` e
  `release-prepare.yml`. Em `semantic-release.yml`, preservar byte-a-byte todo
  conteúdo fora da permissão e do gate de publish explicitamente autorizados.
- Atualizar `.github/workflows/README.md` com a política de custo, gatilhos
  vigentes, os quatro workflows cosméticos pausados remotamente e o procedimento
  de execução/reativação sob autoridade de DevOps.
- Criar validação determinística dos eventos, labels e SHA dos dois workflows e
  uma guarda de diff/contrato que falhe se a implementação alterar os sete
  workflows invariantes ou exceder o delta controlado de Semantic Release.
- Registrar baseline autoritativo de runs/jobs e, quando a API permitir, minutos
  de runner e minutos faturáveis; calcular a economia mínima por PR comum a
  partir dos jobs que deixam deterministicamente de ser criados, sem apresentar
  duração de job como minutos faturáveis.

## Fora de escopo

- Excluir workflows ou mover arquivos ativos para `archived/`.
- Desabilitar CI, CodeQL relevante, Manifest Parity, Constitution Article Gates,
  Lint Guards, pós-merge smoke ou releases.
- Otimizar paths, jobs ou condições de `ci.yml`, `codeql.yml`,
  `manifest-parity.yml`, `article-gates.yml`, `lint-guards.yml`, `test.yml`,
  `release-prepare.yml` ou qualquer trecho não autorizado de
  `semantic-release.yml`; qualquer otimização adicional exige story própria com
  fechamento de dependências.
- Alterar branch protection, secrets, environments, permissões de publicação,
  política SemVer ou autoridade exclusiva de DevOps.
- Reativar, desabilitar ou editar estado remoto de workflow nesta story sem
  autorização externa específica.
- Disparar `semantic-release.yml` com `dry_run=false`, publicar pacote ou usar
  uma release real como teste do gate.
- Trocar testes por execução local não auditável ou considerar `skipped` sem
  contexto como evidência suficiente de proteção.

## Acceptance Criteria

- [ ] **AC1 — PR comum sem runners caros:** Given um PR sem aplicação explícita
  da label `release`, When ele é aberto, sincronizado ou reaberto, Then
  `macos-testing.yml` e `install-matrix.yml` não criam run nem job.
- [ ] **AC2 — execução explícita de macOS:** Given uma necessidade de
  compatibilidade macOS, When DevOps dispara manualmente o workflow ou o aciona
  pelo fluxo explícito de release, Then Intel, Apple Silicon e recuperação
  continuam cobertos e o resultado fica associado ao SHA testado.
- [ ] **AC3 — matriz vinculada ao candidato:** Given a aplicação da label
  `release` ou um dispatch manual, When a Install Matrix termina, Then as 24
  combinações suportadas, três instalações limpas e três upgrades continuam
  sendo exigidos e a evidência registra o `head_sha` testado; Given um commit
  posterior, When o gate de publish real consulta os check-runs do `github.sha`,
  Then a evidência do SHA anterior não satisfaz o gate e é necessário
  remover/reaplicar a label ou fazer novo dispatch no SHA atual.
- [ ] **AC4 — CI e checks obrigatórios preservados:** Given o diff da
  implementação e um PR para `main`, When a guarda de contrato e os checks de
  proteção são avaliados, Then `ci.yml` e `article-gates.yml` não possuem
  alteração e `Validation Summary`, Article VII, Article VIII e Article XI
  aparecem com seus nomes atuais e conclusão autoritativa.
- [ ] **AC5 — gates essenciais como invariantes:** Given o diff final, When a
  validação determinística roda, Then `ci.yml`, `codeql.yml`,
  `manifest-parity.yml`, `article-gates.yml`, `lint-guards.yml`, `test.yml` e
  `release-prepare.yml` permanecem byte-a-byte inalterados; em
  `semantic-release.yml`, somente `permissions.checks: read` e o gate de publish
  descrito no escopo podem mudar, e qualquer outro delta falha esta story.
- [ ] **AC6 — gatilhos testados:** Given uma tabela versionada de eventos, labels
  e SHAs, When a validação determinística é executada, Then prova zero run/job
  dos dois workflows em PR comum, execução da matriz somente em
  `workflow_dispatch` ou aplicação explícita de `release`, execução de macOS
  somente em `workflow_dispatch` e bloqueio fail-closed do publish quando os dois
  check-runs exigidos não pertencem ao SHA candidato e não estão
  `completed/success`.
- [ ] **AC7 — CodeQL preservado:** Given o diff final, When a guarda de contrato
  roda, Then `codeql.yml` permanece byte-a-byte inalterado, incluindo análises
  `javascript-typescript` e `actions`, schedule e dispatch de contingência.
- [ ] **AC8 — pós-merge e release preservados:** Given o diff final, When a
  guarda de contrato roda, Then `test.yml` e `release-prepare.yml` permanecem
  byte-a-byte inalterados e `semantic-release.yml` difere somente por
  `checks: read` e pelo gate fail-closed anterior ao publish real; Given
  `dry_run=true`, Then o gate de compatibilidade não é exigido e nenhum publish
  ocorre; nenhum release, publicação ou alteração de environment é executado
  como validação desta story.
- [ ] **AC9 — workflows cosméticos documentados:** Given a documentação de
  Actions, When ela é revisada, Then lista exatamente PR Labeling, Manage Stale
  Issues, Welcome New Contributors e PR Size Check como
  `disabled_manually` observado em 2026-07-28, preserva seus YAMLs locais e deixa
  claro que somente DevOps pode alterar esse estado remoto.
- [ ] **AC10 — economia demonstrável agora:** Given a janela-base anterior e a
  matriz determinística de eventos, When os dados são apurados, Then o relatório
  separa runs, jobs, minutos de runner e minutos faturáveis disponíveis na API,
  demonstra que o novo contrato cria zero jobs macOS/Install Matrix em PR comum
  e calcula uma redução mínima positiva sem converter duração bruta em
  faturamento; a observação pós-merge é acompanhamento operacional, não bloqueio
  temporal para concluir a implementação.
- [ ] **AC11 — rollback comprovável:** Given falso negativo, check obrigatório
  ausente, release bloqueada ou regressão de cobertura, When o rollback é
  aplicado, Then os gatilhos/filtros anteriores são restaurados por revert
  revisável, os workflows essenciais são disparados manualmente no SHA afetado,
  os quatro contextos de branch protection voltam a concluir e nenhuma release
  prossegue antes do verde autoritativo.
- [ ] **AC12 — qualidade da mudança:** Given o diff final, When lint, typecheck,
  testes, parsing de todos os YAMLs ativos, validação de pins e gates focados são
  executados, Then todos passam; o projeto não define script `build`, portanto
  esse gate é registrado como não aplicável; nenhum workflow essencial, release
  ou YAML cosmético preservado foi removido.

## Tasks / Subtasks

### T1 — Capturar baseline e contrato atual (AC: 4, 9, 10)

- `task_id`: `T1`
- `depends_on`: `[]`
- `owner`: `devops`
- `command_or_tool`: GitHub CLI/API somente leitura + inventário local
- `timeout_ms`: `120000`
- `max_attempts`: `2`
- `acceptance`: registrar branch protection, estado dos workflows, runs/jobs e
  minutos disponíveis da janela-base, documentando indisponibilidade da API sem
  inferir minutos faturáveis apenas por duração.
- `rollback`: não aplicável; tarefa somente leitura.

### T2 — Restringir macOS e Install Matrix (AC: 1, 2, 3)

- `task_id`: `T2`
- `depends_on`: `[T1]`
- `owner`: `devops`
- `command_or_tool`: editar e validar
  `.github/workflows/macos-testing.yml` e
  `.github/workflows/install-matrix.yml`
- `timeout_ms`: `180000`
- `max_attempts`: `2`
- `acceptance`: PR comum cria zero jobs desses workflows; execução explícita
  preserva toda a cobertura e registra o SHA testado; novo SHA exige nova
  aplicação explícita da label ou novo dispatch.
- `rollback`: restaurar os blocos `on:` e gates anteriores a partir do diff da
  story; disparar manualmente ambos os workflows no SHA afetado.

### T3 — Congelar invariantes e proteger o publish (AC: 3–8)

- `task_id`: `T3`
- `depends_on`: `[T1]`
- `owner`: `devops`
- `command_or_tool`: editar minimamente `semantic-release.yml`; snapshot/hash e
  validação de delta dos contratos essenciais
- `timeout_ms`: `180000`
- `max_attempts`: `2`
- `acceptance`: sete workflows permanecem byte-a-byte invariantes; o delta de
  `semantic-release.yml` contém somente `checks: read` e um gate anterior ao
  publish com `dry_run=false`, que consulta os check-runs do `github.sha` exato
  e aceita apenas os dois nomes exigidos em `completed/success`; erro, ausência,
  pending, failure ou SHA divergente bloqueiam.
- `rollback`: bloquear qualquer release, reverter o delta controlado de
  `semantic-release.yml` junto com os gatilhos desta story e restaurar os
  triggers amplos; publicação só volta a ser autorizada após os dois gates
  verdes no SHA candidato e revisão do rollback por DevOps.

### T4 — Criar fitness function de eventos, labels e SHA (AC: 1–8)

- `task_id`: `T4`
- `depends_on`: `[T2, T3]`
- `owner`: `developer`
- `command_or_tool`: teste determinístico no padrão existente do repositório
- `timeout_ms`: `300000`
- `max_attempts`: `3`
- `acceptance`: fixtures cobrem abertura, sincronização, reabertura, aplicação
  de label, dispatch, mudança de SHA, erro/ausência/pending/failure de check-run
  e `dry_run` true/false; qualquer run/job caro em PR comum, evidência aceita
  para SHA obsoleto ou publish real sem os dois gates verdes falha o teste.
- `rollback`: reverter teste e implementação em conjunto; nunca ajustar a
  expectativa para aceitar perda de gate.

### T5 — Atualizar documentação operacional (AC: 2, 3, 9, 10, 11)

- `task_id`: `T5`
- `depends_on`: `[T2, T3]`
- `owner`: `devops`
- `command_or_tool`: editar `.github/workflows/README.md`
- `timeout_ms`: `120000`
- `max_attempts`: `2`
- `acceptance`: documentação reflete os gatilhos implementados, os quatro estados
  remotos observados, nova execução após mudança de SHA, medição, autoridade de
  DevOps e rollback.
- `rollback`: restaurar a seção anterior junto com o rollback dos workflows,
  sem apagar o registro histórico dos estados observados.

### T6 — Executar validação local e revisão (AC: 6, 12)

- `task_id`: `T6`
- `depends_on`: `[T4, T5]`
- `owner`: `architect`
- `command_or_tool`: lint, typecheck, testes, parser YAML, pin validation, testes
  focados, guarda de invariantes e CodeRabbit
- `timeout_ms`: `1800000`
- `max_attempts`: `3`
- `acceptance`: todos os gates verdes, zero workflow essencial removido e
  build registrado como não aplicável por ausência de script e relatório
  explícito de qualquer verificação externa ainda pendente.
- `rollback`: devolver para T2/T4; após três tentativas, restaurar os triggers
  originais dos dois workflows e escalar o desenho.

### T7 — Verificar PR e estado remoto sem publicar (AC: 3, 4, 8–11)

- `task_id`: `T7`
- `depends_on`: `[T6]`
- `owner`: `devops`
- `command_or_tool`: PR protegido + GitHub Actions/API com leitura posterior
- `timeout_ms`: `3600000`
- `max_attempts`: `2`
- `acceptance`: checks obrigatórios concluem no PR, dispatches explícitos rodam
  no SHA correto, os dois check-runs exigidos existem no SHA candidato e os
  workflows cosméticos permanecem pausados; `semantic-release.yml` não é
  disparado com `dry_run=false` e nenhuma publicação ocorre nesta verificação.
- `rollback`: revert do PR ou PR corretivo, dispatch dos gates essenciais no SHA
  afetado e bloqueio de release até recuperação.

## Dev Notes

### Upfront Spec

**Intent:** reduzir custo evitável do GitHub Actions sem enfraquecer merge,
pós-merge ou publicação. A mudança abrange os gatilhos de `macos-testing.yml` e
`install-matrix.yml` e o menor gate necessário em `semantic-release.yml` para
impedir publish real sem evidência verde no SHA exato, além de testes e
documentação.

**Constraints:**

- Sete workflows essenciais listados no AC5 são invariantes byte-a-byte;
  `semantic-release.yml` aceita somente a permissão `checks: read` e o gate de
  publish explicitamente descrito.
- Apenas `@devops` executa operações remotas, PR, release ou publicação.
- Evidência de matriz/macOS só é válida para o SHA registrado; commit posterior
  exige nova ativação explícita.
- Nenhum workflow ou arquivo cosmético é removido, reativado ou desabilitado.

**Acceptance Criteria Summary:** PR comum cria zero run/job dos dois workflows
caros; dispatch e aplicação explícita da label `release` preservam cobertura e
registram o SHA testado; o publish real consulta o `github.sha` exato e falha
fechado salvo se os dois check-runs nomeados estiverem `completed/success`;
testes congelam sete workflows e permitem somente o delta controlado de release.

**Key Files:**

- `.github/workflows/macos-testing.yml` — compatibilidade macOS sob dispatch.
- `.github/workflows/install-matrix.yml` — matriz completa sob label/dispatch.
- `.github/workflows/semantic-release.yml` — publish real bloqueado pelos dois
  check-runs verdes no SHA exato.
- `tests/ci/github-workflows-syntax.test.js` — padrão existente de validação de
  workflows e ponto inicial para a fitness function.
- `.github/workflows/README.md` — contrato operacional e política de custo.

`story_type_classification`: `critical`

`active_hint`: `Think carefully and step-by-step — this problem is harder than it looks`

### Fontes e contratos observados

- O diretório de automação, a separação entre PR gates, manutenção e releases,
  e a regra de que branch protection é a fonte de verdade estão em
  [`.github/workflows/README.md`](../../../.github/workflows/README.md).
- O CI já usa `dorny/paths-filter`, mantém `Validation Summary` agregado e
  diferencia código, testes, configuração, stories e docs
  [`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml).
- Os contextos e a finalidade dos Articles VII, VIII e XI estão documentados em
  [`docs/pt/architecture/article-gates.md`](../../pt/architecture/article-gates.md).
- O pós-merge especializado roda somente em push relevante para `main` e contém
  security audit, build, integração, performance e summary bloqueante
  [`.github/workflows/test.yml`](../../../.github/workflows/test.yml).
- O fluxo canônico de release em duas fases e seu rollback forward-only estão em
  [`docs/guides/release-process.md`](../../guides/release-process.md).
- A story anterior de modernização de Actions preservou pins imutáveis, CodeQL
  v4 e os workflows `.disabled` como histórico
  [`docs/stories/github-actions-node24-and-links.story.md`](../github-actions-node24-and-links.story.md).

### Restrições técnicas

- Não editar gatilhos, paths, jobs, condições ou nomes dos sete workflows
  invariantes nesta story. Em `semantic-release.yml`, não alterar trigger,
  environment, publish, provenance, smoke, nomes ou passos existentes: somente
  `permissions.checks: read` e o novo gate imediatamente anterior ao caminho de
  publish real são autorizados.
- Um `skipped` só é aceitável quando o contexto aparece e a branch protection o
  aceita de forma observada; ausência ou `pending` não é sucesso.
- O evento `labeled` testa o SHA do momento. Se houver novos commits, a
  documentação e o gate de release devem exigir novo dispatch ou nova ativação
  explícita antes de publicar; check-run de outro SHA nunca satisfaz o gate.
- A consulta de check-runs usa o `github.sha` do próprio dispatch de Semantic
  Release. `set -euo pipefail` ou mecanismo equivalente deve tornar erro de API,
  parse ou comando uma falha bloqueante; somente os dois nomes exatos em
  `status=completed` e `conclusion=success` permitem continuar.
- O gate é condicionado a `inputs.dry_run == false`: dry-run permanece
  diagnóstico e não publica, enquanto o caminho real nunca pode contornar a
  verificação.
- Actions de terceiros continuam fixadas por SHA completo e com permissões
  mínimas. Não há nova dependência, secret, API pública ou modelo de dados nesta
  story.
- Estado remoto observado é informativo. Alterar enable/disable, branch
  protection, release ou publicação pertence a DevOps e requer autoridade
  externa própria.

## Plano de validação

1. Parsear todos os YAMLs ativos e validar todos os `uses:` por SHA imutável.
2. Executar a fitness function contra a tabela de eventos/labels/SHAs e contra
   fixtures de check-run ausente, pending, failure, erro de API, SHA divergente
   e `completed/success`.
3. Rodar lint, typecheck, testes focados, suíte completa e build.
4. Registrar `build` como não aplicável se o script continuar ausente.
5. Inspecionar o diff e comprovar sete workflows essenciais byte-a-byte
   inalterados; em `semantic-release.yml`, aceitar somente `checks: read` e o
   gate de publish real autorizado.
6. Em PR de validação, observar os quatro contextos obrigatórios e os workflows
   relevantes até conclusão.
7. Disparar macOS e Install Matrix explicitamente no SHA candidato e confirmar
   os dois nomes de check-run no SHA exato, sem disparar Semantic Release com
   `dry_run=false`.
8. Registrar baseline, projeção mínima e disponibilidade de runs, jobs, minutos
   de runner e minutos faturáveis na API; acompanhar a janela pós-merge sem
   bloquear o fechamento técnico da implementação.

## Riscos e controles

| Risco | Controle obrigatório |
| --- | --- |
| Publicar com evidência de outro commit | Consultar somente check-runs do `github.sha` exato; não aceitar artefato, nome ou resultado de outro SHA |
| API falhar e o workflow seguir | Gate fail-closed: erro HTTP, paginação, parse, comando ou resposta inválida encerra o job antes do publish |
| Check ainda em execução ou ausente | Exigir ambos os nomes exatos com `status=completed` e `conclusion=success`; ausência ou pending bloqueiam |
| Dry-run virar caminho indireto de publicação | Preservar os `if:` existentes: gate adicional somente em `dry_run=false`, e dry-run continua sem publish |
| Delta de release ampliar permissões ou comportamento | Permitir apenas `checks: read` e o novo gate; teste de delta rejeita qualquer outra mudança |
| Rollback retirar proteção enquanto triggers caros continuam restritos | Bloquear releases, restaurar os triggers amplos e exigir os dois gates verdes no SHA atual antes de reautorizar publicação |

## Rollback

1. Bloquear release e registrar o SHA/regressão.
2. Disparar manualmente CI/gate essencial aplicável no SHA afetado.
3. Reverter em conjunto os gatilhos de macOS/Install Matrix e o delta controlado
   de `semantic-release.yml`, sem apagar arquivos ou executar publish.
4. Restaurar triggers amplos anteriores para priorizar cobertura e manter
   Semantic Release sem dispatch até revisão independente.
5. Confirmar por leitura posterior os quatro contextos obrigatórios e os dois
   check-runs de compatibilidade em `completed/success` no SHA candidato.
6. Somente DevOps pode reautorizar o publish depois da recuperação verde; a
   ausência temporária do gate automático nunca equivale a autorização.
7. Manter os quatro workflows cosméticos no estado remoto observado; qualquer
   reativação é decisão separada de DevOps.

## CodeRabbit Integration

### Story Type Analysis

- **Primary Type:** Deployment
- **Secondary Type:** Security
- **Complexity:** High — altera vários contratos de CI, runners com
  multiplicadores distintos, branch protection e gate de release.

### Specialized Agent Assignment

- **Primary Agents:** `@developer`, `@devops`
- **Supporting Agents:** `@quality-gate`

### Quality Gate Tasks

- [ ] **Pre-Commit (`@developer`):** revisar mudanças não commitadas com o
  comando canônico de `core-config.yaml`.
- [ ] **Pre-PR (`@devops`):** revisar contra `main`, validar checks obrigatórios,
  pins, permissões e matriz de eventos/paths.
- [ ] **Pre-Deployment (`@devops`):** confirmar Install Matrix e macOS no SHA da
  release antes de qualquer publicação.

### Focus Areas

- Preservação de branch protection e semântica fail-closed.
- Falsos negativos em filtros de path e label.
- Associação de evidência ao SHA correto.
- Gate de publish real exige os dois check-runs exatos em `completed/success`;
  erro, ausência, pending e failure bloqueiam.
- Permissões mínimas, pins imutáveis e ausência de secrets.
- Rollback sem remoção de workflows ou publicação.

### Self-Healing Configuration

- **Primary Agent:** `@developer`
- **Mode:** light
- **Max Iterations:** 2
- **Timeout:** 15 minutos
- **Severity Filter:** CRITICAL
- **Behavior:** CRITICAL pode receber correção automática dentro do escopo;
  HIGH é documentado para revisão; MEDIUM/LOW não ampliam automaticamente a
  mudança.

## Story Draft Checklist

| Category | Status | Evidence |
| --- | --- | --- |
| Goal & Context Clarity | PASS | Outcome, escopo, fora de escopo e valor explícitos |
| Technical Implementation Guidance | PASS | Dois workflows de gatilho, um delta mínimo de publish e sete invariantes identificados |
| Reference Effectiveness | PASS | Fontes locais específicas e evidência remota datada |
| Self-Containment Assessment | PASS | SHA exato, nomes dos checks e semântica fail-closed explícitos |
| Testing Guidance | PASS | Casos success/absence/pending/failure/API/SHA/dry-run cobertos |
| CodeRabbit Integration | PASS | Tipo, agentes, gates, foco e self-healing definidos |

## Validation Record

- **Date:** 2026-07-28
- **Validator:** `@product-lead` (Axis)
- **Verdict:** **GO — Ready for implementation**
- **Scope:** PASS — após o QA REJECT de escopo, a story autoriza explicitamente
  dois workflows de gatilho e o delta mínimo de `semantic-release.yml`
  (`checks: read` + gate de publish); sete workflows permanecem invariantes e
  todo o restante de Semantic Release é preservado.
- **Traceability:** PASS — contratos locais e estado remoto foram verificados
  contra os arquivos e a API do GitHub; os nomes exigidos são
  `Gate Summary (24 combos + 3 clean + 3 upgrades)` e
  `macOS Validation Gate`.
- **Testability:** PASS — eventos, labels, SHA, `dry_run` e estados
  success/absence/pending/failure/API error possuem resultados determinísticos.
- **Safety:** PASS — publish real falha fechado salvo se os dois check-runs do
  `github.sha` exato estiverem `completed/success`; nenhuma publicação integra a
  validação da story.
- **Authority:** PASS — `@devops` executa CI/CD e operações remotas;
  `@architect` realiza o gate independente; `@developer` apoia testes e revisão
  pre-commit.
- **Handoff:** `@devops`, com implementação local primeiro e PR/release somente
  sob os gates de autoridade aplicáveis.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-07-28 | 1.0 | Draft inicial | `@sprint-lead` |
| 2026-07-28 | 1.1 | Escopo reduzido, executor/gate corrigidos e validação GO | `@product-lead` |
| 2026-07-28 | 1.2 | Implementação local dos gatilhos, fitness test e runbook; validação remota pendente | `@developer` |
| 2026-07-28 | 1.3 | QA fix: SHA obrigatório/fail-closed e bloqueio de publicação pelos dois gates de compatibilidade | `@developer` |
| 2026-07-28 | 1.4 | Revalidação formal pós-QA REJECT: delta mínimo de Semantic Release autorizado e invariantes reconciliados | `@product-lead` |

## Dev Agent Record

### Agent Model Used

OpenAI Codex (GPT-5.6)

### Debug Log References

- `node <codex-config>/scripts/validate-architecture-first.cjs docs/sessions/2026-07/actions-free-tier-workflow.json --json`
- `npm run test:actions-cost-policy`
- `npx jest tests/ci/github-workflows-syntax.test.js --runInBand`
- `npx eslint scripts/test-actions-cost-policy.mjs`
- `npm run typecheck`
- `git diff --check`, guarda de sete workflows byte-a-byte invariantes e delta aprovado de `semantic-release.yml`
- A suíte YAML cobre 16 arquivos ativos com 33 assertions; o registro anterior de “33 workflows” foi corrigido.
- API de jobs confirmou os nomes reais `Gate Summary (24 combos + 3 clean + 3 upgrades)` e `macOS Validation Gate`.
- CodeRabbit: indisponível no WSL desta execução.

### Completion Notes

- `macos-testing.yml` agora é exclusivamente manual, exige `candidate_sha` de 40 caracteres, requer que ele seja o SHA do dispatch, valida o `HEAD` após checkout e associa artefatos, resumo e gate ao SHA validado.
- `install-matrix.yml` não reage a abertura, sincronização ou reabertura; dispatch exige `candidate_sha`, label `release` deriva o PR `head.sha`, e um job fail-closed valida formato/checkout antes de preservar 24 combinações, 3 instalações limpas e 3 upgrades.
- Publicação em `semantic-release.yml` agora exige `checks: read` e consulta os check-runs do `github.sha` exato, bloqueando erro de API, ausência, pending, falha ou evidência de outro SHA para `Gate Summary (24 combos + 3 clean + 3 upgrades)` e `macOS Validation Gate`. Dry-run permanece diagnóstico porque não publica.
- Fitness function passou para eventos, label, mudança de SHA, checkout exato, bloqueio de release, cobertura, pins, hashes de sete invariantes, delta controlado de Semantic Release e nomes dos quatro required checks.
- Baseline 2026-06-28..2026-07-28: 117 runs de macOS, 495 jobs de macOS e 117 runs de Install Matrix. O endpoint de billing retornou HTTP 404; minutos de runner/faturáveis não foram inferidos por duração.
- Redução mínima determinística por PR comum relevante: 4 jobs (3 runners macOS + antigo gate da Install Matrix), além dos dependentes evitados.
- Pendente sob autoridade de DevOps: PR protegido, leitura dos checks remotos e dispatch de macOS/Install Matrix no SHA candidato. Nenhuma release, mutação remota, commit ou push foi executado.

### File List

- `.github/workflows/macos-testing.yml`
- `.github/workflows/install-matrix.yml`
- `.github/workflows/semantic-release.yml`
- `.github/workflows/README.md`
- `scripts/test-actions-cost-policy.mjs`
- `package.json`
- `docs/sessions/2026-07/actions-free-tier-workflow.json`
- `docs/stories/active/story-github-actions-free-tier-cost-control.md`

## QA Results

Não iniciado.
