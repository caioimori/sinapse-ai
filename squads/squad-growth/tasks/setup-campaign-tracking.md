---
task: setup-campaign-tracking
responsavel: "@ga-campaign-analyst"
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

# Task: Setup Campaign Tracking

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Configurar tracking de campanhas — implementar rastreamento end-to-end de campanhas de marketing, desde impressao ate conversao, integrando dados de plataformas de ads com analytics.

## Entrada
- Active advertising platforms
- Conversion events defined
- UTM strategy document
- Analytics setup (GA4/GTM)

## Passos

### 1. Tracking Architecture
```
Ad Platforms (Impressions, Clicks, Spend)
    │
    ▼
Landing Page (UTM capture, pageview)
    │
    ▼
GTM Data Layer (user, session, campaign data)
    │
    ├──► GA4 (behavior, conversions)
    ├──► Meta Pixel / CAPI (Meta conversions)
    ├──► Google Ads Tag (Google conversions)
    ├──► LinkedIn Insight Tag (LinkedIn conversions)
    └──► Data Warehouse (unified view)
```

### 2. Platform-Specific Setup
| Plataforma | Pixel/Tag | Server-Side | Conversions |
|-----------|----------|-------------|------------|
| Google Ads | Google Ads Tag via GTM | Enhanced conversions | Import from GA4 or direct |
| Meta (FB/IG) | Meta Pixel via GTM | Conversions API (CAPI) | Standard + custom events |
| LinkedIn | Insight Tag via GTM | CAPI (beta) | URL-based + event-based |
| TikTok | TikTok Pixel via GTM | Events API | Standard + custom events |
| Twitter/X | Twitter Pixel via GTM | CAPI | URL-based + event-based |

### 3. GTM Tag Configuration
| Tag | Trigger | Dados Enviados |
|-----|---------|---------------|
| GA4 Config | All Pages | page_view, user properties |
| GA4 Event: conversion | Form submit / Purchase | event params, value |
| Google Ads Conversion | Thank you page / Purchase | conversion_id, value, currency |
| Meta Pixel: PageView | All Pages | — |
| Meta Pixel: Purchase | Purchase event | value, currency, content_ids |
| LinkedIn: Conversion | Form submit | conversion_id |

### 4. Enhanced Conversions Setup
| Plataforma | Dados First-Party | Implementacao |
|-----------|------------------|-------------|
| Google Ads | Email (hashed), phone, address | Enhanced conversions in GTM |
| Meta CAPI | Email (hashed), phone, fbp, fbc | Server-side GTM or direct API |
| LinkedIn | Email (hashed) | CAPI integration |

**GTM Server-Side Container:**
```
Client-Side GTM → Server-Side GTM → Ad Platform APIs
                                   → GA4
                                   → Data Warehouse

Benefits:
- First-party context (bypasses ad blockers)
- Data control (PII handling)
- Improved data quality (95-99% accuracy)
```

### 5. Conversion Tracking Matrix
| Conversao | GA4 Event | Google Ads | Meta | LinkedIn |
|----------|----------|-----------|------|---------|
| Page View | page_view | — | PageView | — |
| Lead (form) | generate_lead | Lead | Lead | Lead |
| Signup | sign_up | Signup | CompleteRegistration | — |
| Add to Cart | add_to_cart | Add to Cart | AddToCart | — |
| Purchase | purchase | Purchase | Purchase | — |
| Contact | contact_form | Lead | Contact | Lead |

### 6. Data Layer Events for Campaigns
```javascript
// Lead generation event
dataLayer.push({
  event: 'generate_lead',
  lead_source: 'landing_page',
  lead_type: 'demo_request',
  form_name: 'demo_form_hero',
  value: 150,  // estimated lead value
  currency: 'BRL'
});

// Purchase event with campaign context
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'TXN-12345',
    value: 299.90,
    currency: 'BRL',
    coupon: 'BLACKFRIDAY30',
    items: [
      {
        item_id: 'SKU-001',
        item_name: 'Product Name',
        price: 299.90,
        quantity: 1
      }
    ]
  }
});
```

### 7. Cross-Platform Deduplication
| Desafio | Solucao |
|---------|---------|
| Same conversion counted by multiple pixels | Use single source of truth (GA4 or backend) |
| Conversion window differences | Standardize: 7-day click, 1-day view |
| Self-reported vs independent | Compare platform data with GA4 |
| Offline conversions | Upload offline conversion data to platforms |

### 8. Campaign Tracking QA Checklist
| Check | Ferramenta | Criterio |
|-------|-----------|---------|
| UTMs correct in ads | Manual review | All active ads have UTMs |
| Pixels firing | Tag Assistant, Meta Pixel Helper | All events firing correctly |
| Data layer populated | GTM Preview mode | Required fields present |
| Conversions matching | Platform vs GA4 comparison | < 10% discrepancy |
| Server-side events | Server GTM logs | Events reaching platforms |
| Cross-domain working | GA4 debug mode | Session maintained across domains |
| Consent integration | Consent banner test | Tags respect consent state |

## Saida
- Tracking architecture diagram
- Platform-specific tag configurations
- Conversion tracking matrix
- Data layer event specifications
- QA checklist results
- Cross-platform deduplication strategy

## Validacao
- [ ] Tracking architecture documentada
- [ ] Tags configurados em GTM para cada plataforma
- [ ] Conversion events mapeados cross-platform
- [ ] Enhanced conversions implementados
- [ ] Data layer events especificados
- [ ] QA executado com todos checks passing
- [ ] Deduplication strategy definida
