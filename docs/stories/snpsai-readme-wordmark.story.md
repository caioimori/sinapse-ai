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

- [x] AC1: `README.md` e `README.en.md` exibem exatamente as seis linhas do
  wordmark `SNPS AI` usado pelo instalador.
- [x] AC2: Nenhum README referencia imagem gerada ou hero generico.
- [x] AC3: O ativo `docs/assets/sinapse-ai-github-hero.png` e removido.
- [x] AC4: Badges, links e comandos de instalacao permanecem inalterados.
- [x] AC5: Validacoes de Markdown, documentacao, rastreabilidade e metricas
  passam antes da entrega.
- [x] AC6: Nenhum path protegido L1/L2 ou alteracao preexistente do worktree
  original e modificado.
- [x] AC7: O workflow `welcome` usa os inputs documentados pela action pinada e
  nao falha ao receber uma nova issue ou um novo pull request.

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
