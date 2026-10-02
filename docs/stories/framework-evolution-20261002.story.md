---
id: framework-evolution-20261002
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint, tsc]
created: 2026-10-02
epic: docs/framework/evolution-2026-10/SPEC.md
---

# Modernização do framework, upstream e conhecimento por competência

## Status

InReview

## Story

Como mantenedor, quero incorporar atualizações compatíveis e conhecimento rastreável
em todas as squads, preservando trabalho existente e medindo o que efetivamente melhora.

## Scope

Spec em docs/framework/evolution-2026-10/SPEC.md. Implementação somente em extensões
permitidas e paths novos. Instalação global, pagamento, publicação e paths protegidos
não fazem parte desta alteração local.

## Acceptance Criteria

- [x] AC1 — Given o upstream público pinado, When a árvore é auditada,
  Then versão, SHA, licença, diferenças e decisões ficam reproduzíveis.
- [x] AC2 — Given o catálogo canônico, When o inventário é gerado,
  Then cobre as 17 squads, todos agentes, skills, workflows e KBs com lacunas.
- [x] AC3 — Given fontes primárias consultadas, When o corpus é validado,
  Then cada heurística inicial mantém evidência/localizador e consumidores reais.
- [x] AC4 — Given agente e tarefa canônica, When o runtime instalado é consultado
  em fixtures locais/globais, Then recupera conhecimento relevante sob limite,
  sem carregar o corpus inteiro ou presumir instalação no HOME real.
- [x] AC5 — Given o contrato Jev, When o executor é invocado,
  Then permanece offline por padrão ou exige autorização/chave/ledger,
  reserva orçamento antes de cada tentativa e valida respostas.
- [x] AC6 — Given o checkout original e paths protegidos, When testes e gates rodam,
  Then os limites, resultados e preservação ficam registrados com evidência.
- [x] AC7 — Given os resultados observados, When o handoff é salvo,
  Then distingue local/instalado/publicado e mantém avaliação antes/depois pendente.

## Tasks

- [x] Preservar checkout original e criar branch isolada do remoto verificado.
- [x] Definir spec e contrato de arquitetura antes de implementação.
- [x] Pesquisar e reconciliar upstream.
- [x] Inventariar e corrigir gargalos permitidos.
- [x] Construir corpus e ferramentas de conhecimento/Jev.
- [x] Integrar, verificar e registrar resultados locais.

## File List

- docs/framework/evolution-2026-10/SPEC.md
- docs/framework/evolution-2026-10/workflow.json
- docs/framework/evolution-2026-10/README.md
- docs/framework/evolution-2026-10/HANDOFF.md
- docs/framework/evolution-2026-10/verification.md
- docs/framework/evolution-2026-10/evaluation.md
- docs/framework/evolution-2026-10/upstream.md
- docs/framework/evolution-2026-10/upstream.json
- docs/framework/evolution-2026-10/inventory.json
- docs/framework/evolution-2026-10/runtime.md
- docs/framework/evolution-2026-10/knowledge.md
- docs/framework/evolution-2026-10/mental-models.md
- docs/framework/evolution-2026-10/dependencies.md
- docs/framework/evolution-2026-10/dependency-audit.json
- docs/framework/evolution-2026-10/dependency-audit-after.json
- docs/framework/evolution-2026-10/preservation.json
- docs/stories/framework-evolution-20261002.story.md
- research/framework-evolution/sources.json
- research/framework-evolution/heuristics.json
- research/framework-evolution/competencies.json
- research/framework-evolution/plan-batch.json
- research/framework-evolution/business-research-pack.json
- scripts/framework-evolution/inventory.cjs
- scripts/framework-evolution/runtime.cjs
- scripts/framework-evolution/upstream-audit.cjs
- scripts/framework-evolution/knowledge.cjs
- scripts/framework-evolution/jev.cjs
- .codex/scripts/resolve-codex-agent.js
- .codex/scripts/sync-codex-native.js
- .codex/agents/*.toml — 172 adapters gerados; arquivos exatos no diff da branch
- .agents/skills/sinapse-agent/SKILL.md
- bin/lib/framework-evolution-delivery.js
- bin/lib/global-provider-adapters.js
- .sinapse-ai/data/entity-registry.yaml — índice derivado pelo post-commit existente
- packages/installer/src/installer/sinapse-ai-installer.js
- package.json
- package-lock.json
- scripts/validate-no-external-refs.js
- tests/scripts/validate-no-external-refs.test.js
- tests/unit/framework-evolution-upstream.test.js
- tests/unit/framework-evolution-runtime.test.js
- tests/unit/framework-evolution-knowledge.test.js
- tests/unit/framework-evolution-delivery.test.js

## Verification

QA local/fixtures aprovado; comandos, evidências e limites em
docs/framework/evolution-2026-10/verification.md. InReview preserva a etapa de
revisão e publicação separada. Uso pago Jev e ganho comportamental seguem pendentes.

## QA Results

**Veredicto em 2026-10-02: PASS no escopo local e nas fixtures de instalação.** Nenhum finding P1/P2 permanece aberto nesse escopo. Publicação/release externo não foi autorizado nem aprovado por este gate.

Coorte final: **151 testes aprovados em 10 suites, 74,03 s**, invocados diretamente por node node_modules/jest/bin/jest.js, com --runInBand --silent; sem pretest. Inclui quatro suites framework-evolution, adapters globais, geração/validação/runtime Codex, sync providers e helpers do instalador.

A coorte parcial anterior teve 82 testes em sete suites. Esses números se sobrepõem e não devem ser somados; a coorte final substitui a parcial. Não foi executado o conjunto completo de testes do repositório.

Lint, typecheck, parity completo, squad YAML strict (17/17), releaseGate e validação individual desta story passaram. O package não define script build; esse gate é inaplicável. Gates documentais/de segredos do stage final são integrados pelo root.

Preservação final conferida: 191 arquivos do recibo original relidos com zero divergência de existência/SHA-256; status Git dos paths protegidos, incluindo untracked, contém zero alterações.

Proveniência upstream reconferida independentemente na árvore oficial pinada 4ef6530ff03b83aea953e4a426f95e012b8b70c5: truncated=false, 3.022 blobs oficiais e 3.022 arquivos no recibo, com zero divergência de hashes Git, incluindo normalização CRLF pinada.

Corpus final válido: 35 fontes, 67 heurísticas, ao menos três por squad/core; todas inferred. Os 172 agentes permanecem coverage=gap. Hash de excerto prova integridade do trecho capturado; referência lexical não comprova entailment ou qualificação especializada.

Consulta local independente dos 172 agentes com comando válido preservou o orçamento integral do JSON; uma tarefa sem material relevante devolveu lacuna. Ranking por tokens e competências diferencia tarefas e omite material sem correspondência; não equivale a retrieval semântico validado.

Lote Jev final contém 18 requisições offline e 134 perguntas atômicas cobrindo todas as 67 heurísticas. Plans e corpusSha256 correspondem à regeneração atual; called=false e reserva máxima de uma tentativa por contexto é US$ 0,048384.

Findings corrigidos e reproduzidos novamente: score NaN/Infinity, payload não JSON-safe, campos extras não admitidos, mutação do payload entre retries e edição concorrente durante entrega. Retries usam snapshot idêntico; alterações concorrentes detectadas preservam conteúdo e receipt anterior.

Fakes conferiram reserva antes de cada tentativa, teto compartilhado sob concorrência, cache contextual inválido, modelo fixado e deadline incluindo leitura do body. Endpoint é fixo em https://api.typesafe.ai/v1/systemone; chave não é emitida em plano, cache key ou resultado.

Fixtures executaram o instalador público de projeto e adapters globais com HOME temporário contendo espaços, queries core/copy/orchestrator e hook extraído do TOML via PowerShell. Readback conferiu receipts/hashes; npm install foi interceptado no teste, sem instalação de dependências externa.

Não se afirma instalação no HOME real, execução paga do Jev, publicação, persistência remota, melhoria comportamental ou CAS total contra writers não cooperativos. Coordenação externa ainda é necessária após a última conferência de hash; a limitação está documentada.

API e limites conferidos nas fontes primárias: https://docs.typesafe.ai/api e https://docs.typesafe.ai/models. Ganho em português, qualidade antes/depois, latência, cobrança real e corpus especializado continuam dependentes de avaliação própria.
