---
task: map-opportunity-solution-tree
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

# Map Opportunity Solution Tree

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours (initial) + weekly maintenance
- **Produces:** Opportunity Solution Tree, prioritized opportunities, experiment backlog

## Purpose
Criar e manter Opportunity Solution Tree (Teresa Torres) como ferramenta central de discovery. Conecta outcome desejado a oportunidades reais de usuarios e solucoes testadas.

## Steps

### Step 1: Define Desired Outcome (Root)
**The outcome must be:**
- [ ] A business metric the team can influence
- [ ] Specific and measurable
- [ ] Time-bound
- [ ] Connected to company OKR or product strategy

**Format:** "[Metric] from [current] to [target] by [date]"

**Examples:**
- "Increase 30-day retention from 35% to 50% by Q4"
- "Reduce time-to-first-value from 7 days to 2 days by Q3"
- "Increase conversion from trial to paid from 5% to 12% by Q2"

### Step 2: Map Opportunities (Level 1 & 2)
**Sources for Opportunities:**
- User interviews (pain points, unmet needs)
- Analytics (drop-off points, low-adoption features)
- Support data (recurring complaints, feature requests)
- Journey maps (friction points, moments of truth)

**Opportunity Framing Rules (Teresa Torres):**
- Write as user needs or pain points, NOT solutions
- BAD: "Add search feature" (solution, not opportunity)
- GOOD: "Users cannot find relevant content quickly" (opportunity)
- Each opportunity should emerge from real user evidence

**Tree Structure:**
```
OUTCOME: [metric target]
├── Opportunity 1: [user need/pain point]
│   ├── Opportunity 1.1: [more specific aspect]
│   └── Opportunity 1.2: [more specific aspect]
├── Opportunity 2: [user need/pain point]
│   ├── Opportunity 2.1: [more specific aspect]
│   └── Opportunity 2.2: [more specific aspect]
└── Opportunity 3: [user need/pain point]
    ├── Opportunity 3.1: [more specific aspect]
    └── Opportunity 3.2: [more specific aspect]
```

### Step 3: Prioritize Opportunities
**Assessment per Opportunity:**
| Opportunity | Evidence Strength | Market Size | Strategic Fit | Urgency | Score |
|-------------|------------------|-------------|--------------|---------|-------|
| [opp 1] | [1-5] | [1-5] | [1-5] | [1-5] | [avg] |

**Evidence Strength Scale:**
- 5: Multiple data sources, strong triangulation
- 4: Clear pattern from interviews + some analytics
- 3: Emerging pattern from interviews only
- 2: Single data point or assumption
- 1: Pure hypothesis, no evidence

**Selection Rule:** Focus on TOP 3 opportunities at a time. Do not spread team thin across too many opportunities.

### Step 4: Generate Solutions (per Priority Opportunity)
**Per Opportunity, brainstorm 3+ solutions:**
```
Opportunity: [user need/pain point]
├── Solution A: [approach 1]
│   Effort: [T-shirt] | Impact estimate: [High/Med/Low] | Risk: [High/Med/Low]
├── Solution B: [approach 2]
│   Effort: [T-shirt] | Impact estimate: [High/Med/Low] | Risk: [High/Med/Low]
└── Solution C: [approach 3]
    Effort: [T-shirt] | Impact estimate: [High/Med/Low] | Risk: [High/Med/Low]
```

**Rules:**
- Always generate multiple solutions (avoid first-idea bias)
- Include at least one "simple/cheap" option
- Solutions should be specific enough to test

### Step 5: Design Experiments (per Solution)
**Experiment Ladder (cheapest first):**
1. Assumption test (survey, desk research)
2. Smoke test (fake door, landing page)
3. Wizard of Oz (manual backend, real frontend)
4. Concierge (do it manually for users)
5. Prototype test (clickable prototype)
6. Alpha/beta launch (limited rollout)
7. Full launch (measure in production)

**Per Experiment:**
```
Solution: [which solution this tests]
Assumption: [what we need to learn]
Method: [experiment type from ladder]
Success criteria: [specific threshold]
Duration: [days/weeks]
Cost: [effort needed]
```

### Step 6: Maintain the Tree (Weekly)
**Weekly OST Review (15 min):**
- [ ] Update with new interview insights
- [ ] Add new opportunities discovered
- [ ] Move experiments forward (results → decisions)
- [ ] Prune dead-end opportunities (invalidated)
- [ ] Ensure top 3 opportunities have active experiments
- [ ] Check: Are we making progress toward the outcome?

**Health Check:**
| Indicator | Healthy | Unhealthy |
|-----------|---------|-----------|
| Active opportunities | 2-4 in focus | 0 or >6 |
| Solutions per opportunity | 2-4 options | 1 (no exploration) |
| Experiments running | 1-3 active | 0 (stalled) |
| Tree freshness | Updated weekly | Stale >2 weeks |
| Evidence per opportunity | 2+ sources | Assumptions only |

## Output Artifacts
- `opportunity-solution-tree.md` | `opportunity-priority-matrix.md` | `experiment-backlog.md` | `ost-weekly-log.md`

## Quality Criteria
- Outcome measurable and time-bound | Opportunities based on evidence, not assumptions | Min 3 solutions per priority opportunity | Experiments start from cheapest | Weekly maintenance active | Top 3 opportunities always have active work
