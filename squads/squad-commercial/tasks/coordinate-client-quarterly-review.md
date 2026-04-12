---
task: coordinate-client-quarterly-review
responsavel: "@cs-client-success"
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

# Task: Coordinate Client Quarterly Review

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Intermediate

## Objetivo
Plan and execute Quarterly Business Reviews (QBRs) with a structured agenda — ROI recap, outcomes achieved, roadmap alignment, and expansion opportunities. QBRs are the single most important touchpoint for demonstrating value and deepening the client relationship.

## Entrada
- Client health score and trend data
- Success plan with agreed outcomes
- Usage and engagement analytics
- Support history for the quarter
- Financial data (contract value, expansion history)
- Product roadmap relevant to client

## Passos

### 1. Prep Data Package (T-14 days)
| Data Element | Source | Purpose |
|-------------|--------|---------|
| **Usage Metrics** | Analytics platform | Demonstrate engagement and adoption trends |
| **Outcomes Achieved** | Success plan tracker | Show progress on agreed business outcomes |
| **ROI Calculation** | Financial model | Quantify value delivered vs. investment |
| **Support Summary** | Ticketing system | Highlight resolution quality, identify patterns |
| **Health Score Trend** | CS platform | Visual trajectory of account health |
| **Expansion Signals** | CRM + usage data | Identify natural upgrade triggers |

### 2. Build QBR Deck (T-7 days)
| Slide | Content | Time |
|-------|---------|------|
| 1. Executive Summary | Key wins, health score, ROI headline | 2 min |
| 2. Outcomes Review | Agreed outcomes vs. achieved (scorecard) | 10 min |
| 3. Usage & Adoption | Feature adoption, engagement trends, benchmarks | 5 min |
| 4. ROI Deep Dive | Value delivered calculation, cost savings, revenue impact | 10 min |
| 5. Support & Operations | Ticket trends, resolution quality, process improvements | 5 min |
| 6. Roadmap Alignment | Upcoming features/services relevant to client goals | 10 min |
| 7. Next Quarter Plan | New outcomes, success milestones, expansion opportunities | 10 min |
| 8. Open Discussion | Client feedback, concerns, strategic questions | 10 min |

### 3. Align Agenda (T-5 days)
- Share draft agenda with client sponsor for feedback
- Confirm attendees (both sides: decision makers, day-to-day users)
- Identify any sensitive topics to address proactively
- Confirm logistics (in-person, video, duration)
- Pre-brief internal team on key talking points and red flags

### 4. Facilitate QBR (Day of)
| Phase | Duration | Focus | Owner |
|-------|----------|-------|-------|
| **Opening** | 5 min | Set expectations, confirm agenda | CSM |
| **Value Review** | 25 min | Outcomes, ROI, usage — demonstrate value delivered | CSM |
| **Forward Look** | 20 min | Roadmap, next quarter plan, expansion discussion | CSM + Account Exec |
| **Open Discussion** | 10 min | Client-driven questions, feedback, concerns | Client lead |

### 5. Capture Action Items (T+1 day)
| Action Item Element | Description |
|--------------------|-------------|
| **Summary Email** | Key takeaways, decisions made, next steps — sent within 24 hours |
| **Action Items** | Each item has owner, deadline, and success criteria |
| **Next Quarter Outcomes** | Agreed outcomes documented in success plan |
| **Expansion Next Steps** | If applicable: timeline, proposal, decision process |
| **Follow-up Calendar** | Monthly check-in dates, next QBR scheduled |

## Saida
- QBR data package with ROI calculation
- Presentation deck (structured per template above)
- Meeting summary with action items
- Updated success plan for next quarter
- Expansion opportunity brief (if applicable)

## Validacao
- [ ] Data package prepared at least 7 days before QBR
- [ ] Agenda shared and confirmed with client
- [ ] ROI calculation is defensible and data-backed
- [ ] All attendees confirmed (decision makers present)
- [ ] Summary and action items sent within 24 hours
- [ ] Next quarter outcomes documented and agreed
