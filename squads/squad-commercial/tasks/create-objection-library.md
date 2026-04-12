---
task: create-objection-library
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

# Task: Create Objection Library

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Standard

## Objetivo
Criar biblioteca de objeções — catálogo estruturado das objeções mais comuns com respostas baseadas em frameworks comprovados (Sandler, Reframe, Feel-Felt-Found) para equipar a equipe comercial.

## Entrada
- Win/loss analysis data (from Vault)
- Sales team interviews
- Recorded calls analysis
- Competitive intelligence (from Mint)
- Pricing and packaging data

## Passos

### 1. Objection Classification Framework
| Category | Description | Frequency | Difficulty |
|----------|-----------|-----------|-----------|
| Price / Budget | "Too expensive", "No budget" | Very High | Medium |
| Timing | "Not now", "Next quarter" | High | Medium |
| Authority | "Need to check with...", "Not my decision" | High | Low |
| Need | "We don't need this", "Not a priority" | Medium | High |
| Trust | "Never heard of you", "Too small/new" | Medium | High |
| Competition | "Working with X already", "Evaluating others" | High | Medium |
| Status Quo | "Current setup works fine" | High | High |
| Scope | "Can't you just do X part?" | Medium | Medium |

### 2. Response Framework Toolkit
```
FRAMEWORK 1: ACKNOWLEDGE-REFRAME-BRIDGE (ARB)
  Acknowledge: "I understand that concern..."
  Reframe: "The way I see it..." (shift perspective)
  Bridge: "Which is exactly why..." (connect to value)

FRAMEWORK 2: FEEL-FELT-FOUND (FFF)
  Feel: "I understand how you feel..."
  Felt: "Others in your position have felt the same..."
  Found: "What they found was..."

FRAMEWORK 3: SANDLER REVERSING
  Respond to objection with a question:
  "That's interesting — when you say [objection],
  what specifically concerns you about that?"
  (Get to real objection behind the stated one)

FRAMEWORK 4: ISOLATE & ADDRESS
  "Is that the only concern, or is there something else?"
  → Isolate the objection
  → Address specifically
  → Confirm resolution: "If we could solve that, would we be able to move forward?"

FRAMEWORK 5: CHALLENGER REFRAME
  "Before I respond, let me share something that might
  change how you think about this..."
  → Teach an insight that reframes the objection
  → Use data to challenge assumption
  → Connect to their specific business impact
```

### 3. Core Objection Library (Top 15)

#### PRICE OBJECTIONS

**Objection 1: "It's too expensive"**
| Element | Detail |
|---------|--------|
| Real meaning | Price-to-value gap perceived |
| Best framework | Challenger Reframe + Sandler |
| Response | "I appreciate that perspective. Before we discuss price, can I ask — what are you comparing this to? [Listen] The reason I ask is that most clients who initially see our pricing as high discover that the real cost equation is different. One client was spending R$X less with a competitor but needed R$Y in internal resources to compensate — net cost was actually higher. When you factor in [specific outcomes from discovery], the investment typically returns 3-5x within the first year. What would a 3x return mean for your targets?" |
| Proof point | Case study with ROI data |
| If still stuck | Explore scope adjustment, phased approach |

**Objection 2: "We don't have budget"**
| Element | Detail |
|---------|--------|
| Real meaning | Either truly no budget OR not prioritized |
| Best framework | Sandler Reversing |
| Response | "I appreciate you being upfront. Help me understand — is it that there's genuinely no budget allocated, or that this hasn't been prioritized yet relative to other investments? [Listen] Because what we've found is that when the business case is strong enough, budget tends to appear. The question is whether the cost of NOT doing this exceeds the investment. In our discovery you mentioned [pain/cost identified] — that's costing you roughly R$X per [period]. How does the team typically handle investment decisions when the ROI is clear?" |
| Proof point | Example of client who found budget after seeing ROI case |
| If still stuck | Offer phased start, align with budget cycle |

**Objection 3: "Competitor X is cheaper"**
| Element | Detail |
|---------|--------|
| Real meaning | Seeking price justification or leverage |
| Best framework | ARB + Isolate |
| Response | "That's good context. Out of curiosity, are you comparing similar scope, or just the headline number? [Listen] What I've learned from clients who've compared us directly: the initial price is one factor, but the total cost includes rework, management overhead, and opportunity cost of slower results. [Client name] actually came to us after 8 months with [competitor type] — they'd spent R$X but didn't hit their targets. Within [timeframe] with us, they achieved [result]. If scope, quality, and outcomes were equal, would price be the only factor?" |
| Proof point | Win-back case study |
| If still stuck | Offer competitive comparison framework to evaluate fairly |

#### TIMING OBJECTIONS

**Objection 4: "Not the right time"**
| Element | Detail |
|---------|--------|
| Real meaning | Not feeling urgency, or genuinely overwhelmed |
| Best framework | Challenger Reframe |
| Response | "I respect that — timing matters. Can I share an observation? [Teach insight] The clients who get the best results typically start during periods just like yours — because [market/competitive reason makes waiting costly]. Every month of delay in [specific area from discovery] means approximately [calculated cost]. If we started in [current month], you'd see first results by [month+90 days], which positions you perfectly for [their next milestone]. What would need to be true for the timing to feel right?" |
| Proof point | Seasonality/market data showing cost of delay |
| If still stuck | Agree on future date, set calendar hold, start with planning phase |

**Objection 5: "We just signed with another agency"**
| Element | Detail |
|---------|--------|
| Real meaning | Committed, but testing market |
| Best framework | FFF + Long game |
| Response | "Totally understandable. How's that going so far? [Listen genuinely] I've found that clients who are already working with a partner often benefit from an outside perspective — not to replace, but to complement or benchmark. Would it be valuable to stay connected? I could share [relevant insight/report] that might help you evaluate what great looks like in [area]. And if things ever change, you'll know where to find us." |
| Proof point | Free value-add content |
| If still stuck | Enter nurture sequence, check back in 90 days |

#### AUTHORITY OBJECTIONS

**Objection 6: "I need to check with my boss/team"**
| Element | Detail |
|---------|--------|
| Real meaning | May not be decision maker, or needs ammunition |
| Best framework | Sandler (qualify champion) |
| Response | "Absolutely — important decisions deserve input. A couple of questions: Who else is involved in this decision? [Map stakeholders] What criteria will they use to evaluate? [Capture decision criteria] Would it be helpful if I prepared a one-page summary that addresses the questions they're likely to ask? And honestly — between us — how do YOU feel about this? If it were solely your call, what would you do?" |
| Proof point | One-page executive summary template |
| If still stuck | Offer to join the conversation, provide Champion Toolkit |

#### NEED / STATUS QUO OBJECTIONS

**Objection 7: "We're doing fine without this"**
| Element | Detail |
|---------|--------|
| Real meaning | Status quo bias — comfortable with current results |
| Best framework | Challenger + Gap Selling |
| Response | "Glad to hear things are going well. Genuinely. The question I'd pose is: are you performing at 'fine' or at 'full potential'? [Teach insight] We recently worked with a company similar to yours — they were also doing fine. Revenue was growing 15% YoY. After our engagement, they grew 40% YoY because they discovered [specific gap]. They didn't know what they didn't know. Would it be valuable to at least understand if there's a gap between where you are and where you could be — no strings attached?" |
| Proof point | Benchmark data, free audit offer |
| If still stuck | Offer complimentary gap analysis |

### 4. Objection Analytics
| Metric | Measurement | Target |
|--------|------------|--------|
| Most common objection (by category) | Call review tagging | Track monthly |
| Objection resolution rate | Objection raised → deal advanced | 60%+ |
| Objection-to-loss correlation | Unresolved objection → lost deal | Identify top 3 |
| Response effectiveness | A/B test responses | Improve quarterly |
| New objection identification | Unlisted objections surfaced | Add monthly |

### 5. Living Library Protocol
| Activity | Frequency | Owner |
|---------|----------|-------|
| Review win/loss for new objections | Monthly | Edge |
| Update response effectiveness data | Monthly | Edge + Vault |
| Add new objections from call reviews | Ongoing | Edge |
| Retire outdated objections | Quarterly | Edge |
| Train team on new responses | Monthly (clinic) | Edge |

## Saida
- Objection library document (15+ objections)
- Response framework toolkit
- Analytics tracking setup
- Living library update protocol

## Validacao
- [ ] Top objections from each category covered
- [ ] Multiple response frameworks provided per objection
- [ ] Proof points and case studies referenced
- [ ] Analytics tracking defined
- [ ] Library update process documented
