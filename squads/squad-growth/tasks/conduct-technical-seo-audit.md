---
task: conduct-technical-seo-audit
responsavel: "@ga-seo-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Conduct Technical SEO Audit

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Complex

## Objetivo
Conduzir auditoria tecnica de SEO completa — crawlability, indexability, Core Web Vitals, structured data e mobile-first para identificar e priorizar fixes.

## Entrada
- Site URLs
- Google Search Console access
- Crawl tool access (Screaming Frog/Sitebulb)
- Current performance data

## Passos

### 1. Crawlability & Indexability
| Check | Status | Issue | Fix |
|-------|--------|-------|-----|
| robots.txt accessible | | | |
| XML sitemap valid | | | |
| All pages crawlable | | | |
| No orphan pages | | | |
| Canonical tags correct | | | |
| No duplicate content | | | |
| Redirect chains < 2 hops | | | |
| No soft 404s | | | |
| No broken links (4xx) | | | |
| No server errors (5xx) | | | |
| Hreflang tags correct | | | |
| Index coverage report clean | | | |

### 2. On-Page SEO
| Check | Status | Issue | Fix |
|-------|--------|-------|-----|
| Title tags unique, < 60 chars | | | |
| Meta descriptions unique, < 160 chars | | | |
| H1 tags present, one per page | | | |
| Heading hierarchy logical | | | |
| Image alt texts present | | | |
| Internal linking structure | | | |
| URL structure clean | | | |
| Content thin pages identified | | | |

### 3. Core Web Vitals (SEO Impact)
| Metrica | Target | Desktop | Mobile | Status |
|---------|--------|---------|--------|--------|
| LCP | < 2.5s | | | |
| INP | < 200ms | | | |
| CLS | < 0.1 | | | |
| TTFB | < 0.8s | | | |

### 4. Mobile-First Assessment
| Check | Status |
|-------|--------|
| Mobile-responsive | |
| No horizontal scroll | |
| Touch targets >= 48px | |
| Font size >= 16px | |
| Viewport meta tag | |
| No intrusive interstitials | |
| Mobile page speed | |

### 5. Structured Data
| Tipo | Implementado? | Valido? | Pages |
|------|-------------|--------|-------|
| Organization | | | |
| WebPage | | | |
| BreadcrumbList | | | |
| Article/BlogPosting | | | |
| Product | | | |
| FAQ | | | |
| LocalBusiness | | | |
| Review/Rating | | | |

### 6. Issue Severity Classification
| Severity | Criterio | Exemplos |
|----------|---------|---------|
| Critical | Prevents indexing or ranking | Noindex on key pages, blocked resources |
| High | Significantly impacts ranking | Missing titles, duplicate content, slow CWV |
| Medium | Moderate impact | Missing meta descriptions, broken internal links |
| Low | Minor or cosmetic | Missing alt texts on decorative images |

### 7. Audit Summary
| Categoria | Critical | High | Medium | Low | Total |
|-----------|---------|------|--------|-----|-------|
| Crawlability | | | | | |
| On-Page | | | | | |
| Performance | | | | | |
| Mobile | | | | | |
| Structured Data | | | | | |
| **Total** | | | | | |

## Saida
- Technical SEO audit report
- Issue list by severity
- Fix prioritization plan
- Before/after tracking plan

## Validacao
- [ ] Crawl completo executado
- [ ] Indexability verificada
- [ ] On-page issues catalogados
- [ ] CWV medidos (lab + field)
- [ ] Mobile-first checklist completo
- [ ] Structured data validado
- [ ] Issues classificados por severity
- [ ] Fix plan priorizado
