---
status: Ready
owner: sprint-lead
executor: developer
quality_gate: quality-gate
quality_gate_tools:
  - node
  - jest
  - golden-fixtures
created: 2026-07-14
epic: docs/epics/epic-engineering-applicability-engine/README.md
---

# Story: Baseline advisory de aplicabilidade de engenharia

## User story

Como mantenedor do SINAPSE, quero classificar projetos e mudancas por contexto e
risco antes de selecionar workflows, para que Claude Code e Codex apresentem a
mesma decisao advisory, explicavel e provider-neutral para cenarios greenfield e
brownfield.

## Contexto e rastreabilidade

O epic Engineering Applicability Engine define uma Phase 0 de contratos e
fixtures, seguida por uma Phase 1 de shadow mode sem bloqueio. A auditoria de
workflows de 2026-06-22 demonstra que aplicar todos os workflows indistintamente
seria incorreto: greenfield, brownfield, superficies afetadas e riscos exigem
obrigacoes diferentes. Ela tambem identifica lacunas concretas, como
characterization tests antes de mudancas brownfield, grounding de design system
para UI e gates de seguranca para superficies expostas.

Esta story entrega apenas a menor fatia verificavel dessas fases: normalizacao
dos sinais, classificacao deterministica e uma decisao advisory identica nos dois
providers. O corpus e os workflows existentes permanecem fontes de referencia;
nenhum deles e reescrito ou executado por esta entrega.

## Escopo

- Definir um contrato JSON versionado para os sinais minimos de projeto e
  mudanca: `projectType`, `surfaces`, `changeKind`, `dataClasses`,
  `deploymentTargets`, `reversibility` e riscos de `security`, `privacy` e
  `availability`.
- Normalizar enums, ordenar colecoes e rejeitar entradas desconhecidas sem usar
  inferencia de LLM para alterar a classificacao.
- Produzir um pacote de decisao advisory com IDs estaveis, sinais normalizados,
  obrigacoes sugeridas ou excluidas, `reasonCodes`, fontes e digest deterministico.
- Cobrir fixtures douradas pequenas para greenfield e brownfield, incluindo
  superficies `frontend`, `api` e `database` e riscos baixo e alto.
- Renderizar o mesmo pacote canonico para Claude Code e Codex por adapters finos,
  sem permitir que um adapter selecione, remova ou reclassifique obrigacoes.
- Emitir apenas `advisory`, `unknown-signal` ou `human-checkpoint`; nenhum
  resultado desta story bloqueia implementacao, commit, push, release ou deploy.

## Acceptance criteria

- [ ] **AC1 - Contrato provider-neutral.** Given uma entrada valida de projeto e
  mudanca, when o normalizador roda, then retorna um objeto versionado usando
  somente enums canonicos, colecoes sem duplicidade e ordenacao deterministica,
  sem campos ou decisoes especificos de Claude Code ou Codex.
- [ ] **AC2 - Falha segura de classificacao.** Given `projectType`, superficie,
  risco ou versao de schema desconhecidos, when a entrada e validada, then a
  decisao nao e inventada: o resultado advisory identifica o campo e o reason
  code `UNKNOWN_SIGNAL` ou `UNSUPPORTED_SCHEMA`, e exige checkpoint humano.
- [ ] **AC3 - Greenfield.** Given a fixture greenfield com `frontend` e `api`,
  when a classificacao roda, then sugere no minimo story/spec readiness, QA,
  seguranca da aplicacao e, para UI, design-system grounding, cada item com fonte
  e reason code; characterization tests brownfield ficam explicitamente
  excluidos por `PROJECT_GREENFIELD`.
- [ ] **AC4 - Brownfield.** Given a fixture brownfield com mudanca em `api` ou
  `database`, when a classificacao roda, then sugere characterization baseline e
  estrategia incremental antes de implementacao, alem dos controles de
  seguranca/rastreabilidade aplicaveis, com fontes e reason codes.
- [ ] **AC5 - Superficies.** Given duas entradas iguais exceto por uma superficie
  ausente, when as decisoes sao comparadas, then obrigacoes exclusivas dessa
  superficie aparecem em `excluded` com `SURFACE_ABSENT`; sinais irrelevantes
  nao alteram as demais obrigacoes nem seu digest parcial normalizado.
- [ ] **AC6 - Risco monotonicamente conservador.** Given fixtures identicas com
  risco baixo e alto, when a classificacao roda, then elevar `security`,
  `privacy` ou `availability` nunca reduz as obrigacoes sugeridas e inclui
  checkpoint humano quando a reversibilidade e `irreversible`.
- [ ] **AC7 - Paridade Claude/Codex.** Given qualquer fixture dourada, when os
  adapters Claude Code e Codex recebem o mesmo pacote canonico, then preservam
  `decisionId`, `decisionDigest`, obrigacoes, exclusoes, severidades e reason
  codes exatamente; apenas a apresentacao nativa pode diferir.
- [ ] **AC8 - Shadow mode real.** Given qualquer decisao produzida nesta story,
  when o adapter a apresenta, then o resultado declara `mode: advisory`, nao
  executa workflow, nao escreve evidencia como verificada e nao retorna status
  bloqueante.
- [ ] **AC9 - Determinismo.** Given a mesma entrada com campos e arrays em ordem
  diferente, when executada repetidamente e nos dois providers, then a entrada
  normalizada e os digests sao byte-a-byte identicos.
- [ ] **AC10 - Boundary.** Given o diff final, when o boundary test roda, then
  nenhum arquivo em `.sinapse-ai/core/**`, `.sinapse-ai/constitution.md`,
  `bin/sinapse*.js`, `.sinapse-ai/development/{tasks,templates,checklists,workflows}/`
  ou `.sinapse-ai/infrastructure/**` foi criado, alterado, movido ou removido.

## Fixtures e testes obrigatorios

| Fixture | Tipo | Superficies | Risco | Expectativa principal |
|---|---|---|---|---|
| `greenfield-web-low` | greenfield | frontend, api | baixo | spec/QA/appsec/DS; sem characterization |
| `greenfield-data-high` | greenfield | api, database | alto | controles de seguranca e privacidade ampliados |
| `brownfield-ui-low` | brownfield | frontend | baixo | characterization + mudanca incremental + DS |
| `brownfield-service-high` | brownfield | api, database | alto | characterization + incremental + seguranca + checkpoint |
| `unknown-surface` | brownfield | valor desconhecido | n/a | UNKNOWN_SIGNAL; checkpoint; sem decisao inventada |

Testes automatizados devem comprovar:

1. validacao positiva, negativa, boundary e versao de schema;
2. tabela de regras para as cinco fixtures;
3. invariancia a ordem e repeticao de sinais;
4. propriedade de monotonicidade de risco;
5. golden comparison do pacote canonico e paridade semantica Claude/Codex;
6. ausencia de side effects, enforcement e alteracoes em paths protegidos.

## Fora de escopo

- Implementar o registry completo dos 275 workflows ou 1.617 knowledge cards.
- Executar workflows, agentes, retries ou ferramentas a partir da decisao.
- Tornar qualquer recomendacao obrigatoria ou alterar gates constitucionais.
- Implementar evidence ledger, waiver, CI bloqueante ou migracao de projetos.
- Corrigir nesta story os defeitos dos workflows de projeto listados na auditoria.
- Alterar tasks, templates, checklists, workflows, Constitution, core ou
  infraestrutura protegidos.
- Fazer push, PR, publish, release ou deploy.

## Sequenciamento de implementacao

1. Criar fixtures e o contrato provider-neutral em ponto de extensao permitido.
2. Implementar normalizacao e classificacao deterministicas contra as fixtures.
3. Adicionar adapters somente de apresentacao para Claude Code e Codex.
4. Rodar testes de schema, regras, propriedades, golden parity e boundary.
5. Registrar divergencias advisory para calibracao; enforcement exige story
   posterior e aprovacao propria.

## Definition of done

- AC1-AC10 cobertos por testes deterministas e pelas cinco fixtures obrigatorias.
- A mesma fixture produz a mesma decisao canonica em Claude Code e Codex.
- Toda sugestao e exclusao possui fonte e reason code; sinais desconhecidos nao
  sao inferidos silenciosamente.
- O modo permanece advisory, sem side effects e sem tocar paths protegidos.
- Quality Gate em PASS; nenhuma operacao remota implicita.

## Validation record

- Date: 2026-07-14
- Validator: `@product-lead` (Axis)
- Verdict: **GO - Ready for implementation**
- Scope: PASS - fatia pequena das Phases 0/1, sem antecipar enforcement, ledger
  completo ou ingestao integral do corpus.
- Traceability: PASS - classificacoes e fixtures derivam do epic e dos achados
  greenfield, brownfield, UI, appsec e legacy da auditoria de 2026-06-22.
- Testability: PASS - AC1-AC10 estabelecem entradas, saidas, invariantes,
  fixtures douradas e boundary observaveis.
- Provider parity: PASS - uma unica decisao canonica alimenta adapters finos;
  Claude Code e Codex nao possuem logica propria de selecao.
- Boundary: PASS - paths L1/L2 e operacoes remotas estao explicitamente fora do
  escopo.
- Authority: PASS - Sprint Lead especifica, Developer implementa, Quality Gate
  valida e DevOps preserva autoridade exclusiva sobre operacoes remotas.
- Handoff: `@developer *develop docs/stories/story-engineering-applicability-advisory-baseline.md`.
