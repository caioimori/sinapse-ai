---
task: build-demo-scripts
responsavel: "@cs-sales-enablement"
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

# Task: Build Demo Scripts

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Standard

## Objetivo
Criar scripts de demonstração — roteiros estruturados para apresentações comerciais que conectam capabilities da agência aos problemas específicos do prospect, usando storytelling e prova social.

## Entrada
- Discovery summary (from discovery framework)
- Service portfolio and positioning (from Mint)
- Case studies and social proof (from Bond)
- Win/loss patterns (from Vault)
- Presentation templates

## Passos

### 1. Presentation Philosophy
```
GOLDEN RULE: Never present a capability without first
connecting it to a PAIN the prospect confirmed.

Structure: SITUATION → INSIGHT → CAPABILITY → PROOF → VALUE

Anti-Patterns:
  ✗ Feature tour ("We also do X, Y, Z...")
  ✗ Generic deck ("Here's our company overview...")
  ✗ Monologue (>2 min without interaction)
  ✗ No proof points (claims without evidence)
  ✗ Ignoring discovery (presenting things they didn't ask about)

Best Practice:
  ✓ Start with THEIR problem (mirror discovery findings)
  ✓ Teach something new (Challenger: commercial insight)
  ✓ Show, don't tell (case studies, dashboards, examples)
  ✓ Make it interactive (questions every 5-7 min)
  ✓ Close with clear value proposition tied to their metrics
```

### 2. Presentation Structure Template
```
PRESENTATION SCRIPT — [Service Line / Use Case]
Duration: 45 min total

═══════════════════════════════════════════

ACT 1: "THE WORLD THEY RECOGNIZE" (10 min)
Purpose: Show you understand their world deeply

  Slide 1 — Opening (2 min)
  "Thanks for having us, [Name]. Last time we spoke, you shared
  three things that really stood out to me..."
  → Mirror their 3 key pains from discovery
  → Confirm: "Did I capture that correctly?"

  Slide 2-3 — Market Context (3 min)
  "You're not alone. Here's what we're seeing across [industry]..."
  → Industry trend or data point (Challenger: Teach)
  → Surprising insight that reframes the problem
  → "Most companies respond to this by [common approach] —
     but the ones winning are doing something different."

  Slide 4 — The Cost of Status Quo (5 min)
  "Based on what you shared, here's what we estimate
  [problem] is costing you..."
  → Gap Analysis summary (Current State → Impact)
  → Quantified: R$X per month / year
  → "If we do nothing for 12 months, this becomes R$Y."
  → Interactive: "Does this feel directionally right?"

ACT 2: "THE PATH FORWARD" (20 min)
Purpose: Show the solution through their lens

  Slide 5 — Our Approach (3 min)
  "Here's how we'd approach this for [Company Name]..."
  → NOT a generic methodology
  → Customized 3-5 step approach mapped to their specific problems
  → Visual: their journey from current to future state

  Slides 6-8 — Capability Deep Dives (12 min, 4 min each)
  For each capability:
    1. "You told us [pain] — here's how we solve it..."
    2. Brief explanation of approach (what, not how)
    3. Case study: "[Similar company] had [same problem]..."
    4. Result: "Within [timeline], they achieved [metric]."
    5. Interactive: "How does this compare to what you've seen?"

  Slide 9 — Integration & Handoffs (2 min)
  "Here's how all of this connects..."
  → Show how pieces work together
  → Address handoff and collaboration model
  → "Your team would interact with us like this..."

  Slide 10 — Team (3 min)
  "Here's who would actually do the work..."
  → Specific team members (not generic bios)
  → Relevant experience with similar challenges
  → "These are the same people who delivered [case study result]."

ACT 3: "THE COMMITMENT" (15 min)
Purpose: Align on value and next steps

  Slide 11 — Expected Outcomes (3 min)
  "Based on everything we've discussed, here's what
  success looks like..."
  → 3-5 measurable outcomes tied to their metrics from discovery
  → Timeline: "Month 1-3 you'd see X, Month 4-6 you'd see Y"
  → Conservative estimates (under-promise frame)

  Slide 12 — Investment Overview (5 min)
  "We'll send a detailed proposal, but directionally..."
  → Three options frame (reference Mint: Good/Better/Best)
  → Position middle option as recommended
  → ROI: "For every R$1 invested, clients typically see R$X return"
  → Interactive: "Which of these levels feels most aligned?"

  Slide 13 — Q&A and Next Steps (7 min)
  "What questions do you have?"
  → Address questions with framework responses
  → "Here's what I'd recommend as next steps..."
  → Specific: who, what, when
  → "Who else should be involved in the final decision?"
```

### 3. Service-Specific Demo Modules
| Service Line | Key Pain to Address | Must-Show Element | Case Study Type |
|-------------|-------------------|------------------|----------------|
| Brand Strategy | Brand inconsistency, market positioning | Before/After brand audit | Rebrand ROI |
| Content Marketing | Content not driving leads, SEO gaps | Content performance dashboard | Traffic/lead growth |
| Digital Advertising | ROAS declining, attribution unclear | Campaign analytics walkthrough | ROAS improvement |
| Social Media | Low engagement, no strategy | Social listening insights | Engagement lift |
| Website/Digital Experience | Low conversion, outdated UX | Interactive prototype or heatmap | Conversion improvement |
| Marketing Strategy | No integrated plan, channel silos | Full-funnel map customized | Revenue attribution |

### 4. Interactive Checkpoint Scripts
```
CHECKPOINT FREQUENCY: Every 5-7 minutes

MICRO-CHECKPOINTS:
  "Does that resonate with your experience?"
  "Am I on the right track?"
  "How does that compare to what you've tried?"
  "Anything I should elaborate on before we move on?"

DISCOVERY DEEPENING:
  "You mentioned [X] earlier — is [capability] aligned with how
  you were thinking about solving that?"
  "On a scale of 1-10, how important is [this specific area]
  relative to everything else?"

TEMPERATURE CHECKS:
  "We've covered [areas]. Before I continue, what's standing
  out to you so far?"
  "Is there anything I'm missing that's important to address?"

OBJECTION SURFACING:
  "What concerns come to mind as you think about this approach?"
  "What would make you hesitate about moving forward?"
  (Better to surface objections NOW than lose deal later)
```

### 5. Presentation Quality Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Talk/listen ratio | 60/40 or better | Call analytics tool |
| Questions asked during presentation | ≥ 8 | Self-report or recording |
| Discovery insights referenced | ≥ 3 specific callbacks | Script adherence |
| Case studies shown | ≥ 2 relevant | Deck customization |
| Clear next step secured | 100% | Pipeline progression |
| Proposal requested / offered | ≥ 70% of presentations | CRM tracking |

## Saida
- Presentation structure template (3-act framework)
- Service-specific demo modules
- Interactive checkpoint scripts
- Presentation quality scorecard

## Validacao
- [ ] Every presentation starts with prospect's problems, not our capabilities
- [ ] Challenger teaching moment included (Act 1)
- [ ] Case studies mapped per service line
- [ ] Interactive checkpoints scripted every 5-7 min
- [ ] Three-options investment frame referenced
