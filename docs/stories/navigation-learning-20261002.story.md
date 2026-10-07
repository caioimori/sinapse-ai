---
id: navigation-learning-20261002
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint]
created: 2026-10-02
epic: docs/framework/expert-evolution-2026-10/PLAN.md
---

# Aprendizado de continuidade de navegação

## Status

InReview

## Story

Como mantenedor, quero observar navegação lista/detalhe/criação, testar uma transferência própria e consolidar somente mecanismos com evidência independente, preservando créditos e trabalhos anteriores.

## Scope

Uma família nova e no máximo dois fluxos Mobbin com 24 estados por fluxo. Notas próprias, capturas privadas, cinco bindings existentes. Uma fixture de manutenção predial fictícia, sem serviço remoto. Jev opcional em um único lote, pré-reserva durável no teto compartilhado US$0,05 e saldo observado US$3,92, sem recarga ou nova credencial. Máximo três ciclos de QA. Sem remoção, publicação, protected paths ou alteração do original.

## Acceptance Criteria

- [x] AC1 — Given créditos e ledger atuais, When Jev é considerado, Then reserva anterior e limite compartilhado impedem exceder os créditos; chamada opcional, cache e resposta incerta não são repetidos automaticamente.
- [x] AC2 — Given acesso Mobbin, When dois jobs são inspecionados, Then fatos, locators, hashes, direitos e limites de viewer-order-only ficam explícitos.
- [x] AC3 — Given fixture própria, When navegação e criação são exercitadas, Then entrada direta, retorno, estado inválido, cancelamento, erro e sucesso têm destinos distintos em desktop/390/320 sem overflow.
- [x] AC4 — Given revisão independente, When mecanismo é consolidado, Then CAS/readback/replay e contexto delimitado preservam fonte, exceção, corpus privado e ausência de promoção de expertise.

## Tasks

- [x] Auditar custo e saldo sem criar credenciais.
- [x] Observar dois jobs e formar candidatos por competência.
- [x] Produzir e revisar fixture própria.
- [x] Consolidar somente aprovados e salvar checkpoint.

## File List

- .gitignore
- docs/stories/navigation-learning-20261002.story.md
- docs/framework/expert-evolution-2026-10/navigation-learning.md
- docs/framework/expert-evolution-2026-10/navigation-learning.json
- docs/framework/expert-evolution-2026-10/HANDOFF.md
- examples/framework-quality/transfer-navigation/index.html
- examples/framework-quality/transfer-navigation/verify.cjs

## Dev Agent Record

Autorização direta do usuário para continuidade no preview; saldo e orçamento tratados como limites, sem assinatura ou recarga. Projeto principal e caminhos protegidos são preservados.

Verificação local: 81 checks do autor, 141 independentes, 49 regressões; 1440/390/320 sem overflow. Três inferências privadas consolidadas, nove anteriores preservadas; replay zero, cinco comandos e três consultas dirigidas até 8.496/12.000 caracteres. Jev: uma tentativa nova, nove julgamentos, custo calculado US$0,000095802; total US$0,00018375, reserva acumulada US$0,005376/0,05. Revisão fraca fica explícita, sem promoção. Fonte Square apenas viewer-order-only; dados fictícios em memória.
