---
task: configure-conversion-tracking
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

# Task: Configure Conversion Tracking

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Configurar conversion tracking — implementar rastreamento preciso de conversoes em GA4 e plataformas de ads para medir ROI de campanhas e alimentar algoritmos de bid optimization.

## Entrada
- Conversion events definition
- GA4 property access
- GTM container access
- Ad platform accounts

## Passos

### 1. Conversion Hierarchy
| Nivel | Tipo | Exemplo | Valor |
|-------|------|---------|-------|
| Macro conversion | Primary business goal | Purchase, Signup, Lead | Revenue ou valor estimado |
| Micro conversion | Step toward macro | Add to cart, Start trial | Proportional value |
| Engagement | Engagement signal | Scroll 75%, Video 50% | Low value |

### 2. Conversion Events Configuration
| Conversao | GA4 Event | Tipo | Counting | Value |
|----------|----------|------|---------|-------|
| Purchase | purchase | Macro | Every | Dynamic (transaction value) |
| Lead form | generate_lead | Macro | Every | R$150 (estimated) |
| Signup | sign_up | Macro | Every | R$50 (estimated) |
| Demo request | demo_request | Macro | Once per user | R$300 (estimated) |
| Add to cart | add_to_cart | Micro | Every | R$30 (estimated) |
| Begin checkout | begin_checkout | Micro | Every | R$80 (estimated) |
| Newsletter | newsletter_signup | Micro | Once per user | R$10 (estimated) |
| File download | file_download | Engagement | Every | R$5 (estimated) |

### 3. GA4 Conversion Setup
```
GA4 Admin > Events > Mark as conversion

Key settings:
- Counting method: Once per event vs Once per session
- Default attribution: Data-driven (recommended)
- Conversion window: 30-day click, 1-day engaged view
- Attribution scope: Cross-channel
```

| Configuracao | Recomendacao | Motivo |
|-------------|-------------|--------|
| Attribution model | Data-driven | Mais preciso, ML-based |
| Reporting window | 90 days | Captura ciclos longos |
| Lookback window | 30 days engaged | Padrao GA4 |
| Counting | Per event (purchase), Per session (lead) | Match business logic |

### 4. Google Ads Conversion Import
| Metodo | Descricao | Precisao |
|--------|----------|---------|
| GA4 import | Import GA4 conversions to Google Ads | Media (link GA4 ↔ Ads) |
| Google Ads tag | Direct tag via GTM | Alta |
| Enhanced conversions | First-party data matching | Muito alta |
| Offline import | Upload offline conversions | Alta (with GCLID) |

**Enhanced Conversions Setup:**
```javascript
// GTM: Enhanced conversion variables
gtag('set', 'user_data', {
  email: hashSHA256(userEmail),
  phone_number: hashSHA256(userPhone),
  address: {
    first_name: userName,
    last_name: userLastName,
    city: userCity,
    region: userState,
    postal_code: userZip,
    country: 'BR'
  }
});
```

### 5. Meta Conversions API (CAPI) Setup
| Parametro | Obrigatorio | Descricao |
|----------|-----------|----------|
| event_name | Sim | Purchase, Lead, etc. |
| event_time | Sim | Unix timestamp |
| action_source | Sim | "website" |
| event_source_url | Sim | Page URL |
| user_data.em | Recomendado | Hashed email |
| user_data.ph | Recomendado | Hashed phone |
| user_data.fbc | Recomendado | Facebook click ID |
| user_data.fbp | Recomendado | Facebook browser ID |
| custom_data.value | Para Purchase | Transaction value |
| custom_data.currency | Para Purchase | "BRL" |

**Deduplication:**
```
event_id: Must be identical between Pixel and CAPI
  → Only one event counted even if both fire
```

### 6. Conversion Value Assignment
| Conversao | Value Type | Calculo |
|----------|-----------|---------|
| Purchase | Dynamic | Transaction revenue (exact) |
| Lead | Static estimated | Historical avg: Lead → Customer × AOV |
| Signup | Static estimated | Signup → Customer rate × AOV |
| Demo | Static estimated | Demo → Close rate × ACV |
| Add to cart | Static estimated | ATC → Purchase rate × AOV |

**Formula for static values:**
```
Conversion Value = Next-Step Conversion Rate × Average Revenue from Next Step

Example:
  Lead → Customer rate: 10%
  Average first purchase: R$500
  Lead value = 0.10 × R$500 = R$50
```

### 7. Conversion Tracking QA
| Teste | Metodo | Esperado |
|-------|--------|---------|
| GA4 event fires | GA4 DebugView | Event appears with correct params |
| Google Ads conversion | Tag Assistant | Conversion tag fires on action |
| Meta Pixel | Meta Pixel Helper | Event fires with correct data |
| CAPI delivery | Meta Events Manager | Server events received |
| Deduplication | Meta Events Manager | Dedup rate > 0% |
| Value accuracy | Compare GA4 vs backend | < 5% discrepancy |
| Enhanced conversions | Google Ads diagnostics | Match rate > 50% |

### 8. Conversion Monitoring
| Metrica | Alert | Acao |
|---------|-------|------|
| Conversion volume drop > 30% day-over-day | Critical | Check tracking immediately |
| Conversion value = 0 | Warning | Verify value parameter |
| Dedup rate = 0% (CAPI) | Warning | Check event_id implementation |
| Match rate < 30% (Enhanced) | Warning | Improve data quality |
| Platform vs GA4 discrepancy > 20% | Warning | Audit attribution settings |

## Saida
- Conversion tracking setup documentation
- GA4 conversion configuration
- Platform-specific implementation (Google Ads, Meta)
- Value assignment methodology
- QA test results
- Monitoring configuration

## Validacao
- [ ] Conversion hierarchy definida (macro/micro)
- [ ] GA4 conversions configuradas
- [ ] Google Ads conversions importadas/taggeadas
- [ ] Meta CAPI implementado com deduplication
- [ ] Enhanced conversions ativo
- [ ] Values atribuidos a cada conversao
- [ ] QA completo com todos testes passing
- [ ] Monitoring alerts configurados
