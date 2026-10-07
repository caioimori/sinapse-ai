---
id: operational-evolution-20261002
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint, playwright]
created: 2026-10-02
epic: docs/framework/expert-evolution-2026-10/OPERATIONAL-SPEC.md
---

# Tornar a evolução compreensível e avançar pendências verificáveis

## Status

InReview

## Story

Como mantenedor, quero visualizar o estado real da evolução e usar as melhorias nos destinos compatíveis, sem confundir exemplos com capacidades comprovadas.

## Scope

OPERATIONAL-SPEC.md e operational-workflow.json. Preview, contratos prioritários, auditoria de organização e instalação de extensão compatível. Preservar original, paths protegidos, dados e trabalho concorrente; nenhum publish/deploy/remoção funcional.

## Acceptance Criteria

- [x] AC1 — Given o preview confuso, When abro a entrada, Then compreendo o estado, as evidências e as pendências, com links funcionais e sem overflow em desktop/390px.
- [x] AC2 — Given funções prioritárias candidatas, When contrato é revisado, Then binding aponta tarefa canônica e critérios observáveis, sem promoção indevida.
- [x] AC3 — Given instalação pessoal existente, When compatibilidade é auditada, Then extensão aplicada tem backup, precondições e readback ou bloqueio concreto registrado.
- [x] AC4 — Given 14 clusters idênticos, When consumidores são analisados, Then cada cluster recebe decisão fundamentada e nada funcional é apagado.
- [x] AC5 — Given serviços e evidência disponíveis, When verificações são concluídas, Then acesso observado, custo, mídia não percebida e comparação não realizada permanecem distintos no checkpoint.
- [x] AC6 — Given seis interfaces reservadas e contextos congelados, When outputs pareados são renderizados, Then comparação independente registra comportamento, screenshots e limites deste lote sem promoção global.

## Tasks

- [x] Corrigir a entrada do preview.
- [x] Revisar contratos prioritários.
- [x] Completar seis tarefas ausentes prioritárias de design com bindings explícitos.
- [x] Auditar/aplicar instalação compatível.
- [x] Auditar clusters e serviços.
- [x] Produzir e comparar seis pares de interfaces reservadas.
- [x] Verificar integração e salvar checkpoint.

## File List

- .codex/scripts/resolve-codex-agent.js
- AGENTS.md
- docs/framework/expert-evolution-2026-10/HANDOFF.md
- docs/framework/expert-evolution-2026-10/OPERATIONAL-SPEC.md
- docs/framework/expert-evolution-2026-10/PLAN.md
- docs/framework/expert-evolution-2026-10/design-task-completion.json
- docs/framework/expert-evolution-2026-10/design-task-completion.md
- docs/framework/expert-evolution-2026-10/operational-folder-audit.json
- docs/framework/expert-evolution-2026-10/operational-folder-audit.md
- docs/framework/expert-evolution-2026-10/operational-services.md
- docs/framework/expert-evolution-2026-10/operational-verification.md
- docs/framework/expert-evolution-2026-10/operational-workflow.json
- docs/framework/expert-evolution-2026-10/paired-interface-results.json
- docs/framework/expert-evolution-2026-10/paired-interface-results.md
- docs/framework/expert-evolution-2026-10/personal-distribution.json
- docs/framework/expert-evolution-2026-10/personal-distribution.md
- docs/framework/expert-evolution-2026-10/priority-contracts-review.json
- docs/framework/expert-evolution-2026-10/priority-contracts-review.md
- docs/stories/operational-evolution-20261002.story.md
- examples/framework-quality/README.md
- examples/framework-quality/hub-data.json
- examples/framework-quality/hub.css
- examples/framework-quality/hub.js
- examples/framework-quality/index.html
- examples/framework-quality/verify-hub.cjs
- research/expert-evolution/expert-profiles.json
- research/expert-evolution/paired-interface-protocol.json
- research/expert-evolution/source-program.json
- research/expert-evolution/task-bindings.json
- scripts/expert-evolution/personal-distribution.cjs
- squads/squad-content/agents/content-analyst.md
- squads/squad-content/agents/editorial-strategist.md
- squads/squad-design/agents/cro-persuasion.md
- squads/squad-design/agents/design-system.md
- squads/squad-design/agents/platform-aesthetic-director.md
- squads/squad-design/agents/premium-packaging-strategist.md
- squads/squad-design/agents/product-surface-director.md
- squads/squad-design/agents/ux-designer.md
- squads/squad-design/tasks/build-component.md
- squads/squad-design/tasks/consult-canon.md
- squads/squad-design/tasks/create-cro-patterns.md
- squads/squad-design/tasks/design-product-surface.md
- squads/squad-design/tasks/premium-packaging-brief.md
- squads/squad-design/tasks/ux-create-wireframe.md
- tests/unit/expert-evolution-bindings.test.js
- tests/unit/framework-evolution-delivery.test.js
- tests/unit/framework-evolution-runtime.test.js
- tests/unit/operational-contracts.test.js
- tests/unit/personal-distribution.test.js

## QA Results

Ready foi validado antes do código. Coorte final 324/324 em 22 suites; guard de autoria 27/27; painel com 27 checks e readback desktop/390/320. Instalação: 51 contextos, 262 payload hashes, 172 canônicas e 460 entradas preservadas. Revisão cega: 225 checks, quatro preferências aprimorado/dois empates, sem promoção. Bloqueios e skips em operational-verification.md; sem publicação ou aprovação audiovisual total.
