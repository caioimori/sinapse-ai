---
task: design-service-tiers
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: service_category
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: target_audience
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: tier_design
    tipo: document
    destino: "squad-commercial, finance-orqx"

Checklist:
  - "[ ] Definir 3 tiers com Good/Better/Best"
  - "[ ] Definir escopo de cada tier"
  - "[ ] Precificar cada tier"
  - "[ ] Validar margem de cada tier"
  - "[ ] Criar ancora de preco"
---

# Task: Design Service Tiers

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Desenhar arquitetura de tiers Good/Better/Best para um servico, maximizando conversao no tier alvo.

## Steps

1. **Definir atributos diferenciadores:**
   - Escopo de entrega
   - Velocidade / SLA
   - Nivel de suporte
   - Personalizacao
   - Garantias
2. **Montar tiers:**
   ```
   GOOD (Essentials):
   - Escopo minimo viavel
   - SLA padrao
   - Suporte por email
   - Margem target: 40-50%
   - Proposito: ancora baixa, entry point

   BETTER (Professional):
   - Escopo completo
   - SLA acelerado
   - Suporte dedicado
   - Margem target: 55-65%
   - Proposito: TIER ALVO (50-60% dos clientes)

   BEST (Enterprise):
   - Escopo maximo + extras exclusivos
   - SLA prioritario
   - Suporte VIP + account manager
   - Margem target: 70-80%
   - Proposito: ancora alta, upsell
   ```
3. **Precificar com psicologia:**
   ```
   Good: X
   Better: X × 1.8-2.2 (melhor custo-beneficio percebido)
   Best: X × 3.0-4.0 (ancora que faz Better parecer barato)
   ```
4. **Validar margens** com dados de cost-per-delivery

## Output
- Tabela completa de 3 tiers com atributos, precos e margens
- Logica de ancora e conversao esperada
- Comparacao de receita por cenario de mix

## Quality Gates
- [ ] Cada tier tem margem acima do minimo
- [ ] Diferenciacao entre tiers e clara e tangivel
- [ ] Better e claramente o melhor custo-beneficio
- [ ] Precos seguem proporcoes psicologicas

## Quando Usar
- Lancamento de novo servico
- Reestruturacao de oferta existente
- Proposta comercial com opcoes
