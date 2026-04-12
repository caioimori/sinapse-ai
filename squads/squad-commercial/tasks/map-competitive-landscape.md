---
task: map-competitive-landscape
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

# Task: Map Competitive Landscape

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Standard

## Objetivo
Mapear paisagem competitiva — entender quem sao os competidores, como se posicionam, quanto cobram e onde estao as oportunidades de diferenciacao.

## Entrada
- Market and industry context
- Win/loss data (from Vault)
- Client feedback on alternatives
- Public competitor information

## Passos

### 1. Competitor Inventory
| Competitor | Type | Size | Market Position | Key Strength |
|-----------|------|------|----------------|-------------|
| | Direct | Small/Mid/Large | Leader/Challenger/Niche | |
| Status quo (do nothing) | Internal | — | Always present | Free |
| DIY (hire in-house) | Internal | — | Common alternative | Control |

### 2. Feature/Capability Comparison
| Capability | Us | Comp A | Comp B | Comp C |
|-----------|:--:|:------:|:------:|:------:|
| [Capability 1] | ✅ | ✅ | ❌ | ✅ |
| [Capability 2] | ✅ | ❌ | ✅ | ❌ |
| [Differentiator 1] | ✅ | ❌ | ❌ | ❌ |

### 3. Pricing Intelligence
| Competitor | Pricing Model | Entry Price | Mid Price | Premium Price |
|-----------|-------------|-----------|---------|-------------|
| | | R$ | R$ | R$ |
| **Us** | | R$ | R$ | R$ |

### 4. Positioning Map
```
                    HIGH TOUCH
                        |
                        |
    COMMODITY ──────────┼────────── PREMIUM
                        |
                        |
                    LOW TOUCH

Plot each competitor + ourselves on this map.
Identify: Where is the white space?
```

### 5. Competitive Battle Cards (→ Edge)
```
BATTLE CARD — vs [Competitor Name]

THEY SAY: "[Their main claim]"
WE SAY: "[Our counter-positioning]"

THEIR STRENGTHS:
- [Strength 1]
- [Strength 2]

THEIR WEAKNESSES:
- [Weakness 1 — how we exploit it]
- [Weakness 2 — how we exploit it]

WHEN WE WIN vs THEM: [Situation]
WHEN WE LOSE vs THEM: [Situation]

PROOF POINTS: [Case study, data, testimonial]
LANDMINE QUESTIONS: [Questions to ask prospect that favor us]
```

## Saida
- Competitive landscape map
- Feature/pricing comparison
- Battle cards per competitor (→ Edge)
- White space opportunities identified

## Validacao
- [ ] All known competitors mapped
- [ ] Status quo and DIY included
- [ ] Pricing intelligence current
- [ ] Battle cards created for top 3 competitors
