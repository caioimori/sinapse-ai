---
task: build-assumption-test
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

# Build Assumption Test

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours (design) + variable (execution)
- **Produces:** Assumption map, test cards, experiment results, learning cards

## Purpose
Mapear e testar suposicoes criticas antes de investir em desenvolvimento. Baseado em Teresa Torres Assumption Mapping e Strategyzer Test Cards.

## Steps

### Step 1: Extract Assumptions from Opportunity
**For each opportunity/solution being considered, list ALL assumptions:**

**Desirability Assumptions (do users want this?):**
- Users have problem X (problem existence)
- Problem X is painful enough to motivate action (severity)
- Users currently solve X by doing Y (current behavior)
- Users would switch from Y to our solution (switching intent)
- Target segment Z is the right audience (segment fit)

**Viability Assumptions (does the business benefit?):**
- Users will pay $N for this (willingness to pay)
- This will improve metric M by X% (metric impact)
- Unit economics work at scale (profitability)
- This aligns with our strategic direction (strategic fit)

**Feasibility Assumptions (can we build this?):**
- Technology T can do this (technical capability)
- We can build in N weeks (timeline)
- No regulatory blockers (compliance)
- Data D is available and accurate (data availability)

**Usability Assumptions (can users use this?):**
- Users understand the concept (comprehension)
- Users can complete the task in N steps (task completion)
- Users can discover the feature (discoverability)

### Step 2: Map Assumptions on Risk Matrix
**Axes:** X = Evidence Level (none → strong), Y = Impact if Wrong (low → high)

```
HIGH IMPACT   │ TEST FIRST    │ MONITOR
if wrong      │ (Leap of Faith)│ (Validate later)
              │               │
              ├───────────────┼──────────────────
              │ REVISIT       │ SAFE TO ASSUME
LOW IMPACT    │ (Low priority) │ (Skip testing)
if wrong      │               │
              └───────────────┴──────────────────
              NO EVIDENCE      STRONG EVIDENCE
```

**Priority Order:** Top-left quadrant first (high impact + no evidence = Leap of Faith assumptions).

### Step 3: Design Tests (Strategyzer Test Card)
**Per Assumption:**
```
TEST CARD
─────────────────────────────────────
Assumption: [specific, falsifiable statement]
Test Method: [how we will test]
Metric: [what we will measure]
Success Criteria: [threshold for validated]
Failure Criteria: [threshold for invalidated]
Duration: [time to run test]
Cost: [effort/resources needed]
Confidence Needed: [HIGH/MEDIUM for decision]
```

**Test Methods by Evidence Strength:**
| Method | Speed | Cost | Evidence Strength |
|--------|-------|------|-------------------|
| Desk research | Hours | Free | Low |
| Expert opinion | Hours | Free | Low-Medium |
| Survey (50+) | Days | Low | Medium |
| Landing page test | Days | Low | Medium |
| Wizard of Oz | Days | Medium | Medium-High |
| Concierge test | Weeks | Medium | High |
| Prototype test (5-8) | Days | Medium | High |
| A/B experiment | Weeks | High | Very High |
| MVP launch | Weeks | High | Very High |

**Selection Rule:** Use the cheapest, fastest test that provides sufficient evidence for the decision at hand. Do NOT over-test.

### Step 4: Run Tests & Collect Data
**During Test:**
- [ ] Document all observations (not just metrics)
- [ ] Note unexpected behaviors or insights
- [ ] Track participant/sample metadata
- [ ] Do NOT change test parameters mid-flight

### Step 5: Create Learning Card (Strategyzer)
**Per Test:**
```
LEARNING CARD
─────────────────────────────────────
Assumption Tested: [from test card]
Test Conducted: [method used]
Data Collected: [raw results]
Observation: [what we saw]
Insight: [what this means]
Decision: VALIDATED | INVALIDATED | INCONCLUSIVE
Confidence: HIGH | MEDIUM | LOW
Next Action: [proceed | pivot | test more | park]
```

### Step 6: Update Assumption Map & Decide
**After all priority tests complete:**
1. Update assumption positions on risk matrix
2. Calculate overall opportunity confidence
3. Make decision:

| Scenario | Decision | Next Step |
|----------|----------|-----------|
| All critical assumptions validated | GO | Move to solution design |
| 1+ critical assumption invalidated | PIVOT | Explore alternative solutions |
| Key assumptions inconclusive | TEST MORE | Design better experiment |
| Viability invalidated | KILL | Document learning, move on |

## Output Artifacts
- `assumption-map-[opportunity].md` | `test-cards/[assumption-id].md` | `learning-cards/[assumption-id].md` | `assumption-test-summary.md`

## Quality Criteria
- All 4 assumption types covered | Risk matrix populated | Test criteria defined BEFORE running | Learning cards completed regardless of outcome | Decision documented with evidence trail
