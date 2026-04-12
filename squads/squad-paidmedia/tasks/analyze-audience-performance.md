---
task: analyze-audience-performance
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: audience_data
    tipo: data
    origem: "Meta Ads Manager"
    obrigatorio: true

Saida:
  - campo: audience_analysis
    tipo: document
    destino: "Signal + Apex"
---

# Task: Analyze Audience Performance

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar performance por audience segment e tier para otimizar targeting e budget allocation.

## Steps

1. **Segmentar por tier e audience type**
   - Cold: Broad, LAL 1%, LAL 1-3%, Interest-based
   - Warm: Site visitors, Engagers, Video viewers
   - Hot: ATC, Checkout, Customer list
   - Calcular CPA, ROAS, CTR, CVR por segmento

2. **Analise de eficiencia por audience**
   - CPA por audience vs CPA medio da conta
   - Volume de conversoes por audience (escala vs eficiencia)
   - Frequency por audience (saturacao)
   - Audience size vs reach (penetracao)

3. **Identificar oportunidades**
   - Audiences com CPA baixo e headroom de budget
   - Audiences com CPA alto que precisam de refresh/exclusion
   - Audiences saturadas (frequency >4, reach >70%)
   - Gaps no funil (tier sem representacao)

4. **Recomendacoes**
   - Aumentar budget em audiences eficientes
   - Refresh ou pausar audiences saturadas
   - Testar novos segments em tiers com gap
   - Ajustar exclusions se necessario

## Output
Tabela de performance por audience com recomendacoes de otimizacao.

## Quality Gates
- [ ] Todos os tiers analisados
- [ ] CPA marginal calculado por audience
- [ ] Saturacao (frequency) verificada
- [ ] Recomendacoes acionaveis com prioridade

## Quando Usar
- Revisao semanal/quinzenal de audiences
- Quando CPA sobe sem mudanca de budget/criativos
- Antes de rebalanceamento de budget
