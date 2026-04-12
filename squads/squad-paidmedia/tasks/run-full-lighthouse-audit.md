---
task: run-full-lighthouse-audit
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Run Full Lighthouse Audit

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Executar Lighthouse audit completo cobrindo Performance, Accessibility, Best Practices e SEO.

## Steps

1. **Performance audit** - Score target: >90. Metricas: FCP, LCP, TBT, CLS, Speed Index. Diagnostics: render-blocking, unused JS/CSS, image optimization
2. **Accessibility audit** - Score target: >90. Color contrast, alt texts, form labels, heading hierarchy, keyboard navigation
3. **Best Practices audit** - HTTPS, no console errors, image aspect ratios, no deprecated APIs
4. **SEO audit** - Meta tags, robots.txt, structured data, mobile-friendly, crawlable links
5. **Priorizar findings** - High impact + low effort = quick wins. High impact + high effort = strategic. Low impact = backlog

## Output
Full Lighthouse report com scores, findings e recomendacoes priorizadas.

## Quality Gates
- [ ] Todas as 4 categorias auditadas
- [ ] Mobile E desktop
- [ ] Quick wins identificados
- [ ] Score targets definidos

## Quando Usar
- Pre-launch de LP nova
- Auditoria trimestral
- Quando performance score cai
