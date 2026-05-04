---
task: implement-hreflang
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

# Task: Implement Hreflang

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Implementar hreflang tags — configurar corretamente para sites multilinguais/multiregionais para servir a versao correta do conteudo por idioma/regiao.

## Entrada
- Language/region versions
- URL structure for i18n
- Content mapping between versions

## Passos

### 1. URL Structure Options
| Abordagem | Exemplo | Pros | Cons |
|-----------|---------|------|------|
| Subdirectory | example.com/pt-br/ | Single domain authority | Mais simples |
| Subdomain | pt.example.com | Separate hosting | Dilui authority |
| ccTLD | example.com.br | Strong geo signal | Separate domains |
| URL parameter | example.com?lang=pt | Not recommended | Google may ignore |

**Recomendacao:** Subdirectory (`/pt-br/`, `/en/`) com Next.js i18n routing.

### 2. Hreflang Implementation
```html
<!-- In <head> of each page -->
<link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-br/page" />
<link rel="alternate" hreflang="en" href="https://example.com/en/page" />
<link rel="alternate" hreflang="es" href="https://example.com/es/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/page" />
```

### 3. Hreflang Rules
| Regra | Descricao |
|-------|----------|
| Bidirectional | If page A references B, B must reference A |
| Self-referencing | Each page must reference itself |
| x-default | Fallback for unmatched languages |
| Absolute URLs | Always use full URLs |
| Return tags | Every referenced page must exist (200) |
| Canonical alignment | Canonical and hreflang must not conflict |

### 4. Hreflang Map
| Page | pt-BR | en | es | x-default |
|------|-------|-----|-----|-----------|
| Homepage | /pt-br/ | /en/ | /es/ | /en/ |
| About | /pt-br/sobre | /en/about | /es/acerca | /en/about |
| Pricing | /pt-br/precos | /en/pricing | /es/precios | /en/pricing |
| Blog | /pt-br/blog | /en/blog | /es/blog | /en/blog |

### 5. Next.js Implementation
```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ['pt-BR', 'en', 'es'],
    defaultLocale: 'pt-BR',
  },
};

// app/[locale]/layout.tsx — generates hreflang automatically
// Or manually in metadata:
export const metadata = {
  alternates: {
    languages: {
      'pt-BR': '/pt-br/page',
      'en': '/en/page',
      'es': '/es/page',
    },
  },
};
```

### 6. Validation
| Check | Tool |
|-------|------|
| Hreflang syntax correct | Hreflang Tags Testing Tool |
| Bidirectional references | Screaming Frog hreflang report |
| All referenced pages exist | Crawl check |
| No canonical conflicts | Manual review |
| x-default present | Code review |
| Search Console report | International Targeting |

## Saida
- Hreflang implementation plan
- URL mapping per language
- Code implementation
- Validation results

## Validacao
- [ ] Hreflang tags em todas as paginas multilinguais
- [ ] Bidirectional references corretas
- [ ] x-default definido
- [ ] Self-referencing presente
- [ ] URLs absolutas usadas
- [ ] Sem conflitos com canonical
- [ ] Search Console sem hreflang errors
