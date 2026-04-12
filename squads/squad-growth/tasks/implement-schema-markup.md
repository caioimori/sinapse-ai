---
task: implement-schema-markup
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

# Task: Implement Schema Markup

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Implementar schema markup (structured data) — adicionar dados estruturados JSON-LD para melhorar rich results no Google e aumentar CTR organico.

## Entrada
- Page types inventory
- Business type
- Content types
- Schema.org reference

## Passos

### 1. Schema Types por Page Type
| Page Type | Schema Types | Rich Result Potential |
|-----------|-------------|---------------------|
| Homepage | Organization, WebSite, SearchAction | Sitelinks search box |
| About | Organization, Person | Knowledge panel |
| Blog post | Article, BlogPosting | Article rich result |
| Product | Product, Offer, AggregateRating | Product rich result |
| FAQ | FAQPage, Question | FAQ rich result |
| How-to | HowTo | How-to rich result |
| Service | Service, Offer | Service listing |
| Event | Event | Event rich result |
| Recipe | Recipe | Recipe rich result |
| Local business | LocalBusiness | Local pack |
| Breadcrumbs | BreadcrumbList | Breadcrumb trail |

### 2. JSON-LD Implementation Examples
```html
<!-- Organization (homepage) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://linkedin.com/company/example",
    "https://twitter.com/example"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-11-9999-9999",
    "contactType": "customer service"
  }
}
</script>

<!-- Article (blog post) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2026-03-12",
  "dateModified": "2026-03-12",
  "image": "https://example.com/article-image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}
</script>

<!-- BreadcrumbList -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "Article Title" }
  ]
}
</script>

<!-- FAQPage -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our service provides..."
      }
    }
  ]
}
</script>
```

### 3. Next.js Implementation
```typescript
// components/schema/organization-schema.tsx
export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Company Name',
          url: 'https://example.com',
          logo: 'https://example.com/logo.png'
        })
      }}
    />
  );
}
```

### 4. Validation
| Tool | URL |
|------|-----|
| Google Rich Results Test | search.google.com/test/rich-results |
| Schema.org Validator | validator.schema.org |
| Google Search Console | Enhancements reports |

## Saida
- Schema markup implementation per page type
- JSON-LD code snippets
- Validation results
- Rich result monitoring plan

## Validacao
- [ ] Schema types definidos por page type
- [ ] JSON-LD implementado em todas as paginas-chave
- [ ] Validado no Rich Results Test
- [ ] Sem erros no Search Console
- [ ] Rich results aparecendo no Google
