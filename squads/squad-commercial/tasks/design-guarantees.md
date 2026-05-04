---
task: design-guarantees
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

# Task: Design Guarantees

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Standard

## Objetivo
Desenhar garantias e risk reversals para cada oferta — reduzir o risco percebido do comprador e aumentar a Perceived Likelihood na Value Equation.

## Entrada
- Offer tiers and pricing
- Delivery track record
- Client objections and fears
- Competitive guarantee landscape

## Passos

### 1. Guarantee Types
| Type | Description | Risk Level (Us) | Impact (Buyer) |
|------|-----------|----------------|---------------|
| **Satisfaction** | "If you're not satisfied, we'll redo it" | Low | Medium |
| **Money-Back** | "Full refund within X days" | High | Very High |
| **Performance** | "If we don't achieve X metric, we [action]" | Medium-High | Very High |
| **Conditional** | "If you do X, Y, Z and we don't deliver, then [guarantee]" | Medium | High |
| **Extended** | "We'll work until you're happy, no extra charge" | Medium | High |
| **Hybrid** | Conditional performance + satisfaction | Medium | Very High |

### 2. Guarantee Design per Tier
| Tier | Guarantee Type | Specific Terms | Conditions |
|------|---------------|---------------|-----------|
| Starter | Satisfaction | 14-day satisfaction guarantee | Completed onboarding |
| Growth | Conditional Performance | "If [metric] doesn't improve [X]% in [Y] days" | Client followed playbook |
| Enterprise | Hybrid | Performance guarantee + ongoing optimization | Full program commitment |

### 3. Guarantee Copy Framework
```
GUARANTEE TEMPLATE:

[Bold promise statement]

We're so confident in our [methodology/team/process] that we offer this guarantee:

If [specific measurable outcome] doesn't happen within [timeframe],
we will [specific remedy — redo, refund, extend, credit].

The only conditions:
- [Reasonable condition 1 — e.g., provide timely feedback]
- [Reasonable condition 2 — e.g., implement recommendations]

Why we can offer this:
- [Track record stat — "92% of clients see results within 60 days"]
- [Social proof — "Join 150+ companies who've trusted our guarantee"]
```

### 4. Risk Assessment
| Guarantee | Est. Trigger Rate | Financial Exposure | Mitigation |
|-----------|------------------|-------------------|-----------|
| | % of clients | R$ max | |

### 5. Objection-to-Guarantee Map
| Client Objection | Fear | Guarantee That Addresses It |
|-----------------|------|---------------------------|
| "How do I know this will work?" | Wasted investment | Performance guarantee |
| "What if the team doesn't click?" | Bad experience | Satisfaction guarantee |
| "Seems expensive" | Price vs value | ROI guarantee |
| "We tried this before and it failed" | Repeat failure | Methodology guarantee |
| "What if our needs change?" | Flexibility | Scope adjustment guarantee |

## Saida
- Guarantee design per offer tier
- Guarantee copy for proposals
- Risk assessment and financial exposure
- Conditions and fulfillment process

## Validacao
- [ ] Every tier has a guarantee
- [ ] Guarantees are specific and measurable
- [ ] Conditions are reasonable (not escape clauses)
- [ ] Financial exposure calculated and acceptable
