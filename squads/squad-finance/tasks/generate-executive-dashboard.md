---
task: generate-executive-dashboard
responsavel: "@finance-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: financial_data
    tipo: object
    origem: "agentes da squad"
    obrigatorio: true

Saida:
  - campo: executive_dashboard
    tipo: document
    destino: "diretoria, stakeholders"

Checklist:
  - "[ ] Coletar metricas de todos os agentes"
  - "[ ] Calcular KPIs consolidados"
  - "[ ] Gerar traffic light status"
  - "[ ] Identificar tendencias"
  - "[ ] Produzir dashboard formatado"
---

# Task: Generate Executive Dashboard

## Metadata
- **Agent:** finance-orqx (Ledger)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Gerar dashboard executivo consolidado com todas as metricas financeiras chave do periodo, em formato acessivel para stakeholders nao-financeiros.

## Inputs
- Periodo (mes, trimestre, ano)
- P&L do periodo (via Margin)
- Budget variance (via Vault)
- Revenue waterfall (via Flow)
- Pricing performance (via Mint)

## Steps

1. **Coletar dados:** solicitar outputs de cada agente para o periodo
2. **Calcular KPIs consolidados:**
   - Receita total e crescimento MoM/YoY
   - Gross margin e EBITDA
   - Cash position e runway
   - DSO e collection rate
   - Rate realization
   - Utilizacao da equipe
3. **Aplicar traffic light:** verde/amarelo/vermelho para cada KPI
4. **Identificar tendencias:** comparar com periodos anteriores
5. **Gerar executive summary 3x3**
6. **Formatar dashboard**

## Output
Dashboard com secoes:
1. **Health Score** — score geral 0-100
2. **Revenue** — total, growth, concentration
3. **Profitability** — gross margin, EBITDA, per-project
4. **Cash** — position, runway, DSO
5. **Budget** — pacing, variance, forecast accuracy
6. **Pricing** — rate realization, average deal size
7. **Alerts** — itens que requerem atencao
8. **Recommendations** — top 3 acoes prioritarias

## Quality Gates
- [ ] Todos os KPIs tem dados do periodo
- [ ] Traffic light aplicado corretamente
- [ ] Tendencias comparadas com pelo menos 2 periodos anteriores
- [ ] Dashboard e compreensivel em menos de 5 minutos

## Quando Usar
- Fechamento mensal
- Reuniao de diretoria
- Review trimestral
- Qualquer momento que precise visao holistica da saude financeira
