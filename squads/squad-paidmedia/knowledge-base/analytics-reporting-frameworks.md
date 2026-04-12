# Analytics & Reporting Frameworks

## Multi-Channel Attribution Models

### Modelos Disponiveis
| Modelo | Como Funciona | Melhor Para | Limitacao |
|--------|-------------|------------|-----------|
| Last Click | 100% credito ao ultimo click | Simplicidade | Ignora awareness |
| First Click | 100% credito ao primeiro touch | Awareness analysis | Ignora closers |
| Linear | Credito igual entre todos os touches | Visao geral | Nao diferencia impacto |
| Time Decay | Mais credito aos touches recentes | B2B long cycle | Subestima awareness |
| Position-Based | 40% first, 40% last, 20% middle | Balance | Arbitrario |
| Data-Driven (GA4) | ML determina credito | Melhor accuracy | Precisa de volume |

### Recomendacao
- **Default:** Data-Driven (GA4) se volume suficiente (600+ conversoes/30d)
- **Fallback:** Position-Based se volume insuficiente
- **Para reports de canal:** sempre comparar Last Click vs Data-Driven

### Cross-Channel Attribution Challenges
- Plataformas se auto-atribuem (Meta diz X, Google diz Y, soma > real)
- Solucao pragmatica: usar GA4 como fonte de verdade para comparacao
- Plataformas como fonte de verdade para otimizacao DENTRO do canal

## Conversion Funnel Analysis

### Framework de Analise
```
Stage 1: Impression / Reach
    ↓ (CTR: benchmark 1-3%)
Stage 2: Click / Visit
    ↓ (Engagement Rate: benchmark 50-70%)
Stage 3: Engagement (page view, scroll, time on site)
    ↓ (Micro-conversion rate: varies)
Stage 4: Micro-Conversion (ATC, form start, signup)
    ↓ (Completion rate: benchmark 30-70%)
Stage 5: Macro-Conversion (purchase, form submit, activated signup)
```

### Formulas Chave
```
CTR = Clicks / Impressions × 100
Engagement Rate = Engaged Sessions / Sessions × 100
CVR = Conversions / Clicks × 100
Cart Abandonment = 1 - (Purchases / Add to Carts) × 100
Form Abandonment = 1 - (Submits / Form Starts) × 100
```

### Diagnostico por Drop-off
| Drop-off Point | Provavel Causa | Responsavel |
|----------------|---------------|-------------|
| Impression → Click (CTR baixo) | Creative ou targeting | Canvas + Signal/Query |
| Click → Engagement (alto bounce) | Message mismatch ou page speed | Convert + Lighthouse |
| Engagement → Micro-conv | UX/UI da pagina | Convert |
| Micro → Macro (abandono) | Friction no form/checkout | Convert |

## User Behavior Analysis

### Segmentacao Comportamental
| Segmento | Definicao | % Tipico | Acao |
|----------|----------|---------|------|
| Power Users | 3+ sessions, high engagement | 5-10% | Loyalty, upsell |
| Converters | Completaram macro-conversion | 2-5% | Retention, referral |
| Window Shoppers | 2+ pages, sem conversao | 15-25% | Retargeting + incentivo |
| Bouncers | 1 page, <10s | 30-50% | Message match, page speed |
| Returners | Visitaram 2+ vezes sem converter | 10-20% | Nurture sequence |

### Path Analysis
- Top 3 paths que levam a conversao → replicar/otimizar
- Pages com alto exit rate → investigar problema
- Average steps to conversion → otimizar para reduzir

## Content Performance Scoring

### Formula
```
Content Score = (Engagement × 0.3) + (CVR × 0.5) + (Volume × 0.2)

Onde:
- Engagement = avg_engagement_time_normalized (0-1)
- CVR = conversion_rate_normalized (0-1)
- Volume = sessions_normalized (0-1)
- Normalize: (value - min) / (max - min)
```

### Classificacao
| Score | Classificacao | Acao |
|-------|-------------|------|
| >0.7 | Star Content | Amplificar com paid, criar mais similar |
| 0.4-0.7 | Solid Content | Otimizar para conversao |
| 0.2-0.4 | Underperformer | CRO review, considerar rewrite |
| <0.2 | Low Performer | Redirect trafego, descontinuar |

## Anomaly Detection Framework

### Z-Score Method
```
z = (x - μ) / σ

x = valor observado
μ = media dos ultimos 30 dias
σ = desvio padrao dos ultimos 30 dias
```

### Alertas
| |z| | Nivel | Acao |
|-----|-------|------|
| <1.5 | Normal | Nada |
| 1.5-2.0 | Watch | Monitorar |
| 2.0-3.0 | Warning | Investigar |
| >3.0 | Critical | Acao imediata |

### Metricas para Monitorar (por prioridade)
1. CPA (mais critico — impacta diretamente ROI)
2. Conversion volume (indica mudanca de mercado ou tracking)
3. CTR (indica creative fatigue ou targeting shift)
4. CPC (indica mudanca competitiva)
5. Impression share (indica mudanca de leilao)

### Period-over-Period Analysis
| Comparacao | Uso | Nota |
|-----------|-----|------|
| DoD (Day-over-Day) | Anomaly detection | Volatil, melhor com z-score |
| WoW (Week-over-Week) | Trend tracking | Controla day-of-week |
| MoM (Month-over-Month) | Report mensal | Cuidado com # de dias |
| QoQ (Quarter-over-Quarter) | Strategic planning | Controla sazonalidade parcial |
| YoY (Year-over-Year) | Sazonalidade | Melhor para sazonalidade |
