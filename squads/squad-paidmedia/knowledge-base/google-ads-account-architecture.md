# Google Ads Account Architecture

## Three Template Structures

### Template 1: Simplified (<$5K/month)
Para accounts com budget limitado. Foco em consolidacao e dados.

```
Account
├── Campaign: Brand_Search_[Geo]
│   ├── AG: Brand_Exact
│   └── AG: Brand_Phrase
├── Campaign: NonBrand_Search_[Geo]
│   ├── AG: Theme_1 (5-15 kws)
│   ├── AG: Theme_2 (5-15 kws)
│   └── AG: Theme_3 (5-15 kws)
└── Campaign: Pmax_[Geo] (se ecommerce)
    └── Asset Group: All_Products
```

### Template 2: Standard ($5K-$50K/month)
Para accounts em crescimento. Segmentacao por intent.

```
Account
├── Campaign: Brand_Search_[Geo]
│   ├── AG: Brand_Core
│   ├── AG: Brand_Misspellings
│   └── AG: Brand_Products
├── Campaign: HighIntent_Search_[Geo]
│   ├── AG: Intent_Buy
│   ├── AG: Intent_Price
│   └── AG: Intent_Compare
├── Campaign: MidIntent_Search_[Geo]
│   ├── AG: Category_1
│   ├── AG: Category_2
│   └── AG: Category_3
├── Campaign: Shopping_Standard_[Geo]
│   ├── AG: TopPerformers
│   └── AG: AllProducts
├── Campaign: Pmax_[Geo]
│   ├── Asset Group: Category_1
│   └── Asset Group: Category_2
└── Campaign: Retargeting_Display
    └── AG: Visitors_NoConversion
```

### Template 3: Scaled ($50K+/month)
Para accounts maduros. Granularidade maxima.

```
Account (adicionar ao Standard):
├── Campaign: Competitor_Search
│   ├── AG: Competitor_A
│   └── AG: Competitor_B
├── Campaign: YouTube_Awareness
│   └── AG: InMarket_Audiences
├── Campaign: DemandGen
│   ├── AG: Prospecting
│   └── AG: Retargeting
├── Campaign: Discovery/DemandGen
└── Campaign: Shopping_HighPriority
    └── AG: BestSellers
```

## Keyword Portfolio Management

### Distribuicao Ideal por Intent
| Intent Level | % Keywords | Match Type | Bid Strategy |
|-------------|-----------|------------|-------------|
| Brand | 10-15% | Exact + Phrase | tCPA ou manual |
| High-Intent (buy, price, best) | 20-30% | Exact + Phrase | tCPA ou tROAS |
| Mid-Intent (reviews, compare) | 30-40% | Phrase + Broad | tCPA |
| Broad discovery | 10-20% | Broad | Maximize conversions |

### Match Type Strategy

| Match Type | Quando Usar | Volume | Controle | CPA Tipico |
|-----------|------------|--------|---------|------------|
| Exact | High-value, proven keywords | Baixo | Alto | Mais baixo |
| Phrase | Temas validados, moderate control | Medio | Medio | Medio |
| Broad | Discovery, high volume, Smart Bidding | Alto | Baixo | Variavel |

**Regra moderna:** Broad + Smart Bidding e a combinacao default recomendada pelo Google. Funciona quando ha 30+ conversoes/30d e tracking robusto.

### Keyword Cannibalization Rules
- Mesma keyword em match types diferentes: ok (Google prioriza mais restritivo)
- Mesma keyword em ad groups diferentes: problematico (competem entre si)
- Resolver: consolidar no ad group mais relevante ou usar negative cruzada

## Quality Score Optimization

### Os 3 Componentes
| Componente | Peso Estimado | Como Melhorar |
|-----------|--------------|---------------|
| Expected CTR | ~35% | Ad copy relevante, extensions, ad position |
| Ad Relevance | ~25% | Keywords no headline, tema alinhado |
| LP Experience | ~40% | Speed, relevancia, mobile UX |

### Quality Score Improvement Workflow
1. Exportar keywords com QS <6
2. Agrupar por componente com pior rating ("Below Average")
3. Priorizar:
   - LP Experience Below Average → Lighthouse otimiza LP
   - Ad Relevance Below Average → Query ajusta ad copy (keyword no headline)
   - Expected CTR Below Average → Query melhora ad copy + extensions

### QS Impact on CPC
- QS 10 → ~50% desconto no CPC
- QS 7 → baseline (sem desconto, sem penalidade)
- QS 5 → ~25% markup
- QS 3 → ~67% markup
- QS 1 → ~400% markup

## Smart Bidding Readiness

### Pre-Requisitos
| Requisito | Minimo | Ideal |
|-----------|--------|-------|
| Conversoes/30d/campanha | 30 | 50+ |
| Conversion tracking | Correto | Enhanced conversions |
| Attribution model | Any | Data-driven |
| Historico de dados | 14 dias | 30 dias |
| Estabilidade | Sem mudancas grandes | 30d sem mudanca |

### Migration Path
```
Manual CPC → Maximize Clicks (warmup 2 semanas)
→ Maximize Conversions (learning 2-3 semanas)
→ Target CPA (set at 120% do CPA atual, reduce gradually)
OU
→ Target ROAS (set at 80% do ROAS atual, increase gradually)
```

### Target Settings
- **Target CPA:** comecar 20% acima do CPA medio atual. Reduzir 10-15% a cada 2 semanas.
- **Target ROAS:** comecar 20% abaixo do ROAS medio atual. Aumentar 10-15% a cada 2 semanas.
- **NUNCA** mudar target mais de 15% de uma vez.

---

## Performance Max (PMax) — Atualizado 2025-2026

PMax é a campanha automatizada que roda em TODOS os canais Google simultaneamente:

**Canais:** Search, Display, YouTube, Shopping, Gmail, Discover, Maps

**O que fornecer:**
- Asset groups (imagens, vídeos, headlines, descriptions, logos)
- Feed de produtos (para e-commerce)
- Sinais de audiência (audience signals — não restrições, apenas hints)
- Negative keywords (Account-level)

### Negative Keywords no PMax (Atualização jan/2025)

- Negative keywords agora disponíveis no nível de campanha via interface do Ads Manager
- Limite: até **10.000 por campanha** (aumentado de 100 em março/2025)
- Aplicam-se apenas a inventário de Search e Shopping
- Display, YouTube, Gmail e Discovery NÃO são afetados por negative keywords

### Channel Reporting PMax (Atualização nov/2025)

Novo relatório de performance por canal disponível para todas as campanhas PMax:
- Breakdown por: Search, Display, YouTube, Shopping
- Permite identificar qual canal está entregando o resultado
- Acesso: Reports → Predefined reports → Extensions → Asset details

### Quando Usar / Quando Evitar PMax

**Usar:**
- E-commerce com catálogo amplo
- Quando já tem dados de conversão suficientes (50+ conversões/30d)
- Para escala cross-channel com objetivo de conversão

**Evitar:**
- B2B com ciclo de venda longo
- Produtos de nicho muito específico
- Quando controle granular é essencial
- Contas novas sem histórico de dados

### PMax Asset Group Strategy

```
PMax: [Objetivo]_[Geo]_[YYYY-MM]
├── Asset Group: Categoria_Principal (imagens/videos + copy + sinais)
├── Asset Group: Categoria_Secundaria
└── Asset Group: Remarketing (sinais de website visitors)
```

Cada Asset Group deve ter tema consistente (não misturar produtos/serviços muito diferentes).

---

## Google AI Max for Search (2025-2026)

Novo tipo de campanha que aplica automação de AI diretamente a Search:
- Semelhante ao PMax mas exclusivo para Search
- **Text guidelines (fev/2026):** Anunciante fornece diretrizes de marca que a AI respeita
- Expandido globalmente em fevereiro de 2026
- Combina broad match + responsive ads + URL expansion automática

### Diferença AI Max vs PMax
| Aspecto | AI Max for Search | Performance Max |
|---------|------------------|-----------------|
| Canais | Apenas Search | Todos os canais |
| Controle | Mais controle (search-only) | Menos controle (cross-channel) |
| Negative KWs | Sim, funciona normalmente | Apenas Account-level |
| Ideal para | B2B, serviços, leads | E-commerce, catálogo |

---

## Extensions (Assets) — Lista Completa

| Extension | O Que Mostra | Impacto no CTR |
|-----------|-------------|----------------|
| **Sitelink** | Links para páginas internas | +10-20% |
| **Callout** | Textos curtos de benefícios | +5-10% |
| **Structured Snippet** | Listas de categorias/serviços | +5-10% |
| **Call** | Número de telefone clicável | +5-10% (mobile) |
| **Location** | Endereço e mapa | Variável |
| **Price** | Preços de produtos/serviços | +10-15% |
| **Promotion** | Ofertas e descontos | +10-20% |
| **Image** | Imagem ao lado do texto | +5-15% |

**Regra:** Adicionar TODAS as extensions relevantes. Sem downside — o Google só mostra quando estima que melhoram performance.
