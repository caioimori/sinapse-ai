---
id: typesafe-mobbin-20261002
type: enhancement
status: InReview
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint]
created: 2026-10-02
epic: docs/framework/expert-evolution-2026-10/TYPESAFE-MOBBIN-SPEC.md
---

# Aplicar TypeSafe e orientar pesquisa de interfaces

## Status

InReview

## Story

Como mantenedor, quero a skill oficial TypeSafe instalada e aplicada, pesquisa Opus somente documental e aquisição Mobbin baseada em fluxos observados.

## Scope

Instalação única via skills CLI para Codex; fonte oficial auditada; documentação e configuração no worktree isolado. Um lote público de julgamentos Jev no playground autenticado dentro do piloto já autorizado de US$0,05, sem nova credencial, assinatura ou recarga. Uma fixture própria de transferência testa os mecanismos sem copiar mídia, incluindo mobile e contraexemplos. Preservar corpus privado, original, caminhos protegidos e evidências anteriores.

## Acceptance Criteria

- [x] AC1 — Given a fonte oficial MIT auditada, When skills CLI instala TypeSafe para Codex, Then o conteúdo corresponde ao SHA oficial após normalização CRLF/LF e as demais skills são preservadas.
- [x] AC2 — Given documentação atual e playground autenticado, When um lote limitado é avaliado, Then estado, perguntas, respostas observadas, custo e limites ficam registrados sem credencial exposta ou retry de resultado incerto.
- [x] AC3 — Given a correção de escopo do usuário, When política e pendências são atualizadas, Then Opus exige somente pesquisa de mercado e nenhuma execução API.
- [x] AC4 — Given Mobbin, When aquisição é tentada, Then padrões têm estados e locators observados ou bloqueio concreto, sem inventar acesso ou transferibilidade.
- [x] AC5 — Given mudanças delimitadas, When verificações passam, Then checkpoint distingue instalado, observado, candidato e publicado.

## Tasks

- [x] Auditar e instalar skill oficial por um método.
- [x] Aplicar perguntas tipadas a evidências públicas em lote limitado.
- [x] Atualizar aprendizado de mercado e escopo Opus.
- [x] Capturar fluxos disponíveis e preparar recuperação por competência.
- [x] Verificar preservação e salvar checkpoint.

## File List

- docs/stories/typesafe-mobbin-20261002.story.md
- docs/framework/expert-evolution-2026-10/TYPESAFE-MOBBIN-SPEC.md
- docs/framework/expert-evolution-2026-10/typesafe-mobbin-workflow.json

- docs/framework/expert-evolution-2026-10/HANDOFF.md
- docs/framework/expert-evolution-2026-10/PLAN.md
- docs/framework/expert-evolution-2026-10/typesafe-applied.md
- docs/framework/expert-evolution-2026-10/typesafe-installation.json
- docs/framework/expert-evolution-2026-10/typesafe-mobbin-verification.md
- docs/framework/expert-evolution-2026-10/typesafe-mobbin-verification.json
- docs/framework/expert-evolution-2026-10/market-model-learning.md
- docs/framework/expert-evolution-2026-10/market-model-learning.json
- docs/framework/expert-evolution-2026-10/mobbin-acquisition.md
- docs/framework/expert-evolution-2026-10/mobbin-acquisition.json
- docs/framework/expert-evolution-2026-10/mobbin-observed-learning.md
- docs/framework/expert-evolution-2026-10/mobbin-observed-learning.json
- examples/framework-quality/hub-data.json
- examples/framework-quality/transfer-filter/index.html
- examples/framework-quality/transfer-filter/verify.cjs
- research/expert-evolution/jev-pilot.json
- research/expert-evolution/model-policy.json

## Dev Agent Record

Execução autorizada pelo usuário em 2026-10-02; mudanças reversíveis isoladas. Publicação e criação de credenciais não fazem parte do escopo.

Prova: typesafe-mobbin-verification.md/.json; 49 regressões, 66 checks do autor e 54 independentes; oito inferências revisadas, cinco contextos ≤10.082 chars, preservação de 12.049 skills e 191 alterações originais. Status InReview conserva a revisão humana distinta da verificação local.
