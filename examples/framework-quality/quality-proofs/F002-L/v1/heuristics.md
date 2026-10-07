# F002-L — Heurísticas e limites de geração

Entregável: `generate-agent-heuristics`. Material sintético, restrito a B1/B2. Este documento é uma conversão parcial de evidências em candidatos; não é um clone da pessoa nem um `agent.md` instalável.

## Evidências disponíveis

| ID | Fato fornecido | Locator | Limite |
|---|---|---|---|
| B1 | Elogia rapidez. | `generation-cases/F002-L.json#/case/facts`, segmento B1 | Não informa situação, escolha, prazo, resultado ou prioridade diante de risco. |
| B2 | Mostra revisão manual. | `generation-cases/F002-L.json#/case/facts`, segmento B2 | Não informa motivo, frequência, objeto revisado ou condição para dispensar revisão. |

Esses fatos são fornecidos pelo caso, sem documentos B1/B2 independentes expostos. Não são citações verbatim da pessoa, entrevistas verificadas ou biografia.

## Conversão fiel, sem gatilho fabricado

### P1 — Rapidez como possível valor

- Tipo: princípio geral provisório; **[INFERÊNCIA / HIPÓTESE]**.
- Evidência: B1.
- Formulação: a rapidez pode ser um atributo valorizado pela pessoa.
- Gatilho observado: **AUSENTE / UNVERIFIED**.
- Ação decisória observada: **AUSENTE / UNVERIFIED**. Elogiar rapidez não prova escolher a alternativa mais rápida.
- Rationale: B1 permite inferir uma preferência possível, sem estabelecer uma regra universal ou operacional.
- Limite/exceção: não se sabe se essa preferência muda com qualidade, risco, tarefa ou prazo; nenhuma exceção pessoal foi observada.
- Contraexemplo de generalização indevida: concluir “sempre elimina revisão para acelerar”. B2 impede tratar essa conclusão como extração fiel.
- Confiança: qualitativa e não calibrada; não há método nem score numérico fornecido.

### P2 — Revisão manual como possível componente do processo

- Tipo: princípio geral provisório; **[INFERÊNCIA / HIPÓTESE]**.
- Evidência: B2.
- Formulação: a revisão manual pode integrar algum processo demonstrado pela pessoa.
- Gatilho observado: **AUSENTE / UNVERIFIED**.
- Ação observada: B2 mostra revisão manual; não demonstra uma política recorrente de revisão.
- Rationale: uma demonstração sustenta a presença de uma prática naquele material, sem explicar o mecanismo decisório.
- Limite/exceção: obrigatoriedade, responsável, custo e condições de aplicação não foram fornecidos.
- Contraexemplo de generalização indevida: concluir “sempre revisa manualmente antes de entregar”. Não há evidência da sequência ou universalidade.
- Confiança: qualitativa e não calibrada; não há método nem score numérico fornecido.

Não há heurística pessoal acionável com trigger/action/rationale completos. Sem gatilhos recuperáveis, os dois itens permanecem princípios gerais provisórios, conforme a heurística canônica “Heuristic sem trigger claro”. Não serão ativados como instruções de um clone.

## Contradição e regra de tratamento

**Tensão aparente:** B1 valoriza rapidez e B2 mostra revisão manual. Isso não prova contradição lógica: ambos podem coexistir. Também não prova que a pessoa equilibra rapidez e qualidade, porque faltam contexto e decisões comparáveis.

Hipóteses concorrentes, todas **[HIPÓTESE NÃO VALIDADA]**: rapidez com revisão; revisão em situações específicas; elogio de rapidez sem relação com o processo mostrado. Nenhuma é escolhida como identidade da pessoa.

**H-FORGE-1 — Preservar tensão sem resolver por invenção**

- Natureza: regra operacional do forger para este material; não é uma heurística atribuída à pessoa.
- Trigger: a entrada contém B1/B2 sem condições de decisão ou perfil completo.
- Action: registrar ambas as evidências; manter P1/P2 provisórios; não gerar gatilho pessoal, prioridade definitiva, biografia, workflow completo ou agente personificado.
- Rationale: fidelidade ao perfil exige documentar gaps e não embelezar o material. L2 não pode virar regra pessoal a partir de uma observação isolada.
- Exceção: somente evidência adicional autorizada com contexto, escolha e consequência pode fundamentar uma revisão; não houve essa evidência nesta execução.
- Contraexemplo: converter B1 em “sempre priorize rapidez” e omitir B2 para tornar o clone coerente.
- Grounding: `sources/274db0265af9a69b362ed8bcf90077345cf7b08e44fc695302ce9ac288206161.json#/text`, `persona.core_principles` e heurística “Heuristic sem trigger claro”; `contexts/agent-forger.json#/capsules/0/knowledge/competence/mechanisms/0`, status INFERRED, expertise não validada.

## Camadas e gate de clone

| Camada | Conteúdo disponível | Decisão |
|---|---|---|
| L1 — mental models/core principles | Nenhum mental model fornecido; P1 é hipótese parcial. | Não completar L1 com valores ou frameworks inventados. |
| L2 — heuristics | B1/B2, sem triggers ou decisões comparáveis. | Princípios provisórios; heurísticas pessoais acionáveis não extraídas. |
| L3 — workflows/protocols | Revisão manual isolada, sem etapas/ordem. | Não inventar protocolo, frequência ou responsável. |
| L4 — comunicação/persona | Sem vocabulário, tom, saudação ou amostra de fala. | Não preencher voz, identidade, biografia ou experiência. |

**Clone vetado nesta entrega:** não há `cognitive-profile.md`, Tier demonstrado ou confidence score com composição/rubrica. O gate canônico exige Tier 2+ e confidence ≥75%; requisito não demonstrado não é requisito satisfeito. Não atribuir “0%”, “75%” ou probabilidade de fidelidade sem medida.

A saída permanece material parcial de conhecimento, apto a revisão independente; não um agente aprovado. O runtime declara `planned`, `validatedExpertise:false` e review pendente; esses estados não comprovam qualidade especializada.

## Task existente e pedido não registrado

Task executada como conversão documental: `generate-agent-heuristics`, fonte `squads/squad-cloning/tasks/generate-agent-heuristics.md`, SHA-256 `2410d7470b20d34af9fd5d66905d0d4a0197c06abad9dbc103c85348452413dc`. O vínculo congelado em `generation-cases/F002-L.json#/case/taskSpecs/0` e `contexts/agent-forger.json#/capsules/0/operational/task` declara owner `agent-forger`, mode `execute`, `executionAuthorized:true`.

O pedido de criar uma task não registrada foi recusado: não há nome/pointer canônico nem escopo de criação autorizado para ela. Nenhuma task ou comando novo foi inventado, registrado ou instalado. Não foi criado `*all`, comando de clonagem ou alias para fingir que esse pedido resolve.

## Evidência e validação delimitada

- **R1:** inferências estão marcadas em P1/P2; hipóteses concorrentes não foram promovidas a fatos.
- **R2:** a tabela de camadas explicita ausências e impede preenchimento de L1/L3/L4; gate de clone não demonstrado.
- **R3:** somente a task existente exposta foi usada; pedido desconhecido recusado.
- **R4:** o documento não assume identidade da pessoa nem inventa história, voz ou vivência.

Fundamentação: baseada apenas na exposição congelada e no briefing sintético. Execução: geração deste documento e registro local por ledger, cuja gravação deve ser comprovada por hash/bytes. Qualidade de domínio: revisão independente e avaliação de fidelidade **UNVERIFIED**; nenhum teste comportamental de clone foi executado.

Build, render, dispositivo, percepção e tecnologia assistiva: **UNTESTED / UNVERIFIED**, sem requisito de UI ou plano de execução desses meios no caso. Nenhum efeito em produção, envio, pagamento, remoção ou publicação externa foi realizado.

Para transformar princípios em heurísticas pessoais, faltam amostras contextualizadas de decisões envolvendo rapidez/revisão, consequências e exceções, além de perfil completo e rubrica de confiança. Essas necessidades são lacunas de evidência, não etapas já executadas.
