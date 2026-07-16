---
status: InReview
owner: sprint-lead
executor: developer
quality_gate: quality-gate
created: 2026-07-16
target_release: next
---

# Story: Canonical SNPS AI README wordmark

## Status

InReview

## Story

Como pessoa avaliando o SINAPSE AI pelo GitHub, quero encontrar no topo do
README a mesma marca `SNPS AI` exibida pelo instalador, para reconhecer o
produto sem uma ilustracao generica ou uma reinterpretacao da identidade.

## Scope

- Substituir o hero ilustrado dos READMEs PT-BR e EN pelo wordmark ASCII
  canonico definido em `bin/lib/header.js`.
- Remover do repositorio o hero generico que deixou de representar o produto.
- Preservar badges, navegacao, proposta de valor e paridade entre idiomas.
- Corrigir os nomes de inputs incompativeis encontrados no workflow publico de
  boas-vindas durante a validacao do PR.

## Acceptance Criteria

- [x] AC1: Given `README.md` e `README.en.md`, When o topo e comparado ao
  instalador, Then as seis linhas do wordmark `SNPS AI` sao identicas.
- [x] AC2: Given os READMEs publicos, When suas midias sao inspecionadas, Then
  nenhuma imagem gerada ou hero generico e referenciado.
- [x] AC3: Given o ativo rejeitado, When `main` e consultada, Then
  `docs/assets/sinapse-ai-github-hero.png` nao existe.
- [x] AC4: Given a troca do wordmark, When o restante dos READMEs e comparado,
  Then badges, links e comandos de instalacao permanecem inalterados.
- [x] AC5: Given a mudanca documental, When os gates aplicaveis sao executados,
  Then Markdown, rastreabilidade e metricas passam.
- [x] AC6: Given o checkout original e os paths L1/L2, When o diff e auditado,
  Then nenhuma alteracao preexistente ou protegida e modificada.
- [x] AC7: Given o workflow `welcome`, When uma issue ou um PR e aberto, Then a
  action pinada recebe os inputs documentados sem falhar.

## Out of scope

- Redesenhar a identidade visual do SINAPSE AI.
- Gerar uma nova imagem de marca sem um ativo visual canonico aprovado.
- Alterar o banner ou o comportamento do instalador.

## Validation Plan

1. Comparar programaticamente as seis linhas dos READMEs com
   `bin/lib/header.js`.
2. Confirmar a ausencia de referencias ao hero removido nas superficies de
   entrada publica.
3. Executar os gates de documentacao, Articles IV/VII e qualidade aplicaveis.
4. Validar o YAML do workflow e comprovar a execucao remota no PR.

## Dev Agent Record

- Correcao executada em worktree isolado baseado em `main`.
- O wordmark foi reutilizado diretamente da implementacao canonica; nenhuma
  imagem nova foi gerada.
- A API oficial de Markdown do GitHub preservou o bloco centralizado nos dois
  idiomas e confirmou a ausencia do hero removido.
- Gates aprovados: wordmark 6/6, docs 28/28, Article VII, 13/13 guards e
  release-readiness 11/11. O lint terminou sem erros; warnings preexistentes
  permaneceram fora do escopo.
- A primeira execucao remota revelou os inputs legados com hifen no workflow
  `welcome`; os tres nomes foram atualizados para a interface da action v3.

## File List

- `README.md`
- `README.en.md`
- `.github/workflows/welcome.yml`
- `docs/assets/sinapse-ai-github-hero.png` (deleted)
- `docs/stories/snpsai-readme-wordmark.story.md`
