---
task: analyze-conversion-funnel
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Conversion Funnel

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar funil de conversao para identificar drop-offs e oportunidades de otimizacao em cada etapa.

## Steps

1. **Definir etapas do funil**
   - Ecommerce: Visit → Product View → Add to Cart → Checkout → Purchase
   - Lead gen: Visit → Page engagement → Form start → Form submit → Qualified lead
   - SaaS: Visit → Signup page → Signup → Activation → Paid

2. **Calcular conversion rates entre etapas**
   - Taxa de conversao entre cada etapa
   - Volume absoluto em cada etapa
   - Drop-off rate em cada etapa
   - Comparativo MoM e por canal de origem

3. **Identificar bottlenecks**
   - Etapa com maior drop-off rate
   - Etapa com piora MoM
   - Segmentar por device (mobile vs desktop gap)
   - Segmentar por source (paid search vs paid social)

4. **Analisar por segmento**
   - Mobile vs Desktop: onde o gap e maior?
   - Novo vs Retornante: funil diferente?
   - Por campanha/audience tier: Cold converte diferente de Warm?

5. **Recomendacoes de otimizacao**
   - Cada bottleneck → agente responsavel
   - LP conversion rate baixo → Convert
   - ATC to checkout drop → Convert (checkout UX)
   - Low engagement → Canvas (creative relevance)
   - Mobile gap → Lighthouse (performance)

## Output
Funnel analysis com taxas por etapa, bottlenecks, segmentacao e recomendacoes.

## Quality Gates
- [ ] Todas as etapas do funil mapeadas
- [ ] Conversion rates calculados entre etapas
- [ ] Segmentacao por device e source
- [ ] Bottlenecks com agente responsavel assignado

## Quando Usar
- Report mensal
- Quando CPA sobe sem mudanca em campanhas
- Antes de CRO sprint
