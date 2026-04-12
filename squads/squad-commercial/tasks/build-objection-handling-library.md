---
task: build-objection-handling-library
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

# Task: Build Objection Handling Library

## Metadata
- **Squad:** squad-commercial
- **Agent:** Close (cs-sales-closer)
- **Complexity:** Standard

## Objetivo
Construir biblioteca estruturada de objecoes e respostas para o time de vendas. Cada objecao classificada por tipo, com multiplas respostas usando frameworks CLOSER, Sandler e Tactical Empathy.

## Entrada
- Common objections from sales team
- Win/loss analysis data
- Competitor comparison points
- Pricing structure
- Service guarantees

## Passos

### 1. Objection Classification
| Category | Description | Frequency |
|----------|------------|-----------|
| Price | "Too expensive", "Over budget" | High |
| Timing | "Not the right time", "Maybe next quarter" | High |
| Authority | "Need to talk to my partner/boss" | Medium |
| Need | "We don't really need this" | Medium |
| Trust | "I've been burned before" | Medium |
| Competition | "We're talking to others" | Medium |
| Status Quo | "We're fine as is" | Low |

### 2. Objection Response Template
```
OBJECTION: "[exact words the prospect says]"
TYPE: [Price / Timing / Authority / Need / Trust / Competition / Status Quo]
FREQUENCY: [High / Medium / Low]

RESPONSE OPTIONS:

A) CLOSER Method:
   Label: "It sounds like [reframe]..."
   Explain: "[address the real concern]"
   Bridge: "[connect to value/outcome]"

B) Sandler Method:
   Reverse: "[question back to understand deeper]"
   Example: "When you say too expensive, compared to what?"

C) Tactical Empathy (Voss):
   Label + Calibrated Question:
   "It seems like budget is a real concern. How do you typically evaluate ROI on investments like this?"

WHAT NOT TO SAY: [common mistake to avoid]
```

### 3. Top 10 Objections Library
For each of the top 10 objections:
| # | Objection | Type | Response A | Response B | Response C |
|---|-----------|------|-----------|-----------|-----------|
| 1 | "Too expensive" | Price | Reframe to ROI | "Compared to what?" | "Seems like budget is tight..." |
| 2 | "Need to think" | Stall | "What specifically?" | "What would you need to know?" | "Seems like something is holding you back..." |
| ... | | | | | |

### 4. Preemptive Objection Handling
| Common Objection | When to Address Preemptively | How |
|-----------------|---------------------------|-----|
| Price | During value presentation | Anchor to ROI, not cost |
| Trust | Opening of call | Share relevant case study |
| Competition | Discovery phase | Ask what they're comparing |

### 5. Practice Scenarios
| Scenario | Objection Sequence | Difficulty |
|----------|-------------------|-----------|
| Budget-conscious CEO | Price → Timing → Authority | Hard |
| Skeptical VP | Trust → Competition → Need | Hard |
| Interested but cautious | Timing → Status Quo | Medium |

## Saida
- Classified objection library (10+ objections)
- 3 response options per objection (CLOSER, Sandler, Voss)
- Preemptive handling playbook
- Practice scenarios for training
- Quick reference card (1-page cheat sheet)

## Validacao
- [ ] Minimum 10 objections documented
- [ ] Each has 3 response frameworks
- [ ] Preemptive strategies included
- [ ] Practice scenarios created
- [ ] "What NOT to say" included for each
