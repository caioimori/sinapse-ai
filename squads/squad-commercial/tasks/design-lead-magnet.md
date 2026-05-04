---
task: design-lead-magnet
responsavel: "@cs-lead-generation-strategist"
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

# Task: Design Lead Magnet

## Metadata
- **Squad:** squad-commercial
- **Agent:** Magnet (cs-lead-generation-strategist)
- **Complexity:** Standard

## Objetivo
Projetar lead magnets de alto valor que trocam informacao de contato por conteudo acionavel. Cada lead magnet deve resolver um problema especifico do ICP em menos de 10 minutos e naturalmente conduzir ao servico oferecido.

## Entrada
- ICP (Ideal Customer Profile)
- Buyer persona pain points
- Current offer portfolio
- Funnel stage requirements
- Existing content inventory

## Passos

### 1. Lead Magnet Brief
```
Name: [Specific, benefit-driven title]
Type: [Checklist / Calculator / Template / Guide / Assessment / Toolkit]
Target Persona: [Which buyer persona]
Funnel Stage: [TOFU / MOFU / BOFU]
Problem Solved: [Specific pain point in < 10 words]
Promise: [What they'll get / know / be able to do]
Format: [PDF / Interactive / Video / Spreadsheet]
Time to Consume: [< 10 minutes]
CTA After: [Next step in funnel]
```

### 2. Value Test (5-point)
| Criteria | Pass? |
|----------|-------|
| Would someone pay R$50+ for this? | Y/N |
| Does it solve a specific problem? | Y/N |
| Can they use it immediately? | Y/N |
| Does it demonstrate our expertise? | Y/N |
| Does it naturally lead to our service? | Y/N |

### 3. Lead Magnet by Funnel Stage
| Stage | Type | Commitment Level | Examples |
|-------|------|-----------------|---------|
| TOFU (Awareness) | Educational | Low (email only) | Checklist, infographic, quiz |
| MOFU (Consideration) | Proof/Enablement | Medium | Case study, playbook, toolkit |
| BOFU (Decision) | Conversion | High | Free audit, ROI calculator, trial |

### 4. Distribution Plan
| Channel | Tactic | Expected Conv Rate |
|---------|--------|-------------------|
| Landing page | Dedicated page, single CTA | 20-40% |
| Blog CTA | Content upgrade within posts | 5-15% |
| Social media | Organic + paid promotion | 2-8% |
| Email | Existing list cross-promotion | 10-25% |
| Partnership | Co-branded with partners | 15-30% |

### 5. Follow-Up Sequence
| Email # | Timing | Content | Goal |
|---------|--------|---------|------|
| 1 | Immediate | Deliver lead magnet | Value delivery |
| 2 | Day 2 | Quick win related to topic | Build trust |
| 3 | Day 4 | Case study / social proof | Build credibility |
| 4 | Day 7 | Bridge to service | Soft CTA |
| 5 | Day 10 | Direct offer / call booking | Conversion |

## Saida
- Lead magnet brief (complete)
- Value test results (5/5 required)
- Distribution plan
- Follow-up nurture sequence (5 emails)
- Content creation brief (→ @content-intelligence)

## Validacao
- [ ] Passes all 5 value test criteria
- [ ] Solves a specific ICP pain point
- [ ] Consumable in < 10 minutes
- [ ] Natural bridge to core service
- [ ] Distribution plan covers 3+ channels
