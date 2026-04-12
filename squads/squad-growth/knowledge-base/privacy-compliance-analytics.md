# Knowledge Base: Privacy & Compliance for Analytics

## Regulatory Landscape

### LGPD (Brazil)
| Aspecto | Requisito |
|---------|----------|
| Scope | All data processing of Brazilian residents |
| Legal bases | Consent, legitimate interest, contract, legal obligation |
| Consent | Must be free, informed, unambiguous, specific |
| Data subject rights | Access, correction, deletion, portability, objection |
| DPO | Required (Encarregado de Dados) |
| Penalties | Up to 2% of revenue (max R$50M per violation) |
| Authority | ANPD (Autoridade Nacional de Protecao de Dados) |

### GDPR (EU)
| Aspecto | Requisito |
|---------|----------|
| Scope | All data processing of EU residents |
| Consent | Prior, explicit, granular, withdrawable |
| Cookie consent | Required before any non-essential cookies |
| Penalties | Up to 4% of global revenue or EUR 20M |
| Extra-territorial | Applies even if company is outside EU |

### Key Differences
| Area | LGPD | GDPR |
|------|------|------|
| Cookie consent | Less strict (legitimate interest possible) | Strict (opt-in required) |
| DPO requirement | Always required | Only in specific cases |
| Penalties | Lower (R$50M cap) | Higher (no cap on %) |
| Cross-border transfer | Allowed with safeguards | Strict adequacy requirements |

## Google Consent Mode v2

### Consent States
| Signal | Controls | Default (no consent) | Granted |
|--------|---------|---------------------|---------|
| ad_storage | Ad cookies (Google Ads, Floodlight) | Denied | Cookies set |
| ad_user_data | User data sent to Google for ads | Denied | Data shared |
| ad_personalization | Personalized advertising | Denied | Ads personalized |
| analytics_storage | Analytics cookies (GA4) | Denied | Full tracking |
| functionality_storage | Essential functionality | Granted | Granted |
| personalization_storage | Personalization (recommendations) | Denied | Personalized |
| security_storage | Security (fraud detection) | Granted | Granted |

### Implementation
```javascript
// Default consent state (before user interaction)
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500  // ms to wait for CMP
});

// After user grants consent
gtag('consent', 'update', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});
```

### Consent Mode v2 Behavior
| Consent State | GA4 Behavior | Google Ads Behavior |
|-------------|-------------|-------------------|
| analytics_storage: denied | Cookieless pings (modeled data) | — |
| ad_storage: denied | — | No conversion cookies, modeled |
| Both granted | Full measurement | Full conversion tracking |

## Consent Management Platform (CMP)

### Requirements
| Requirement | Implementation |
|------------|---------------|
| Banner visibility | Show on first visit, every page |
| Granular choices | Per-category consent (not just accept all) |
| Easy rejection | Reject must be as easy as accept |
| Persistent storage | Remember choice for 6-12 months |
| Re-consent | Allow users to change preferences anytime |
| Documentation | Log consent with timestamp, version, choices |

### CMP Tools
| Tool | Type | LGPD | GDPR | Google CMP Partner |
|------|------|------|------|-------------------|
| Cookiebot | Cloud | Yes | Yes | Yes |
| OneTrust | Enterprise | Yes | Yes | Yes |
| Osano | Cloud | Yes | Yes | Yes |
| Cookie Script | Cloud | Yes | Yes | Yes |
| Custom | Self-built | Configurable | Configurable | Manual integration |

## Data Collection Principles

### Minimization
| Rule | Implementation |
|------|---------------|
| Collect only necessary data | Audit every event parameter |
| No PII in analytics | Never send email, phone, name to GA4 |
| Hash sensitive data | SHA-256 for enhanced conversions |
| IP anonymization | GA4 does this by default |
| Data retention limits | Set GA4 retention to 14 months max |
| Delete on request | Process data deletion requests |

### PII Checklist
| Data | PII? | In GA4? | In Data Layer? |
|------|------|---------|---------------|
| Email address | Yes | NEVER | Hashed only (enhanced conv) |
| Phone number | Yes | NEVER | Hashed only |
| Full name | Yes | NEVER | NEVER |
| IP address | Yes | Auto-anonymized | NEVER raw |
| User ID | Pseudo-PII | Yes (as user_id) | Yes |
| Device ID | Pseudo-PII | Auto-collected | No |
| Credit card | Yes | NEVER | NEVER |
| CPF/SSN | Yes | NEVER | NEVER |

## Server-Side Tracking & Privacy

### Benefits for Privacy
| Benefit | How |
|---------|-----|
| Data control | Filter PII before sending to platforms |
| First-party context | Cookies set from your domain |
| Reduced client exposure | Less JavaScript, less data in browser |
| Consent enforcement | Server validates consent before forwarding |
| Ad blocker resilience | Server-to-server, no browser blocking |

### Architecture
```
User Browser
  → First-party cookie (your domain)
  → GTM Client-side (minimal tags)
  → Your Server (GTM Server-Side)
    → Filter PII
    → Check consent state
    → Forward to GA4 (server-to-server)
    → Forward to Meta CAPI (server-to-server)
    → Forward to Google Ads (server-to-server)
    → Log to Data Warehouse
```

## Audit & Compliance Checklist
| Check | Frequency | Responsible |
|-------|----------|-------------|
| Consent banner functional | Monthly | Analytics team |
| No PII in GA4 | Monthly | Analytics team |
| Data retention settings correct | Quarterly | DPO |
| Data deletion requests processed | As needed | DPO |
| Privacy policy up-to-date | Quarterly | Legal |
| CMP configuration reviewed | Quarterly | Analytics + Legal |
| Server-side PII filtering | Monthly | Engineering |
| Cookie audit (what's set) | Quarterly | Analytics team |
| Third-party script audit | Quarterly | Engineering |
| Consent logs archived | Continuous | CMP |

## LGPD (Lei Geral de Protecao de Dados)

### Key Requirements
- 10 lawful bases (consent, legitimate interest, contract, etc.)
- Data subject rights: access, correction, deletion, portability
- DPO requirement for large-scale processing
- Penalties: up to 2% of revenue (capped at R$50M per violation)

## Consent Mode v2 (Google)

### Overview
- Required for EEA traffic since March 2024
- **Basic mode:** no tags fire without consent, conversion modeling fills gaps
- **Advanced mode:** cookieless pings sent, better modeling accuracy
- **Implementation:** Google Tag Manager consent template

## Server-Side Tracking

### GTM Server-Side
- Runs on cloud (GCP, AWS), first-party context
- **Benefits:** bypasses ad blockers, first-party cookies, data control
- **Setup:** custom domain, cloud container, tag migration

## Data Anonymization

### Techniques
- IP masking (last octet zeroing)
- User ID hashing (SHA-256 with salt)
- k-anonymity (minimum group size of 5)
- Aggregation thresholds for reporting

## Privacy-First Architecture

### Principles
- **Data minimization:** collect only what's needed
- **Purpose limitation:** use data only for stated purpose
- **Cookieless approaches:** fingerprint-free cohorts, server-side enrichment, first-party data strategies
