---
task: analyze-keyword-rankings
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Keyword Rankings

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Analisar rankings de keywords organicas no Google Search Console para complementar estrategia paga.

## Steps

1. **Exportar dados do Search Console (ultimos 28 dias)**
   - Queries com impressions, clicks, CTR, avg position
   - Comparativo com periodo anterior

2. **Segmentar por faixa de posicao**
   - Posicao 1-3: manter, proteger (ja performa)
   - Posicao 4-10: oportunidade de melhoria organica
   - Posicao 11-20: "striking distance" — investir em conteudo
   - Posicao 20+: considerar paid para compensar

3. **Cross-reference com paid keywords**
   - Keywords onde posicao organica e 1-3: considerar reduzir bid pago
   - Keywords onde posicao organica e >20: garantir cobertura paga
   - Keywords sem presenca organica: depender 100% de paid

4. **Identificar oportunidades**
   - Keywords com alta impressao e baixo CTR → title/description issue
   - Keywords com posicao melhorando → tendencia positiva
   - Keywords com posicao caindo → investigar

## Output
Keyword ranking analysis com segmentacao e cross-reference paid/organic.

## Quality Gates
- [ ] Dados de 28+ dias
- [ ] Cross-reference com paid keywords
- [ ] Oportunidades de economia paid/organic identificadas

## Quando Usar
- Report mensal de SEO/paid synergy
- Planejamento de budget (onde economizar com organico)
