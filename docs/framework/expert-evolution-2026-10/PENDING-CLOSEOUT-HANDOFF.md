# Pendências do framework — estado vigente

Lote autorizado por Caio em 07.10.2026: corrigir as pendências, com evidência e sem produção. Fonte de trabalho: `framework-pending/sinapse-ai`, branch `codex/fix/framework-pending-clean-20261007`. A [story](../../stories/framework-pending-20261007.story.md), [spec](PENDING-CLOSEOUT-SPEC.md) e [workflow](pending-closeout.workflow.json) estão validados; resultados abaixo são atualizados somente após observação.

## Concluído localmente

- Reparos em 17 arquivos de testes: transporte por byte stream real, projeção de saída, contratos de autoridade/delegação, distribuição e contagens atuais. Nenhum skip, suppress ou negativo removido. Sintaxe, lint focal e probes delimitados passaram; suíte completa após patch ainda depende do CI remoto.
- Segurança: leitura/escrita por descritor, validação dos mesmos bytes consumidos, limites e identidade de arquivo/pais. Revisão independente passou em sete cenários de I/O e 12 checks do guard. Isso não prova isolamento contra quem controla todo o sistema de arquivos.
- Dependência `braces`: fork local MIT com identidade própria, profundidade e orçamento de nós; consumidores reais conferidos e audit da instalação de produção sem achados. O scanner não revisa a implementação do fork. [Advisory oficial sem versão corrigida](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- Quatro JSON públicos conservam seus 38 digests e todos os dados, representando hashes derivados como `cacheIdentity`. A equivalência foi revisada sem exceção ao scanner. A faixa histórica será verificada na nova PR; a PR #416 e todos os históricos permanecem preservados.
- Navegação em 1440/390: busca e URLs codificadas, criação/detalhe/histórico, filtros e retorno ao foco passaram; marcador HTML inerte permaneceu literal, sem elemento inserido. Zero overflow horizontal observado.
- Reel: reprodução técnica contínua de 0 a 18 segundos, `ended=true`, sem seek, pausa ou erro. Audição humana é opcional e não bloqueia o framework; não foi alegada aprovação musical.

## Avaliação nativa

Claude Code 2.1.293 utilizou o acesso OAuth Team existente e reportou `claude-sonnet-5-5`. Uma chamada terminou por orçamento, sem conteúdo de resposta: disponibilidade do CLI/modelo foi observada, mas recepção do contexto e decisão não foram comprovadas. Estimativa de lista US$ 0,213404, apesar do parâmetro US$ 0,05; não é fatura nem comprovação de cobrança incremental. Não houve repetição, API Opus ou nova chamada Jev.

O [benchmark Codex](PENDING-NATIVE-BENCHMARK.md) terminou com 18/20 casos aprovados no baseline e 19/20 no enriquecido. Dois geradores distintos e o reviewer receberam os 20 casos integrais, sem truncamentos; 200 julgamentos foram conferidos e congelados antes do unblinding. A primeira rodada permaneceu `NOT_QUALIFIED`, preservada sem pontuação primária.

Um caso arquitetural melhorou pelo critério de rollback observável. Em P02, ambos omitiram o ticket solicitado pela rubrica, apesar de esse campo não estar explicitamente solicitado no brief; a divergência limita a interpretação, sem reavaliar os escores. O protocolo da rodada 2 permanece `692ffda4af8364f8fb170a6f8b38528845fc5eaf9babdd7e781b4a60bbab365c`. A configuração foi GPT-6.1-sol/high; backend efetivo não observado independentemente. Nenhuma promoção de expertise ou ganho causal/global foi declarada.

## Preservação e instalação

A instalação real anterior continua na fonte `104c516d`, com 1.928 pins, 42 contextos offline selecionados e paridade Codex/Claude. Os três históricos de fonte são preservados. Este lote ainda não executou nova CAS; não confundir reparo local com instalação pessoal atualizada.

Os 262 payloads pessoais e as 193 entradas preexistentes do checkout original ficam fora do write set. Nova instalação exige snapshots, journal, readback dos dois provedores e prova de preservação. Não alterar bytes de fontes instaladas anteriores, mesmo para atualizar documentação.

## Resultado remoto da primeira rodada

PR [#417](https://github.com/caioimori/sinapse-ai/pull/417), head `e7b73b92dcb8d9de46d4d0c640bd780df565536f`: segredos e audit de produção passaram. O check autoritativo CodeQL concluiu SUCCESS, com zero novo alerta na mudança desta PR; isso não certifica todo o repositório.

Node 24/coverage tiveram quatro falhas em três suites, com 12.043 testes aprovados. Windows teve as mesmas quatro falhas, com 12.044 aprovados; macOS teve sete falhas em quatro suites, com 12.040 aprovados. Permaneceram 185 skips e oito todo preexistentes. Node 20 foi cancelado por fail-fast; não conta como aprovação.

A segunda correção local endereça as causas: 238 referências locais agora são traduzidas e entregues no layout global real; validação do Claude exclusivo não exige o Codex ausente; raízes das fixtures Mac são físicas; os testes de troca de diretório interceptam a aquisição atual por descritor. Probes reais, sintaxe e lint passaram. Novo resultado remoto ainda não foi observado.

O audit completo de `e7` encontrou nove avisos, sete HIGH e dois moderados, apesar do gate de produção aprovado. O refresh focal local reduziu a árvore a cinco avisos bundled de desenvolvimento, três HIGH e dois moderados; não é audit remoto nem zero vulnerabilidades. O [ADR de dependências](DEPENDENCY-BUNDLE-ADR.md) delimita o reparo dos cinco componentes, com identidade própria e licenças, antes de promover o novo pacote.

## Próxima etapa

1. Promover a alias do fork de desenvolvimento após a revisão estática independente e conferir os consumidores realmente instalados no CI. Candidato `c27f314b93b1d64cd744393914868615c0ac01353983520e3cc8bdacf79cb91d`, 3.159.244 bytes: seis integridades/licenças, cinco árvores patched, 1.923 arquivos originais iguais e 92 deltas delimitados. Scratch lock-only teve zero avisos; instalação real ainda não foi observada.
2. Enviar a segunda correção e observar CodeQL, segredos, audit, Node24, Windows, macOS, Node20 e coverage por SHA. Sem CI/config/hook bypass. A comparação cega já terminou e seus dois artefatos públicos estão sanitizados.
3. Aplicar CAS da fonte estável, conferir preservação e finalizar o painel em 1440/390.

Com menos de 10 GB livres no C:, não executar build/suíte/e2e local. Validação pesada usa os checks remotos existentes. Sem Docker/WSL, remoção de conteúdo, merge, NPM publish ou produção.

Provas privadas deste lote: `examples/framework-quality/output/pending-20261007/`, em especial `independent-review/QA-Results.md`, `navigation-qa/receipt.json`, `media-qa/receipt.json`, `native-evaluation/` e os receipts de branch/dependência. Esses artefatos não são servidos pela prévia nem enviados ao Git.

[Prévia local](http://127.0.0.1:4187/#pendencias). O servidor persistente pertence a esta fonte e foi conferido em HTTP; isso não equivale a publicação em produção.
