---
task: map-product-channel-fit
responsavel: "@ga-growth-hacker"
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

# Task: Map Product-Channel Fit

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Mapear product-channel fit — identificar quais canais de distribuicao sao naturalmente adequados ao produto, baseado em modelo de negocio, ACV, publico e comportamento do usuario, evitando dispersao de investimento.

## Entrada
- Product characteristics (ACV, complexity, audience)
- Current channel performance data
- Competitor channel analysis
- Customer acquisition data

## Passos

### 1. Channel Categories
| Categoria | Canais | Melhor Para |
|----------|--------|------------|
| Viral/WOM | Referral, sharing, community | Products with network effects |
| Content | SEO, blog, YouTube, podcast | Complex products, B2B |
| Paid | Google Ads, Meta, LinkedIn | Scalable with unit economics |
| Sales | Outbound, partnerships, events | High ACV B2B (> $5K) |
| Product-Led | Freemium, marketplace listing | Self-serve SaaS |
| Partnership | Integrations, co-marketing | Complementary products |

### 2. Product-Channel Fit Matrix
| Fator do Produto | Viral | Content/SEO | Paid | Sales | Product-Led |
|-----------------|-------|------------|------|-------|------------|
| ACV < R$100/mo | ✅ | ✅ | ✅ | ❌ | ✅ |
| ACV R$100-1K/mo | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| ACV R$1K-10K/mo | ⚠️ | ✅ | ✅ | ✅ | ⚠️ |
| ACV > R$10K/mo | ❌ | ✅ | ⚠️ | ✅ | ❌ |
| Visual product | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Technical product | ❌ | ✅ | ⚠️ | ✅ | ⚠️ |
| Network effects | ✅ | ⚠️ | ⚠️ | ❌ | ✅ |
| Quick value | ✅ | ✅ | ✅ | ❌ | ✅ |
| Complex setup | ❌ | ✅ | ⚠️ | ✅ | ❌ |
| B2C mass market | ✅ | ✅ | ✅ | ❌ | ✅ |
| B2B enterprise | ❌ | ✅ | ⚠️ | ✅ | ❌ |

### 3. Channel Evaluation Criteria
| Criterio | Peso | Descricao |
|----------|------|----------|
| Audience match | 25% | Target audience uses this channel? |
| Unit economics | 25% | CAC vs LTV works for this channel? |
| Scalability | 20% | Can grow 10x without linear cost? |
| Time to result | 15% | How fast to see first results? |
| Defensibility | 15% | Can competitors easily copy? |

### 4. Channel Scorecard
| Canal | Audience | Economics | Scale | Speed | Defense | Weighted Score |
|-------|---------|----------|-------|-------|---------|---------------|
| SEO/Content | /5 | /5 | /5 | /5 | /5 | |
| Google Ads | /5 | /5 | /5 | /5 | /5 | |
| Meta Ads | /5 | /5 | /5 | /5 | /5 | |
| Referral | /5 | /5 | /5 | /5 | /5 | |
| LinkedIn | /5 | /5 | /5 | /5 | /5 | |
| Partnerships | /5 | /5 | /5 | /5 | /5 | |
| Community | /5 | /5 | /5 | /5 | /5 | |
| Product-led | /5 | /5 | /5 | /5 | /5 | |

### 5. Bullseye Framework (Gabriel Weinberg)
| Ring | Canais | Acao |
|------|--------|------|
| Outer Ring | ALL 19 traction channels brainstorm | List all possibilities |
| Middle Ring | Top 6 candidates | Cheap tests for each |
| Inner Ring (Bullseye) | Top 1-3 proven channels | Focus and scale |

**19 Traction Channels:**
1. Viral Marketing
2. PR / Media
3. Unconventional PR
4. SEM/PPC
5. Social & Display Ads
6. Offline Ads
7. SEO
8. Content Marketing
9. Email Marketing
10. Engineering as Marketing
11. Targeting Blogs
12. Business Development
13. Sales
14. Affiliate Programs
15. Existing Platforms
16. Trade Shows
17. Offline Events
18. Speaking Engagements
19. Community Building

### 6. Channel Testing Protocol
| Fase | Investimento | Duracao | Decisao |
|------|-------------|---------|---------|
| Quick test | R$500-2K | 2 weeks | Signal or no signal |
| Validation | R$2K-10K | 4 weeks | CAC within target? |
| Scale test | R$10K-50K | 8 weeks | Maintains economics at 3x? |
| Full scale | R$50K+ | Ongoing | Primary channel status |

### 7. Channel Portfolio Strategy
| Fase do Produto | Primary | Secondary | Experimental |
|----------------|---------|----------|-------------|
| Pre-PMF | 1 channel max | 0 | 2-3 tests |
| Early growth | 1-2 channels | 1 | 1-2 tests |
| Scaling | 2-3 channels | 2 | 1-2 tests |
| Mature | 3-5 channels | 2-3 | Ongoing tests |

**70/20/10 Budget Rule:**
- 70% → Proven channels (scale what works)
- 20% → Promising channels (validate)
- 10% → Experimental (discover new)

## Saida
- Product-channel fit analysis
- Channel scorecard (ranked)
- Bullseye framework results
- Testing protocol for top channels
- Budget allocation recommendation

## Validacao
- [ ] Product characteristics mapeados
- [ ] Fit matrix preenchida
- [ ] Pelo menos 8 canais avaliados
- [ ] Bullseye framework aplicado
- [ ] Top 3 canais identificados com justificativa
- [ ] Testing protocol definido
- [ ] Budget allocation proposto (70/20/10)
