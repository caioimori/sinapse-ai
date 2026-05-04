---
task: analyze-landing-page
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Analyze Landing Page

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar landing page e identificar oportunidades de otimizacao de conversao.

## Steps

1. **Above-the-fold audit** - Headline clarity (1-5), CTA visibility (1-5), Value proposition (1-5), Social proof presence, Load time
2. **Message match with ads** - Ad copy → LP headline alignment, Keyword → LP relevance (Google), Creative → LP visual consistency (Meta)
3. **Trust elements audit** - Testimonials, Client logos, Stats/numbers, Guarantees, Security badges
4. **Mobile audit** - Rendering, Form usability, CTA tap target, Scroll depth to CTA
5. **Performance audit** - Page speed (Lighthouse score), LCP, CLS, INP (delegar para Lighthouse se necessario)
6. **Scoring** - Overall LP score (1-100), Breakdown por area, Comparativo com benchmarks do vertical

## Output
LP analysis com scores, findings e oportunidades.

## Quality Gates
- [ ] Todas as areas auditadas
- [ ] Mobile checado
- [ ] Score com breakdown
- [ ] Oportunidades priorizadas

## Quando Usar
- Pre-launch de campanha
- Quando CVR esta abaixo do benchmark
- Auditoria periodica de LPs
