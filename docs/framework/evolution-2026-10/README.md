# Evolução SINAPSE — resultado local

O framework recebeu consulta de conhecimento por agente e tarefa, entrega pelos
instaladores e correções de segurança. O trabalho anterior foi preservado.
O AIOX público foi baixado e auditado como fonte upstream;
seu core não foi substituído automaticamente.

| Frente | Resultado | Evidência |
|---|---|---|
| AIOX | Release 5.4.1; snapshot público completo com 3.022 arquivos e proveniência | [Upstream](upstream.md) |
| Runtime | Consulta seletiva integrada aos 172 adapters Codex, por tarefa canônica | [Runtime](runtime.md) |
| Conhecimento | 35 fontes consultadas; 67 heurísticas inferidas; mínimo de três por squad e core | [Pesquisa](knowledge.md) |
| Modelos mentais | 24 técnicas práticas em seis squads, com condições e contraexemplos | [Aplicações](mental-models.md) |
| Segurança | js-yaml 4.3.2 e fast-uri 3.1.8; auditoria de produção sem vulnerabilidades reportadas | [Dependências](dependencies.md) |
| Jev | Lote offline por regra, com teto, cache e validação; nenhuma chamada paga | [Plano revisável](../../../research/framework-evolution/plan-batch.json) |

## Gargalos encontrados

O inventário conta 17 squads, 172 agentes, 1.412 tarefas, 332 arquivos de conhecimento,
99 arquivos de workflow e 37 skills em cada provider. A presença desses arquivos
não prova execução, qualidade do conhecimento ou equivalência comportamental.

- 77 agentes usam o catálogo da squad como fallback; atribuição especializada precisa de revisão.
- Três agentes financeiros declaram 30 tarefas sem arquivo correspondente.
- 58 tarefas não têm comando de agente mapeado; loaders genéricos podem acessá-las.
- 312 KBs não têm referência textual direta no agente; outros consumidores podem existir.
- Onze referências de workflows precisam de interpretação; não foram declaradas quebradas.
- Os 172 agentes ainda têm lacunas de fontes especializadas e avaliação comportamental.

Os problemas de referências não receberam aliases inventados. Cada agente tem
competências de domínio, especialização, motivo da lacuna e plano de fontes em
[competencies.json](../../../research/framework-evolution/competencies.json).

## O que a verificação comprova

Consulta limitada, schema, citações compatíveis, geração idempotente, empacotamento
e instalação em diretórios temporários. Os fixtures executam o runtime instalado
e o hook global em PowerShell; a instalação pessoal permanece sem alteração.

Os testes Jev usam transportes controlados: verificam reserva anterior à tentativa,
retries, prazo total, imutabilidade, respostas e cache. Eles não comprovam precisão
do modelo nem uma integração autenticada com o serviço.

O SHA das fontes do corpus cobre o excerto retido. O snapshot AIOX tem verificação
própria contra a árvore Git pública. Integridade de bytes e presença de uma citação
não comprovam, sozinhas, o apoio semântico de uma regra.

O estado final e os comandos estão na [story](../../stories/framework-evolution-20261002.story.md)
e no [handoff](HANDOFF.md). A [verificação](verification.md) distingue os testes
executados das avaliações pendentes. O [inventário](inventory.json) contém os dados detalhados.

A integração mantém o modelo selecionado na sessão Codex. Não alterou o modelo
global nem fixou GPT-6.1 Sol em todos os adapters. A avaliação deverá registrar
o modelo realmente executado para comparar resultados sob condições iguais.

## Próxima etapa

Executar o lote Jev com credencial local e orçamento autorizado, revisar decisões
por heurística e comparar agentes atuais com agentes usando conhecimento, conforme
[avaliação](evaluation.md). Depois aprofundar as fontes especializadas por prioridade.

Livro completo, persona fiel, instalação real, publicação e ganho de qualidade
não foram comprovados por esta entrega. Referências com licença restrita continuam
identificadas para revisão antes de distribuição comercial.
