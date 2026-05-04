---
task: optimize-rate-realization
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: billing_data
    tipo: object
    origem: "financeiro, billing"
    obrigatorio: true

Saida:
  - campo: rate_realization_report
    tipo: document
    destino: "finance-orqx, comercial"

Checklist:
  - "[ ] Calcular rate realization atual"
  - "[ ] Identificar vazamentos de valor"
  - "[ ] Definir acoes de melhoria"
  - "[ ] Projetar impacto das melhorias"
---

# Task: Optimize Rate Realization

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Otimizar rate realization — quanto da receita teorica (rate card × horas) e efetivamente faturada.

## Steps

1. **Calcular rate realization:**
   ```
   Rate Realization = Receita_faturada / (Horas_trabalhadas × Rate_card)
   Target: >= 85%
   Alerta: < 75%
   ```
2. **Identificar vazamentos:**
   - Descontos concedidos (% medio)
   - Scope creep nao cobrado (horas extras nao faturadas)
   - Retrabalho interno (horas perdidas)
   - Write-offs (horas canceladas)
   - Underpricing (vendido abaixo do rate card)
3. **Quantificar cada vazamento** em R$
4. **Definir acoes:**
   - Change order process para scope creep
   - Discount policy com aprovacao
   - Better scoping para reduzir retrabalho
   - Training comercial em negociacao

## Output
- Rate realization atual e historico
- Breakdown de vazamentos com valor R$
- Top 3 acoes de melhoria com impacto estimado

## Quality Gates
- [ ] Rate realization calculada com dados reais
- [ ] Vazamentos quantificados em valor
- [ ] Acoes com impacto projetado

## Quando Usar
- Rate realization abaixo de 80%
- Review trimestral de pricing
- Margem caindo sem mudanca de custo
