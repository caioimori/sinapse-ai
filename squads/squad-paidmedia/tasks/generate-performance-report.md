---
task: generate-performance-report
responsavel: "@paidmedia-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: channel_data
    tipo: data
    origem: "Signal + Query + Pulse"
    obrigatorio: true

Saida:
  - campo: performance_report
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Dados de todos os canais incluidos"
  - "[ ] Comparativo period-over-period"
  - "[ ] Insights acionaveis (nao apenas dados)"
  - "[ ] Recomendacoes com prioridade"
---

# Task: Generate Performance Report

## Metadata
- **Agent:** paidmedia-orqx (Apex)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Gerar report consolidado de performance cross-channel com insights acionaveis e recomendacoes priorizadas.

## Inputs
- Periodo do report (semanal, mensal, trimestral)
- Dados de performance de todos os canais
- Targets definidos (CPA, ROAS, volume)
- Report anterior (para comparativo)

## Steps

1. **Consolidar metricas cross-channel**
   - Spend total e por canal
   - Conversoes totais e por canal
   - CPA blended e por canal
   - ROAS blended e por canal
   - Impressions, clicks, CTR por canal

2. **Calcular period-over-period**
   - WoW (semanal), MoM (mensal), QoQ (trimestral)
   - Destacar variacoes >10% (positivas e negativas)
   - Contextualizar com sazonalidade se aplicavel

3. **Performance vs Targets**
   - CPA vs CPA target (verde <90%, amarelo 90-110%, vermelho >110%)
   - ROAS vs ROAS target (verde >110%, amarelo 90-110%, vermelho <90%)
   - Volume vs volume target

4. **Extrair top 5 insights**
   - O que performou melhor que esperado? Por que?
   - O que performou pior que esperado? Por que?
   - Anomalias detectadas (z-score >2)?
   - Tendencias emergentes?
   - Oportunidades identificadas?

5. **Gerar recomendacoes priorizadas**
   - Priorizar por impacto estimado (High/Medium/Low)
   - Cada recomendacao com: acao, responsavel, impacto esperado, prazo
   - Max 7 recomendacoes (foco > quantidade)

## Output
Report usando monthly-report-template.md com secoes: Executive Summary, Cross-Channel Overview, Channel Deep Dives, Insights, Recomendacoes.

## Quality Gates
- [ ] Todos os canais ativos representados
- [ ] Comparativo period-over-period incluido
- [ ] Insights sao acionaveis (nao apenas descritivos)
- [ ] Recomendacoes tem dono e prazo
- [ ] Executive summary em <200 palavras

## Quando Usar
- Report semanal de performance
- Report mensal de performance
- Report trimestral de performance
- Ad-hoc report para stakeholders
