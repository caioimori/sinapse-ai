# Auditoria do runtime antes do próximo ciclo

O runtime tem controles offline verificáveis, mas ainda não sustenta promover os 172 perfis nem escalar extração paga. Corrigir relevância, critérios protegidos, reaproveitamento/gasto e recuperação de instalação; depois medir artefatos criativos reais.

Auditado HEAD `47f421cb1d813875504815734acd15562bbeca01`, branch `codex/feat/framework-evolution-20261002`. Fonte e Git somente leitura; apenas estes dois arquivos de auditoria foram criados. Três iterações limitadas, sem rede, sem credencial real, sem instalação pessoal, sem repetir a coorte de 178 testes.

Snapshot atual: **172/172 coverage=gap**, 67 fontes/112 heurísticas, 2 READ/88 CANDIDATE no source-program. O piloto Jev continua offline: 18 grupos/224 perguntas, máximo US$ 0,048384. Os números antigos de 77 gaps, 58 tasks ou 312 KB não foram usados como estado atual.

## Achados

| ID | Prioridade | Evidência e consequência |
|---|---|---|
| RT-01 | P1 | Coincidência lexical não comprova relevância da tarefa |
| RT-02 | P1 | Orçamento compacto remove critérios críticos do entregável selecionado |
| RT-03 | P1 | Captura persistida ainda não alimenta o conhecimento do runtime |
| RT-04 | P1 | Cache sem single-flight e ledger volátil permitem repetição de gasto |
| RT-05 | P1 | Entrega de bundle é atômica por arquivo, não por transação |
| RT-06 | P2 | Política de modelo aceita evidência não resolvível e data futura |
| RT-07 | P2 | Benchmark de decisões escritas não mede os artefatos prioritários |
| RT-08 | P3 | Catálogo lógico não demonstra redução de ruído operacional |

### RT-01 — Coincidência lexical não comprova relevância da tarefa

**P1; quality-defect.** Fonte: `scripts/framework-evolution/knowledge.cjs:18-22,103-108`; `scripts/expert-evolution/expertise.cjs:80-85`; `scripts/framework-evolution/runtime.cjs:45-50`.

- retrieveKnowledge(dx-frontend-engineer, task.text='estado') recupera h-interaction-recovery e priority-derive-before-effect; 'evidência' recupera h-problem-before-solution.
- getProfile(compact=true,maxChars=3000,task={command:'unrelated',title:'banana',text:'banana'}) retorna entregável mesmo com taskRelevance='no-lexical-match'.
- css-motion-artist/analyze-reference-animation recebe h-webgl-main-thread; fallback=true é visível, mas não altera admissão/relevância.

**Reprodução:** Invocar os exports getProfile/retrieveKnowledge com os objetos acima; ler IDs, taskRelevance e gaps, sem persistir.

**Efeito:** Heurísticas presentes por palavras genéricas e entregáveis sem vínculo explícito ocupam o orçamento que deveria conter a decisão específica. Isso não prova que toda seleção lexical esteja errada.

**Mudança mínima:** Binding explícito comando→competência/entregável; ranking lexical somente dentro dos bindings; quando ausente, emitir gap e caminho canônico sem suplemento genérico.

### RT-02 — Orçamento compacto remove critérios críticos do entregável selecionado

**P1; quality-defect.** Fonte: `scripts/expert-evolution/expertise.cjs:84-90`; `scripts/framework-evolution/runtime.cjs:50-57`.

- Probe nos 172 perfis, maxChars=3000 e tarefa 'review / direitos licença evidência critérios falha / reduced-motion caption direitos autorização mídia': 6 perfis reduzem os critérios do entregável de 6 para 2; 0 falhas de serialização.
- animation-performance-engineer perde o critério de caminho reduced-motion e o critério de limites de autoridade/falha/exceções; animation-interpreter e generative-particle-engineer também foram observados.
- Nenhuma das seis referências compactas de amostra conserva o campo rights da fonte; fontes READ também omitem excerpt no perfil. Conhecimento separado preserva licenseNote; ausência no perfil não significa ausência total no payload.

**Reprodução:** Comparar deliverables[].criteria antes/depois de getProfile(compact:true,maxChars:3000) usando a tarefa acima.

**Efeito:** JSON válido e ≤3000 caracteres pode enfraquecer o aceite criativo/performance justamente em funções prioritárias.

**Mudança mínima:** Classificar critérios por criticidade e reter safety/accessibility/rights/authority/failure; omissão deve conservar IDs e obrigação de carregamento. Se não couber mínimo protegido, falhar com erro específico ou devolver somente ponteiro/gap sem afirmar critérios completos.

### RT-03 — Captura persistida ainda não alimenta o conhecimento do runtime

**P1; capability-gap.** Fonte: `scripts/expert-evolution/expertise.cjs:124-188,212`; `scripts/framework-evolution/knowledge.cjs:24-32,93-106`; `scripts/framework-evolution/runtime.cjs:49-51`.

- ingest grava segments com status captured, manifest, direitos e origem; planUseCase lê library e retorna somente planejamento candidate-only.
- retrieveKnowledge carrega exclusivamente research/framework-evolution/{sources,heuristics,competencies}.json; não consulta a library.
- Exports do módulo expertise: loadProgram,validateProgram,getProfile,ingest,planUseCase,assessPromotion. Não há consolidação de julgamento/mecanismo em corpus nem receipt de extração recuperável pelo runtime.
- Snapshot atual: 172/172 agentes coverage=gap, 67 fontes e 112 heurísticas no corpus; source-program tem 2 READ/88 CANDIDATE. Números antigos de 77 gaps não descrevem este HEAD.

**Reprodução:** Ler exports e a lista fixa em loadCorpus; contar coverage e status com loadProgram/loadCorpus, sem escrita.

**Efeito:** Ingerir um livro/transcrição não muda a recuperação de um agente. A promessa de usar Jev uma vez na extração exige um elo de consolidação durável, distinto de avaliação paga a cada tarefa.

**Mudança mínima:** Criar registro de mecanismos candidatos por competência, ligado a segmentos/locators/direitos e resultado tipado; revisão determinística/independente precede publicação no corpus. Runtime usa o corpus consolidado e permanece offline.

### RT-04 — Cache sem single-flight e ledger volátil permitem repetição de gasto

**P1; cost-defect-before-live.** Fonte: `scripts/framework-evolution/jev.cjs:106-118,120-155`.

- Promise.all de duas execute para mesmo payload/cache Map/ledger, com transport inteiramente em memória: calls=2, ambas mode=live, sameCacheKey=true, reservedUsd=0.005376.
- Dois createLedger({authorizedUsd:0.002688,authorizationId:'same-id'}) permitem reserva combinada de 0.005376. O limite individual funciona; a identidade da autorização não possui persistência ou exclusão entre processos.
- createFileCache.set usa flag wx; concorrentes pagos podem competir pelo mesmo arquivo após chamadas bem-sucedidas. Esta consequência vem do fonte; não foi alegada chamada real.

**Reprodução:** Usar execute com transport mock retornando noul=0.5, input_tokens=30 e Promise.all; recriar dois ledgers com mesmo ID e reservar 0.002688 em cada.

**Efeito:** Antes de usar a credencial, o teto de campanha e a extração uma vez precisam sobreviver a paralelismo, reinício e resposta perdida. Nenhum dólar real foi gasto no probe.

**Mudança mínima:** Reserva durável sob lock por authorizationId, chave estável por captura/modelo/versão de perguntas e single-flight por cacheKey. Estado de cobrança incerto após crash não permite retry automático; cache validado pode ser reaproveitado sem reserva.

### RT-05 — Entrega de bundle é atômica por arquivo, não por transação

**P1; recovery-defect.** Fonte: `bin/lib/framework-evolution-delivery.js:100-125`.

- Fixture isolada em TEMP, packageRoot atual e writeFileAtomically substituído em memória por falha no segundo write: writes=2, scripts/framework-evolution/runtime.cjs presente, receipt ausente.
- O loop escreve todos os destinos antes do receipt; não contém catch/rollback da sequência. Backups preservam bytes anteriores, mas não restauram automaticamente arquivos já gravados.

**Reprodução:** Monkeypatch somente em memória de bin/lib/global-provider-adapters.js.writeFileAtomically para lançar no segundo write; deliverFrameworkEvolution(layout:'project') em mkdtemp. Fixture preservada sob TEMP, identificador sinapse-audit-delivery-hWZIHW; caminho pessoal omitido do artefato distribuível.

**Efeito:** Interrupção de instalação/upgrade deixa consumidores em versões distintas e a próxima operação não tem receipt completo do estado parcial. É risco de recuperação; não implica perda observada em HOME real.

**Mudança mínima:** Stage pré-validado, journal da transação e rollback compare-and-swap dos arquivos gravados; readback do bundle e receipt antes de declarar delivered. Guardar snapshot canônico e não sobrescrever edição concorrente.

### RT-06 — Política de modelo aceita evidência não resolvível e data futura

**P2; validation-gap.** Fonte: `scripts/expert-evolution/model-policy.cjs:21-51`; `research/expert-evolution/model-policy.json:1-58`.

- Clone em memória da política: reviewExpiresAt removido, availability.checkedAt='2099-01-01', availability.evidence=['unresolvable-placeholder']. validatePolicy retorna valid=true; assessModel(Sol, now='2040-01-01') retorna allowed=true.
- A política original possui expiresAt e avaliações não aprovadas; Opus/Jev continuam blocked no snapshot. O probe expõe fragilidade do validador, não prova adulteração da política original.

**Reprodução:** Modificar somente o objeto retornado por loadPolicy, em memória, e chamar validatePolicy/assessModel com as datas acima.

**Efeito:** Booleanos e textos de receipt não provam provider/account/model corretos nem atualidade; promoção deve ser ancorada em receipt resolvível, escopo e validade.

**Mudança mínima:** Receipt tipado com provider/native ID/account scope/checkedAt/expiresAt/hashes e origem permitida. Datas futuras além de tolerância falham; TTL obrigatório para disponibilidade; promoção só aceita benchmark do modelo/corpus/task family específicos.

### RT-07 — Benchmark de decisões escritas não mede os artefatos prioritários

**P2; quality-evidence-gap.** Fonte: `docs/framework/expert-evolution-2026-10/verification.md:27-44`; `scripts/expert-evolution/expertise.cjs:190-196`; `research/expert-evolution/model-policy.json:25-38`.

- Verificação relata 10 casos escritos, uma geração por variante, baseline18/20 e enriched20/20; reconhece ausência de UI/vídeo renderizados, estatística causal, Opus/Jev e cobertura integral.
- assessPromotion verifica passed/heldOut/independent, IDs e hashes; não liga receipt a um artefato aberto/reproduzido nem exige critérios específicos por domínio.
- Todos os perfis permanecem planned; nenhuma promoção foi observada. O problema é o próximo critério de promoção, não uma falsa promoção já feita.

**Reprodução:** Ler receipt de benchmark e comparar o gate assessPromotion com os critérios de entregáveis reais no PLAN.

**Efeito:** Uma decisão verbal sobre foco, contraste, FPS ou legendas pode passar enquanto o produto final falha. Melhorar 172 agentes exige evidência por competência e função usada, não contagem de perfis.

**Mudança mínima:** Começar por pequena coorte com artefatos reais: interface desktop/390px/teclado, motion teardown/frame/reduced-motion e vídeo/carrossel no tamanho final com direitos e correspondência fala/imagem. Guardar hashes/locators e julgamento independente.

### RT-08 — Catálogo lógico não demonstra redução de ruído operacional

**P3; usability-gap.** Fonte: `scripts/expert-evolution/catalog.cjs:71-89,155-186`; `docs/framework/expert-evolution-2026-10/organization.md:91-94,124-160`.

- Queries disponíveis: agent por ID/alias, squad por ID e paths por responsabilidade. Nenhuma consulta por entregável/problema ou trilha source→task→artefato.
- Manifest de consumers inclui referência literal/import relativo; a documentação já registra globs, expressões dinâmicas e externos como lacuna.
- Organização é explicitamente lógica e preserva paths. Não houve remoção física, e clusters de bytes iguais conservam action=review-only-preserve.

**Reprodução:** Ler exports/main/query* e as limitações de consumidores; não interpretar consumidor vazio como arquivo dispensável.

**Efeito:** O usuário ainda precisa conhecer IDs e classes para achar o fluxo criativo. Contagem/classificação de milhares de arquivos não mede facilidade de encontrar a tarefa certa.

**Mudança mínima:** Adicionar índice de entregáveis e trilhas nomeadas (frontend, motion, Reel, carrossel), aliases existentes e gaps; medir descoberta em 5 cenários. Consolidação física fica fora deste ciclo até mapa de consumidores e autorização explícita.

## Contratos para execução agora

O [JSON de auditoria](../../../research/expert-evolution/audit-runtime.json) contém exports existentes/propostos, entradas, saídas, aceitação e rollback de cada contrato. Implementação pertence ao developer; pagos, providers externos e produção conservam seus gates.

| Ordem | Contrato | Entrega |
|---|---|---|
| 1 | C-01 | RT-01, RT-02; validateTaskBindings, resolveTaskBinding, selectProtectedCriteria |
| 2 | C-02 | RT-04; createDurableLedger, runSingleFlight, validateExtractionReceipt |
| 5 | C-03 | RT-03; stageMechanism, validateMechanism, publishKnowledgeDelta |
| 3 | C-04 | RT-05; prepareDelivery, commitDelivery, recoverDelivery |
| 4 | C-05 | RT-06, RT-07; validateAvailabilityReceipt, validateArtifactEvaluation |
| 6 | C-06 | RT-08; queryDeliverable, validateDeliverableIndex |

### C-01

**Owner:** developer. **Arquivos:** `scripts/expert-evolution/expertise.cjs`, `scripts/framework-evolution/knowledge.cjs`, `scripts/framework-evolution/runtime.cjs`, `research/expert-evolution/task-bindings.json`.

**Entradas:** root exato; canonical agentId/command; bindings versionados com sourceSha256, competencyIds, deliverableIds, requiredCriterionIds; maxChars.

**Saídas:** Mesmo envelope público acrescido de selectionEvidence e omittedCriterionIds; gaps explícitos para binding ausente; refs incluem rights/status/locator; nenhuma mudança de autoridade.

**Aceite:**

- banana/unrelated não retorna entregável candidato nem evidência genérica.
- Bindings de ao menos frontend/modal, motion/reduced-motion e vertical-video retêm os critérios pertinentes.
- Os 6 perfis que hoje truncam 6→2 preservam critérios protegidos ou falham de forma explícita.
- Payload completo ≤12000 chars e perfil ≤3000 chars; caracteres são medida, tokens estimados só quando tokenizer documentado for usado.
- Fixtures de gaps/negativos/especialistas do mesmo squad; manter os 172 IDs e erro de unknown command.

**Rollback:** Restaurar os três módulos e remover do bundle somente o binding introduzido pela própria transação; manter profiles/corpus originais com hashes. Não apagar registros funcionais.

### C-02

**Owner:** developer. **Arquivos:** `scripts/framework-evolution/jev.cjs`, `scripts/expert-evolution/extraction.cjs`.

**Entradas:** directory de fixture/armazenamento explicitamente autorizado; authorizationId e authorizedUsd; sourceHash; model; questionVersion; payload; transport injetável; timeout e maxAttempts.

**Saídas:** Receipt persistido keyed por captura+pergunta+modelo, reserva/write-ahead auditável e status pending/completed/failed/charge-uncertain; uso real separado da reserva conservadora.

**Aceite:**

- Duas chamadas concorrentes para mesma chave causam um transporte e uma reserva.
- Dois ledgers/processos com mesma autorização não excedem US$0,05 no conjunto; restart preserva saldo reservado.
- Crash entre envio/resposta vira charge-uncertain e bloqueia retry automático.
- Resposta inválida não consolida conhecimento; replay completado faz zero transporte.
- Tests usam mock: zero rede, zero credencial real; atual admission em bytes permanece conservadora com tokenEstimate=null, billing por usage.input_tokens.

**Rollback:** Desabilitar executor pago; preservar receipts e reservas/charge-uncertain. Reverter código sem reembolsar/desconsiderar tentativas possivelmente cobradas.

### C-03

**Owner:** developer. **Arquivos:** `scripts/expert-evolution/extraction.cjs`, `scripts/framework-evolution/knowledge.cjs`, `research/expert-evolution/library/approved-manifest.json`.

**Entradas:** Receipt tipado; segmentos/hash/locator; direitos; condition/action/rationale/exceptions/counterexamples; consumers/competencies; reviewReceipt; expectedCorpusSha.

**Saídas:** Mecanismo candidato persistido e delta autorizado/revisado de corpus, sem promoção automática. Runtime só usa delta validado e pinado.

**Aceite:**

- Ingest de nova captura isoladamente não promove nada.
- Um mecanismo aprovado chega ao runtime somente ao comando/competência ligado; fonte/hash/rights/locator recuperáveis.
- Duplicação de captura preserva origens e faz zero transporte pago.
- Segmento truncado sem contexto suficiente gera insufficient-evidence; jamais completar exceção de memória.
- Reviewer independente e negativo/conflito por competência precedem publicação; private captures não entram em pacote público.

**Rollback:** Reativar corpus anterior por SHA; preservar mecanismo/receipt como superseded. Não apagar origem nem outros deltas concorrentes.

### C-04

**Owner:** developer. **Arquivos:** `bin/lib/framework-evolution-delivery.js`, `bin/lib/global-provider-adapters.js`.

**Entradas:** packageRoot,targetRoot,layout; source manifest/hash; prior receipt; transactionId; injected writer.

**Saídas:** Entrega coherente/journal/recovery receipt; delivered somente após readback de todos os arquivos/receipt.

**Aceite:**

- Falha no write 2 e falha ao gravar receipt preservam/restauram bundle anterior em fixture.
- Fresh install e upgrade testados com HOME com espaços; não tocar HOME real.
- Recovery não sobrescreve arquivo alterado por outro processo; registra bloqueio e backup.
- Fonte canônica/global installedPath, aliases públicos e tasks preservados; fixture chama runtime de pelo menos três funções e unknown command.

**Rollback:** Restaurar somente destinos ainda iguais aos bytes desta transação, por CAS; não mexer em alterações de terceiros. Journal/backup retidos para recovery.

### C-05

**Owner:** developer. **Arquivos:** `scripts/expert-evolution/model-policy.cjs`, `scripts/expert-evolution/expertise.cjs`, `research/expert-evolution/model-policy.json`, `research/expert-evolution/benchmark-protocol.json`.

**Entradas:** Clock injetável; allowlist de provider/model IDs existentes; receipts resolvíveis e hash; task family; artifact hashes/locators; independent reviewer/executor; corpus SHA.

**Saídas:** allowed/promotionEligible com motivo explícito, disponibilidade separada de ganho de qualidade. IDs públicos não são inferidos a partir de nome nativo.

**Aceite:**

- Placeholder e checkedAt2099 falham em now2040; ausência de expiry bloqueia disponibilidade.
- Receipt expirado ou de provider/model/conta incompatível falha.
- Benchmark escrito permanece restrito a decisões escritas; não promove UI/video/world-expert.
- Sol pode manter uso nativo disponível dentro da autoridade; Opus/Jev indisponíveis não executam por aliases inventados.
- Competência requer positivo, negativo e conflito com artefatos/evidência reproduzíveis; nenhum fetch remoto no validador.

**Rollback:** Restaurar política pinada anterior mantendo expired/blocked quando a evidência perdeu validade; jamais ligar modelo por simples fallback.

### C-06

**Owner:** developer. **Arquivos:** `scripts/expert-evolution/catalog.cjs`, `research/expert-evolution/deliverable-index.json`, `docs/framework/expert-evolution-2026-10/organization.md`.

**Entradas:** Índice versionado com IDs/tasks canônicos, aliases públicos existentes e source SHA; termos de entrega e current catalog.

**Saídas:** Trilha nomeada com owner, canonical source, task, required evidence e consumer gaps; todos os caminhos abrem/resolvem.

**Aceite:**

- Cinco necessidades reais chegam a uma entrada válida sem exigir que usuário conheça agentId.
- Cada trilha resolve exact command e explicita fallback/gap.
- Nenhum move/delete/protected-path/global edit; consulta não infere dispensabilidade por ausência de referência literal.
- Registrar tempo/ações de descoberta baseline→novo em vez de somente contagem de arquivos.

**Rollback:** Remover apenas referência ao novo índice e reverter módulo; fontes/tasks/catálogo baseline permanecem intactos.

## Limites e sequência

Executar C-01/C-02/C-04/C-05 antes de escalar ingestão ou instalar bundle novo. C-03 liga captura à evolução persistida; C-06 melhora navegação sem remoção física. Sequenciar alterações no mesmo arquivo: expertise.cjs e extraction.cjs possuem contratos sobrepostos.

A validação original permanece evidência histórica delimitada: 178 testes e comparação 18/20→20/20 foram relatados no receipt anterior, não reexecutados aqui. Esta auditoria observou fonte, objetos em memória e fixture TEMP; não prova produção, ganho causal, expertise mundial ou comportamento de vídeo.
