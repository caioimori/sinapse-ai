---
task: setup-outreach-sequences
responsavel: "@cs-crm-specialist"
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

# Task: Setup Outreach Sequences

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Configurar sequencias de outreach multi-channel no CRM/SEP — definir cadencia, touchpoints, messaging por persona e automacoes de follow-up. 6-touch multi-channel sequences outperform single-channel by 57%.

## Entrada
- ICP profiles (from Cascade)
- Buyer personas (from Cascade)
- Messaging framework (from Edge)
- CRM/SEP platform access

## Passos

### 1. Sequence Architecture
| Sequence | Target | Touches | Duration | Channels |
|----------|--------|---------|----------|----------|
| Cold Outbound (Decision Maker) | C-Level, VP | 8 | 21 days | Email, LinkedIn, Phone |
| Cold Outbound (Influencer) | Director, Manager | 6 | 14 days | Email, LinkedIn |
| Warm Lead (Demo Request) | All | 5 | 7 days | Email, Phone |
| Warm Lead (Content) | All | 6 | 14 days | Email |
| Re-engagement | Cold leads (>90d) | 4 | 10 days | Email, LinkedIn |
| Post-Event | Event attendees | 5 | 10 days | Email |

### 2. Multi-Channel Cadence Template
```
COLD OUTBOUND — DECISION MAKER (21 days, 8 touches)

Day 1:  📧 Email 1 — Insight-led opening (no pitch)
Day 2:  🔗 LinkedIn connection request + note
Day 4:  📧 Email 2 — Case study / social proof
Day 7:  📞 Phone call attempt #1
Day 9:  📧 Email 3 — Relevant content share
Day 12: 🔗 LinkedIn message (engage with their content)
Day 16: 📧 Email 4 — Direct value proposition
Day 21: 📧 Email 5 — Breakup email (last touch)

Key Principles (Aaron Ross / Outreach research):
- First email: NO pitch, lead with insight about their business
- Each touch adds NEW value (never just "following up")
- Breakup email often gets highest response rate
- Multi-channel: 57% higher connection rate vs single-channel
```

### 3. Personalization Layers
| Layer | Method | Example |
|-------|--------|---------|
| Company | Research company + industry context | "Seeing [Company] expanding into [market]..." |
| Role | Persona-specific pain points | "As VP Sales, [common challenge]..." |
| Trigger | Recent event/news | "Noticed your recent [event/hire/funding]..." |
| Content | Relevant resource | "This [case study/report] addresses..." |
| Social Proof | Similar company success | "[Competitor/peer company] achieved..." |

### 4. Performance Tracking
| Metric | Sequence | Target |
|--------|---------|--------|
| Open Rate | All | > 40% |
| Reply Rate | Cold | > 8% |
| Reply Rate | Warm | > 15% |
| Meeting Booked Rate | All | > 3% cold, > 10% warm |
| Unsubscribe Rate | All | < 1% |
| Bounce Rate | All | < 2% |

## Saida
- Sequences configured in CRM/SEP
- Templates personalized per persona
- A/B test variants created
- Performance tracking active

## Validacao
- [ ] All sequences multi-channel
- [ ] No "just following up" touches
- [ ] Personalization layers defined
- [ ] Compliance with email regulations (CAN-SPAM, LGPD)
