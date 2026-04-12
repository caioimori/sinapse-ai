---
task: generate-search-performance-overview
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Generate Search Performance Overview

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Overview de performance de busca organica para complementar visao de paid search.

## Steps

1. **Metricas gerais do Search Console**
   - Total clicks, impressions, CTR, avg position
   - Comparativo MoM e YoY
   - Trend: melhorando ou piorando?

2. **Top queries e top pages**
   - Top 20 queries por clicks
   - Top 20 pages por clicks
   - Query-page alignment: pagina certa rankeia para query certa?

3. **Performance por device**
   - Mobile vs Desktop: clicks, CTR, position
   - Gaps de performance mobile

4. **Complementaridade com paid**
   - Keywords onde organico e forte → oportunidade de reduzir paid
   - Keywords onde organico e fraco → dependencia de paid
   - SERP share estimado: paid + organic cobertura

## Output
Search performance overview com metricas, trends e complementaridade paid/organic.

## Quality Gates
- [ ] Dados atualizados do Search Console
- [ ] Comparativo MoM
- [ ] Cross-reference com paid strategy

## Quando Usar
- Report mensal
- Planejamento de budget paid/organic
