# Pendências do framework — estado vigente

Lote autorizado por Caio em 07.10.2026: corrigir as pendências, com evidência e sem produção. Fonte de trabalho: `framework-pending/sinapse-ai`, branch `codex/fix/framework-pending-clean-20261007`. A [story](../../stories/framework-pending-20261007.story.md), [spec](PENDING-CLOSEOUT-SPEC.md) e [workflow](pending-closeout.workflow.json) estão validados; resultados abaixo são atualizados somente após observação.

## Concluído localmente

- Reparos em 17 arquivos de testes: transporte por byte stream real, projeção de saída, contratos de autoridade/delegação, distribuição e contagens atuais. Nenhum skip, suppress ou negativo removido. Sintaxe, lint focal, probes e suíte completa no CI remoto passaram na fonte `bee125db`.
- Segurança: leitura/escrita por descritor, validação dos mesmos bytes consumidos, limites e identidade de arquivo/pais. Revisão independente passou em sete cenários de I/O e 12 checks do guard. Isso não prova isolamento contra quem controla todo o sistema de arquivos.
- Dependência `braces`: fork local MIT com identidade própria, profundidade e orçamento de nós; consumidores reais conferidos e audit da instalação de produção sem achados. O scanner não revisa a implementação do fork. [Advisory oficial sem versão corrigida](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- Quatro JSON públicos conservam seus 38 digests e todos os dados, representando hashes derivados como `cacheIdentity`. A equivalência foi revisada sem exceção ao scanner. A faixa histórica da nova PR passou no Gitleaks; a PR #416 e todos os históricos permanecem preservados.
- Navegação em 1440/390: busca e URLs codificadas, criação/detalhe/histórico, filtros e retorno ao foco passaram; marcador HTML inerte permaneceu literal, sem elemento inserido. Zero overflow horizontal observado.
- Reel: reprodução técnica contínua de 0 a 18 segundos, `ended=true`, sem seek, pausa ou erro. Audição humana é opcional e não bloqueia o framework; não foi alegada aprovação musical.

## Avaliação nativa

Claude Code 2.1.293 utilizou o acesso OAuth Team existente e reportou `claude-sonnet-5-5`. Uma chamada terminou por orçamento, sem conteúdo de resposta: disponibilidade do CLI/modelo foi observada, mas recepção do contexto e decisão não foram comprovadas. Estimativa de lista US$ 0,213404, apesar do parâmetro US$ 0,05; não é fatura nem comprovação de cobrança incremental. Não houve repetição, API Opus ou nova chamada Jev.

O [benchmark Codex](PENDING-NATIVE-BENCHMARK.md) terminou com 18/20 casos aprovados no baseline e 19/20 no enriquecido. Dois geradores distintos e o reviewer receberam os 20 casos integrais, sem truncamentos; 200 julgamentos foram conferidos e congelados antes do unblinding. A primeira rodada permaneceu `NOT_QUALIFIED`, preservada sem pontuação primária.

Um caso arquitetural melhorou pelo critério de rollback observável. Em P02, ambos omitiram o ticket solicitado pela rubrica, apesar de esse campo não estar explicitamente solicitado no brief; a divergência limita a interpretação, sem reavaliar os escores. O protocolo da rodada 2 permanece `692ffda4af8364f8fb170a6f8b38528845fc5eaf9babdd7e781b4a60bbab365c`. A configuração foi GPT-6.1-sol/high; backend efetivo não observado independentemente. Nenhuma promoção de expertise ou ganho causal/global foi declarada.

## Revalidação pública

A base open source foi revalidada em 07.10 pelos registros npm e API GitHub: ambos os pacotes continuam em 5.4.1. O wrapper informa `4ef6530f`; o pacote core informa `70456b32`. Os nomes oficiais, URLs e campos completos permanecem no [registro canônico de proveniência](../../../research/expert-evolution/audit-upstream-recheck.json), em `rechecks[0]`; a [ponte verificável](PENDING-UPSTREAM-RECHECK.json) registra path, JSONpointer e hash. Não foi observada release nova, nem importado código protegido. Metadados de release não provam igualdade da base SINAPSE com todo o upstream.

## Preservação e instalação

A fonte `bee125db9a83e7ff13f8de3b879c10360e60c4b1` foi aplicada por CAS e conferida: 1.929 pins, 42 contextos offline selecionados, 21 IDs em dois projetos e quatro negativos rejeitados. Entradas Codex/Claude byte-equivalentes; máximos de 11.741 caracteres totais, 5.611 de conhecimento e 2.969 de perfil. Não houve execução nativa dos 172 agentes.

Transação `68d5e15c-32a2-4b96-b595-4e031b8fc9fe`; registry `88fa7de2ce0dcdd67418ac68b9ab9c2869264a8953f491fa6d113bbf1e18187d`. Journal `6736f80155a8c8f0ea413cd49bfea82a27bb27d44e1a259483f6bdb69d912a93` e snapshot `6a260cee0362b7dda2aecfda561719f2ad35a76d1bacb09a00702c77b7bea293` conferidos; rollback não executado.

Os 262 payloads pessoais e as 193 entradas preexistentes do checkout original foram preservados. Três fontes históricas e dois journals/snapshots anteriores passaram no readback; nenhuma biblioteca privada foi copiada. A fonte instalada fica congelada: ajustes posteriores de documentação estão fora dos 1.929 pins.

## Resultado remoto da primeira rodada

PR [#417](https://github.com/caioimori/sinapse-ai/pull/417), head `e7b73b92dcb8d9de46d4d0c640bd780df565536f`: segredos e audit de produção passaram. O check autoritativo CodeQL concluiu SUCCESS, com zero novo alerta na mudança desta PR; isso não certifica todo o repositório.

Node 24/coverage tiveram quatro falhas em três suites, com 12.043 testes aprovados. Windows teve as mesmas quatro falhas, com 12.044 aprovados; macOS teve sete falhas em quatro suites, com 12.040 aprovados. Permaneceram 185 skips e oito todo preexistentes. Node 20 foi cancelado por fail-fast; não conta como aprovação.

A segunda correção endereçou as causas: 238 referências locais foram traduzidas e entregues no layout global real; validação do Claude exclusivo não exige o Codex ausente; raízes das fixtures Mac são físicas; os testes de troca de diretório interceptam a aquisição atual por descritor. Probes reais, sintaxe e lint passaram; resultado remoto final abaixo.

O audit completo de `e7` encontrou nove avisos, sete HIGH e dois moderados, apesar do gate de produção aprovado. O refresh focal local reduziu a árvore a cinco avisos bundled de desenvolvimento, três HIGH e dois moderados; não é audit remoto nem zero vulnerabilidades. O [ADR de dependências](DEPENDENCY-BUNDLE-ADR.md) delimita o reparo dos cinco componentes, com identidade própria e licenças, antes de promover o novo pacote.

## Resultado remoto final e limites

Na fonte `bee125db`, a PR #417 concluiu 37 checks aprovados, um skip da regra existente de full cross-platform e zero falhas. Node 20, Node 24, coverage Node 22 e macOS passaram em 442 suites, com 12.050 testes aprovados por execução; Windows passou com 12.051. Os 185 skips e oito todo de cada execução são preexistentes.

O fork de desenvolvimento foi instalado e exercitado nos cinco jobs. Artefato `c27f314b93b1d64cd744393914868615c0ac01353983520e3cc8bdacf79cb91d`, 3.159.244 bytes: seis integridades/licenças, cinco árvores corrigidas, 1.923 arquivos originais iguais e 92 deltas delimitados. Audit remoto de produção e árvore completa: zero vulnerabilidades reportadas. Não equivale a certificar todo o código.

Gitleaks passou sem vazamentos; CodeQL reportou zero novo alerta no código desta PR, com zero annotations. CI `37681386331`, workflow CodeQL `37681386357`, check autoritativo `112998415302`. Sem alteração ou bypass de CI, hooks ou scanners.

Pendência de evidência que permanece: uma resposta útil do Claude Code não foi obtida dentro do orçamento. O benchmark escrito dos 20 representantes não comprova expertise mundial ou ganho causal dos 172 agentes. A audição musical é opcional; nenhuma cobrança adicional Jev foi feita. Merge, publicação e NPM release não foram executados.

Com menos de 10 GB livres no C:, não executar build/suíte/e2e local. Validação pesada usa os checks remotos existentes. Sem Docker/WSL, remoção de conteúdo, merge, NPM publish ou produção.

Provas privadas deste lote: `examples/framework-quality/output/pending-20261007/`, em especial `independent-review/QA-Results.md`, `navigation-qa/receipt.json`, `media-qa/receipt.json`, `hub-final-qa/receipt.json`, `native-evaluation/`, `bee125db-installed-readback.json` e os receipts de branch/dependência. Esses artefatos não são servidos pela prévia nem enviados ao Git.

[Prévia local](http://127.0.0.1:4187/#pendencias). O servidor persistente pertence a esta fonte e foi conferido em HTTP; isso não equivale a publicação em produção.
