---
task: "design-datastory"
responsavel: "nancy-duarte"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Data set or key metrics to communicate"
  - "Target audience and desired action"
Saida:
  - "DataStory narrative with visualization recommendations"
Checklist:
  - "[ ] Data Point of View (DataPOV) defined"
  - "[ ] Data humanized with story structure"
  - "[ ] Visualization recommendations for each data point"
---

# Task: Design DataStory

**Task ID:** NARR-012
**Version:** 1.0.0
**Command:** `*design-datastory`
**Agent:** Nancy Duarte (nancy-duarte)
**Purpose:** Transform data into compelling narrative using the DataStory framework.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `data_points` | Key metrics, statistics, findings | YES |
| `audience` | Who needs to understand this data | YES |
| `desired_action` | What should happen after seeing the data | YES |
| `context` | Business context for the data | PREFERRED |

## Execution Phases

### Phase 1: Define DataPOV

Craft the Data Point of View — the one-sentence narrative the data supports.

### Phase 2: Structure the DataStory

1. **Clarity** — Bring clarity through story structure (beginning/middle/end)
2. **Charts** — Choose right visualizations, annotate key insights
3. **Stick** — Humanize data, marvel at magnitude, storytell with data

### Phase 3: Narrative Arc for Data

1. Set context — why this data matters NOW
2. Reveal the insight — the "so what" moment
3. Show implications — what this means for the audience
4. Call to action — what to do with this knowledge

### Phase 4: Visualization Recommendations

For each data point: chart type, annotation strategy, emphasis technique.

## Veto Conditions

- **NEVER** present data without a narrative frame
- **NEVER** use complex charts when simple ones suffice
- **NEVER** let data exist without a "so what"
- **NEVER** present raw numbers without human context

## Completion Criteria

- [ ] DataPOV defined as one sentence
- [ ] Data structured with narrative arc
- [ ] Each data point has visualization recommendation
- [ ] Human context provided for key numbers
- [ ] Call to action connected to data insights
