---
status: Done
owner: sprint-lead
executor: developer
quality_gate: quality-gate
quality_gate_tools:
  - node
  - jest
  - isolated-install-fixtures
  - npm-pack
created: 2026-07-15
depends_on:
  - docs/stories/story-cross-provider-cli-quality.md
---

# Story: Catalogo SINAPSE-only sem duplicidade cross-provider

## User story

Como mantenedor do SINAPSE, quero remover residuos ativos de legado externo e eliminar
superficies duplicadas de agentes, skills e comandos, para que instalacoes novas
e existentes exponham somente o framework SINAPSE, com ativacao nativa e
semantica consistente no Codex e no Claude Code.

## Contexto e rastreabilidade

O inventario atual indica que o Codex pode descobrir a mesma skill SINAPSE por
`.agents/skills` e `.codex/skills`. Esses espelhos produzem entradas duplicadas
mesmo quando o conteudo e identico. Instalacoes historicas tambem podem conservar
artefatos de legado externo em superficies globais ou adapters antigos. A limpeza deve
distinguir fonte canonica, adapter nativo, compatibilidade legada e arquivo do
usuario: somente artefatos comprovadamente gerenciados pelo framework podem ser
removidos automaticamente.

No Codex, `.agents/skills` sera a superficie canonica de skills compartilhadas e
os agents TOML permanecerao adapters nativos finos. No Claude Code, agents,
commands e hooks nativos devem continuar resolvendo a mesma fonte canonica. A
remocao de duplicidade estrutural nao autoriza reduzir cobertura, apagar
customizacoes ou criar logica operacional concorrente nos adapters.

## Escopo

- Inventariar IDs e origens de agents, orquestradores, skills, comandos, aliases
  e tasks expostos por Codex e Claude Code.
- Registrar como evidencia a limpeza local, pontual e explicitamente autorizada
  pelo mantenedor, sem incorporar essa remocao ao comportamento do pacote publico.
- Garantir que o pacote distribuido seja SINAPSE-only: nenhum executavel, agent,
  skill, comando, hook, adapter, configuracao, dependencia ou codigo operacional
  de framework externo pode ser empacotado ou ativado.
- Consolidar as skills Codex em `.agents/skills`, eliminando o espelho gerenciado
  `.codex/skills` e qualquer geracao futura dessa superficie duplicada.
- Reconciliar somente superficies legadas do proprio SINAPSE, mediante ownership
  comprovado por manifesto SINAPSE, marcador gerado pelo SINAPSE ou equivalencia
  byte-a-byte com um artefato de uma versao publicada do SINAPSE.
- Manter adapters Claude Code funcionais e semanticamente equivalentes apos a
  limpeza.
- Adicionar validacao deterministica de unicidade, residuos externos, install,
  update, idempotencia e conteudo real do pacote npm.

## Acceptance criteria

- [x] **AC1 - Inventario canonico unico.** Given as fontes de core e squads,
  when o inventario e medido, then cada ID publico de agent, orquestrador, skill,
  comando e alias possui uma unica origem canonica e todos os targets existem;
  representacoes nativas documentadas nao sao contadas como entidades distintas.
- [x] **AC2 - Codex sem skill duplicada.** Given uma instalacao nova com Codex,
  when o catalogo nativo e descoberto, then cada skill SINAPSE aparece uma unica
  vez a partir de `.agents/skills`, nenhum espelho gerenciado permanece em
  `.codex/skills` e os agents TOML continuam resolvendo suas fontes reais.
- [x] **AC3 - Claude Code preservado.** Given a mesma fonte canonica, when uma
  instalacao nova ou atualizada seleciona Claude Code, then agents, commands,
  hooks e aliases Claude continuam resolviveis, sem dependencia de
  `.codex/skills` e sem conteudo operacional divergente.
- [x] **AC4 - Produto distribuido SINAPSE-only.** Given os arquivos rastreados e
  o tarball real produzido por `npm pack`, when os gates autorais e de pacote
  rodam, then `validate:no-external-refs` passa conforme sua allowlist explicita
  e governada, e o tarball nao contem nem ativa executavel, agent, skill, comando,
  hook, adapter, configuracao, dependencia ou codigo operacional de framework
  externo; toda excecao textual permitida e nao operacional, classificada e
  comprovadamente necessaria.
- [x] **AC5 - Migracao conservadora com ownership SINAPSE.** Given uma instalacao
  existente contendo espelhos legados do SINAPSE, arquivos customizados e
  artefatos de terceiros, when install/update roda, then remove, move ou substitui
  somente itens cujo ownership SINAPSE seja comprovado por manifesto SINAPSE,
  marcador gerado pelo SINAPSE ou equivalencia byte-a-byte com artefato de uma
  versao publicada do SINAPSE; preserva ou coloca em quarentena customizacoes
  divergentes; e apenas reporta artefatos de terceiros, sem altera-los. Nome de
  arquivo, path conhecido, allowlist de outro framework ou hash de conteudo externo
  nao constituem prova de ownership nem autorizacao de remocao.
- [x] **AC6 - Falha segura.** Given um artefato legado sem prova de ownership,
  when a reconciliacao avalia o item, then nao o remove, retorna diagnostico
  acionavel e nao executa limpeza recursiva fora das raizes explicitamente
  permitidas.
- [x] **AC7 - Idempotencia.** Given install ou update ja reconciliado, when a
  operacao roda novamente para Codex-only, Claude-only e ambos, then nao cria
  duplicatas, nao altera arquivos customizados e produz o mesmo catalogo
  resolvivel.
- [x] **AC8 - Comandos e aliases sem colisao.** Given todos os adapters, when a
  validacao de nomes roda, then IDs normalizados, aliases `$`, comandos Claude e
  ponteiros de tasks nao possuem colisao ambigua; aliases intencionais declaram
  explicitamente o mesmo target canonico.
- [x] **AC9 - Verdade do pacote.** Given o tarball produzido por `npm pack`, when
  instalado fora do monorepo, then clean install e update passam nos tres modos,
  o pacote nao contem o espelho `.codex/skills` nem residuos externos ativos e nao
  depende de arquivos presentes apenas no repositorio fonte.
- [x] **AC10 - Regressao bloqueada.** Given uma fixture com skill duplicada,
  target ausente, ID colidente ou residuo externo ativo, when os validadores rodam,
  then falham com provider, ID, origem e target; referencias legais e testes
  negativos nao produzem falso positivo.
- [x] **AC11 - Limpeza local autorizada e isolada.** Given as superficies globais
  desta maquina explicitamente autorizadas pelo mantenedor, when a limpeza pontual
  termina, then os artefatos externos autorizados nao sao mais descobertos e um
  inventario sem secrets registra paths e classificacoes; essa rotina nao integra
  nem influencia o install/update publico do SINAPSE.
- [x] **AC12 - Boundary.** Given o diff final, when o boundary test roda, then
  nenhum arquivo protegido L1/L2, constituicao, infraestrutura protegida ou
  `bin/sinapse*.js` foi criado, alterado, movido ou removido.
- [x] **AC13 - Publicacao verificavel.** Given AC1-AC12 concluidos, Quality Gate
  em PASS, release readiness aprovado e versao publica disponivel, when `@devops`
  executa a publicacao autorizada, then `sinapse-ai` e publicado com acesso
  publico, `npm view sinapse-ai version` corresponde a versao esperada e smoke
  tests de clean install e update a partir do registry passam para Codex-only,
  Claude-only e ambos.

## Tasks

- [x] **T1 - Baseline:** medir catalogos do repositorio, tarball e instalacoes
  globais, classificando duplicidade real, adapter intencional, referencia legal,
  teste negativo, customizacao e residuo ativo.
- [x] **T2 - Contrato de ownership:** definir allowlist/versionamento e regras de
  prova para artefatos gerenciados, incluindo comportamento fail-safe.
- [x] **T3 - Codex:** interromper a geracao do espelho `.codex/skills`, remover os
  arquivos gerenciados existentes e manter `.agents/skills` mais agents TOML como
  superficies nativas.
- [x] **T4 - Claude Code:** validar agents, commands, hooks e aliases contra a
  fonte canonica apos a consolidacao Codex.
- [x] **T5 - Migracao:** implementar cleanup idempotente para install/update,
  com fixtures de legado gerenciado, customizado e ambiguo.
- [x] **T6 - Legado externo:** remover residuos ativos autorizados e reforcar o gate que
  impede sua redistribuicao, sem apagar proveniencia legal ou evidencias de teste.
- [x] **T7 - Unicidade:** adicionar testes de IDs, aliases, targets, tasks e
  descoberta por provider com mensagens acionaveis.
- [x] **T8 - Pacote:** executar `npm pack`, inspecionar o tarball e testar clean
  install/update isolados para Codex-only, Claude-only e ambos.
- [x] **T9 - Quality Gate:** rodar lint, typecheck, testes, build aplicavel,
  validators de paridade/boundary e registrar evidencias sem operacao remota.
- [x] **T10 - Release:** delegar exclusivamente a `@devops` o pre-push, PR,
  merge e publish; verificar versao, integridade, `npm latest` e smoke tests
  instalados diretamente do registry.

## Riscos e controles

| Risco | Controle obrigatorio |
|---|---|
| Apagar skill ou agent customizado do usuario | Remover somente por manifesto, allowlist versionada ou hash identico; item ambiguo e preservado |
| Confundir adapter nativo com duplicidade | Comparar ID canonico e funcao da superficie; testar descoberta real por provider |
| Quebrar Claude ao consolidar Codex | Matriz Claude-only, Codex-only e ambos em fixtures isoladas |
| Redistribuir legado externo por arquivo esquecido | Gate de paths e conteudo com excecoes explicitas para licenca e testes negativos |
| Validar apenas o checkout | Instalar e atualizar o tarball fora do monorepo |
| Remocao atravessar a raiz autorizada | Resolver paths absolutos, validar containment e usar lista fechada antes de qualquer delete |

## Fora de escopo

- Apagar historico de conversas, backups mistos ou arquivos do usuario apenas
  porque mencionam frameworks externos em texto.
- Remover referencias legais, autoria, proveniencia ou testes que garantem a
  ausencia do legado externo no produto ativo.
- Reescrever agents, personas, authorities, tasks ou workflows canonicos.
- Remover, mover, sobrescrever ou colocar em quarentena arquivos de qualquer
  framework externo durante install/update publico, mesmo que o path ou conteudo
  seja conhecido.
- Alterar `.sinapse-ai/core/**`, `.sinapse-ai/constitution.md`,
  `.sinapse-ai/development/{tasks,templates,checklists,workflows}/`,
  `.sinapse-ai/infrastructure/**` ou `bin/sinapse*.js`.
- Fazer deploy de aplicacao.

## Evidencias obrigatorias

1. tabela antes/depois por provider com IDs unicos, duplicados e orfaos;
2. lista de residuos externos ativos removidos e referencias permitidas preservadas;
3. fixtures demonstrando preservacao de customizacoes e falha segura;
4. duas execucoes consecutivas de install/update para provar idempotencia;
5. conteudo do tarball e resultado isolado dos modos Codex-only, Claude-only e
   ambos;
6. comprovacao de zero diff nos paths protegidos.

## Definition of done

- AC1-AC12 cobertos por testes ou evidencias deterministicas.
- Uma unica entrada de skill SINAPSE e descoberta pelo Codex; Claude Code mantem
  seu catalogo completo e semanticamente equivalente.
- Nenhum residuo externo ativo e distribuido ou carregado nas superficies auditadas.
- Install, update, segunda execucao e tarball isolado passam nos tres modos.
- Customizacoes e historicos do usuario permanecem intactos quando ownership nao
  pode ser comprovado.
- Quality Gate em PASS e zero alteracao nos paths protegidos.

## Validation record

- Date: 2026-07-15
- Validator: `@product-lead` (Axis)
- Verdict: **GO - Ready for implementation**
- Scope: PASS - a entrega consolida superficies e migra legado sem reescrever o
  framework canonico ou ampliar a limpeza para historicos e backups ambiguos.
- Traceability: PASS - objetivo, duplicidade `.codex/skills` versus
  `.agents/skills`, residuos externos e requisitos cross-provider derivam diretamente
  do pedido do mantenedor e da story de qualidade cross-provider.
- Testability: PASS - AC1-AC12 definem inventarios, fixtures, matriz de providers,
  idempotencia, tarball e resultados negativos observaveis.
- Safety: PASS - ownership comprovado, containment de paths e preservacao por
  default impedem remocao indevida de customizacoes e dados historicos.
- Provider parity: PASS - Codex consolida a descoberta nativa sem retirar os
  adapters necessarios do Claude Code.
- Boundary: PASS - paths L1/L2 e operacoes remotas estao explicitamente fora do
  escopo.
- Authority: PASS - Sprint Lead especifica, Product Lead valida, Developer
  implementa, Quality Gate revisa e DevOps preserva autoridade exclusiva sobre
  operacoes remotas.
- Handoff: `@developer *develop docs/stories/story-sinapse-only-catalog-cleanup.md`.

## Dev Agent Record

- Executor: `@developer` (Pixel), com revisao independente de `@quality-gate`.
- Quality Gate final: **PASS**, sem findings remanescentes.
- Catalogo: 172 agents canonicos, 172 adapters Claude, 172 adapters Codex,
  zero orfaos e zero ponteiros quebrados.
- Tasks: 1.412 arquivos; 14 slugs repetidos permanecem namespaced e possuem
  conteudo distinto, portanto nao constituem duplicidade operacional.
- Tarball `sinapse-ai-1.25.1.tgz`: 4.340 entradas, 172 agents Claude, 172 agents
  Codex, 36 skill adapters Claude e 37 skills nativas Codex, zero
  `.codex/skills`, zero commands Claude legados e zero residuos externos.
- Smoke isolado do tarball: Claude-only `172 agents + 36 skills`, Codex-only
  `172 agents + 37 skills`, ambos `172/172 agents + 36/37 skills` por provider;
  settings Claude registrado e superficies legadas ausentes.
- Gates: lint sem erros (29 warnings preexistentes), typecheck, paridade,
  referencias externas, manifesto e release readiness aprovados (12/12).
- Validacao depois das correcoes: release readiness executou lint e typecheck
  em PASS; a execucao completa final passou com 422 grupos de testes e 11.671
  testes, zero falhas.
  O projeto e um framework CLI e nao define script `build`, portanto o gate de
  build e nao aplicavel. O unico gate de publish safety que falha apos a release
  e a protecao esperada contra republicar `1.25.1` sobre o mesmo `npm latest`;
  antes da publicacao, release readiness passou 12/12.
- Boundary: `git diff --check` passou e nenhum path L1/L2 protegido foi alterado.
- Release protegida: PR #382 mesclada em `main` no commit
  `7a5659f3f0639d8a97921329b3bdb043c28ab19b`; workflow Semantic Release
  `29401991831` concluido com sucesso e release GitHub `1.25.1` publicada.
- Registry npm: `sinapse-ai@1.25.1` publico e `latest`, integridade
  `sha512-cgYScqJak/UDCAtMESdulGjXn2zAoX1B6IEMpBdGH36fFr87uSCpoBqSx4lwRB4TBnZrGjNviUBkeJS+4/LwaQ==`.
- Smokes do registry: clean install e update `1.25.0 -> 1.25.1` aprovados em
  Claude-only (`172 agents`, `36 skill adapters Claude`), Codex-only
  (`172 agents`, `37 skills nativas Codex`) e ambos (`172/172 agents`, com os
  respectivos `36/37` por provider), sempre com providers isolados.

### File List

- `.agents/skills/**`
- `.claude/agents/**`, `.claude/skills/**`
- `.codex/agents/**`, `.codex/scripts/**`, `.codex/catalog.json`
- `bin/commands/{install,update,uninstall,status,help}.js`
- `bin/lib/global-provider-adapters.js`
- `packages/installer/src/installer/sinapse-ai-installer.js`
- `packages/installer/src/migrations/*.json`
- `scripts/validate-provider-adapters.js`
- `scripts/validate-codex-command-registry.js`
- `tests/installer/**`, `tests/unit/**`, `tests/integration/**`
- `docs/framework/codex-parity/**`, `docs/installation/**`, `docs/guides/**`
- `package.json`, `package-lock.json`, `.sinapse-ai/install-manifest.yaml`
