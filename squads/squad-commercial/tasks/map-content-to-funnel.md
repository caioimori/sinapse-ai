---
task: map-content-to-funnel
responsavel: "@cs-funnel-architect"
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

# Task: Map Content to Funnel

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Standard

## Objetivo
Mapear conteudo existente e necessario para cada estagio do funil — identificar gaps de conteudo e criar briefs para @content-intelligence preencher.

## Entrada
- Funnel map (from map-full-funnel)
- Content inventory (from @content-intelligence)
- Buyer personas
- Content performance data

## Passos

### 1. Content-to-Funnel Matrix
| Funnel Stage | Content Type | Purpose | Existing? | Performance | Gap? |
|-------------|-------------|---------|----------|-------------|------|
| **TOFU** | Blog articles | Attract organic traffic | | Views/month | |
| | Social posts | Brand awareness | | Engagement rate | |
| | Videos/podcasts | Thought leadership | | Views | |
| | Infographics | Shareable education | | Shares | |
| **MOFU** | Case studies | Proof of results | | Downloads | |
| | Webinars | Deep education + capture | | Registrations | |
| | Email sequences | Nurture + trust | | Open/click rate | |
| | Comparison guides | Evaluation support | | Downloads | |
| | Templates/tools | Value exchange | | Downloads | |
| **BOFU** | ROI calculators | Quantify value | | Usage | |
| | Proposals | Decision support | | Win rate | |
| | Demo recordings | Product showcase | | Views | |
| | Testimonials | Social proof | | Usage in deals | |
| | Free audits | Trial experience | | Conversion rate | |

### 2. Content Gap Analysis
| Gap | Funnel Stage | Persona | Priority | Brief Status |
|-----|-------------|---------|----------|-------------|
| [Missing content type] | TOFU/MOFU/BOFU | | P0/P1/P2 | To create |

### 3. Content Performance by Funnel Impact
| Content Piece | Stage | Views/Downloads | Leads Generated | Pipeline Influenced | Revenue Attributed |
|-------------|-------|----------------|----------------|-------------------|-------------------|
| | | | | R$ | R$ |

### 4. Content Briefs for Gaps (→ @content-intelligence)
```
CONTENT BRIEF

Title Suggestion: [Working title]
Funnel Stage: [TOFU / MOFU / BOFU]
Target Persona: [Buyer persona]
Intent: [What problem does this solve for the persona at this stage?]
Format: [Blog / Case Study / Webinar / Template / Calculator]
Key Messages: [3-5 key points to cover]
CTA: [What should reader do next?]
SEO Target: [Primary keyword if applicable]
Distribution: [Channels to promote]
Priority: [P0 / P1 / P2]
Deadline: [Date]
```

## Saida
- Content-to-funnel matrix (complete)
- Gap analysis with priorities
- Content briefs for gaps (→ @content-intelligence)
- Content performance by funnel impact report

## Validacao
- [ ] Every funnel stage has at least 3 content types mapped
- [ ] All gaps identified and prioritized
- [ ] Content briefs created for P0 gaps
- [ ] Performance data linked to pipeline/revenue
