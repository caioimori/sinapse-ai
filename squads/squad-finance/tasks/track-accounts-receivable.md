---
task: track-accounts-receivable
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: ar_data
    tipo: object
    origem: "billing, financeiro"
    obrigatorio: true

Saida:
  - campo: ar_report
    tipo: document
    destino: "finance-orqx, financeiro"

Checklist:
  - "[ ] Calcular AR total"
  - "[ ] Calcular DSO"
  - "[ ] Gerar aging breakdown"
  - "[ ] Definir acoes de cobranca"
---

# Task: Track Accounts Receivable

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Acompanhar contas a receber com aging analysis e acoes de cobranca.

## Steps

1. **AR total e DSO:**
   ```
   AR_total = Σ faturas em aberto
   DSO = (AR_total / Receita_periodo) × Dias_periodo
   Target DSO: <= 45 dias
   ```
2. **Aging breakdown por cliente:**
   ```
   | Cliente | Current | 30d | 60d | 90d+ | Total |
   ```
3. **Definir acoes por bucket:**
   - Current: monitorar
   - 30d: email + ligacao
   - 60d: escalacao ao account manager
   - 90d+: carta formal, considerar provisao
4. **Provisao para devedores duvidosos:**
   ```
   30d: 5% provisao
   60d: 25% provisao
   90d+: 50-100% provisao
   ```

## Output
- AR total e DSO
- Aging breakdown por cliente
- Acoes de cobranca por fatura
- Provisao sugerida

## Quality Gates
- [ ] Todas as faturas em aberto listadas
- [ ] DSO comparado com target e historico
- [ ] Acoes de cobranca definidas para atrasadas

## Quando Usar
- Acompanhamento semanal de AR
- Fechamento mensal
