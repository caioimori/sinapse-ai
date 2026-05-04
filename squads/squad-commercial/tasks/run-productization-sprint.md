---
task: run-productization-sprint
responsavel: "@cs-offer-designer"
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

# Task: Run Productization Sprint

## Metadata
- **Squad:** squad-commercial
- **Agent:** Mint (cs-offer-designer)
- **Complexity:** Advanced

## Objetivo
Converter servico bespoke em oferta productizada — escopo fixo, preco fixo, processo padronizado, escalavel como um produto. "Productized service = SaaS-like predictability without building software."

## Entrada
- Bespoke service to productize
- Delivery team insights
- Client outcome data
- Market demand validation

## Passos

### 1. Productization Readiness Assessment
| Criteria | Score (1-5) | Notes |
|----------|-----------|-------|
| Repeatable delivery process | | Can we do this 10x without custom work? |
| Predictable outcomes | | Do clients get similar results? |
| Definable scope | | Can we draw a clear boundary? |
| Market demand | | Are 20+ companies willing to pay? |
| Gross margin at fixed price | | Can we achieve 60%+ margin? |
| Team capability | | Can junior team deliver with playbook? |

Score >= 24: Ready to productize
Score 18-23: Needs refinement
Score < 18: Not ready — keep bespoke

### 2. Productization Framework (Patrick McKenzie / Brennan Dunn)
```
Step 1: IDENTIFY — One specific problem for one specific audience
  Problem: ____________
  Audience: ____________
  Current solution: ____________

Step 2: SCOPE — Fixed deliverables, clear boundaries
  Included: ____________
  Excluded: ____________
  Duration: ____________

Step 3: PRICE — Fixed price (not hourly)
  Price: R$ ____________
  Justification: Value-based, not cost-based

Step 4: PROCESS — Standardized delivery playbook
  Phase 1: ____________ (Week 1)
  Phase 2: ____________ (Week 2-3)
  Phase 3: ____________ (Week 4)

Step 5: PAGE — Marketing page like a SaaS product
  Headline: ____________
  Benefit bullets: ____________
  Social proof: ____________
  CTA: ____________

Step 6: EXCEPTIONS — What happens with edge cases
  Edge case 1: ____________ → Handling: ____________
  Edge case 2: ____________ → Handling: ____________
```

### 3. Delivery Playbook Template
| Phase | Duration | Activities | Deliverables | Owner |
|-------|----------|-----------|-------------|-------|
| Discovery | Day 1-3 | Kickoff, data collection | Brief document | Sr. team |
| Execution | Day 4-15 | Core delivery | Draft deliverables | Mid team |
| Review | Day 16-18 | Client review, feedback | Revised deliverables | Sr. team |
| Delivery | Day 19-21 | Final packaging | Final deliverables | Team |

### 4. Unit Economics Validation
| Metric | Target | Projected |
|--------|--------|----------|
| Price | R$ | R$ |
| Delivery cost | R$ | R$ |
| Gross margin | 60%+ | % |
| Delivery time | X days | days |
| Team hours | X hours | hours |
| Effective rate | R$/hour | R$/hour |

### 5. Go-to-Market Checklist
- [ ] Landing page created (→ @digital-experience)
- [ ] Sales script for this offer (→ Edge)
- [ ] Case study from pilot (→ @content-intelligence)
- [ ] CRM pipeline configured (→ Vault)
- [ ] Nurture sequence for this ICP (→ Cascade)
- [ ] Pricing and proposal template (→ Mint)

## Saida
- Productized offer definition
- Delivery playbook
- Unit economics model
- Go-to-market plan

## Validacao
- [ ] Scope is fixed and clear
- [ ] Price is fixed (not hourly)
- [ ] Delivery playbook exists and is repeatable
- [ ] Gross margin >= 60%
- [ ] At least 1 pilot client completed
