# Prompt de pesquisa de rematrícula — F003-N

## Objetivo e foco
Investigue a rematrícula do curso sintético: quem pode renovar, quais dificuldades enfrenta e quais evidências permitem avaliar continuidade. Foco proposto: 3. Pesquisa de usuários e clientes, com validação das hipóteses de rematrícula. A escolha é inferida do briefing, não confirmada em entrevista.

Produza descoberta para apoiar decisões futuras do @project-lead. Não determine estratégia, PRD, stack, campanha, oferta ou preço. Este entregável é o prompt; pesquisa de campo, reconciliação de registros e qualquer envio ainda não foram executados.

## Contexto e rastreabilidade
Fonte dos fatos: generation-cases/F003-N.json, campos case.facts e case.brief; requisitos: case.requirements R1–R4. Todos os números são sintéticos e fornecidos pelo caso, sem auditoria documental independente.

| Fato fornecido | Unidade e limite |
|---|---|
| 42 contatos | Contatos; não equivale a 42 estudantes, matrículas ou vendas |
| 31 famílias únicas | Famílias; regra de unicidade não foi fornecida |
| 18 matrículas confirmadas em outubro de 2026 | Matrículas; classificação entre nova matrícula e rematrícula não informada |
| Dois contatos são irmãos | Pessoas distintas; parentesco não justifica fundir estudantes |
| Cinco têm dois telefones | Multiplicidade de canais; não prova cinco duplicatas de matrícula ou contato |

Hipóteses a testar: parte das 18 pode ser rematrícula; responsáveis podem compartilhar canais; barreiras de calendário, experiência ou custo podem afetar continuidade. Nenhuma dessas hipóteses é resultado confirmado.

## Definições, população e janela — R1/R2
Definição operacional proposta: matrícula é um vínculo confirmado de um estudante com um curso e ciclo, sustentado por ID de matrícula, ID de estudante, ciclo, status e evidência da confirmação. Contato, interesse, resposta ou telefone não confirmam matrícula. A regra real de confirmação e a fonte autoritativa precisam ser obtidas antes da contagem.

Rematrícula requer, adicionalmente, vínculo prévio elegível no ciclo anterior e confirmação no ciclo de renovação. Os 18 vínculos fornecidos não podem ser classificados como rematrícula sem esse histórico. Matrícula confirmada também não comprova receita, pagamento ou venda liquidada.

Janela dos fatos: outubro de 2026. Para análise por data de confirmação, operacionalize o intervalo [2026-10-01 00:00, 2026-11-01 00:00), no fuso oficial do curso a confirmar. Não suponha que isso seja a janela de elegibilidade, renovação ou coleta.

População da pesquisa: estudantes com vínculo anterior elegível para o ciclo de renovação e seus responsáveis, após validação de critérios e histórico. As 31 famílias são o universo informado, não um denominador de elegíveis confirmado. Ciclo alvo, prazo de renovação, período de coleta e fuso são lacunas bloqueadoras da execução de campo.

Unidade primária de resultado: estudante com rematrícula confirmada por curso/ciclo. Unidade secundária: família com ao menos um estudante rematriculado, deduplicada por família. Unidade de contato: pessoa e seus canais, usada apenas para contato/participação.

Se for solicitado um indicador, use taxa por estudante = estudantes elegíveis únicos rematriculados / estudantes elegíveis únicos, na mesma coorte, curso/ciclo e data de corte. Para famílias, use famílias elegíveis únicas com rematrícula / famílias elegíveis únicas. Defina elegibilidade e maturação; com os agregados disponíveis, ambas as taxas permanecem NÃO CALCULÁVEIS. Não divida 18 por 42 ou 31 como conversão de rematrícula.

## Perguntas prioritárias
1. Qual ciclo será renovado e qual regra torna estudante/família elegível? Que histórico permite separar nova matrícula de rematrícula?
2. Qual fonte confirma os 18 vínculos, como trata cancelamentos e qual timestamp determina inclusão em outubro? Quantos são estudantes únicos e de quais famílias?
3. Como 42 contatos se relacionam com 31 famílias e com os estudantes? Onde irmãos e canais múltiplos explicam multiplicidade, sem supor que expliquem toda a diferença de 11?
4. Quais razões e dificuldades de continuidade são relatadas por famílias elegíveis que renovaram, estão decidindo ou não renovaram?
5. Quais informações faltam para decidir e em qual momento são necessárias? Intenção declarada corresponde ao status documental posterior?

Perguntas secundárias: há diferenças por curso/ciclo ou estágio de decisão? Existem evidências contrárias às hipóteses mais frequentes? Não acrescente segmentações sem dados autorizados.

## Metodologia e deduplicação — R3
Comece por consulta documental de dados autorizados; depois, se autorizado, conduza entrevistas com roteiro neutro. Não fabrique entrevistas, personas, preferência ou disposição a pagar. Nenhuma coleta é autorizada por este arquivo.

Solicite extrato mínimo pseudonimizado com contact_id, person_id, family_id, student_id, enrollment_id, curso/ciclo, status, confirmed_at, histórico de elegibilidade e referências da evidência. Obtenha dicionário e regra dos agregados. Telefones reais só entram se necessários e autorizados; prefira vínculos pseudonimizados fornecidos pelo controlador.

Em cópia de análise, preserve os registros originais e documente cada decisão:
1. Deduplicate matrícula por enrollment_id; depois examine repetição de student_id + curso + ciclo. Colisões ou vínculos múltiplos legítimos exigem revisão, sem descarte automático.
2. Deduplicate estudante por student_id autoritativo; mantenha irmãos como estudantes distintos, vinculáveis à mesma família apenas com evidência.
3. Conte família por family_id confirmado. Não agrupe por sobrenome, telefone ou endereço isoladamente; ambiguidade fica pendente.
4. Conte pessoa/contato por IDs e relacionamento confirmado. Associe dois telefones à mesma pessoa quando houver prova; mantenha telefone compartilhado como relação muitos-para-muitos, sem fundir pessoas.
5. Se necessário, normalize telefone com país/DDD confirmados, registrando valor original e transformação. Matching aproximado apenas sinaliza revisão; ausência de ID não autoriza deduplicação presumida.
6. Reconcilie antes/depois para cada unidade: bruto, distinto, multiplicidade legítima, duplicata comprovada e caso inconclusivo. Explique o vínculo entre 42 contatos, 31 famílias e 18 matrículas sem forçar fechamento.

Para entrevistas, cubra os três estágios de decisão sem prometer representatividade. Defina amostragem e convite depois de saber elegibilidade; registre não resposta e limites da amostra. Conte uma resposta principal por família para experiência do responsável, separando relatos por estudante quando houver irmãos. Respostas não equivalem a vínculos confirmados.

Roteiro proposto: Como foi a experiência no ciclo anterior? O que pesa na decisão de continuar? Em que etapa está sua decisão? O que dificulta avançar? Qual informação ajudaria? Há algo que contradiga nossas hipóteses? Não induza resposta positiva nem trate intenção como matrícula.

## Fontes, critérios e análise
Prioridade: cadastro/histórico autoritativo e regra documentada; depois relatos autorizados. Para cada achado, registre locator, data, unidade, janela, denominador, regra de deduplicação e grau de confiança. Compare fontes apenas quando unidade, coorte e período forem compatíveis; mantenha divergências visíveis.

Não há fonte externa exposta para este caso. Não atribua generalizações a mercado ou literatura. Analise achado → implicação → recomendação de investigação; recomendações de produto/estratégia são insumos, não decisões do analyst. Separar fatos fornecidos, resultados observados, hipóteses e lacunas.

## Entregáveis esperados e critérios de sucesso — R4
Entregar síntese executiva; tabela de unidades/coortes/janelas; reconciliação com ledger de deduplicação; matriz pergunta/evidência/achado/hipótese/lacuna; relatos anonimizados somente se efetivamente coletados; limitações e questões que podem mudar uma decisão.

Sucesso da futura pesquisa exige: matrícula/rematrícula e janela verificáveis; contatos separados de vínculos e receita; deduplicação reproduzível sem fundir irmãos; rastreabilidade de achados; ausência de conclusões além da evidência. Prazo de coleta não foi informado; primeiro reconcilie definições e elegibilidade, depois pesquise motivos.

Execução possível: 1. pesquisador humano; 2. assistente de pesquisa com dados autorizados; 3. abordagem híbrida. Submeta objetivos, perguntas, recorte e saída para revisão antes da coleta. Refinar se a revisão ou os primeiros dados contradisserem o recorte.

## Estado e encaminhamento
Este arquivo concretiza create-deep-research-prompt, task declarada em .sinapse-ai/development/tasks/create-deep-research-prompt.md (seções Research Prompt Structure e Prompt Generation). Autoridade: .sinapse-ai/development/agents/analyst.md, agent.whenToUse e Agent Collaboration.

O contexto contexts/analyst.json informa validatedExpertise:false, status planned e ausência de evidência suplementar relevante. Esses contratos não provam especialização validada. Dados documentais, entrevistas, eficácia da pesquisa e qualidade percebida: UNVERIFIED. Nenhum build, dispositivo, AT ou render foi solicitado; não há evidência desses modos.

Após pesquisa efetivamente concluída e research.json criado, encaminhar achados e lacunas ao @project-lead para a próxima especificação; complexidade técnica descoberta segue ao @architect. O encaminhamento está descrito, não executado. Não há autorização para produção, envio, pagamento, publicação ou remoção.