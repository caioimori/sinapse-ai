---
task: orchestrate-react-bits-frontend
responsavel: '@animations-orqx'
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: frontend_objective
    tipo: object
    origem: 'user_request_or_design_spec'
    obrigatorio: true

Saida:
  - campo: react_bits_delivery
    tipo: code_and_report
    destino: 'review-animation-quality'

Checklist:
  - '[ ] Traduzir objetivo visual em funcao de experiencia'
  - '[ ] Consultar catalogo React Bits e formar shortlist'
  - '[ ] Delegar implementacao ao especialista correto'
  - '[ ] Verificar dependencias antes da instalacao'
  - '[ ] Adaptar tokens, conteudo, responsividade e lifecycle'
  - '[ ] Validar reduced motion, acessibilidade e performance mobile'
  - '[ ] Registrar componente, variante, origem e customizacoes'
---

# Task: Orchestrate React Bits Frontend

## Objetivo

Selecionar, instalar, adaptar, combinar e auditar componentes oficiais do React Bits
para entregar uma experiência de frontend intencional, acessível e performática.

## Conhecimento obrigatório

Ler `../knowledge-base/react-bits-operational-guide.md` e carregar apenas os catálogos
de `docs/framework/react-bits/` relevantes ao pedido.

## Execução

1. Classificar a função do efeito: hierarquia, orientação, feedback, continuidade,
   atmosfera ou delight.
2. Formar shortlist de até três itens usando descrição, props, motor e custo técnico.
3. Explicar a escolha e o orçamento de atenção/performance.
4. Delegar implementação conforme o roteamento da KB; o orquestrador não implementa.
5. Antes de instalar, verificar cada dependência oficial com `npm view`.
6. Escolher a variante que preserva o stack do projeto e integrar em wrapper local.
7. Adaptar tokens, copy, semântica, breakpoints, qualidade e fallbacks.
8. Delegar auditoria a `animation-performance-engineer` e revisão final ao pipeline.

## Critérios de qualidade

- Fonte, componente e variante rastreáveis.
- Nenhuma dependência desnecessária ou não verificada.
- Conteúdo acessível sem animação e estado final imediato em reduced motion.
- Cleanup completo de RAF, timers, observers, listeners e recursos GPU.
- Mobile funcional com fallback quando o efeito exceder o orçamento.
- Licença respeitada; componentes não são redistribuídos como produto isolado.
