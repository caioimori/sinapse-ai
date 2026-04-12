---
task: optimize-landing-pages
responsavel: "@ga-cro-specialist"
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

# Task: Optimize Landing Pages

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Otimizar landing pages — aplicar best practices de CRO, analisar performance por segmento e recomendar melhorias baseadas em dados.

## Entrada
- Landing page URLs
- Analytics data
- Heatmaps
- CRO audit findings

## Passos

### 1. Landing Page Audit Framework
| Elemento | Check | Score (1-5) | Recomendacao |
|----------|-------|-----------|-------------|
| Headline | Clara, benefit-driven, matches ad | | |
| Sub-headline | Expande a proposta de valor | | |
| Hero image/video | Relevante, de qualidade | | |
| CTA | Visivel, contraste, copy acao | | |
| Social proof | Testimonials, logos, numeros | | |
| Benefits | Claros, orientados ao usuario | | |
| Form | Minimo de campos, labels claros | | |
| Trust signals | Selos, garantias, seguranca | | |
| Mobile experience | Responsivo, touch-friendly | | |
| Page speed | LCP < 2.5s | | |
| Message match | Consistente com ad/referrer | | |

### 2. Landing Page Metrics
| Metrica | Pagina A | Pagina B | Benchmark | Best Practice |
|---------|---------|---------|----------|-------------|
| Conversion rate | | | 3-5% | Above benchmark |
| Bounce rate | | | < 40% | Low = good |
| Scroll depth (50%) | | | > 60% | Users reading |
| CTA click rate | | | > 5% | Strong CTA |
| Form start rate | | | > 40% | Easy entry |
| Form completion | | | > 60% | Not too long |
| Time on page | | | 1-3 min | Engaged |

### 3. Optimization Priorities
| Prioridade | Area | Impacto Esperado | Esforco |
|-----------|------|-----------------|---------|
| P1 | Above-fold (headline, CTA, hero) | +15-30% conversao | Baixo |
| P2 | Social proof e trust | +10-20% conversao | Baixo |
| P3 | Form optimization | +15-25% completion | Medio |
| P4 | Page speed | +10-20% conversao | Medio |
| P5 | Message match (ad → LP) | +10-15% Quality Score | Medio |

### 4. A/B Test Ideas
| Elemento | Control | Variant | MDE | Priority |
|----------|---------|---------|-----|---------|
| Headline | Feature-focused | Benefit-focused | 15% | P1 |
| CTA color | Blue | Green/Orange | 10% | P2 |
| CTA copy | "Sign Up" | "Start Free Trial" | 15% | P1 |
| Form length | 6 fields | 3 fields | 20% | P1 |
| Social proof | None | 3 testimonials | 10% | P2 |
| Video vs Image | Static image | Explainer video | 15% | P2 |

## Saida
- Landing page audit scorecard
- Performance metrics comparison
- Optimization recommendations (prioritized)
- A/B test ideas with expected impact

## Validacao
- [ ] Audit completo para cada LP
- [ ] Metricas comparadas com benchmarks
- [ ] Top 5 optimizacoes priorizadas
- [ ] Test ideas formuladas
- [ ] Handoff para Copy squad se copy change needed
