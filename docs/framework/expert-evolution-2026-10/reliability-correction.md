# Correções de confiabilidade — T03

RT-04, RT-05 e RT-06 foram reproduzidos em mocks antes da implementação: duas chamadas para o mesmo payload, ledger durável ausente, primeiro arquivo restante após falha no segundo write e política aceitando data futura/placeholder. Nenhuma credencial ou rede foi usada.

## Extração e custo

`createDurableLedger({directory,authorizationId,authorizedUsd})` usa arquivo por hash da autorização, reserva sob lock e write-ahead receipt. Duas instâncias/processos compartilham o teto; reinício conserva reserva. `execute` exige ledger e cache duráveis em todo `offline:false`, incluindo transport injetado.

A chave incorpora payload, perguntas, modelo e preço canônicos; perguntas versionadas/captura pertencem ao estado/payload. Single-flight e exclusão de arquivo envolvem transporte/cache. Replay validado faz zero transporte/reserva. Map e ledger em memória continuam disponíveis como primitivas/offline, sem admitir execução paga.

Receipts usam `pending`, `completed`, `failed` e `charge-uncertain`. Reinício com `pending`, timeout, resposta inválida ou persistência incerta bloqueia retry. Reservas nunca são reembolsadas automaticamente; uso observado usa `usage.input_tokens`, admission continua em bytes com `tokenEstimate:null`.

HTTP 429/529 conhecido pode usar somente as tentativas previamente limitadas e o mesmo prazo total. Um erro final bloqueia nova execução automática. O lock abandonado é recuperável apenas com proprietário comprovadamente morto; saldo/receipt continuam autoritativos, sem apagar cobrança possível.

## Entrega e recuperação

`prepareDelivery` valida e congela payload em stage, faz fsync e preserva backups/receipt anteriores. `commitDelivery` usa lock, journal antes de cada write, CAS, readback de todos os hashes e receipt tipado antes de `delivered`. Sem readback não há sucesso.

`recoverDelivery({targetRoot,transactionId})` restaura apenas destino ainda igual ao hash desta transação. Edição concorrente produz `recovery-blocked`/`blockedFiles`; stage e backups ficam preservados. Queda real de processo foi simulada em fixture: recovery removeu o lock órfão e restaurou a instalação anterior.

Global traduz `taskPath` dos bindings pelo mesmo `installedPath` dos comandos, preservando os hashes dos bytes canônicos. Binding/extraction são opcionais quando ausentes; o bundle mínimo e o programa expert preservam os checks de pacote parcial. O receipt nativo e seus quatro arquivos públicos de evidência acompanham a política instalada.

## Modelos

Disponibilidade requer receipt tipado resolvível com provider, modelo nativo permitido, escopo `current-codex-session` sem identidade pessoal, origem, checkedAt/expiresAt e hashes. Datas futuras além de cinco minutos, ausência de TTL, expiração, escopo incompatível ou hash incorreto falham sem fetch remoto.

O receipt de Sol indexa os registros da onda nativa anterior; não afirma novo probe, autenticação de API ou promoção. `apiId:null`, Opus/Jev bloqueados e `evaluation.passed:false` permanecem. Promoção exige avaliação independente de artefatos vinculada a modelo/task family/corpus, com positivo, negativo, conflito e hashes resolvíveis.

## Evidência e limite

Quatro suites focadas: 40 testes passaram, 10 omitidos pelo filtro que exclui instalação integral e corpus. Inclui reserva entre dois processos, restart/replay, timeout/resposta inválida, teto, rollback write2/receipt, queda real e preservação concorrente. Coorte anterior sem filtro: 41/41 testes em três suites.

Comando focado: `node node_modules/jest/bin/jest.js tests/unit/framework-evolution-reliability.test.js tests/unit/framework-evolution-knowledge.test.js tests/unit/expert-evolution-model-policy.test.js tests/unit/framework-evolution-delivery.test.js --runInBand --silent --testNamePattern 'audited reliability regressions|model availability|Jev offline|partial package|linked destination|managed payload|edit between|atomic publication'`.

Instalação completa aguarda congelamento coordenado do pacote. Uma execução antecipada teve 6/8 casos verdes e falhou no taskPath global e na expectativa antiga de quantidade; ambas causas foram corrigidas, sem declarar nova instalação integral validada. HOME real e checkout original preservados; zero chamadas/cobranças reais.

## Correção integrada posterior

A coorte principal reproduziu um target de comando ausente no bundle global e uma expectativa antiga de payload. O bundle agora resolve os 18 bindings canônicos e inclui seus 17 arquivos reais, confinados e verificados por hash; o validator continua estrito.

O teste de integração exige explicitamente 19 arquivos e as dependências do receipt. Instalação/reinstalação usam snapshot hermético do pacote, preservando idempotência zero mesmo durante edits paralelos. As duas suites completas passaram: 11/11 testes; ESLint dos três arquivos alterados passou. O resultado da coorte final é registrado em `audited-verification.md`.
