---
task: implement-server-side-tracking
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

# Task: Implement Server-Side Tracking

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Complex

## Objetivo
Implementar server-side tracking — configurar GTM Server-Side, Conversion APIs e event forwarding para dados mais precisos e resilientes a ad blockers.

## Entrada
- Tracking plan (critical events)
- GA4 configuration
- Ad platform requirements (Meta CAPI, Google Ads)
- Infrastructure access

## Passos

### 1. Server-Side vs Client-Side Decision
| Criterio | Client-Side | Server-Side |
|----------|------------|-------------|
| Accuracy | 70-85% (ad blockers) | 95-99% |
| PII control | Limited | Full control |
| Cookie duration | 7d (ITP Safari) | 1st party, longer |
| Performance | JS on main thread | Zero client impact |
| Cost | Free (GTM) | Server hosting costs |
| Complexity | Low | Medium-High |
| Ad blockers | Blocked ~30% | Not blocked |

**Regra:** Server-side para eventos criticos (purchase, sign_up, lead). Client-side para engagement events.

### 2. Server GTM Architecture
```yaml
architecture:
  client_side:
    gtm_web: "Sends events to server container"
    data_layer: "Pushes events with parameters"

  server_side:
    gtm_server:
      url: "https://sgtm.yourdomain.com"
      deployment: "Cloud Run / App Engine"
      clients:
        - GA4 client
        - Measurement Protocol client
      tags:
        - GA4 (forward to GA4)
        - Meta Conversion API
        - Google Ads Conversion
        - BigQuery (raw events)
      transformations:
        - PII removal
        - Event enrichment
        - Parameter mapping
```

### 3. Meta Conversion API (CAPI)
| Parametro | Source | Obrigatorio |
|-----------|--------|------------|
| event_name | Data layer | Sim |
| event_time | Server timestamp | Sim |
| action_source | "website" | Sim |
| event_source_url | Request URL | Sim |
| user_data.em | Hashed email | Recommended |
| user_data.ph | Hashed phone | Recommended |
| user_data.fn | Hashed first name | Optional |
| user_data.fbc | Facebook click ID | Recommended |
| user_data.fbp | Facebook browser ID | Recommended |
| custom_data.value | Transaction value | For purchase |
| custom_data.currency | ISO currency | For purchase |

### 4. Event Deduplication
| Metodo | Como | Quando |
|--------|------|--------|
| Event ID | Unique ID per event (client + server) | Always |
| Time window | Server ignores duplicates within 48h | Default |
| Client hint | `event_id` parameter in both paths | Best practice |

```javascript
// Client-side: generate unique event ID
const eventId = crypto.randomUUID();

dataLayer.push({
  event: 'purchase',
  event_id: eventId,  // Same ID sent to server
  transaction_id: 'TXN-001',
  value: 199.90
});
```

### 5. First-Party Data Strategy
| Tipo | Implementacao | Duracao |
|------|-------------|---------|
| 1st party cookies | Set via server (sgtm subdomain) | 1-2 years |
| Server-set cookies | HTTP-only, Secure, SameSite | Browser max |
| User ID | Authenticated user mapping | Session+ |
| Consent token | Server-managed consent state | Per policy |

### 6. Monitoring
| Metrica | Target | Alerta |
|---------|--------|--------|
| Server uptime | 99.9% | < 99% |
| Event processing latency | < 500ms | > 2s |
| Error rate | < 0.1% | > 1% |
| Event dedup rate | < 5% | > 10% |
| Ad platform match rate | > 90% | < 80% |

## Saida
- Server GTM container configured
- Conversion APIs integrated (Meta, Google)
- Deduplication implemented
- First-party data strategy
- Monitoring setup

## Validacao
- [ ] Server GTM deployed e funcional
- [ ] Meta CAPI integrada
- [ ] Google Ads server conversion funcional
- [ ] Deduplication ativa (event_id)
- [ ] First-party cookies configurados
- [ ] PII removido antes de forwarding
- [ ] Monitoring com alertas ativos
