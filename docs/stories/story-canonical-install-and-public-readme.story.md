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

- [x] Given uma nova instalacao sem flags, When o provider e resolvido, Then
  `both` instala as superficies nativas completas de Claude e Codex.
- [x] Given um ambiente nao interativo, When a instalacao roda sem flags, Then
  o default e `both` e nenhum prompt e aberto.
- [x] Given flags ou configuracao existente, When a selecao e resolvida, Then
  ela e respeitada e `--reconfigure` permite uma mudanca consciente.
- [x] Given os READMEs PT-BR e EN, When o contrato publico e comparado, Then
  comando, metricas, skills e React Bits permanecem equivalentes.
- [x] Given os READMEs raiz, When comandos de instalacao e update sao auditados,
  Then nenhum deles omite `@latest`.
- [x] Given a implementacao concluida, When os gates aplicaveis sao executados,
  Then testes, lint, typecheck, docs e paridade passam sem alterar paths protegidos.

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
