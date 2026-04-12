---
task: audit-sitemap-robots
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

# Task: Audit Sitemap & Robots.txt

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Auditar e otimizar sitemap.xml e robots.txt — garantir que search engines podem descobrir e indexar todo conteudo relevante eficientemente.

## Entrada
- Current sitemap.xml
- Current robots.txt
- Page inventory
- Index coverage report (Search Console)

## Passos

### 1. Sitemap Audit
| Check | Status | Issue |
|-------|--------|-------|
| Sitemap exists and accessible | | |
| Submitted to Search Console | | |
| All important URLs included | | |
| No noindex pages in sitemap | | |
| No 4xx/5xx URLs in sitemap | | |
| No redirect URLs in sitemap | | |
| Lastmod dates accurate | | |
| Sitemap < 50,000 URLs | | |
| Sitemap < 50MB uncompressed | | |
| Sitemap index if needed | | |
| Image/video sitemaps (if applicable) | | |

### 2. Robots.txt Audit
| Check | Status | Issue |
|-------|--------|-------|
| robots.txt accessible at /robots.txt | | |
| Not blocking important resources | | |
| Sitemap URL referenced | | |
| No accidental Disallow: / | | |
| CSS/JS not blocked | | |
| Admin/private paths blocked | | |
| API endpoints appropriately handled | | |
| Crawl-delay appropriate (if used) | | |

### 3. Optimized robots.txt Template
```
User-agent: *
Allow: /

# Block admin and private paths
Disallow: /admin/
Disallow: /api/
Disallow: /internal/
Disallow: /_next/data/

# Block search results and filtered pages
Disallow: /search?
Disallow: /*?sort=
Disallow: /*?filter=

# Sitemap
Sitemap: https://example.com/sitemap.xml
```

### 4. Next.js Sitemap Generation
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPages();
  const posts = await getPosts();

  return [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...pages.map(page => ({
      url: `https://example.com/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.map(post => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
```

## Saida
- Sitemap audit report
- Robots.txt audit report
- Optimized sitemap configuration
- Optimized robots.txt
- Implementation guide

## Validacao
- [ ] Sitemap contem todas as paginas importantes
- [ ] Nenhuma pagina noindex no sitemap
- [ ] Nenhuma pagina 4xx/5xx no sitemap
- [ ] robots.txt nao bloqueia conteudo importante
- [ ] Sitemap referenciado no robots.txt
- [ ] Sitemap submitted no Search Console
