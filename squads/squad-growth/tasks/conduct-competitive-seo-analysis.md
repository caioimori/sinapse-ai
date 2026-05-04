---
task: conduct-competitive-seo-analysis
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

# Task: Conduct Competitive SEO Analysis

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Conduzir analise SEO competitiva — comparar performance organica, estrategias de conteudo e perfis de backlinks dos principais concorrentes.

## Entrada
- Competitor domains (3-5)
- Our domain metrics
- Industry/niche context

## Passos

### 1. Domain Authority Comparison
| Metrica | Nos | Comp A | Comp B | Comp C |
|---------|-----|--------|--------|--------|
| Domain Rating (Ahrefs) | | | | |
| Domain Authority (Moz) | | | | |
| Organic traffic (est.) | | | | |
| Organic keywords | | | | |
| Referring domains | | | | |
| Top 3 keywords | | | | |
| Top 10 keywords | | | | |

### 2. Keyword Gap Analysis
| Keyword | Vol | Nos | Comp A | Comp B | Opportunity |
|---------|-----|-----|--------|--------|-------------|
| | | Rank or "—" | | | High/Med/Low |

### 3. Content Strategy Comparison
| Aspecto | Nos | Comp A | Comp B |
|---------|-----|--------|--------|
| Blog frequency | | | |
| Avg content length | | | |
| Content types | | | |
| Top-performing topics | | | |
| Featured snippets won | | | |
| Topic clusters visible | | | |

### 4. Backlink Profile Comparison
| Metrica | Nos | Comp A | Comp B |
|---------|-----|--------|--------|
| Total referring domains | | | |
| New domains/month | | | |
| Avg DR of referrers | | | |
| Top link sources | | | |
| Link building tactics visible | | | |

### 5. Strategic Opportunities
| Oportunidade | Evidencia | Acao | Priority |
|-------------|----------|------|---------|
| Content gap | Competitor ranks, we don't | Create content | |
| Link gap | Competitor has links, we don't | Outreach | |
| Feature snippet | Competitor has snippet | Optimize content format | |
| Technical advantage | Our site faster/better | Leverage as ranking factor | |

## Saida
- Competitive SEO analysis report
- Domain comparison matrix
- Keyword gap analysis
- Content strategy comparison
- Link building opportunities
- Strategic recommendations

## Validacao
- [ ] 3-5 competitors analisados
- [ ] Domain metrics comparados
- [ ] Keyword gaps identificados
- [ ] Content strategies avaliadas
- [ ] Link profiles comparados
- [ ] Oportunidades priorizadas
