---
task: build-nurture-sequences
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

# Task: Build Nurture Sequences

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Standard

## Objetivo
Construir sequencias de nurture por segmento e estagio do funil — mover leads de TOFU para MOFU para BOFU com conteudo relevante, timing otimizado e gatilhos de avanco.

## Entrada
- Funnel map and stages
- Lead magnet strategy
- Content inventory
- Buyer personas
- CRM/Marketing automation platform

## Passos

### 1. Nurture Sequence Architecture
| Sequence | Trigger | Target | Duration | Emails | Goal |
|----------|---------|--------|----------|--------|------|
| Welcome | Lead magnet download | New leads | 14 days | 5 | Educate + qualify |
| TOFU→MOFU | Engagement score hit | Engaged leads | 21 days | 7 | Build trust, demo intent |
| MOFU→BOFU | Demo/meeting interest | Warm prospects | 10 days | 4 | Drive decision |
| Re-engagement | No activity > 60 days | Cold leads | 7 days | 3 | Reactivate or clean |
| Post-Event | Event attendance | Event leads | 14 days | 5 | Convert attendees |
| Lost Deal | Closed Lost | Former prospects | 90 days | 6 | Reopen opportunity |

### 2. Email Sequence Template
```
SEQUENCE: [Name]
TRIGGER: [What activates this sequence]
TARGET: [Who receives it]

Email 1 (Day 0): DELIVER + EDUCATE
  Subject: [Lead magnet delivery + quick tip]
  Goal: Deliver value, set expectations

Email 2 (Day 3): AUTHORITY
  Subject: [Industry insight or data point]
  Goal: Establish expertise, build trust

Email 3 (Day 7): PROOF
  Subject: [Case study or client result]
  Goal: Social proof, concrete outcomes

Email 4 (Day 10): ENGAGE
  Subject: [Question or interactive content]
  Goal: Get a reply, start conversation

Email 5 (Day 14): ADVANCE
  Subject: [Next step CTA — webinar, demo, call]
  Goal: Move to next funnel stage

EXIT CONDITIONS:
- Replied to any email → Move to sales sequence
- Booked demo → Exit nurture, enter sales pipeline
- Unsubscribed → Remove from all sequences
- No opens after 5 emails → Move to re-engagement
```

### 3. Personalization Triggers
| Trigger | Action | Example |
|---------|--------|---------|
| Page visited | Send related content | Visited pricing → Send ROI calculator |
| Content downloaded | Send next-level content | Downloaded checklist → Send case study |
| Email opened 3x | Escalate urgency | Send "limited spots" or direct CTA |
| No opens | Change subject line approach | Try question vs statement |
| Industry detected | Customize examples | "In [industry], companies like..." |

### 4. Performance Metrics
| Metric | Target | Below Target Action |
|--------|--------|-------------------|
| Open Rate | > 35% | Improve subject lines |
| Click Rate | > 5% | Improve CTAs and content |
| Reply Rate | > 3% | Add more personalization |
| Sequence Completion | > 60% | Reduce friction, improve timing |
| Stage Advancement | > 15% advance to next stage | Improve content quality |
| Unsubscribe Rate | < 0.5% per email | Reduce frequency or improve relevance |

## Saida
- Nurture sequences configured in automation platform
- Email templates written (→ @copywriting-persuasion)
- Personalization rules active
- Performance monitoring dashboard

## Validacao
- [ ] Each sequence has clear trigger and exit conditions
- [ ] Each email adds new value (no "just checking in")
- [ ] Personalization rules configured
- [ ] LGPD/CAN-SPAM compliance verified
