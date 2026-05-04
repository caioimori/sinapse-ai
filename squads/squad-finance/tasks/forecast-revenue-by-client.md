---
task: forecast-revenue-by-client
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: client_list
    tipo: array
    origem: "CRM, financeiro"
    obrigatorio: true

Saida:
  - campo: client_revenue_forecast
    tipo: document
    destino: "budget-controller, finance-orqx"

Checklist:
  - "[ ] Listar clientes ativos"
  - "[ ] Projetar receita recorrente"
  - "[ ] Projetar expansao/contraction"
  - "[ ] Estimar churn risk"
  - "[ ] Consolidar forecast"
---

# Task: Forecast Revenue by Client

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Projetar receita por cliente para os proximos 3-12 meses.

## Steps

1. **Para cada cliente ativo:**
   ```
   Receita_base = MRR ou receita media mensal
   Probabilidade_renovacao = baseada em NPS, health score, historico
   Potencial_expansion = projetos no pipeline, upsell identificado
   Risco_churn = sinais de insatisfacao, competidores, budget do cliente
   ```
2. **Projecao individual:**
   ```
   Receita_projetada = Receita_base × Prob_renovacao
                     + Expansion × Prob_expansion
                     - Contraction_estimada
   ```
3. **Consolidar:**
   ```
   Total_projetado = Σ receita_projetada_clientes
   + Nova_receita_pipeline (de forecast-revenue-pipeline)
   ```

## Output
- Forecast por cliente (3-12 meses)
- Risco de churn por cliente
- Oportunidades de expansion
- Receita total projetada

## Quality Gates
- [ ] Todos os clientes ativos avaliados
- [ ] Risco de churn fundamentado
- [ ] Expansion baseada em pipeline real

## Quando Usar
- Planejamento trimestral
- Input para forecast de receita total
