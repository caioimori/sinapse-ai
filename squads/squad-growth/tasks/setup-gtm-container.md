---
task: setup-gtm-container
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

# Task: Setup GTM Container

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Configurar container GTM — tags, triggers, variables, folders organizados e versionados para gerenciamento centralizado de tracking.

## Entrada
- Tracking plan
- GA4 property configuration
- Third-party tracking requirements
- Consent management requirements

## Passos

### 1. Container Organization
| Folder | Conteudo |
|--------|---------|
| 01 - GA4 | GA4 config tag + event tags |
| 02 - Conversions | Conversion tracking tags |
| 03 - Marketing | Meta Pixel, Google Ads, LinkedIn |
| 04 - Analytics | Hotjar, Clarity, Amplitude |
| 05 - Consent | Consent mode tags |
| 06 - Utilities | Custom HTML, data layer pushes |

### 2. Essential Tags
| Tag | Tipo | Trigger | Consent |
|-----|------|---------|---------|
| GA4 Configuration | GA4 Config | All Pages | analytics_storage |
| GA4 - page_view | GA4 Event | Page View | analytics_storage |
| GA4 - Custom Events | GA4 Event | Custom triggers | analytics_storage |
| Meta Pixel - Base | Custom HTML | All Pages | ad_storage |
| Meta Pixel - Events | Custom HTML | Conversion triggers | ad_storage |
| Google Ads - Conversion | Google Ads | Purchase | ad_storage |
| Hotjar | Custom HTML | All Pages | analytics_storage |

### 3. Trigger Naming Convention
| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Page View | PV - {description} | PV - All Pages |
| Click | CL - {element} | CL - CTA Button |
| Form | FM - {form_name} | FM - Contact Submit |
| Timer | TM - {duration} | TM - 30 Seconds |
| Custom Event | CE - {event_name} | CE - sign_up |
| Scroll | SC - {percentage} | SC - 50 Percent |
| History Change | HC - {description} | HC - SPA Navigation |

### 4. Variable Naming Convention
| Tipo | Prefixo | Exemplo |
|------|---------|---------|
| Data Layer | DLV - | DLV - user_id |
| DOM Element | DOM - | DOM - page_title |
| JavaScript | JS - | JS - timestamp |
| Constant | CONST - | CONST - GA4_ID |
| Lookup Table | LUT - | LUT - page_category |
| RegEx Table | RGX - | RGX - content_group |
| Cookie | CK - | CK - utm_source |

### 5. Consent Mode Configuration
```javascript
// Default consent state (before user interaction)
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'functionality_storage': 'granted',
  'security_storage': 'granted',
  'wait_for_update': 500
});

// After user grants consent
gtag('consent', 'update', {
  'analytics_storage': 'granted',
  'ad_storage': 'granted'
});
```

### 6. Version Control
| Pratica | Descricao |
|---------|----------|
| Version naming | `v{N} - {description} - {date}` |
| Workspace | Use workspaces for parallel work |
| Preview | Always preview before publish |
| Notes | Document changes in version notes |
| Rollback plan | Keep previous 3 versions as rollback |

## Saida
- GTM container configured
- Tags, triggers, variables organized
- Consent mode integrated
- Naming convention documented
- Version control process

## Validacao
- [ ] Container organizado por folders
- [ ] Tags com naming convention
- [ ] Triggers corretos por tipo
- [ ] Variables com prefixos padrao
- [ ] Consent mode configurado
- [ ] Preview testado
- [ ] Container publicado e versionado
