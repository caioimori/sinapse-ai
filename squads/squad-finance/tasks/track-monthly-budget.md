---
task: track-monthly-budget
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: month
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: budget
    tipo: object
    origem: "orcamento aprovado"
    obrigatorio: true
  - campo: actuals
    tipo: object
    origem: "contabilidade"
    obrigatorio: true

Saida:
  - campo: budget_tracking
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Coletar gastos reais do mes"
  - "[ ] Comparar com budget por rubrica"
  - "[ ] Calcular pacing (YTD)"
  - "[ ] Alertar desvios significativos"
---

# Task: Track Monthly Budget

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Acompanhar budget mensal vs realizado, identificando desvios e projetando pacing para o ano.

## Steps

1. **Comparar por rubrica:**
   ```
   | Rubrica | Budget | Actual | Var | Var% | Status |
   ```
2. **Calcular YTD pacing:**
   ```
   Pacing = Actual_YTD / Budget_YTD × 100
   Budget_remaining = Budget_anual - Actual_YTD
   Months_remaining = 12 - Mes_atual
   Budget_mensal_restante = Budget_remaining / Months_remaining
   ```
3. **Alertar desvios** conforme thresholds (5%, 15%)
4. **Projetar EAC (Estimate at Completion)**

## Output
- Tabela budget vs actual do mes
- YTD pacing e projecao anual
- Alertas por rubrica
- Recomendacoes de ajuste

## Quality Gates
- [ ] Todas as rubricas reconciliadas
- [ ] Pacing YTD calculado
- [ ] Alertas para desvios > 10%

## Quando Usar
- Fechamento mensal (obrigatorio)
