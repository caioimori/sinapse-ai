---
task: analyze-unit-economics
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_model
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: financial_data
    tipo: object
    origem: "financeiro, CRM, billing"
    obrigatorio: true

Saida:
  - campo: unit_economics_report
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Calcular CAC"
  - "[ ] Calcular LTV"
  - "[ ] Calcular LTV:CAC ratio"
  - "[ ] Calcular Magic Number"
  - "[ ] Calcular NRR e GRR"
  - "[ ] Calcular Payback Period"
  - "[ ] Comparar com benchmarks"
---

# Task: Analyze Unit Economics

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Analisar unit economics completo do negocio para avaliar sustentabilidade e eficiencia de crescimento.

## Inputs
- Modelo de negocio (agencia project-based, retainer, SaaS, hibrido)
- Receita por cliente (mensal/anual)
- Gastos com marketing e vendas
- Novos clientes adquiridos
- Churn de clientes
- Expansion/contraction de receita

## Steps

1. **CAC (Customer Acquisition Cost):**
   ```
   CAC = (Gasto Marketing + Gasto Vendas) / Novos Clientes
   Benchmark agencia: R$ 3.000-15.000
   Benchmark SaaS: US$ 200-1.500
   ```

2. **LTV (Lifetime Value):**
   ```
   LTV = ARPA × Gross_Margin% × (1 / Churn_Rate)
   Ou simplificado: ARPA × Gross_Margin% × Lifetime_medio_meses
   Benchmark: LTV:CAC >= 3:1
   ```

3. **LTV:CAC Ratio:**
   ```
   Ratio = LTV / CAC
   < 1:1 → Destruindo valor (CRITICO)
   1:1-3:1 → Insustentavel (corrigir)
   3:1-5:1 → Saudavel (manter)
   > 5:1 → Sub-investindo em growth (investir mais)
   ```

4. **Magic Number:**
   ```
   Magic Number = (Receita_Q_atual - Receita_Q_anterior) × 4 / Gasto_S&M_Q_anterior
   < 0.5 → Ineficiente
   0.5-0.75 → Moderado
   > 0.75 → Eficiente (investir mais)
   ```

5. **NRR (Net Revenue Retention):**
   ```
   NRR = (MRR_inicio + Expansion - Contraction - Churn) / MRR_inicio × 100
   < 90% → Problema serio
   90-100% → Estavel
   100-120% → Bom
   > 120% → Excelente
   ```

6. **GRR (Gross Revenue Retention):**
   ```
   GRR = (MRR_inicio - Contraction - Churn) / MRR_inicio × 100
   Target: >= 85%
   ```

7. **Payback Period:**
   ```
   Payback = CAC / (ARPA × Gross_Margin%)
   Target: <= 12 meses
   ```

## Output
- Dashboard de unit economics completo
- Cada metrica com valor, benchmark e status (verde/amarelo/vermelho)
- Recomendacoes para melhorar metricas abaixo do target
- Projecao: se mantiver tendencia, onde estara em 6/12 meses

## Quality Gates
- [ ] Todas as 7 metricas calculadas
- [ ] Benchmarks adequados ao modelo de negocio
- [ ] Tendencia de 3+ periodos para cada metrica
- [ ] Recomendacoes sao acionaveis

## Quando Usar
- Avaliacao de sustentabilidade do negocio
- Planejamento de investimento em growth
- Apresentacao para investidores
- Review estrategico anual
