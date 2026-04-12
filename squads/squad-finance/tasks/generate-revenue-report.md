---
task: generate-revenue-report
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: month
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: revenue_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Consolidar receita do mes"
  - "[ ] Breakdown por tipo e cliente"
  - "[ ] Comparar MoM e YoY"
  - "[ ] Incluir metricas de AR"
---

# Task: Generate Revenue Report

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Gerar report mensal de receita com todas as metricas relevantes.

## Steps

1. **Receita total do mes** com breakdown:
   - Por tipo: projeto, retainer, consulting, outros
   - Por cliente: top 10 + outros
   - Por servico: dev, design, strategy, etc.
2. **Comparacoes:**
   - MoM (vs mes anterior)
   - YoY (vs mesmo mes ano anterior)
   - vs Budget
3. **Metricas de AR:**
   - DSO, collection rate, aging summary
4. **Receita recorrente:**
   - MRR, ARR, churn, expansion

## Output
- Revenue report mensal completo
- Destaques e alertas
- Input para P&L (via Margin)

## Quality Gates
- [ ] Receita reconciliada com billing
- [ ] Comparacoes temporais presentes
- [ ] Metricas de AR atualizadas

## Quando Usar
- Fechamento mensal (obrigatorio)
