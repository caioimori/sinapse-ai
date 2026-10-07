# Conhecimento por competência e Jev

Estado local em 2026-10-02. Corpus inicial: 35 fontes consultadas nesta
execução, 67 heurísticas, 17 squads + core e 172 agentes mapeados,
com ao menos três heurísticas em cada contexto. Não é um corpus
completo das disciplinas ou dos especialistas/personas. Todos os agentes mantêm
`coverage: gap`: a existência de uma heurística não qualifica um especialista.

## Fonte, leitura e direitos

`sources.json` preserva URL, autoridade, data, escopo de leitura, seção localizável,
excerto curto, hash e paráfrase original. `contentSha256` é SHA-256 UTF-8 do excerto
efetivamente capturado em `excerpt`, **não** do documento completo nem da URL.
A leitura foi seletiva, via páginas oficiais e seções identificadas de obras públicas;
não se afirma leitura integral de livros ou
de todo o site. `licenseNote` delimita uso. Resumos têm até 200 palavras por fonte;
excertos literais somados aos trechos de evidência não excedem 25 palavras por fonte.
As evidências `referenceOnly:true` apontam ao excerto/hash capturado, sem repetir a
citação: `excerpt` fica vazio somente nesse modo e somente para `status:inferred`.
Fonte sem excerto íntegro, hash divergente ou locator incompatível invalida a referência.
String-match verifica a presença da citação capturada, não entailment da heurística.

Fontes: GOV.UK (necessidades do usuário); Google Search (conteúdo original);
Google Ads (Quality Score); SBA (mercado, plano e equilíbrio); W3C (acessibilidade,
movimento e PROV); CMU Eberly (objetivos educacionais); FTC (comprovação publicitária);
Anthropic (permissões/MCP); TypeSafe (modelo, confiança e API).
As URLs e notas de licença estão no corpus, sem copiar obras completas. A expansão
inclui Romaniuk (fame/uniqueness), Cialdini (mecanismos de persuasão), Duarte (Sparkline),
Dalio (credibilidade por domínio), Sivers (foco condicional), Aristóteles (unidade causal),
CMU (prática/feedback), SEC (lucro/caixa), MDN (WebGL), OWASP (validação), Google SRE,
HubSpot (estágios de CRM), Claude (contexto/enforcement) e Magenta Book (avaliação).
As páginas CMU `learning-alignment` e `cmu-learning` ficam como `restricted-reference`:
CC BY-NC-SA; sem copiar material didático, imagens ou texto integral. A paráfrase factual
original e o curto excerto não são licença para reutilizar comercialmente a obra.

`heuristics.json` distingue `direct`, `inferred` e `hypothesis`, explicita condição,
ação, justificativa, exceção e contraexemplo. Regras FTC são dos EUA; não substituem
fontes brasileiras. Guias W3C não constituem certificação. Conteúdo Google não é
garantia de ranking. Fontes oficiais de fornecedores tampouco são benchmarks próprios.

## Matriz e lacunas

`competencies.json` foi derivado do índice canônico de agentes do checkout.
Cada registro lista competências iniciais compartilhadas da squad e
`specialist-<agentId>` como competência ainda sem corpus específico. Campos
`domainCompetencies` e `specializationCompetencies` separam domínio e função canônica.
Cada agente tem `gapReason` e `sourcePlan` pendente, com título da especialização,
alvo primário, prioridade P1/P2 e critério de leitura triangulada/benchmark reservado.
Esses planos são orientação de descoberta, não evidência de leitura dos alvos.
Os consumidores
de cada heurística são IDs reais; não há aliases inventados ou qualificação inferida
de mera filiação à squad. Council/storytelling não recebem personalidade ou método
completo de seus autores a partir de uma regra comercial genérica.

Triangulação independente de cada especialização, corpus integral dos autores,
livros/licenças e avaliação antes/depois continuam lacunas. A fonte PROV ressalta que
proveniência permite avaliar confiança, mas não prova verdade; a confiança Jev também
não prova correção. Essas restrições ficam preservadas junto aos contraexemplos.

## Contrato e recuperação

Exports CommonJS: `loadCorpus(root?)`, `validateCorpus(corpus) -> {valid, errors}`,
`retrieveKnowledge({root?,agentId?,squad?,competencies?,maxItems?,maxChars?,task?})`.
É necessário agente ou squad. Os filtros são determinísticos; não há embedding,
chamada de modelo, leitura do corpus inteiro na resposta ou heurística fora da squad.
`coverage` é cobertura do especialista; `items` indica conhecimento inicial disponível.
`task` aceita apenas `{command,title,text}` com limites 128/512/4.000 caracteres.
Ranking usa tokens PT/EN normalizados, competências, task tags e regras do contexto;
não é retrieval semântico. Sem termo relevante, retorna lacuna e omite regras genéricas.
As tags não resolvem tarefas nem autorizam comandos: o resolver continua canônico.

Cada item mantém evidência, fonte, limitações e status inteiros. O limite `maxChars`
conta unidades UTF-16 da **resposta JSON compacta completa**, incluindo metadados.
Não são bytes nem tokens. Item que não cabe é omitido e a lacuna fica explícita;
orçamento incapaz de incluir até os metadados é rejeitado. `--json` emite compacto.
Saída pretty, sem `--json`, é somente apresentação e não a representação orçada.
ID desconhecido, traversal, symlink externo, corpus inválido e orçamento inválido
falham antes da consulta.

```powershell
node scripts/framework-evolution/knowledge.cjs validate
node scripts/framework-evolution/knowledge.cjs query --agent kb-architect --max-chars 6000 --json
node scripts/framework-evolution/jev.cjs plan-batch
```

## Jev: piloto preparado, sem chamada paga

Modelo fixado: `jev-1.13.0`. Documentação consultada em 2026-10-02:
US$ 0,042/milhão de tokens de entrada; saída gratuita; 100K tokens/s e 40 req/s;
64k tokens totais e 32k para estado + maior pergunta. Limites são dinâmicos e devem
ser revalidados antes do uso pago. Inglês é a língua principal; português precisa
avaliação própria. Não copiar a antiga observação de 250K tokens/s ou 1.200 RPM.

`plan-batch` monta 18 planos (17 squads + core), cada um apenas com suas fontes
e as heurísticas pertinentes. Há validação da citação capturada antes do julgamento semântico e perguntas
por ID: `support_<id>` (Choice supported/partial/not_found) e `relevance_<id>` (Noul).
No schema v1, `squads:17`, `groups:18` e `includesCore:true` distinguem as squads do núcleo;
`groups`/`includesCore` são campos aditivos, e `squads` corrige a contagem anterior que incluía core.
São 67 regras únicas e 134 perguntas, cada uma ligada às suas fontes explícitas.
A matriz `questionMap` relaciona regra, perguntas e referências; resultados são candidatos
para revisão, sem promoção automática de rótulos. Resposta faltante bloqueia o lote.
O maior estado tem 3.842 bytes UTF-8 nesta versão. Não há chamada por
roteiro: os resultados são consolidados no corpus persistente depois da revisão.

O CLI é offline apenas. `plan`, `planBatch` e `execute` (offline por padrão)
devolvem `called: false`; não simulam resultado Jev. O contrato HTTP é
`POST https://api.typesafe.ai/v1/systemone`, `state/model/questions` ->
`model/answers/usage`. Noul, Choice e Score recebem validação em runtime; uso acima
do contexto, distribuição inválida, resposta faltante e modelo divergente bloqueiam cache.

Para um uso pago futuro, `execute` exige `offline:false`, `authorized:true`, chave
e `createLedger({authorizedUsd,authorizationId})`. Reserva conservadoramente o custo
de **64.000 tokens por tentativa**, antes de enviar ou repetir; requisição falha
não devolve reserva. Não usa contagem aproximada de tokens para prometer teto.
Admissão por bytes com folga é deliberadamente conservadora e não é um tokenizer.

Uma tentativa por squad/core reserva US$ 0,002688 cada; lote completo reserva no
máximo US$ 0,048384. Com três tentativas, no máximo US$ 0,145152. Esses números são
reservas de entrada Jev, não estimativa de custo de pesquisa, síntese, OCR ou transcrição.
Não há orçamento nem credencial usados nesta execução, nem resultado pago obtido.

Executor builtin HTTP tem zero retries por padrão, máximo de três tentativas,
deadline total de até 60s e backoff limitado por esse deadline. Só 429/529 podem
repetir. SDK externo não é usado, evitando retries e logging de bodies implícitos.
Cache é identificado por payload canônico + modelo + preço/data. Cache inválido
é rejeitado; `createFileCache(directory)` exige diretório existente escolhido pelo
operador, não grava chave/API nem request bruto. Respostas podem conter dados do
domínio: ACL e retenção do diretório são responsabilidade operacional.

Ledger é de um processo e conserva reservas nessa execução. Execução distribuída
ou retomada entre processos exige ledger persistente e coordenação próprios antes
de autorização; não usar vários ledgers com o mesmo orçamento. O CLI não oferece
modo live, reduzindo possibilidade de lançamento acidental sem essa coordenação.
Payload é validado como JSON seguro e copiado para snapshot imutável antes de
qualquer await; retries usam exatamente o mesmo body/chave. NaN/Infinity, undefined,
BigInt, função, símbolo, ciclo, accessor e chaves reservadas são rejeitados antes de
reserva/cache/network. Score exige finitude. Ledger reserva sincronamente, inclusive
quando tentativas independentes concorrem no mesmo processo.

## Verificação

22 testes unitários aprovados, incluindo cobertura integral das 67 regras/134 perguntas, limites de todos os lotes e rejeição de resposta atômica ausente; ESLint dos dois scripts e teste aprovado nesta execução.
Teste unitário cobre consulta real dos 172 agentes, gaps, fonte ausente, hash alterado,
evidência incompatível, schema malformado, ID/path inválido, contexto insuficiente,
offline sem transport, orçamento antes do retry, response/usage inválidos, cache,
timeout e retry padrão. Fakes comprovam contratos locais; não comprovam endpoint,
latência, comportamento em português, acerto ou cobrança do provedor.

Não foram alterados caminhos protegidos, instalação global ou produção.
Ganho comportamental permanece pendente de casos reservados e comparação cega
entre agente atual, agente + KB e agente + KB + Jev.

O lote revisável está em `research/framework-evolution/plan-batch.json`, com payloads,
preço/modelo fixados, hash do corpus, reserva por tentativa e receipt de zero chamadas
e zero gasto. Regenerar após alteração do corpus; hash antigo não confirma estado novo.
