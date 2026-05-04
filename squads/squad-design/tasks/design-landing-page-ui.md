---
task: design-landing-page-ui
responsavel: "@dx-ui-designer"
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

# Task: Design Landing Page UI

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar a UI visual de landing pages de alta conversao — aplicar principios de visual hierarchy, scanning patterns e brand para criar paginas que guiam o usuario ate a acao desejada.

## Entrada
- Wireframe brief (de Compass)
- Copy estruturada (de squad-copy)
- Brand tokens e visual guidelines
- Conversion goals
- Target audience

## Passos

### 1. Definir Secoes da LP
| Secao | Proposito | Visual Priority |
|-------|----------|----------------|
| Hero | Capturar atencao, comunicar value prop | Maxima |
| Social proof | Construir credibilidade | Alta |
| Benefits | Mostrar valor | Alta |
| How it works | Reduzir incerteza | Media |
| Features | Detalhar funcionalidades | Media |
| Testimonials | Validacao social | Media |
| Pricing | Decisao | Alta |
| FAQ | Resolver objecoes | Baixa |
| Final CTA | Converter | Alta |

### 2. Hero Section Design
| Elemento | Specification |
|----------|--------------|
| Headline | Display size, max 60 chars, above fold |
| Subheadline | Body-lg, max 120 chars |
| CTA Primary | Large button, contrasting color |
| CTA Secondary | Text link or ghost button |
| Visual | Hero image/illustration/video, full-width or split |
| Social proof | Logos, numbers, or mini-testimonial |

### 3. Visual Rhythm
- Alternar secoes claras e escuras para criar ritmo
- Usar whitespace generoso entre secoes (64-120px)
- Manter CTA visivel a cada 2-3 scroll depths
- Gradual disclosure de complexidade

### 4. CTA Design System
| CTA Tipo | Visual | Posicao |
|----------|--------|---------|
| Primary | Filled, brand color, large | Hero, pricing, final |
| Secondary | Outline or ghost | Alongside primary |
| Sticky | Compact, fixed bottom (mobile) | Always visible |
| Inline | Text link with arrow | Within content |

### 5. Trust Signals
| Tipo | Posicao | Formato |
|------|---------|---------|
| Client logos | Below hero | Logo strip, 4-6 logos |
| Numbers | After hero or benefits | Big numbers + label |
| Testimonials | Mid-page | Card with photo, name, role |
| Badges | Near CTA | Security, guarantee icons |
| Case studies | After features | Mini cards with results |

### 6. Performance
- Hero image: WebP, preloaded, < 100KB
- Below-fold images: Lazy loaded
- Video: Poster frame + lazy load
- Fonts: 2 weights max, preloaded
- LCP target: < 2.5s

## Saida
- Landing page visual design (high-fidelity)
- Section-by-section specifications
- CTA design system
- Trust signal placement
- Responsive adaptations
- Handoff para Scaffold (build) e Apex (performance)

## Validacao
- [ ] Hero comunica value prop em 5 segundos
- [ ] CTA visivel acima do fold
- [ ] Visual rhythm consistente
- [ ] Trust signals posicionados estrategicamente
- [ ] Responsive em todos os breakpoints
- [ ] Performance otimizada (hero < 100KB)
