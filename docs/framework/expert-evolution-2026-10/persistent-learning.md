# Biblioteca persistente e aprendizagem delimitada

T05 corrige RT-03 e operacionaliza S5/S6. Captura autorizada permanece na pasta
ignorada `research/expert-evolution/library`; nenhum segmento, feedback ou overlay
privado integra o corpus público ou o pacote. Os arquivos públicos anteriores
continuam intactos. Navegação não comprova especialização.

## Captura, candidato, revisão e delta

`expertise.ingest` captura unidades completas com origem, timestamps observados,
hash e direitos. `extraction.propose` exige mecanismo com condição, ação,
justificativa, exceções, contraexemplos e os consumidores/competências exatos de
`task-bindings.json`. Nenhuma coincidência lexical cria um binding.

O candidato conserva source/version, hash do registro de origem/direitos, hash do
segmento original, locator, offsets e uma citação curta presente nesse segmento.
O resultado deve declarar `complete-candidate`; truncamento, campo incompleto,
hash diferente, direito revogado ou comando desconhecido bloqueia a admissão.

`reviewCandidate` resolve e verifica o hash dos arquivos do candidato e do receipt
tipado. O reviewer difere do autor. Cada review precisa de observações resolvíveis
positiva, negativa e de conflito, com assertion, expected, actual e interpretação.
Booleanos ou textos de aprovação sem observações não bastam. Contradição ou
conflito não resolvido bloqueia a consolidação.

`consolidate` recebe a revisão aprovada e o hash esperado dos bytes de
`overlay.json` (null somente quando ausente). Lock exclusivo, arquivo temporário
sincronizado, novo CAS antes de rename e readback preservam o estado anterior.
Duplicação idêntica acrescenta zero entradas. Conflitos e locks ativos falham;
nenhum retry remove arquivos ou sobrescreve trabalho concorrente.

O overlay possui `status=VALIDATED` e hash das entradas. Cada entrada fixa os
hashes do candidato e da revisão. O runtime relê esses arquivos e as observações,
confere a captura e os direitos e retorna apenas o mecanismo com citação curta.
Conhecimento só entra no comando explicitamente vinculado; cobertura do agente
continua `gap`. Sem overlay, instalações legadas preservam o fluxo anterior e
não carregam o módulo de extração.

## Extração opcional uma vez

`planExtraction` registra `sourceVersion`, `questionVersion` e `modelKey`. Sem
chave, `extract` retorna `manual-native-curation`, chamado=false e zero transporte.
Persistência exige `persist=true`, `authorizedRoot` exata e biblioteca ignorada.
CLI é offline; `propose`, `review`, `consolidate` e `plan` aceitam JSON relativo
ao projeto e permanecem dry-run por padrão.

Execução paga somente usa `jev.execute`, com ledger/cache duráveis e autorização
explícita; nenhum cliente de API novo foi criado. O receipt persistente é indexado
por fonte/versão/perguntas/modelo. Repetição lê o receipt ou o cache durável; o
resultado continua candidate-only e nunca substitui uma revisão independente.

## Feedback e promoção

`feedback.captureFeedback` exige SHA observado do artefato, competência vinculada,
falha, causa, correção, exceção e caso de transferência reservado. Preferências
`personal`, `client` e `general` são distintas; client exige identificação. Cada
registro continua `proposed` até a curadoria independente. Não há regra universal
automática nem aquisição criada pela navegação; máximo de três famílias ativas.

`assessPromotion` rejeita os antigos passed/heldOut/independent com IDs apenas.
Agora exige receipt de artefatos e fontes resolvíveis, modelo/corpus/comando
canônico, observações positivas/negativas/conflito por competência e todos os
gates críticos. O resultado somente permite revisão: promoted=false e perfil
planned. Fixture técnica não comprova transferência ou qualidade para clientes.

## Evidência reproduzível

`tests/unit/expert-evolution-persistent-learning.test.js` cria um Git root temporário
ignorado, uma transcrição própria e identidades sintéticas distintas. O circuito
captura→candidato→review tipado→CAS→`retrieveKnowledge` demonstra persistência
offline, duplicação idempotente e integridade do corpus anterior. Esses receipts
sintéticos verificam o contrato técnico; não atestam revisão humana ou expertise
real. A review independente de um candidato do projeto segue etapa separada.

Os controles negativos cobrem direitos/hashes, locator, resultado truncado ou
incompleto, binding desconhecido, reviewer igual ao autor, evidência ausente,
booleanos falsamente apresentados como aprovação, negativo/conflito adversos,
CAS stale, lock concorrente, navegação dos cinco entregáveis e WIP máximo três.

## Admissão paga por tupla semântica — correção final

Antes de aguardar `jev.execute`, `extract` cria com CAS, fsync e `curation.lock`
um receipt privado `transport-admitted` pela tupla
`sourceVersion/questionVersion/modelKey`. Payloads diferentes da mesma tupla
não podem reservar ou transportar novamente. A reserva financeira continua
exclusivamente no ledger durável de Jev; esse receipt é um bloqueio de execução.

Sucesso substitui os bytes pendentes com CAS pelo resultado `candidate-only`.
Repetição idêntica resolve o resultado gravado; payload divergente falha. Falha,
interrupção do processo ou edição concorrente preservam o bloqueio e os bytes.
Não há remoção, reembolso presumido ou retry automático. Recovery exige revisão
manual dos receipts semântico, cache e ledger de Jev; este módulo não fornece
um comando que libere o bloqueio ou autorize outra cobrança.

As regressões usam somente transportes locais simulados: dois payloads na mesma
tupla, replay após reabrir ledger/cache, erro de transporte, crash real de um
processo Node de fixture e CAS que preserva edição de terceiros. Nenhuma chamada
à API real ou publicação do overlay privado é parte dessa verificação.

## Readback privado após o gate principal — 2026-10-02

Após a coorte principal aprovada, a revisão independente da fixture própria de
origem retida foi consolidada na biblioteca ignorada: uma entrada acrescentada,
zero na repetição. O overlay validado foi relido com hash
`114ebab8d7c3176e448484deba880eb5b8580f354ecf63a5f9cb15ba3e64e531`.

O runtime `dx-frontend-engineer / implement-responsive-layouts` recuperou
`curated-owned-retained-origin-technical`, com 8.534 caracteres de contexto e
4.294 de conhecimento. O mecanismo não apareceu em
`implement-component-library`; comando sem binding recebeu zero itens. Guards
em memória observaram zero chamadas a Jev e zero tentativas de rede.

Os hashes das três bases públicas permaneceram idênticos: 67 fontes e 112
heurísticas. Os 172 perfis continuam planned, sem expertise validada, e a cobertura
continua gap. A aprovação independente cobre somente a decisão da fixture pura,
sem comprovar foco DOM, acessibilidade visual, modelo ou competência para clientes.

O receipt sanitizado está fora Git em
`examples/framework-quality/output/verification/private-consolidation.json`, com
hash `2955d47f7fa55a396ceba6cda4e0029b1c041942912fd47d3ebd949c52b80080`.
Ele registra operação, duplicação, hashes atuais, comandos de controle, orçamento
e preservação. Captura, revisão e delta privados continuam excluídos do pacote.
