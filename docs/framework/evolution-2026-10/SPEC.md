# Evolução SINAPSE — 2 de outubro de 2026

## Objetivo

Atualizar o framework com melhorias verificáveis do AIOX público e conhecimento
rastreável por competência para todas as squads, usando GPT-6.1 Sol para pesquisa
e síntese e Jev para classificação semântica delimitada.

## Escopo

- Comparar releases, árvore e licença upstream com o fork e preservar customizações.
- Inventariar squads, agentes, skills, workflows, tarefas e bases; distinguir existência,
  resolução, distribuição e efetiva execução. Comparar também trabalho local preservado.
- Corrigir gargalos em extensões permitidas, com contratos, testes e evidências.
- Entregar o runtime/corpus também pelos instaladores local e global existentes,
  com testes em diretórios temporários; empacotamento isolado não prova instalação.
- Criar biblioteca inicial de heurísticas lidas e fontes primárias para as 17 squads,
  com recuperação seletiva, lacunas explícitas e matriz de consumidores por agente.
- Preparar triagem Jev offline e executor controlado com cache, timeout, retries limitados
  e reserva de orçamento antes de cada tentativa. Uso pago depende de teto autorizado.
- Avaliar estruturalmente e preparar comparação comportamental antes/depois em casos reservados.

## Limites

Preservar os 191 arquivos alterados do checkout original e outros worktrees. Partir
do remoto origin/main 842eeabc4e9fe39d42f1119c9dc85a8a1e70cbc5 (1.27.0).
Não alterar paths protegidos, instalar/rodar código remoto, publicar, apagar conteúdo,
alterar instalação global, pagar API ou copiar AIOX Pro proprietário.

## Critérios de pronto

1. Proveniência upstream registra versão, SHA, data, licença e decisão por mudança.
2. Inventário reproduzível cobre todos os agentes/squads; falhas não são ocultadas.
3. Fontes efetivamente lidas sustentam heurísticas com localizador e exceções;
   consumidor com lacuna continua identificado como lacuna.
4. Consulta de conhecimento limita contexto e retorna referências verificáveis.
5. Limites Jev e validações falham com segurança; offline não faz chamadas externas.
6. Testes aplicáveis, lint, typecheck e gates registram sucesso ou limitação real.
7. Instalação/publicação e ganho comportamental não são afirmados sem teste próprio.

## Arquitetura e decisão

Camada aditiva em scripts/framework-evolution e research/framework-evolution;
o core permanece fonte canônica. JSON versionado separa corpus, decisões e relatórios.
Código determina permissões, cálculos, validação e orçamento; modelos propõem e julgam
conteúdo. Uma fonte não lida ou evidência incompatível impede promover a heurística.

Importação irrestrita do AIOX foi rejeitada: os namespaces, personalizações, contratos
de runtime e a licença devem ser reconciliados por arquivo. Modelo novo sem corpus e
avaliação foi rejeitado como indicador de qualidade. A contrapartida é uma entrega
local mais conservadora, com adaptações incrementais e cobertura incompleta declarada.

Os instaladores usam layouts diferentes: o repositório contém squads e .sinapse-ai;
o global contém squads diretamente e core. O adapter resolve ambos explicitamente,
sem copiar todo o framework para uma segunda árvore. A entrega do bundle exige
recibo e consulta real em fixtures locais/globais; o perfil pessoal permanece intacto.

A seleção por agente é insuficiente para tarefas distintas do mesmo especialista.
O recuperador recebe metadados da tarefa canônica e ranqueia competências e termos
de forma determinística; ausência de relevância é registrada. Esse filtro lexical
não equivale a busca semântica validada nem mede qualidade da resposta generativa.

A regra de referências externas admite somente os dez arquivos exatos desta
auditoria e seus testes. A exceção conserva URLs, licenças e hashes solicitados
pelo usuário; produto, CLI, instaladores e agentes continuam sujeitos ao bloqueio.
Referências a personas herdadas permanecem proibidas inclusive nesses arquivos.

## Responsáveis e handoffs

Pesquisa upstream entrega recibo de proveniência e mapa de adaptação; clonagem entrega
schemas, corpus e recuperador; engenharia entrega inventário, gargalos e integrações.
Qualidade integra os contratos e verifica; devops pode salvar a branch local, sem push.
