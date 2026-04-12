---
task: audit-offer-portfolio
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

# Task: Audit Offer Portfolio

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Standard

## Objetivo
Auditar portfolio de ofertas — avaliar cada servico/produto oferecido em termos de posicionamento, pricing, margem, win rate e alinhamento com o mercado. Identificar ofertas para manter, melhorar, eliminar ou criar.

## Entrada
- Current service/product catalog
- Revenue data per offer
- Win rate per offer
- Client feedback
- Competitive landscape

## Passos

### 1. Portfolio Assessment Matrix
| Offer | Revenue | % Total | Margin | Win Rate | Client Sat | Trend | Verdict |
|-------|---------|---------|--------|---------|-----------|-------|---------|
| | R$ | % | % | % | NPS | ↑↓→ | Keep/Improve/Kill/Create |

### 2. BCG-Style Classification
| Quadrant | Revenue Growth | Market Position | Action |
|----------|--------------|----------------|--------|
| Star | High | Strong | Invest, scale |
| Cash Cow | Low | Strong | Maintain, optimize margin |
| Question Mark | High | Weak | Decide: invest or kill |
| Dog | Low | Weak | Kill or pivot |

### 3. Value Equation Audit (Hormozi)
Para cada oferta, avaliar:
| Offer | Dream Outcome (1-10) | P(Achievement) (1-10) | Time Delay (1-10, lower=better) | Effort (1-10, lower=better) | Value Score |
|-------|---------------------|---------------------|-------------------------------|---------------------------|------------|
| | | | | | |

### 4. Competitive Position
| Offer | Our Price | Market Avg | Premium/Discount | Unique Differentiator |
|-------|----------|-----------|-----------------|---------------------|
| | R$ | R$ | % | |

### 5. Recommendations
| # | Recommendation | Offer | Impact | Effort | Priority |
|---|---------------|-------|--------|--------|----------|
| 1 | | | R$ / % | H/M/L | P0 |

## Saida
- Portfolio audit report
- BCG classification per offer
- Value Equation scores
- Recommendations with priorities

## Validacao
- [ ] All active offers audited
- [ ] Financial data accurate (revenue, margin, win rate)
- [ ] Value Equation applied to each offer
- [ ] Clear Keep/Improve/Kill decisions
