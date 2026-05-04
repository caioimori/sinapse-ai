---
task: conduct-positioning-workshop
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

# Task: Conduct Positioning Workshop

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Conduzir workshop de posicionamento usando o framework April Dunford — definir os 5 componentes de posicionamento para cada oferta, garantindo diferenciacao clara no mercado.

## Entrada
- Offer/service to position
- Competitive landscape data
- Client feedback and testimonials
- Team expertise and unique capabilities

## Passos

### 1. April Dunford 5-Component Framework
| Component | Question | Answer |
|-----------|---------|--------|
| **Competitive Alternatives** | What would clients do if we didn't exist? | |
| **Unique Attributes** | What do we have that alternatives don't? | |
| **Value** | Why do those attributes matter to clients? | |
| **Target Customer** | Who cares most intensely about that value? | |
| **Market Category** | What frame of reference should we place ourselves in? | |

### 2. Competitive Alternatives Mapping
| Alternative | Type | Strengths | Weaknesses | Our Advantage |
|------------|------|-----------|-----------|---------------|
| Do nothing (status quo) | Internal | Free, no change | Problem persists | [Value of solving] |
| DIY (hire in-house) | Internal | Control, culture fit | Slow, expensive, risky | [Speed, expertise] |
| [Competitor A] | Direct | | | |
| [Competitor B] | Direct | | | |
| [Generic solution] | Indirect | | | |

### 3. Unique Attributes Inventory
| Attribute | Evidence | Defensible? | Matters to Client? |
|-----------|---------|------------|-------------------|
| | | Yes/No | High/Medium/Low |

### 4. Value Translation
| Attribute | → Value (So What?) | → Impact (Which Means...) |
|-----------|-------------------|--------------------------|
| [We have X] | [Which gives you Y] | [Which means Z for your business] |

### 5. Target Customer Definition
| Dimension | Description |
|-----------|-------------|
| Who gains most from our unique value? | |
| What situation are they in? | |
| What trigger makes them seek a solution? | |
| What do they value most in a partner? | |

### 6. Market Category Selection
| Option | Pros | Cons | Recommendation |
|--------|------|------|---------------|
| Existing category (lead) | Clear expectations | Crowded | If we can be top 3 |
| Existing category (differentiated) | Known category + unique angle | Complex message | If clear differentiator |
| New subcategory | Own the narrative | Education required | If truly novel approach |

### 7. Positioning Statement
```
For [target customer] who [trigger/situation],
[Our service] is a [market category] that [key value].
Unlike [competitive alternative], we [unique attribute].

Example:
For mid-market SaaS companies who are struggling to convert free trials to paid,
Growth Accelerator is a conversion optimization service that doubles trial-to-paid rates.
Unlike generic CRO agencies, we specialize exclusively in SaaS trial funnels
with a proven 90-day methodology.
```

## Saida
- 5-component positioning document
- Competitive alternatives map
- Positioning statement per offer
- One-line positioning for sales team

## Validacao
- [ ] All 5 components answered with specificity
- [ ] Competitive alternatives include status quo and DIY
- [ ] Value translated from features to business impact
- [ ] Positioning statement passes "so what?" test
