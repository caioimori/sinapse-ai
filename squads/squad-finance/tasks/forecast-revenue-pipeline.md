---
task: forecast-revenue-pipeline
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: pipeline_data
    tipo: object
    origem: "CRM, comercial"
    obrigatorio: true
  - campo: historical_revenue
    tipo: object
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: revenue_forecast
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Coletar pipeline comercial"
  - "[ ] Aplicar probabilidade por estagio"
  - "[ ] Adicionar receita recorrente"
  - "[ ] Modelar sazonalidade"
  - "[ ] Gerar forecast 3/6/12 meses"
---

# Task: Forecast Revenue Pipeline

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Projetar receita futura combinando pipeline comercial (novos negocios) com receita recorrente e sazonalidade.

## Steps

1. **Receita recorrente (base):**
   ```
   MRR_base = Σ retainers_ativos + contratos_em_andamento
   Aplicar churn estimado: MRR_projetado = MRR_base × (1 - Churn_mensal)
   ```
2. **Pipeline de novos negocios:**
   ```
   Para cada oportunidade:
   Receita_ponderada = Valor × Probabilidade_por_estagio

   Probabilidades tipicas:
   | Estagio | Probabilidade |
   |---------|--------------|
   | Prospect | 5% |
   | Qualificado | 15% |
   | Proposta enviada | 30% |
   | Negociacao | 50% |
   | Verbal OK | 80% |
   | Contrato assinado | 95% |
   ```
3. **Sazonalidade:**
   ```
   Aplicar fator sazonal por mes (baseado em historico)
   Ex: Janeiro 0.7, Fevereiro 0.8, Marco 1.0, ..., Novembro 1.2, Dezembro 0.6
   ```
4. **Consolidar forecast** por mes para proximos 12 meses
5. **3 cenarios:** pessimista (70%), base (100%), otimista (130%)

## Output
- Forecast de receita mensal para 12 meses
- 3 cenarios (pessimista, base, otimista)
- Breakdown: recorrente vs nova receita
- Confidence level por mes

## Quality Gates
- [ ] Pipeline atualizado (ultima semana)
- [ ] Probabilidades calibradas com win rate real
- [ ] Sazonalidade baseada em historico
- [ ] 3 cenarios com premissas explicitas

## Quando Usar
- Planejamento orcamentario
- Decisao de investimento/hiring
- Update mensal de forecast
