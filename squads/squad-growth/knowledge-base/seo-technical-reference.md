# Knowledge Base: SEO Technical Reference

## Core Web Vitals (2026)
| Metric | Good | Needs Improvement | Poor | What It Measures |
|--------|------|-------------------|------|-----------------|
| LCP | < 2.5s | 2.5s - 4.0s | > 4.0s | Loading performance |
| INP | < 200ms | 200ms - 500ms | > 500ms | Interactivity |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 | Visual stability |

## On-Page SEO Checklist

### Title Tag
- Length: 50-60 characters
- Primary keyword near beginning
- Brand name at end (optional)
- Unique per page
- Compelling for CTR

### Meta Description
- Length: 150-160 characters
- Include primary keyword naturally
- Include call-to-action
- Unique per page
- Match search intent

### Headings
- One H1 per page (primary keyword)
- H2s for main sections (secondary keywords)
- H3s for subsections
- Logical hierarchy (never skip levels)
- Descriptive, not generic

### URL Structure
- Short and descriptive
- Include primary keyword
- Lowercase, hyphens between words
- No special characters or parameters
- Flat hierarchy preferred (/category/page)

## Schema.org / Structured Data

### Essential Schema Types
| Type | Use Case | Rich Result |
|------|---------|-------------|
| Article | Blog posts, news | Article rich result |
| Product | E-commerce products | Product snippet, price |
| FAQ | FAQ sections | FAQ accordion in SERP |
| HowTo | Tutorials, guides | Step-by-step in SERP |
| BreadcrumbList | Navigation path | Breadcrumb trail |
| Organization | Company info | Knowledge panel |
| LocalBusiness | Local businesses | Local pack |
| Review | Product/service reviews | Star ratings |
| Event | Events, webinars | Event listing |
| VideoObject | Video content | Video carousel |

### JSON-LD Template
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-03-13",
  "dateModified": "2026-03-13"
}
</script>
```

## Technical SEO

### Crawlability
| Check | Implementation |
|-------|---------------|
| robots.txt | Allow important pages, block admin/internal |
| XML Sitemap | All indexable pages, < 50K URLs per file |
| Sitemap index | Link multiple sitemaps if needed |
| Internal linking | Every page reachable within 3 clicks |
| Crawl budget | Prioritize important pages |
| Canonical tags | Self-referencing on all pages |

### Indexation
| Check | Implementation |
|-------|---------------|
| Index coverage | Monitor in Search Console |
| Noindex tags | Only on pages that shouldn't be indexed |
| Thin content | Min 300 words for indexable pages |
| Duplicate content | Canonicals, consolidation |
| Pagination | rel="next/prev" or infinite scroll |
| Hreflang | For multi-language sites |

### Site Architecture
```
Homepage (most authority)
├── Category 1 (pillar page)
│   ├── Subcategory 1a
│   │   ├── Article 1a-1
│   │   └── Article 1a-2
│   └── Subcategory 1b
├── Category 2 (pillar page)
│   ├── Article 2-1
│   └── Article 2-2
└── Supporting Pages
    ├── About
    ├── Contact
    └── FAQ
```

## Topic Clusters (SEO Content Strategy)

### Structure
```
PILLAR PAGE (broad topic, 3000+ words)
    │
    ├── Cluster Article 1 (specific subtopic, 1500+ words)
    ├── Cluster Article 2 (specific subtopic)
    ├── Cluster Article 3 (specific subtopic)
    ├── Cluster Article 4 (specific subtopic)
    └── Cluster Article 5 (specific subtopic)

All cluster articles link TO pillar and FROM pillar.
Cluster articles may interlink with each other.
```

### Keyword Intent Types
| Intent | Signal Words | Content Type | Funnel Stage |
|--------|-------------|-------------|-------------|
| Informational | how, what, why, guide | Blog, guide, video | Awareness |
| Navigational | [brand name], login | Homepage, product page | — |
| Commercial | best, review, comparison | Comparison, review | Consideration |
| Transactional | buy, price, discount, near me | Product, pricing page | Decision |

## E-E-A-T (Google Quality Guidelines)

### Experience
- First-hand experience with topic
- Original photos/videos
- Personal anecdotes and case studies

### Expertise
- Author credentials visible
- Author bio with qualifications
- Topical authority (many related articles)

### Authoritativeness
- Backlinks from authoritative sources
- Citations and references
- Industry recognition

### Trustworthiness
- HTTPS
- Clear contact information
- Privacy policy, terms of service
- Accurate, up-to-date content
- Transparent editorial process

## Link Building Strategies
| Strategy | Difficulty | Impact | Scalability |
|---------|-----------|--------|------------|
| Original research/data | High | Very High | Low |
| Guest posting | Medium | Medium | Medium |
| Broken link building | Medium | Medium | Medium |
| Digital PR | High | Very High | Low |
| Resource page outreach | Low | Medium | Medium |
| HARO/journalist queries | Low | High | Medium |
| Skyscraper technique | Medium | High | Low |
| Infographics | Medium | Medium | Low |
| Partnerships | Medium | High | Low |

## Topical Authority (Koray Tugberk GUBUR)

Estrategia de se tornar a referencia definitiva em um topico especifico ao inves de criar conteudo superficial sobre muitos topicos.

**Principios:**
1. Cobrir um topico em profundidade — todos os subtopicos, perguntas relacionadas
2. Criar clusters semanticos — paginas interligadas cobrindo o topico de todos os angulos
3. Demonstrar expertise real — dados originais, estudos de caso, opiniao fundamentada
4. Atualizar regularmente — conteudo evergreen que evolui

**Sinal para o Google:** Um site que cobre exaustivamente um topico recebe mais autoridade que um site que cobre superficialmente muitos topicos.

## Programmatic SEO

Criacao de milhares ou milhoes de paginas otimizadas usando templates e dados estruturados.

**Casos de sucesso:**
- Zapier: 25K+ paginas de integracao ("Slack + Google Sheets integration")
- TripAdvisor: paginas por destino/hotel
- Wise: paginas de conversao de moeda ("BRL to USD")
- Yelp: paginas por negocio e localizacao

**Componentes:**
1. **Head term** — Topico principal (ex: "integracao")
2. **Modifier** — Variavel que gera paginas (ex: "Slack + Google Sheets")
3. **Template** — Layout padrao populado com dados
4. **Dados** — Database que alimenta os templates
5. **Unique Value** — O que diferencia cada pagina (reviews, dados, calculadoras)

**Riscos:**
- Conteudo thin/duplicado → penalizacao do Google
- Paginas sem valor unico → nao rankeiam
- Crawl budget desperdicado em paginas de baixa qualidade

## AI Overviews & SGE — Impacto na Busca Organica (2025-2026)

**Dados mensurados:**
- AI Overviews aparecem em ~25.8-60% das buscas nos EUA (Jan 2026, variacao por metodologia)
- CTR organico cai 61% (de 1.76% para 0.61%) quando AI Overview esta presente (Seer Interactive, 2025)
- CTR pago cai 68% com AI Overview ativo
- Sites citados dentro de AI Overviews podem ver CTR aumentar ate 35%
- Zero-click searches: ~58.5-60% de todas as buscas no Google (SparkToro/Datos, 2024-2025)
- Para cada 1.000 buscas nos EUA, apenas 360 cliques vao para a open web

**Google December 2025 Core Update:**
- Volatilidade 8.7/10, afetando 40-60% dos sites globalmente
- 15% das paginas no TOP 10 desapareceram do TOP 100
- Sites com INP acima de 300ms reportaram quedas de ate 31% no ranking
- Apenas ~47% dos sites atingem os thresholds de Core Web Vitals em 2026
- INP e a metrica mais reprovada (43% dos sites falham)

**Estrategias de adaptacao:**
1. Otimizar para citacao em AI — conteudo bem estruturado, dados factuais, autoridade
2. Focar em buscas transacionais — menos impactadas por AI Overviews (apenas 4% de exposicao)
3. Criar conteudo que AI nao consegue replicar — experiencia original, dados proprietarios, opiniao expert
4. Diversificar alem do Google — YouTube, TikTok, Reddit, Perplexity, ChatGPT
5. Brand building — buscas de marca nao sao impactadas por AI Overviews

## SEO em Portugues Brasileiro

**Particularidades:**
1. **Volume de busca** — Menor que ingles, mas menos competitivo
2. **Acentuacao** — Google trata "açaí" e "acai" como equivalentes (geralmente) — otimizar para ambos
3. **Regionalismos** — "biscoito" vs "bolacha", "aipim" vs "mandioca" — impactam keyword research
4. **Concorrencia** — Menos conteudo de qualidade em PT-BR = oportunidade
5. **Google domina** — 97%+ market share no Brasil (vs. 88% global)
6. **Ferramentas** — Semrush e Ahrefs tem boa cobertura do mercado brasileiro

## SEO Tools Reference
| Category | Tools |
|----------|-------|
| All-in-one | Ahrefs, SEMrush, Moz Pro |
| Technical | Screaming Frog, Sitebulb, DeepCrawl |
| Keywords | Ahrefs Keywords Explorer, Google Keyword Planner |
| Content | Surfer SEO, Clearscope, MarketMuse |
| Speed | PageSpeed Insights, GTmetrix, WebPageTest |
| Rank tracking | Ahrefs Rank Tracker, SERPWatcher |
| Schema | Schema.org validator, Rich Results Test |
| Free | Google Search Console, Google Analytics 4 |
| AI-assisted | Alli AI, RankIQ, SE Ranking |
