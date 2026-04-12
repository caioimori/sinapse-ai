---
task: run-quarterly-financial-review
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: quarter
    tipo: string
    origem: "finance-orqx"
    obrigatorio: true

Saida:
  - campo: quarterly_budget_review
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Consolidar 3 meses de budget tracking"
  - "[ ] Calcular variancias trimestrais"
  - "[ ] Atualizar rolling forecast"
  - "[ ] Identificar tendencias"
---

# Task: Run Quarterly Financial Review

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** CRITICAL

## Objetivo
Executar review financeiro trimestral com foco em budget, forecast e tendencias.

## Steps

1. **Consolidar 3 meses:** somar budget e actual do trimestre
2. **Budget variance trimestral** com root cause
3. **Atualizar rolling forecast** com dados reais do trimestre
4. **Comparar forecast anterior vs realizado:**
   ```
   Forecast Accuracy = 1 - |Forecast - Actual| / Actual
   Target: >= 90%
   ```
5. **Identificar tendencias** para proximos trimestres
6. **Recomendar ajustes** no budget restante

## Output
- Budget vs actual trimestral
- Forecast accuracy do trimestre
- Rolling forecast atualizado
- Recomendacoes de ajuste

## Quality Gates
- [ ] 3 meses consolidados corretamente
- [ ] Forecast accuracy calculada
- [ ] Rolling forecast atualizado

## Quando Usar
- Fechamento trimestral (obrigatorio)
- Parte do coordinate-quarterly-review
