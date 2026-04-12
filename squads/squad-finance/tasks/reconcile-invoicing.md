---
task: reconcile-invoicing
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: invoices_issued
    tipo: array
    origem: "billing"
    obrigatorio: true
  - campo: payments_received
    tipo: array
    origem: "banco, financeiro"
    obrigatorio: true

Saida:
  - campo: reconciliation_report
    tipo: document
    destino: "finance-orqx, financeiro"

Checklist:
  - "[ ] Listar faturas emitidas"
  - "[ ] Cruzar com pagamentos recebidos"
  - "[ ] Identificar pendencias"
  - "[ ] Classificar aging"
---

# Task: Reconcile Invoicing

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Reconciliar faturas emitidas com pagamentos recebidos, identificando pendencias e atrasos.

## Steps

1. **Listar faturas emitidas** no periodo com valor, data e vencimento
2. **Cruzar com pagamentos** recebidos
3. **Classificar cada fatura:**
   - Paga: valor total recebido
   - Parcial: valor parcial recebido
   - Pendente: dentro do prazo, nao paga
   - Atrasada: fora do prazo
4. **Calcular metricas:**
   ```
   Total faturado: R$ X
   Total recebido: R$ Y
   Collection rate: Y / X × 100
   Total em aberto: X - Y
   Total atrasado: soma das atrasadas
   ```
5. **Aging breakdown:**
   ```
   Current (0-30): R$ X
   30 days (31-60): R$ Y
   60 days (61-90): R$ Z
   90+ days: R$ W
   ```

## Output
- Reconciliacao completa fatura-a-fatura
- Collection rate do periodo
- Aging breakdown
- Lista de acoes de cobranca

## Quality Gates
- [ ] Todas as faturas do periodo reconciliadas
- [ ] Pagamentos parciais identificados
- [ ] Aging correto

## Quando Usar
- Fechamento mensal (obrigatorio)
- Acompanhamento semanal de recebimentos
