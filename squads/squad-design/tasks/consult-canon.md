---
task: consult-canon
responsavel: "@platform-aesthetic-director"
responsavel_type: Agent
atomic_layer: Task
elicit: false
workflow_version: 1
max_iterations: 3
max_attempts: 2
---

# Consultar referências de art direction para a categoria

## Objetivo e autoridade

Selecionar referências pertinentes e extrair mecanismos aplicáveis ao brief. O owner é platform-aesthetic-director; entrega curadoria, não implementação nem aprovação do produto. A existência de uma URL ou o nome Mobbin não comprova acesso ou leitura.

## Entradas

- Categoria/produto, tarefa principal, público, surfaces, restrições de identidade, marca e acessibilidade.
- Acervo/KB autorizado realmente disponível, com arquivos ou URLs, versão/data e condição de acesso.
- Objetivo de curadoria e limite de esforço; fontes primárias autorizadas quando necessária atualização.

## Pré-condições

Verificar se a KB citada pela persona existe e pode ser lida nesta execução; nomes legados não são pointers válidos. Se não houver acervo, indicar a lacuna e pesquisar somente fontes autorizadas, sem marcar referências candidatas como lidas por associação. Não copiar pixels nem presumir licença.

## Passos

1. Fixar o brief, requisitos obrigatórios e critérios de encaixe antes de abrir as referências.
2. Consultar material efetivamente observado; registrar locator, URL/arquivo, data/versão, escopo visto e acesso ausente. Atualizações externas exigem fonte primária e limite de pesquisa.
3. Comparar duas ou três referências quando disponíveis. Decompor Visual DNA, hero, design system, pricing e onboarding somente nas dimensões pertinentes; marcar o que não foi observado.
4. Para cada princípio recomendado, identificar mecanismo, condição, exceção e contraexemplo; adaptar à marca e à tarefa sem transformar cor, paleta ou popularidade em regra universal.
5. Excluir padrões incompatíveis com acessibilidade, direitos ou contexto. Separar encaixe visual de alegações comerciais, segurança ou UX não testadas.
6. Entregar dossier com seleção/descartes e handoff de verificações ao designer/frontend. Se a fonte disponível não sustentar o objetivo, declarar lacuna em vez de preencher por memória como observação atual.

## Saídas

Dossier de referências com evidência localizada, versão/escopo observado, decomposição pertinente, mecanismos/limites, escolhas e alternativa rejeitada. Não atualizar silenciosamente a KB global nem promover expertise.

## Critérios observáveis

- **canon-provenance:** cada referência tem locator, versão/data, escopo observado e situação de acesso/direito; referências não vistas permanecem candidatas. Método: readback de fontes.
- **canon-transfer:** mecanismos e exceções traçam à tarefa/marca; ao menos um contraexemplo explica quando não aplicar. Método: revisão de encaixe e descarte.
- **canon-boundary:** handoff preserva acessibilidade e marca, sem cópia, preço/conversão presumidos ou aprovação de runtime. Método: revisão de autoridade e verificações downstream.

Todos são críticos. Recomendação sem material observado fica pendente.

## Caso negativo

Entrada: screenshot sem procedência de um dev tool escuro para um produto bancário com identidade clara e usuários que precisam de alta legibilidade; fonte está atrás de login indisponível. Esperado: marcar acesso/procedência ausentes, rejeitar cópia e paleta imposta, indicar alternativa verificável ou lacuna.

## Freio e falha

Máximo de três rodadas de seleção e duas tentativas por fonte/ferramenta. Parar por saturação de mecanismo pertinente ou lacuna de acesso; não tentar contornar login nem coletar corpus ilimitado.

## Rollback

Versionar somente o dossier autorizado. Reverter a versão desta execução mediante hash, preservando edições concorrentes; a consulta não altera automaticamente fontes, KBs compartilhadas ou decisões de marca.
