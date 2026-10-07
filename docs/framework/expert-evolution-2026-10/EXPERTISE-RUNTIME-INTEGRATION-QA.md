# Integração e upgrade delimitados

Worktree: `framework-expertise/sinapse-ai`; branch `codex/feat/framework-expertise-20261007`. Base preservada: `8fe3b90b`. Sem migração HOME, push, PR ou produção nesta frente.

## Estado e proveniência

- 172 perfis de competência; 35 contratos ativos anteriores preservados byte-equivalentes como JSON; 51 bindings anteriores preservados integralmente.
- 137 novos contratos/bindings específicos: 188 bindings totais. Outras 12 tarefas dos perfis ativos usam suplementos de competência validados separadamente, preservando os contratos antigos.
- 324 referências novas: 75 recortes externos READ, 238 contratos locais READ e 11 CANDIDATE. Os 88 candidatos antigos permanecem candidatos.
- `contentSha256` fixa a paráfrase autoral, não o corpo remoto. Contratos locais têm `sourceRef`/hash próprio e não contam como pesquisa externa.
- Diagnósticos nativos da mesma coorte Sol 6.1: não são 172 execuções de persona isoladas, benchmark cego ou prova causal. Runtime não carrega briefs nem respostas.
- Originais congelados em `examples/framework-quality/output/expertise-20261007/original-packs`; manifesto com hashes conferidos. Diagnósticos e reparos permanecem privados/ignorados; públicos contêm IDs/hashes.
- Revisões privadas aplicadas: creative-v2 `aaa9e0fcfacaa536c542780542777e24cf5b6b03cc8947f617682ffb70ca9ba2`; business-v2 `76114354987d0127d65ebc8d6b9fccc23fa13df5d648e2df786c303ddb1780f4`; knowledge-v2 `ac2d113a4751284fd465b47b15019c1d44b22ab683605d24ef29cbf3ba307c31`.
- Cost-v3 `50272761d776f537ba72755aef52d302ee6b8dd7b8bc9cc25704102e716c8b97` modifica somente diagnóstico público/hash; mecanismos, modelos, ferramentas, critérios e vetos são idênticos após normalização.

## Recuperação

`competence.cjs` valida IDs, grounding, source/task/canonical hashes, autoridade e separação de candidatos. A tarefa exata seleciona o suplemento; candidatos nunca entram como conhecimento observado. Critérios/vetos obrigatórios precedem o orçamento; campos opcionais são selecionados somente se couberem.

`runtime.cjs` mantém recuperação antiga e incorpora competência dentro de 6.000 caracteres; perfil até 3.000 e contexto completo até 12.000. Contexto offline usa `model:null`/`executionObserved:false`; autoridade de delegação não vira execução.

`project-expert.cjs` reserva também os metadados de instalação `projectLink`. Quando necessário, recompõe conhecimento opcional em até três tentativas; não fatia critérios/vetos nem amplia os limites. Se o conteúdo obrigatório não couber, rejeita explicitamente.

O grafo congelado usa allowlist de dados e apenas edges consumidas por extraction. Exclui orçamento mutável, diagnósticos novos, packs públicos de diagnóstico e benchmarks. A biblioteca privada permanece no projeto.

## Upgrade

`project-expert-install.cjs` continua aditivo e rejeita destinos existentes. `project-expert-upgrade.cjs` requer old registry hash + old transaction; reconstrói o plano das fontes e destinos atuais e exige o new registry hash na aplicação.

Lock compartilhado de instalação, snapshots/backups, journal/CAS, leitura posterior e rollback limitado ao write set. Escritas concorrentes são preservadas e registradas como `recovery-blocked`; snapshots e journal não são apagados. Nenhum comando migra HOME ao importar o módulo.

Pins antigos fornecidos para a próxima etapa, sem verificação HOME nesta frente: registry `9e77ae3b428d471c55462ed0490abd9a2e4b1c8dd18fd0007f01bd3d1cd7edb3`; transaction `4a7c01b2-ca7a-476b-ab15-2fbd29eef317`. Preparar/apply somente após commit e QA, usando o novo SHA calculado pelo plano privado; preservar a fonte antiga congelada.

## Verificação

Schemas de expertise/competência, lint focal e secret scan passaram. Jest final: cinco suites, 124 testes PASS, zero FAIL e uma matriz histórica redundante omitida. A matriz dos 172 comandos selecionados passou integralmente, preservando critérios críticos, vetos e autoridade; máximos raw: 11.602/5.990/2.997 caracteres.

Comando focal pelo gate, usando wrapper privado com argv estruturado:

`node C:/rrq/tools/gate.mjs --min-gb 4 --wait-min 1 -- node examples/framework-quality/output/expertise-20261007/run-focal.cjs`

O wrapper executa cinco arquivos de teste, inclui a matriz dos 172 comandos selecionados e omite somente uma segunda matriz histórica redundante. Fixtures provam CAS/rollback, falha parcial, locks, tampering, providers iguais e preservação de mudanças concorrentes. Não executa suíte completa nem build.

Receipts privados: `jest-final.json`, `runtime-matrix-final.json` e `runtime-final-inputs.json` no diretório de saída acima. O último registra hashes dos inputs congeláveis e dos receipts; código estável `competence.cjs` SHA `e2b19c16e328ab0f0a34bb9e030c7c4c95d9e91996b7d3890f0aa895afa4f8f5`.

Hashes dos receipts raw: Jest `64078a8780828821a65ef25c61dcc1ca83ad7d732ab4586771737c9763af94a2`; matriz `866129d60443d74feb4fc5ac1684eb915863ab7973d2a0aaf76fe94b973ffc14`. Esse snapshot antecede o reparo exclusivo do gateway descrito abaixo.

Antes do freeze, uma probe observou `animation-performance-engineer` com 11.602 caracteres raw e 12.294 após `projectLink`. O gateway foi reparado; regressão focal de gateway/instalação/CAS passou 32/32 testes, sem skip. Lint dos dois arquivos alterados passou.

Comando adicional: `node C:/rrq/tools/gate.mjs --min-gb 4 --wait-min 1 -- node node_modules/jest/bin/jest.js tests/unit/project-expert-context.test.js --runInBand --json --outputFile=examples/framework-quality/output/expertise-20261007/jest-linked-budget.json`.

Jest adicional SHA `12262a423354b9f68c50403db67f14f05e25ac08cd2ab79c26c52b0380f0a980`; gateway reparado SHA `bd730caa879cede501c633eb48ec903a5707e35dad002c0abc06db58c388fb39`. O novo defeito justificou uma matriz instalada em HOME scratch, sem migração real ou alteração da fonte antiga.

Matriz instalada scratch: **172/172 PASS**, critérios/vetos/autoridade completos, `model:null`, nenhuma execução observada. Máximos completos: **11.865/5.990/2.997** caracteres. `animation-performance-engineer` agora ocupa 11.745 caracteres e preserva seus dois critérios críticos.

Comando: `node C:/rrq/tools/gate.mjs --min-gb 4 --wait-min 1 -- node examples/framework-quality/output/expertise-20261007/run-linked-matrix.cjs`. Receipt privado `linked-runtime-matrix-final.json`, SHA `25201a1b658ecdbd3119c9bab45fa1493d5891cbdb3070e0e9308b361aa1fb78`; grafo estável com 1.925 inputs e 40 rosters. Codex/Claude usam o mesmo gateway e as mesmas skills no fixture de instalação.

A primeira tentativa do gate não executou Jest porque o mínimo solicitado era de RAM; um erro posterior de shell/regex descobriu suites mas executou zero testes. Verificações intermediárias revelaram fixture incompleta, asserts históricos que incluíam dados novos e campos obrigatórios acrescentados após seleção de orçamento; todos foram corrigidos antes do receipt final. Nenhuma ferramenta compartilhada foi alterada.

Revisão independente nativa observada: `competence-review.json` contém 172 PASS, zero REVISE/BLOCKED, `finalReview:true`. `final-integration-readback.json` confirma 172 diagnósticos (155 originais e 17 reparos), sem falhas; escopo exclusivo de resposta diagnóstica delimitada.

`final-runtime-scope.json` registra snapshot estável, 172 montagens, 12 suplementos sem binding histórico e 582 critérios críticos, sem falhas. Esses receipts antecedem o reparo adicional do gateway. `planned`/`validatedExpertise:false` permanecem preservados; revisão de diagnóstico não estabelece expertise geral ou causal.

## Handoff e freeze

Integração concluída e write set próprio congelado após os receipts acima. `runtime-final-freeze.json` privado fixa os 18 arquivos de código/dados/testes/QA, o grafo atual e os hashes dos quatro receipts. Nenhuma fonte congelada deve ser alterada depois da migração instalada.

Próxima etapa do devops: adicionar os bytes finais do gateway/teste/QA ao commit, preparar um novo plano CAS sobre a fonte commitada e conferir os pins antigos fornecidos. O registry do scratch não serve para HOME real. Preservar journal/snapshots e mudanças externas ao write set.

Limites: a migração HOME real, o commit/push/PR e a produção não foram executados por esta frente. Não houve build nem suíte completa. O único skip é a matriz histórica redundante; a nova matriz raw e a matriz instalada cobrem integralmente os 172 comandos selecionados.
