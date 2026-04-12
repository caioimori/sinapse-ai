---
task: create-topic-cluster-map
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

# Task: Create Topic Cluster Map

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Criar mapa de topic clusters — organizar conteudo em pillar pages e cluster content com internal linking estrategico para dominar topicos no Google.

## Entrada
- Keyword strategy
- Existing content audit
- Business topics
- Competitor content analysis

## Passos

### 1. Topic Cluster Model
```
        ┌─── Cluster Article 1
        │
Pillar ─┼─── Cluster Article 2
 Page   │
        ├─── Cluster Article 3
        │
        └─── Cluster Article 4

Each cluster article links back to pillar page.
Pillar page links out to all cluster articles.
```

### 2. Cluster Definition Template
| Campo | Descricao |
|-------|----------|
| Cluster name | Topic area |
| Pillar page | Comprehensive guide (2000-5000 words) |
| Pillar keyword | Head term (high volume, high KD) |
| Cluster articles | Supporting content (800-2000 words each) |
| Cluster keywords | Long-tail, related terms |
| Internal links | Bidirectional linking plan |
| Content gap | Articles to create |

### 3. Topic Clusters Map
| Cluster | Pillar Keyword | Vol | Pillar Page | Cluster Articles (count) | Status |
|---------|---------------|-----|------------|------------------------|--------|
| Topic A | | | /guides/topic-a | 8 articles | Planning |
| Topic B | | | /guides/topic-b | 6 articles | Existing |
| Topic C | | | /guides/topic-c | 10 articles | Partial |

### 4. Internal Linking Strategy
| Regra | Descricao |
|-------|----------|
| Cluster → Pillar | Every cluster article links to its pillar |
| Pillar → Cluster | Pillar page links to all cluster articles |
| Cross-cluster | Related clusters link to each other (sparingly) |
| Anchor text | Descriptive, keyword-relevant (not "click here") |
| Link placement | In-content, contextual (not just footer/sidebar) |
| Max links/page | 3-5 internal links per 1000 words |

### 5. Content Gap Analysis
| Cluster | Existing Articles | Needed Articles | Gap | Priority |
|---------|-----------------|----------------|-----|---------|
| Topic A | 3 | 8 | 5 new | P1 |
| Topic B | 6 | 6 | 0 (optimize) | P3 |
| Topic C | 2 | 10 | 8 new | P2 |

## Saida
- Topic cluster map (visual)
- Cluster definitions
- Internal linking strategy
- Content gap analysis
- Content creation roadmap

## Validacao
- [ ] Clusters definidos com pillar + cluster articles
- [ ] Keywords mapeados por cluster
- [ ] Internal linking strategy documentada
- [ ] Content gaps identificados
- [ ] Prioridades de criacao definidas
- [ ] Handoff para squad-content
