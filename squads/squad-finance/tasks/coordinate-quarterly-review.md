---
task: coordinate-quarterly-review
responsavel: "@finance-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: quarter
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: previous_quarter_data
    tipo: object
    origem: "reports anteriores"
    obrigatorio: false

Saida:
  - campo: quarterly_review_package
    tipo: document
    destino: "board, diretoria"

Checklist:
  - "[ ] Acionar todos os agentes para coleta de dados"
  - "[ ] Revenue analysis (Flow)"
  - "[ ] Profitability deep-dive (Margin)"
  - "[ ] Budget variance (Vault)"
  - "[ ] Forecast update (Vault)"
  - "[ ] Pricing adjustment (Mint)"
  - "[ ] Consolidar board report"
---

# Task: Coordinate Quarterly Review

## Metadata
- **Agent:** finance-orqx (Ledger)
- **Squad:** squad-finance
- **Complexity:** CRITICAL

## Objetivo
Coordenar review financeiro trimestral completo, acionando todos os agentes na sequencia correta e consolidando em board report.

## Inputs
- Trimestre em analise (ex: Q1 2026)
- Dados do trimestre anterior para comparacao
- Budget anual para variance analysis

## Steps

1. **Fase 1 — Revenue Analysis (Flow):** revenue waterfall, MRR/ARR, concentration, DSO
2. **Fase 2 — Profitability Deep-Dive (Margin):** P&L trimestral, top/bottom clients, unit economics
3. **Fase 3 — Budget Variance (Vault):** orcado vs realizado, root cause de desvios
4. **Fase 4 — Forecast Update (Vault):** atualizar rolling forecast com dados reais
5. **Fase 5 — Pricing Adjustment (Mint):** rate realization, necessidade de ajustes
6. **Fase 6 — Board Report (Ledger):** consolidar tudo em report executivo

## Output
- Board report executivo com:
  - Executive summary (1 pagina)
  - Revenue analysis (detalhado)
  - Profitability analysis (por cliente e projeto)
  - Budget performance (variance com root cause)
  - Updated forecast (proximos 12 meses)
  - Pricing recommendations
  - Risk register atualizado
  - Top 5 acoes para proximo trimestre

## Quality Gates
- [ ] Todos os 6 passos executados em sequencia
- [ ] Dados consistentes entre analises
- [ ] Comparacao QoQ e YoY presente
- [ ] Board report em formato executivo
- [ ] Recomendacoes com impacto financeiro estimado

## Quando Usar
- Fechamento trimestral
- Reuniao de board
- Planejamento estrategico
