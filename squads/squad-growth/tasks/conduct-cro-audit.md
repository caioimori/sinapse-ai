---
task: conduct-cro-audit
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

# Task: Conduct CRO Audit

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Complex

## Objetivo
Conduzir auditoria de CRO — analise completa de conversion rate, identificacao de oportunidades de otimizacao e priorizacao por impacto potencial.

## Entrada
- Site/app URLs
- Analytics data (30+ days)
- Heatmap/session recording data
- Business conversion goals

## Passos

### 1. Conversion Metrics Baseline
| Metrica | Valor Atual | Benchmark | Gap | Oportunidade |
|---------|-------------|----------|-----|-------------|
| Overall conversion rate | | 2-5% (B2C), 7-12% (SaaS) | | |
| Micro-conversion rate | | Varies by type | | |
| Bounce rate | | < 40% (good) | | |
| Cart abandonment rate | | ~70% (industry avg) | | |
| Form completion rate | | > 60% (good) | | |
| CTA click-through rate | | > 3% (good) | | |

### 2. Page-Level Analysis
| Pagina | Traffic | Conv Rate | Revenue Impact | Issues |
|--------|---------|----------|---------------|--------|
| Homepage | | | | |
| Product/Service page | | | | |
| Pricing page | | | | |
| Landing pages | | | | |
| Checkout/signup flow | | | | |

### 3. Qualitative Analysis
| Fonte | Insight |
|-------|---------|
| Heatmaps | Where users click, scroll depth |
| Session recordings | User behavior patterns, confusion points |
| User feedback | Surveys, NPS comments, support tickets |
| Exit surveys | Why users leave without converting |
| Usability testing | Task completion barriers |

### 4. CRO Opportunity Framework
| Area | Oportunidade | Impact (1-10) | Confidence (1-10) | Ease (1-10) | ICE Score |
|------|-------------|-------------|------------------|------------|-----------|
| Hero section | | | | | |
| CTA design | | | | | |
| Form optimization | | | | | |
| Social proof | | | | | |
| Pricing display | | | | | |
| Checkout flow | | | | | |
| Mobile experience | | | | | |
| Page speed | | | | | |
| Trust signals | | | | | |
| Copy/messaging | | | | | |

### 5. Common CRO Issues
| Issue | Indicador | Fix |
|-------|----------|-----|
| Weak CTA | Low click rate | Clearer copy, contrast, placement |
| Too many choices | High bounce, low engagement | Reduce options (Hick's Law) |
| Missing social proof | Low trust, high bounce | Add testimonials, logos, numbers |
| Slow page | High bounce on slow pages | Performance optimization |
| Poor mobile UX | Low mobile conversion | Mobile-first redesign |
| Complex forms | Low form completion | Reduce fields, progressive disclosure |
| Unclear value prop | High bounce from landing | Rewrite headline, add benefits |
| No urgency | Low conversion urgency | Scarcity, deadlines, limited offers |

## Saida
- CRO audit report
- Conversion metrics baseline
- Qualitative analysis summary
- Prioritized opportunity list (ICE scored)
- Quick wins vs strategic improvements

## Validacao
- [ ] Baseline metrics documentados
- [ ] Top 10 paginas analisadas
- [ ] Dados qualitativos coletados
- [ ] Oportunidades priorizadas por ICE
- [ ] Quick wins identificados (< 1 semana)
- [ ] Recomendacoes acionaveis
