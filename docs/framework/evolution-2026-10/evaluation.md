# Como comprovar melhoria dos agentes

A avaliação estrutural desta entrega comprova contratos e acesso ao conhecimento.
Ganho comportamental exige respostas reais, tarefas reservadas e comparação cega;
não pode ser deduzido da quantidade de fontes, de testes verdes ou da confiança Jev.

## Experimento

Comparar três variantes: agente atual; agente com corpus; agente com corpus revisado
por Jev. Fixar modelo, task canônica, instruções, entrada e limites de contexto.
Registrar versão, SHA do corpus e custo/tempo por execução.

Começar com dois casos novos por squad: um aplicável e um contraexemplo, totalizando
34 casos. Acrescentar referências ausentes, fonte contraditória, consulta irrelevante
e evidência insuficiente. Os casos e respostas esperadas ficam reservados antes
da execução; não podem orientar a reescrita das heurísticas durante o teste.

| Medida | Unidade e regra |
|---|---|
| Decisão correta | Proporção por caso, segundo resposta esperada revisada |
| Aplicabilidade | Regra aplicada apenas sob a condição e exceções adequadas |
| Fidelidade | Afirmações materiais apoiadas em fonte; citar link não basta |
| Limites | Contraexemplo, incerteza e falta de evidência reconhecidos |
| Regressão | Falha nova em gate, autoridade, referência ou instrução |
| Custo e tempo | Por tarefa concluída, incluindo retries e contexto |

Revisores não recebem o nome da variante. Duplicações são removidas por task e
entrada; médias são acompanhadas de resultados por squad e contagem de casos.
Casos sintéticos não comprovam impacto comercial nem transferência para todos
os 172 especialistas.

## Promoção

Promover conhecimento especializado apenas com fontes suficientes, exceções claras
e ganho observado nos casos reservados sem regressão crítica. Resultado incerto
permanece lacuna. A comparação real não foi executada nesta entrega.
