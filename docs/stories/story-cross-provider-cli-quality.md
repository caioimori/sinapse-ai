---
status: InProgress
owner: sprint-lead
executor: developer
quality_gate: quality-gate
quality_gate_tools:
  - npm
  - node
  - isolated-install-fixtures
  - coderabbit
created: 2026-07-14
---

# Story: Qualidade cross-provider para Codex e Claude Code

## User story

Como mantenedor do SINAPSE, quero uma fonte canonica compartilhada e adapters
finos, especificos para Codex e Claude Code, para que agentes, tasks, workflows,
regras e instalacao tenham a mesma semantica nos dois CLIs sem limitar recursos
nativos ou criar duas implementacoes divergentes do framework.

## Contexto

O runtime Codex possui skills `$`, adapters TOML, hooks e registries proprios. O
Claude Code possui agentes, comandos, hooks e configuracao proprios. A paridade
deve ser semantica e verificavel, nao uma copia literal entre providers: o core
provider-neutral permanece canonico e cada CLI recebe apenas o adapter necessario
para suas capacidades nativas.

## Escopo

- Definir e validar o contrato canonico compartilhado de agentes, tasks,
  workflows, regras, authorities, aliases e referencias.
- Tornar os adapters Codex e Claude Code finos, deterministas e derivados desse
  contrato, preservando capacidades nativas de cada CLI.
- Detectar drift, artefatos orfaos, referencias quebradas, duplicidade e
  divergencia semantica entre core, Codex e Claude Code.
- Garantir instalacao limpa, update e empacotamento npm simetricos e isolados
  para Codex-only, Claude-only e ambos.
- Documentar ativacao, limites, diagnostico e matriz de compatibilidade dos dois
  providers.
- Adicionar gates automatizados que impecam release quando qualquer provider
  estiver incompleto ou divergente.

## Acceptance criteria

- [ ] **AC1 - Contrato canonico.** Given as fontes provider-neutral existentes,
  when o contrato cross-provider e gerado, then cada agente, task, workflow,
  regra, authority e alias publico possui ID unico, origem rastreavel e target
  existente, sem conteudo operacional concorrente nos adapters.
- [ ] **AC2 - Adapter Codex.** Given o contrato canonico, when o sync Codex roda
  duas vezes, then skills `$`, agents TOML, registries, hooks e configuracao
  suportada sao deterministas, idempotentes e resolvem somente fontes canonicas.
- [ ] **AC3 - Adapter Claude Code.** Given o mesmo contrato, when o sync Claude
  Code roda duas vezes, then agents, commands, hooks e configuracao suportada sao
  deterministas, idempotentes e resolvem somente fontes canonicas.
- [ ] **AC4 - Paridade semantica.** Given uma fixture representativa de core,
  orquestrador e especialista, when ativacao, command/task resolution,
  delegacao e authority gates rodam em ambos os providers, then os resultados
  semanticos equivalentes passam e diferencas nativas documentadas nao sao
  tratadas como regressao.
- [ ] **AC5 - Catalogo completo.** Given o inventario medido em disco, when a
  validacao cross-provider roda, then nenhum agente ou task resolvivel fica
  ausente, duplicado, orfao ou apontando para arquivo inexistente em qualquer
  adapter; contagens documentadas sao derivadas do mesmo inventario.
- [ ] **AC6 - Instalacao limpa simetrica.** Given ambientes temporarios sem
  SINAPSE, when o pacote candidato instala os modos Codex-only, Claude-only e
  ambos, then cada modo recebe somente seus artefatos e o core compartilhado,
  funciona sem depender do repositorio fonte e nao escreve configuracao global.
- [ ] **AC7 - Update conservador.** Given fixtures de versoes anteriores com
  customizacoes suportadas, when o update roda para cada um dos tres modos, then
  reconcilia artefatos oficiais de forma idempotente, preserva customizacoes,
  remove apenas artefatos comprovadamente gerenciados e nao altera o outro
  provider quando ele nao foi selecionado.
- [ ] **AC8 - Verdade do pacote npm.** Given o tarball produzido por `npm pack`,
  when ele e instalado e validado fora do monorepo, then contem o core e todos os
  adapters, resolvers, schemas e docs declarados; nenhum teste depende de arquivo
  excluido do pacote ou de estado global da maquina.
- [ ] **AC9 - Gates de seguranca.** Given writes, secrets, comandos destrutivos,
  DDL/DML inseguro e paths protegidos representativos, when os hooks de ambos os
  providers recebem payloads nativos, then aplicam a mesma politica canonica e
  falham de forma segura, com testes positivos e negativos por provider.
- [ ] **AC10 - Diagnostico acionavel.** Given drift, versao incompativel ou
  artefato ausente em qualquer provider, when doctor/validation roda, then retorna
  provider, origem, target, severidade e instrucao de reparo sem executar repair
  implicito ou telemetria verbosa.
- [ ] **AC11 - Release gate.** Given uma mudanca no core ou em um adapter, when
  CI/release readiness roda, then lint, typecheck aplicavel, testes, package
  inspection, clean install, update e paridade cross-provider sao bloqueantes;
  uma validacao local verde sem tarball isolado nao autoriza release.
- [ ] **AC12 - Documentacao operacional.** Given a entrega concluida, when um
  usuario segue as docs para Codex ou Claude Code, then consegue instalar,
  atualizar, ativar orquestradores/especialistas, executar workflows e diagnosticar
  falhas usando somente comandos e sintaxes validos para o provider escolhido.
- [ ] **AC13 - Boundary.** Given o diff final, when a verificacao de boundary
  roda, then nenhum arquivo protegido L1/L2, constituicao, infraestrutura
  protegida ou `bin/sinapse*.js` foi alterado; extensoes usam apenas pontos
  permitidos e nenhuma alteracao de usuario preexistente e revertida.

## Fora de escopo

- Igualar texto gerado, UX ou funcionalidades que um dos CLIs nao oferece.
- Reescrever personas, authorities, tasks ou workflows canonicos.
- Alterar `.sinapse-ai/core/**`, `.sinapse-ai/constitution.md`,
  `.sinapse-ai/development/{tasks,templates,checklists,workflows}/`,
  `.sinapse-ai/infrastructure/**` ou `bin/sinapse*.js`.
- Escrever secrets, configuracao global do usuario ou migracoes destrutivas.
- Fazer push, criar PR, publicar pacote npm, release ou deploy.

## Sequenciamento

1. Inventariar o contrato e registrar divergencias sem alterar runtime.
2. Implementar o contrato/provider-neutral em ponto de extensao permitido.
3. Afinar o adapter Codex e seus testes isolados.
4. Afinar o adapter Claude Code e seus testes isolados.
5. Executar matriz Codex-only, Claude-only, ambos, update e tarball.
6. Submeter evidencias a `@quality-gate`; operacoes remotas permanecem exclusivas
   de `@devops` e exigem autorizacao propria.

## Definition of done

- AC1-AC13 cobertos por testes ou fixtures deterministicas.
- Matriz de compatibilidade e evidencias de install/update/package registradas.
- Zero regressao critica nos dois providers e zero violacao de boundary.
- Quality Gate em PASS; nenhum push, PR ou publish implicito.

## Validation record

- Date: 2026-07-14
- Validator: `@product-lead` (Axis)
- Verdict: **GO - Ready for implementation**
- Traceability: PASS - objetivo, escopo e ACs derivam do pedido de qualidade
  simultanea para Codex e Claude Code e das stories Codex ja validadas.
- Testability: PASS - AC1-AC13 definem entradas, execucao e resultados observaveis,
  incluindo matrizes isoladas de install, update e pacote.
- Boundary: PASS - caminhos protegidos, estado global, secrets e operacoes remotas
  estao explicitamente excluidos.
- Authority: PASS - Sprint Lead especifica, Developer implementa, Quality Gate
  valida e somente DevOps pode executar operacoes remotas autorizadas.
- Handoff: `@developer *develop docs/stories/story-cross-provider-cli-quality.md`.

## Implementation record - public docs activation slice (2026-07-15)

- Claude Code activation is documented with `@agent-name`; Codex activation is
  documented with `$snps` or `$sinapse-agent <id>` in the public quickstart,
  troubleshooting, installation index and FAQ.
- README task metrics now come from the parametric runtime: 1,201 squad tasks,
  211 development tasks, 1,412 task files and 1,348 resolvable pointers.
- Article VII validates all four task scopes plus the 36/37 skill and 20/9 hook
  surfaces, requires the complete breakdown in the public README and fails
  closed when runtime/provider metrics are unavailable or malformed.
- The install-doc validator scans EN and PT installation trees, rejects legacy
  `/dev`, `@dev`, `/my-agent` and contextual Codex `/skills` activation while
  preserving legitimate URLs (including `/codex/skills`), `/dev/null`, Claude
  references and internal notes.
- The English README mirrors the PT task/provider metrics and activation syntax.
  EN/PT user guides declare the complete 172-agent/17-squad runtime and identify
  their core-agent tables as excerpts rather than the full catalog.
- Runtime task collection rejects zero inventories and reconciles
  `squadTaskFiles` against the independent `sync-counts` squad total.
- Current Codex configuration, IDE integration and project-status guides now use
  only provider-native activation. The IDE guide publishes the measured
  172-agent, 36/37-skill and 20/9-hook surfaces; project-status guides identify
  their 11 listed core agents as a subset of the 172-agent catalog.
- Project status is documented as automatic observability: the unsupported
  `init-project-status` command flow and destructive protected-file removal were
  removed from EN/PT mirrors. The public scanner blocks that command and the
  retired `SINAPSE-FullStack` name.
- Codex configuration references only real Claude/Codex sync scripts and the
  measured adapter paths; tests verify representative `.claude/agents/sinapse-*`
  and `.codex/agents/*.{toml,md}` files exist.
- Project-status greeting examples now use the canonical `Pixel the Builder`
  persona in EN/PT; the public-doc regression scanner rejects `Dex (Builder)`
  and contextual standalone `(Dex)` references to the developer persona,
  including the explicit `@developer (Dex)` form.
- README squad activation examples now show provider-native Claude Code and
  Codex syntax. EN/PT FAQs describe the current adapter paths and the measured
  172-agent/17-squad catalog instead of legacy aliases and `11+` counts.
- EN/PT installation FAQs, platform guides, troubleshooting and user guides now
  document only the supported Claude Code/Codex surfaces. Current docs no longer
  advertise Cursor, Gemini CLI or GitHub Copilot adapters, retired slash-agent
  aliases, `.cursor/rules/` or `.claude/commands/` as an agent path.
- Runtime metric collection limits the parametric resolver to 10 seconds by
  default and exposes a validated timeout option for deterministic tests.
- Article VII prose guards cover Claude Code hook registrations and Codex
  lifecycle-event claims in English and Portuguese, with current and stale
  regression fixtures for both providers.
- Provider evidence: 172 agents in both adapters; 36 Claude skills; 37 Codex
  skills; 20 Claude hook registrations; 9 Codex lifecycle events through the
  compatibility bridge.
- Validation: 39 focused tests passed; ESLint, `validate:article-vii`,
  `validate:docs`, `validate:providers`, `validate:codex-native`,
  `validate:parity` and all 13 `validate:all` guards passed. `npm pack --dry-run`
  produced 4,341 entries and includes all 24 shipped docs/scripts changed in
  this review slice; the implementation story and test sources are intentionally
  excluded from the public tarball.

### Slice file list

- `README.md`
- `README.en.md`
- `docs/getting-started.md`
- `docs/troubleshooting.md`
- `docs/guides/user-guide.md`
- `docs/pt/guides/user-guide.md`
- `docs/guides/codex-config.md`
- `docs/guides/ide-integration.md`
- `docs/guides/project-status-feature.md`
- `docs/pt/guides/project-status-feature.md`
- `docs/installation/README.md`
- `docs/installation/faq.md`
- `docs/installation/linux.md`
- `docs/installation/macos.md`
- `docs/installation/troubleshooting.md`
- `docs/installation/v4-quick-start.md`
- `docs/installation/windows.md`
- `docs/pt/installation/README.md`
- `docs/pt/installation/faq.md`
- `docs/pt/installation/linux.md`
- `docs/pt/installation/macos.md`
- `docs/pt/installation/troubleshooting.md`
- `docs/pt/installation/v4-quick-start.md`
- `docs/pt/installation/windows.md`
- `scripts/validate-article-vii.js`
- `scripts/validate-install-docs.js`
- `tests/scripts/validate-article-vii.test.js`
- `tests/scripts/validate-install-docs.test.js`
