---
task: analyze-revenue-per-employee
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: headcount
    tipo: number
    origem: "RH"
    obrigatorio: true
  - campo: total_revenue
    tipo: number
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: revenue_per_employee_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Calcular revenue per employee"
  - "[ ] Comparar com benchmarks"
  - "[ ] Analisar tendencia"
---

# Task: Analyze Revenue per Employee

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** SIMPLE

## Objetivo
Analisar receita por funcionario como indicador de produtividade e eficiencia organizacional.

## Steps

1. **Calcular:**
   ```
   Rev_per_employee_mensal = Receita_mensal / Headcount_medio
   Rev_per_employee_anual = Receita_anual / Headcount_medio
   ```
2. **Benchmarks:**
   ```
   Agencia digital Brasil: R$ 12.000-25.000/mes por pessoa
   Agencia digital US: US$ 15.000-25.000/mes por pessoa ($180-300K/ano)
   SaaS: US$ 200.000-400.000/ano por pessoa
   Consultoria: R$ 20.000-40.000/mes por pessoa
   ```
3. **Analisar tendencia:** crescendo (escala), estavel (eficiente), caindo (problema)

## Output
- Revenue per employee (mensal e anual)
- Comparacao com benchmark do segmento
- Tendencia dos ultimos 6-12 meses

## Quality Gates
- [ ] Headcount medio correto (nao pontual)
- [ ] Benchmark adequado ao segmento

## Quando Usar
- KPI mensal de eficiencia
- Decisao de scaling (contratar mais ou otimizar)
