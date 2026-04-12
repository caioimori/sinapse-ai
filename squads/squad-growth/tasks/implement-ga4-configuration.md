---
task: implement-ga4-configuration
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

# Task: Implement GA4 Configuration

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Configurar GA4 property completa — streams, eventos, conversoes, audiencias, dimensoes customizadas e integracao com BigQuery.

## Entrada
- GA4 property access
- Tracking plan
- Business conversion goals
- Audience definitions

## Passos

### 1. Property Setup
| Configuracao | Valor | Nota |
|-------------|-------|------|
| Property name | `{Project} - Production` | Naming padrao |
| Time zone | America/Sao_Paulo | Localizado |
| Currency | BRL | Para e-commerce |
| Data retention | 14 months | Maximo disponivel |
| Google Signals | Enabled | Demographics, cross-device |
| Enhanced measurement | Selective | Pageviews, scrolls, outbound clicks |
| Reporting identity | Blended | User-ID + Google Signals + Device |

### 2. Data Streams
| Stream | Tipo | Configuracao |
|--------|------|-------------|
| Web | Web stream | Enhanced measurement, cross-domain |
| iOS | iOS stream | Firebase SDK |
| Android | Android stream | Firebase SDK |

### 3. Custom Dimensions & Metrics
| Nome | Scope | Tipo | Exemplo |
|------|-------|------|---------|
| user_type | User | String | prospect, customer, enterprise |
| plan_type | User | String | free, pro, enterprise |
| content_category | Event | String | blog, docs, landing |
| form_name | Event | String | contact, signup, demo |
| experiment_variant | Event | String | control, variant_a, variant_b |
| items_count | Event | Number | 3 |
| time_on_form_sec | Event | Number | 45 |

### 4. Conversions
| Evento | Tipo | Valor |
|--------|------|-------|
| sign_up | Standard | Lead value |
| purchase | Standard | Transaction value |
| form_submit (demo request) | Custom | Lead value |
| trial_start | Custom | Trial value |
| subscription_upgrade | Custom | Upgrade value |

### 5. Audiences
| Audience | Criterio | Uso |
|----------|---------|-----|
| All Users | All visitors | Baseline |
| Purchasers | purchase event | Remarketing |
| Cart Abandoners | add_to_cart BUT NOT purchase (7d) | Recovery |
| High Value | LTV > threshold | Lookalike |
| Engaged Users | session_duration > 3 min | Remarketing |
| Trial Users | trial_start BUT NOT purchase | Nurture |

### 6. BigQuery Export
| Configuracao | Valor |
|-------------|-------|
| Export type | Streaming + Daily |
| Dataset | `analytics_{property_id}` |
| Tables | `events_*`, `events_intraday_*` |
| Cost estimate | ~$X/month based on volume |
| Retention | Per data governance policy |

## Saida
- GA4 property configured
- Custom dimensions/metrics created
- Conversions marked
- Audiences built
- BigQuery export active
- Configuration documentation

## Validacao
- [ ] Property settings corretos (timezone, currency)
- [ ] Data streams configurados
- [ ] Custom dimensions criadas
- [ ] Conversions marcadas
- [ ] Audiences criadas
- [ ] BigQuery export funcional
- [ ] Enhanced measurement configurado seletivamente
