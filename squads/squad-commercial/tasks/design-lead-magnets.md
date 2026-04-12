---
task: design-lead-magnets
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

# Task: Design Lead Magnets

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Standard

## Objetivo
Desenhar lead magnets irresistiveis para cada estagio do funil — conteudo de alto valor que troca informacao de contato por insight acionavel. Lead magnet deve resolver um problema especifico do ICP em < 10 minutos.

## Entrada
- ICP profiles
- Buyer persona pain points
- Content inventory
- Funnel stage requirements

## Passos

### 1. Lead Magnet Types by Stage
| Stage | Type | Format | Commitment Level |
|-------|------|--------|-----------------|
| TOFU (Awareness) | Educational | Checklist, infographic, quiz | Low (email only) |
| TOFU (Interest) | Diagnostic | Assessment, calculator, template | Low-Medium |
| MOFU (Consideration) | Proof | Case study, comparison guide, webinar | Medium |
| MOFU (Evaluation) | Enablement | Playbook, toolkit, framework | Medium-High |
| BOFU (Decision) | Conversion | Free audit, trial, demo, ROI calculator | High |

### 2. Lead Magnet Design Framework
```
LEAD MAGNET BRIEF

Name: [Specific, benefit-driven title]
Type: [Checklist / Calculator / Template / Guide / Assessment / Tool]
Target Persona: [Which buyer persona]
Funnel Stage: [TOFU / MOFU / BOFU]
Problem Solved: [Specific pain point in < 10 words]
Promise: [What they'll get / know / be able to do]
Format: [PDF / Interactive / Video / Tool]
Length: [Consumable in < 10 minutes]
CTA After: [Next step in funnel]

VALUE TEST:
- Would someone pay $50+ for this? [Y/N]
- Does it solve a specific problem? [Y/N]
- Can they use it immediately? [Y/N]
- Does it demonstrate our expertise? [Y/N]
- Does it naturally lead to our service? [Y/N]
```

### 3. Lead Magnet Ideas by Persona
| Persona | Pain Point | Lead Magnet | Format | Stage |
|---------|-----------|------------|--------|-------|
| CEO/Founder | "Am I investing in the right channels?" | Marketing ROI Calculator | Interactive tool | MOFU |
| VP Marketing | "My funnel leaks at [stage]" | Funnel Audit Checklist | PDF | TOFU |
| Sales Director | "Win rate is declining" | Win/Loss Analysis Template | Spreadsheet | MOFU |
| CMO | "How do I justify marketing spend?" | CMO Dashboard Blueprint | PDF + template | BOFU |

### 4. Distribution & Conversion Optimization
| Element | Best Practice |
|---------|-------------|
| Landing page | Single CTA, benefit headline, social proof |
| Form fields | Minimum viable (name + email for TOFU, +company +role for MOFU) |
| Delivery | Instant (no "we'll email you") |
| Thank you page | Next CTA (webinar, demo, related content) |
| Follow-up sequence | 3-5 nurture emails related to topic |

## Saida
- Lead magnet briefs per persona × stage
- Content creation briefs (→ @content-intelligence)
- Landing page specs (→ @digital-experience)
- Follow-up nurture sequences (→ Vault)

## Validacao
- [ ] Every persona has at least 1 lead magnet per stage
- [ ] All pass the $50 value test
- [ ] Distribution plan includes landing page + nurture
- [ ] Metrics defined (download rate, MQL conversion)
