---
task: forecast-cash-flow
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_balance
    tipo: number
    origem: "banco, financeiro"
    obrigatorio: true
  - campo: receivables
    tipo: object
    origem: "revenue-analyst"
    obrigatorio: true
  - campo: payables
    tipo: object
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: cash_flow_forecast
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Saldo atual verificado"
  - "[ ] Recebimentos projetados com prazos"
  - "[ ] Pagamentos fixos e variaveis mapeados"
  - "[ ] Runway calculado"
  - "[ ] 3 cenarios modelados"
---

# Task: Forecast Cash Flow

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Projetar cash flow para 3-12 meses, garantindo visibilidade de caixa e runway.

## Steps

1. **Saldo inicial:** verificar saldo atual em banco
2. **Entradas projetadas:**
   ```
   + Faturas a receber (por data de vencimento)
   + Pipeline ponderado × prazo medio de recebimento
   + Receita recorrente (retainers)
   Aplicar: taxa de inadimplencia historica (tipico: 2-5%)
   ```
3. **Saidas fixas:**
   ```
   - Folha de pagamento (dia 5)
   - Aluguel (dia 10)
   - SaaS e ferramentas (mensal)
   - Impostos (por competencia)
   - Contabilidade, juridico
   ```
4. **Saidas variaveis:**
   ```
   - Freelancers (por projeto)
   - Marketing e ads
   - Viagens e eventos
   - Investimentos planejados
   ```
5. **Calcular saldo por semana/mes**
6. **Runway:**
   ```
   Runway = Saldo_atual / Burn_rate_mensal
   Target: >= 6 meses
   Alerta: < 3 meses
   ```
7. **3 cenarios:** pessimista, base, otimista

## Output
- Cash flow semanal (proximo mes) e mensal (3-12 meses)
- Runway em meses
- Ponto mais baixo de caixa projetado (trough)
- 3 cenarios
- Alerta se trough < 0 ou runway < 3 meses

## Quality Gates
- [ ] Saldo inicial conferido com extrato
- [ ] Todas as obrigacoes fixas mapeadas
- [ ] Inadimplencia historica aplicada
- [ ] Runway calculado corretamente

## Quando Usar
- Fechamento mensal
- Antes de grande investimento
- Alerta de caixa baixo
