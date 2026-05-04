---
task: calculate-sample-size
responsavel: "@ga-cro-specialist"
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

# Task: Calculate Sample Size

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Calcular sample size e duracao de experimentos — garantir que testes tenham poder estatistico suficiente para detectar o efeito esperado.

## Entrada
- Baseline conversion rate
- Minimum Detectable Effect (MDE)
- Traffic volume
- Number of variants

## Passos

### 1. Input Parameters
| Parametro | Valor | Nota |
|-----------|-------|------|
| Baseline conversion rate | | Current conversion rate |
| Minimum Detectable Effect (MDE) | | Smallest improvement worth detecting |
| Statistical significance | 95% (α = 0.05) | Industry standard |
| Statistical power | 80% (β = 0.20) | Industry standard |
| Number of variants | | Control + N variants |
| Daily traffic (eligible) | | Visitors to test page |
| One-tailed or two-tailed | Two-tailed | Default (conservative) |

### 2. Sample Size Formula Reference
| Baseline CR | MDE | Required Sample (per variant) | Total (2 variants) |
|------------|-----|----------------------------|-------------------|
| 1% | 20% relative | ~38,400 | ~76,800 |
| 2% | 15% relative | ~28,500 | ~57,000 |
| 3% | 10% relative | ~42,800 | ~85,600 |
| 5% | 10% relative | ~31,000 | ~62,000 |
| 10% | 5% relative | ~61,500 | ~123,000 |
| 20% | 5% relative | ~49,200 | ~98,400 |

### 3. Duration Calculation
```
Test duration (days) = Total sample needed / Daily eligible traffic

Constraints:
- Minimum: 2 full business weeks (14 days)
- Maximum: 8 weeks (avoid novelty effect)
- Include full week cycles (no partial weeks)
```

| Cenario | Daily Traffic | Sample Needed | Duration | Feasible? |
|---------|-------------|--------------|---------|-----------|
| | | | | Yes/No |

### 4. MDE Guidelines
| Tipo de Teste | MDE Recomendado | Rationale |
|--------------|----------------|-----------|
| Major redesign | 10-20% relative | Large changes should have large impact |
| CTA change | 15-25% relative | Focused change, detectable effect |
| Copy change | 10-20% relative | Moderate expected impact |
| Form optimization | 15-30% relative | High-impact area |
| Pricing page | 5-15% relative | Lower traffic, higher stakes |

### 5. Traffic Split Strategy
| Cenario | Split | Nota |
|---------|-------|------|
| Standard A/B | 50/50 | Maximum speed to significance |
| Risk mitigation | 80/20 | Control keeps 80%, slower but safer |
| Multi-variant | Equal split | 33/33/33 for 3 variants |
| Phased rollout | 10/90 → 50/50 | Start small, scale if no issues |

### 6. Pre-Test Checklist
| Check | Status |
|-------|--------|
| Sample size calculated | |
| Duration >= 14 days | |
| Duration <= 56 days | |
| Full week cycles included | |
| Traffic sufficient for MDE | |
| No conflicting tests planned | |
| Seasonal factors considered | |
| No major events during test | |

## Saida
- Sample size calculations
- Test duration estimate
- MDE justification
- Traffic split recommendation
- Pre-test checklist completed

## Validacao
- [ ] Sample size calculado com formula correta
- [ ] Power >= 80%
- [ ] Significance = 95%
- [ ] Duration realista (14-56 days)
- [ ] MDE justificado para o tipo de teste
- [ ] Pre-test checklist passado
