---
task: configure-data-layer
responsavel: "@ga-analytics-engineer"
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

# Task: Configure Data Layer

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Configurar data layer padronizado — especificar estrutura, events, user properties e e-commerce data layer para comunicacao entre site e GTM.

## Entrada
- Event taxonomy
- Tracking plan
- E-commerce requirements
- User property definitions

## Passos

### 1. Data Layer Standard
```javascript
// Initial data layer (before GTM loads)
window.dataLayer = window.dataLayer || [];

// Page-level data (set on every page)
dataLayer.push({
  event: 'page_data',
  page: {
    path: '/products/running-shoes',
    title: 'Running Shoes | Store',
    type: 'product',           // home, category, product, cart, checkout, confirmation
    category: 'shoes',
    subcategory: 'running',
    language: 'pt-BR'
  },
  user: {
    id: 'hashed_user_id',     // Never PII
    type: 'customer',          // anonymous, prospect, customer
    plan: 'pro',               // free, pro, enterprise
    logged_in: true
  }
});
```

### 2. Event Data Layer Pushes
```javascript
// Form submission
dataLayer.push({
  event: 'form_submit',
  form: {
    name: 'contact_form',
    id: 'contact-main',
    location: 'homepage_bottom',
    fields_count: 5,
    time_to_complete_ms: 45000
  }
});

// CTA click
dataLayer.push({
  event: 'button_click',
  button: {
    text: 'Start Free Trial',
    location: 'hero_section',
    destination: '/signup',
    variant: 'primary'
  }
});

// Search
dataLayer.push({
  event: 'search',
  search: {
    term: 'running shoes',
    results_count: 42,
    category_filter: 'shoes',
    sort_by: 'relevance'
  }
});
```

### 3. E-commerce Data Layer (GA4)
```javascript
// Product view
dataLayer.push({
  event: 'view_item',
  ecommerce: {
    currency: 'BRL',
    value: 299.90,
    items: [{
      item_id: 'SKU-001',
      item_name: 'Running Shoe Pro',
      item_brand: 'Brand X',
      item_category: 'Shoes',
      item_category2: 'Running',
      price: 299.90,
      quantity: 1
    }]
  }
});

// Purchase
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'TXN-2026-001',
    value: 599.80,
    tax: 89.97,
    shipping: 15.00,
    currency: 'BRL',
    coupon: 'FIRST10',
    items: [
      {
        item_id: 'SKU-001',
        item_name: 'Running Shoe Pro',
        price: 299.90,
        quantity: 2
      }
    ]
  }
});

// Clear ecommerce before new push (best practice)
dataLayer.push({ ecommerce: null });
```

### 4. Data Layer Rules
| Regra | Descricao |
|-------|----------|
| Never mutate | Always push new objects, never modify existing |
| Clear ecommerce | `dataLayer.push({ ecommerce: null })` before ecommerce events |
| No PII | Never push email, phone, name (hash first) |
| Event required | Every push should have `event` key |
| Consistent types | Same field = same type always |
| Flat when possible | Avoid deep nesting (max 2 levels) |

## Saida
- Data layer specification document
- Event push examples per category
- E-commerce data layer spec
- Implementation guide for developers

## Validacao
- [ ] Data layer inicializado antes do GTM
- [ ] Page-level data em todas as paginas
- [ ] Event pushes para todos os eventos do tracking plan
- [ ] E-commerce data layer GA4-compliant
- [ ] Nenhum PII no data layer
- [ ] Data layer verificado no GTM Preview
