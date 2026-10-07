# F009-N — validação limitada de persona

Recomendação: manter a persona como hipótese. No questionário sintético, nenhum formato foi a categoria mais frequente; tutorial lidera comparativo somente entre quem escolheu um dos dois. Preferência declarada não comprova uso, aprendizagem, compra nem representatividade.

## Fontes e alcance

S1: generation-cases/F009-N.json, case.facts e case.requirements, SHA-256 4b676b0a6f8417c6b08789d5cd63a5dd79dafb6618976799ce25a2ad9105ec9c. Única origem dos números; agregados sintéticos, não dados reais de clientes. O caso não fornece a persona v1.0 nem atributos/claims prévios, questionário, datas, recrutamento, respostas individuais ou comportamento.

S2: sources/ededa4ed48b4c07a011c0f7dc76b50b204df1f05c19c6fe869c29a0c6e965da3.json, text, Passos 1–6. Contrato canônico validate-persona-with-data: comparar hipóteses, classificar, versionar e revalidar; não fornece evidência empírica.

S3: sources/f65e49f0f6bcf92aea81d73924b92f601ee60beee3b41dc4a0616994f1e05eb5.json, text, core_principles e ENG-GROUNDING:v2. Personas são hipóteses, sem invenção de atributos; fatos e inferências separados.

S4: contexts/audience-intelligence.json, capsules[0].operational.task.authority: execução autorizada para o proprietário audience-intelligence. capsules[0].knowledge.coverage=gap, profile.status=planned, validatedExpertise=false. Contrato suplementar não prova expertise. Não há segunda fonte empírica independente; triangulação e validação externa permanecem UNVERIFIED.

## R1 — denominadores explícitos

| Medida | Numerador / denominador | Resultado | Interpretação restrita |
|---|---:|---:|---|
| Respondentes | 60 / 300 convidados | 20% | Taxa de resposta |
| Sem resposta | 240 / 300 convidados | 80% | Preferência desconhecida |
| Tutorial | 18 / 60 respondentes | 30% | Preferência declarada entre respondentes |
| Comparativo | 12 / 60 respondentes | 20% | Preferência declarada entre respondentes |
| Nenhum | 30 / 60 respondentes | 50% | Categoria modal; exatamente metade, não maioria absoluta |
| Tutorial: seleção observada na lista | 18 / 300 convidados | 6% | Fração convidada com essa resposta observada; não prevalência estimada |
| Comparativo: seleção observada na lista | 12 / 300 convidados | 4% | Mesmo limite |
| Nenhum: seleção observada na lista | 30 / 300 convidados | 10% | Mesmo limite |
| Tutorial entre quem escolheu um formato | 18 / 30 = 18 / (18+12) | 60% | Subgrupo; não 60% dos respondentes ou convidados |
| Comparativo entre quem escolheu um formato | 12 / 30 | 40% | Subgrupo |

Reconciliação: 18+12+30=60; 60+240=300; 30%+20%+50%=100% entre respondentes. A leitura pressupõe categorias exclusivas, coerentes com a soma fornecida; a exclusividade e a ausência de duplicatas não foram auditadas no instrumento original. Prova aritmética: examples/framework-quality/quality-proofs/F009-N/v1/arithmetic-probe.json, rates e checks. Não impute os 240 ausentes como nenhum.

## R2 — amostra e viés opt-in

Amostra voluntária: 60 de uma lista de 300 convidados; população-alvo além dessa lista, modo de seleção dos convidados e período são desconhecidos. Interesse, disponibilidade ou satisfação podem afetar a participação: são mecanismos possíveis, não fatos medidos. A direção e magnitude do viés são desconhecidas.

Não usar margem de erro de amostra aleatória, ponderar sem variáveis da lista ou extrapolar ao mercado. Como ilustração da falta de identificação, tutorial poderia estar entre 18/300=6% e (18+240)/300=86% da lista se todos os ausentes tivessem uma única preferência nas mesmas categorias. Esses limites lógicos individuais não são estimativas, intervalos de confiança ou cenários igualmente prováveis; limites superiores das categorias não ocorrem juntos.

## Hipóteses e tabela de validação

Como a persona v1.0 não foi fornecida, as hipóteses abaixo são propostas para teste, sem atribuí-las à persona original. Status refere-se apenas ao suporte do agregado sintético, não à validação com clientes.

| Aspecto / hipótese proposta | Evidência que a testaria | Comparação atual | Status e confiança |
|---|---|---|---|
| Tutorial é preferência majoritária dos respondentes | Mais de 30 dos 60 escolherem tutorial | 18/60=30% | INVALIDADO neste agregado; alta confiança aritmética, validade de campo UNVERIFIED |
| Tutorial lidera comparativo entre quem escolheu formato | Tutorial > comparativo no subgrupo | 18/30 versus 12/30 | CONFIRMADO descritivamente neste subgrupo; generalização INCONCLUSA |
| Público prefere tutorial | Amostra com seleção conhecida e comportamento por contexto | 240 não respondentes e público externo desconhecidos | INCONCLUSO; baixa confiança para a lista/população |
| Tutorial aumenta conclusão da tarefa versus comparativo | Ensaio comportamental randomizado abaixo | Nenhum comportamento fornecido | INCONCLUSO / UNTESTED |
| Nenhum significa desinteresse pelo produto | Investigar significado da resposta e alternativa atual | Só opção nenhum observada | INCONCLUSO; não equivale a ausência de necessidade |
| Demografia, dores, JTBD, motivação, contratação/abandono | Persona anterior, entrevistas e evidência independente | Não fornecidos | INCONCLUSO / UNVERIFIED; não preencher |

## R3 — teste comportamental executável após autorização

Hipótese pré-registrável H1: em um contexto e tarefa definidos antes da coleta, tutorial aumenta em pelo menos 10 pontos percentuais a conclusão correta da tarefa em comparação com comparativo. O limiar é uma proposta de decisão a aprovar, não resultado observado nem política existente.

Pré-condições: obter persona original; definir tarefa relevante e critério objetivo de conclusão; confirmar população elegível, consentimento, janela e acesso a métricas. Selecionar uma tarefa comum às duas variantes, conteúdo equivalente em assunto e esforço, mesma interface e condições. Medir viabilidade: se a tarefa não puder ser servida adequadamente pelos dois formatos, revisar H1 antes de recrutar.

Procedimento proposto, não executado: convidar a lista elegível mediante autorização; registrar convidados únicos, consentimentos e entradas. Randomizar 1:1 na entrada de participantes consentidos para tutorial ou comparativo; persistir a primeira atribuição, sem troca por preferência. Balancear, se disponível, status respondeu/não respondeu e preferência anterior; desconhecido é uma categoria explícita, nunca dado imputado.

Métrica primária: participantes únicos com conclusão correta em até 7 dias / todos os participantes únicos randomizados no respectivo braço. Não condicionar o denominador a abrir ou finalizar o conteúdo. Captura completa deve distinguir abandono de falha de instrumentação; dado perdido não vira falha ou sucesso silenciosamente. Reportar atribuídos, expostos, perdas e conclusões em cada braço; análise principal por atribuição e análise de sensibilidade para dados ausentes.

Métricas secundárias: início do conteúdo / randomizados, abandono / iniciadores e tempo entre início e conclusão entre concluintes. Seus denominadores distintos devem constar no relatório. Preferência declarada versus ação serve para contraste, sem substituir o desfecho primário.

Plano de parada: pré-registrar tamanho e janela antes do primeiro participante. Dimensionar usando taxa basal, efeito mínimo proposto de 10 pontos percentuais, poder de 80% e erro bilateral de 5%; taxa basal ausente impede calcular amostra defensável agora. Encerrar na amostra fixada ou janela previamente acordada; esperar os 7 dias finais; não parar por olhar repetido de significância. Sem amostra suficiente, instrumentação confiável ou acompanhamento, resultado INCONCLUSO.

Decisão proposta: adotar tutorial nesse contexto somente se diferença tutorial menos comparativo for pelo menos 10 pontos percentuais e intervalo de confiança de 95% excluir zero, sem deterioração relevante de abandono previamente definida. Resultado inferior ou incompatível refina/rejeita H1; incerteza permanece INCONCLUSA. Reportar estimativas e intervalo, sem reduzir a decisão a significância.

Esse ensaio mede efeito entre participantes elegíveis que entraram; convite amplo não elimina seleção por consentimento. Comparar entrada por respondedores e ausentes; tentar validação independente com amostragem aleatória da lista, incluindo não respondentes, somente após autorização. Realizar 5–8 entrevistas exploratórias por contextos/preferências incluindo nenhum e, quando possível, ausentes; não tratá-las como estimativa populacional. Perguntar pela última tarefa real, alternativa usada e significado de nenhum.

Locator da prova futura: relatório de experimento com protocolo datado, atribuições pseudonimizadas, dicionário dos eventos, contagens por braço, perdas e método analítico. Hoje: UNTESTED; nenhum convite, coleta ou execução externos foram autorizados ou realizados.

## R4 — persona revisada e revalidação

Registro v1.1-provisório, validação parcial exclusivamente sintética; não equivale à persona v1.1 validada com dados reais prevista pela tarefa. Antecedente v1.0 e seus claims ausentes impedem demonstrar mudança individual ou cumprimento da dependência build-audience-persona.

Descrição utilizável: respondentes voluntários do questionário; metade declarou nenhum, 30% tutorial e 20% comparativo. Entre os 30 que escolheram um formato, 60% escolheram tutorial. Ocasião, necessidade, alternativa e critério de compra permanecem desconhecidos. Nenhum nome, idade, renda, gênero, família, profissão ou motivação foi acrescentado.

Mudança recomendada na ficha quando recuperada: restringir qualquer generalização de preferência ao denominador e contexto corretos; substituir atributos sem fonte por INCONCLUSO; registrar S1 e a data de revisão. O que mudou neste registro é a explicitação dos limites e das hipóteses, não uma validação populacional fictícia.

Revalidar depois de recuperar v1.0 e concluir coleta/ensaio autorizado; revisar a cada 6 meses ou antes se mudarem recrutamento, contexto, tarefa ou produto. Sinais de obsolescência: composição de entrada diferente, aumento de perdas, preferência declarada divergente da ação ou replicação sem efeito. Versionar v1.1 validada apenas após evidência real; registrar confiança e fonte por aspecto.

## Evidência disponível versus lacunas

Fundamentação: arquivos congelados observados inteiros e contas conferidas por probe nativo. Execução: documento e probe aritmético locais; sem questionário real, entrevistas ou experimento. Qualidade/adequação da persona, comportamento e validação empírica: UNVERIFIED. Render, dispositivo, AT e build não são exigidos por este entregável textual; não foram executados e não constituem evidência. Avaliação independente permanece pendente.
