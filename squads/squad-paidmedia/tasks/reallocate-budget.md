---
task: reallocate-budget
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: campaign_performance
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: reallocation_plan
    tipo: document
    destino: "Apex + Query"
---

# Task: Reallocate Budget (Google Ads)

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Realocar budget entre campanhas Google Ads com base em ROAS marginal e efficiency.

## Steps

1. **Coletar performance por campanha (30 dias)**
   - Spend, Conversions, Revenue, CPA, ROAS
   - Impression share e lost IS (budget)
   - Budget utilization (% do budget diario gasto)

2. **Calcular ROAS/CPA marginal**
   - Para campanhas limited by budget: ROAS marginal ≈ ROAS atual (headroom)
   - Para campanhas NOT limited: ROAS marginal provavelmente < ROAS atual
   - Rank campanhas por ROAS marginal

3. **Identificar movimentos**
   - Campanhas com IS lost by budget >20% E ROAS acima do target → AUMENTAR
   - Campanhas com CPA >130% do target → REDUZIR
   - Campanhas sem conversoes em 14d com spend >$500 → PAUSAR ou REDUZIR drasticamente
   - Campanhas em learning → manter estavel por 14d

4. **Calcular reallocation**
   - Mover budget de campanhas ineficientes para eficientes
   - Max realocacao: 20% do budget de uma campanha por semana
   - Manter minimum viable budget ($30/day para Search, $50/day para Shopping)
   - Reservar 5-10% para teste de novas campanhas

5. **Documentar e implementar**
   - Tabela: campanha, budget atual, budget novo, razao, impacto esperado
   - Schedule de implementacao (nao fazer todas as mudancas de uma vez)
   - Review point: 7 dias apos mudanca

## Output
Plano de realocacao com budgets antigos, novos e justificativa por campanha.

## Quality Gates
- [ ] ROAS marginal calculado (nao apenas ROAS medio)
- [ ] Max 20% de mudanca por campanha por semana
- [ ] Minimum viable budget respeitado
- [ ] Review point agendado

## Quando Usar
- Revisao quinzenal/mensal de budget
- Quando campaigns estao limited by budget
- Quando CPA/ROAS muda significativamente
