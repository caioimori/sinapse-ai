---
task: analyze-channel-performance
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

# Task: Analyze Channel Performance

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Analisar performance de canais — avaliar eficiencia e eficacia de cada canal de marketing, comparando metricas de volume, custo, qualidade e ROI para otimizar alocacao de budget.

## Entrada
- Channel spend data (all platforms)
- GA4 acquisition data
- Conversion data by source/medium
- Revenue attribution data

## Passos

### 1. Channel Performance Dashboard
| Canal | Sessions | Users | Conv | Conv Rate | Revenue | Spend | CAC | ROAS | LTV (est) |
|-------|---------|-------|------|----------|---------|-------|-----|------|----------|
| Organic Search | | | | | | R$0 | R$0 | — | |
| Paid Search | | | | | | | | | |
| Paid Social | | | | | | | | | |
| Email | | | | | | | | | |
| Direct | | | | | | R$0 | — | — | |
| Referral | | | | | | | | | |
| Organic Social | | | | | | R$0 | — | — | |
| Affiliate | | | | | | | | | |
| **Total** | | | | | | | | | |

### 2. Channel Quality Metrics
| Canal | Bounce Rate | Pages/Session | Avg Duration | Engagement Rate | New User % |
|-------|-----------|-------------|-------------|----------------|-----------|
| Organic Search | | | | | |
| Paid Search | | | | | |
| Paid Social | | | | | |
| Email | | | | | |
| Direct | | | | | |

### 3. Funnel Performance by Channel
| Canal | Awareness | Interest | Consideration | Intent | Conversion | Efficiency |
|-------|----------|---------|-------------|--------|-----------|-----------|
| | Sessions | Engaged | Add to Cart | Checkout | Purchase | Conv Rate |
| Organic | | | | | | |
| Paid Search | | | | | | |
| Paid Social | | | | | | |
| Email | | | | | | |

### 4. Channel Efficiency Analysis
| Metrica | Formula | Benchmark |
|---------|---------|-----------|
| CAC | Total channel spend / New customers | Varies by channel |
| CPA | Total spend / Total conversions | < 30% of AOV |
| ROAS | Revenue / Ad spend | > 3x (e-commerce), > 5x (SaaS) |
| CPM | (Spend / Impressions) × 1000 | Channel-specific |
| CPC | Spend / Clicks | Channel-specific |
| CPL | Spend / Leads generated | < 1/3 of expected LTV |
| Marginal CAC | Additional spend / Additional customers | Increasing = diminishing returns |

### 5. Channel Trend Analysis
| Canal | MoM Change | QoQ Change | YoY Change | Trend |
|-------|-----------|-----------|-----------|-------|
| Organic | | | | ↑↓→ |
| Paid Search | | | | ↑↓→ |
| Paid Social | | | | ↑↓→ |
| Email | | | | ↑↓→ |
| Direct | | | | ↑↓→ |

### 6. Diminishing Returns Analysis
```
For each channel, plot:
  X-axis: Spend (cumulative)
  Y-axis: Conversions (cumulative)

Identify:
- Linear phase: Efficient spend, maintain or increase
- Plateau phase: Approaching saturation, optimize
- Declining phase: Diminishing returns, reduce or reallocate

Marginal ROAS = ΔRevenue / ΔSpend

When Marginal ROAS < Target ROAS → Reallocate to higher-marginal channels
```

### 7. Channel Attribution Comparison
| Canal | Last Click | First Click | Linear | Data-Driven | Delta |
|-------|-----------|------------|--------|-------------|-------|
| Organic | | | | | |
| Paid Search (Brand) | | | | | |
| Paid Search (Non-Brand) | | | | | |
| Paid Social | | | | | |
| Email | | | | | |
| Display | | | | | |

*Delta = Data-Driven vs Last Click difference — channels with large positive delta are undervalued.*

### 8. Recommendations Framework
| Situacao | Recomendacao | Acao |
|---------|-------------|------|
| High ROAS, low spend | Scale up | Increase budget 20-50% |
| High ROAS, high spend | Maintain & optimize | Fine-tune targeting |
| Low ROAS, low spend | Test or cut | Run optimization sprint or cut |
| Low ROAS, high spend | Reduce & optimize | Reduce budget 30-50%, optimize |
| High volume, low quality | Improve targeting | Refine audiences, landing pages |
| Low volume, high quality | Scale carefully | Increase budget 10-20% |

## Saida
- Channel performance report
- Efficiency analysis (CAC, ROAS per channel)
- Trend analysis
- Attribution comparison
- Budget reallocation recommendations

## Validacao
- [ ] Todos canais ativos analisados
- [ ] Metricas de volume e eficiencia calculadas
- [ ] Funnel performance por canal documentado
- [ ] Trends (MoM, QoQ, YoY) calculados
- [ ] Attribution comparison incluida
- [ ] Recomendacoes de budget com justificativa
