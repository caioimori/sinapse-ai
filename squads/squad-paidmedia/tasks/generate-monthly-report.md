---
task: generate-monthly-report
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: month
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: monthly_report
    tipo: document
    destino: "Apex + stakeholders"
---

# Task: Generate Monthly Report (Meta Ads)

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Report mensal de performance Meta Ads com analise detalhada, comparativos e recomendacoes.

## Steps

1. **Metricas gerais do mes**
   - Spend total, Impressions, Reach, Frequency, Clicks, CTR, CPC
   - Conversoes, CPA, ROAS, CVR
   - Comparativo MoM (mes anterior) e YoY (se disponivel)

2. **Performance por campanha**
   - Tabela com todas campanhas ativas
   - Highlight: top 3 campanhas e bottom 3
   - CPA por campanha vs target
   - Budget utilization por campanha

3. **Performance por audience tier**
   - Cold: metricas + CPA + volume
   - Warm: metricas + CPA + volume
   - Hot: metricas + CPA + volume
   - Comparativo MoM por tier

4. **Creative performance**
   - Top 5 criativos por ROAS/CPA
   - Bottom 5 criativos
   - Testes realizados e resultados
   - Creative fatigue analysis (ads >30 dias, frequency >3)

5. **Insights e recomendacoes**
   - Top 3 insights do mes
   - 5 recomendacoes priorizadas para proximo mes
   - Budget recomendacao para proximo mes

## Output
Report usando monthly-report-template.md.

## Quality Gates
- [ ] Dados validados contra plataforma
- [ ] Comparativo MoM incluido
- [ ] Insights acionaveis (nao descritivos)
- [ ] Recomendacoes com prioridade e responsavel

## Quando Usar
- Final de cada mes para reporting
