---
task: analyze-backlink-profile
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

# Task: Analyze Backlink Profile

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Analisar perfil de backlinks — avaliar qualidade, diversidade e oportunidades de link building para fortalecer autoridade do dominio.

## Entrada
- Domain URL
- Competitor domains
- Backlink tool access (Ahrefs/Semrush)
- Current Domain Rating/Authority

## Passos

### 1. Backlink Profile Overview
| Metrica | Nosso Site | Competitor A | Competitor B |
|---------|-----------|-------------|-------------|
| Domain Rating (DR) | | | |
| Referring Domains | | | |
| Total Backlinks | | | |
| Dofollow % | | | |
| Unique IPs | | | |
| Avg DR of referring domains | | | |

### 2. Backlink Quality Assessment
| Qualidade | Criterios | Count | % |
|-----------|----------|-------|---|
| High quality | DR 50+, relevant, editorial | | |
| Medium quality | DR 20-50, somewhat relevant | | |
| Low quality | DR < 20, irrelevant, spammy | | |
| Toxic | Spammy, PBN, link farms | | |

### 3. Anchor Text Analysis
| Tipo | Exemplo | % Ideal | % Atual |
|------|---------|---------|---------|
| Branded | "Company Name" | 30-40% | |
| URL | "example.com" | 15-25% | |
| Generic | "click here", "learn more" | 10-15% | |
| Exact match keyword | "best running shoes" | 5-10% | |
| Partial match | "running shoe guide" | 10-15% | |
| Other | Various | 10-15% | |

### 4. Link Opportunities
| Tipo | Descricao | Potencial |
|------|----------|----------|
| Competitor backlinks | Links que competitors tem e nos nao | High |
| Broken link building | Pages linkando para conteudo 404 | Medium |
| Unlinked mentions | Mencoes da marca sem link | Medium |
| Guest posting | Sites relevantes que aceitam guest posts | Medium |
| Resource pages | Paginas de recursos no nicho | High |
| HARO/PR | Help a Reporter Out | Medium |
| Partnership links | Parceiros e clientes | High |

### 5. Toxic Link Assessment
| Indicador | Action |
|-----------|--------|
| Spammy anchor text patterns | Disavow if risky |
| Links from penalized domains | Disavow |
| Irrelevant foreign language links | Monitor |
| PBN patterns (same IP, template) | Disavow |
| Comment/forum spam | Disavow if significant |

## Saida
- Backlink profile analysis
- Quality distribution report
- Link opportunity list
- Disavow recommendations (if needed)
- Link building strategy

## Validacao
- [ ] Profile completo analisado
- [ ] Qualidade classificada
- [ ] Anchor text distribution avaliada
- [ ] Oportunidades identificadas
- [ ] Toxic links avaliados
- [ ] Link building plan priorizado
