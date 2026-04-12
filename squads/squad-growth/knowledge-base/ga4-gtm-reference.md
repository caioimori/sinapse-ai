# Knowledge Base: GA4 & GTM Reference

## GA4 Architecture

### Data Model
```
User → Session → Event → Parameter

Every interaction is an EVENT with key-value PARAMETERS.
No more pageviews/sessions as primary unit — everything is event-based.
```

### Key Differences from Universal Analytics
| Aspect | Universal Analytics | GA4 |
|--------|-------------------|-----|
| Data model | Session-based | Event-based |
| Hits | Pageview, Event, Transaction | Everything is an event |
| Bounce rate | Single-page sessions | Replaced by engagement rate |
| Goals | Goal completions | Conversion events |
| Views | Multiple views per property | Data streams |
| Segments | Applied to reports | Explorations + audiences |
| Attribution | Last click (default) | Data-driven (default) |
| Data retention | Unlimited | 2 or 14 months |
| BigQuery | 360 only | Free export |

### GA4 Event Types
| Type | Description | Examples |
|------|-----------|---------|
| Automatically collected | No config needed | session_start, first_visit, page_view |
| Enhanced measurement | Toggle in admin | scroll, outbound_click, file_download, video_start |
| Recommended | Follow Google naming | login, sign_up, purchase, add_to_cart |
| Custom | Your own events | demo_request, feature_used, onboarding_step |

### GA4 Configuration Checklist
| Setting | Recommendation |
|---------|---------------|
| Data stream | Web + App (if applicable) |
| Enhanced measurement | Enable all relevant |
| Data retention | 14 months |
| Google Signals | Enable (for demographics/cross-device) |
| BigQuery export | Enable (free, daily/streaming) |
| Conversions | Mark key events as conversions |
| Custom dimensions | Register user/event scoped |
| Custom metrics | Register calculated metrics |
| Audiences | Build for remarketing + analysis |
| Attribution | Data-driven, 90-day lookback |
| User ID | Implement for cross-device |
| Consent mode | Configure with CMP |

## GTM Architecture

### Container Types
| Type | Use | Tags |
|------|-----|------|
| Web | Browser-side tracking | GA4, Meta Pixel, Google Ads, etc. |
| Server | Server-side processing | GA4 (server), CAPI, custom APIs |
| iOS | Mobile app (iOS) | Firebase, AppsFlyer |
| Android | Mobile app (Android) | Firebase, Adjust |
| AMP | AMP pages | GA4 for AMP |

### GTM Components
| Component | Purpose | Examples |
|-----------|---------|---------|
| Tags | Code to execute | GA4 event, Meta Pixel, Google Ads tag |
| Triggers | When to fire tags | Page View, Click, Form Submit, Custom Event |
| Variables | Dynamic values | Data Layer variable, URL, Cookie, DOM Element |
| Folders | Organization | By platform, by function |
| Templates | Reusable tag configs | Community gallery templates |

### Naming Convention
```
Tags:    [Platform] - [Type] - [Detail]
         GA4 - Event - purchase
         Meta - Pixel - PageView
         GAds - Conversion - Lead

Triggers: [Type] - [Detail]
          Click - CTA Button
          Form - Contact Submit
          Custom - dataLayer purchase

Variables: [Type] - [Name]
           DLV - transaction_id
           URL - page_path
           Cookie - _ga
```

### GTM Folder Structure
```
GTM Container
├── 01 - GA4
│   ├── GA4 - Config - All Pages
│   ├── GA4 - Event - purchase
│   └── GA4 - Event - generate_lead
├── 02 - Google Ads
│   ├── GAds - Conversion - Purchase
│   └── GAds - Remarketing - All Pages
├── 03 - Meta
│   ├── Meta - Pixel - PageView
│   └── Meta - Pixel - Purchase
├── 04 - Consent
│   ├── Consent - Default State
│   └── Consent - Update
└── 05 - Utilities
    ├── Data Layer - Push Helper
    └── Error - Tracking
```

## Data Layer Reference

### Standard Pushes
```javascript
// Page context (on every page)
dataLayer.push({
  event: 'page_data_ready',
  page: {
    type: 'product',       // home, category, product, cart, checkout, thankyou
    category: 'Electronics',
    title: document.title
  },
  user: {
    id: 'USR_12345',       // null if not logged in
    type: 'paid',          // anonymous, free, trial, paid
    login_status: true
  }
});

// E-commerce: Product view
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: 'view_item',
  ecommerce: {
    currency: 'BRL',
    value: 299.90,
    items: [{
      item_id: 'SKU_001',
      item_name: 'Product Name',
      item_brand: 'Brand',
      item_category: 'Category',
      price: 299.90,
      quantity: 1
    }]
  }
});
```

### GTM Preview & Debug
| Tool | Purpose |
|------|---------|
| GTM Preview Mode | Test tags before publishing |
| GA4 DebugView | Real-time event validation |
| Tag Assistant | Chrome extension for tag audit |
| Meta Pixel Helper | Chrome extension for Meta events |
| dataLayer Inspector | Chrome extension for DL inspection |

## BigQuery Export (GA4)

### Schema Overview
```sql
-- GA4 BigQuery table structure
SELECT
  event_date,
  event_timestamp,
  event_name,
  event_params,           -- RECORD (key-value pairs)
  user_pseudo_id,         -- Client ID
  user_id,                -- Your user ID (if set)
  user_properties,        -- RECORD
  device.category,        -- mobile, desktop, tablet
  device.operating_system,
  geo.country,
  geo.city,
  traffic_source.source,
  traffic_source.medium,
  traffic_source.name,    -- campaign
  ecommerce.*             -- E-commerce fields
FROM `project.analytics_PROPERTY_ID.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260331'
```

### Extracting Event Parameters
```sql
-- Extract specific parameter from event_params RECORD
SELECT
  event_date,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params)
   WHERE key = 'page_title') AS page_title,
  (SELECT value.int_value FROM UNNEST(event_params)
   WHERE key = 'engagement_time_msec') AS engagement_time,
  (SELECT value.double_value FROM UNNEST(event_params)
   WHERE key = 'value') AS event_value
FROM `project.analytics_PROPERTY_ID.events_*`
WHERE event_name = 'purchase'
```

## Common GA4 Explorations
| Exploration | Use Case |
|------------|---------|
| Free-form | Custom reports with dimensions + metrics |
| Funnel | Conversion funnel analysis |
| Path | User journey analysis |
| Segment overlap | Compare audience segments |
| Cohort | Retention by acquisition cohort |
| User lifetime | LTV and engagement over time |
