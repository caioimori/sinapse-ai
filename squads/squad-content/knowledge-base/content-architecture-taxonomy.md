# Content Architecture & Taxonomy

> Fonte: MS-008 Content Strategy Research (2026-04-07). Baseado em Halvorson, DITA, e praticas de headless CMS.

---

## 1. Arquitetura de Informacao para Conteudo

**Arquitetura de Informacao (AI)** e a disciplina de organizar, estruturar e rotular conteudo de forma eficaz. Termo cunhado por Richard Saul Wurman nos anos 70, desenvolvido por Peter Morville e Louis Rosenfeld (o "livro do urso polar", 1998).

**Os 4 Sistemas de AI:**

1. **Sistemas de Organizacao** — Como o conteudo e agrupado (por topico, cronologia, tipo, publico)
2. **Sistemas de Rotulacao** — Como o conteudo e nomeado (titulos, categorias, tags)
3. **Sistemas de Navegacao** — Como o usuario se move entre conteudos (menus, breadcrumbs, links internos)
4. **Sistemas de Busca** — Como o conteudo e encontrado (search, filtros, faceted navigation)

> Boa arquitetura responde: "Se eu tiver 1.000 pecas de conteudo, como alguem encontra a peca certa em menos de 3 cliques?"

---

## 2. Content Models

Um **Content Model** define a estrutura de cada tipo de conteudo. Diferente de um template (visual), o content model e estrutural — define quais campos, atributos e relacoes cada tipo possui.

**Exemplo — Modelo de Blog Post:**

```yaml
blog_post:
  fields:
    - title: string (max 60 chars)
    - slug: string (auto-generated)
    - excerpt: string (max 160 chars)
    - body: rich_text
    - featured_image: media
    - author: reference(author)
    - category: reference(category)     # 1 categoria principal
    - tags: reference(tag)[]             # multiplas tags
    - pillar: reference(content_pillar)
    - seo_title: string (max 60)
    - seo_description: string (max 160)
    - published_at: datetime
    - status: enum(draft, review, published, archived)
    - reading_time: computed(body)
    - cta_type: enum(newsletter, demo, ebook, none)
    - funnel_stage: enum(tofu, mofu, bofu)
    - content_tier: enum(hero, hub, help)
```

Content models sao fundamentais para headless CMS (Contentful, Sanity, Strapi) onde conteudo e separado da apresentacao. Habilitam reuso: uma peca pode ser renderizada como blog post na web, card no app mobile, snippet no email.

---

## 3. Taxonomias e Folksonomias

**Taxonomias** sao sistemas de classificacao hierarquicos (vocabulario controlado):

```
Marketing Digital
├── SEO
│   ├── SEO On-Page
│   ├── SEO Tecnico
│   └── Link Building
├── Content Marketing
│   ├── Blog
│   ├── Video
│   └── Podcast
└── Midia Paga
    ├── Google Ads
    └── Meta Ads
```

**Folksonomias** sao classificacoes criadas pelos usuarios (tags livres). Exemplo: sistema de tags do WordPress ou hashtags no Instagram. Sao mais flexiveis, mas menos consistentes.

**Melhor pratica:** Combinar ambas:
- **Taxonomia controlada** para categorias principais (hierarquia fixa, vocabulario controlado)
- **Tags livres** para classificacao granular (permitindo emergencia de novos temas)

---

## 4. Metadados Essenciais para Conteudo

| Metadado | Tipo | Proposito |
|----------|------|-----------|
| Titulo | Descritivo | Identificacao e SEO |
| Autor | Referencia | Credibilidade, E-E-A-T |
| Data de publicacao | Temporal | Freshness, relevancia |
| Categoria | Taxonomia | Organizacao |
| Tags | Folksonomia | Descoberta |
| Estagio do funil | Classificacao | Alinhamento com jornada |
| Persona alvo | Referencia | Personalizacao |
| Formato | Enum | Filtragem (video, texto, audio) |
| Status | Workflow | Gestao editorial |
| Content score | Computado | Priorizacao |

---

## 5. Structured Content — DITA, Headless CMS e Content-as-Data

**Conteudo estruturado** e conteudo separado de sua apresentacao, organizado em componentes reutilizaveis com metadados ricos. E o oposto de conteudo monolitico (um documento Word com formatacao embutida).

**DITA (Darwin Information Typing Architecture):**
Padrao XML da OASIS para documentacao tecnica estruturada. Usado por IBM, Microsoft, SAP. Organiza conteudo em "topics" (concept, task, reference) que podem ser compostos em "maps" — habilitando reuso massivo.

### Headless CMS Principais (2025-2026)

| CMS | Modelo | Destaque |
|-----|--------|----------|
| **Contentful** | Cloud | Lider enterprise, 300K+ clientes |
| **Sanity** | Cloud/Self-hosted | GROQ query language, real-time collaboration |
| **Strapi** | Open-source | Node.js, auto-generated API, extensivel |
| **Hygraph** | Cloud | GraphQL-native, content federation |
| **Directus** | Open-source | Database-first, qualquer SQL DB |
| **Payload** | Open-source | TypeScript-native, Next.js integration |

### Content-as-Data

Trata todo conteudo como dados estruturados que podem ser consultados, transformados, combinados e entregues programaticamente. Habilita:
- Personalizacao em escala
- Testes A/B de conteudo
- Integracao com IA
- Multi-canal sem retrabalho

---

## 6. Catalogo de Content Types

| Tipo | Formato | Extensao Media | Cadencia | Funil | Recurso Primario |
|------|---------|---------------|----------|-------|------------------|
| Blog Post (Help) | Texto + imagens | 1.500-2.500 palavras | 3-5/semana | TOFU | Writer + SEO |
| Blog Post (Hub) | Texto + midia | 3.000-5.000 palavras | 1/semana | MOFU | Sr. Writer + Designer |
| Case Study | Texto + dados | 1.500-2.000 palavras | 1-2/mes | BOFU | Writer + Cliente |
| Whitepaper | PDF longo | 5.000-10.000 palavras | 1/trimestre | MOFU | Expert + Designer |
| Infografico | Visual + texto | N/A | 1-2/mes | TOFU | Designer + Writer |
| Video Tutorial | Video | 5-15 min | 2/semana | Help | Videomaker |
| Podcast Episode | Audio | 30-60 min | 1/semana | Hub | Host + Convidado |
| Social Post | Texto/visual | Varia | Diario | TOFU | Social Manager |
| Email Newsletter | Texto | 500-1.000 palavras | 1/semana | Hub | Editor |
| Webinar | Video ao vivo | 45-60 min | 1/mes | MOFU | Expert + Moderador |
| Template/Tool | Funcional | N/A | Ad hoc | MOFU | Developer/Designer |
| Landing Page | Web | N/A | Por campanha | BOFU | Copywriter + Designer |

---

## 7. Content Brief — Template Padrao

O content brief e o documento mais importante do workflow editorial. Um brief mal feito resulta em conteudo que precisa ser refeito.

```markdown
## Content Brief

### Metadata
- Titulo provisorio: ___
- Tipo: Blog Post / Video / Podcast / ...
- Pilar: ___
- Persona: ___
- Estagio do funil: TOFU / MOFU / BOFU
- Content tier: Hero / Hub / Help
- Deadline rascunho: ___
- Deadline publicacao: ___

### SEO
- Keyword primaria: ___ (volume: ___, dificuldade: ___)
- Keywords secundarias: ___, ___, ___
- Search intent: Informacional / Navegacional / Transacional / Comercial
- URLs concorrentes a superar: ___, ___

### Objetivo
- O que o leitor deve SABER apos ler?
- O que o leitor deve SENTIR apos ler?
- O que o leitor deve FAZER apos ler? (CTA)

### Outline Sugerido
1. Introducao (hook + contexto)
2. Secao principal 1
3. Secao principal 2
4. Secao principal 3
5. Conclusao + CTA

### Referencias
- ___ (artigo/estudo/dados)
- ___ (fonte interna)
- ___ (competitor content)

### Restricoes
- Extensao: ___ palavras
- Tom: ___ (educacional / conversacional / tecnico)
- Nao mencionar: ___
- Obrigatorio incluir: ___

### Assets Necessarios
- Imagem destaque: sim/nao
- Graficos/tabelas: ___
- Screenshots: ___
```

---

## Referências

- Peter Morville & Louis Rosenfeld — Information Architecture for the World Wide Web (1998)
- Richard Saul Wurman — Information Architecture
- OASIS DITA — docs.oasis-open.org/dita
- Contentful — contentful.com/developers/docs
- Sanity — sanity.io/docs
- Halvorson — Content Strategy for the Web (content models)
