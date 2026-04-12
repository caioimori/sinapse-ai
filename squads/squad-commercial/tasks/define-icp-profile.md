---
task: define-icp-profile
responsavel: "@cs-funnel-architect"
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

# Task: Define ICP Profile

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Standard

## Objetivo
Definir Ideal Customer Profile (ICP) — perfil detalhado do cliente ideal baseado em dados de melhores clientes atuais, incluindo firmografico, tecnografico, comportamental e sinais de intent.

## Entrada
- Best customer data (highest LTV, fastest close, lowest churn)
- CRM data and analytics
- Sales team insights
- Market research (from @research-intelligence)

## Passos

### 1. ICP Framework (3 Layers)
| Layer | Dimensions | Data Source |
|-------|-----------|------------|
| **Firmographic** | Industry, size, revenue, location, growth stage | CRM + enrichment |
| **Technographic** | Tech stack, platforms, tools used | Enrichment APIs |
| **Behavioral** | Content consumed, events attended, engagement patterns | Analytics + CRM |

### 2. Firmographic Profile
| Dimension | Ideal Range | Disqualifiers |
|-----------|------------|--------------|
| Industry | | |
| Company Size (employees) | | |
| Annual Revenue | | |
| Growth Stage | Startup / Growth / Scale / Enterprise | |
| Location/Region | | |
| Business Model | B2B / B2C / D2C / Marketplace | |
| Funding (if applicable) | | |

### 3. Technographic Profile
| Dimension | Ideal Signals | Negative Signals |
|-----------|-------------|-----------------|
| Current solutions | | |
| Complementary tech | | |
| Platform ecosystem | | |
| Digital maturity | | |

### 4. Behavioral Signals
| Signal | Weight | Source |
|--------|--------|-------|
| Visited pricing page | High | Analytics |
| Downloaded BOFU content | High | CRM |
| Attended demo/webinar | High | Events |
| Multiple visits in short period | Medium | Analytics |
| Engaged with email nurture | Medium | CRM |
| Follows on social media | Low | Social |

### 5. ICP Scoring Model
```
ICP Score = (Firmographic × 0.4) + (Technographic × 0.2) + (Behavioral × 0.4)

Tiers:
  Tier 1 (90-100): Perfect fit — highest priority
  Tier 2 (70-89): Good fit — standard priority
  Tier 3 (50-69): Partial fit — nurture
  Tier 4 (<50): Poor fit — disqualify
```

### 6. Buyer Personas (within ICP)
| Persona | Title | Pain Points | Buying Motivation | Communication Style |
|---------|-------|------------|------------------|-------------------|
| Economic Buyer | C-Level, VP | | | |
| Champion | Director, Sr. Manager | | | |
| Technical Evaluator | Manager, Lead | | | |
| End User | Individual contributor | | | |

## Saida
- ICP document with all 3 layers
- ICP scoring model implemented in CRM
- Buyer personas defined
- Disqualification criteria documented

## Validacao
- [ ] ICP based on actual best customer data
- [ ] All 3 layers defined (firmographic, technographic, behavioral)
- [ ] Scoring model implemented in CRM
- [ ] At least 3 buyer personas documented
