---
task: optimize-meta-tags
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

# Task: Optimize Meta Tags

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Otimizar meta tags — titles, descriptions, Open Graph e canonical tags para maximizar CTR organico e social sharing.

## Entrada
- Keyword strategy
- Page inventory
- Current meta tags audit
- Competitor meta tag analysis

## Passos

### 1. Title Tag Optimization
| Regra | Descricao |
|-------|----------|
| Length | 50-60 characters (max 600px) |
| Keyword placement | Primary keyword near beginning |
| Brand | Brand name at end (optional for non-homepage) |
| Uniqueness | Every page has unique title |
| Format | `Primary Keyword - Secondary | Brand` |
| Avoid | Keyword stuffing, all caps, excessive separators |

### 2. Meta Description Optimization
| Regra | Descricao |
|-------|----------|
| Length | 120-160 characters |
| CTA included | Call-to-action when appropriate |
| Keyword | Include primary keyword (bolded in SERP) |
| Value prop | Clear benefit for clicking |
| Uniqueness | Every page has unique description |
| Active voice | Action-oriented language |

### 3. Meta Tag Audit Template
| Page | Current Title | Optimized Title | Current Desc | Optimized Desc | Issues |
|------|-------------|----------------|-------------|----------------|--------|
| / | | | | | |
| /about | | | | | |
| /pricing | | | | | |

### 4. Open Graph & Social Tags
```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Description for social" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Brand Name" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Description for Twitter" />
<meta name="twitter:image" content="https://example.com/twitter-image.jpg" />

<!-- OG Image specs: 1200×630px, < 5MB -->
```

### 5. Canonical Tags
| Cenario | Canonical |
|---------|----------|
| Standard page | Self-referencing canonical |
| Pagination | Canonical to page 1 (or self) |
| URL parameters | Canonical to clean URL |
| HTTP vs HTTPS | Canonical to HTTPS |
| www vs non-www | Canonical to preferred |
| Duplicate content | Canonical to original |

### 6. Next.js Metadata Implementation
```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: 'Primary Keyword - Secondary | Brand',
  description: 'Compelling description with keyword and CTA.',
  alternates: { canonical: 'https://example.com/' },
  openGraph: {
    title: 'Social Title',
    description: 'Social description',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter description',
    images: ['/twitter-image.jpg'],
  },
};
```

## Saida
- Meta tag audit and optimization plan
- Optimized titles and descriptions per page
- Open Graph configuration
- Canonical tag strategy
- Next.js metadata implementation

## Validacao
- [ ] Titles otimizados (50-60 chars, keyword present)
- [ ] Descriptions otimizadas (120-160 chars, CTA)
- [ ] Open Graph tags em todas as paginas
- [ ] Twitter Card tags configurados
- [ ] Canonical tags corretos
- [ ] Sem duplicatas de title/description
