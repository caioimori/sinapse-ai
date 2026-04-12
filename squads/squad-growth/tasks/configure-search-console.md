---
task: configure-search-console
responsavel: "@ga-seo-strategist"
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

# Task: Configure Search Console

## Metadata
- **Squad:** squad-growth
- **Agent:** Rank (ga-seo-strategist)
- **Complexity:** Standard

## Objetivo
Configurar Google Search Console — setup completo, verificacao de propriedade, submissao de sitemap e configuracao de monitoramento.

## Entrada
- Domain/property URL
- DNS access or site access
- Sitemap URL
- Team access requirements

## Passos

### 1. Property Setup
| Item | Configuracao |
|------|-------------|
| Property type | Domain property (covers all subdomains) |
| Verification | DNS TXT record (most robust) |
| Users | Team members with appropriate access levels |
| Associated properties | GA4 linked |

### 2. Essential Configurations
| Configuracao | Acao |
|-------------|------|
| Submit sitemap | sitemap.xml submitted |
| Request indexing | Key pages submitted for indexing |
| URL parameters | Configure if needed |
| International targeting | Country/language if applicable |
| Removals | None (unless needed) |

### 3. Monitoring Dashboard
| Metrica | Verificacao | Frequencia |
|---------|-----------|-----------|
| Total clicks | Trending up | Weekly |
| Total impressions | Trending up | Weekly |
| Average CTR | > 3% (branded), > 1% (non-branded) | Weekly |
| Average position | Improving for target keywords | Weekly |
| Index coverage | No unexpected drops | Weekly |
| Core Web Vitals | All green | Monthly |
| Mobile usability | Zero issues | Monthly |
| Security issues | Zero | Continuous |
| Manual actions | Zero | Continuous |

### 4. Alert Configuration
| Alert | Trigger | Action |
|-------|---------|--------|
| Index coverage drop | > 10% pages dropped | Investigate immediately |
| CWV issues | New issues detected | Schedule fix |
| Security issues | Any detected | Fix immediately |
| Manual action | Any received | Escalate, fix, request review |
| 404 spike | > 50 new 404s | Investigate, redirect |

## Saida
- Search Console configured
- Sitemap submitted
- Monitoring dashboard setup
- Alert configuration
- Access permissions documented

## Validacao
- [ ] Domain property verificada
- [ ] Sitemap submitted e processado
- [ ] GA4 linkado
- [ ] Team access configurado
- [ ] Index coverage limpo
- [ ] CWV report verificado
- [ ] Monitoring cadence definida
