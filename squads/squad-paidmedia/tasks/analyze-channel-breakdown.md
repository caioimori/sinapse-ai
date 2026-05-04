---
task: analyze-channel-breakdown
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: account_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: channel_analysis
    tipo: document
    destino: "Apex + Pulse"
---

# Task: Analyze Channel Breakdown

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar breakdown de performance por canal Google (Search, Display, Shopping, Pmax, YouTube) para otimizar mix.

## Steps

1. **Coletar metricas por tipo de campanha**
   - Search: impressions, clicks, CTR, conversions, CPA, impression share
   - Shopping: impressions, clicks, CTR, conversions, ROAS, impression share
   - Pmax: spend, conversions, CPA, ROAS, asset group performance
   - Display: impressions, clicks, view-through conversions, CPA
   - YouTube: views, VTR, conversions, CPV, view-through conversions

2. **Comparar eficiencia por canal**
   - CPA/ROAS por canal
   - Volume de conversoes por canal
   - Eficiencia: (conversoes / spend) rank
   - Contribution % ao total de conversoes

3. **Analisar incrementalidade**
   - Search brand vs non-brand (brand tem CPA artificialmente baixo)
   - Display/YouTube: view-through vs click-through atribuicao
   - Pmax: quanto e brand search canibalizado?
   - Separar canais por papel no funil

4. **Identificar oportunidades**
   - Canal sub-investido com bom ROAS marginal
   - Canal sobre-investido com ROAS decrescente
   - Gaps: canais nao explorados que poderiam performar
   - Recomendacao de mix ideal

## Output
Analise de channel breakdown com metricas, comparativos e recomendacao de mix.

## Quality Gates
- [ ] Todos os tipos de campanha ativa analisados
- [ ] Brand vs non-brand separados em Search
- [ ] View-through conversions consideradas para Display/YouTube
- [ ] Recomendacao de mix com justificativa

## Quando Usar
- Revisao mensal de performance
- Planejamento de budget trimestral
- Quando adicionando novo tipo de campanha
