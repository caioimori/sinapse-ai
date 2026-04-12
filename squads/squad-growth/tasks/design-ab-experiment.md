---
task: design-ab-experiment
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

# Task: Design A/B Experiment

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Complex

## Objetivo
Desenhar experimento A/B completo — do brief do experimento ao setup tecnico, incluindo variantes, metricas, sample size e QA plan.

## Entrada
- Prioritized hypothesis
- Sample size calculations
- Target page/flow
- Technical constraints

## Passos

### 1. Experiment Brief
```yaml
experiment:
  id: "EXP-{number}"
  name: "{descriptive name}"
  hypothesis: "IF... THEN... BECAUSE..."
  status: "Design"
  owner: "Convert"

  setup:
    page: "/signup"
    audience: "All visitors"
    traffic_split: "50/50"
    duration_planned: "21 days"
    start_date: ""
    end_date: ""

  variants:
    control:
      description: "Current signup form with 8 fields"
      changes: "None"
    variant_a:
      description: "Simplified form with 4 essential fields"
      changes:
        - "Remove company_name field"
        - "Remove phone field"
        - "Remove job_title field"
        - "Remove company_size field"
        - "Add these as optional in onboarding"

  metrics:
    primary: "Form completion rate"
    secondary:
      - "Time to complete form"
      - "Signup-to-activation rate"
      - "Field error rate"
    guardrails:
      - "Data quality (required fields present)"
      - "Lead qualification accuracy"
      - "Onboarding completion rate"

  sample_size:
    per_variant: 15000
    total: 30000
    mde: "15% relative lift"
    daily_traffic: 1500
    estimated_duration: "20 days"

  exclusions:
    - "Internal users (by IP/cookie)"
    - "Bot traffic"
    - "Users in other active experiments"
```

### 2. Variant Design Specification
| Elemento | Control | Variant A | Variant B (if any) |
|----------|---------|----------|-------------------|
| Form fields | 8 fields | 4 fields | |
| CTA text | "Create Account" | "Start Free Trial" | |
| Social proof | None | 3 testimonials | |
| Layout | Single column | Two column | |

### 3. Technical Implementation
| Item | Detalhes |
|------|---------|
| Platform | Optimizely / VWO / Statsig |
| Implementation | Client-side / Server-side / Feature flag |
| Targeting | URL match, audience segment |
| Bucketing | Visitor-level (cookie-based) |
| Persistence | Sticky across sessions |

### 4. Tracking Requirements
| Evento | Parametro Extra | Objetivo |
|--------|----------------|---------|
| experiment_viewed | experiment_id, variant_id | Exposure tracking |
| form_start | experiment_id, variant_id | Engagement |
| form_submit | experiment_id, variant_id | Primary metric |
| sign_up_complete | experiment_id, variant_id | Downstream impact |

### 5. QA Checklist
| Check | Status |
|-------|--------|
| Variant renders correctly | |
| Variant renders on mobile | |
| Variant renders on all target browsers | |
| No JavaScript errors | |
| Tracking fires correctly for both variants | |
| Bucketing is persistent across sessions | |
| No visual flicker on page load | |
| No conflicts with other active tests | |
| Page speed not degraded | |
| Accessible (WCAG compliant) | |

### 6. Analysis Plan
| Quando | Acao |
|--------|------|
| Day 1-3 | Monitor for SRM, bugs, data quality |
| Day 7 | First check (directional only, NO decisions) |
| Day 14 | Midpoint check (consider early stopping if large effect) |
| End date | Full analysis with segments |
| Post-test | Document learnings, update knowledge base |

## Saida
- Experiment brief document
- Variant specifications
- Technical implementation plan
- Tracking requirements
- QA checklist
- Analysis plan

## Validacao
- [ ] Hypothesis clara e testavel
- [ ] Metricas primary/secondary/guardrail definidas
- [ ] Sample size calculado
- [ ] Variantes especificadas
- [ ] QA checklist passado
- [ ] Analysis plan definido
- [ ] Nenhum conflito com outros testes
