---
task: ux-create-wireframe
responsavel: "@ux-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
workflow_version: 1
max_iterations: 3
max_attempts: 2
---

# Criar wireframe orientado à tarefa do usuário

## Objetivo e autoridade

Traduzir o fluxo e a evidência disponíveis em estrutura anotada de tela, com estados e critérios de teste. O owner é ux-designer e o alias público é wireframe. Esta rota não concede autoridade para criar um novo design system, alterar backend ou publicar o produto.

## Entradas

- Brief com usuário, tarefa principal, contexto, resultado e restrições; pesquisa ou observações disponíveis com fonte e data.
- Fluxo atual, arquitetura da informação e conteúdo aprovado ou placeholders identificados.
- Componentes existentes, contrato de marca/tokens e requisitos de responsividade/acessibilidade.
- Estados de erro, vazio, loading e permissões pertinentes; hipóteses explícitas quando a pesquisa estiver incompleta.

## Pré-condições

Separar observação, hipótese e decisão. Sem tarefa principal ou conteúdo mínimo, devolver a lacuna específica; não inventar entrevista, persona validada ou requisito de negócio. A ausência de pesquisa não impede um rascunho marcado como hipótese, mas impede declarar UX validada.

## Passos

1. Resumir a tarefa e mapear entrada, decisão, ação principal, sucesso, erro e retorno; ligar cada etapa à fonte ou hipótese.
2. Comparar duas alternativas estruturais somente quando houver trade-off relevante. Selecionar pela tarefa, dependências e custo cognitivo, registrando o descarte.
3. Construir wireframes anotados em desktop e 390px com conteúdo plausível identificado; explicitar ordem de leitura, navegação, foco, disclosure e CTA principal.
4. Incluir estados necessários e recuperação, sem expor dados indisponíveis nem apresentar uma permissão visual como segurança implementada.
5. Percorrer o fluxo principal e o caso negativo com o brief; conferir texto longo, reflow e conteúdo essencial. Se o wireframe for renderizável, capturar desktop/mobile e overflow; em formato estático, registrar a inspeção estrutural e deixar runtime pendente.
6. Entregar estrutura, decisões, matriz de estados e roteiro de teste com usuários. Uma amostra planejada não é resultado observado nem cobertura universal.

## Saídas

Wireframe anotado por estado e breakpoint, fluxo e ordem de interação, decisões rastreáveis, perguntas abertas e plano de validação independente. Handoff indica o que será implementado e o que ainda precisa de teste.

## Critérios observáveis

- **wireframe-task:** cada região e ação corresponde à tarefa/fonte ou hipótese marcada; a ação principal e a recuperação são identificáveis. Método: walkthrough contra o brief.
- **wireframe-states:** sucesso, vazio, loading, erro e permissões pertinentes têm conteúdo e recuperação, sem alegação de segurança implementada. Método: matriz de estados e percurso negativo.
- **wireframe-reflow:** desktop/390px preservam ordem de leitura, foco e conteúdo longo; distinguir inspeção de desenho de evidência de runtime. Método: revisão de reflow e handoff.

Todos são críticos. Sem teste real com usuários, a saída permanece proposta de UX.

## Caso negativo

Entrada: formulário com erro de envio, título de 120 caracteres e usuário sem permissão em 390px. Esperado: prever mensagem/recuperação sem perda de dados, reflow legível e estado de acesso negado sem inventar dados restritos ou validação de RLS.

## Freio e falha

Máximo de três revisões e duas tentativas por ferramenta. Encerrar com critérios satisfeitos no escopo do desenho ou registrar lacunas de pesquisa/render/interação. Não converter feedback presumido em evidência.

## Rollback

Salvar versão anterior dos artefatos e hashes. Reverter apenas a versão desta execução mediante correspondência de hash; preservar alterações concorrentes e wireframes existentes. O comando não remove telas ou rotas funcionais.
