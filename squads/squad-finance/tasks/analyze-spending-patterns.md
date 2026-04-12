---
task: analyze-spending-patterns
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: spending_data
    tipo: object
    origem: "contabilidade"
    obrigatorio: true
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: spending_analysis
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Categorizar gastos"
  - "[ ] Identificar tendencias"
  - "[ ] Detectar anomalias"
  - "[ ] Recomendar otimizacoes"
---

# Task: Analyze Spending Patterns

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Analisar padroes de gasto para identificar tendencias, anomalias e oportunidades de economia.

## Steps

1. **Categorizar gastos** por tipo e cost center
2. **Tendencias temporais:** crescimento MoM e YoY por categoria
3. **Deteccao de anomalias:**
   - Gastos > 2× desvio padrao da media
   - Novos vendors nao previstos
   - Categorias com crescimento > 20% MoM
4. **Benchmarks:** % de cada categoria sobre receita vs industria
5. **Oportunidades:** onde se gasta mais que o benchmark?

## Output
- Breakdown de gastos por categoria
- Tendencias (crescendo, estavel, caindo)
- Anomalias detectadas
- Oportunidades de economia

## Quality Gates
- [ ] Todos os gastos categorizados
- [ ] Pelo menos 6 meses de historico para tendencia
- [ ] Anomalias verificadas (nao sao one-time justificados)

## Quando Usar
- Review trimestral de gastos
- Busca de economia
- Antes de planejamento orcamentario
