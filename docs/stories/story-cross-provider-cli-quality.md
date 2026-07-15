---
status: Ready
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
