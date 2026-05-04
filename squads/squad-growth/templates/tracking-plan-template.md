# Template: Tracking Plan

## Document Metadata
| Field | Value |
|-------|-------|
| Project | |
| Version | 1.0 |
| Author | |
| Date | YYYY-MM-DD |
| Status | Draft / In Review / Approved / Implemented |
| Analytics Platform | GA4 |
| Tag Manager | GTM Web + Server |

## Event Inventory

### Lifecycle Events
| Event Name | Trigger | Parameters | Type | Priority |
|-----------|---------|-----------|------|----------|
| session_start | Auto (GA4) | session_id | Auto | — |
| first_visit | Auto (GA4) | — | Auto | — |
| sign_up | Account creation | method, plan_name | Recommended | P0 |
| login | Successful login | method | Recommended | P1 |

### Engagement Events
| Event Name | Trigger | Parameters | Type | Priority |
|-----------|---------|-----------|------|----------|
| page_view | Page load | page_title, page_location | Enhanced | — |
| scroll | Scroll 90% | percent_scrolled | Enhanced | — |
| click | Tracked element click | element_id, link_url | Custom | P1 |
| search | Site search | search_term, results_count | Enhanced | — |
| file_download | Download click | file_name, file_extension | Enhanced | — |

### Conversion Events
| Event Name | Trigger | Parameters | Type | Priority | Conversion? |
|-----------|---------|-----------|------|----------|------------|
| generate_lead | Lead form submit | lead_type, form_name, value | Custom | P0 | Yes |
| purchase | Order complete | transaction_id, value, currency, items[] | Recommended | P0 | Yes |
| begin_checkout | Checkout start | value, currency, items[] | Recommended | P0 | No |
| add_to_cart | Add to cart | value, currency, items[] | Recommended | P1 | No |

### Custom Events
| Event Name | Trigger | Parameters | Type | Priority | Conversion? |
|-----------|---------|-----------|------|----------|------------|
| | | | Custom | P0/P1/P2 | Yes/No |

## Parameter Specifications

### Event Parameters
| Parameter | Type | Required | Description | Example Values |
|-----------|------|---------|-----------|---------------|
| method | string | Yes (sign_up, login) | Auth method | google, email, apple |
| form_name | string | Yes (generate_lead) | Form identifier | contact_hero, demo_sidebar |
| lead_type | string | Yes (generate_lead) | Type of lead | demo, contact, download |
| value | number | Yes (purchase) | Monetary value | 299.90 |
| currency | string | Yes (with value) | ISO 4217 | BRL |
| transaction_id | string | Yes (purchase) | Unique order ID | ORD-2026-12345 |

### User Properties (Custom Dimensions)
| Property | Scope | Type | Description | Example |
|----------|-------|------|-----------|---------|
| user_type | User | string | Account type | free, trial, paid |
| plan_name | User | string | Current plan | basic, pro, enterprise |
| account_created_date | User | string | Registration date | 2026-01-15 |
| company_size | User | string | Company size bucket | 1-10, 11-50, 51-200 |

### Items Array (E-commerce)
| Field | Type | Required | Description |
|-------|------|---------|-----------|
| item_id | string | Yes | Product SKU |
| item_name | string | Yes | Product name |
| item_brand | string | No | Brand name |
| item_category | string | No | Category L1 |
| item_category2 | string | No | Category L2 |
| item_variant | string | No | Variant (size, color) |
| price | number | Yes | Unit price |
| quantity | number | Yes | Quantity |
| coupon | string | No | Applied coupon code |
| discount | number | No | Discount amount |

## Data Layer Specifications

### Page Data (every page)
```javascript
dataLayer.push({
  event: 'page_data_ready',
  page: {
    type: '',           // home, product, category, blog, checkout
    category: '',       // section category
    title: ''           // page title
  },
  user: {
    id: '',             // user ID or null
    type: '',           // anonymous, free, trial, paid
    logged_in: false    // boolean
  }
});
```

### E-commerce Events
```javascript
// Purchase
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: '',
    value: 0,
    currency: 'BRL',
    tax: 0,
    shipping: 0,
    coupon: '',
    items: [{ /* item object */ }]
  }
});
```

## GTM Configuration

### Tags
| Tag Name | Type | Trigger | Platform |
|----------|------|---------|----------|
| GA4 - Config | GA4 Configuration | All Pages | GA4 |
| GA4 - Event - purchase | GA4 Event | CE - purchase | GA4 |
| Meta - Pixel - PageView | Meta Pixel | All Pages | Meta |

### Triggers
| Trigger Name | Type | Conditions |
|-------------|------|-----------|
| All Pages | Page View | — |
| CE - purchase | Custom Event | event = purchase |
| CE - generate_lead | Custom Event | event = generate_lead |

### Variables
| Variable Name | Type | Value |
|-------------|------|-------|
| DLV - ecommerce.transaction_id | Data Layer | ecommerce.transaction_id |
| DLV - ecommerce.value | Data Layer | ecommerce.value |
| DLV - user.id | Data Layer | user.id |

## QA Plan
| Test | Method | Pass Criteria |
|------|--------|-------------|
| All events fire | GA4 DebugView | Events visible with correct params |
| Parameters correct | GTM Preview | Values match expected |
| No PII | Manual review | Zero PII in events |
| Conversions tracked | GA4 Real-time | Conversions counting |
| Cross-domain | Multi-domain test | Session persists |

## Approvals
| Role | Name | Date | Status |
|------|------|------|--------|
| Analytics Engineer | | | |
| Developer | | | |
| Product Owner | | | |
