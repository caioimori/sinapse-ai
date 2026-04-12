---
task: prepare-financial-operations-report
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: financial_operations_report
    tipo: document
    destino: "finance-orqx, operacoes"

Checklist:
  - "[ ] Coletar dados operacionais do periodo"
  - "[ ] Calcular metricas de eficiencia"
  - "[ ] Analisar utilizacao da equipe"
  - "[ ] Consolidar em report"
---

# Task: Prepare Financial Operations Report

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Preparar report de operacoes financeiras que conecta performance operacional com resultados financeiros.

## Inputs
- Periodo de analise
- Timesheets da equipe
- Projetos ativos e entregues
- Despesas operacionais

## Steps

1. **Calcular utilizacao:**
   ```
   Utilizacao = Horas_faturadas / Horas_disponiveis × 100
   Target: 70-85% (agencias)
   ```
2. **Calcular eficiencia de entrega:**
   ```
   Eficiencia = Story_points_entregues / Horas_gastas
   Ou: Features_entregues / Custo_total
   ```
3. **Analisar mix de receita:**
   - % projetos vs retainer vs consulting
   - Tendencia de mix ao longo do tempo
4. **Calcular revenue per employee:**
   ```
   Rev_per_employee = Receita_total / Headcount
   Target agencia: R$ 15.000-25.000/mes por pessoa
   ```
5. **Identificar gargalos operacionais** que impactam financeiro

## Output
- Report completo com metricas operacional-financeiras
- Utilizacao por equipe/pessoa
- Eficiencia de entrega
- Mix de receita
- Revenue per employee
- Recomendacoes de otimizacao

## Quality Gates
- [ ] Utilizacao calculada com horas reais
- [ ] Mix de receita atualizado
- [ ] Comparacao com periodo anterior

## Quando Usar
- Fechamento mensal
- Review de eficiencia operacional
- Decisao de hiring ou reestruturacao
