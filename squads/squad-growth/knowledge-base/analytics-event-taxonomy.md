# Knowledge Base: Analytics Event Taxonomy

## Naming Convention
```
Format: object_action
Case: snake_case
Examples: page_view, button_click, form_submit, purchase_complete
```

### Rules
1. **Object first, action second** — `video_play` not `play_video`
2. **snake_case only** — no camelCase, no hyphens
3. **Past tense for completed actions** — `form_submitted`, `purchase_completed`
4. **Present tense for ongoing** — `video_playing`, `page_scrolling`
5. **Max 40 characters** — concise but descriptive
6. **No PII in event names** — never include user data

## Event Categories

### 1. Lifecycle Events
| Event | Trigger | Parameters |
|-------|---------|-----------|
| session_start | First hit of session | session_id, source, medium |
| first_visit | User's first ever visit | — |
| sign_up | Account creation complete | method (google, email, apple) |
| login | Successful login | method |
| logout | User logs out | — |

### 2. Engagement Events
| Event | Trigger | Parameters |
|-------|---------|-----------|
| page_view | Page loads | page_title, page_location, page_referrer |
| scroll | User scrolls 25/50/75/90% | percent_scrolled |
| click | Any tracked click | element_id, element_class, link_url |
| file_download | File download starts | file_name, file_extension |
| video_start | Video begins playing | video_title, video_provider, video_duration |
| video_progress | Video reaches 25/50/75% | video_title, video_percent |
| video_complete | Video reaches 100% | video_title, video_duration |
| search | Internal site search | search_term, results_count |

### 3. E-commerce Events (GA4 Standard)
| Event | Trigger | Parameters |
|-------|---------|-----------|
| view_item_list | Product list viewed | item_list_id, item_list_name, items[] |
| select_item | Product clicked from list | item_list_id, items[] |
| view_item | Product detail page viewed | items[], currency, value |
| add_to_wishlist | Added to wishlist | items[], currency, value |
| add_to_cart | Added to cart | items[], currency, value |
| remove_from_cart | Removed from cart | items[], currency, value |
| view_cart | Cart page viewed | items[], currency, value |
| begin_checkout | Checkout started | items[], currency, value, coupon |
| add_shipping_info | Shipping info entered | items[], currency, value, shipping_tier |
| add_payment_info | Payment info entered | items[], currency, value, payment_type |
| purchase | Purchase complete | transaction_id, items[], value, currency, tax, shipping, coupon |
| refund | Refund processed | transaction_id, items[], value, currency |

### 4. Lead Generation Events
| Event | Trigger | Parameters |
|-------|---------|-----------|
| generate_lead | Lead form submitted | lead_type, form_name, value, currency |
| form_start | User begins filling form | form_name |
| form_submit | Form successfully submitted | form_name, form_id |
| form_error | Form submission error | form_name, error_type |
| demo_request | Demo requested | demo_type |
| contact_form | Contact form submitted | subject, department |
| newsletter_signup | Newsletter subscription | list_name |

### 5. SaaS/Product Events
| Event | Trigger | Parameters |
|-------|---------|-----------|
| trial_start | Free trial begins | plan_name |
| feature_used | Core feature activated | feature_name, feature_category |
| onboarding_step | Onboarding step completed | step_number, step_name |
| onboarding_complete | Full onboarding done | time_to_complete |
| plan_selected | Pricing plan chosen | plan_name, plan_price, billing_cycle |
| upgrade | Plan upgraded | from_plan, to_plan, value |
| downgrade | Plan downgraded | from_plan, to_plan |
| churn | Subscription cancelled | reason, plan_name, lifetime_days |
| invite_sent | User invited someone | invite_method |
| invite_accepted | Invitee signed up | — |

## Parameter Standards

### Item Object (GA4 E-commerce)
```json
{
  "item_id": "SKU_12345",
  "item_name": "Product Name",
  "affiliation": "Store Name",
  "coupon": "SUMMER_2026",
  "discount": 10.00,
  "index": 0,
  "item_brand": "Brand Name",
  "item_category": "Category L1",
  "item_category2": "Category L2",
  "item_category3": "Category L3",
  "item_list_id": "related_products",
  "item_list_name": "Related Products",
  "item_variant": "Blue / Large",
  "price": 99.90,
  "quantity": 1
}
```

### Custom Dimensions (GA4)
| Dimension | Scope | Example Values |
|-----------|-------|---------------|
| user_type | User | free, trial, paid, enterprise |
| plan_name | User | basic, pro, enterprise |
| account_age_days | User | 30, 90, 365 |
| content_type | Event | blog, video, case_study |
| experiment_id | Event | exp_pricing_v2 |
| experiment_variant | Event | control, variant_a |

### Custom Metrics (GA4)
| Metric | Scope | Type | Example |
|--------|-------|------|---------|
| engagement_score | Event | Number | 0-100 |
| lead_value | Event | Currency | 150.00 |
| nps_score | Event | Number | -100 to 100 |

## Data Layer Standards

### Push Pattern
```javascript
// Always push, never mutate
dataLayer.push({
  event: 'event_name',
  param_1: 'value_1',
  param_2: 'value_2'
});

// For e-commerce, clear previous data
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: 'purchase',
  ecommerce: { /* ... */ }
});
```

### Rules
1. Never directly mutate `dataLayer` — always `.push()`
2. Clear `ecommerce` object before each e-commerce push
3. Never include PII (email, phone, name) in data layer
4. Use consistent data types (string vs number)
5. Include `event` key in every push
6. Timestamp handled automatically by GTM

## Validation Rules
| Rule | Check |
|------|-------|
| Naming format | Matches `^[a-z][a-z0-9_]{2,39}$` |
| Required params | event_name always present |
| PII check | No email/phone/name patterns |
| Value format | Numbers as numbers, not strings |
| Currency format | ISO 4217 (BRL, USD, EUR) |
| Item array | Non-empty for e-commerce events |
