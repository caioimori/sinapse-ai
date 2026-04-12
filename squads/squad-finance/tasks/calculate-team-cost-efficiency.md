---
task: calculate-team-cost-efficiency
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_data
    tipo: object
    origem: "RH, timesheets"
    obrigatorio: true

Saida:
  - campo: team_efficiency_report
    tipo: document
    destino: "finance-orqx, gestao"

Checklist:
  - "[ ] Calcular custo loaded por pessoa"
  - "[ ] Calcular utilizacao por pessoa"
  - "[ ] Calcular receita gerada por pessoa"
  - "[ ] Identificar oportunidades"
---

# Task: Calculate Team Cost Efficiency

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Calcular eficiencia de custo da equipe para identificar oportunidades de otimizacao e fundamentar decisoes de hiring.

## Inputs
- Lista de membros da equipe com salario e beneficios
- Horas faturadas e nao-faturadas por pessoa
- Projetos e receita gerada por pessoa

## Steps

1. **Custo loaded por pessoa:**
   ```
   Custo_loaded = Salario_bruto × (1 + Taxa_encargos + Taxa_beneficios)
   Taxa_encargos CLT: ~70-80% (FGTS, INSS, 13o, ferias, etc.)
   Taxa_beneficios: ~10-20% (VR, VA, plano saude, etc.)
   Custo_loaded ≈ Salario_bruto × 1.8-2.0 (CLT)
   Custo_loaded ≈ Salario_bruto × 1.05-1.15 (PJ)
   ```
2. **Eficiencia individual:**
   ```
   Receita_gerada / Custo_loaded >= 3.0 (ideal)
   ```
3. **Classificar equipe:**
   - Revenue Generator (ratio >= 3.0): alta contribuicao
   - Breakeven (ratio 1.5-3.0): atencao
   - Cost Center (ratio < 1.5): acao necessaria
4. **Comparar CLT vs PJ vs Freelancer** para cada funcao

## Output
- Custo loaded por pessoa/funcao
- Eficiencia individual e por equipe
- Classificacao Revenue Generator / Breakeven / Cost Center
- Recomendacoes de otimizacao (reskilling, reestruturacao, mix CLT/PJ)

## Quality Gates
- [ ] Custos loaded incluem todos os encargos
- [ ] Horas faturadas e nao-faturadas precisas
- [ ] Recomendacoes respeitam contexto humano

## Quando Usar
- Decisao de hiring ou demissao
- Reestruturacao de equipe
- Planejamento orcamentario de folha
