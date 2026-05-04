---
task: design-youtube-ad-campaign
responsavel: "@pm-youtube-ads-specialist"
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

# Task: Design YouTube Ad Campaign

## Metadata
- **Squad:** squad-paidmedia
- **Agent:** Tube (pm-youtube-ads-specialist)
- **Complexity:** Complex

## Objetivo
Projetar campanha completa de YouTube Ads — da estrategia criativa ao setup tecnico. Definir formatos, audiencias, funil, budget e KPIs para campanha que gere resultados mensuraveis.

## Entrada
- Campaign objective (awareness, consideration, conversion)
- Target audience / ICP
- Budget (monthly)
- Offer / product details
- Existing video assets (if any)
- Landing page (if exists)
- Brand guidelines

## Passos

### 1. Campaign Strategy
```
OBJECTIVE: [Awareness / Consideration / Conversion]
BUDGET: R$ [monthly]
DURATION: [weeks/months]
PRIMARY KPI: [Views / CPV / CPA / ROAS]
SECONDARY KPIs: [list]
```

### 2. Funnel Architecture
| Funnel Stage | Format | Audience | Budget % | KPI |
|-------------|--------|----------|----------|-----|
| Awareness | Bumper (6s) + Non-Skip (15s) | Broad (affinity, topics) | 20-30% | CPM, Reach |
| Consideration | Skippable In-Stream | In-Market, Custom Intent | 40-50% | CPV, View Rate |
| Conversion | Skippable In-Stream + In-Feed | Remarketing, Custom | 30-40% | CPA, ROAS |

### 3. Audience Strategy
| Audience | Type | Size Est. | Stage | Priority |
|----------|------|----------|-------|----------|
| | Custom Intent | | | P0 |
| | In-Market | | | P0 |
| | Remarketing | | | P0 |
| | Affinity | | | P1 |
| | Similar | | | P1 |
| | Topic | | | P2 |

### 4. Creative Strategy (per format)
For each ad format:
```
FORMAT: [Skippable / Non-Skip / Bumper]
DURATION: [seconds]
HOOK (0-5s): [description]
BODY: [key message]
CTA: [action + visual]
COMPANION BANNER: [specs]
THUMBNAIL (In-Feed): [description]
VARIATIONS TO TEST: [A/B elements]
```

### 5. Budget Allocation
| Item | Budget | % |
|------|--------|---|
| Awareness campaigns | R$ | % |
| Consideration campaigns | R$ | % |
| Conversion campaigns | R$ | % |
| Creative testing | R$ | % |
| **TOTAL** | **R$** | **100%** |

### 6. Testing Plan
| Test | Variable | Variants | Budget | Duration | Success Metric |
|------|----------|----------|--------|----------|---------------|
| Hook test | First 5 seconds | 3 hooks | R$ | 7 days | View Rate |
| Audience test | Targeting | 3 audiences | R$ | 7 days | CPV |
| CTA test | End card | 2 CTAs | R$ | 7 days | CTR |

### 7. Measurement Framework
| Metric | Tool | Frequency | Target |
|--------|------|-----------|--------|
| View Rate | Google Ads | Daily | 15-30% |
| CPV | Google Ads | Daily | < R$0.10 |
| CTR | Google Ads | Daily | 0.5-2% |
| Conversions | Google Ads + GA4 | Daily | X/day |
| ROAS | Google Ads | Weekly | 3x+ |
| Brand Lift | Brand Lift Study | Post-campaign | Significant lift |

## Saida
- Campaign strategy document
- Funnel architecture with budget allocation
- Audience strategy with targeting specs
- Creative briefs per format (→ @copywriting-persuasion, @creative-animations)
- Testing plan
- Measurement framework
- Landing page requirements (→ @digital-experience)

## Validacao
- [ ] Full-funnel approach (awareness + consideration + conversion)
- [ ] Budget allocated with rationale
- [ ] Minimum 3 audience segments defined
- [ ] Creative briefs specify 5-second hook
- [ ] Testing plan with isolated variables
- [ ] KPIs defined with benchmarks
