---
task: configure-cross-domain-tracking
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

# Task: Configure Cross-Domain Tracking

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Configurar cross-domain tracking — garantir continuidade de sessao e atribuicao entre dominios (ex: site principal, checkout, blog, app).

## Entrada
- List of domains to track
- GA4 property configuration
- GTM container
- User flow between domains

## Passos

### 1. Domain Inventory
| Dominio | Tipo | Papel | GA4 Stream |
|---------|------|-------|-----------|
| www.example.com | Principal | Landing, content | Web stream 1 |
| app.example.com | Aplicacao | Product, dashboard | Web stream 2 |
| blog.example.com | Conteudo | Blog, SEO content | Web stream 1 |
| checkout.example.com | Checkout | Payment flow | Web stream 1 |
| docs.example.com | Documentacao | Help, docs | Web stream 2 |

### 2. GA4 Cross-Domain Configuration
| Configuracao | Valor |
|-------------|-------|
| Property | Single property for all domains |
| Data streams | One or more (same property) |
| Cross-domain config | Admin → Data Streams → Configure tag settings |
| Domains list | Add all domains that should share sessions |
| Linker parameter | `_gl` parameter auto-appended to cross-domain links |

### 3. GTM Cross-Domain Setup
```javascript
// GA4 Configuration Tag
// Fields to set:
{
  "linker": {
    "domains": [
      "example.com",
      "app.example.com",
      "blog.example.com",
      "checkout.example.com"
    ],
    "accept_incoming": true,
    "decorate_forms": true
  }
}
```

### 4. Verification Steps
| Step | Como Verificar | Esperado |
|------|---------------|----------|
| 1. Link decoration | Click cross-domain link | URL has `_gl` parameter |
| 2. Session continuity | Check GA4 DebugView | Same session ID across domains |
| 3. No self-referral | Check GA4 referral report | Own domains not as referral |
| 4. Form decoration | Submit cross-domain form | Form action has `_gl` parameter |
| 5. Attribution intact | Check campaign reports | UTM params preserved |

### 5. Referral Exclusion
| Dominio | Excluir de Referral |
|---------|-------------------|
| example.com | Sim |
| app.example.com | Sim |
| checkout.example.com | Sim |
| payment-provider.com | Sim (if redirects back) |
| google.com | Nao (organic traffic) |

### 6. Troubleshooting
| Problema | Causa | Fix |
|----------|-------|-----|
| Self-referral | Domain not in exclusion list | Add to referral exclusion |
| Broken sessions | `_gl` parameter stripped | Check redirects, WAF rules |
| Duplicate pageviews | Multiple GTM containers | Single container or dedup |
| Missing `_gl` | JavaScript links (SPA) | Use GTM linker with `decorate_forms` |
| Consent mismatch | Different consent state per domain | Sync consent cross-domain |

## Saida
- Cross-domain configuration document
- GA4 and GTM settings
- Verification results
- Referral exclusion list
- Troubleshooting guide

## Validacao
- [ ] Todos os dominios configurados no GA4
- [ ] GTM linker funcional
- [ ] `_gl` parameter presente em links cross-domain
- [ ] Sessoes continuas entre dominios
- [ ] Zero self-referral
- [ ] Forms decorados corretamente
- [ ] Consent sincronizado entre dominios
