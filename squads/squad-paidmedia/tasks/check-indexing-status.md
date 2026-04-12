---
task: check-indexing-status
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Check Indexing Status

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Verificar status de indexacao no Google Search Console para garantir que landing pages de campanhas estao indexadas.

## Steps

1. **Verificar Index Coverage Report**
   - Pages indexadas vs submitted
   - Errors, warnings, excluded pages
   - Especificamente: landing pages de campanhas indexadas?

2. **Verificar landing pages criticas**
   - Todas as URLs de destino de ads: estao indexadas?
   - Se nao indexadas: por que? (noindex, blocked by robots, redirect)
   - Impacto: LP nao indexada pode afetar Quality Score de Google Ads

3. **Verificar sitemap coverage**
   - Landing pages presentes no sitemap?
   - Sitemap submitted e processado?
   - Erros no sitemap?

4. **Recomendacoes**
   - LPs nao indexadas que deveriam ser → fix indexacao
   - LPs indexadas que nao deveriam (thank you pages) → noindex
   - Quality Score impact: LP indexada = melhor LP experience score

## Output
Indexing status report com foco em landing pages de campanhas.

## Quality Gates
- [ ] Todas as LPs de campanhas verificadas
- [ ] Issues de indexacao identificados
- [ ] Impacto em Quality Score avaliado

## Quando Usar
- Auditoria de conta
- Quando Quality Score de LP experience esta baixo
- Apos criar novas landing pages
