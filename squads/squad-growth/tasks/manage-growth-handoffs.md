---
task: manage-growth-handoffs
responsavel: "@growth-orqx"
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

# Task: Manage Growth Handoffs

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Standard

## Objetivo
Gerenciar handoffs cross-squad — garantir que dados de analytics, insights de CRO e metricas de growth fluam corretamente entre squads.

## Entrada
- Cross-squad handoff specifications
- Deliverables from other squads
- Growth pipeline outputs

## Passos

### 1. Inbound Handoffs
| De | Recebe | Formato | Uso |
|----|--------|---------|-----|
| squad-design | Paginas implementadas, performance data | URLs + metrics | Tracking setup |
| squad-content | Content assets, editorial calendar | Content plan | Content SEO |
| squad-brand | Brand guidelines | Brand doc | Campaign creatives |
| squad-copy | LP copy, CTAs, emails | Copy docs | CRO, campaigns |

### 2. Outbound Handoffs
| Para | Envia | Formato | Trigger |
|------|-------|---------|---------|
| squad-design | Tracking specs, heatmap insights | Spec doc | Pre-implementation |
| squad-content | Content performance, SEO keywords | Report | Monthly |
| squad-copy | CRO insights, winning variants | Results doc | Post-experiment |
| squad-commercial | Lead scoring, conversion data | Data feed | Continuous |
| squad-product | Product analytics, feature adoption | Dashboard | Weekly |

### 3. Handoff Quality Criteria
| Criterio | Standard |
|----------|---------|
| Completeness | All required fields present |
| Accuracy | Data verified, no conflicts |
| Timeliness | Within agreed SLA |
| Format | Standard template used |
| Acknowledgment | Receiving squad confirms receipt |

## Saida
- Handoff tracker (inbound + outbound)
- Delivery confirmation log
- Quality verification results

## Validacao
- [ ] Todos os handoffs inbound recebidos e verificados
- [ ] Handoffs outbound entregues no prazo
- [ ] Qualidade dos dados verificada
- [ ] Squads receptores confirmaram recebimento
