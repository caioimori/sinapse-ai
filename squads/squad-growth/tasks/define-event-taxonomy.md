---
task: define-event-taxonomy
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

# Task: Define Event Taxonomy

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Complex

## Objetivo
Definir taxonomia de eventos completa — naming conventions, event schema, categorias e hierarquia para garantir consistencia e usabilidade dos dados.

## Entrada
- User journeys and flows
- Business KPIs
- AARRR funnel mapping
- Product feature inventory

## Passos

### 1. Naming Convention
| Regra | Padrao | Exemplo |
|-------|--------|---------|
| Format | snake_case | `button_click` |
| Structure | object_action | `form_submit`, `video_play` |
| Max length | 40 chars | Descritivo mas conciso |
| Prefix (optional) | category_ | `ecommerce_purchase` |
| No spaces | _ separator | `sign_up` nao `sign up` |
| No special chars | alphanumeric + _ | Nenhum #, @, - |

### 2. Event Categories
| Categoria | Eventos Tipicos | Prioridade |
|-----------|----------------|-----------|
| Navigation | page_view, screen_view, tab_change | P0 |
| Engagement | scroll, click, hover, focus | P1 |
| Forms | form_start, field_fill, form_submit, form_error | P0 |
| Authentication | sign_up, login, logout, password_reset | P0 |
| E-commerce | add_to_cart, begin_checkout, purchase, refund | P0 |
| Content | content_view, content_share, content_save | P1 |
| Search | search, search_results, search_click | P1 |
| Media | video_play, video_pause, video_complete | P2 |
| Social | share, like, comment, follow | P2 |
| System | error, notification_receive, permission_grant | P1 |

### 3. Event Schema Standard
```json
{
  "event_name": "form_submit",
  "event_category": "forms",
  "event_params": {
    "form_name": "contact_form",
    "form_id": "contact-main",
    "form_location": "homepage_bottom",
    "fields_filled": 5,
    "time_to_complete_ms": 45000,
    "has_errors": false
  },
  "user_properties": {
    "user_id": "hashed_id",
    "user_type": "prospect",
    "account_age_days": 0
  },
  "context": {
    "page_path": "/contact",
    "page_title": "Contact Us",
    "referrer": "https://google.com",
    "device_category": "mobile",
    "session_id": "abc123"
  }
}
```

### 4. Parameter Standards
| Tipo | Convencao | Exemplo |
|------|----------|---------|
| Strings | snake_case, lowercase | `form_name: "contact_form"` |
| Booleans | is_ ou has_ prefix | `is_logged_in: true` |
| Numbers | No prefix, numeric | `items_count: 3` |
| Currency | ISO + value | `currency: "BRL", value: 99.90` |
| IDs | hashed, never PII | `user_id: "sha256_hash"` |
| Timestamps | ISO 8601 | `event_time: "2026-03-12T10:30:00Z"` |
| Lists | _list suffix | `categories_list: ["shoes", "running"]` |

### 5. GA4 Event Mapping
| Custom Event | GA4 Recommended? | Notes |
|-------------|-----------------|-------|
| page_view | Yes (automatic) | Enhanced with custom params |
| sign_up | Yes (recommended) | Add method param |
| login | Yes (recommended) | Add method param |
| purchase | Yes (recommended) | Required e-commerce params |
| add_to_cart | Yes (recommended) | Items array required |
| search | Yes (recommended) | search_term param |
| share | Yes (recommended) | method, content_type params |
| Custom events | No | Follow naming convention |

## Saida
- Event taxonomy document
- Naming convention guide
- Event schema with examples
- GA4 event mapping
- Parameter standards reference

## Validacao
- [ ] Naming convention definida e documentada
- [ ] Todas as categorias de eventos cobertos
- [ ] Event schema com exemplos por categoria
- [ ] GA4 recommended events mapeados
- [ ] Parameter standards sem PII
- [ ] Taxonomia revisada por stakeholders
