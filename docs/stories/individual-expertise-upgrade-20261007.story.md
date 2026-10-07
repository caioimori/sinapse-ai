---
id: individual-expertise-upgrade-20261007
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint]
created: 2026-10-07
epic: docs/framework/expert-evolution-2026-10/PLAN.md
---

# Aprimorar todos os agentes por competência e evidência

## Status

InReview

## Story

Como mantenedor, quero aprofundar cada agente e testar suas decisões com casos específicos para usar conhecimento aprovado nos dois provedores.

## Scope

Perfis individuais, fontes primárias observadas, mecanismos/contextos, tarefas próprias, casos com outputs e revisão independente, recuperação seletiva, distribuição compartilhada e prévia/PR. Preservar fonte instalada e trabalho concorrente. Sem produção, remoção funcional, compra, API Anthropic ou extrapolação de créditos Jev.

## Acceptance Criteria

- [x] AC1 — Given os 172 IDs canônicos, When os perfis forem revisados individualmente, Then todos terão mecanismos, critérios e exceções específicos ou lacuna material identificada sem promoção automática.
- [x] AC2 — Given as fontes, When forem incorporadas, Then direitos, locator, trecho observado, inferências e candidatas serão distinguíveis e verificáveis.
- [x] AC3 — Given casos diagnósticos novos, When as coortes produzirem respostas, Then outputs, revisão independente, negativos e limites de inferência nativa estarão registrados por agente; casos da mesma coorte não serão chamados de avaliação cega ou execução isolada.
- [ ] AC4 — Given a integração compartilhada, When contexto for recuperado nos dois provedores, Then fontes autorizadas, autoridade, paridade e limites 12.000/6.000/3.000 passarão sem perda crítica.
- [ ] AC5 — Given orçamento e concorrência, When entrega/upgrade forem feitos, Then custos, CAS/rollback, original/fonte anterior, secrets/protected e checks proporcionais terão evidência; PR/prévia não significarão produção.

## Tasks

- [x] Pesquisar e aprofundar cada função em três coortes.
- [x] Integrar perfis/fontes e construir avaliação verificável.
- [x] Executar casos e revisão independente.
- [ ] Validar recuperação/distribuição e preservação.
- [ ] Salvar, enviar branch, abrir PR e conferir prévia.

## File List

- docs/stories/individual-expertise-upgrade-20261007.story.md
- docs/framework/expert-evolution-2026-10/EXPERTISE-UPGRADE-SPEC.md
- docs/framework/expert-evolution-2026-10/expertise-upgrade-workflow.json
- docs/framework/expert-evolution-2026-10/EXPERTISE-UPGRADE-HANDOFF.md
- docs/framework/expert-evolution-2026-10/EXPERTISE-RUNTIME-INTEGRATION-QA.md
- docs/framework/expert-evolution-2026-10/expertise-upgrade-adr.md
- docs/framework/expert-evolution-2026-10/CLOSEOUT-VERIFICATION.md
- docs/framework/expert-evolution-2026-10/HANDOFF.md
- docs/framework/expert-evolution-2026-10/PLAN.md
- research/expert-evolution/competence-packs/creative.json
- research/expert-evolution/competence-packs/business.json
- research/expert-evolution/competence-packs/knowledge.json
- research/expert-evolution/competence-review.json
- research/expert-evolution/competence-runtime.json
- research/expert-evolution/expert-profiles.json
- research/expert-evolution/source-program.json
- research/expert-evolution/task-bindings.json
- scripts/expert-evolution/competence.cjs
- scripts/expert-evolution/expertise.cjs
- scripts/framework-evolution/project-expert-upgrade.cjs
- scripts/framework-evolution/project-expert-install.cjs
- scripts/framework-evolution/project-expert.cjs
- scripts/framework-evolution/runtime.cjs
- tests/unit/expert-evolution-competence.test.js
- tests/unit/expert-evolution-expertise.test.js
- tests/unit/operational-contracts.test.js
- tests/unit/project-expert-context.test.js
- examples/framework-quality/hub-data.json
- examples/framework-quality/hub.js
- examples/framework-quality/index.html
- examples/framework-quality/verify-hub.cjs
- examples/framework-quality/contract-builder/UI-CONTRACT.md
- examples/framework-quality/contract-builder/index.html
- examples/framework-quality/contract-builder/styles.css
- examples/framework-quality/contract-builder/model.js
- examples/framework-quality/contract-builder/app.js
- examples/framework-quality/contract-builder/model.test.cjs
- examples/framework-quality/contract-builder/verify.cjs
- examples/framework-quality/contract-builder/README.md

## Dev Agent Record

Retomada YOLO autorizada. Esforço high, três frentes independentes, checkpoints privados e nenhuma promoção por quantidade.

## QA Results

Revisão semântica independente ciclo 3: 172 PASS diagnósticos, zero REVISE/BLOCKED. Três coortes Codex/Sol 6.1/high produziram os casos e respostas; sem avaliação cega, 172 personas isoladas, inferência Claude/Opus ou ganho causal. `validatedExpertise=false` preservado.

Matriz local final: 172 agentes, critérios completos; máximos 11.602/5.990/2.997 caracteres. Testes focais finais: 124 PASS, zero FAIL, um skip declarado, cinco suítes PASS. O skip evita repetir a matriz histórica redundante; a matriz completa atual passou. Paridade de adapters 172 agentes/38 skills, registry 9/66, manifest e workflow passaram. Scan de 611 arquivos: zero achados; nenhum caminho protegido, exclusão funcional ou input privado no diff.

Hook real `validate:all`: primeira execução com sete referências editoriais; correção preservou fatos e atribuição técnica, nova execução 13/13 PASS. Metadados da story passaram. Sem alteração nos validators/hooks nem bypass.

UI local: revisão manual 1440/390 sem overflow e confirmação focal de Desfazer no hash final. Cinco testes do compilador e 13 checks browser anteriores têm hashes/limites no README; não provam replay integral do byte final.

A metadata `projectLink` produziu 12.294 caracteres no caso animation-performance-engineer; gateway reparado e regressão 32/32 PASS. A matriz instalada em HOME scratch passou 172/172 com máximos 11.865/5.990/2.997. Gateway final SHA `bd730caa879cede501c633eb48ec903a5707e35dad002c0abc06db58c388fb39`, owner congelado; a matriz raw anterior não substitui essa prova.

CAS pessoal, readback dos dois provedores, preservação final, push/PR e prévia atualizada aguardam conclusão. Vermelhos intermediários permanecem privados; suíte integral/CI e publicação em produção não foram exigidos nem aprovados.
