---
task: build-proposal-framework
responsavel: "@cs-offer-designer"
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

# Task: Build Proposal Framework

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Standard

## Objetivo
Construir framework de proposta padronizado — three-options method, value framing first, social proof integrado e risk reversal. Proposal win rate target: 40-60%.

## Entrada
- Service tiers (from design-service-tiers)
- Pricing strategy (from develop-pricing-strategy)
- Case studies and testimonials
- Guarantee framework (from design-guarantees)

## Passos

### 1. Proposal Structure (Blair Enns Three-Options)
```
PROPOSAL — [Client Name]

1. EXECUTIVE SUMMARY (1 page)
   - Client situation and challenge
   - Desired outcome (in their words)
   - Our approach (high-level)
   - Why us (differentiation)

2. UNDERSTANDING (1 page)
   - What we heard in discovery
   - Key pain points identified
   - Business impact of the problem
   - Success criteria defined together

3. THREE OPTIONS (1-2 pages)

   OPTION A: ESSENTIAL — R$ [price]
   [Focused scope, entry tier]
   Includes: [3-4 bullet deliverables]
   Timeline: [X weeks]
   Best for: [Situation]

   OPTION B: GROWTH (Recommended) — R$ [price]
   [Core scope + customization]
   Includes: [5-7 bullet deliverables]
   Everything in Essential, plus:
   - [Additional value 1]
   - [Additional value 2]
   Timeline: [X weeks]
   Best for: [Situation]

   OPTION C: ENTERPRISE — R$ [price]
   [Full scope + strategic advisory]
   Includes: [8-10 bullet deliverables]
   Everything in Growth, plus:
   - [Premium value 1]
   - [Premium value 2]
   Timeline: [X weeks]
   Best for: [Situation]

4. SOCIAL PROOF (1 page)
   - Relevant case study with numbers
   - Client testimonial (video or quote)
   - Client logos / "Trusted by"
   - Awards / certifications

5. OUR GUARANTEE
   [Risk reversal statement]

6. INVESTMENT SUMMARY
   - Price comparison table
   - Payment terms
   - ROI framing ("For every R$1 invested...")

7. NEXT STEPS
   - Specific action + deadline
   - Contact information
```

### 2. Proposal Quality Checklist
- [ ] Value framing BEFORE price (outcome → investment, not features → price)
- [ ] Three options present (not one take-it-or-leave-it)
- [ ] Social proof included (case study or testimonial)
- [ ] Guarantee or risk reversal present
- [ ] Specific ROI or outcome projection
- [ ] Clear next step with date
- [ ] Personalized to this client (not generic)
- [ ] No jargon — written for the buyer, not for us

### 3. Proposal Templates by Context
| Context | Template Variation | Key Emphasis |
|---------|-------------------|-------------|
| New logo (competitive) | Full 3-option with competitive differentiators | Why us vs alternatives |
| Expansion (existing client) | Streamlined, reference past results | ROI of continuing partnership |
| Renewal | Value recap + growth option | Value delivered + next level |
| RFP response | Structured per RFP requirements | Compliance + differentiation |

## Saida
- Proposal framework document
- Template per context
- Proposal quality checklist
- CRM integration (proposal tracking)

## Validacao
- [ ] Three-options structure standardized
- [ ] Value framing precedes pricing
- [ ] Social proof mandatory in every proposal
- [ ] Templates created for all contexts
