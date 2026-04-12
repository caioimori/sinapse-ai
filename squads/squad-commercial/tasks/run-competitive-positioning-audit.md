---
task: run-competitive-positioning-audit
responsavel: "@cs-business-auditor"
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

# Task: Run Competitive Positioning Audit

## Metadata
- **Squad:** squad-commercial
- **Agent:** Audit (cs-business-auditor)
- **Complexity:** Standard

## Objetivo
Auditar posicionamento competitivo do negocio — onde a empresa se posiciona vs concorrentes em termos de preco, valor, percepcao e diferenciacao. Identificar gaps de posicionamento e oportunidades de reposicionamento.

## Entrada
- Company overview and current positioning
- Top 5-10 competitors
- Pricing data (own + competitors)
- Client feedback / win-loss analysis
- Market research (if available)

## Passos

### 1. Competitive Landscape Map
| Competitor | Segment | Pricing | Key Differentiator | Weakness | Market Share Est. |
|-----------|---------|---------|-------------------|----------|-----------------|
| Our Company | | | | | |
| Competitor 1 | | | | | |
| Competitor 2 | | | | | |
| Competitor 3 | | | | | |
| Competitor 4 | | | | | |
| Competitor 5 | | | | | |

### 2. Perceptual Map (2x2)
```
Axis X: [relevant dimension, e.g., Price: Low → High]
Axis Y: [relevant dimension, e.g., Service: Standardized → Custom]

Plot each competitor and identify:
- Crowded zones (where most competitors cluster)
- White space (unoccupied positioning opportunities)
- Our current position vs desired position
```

### 3. Differentiation Matrix
| Attribute | Our Co. | Comp 1 | Comp 2 | Comp 3 | Importance (1-5) |
|-----------|---------|--------|--------|--------|-----------------|
| Price competitiveness | | | | | |
| Service quality | | | | | |
| Speed of delivery | | | | | |
| Innovation/technology | | | | | |
| Brand reputation | | | | | |
| Customer support | | | | | |
| Specialization depth | | | | | |

### 4. Win/Loss Pattern Analysis
| Factor | Wins (why we won) | Losses (why we lost) | Frequency |
|--------|------------------|---------------------|-----------|
| Price | | | |
| Expertise | | | |
| Relationship | | | |
| Speed | | | |
| Features | | | |

### 5. Positioning Recommendations
| # | Recommendation | Rationale | Impact | Effort |
|---|---------------|-----------|--------|--------|
| 1 | | | H/M/L | H/M/L |
| 2 | | | H/M/L | H/M/L |
| 3 | | | H/M/L | H/M/L |

## Saida
- Competitive landscape map
- Perceptual map with white space analysis
- Differentiation matrix scored
- Win/loss patterns identified
- Positioning recommendations

## Validacao
- [ ] Minimum 5 competitors analyzed
- [ ] Perceptual map identifies clear white space
- [ ] Differentiation matrix uses importance weighting
- [ ] Win/loss patterns based on data (not assumptions)
- [ ] Recommendations are defensible and actionable
