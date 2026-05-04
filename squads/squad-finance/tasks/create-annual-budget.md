---
task: create-annual-budget
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: year
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: strategic_plan
    tipo: object
    origem: "diretoria"
    obrigatorio: true
  - campo: historical_data
    tipo: object
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: annual_budget
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Projetar receita (com Vault + Flow)"
  - "[ ] Planejar headcount e folha"
  - "[ ] Planejar ferramentas e infra"
  - "[ ] Planejar marketing e vendas"
  - "[ ] Planejar overhead e administrativo"
  - "[ ] Calcular EBITDA projetado"
  - "[ ] Validar com diretoria"
---

# Task: Create Annual Budget

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** CRITICAL

## Objetivo
Criar orcamento anual por cost center, alinhado com plano estrategico e historico financeiro.

## Steps

1. **Receita projetada** (com base em forecast-revenue-pipeline):
   ```
   Receita_projetada = Recorrente + Nova_receita + Growth_existentes
   ```
2. **Folha de pagamento:**
   ```
   Headcount_planejado × Custo_loaded × 12 meses
   + Novas contratacoes (pro-rata)
   + Reajustes planejados
   ```
3. **Ferramentas e infra:**
   ```
   Vendors atuais + novos planejados
   Aplicar otimizacoes identificadas
   ```
4. **Marketing e vendas:**
   ```
   % da receita (tipico: 5-15% para agencias)
   Ou bottom-up por iniciativa
   ```
5. **Overhead e administrativo:**
   ```
   Aluguel, contabilidade, juridico, seguros, etc.
   Tipico: 10-20% da receita
   ```
6. **Consolidar por mes e por cost center**
7. **Calcular EBITDA projetado e comparar com target**

## Output
- Budget anual por mes e por cost center
- P&L projetado anual
- Headcount plan
- EBITDA projetado vs target
- Premissas documentadas

## Quality Gates
- [ ] Receita projetada fundamentada em pipeline real
- [ ] Folha considera contratacoes e reajustes
- [ ] EBITDA acima do target minimo
- [ ] Premissas explicitas e revisaveis

## Quando Usar
- Planejamento anual (Q4 do ano anterior)
- Reforecast semestral
