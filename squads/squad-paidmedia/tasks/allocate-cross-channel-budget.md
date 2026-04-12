---
task: allocate-cross-channel-budget
responsavel: "@paidmedia-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: budget_total
    tipo: number
    origem: "cliente"
    obrigatorio: true
  - campo: performance_data
    tipo: data
    origem: "Pulse"
    obrigatorio: true

Saida:
  - campo: budget_allocation
    tipo: document
    destino: "Signal + Query"

Checklist:
  - "[ ] Marginal CPA/ROAS calculado por canal"
  - "[ ] Diminishing returns identificados"
  - "[ ] Allocation com justificativa de dados"
---

# Task: Allocate Cross-Channel Budget

## Metadata
- **Agent:** paidmedia-orqx (Apex)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Alocar budget entre canais (Meta, Google, outros) com base em analise de retorno marginal, maximizando conversoes totais dentro do budget disponivel.

## Inputs
- Budget total mensal disponivel
- Performance data por canal (ultimos 30-90 dias)
- CPA/ROAS targets
- Objetivos de volume (leads, vendas, etc.)

## Steps

1. **Calcular CPA marginal por canal**
   - Para cada canal, calcular CPA em faixas de spend:
     - Faixa 1: primeiros 25% do spend atual
     - Faixa 2: 25-50% do spend atual
     - Faixa 3: 50-75% do spend atual
     - Faixa 4: 75-100% do spend atual
   - Formula: CPA marginal = (Spend incremental) / (Conversoes incrementais)
   - Identificar ponto de inflexao (onde CPA marginal > CPA target)

2. **Calcular ROAS marginal por canal**
   - Mesma logica de faixas
   - Formula: ROAS marginal = (Revenue incremental) / (Spend incremental)
   - Identificar ponto de inflexao (onde ROAS marginal < ROAS target)

3. **Ordenar canais por eficiencia marginal**
   - Rank por CPA marginal (menor = melhor) ou ROAS marginal (maior = melhor)
   - Alocar budget sequencialmente: primeiro canal mais eficiente ate ponto de inflexao, depois proximo

4. **Aplicar restricoes**
   - Minimum viable spend por canal (abaixo nao vale a pena: Meta ~$50/day, Google ~$30/day)
   - Maximum spend sem perda de eficiencia (antes do ponto de inflexao)
   - Reserva para testes (5-10% do budget total)
   - Reserva para retargeting (15-20% do budget total)

5. **Gerar allocation plan**
   - Budget por canal ($ e %)
   - Budget por tier dentro de cada canal
   - Trigger de rebalanceamento (se CPA marginal mudar >20%)
   - Schedule de revisao (semanal para accounts >$10K/mo)

## Output
Tabela de alocacao:
| Canal | Budget | % Total | CPA Marginal | ROAS Marginal | Headroom |
|-------|--------|---------|--------------|---------------|----------|

## Quality Gates
- [ ] CPA marginal calculado com dados reais (nao estimativas)
- [ ] Ponto de inflexao identificado para cada canal
- [ ] Minimum viable spend respeitado
- [ ] Reserva de teste incluida
- [ ] Triggers de rebalanceamento definidos

## Quando Usar
- Alocacao inicial de budget para nova conta
- Rebalanceamento mensal de budget
- Quando budget total muda (aumento ou corte)
- Quando performance de um canal muda significativamente
