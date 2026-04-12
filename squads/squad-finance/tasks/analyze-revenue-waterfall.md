---
task: analyze-revenue-waterfall
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: revenue_waterfall
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Mapear pipeline a bookings"
  - "[ ] Mapear bookings a revenue"
  - "[ ] Mapear revenue a billing"
  - "[ ] Mapear billing a cash"
  - "[ ] Calcular conversion rates"
  - "[ ] Identificar gargalos"
---

# Task: Analyze Revenue Waterfall

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Analisar o waterfall completo de receita: pipeline → bookings → revenue → billing → cash.

## Steps

1. **Pipeline → Bookings:**
   ```
   Win Rate = Bookings / Pipeline × 100
   Average Sales Cycle = dias medio entre prospect e contrato
   ```
2. **Bookings → Revenue:**
   ```
   Booking-to-Revenue Rate = Revenue_reconhecida / Bookings
   Lag medio entre contrato e inicio de reconhecimento
   ```
3. **Revenue → Billing:**
   ```
   Billing Efficiency = Faturado / Revenue_reconhecida
   Lag medio entre entrega e faturamento
   (Target: faturar no mesmo dia da entrega)
   ```
4. **Billing → Cash:**
   ```
   Collection Rate = Cash / Billed × 100
   DSO = (Accounts_Receivable / Revenue) × Dias_periodo
   ```
5. **Order-to-Cash Cycle:**
   ```
   Total_cycle = Sales_cycle + Delivery_time + Billing_lag + Payment_terms + Collection_lag
   Target agencia: <= 90 dias total
   ```
6. **Identificar gargalos:** onde o valor esta "vazando" ou "travando"

## Output
- Waterfall visual com valores por fase
- Conversion rates entre fases
- Order-to-cash cycle em dias
- Gargalos identificados com recomendacao

## Quality Gates
- [ ] Todas as 5 fases mapeadas
- [ ] Conversion rates calculados
- [ ] Gargalos com impacto quantificado

## Quando Usar
- Review trimestral de receita
- Otimizacao de cash cycle
- Diagnostico de problemas de caixa
