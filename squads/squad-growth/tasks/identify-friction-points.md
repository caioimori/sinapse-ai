---
task: identify-friction-points
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

# Task: Identify Friction Points

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Identificar pontos de friccao — combinar dados quantitativos e qualitativos para mapear onde usuarios encontram dificuldades que impedem a conversao.

## Entrada
- Heatmaps e session recordings
- Funnel analysis
- User feedback (surveys, support tickets)
- Analytics data

## Passos

### 1. Friction Point Categories
| Categoria | Exemplos | Impacto |
|-----------|---------|--------|
| UX/UI | Confusing navigation, hidden CTA | High |
| Content | Unclear value prop, missing info | High |
| Technical | Slow page, errors, broken features | Critical |
| Trust | No social proof, security concerns | High |
| Process | Too many steps, complex forms | Medium-High |
| Cognitive | Too many choices, info overload | Medium |
| Mobile | Poor mobile experience, small targets | High |

### 2. Data Sources for Identification
| Fonte | O que revela | Tool |
|-------|------------|------|
| Heatmaps | Where users click (and don't) | Hotjar |
| Scroll maps | Where users stop scrolling | Hotjar |
| Session recordings | Behavior patterns, rage clicks | Hotjar/FullStory |
| Funnel drop-offs | Where in flow users leave | GA4/Amplitude |
| Error logs | Technical failures | Sentry |
| Exit surveys | Why users leave | Survey tool |
| Support tickets | Common complaints | Help desk |
| NPS comments | Open feedback | Survey |

### 3. Friction Point Map
| Page/Flow | Friction Point | Evidence | Severity | Users Affected |
|-----------|---------------|----------|---------|---------------|
| | | Data source + finding | Critical/High/Medium/Low | % or count |
| | | | | |

### 4. Severity Scoring
| Severity | Criterio | Acao |
|----------|---------|------|
| Critical | Prevents conversion entirely | Fix immediately |
| High | Significantly reduces conversion | Fix within 1 sprint |
| Medium | Causes frustration but users recover | Prioritize for testing |
| Low | Minor annoyance | Backlog |

### 5. Friction → Hypothesis Pipeline
| Friction Point | Hypothesis | Test Idea | Expected Lift |
|---------------|-----------|----------|-------------|
| Complex form (8 fields) | Reducing to 4 fields will increase completion by 20% | A/B test: 4 vs 8 fields | +15-25% |
| Missing social proof | Adding testimonials will increase trust and signups | A/B test: with/without testimonials | +5-15% |
| Slow mobile page | Improving LCP will reduce mobile bounce | Performance optimization | +10-20% |

## Saida
- Friction point map
- Severity-scored issue list
- Evidence documentation per friction point
- Hypothesis pipeline
- Quick wins vs strategic fixes

## Validacao
- [ ] Dados quant + qual combinados
- [ ] Friction points mapeados por pagina/flow
- [ ] Severity scoring aplicado
- [ ] Evidencias documentadas
- [ ] Hipoteses formuladas a partir dos friction points
