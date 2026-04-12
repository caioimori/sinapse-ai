---
task: map-full-funnel
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

# Task: Map Full Funnel

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Advanced

## Objetivo
Mapear funil comercial completo — de primeiro touchpoint ate advocacy, incluindo todos os estagios, touchpoints, content triggers, conversion points e metricas por stage. Bow Tie Funnel: o lado direito vale tanto quanto o esquerdo.

## Entrada
- Business model and revenue streams
- Current customer journey data
- Content inventory
- Channel mix
- CRM pipeline stages (from Vault)

## Passos

### 1. Bow Tie Funnel Mapping
```
LEFT SIDE (Acquisition)                    RIGHT SIDE (Retention)
═══════════════════════════════════════════════════════════════════

Awareness → Interest → Consideration → Decision → ✨ CUSTOMER ✨ → Onboarding → Adoption → Renewal → Expansion → Advocacy

TOFU            MOFU              BOFU         POST-SALE STAGES
───────────     ────────────      ──────       ──────────────────
Blog            Webinars          Demo         Kickoff
Social          Case Studies      Proposal     Training
SEO             Email Nurture     Trial        QBR
Ads             Whitepapers       ROI Calc     Health Check
Events          Comparisons       References   Upsell Pitch
PR              Free Tools        Contract     Referral Ask
```

### 2. Stage-by-Stage Blueprint
| Stage | Goal | Touchpoints | Content | CTA | Metric |
|-------|------|------------|---------|-----|--------|
| Awareness | Brand recognition | Blog, social, ads, PR | Educational | Visit site | Reach, impressions |
| Interest | Engagement | Content downloads, webinars | Thought leadership | Subscribe / download | Visitors, time on site |
| Consideration | Trust building | Case studies, demos, comparison | Proof-oriented | Book demo / contact | MQLs, engagement rate |
| Decision | Conversion | Proposal, trial, reference calls | Decision support | Sign contract | SQLs, proposals, win rate |
| Onboarding | Activation | Kickoff, training, setup | Implementation | Complete milestones | TTV, activation rate |
| Adoption | Value realization | QBR, health check, usage tips | Success-oriented | Expand usage | Health score, NPS |
| Renewal | Retention | Renewal conversation, value recap | ROI reports | Renew contract | GRR, renewal rate |
| Expansion | Growth | Upsell pitch, cross-sell intro | Upgrade-oriented | Add services | NRR, expansion rate |
| Advocacy | Amplification | Referral ask, testimonial request | Social proof | Refer / review | Referrals, reviews |

### 3. Conversion Points & Micro-Conversions
| Macro Conversion | Micro Conversions Leading To It |
|-----------------|-------------------------------|
| MQL | Newsletter signup → Content download → Webinar registration → Return visit |
| SQL | Demo request → Discovery call completed → Needs assessment |
| Closed Won | Proposal reviewed → Reference call → Contract negotiation → Signed |
| Expansion | Feature adoption → Value milestone → QBR conversation → Expansion proposal |

### 4. Funnel Metrics Framework
| Stage | Primary Metric | Secondary Metrics | Conversion Target |
|-------|---------------|-------------------|-------------------|
| Awareness → Interest | Visit → Engaged | Time on site, pages/session | 30-40% |
| Interest → Consideration | Engaged → MQL | Downloads, form fills | 5-10% |
| Consideration → Decision | MQL → SQL | Demo bookings, discovery calls | 13-15% |
| Decision → Close | SQL → Won | Proposals sent, win rate | 20-30% |
| Onboarding → Adoption | TTV | Milestone completion | 85%+ in 30d |
| Adoption → Renewal | Health Score | NPS, feature usage | 90%+ |
| Renewal → Expansion | Expansion Rate | Upsell conversations | 25-35% |

## Saida
- Complete Bow Tie funnel map with all stages
- Stage-by-stage blueprint with touchpoints and content
- Conversion points and metrics framework
- Funnel visualization document

## Validacao
- [ ] Both sides of bow tie mapped (acquisition + retention)
- [ ] Every stage has clear touchpoints and content
- [ ] Conversion targets set per stage
- [ ] Metrics measurable with current tools
