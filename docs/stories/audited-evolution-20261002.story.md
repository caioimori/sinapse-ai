---
id: audited-evolution-20261002
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint, tsc, playwright, ffmpeg]
created: 2026-10-02
epic: docs/framework/expert-evolution-2026-10/AUDITED-SPEC.md
---

# Corrigir o plano e executar a evolução orientada a entregáveis

## Status

InReview

## Story

Como mantenedor, quero que a auditoria altere a execução antes de expandir o framework, com conhecimento pertinente e produtos reais verificáveis.

## Scope

AUDITED-SPEC.md e audited-workflow.json. Extensões e squads permitidas na worktree isolada; preservar fontes e checkout original. Sem paths protegidos, publicação, instalação pessoal, remoção ou gasto além do piloto já autorizado US$ 0,05. Não promover os 172 agentes pela associação com fixtures.

## Acceptance Criteria

- [x] AC1 — Given a auditoria multidisciplinar, When o plano é corrigido, Then decisões, limitações, prioridade por entregável e backlog têm vínculo com os achados.
- [x] AC2 — Given tarefa e briefing, When runtime seleciona suplemento, Then há binding explícito, critérios críticos preservados e lacunas para correspondência ausente dentro dos limites.
- [x] AC3 — Given os perfis canônicos, When contratos são verificados, Then mapeamento posicional é removido e slogans/metadados não viram competências ou entregáveis.
- [x] AC4 — Given extração concorrente ou reiniciada, When Jev é solicitado em mock, Then reserva durável e exclusão por chave impedem gasto duplicado e cobrança incerta bloqueia retry.
- [x] AC5 — Given falha no bundle ou receipt, When entrega/recovery roda em fixture, Then restaura estado anterior sem sobrescrever alteração concorrente.
- [x] AC6 — Given modelo com evidência futura, expirada ou não resolvível, When política é avaliada, Then falha explicitamente e disponibilidade não equivale a promoção.
- [x] AC7 — Given quatro briefs próprios congelados, When artefatos são produzidos e revisados, Then há exportações reais, hashes, screenshots 1440/390px sem overflow e parecer independente delimitado.
- [x] AC8 — Given captura e mecanismo candidato, When revisão independente autoriza delta, Then corpus persistente recebe somente evidência validada com CAS, sem conhecimento privado em pacote público.
- [x] AC9 — Given necessidade por entregável, When navegação e feedback são consultados, Then trilha canônica resolve e aquisição responde a falha observada, sem remoção física.
- [x] AC10 — Given integração concluída, When gates aplicáveis são executados, Then limites, testes, preservação e estado local constam no handoff verificável.

## Tasks

- [x] Corrigir contexto e contratos.
- [x] Corrigir custo, modelo e entrega.
- [x] Produzir/revisar quatro fixtures e corrigir dogmas criativos.
- [x] Integrar extração persistente, navegação e aprendizagem.
- [x] Verificar e salvar checkpoint local.

## File List

- docs/framework/expert-evolution-2026-10/AUDITED-SPEC.md
- docs/framework/expert-evolution-2026-10/audited-workflow.json
- docs/stories/audited-evolution-20261002.story.md
- docs/framework/expert-evolution-2026-10/audited-verification.md e HANDOFF.md
- scripts/expert-evolution/{expertise,model-policy,catalog,extraction,feedback}.cjs
- scripts/framework-evolution/{runtime,knowledge,jev}.cjs
- bin/lib/framework-evolution-delivery.js
- .codex/scripts/sync-codex-native.js e scripts/sync-provider-adapters.js; 172 adapters por provider
- research/expert-evolution: perfis, programa, bindings, política/receipt, navegação e parecer auditado
- squads/squad-design/agents/{dx-ui-designer,dx-frontend-engineer,platform-aesthetic-director}.md
- squads/squad-animations/agents/animation-performance-engineer.md e squads/squad-content/agents/content-engineer.md
- examples/framework-quality: 28 fontes editáveis; outputs ignorados
- tests/unit: bindings, reliability, persistent-learning, observed-review e suites adjacentes
- package.json, .gitignore, eslint.config.js e scripts/validate-no-external-refs.js

## QA Results

Ready validado antes do código; 10/10 ACs Given/When/Then. Implementação local: 229/229 testes em 18 suites, lint/typecheck separados, paridade/YAML, preservation e guards aprovados. Gate de proveniência adicional: 27/27.

Parecer independente: achados técnicos fechados, UI/carrossel 91; áudio e reprodução contínua CONCERNS, Reel sem nota total. Uma entrada técnica própria persistida/repetida/recuperada, zero API e promoção. InReview conserva o limite de aprovação audiovisual/humana.

Evidência detalhada em `audited-verification.md`, `audited-quality-review.md/json` e nos receipts locais ignorados. Nenhum deploy, instalação pessoal ou atualidade/expertise universal foi afirmado.
