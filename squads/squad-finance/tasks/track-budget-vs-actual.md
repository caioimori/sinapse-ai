---
task: track-budget-vs-actual
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: project_or_cost_center
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: budget_data
    tipo: object
    origem: "budget-controller"
    obrigatorio: true
  - campo: actual_data
    tipo: object
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: budget_tracking_report
    tipo: document
    destino: "budget-controller, finance-orqx"

Checklist:
  - "[ ] Coletar orcamento aprovado"
  - "[ ] Coletar gastos reais"
  - "[ ] Calcular variancia"
  - "[ ] Identificar causas de desvio"
  - "[ ] Projetar tendencia"
---

# Task: Track Budget vs Actual

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Comparar orcamento aprovado com gastos reais, identificar desvios e projetar tendencia para o restante do periodo.

## Inputs
- Projeto ou cost center
- Budget aprovado (linha a linha)
- Gastos reais no periodo

## Steps

1. **Coletar dados:** budget por rubrica e gastos reais
2. **Calcular variancia por rubrica:**
   ```
   Variancia = Actual - Budget
   Variancia % = Variancia / Budget × 100
   ```
3. **Classificar desvios:**
   - Verde: |var%| <= 5%
   - Amarelo: 5% < |var%| <= 15%
   - Vermelho: |var%| > 15%
4. **Identificar root cause** para desvios amarelos e vermelhos
5. **Projetar EAC (Estimate at Completion):**
   ```
   EAC = Actual_to_date + (Budget_restante × Performance_Index)
   Performance_Index = Actual_to_date / Budget_to_date
   ```

## Output
- Tabela budget vs actual com variancia por rubrica
- Traffic light por linha
- EAC projetado
- Root cause dos desvios significativos

## Quality Gates
- [ ] Todas as rubricas do budget comparadas
- [ ] Root cause para desvios > 10%
- [ ] EAC projetado com base em performance index

## Quando Usar
- Acompanhamento mensal de projetos
- Check de saude financeira por cost center
