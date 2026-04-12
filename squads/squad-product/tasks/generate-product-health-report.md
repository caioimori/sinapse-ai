---
task: generate-product-health-report
responsavel: "@product-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Generate Product Health Report

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Depends On:** Analytics data available, sprint data current
- **Produces:** Product health dashboard, executive summary, action items

## Purpose
Gerar relatório consolidado de saúde do produto combinando métricas de produto (Delta), status de delivery (Tempo), saúde do cliente (Proxy) e progresso estratégico (Charter).

## Steps

### Step 1: Collect Metrics from Each Domain
**Product (Delta):** Activation Rate, DAU/MAU, Feature Adoption, Retention D7/D30, NPS
**Delivery (Tempo):** Sprint Velocity, Variance, Goal Completion, Bug Escape Rate, Tech Debt Ratio
**Client (Proxy):** Satisfaction, Communication Cadence, Scope Changes, Relationship Temperature
**Strategy (Charter):** OKR Progress, Roadmap Delivery, Discovery Pipeline, PMF Indicators

### Step 2: Calculate Composite Health Score (0-100)
```
Product Health = (Product Metrics × 0.30) + (Delivery × 0.25) + (Client Health × 0.25) + (Strategic Progress × 0.20)

Health Bands:
  80-100: 🟢 Green — Maintain course
  60-79:  🟡 Yellow — Investigate, improvement plan
  40-59:  🟠 Orange — Escalate, dedicated improvement sprint
  0-39:   🔴 Red — Emergency intervention
```

### Step 3: Trend Analysis
Compare with prior periods: ↑ Improving (>5%), → Stable (±5%), ↓ Declining (>5%), ⚡ Significant (>15%)

### Step 4: Generate Insights & Recommendations
For each dimension below target: root cause hypothesis, recommended action, expected impact, timeline

### Step 5: Compile Report
Executive Summary → Dimension Breakdown → Trend Analysis → Key Risks → Recommended Actions → Appendix

## Output Artifacts
- `product-health-report-[date].md` | `health-executive-summary.md` | `health-action-items.md`

## Quality Criteria
- All 4 dimensions covered with real data
- Trend comparison with at least 1 prior period
- Every metric below target has an action item
