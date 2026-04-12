---
task: analyze-traffic-sources
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Traffic Sources

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar fontes de trafego e atribuicao de campanhas para entender contribuicao de cada canal.

## Steps

1. **Coletar dados de GA4 por source/medium**
   - Sessions, users, new users por source/medium
   - Conversions e conversion rate por source/medium
   - Revenue (se ecommerce) por source/medium
   - Engagement metrics: engaged sessions, avg engagement time, bounce rate

2. **Mapear attribution paths**
   - First-touch attribution: qual canal traz awareness?
   - Last-touch attribution: qual canal fecha conversao?
   - Model comparison: first vs last vs linear vs data-driven
   - Assisted conversions por canal

3. **Calcular metricas por canal pago**
   - Paid Search: sessions, conversions, CPA (GA4 vs Google Ads)
   - Paid Social: sessions, conversions, CPA (GA4 vs Meta)
   - Display: sessions, view-through conversions
   - Direct: % de trafego direto (pode incluir dark social / attribution gaps)

4. **Identificar insights**
   - Canais com alto volume e baixa conversao (awareness role)
   - Canais com baixo volume e alta conversao (closer role)
   - Discrepancias entre plataforma e GA4 (attribution issue)
   - Tendencias MoM por canal

## Output
Traffic source analysis com attribution, metricas por canal e insights.

## Quality Gates
- [ ] Todos os canais pagos representados
- [ ] Attribution model documentado
- [ ] Discrepancias plataforma vs GA4 explicadas
- [ ] Insights acionaveis

## Quando Usar
- Report mensal de performance
- Planejamento de budget cross-channel
- Quando conversoes caem sem mudanca em campanhas
