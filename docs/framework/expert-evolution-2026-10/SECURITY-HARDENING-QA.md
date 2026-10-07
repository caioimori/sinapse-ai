# Hardening delimitado

Fonte de trabalho: expertise-hardening, base fee0eb5a511bcbdcafdec79697d48591d6ae6c85. PREPARADA devops fixa 74 arquivos privados consumidos distintos (75 referências, overlay repetido), todos ignorados e byte-equivalentes. O inventário completo anterior de 216 permanece preservado na fonte antiga; não se afirma que foi duplicado.

## Alterações

- `extraction.cjs`: leitura limitada por único FD, fstat/identidade/metadata e verificação dos pais; referência confere SHA e faz parse do mesmo Buffer. Snapshot alterado falha explicitamente. Nomes ADS/aliases Windows inseguros são rejeitados.
- `verify.cjs`: cinco assets em allowlist, capturados antes do listener, com cópias privadas e SHA dos bytes servidos. Request não reabre paths. Importar os helpers não dispara browser, servidor ou gravação de receipt.
- `jev.cjs`: stream limitado a 65.536 bytes antes de JSON.parse; excessos cancelam leitura. Validator preserva schema de decisões/uso e projeta campos consumidos, removendo metadata remota desconhecida antes de cache/receipt. Cache completado também retorna projeção.
- Teste novo, story Accepted, spec e mini-workflow; nenhum fixture legado, dependência, CI ou path protegido alterado.

## Contrato observado

Shapes de quatro respostas privadas reais, somente chaves/dimensões: creative-1 5.101 bytes/20 perguntas; business-1 5.034/20; knowledge-4 1.409/5; Mobbin 1.924/7. Top-level: model/answers/usage/request_id/evaluation_time_ms. Choice: type/choice/confidence/probabilities/stats. Uso: input_tokens/output_tokens.

Os campos request_id/evaluation_time_ms/stats continuam aceitos dentro do limite e são descartados na projeção. A conferência não expôs nem analisou semanticamente respostas privadas, não leu chave API e não fez chamada paga. Limite não é uma alegação de tamanho máximo universal do provedor.

## Verificação focal

Validador architecture-first passou antes do código. Story/spec/workflow limitam a duas tentativas e mantêm a instalação anterior ativa até freeze/commit/CAS do devops.

Primeira rodada: 19 PASS/1 FAIL; faltava reserve no ledger sintético do teste novo. Lint também apontou indentação do wrapper CLI. Segunda rodada: **20 PASS/0 FAIL/0 SKIP**, lint dos quatro arquivos **zero warnings**, diff check sem erros. Recibos da rodada inicial são preservados.

Comandos: `node C:/Users/Caio Imori/.codex/scripts/validate-architecture-first.cjs docs/framework/expert-evolution-2026-10/security-hardening-workflow.json --json`; lint focal nos três módulos/teste; `node C:/rrq/tools/gate.mjs --min-gb 4 --wait-min 1 -- node node_modules/jest/bin/jest.js tests/unit/expertise-security-hardening.test.js --runInBand --json --outputFile=examples/framework-quality/output/expertise-20261007/hardening-jest-final.json`.

Negativos nativos: junction estático; troca determinística do pai entre stat e open sem ler bytes externos; alteração durante a leitura; arquivo acima do limite; SHA/parse de um só snapshot; junction na captura do asset permitido; troca posterior e mutação do Map externo sem alterar bytes servidos; resposta oversized sem Content-Length/por declaração; UTF-8 fracionado; transporte json-only rejeitado; metadata removida e excesso impedido antes de cache. Apenas MockResponse com transporte injetado, sem rede paga.

## Matriz e freeze

Matriz instalada em HOME scratch privada: **172/172 PASS**, **582 critérios críticos**, todos os vetos e autoridade exata preservados; `contextOnly:true`, `model:null`, `executionObserved:false`. Máximos completos: **11.865/5.990/2.997** caracteres. Grafo de fontes idêntico antes/depois; dados públicos de competência/perfis/fontes/bindings permanecem byte-equivalentes à base.

Comando: `node C:/rrq/tools/gate.mjs --min-gb 4 --wait-min 1 -- node examples/framework-quality/output/expertise-20261007/run-hardening-matrix.cjs`. Receipts privados: `hardening-jest.json` (primeira rodada), `hardening-jest-final.json`, `hardening-linked-matrix.json`, `hardening-freeze.json`. A matriz nova registra o grafo atual; receipts antigos continuam qualificados como anteriores a este patch.

Hashes finais dos módulos: extraction `727bb40faa27d83d6d138f0d608e24dcf508fd8e4503e39eb754da20dbaec1b3`; Jev `ae24e6490f78723bd06bdfa8bd98a5d1737578d6967ae9888a273b313ea0e2f7`; verify `7a794dc974eea3759a105e5762315332f200cb8fa1b233a347ca06da702bd377`. Jest final SHA `c4c1451cbaff9264da0b517a060b80b5a42185487b8e37c7d770a2343e88d9e9`.

Esta frente congela oito arquivos: os três módulos, um teste, Accepted story, spec, workflow e este QA. Nenhuma outra mutação pelo developer após freeze. Devops controla a mesma branch/PR, confere os hashes antes/depois da seleção no hardening, salva commit e prepara CAS com hardening+primary; não altera as duas fontes históricas. Pins de scratch nunca servem para HOME real.

A story nova é ignorada pela regra existente `docs/stories/*` e precisa de inclusão explícita desse arquivo pelo devops. Não alterar a regra de ignore. Handoff/HUB/CAS continuam sob ownership do devops/root.

## Limites

Mocks json()-only legados não comprovam limite anterior ao parse; não foram adaptados nem usados como prova. A suíte completa, browser completo e exploração probabilística entre processos não foram executados nesta frente. Sem promessa contra malware proprietário com controle integral da memória/ACL/objetos/relógios do filesystem.

Os demais alertas da triagem e o advisory transitivo sem versão corrigida continuam fora deste patch. Os 45 achados de Gitleaks relatados pelo root são 45 hashes comprovados; não são ignorados/dismissed e nenhuma configuração do scanner foi alterada.
