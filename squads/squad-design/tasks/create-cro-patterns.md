---
task: create-cro-patterns
responsavel: "@cro-persuasion"
responsavel_type: Agent
atomic_layer: Task
elicit: false
workflow_version: 1
max_iterations: 3
max_attempts: 2
---

# Especificar padrões visuais de conversão

## Objetivo e autoridade

Produzir um CRO Patterns Map com hipóteses testáveis e escolhas informadas. O owner é cro-persuasion. A especificação não prova aumento de conversão e não autoriza publicação, alteração de preço ou uso de dados pessoais. Regras históricas do catálogo são sugestões condicionais, não ganhos universais.

## Entradas

- Objetivo do usuário e evento de conversão, público/contexto, jornada e páginas/surfaces permitidas.
- Oferta real: preços, condições, prazo/estoque e garantias confirmados por fonte; consentimentos e provas sociais com procedência/direito de uso.
- Analytics disponíveis com origem, janela, unidade, denominador e deduplicação; ausência explicitamente indicada.
- Conteúdo aprovado, contrato de marca/tokens, componentes existentes e restrições de acessibilidade.

## Pré-condições

Sem comprovação de claim, urgência, estoque, desconto ou depoimento, excluir esse elemento da proposta. Não fabricar contadores, badges de popularidade, garantia, compliance ou estatística. Dados ausentes permitem hipótese sinalizada, nunca resultado presumido.

## Passos

1. Mapear objeções/fricções observadas e hipóteses separadamente; escolher o menor conjunto de padrões que apoia a decisão informada.
2. Para cada padrão, registrar mecanismo proposto, condição, exceção, alternativa e fonte disponível. Contagem de CTAs, número de passos e coluna única dependem da tarefa; não repetir percentuais sem fonte pertinente.
3. Especificar conteúdo, hierarquia e estados de comparison table, prova social, CTA ou formulário selecionados, respeitando a oferta e o contrato de marca.
4. Revisar teclado/foco, leitura mobile, consentimento e dismiss/retorno. Sticky bars e movimento não podem cobrir ação/conteúdo essencial nem tornar a recusa mais difícil.
5. Definir experimento limitado: evento/janela/unidade/denominador, variante e controle, guardrails de erro/abandono e decisão. Estimativas sem dados ficam abertas; não inventar tamanho amostral.
6. Entregar o mapa e handoff aos responsáveis reais; execução e validação visual pertencem à implementação downstream, com screenshots desktop/390px quando houver artefato renderizado.

## Saídas

CRO Patterns Map por superfície com hipóteses, fonte de cada claim, especificação de estados/interação, alternativas rejeitadas e plano de teste/guardrails. Preço e causalidade comercial permanecem fora da evidência desta especificação.

## Critérios observáveis

- **cro-integrity:** toda prova, preço, garantia e urgência possui fonte autorizada; comparação e consentimento não induzem decisão enganosa. Método: rastreio de claims e revisão adversarial.
- **cro-usability:** padrões permitem teclado, recusa/retorno e leitura em 390px sem obstrução; falta de runtime é registrada. Método: inspeção de estados e handoff.
- **cro-measurement:** hipótese, controle, evento, janela, unidade/denominador e guardrails estão definidos ou marcados como lacuna; não declarar ganho causal. Método: revisão do plano de experimento.

Todos são críticos. O experimento proposto continua não executado.

## Caso negativo

Entrada: timer que reinicia, depoimento sem permissão, badge "mais popular" sem dados e consentimento pré-marcado para aumentar conversão. Esperado: rejeitar os elementos, oferecer alternativa informativa e conservar recusa equivalente; nenhum ganho inventado.

## Freio e falha

Máximo de três revisões e duas tentativas por ferramenta. Encerrar com mapa íntegro ou lacuna material. A falta de dados não autoriza buscar credenciais, enviar pesquisas ou executar experimento sem escopo específico.

## Rollback

Versionar o mapa antes da revisão. Restaurar somente a versão produzida nesta execução se o hash ainda corresponder; preservar decisões concorrentes e elementos existentes. Não remover funcionalidade nem alterar campanha publicada.
