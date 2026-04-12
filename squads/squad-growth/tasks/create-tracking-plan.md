---
task: create-tracking-plan
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

# Task: Create Tracking Plan

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Complex

## Objetivo
Criar tracking plan completo — documento de referencia que mapeia cada evento, seus parametros, triggers, destinations e responsaveis de implementacao.

## Entrada
- Event taxonomy
- User journeys
- Product features
- Analytics requirements

## Passos

### 1. Tracking Plan Structure
| Coluna | Descricao |
|--------|----------|
| Event Name | Nome do evento (snake_case) |
| Category | Categoria do evento |
| Trigger | O que dispara o evento |
| Parameters | Parametros enviados |
| Platform | Web, iOS, Android, All |
| Destination | GA4, Segment, Amplitude, etc. |
| Priority | P0 (critical) → P3 (nice-to-have) |
| Owner | Time responsavel pela implementacao |
| Status | Not started, In progress, QA, Live |

### 2. Tracking Plan Template
| Event | Category | Trigger | Parameters | Platform | Dest | Priority | Status |
|-------|----------|---------|-----------|----------|------|---------|--------|
| page_view | navigation | Page load | page_path, page_title, referrer | All | GA4 | P0 | |
| sign_up | auth | Registration complete | method, source | All | GA4, Segment | P0 | |
| login | auth | Login success | method | All | GA4 | P0 | |
| button_click | engagement | CTA click | button_text, button_location, destination_url | All | GA4 | P1 | |
| form_submit | forms | Form submission | form_name, form_id, fields_count | Web | GA4 | P0 | |
| purchase | ecommerce | Transaction complete | transaction_id, value, currency, items | All | GA4, Segment | P0 | |
| search | engagement | Search executed | search_term, results_count | All | GA4 | P1 | |
| error | system | Error occurs | error_type, error_message, page_path | All | GA4, Sentry | P1 | |

### 3. Parameter Specification per Event
```yaml
events:
  - name: purchase
    category: ecommerce
    trigger: "Order confirmation page loaded"
    parameters:
      required:
        - name: transaction_id
          type: string
          description: "Unique transaction identifier"
          example: "TXN-2026-001"
        - name: value
          type: number
          description: "Total transaction value"
          example: 199.90
        - name: currency
          type: string
          description: "ISO 4217 currency code"
          example: "BRL"
        - name: items
          type: array
          description: "Array of purchased items"
      optional:
        - name: coupon
          type: string
          description: "Coupon code used"
        - name: payment_method
          type: string
          description: "Payment method"
          enum: ["credit_card", "pix", "boleto"]
    destinations: [GA4, Segment, BigQuery]
    platform: All
    priority: P0
```

### 4. Implementation Handoff
| Step | Responsavel | Deliverable |
|------|-----------|------------|
| 1. Spec approval | Signal + Stakeholders | Approved tracking plan |
| 2. Data layer spec | Signal | dataLayer push specifications |
| 3. Frontend implementation | squad-design | Events firing in code |
| 4. GTM configuration | Signal | Tags, triggers, variables |
| 5. QA verification | Signal | Tracking accuracy report |
| 6. Go-live | Signal | Production deployment |

## Saida
- Complete tracking plan spreadsheet/document
- Parameter specifications per event
- Implementation handoff guide
- QA test cases

## Validacao
- [ ] Todos os user flows cobertos com eventos
- [ ] Parametros especificados com tipos e exemplos
- [ ] Prioridades P0-P3 atribuidas
- [ ] Destinations definidos por evento
- [ ] Implementation handoff claro
- [ ] QA test cases para cada evento critico
