# Aquisição de mecanismos de UI, UX e navegação

Estado deste documento: **contrato de coordenação pronto para aquisição**. Nenhuma nova sessão, imagem, transição ou licença Mobbin foi observada pelo autor deste contrato. O [JSON](mobbin-acquisition.json) contém checklist, encaminhamento por função e schema do registro privado; não contém um lote adquirido.

## Unidade de trabalho

A unidade é uma decisão de uso em um fluxo: objetivo, entrada, estados observáveis, alternativas, recuperação e saída. Uma tela isolada pode fundamentar composição visível; não fundamenta navegação executada, foco, responsividade, backend, conversão ou funcionamento de estados ausentes.

Selecionar a referência pela dificuldade real do produto e por uma lacuna de competência. Não pesquisar apenas nomes de aplicativos ou adjetivos estéticos. O lote inicial comporta até seis fluxos, 24 estados observados por fluxo e 48 transições descritas por fluxo; são limites de trabalho, não metas de volume ou alegações de cobertura.

Famílias de pesquisa: orientação e navegação; descoberta e filtros; apresentação de estados; entrada progressiva; confirmação e recuperação; composição adaptável. O especialista decide qual família responde ao problema, sem pressupor que o padrão encontrado é adequado ao produto.

## Captura, passo a passo

1. Registrar tarefa do usuário, resultado pretendido, restrições do produto e uma função consumidora com comando/competência existentes. Definir o caso reservado de transferência antes de produzir o exemplo de aplicação.
2. Confirmar abertura autenticada atual e acesso efetivo ao conteúdo escolhido. URL, resultado de busca, sessão antiga ou metadados não comprovam leitura dos pixels. Registrar observador, horário ISO, URL canônica e escopo realmente visto.
3. Identificar entrada e saída exibidas. Enumerar estados efetivamente inspecionados, inclusive alternativas, erros, vazio, espera e recuperação quando disponíveis. Marcar cada ausência como `not-shown`; não preencher lacunas com comportamento imaginado.
4. Distinguir `viewer-order-only`, `recorded-playback` e `executed-source-ui`. A ordem das imagens no Mobbin mostra uma sequência editorial; clicar no viewer não equivale a executar o aplicativo original. Playback pode mostrar uma transição, mas não comprova estados não exibidos ou controles de teclado.
5. Descrever primeiro fatos visuais ou interações observadas. Manter inferências em campos próprios, ligadas aos estados que as motivaram, com condição, alternativa, exceção e evidência contrária procurada. Sem argumento causal de conversão, retenção, acessibilidade ou desempenho a partir de aparência.
6. Registrar direitos separadamente: autorização de acesso, autoria das notas próprias e permissão de reutilizar mídia são coisas distintas. Guardar descrições factuais próprias; não incorporar pixels, marca, copy extensa ou assets pagos ao repositório/runtime. Ausência de evidência de direitos bloqueia a ingestão do conteúdo protegido.
7. Se a ferramenta oficial devolver `ai_usage_notice`, apresentar o aviso exatamente como retornado. Citar cada referência pela URL canônica `mobbin_url`; não usar URL temporária da imagem como referência permanente.
8. Formular um mecanismo candidato, encaminhar ao especialista da função e procurar uma alternativa que falhe ou contradiga a proposta. Deduplicar por problema/condição/ação/exceção, preservando origens distintas; aplicativos diferentes não tornam automaticamente um mecanismo novo.
9. Aplicar o mecanismo em um artefato próprio de outro contexto. Avaliar resultado, contraexemplo e conflito; verificar estados relevantes, teclado, 1440px/390px e ausência de overflow. A nota visual não compensa falha em critério crítico.
10. Após revisão independente, consolidar somente o mecanismo e sua evidência curta. Conferir contexto montado e instalação separadamente. Aquisição, consolidação, entrega de contexto e melhoria demonstrada conservam estados distintos.

## Quando encerrar o lote

Parar ao atingir seis fluxos, ao encontrar três referências consecutivas sem nova condição, exceção, conflito ou alternativa, ou ao completar o conjunto de estados necessário para resolver a lacuna e testar a transferência. Se o lote deixar lacunas, encerrá-lo como parcial e abrir o próximo somente com uma pergunta específica. Não anunciar “absorção máxima” pelo número de capturas.

## Handoff por função

| Consumidor | Comando existente | Competência vinculada | Recebe |
| --- | --- | --- | --- |
| `dx-ux-strategist` | `create-wireframe-brief` | `evidence-grounded-wireframe-brief` | Tarefa do usuário, estados inspecionados, mapa parcial/completo e lacunas |
| `dx-ui-designer` | `compose-screen-layouts` | `responsive-visual-composition` | Composição visível, hierarquia, restrições e tokens próprios do produto |
| `dx-interaction-designer` | `spec-micro-interactions` | `interaction-state-specification` | Gatilhos/transições realmente vistos e estados ausentes explicitados |
| `dx-frontend-engineer` | `implement-component-library` | `flow-focus-contract` | Contrato de estado, teclado/foco a implementar e critérios técnicos |
| `product-surface-director` | `design-product-surface` | `state-aware-product-surface-specification` | Tarefa repetida, densidade, permissões declaradas e recuperação |

Cada linha foi localizada em `research/expert-evolution/task-bindings.json`. É roteamento existente, não certificação de competência. Uma proposta multiconsumidor precisa conservar uma única squad e competências exatas de cada binding.

## Integração sem criar outro runtime

1. **Registro privado:** validar o JSON do fluxo pelo `recordSchema` do contrato. Conferir também relações entre IDs, ordem inspecionada, hashes, bindings, direitos e coerência de observação; JSON Schema valida estrutura, não verdade.
2. **Notas autorizadas:** adaptar notas próprias para `expertise.ingest`: `kind:'text'`, `provenance:{uri,capturedAt,capturedBy,locator}`, `rights:{authorized,basis,evidence}` e `units:[{text,locator}]`. `basis:'owned'` pode descrever apenas a redação própria, nunca os pixels ou o produto de terceiros. Se o texto reproduzir material protegido, exigir autorização/licença adequada.
3. **Segmento completo:** cada unidade usada para uma proposta deve conter contexto, evidência, condição, alternativa e lacuna suficientes. Cabe em até 6.000 caracteres sem corte; passar `maxSegmentChars` suficiente pela função `ingest` quando necessário. O CLI atual usa 2.400; se isso dividir a unidade, não declarar `complete-original-segment`. Encaminhar a unidade completa pela API da função ou dividir em mecanismos realmente autônomos.
4. **Proposta:** `extraction.propose` exige hashes de fonte/entrada/segmento, locator/offsets, excerpt de até 12 palavras e bindings exatos. Excerpt de notas próprias continua sendo observação/inferência do capturador, não uma citação verbal do aplicativo.
5. **Jev:** `extraction.planExtraction` e `extract` podem julgar suporte no texto descrito. Jev não inspeciona os pixels/áudio, não observa interação e não certifica direitos. A extração mantém `candidate-only`; ledger/cache duráveis e chave semântica impedem cobrança duplicada. Respeitar o teto já autorizado e bloquear retry com resultado incerto.
6. **Review:** `extraction.reviewCandidate` exige outro reviewer, SHA do candidato e observações positivas, negativas e de conflito, com hashes dos artefatos. `technical-fixture` tem escopo técnico; não substitui percepção humana ou observação de produto real. Conflito não resolvido bloqueia aprovação.
7. **Consolidação:** `extraction.consolidate` usa overlay privado `VALIDATED`, lock e CAS. `knowledge.retrieveKnowledge` já consulta esse overlay por agent/command/competência; `runtime.buildRuntimeContext` mantém até três itens, knowledge até 6.000 e contexto total até 12.000 caracteres.
8. **Distribuição:** atualizar a extensão pessoal pelo helper existente somente depois da revisão. Conferir payload e estado instalado. `assessPromotion` conserva gate separado de evidência de artefato por competência; não promover automaticamente o perfil por existir uma regra no overlay.

Os registros/capturas/ledger e o overlay ficam em caminhos privados já ignorados (`research/expert-evolution/library` e `examples/framework-quality/output`). O contrato público contém apenas procedimentos, schema e referências canônicas. Não mover capturas para exemplos distribuídos.

## Avaliação de transferência

Reservar um brief novo, com marca/conteúdo próprios e contexto diferente da referência. Fixar entradas, orçamento e critérios antes da geração. Comparar contexto vigente e contexto enriquecido com rótulos ocultos para o reviewer; o material usado para ensinar não entra como caso reservado.

Por mecanismo, observar pelo menos um caso dentro da condição, um caso fora dela e um conflito/alternativa. Critérios críticos: fonte/escopo corretos; ausência de dados/mídia não autorizados; tarefa e estados completos ou lacunas explícitas; execução do fluxo; recuperação; teclado/foco; reflow sem perda; acesso/permissões coerentes com o brief. Marcar `not-tested` onde não houver execução; falha crítica veta a promoção.

Registrar tempo, chamadas/custo, defeitos críticos, êxito da tarefa e preferência do reviewer por caso. Repetição, modelo/provider e evidência de instalação são dimensões próprias. Um lote pequeno pode demonstrar melhoria nesse contexto; não demonstra superioridade geral, causalidade isolada ou especialista mundial.

## Evidência existente e alterações mínimas

Os receipts históricos registram quatro telas web e cinco posições (1/6/12/17/22) do fluxo Ahead de 22 imagens; este contrato apenas leu os receipts, sem reinspecionar pixels. Não usar esse histórico como autenticação atual, fluxo completo ou execução original.

Raiz pode implementar apenas: validar registros pelo schema; criar registros de observações realmente recebidas; adaptar notas autorizadas para a biblioteca; formular/revisar mecanismos; executar caso novo; e atualizar receipts de aquisição/consolidação/distribuição. Os scripts existentes comportam a cadeia; nenhuma alteração de núcleo, resolver ou settings é necessária para iniciar.

Integrações verificadas na fonte: `scripts/expert-evolution/{expertise,extraction,feedback}.cjs`, `scripts/framework-evolution/{knowledge,runtime}.cjs`, `research/expert-evolution/task-bindings.json` e receipts `mobbin-connection.json`/`mobbin-onboarding-receipt.json`. Revisão UX especializada deste protocolo continua pendente até existir slot de delegação; ele não contém novas heurísticas extraídas.
