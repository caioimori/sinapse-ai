# Knowledge Base: Information Architecture

## Escopo
Referencia abrangente de Information Architecture (IA) — taxonomia, navegacao, organizacao de conteudo e padroes de busca para experiencias digitais.

---

## 1. Fundamentos de IA

### Definicao
Information Architecture e a arte e ciencia de organizar e rotular conteudo em websites, apps e sistemas para suportar usabilidade e findability.

### Pilares (Rosenfeld & Morville)
| Pilar | Descricao | Artefato Principal |
|-------|----------|-------------------|
| Organization | Como conteudo e agrupado | Taxonomy, categorization |
| Labeling | Como conteudo e nomeado | Labels, nomenclature |
| Navigation | Como usuario se move | Menus, breadcrumbs, links |
| Search | Como usuario busca | Search UI, filters, facets |

---

## 2. Sistemas de Organizacao

### Schemas Exatos
| Schema | Exemplo | Quando Usar |
|--------|---------|------------|
| Alphabetical | A-Z listing | Directories, glossarios |
| Chronological | Timeline, blog posts | News, historicos |
| Geographic | Map-based | Locations, regional content |

### Schemas Ambiguos
| Schema | Exemplo | Quando Usar |
|--------|---------|------------|
| Topic | Categorias tematicas | Maioria dos sites |
| Task | Ações do usuario | Apps orientados a tarefas |
| Audience | Por tipo de usuario | Sites com publicos distintos |
| Metaphor | Analogia visual | Quando metafora e clara |
| Hybrid | Combinação | Maioria dos casos reais |

### Estruturas
| Estrutura | Descricao | Exemplo |
|-----------|----------|---------|
| Hierarchy (tree) | Top-down, broad → narrow | Site navigation |
| Database (flat) | Metadata-driven | Product catalog |
| Hypertext (web) | Link-based connections | Wiki, knowledge base |
| Linear (sequence) | Step-by-step | Onboarding, checkout |
| Faceted | Multi-dimensional | E-commerce filters |

---

## 3. Padroes de Navegacao

### Navegacao Global
| Padrao | Descricao | Max Items |
|--------|----------|-----------|
| Horizontal nav bar | Menu principal no topo | 7 (Miller's Law) |
| Mega menu | Menu expandido com categorias | 3-4 colunas |
| Sidebar nav | Navegacao lateral persistente | 15-20 items |
| Tab bar (mobile) | 3-5 icones na base | 5 max |

### Navegacao Local
| Padrao | Uso |
|--------|-----|
| Breadcrumbs | Hierarquia de localizacao |
| Sidebar sub-nav | Paginas dentro de secao |
| In-page anchors | Navegacao dentro de pagina longa |
| Tabs | Conteudo alternativo na mesma pagina |
| Pagination | Conteudo em multiplas paginas |

### Navegacao Contextual
| Padrao | Uso |
|--------|-----|
| Related content | Links para conteudo similar |
| Cross-links | Conexoes entre secoes |
| Inline links | Links no corpo do texto |
| Card navigation | Grid de opcoes visuais |
| Wizard/stepper | Progresso em processo linear |

---

## 4. Sitemap Patterns

### Sitemap Flat
```
Home
├── About
├── Services
├── Products
├── Blog
└── Contact
```
**Quando:** Sites simples, < 20 paginas.

### Sitemap Deep
```
Home
├── Products
│   ├── Category A
│   │   ├── Product 1
│   │   └── Product 2
│   └── Category B
│       ├── Product 3
│       └── Product 4
├── Support
│   ├── FAQ
│   ├── Documentation
│   │   ├── Getting Started
│   │   └── API Reference
│   └── Contact
└── Account
    ├── Profile
    ├── Orders
    └── Settings
```
**Quando:** Sites complexos, e-commerce, SaaS.

### Regras de Profundidade
| Profundidade | Recomendacao |
|-------------|-------------|
| 1 nivel | Ideal para findability |
| 2 niveis | Aceitavel para maioria |
| 3 niveis | Maximo recomendado |
| 4+ niveis | Evitar — indica IA complexa demais |

---

## 5. Labeling System

### Principios
| Principio | Descricao |
|-----------|----------|
| Clarity | Labels devem ser auto-explicativas |
| Consistency | Mesmo padrao em todo o site |
| User language | Vocabulario do usuario, nao da empresa |
| Specificity | Especifico o suficiente para diferenciar |
| Brevity | Curto, max 2-3 palavras para nav items |

### Patterns
| Tipo | Exemplo Bom | Exemplo Ruim |
|------|------------|-------------|
| Nav label | "Pricing" | "Our Pricing Plans and Options" |
| Page title | "Account Settings" | "Settings" (ambiguo) |
| CTA | "Start Free Trial" | "Submit" |
| Category | "Running Shoes" | "Shoes Type A" |
| Breadcrumb | "Home > Products > Shoes" | "Main > Cat > Subcat" |

---

## 6. Search Patterns

### Anatomia de Busca
| Componente | Descricao |
|-----------|----------|
| Search box | Input com placeholder descritivo |
| Autocomplete | Sugestoes em tempo real |
| Filters/facets | Refinamento por atributos |
| Results page | Lista com snippets relevantes |
| No results | Mensagem util com alternativas |
| Sort options | Relevance, date, price, etc. |

### Search UX Best Practices
| Pratica | Implementacao |
|---------|-------------|
| Prominent placement | Visivel no header, icone de busca |
| Placeholder text | "Search products, articles..." |
| Recent searches | Mostrar ultimas buscas do usuario |
| Popular searches | Trending queries |
| Fuzzy matching | Tolerar typos |
| Scoped search | Buscar dentro de secao |

---

## 7. Card Sorting e Tree Testing

### Card Sorting
| Tipo | Descricao | Quando |
|------|----------|--------|
| Open | Usuarios criam categorias | Descoberta inicial |
| Closed | Usuarios organizam em categorias dadas | Validacao |
| Hybrid | Mix dos dois | Refinamento |

**Tamanho:** 30-60 cards, 15-30 participantes, analise por similarity matrix.

### Tree Testing
| Aspecto | Detalhes |
|---------|---------|
| O que testa | Findability sem UI visual |
| Tamanho | 8-12 tasks, 50+ participantes |
| Metricas | Success rate, directness, time |
| Target | >= 80% success rate |
| Ferramenta | Optimal Workshop, UserZoom |

---

## 8. IA para Diferentes Contextos

### E-commerce
- Faceted navigation (filters)
- Breadcrumbs com categorias
- Product taxonomy hierarquica
- Search com autocomplete e filtros

### SaaS Dashboard
- Sidebar navigation persistente
- Top-level: features, not departments
- Settings agrupados por dominio
- Contextual help/docs links

### Content Site (Blog/News)
- Category + tag taxonomy
- Chronological + topic organization
- Related content links
- Archive navigation

### Mobile App
- Tab bar (3-5 items primarios)
- Hamburger para secundarios
- Gestos para navegacao contextual
- Deep linking para conteudo especifico

---

## 9. Metricas de Qualidade de IA

| Metrica | Target | Como Medir |
|---------|--------|-----------|
| Findability | >= 80% success rate | Tree testing |
| Time to find | < 30s for primary tasks | Usability test |
| Navigation depth | <= 3 clicks to any page | Sitemap analysis |
| Search success rate | >= 70% | Analytics |
| Bounce rate from nav | < 20% | Analytics |
| Breadcrumb usage | Tracked | Analytics |

---

## Referencias
- Rosenfeld, L., Morville, P., Arango, J. (2015). Information Architecture for the World Wide Web
- Spencer, D. (2010). A Practical Guide to Information Architecture
- Nielsen Norman Group — IA research articles
