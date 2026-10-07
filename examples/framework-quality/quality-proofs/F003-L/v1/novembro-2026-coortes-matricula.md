# Prompt de pesquisa: novembro-2026-coortes-matricula

## Objetivo e foco
Foco 9: pesquisa personalizada sobre definição de métricas e coortes. Investigue a conversão de famílias em matrículas durante novembro de 2026, mantendo unidades e janelas distintas. Entregue evidências para decisão; não defina estratégia comercial, PRD ou arquitetura.

Pergunta principal: Das famílias distintas com atividade em novembro de 2026, quantas tiveram ao menos uma matrícula confirmada nesse mês, e como esse resultado difere entre famílias cuja primeira entrada ocorreu em novembro e famílias que já haviam entrado antes?

Não some contatos a vendas. Contato descreve entrada/interação ou pessoa, conforme a definição a confirmar; família descreve grupo; matrícula descreve um registro de aluno. As três contagens não são parcelas de uma mesma medida.

## Contexto fornecido e limites
O caso sintético informa, para novembro de 2026, 35 contatos, 24 famílias e 12 matrículas. Duas famílias de novembro repetem outubro. Esses são totais fornecidos pelo briefing, não observações independentes de CRM ou contratos.

| Informação | Uso permitido | Limite |
| --- | --- | --- |
| 35 contatos em novembro | Contagem informada de contatos | Não se sabe se são pessoas únicas, leads ou interações; não representam 35 vendas |
| 24 famílias em novembro | Base informada de famílias | Unicidade e vínculo com contatos ainda precisam de registros |
| 12 matrículas em novembro | Contagem informada de matrículas | Status, data de confirmação, aluno, família e cancelamentos desconhecidos |
| 2 famílias repetem outubro | Sobreposição informada entre meses | Não informa quais matrículas pertencem a elas nem o tamanho da base de outubro |

Se as 24 famílias forem distintas e as duas sobreposições forem completas e exatas, 24 - 2 = 22 famílias de novembro não aparecem em outubro. Isso não prova que sejam novas em toda a história; podem ter entrado antes de outubro. Não divulgar 22 como coorte nova confirmada.

## Definições operacionais propostas a confirmar (R1)
Matrícula: registro único que vincula aluno a período letivo e cuja confirmação consta da fonte oficial, com enrollment_id e confirmed_at. Investigue o evento e os estados que a escola considera confirmação; pedido, contato, intenção e cadastro incompleto não satisfazem essa definição. Não presuma pagamento como condição sem política documentada.

Informe novas matrículas e rematrículas separadamente se existirem. Dois alunos da mesma família podem gerar duas matrículas, mas apenas uma família convertida. Reenvio ou duplicação do mesmo registro não cria matrícula adicional. Matrícula cancelada deve ter estado e data preservados: reportar confirmações brutas e resultado líquido na data de corte separadamente, sem apagar histórico.

Janela mensal: [2026-11-01 00:00, 2026-12-01 00:00), incluindo o começo e excluindo o fim. Fuso America/Sao_Paulo é premissa operacional proposta, a confirmar; normalizar timestamps antes de filtrar. Outubro usa [2026-10-01 00:00, 2026-11-01 00:00). Registrar data de extração/corte e não apresentar novembro futuro como observado ao vivo.

## Perguntas prioritárias e dependências
1. O que significa contato na base dos 35, o que define família e qual evento oficial confirma matrícula? Quais períodos letivos e estados estão incluídos nos 12?
2. Quais identificadores estáveis vinculam contatos, famílias, alunos e matrículas? Existem duplicatas, múltiplos responsáveis, múltiplos alunos ou reaberturas?
3. Quantas famílias distintas das 24 tiveram pelo menos uma matrícula confirmada em novembro? Quantas das 12 matrículas não têm vínculo confiável com uma dessas famílias?
4. Qual é a primeira entrada conhecida de cada família, usando todo o histórico autorizado? As duas que aparecem em outubro pertencem à coorte de outubro ou a coortes anteriores?
5. Qual é a conversão mensal das famílias novas de novembro e qual é a conversão mensal das famílias anteriores com atividade em novembro? Só calcular após resolver 1 a 4.

Perguntas secundárias: quantos contatos existem por família, quantas confirmações foram canceladas até o corte e onde os vínculos ou datas estão ausentes? Não investigar canais, preços ou expansão sem novo requisito.

## Coortes e deduplicação (R2, R3)
Defina first_seen_at como a primeira entrada identificável da família no histórico autorizado. A coorte é o mês de first_seen_at, não o mês da última interação ou da matrícula. Se o histórico estiver incompleto, marque coorte desconhecida; não force atribuição a novembro.

O relatório de atividade mensal mantém as 24 famílias de novembro, incluindo as duas recorrentes: são atividade real no mês. O relatório de aquisição/coortes coloca cada família uma única vez no mês de primeira entrada. As duas recorrentes não entram como novas em novembro, e só entram na coorte de outubro se esse for seu primeiro mês conhecido.

Deduplicar contatos conforme sua unidade definida: event_id para interações; person_id ou lead_id para pessoas/leads. Deduplicar famílias por family_id estável, alunos por student_id e matrículas por enrollment_id. Se IDs de matrícula duplicarem o mesmo aluno/período, reconciliar com registro oficial antes de contar; não fundir aluno diferente.

Telefone/e-mail normalizado serve para sugerir correspondências, não para unir famílias automaticamente. Responsáveis compartilhados e dados conflitantes exigem revisão registrada. Manter tabela de equivalência, origem, justificativa e registros originais; casos inconclusivos ficam separados ou desconhecidos.

Não somar outubro e novembro para obter famílias únicas. Com registros, uma união de período distinto poderia deduplicar por family_id e informar sua própria janela; sem o total e as linhas de outubro, não calcular essa união. Não retirar as duas recorrentes dos totais de atividade de novembro para esconder recorrência.

## Métricas e janelas sem mistura
A: atividade de novembro: contatos conforme unidade confirmada; famílias distintas com atividade no mês; matrículas distintas confirmadas no mês. Mostrar essas três unidades em colunas separadas.

B: conversão familiar mensal: numerador = famílias distintas com atividade em novembro e ao menos uma matrícula confirmada em novembro; denominador = famílias distintas com atividade em novembro. Declarar que a população inclui recorrentes. Os 12 registros de matrícula não são esse numerador; 12/24 não comprova conversão de 50%.

C: coorte nova de novembro: denominador = famílias com primeira entrada em novembro; numerador = subconjunto dessas mesmas famílias com ao menos uma confirmação dentro de novembro. Não atribuir matrículas de famílias anteriores à coorte nova. Contar matrículas por aluno como medida adicional, separada da conversão por família.

Comparações entre coortes precisam do mesmo tempo de acompanhamento. Opcionalmente propor um relatório separado de conversão em até 30 dias desde first_seen_at: registrar explicitamente prazo individual e corte, incluir apenas coortes maduras ou indicar censura. Matrículas em dezembro podem pertencer a esse acompanhamento, mas nunca ao total de confirmações de novembro. Não misturar resultado mensal com resultado acumulado de 30 dias.

## Metodologia, fontes e qualidade (R4)
Executar pesquisa em leitura apenas quando houver acesso autorizado. Solicitar extrato mínimo sintético/autorizado: contact/event_id, unidade, timestamp e family_id; family_id e first_seen_at; student_id; enrollment_id, family_id, student_id, período letivo, confirmed_at, status e cancelled_at. Registrar fuso, data de corte, regra do extrato e abrangência histórica. Não pedir credenciais ou dados pessoais desnecessários.

Priorizar dicionário de dados e política de matrícula da instituição, registros oficiais de matrícula e histórico de CRM com identificadores. Entrevistas só podem esclarecer definições, com atribuição e registro; não inventar entrevistas realizadas. Não usar seguidores, contatos ou preferências declaradas como vendas.

Aplicar reconciliação de unidades, coortes, identidade e datas. Confrontar contagens reconstruídas com os totais fornecidos 35/24/12 e a sobreposição 2, preservando divergências em vez de ajustar dados para fechar. Fonte de matrícula e CRM podem ter populações distintas; explicar exclusões e vínculos ausentes.

## Entregáveis esperados
1. Síntese: resposta à pergunta investigável, implicação e recomendação de pesquisa, com confiança e limitações.
2. Dicionário operacional aprovado ou pendente, contendo unidade, evento, janela, fuso, status e data de corte de cada métrica.
3. Tabela de atividade de novembro e tabelas separadas de coortes, com numerador/denominador, total de famílias, matrículas por aluno e casos desconhecidos; usar NÃO CALCULÁVEL quando faltar vínculo.
4. Ledger de deduplicação/reconciliação e tabela de evidências: afirmação, fonte, linha/registro, transformação e lacuna. Usar IDs sintéticos ou pseudônimos autorizados.
5. Questões em aberto e contrato de entrega ao project-lead: ele decide estratégia/PRD após pesquisa real; nenhuma decisão de estratégia, arquitetura, implementação ou alteração de banco é executada pelo analyst.

## Critérios de aceitação e parada
R1: matrícula e janela explícitas, com definição institucional pendente identificada. R2: nenhuma soma de contatos a vendas e nenhuma equivalência automática matrícula/família. R3: IDs, sobreposição e primeira entrada preservados, sem dupla atribuição de coorte. R4: pesquisa e análise somente.

Limite desta entrega: prompt e regras produzidos em uma tentativa; não é pesquisa de campo concluída. Até existir extrato, política e readback autorizado, contagens reconstruídas, conversão e efetividade operacional permanecem UNVERIFIED. Não criar research.json fingindo resultados completos nem iniciar write-spec como se a pesquisa estivesse concluída. Build, render, dispositivo, percepção e tecnologia assistiva não foram executados e permanecem UNVERIFIED quando aplicáveis.

## Locators usados
- generation-cases/F003-L.json: case.brief, case.facts, case.requirements R1-R4.
- sources/17e4b47515862b1e2c44ab59085bac56cc505e10f0b6c8f1751b766f66ddfbec.json: text, persona/core_principles, commands/research-prompt, dependencies/tasks, autoridade de pesquisa.
- sources/8a8bf807b9fe388e1fe1a58b06633a28079168831c680b3c6ea9aba5b54e1189.json: text, Research Type Selection, Research Prompt Structure A-D, template, Review and Refinement e Handoff.
- contexts/analyst.json: capsules[0].profile.status=planned, validatedExpertise=false; knowledge.coverage=gap; critérios são suplemento inferido, não expertise comprovada.

Premissas do prompt: nome kebab-case derivado do briefing; foco 9 escolhido pelo recorte literal; execução autônoma e limitada ao artefato. Definições propostas e fuso exigem confirmação; não houve seleção colaborativa ou revisão humana nesta tentativa.
