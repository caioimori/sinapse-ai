---
task: research-keyword-strategy
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

# Task: Research Keyword Strategy

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Complex

## Objetivo
Pesquisar e definir estrategia de keywords — mapear intencoes de busca, volume, dificuldade e oportunidades para guiar criacao de conteudo e otimizacao on-page.

## Entrada
- Business offerings/services
- Target audience
- Competitor domains
- Current rankings (Search Console)

## Passos

### 1. Keyword Research Process
| Fase | Acao | Tool |
|------|------|------|
| Seed keywords | Brainstorm + competitor analysis | Ahrefs, Semrush |
| Expansion | Related terms, questions, long-tail | Ahrefs, AlsoAsked |
| Intent mapping | Classify by search intent | Manual + SERP analysis |
| Volume & difficulty | Assess volume and KD | Ahrefs, Semrush |
| Opportunity scoring | Gap analysis vs competitors | Ahrefs Content Gap |
| Prioritization | Score by opportunity × feasibility | Custom framework |

### 2. Search Intent Classification
| Intent | Descricao | SERP Features | Content Type |
|--------|----------|--------------|-------------|
| Informational | Aprender, entender | Featured snippets, PAA | Blog, guides, tutorials |
| Navigational | Encontrar site/marca | Brand results, sitelinks | Homepage, brand pages |
| Commercial | Comparar, avaliar | Reviews, comparisons | Comparison, reviews |
| Transactional | Comprar, contratar | Shopping, ads, CTAs | Product, pricing, signup |

### 3. Keyword Map Template
| Keyword | Volume | KD | Intent | Current Rank | Target Page | Priority |
|---------|--------|-----|--------|-------------|------------|---------|
| | Monthly | 0-100 | I/N/C/T | Position or N/A | URL or "Create" | P1-P4 |

### 4. Competitor Gap Analysis
| Keyword | Competitor A Rank | Competitor B Rank | Our Rank | Opportunity |
|---------|-----------------|-----------------|---------|-------------|
| | | | | High/Medium/Low |

### 5. Keyword Grouping Strategy
| Topic Cluster | Pillar Page | Cluster Keywords | Content Pieces |
|-------------|------------|-----------------|---------------|
| {Main topic} | /topic/pillar-page | 15-25 related keywords | Blog posts, guides |

### 6. Prioritization Framework
| Factor | Weight | Score 1-5 |
|--------|--------|----------|
| Search volume | 25% | |
| Business relevance | 30% | |
| Ranking feasibility (KD) | 20% | |
| Content gap (no existing page) | 15% | |
| Conversion potential | 10% | |

## Saida
- Keyword strategy document
- Keyword map with 100+ keywords
- Intent classification
- Competitor gap analysis
- Topic cluster recommendations
- Prioritized keyword list

## Validacao
- [ ] 100+ keywords pesquisados
- [ ] Intent classificado para cada keyword
- [ ] Volume e KD documentados
- [ ] Competitor gap analysis completo
- [ ] Keywords agrupados em clusters
- [ ] Top 20 keywords priorizados
- [ ] Handoff para squad-content
