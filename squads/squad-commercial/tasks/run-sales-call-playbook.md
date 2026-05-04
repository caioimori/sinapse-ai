---
task: run-sales-call-playbook
responsavel: "@cs-sales-closer"
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

# Task: Run Sales Call Playbook

## Metadata
- **Squad:** squad-commercial
- **Agent:** Close (cs-sales-closer)
- **Complexity:** Standard

## Objetivo
Criar playbook completo para sales calls de alto ticket usando o framework CLOSER (Hormozi) + Sandler Selling + tecnicas de Tactical Empathy (Chris Voss). O playbook guia o vendedor do pre-call ate o post-close.

## Entrada
- Target persona profiles
- Service/offer details
- Pricing structure
- Common objections
- Competitor landscape

## Passos

### 1. Pre-Call Preparation
```
RESEARCH CHECKLIST:
- [ ] Company: size, revenue, industry, growth stage
- [ ] Contact: role, LinkedIn, recent posts, tenure
- [ ] Pain signals: what triggered the inquiry?
- [ ] Competitor: what are they using now?
- [ ] Goal: what does a successful call look like?
```

### 2. Call Structure (CLOSER Framework)
| Phase | Duration | Script Elements | Goal |
|-------|----------|----------------|------|
| C — Clarify | 5 min | "What made you decide to hop on a call?" | Understand motivation |
| L — Label | 5 min | "So the main challenge is [X]..." | Mirror and validate |
| O — Overview past | 5 min | "What have you tried before?" | Understand history |
| S — Sell vacation | 10 min | "Imagine 90 days from now..." | Paint outcome |
| E — Explain concerns | 10 min | Preemptive objection handling | Remove barriers |
| R — Reinforce | 5 min | "You're making the right decision..." | Secure commitment |

### 3. Tactical Empathy Techniques
| Technique | When to Use | Example |
|-----------|------------|---------|
| Mirroring | Prospect shares something important | "The timeline is tight..." |
| Labeling | Prospect shows emotion | "It sounds like you're frustrated..." |
| Calibrated Questions | Need more info | "How would you measure success?" |
| Accusation Audit | Opening, builds trust | "You might think this is just another sales call..." |

### 4. Transition to Close
```
CLOSING SEQUENCE:
1. Summarize their pain (Label)
2. Recap the solution mapped to their pain
3. Present pricing (anchor high, options)
4. Ask: "Based on everything we discussed, does this make sense?"
5. Handle final objection (if any)
6. Close: "Great, let's get started. The first step is..."
7. Reinforce: "You made a great decision because..."
```

### 5. Post-Call Protocol
| Action | Timing | Owner |
|--------|--------|-------|
| Send recap email | Same day | Closer |
| Update CRM | Immediately | Closer |
| Send proposal (if needed) | Within 24h | Closer |
| Schedule follow-up | Before call ends | Closer |
| Debrief (if team) | Same day | Sales lead |

## Saida
- Complete sales call playbook
- Pre-call checklist
- CLOSER framework script templates
- Tactical empathy cheat sheet
- Post-call protocol

## Validacao
- [ ] All 6 CLOSER phases documented with scripts
- [ ] Tactical empathy techniques included
- [ ] Pre-call and post-call protocols defined
- [ ] Playbook is practical (can be used on next call)
