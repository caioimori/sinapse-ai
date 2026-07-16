---
status: InReview
owner: sprint-lead
executor: developer
quality_gate: quality-gate
created: 2026-07-15
target_release: next
---

# Story: Instalacao canonica e README publico

## Status

InReview

## Story

Como pessoa que chega ao SINAPSE pelo npm ou GitHub, quero instalar tudo para
Claude Code e Codex com um unico comando e entender imediatamente o que o
framework entrega, para adotar o produto sem flags obscuras, informacao
desatualizada ou uma primeira impressao confusa.

## Scope

- Fazer `npx sinapse-ai@latest install` selecionar `both` por padrao em uma
  instalacao nova, inclusive em ambiente nao interativo.
- Manter `--llm=claude-code`, `--llm=codex` e `--llm=both` como escolhas
  explicitas; `--reconfigure` continua sendo o unico caminho que abre a
  escolha interativa.
- Atualizar `update` para usar `both` quando nao existir provider persistido.
- Reescrever os READMEs raiz em PT-BR e EN com a mesma estrutura, comandos
  canonicos, metricas medidas e referencias publicas reais.

## Acceptance Criteria

- [x] Sem flags, uma nova instalacao resolve `both`; Claude e Codex recebem
  suas superficies nativas completas.
- [x] Em ambiente nao interativo, o default tambem e `both` e nenhum prompt e
  aberto.
- [x] Flags de provider e configuracao existente continuam sendo respeitadas;
  `--reconfigure` permite alterar a selecao conscientemente.
- [x] Os READMEs PT-BR e EN apresentam o mesmo contrato publico: comando
  canonico, 17 squads, 172 agentes, 1.412 task files, 1.348 pointers
  resolviveis, 37 skills por provider e React Bits.
- [x] Nenhum README raiz recomenda comandos sem `@latest` para instalacao ou update.
- [x] Testes focados, lint, typecheck, validadores de documentacao e paridade
  passam; paths protegidos permanecem sem alteracao.

## Out of scope

- Alterar definicoes de agentes, tarefas, squads, Constitution ou paths
  protegidos.
- Remover a escolha explicita de provider para usuarios que precisam de apenas
  um CLI.
- Publicar ou fazer merge sem os gates de qualidade.

## Validation plan

1. Cobrir defaults de `promptLlmChoice` e de instalacao nova.
2. Validar os READMEs contra os contadores medidos por
   `resolve-codex-agent.js --stats`.
3. Rodar lint, typecheck, testes focados, validacao de docs e paridade.

## Handoff

Implementacao pronta para Quality Gate. `@devops` detem autoridade exclusiva
para PR, merge e release.

## Dev Agent Record

- Default alterado para `both` em instalacao nova, reconfiguracao nao interativa
  e update de instalacoes legadas sem provider persistido.
- A instalacao isolada sem `--llm` confirmou `metadata.llm=both`, superficies
  nativas de Claude Code e Codex e corpus React Bits.
- Gates executados: testes focados de instalacao, matriz dual-CLI,
  `validate:article-vii`, `validate:docs`, `validate:parity`, lint, typecheck,
  `npm pack --dry-run` e verificacao de paths protegidos.
