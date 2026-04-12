---
task: check-accessibility-seo
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Check Accessibility & SEO Quick

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Verificar acessibilidade e SEO tecnico basico das LPs de campanhas.

## Steps

1. **Accessibility quick check** - Color contrast (WCAG AA: 4.5:1 texto normal). Alt text em images. Form labels em todos os campos. Focus indicators visiveis. Heading hierarchy (h1 → h2 → h3)
2. **SEO quick check** - Title tag presente e unico. Meta description presente. H1 presente (unico). Canonical URL definido. robots meta tag (index, follow)
3. **Mobile-friendly** - Viewport meta tag. Touch targets >= 48x48px. Texto legivel sem zoom. No horizontal scroll
4. **Schema markup** - Organization schema. Product/Service schema (se aplicavel). FAQ schema (se ha FAQ na pagina)

## Output
Quick accessibility & SEO check com pass/fail por item.

## Quality Gates
- [ ] Todos os items verificados
- [ ] Failures com fix recomendado

## Quando Usar
- Pre-launch check rapido
- Como parte de Lighthouse audit completo
