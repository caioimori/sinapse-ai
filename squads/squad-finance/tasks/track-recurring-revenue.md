---
task: track-recurring-revenue
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: mrr_data
    tipo: object
    origem: "billing, contratos"
    obrigatorio: true

Saida:
  - campo: recurring_revenue_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Calcular MRR e ARR"
  - "[ ] Decompor em componentes"
  - "[ ] Calcular churn e expansion"
  - "[ ] Projetar tendencia"
---

# Task: Track Recurring Revenue

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Acompanhar receita recorrente (MRR, ARR) com decomposicao em componentes.

## Steps

1. **MRR atual:**
   ```
   MRR = Σ contratos_recorrentes_mensais
   ARR = MRR × 12
   ```
2. **Decomposicao MRR:**
   ```
   MRR_inicio_mes
   + New MRR (novos clientes)
   + Expansion MRR (upgrades, novos servicos)
   - Contraction MRR (downgrades)
   - Churn MRR (cancelamentos)
   = MRR_final_mes
   ```
3. **Metricas:**
   ```
   Net New MRR = New + Expansion - Contraction - Churn
   NRR = MRR_final / MRR_inicio × 100
   GRR = (MRR_inicio - Contraction - Churn) / MRR_inicio × 100
   Quick Ratio = (New + Expansion) / (Contraction + Churn)
   Target Quick Ratio: >= 4.0
   ```
4. **Tendencia:** MRR dos ultimos 12 meses com growth rate

## Output
- MRR e ARR atual
- Decomposicao de MRR (new, expansion, contraction, churn)
- NRR, GRR, Quick Ratio
- Tendencia 12 meses

## Quality Gates
- [ ] Todos os contratos recorrentes mapeados
- [ ] Decomposicao fecha com MRR final
- [ ] Quick Ratio interpretado corretamente

## Quando Usar
- Acompanhamento mensal de receita recorrente
- Avaliacao de saude do negocio
