---
task: map-current-state-journey
responsavel: "@ps-discovery-lead"
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

# Map Current-State Journey

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium-High
- **Estimated Time:** 4-6 hours
- **Produces:** Current-state journey map, pain point inventory, opportunity map

## Purpose
Mapear a jornada atual do usuario (as-is) para identificar pain points, momentos de friccao e oportunidades de melhoria. Baseado em dados reais de comportamento, nao em suposicoes.

## Steps

### Step 1: Define Journey Scope
**Boundary Definition:**
```
Persona: [which persona this journey maps]
Journey: [name — e.g., "First purchase", "Onboarding", "Report creation"]
Start Point: [trigger that initiates the journey]
End Point: [successful outcome or abandonment]
Channels: [web, mobile, email, support, etc.]
```

**Scope Rules:**
- Map ONE journey at a time (not the entire product)
- Focus on the most impactful journey first (highest traffic OR highest drop-off)
- Include pre-product and post-product touchpoints

### Step 2: Collect Journey Data
**Data Sources:**
| Source | What It Reveals | Collection Method |
|--------|----------------|-------------------|
| Analytics (funnels) | Where users drop off | Funnel analysis in analytics tool |
| Session recordings | How users actually behave | Hotjar/FullStory review (20+ sessions) |
| User interviews | Why they do what they do | Discovery interview excerpts |
| Support tickets | Where they get stuck | Ticket categorization by journey stage |
| NPS/CSAT by touchpoint | Satisfaction per stage | Survey data segmented by journey point |
| Heatmaps | Where attention goes | Click/scroll heatmap analysis |

**Minimum Data for Valid Journey Map:**
- [ ] Funnel analytics for the journey (quantitative flow)
- [ ] 5+ user interviews covering this journey
- [ ] 20+ session recordings reviewed
- [ ] Support ticket themes categorized

### Step 3: Map Journey Stages
**Per Stage:**
```
┌─────────────────────────────────────────────────────────────┐
│ STAGE: [name]                                               │
├─────────────────────────────────────────────────────────────┤
│ User Goal: What are they trying to accomplish?              │
│ Actions: What do they actually DO? (observed, not assumed)  │
│ Touchpoints: Where does this happen? (screen, email, etc.) │
│ Thoughts: What are they thinking? (from interviews)         │
│ Emotions: How do they feel? (😤😐😊) (from interviews)       │
│ Pain Points: What is hard, confusing, or frustrating?       │
│ Workarounds: How do they compensate for pain points?        │
│ Drop-off Rate: % who leave at this stage (from analytics)   │
│ Time Spent: Average duration at this stage                  │
│ Support Tickets: Volume related to this stage               │
└─────────────────────────────────────────────────────────────┘
```

### Step 4: Identify Moments of Truth
**Critical Moments:**
| Moment Type | Definition | Example |
|-------------|-----------|---------|
| **Aha Moment** | When user first realizes value | "Oh, this saves me 2 hours!" |
| **Friction Point** | Unnecessary difficulty | "Why do I need to fill this again?" |
| **Anxiety Point** | User feels uncertain/risky | "Will this delete my data?" |
| **Delight Moment** | Exceeds expectations | "It auto-filled everything!" |
| **Abandonment Trigger** | User leaves | "This is too complicated" |

### Step 5: Quantify Pain Points
**Pain Point Severity Score:**
| Pain Point | Frequency (% users affected) | Severity (1-5) | Impact on Conversion | Score |
|-----------|------------------------------|----------------|---------------------|-------|
| [pain 1] | [%] | [1-5] | [drop-off %] | Freq × Severity |
| [pain 2] | [%] | [1-5] | [drop-off %] | Freq × Severity |

**Priority:** Address highest-score pain points first.

### Step 6: Map Opportunities
**Per Pain Point, Identify Opportunity:**
```
Pain Point: [from journey map]
Stage: [which journey stage]
Severity Score: [from Step 5]
Opportunity: [how might we address this?]
Type: Remove friction | Add clarity | Automate | Redesign | Eliminate step
Estimated Impact: [conversion lift or time saved]
Effort: [T-shirt size: XS/S/M/L/XL]
```

### Step 7: Compile Journey Map Document
**Format:**
1. Journey overview (persona, scope, key metrics)
2. Stage-by-stage map (visual if possible, text if not)
3. Emotion curve (high points and low points across stages)
4. Pain point inventory (prioritized)
5. Opportunity map (prioritized by impact/effort)
6. Recommendations (top 3 quick wins + top 3 strategic improvements)

## Output Artifacts
- `journey-map-[persona]-[journey].md` | `pain-point-inventory.md` | `opportunity-map.md` | `journey-data-sources.md`

## Quality Criteria
- Based on real data (analytics + interviews + recordings) | All stages mapped with actions + emotions | Pain points quantified with severity scores | Opportunities connected to pain points | Min 20 session recordings reviewed | Drop-off rates included per stage
