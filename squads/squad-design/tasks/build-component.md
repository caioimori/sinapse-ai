---
task: build-component
responsavel: "@design-system"
responsavel_type: Agent
atomic_layer: Task
elicit: false
workflow_version: 1
max_iterations: 3
max_attempts: 2
---

# Construir um componente do design system

## Objetivo e autoridade

Implementar um componente delimitado na stack existente, reutilizando o inventário e os tokens aprovados. O owner é design-system; este comando não autoriza uma migração global, troca de biblioteca, publicação ou alteração de tokens compartilhados. Persona nominal não prova domínio de Brad Frost.

## Entradas

- Brief com objetivo do usuário, componente, estados necessários e arquivos permitidos; story validada quando exigida pelo projeto.
- Código vizinho, inventário de componentes, API pública e tokens/contrato de marca vigentes.
- Conteúdo real ou fixture identificada, incluindo texto longo e erro; stack, ferramentas de teste e restrições de dispositivos.
- Requisitos pertinentes de teclado, foco, nome acessível, contraste e reduced-motion quando houver movimento.

## Pré-condições

Confirmar escopo e baseline dos arquivos que serão alterados. Sem objetivo, stack ou contrato de tokens, produzir a lacuna específica e interromper a implementação dependente. Não instalar dependências para contornar informação ausente. Aplicar frontend-quality ao implementar UI.

## Passos

1. Buscar componente equivalente e seus consumidores; registrar reutilização, extensão ou criação com justificativa. Não duplicar um padrão só por preferência estética.
2. Descrever API, composição, estados e comportamento de interação antes de alterar código. Preservar compatibilidade ou declarar a mudança necessária para aprovação de escopo.
3. Implementar somente nos arquivos permitidos seguindo as convenções locais; usar tokens existentes, HTML semântico e comportamento de foco adequado ao componente.
4. Exercitar os estados obrigatórios com conteúdo longo, erro, loading e disabled quando aplicáveis. Conservar informações e objetivo com reduced-motion; não ocultar informação para eliminar animação.
5. Rodar checks pertinentes e testar comportamento real com teclado. Capturar desktop e 390px, conferir overflow e declarar dimensões observadas; screenshots não equivalem a certificação WCAG ou dispositivos físicos.
6. Entregar componente, exemplos de uso, API/estados documentados e evidências por critério. Reportar qualquer falha remanescente sem declarar o componente pronto.

## Saídas

Componente implementado ou extensão reutilizável, API e matriz de estados, exemplos com fixtures identificadas, registro de testes/capturas e lacunas. Não atribuir economia, ROI, cobertura universal ou expertise ao código gerado.

## Critérios observáveis

- **component-reuse:** a decisão traça ao inventário, aos consumidores e à API; tokens aprovados permanecem compatíveis. Método: diff e revisão da composição.
- **component-behavior:** estados e fluxo de teclado/foco/nome acessível atendem à tarefa; movimento reduzido conserva a informação. Método: teste de interação e matriz de estados.
- **component-reflow:** desktop e 390px com texto longo e erro não ocultam conteúdo essencial nem causam overflow horizontal da página. Método: screenshots e inspeção de overflow.

Todos são críticos. Critério sem evidência observada permanece pendente.

## Caso negativo

Entrada: já existe um botão equivalente; o novo pedido redefine a paleta global e o texto longo transborda em 390px. Esperado: reutilizar/estender o botão, recusar a troca de tokens fora de escopo e corrigir o reflow antes de aceitar. Um render isolado não satisfaz o caso.

## Freio e falha

Máximo de três ciclos de implementação/revisão e duas tentativas por ferramenta. Encerrar ao cumprir os critérios ou registrar bloqueio, sem repetir a mesma ação nem omitir teste vermelho. Nenhum benchmark reservado pode ser usado como fixture de treino.

## Rollback

Registrar baseline e hashes antes da edição. Restaurar somente arquivos deste componente cujo conteúdo ainda corresponda ao resultado desta execução; se houver edição concorrente, preservar e produzir reversão seletiva revisável. Não apagar componentes ou consumidores funcionais.
