---
task: "data-storytelling-presentation"
responsavel: "nancy-duarte"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Data set or key findings to present"
  - "Audience and decision context"
Saida:
  - "Data presentation transformed into compelling narrative with Sparkline"
Checklist:
  - "[ ] Data organized into narrative arc, not just charts"
  - "[ ] Human stories attached to key data points"
  - "[ ] Sparkline contrast applied (What the data shows vs What it means)"
---

# Task: Data Storytelling Presentation

**Task ID:** NARR-031
**Version:** 1.0.0
**Command:** `*data-storytelling-presentation`
**Agent:** Nancy Duarte (nancy-duarte)
**Purpose:** Transform data and findings into compelling narrative presentations using Duarte's methodology, making numbers feel human and driving decisions.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `data_findings` | Key data points, trends, insights | YES |
| `audience` | Who will see this and what decisions they face | YES |
| `context` | Board meeting, team review, client report, conference | YES |
| `recommendation` | What action the data supports | YES |
| `raw_data` | Underlying dataset or report | PREFERRED |
| `duration` | Presentation time | NO (default: 15 min) |

## Execution Phases

### Phase 1: Find the Story in the Data

1. Identify the single most important finding — the "headline" of the data
2. Determine: Is this a story of change, comparison, correlation, or composition?
3. Find the tension — what is surprising, counterintuitive, or concerning in the data?
4. Identify the "so what?" — why should the audience care about this specific finding?
5. Look for the human impact — who is affected by these numbers?
6. Define the narrative question the data answers: "We wanted to know X. Here's what we found."

### Phase 2: Design the Data Sparkline

1. **What Is (the numbers)** — Present the raw finding, the current state in data
2. **What Could Be (the meaning)** — Interpret what this means for the audience
3. Alternate between data slides and meaning slides:
   - Data: "Revenue grew 40% in Q3"
   - Meaning: "This means we can fund the expansion we've been discussing"
4. Build from specific data points to broader implications
5. End each data section with: "And this matters because..."
6. Design the "data STAR moment" — the single visualization that changes everything

### Phase 3: Humanize the Data

1. For every major data point, find or create a human story:
   - "These 10,000 new users? Here's Maria's story — she represents why they came"
2. Use the "zoom in, zoom out" technique:
   - Zoom in: One person's story (emotional connection)
   - Zoom out: The data that shows this is not an exception, but a pattern
3. Replace abstract numbers with concrete comparisons:
   - Not "500TB of data" but "enough data to fill every book ever written, twice"
4. Use "before the data" and "after the data" framing for longitudinal findings
5. Design callout quotes from real people affected by the data (if available)

### Phase 4: Structure the Presentation

1. **Opening** — Start with the human story or the surprising finding, NOT the methodology
2. **Context** — Brief background (why we looked, how we measured) — keep under 10%
3. **Finding 1** — Most important insight, paired with human story and data visualization
4. **Finding 2-3** — Supporting insights that build the narrative
5. **The Turn** — The moment where all findings converge into a clear conclusion
6. **Recommendation** — What the data tells us to DO, framed as "What Could Be"
7. **Close** — Return to the human story from the opening, now with the data's weight behind it

### Phase 5: Design Data Visualizations

1. Choose chart types that tell the story, not just display the data:
   - Trends → Line chart with annotated turning points
   - Comparisons → Bar chart with clear "winner" highlighted
   - Composition → Stacked or treemap with the story element called out
   - Correlation → Scatter with the insight circled
2. Apply Duarte's "Slidedocs" principle — each chart must be self-explanatory
3. Use progressive disclosure — reveal data in stages, not all at once
4. Design the "data STAR" — one visualization that captures the entire story
5. Color-code What Is (muted) vs What Could Be (bold)

## Output Format

```yaml
data_storytelling:
  headline_finding: "{the one thing the data says}"
  narrative_question: "{what we wanted to know}"
  audience: "{who and what decisions they face}"
  recommendation: "{what to do based on the data}"
  sparkline:
    - type: "What Is (data)"
      content: "{finding}"
      visualization: "{chart type}"
    - type: "What Could Be (meaning)"
      content: "{interpretation}"
      human_story: "{connected story}"
  presentation_structure:
    opening: "{human story or surprising finding}"
    context: "{brief methodology}"
    findings:
      - finding: "{insight}"
        data_point: "{number}"
        human_connection: "{story}"
        visualization: "{chart type and design}"
        so_what: "{why it matters}"
    the_turn: "{convergence moment}"
    recommendation: "{action to take}"
    closing: "{return to opening story}"
  data_star_moment:
    visualization: "{the one chart that changes everything}"
    insight: "{what it reveals}"
    placement: "{when in the presentation}"
```

## Veto Conditions

- **NEVER** lead with methodology — the audience cares about findings, not how you measured
- **NEVER** present data without meaning — every number must answer "so what?"
- **NEVER** use charts that require explanation — if you have to explain the chart, redesign it
- **NEVER** end with data — end with the human impact and the call to action
- **NEVER** present all findings as equal — the narrative requires hierarchy and emphasis

## Completion Criteria

- [ ] Single headline finding identified and positioned as narrative core
- [ ] Data organized into Sparkline (What Is data / What Could Be meaning)
- [ ] Human stories attached to major data points
- [ ] Visualization types chosen for narrative impact, not just data display
- [ ] Data STAR moment designed for peak memorability
- [ ] Presentation closes with action and human impact
