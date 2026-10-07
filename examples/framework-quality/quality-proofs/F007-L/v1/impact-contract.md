# F007-L — architect-analyze-impact

Status: contrato arquitetural proposto, análise estática do caso sintético; execução persistente UNVERIFIED. Não é implementação, migração, aprovação de qualidade nem autorização de publicação.

## Evidência e decisão

Fatos recebidos: dois processos têm caches separados; a proposta usa lock em memória; conflito de 3% foi observado sinteticamente. Fonte: generation-cases/F007-L.json, case.facts e case.brief, SHA256 0a9354e27e78ed4531ffc907549d308689185dcb655070842761439c58d13504. Denominador, janela, carga e significado de conflito não foram fornecidos; 3% não prova corrupção nem constitui baseline comparável.

Veto arquitetural: não usar lock em memória como exclusão global. Por inferência desses fatos, cada processo pode adquirir seu próprio lock e decidir a partir de cache independente. O lock pode otimizar um processo, mas não sustenta consistência entre processos. Recomendo uma autoridade persistente compartilhada com transição condicional atômica; caches servem leitura e aceleração, jamais autorização de escrita.

Não proponho novos microserviços: nenhum requisito comprova autonomia de deploy ou escala. Preservar a topologia atual, ainda desconhecida, e introduzir o limite lógico abaixo. A tecnologia persistente existente também é desconhecida; esta proposta não seleciona pacote ou banco.

## R1 — limite de domínio e impacto

Nome do limite: Transições do recurso compartilhado. É um limite lógico de responsabilidade, não um serviço ou tabela novos. Ele possui o significado da transição, a precondição de negócio, a versão autoritativa, a identidade da operação e o resultado durável. O tipo de recurso e suas regras reais precisam ser fornecidos antes da implementação.

Contrato de entrada: sujeito autenticado, escopo autorizado do recurso, identidade do recurso, identidade da operação, payload validado e versão esperada. O escopo pode ser tenant somente se o produto tiver tenancy; não inferir sua existência. Autorizar sujeito/recurso antes de processar ou recuperar resultado. Saída: aplicada com nova versão e resultado, repetição com resultado já gravado, conflito de versão/precondição, chave reutilizada com payload divergente ou indisponibilidade sem sucesso presumido.

Dependência proposta: processos A e B -> mesmo contrato de transição -> mesma autoridade persistente. Caches A/B <- leitura autoritativa ou invalidação posterior ao commit. Outros escritores, jobs e rotas antigas precisam cumprir a mesma condição persistente. O impacto inclui todas as rotas de escrita, caches, retries, falhas após commit, telemetria e retorno de conflitos. São superfícies a inspecionar, não componentes efetivamente inventariados.

Invariante persistente: para cada recurso e versão autoritativa v, no máximo uma transição aceita pode consumir v; aceitação requer autorização, precondição verdadeira e avanço atômico para v+1. Uma leitura de cache não pode contornar a condição. O efeito e o resultado da operação precisam ser gravados na mesma fronteira atômica, para não existir efeito confirmado sem identidade/resultado recuperável. Persistência indisponível implica falha fechada ou espera delimitada, nunca fallback de escrita só em cache.

Preferência: comparação atômica da versão esperada com a versão persistida, verificada junto da regra de negócio. Alternativa: exclusão persistente transacional compartilhada, se contenção ou uma regra não representável pela versão justificar seu custo. Lock distribuído por lease tem risco de expiração; sem fencing persistente não substitui a condição. Data-engineer decide o mecanismo, estrutura, restrições, isolamento e índices; architect não fornece SQL nem executa banco.

## R2 — idempotência

A identidade da operação deve ser criada antes do primeiro envio e mantida em retries, inclusive após timeout. Seu namespace contém o escopo autorizado, tipo de comando e identidade do recurso. Associar a chave ao fingerprint canônico de todos os campos que definem o efeito; excluir apenas campos comprovadamente não semânticos. O algoritmo de canonicalização e o horizonte de retenção ainda requerem definição.

Uma mesma chave e mesmo fingerprint retorna o mesmo resultado durável sem outro efeito, inclusive quando a resposta original se perdeu após commit. Mesma chave com fingerprint diferente rejeita antes de alterar o recurso. Duas operações distintas concorrendo pela versão v: no máximo uma aplica; a outra recebe conflito e não reenvia automaticamente uma intenção de negócio sobre uma versão nova.

Aquisição da identidade, verificação da versão/precondição, efeito e gravação do resultado formam uma unidade atômica. Uma repetição em curso não confirma sucesso: aguarda por prazo limitado ou recebe estado em curso recuperável. Uma falha antes do commit permite retry seguro; após commit, leitura da chave recupera o resultado. Não liberar identidade por timeout nem apagar registros dentro do horizonte de retry. Retenção menor que retries admitidos viola a garantia.

Garantia delimitada: no máximo um efeito local por identidade aceita, dentro do escopo e retenção definidos. Não prometer exactly-once universal. Efeitos em terceiros não foram informados; se existirem, a atomicidade local não os cobre e exigirá contrato específico de entrega/deduplicação antes do rollout.

## R3 — rollout, medidas e rollback

Toda execução abaixo é proposta e não foi autorizada nesta avaliação. Pré-condições: recurso/regra identificados, todas as rotas escritoras conhecidas, implementação especializada, cenário concorrente em ambiente isolado e revisão independente. Sem essas condições, manter proposta sem ativação.

Instrumentação: registrar identidade correlacionável sem payload sensível, recurso pseudonimizado, versão esperada/resultante, aplicada/repetida/conflito/divergência, resultado recuperável e latência. Unidade de conflito: operações lógicas distintas que falham por versão/precondição divididas pelas operações lógicas distintas admitidas para transição na mesma coorte/janela; retries com mesma chave contam uma vez. Excluir chaves divergentes e falhas de infraestrutura do numerador e mostrá-las separadamente. A taxa de 3% só é comparável após reconstruir essa definição.

Rollout delimitado proposto: shadow somente leitura para checar decisões sem efeitos; depois 5%, 25% e 100% dos recursos elegíveis de uma única coorte isolada, escolhidos deterministicamente por recurso. Todos os escritores de um recurso devem aderir ao guard persistente. A seleção gradual pode variar o novo caminho, mas nunca permitir escritor legado sem guard para o mesmo recurso. Cada etapa requer ao menos 1.000 operações lógicas e 30 minutos; ambos precisam ocorrer. Amostra insuficiente mantém a etapa por no máximo 24 horas, depois pausa para revisão; não promover por ausência de dados.

Gatilhos propostos, não derivados de medições existentes:
- Qualquer segunda aplicação para a mesma identidade ou dois aceites de v: interromper novas escritas afetadas imediatamente (tolerância zero).
- Qualquer retorno de sucesso sem resultado durável recuperável: interromper imediatamente.
- Taxa de conflitos >2% em duas janelas consecutivas de 15 minutos, cada qual com >=500 operações lógicas: interromper expansão e retornar o caminho compatível. Resultado entre 1% e 2% mantém a etapa; promover somente com <=1% na janela da etapa e nenhum incidente de integridade.
- p95 da latência de transição >1,20 vezes o baseline comparável por duas janelas de 15 minutos, cada qual com >=500 operações, ou erros de infraestrutura >1% nas mesmas duas janelas: interromper expansão. Baseline ausente impede promoção pelo critério de latência.

Os valores 1%, 2%, 20%, 500/1.000 e os tempos são critérios iniciais de aceitação do contrato, sujeitos a ratificação antes de executar; não alegar ganhos frente aos 3% sem definição compatível. Separar conflitos legítimos da evidência de dupla aplicação: reduzir conflito não pode ser obtido aceitando transição inválida.

Rollback: desligar novas admissões do caminho afetado; em até 5 minutos, confirmar telemetria de zero novas admissões, reconciliar operações em curso pela identidade durável e restaurar roteamento somente para escritor que preserve o mesmo guard persistente. Manter versões, identidades e resultados duráveis; invalidar ou reler caches. Não fazer rollback destrutivo de dados nem remover restrições. Se o escritor anterior não respeita o guard, manter escritas suspensas; não reativar o lock local como proteção global. Recuperação do serviço é UNVERIFIED.

Critério verificável da reversão: nenhuma dupla aplicação; toda identidade confirmada recupera o resultado; zero novas admissões no caminho retirado; 30 minutos e >=1.000 operações no caminho compatível sob os mesmos limites de conflito/erro/latência. Sem volume, registrar recuperação incompleta e não afirmar estabilidade. A meta de 5 minutos é proposta de contenção, não um tempo observado.

## R4 — autoridade e contratos de encaminhamento

architect: mantém invariante, limite, impactos, trade-offs, gatilhos e reversibilidade; este documento é seu entregável. Não houve acesso, gravação, SQL, migração, instalação, Git ou ação externa.

data-engineer: recebe invariante/identidade/atomicidade/retenção e entrega mecanismo persistente, esquema e políticas apropriadas, análise de todas as rotas escritoras, plano de migração não destrutivo e prova concorrente no ambiente isolado autorizado. Não assume publicação.

developer: recebe contrato de entrada/saída e story validada; entrega adaptação das rotas, retries, caches e instrumentação preservando o guard em todos os escritores. Não assume banco ou release.

quality-gate: recebe artefato, cenário e locators das execuções; entrega veredicto independente e cobertura da matriz abaixo. devops: recebe mudança revisável e plano de rollout/rollback; somente executa publicação depois da autorização humana específica. Encaminhamentos são contratos preparados, não delegações enviadas ou execuções observadas nesta avaliação.

## Matriz de aceitação a executar pelo root/especialistas

Locator do contrato: examples/framework-quality/quality-proofs/F007-L/v1/impact-contract.md. O root deve ligar recibos futuros ao hash deste artefato e a uma versão identificada da implementação; artefato documental não fornece locator de runtime.

1. Dois processos reais, caches distintos, mesma versão, identidades distintas e barreira de concorrência: exatamente um aceite; outra operação conflita; versão avança uma vez. Status: UNTESTED.
2. Dois processos, mesma identidade/fingerprint simultâneos: um efeito e um resultado durável; repetição retorna esse resultado. Status: UNTESTED.
3. Mesma identidade com payload diferente: rejeição sem efeito adicional, sem vazamento entre sujeitos/escopos. Status: UNTESTED.
4. Queda antes do commit: nenhum efeito parcial. Queda após commit e antes da resposta: retry recupera resultado e não reaplica. Status: UNTESTED.
5. Cache deliberadamente stale, escritor antigo/job e indisponibilidade da autoridade: nenhum bypass do guard nem sucesso local presumido. Status: UNTESTED.
6. Volumes/janelas/coortes conhecidos: deduplicação e contadores reconciliam; disparar limiares verifica pausa, não promoção indevida. Status: UNTESTED.
7. Rollback com operação em curso e escritor anterior incompatível: suspender, preservar identidades/versões, reconciliar e recuperar somente caminho compatível; medir contenção e estabilidade. Status: UNTESTED.

## Limites da análise e grounding

R1/R2: contrato e inferência do caso, não prova de persistência. R3: definição mensurável proposta, não performance observada. R4: limites de autoridade preservados, com encaminhamentos sem execução alheia. Registro e hash demonstram existência/integridade do artefato, não nota ou aprovação.

Fontes completas lidas: AGENTS.md e Constitution (autoridade e não invenção), architect.md (responsibility_boundaries), architect.toml (adaptador), architect-analyze-impact.md (parâmetros, implementação, validação e handoff), contexts/architect.json e generation-cases/F007-L.json. Contexto tem validatedExpertise=false, planned/pending-independent-review e knowledge.coverage=gap; referências READ e critérios authored não estabelecem experiência validada.

Task exata foi exposta, mas execução do seu runner permanece UNVERIFIED: briefing não fornece component-path real ou inventário; script ilustrativo deixa propagationPredictor=null com inicialização comentada e depois chama predictPropagation. Não executar nem reparar dependências fora da exposição. Não afirmar análise de grafo, número de componentes, propagação, testes, build ou runtime. Banco, isolamento, regras do recurso, carga e retenção são lacunas. Percepção, dispositivo e AT não são requisitos desse contrato; nenhuma observação dessas modalidades foi realizada.