---
task: analyze-content-performance
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Content Performance

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Avaliar performance de conteudo (landing pages, blog posts) por metricas de engajamento e conversao.

## Steps

1. **Coletar metricas por pagina**
   - Sessions, users, pageviews
   - Avg engagement time, bounce rate, scroll depth
   - Conversions, conversion rate por pagina

2. **Rankear paginas por performance**
   - Score = (engagement_normalized * 0.3) + (conversion_rate_normalized * 0.5) + (volume_normalized * 0.2)
   - Top 10 pages e Bottom 10 pages

3. **Analisar padroes**
   - Que tipo de conteudo converte melhor? (format, length, topic)
   - Landing pages de campanhas vs paginas organicas
   - Correlacao entre engagement time e conversion rate

4. **Recomendacoes**
   - Top pages: amplificar com campanhas pagas
   - Bottom pages: otimizar ou redirecionar trafego
   - Gaps: temas com demanda mas sem conteudo

## Output
Content performance report com ranking, padroes e recomendacoes.

## Quality Gates
- [ ] Metricas de engagement e conversao combinadas
- [ ] Top e bottom pages identificadas
- [ ] Recomendacoes acionaveis

## Quando Usar
- Report mensal de content
- Planejamento de landing pages
- Input para content strategy
