---
task: optimize-core-web-vitals-seo
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

# Task: Optimize Core Web Vitals for SEO

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Otimizar Core Web Vitals para impacto em SEO — garantir que metricas de experiencia atendem os thresholds do Google para ranking signals.

## Entrada
- CrUX data (Chrome UX Report)
- Search Console CWV report
- PageSpeed Insights scores
- Coordination with Apex (squad-design)

## Passos

### 1. CWV Status Assessment
| Metrica | Mobile (p75) | Desktop (p75) | Status | Target |
|---------|-------------|--------------|--------|--------|
| LCP | | | Good/NI/Poor | < 2.5s |
| INP | | | Good/NI/Poor | < 200ms |
| CLS | | | Good/NI/Poor | < 0.1 |

### 2. Page-Level CWV Analysis
| Page Group | LCP | INP | CLS | Overall | Pages Affected |
|-----------|-----|-----|-----|---------|---------------|
| Homepage | | | | | 1 |
| Product pages | | | | | |
| Blog posts | | | | | |
| Landing pages | | | | | |
| Category pages | | | | | |

### 3. SEO Impact of CWV
| Aspecto | Impacto | Nota |
|---------|--------|------|
| Page Experience signal | Ranking factor | Part of Google's ranking algorithm |
| Top Stories eligibility | Requires good CWV | For news/blog content |
| Visual indicators | May show in SERPs | Google testing badges |
| Mobile-first indexing | CWV from mobile | Mobile metrics prioritized |
| Competitive edge | Tiebreaker | When content quality is similar |

### 4. CWV Optimization Actions
| Issue | Impact on SEO | Fix | Handoff |
|-------|-------------|-----|---------|
| LCP > 2.5s | Ranking penalty risk | Image optimization, server response | Apex (squad-dx) |
| INP > 200ms | Interaction quality signal | JS optimization, event handlers | Scaffold (squad-dx) |
| CLS > 0.1 | Layout stability signal | Image dimensions, font loading | Canvas/Scaffold (squad-dx) |

### 5. Monitoring & Reporting
| Source | Data Type | Refresh |
|-------|----------|---------|
| Search Console CWV | Field data (CrUX) | Daily (28-day rolling) |
| PageSpeed Insights | Lab + field data | On-demand |
| CrUX API | Historical field data | Monthly |
| Lighthouse CI | Lab data | Per PR |

### 6. Cross-Squad Coordination
| Acao | Rank (SEO) | Apex (Performance) |
|------|-----------|-------------------|
| Identify SEO impact | Rank maps which pages affect SEO most | |
| Technical fixes | | Apex implements performance fixes |
| Monitoring | Rank monitors CWV in Search Console | Apex monitors via RUM |
| Reporting | SEO performance impact | Performance metrics |

## Saida
- CWV SEO impact assessment
- Page-level CWV analysis
- Optimization action plan
- Cross-squad coordination plan

## Validacao
- [ ] CWV status avaliado (field + lab)
- [ ] Pages com impacto SEO identificadas
- [ ] Acoes de otimizacao priorizadas
- [ ] Handoff para Apex/squad-dx documentado
- [ ] Monitoring configurado
