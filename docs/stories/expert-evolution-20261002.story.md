---
id: expert-evolution-20261002
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint, tsc]
created: 2026-10-02
epic: docs/framework/expert-evolution-2026-10/SPEC.md
---

# Especialização dos agentes e organização do framework

## Status

InReview

## Story

Como mantenedor, quero especialistas com conhecimento rastreável, modelos adequados
e organização clara, priorizando design, frontend, vídeo, motion e conteúdo.

## Scope

Spec em docs/framework/expert-evolution-2026-10/SPEC.md. YOLO autoriza execução
delimitada; piloto Jev até US$ 0,05. Não remover conteúdo, alterar paths protegidos,
publicar ou instalar globalmente. Referência candidata e avaliação estrutural
não equivalem a especialista validado, biblioteca integral ou ganho comprovado.

## Acceptance Criteria

- [x] AC1 — Given os 172 agentes canônicos, When o plano de expertise é validado,
  Then todos possuem missão, entregável, competências, referências e critérios distintos.
- [x] AC2 — Given as prioridades criativas, When a pesquisa é consolidada,
  Then fontes lidas sustentam técnicas e casos negativos, com estado Mobbin explícito.
- [x] AC3 — Given conteúdo autorizado, When a ingestão segmenta e deduplica,
  Then preserva hash, locator, direitos e lacunas sem carregar corpus inteiro.
- [x] AC4 — Given as 17 squads, When as oportunidades Jev são preparadas,
  Then têm perguntas atômicas, dados necessários, avaliação e limite de gasto.
- [x] AC5 — Given a árvore Git e consumidores, When o catálogo é gerado,
  Then cada arquivo é classificado e fontes/caminhos existentes são preservados.
- [x] AC6 — Given modelos e contexto, When a política é consultada,
  Then distingue disponibilidade real de versão candidata e limita contexto por tarefa.
- [x] AC7 — Given a integração local, When o QA e o handoff são concluídos,
  Then testes e limites são documentados, sem inventar uso Jev ou ganho comportamental.

## Tasks

- [x] Definir spec, workflow e preservação antes da implementação.
- [x] Construir prioridade criativa, expertise/curadoria e catálogo em paralelo.
- [x] Integrar runtime, modelos e piloto Jev autorizado quando a credencial existir.
- [x] Verificar, registrar plano por etapa e salvar checkpoint local.

## File List

- docs/framework/expert-evolution-2026-10/SPEC.md
- docs/framework/expert-evolution-2026-10/workflow.json
- docs/stories/expert-evolution-20261002.story.md

- docs/framework/expert-evolution-2026-10/README.md
- docs/framework/expert-evolution-2026-10/PLAN.md
- docs/framework/expert-evolution-2026-10/HANDOFF.md
- docs/framework/expert-evolution-2026-10/verification.md
- docs/framework/expert-evolution-2026-10/organization.md
- docs/framework/expert-evolution-2026-10/models.md
- docs/framework/expert-evolution-2026-10/expertise.md
- docs/framework/expert-evolution-2026-10/priority-research.md
- docs/framework/expert-evolution-2026-10/quality-review.md
- scripts/expert-evolution/expertise.cjs
- scripts/expert-evolution/catalog.cjs
- scripts/expert-evolution/model-policy.cjs
- research/expert-evolution/expert-profiles.json
- research/expert-evolution/source-program.json
- research/expert-evolution/jev-use-cases.json
- research/expert-evolution/model-policy.json
- research/expert-evolution/repository-map.json
- research/expert-evolution/priority-pack.json
- research/expert-evolution/priority-cases.json
- research/expert-evolution/benchmark-results.json
- research/expert-evolution/quality-review.json
- scripts/framework-evolution/runtime.cjs
- bin/lib/framework-evolution-delivery.js
- research/framework-evolution/sources.json
- research/framework-evolution/heuristics.json
- research/framework-evolution/competencies.json
- research/framework-evolution/plan-batch.json
- package.json
- scripts/sync-provider-adapters.js
- .codex/scripts/sync-codex-native.js
- squads/squad-cloning/agents/cloning-orqx.md
- squads/squad-cloning/agents/cognitive-extractor.md
- tests/unit/expert-evolution-expertise.test.js
- tests/unit/expert-evolution-catalog.test.js
- tests/unit/expert-evolution-model-policy.test.js
- tests/unit/expert-evolution-integration.test.js
- tests/unit/framework-evolution-knowledge.test.js
- tests/unit/framework-evolution-delivery.test.js

172 Codex TOML e172 Claude adapters regenerados; pointers canônicos preservados.

## Verification

178/178 testes em 14 suites; lint/typecheck, paridade, 17/17 YAML e validação dos programas passaram. Instalação em fixtures; 10 decisões reservadas, anterior18/20 e enriquecido20/20. Jev offline:18grupos/224perguntas, tetoUS$0,05 autorizado e chaveausente; nenhuma chamada ou cobrança. Verificação detalhada em docs/framework/expert-evolution-2026-10/verification.md.

## QA Results

PASS local: revisão independente fechou dois MEDIUM (datas e junction ancestral), verificou critérios reservados intactos e promoção bloqueada. Coorte final178/178,14suites verde; lint/typecheck,paridade,YAML,story,arquitetura,manifest,segredos,proveniência,dadospessoais e diff-check passaram. Nenhum perfil promovido; fontes lidas não comprovam corpus integral ou competência mundial. Checkpoint local, sem publicação ou instalação pessoal.
