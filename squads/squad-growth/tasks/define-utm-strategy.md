---
task: define-utm-strategy
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

# Task: Define UTM Strategy

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Definir estrategia de UTM — criar taxonomia padronizada de UTM parameters para garantir atribuicao precisa de trafego, consistencia entre canais e confiabilidade dos dados de campanha.

## Entrada
- Marketing channels in use
- Campaign naming conventions (current)
- Analytics platform (GA4)
- Team structure (who creates campaigns)

## Passos

### 1. UTM Parameters Reference
| Parametro | Obrigatorio | Descricao | Exemplo |
|----------|-----------|----------|---------|
| utm_source | Sim | Plataforma/site de origem | google, facebook, newsletter |
| utm_medium | Sim | Tipo de canal/trafego | cpc, social, email, referral |
| utm_campaign | Sim | Nome da campanha especifica | black-friday-2026, product-launch |
| utm_term | Nao | Keyword (paid search) | running-shoes, crm-software |
| utm_content | Nao | Variante/creative | hero-banner-v2, cta-red |

### 2. Naming Convention Standards
| Regra | Padrao | Exemplo |
|-------|--------|---------|
| Case | Sempre lowercase | `google` nao `Google` |
| Separador | Hifens entre palavras | `black-friday` nao `black_friday` |
| Espacos | Nunca usar espacos | `email-newsletter` nao `email newsletter` |
| Acentos | Nunca usar acentos | `promocao` nao `promoção` |
| Abreviacoes | Usar lista padronizada | `fb` para Facebook, `gg` para Google |
| Datas | YYYYMM quando relevante | `202611` para Nov 2026 |
| Idioma | Ingles para parametros | Consistencia global |

### 3. UTM Taxonomy
**utm_source (padronizado):**
| Valor | Plataforma |
|-------|-----------|
| google | Google (all products) |
| facebook | Facebook (Meta) |
| instagram | Instagram |
| linkedin | LinkedIn |
| twitter | X (Twitter) |
| youtube | YouTube |
| tiktok | TikTok |
| newsletter | Email newsletter |
| partner-{name} | Partner referral |
| direct-mail | Direct mail |

**utm_medium (padronizado):**
| Valor | Tipo de Trafego | GA4 Channel Group |
|-------|----------------|------------------|
| cpc | Paid search | Paid Search |
| paid-social | Paid social | Paid Social |
| display | Display advertising | Display |
| video | Video advertising | Video |
| email | Email marketing | Email |
| organic-social | Organic social posts | Organic Social |
| referral | Partner/affiliate | Referral |
| affiliate | Affiliate program | Affiliates |
| sms | SMS marketing | SMS |
| push | Push notifications | Push |

**utm_campaign (formato):**
```
{objective}-{audience}-{offer}-{date}

Exemplos:
- awareness-prospecting-brand-202603
- conversion-retargeting-30off-202611
- retention-existing-loyalty-202604
- launch-all-newproduct-202607
```

### 4. UTM Builder Template
| Campo | Valor | Notas |
|-------|-------|-------|
| Base URL | https://example.com/page | Sem trailing slash |
| utm_source | | Da lista padronizada |
| utm_medium | | Da lista padronizada |
| utm_campaign | | Formato: obj-audience-offer-date |
| utm_term | | Opcional: keyword |
| utm_content | | Opcional: creative variant |
| **URL Final** | | Auto-gerada |

### 5. Common Mistakes & Prevention
| Erro | Problema | Prevencao |
|------|---------|----------|
| Inconsistent casing | google vs Google vs GOOGLE | Enforce lowercase |
| Missing parameters | Trafego cai em (direct)/(none) | UTM builder obrigatorio |
| Duplicate naming | Mesma campanha com nomes diferentes | Central naming doc |
| Internal links com UTM | Sobrescreve source original | Nunca usar UTM em links internos |
| UTM em links organicos | Perde organic attribution | UTM apenas para paid/owned |
| Spaces in values | Broken URLs | URL encode ou hifens |

### 6. UTM Governance Process
| Acao | Responsavel | Ferramenta |
|------|-----------|-----------|
| Create UTM | Marketing team | UTM Builder (sheet/tool) |
| Validate UTM | Campaign manager | Automated validation |
| Central registry | Analytics team | Shared spreadsheet/database |
| Audit monthly | Analytics team | GA4 source/medium report |
| Training | Analytics team | Quarterly session |

### 7. GA4 Channel Group Mapping
| Default Channel Group | utm_source + utm_medium Rules |
|----------------------|------------------------------|
| Organic Search | source matches search engine, medium = organic |
| Paid Search | medium matches `^(cpc|ppc|paid.search)$` |
| Paid Social | medium matches `^(paid.social|paidsocial)$` |
| Email | medium = email |
| Display | medium = display |
| Affiliates | medium = affiliate |
| Direct | source = (direct), medium = (none) |

*Custom channel groups podem ser criados em GA4 Admin > Channel Groups.*

### 8. UTM Audit Checklist
| Check | Metodo | Frequencia |
|-------|--------|-----------|
| Unknown sources | GA4: source/medium = (not set) | Weekly |
| Inconsistent naming | GA4: source report, check variants | Monthly |
| Missing campaigns | Active campaigns without UTM data | Monthly |
| Internal UTM usage | Check for UTM on same-domain links | Monthly |
| Channel group accuracy | GA4 default vs expected grouping | Monthly |

## Saida
- UTM naming convention document
- UTM taxonomy (source, medium, campaign values)
- UTM builder tool/template
- Governance process
- Audit checklist

## Validacao
- [ ] 5 UTM parameters documentados com exemplos
- [ ] Naming conventions padronizadas
- [ ] Taxonomia de source/medium completa
- [ ] Campaign naming format definido
- [ ] UTM builder disponivel para equipe
- [ ] Governance process estabelecido
- [ ] GA4 channel groups alinhados
