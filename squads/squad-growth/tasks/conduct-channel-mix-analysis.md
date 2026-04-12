---
task: conduct-channel-mix-analysis
responsavel: "@ga-campaign-analyst"
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

# Task: Conduct Channel Mix Analysis

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Advanced

## Objetivo
Conduzir analise de channel mix — avaliar a composicao ideal de canais de marketing, balanceando custo, volume, qualidade e diversificacao para maximizar resultados e reduzir riscos de dependencia.

## Entrada
- Historical channel performance data (12+ months)
- Budget allocation history
- Revenue by channel
- Customer quality metrics by channel

## Passos

### 1. Current Channel Mix Assessment
| Canal | % Budget | % Revenue | % Customers | ROAS | CAC | Quality Score |
|-------|---------|----------|------------|------|-----|-------------|
| Paid Search | | | | | | /10 |
| Paid Social | | | | | | /10 |
| SEO/Organic | | | | | | /10 |
| Email | | | | | | /10 |
| Display | | | | | | /10 |
| Affiliate | | | | | | /10 |
| Direct | | | | | | /10 |
| Referral | | | | | | /10 |
| **Total** | 100% | 100% | 100% | | | |

### 2. Channel Dependency Risk
| Risco | Indicador | Threshold | Mitigacao |
|-------|----------|----------|----------|
| Over-reliance | Single channel > 50% revenue | > 50% | Diversify to 2-3 channels |
| Platform risk | Revenue from 1 platform | > 40% | Build owned channels |
| Paid dependency | Paid > 70% of acquisition | > 70% | Invest in organic/owned |
| Algo dependency | SEO or Social algo changes | High impact | Content + email as buffer |

**Herfindahl Index (Channel Concentration):**
```
HHI = Sum(share_i²) for all channels

HHI < 0.15: Low concentration (healthy diversification)
HHI 0.15-0.25: Moderate concentration
HHI > 0.25: High concentration (risky)
```

### 3. Channel Mix Optimization Framework
```
Optimal Mix = Maximize Total Revenue subject to:
  - Total Budget = Fixed
  - Each channel has diminishing returns curve
  - Each channel has minimum viable spend
  - Channel quality score >= minimum threshold
  - Concentration risk (HHI) < 0.25
```

| Canal | Current % | Marginal ROAS | Quality | Recommended % | Delta |
|-------|----------|--------------|---------|--------------|-------|
| | | | | | +/- pp |

### 4. Channel Synergy Analysis
| Combinacao | Synergy | Evidence | Implicacao |
|-----------|---------|---------|-----------|
| SEO + Content | Alta | Content drives organic traffic | Invest in both together |
| Paid + Retargeting | Alta | Paid drives awareness, retargeting converts | Budget together |
| Email + Content | Alta | Content feeds email, email amplifies | Coordinate calendars |
| Brand + Non-Brand | Media | Brand builds, non-brand captures | Maintain brand spend |
| Social + Influencer | Media | Influencer content for social ads | Test influencer content in ads |

**Cross-channel effects to measure:**
- Does increasing paid search spend lift organic conversions?
- Does email engagement improve paid social performance?
- Does content marketing reduce paid search CPC?

### 5. Budget Allocation Models
| Modelo | Descricao | Melhor Para |
|--------|----------|------------|
| Historical | Same % as last period | Stable, proven mix |
| Marginal ROAS | Equalize marginal ROAS across channels | Data-rich, mature channels |
| Objective-based | Allocate by funnel stage | Clear funnel goals |
| MMM (Media Mix Modeling) | Econometric model | Large spend, many channels |
| Experimental | Holdout tests per channel | Validate incrementality |

### 6. Scenario Analysis
| Cenario | Mudanca | Revenue Impact | Risk |
|---------|--------|---------------|------|
| Base | Current mix maintained | +X% (forecast) | Current |
| Scenario A | +20% to top ROAS channel, -20% worst | | |
| Scenario B | Diversify: max 30% per channel | | |
| Scenario C | Double organic/owned investment | | |
| Scenario D | Cut lowest 2 channels, reallocate | | |

### 7. Seasonality Adjustment
| Quarter | Budget Adjustment | Focus Channels | Motivo |
|---------|-----------------|---------------|--------|
| Q1 (Jan-Mar) | -10% total | Content, SEO | Post-holiday, rebuild pipeline |
| Q2 (Apr-Jun) | Base | Balanced mix | Standard operations |
| Q3 (Jul-Sep) | +10% (Dia dos Pais) | Paid, Email | Gift-giving season |
| Q4 (Oct-Dec) | +30% (BF, Natal) | Paid Search, Retargeting | Peak season |

### 8. Channel Mix Dashboard
| Widget | Dados | Visualizacao |
|--------|-------|-------------|
| Channel distribution | Budget % by channel | Treemap or donut |
| Efficiency comparison | ROAS by channel | Horizontal bar |
| Trend analysis | Channel % over time | Stacked area (12 months) |
| Concentration index | HHI over time | Line with threshold |
| Scenario comparison | Revenue by scenario | Grouped bar |
| Synergy map | Channel interactions | Network/chord diagram |
| Budget pacing | Actual vs planned spend | Bullet chart per channel |

## Saida
- Channel mix analysis report
- Concentration risk assessment
- Optimization recommendations
- Scenario analysis results
- Seasonality adjustment plan
- Dashboard specification

## Validacao
- [ ] Mix atual documentado com % e performance
- [ ] HHI calculado e avaliado
- [ ] Marginal ROAS por canal estimado
- [ ] Synergies identificadas
- [ ] Pelo menos 3 cenarios analisados
- [ ] Sazonalidade considerada
- [ ] Dashboard spec com widgets definidos
