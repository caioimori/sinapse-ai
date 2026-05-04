---
task: implement-consent-management
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

# Task: Implement Consent Management

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Implementar consent management — integrar plataforma de consentimento com GTM, GA4 e tags de terceiros para compliance com LGPD/GDPR.

## Entrada
- Privacy policy
- LGPD/GDPR requirements
- Tag inventory (all tracking tags)
- Consent platform selection

## Passos

### 1. Consent Categories
| Categoria | Descricao | Default | Includes |
|-----------|----------|---------|---------|
| Necessary | Funcionalidade essencial | Granted | Session, security, preferences |
| Analytics | Medicao e analise | Denied | GA4, Hotjar, Amplitude |
| Marketing | Publicidade e retargeting | Denied | Meta Pixel, Google Ads, LinkedIn |
| Personalization | Conteudo personalizado | Denied | A/B testing, recommendations |

### 2. Google Consent Mode v2
```javascript
// Default state (before user interaction)
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});

// After user accepts analytics + marketing
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted'
});
```

### 3. GTM Consent Integration
| Tag | Required Consent | Behavior sem Consent |
|-----|-----------------|---------------------|
| GA4 Config | analytics_storage | Cookieless pings (modeling) |
| GA4 Events | analytics_storage | Queued, sent after consent |
| Meta Pixel | ad_storage | Not fired |
| Google Ads | ad_storage + ad_user_data | Not fired |
| Hotjar | analytics_storage | Not loaded |
| A/B Testing | personalization_storage | Default variant only |

### 4. Consent Banner Requirements
| Requisito | LGPD | GDPR |
|-----------|------|------|
| Clear purpose description | Sim | Sim |
| Granular choices | Sim | Sim |
| Easy reject (same prominence) | Sim | Sim |
| Pre-checked boxes | Nao | Nao |
| Cookie wall | Nao | Nao |
| Withdraw consent | Sim (facil) | Sim (facil) |
| Record consent | Sim | Sim |
| Re-consent period | 12 months | 12 months |

### 5. Implementation Checklist
| Step | Status |
|------|--------|
| Consent platform configured | |
| Categories defined and mapped | |
| Consent Mode v2 default state | |
| GTM tags with consent requirements | |
| Banner UI meets legal requirements | |
| Consent recorded and auditable | |
| Withdraw mechanism functional | |
| Server-side consent synchronization | |
| Cookie scan complete | |
| Legal review approved | |

## Saida
- Consent management configuration
- GTM consent integration
- Consent Mode v2 implementation
- Banner configuration
- Compliance documentation

## Validacao
- [ ] Consent Mode v2 implementado
- [ ] Todas as tags com consent requirements
- [ ] Banner com opcoes granulares
- [ ] Reject tao facil quanto accept
- [ ] Consent recorded e auditavel
- [ ] Withdraw funcional
- [ ] Legal review aprovado
