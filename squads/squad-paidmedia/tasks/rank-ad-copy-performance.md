---
task: rank-ad-copy-performance
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: ad_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: ranking_report
    tipo: document
    destino: "Canvas + Query"
---

# Task: Rank Ad Copy Performance

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Rankear ad copies por performance multidimensional para identificar winners, losers e padroes.

## Steps

1. **Coletar metricas por ad**
   - Impressions, Clicks, CTR, Conversions, CVR, CPA, ROAS
   - Ad Strength (para RSAs)
   - Periodo: ultimos 30 dias (minimo)

2. **Calcular score multidimensional**
   - Score = (CTR_normalized * 0.3) + (CVR_normalized * 0.4) + (ROAS_normalized * 0.3)
   - Normalizar: (valor - min) / (max - min) para cada metrica
   - Peso em CVR e ROAS porque conversao > click

3. **Classificar ads**
   - Top 20%: Winners — escalar e usar como base para variacoes
   - Mid 60%: Average — monitorar, testar variacao
   - Bottom 20%: Losers — pausar, analisar o que falhou

4. **Extrair padroes dos winners**
   - Headlines: que palavras/formulas performam melhor?
   - Descriptions: que CTAs convertem mais?
   - Numeros, perguntas, urgencia: quais elementos se repetem?
   - Documentar para Canvas usar em proximas iteracoes

## Output
Ranking de ads com score, classificacao e padroes extraidos dos winners.

## Quality Gates
- [ ] Dados de 30+ dias usados
- [ ] Score multidimensional calculado (nao apenas CTR)
- [ ] Padroes dos winners documentados
- [ ] Losers identificados para pausa

## Quando Usar
- Revisao mensal de ad copies
- Antes de produzir novos ad copies
- Input para Canvas sobre creative patterns
