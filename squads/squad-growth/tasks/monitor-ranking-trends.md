---
task: monitor-ranking-trends
responsavel: "@ga-seo-strategist"
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

# Task: Monitor Ranking Trends

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Monitorar trends de ranking — acompanhar posicoes de keywords-chave, organic traffic e visibilidade para detectar regressoes e oportunidades.

## Entrada
- Target keyword list
- Search Console data
- Rank tracking tool access
- Baseline metrics

## Passos

### 1. Monitoring Metrics
| Metrica | Source | Frequencia | Alert |
|---------|--------|-----------|-------|
| Keyword positions | Ahrefs/Semrush | Daily | Drop > 5 positions |
| Organic traffic | GA4 | Weekly | Drop > 15% WoW |
| Impressions | Search Console | Weekly | Drop > 20% |
| CTR | Search Console | Weekly | Drop below 2% |
| Indexed pages | Search Console | Weekly | Drop > 10% |
| Core Web Vitals | Search Console | Monthly | New issues |
| Competitor visibility | Ahrefs | Monthly | Competitor gains |

### 2. Keyword Tracking Groups
| Grupo | Keywords | Priority | Target Position |
|-------|---------|---------|----------------|
| Brand terms | 5-10 | P0 | Top 1-3 |
| Head terms | 10-20 | P1 | Top 10 |
| Long-tail | 30-50 | P2 | Top 20 |
| New targets | 10-20 | P2 | Track progress |
| Competitor terms | 10-15 | P3 | Monitor |

### 3. SEO Dashboard
| Widget | Metrica | Visualization |
|--------|---------|-------------|
| Organic traffic trend | Sessions from organic | Line chart (90 days) |
| Top keywords | Position + change | Table with arrows |
| Visibility score | Overall SEO visibility | Scorecard + trend |
| Clicks vs Impressions | Search Console data | Dual-axis chart |
| Pages indexed | Total indexed pages | Line chart |
| CWV status | Pass/Fail distribution | Pie chart |
| Top gaining/losing | Keywords with most change | Two tables |

### 4. Review Cadence
| Cadencia | Atividade |
|----------|----------|
| Daily | Automated alerts check |
| Weekly | Quick dashboard review (10 min) |
| Bi-weekly | Detailed keyword review |
| Monthly | Full SEO performance report |
| Quarterly | Strategy review + plan update |

### 5. Regression Response
| Tipo de Queda | Causa Provavel | Acao |
|-------------|---------------|------|
| Sudden rank drop (many keywords) | Algorithm update | Analyze update focus, adjust strategy |
| Single keyword drop | SERP feature change or competitor | Analyze SERP, optimize content |
| Traffic drop, rankings stable | Seasonal, CTR drop | Check CTR, update meta tags |
| Indexed pages drop | Technical issue | Check robots.txt, sitemap, Search Console |
| Gradual decline | Content staleness, growing competition | Content refresh, link building |

## Saida
- SEO monitoring dashboard
- Keyword tracking configuration
- Alert setup
- Review cadence documentation
- Regression response playbook

## Validacao
- [ ] Keyword groups definidos e trackados
- [ ] Dashboard com metricas-chave
- [ ] Alerts automatizados configurados
- [ ] Review cadence estabelecido
- [ ] Regression response documentado
